import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingBoundary } from "./components/LoadingBoundary";
import LoginPage from "./pages/LoginPage";
import { UserProvider, useUser } from "./contexts/UserContext";
import './i18n';

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TicketsPage = lazy(() => import("./pages/TicketsPage"));
const CreateTicketPage = lazy(() => import("./pages/CreateTicketPage"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));
const ConnectPage = lazy(() => import("./pages/ConnectPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, setUser, user } = useUser();

  const handleLogin = () => {
    // Authentication is now handled by UserContext
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
        <Sonner />
        <LoginPage onLogin={handleLogin} />
      </Suspense>
    );
  }

  // Determine which home page to show based on user role
  const isAdminUser = user && user.roles.some(role => ['manager', 'director', 'managing_director', 'super'].includes(role));
  const DashboardComponent = isAdminUser ? AdminDashboard : HomePage;

  return (
    <LoadingBoundary>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardComponent onLogout={handleLogout} />} />
          <Route path="/tickets" element={<TicketsPage onLogout={handleLogout} />} />
          <Route path="/tickets/new" element={<CreateTicketPage onLogout={handleLogout} />} />
          <Route path="/announcements" element={<AnnouncementsPage onLogout={handleLogout} />} />
          <Route path="/connect" element={<ConnectPage onLogout={handleLogout} />} />
          <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
          <Route path="/payments" element={<PaymentsPage onLogout={handleLogout} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LoadingBoundary>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
