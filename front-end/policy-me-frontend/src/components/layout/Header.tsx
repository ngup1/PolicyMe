'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from "../ui/badge";
import { BookOpen, Menu, X } from 'lucide-react';

const trendingIssues = [
  "Healthcare Reform",
  "Climate Policy",
  "Tax Legislation",
  "Education Funding",
  "Immigration Policy",
];

export default function Header() {
  const router = useRouter();
  const [isLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => router.push('/')}
          >
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" 
              style={{ backgroundColor: '#00132B' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#DFE4EA' }} />
            </div>
            <span className="text-lg font-semibold" style={{ color: '#00132B' }}>
              Open Politic
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {['Explore', 'How It Works', 'About'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                My Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/login')}
                  className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ backgroundColor: '#00132B' }}
                >
                  Get Started
                </button>
              </>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Trending - Desktop */}
        <div className="hidden md:flex items-center gap-3 pb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Trending
          </span>
          <div className="flex flex-wrap gap-2">
            {trendingIssues.map((issue) => (
              <Badge
                key={issue}
                variant="secondary"
                className="cursor-pointer text-xs font-normal hover:bg-muted/80 transition-colors"
              >
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 space-y-2">
          {['Explore', 'How It Works', 'About'].map((item) => (
            <a 
              key={item}
              href="#" 
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
