'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token temporarily
      localStorage.setItem('token', token);
      
      // Fetch user info from backend (you might need to create an endpoint for this)
      // For now, we'll redirect to home and let the app fetch user info
      router.push('/');
    } else {
      setError('Authentication failed. No token received.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-muted-foreground">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center">
        <p className="text-foreground mb-4">Authentication successful!</p>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

