// Right content box component
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

type SummaryItem = {
  bill?: { title?: string; url?: string };
  text?: string; // HTML
  actionDate?: string;
};

export default function RightContent({ summary }: { summary?: SummaryItem }) {
  return (
    <Card className="h-full">
      <div className="border-b border-border p-4">
        <h3 className="font-serif font-bold text-xl">Policy Document</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {summary?.bill?.title || "Select a result to view the full summary"}
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-6 prose prose-sm max-w-none">
          {summary?.text ? (
            <div dangerouslySetInnerHTML={{ __html: summary.text }} />
          ) : (
            <p className="text-sm text-muted-foreground">No document selected.</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

