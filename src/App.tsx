
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RouteSelection from "./pages/RouteSelection";
import RouteDetails from "./pages/RouteDetails";
import TicketBooking from "./pages/TicketBooking";
import TicketView from "./pages/TicketView";
import TicketsPage from "./pages/TicketsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

// Add safe area inset styles for mobile devices
const AppContainer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Add mobile-specific meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }
    
    // Add status bar color for Android
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#1E1E2F';
      document.head.appendChild(meta);
    }
    
    // Add safe area styles
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --sat: env(safe-area-inset-top, 0px);
        --sar: env(safe-area-inset-right, 0px);
        --sab: env(safe-area-inset-bottom, 0px);
        --sal: env(safe-area-inset-left, 0px);
      }
      
      body {
        padding-top: var(--sat);
        padding-right: var(--sar);
        padding-bottom: var(--sab);
        padding-left: var(--sal);
        -webkit-tap-highlight-color: transparent;
        overscroll-behavior: none;
        touch-action: manipulation;
      }
      
      .app-container {
        width: 100%;
        height: 100%;
        max-width: 100%;
        overflow-x: hidden;
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="app-container">
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/route-selection" element={<RouteSelection />} />
              <Route path="/route-details/:routeId" element={<RouteDetails />} />
              <Route path="/ticket-booking" element={<TicketBooking />} />
              <Route path="/ticket-view" element={<TicketView />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppContainer>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
