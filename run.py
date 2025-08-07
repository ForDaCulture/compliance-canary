# /run.py
import uvicorn
import os

if __name__ == "__main__":
    # Get the directory of the current script
    # This ensures that paths are correct regardless of where you run the script from
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Set the app directory to the 'backend' folder
    app_dir = os.path.join(current_dir, 'backend')
    
    # Run uvicorn programmatically
    uvicorn.run(
        "main:app",          # The application to run (main.py, app object)
        host="127.0.0.1",    # The host to bind to
        port=8000,           # The port to listen on
        reload=True,         # Enable auto-reloading
        app_dir=app_dir      # Set the application directory
    )