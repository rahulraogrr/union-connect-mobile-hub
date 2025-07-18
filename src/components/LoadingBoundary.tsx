import React, { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
}

const DefaultLoader = ({ minHeight = "200px" }: { minHeight?: string }) => (
  <div className="flex items-center justify-center p-8" style={{ minHeight }}>
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({ 
  children, 
  fallback,
  minHeight 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultLoader minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
};