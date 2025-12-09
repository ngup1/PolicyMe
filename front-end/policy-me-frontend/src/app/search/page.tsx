'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from "@/components/layout/Header";
import SearchBar from "@/components/ui/SearchBar";
import Footer from "@/components/layout/Footer";
import { searchPolicies, getRecentPolicies, summarizePolicy, explainPolicyImpact } from '@/services/policyService';
import { Bill, Demographics } from '@/types';
import { AlertCircle, FileText, Calendar, Users, Sparkles, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'details' | 'summary' | 'impact' | 'chat'>('details');
  
  // AI content state
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [impact, setImpact] = useState<string>('');
  const [impactLoading, setImpactLoading] = useState(false);
  
  // Demographics state - initialized from user profile
  const [demographics, setDemographics] = useState<Demographics>({
    age: undefined,
    state: '',
    incomeBracket: '',
    veteran: false,
    student: false,
    smallBusinessOwner: false
  });
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const query = searchParams.get('q') || '';

  // Initialize demographics from user profile
  useEffect(() => {
    if (user) {
      setDemographics({
        age: user.age,
        state: user.state || '',
        incomeBracket: user.incomeBracket || '',
        veteran: user.veteran || false,
        student: user.student || false,
        smallBusinessOwner: user.smallBusinessOwner || false
      });
    }
  }, [user]);

  useEffect(() => {
    loadBills();
  }, [query]);

  const loadBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = query 
        ? await searchPolicies(query)
        : await getRecentPolicies();
      setBills(results);
      if (results.length > 0) {
        handleBillSelection(results[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bills');
      console.error('Error loading bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBillSelection = async (bill: Bill) => {
    setSelectedBill(bill);
    setActiveTab('details');
    setSummary('');
    setImpact('');
    setChatMessages([]);
    
    // Auto-load summary
    if (bill.id) {
      setSummaryLoading(true);
      try {
        const summaryText = await summarizePolicy(bill.id);
        setSummary(summaryText);
      } catch (err: any) {
        console.error('Error loading summary:', err);
        setSummary('Failed to generate summary. Please try again.');
      } finally {
        setSummaryLoading(false);
      }
    }
  };

  const handleGenerateImpact = async () => {
    if (!selectedBill?.id) return;
    
    setImpactLoading(true);
    try {
      const impactText = await explainPolicyImpact(selectedBill.id, demographics);
      setImpact(impactText);
    } catch (err: any) {
      console.error('Error generating impact:', err);
      setImpact('Failed to generate personalized impact analysis. Please try again.');
    } finally {
      setImpactLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedBill) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setChatLoading(true);
    try {
      // Create context-aware prompt
      const prompt = `You are an AI assistant helping users understand U.S. legislation. The user is currently viewing bill "${selectedBill.title}" (${selectedBill.type} ${selectedBill.number}, Congress ${selectedBill.congress}).
      
User question: ${userMessage}

Provide a helpful, accurate response about this bill or related legislative topics.`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/mcp/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'ask_ai',
          parameters: { question: prompt }
        })
      });

      const data = await response.json();
      
      if (data.success && data.result) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
          {query && (
            <div className="text-center mt-3 text-sm text-muted-foreground">
              Searching for: <span className="font-semibold text-foreground">"{query}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bills List */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                {query ? 'Search Results' : 'Recent Legislation'}
                {!loading && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({bills.length})
                  </span>
                )}
              </h2>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error loading bills</p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {!loading && !error && bills.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {query ? 'No bills found matching your search' : 'No bills available'}
                  </p>
                </div>
              )}

              {!loading && !error && bills.length > 0 && (
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {bills.map((bill) => (
                    <button
                      key={bill.id}
                      onClick={() => handleBillSelection(bill)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedBill?.id === bill.id
                          ? 'border-foreground bg-foreground/5'
                          : 'border-border bg-white hover:border-foreground/30'
                      }`}
                    >
                      <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                        {bill.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{bill.type} {bill.number}</span>
                        <span>•</span>
                        <span>Congress {bill.congress}</span>
                      </div>
                      {bill.policyArea && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded">
                          {bill.policyArea.name}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bill Details with Tabs */}
          <div className="lg:col-span-2">
            {selectedBill ? (
              <div className="bg-white rounded-xl border-2 border-border overflow-hidden">
                {/* Bill Header */}
                <div className="p-6 border-b">
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    {selectedBill.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selectedBill.type} {selectedBill.number}
                    </span>
                    <span>•</span>
                    <span>Congress {selectedBill.congress}</span>
                    {selectedBill.originChamber && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{selectedBill.originChamber}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-gray-50">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                      activeTab === 'details'
                        ? 'text-foreground bg-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Details
                    {activeTab === 'details' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                      activeTab === 'summary'
                        ? 'text-foreground bg-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                    {activeTab === 'summary' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('impact')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                      activeTab === 'impact'
                        ? 'text-foreground bg-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Personal Impact
                    {activeTab === 'impact' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                      activeTab === 'chat'
                        ? 'text-foreground bg-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    AI Chat
                    {activeTab === 'chat' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {selectedBill.policyArea && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Policy Area</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                            {selectedBill.policyArea.name}
                          </span>
                        </div>
                      )}

                      {selectedBill.latestAction && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-semibold text-blue-900 mb-1">Latest Action</h3>
                              <p className="text-sm text-blue-800">{selectedBill.latestAction.text}</p>
                              <p className="text-xs text-blue-600 mt-1">
                                {new Date(selectedBill.latestAction.actionDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedBill.sponsors && selectedBill.sponsors.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground">Sponsors</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedBill.sponsors.slice(0, 5).map((sponsor, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <span className="font-medium text-foreground">{sponsor.fullName}</span>
                                <span className="text-muted-foreground">
                                  {sponsor.party} - {sponsor.state}
                                </span>
                              </div>
                            ))}
                            {selectedBill.sponsors.length > 5 && (
                              <p className="text-xs text-muted-foreground">
                                +{selectedBill.sponsors.length - 5} more sponsors
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedBill.url && (
                        <div className="pt-4 border-t">
                          <a
                            href={selectedBill.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View on Congress.gov →
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Tab */}
                  {activeTab === 'summary' && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-foreground">AI-Generated Summary</h2>
                      </div>
                      
                      {summaryLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        </div>
                      ) : summary ? (
                        <div className="prose prose-sm max-w-none">
                          <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                            {summary}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Summary will be generated automatically when you select a bill.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Personal Impact Tab */}
                  {activeTab === 'impact' && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold text-foreground">Personalized Impact Analysis</h2>
                      </div>

                      {!impact && (
                        <div className="mb-6 space-y-4">
                          {user ? (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p className="text-sm text-blue-900">
                                ℹ️ <strong>Logged in as:</strong> {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-blue-800 mt-1">
                                Your profile data will be used for personalized analysis. Update fields below to customize.
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Log in to use your profile data, or tell us about yourself below to get a personalized analysis of how this bill might affect you.
                            </p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Age
                              </label>
                              <input
                                type="number"
                                value={demographics.age || ''}
                                onChange={(e) => setDemographics(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                placeholder="e.g., 35"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                State
                              </label>
                              <input
                                type="text"
                                value={demographics.state || ''}
                                onChange={(e) => setDemographics(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                placeholder="e.g., CA"
                                maxLength={2}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Income Bracket
                              </label>
                              <select
                                value={demographics.incomeBracket || ''}
                                onChange={(e) => setDemographics(prev => ({ ...prev, incomeBracket: e.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                              >
                                <option value="">Select...</option>
                                <option value="under-25k">Under $25,000</option>
                                <option value="25k-50k">$25,000 - $50,000</option>
                                <option value="50k-75k">$50,000 - $75,000</option>
                                <option value="75k-100k">$75,000 - $100,000</option>
                                <option value="100k-150k">$100,000 - $150,000</option>
                                <option value="over-150k">Over $150,000</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={demographics.veteran || false}
                                onChange={(e) => setDemographics(prev => ({ ...prev, veteran: e.target.checked }))}
                                className="w-4 h-4 rounded border-border"
                              />
                              <span className="text-sm text-foreground">Military Veteran</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={demographics.student || false}
                                onChange={(e) => setDemographics(prev => ({ ...prev, student: e.target.checked }))}
                                className="w-4 h-4 rounded border-border"
                              />
                              <span className="text-sm text-foreground">Student</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={demographics.smallBusinessOwner || false}
                                onChange={(e) => setDemographics(prev => ({ ...prev, smallBusinessOwner: e.target.checked }))}
                                className="w-4 h-4 rounded border-border"
                              />
                              <span className="text-sm text-foreground">Small Business Owner</span>
                            </label>
                          </div>

                          <button
                            onClick={handleGenerateImpact}
                            disabled={impactLoading || !demographics.age && !demographics.state && !demographics.incomeBracket}
                            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                          >
                            {impactLoading ? 'Analyzing...' : 'Generate Personal Impact Analysis'}
                          </button>
                        </div>
                      )}

                      {impactLoading && (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        </div>
                      )}

                      {impact && (
                        <div>
                          <div className="prose prose-sm max-w-none mb-4">
                            <div className="bg-emerald-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                              {impact}
                            </div>
                          </div>
                          <button
                            onClick={() => setImpact('')}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            ← Update demographics and regenerate
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Chat Tab */}
                  {activeTab === 'chat' && (
                    <div className="flex flex-col h-[500px]">
                      <div className="flex items-center gap-2 mb-4">
                        <Send className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-foreground">Ask AI About This Bill</h2>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto mb-4 space-y-3 border rounded-lg p-4 bg-gray-50">
                        {chatMessages.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Ask me anything about this bill!
                              </p>
                              <p className="text-xs text-muted-foreground">
                                I can help explain provisions, compare to other legislation, or answer specific questions.
                              </p>
                            </div>
                          </div>
                        ) : (
                          chatMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                                  msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-border text-foreground'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))
                        )}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-border rounded-lg px-4 py-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !chatLoading && handleSendChatMessage()}
                          placeholder="Ask a question about this bill..."
                          className="flex-1 px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          disabled={chatLoading}
                        />
                        <button
                          onClick={handleSendChatMessage}
                          disabled={chatLoading || !chatInput.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-border p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a bill to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
