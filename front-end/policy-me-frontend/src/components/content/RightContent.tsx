import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { FileText, Clock, Users } from "lucide-react";

export default function RightContent() {
  return (
    <Card className="h-full bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Official Document</span>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Healthcare Reform Act 2024</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            Active
          </span>
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated 2 days ago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>12 co-sponsors</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[450px]">
        <div className="p-6 space-y-6">
          {[
            { 
              title: "Section 1: Overview", 
              content: "The Healthcare Reform Act of 2024 represents a comprehensive overhaul of the nation's healthcare system, designed to expand coverage, reduce costs, and improve quality of care for all citizens.",
              highlight: true
            },
            { 
              title: "Section 2: Coverage Expansion", 
              content: "This act mandates that all insurance providers offer coverage to individuals regardless of pre-existing conditions. It also establishes income-based subsidies to make coverage more affordable for middle and lower-income families." 
            },
            { 
              title: "Section 3: Cost Reduction", 
              content: "The legislation introduces price caps on prescription medications, particularly for life-saving drugs. It promotes competition among healthcare providers through transparency in pricing and quality metrics." 
            },
            { 
              title: "Section 4: Quality Improvements", 
              content: "New standards for healthcare providers focus on patient outcomes rather than service volume. The act establishes a national quality rating system and incentivizes preventive care." 
            },
            { 
              title: "Section 5: Implementation Timeline", 
              content: "The provisions will be phased in over a three-year period, beginning January 1, 2025. Full implementation is expected by January 1, 2028." 
            }
          ].map((section, i) => (
            <div 
              key={i} 
              className={`${section.highlight ? 'p-4 rounded-xl bg-muted/50 border-l-4' : ''}`}
              style={section.highlight ? { borderLeftColor: '#00132B' } : {}}
            >
              <h4 className="font-medium text-foreground mb-2">{section.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
