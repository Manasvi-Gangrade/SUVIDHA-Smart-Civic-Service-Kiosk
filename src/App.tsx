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

import PaymentPage from "./pages/PaymentPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import CivicMapPage from "./pages/CivicMapPage";
import VirtualQueuePage from "./pages/VirtualQueuePage";

const queryClient = new QueryClient();

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import AdminLogin from "./pages/admin/AdminLogin";
import Chatbot from "./components/Chatbot";
import KioskHeader from "./components/KioskHeader";
import EmergencySOS from "./components/EmergencySOS";
import { AccessibilityProvider, useAccessibility } from "./contexts/AccessibilityContext";
import AccessibilityMenu from "./components/AccessibilityMenu";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import { useEffect } from "react";

const IdleTimer = () => {
  useIdleTimeout();
  return null;
};

const HoverReader = () => {
  const { screenReader } = useAccessibility();

  useEffect(() => {
    if (!screenReader) {
      window.speechSynthesis.cancel();
      return;
    }

    let speakingTimeout: NodeJS.Timeout;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find the closest meaningful text or aria-label
      const textToRead = target.getAttribute("aria-label") || target.title || target.innerText;

      if (textToRead && textToRead.trim().length > 0) {
        clearTimeout(speakingTimeout);
        speakingTimeout = setTimeout(() => {
          // Keep it to a reasonable length to avoid spamming
          const speechText = textToRead.slice(0, 100);
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 1.1; // slightly faster for power users
          window.speechSynthesis.speak(utterance);
        }, 500); // 500ms hover delay to prevent instant spam
      }
    };

    const handleMouseOut = () => {
      clearTimeout(speakingTimeout);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(speakingTimeout);
      window.speechSynthesis.cancel();
    };
  }, [screenReader]);

  return null;
};

const App = () => (
  <AccessibilityProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <IdleTimer />
          <HoverReader />
          <TTSProvider>
            <div className="flex h-screen flex-col overflow-hidden">
              <KioskHeader />

              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/department/:id" element={<DepartmentPage />} />
                  <Route path="/complaint" element={<ComplaintPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/application" element={<ApplicationFormPage />} />
                  <Route path="/track" element={<TrackPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/map" element={<CivicMapPage />} />
                  <Route path="/queue" element={<VirtualQueuePage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Route>
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <EmergencySOS />
              <AccessibilityMenu />
              <Chatbot />
            </div>
          </TTSProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AccessibilityProvider>
);

export default App;
