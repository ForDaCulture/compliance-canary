# /backend/main.py

# --- START: BOILERPLATE FOR PATH FIX ---
# This ensures the application root is on the Python path,
# solving import errors in different execution contexts (e.g., Uvicorn reloader).
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# --- END: BOILERPLATE FOR PATH FIX ---

# 1. Standard Library Imports
from datetime import datetime
from typing import List

# 2. Third-Party Imports
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

# 3. Local Application Imports (Absolute)
from backend import crud, models, schemas, parser, pdf_generator, mailer, oauth
from backend.database import SessionLocal, engine


# --- Application Setup ---

# Create database tables on startup based on models
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app
app = FastAPI(
    title="Compliance Canary",
    description="Automated security and compliance scanning for modern development teams.",
    version="0.1.0"
)

# Initialize the background scheduler for nightly jobs
scheduler = BackgroundScheduler()


# --- Middleware ---

# Configure CORS to allow the frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Dependencies ---

def get_db():
    """
    FastAPI dependency that creates and yields a new database session
    for each request, ensuring the session is always closed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_active_user(token: str = Depends(crud.oauth2_scheme), db: Session = Depends(get_db)):
    """
    FastAPI dependency to get the current authenticated user from a token.
    It uses the token extracted by oauth2_scheme and the db session from get_db.
    """
    return crud.get_current_user(db=db, token=token)


# --- API Routes ---

@app.get("/", tags=["Status"])
async def root():
    """Root endpoint to check if the API is running."""
    return {"status": "ok", "message": "Welcome to Compliance Canary API"}

# --- Authentication Routes ---

@app.get("/auth/github", tags=["Authentication"])
async def github_login(request: Request):
    """Redirects the user to GitHub for authentication."""
    redirect_uri = os.getenv("FRONTEND_URL") + "/api/auth/callback/github" # This must match NextAuth's callback URL
    return await oauth.oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/callback", tags=["Authentication"])
async def github_callback(request: Request, db: Session = Depends(get_db)):
    """
    Callback endpoint that GitHub redirects to after user authorization.
    This is called by the NextAuth frontend, not directly by the user's browser.
    """
    token_data = await oauth.oauth.github.authorize_access_token(request)
    access_token = token_data['access_token']
    
    resp = await oauth.oauth.github.get('user', token={'access_token': access_token, 'token_type': 'bearer'})
    github_user_data = resp.json()
    
    user = crud.get_user_by_github_id(db, str(github_user_data['id']))
    if not user:
        user = crud.create_user(db, github_user_data, access_token)

    # SECURITY NOTE: In a production app, we would exchange this GitHub access token
    # for a short-lived JWT that our frontend would use for all subsequent requests.
    # For this MVP, we are returning the GitHub token directly for simplicity.
    return {"access_token": user.access_token, "token_type": "bearer"}

# --- Core Application Routes ---

@app.post("/repos", response_model=schemas.Repo, tags=["Repositories"])
def add_repo(
    repo_data: schemas.RepoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Adds a new repository for the authenticated user to be scanned."""
    return crud.create_repo(db=db, repo=repo_data, owner_id=current_user.id)


@app.get("/reports", response_model=List[schemas.Report], tags=["Reports"])
def list_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Lists all historical reports for the authenticated user."""
    return crud.list_user_reports(db=db, owner_id=current_user.id)


# --- Scheduled Jobs ---

def nightly_scan_and_report():
    """
    The core background job. It fetches all active repos, scans them,
    generates a PDF report, emails it, and saves the result to the database.
    """
    print(f"SCHEDULER: Starting nightly scan at {datetime.now()}")
    db = SessionLocal()
    try:
        active_repos = db.query(models.Repo).filter(models.Repo.active == True).all()
        for repo in active_repos:
            print(f"SCHEDULER: Scanning repo: {repo.name}")
            findings = parser.scan_repository(repo.clone_url, repo.owner.access_token)
            pdf_path = pdf_generator.create_report_pdf(repo, findings)
            mailer.send_report_email(repo.owner.email, repo.name, pdf_path)
            crud.store_report(db, repo.id, findings, pdf_path)
            print(f"SCHEDULER: Finished processing repo: {repo.name}")
    except Exception as e:
        print(f"SCHEDULER: An error occurred during the nightly scan: {e}")
    finally:
        db.close()

# Schedule the job to run every night at 2 AM system time
scheduler.add_job(nightly_scan_and_report, 'cron', hour=2, minute=0)
scheduler.start()
