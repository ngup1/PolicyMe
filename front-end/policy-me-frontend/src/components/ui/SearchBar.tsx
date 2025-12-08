'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search policies, bills, or topics...',
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
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
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#00132B' }}
        >
          <ArrowRight className="w-5 h-5" />
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
