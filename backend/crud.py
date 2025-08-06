# /backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# This is a placeholder for a real token validation system
# In a real app, you'd decode a JWT here. For now, we trust the token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(...)):
    # This is a simplified auth check for the MVP.
    # It finds the user based on the GitHub access token.
    user = db.query(models.User).filter(models.User.access_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def create_repo(db: Session, repo: schemas.RepoCreate, owner_id: int):
    db_repo = models.Repo(**repo.dict(), owner_id=owner_id)
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo

def list_user_reports(db: Session, owner_id: int):
    # This gets all reports for all repos owned by the user.
    return db.query(models.Report).join(models.Repo).filter(models.Repo.owner_id == owner_id).all()

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