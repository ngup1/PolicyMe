'use client';

// SearchBar component for policy search
import { useState } from 'react';
import { searchPolicies } from '@/services/policyService';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onResults?: (data: any, query: string) => void;
}

export default function SearchBar({
  placeholder = 'Search policies, bills, or topics...',
  className = '',
  onResults
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchPolicies(query);
      onResults?.(data, query);
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
    >
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && handleClear()}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-background text-foreground 
                     placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200
                     hover:border-ring/50"
          aria-label="Search policies"
          disabled={loading}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground 
                       hover:text-foreground transition-colors
                       focus:outline-none focus:ring-2 focus:ring-ring rounded-full p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
      {loading && (
        <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
      )}
    </form>
  );
}
