import React, { useState } from 'react';
import { Plus, Edit2, MapPin, Trash2, PowerOff, Power } from 'lucide-react';
import { useVehicleContext, Vehicle } from '../../contexts/VehicleContext';

export default function VehicleManagement() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicleContext();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    name: '',
    driverId: '',
    driverPhone: '',
    imei: '',
    status: 'Available' as Vehicle['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVehicle(editingId, formData);
    } else {
      addVehicle(formData);
    }
    closeModal();
  };

  const openModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber,
        name: vehicle.name,
        driverId: vehicle.driverId,
        driverPhone: vehicle.driverPhone,
        imei: vehicle.imei,
        status: vehicle.status
      });
    } else {
      setEditingId(null);
      setFormData({
        vehicleNumber: '',
        name: '',
        driverId: '',
        driverPhone: '',
        imei: '',
        status: 'Available'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const toggleStatus = (vehicle: Vehicle) => {
    const newStatus = vehicle.status === 'Inactive' ? 'Available' : 'Inactive';
    updateVehicle(vehicle.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="bg-white border rounded-xl flex flex-col overflow-hidden shadow-sm flex-1">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Vehicle Fleet Status</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => openModal()}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add Vehicle
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b z-10">
              <tr>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Vehicle Details</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Driver</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">GPS Status</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Status</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map(vehicle => (
                <tr key={vehicle.id} className={`hover:bg-slate-50 transition-colors ${vehicle.status === 'Inactive' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-3">
                    <div className="text-sm font-bold text-slate-700">{vehicle.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{vehicle.name}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm text-slate-700">{vehicle.driverId || 'Unassigned'}</div>
                    <div className="text-[10px] text-slate-400">{vehicle.driverPhone}</div>
                  </td>
                  <td className="px-6 py-3">
                    {vehicle.status !== 'Inactive' && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full w-max">
                        • LIVE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      vehicle.status === 'Dispatched' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      vehicle.status === 'Available' ? 'bg-green-100 text-green-700 border-green-200' :
                      vehicle.status === 'Inactive' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                      'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {vehicle.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-3 items-center">
                      <button onClick={() => openModal(vehicle)} className="text-blue-600 font-bold text-xs hover:text-blue-800 flex items-center gap-1" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleStatus(vehicle)} className={`${vehicle.status === 'Inactive' ? 'text-green-600 hover:text-green-800' : 'text-slate-600 hover:text-slate-800'} font-bold text-xs flex items-center gap-1`} title={vehicle.status === 'Inactive' ? 'Enable' : 'Disable'}>
                        {vehicle.status === 'Inactive' ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteVehicle(vehicle.id)} className="text-red-500 font-bold text-xs hover:text-red-700 flex items-center gap-1" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Vehicle Number</label>
                <input required type="text" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Vehicle Name/Model</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Driver Name / ID</label>
                <input required type="text" value={formData.driverId} onChange={(e) => setFormData({...formData, driverId: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Driver Phone</label>
                <input required type="tel" value={formData.driverPhone} onChange={(e) => setFormData({...formData, driverPhone: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">GPS IMEI Number</label>
                <input required type="text" value={formData.imei} onChange={(e) => setFormData({...formData, imei: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex space-x-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-md hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
