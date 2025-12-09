'use client';

import { useSearchParams } from 'next/navigation';

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') ?? "An unknown error occurred.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          OAuth Error
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          {error}
        </p>

        <a 
          href="/login"
          className="inline-block rounded-lg bg-red-600 text-white px-5 py-2.5 font-medium hover:bg-red-700 transition"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}