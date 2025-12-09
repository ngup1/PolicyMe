// Custom hook for consistent error handling in components

import { useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage, AppError } from '@/lib/error-handler';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: AppError) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = true,
    logError = true,
    onError,
  } = options;

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const appError = error instanceof AppError ? error : new AppError(getErrorMessage(error));
    
    if (logError) {
      console.error('Error handled:', appError);
    }

    if (onError) {
      onError(appError);
    }

    if (showToast) {
      const message = customMessage || appError.message;
      toast.error(message);
    }

    return appError;
  }, [showToast, logError, onError]);

  return { handleError };
}

