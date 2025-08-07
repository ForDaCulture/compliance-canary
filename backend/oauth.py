# backend/oauth.py
import os
from authlib.integrations.starlette_client import OAuth
from jose import jwt
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

oauth = OAuth()

oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email read:user repo'},
)

SECRET_KEY = os.getenv("JWT_SECRET", "your_jwt_secret")  # Replace with secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: int = None):
    """Create a JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (timedelta(minutes=expires_delta) if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)