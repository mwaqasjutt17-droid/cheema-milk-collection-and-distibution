import React, { createContext, useContext, useState } from 'react';

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  name: string;
  driverId: string;
  driverPhone: string;
  imei: string;
  status: 'Available' | 'Dispatched' | 'Maintenance' | 'Inactive';
}

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', vehicleNumber: 'DF-2023', name: 'Tanker', driverId: '1', driverPhone: '+1 234 567 8900', imei: '123456789012345', status: 'Dispatched' },
    { id: '2', vehicleNumber: 'DF-2024', name: 'Mini Truck', driverId: '2', driverPhone: '+1 234 567 8999', imei: '987654321098765', status: 'Available' }
  ]);

  const addVehicle = (data: Omit<Vehicle, 'id'>) => {
    setVehicles(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const updateVehicle = (id: string, data: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
}
