import React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload, AlertCircle, Phone, FileText, CheckCircle } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';

const UploadPatient: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recordType, setRecordType] = useState('');
  const [patientData, setPatientData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { hospital } = useHospital();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
  
    // Validate inputs
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }
  
    if (!selectedFile) {
      setError('Please select a PDF file to upload');
      setIsLoading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      // Make sure this matches exactly what your backend expects
      formData.append('phoneNumber', phoneNumber); 
  
      const response = await fetch('https://907f-103-89-232-66.ngrok-free.app/hospital/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - the browser will do it automatically with the correct boundary
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
  
      setIsSuccess(true);
      toast({
        title: "Upload Successful",
        description: "Patient file has been uploaded and encrypted",
        variant: "default",
      });
  
      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPhoneNumber('');
      setRecordType('');
      setPatientData('');
    } catch (err) {
      setError(err.message || 'Failed to upload file');
      toast({
        title: "Upload Failed",
        description: err.message || "Could not upload patient file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Patient Data</h1>
        <p className="text-gray-600 mt-1">
          Add new encrypted records to the health nexus
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Patient Record</CardTitle>
          <CardDescription>
            The data will be encrypted before storage and only accessible to authorized parties
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpload}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="mr-1 h-4 w-4 text-gray-500" />
                Patient Phone Number
              </label>
              <Input
                id="phoneNumber"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="recordType" className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="mr-1 h-4 w-4 text-gray-500" />
                Record Type
              </label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical_history">Medical History</SelectItem>
                  <SelectItem value="lab_results">Lab Results</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="surgical_procedure">Surgical Procedure</SelectItem>
                  <SelectItem value="imaging">Imaging/Scans</SelectItem>
                  <SelectItem value="diagnosis">Diagnosis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="patientData" className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="mr-1 h-4 w-4 text-gray-500" />
                Patient Data
              </label>
              <Textarea
                id="patientData"
                placeholder="Enter detailed patient information..."
                value={patientData}
                onChange={(e) => setPatientData(e.target.value)}
                className="input-field min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                This data will be encrypted before storage
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="rounded-md bg-green-50 p-3 border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm text-green-700">Record uploaded successfully</p>
                </div>
              </div>
            )}
          </CardContent>
          <div className="space-y-1.5">
      <label htmlFor="patientFile" className="flex items-center text-sm font-medium text-gray-700">
        <FileText className="mr-1 h-4 w-4 text-gray-500" />
        Patient File (PDF only)
      </label>
      <Input
        id="patientFile"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="input-field"
      />
      {selectedFile && (
        <div className="text-sm text-gray-600 mt-1">
          Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </div>
      )}
      <p className="text-xs text-gray-500">
        PDF files only (max 10MB)
      </p>
    </div>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              // onClick={handleReset}
              className="btn-secondary"
              disabled={isLoading}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Upload Record</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UploadPatient;
