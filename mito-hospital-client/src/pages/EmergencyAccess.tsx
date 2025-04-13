
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PatientDataCard from '@/components/PatientDataCard';
import { AlertTriangle, Phone, Key, User, Shield, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock emergency patient data
const MOCK_EMERGENCY_DATA = {
  '1234567890': [
    {
      id: '1',
      recordType: 'Emergency Contact',
      dateCreated: '2024-11-15',
      description: 'Primary emergency contact information and relationship',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h',
    },
    {
      id: '2',
      recordType: 'Allergies & Medical Conditions',
      dateCreated: '2025-01-22',
      description: 'Critical allergies and medical conditions requiring emergency attention',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h',
    },
    {
      id: '3',
      recordType: 'Current Medications',
      dateCreated: '2025-01-22',
      description: 'List of current medications and dosages',
      encryptedData: 'AES256-CBC-ENCRYPTED-0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h',
    },
  ],
};

// Mock emergency PIN data
const MOCK_EMERGENCY_PINS = {
  'EM1234': {
    phoneNumber: '1234567890',
    name: 'John Doe',
    expiryDate: '2025-06-01',
  },
};

const EmergencyAccess: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyPin, setEmergencyPin] = useState('');
  const [activeTab, setActiveTab] = useState('phone');
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [patientInfo, setPatientInfo] = useState<{name?: string, expiryDate?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const handleEmergencyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPatientRecords([]);
    setPatientInfo(null);

    try {
      let response;
      
      if (activeTab === 'phone') {
        // Validate phone number
        if (!/^\d{10}$/.test(phoneNumber)) {
          throw new Error('Please enter a valid 10-digit phone number');
        }

        // Call hospital API endpoint
        response = await fetch('https://00e7-2409-40f2-3148-e1d8-3c04-e640-cdcd-15cc.ngrok-free.app/hospital', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PhoneNumber: phoneNumber
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to request access');
        }

        // Handle the response from your hospital endpoint
        if (result.status === "success") {
          // If permission granted, fetch the emergency data
          const records = MOCK_EMERGENCY_DATA[phoneNumber as keyof typeof MOCK_EMERGENCY_DATA];
          
          if (records) {
            setPatientRecords(records);
            toast({
              title: "Emergency Access Granted",
              description: "Critical patient information retrieved",
              variant: "default",
            });
          } else {
            throw new Error('No emergency data found for this patient');
          }
        } else {
          throw new Error(result.message || 'Permission request failed');
        }
      } else {
        // PIN tab logic remains the same
        if (!/^[A-Za-z0-9]{6}$/.test(emergencyPin)) {
          throw new Error('Please enter a valid 6-character emergency PIN');
        }

        const pinData = MOCK_EMERGENCY_PINS[emergencyPin as keyof typeof MOCK_EMERGENCY_PINS];
        
        if (pinData) {
          const { phoneNumber, name, expiryDate } = pinData;
          const records = MOCK_EMERGENCY_DATA[phoneNumber as keyof typeof MOCK_EMERGENCY_DATA] || [];
          setPatientRecords(records);
          setPatientInfo({ name, expiryDate });
          
          toast({
            title: "Emergency PIN Accepted",
            description: `Retrieved data for patient: ${name}`,
            variant: "default",
          });
        } else {
          throw new Error('Invalid emergency PIN');
        }
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: "Access Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 mb-3">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Emergency Access</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Patient Access</h1>
        <p className="text-gray-600 mt-1">
          Quickly retrieve critical patient information in emergency situations
        </p>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardHeader className="bg-amber-50 rounded-t-lg border-b border-amber-100">
          <CardTitle className="flex items-center text-amber-800">
            <Shield className="h-5 w-5 mr-2 text-amber-600" />
            Emergency Information Access
          </CardTitle>
          <CardDescription className="text-amber-700">
            This access method is for emergency situations only and will be logged
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="phone" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </TabsTrigger>
              <TabsTrigger value="pin" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Emergency PIN
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleEmergencyAccess}>
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="emergencyPhone" className="flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-1 h-4 w-4 text-gray-500" />
                    Patient Phone Number
                  </label>
                  <Input
                    id="emergencyPhone"
                    placeholder="Enter 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500">
                    For demo purposes, use: 1234567890
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="pin" className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="emergencyPin" className="flex items-center text-sm font-medium text-gray-700">
                    <Key className="mr-1 h-4 w-4 text-gray-500" />
                    Emergency Access PIN
                  </label>
                  <Input
                    id="emergencyPin"
                    placeholder="Enter 6-character emergency PIN"
                    value={emergencyPin}
                    onChange={(e) => setEmergencyPin(e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500">
                    For demo purposes, use: EM1234
                  </p>
                </div>
              </TabsContent>
              
              {error && (
                <div className="rounded-md bg-red-50 p-3 border border-red-200 mt-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Accessing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Emergency Access</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {patientInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <User className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Patient Information</h3>
              <p className="text-sm text-blue-700">Name: {patientInfo.name}</p>
              <p className="text-sm text-blue-700">PIN Expiry: {patientInfo.expiryDate}</p>
            </div>
          </div>
        </div>
      )}

      {patientRecords.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-amber-500 mr-2" size={20} />
            <h2 className="text-xl font-semibold text-amber-800">
              Emergency Records
              <span className="ml-2 text-sm font-normal text-amber-700">
                (Critical Information Only)
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
    </div>
  );
};

export default EmergencyAccess;
