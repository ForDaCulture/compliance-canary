// frontend/src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Function to handle the OAuth callback
export const exchangeCodeForToken = async (code: string) => {
  const response = await apiClient.get(`/auth/callback?code=${code}`);
  return response.data;
};

// Function to get repositories
export const getRepositories = async () => {
  const token = localStorage.getItem('canary_token');
  if (!token) throw new Error('No authentication token found.');
  
  const response = await apiClient.get('/repos', { // Assuming you have a /repos endpoint
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};