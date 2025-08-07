# /backend/oauth.py
import os
from authlib.integrations.starlette_client import OAuth

# This creates an OAuth registry object.
# We'll register our GitHub client with it.
oauth = OAuth()

# Register the GitHub OAuth client.
# This uses the credentials from your .env file.
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email read:user repo'}, # Scopes define what we can ask for
)
