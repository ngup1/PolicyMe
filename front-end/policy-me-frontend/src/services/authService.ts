// Authentication service
import { post } from './api';
import { LoginRequest, LoginResponse } from '@/types';

const BASE_PATH = '/auth';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>(`${BASE_PATH}/login`, credentials);
  },
};

