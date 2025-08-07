import os
from dotenv import load_dotenv
import logging
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import httpx

# Local application imports
import backend.crud as crud
import backend.models as models
import backend.schemas as schemas
import backend.parser as parser
import backend.pdf_generator as pdf_generator
import backend.mailer as mailer
import backend.oauth as oauth
from backend.database import SessionLocal, engine, init_db
from backend.dependencies import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables and initialize the database
load_dotenv()
init_db()

app = FastAPI(
    title="Compliance Canary",
    description="Automated security and compliance scanning for modern development teams.",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the current authenticated user from a JWT
def get_current_active_user(token: str = Depends(crud.oauth2_scheme), db: Session = Depends(get_db)):
    return crud.get_current_user(token, db)

## --- API Routes ---

@app.get("/", tags=["Status"])
async def root():
    """Root endpoint to check API status."""
    return {"status": "ok", "message": "Welcome to Compliance Canary API", "timestamp": datetime.utcnow().isoformat()}

@app.get("/auth/github", tags=["Authentication"])
async def github_login(request: Request):
    """
    Initiates the GitHub OAuth2 login flow by redirecting the user to GitHub.
    """
    redirect_uri = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth-callback/github"
    logger.info(f"Redirecting to GitHub OAuth with new redirect URI: {redirect_uri}")
    return await oauth.oauth.github.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback", tags=["Authentication"])
async def github_callback(request: Request, db: Session = Depends(get_db)):
    """
    Backend API endpoint to handle the OAuth callback from the frontend,
    exchange the authorization code for an access token, and issue a JWT.
    """
    try:
        token_data = await oauth.oauth.github.authorize_access_token(request)
        access_token = token_data["access_token"]
        resp = await oauth.oauth.github.get("user", token=token_data)
        github_user_data = resp.json()
        
        user = crud.get_user_by_github_id(db, str(github_user_data["id"]))
        if not user:
            user = crud.create_user(db, github_data=github_user_data, access_token=access_token)
        else:
            user.access_token = access_token
            db.commit()
            db.refresh(user)

        jwt_token = oauth.create_access_token({"sub": str(user.id)})
        logger.info(f"User {user.id} authenticated successfully.")
        return {"access_token": jwt_token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")

@app.get("/api/user/repositories", response_model=List[schemas.Repo], tags=["User"])
async def get_user_repositories(current_user: models.User = Depends(get_current_active_user)):
    """
    Fetches the authenticated user's repositories directly from GitHub
    using their stored OAuth access token.
    """
    if not current_user.access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User does not have a valid GitHub access token.",
        )

    github_api_url = "https://api.github.com/user/repos?type=owner&sort=updated"
    headers = {
        "Authorization": f"token {current_user.access_token}",
        "Accept": "application/vnd.github.v3+json",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(github_api_url, headers=headers)
            response.raise_for_status()
            repos = response.json()
            return [{"id": r["id"], "name": r["name"], "private": r["private"], "clone_url": r["clone_url"], "active": True} for r in repos]
        except httpx.HTTPStatusError as e:
            logger.error(f"GitHub API error for user {current_user.id}: {e}")
            raise HTTPException(
                status_code=e.response.status_code,
                detail="Failed to fetch repositories from GitHub.",
            )

## --- Scheduled Background Job ---

def nightly_scan_and_report():
    """A background job to scan all active repositories nightly."""
    logger.info(f"Starting nightly scan at {datetime.utcnow()}")
    db = SessionLocal()
    try:
        active_repos = db.query(models.Repo).filter(models.Repo.active == True).all()
        for repo in active_repos:
            logger.info(f"Scanning repo: {repo.name}")
            findings = parser.scan_repository(repo.clone_url, repo.owner.access_token)
            pdf_path = pdf_generator.create_report_pdf(repo, findings)
            mailer.send_report_email(repo.owner.email, repo.name, pdf_path)
            crud.store_report(db, repo.id, findings, pdf_path)
            logger.info(f"Finished processing repo: {repo.name}")
    except Exception as e:
        logger.error(f"Nightly scan failed: {e}")
    finally:
        db.close()

# Initialize and start the scheduler only in a 'production' environment
scheduler = BackgroundScheduler()
if os.getenv("ENVIRONMENT") == "production":
    scheduler.add_job(nightly_scan_and_report, "cron", hour=2, minute=0)
    scheduler.start()
    logger.info("Scheduler started for nightly scans in production mode.")