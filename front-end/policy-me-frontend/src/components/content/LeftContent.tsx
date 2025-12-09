"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/Button";
import { Send, User, Bot, CheckCircle2, AlertCircle } from "lucide-react";

const AnalysisPanel = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm here to help you understand this policy. What would you like to know?" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }]);
      setInputValue("");
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: "..." }]);
      }, 1000);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <div className="border-b border-border px-2">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent gap-1">
            {['Summary', 'Personal Impact', 'Ask Questions'].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase().replace(' ', '-')}
                className="rounded-lg data-[state=active]:bg-muted data-[state=active]:shadow-none px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="summary" className="flex-1 mt-0">
          <ScrollArea className="h-[450px]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Key Takeaways</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Universal Coverage", desc: "All citizens will have access to healthcare regardless of pre-existing conditions.", tag: "Coverage" },
                  { title: "Lower Drug Costs", desc: "Price caps on prescription medications will reduce out-of-pocket expenses by up to 30%.", tag: "Cost" },
                  { title: "Quality Focus", desc: "Healthcare providers will be rated on patient outcomes, not volume.", tag: "Quality" },
                  { title: "Phased Implementation", desc: "Changes roll out over 3 years starting January 2025.", tag: "Timeline" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white text-muted-foreground">{item.tag}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="personal-impact" className="flex-1 mt-0">
          <ScrollArea className="h-[450px]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">How This Affects You</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50 mb-6">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Your Profile</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">35</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Income</p>
                    <p className="font-medium text-foreground">$65K</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Coverage</p>
                    <p className="font-medium text-foreground">Employer</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-medium text-emerald-800">You'll Benefit</h4>
                  </div>
                  <ul className="space-y-1.5 text-sm text-emerald-700 ml-7">
                    <li>• Save ~$200/month with subsidies</li>
                    <li>• 30% lower prescription costs</li>
                    <li>• Better preventive care coverage</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl border border-border bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h4 className="font-medium text-foreground">Things to Watch</h4>
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-7">
                    <li>• Provider network may change</li>
                    <li>• New enrollment deadlines</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ask-questions" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                    message.role === "user" 
                      ? "text-white" 
                      : "bg-muted text-foreground"
                  }`}
                  style={message.role === "user" ? { backgroundColor: '#00132B' } : {}}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00132B' }}>
                      <User className="w-4 h-4 text-white" />
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
                className="flex-1 rounded-xl"
              />
              <Button onClick={handleSend} size="icon" className="rounded-xl">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default function LeftContent() {
  return <AnalysisPanel />;
}
