'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { getErrorMessage } from '@/lib/error-handler';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { setJwtToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      setLoading(false);
      toast.error(errorParam);
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    if (token) {
      try {
        setJwtToken(token);
        setLoading(false);
        toast.success('Authentication successful!');
        setTimeout(() => router.push('/'), 1500);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
        setTimeout(() => router.push('/login'), 3000);
      }
    } else {
      setError('No authentication token received');
      setLoading(false);
      toast.error('Authentication failed. Please try again.');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, setJwtToken, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground mb-2">Processing authentication...</p>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Failed</h1>
          <p className="text-destructive mb-6">{error}</p>
          <Button onClick={() => router.push('/login')}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>
        <p className="text-foreground mb-2 text-lg font-semibold">Authentication successful!</p>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}