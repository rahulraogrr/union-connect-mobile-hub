import React from 'react';
import { useHealthStatus } from '@/lib/monitoring';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const HealthIndicator: React.FC<{ 
  detailed?: boolean;
  className?: string; 
}> = ({ detailed = false, className = '' }) => {
  const healthStatus = useHealthStatus();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'degraded':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'unhealthy':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success/10 text-success border-success/20';
      case 'degraded':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'unhealthy':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (!detailed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(healthStatus.overall)} ${className}`}
          >
            {getStatusIcon(healthStatus.overall)}
            <span className="ml-1 capitalize">{healthStatus.overall}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {healthStatus.checks.map(check => (
              <div key={check.name} className="flex items-center gap-2 text-sm">
                {getStatusIcon(check.status)}
                <span className="capitalize">{check.name}</span>
                <span className="text-muted-foreground">
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(healthStatus.overall)}
          <span>System Health</span>
          <Badge 
            variant="outline" 
            className={getStatusColor(healthStatus.overall)}
          >
            {healthStatus.overall}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthStatus.checks.map(check => (
            <div 
              key={check.name} 
              className="flex items-center justify-between p-3 rounded-md border"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium capitalize">{check.name}</div>
                  {check.message && (
                    <div className="text-sm text-muted-foreground">
                      {check.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {check.responseTime && (
                  <div>{check.responseTime.toFixed(0)}ms</div>
                )}
                <div>
                  {new Date(check.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};