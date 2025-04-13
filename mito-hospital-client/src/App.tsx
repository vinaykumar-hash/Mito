
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewPatient from "./pages/ViewPatient";
import UploadPatient from "./pages/UploadPatient";
import EmergencyAccess from "./pages/EmergencyAccess";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { HospitalProvider } from "./contexts/HospitalContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is logged in on app startup
  useEffect(() => {
    const hospitalData = localStorage.getItem("hospital");
    if (hospitalData) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HospitalProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
              
              <Route element={<Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}>
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/view" element={isAuthenticated ? <ViewPatient /> : <Navigate to="/login" />} />
                <Route path="/upload" element={isAuthenticated ? <UploadPatient /> : <Navigate to="/login" />} />
                <Route path="/emergency" element={isAuthenticated ? <EmergencyAccess /> : <Navigate to="/login" />} />
              </Route>
              
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HospitalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
