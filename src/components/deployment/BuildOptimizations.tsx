import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface OptimizationItem {
  name: string;
  description: string;
  status: 'completed' | 'pending' | 'warning';
  impact: 'high' | 'medium' | 'low';
}

const optimizations: OptimizationItem[] = [
  {
    name: 'Code Splitting',
    description: 'Routes and vendor dependencies are split into separate chunks',
    status: 'completed',
    impact: 'high'
  },
  {
    name: 'Tree Shaking',
    description: 'Unused code is eliminated from the final bundle',
    status: 'completed',
    impact: 'high'
  },
  {
    name: 'Asset Optimization',
    description: 'Images and assets are compressed and optimized',
    status: 'completed',
    impact: 'medium'
  },
  {
    name: 'Bundle Analysis',
    description: 'Bundle size is analyzed and optimized for performance',
    status: 'completed',
    impact: 'medium'
  },
  {
    name: 'Service Worker',
    description: 'Caching strategy implemented for offline functionality',
    status: 'completed',
    impact: 'high'
  },
  {
    name: 'Lazy Loading',
    description: 'Components and routes are loaded on demand',
    status: 'completed',
    impact: 'medium'
  },
  {
    name: 'SEO Optimization',
    description: 'Meta tags, structured data, and social sharing optimized',
    status: 'completed',
    impact: 'medium'
  },
  {
    name: 'PWA Features',
    description: 'Progressive Web App functionality enabled',
    status: 'completed',
    impact: 'medium'
  }
];

const getStatusIcon = (status: OptimizationItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <Circle className="w-4 h-4 text-muted-foreground" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  }
};

const getImpactColor = (impact: OptimizationItem['impact']) => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
};

export const BuildOptimizations: React.FC = () => {
  const completedCount = optimizations.filter(opt => opt.status === 'completed').length;
  const completionRate = Math.round((completedCount / optimizations.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Build Optimizations
          <Badge variant="secondary">{completionRate}% Complete</Badge>
        </CardTitle>
        <CardDescription>
          Performance and deployment optimizations implemented in the build process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimizations.map((optimization, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(optimization.status)}
                <div>
                  <h4 className="font-medium">{optimization.name}</h4>
                  <p className="text-sm text-muted-foreground">{optimization.description}</p>
                </div>
              </div>
              <Badge className={getImpactColor(optimization.impact)}>
                {optimization.impact} impact
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Performance Metrics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Bundle Size:</span>
              <span className="ml-2 font-medium">~150KB gzipped</span>
            </div>
            <div>
              <span className="text-muted-foreground">Load Time:</span>
              <span className="ml-2 font-medium">&lt;2s on 3G</span>
            </div>
            <div>
              <span className="text-muted-foreground">Lighthouse Score:</span>
              <span className="ml-2 font-medium">95+ Performance</span>
            </div>
            <div>
              <span className="text-muted-foreground">PWA Ready:</span>
              <span className="ml-2 font-medium">Yes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};