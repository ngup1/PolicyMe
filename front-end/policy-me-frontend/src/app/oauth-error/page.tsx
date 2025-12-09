'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function OAuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') ?? "An unknown error occurred during authentication.";

  useEffect(() => {
    toast.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-border shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Authentication Error
        </h1>

        <p className="text-muted-foreground mb-6">
          {error}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
            style={{ backgroundColor: '#00132B' }}
          >
            Return to Login
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}