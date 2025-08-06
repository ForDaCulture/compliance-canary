# /backend/models.py
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    access_token = Column(String)
    repos = relationship("Repo", back_populates="owner")

class Repo(Base):
    __tablename__ = "repos"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    clone_url = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    active = Column(Boolean, default=True)
    owner = relationship("User", back_populates="repos")
    reports = relationship("Report", back_populates="repo")

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    repo_id = Column(Integer, ForeignKey("repos.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    dns_exfil_found = Column(Boolean, default=False)
    ssrf_found = Column(Boolean, default=False)
    pdf_path = Column(String, nullable=True) # Path to the generated PDF
    repo = relationship("Repo", back_populates="reports")