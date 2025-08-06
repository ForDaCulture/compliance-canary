# /backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReportBase(BaseModel):
    dns_exfil_found: bool
    ssrf_found: bool
    pdf_path: Optional[str] = None

class Report(ReportBase):
    id: str
    timestamp: datetime
    class Config:
        orm_mode = True

class RepoBase(BaseModel):
    name: str
    clone_url: str

class RepoCreate(RepoBase):
    pass

class Repo(RepoBase):
    id: int
    active: bool
    reports: List[Report] = []
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class User(UserBase):
    id: int
    github_id: str
    repos: List[Repo] = []
    class Config:
        orm_mode = True