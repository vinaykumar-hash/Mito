
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useHospital } from '../contexts/HospitalContext';

interface LayoutProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const { hospital } = useHospital();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <main className="page-container pt-20">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-600 text-sm">
        <div className="page-container">
          <p>© 2025 Health Nexus Access Point - {hospital?.name || 'Hospital Portal'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
