# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from .dependencies import get_db  # Import get_db from dependencies

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# --- User CRUD Operations ---

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_github_id(db: Session, github_id: str):
    return db.query(models.User).filter(models.User.github_id == github_id).first()

def create_user(db: Session, github_data: dict, access_token: str):
    db_user = models.User(
        email=github_data.get('email'),
        github_id=str(github_data.get('id')),
        access_token=access_token
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_current_user(token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET", "your_jwt_secret"), algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise credentials_exception
    return user

# --- Repo CRUD Operations ---

def create_repo(db: Session, repo: schemas.RepoCreate, owner_id: int):
    db_repo = models.Repo(**repo.dict(), owner_id=owner_id)
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo

# --- Report CRUD Operations ---

def list_user_reports(db: Session, owner_id: int):
    return db.query(models.Report).join(models.Repo).filter(models.Repo.owner_id == owner_id).order_by(models.Report.timestamp.desc()).all()

def store_report(db: Session, repo_id: int, findings: dict, pdf_path: str):
    report = models.Report(
        repo_id=repo_id,
        dns_exfil_found=findings.get("dns_exfil", False),
        ssrf_found=findings.get("ssrf", False),
        pdf_path=pdf_path
    )
    db.add(report)
    db.commit()
    return report