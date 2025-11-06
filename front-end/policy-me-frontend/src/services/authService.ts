// Authentication service
import { post } from './api';
import { LoginRequest, LoginResponse } from '@/types';

const BASE_PATH = '/api/auth';

export const authService = {
  /**
   * Login with username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>(`${BASE_PATH}/login`, credentials);
  },
};

