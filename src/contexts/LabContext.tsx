import React, { createContext, useContext, useState } from 'react';

export interface LabReportRecord {
  id: string;
  batchNo: string;
  technician: string;
  supplierName: string;
  quantity: number;
  fat: number;
  snf: number;
  lr: number;
  ts: number;
  totalTs: number;
  pricePerLiter: number;
  totalPayable: number;
  result: string;
  date: string;
  time: string;
  basicPrice?: number;
}

interface LabContextType {
  labReports: LabReportRecord[];
  addLabReport: (report: Omit<LabReportRecord, 'id' | 'date' | 'time'>) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [labReports, setLabReports] = useState<LabReportRecord[]>([]);

  const addLabReport = (report: Omit<LabReportRecord, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setLabReports(prev => [{ ...report, id: `L-${Date.now()}`, date: dateStr, time: timeStr }, ...prev]);
  };

  return (
    <LabContext.Provider value={{ labReports, addLabReport }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLabContext() {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error('useLabContext must be used within a LabProvider');
  }
  return context;
}
