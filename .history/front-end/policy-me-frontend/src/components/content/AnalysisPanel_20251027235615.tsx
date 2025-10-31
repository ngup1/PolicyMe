import React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/Button";
import { Send, User, Bot } from "lucide-react";

export const AnalysisPanel = () => {
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
          content: "Based on the Healthcare Reform Act, this would likely affect you by providing subsidies if your income is below $75,000/year."
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
              
              <div className="space-y-4">
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-2">Universal Coverage</h4>
                  <p className="text-sm text-muted-foreground">
                    All citizens will have access to healthcare regardless of pre-existing conditions. 
                    Income-based subsidies make coverage affordable.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-2">Lower Drug Costs</h4>
                  <p className="text-sm text-muted-foreground">
                    Price caps on prescription medications, especially for life-saving drugs, 
                    will reduce out-of-pocket expenses.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-2">Quality Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Healthcare providers will be rated on patient outcomes, incentivizing 
                    preventive care and better treatment.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-2">Phased Implementation</h4>
                  <p className="text-sm text-muted-foreground">
                    Changes roll out over 3 years starting January 2025, 
                    giving providers and insurers time to adapt.
                  </p>
                </div>
              </div>
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
                    <span className="text-green-600">✓</span> You'll Benefit
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li>• Eligible for subsidies (saves ~$200/month)</li>
                    <li>• Lower prescription costs (estimated 30% reduction)</li>
                    <li>• Better preventive care coverage</li>
                  </ul>
                </div>
                
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold mb-2">What Changes</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li>• New provider rating system for better choices</li>
                    <li>• More transparency in healthcare pricing</li>
                    <li>• Gradual rollout through 2028</li>
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