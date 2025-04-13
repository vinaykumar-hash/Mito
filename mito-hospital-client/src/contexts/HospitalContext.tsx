
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for our context
type Hospital = {
  id: string;
  name: string;
  code: string;
};

type HospitalContextType = {
  hospital: Hospital | null;
  setHospital: (hospital: Hospital | null) => void;
  logout: () => void;
};

// Create the context
const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// Create a provider component
export const HospitalProvider = ({ children }: { children: ReactNode }) => {
  const [hospital, setHospital] = useState<Hospital | null>(null);

  // Load hospital data from localStorage on mount
  useEffect(() => {
    const savedHospital = localStorage.getItem('hospital');
    if (savedHospital) {
      setHospital(JSON.parse(savedHospital));
    }
  }, []);

  // Save hospital data to localStorage when it changes
  useEffect(() => {
    if (hospital) {
      localStorage.setItem('hospital', JSON.stringify(hospital));
    }
  }, [hospital]);

  const logout = () => {
    localStorage.removeItem('hospital');
    setHospital(null);
  };

  return (
    <HospitalContext.Provider value={{ hospital, setHospital, logout }}>
      {children}
    </HospitalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
