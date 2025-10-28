"use client";
// Home page - main entry point for the application
import { useState } from "react";
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import SearchContainer from "@/components/layout/SearchContainer";
import ContentGrid from "@/components/layout/ContentGrid";
import SearchBar from "@/components/ui/SearchBar";
import Footer from "@/components/layout/Footer";
import { LeftContent, RightContent } from "@/components/content";

function containsQuery(item: any, q: string): boolean {
  if (!q) return true;
  const query = q.toLowerCase();
  const title: string = item?.bill?.title || "";
  const textHtml: string = item?.text || "";
  const text = textHtml.replace(/<[^>]+>/g, " ").toLowerCase();
  return (
    title.toLowerCase().includes(query) ||
    text.includes(query)
  );
}

export default function Home() {
  const [summaries, setSummaries] = useState<any[] | null>(null);
  const [selected, setSelected] = useState<any | undefined>(undefined);

  return (
    <>
      {/* Header with navigation and trending issues */}
      <Header />
      
      {/* Main content area */}
      <MainContent>
        {/* Search bar section */}
        <SearchContainer>
          <SearchBar onResults={(data, query) => {
            const arr = Array.isArray((data as any)?.summaries) ? (data as any).summaries : [];
            const filtered = arr.filter((it: any) => containsQuery(it, query));
            const finalList = filtered.length > 0 ? filtered : arr;
            setSummaries(finalList);
            setSelected(finalList && finalList.length > 0 ? finalList[0] : undefined);
          }} />
        </SearchContainer>
        
        {/* Two-column content grid */}
        <ContentGrid>
          <LeftContent summaries={summaries || []} selectedSummary={selected} onSelect={(s) => setSelected(s)} />
          <RightContent summary={selected} />
        </ContentGrid>
      </MainContent>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
