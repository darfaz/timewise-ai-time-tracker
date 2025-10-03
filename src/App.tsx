import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ConfigProvider, useConfig } from "@/contexts/ConfigContext";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import Dashboard from "./pages/Dashboard";

// Lazy load pages for better performance
const Timeline = lazy(() => import("./pages/Timeline"));
const Timesheet = lazy(() => import("./pages/Timesheet"));
const Projects = lazy(() => import("./pages/Projects"));
const Categories = lazy(() => import("./pages/Categories"));
const Matters = lazy(() => import("./pages/Matters"));
const Clients = lazy(() => import("./pages/Clients"));
const LEDESExport = lazy(() => import("./pages/LEDESExport"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-64" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <Skeleton className="h-96" />
  </div>
);

const AppContent = () => {
  const { uiConfig, onboardingCompleted, completeOnboarding } = useConfig();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding should be shown
    if (!onboardingCompleted && uiConfig.loaded) {
      setShowOnboarding(true);
    }
  }, [onboardingCompleted, uiConfig.loaded]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    completeOnboarding();
  };

  // Show loading state while config is loading
  if (!uiConfig.loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      <CommandPalette />
      <KeyboardShortcuts />
      <OfflineIndicator />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/timesheet" element={<Timesheet />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/matters" element={<Matters />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/ledes-export" element={<LEDESExport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
