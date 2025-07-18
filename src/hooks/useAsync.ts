import { useState, useEffect, useCallback } from 'react';
import { errorHandler } from '@/lib/error-handler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onError, onSuccess } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: errorObj });
      
      // Log error globally
      errorHandler.logError(errorObj);
      
      if (onError) {
        onError(errorObj);
      } else {
        // Show user-friendly error message
        errorHandler.showUserError('An error occurred. Please try again.');
      }
      
      throw errorObj;
    }
  }, [asyncFunction, onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}

// Hook for handling form submissions with loading states
export function useAsyncCallback<T extends any[], R>(
  callback: (...args: T) => Promise<R>,
  deps: React.DependencyList = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: T): Promise<R | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const result = await callback(...args);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      errorHandler.logError(error);
      errorHandler.showUserError('An error occurred. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, deps);

  return { execute, loading, error, reset: () => setError(null) };
}