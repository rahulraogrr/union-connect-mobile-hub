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
      <img 
        src="/lovable-uploads/09196c45-5ecd-44e8-8d21-50dc215f80dd.png" 
        alt="TEE 1104 Union Logo" 
        className="h-12 w-12 rounded-full bg-primary/10 p-1 animate-pulse"
      />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading Union Connect Hub...</p>
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