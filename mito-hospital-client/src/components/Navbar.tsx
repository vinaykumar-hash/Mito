
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHospital } from '../contexts/HospitalContext';
import { useState } from 'react';

interface NavbarProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
  const { hospital, logout } = useHospital();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/view', label: 'View Patient Data' },
    { path: '/upload', label: 'Upload Patient Data' },
    { path: '/emergency', label: 'Emergency Access' },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-medical-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold">H+</span>
              </div>
              <span className="font-semibold text-xl text-gray-800">Mito</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-medical-50 text-medical-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center">
                <User size={16} className="text-medical-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{hospital?.name || 'Hospital'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 border-gray-300"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 shadow-lg animate-fade-in">
          <div className="page-container space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-medical-50 text-medical-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center">
                  <User size={16} className="text-medical-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{hospital?.name || 'Hospital'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2 w-full text-gray-700 border-gray-300"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
