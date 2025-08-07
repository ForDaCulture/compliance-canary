'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { exchangeCodeForToken } from '@/lib/api'; // Assuming this function exists in your API library

export default function GitHubAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle cases where the user denies access on GitHub
    if (error) {
      console.error('GitHub OAuth Error:', error);
      router.push('/'); // Redirect to login page on error
      return;
    }

    // If we have a code, proceed with exchanging it for a token
    if (code) {
      const handleAuthentication = async () => {
        try {
          const data = await exchangeCodeForToken(code);
          if (data && data.access_token) {
            // Store the JWT from our backend in local storage
            localStorage.setItem('canary_token', data.access_token);
            // Redirect to the main dashboard
            router.push('/dashboard');
          } else {
            // Handle cases where the backend doesn't return a token
            throw new Error('No access token was returned from the backend.');
          }
        } catch (err) {
          console.error('Failed to exchange authorization code for token:', err);
          router.push('/'); // Redirect to login on failure
        }
      };

      handleAuthentication();
    }
  }, [searchParams, router]);

  // Display a loading state to the user while the background process runs
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <p className="text-2xl font-semibold text-white">Finalizing Login...</p>
        <p className="text-gray-400">Please wait, you will be redirected shortly.</p>
      </div>
    </div>
  );
}