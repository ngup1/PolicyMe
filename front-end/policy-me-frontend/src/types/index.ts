// TypeScript type definitions
// Define interfaces for Policy, User, etc.

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string | null;
  userId: number | null;
  success: boolean;
}

// Existing types for Congress API
export interface Bill {
  // Add bill properties as needed
}

export interface BillDetails {
  // Add bill details properties as needed
}

export interface CongressApiParams {
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  // Add API response structure as needed
  data?: T;
}
