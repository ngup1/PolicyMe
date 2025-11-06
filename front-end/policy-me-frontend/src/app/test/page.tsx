'use client';

import { useState } from 'react';
import { congressService } from '@/services/congressService';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await congressService.getBills({ limit: 5 });
      setResult(response);
      console.log('API Response:', response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bills');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Congress API Test</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 disabled:opacity-50 mb-6"
      >
        {loading ? 'Loading...' : 'Test Congress API'}
      </button>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-md mb-6">
          <h3 className="font-bold text-destructive mb-2">Error:</h3>
          <pre className="text-sm">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="font-bold mb-2">Success! Response:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

