// Application monitoring and health checks
import { errorHandler } from './error-handler';
import { performanceMonitor } from './performance';
import { analytics } from './analytics';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: number;
  responseTime?: number;
}

export interface SystemMetrics {
  memory?: {
    used: number;
    limit: number;
    percentage: number;
  };
  performance?: {
    navigation?: PerformanceNavigationTiming;
    resources?: PerformanceResourceTiming[];
  };
  errors?: {
    count: number;
    recent: any[];
  };
  uptime: number;
}

class ApplicationMonitor {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private startTime: number = Date.now();
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring = false;

  // Start monitoring
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.registerBasicChecks();
    
    // Run health checks every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.runHealthChecks();
    }, 30000);

    // Initial health check
    this.runHealthChecks();

    console.log('🔍 Application monitoring started');
  }

  // Stop monitoring
  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.isMonitoring = false;
    console.log('🔍 Application monitoring stopped');
  }

  // Register basic health checks
  private registerBasicChecks() {
    // Memory usage check
    this.registerHealthCheck('memory', async () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (percentage > 90) {
          return { status: 'unhealthy', message: `Memory usage critical: ${percentage.toFixed(1)}%` };
        } else if (percentage > 70) {
          return { status: 'degraded', message: `Memory usage high: ${percentage.toFixed(1)}%` };
        }
        
        return { status: 'healthy', message: `Memory usage normal: ${percentage.toFixed(1)}%` };
      }
      return { status: 'healthy', message: 'Memory monitoring not available' };
    });

    // Error rate check
    this.registerHealthCheck('errors', async () => {
      const recentErrors = errorHandler.getRecentErrors();
      const errorCount = recentErrors.length;
      
      if (errorCount > 10) {
        return { status: 'unhealthy', message: `High error rate: ${errorCount} errors` };
      } else if (errorCount > 5) {
        return { status: 'degraded', message: `Elevated error rate: ${errorCount} errors` };
      }
      
      return { status: 'healthy', message: `Error rate normal: ${errorCount} errors` };
    });

    // Performance check
    this.registerHealthCheck('performance', async () => {
      const metrics = performanceMonitor.getMetrics();
      const slowOperations = Object.entries(metrics).filter(([, duration]) => duration > 2000);
      
      if (slowOperations.length > 3) {
        return { status: 'degraded', message: `Multiple slow operations detected` };
      } else if (slowOperations.length > 0) {
        return { status: 'degraded', message: `${slowOperations.length} slow operation(s)` };
      }
      
      return { status: 'healthy', message: 'Performance normal' };
    });

    // Local storage check
    this.registerHealthCheck('storage', async () => {
      try {
        const testKey = '__monitor_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return { status: 'healthy', message: 'Storage accessible' };
      } catch (error) {
        return { status: 'unhealthy', message: 'Storage not accessible' };
      }
    });
  }

  // Register a custom health check
  registerHealthCheck(
    name: string, 
    check: () => Promise<{ status: 'healthy' | 'unhealthy' | 'degraded'; message?: string }>
  ) {
    // Store the check function for later execution
    (this as any)[`_check_${name}`] = check;
  }

  // Run all health checks
  private async runHealthChecks() {
    const checkPromises = Array.from(Object.keys(this))
      .filter(key => key.startsWith('_check_'))
      .map(async (key) => {
        const name = key.replace('_check_', '');
        const check = (this as any)[key];
        
        const startTime = performance.now();
        try {
          const result = await check();
          const responseTime = performance.now() - startTime;
          
          const healthCheck: HealthCheck = {
            name,
            status: result.status,
            message: result.message,
            timestamp: Date.now(),
            responseTime,
          };
          
          this.healthChecks.set(name, healthCheck);
          
          // Log unhealthy checks
          if (result.status !== 'healthy') {
            console.warn(`⚠️ Health check "${name}" is ${result.status}: ${result.message}`);
            analytics.track('health_check_warning', {
              check: name,
              status: result.status,
              message: result.message,
            });
          }
          
        } catch (error) {
          const healthCheck: HealthCheck = {
            name,
            status: 'unhealthy',
            message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: Date.now(),
            responseTime: performance.now() - startTime,
          };
          
          this.healthChecks.set(name, healthCheck);
          errorHandler.logError(error as Error, { healthCheck: name });
        }
      });

    await Promise.all(checkPromises);
  }

  // Get current health status
  getHealthStatus(): { overall: 'healthy' | 'unhealthy' | 'degraded'; checks: HealthCheck[] } {
    const checks = Array.from(this.healthChecks.values());
    
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');
    
    let overall: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (hasUnhealthy) {
      overall = 'unhealthy';
    } else if (hasDegraded) {
      overall = 'degraded';
    }
    
    return { overall, checks };
  }

  // Get system metrics
  getSystemMetrics(): SystemMetrics {
    const metrics: SystemMetrics = {
      uptime: Date.now() - this.startTime,
    };

    // Memory information
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memory = {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }

    // Performance information
    if ('getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      metrics.performance = {
        navigation,
        resources: resources.slice(-10), // Last 10 resources
      };
    }

    // Error information
    const recentErrors = errorHandler.getRecentErrors();
    metrics.errors = {
      count: recentErrors.length,
      recent: recentErrors.slice(0, 5), // Last 5 errors
    };

    return metrics;
  }

  // Generate monitoring report
  generateReport(): {
    timestamp: number;
    health: ReturnType<typeof this.getHealthStatus>;
    metrics: SystemMetrics;
    performance: Record<string, number>;
  } {
    return {
      timestamp: Date.now(),
      health: this.getHealthStatus(),
      metrics: this.getSystemMetrics(),
      performance: performanceMonitor.getMetrics(),
    };
  }

  // Check if monitoring is active
  isActive(): boolean {
    return this.isMonitoring;
  }
}

// Singleton instance
export const applicationMonitor = new ApplicationMonitor();

// React hook for monitoring
import { useEffect, useState } from 'react';

export const useHealthStatus = (intervalMs = 10000) => {
  const [healthStatus, setHealthStatus] = useState(applicationMonitor.getHealthStatus());

  useEffect(() => {
    const updateStatus = () => {
      setHealthStatus(applicationMonitor.getHealthStatus());
    };

    updateStatus(); // Initial update
    const interval = setInterval(updateStatus, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return healthStatus;
};

export const useSystemMetrics = (intervalMs = 5000) => {
  const [metrics, setMetrics] = useState(applicationMonitor.getSystemMetrics());

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(applicationMonitor.getSystemMetrics());
    };

    updateMetrics(); // Initial update
    const interval = setInterval(updateMetrics, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return metrics;
};

// Initialize monitoring when the module loads
if (typeof window !== 'undefined') {
  // Start monitoring after a short delay to let the app initialize
  setTimeout(() => {
    applicationMonitor.start();
  }, 1000);
}