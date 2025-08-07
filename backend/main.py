# backend/main.py
import os
from dotenv import load_dotenv
import logging
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from typing import List  # Added import for List type hint
import backend.crud as crud
import backend.models as models
import backend.schemas as schemas
import backend.parser as parser
import backend.pdf_generator as pdf_generator
import backend.mailer as mailer
import backend.oauth as oauth
from backend.database import SessionLocal, engine, init_db
from backend.dependencies import get_db
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
init_db()

app = FastAPI(
    title="Compliance Canary",
    description="Automated security and compliance scanning for modern development teams.",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_active_user(token: str = Depends(crud.oauth2_scheme), db: Session = Depends(get_db)):
    return crud.get_current_user(token, db)

@app.get("/", tags=["Status"])
async def root():
    return {"status": "ok", "message": "Welcome to Compliance Canary API", "timestamp": datetime.utcnow().isoformat()}

@app.get("/auth/github", tags=["Authentication"])
async def github_login(request: Request):
    redirect_uri = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/api/auth/callback"
    logger.info(f"Redirecting to GitHub OAuth with redirect URI: {redirect_uri}")
    return await oauth.oauth.github.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback", tags=["Authentication"])
async def github_callback(request: Request, db: Session = Depends(get_db)):
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
        logger.info(f"User {user.id} authenticated successfully")
        return {"access_token": jwt_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(status_code=400, detail="Authentication failed")

@app.post("/repos", response_model=schemas.Repo, tags=["Repositories"])
def add_repo(repo_data: schemas.RepoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_repo(db, repo_data, owner_id=current_user.id)

@app.get("/reports", response_model=List[schemas.Report], tags=["Reports"])
def list_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.list_user_reports(db, owner_id=current_user.id)

def nightly_scan_and_report():
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
        logger.error(f"Nightly scan error: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
if os.getenv("ENVIRONMENT", "development") == "production":
    scheduler.add_job(nightly_scan_and_report, "cron", hour=2, minute=0)
    scheduler.start()
    logger.info("Scheduler started for nightly scans")