# backend/run.py
import os
import sys
import uvicorn

# Add parent directory to sys.path to allow package resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )