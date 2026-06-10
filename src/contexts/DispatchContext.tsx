import React, { createContext, useContext, useState } from 'react';

export interface DispatchRecord {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  date: string;
  liters: number;
  rate: number;
  totalAmount: number;
  notes: string;
  status: 'Dispatched' | 'Completed';
  location: string;
  coordinates: { lat: number; lng: number };
}

interface DispatchContextType {
  dispatches: DispatchRecord[];
  addDispatch: (dispatch: Omit<DispatchRecord, 'id' | 'status' | 'location' | 'coordinates'>) => void;
  remainingDispatches: number;
}

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export function DispatchProvider({ children }: { children: React.ReactNode }) {
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([
    {
      id: 'D-1',
      driverId: '1',
      driverName: 'John Driver',
      vehicleId: 'DF-2023',
      date: new Date().toISOString().split('T')[0],
      liters: 500,
      rate: 1.5,
      totalAmount: 750,
      notes: '',
      status: 'Dispatched',
      location: 'Farm North Gate, Route A',
      coordinates: { lat: 34.01, lng: 71.52 }
    }
  ]);

  const maxDailyDispatches = 10;
  const remainingDispatches = Math.max(0, maxDailyDispatches - dispatches.length);

  const addDispatch = (data: Omit<DispatchRecord, 'id' | 'status' | 'location' | 'coordinates'>) => {
    const newDispatch: DispatchRecord = {
      ...data,
      id: `D-${Date.now()}`,
      status: 'Dispatched',
      location: 'In Transit',
      coordinates: {
        // Mock random coordinates nearby
        lat: 34.01 + (Math.random() - 0.5) * 0.05,
        lng: 71.52 + (Math.random() - 0.5) * 0.05
      }
    };
    setDispatches(prev => [...prev, newDispatch]);
  };

  return (
    <DispatchContext.Provider value={{ dispatches, addDispatch, remainingDispatches }}>
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatchContext() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatchContext must be used within a DispatchProvider');
  }
  return context;
}
