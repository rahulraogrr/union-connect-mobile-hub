// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure function execution time
  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    });
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    }
  }

  // Start a manual measurement
  startMeasurement(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  private recordMetric(name: string, duration: number) {
    this.metrics.set(name, duration);
    
    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && duration > 2000) {
      this.reportSlowOperation(name, duration);
    }
  }

  private reportSlowOperation(name: string, duration: number) {
    // Report to monitoring service (e.g., Sentry, DataDog)
    console.log(`Reporting slow operation: ${name} - ${duration}ms`);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

// Web Vitals monitoring
export const reportWebVitals = (metric: any) => {
  console.log('Web Vital:', metric);
  
  // In production, send to analytics
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    // analytics.track('web_vital', metric);
  }
};

// Image loading optimization
export const createOptimizedImageLoader = () => {
  const imageCache = new Map<string, HTMLImageElement>();
  
  return {
    preload: (src: string): Promise<HTMLImageElement> => {
      if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
      }

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache.set(src, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    },
    
    getFromCache: (src: string) => imageCache.get(src),
    clearCache: () => imageCache.clear(),
  };
};

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();