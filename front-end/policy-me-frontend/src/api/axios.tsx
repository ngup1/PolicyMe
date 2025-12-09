import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import { toAppError, UnauthorizedError } from "@/lib/error-handler";
import { toast } from "sonner";

const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwtToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const appError = toAppError(error);

    // Handle unauthorized errors - clear token and redirect
    if (appError instanceof UnauthorizedError) {
      localStorage.removeItem("jwtToken");
      // Only show toast if we're not already on login/signup pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        toast.error(appError.message);
      }
    }

    // Don't show toast for network errors in background requests
    // Components should handle their own error display
    return Promise.reject(appError);
  }
);

export default api;