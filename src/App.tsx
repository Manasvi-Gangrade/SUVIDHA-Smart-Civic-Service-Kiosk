import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartmentPage from "./pages/DepartmentPage";
import ComplaintPage from "./pages/ComplaintPage";
import TrackPage from "./pages/TrackPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { TTSProvider } from "./context/TTSContext";

const queryClient = new QueryClient();

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import AdminLogin from "./pages/admin/AdminLogin";
import Chatbot from "./components/Chatbot";
import KioskHeader from "./components/KioskHeader";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TTSProvider>
          <div className="flex h-screen flex-col overflow-hidden">
            <KioskHeader />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/department/:id" element={<DepartmentPage />} />
                <Route path="/complaint" element={<ComplaintPage />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </main>
          </div>
        </TTSProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
