// Policy-specific API calls
// Functions for searching policies, fetching policy details, etc.

import { invokeMCPTool } from './api';
import { Bill, Demographics } from '@/types';

export async function searchPolicies(query: string, policyArea?: string): Promise<Bill[]> {
  return invokeMCPTool<Bill[]>('search_policy', { 
    query: query || undefined, 
    policyArea: policyArea || undefined 
  });
}

export async function getRecentPolicies(): Promise<Bill[]> {
  return invokeMCPTool<Bill[]>('get_recent_policies', {});
}

export async function summarizePolicy(billId: string): Promise<string> {
  return invokeMCPTool<string>('summarize_policy', { billId });
}

export async function explainPolicyImpact(billId: string, demographics: Demographics): Promise<string> {
  return invokeMCPTool<string>('explain_policy_impact', { billId, demographics });
}

