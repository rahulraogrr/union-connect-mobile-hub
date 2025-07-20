import React from 'react';
import { useSystemMetrics } from '@/lib/monitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatBytes, formatDuration } from '@/lib/utils';
import { Activity, Clock, AlertTriangle, Zap } from 'lucide-react';

export const SystemMetrics: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  const metrics = useSystemMetrics();

  const getMemoryStatus = (percentage: number) => {
    if (percentage > 90) return { color: 'text-destructive', status: 'Critical' };
    if (percentage > 70) return { color: 'text-warning', status: 'High' };
    return { color: 'text-success', status: 'Normal' };
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Memory Usage */}
      {metrics.memory && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {metrics.memory.percentage.toFixed(1)}%
                </span>
                <Badge 
                  variant="outline" 
                  className={getMemoryStatus(metrics.memory.percentage).color}
                >
                  {getMemoryStatus(metrics.memory.percentage).status}
                </Badge>
              </div>
              <Progress 
                value={metrics.memory.percentage} 
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.limit)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uptime */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatDuration(metrics.uptime)}
            </div>
            <div className="text-xs text-muted-foreground">
              Since {new Date(Date.now() - metrics.uptime).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Count */}
      {metrics.errors && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Count</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.errors.count}
              </div>
              <div className="text-xs text-muted-foreground">
                {metrics.errors.count === 0 ? 'No recent errors' : 'Recent errors detected'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance */}
      {metrics.performance?.navigation && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.performance.navigation.loadEventEnd - 
                  metrics.performance.navigation.loadEventStart).toFixed(0)}ms
              </div>
              <div className="text-xs text-muted-foreground">
                DOM: {(metrics.performance.navigation.domContentLoadedEventEnd - 
                       metrics.performance.navigation.loadEventStart).toFixed(0)}ms
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Enhanced utils for formatting
declare module '@/lib/utils' {
  export function formatBytes(bytes: number): string;
  export function formatDuration(ms: number): string;
}