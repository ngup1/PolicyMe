// TypeScript type definitions
// Define interfaces for Policy, User, etc.

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
