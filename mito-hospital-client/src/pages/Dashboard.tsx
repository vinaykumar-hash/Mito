
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Upload, AlertTriangle } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';

const Dashboard: React.FC = () => {
  const { hospital } = useHospital();
  const navigate = useNavigate();

  // Mock statistics for demonstration purposes
  const stats = {
    patientsAccessed: 142,
    recordsUploaded: 37,
    emergencyAccessCount: 5,
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {hospital?.name}</h1>
        <p className="text-gray-600 mt-1">{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Patients Accessed</p>
          <p className="text-3xl font-bold mt-2">{stats.patientsAccessed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Records Uploaded</p>
          <p className="text-3xl font-bold mt-2">{stats.recordsUploaded}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <p className="text-gray-500 text-sm">Emergency Access</p>
          <p className="text-3xl font-bold mt-2">{stats.emergencyAccessCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">View Patient Data</CardTitle>
            <CardDescription>Access existing patient records securely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-medical-50 p-4 flex justify-center items-center">
              <Eye size={48} className="text-medical-500" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-medical-500 hover:bg-medical-600 text-white"
              onClick={() => navigate('/view')}
            >
              Access Records
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Upload Patient Data</CardTitle>
            <CardDescription>Add new records to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-medical-50 p-4 flex justify-center items-center">
              <Upload size={48} className="text-medical-500" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-medical-500 hover:bg-medical-600 text-white"
              onClick={() => navigate('/upload')}
            >
              Upload Data
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Emergency Access</CardTitle>
            <CardDescription>Quick access for emergency situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-amber-50 p-4 flex justify-center items-center">
              <AlertTriangle size={48} className="text-amber-500" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => navigate('/emergency')}
            >
              Emergency Records
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
