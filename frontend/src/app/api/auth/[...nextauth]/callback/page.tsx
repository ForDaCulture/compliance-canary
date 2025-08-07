// frontend/src/app/api/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { exchangeCodeForToken } from '@/lib/api';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('GitHub OAuth Error:', error);
      router.push('/'); // Redirect to login on error
      return;
    }

    if (code) {
      const handleAuth = async () => {
        try {
          const data = await exchangeCodeForToken(code);
          if (data.access_token) {
            localStorage.setItem('canary_token', data.access_token);
            router.push('/dashboard');
          } else {
            throw new Error('No access token received');
          }
        } catch (err) {
          console.error('Failed to exchange code for token:', err);
          router.push('/');
        }
      };
      handleAuth();
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-2xl font-semibold">Authenticating...</p>
        <p className="text-gray-400">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}