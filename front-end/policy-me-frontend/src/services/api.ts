// API service layer
// Functions for making API calls to backend
// Note: This file uses fetch, but the main API uses axios. Consider consolidating.

import { toAppError, getErrorMessage } from '@/lib/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const REQUEST_TIMEOUT = 30000; // 30 seconds

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP error! status: ${response.status}` };
    }
    
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }
  
  try {
    return await response.json();
  } catch {
    // If response is not JSON, return empty object
    return {} as T;
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('jwtToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function get<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
      REQUEST_TIMEOUT
    );
    return handleResponse<T>(response);
  } catch (error) {
    throw toAppError(error);
  }
}

export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      REQUEST_TIMEOUT
    );
    return handleResponse<T>(response);
  } catch (error) {
    throw toAppError(error);
  }
}

export async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      REQUEST_TIMEOUT
    );
    return handleResponse<T>(response);
  } catch (error) {
    throw toAppError(error);
  }
}

export async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      REQUEST_TIMEOUT
    );
    return handleResponse<T>(response);
  } catch (error) {
    throw toAppError(error);
  }
}
