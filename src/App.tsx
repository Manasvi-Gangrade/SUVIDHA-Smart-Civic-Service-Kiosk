import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { Component, ErrorInfo, ReactNode } from "react";

import Index from "./pages/Index";
import ComplaintPage from "./pages/ComplaintPage";
import TrackPage from "./pages/TrackPage";
import DepartmentPage from "./pages/DepartmentPage";
import DepartmentsGrid from "./pages/DepartmentsGrid";
import DashboardPage from "./pages/DashboardPage";
import AdminLogin from "./pages/admin/AdminLogin";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import CivicMapPage from "./pages/CivicMapPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { OrganizationAuth } from "./pages/OrganizationAuth";
import PaymentPortal from "./pages/PaymentPortal";
import VirtualQueuePage from "./pages/VirtualQueuePage";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Chatbot from "./components/Chatbot";
import KioskHeader from "./components/KioskHeader";
import VirtualHelpdesk from "./components/VirtualHelpdesk";
import { ScreenMagnifier } from "./components/ScreenMagnifier";
import SystemSettings from "./components/SystemSettings";

import { AccessibilityProvider, useAccessibility } from "./contexts/AccessibilityContext";
import AccessibilityMenu from "./components/AccessibilityMenu";
import { useEffect } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard";
import { useSwipeGestures } from "./hooks/useSwipeGestures";
import { IdleScreensaver } from "./components/IdleScreensaver";
import { TTSProvider } from "./context/TTSContext";
import { VoiceAssistantProvider } from "./context/VoiceAssistantContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Global gesture handler component
const GestureHandler = ({ children }: { children: React.ReactNode }) => {
  useSwipeGestures();
  return <>{children}</>;
};

// Font size wrapper component
const FontSizeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { textSize } = useAccessibility();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-normal', 'text-large', 'text-xlarge');
    html.classList.add(`text-${textSize}`);
  }, [textSize]);

  return <>{children}</>;
};

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', backgroundColor: '#991b1b', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Application Crashed (Runtime Error)</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Please copy this error and show it to the AI:</p>
          <div style={{ backgroundColor: '#7f1d1d', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{this.state.error?.toString()}</h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>
              {this.state.error?.stack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '4px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <GestureHandler>
      <ScreenMagnifier />
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        {!isAdminPage && <KioskHeader />}
        <main className="flex-1 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/complaint" element={<ComplaintPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/departments" element={<DepartmentsGrid />} />
            <Route path="/auth/:id" element={<OrganizationAuth />} />
            <Route path="/department/:id" element={<DepartmentPage />} />
            <Route path="/application" element={<ApplicationFormPage />} />
            <Route path="/map" element={<CivicMapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/payment" element={<PaymentPortal />} />
            <Route path="/queue" element={<VirtualQueuePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminPage && <IdleScreensaver />}
        <VirtualKeyboard />
        
        {/* Global Action Dock */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-row items-center gap-4 justify-end pointer-events-none [&>*]:pointer-events-auto">
          <AccessibilityMenu />
          <VirtualHelpdesk />
          <Chatbot />
          <SystemSettings />
        </div>
      </div>
    </GestureHandler>
  );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
            <AccessibilityProvider>
            <FontSizeWrapper>
              <TooltipProvider>
                <Toaster />
                <Sonner position="top-center" toastOptions={{ className: 'kiosk-toast' }} />
                <BrowserRouter>
                  <TTSProvider>
                  <VoiceAssistantProvider>
                    <AppContent />
                  </VoiceAssistantProvider>
                  </TTSProvider>
                </BrowserRouter>
              </TooltipProvider>
            </FontSizeWrapper>
        </AccessibilityProvider>
        </ErrorBoundary>
    </QueryClientProvider>
);

export default App;
