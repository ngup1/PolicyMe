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
  success: boolean;
  message: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  success: boolean;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface User {
  userId : string;
  email : string;
  firstName: string;
  lastName : string;
  createdDate: string;
  profilePicture: string;

}