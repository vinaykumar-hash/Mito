
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /dashboard or /login based on authentication status
    const hospital = localStorage.getItem("hospital");
    const redirectPath = hospital ? "/dashboard" : "/login";
    
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-xl bg-medical-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">H+</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Health Nexus</h1>
        <p className="text-xl text-gray-600 mb-8">Decentralized Health Records System</p>
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
};

export default Index;
