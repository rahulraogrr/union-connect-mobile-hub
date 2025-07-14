import { useState, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ConnectPage from "./pages/ConnectPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentsPage from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Toaster />
            <Sonner />
            <LoginPage onLogin={handleLogin} />
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage onLogout={handleLogout} />} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
