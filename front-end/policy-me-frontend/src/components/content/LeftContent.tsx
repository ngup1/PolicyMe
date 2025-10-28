"use client";
import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/Button";
import { Send, User, Bot } from "lucide-react";

type SummaryItem = {
  bill?: { title?: string };
  text?: string;
  actionDate?: string;
};

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "").trim();

function extractBullets(html: string, maxItems = 4): string[] {
  const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map(m => stripHtml(m[1]));
  if (liMatches.length > 0) {
    return liMatches.filter(Boolean).slice(0, maxItems);
  }
  const text = stripHtml(html);
  const sentences = text
    .split(/(?<=[\.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  return sentences.slice(0, maxItems);
}

function deriveImpact(text: string): string[] {
  const t = text.toLowerCase();
  const items: string[] = [];
  if (t.includes("subsid")) items.push("May qualify for premium subsidies given income and coverage type.");
  if (t.includes("prescription") || t.includes("drug")) items.push("Potential reduction in prescription drug costs.");
  if (t.includes("preventive")) items.push("Improved preventive care coverage and incentives.");
  if (t.includes("rating") || t.includes("transparen")) items.push("More transparent provider ratings for smarter choices.");
  if (t.includes("fema")) items.push("Disaster relief continuity may indirectly affect emergency benefits and response.");
  return items.length > 0 ? items.slice(0, 4) : [
    "No immediate cost change expected; monitor upcoming rulemaking.",
    "Provider network quality may shift with new rating systems.",
    "Check employer plan updates in next enrollment window.",
  ];
}

const AnalysisPanel = ({ summaries = [] as SummaryItem[], selectedSummary, onSelect }: { summaries?: SummaryItem[]; selectedSummary?: SummaryItem; onSelect?: (s: SummaryItem) => void }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm here to help you understand this policy. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }]);
      setInputValue("");
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "...."
        }]);
      }, 1000);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="summary" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="impact" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              Personal Impact
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              Ask Questions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="flex-1 mt-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              <h3 className="font-serif font-bold text-2xl mb-4">
                Key Takeaways
              </h3>
              
              {selectedSummary?.text ? (
                <div className="space-y-3">
                  <h4 className="font-semibold">{selectedSummary.bill?.title}</h4>
                  <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                    {extractBullets(selectedSummary.text, 4).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Search and select a bill to see concise takeaways here.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="impact" className="flex-1 mt-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              <h3 className="font-serif font-bold text-2xl mb-4">
                How This Affects You
              </h3>
              
              <div className="bg-editorial-light rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Based on your profile:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Age:</span> 35</p>
                  <p><span className="font-medium">Income:</span> $65,000/year</p>
                  <p><span className="font-medium">Current Coverage:</span> Employer-provided</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Likely Impact
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6 list-disc">
                    {deriveImpact(selectedSummary?.text ? stripHtml(selectedSummary.text) : "").map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-accent-foreground" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about this policy..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="bg-accent hover:bg-accent/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default function LeftContent({ summaries = [] as SummaryItem[], onSelect }: { summaries?: SummaryItem[]; onSelect?: (s: SummaryItem) => void }) {
  return <AnalysisPanel summaries={summaries} onSelect={onSelect} />;
}