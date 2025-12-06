import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OAuthError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error') ?? 'An unknown error occurred.';
    setError(errorParam);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-destructive mb-2">OAuth Error</h1>
            <p className="text-muted-foreground">Authentication failed</p>
          </div>

          <div className="mb-6">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          </div>

          <Button
            onClick={() => navigate('/login')}
            className="w-full"
            variant="default"
          >
            Return to Login
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Need help?{' '}
            <a href="/support" className="text-primary hover:underline font-medium">
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthError;