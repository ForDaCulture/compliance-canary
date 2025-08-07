// frontend/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// A helper function for handling API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || 'An unknown network error occurred.');
  }
  return response.json();
}

/**
 * Exchanges the GitHub OAuth authorization code for our application's JWT.
 * @param code The authorization code from the GitHub redirect.
 * @returns The backend response containing the access_token.
 */
export const exchangeCodeForToken = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/callback?code=${code}`);
  return handleResponse(response);
};

/**
 * Fetches the authenticated user's repositories from our backend.
 * @returns A list of the user's repositories.
 */
export const getUserRepositories = async () => {
  const token = localStorage.getItem('canary_token');
  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/user/repositories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};