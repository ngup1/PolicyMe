// Home page - main entry point
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import SearchContainer from "@/components/layout/SearchContainer";
import ContentGrid from "@/components/layout/ContentGrid";
import SearchBar from "@/components/ui/SearchBar";
import Footer from "@/components/layout/Footer";
import { LeftContent, RightContent } from "@/components/content";
import { User, ArrowRight } from 'lucide-react';

export default function Home() {
  const [hasProfile, setHasProfile] = useState(true); // default true to avoid flash
  
  useEffect(() => {
    const demo = localStorage.getItem('demographics');
    setHasProfile(!!demo);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Personalization prompt */}
      {!hasProfile && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-blue-100">
          <div className="container mx-auto px-6 py-3">
            <Link 
              href="/demographics" 
              className="flex items-center justify-center gap-3 text-sm group"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900">
                <strong>Personalize your experience:</strong> Tell us about yourself to see how policies impact you
              </span>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
      
      {/* Hero Section with subtle gradient */}
      <section className="relative bg-gradient-to-b from-white via-white to-background py-16 md:py-24">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-60" />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Now tracking 2024 legislation
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Understand the policies<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
                that shape your life
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Search any bill, policy, or topic to get clear, unbiased summaries tailored to you.
            </p>
            
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
            
            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">10K+</span> policies analyzed
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">50+</span> topics covered
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Free</span> to use
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <MainContent>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">Featured Analysis</h2>
          <p className="text-muted-foreground">Deep dive into trending legislation</p>
        </div>
        <ContentGrid>
          <LeftContent />
          <RightContent />
        </ContentGrid>
      </MainContent>
      
      <Footer />
    </div>
  );
}
