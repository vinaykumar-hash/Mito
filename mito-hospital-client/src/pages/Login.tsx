import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useHospital } from '../contexts/HospitalContext';

// Mock hospital data for authentication
const MOCK_HOSPITALS = [{
  id: '1',
  name: 'General Hospital',
  code: 'GH1234'
}, {
  id: '2',
  name: 'City Medical Center',
  code: 'CMC5678'
}, {
  id: '3',
  name: 'County Hospital',
  code: 'CH9012'
}];
interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}
const Login: React.FC<LoginProps> = ({
  setIsAuthenticated
}) => {
  const [hospitalCode, setHospitalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    setHospital
  } = useHospital();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const hospital = MOCK_HOSPITALS.find(h => h.code === hospitalCode);
      if (hospital) {
        setHospital(hospital);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: `Welcome, ${hospital.name}`,
          variant: "default"
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid hospital code. Please try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-medical-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">H+</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-gray-900">Mito Health </h1>
          <p className="text-gray-600 mt-2">Decentralized Health Records System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Login</CardTitle>
            <CardDescription>
              Enter your hospital access code to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <label htmlFor="hospitalCode" className="text-sm font-medium text-gray-700">
                      Hospital Code
                    </label>
                  </div>
                  <Input id="hospitalCode" placeholder="Enter your hospital code" value={hospitalCode} onChange={e => setHospitalCode(e.target.value)} required className="input-field" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Authenticating...</span>
                  </div> : <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </div>}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>For demonstration, use one of these codes:</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {MOCK_HOSPITALS.map(h => <div key={h.id} className="text-xs p-1 bg-gray-100 rounded">
                {h.code}
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Login;