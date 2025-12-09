'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => Promise<void> | void;
}

export default function SearchBar({
  placeholder = 'Search policies, bills, or topics...',
  className = '',
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    if (onSearch) {
      setIsSearching(true);
      try {
        await onSearch(query.trim());
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Search error:', error);
        toast.error(errorMessage);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Fallback: just log for now (when API is integrated, this will be handled by onSearch)
      console.log('Searching for:', query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-14 py-4 rounded-2xl border-2 border-border bg-white text-foreground 
                     placeholder:text-muted-foreground
                     focus:outline-none focus:border-foreground/20 focus:shadow-lg focus:shadow-black/5
                     transition-all duration-200"
          aria-label="Search policies"
        />

        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#00132B' }}
          aria-label="Search"
        >
          <ArrowRight className={`w-5 h-5 ${isSearching ? 'animate-pulse' : ''}`} />
        </button>
      </div>
      
      {/* Quick suggestions */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Try:</span>
        {['Healthcare', 'Climate bill', 'Tax reform'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setQuery(term)}
            className="px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}
