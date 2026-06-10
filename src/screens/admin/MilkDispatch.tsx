import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useDispatchContext } from '../../contexts/DispatchContext';
import { useVehicleContext } from '../../contexts/VehicleContext';

export default function MilkDispatch() {
  const { addDispatch, remainingDispatches } = useDispatchContext();
  const { vehicles } = useVehicleContext();
  
  const activeVehicles = vehicles.filter(v => v.status !== 'Inactive');
  
  const [liters, setLiters] = useState('');
  const [rate, setRate] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const totalAmount = (parseFloat(liters || '0') * parseFloat(rate || '0')).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !liters || !rate) return;

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!selectedVehicle) return;

    addDispatch({
      driverId: selectedVehicle.driverId || 'Unknown',
      driverName: selectedVehicle.driverId || 'Unknown', // Using driver ID as name for simplicity since user context isn't joined here, or wait, we could just use driverId
      vehicleId: selectedVehicle.vehicleNumber,
      date,
      liters: parseFloat(liters),
      rate: parseFloat(rate),
      totalAmount: parseFloat(totalAmount),
      notes
    });

    setSuccess(true);
    setLiters('');
    setRate('');
    setSelectedVehicleId('');
    setNotes('');
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 space-y-4">
      {/* Remaining Dispatches Info */}
      <div className="bg-slate-800 rounded shadow-sm p-4 flex items-center justify-between text-white">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Daily Quota Status</p>
          <p className="text-sm font-semibold">Remaining Dispatches</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded">
          <span className="text-xl font-black text-blue-400">{remainingDispatches}</span>
        </div>
      </div>

      <div className="bg-white border rounded flex flex-col overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Dispatch Milk to Driver</h3>
          {success && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Dispatched successfully</span>}
        </div>

        <div className="p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Select Vehicle & Driver</label>
                <select required value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choose Vehicle...</option>
                  {activeVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.driverId} ({v.vehicleNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Dispatch Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quantity (Liters)</label>
                <input 
                  type="number" 
                  required
                  min="0.1"
                  step="0.1"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Per Liter Price (PKR)</label>
                <input 
                  type="number" 
                  required
                  min="0.01"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-mono" 
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Amount Value:</span>
              <span className="text-lg font-black text-blue-600">PKR {totalAmount}</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Notes / Instructions</label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions..."
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500" 
              />
            </div>

            <button 
              type="submit"
              disabled={remainingDispatches <= 0}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-bold text-sm transition-colors mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Dispatch</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
