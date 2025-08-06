# /backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
import os
from datetime import datetime

# Import all the modules we just created
import crud, models, schemas, parser, pdf_generator, mailer
from database import SessionLocal, engine
from oauth import github_oauth

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ComplianceCanary")

# CORS middleware to allow the frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = BackgroundScheduler()
scheduler.start()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get current user from token
def get_current_user_dep(user: models.User = Depends(crud.get_current_user)):
    return user

############## ROUTES ##############

@app.get("/")
async def root():
    return {"hello": "canary"}

@app.get("/auth/github")
async def github_login():
    return await github_oauth.github.authorize_redirect(None)

@app.get("/auth/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    # This is a simplified flow. We get the token and user data from GitHub
    token_data = await github_oauth.github.authorize_access_token(None, code)
    access_token = token_data['access_token']
    
    # Use token to get user info
    resp = await github_oauth.github.get('user', token={'access_token': access_token, 'token_type': 'bearer'})
    github_user_data = resp.json()
    
    # Check if user exists, if not create them
    user = crud.get_user_by_github_id(db, str(github_user_data['id']))
    if not user:
        user = crud.create_user(db, github_user_data, access_token)

    # In a real app, you'd return a JWT. For the MVP, we return the GitHub token.
    return {"access_token": user.access_token, "token_type": "bearer"}

@app.post("/repos", response_model=schemas.Repo)
def add_repo(gh_repo: schemas.RepoCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user_dep)):
    return crud.create_repo(db, gh_repo, owner_id=user.id)

@app.get("/reports", response_model=List[schemas.Report])
def list_reports(db: Session = Depends(get_db), user: models.User = Depends(get_current_user_dep)):
    return crud.list_user_reports(db, user_id=user.id)

############## SCHEDULER & PDF FEATURE ##############

def nightly_scan_and_report():
    print(f"Starting nightly scan at {datetime.now()}")
    db = SessionLocal()
    try:
        active_repos = db.query(models.Repo).filter(models.Repo.active == True).all()
        for repo in active_repos:
            print(f"Scanning repo: {repo.name}")
            # The parser scans the repo for vulnerabilities
            findings = parser.scan_repository(repo.clone_url, repo.owner.access_token)
            
            # The PDF generator creates a report from the findings
            pdf_path = pdf_generator.create_report_pdf(repo, findings)
            
            # The mailer sends the report to the user
            mailer.send_report_email(repo.owner.email, repo.name, pdf_path)

            # We store the report and path in the database
            crud.store_report(db, repo.id, findings, pdf_path)
            print(f"Finished processing repo: {repo.name}")
    finally:
        db.close()

# Schedule the job to run every night at 2 AM
scheduler.add_job(nightly_scan_and_report, 'cron', hour=2, minute=0)