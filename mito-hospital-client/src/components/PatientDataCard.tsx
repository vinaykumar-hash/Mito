
import React from 'react';
import { CalendarClock, FileText, Shield } from 'lucide-react';

interface PatientRecord {
  id: string;
  recordType: string;
  dateCreated: string;
  description: string;
  encryptedData: string;
}

interface PatientDataCardProps {
  record: PatientRecord;
}

const PatientDataCard: React.FC<PatientDataCardProps> = ({ record }) => {
  return (
    <div className="health-card mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <FileText className="text-medical-500 mr-2" size={20} />
          <h3 className="font-medium text-gray-900">{record.recordType}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarClock className="mr-1" size={14} />
          <span>{new Date(record.dateCreated).toLocaleDateString()}</span>
        </div>
      </div>
      
      <p className="mt-2 text-gray-600">{record.description}</p>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <Shield className="mr-1" size={12} />
          <span>Encrypted Data</span>
        </div>
        <p className="font-mono text-xs text-gray-700 break-all">{record.encryptedData.substring(0, 100)}...</p>
      </div>
    </div>
  );
};

export default PatientDataCard;
