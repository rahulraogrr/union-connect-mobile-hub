import { toast } from '@/hooks/use-toast';

export interface ErrorLogEntry {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
}

class ErrorHandler {
  private errors: ErrorLogEntry[] = [];
  private maxErrors = 50; // Keep last 50 errors in memory

  public logError(error: Error | string, context?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const logEntry: ErrorLogEntry = {
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add to local storage for debugging
    this.errors.unshift(logEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Handler');
      console.error('Error:', errorMessage);
      if (errorStack) console.error('Stack:', errorStack);
      if (context) console.error('Context:', context);
      console.groupEnd();
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(logEntry, context);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('app_errors', JSON.stringify(this.errors.slice(0, 10)));
    } catch (e) {
      console.warn('Failed to store errors in localStorage');
    }
  }

  public showUserError(message: string, title = 'Error') {
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
  }

  public showUserSuccess(message: string, title = 'Success') {
    toast({
      title,
      description: message,
    });
  }

  public getRecentErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  public clearErrors() {
    this.errors = [];
    localStorage.removeItem('app_errors');
  }

  private async sendToMonitoring(error: ErrorLogEntry, context?: Record<string, any>) {
    // In a real app, send to services like Sentry, LogRocket, etc.
    // For now, we'll just log it
    console.log('Would send to monitoring:', { error, context });
  }
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  errorHandler.logError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

export const errorHandler = new ErrorHandler();

// Utility functions for common error scenarios
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue?: T,
  errorMessage?: string
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.logError(error as Error);
    if (errorMessage) {
      errorHandler.showUserError(errorMessage);
    }
    return fallbackValue;
  }
};

export const withErrorBoundary = <T extends any[]>(
  fn: (...args: T) => any,
  errorMessage?: string
) => {
  return (...args: T) => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler.logError(error as Error);
      if (errorMessage) {
        errorHandler.showUserError(errorMessage);
      }
    }
  };
};