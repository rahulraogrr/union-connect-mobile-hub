import React, { Suspense, lazy } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';

interface LazyRouteProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ComponentType;
}

const DefaultFallback = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const LazyRoute: React.FC<LazyRouteProps> = ({ 
  component, 
  fallback: CustomFallback = DefaultFallback 
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={<CustomFallback />}>
      <LazyComponent />
    </Suspense>
  );
};

// Pre-configured lazy routes for the app
export const LazyHomePage = () => (
  <LazyRoute component={() => import('../../pages/HomePage')} />
);

export const LazyLoginPage = () => (
  <LazyRoute component={() => import('../../pages/LoginPage')} />
);

export const LazyDashboardPage = () => (
  <LazyRoute component={() => import('../../pages/Index')} />
);

export const LazyProfilePage = () => (
  <LazyRoute component={() => import('../../pages/ProfilePage')} />
);

export const LazyTicketsPage = () => (
  <LazyRoute component={() => import('../../pages/TicketsPage')} />
);

export const LazyAnnouncementsPage = () => (
  <LazyRoute component={() => import('../../pages/AnnouncementsPage')} />
);

export const LazyPaymentsPage = () => (
  <LazyRoute component={() => import('../../pages/PaymentsPage')} />
);

export const LazyConnectPage = () => (
  <LazyRoute component={() => import('../../pages/ConnectPage')} />
);

export const LazyAdminDashboard = () => (
  <LazyRoute component={() => import('../../pages/AdminDashboard')} />
);

export const LazyCreateTicketPage = () => (
  <LazyRoute component={() => import('../../pages/CreateTicketPage')} />
);