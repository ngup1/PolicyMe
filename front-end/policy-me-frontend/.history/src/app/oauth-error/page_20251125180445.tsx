'use client';

import { useSearchParams } from 'next/navigation';

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Error</h1>
      <p className="text-red-600">{error}</p>
    </div>
  );
}
