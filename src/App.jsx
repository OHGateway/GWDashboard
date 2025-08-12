import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import TykApis from "./pages/tyk/Apis";
import TykHealthCheck from "./pages/tyk/HealthCheck";
import TykCerts from "./pages/tyk/Certs";
import TykRequest from "./pages/tyk/Request";
import ScgRoutes from "./pages/scg/Routes";
import ScgHealthCheck from "./pages/scg/HealthCheck";
import ScgTokenIssuer from "./pages/scg/TokenIssuer";
import ScgRequest from "./pages/scg/Request";
import JiraCalendar from "./pages/admin/JiraCalendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HelmetProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              <Route path="/tyk/apis" element={<TykApis />} />
              <Route path="/tyk/health-check" element={<TykHealthCheck />} />
              <Route path="/tyk/certs" element={<ProtectedRoute><TykCerts /></ProtectedRoute>} />
              <Route path="/tyk/request" element={<TykRequest />} />

              <Route path="/scg/routes" element={<ScgRoutes />} />
              <Route path="/scg/health-check" element={<ScgHealthCheck />} />
              <Route path="/scg/token-issuer" element={<ProtectedRoute><ScgTokenIssuer /></ProtectedRoute>} />
              <Route path="/scg/request" element={<ScgRequest />} />

              <Route path="/admin/jira-calendar" element={<ProtectedRoute><JiraCalendar /></ProtectedRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </HelmetProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
