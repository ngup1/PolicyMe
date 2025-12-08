// Home page - main entry point for the application
'use client';
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import SearchContainer from "@/components/layout/SearchContainer";
import ContentGrid from "@/components/layout/ContentGrid";
import SearchBar from "@/components/ui/SearchBar";
import Footer from "@/components/layout/Footer";
import { LeftContent, RightContent } from "@/components/content";

export default function Home() {
  return (
    <>
      {/* Header with navigation and trending issues */}
      <Header />
      
      {/* Main content area */}
      <MainContent>
        {/* Search bar section */}
        <SearchContainer>
          <SearchBar />
        </SearchContainer>
        
        {/* Two-column content grid */}
        <ContentGrid>
          <LeftContent />
          <RightContent />
        </ContentGrid>
      </MainContent>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
