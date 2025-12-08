// Right content box component
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function RightContent() {
  return (
    <Card className="h-full">
      <div className="border-b border-border p-4">
        <h3 className="font-serif font-bold text-xl">Policy Document</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Healthcare Reform Act 2024
        </p>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="p-6 prose prose-sm max-w-none">
          <h4 className="font-serif font-semibold text-lg mb-3">
            Section 1: Overview
          </h4>
          <p className="mb-4 leading-relaxed">
            The Healthcare Reform Act of 2024 represents a comprehensive overhaul of the nation's healthcare system, 
            designed to expand coverage, reduce costs, and improve quality of care for all citizens.
          </p>
          
          <h4 className="font-serif font-semibold text-lg mb-3">
            Section 2: Coverage Expansion
          </h4>
          <p className="mb-4 leading-relaxed">
            This act mandates that all insurance providers offer coverage to individuals regardless of pre-existing 
            conditions. It also establishes income-based subsidies to make coverage more affordable for middle and 
            lower-income families.
          </p>
          
          <h4 className="font-serif font-semibold text-lg mb-3">
            Section 3: Cost Reduction Measures
          </h4>
          <p className="mb-4 leading-relaxed">
            The legislation introduces price caps on prescription medications, particularly for life-saving drugs. 
            It also promotes competition among healthcare providers through transparency in pricing and quality metrics.
          </p>
          
          <h4 className="font-serif font-semibold text-lg mb-3">
            Section 4: Quality Improvements
          </h4>
          <p className="mb-4 leading-relaxed">
            New standards for healthcare providers focus on patient outcomes rather than service volume. The act 
            establishes a national quality rating system and incentivizes preventive care.
          </p>
          
          <h4 className="font-serif font-semibold text-lg mb-3">
            Section 5: Implementation Timeline
          </h4>
          <p className="leading-relaxed">
            The provisions of this act will be phased in over a three-year period, beginning January 1, 2025. 
            Full implementation is expected by January 1, 2028.
          </p>
        </div>
      </ScrollArea>
    </Card>
  );
}

