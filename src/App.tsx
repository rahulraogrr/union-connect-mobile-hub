import { useState, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ConnectPage from "./pages/ConnectPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentsPage from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import { UserProvider, useUser } from "./contexts/UserContext";
import './i18n';

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
  const isAdminUser = user && ['manager', 'director', 'managing_director', 'super'].includes(user.role);
  const DashboardComponent = isAdminUser ? AdminDashboard : HomePage;

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
