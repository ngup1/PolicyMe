// Congress.gov API service
import { get } from './api';
import { Bill, BillDetails, CongressApiParams, ApiResponse } from '@/types';

const BASE_PATH = '/api/congress';

export const congressService = {
  /**
   * Get a list of bills sorted by date of latest action
   */
  async getBills(params?: CongressApiParams): Promise<ApiResponse<Bill>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill${queryString ? '?' + queryString : ''}`;
    
    return get<ApiResponse<Bill>>(endpoint);
  },

  /**
   * Get bills for a specific congress
   */
  async getBillsByCongress(congress: number, params?: CongressApiParams): Promise<ApiResponse<Bill>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill/${congress}${queryString ? '?' + queryString : ''}`;
    
    return get<ApiResponse<Bill>>(endpoint);
  },

  /**
   * Get bills by congress and type (e.g., HR, S, HRES, etc.)
   */
  async getBillsByType(congress: number, billType: string, params?: CongressApiParams): Promise<ApiResponse<Bill>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}${queryString ? '?' + queryString : ''}`;
    
    return get<ApiResponse<Bill>>(endpoint);
  },

  /**
   * Get detailed information for a specific bill
   */
  async getBillDetails(congress: number, billType: string, billNumber: string): Promise<BillDetails> {
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}`;
    return get<BillDetails>(endpoint);
  },

  /**
   * Get actions for a specific bill
   */
  async getBillActions(congress: number, billType: string, billNumber: string, params?: CongressApiParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/actions${queryString ? '?' + queryString : ''}`;
    
    return get<any>(endpoint);
  },

  /**
   * Get amendments for a specific bill
   */
  async getBillAmendments(congress: number, billType: string, billNumber: string, params?: CongressApiParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/amendments${queryString ? '?' + queryString : ''}`;
    
    return get<any>(endpoint);
  },

  /**
   * Get committees associated with a specific bill
   */
  async getBillCommittees(congress: number, billType: string, billNumber: string): Promise<any> {
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/committees`;
    return get<any>(endpoint);
  },

  /**
   * Get cosponsors for a specific bill
   */
  async getBillCosponsors(congress: number, billType: string, billNumber: string, params?: CongressApiParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/cosponsors${queryString ? '?' + queryString : ''}`;
    
    return get<any>(endpoint);
  },

  /**
   * Get related bills for a specific bill
   */
  async getRelatedBills(congress: number, billType: string, billNumber: string): Promise<any> {
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/relatedbills`;
    return get<any>(endpoint);
  },

  /**
   * Get subjects for a specific bill
   */
  async getBillSubjects(congress: number, billType: string, billNumber: string): Promise<any> {
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/subjects`;
    return get<any>(endpoint);
  },

  /**
   * Get summaries for a specific bill
   */
  async getBillSummaries(congress: number, billType: string, billNumber: string): Promise<any> {
    const endpoint = `${BASE_PATH}/bill/${congress}/${billType}/${billNumber}/summaries`;
    return get<any>(endpoint);
  },
};

