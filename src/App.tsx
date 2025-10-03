import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import Timesheet from "./pages/Timesheet";
import Projects from "./pages/Projects";
import Categories from "./pages/Categories";
import Matters from "./pages/Matters";
import Clients from "./pages/Clients";
import LEDESExport from "./pages/LEDESExport";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
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
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
