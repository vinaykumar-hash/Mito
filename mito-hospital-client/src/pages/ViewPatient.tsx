
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PatientDataCard from '@/components/PatientDataCard';
import { Search, AlertCircle, User, AlarmCheck } from 'lucide-react';

// Mock patient data
const MOCK_PATIENT_RECORDS = {
  '1234567890': [
    {
      id: '1',
      recordType: 'Medical History',
      dateCreated: '2024-11-15',
      description: 'Complete medical history including allergies and chronic conditions',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h',
    },
    {
      id: '2',
      recordType: 'Lab Results',
      dateCreated: '2025-01-22',
      description: 'Blood work results from routine checkup',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h',
    },
  ],
  '8595563855': [
    {
      id: '3',
      recordType: 'Surgical Procedure',
      dateCreated: '2024-12-05',
      description: 'Details of appendectomy procedure and recovery notes',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1z0y9x8w7v6u5t4s3r2q1p0o9n8m7l6k5j4i3h2g1f0e9d8c7b6a5z4y3x2w1v0u',
    },
  ],
};

const ViewPatient: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchedPhone, setSearchedPhone] = useState('');
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
    try {
      const response = await fetch('https://907f-103-89-232-66.ngrok-free.app/hospital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PhoneNumber: phoneNumber, // Replace with actual phone number
          // Add other required parameters from your endpoint
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      
    } catch (error) {
      console.error("Error calling hospital endpoint:", error);
      throw error;
    }
    
    
    // Validate phone number format (simple validation for demo)
    // if (!/^\d{10}$/.test(phoneNumber)) {
    //   setError('Please enter a valid 10-digit phone number');
    //   setIsLoading(false);
    //   return;
    // }

    // Simulate API call with timeout
    setTimeout(() => {
      const records = MOCK_PATIENT_RECORDS[phoneNumber as keyof typeof MOCK_PATIENT_RECORDS] || [];
      
      if (records.length === 0) {
        setError('No records found for this patient');
        toast({
          title: "No Records Found",
          description: "There are no patient records associated with this phone number",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Records Retrieved",
          description: `Found ${records.length} records for this patient`,
          variant: "default",
        });
      }
      
      setPatientRecords(records);
      setSearchedPhone(phoneNumber);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">View Patient Data</h1>
        <p className="text-gray-600 mt-1">
          Access encrypted patient records securely
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Patient Lookup</CardTitle>
          <CardDescription>
            Enter the patient's phone number to retrieve their records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="phoneNumber" className="flex items-center text-sm font-medium text-gray-700">
                <User className="mr-1 h-4 w-4 text-gray-500" />
                Patient Phone Number
              </label>
              <div className="flex space-x-2">
                <Input
                  id="phoneNumber"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 input-field"
                />
                <Button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                For demo, try with: 1234567890 or 9876543210
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {searchedPhone && patientRecords.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">
              Patient Records
              <span className="ml-2 text-sm font-normal text-gray-500">
                (+{patientRecords.length} records)
              </span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {patientRecords.map((record) => (
              <PatientDataCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      )}

      {searchedPhone && patientRecords.length === 0 && !isLoading && (
        <div className="rounded-lg bg-amber-50 p-6 border border-amber-200 flex items-center">
          <AlertCircle className="h-6 w-6 text-amber-500 mr-3" />
          <div>
            <h3 className="font-semibold text-amber-800">No Records Found</h3>
            <p className="text-amber-700">
              No patient records were found for phone number {searchedPhone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPatient;
