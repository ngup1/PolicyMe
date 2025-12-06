// Authentication service
import { post } from './api';
import { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '@/types';

const BASE_PATH = '/auth';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>(`${BASE_PATH}/login`, credentials);
  },

  /**
   * Sign up with email and password
   */
  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    return post<SignUpResponse>(`${BASE_PATH}/signup`, userData);
  },
};


