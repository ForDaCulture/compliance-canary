# backend/database.py
import os
from dotenv import load_dotenv
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # Loads .env from current or parent directory
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./canary.db")
if not DATABASE_URL:
    logger.warning("DATABASE_URL not found, using default: sqlite:///./canary.db")

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL.lower() else {}
    )
    logger.info(f"Database engine created with URL: {DATABASE_URL}")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized")