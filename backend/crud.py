# /backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# This scheme is used by FastAPI to extract the token from the "Authorization" header.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- User CRUD Operations ---

def get_user_by_email(db: Session, email: str):
    """Fetches a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_github_id(db: Session, github_id: str):
    """Fetches a single user by their unique GitHub ID."""
    return db.query(models.User).filter(models.User.github_id == github_id).first()

def create_user(db: Session, github_data: dict, access_token: str):
    """Creates a new user in the database from GitHub profile data."""
    db_user = models.User(
        email=github_data.get('email'),
        github_id=str(github_data.get('id')),
        access_token=access_token
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_current_user(db: Session, token: str):
    """
    Core logic to retrieve a user from the database based on their access token.
    This is the function that will be wrapped by our dependency in main.py.
    """
    user = db.query(models.User).filter(models.User.access_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# --- Repo CRUD Operations ---

def create_repo(db: Session, repo: schemas.RepoCreate, owner_id: int):
    """Creates a new repository record associated with a user."""
    db_repo = models.Repo(**repo.dict(), owner_id=owner_id)
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo

# --- Report CRUD Operations ---

def list_user_reports(db: Session, owner_id: int):
    """Lists all reports across all repositories for a given user."""
    return db.query(models.Report).join(models.Repo).filter(models.Repo.owner_id == owner_id).order_by(models.Report.timestamp.desc()).all()

def store_report(db: Session, repo_id: int, findings: dict, pdf_path: str):
    """Saves a new scan report to the database."""
    report = models.Report(
        repo_id=repo_id,
        dns_exfil_found=findings.get("dns_exfil", False),
        ssrf_found=findings.get("ssrf", False),
        pdf_path=pdf_path
    )
    db.add(report)
    db.commit()
    return report
