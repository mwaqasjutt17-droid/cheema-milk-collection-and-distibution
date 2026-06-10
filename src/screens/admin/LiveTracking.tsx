import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useDispatchContext } from '../../contexts/DispatchContext';

export default function LiveTracking() {
  const { dispatches } = useDispatchContext();
  const [selectedDispatchId, setSelectedDispatchId] = useState(dispatches[0]?.id || null);

  const selectedDispatch = dispatches.find(d => d.id === selectedDispatchId) || dispatches[0];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-6 flex-1 lg:flex-row">
        {/* Map Area */}
        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden relative shadow-lg">
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded border text-[10px] font-bold text-slate-800 shadow-sm leading-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE MAP PREVIEW
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Map Grid Pattern */}
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full opacity-20 absolute inset-0">
               {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-slate-500/30"></div>
               ))}
            </div>
            {/* Markers */}
            {dispatches.map((dispatch, index) => {
              // Creating a pseudo-random but fixed position distribution for visual purposes on this grid map
              const leftPercent = 20 + ((index * 23) % 60);
              const topPercent = 20 + ((index * 17) % 60);
              
              const isSelected = selectedDispatch?.id === dispatch.id;
              return (
                <button 
                  key={dispatch.id}
                  onClick={() => setSelectedDispatchId(dispatch.id)}
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full border shadow-2xl z-20 transition-all cursor-pointer hover:scale-110 ${isSelected ? 'bg-blue-600 ring-4 ring-blue-500/30 text-white font-black text-xs' : 'bg-slate-700 text-slate-300 ring-2 ring-slate-600 font-bold text-[10px]'}`}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                >
                  V
                  <div className={`absolute -bottom-6 bg-slate-900 border border-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap transition-opacity ${isSelected ? 'opacity-100 z-30' : 'opacity-0 group-hover:opacity-100'}`}>
                    {dispatch.vehicleId}
                  </div>
                </button>
              );
            })}

            {selectedDispatch && (
              <p className="absolute text-white font-mono text-[10px] bottom-3 right-3 bg-black/50 px-2 py-1 rounded">
                {selectedDispatch.coordinates.lat.toFixed(4)}° N, {selectedDispatch.coordinates.lng.toFixed(4)}° E
              </p>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-72 bg-white border rounded-xl flex flex-col shadow-sm max-h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Vehicle Details</h3>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Active: {dispatches.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedDispatch ? (
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Vehicle Number</p>
                  <p className="font-semibold text-slate-700 text-sm">{selectedDispatch.vehicleId}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Driver Name</p>
                  <p className="font-semibold text-slate-700 text-sm">{selectedDispatch.driverName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Disp. Quantity</p>
                  <p className="font-semibold text-slate-700 text-sm">{selectedDispatch.liters} L (${selectedDispatch.totalAmount})</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Location</p>
                  <p className="font-semibold text-slate-700 text-sm">{selectedDispatch.location}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                  <p className="font-semibold text-green-600 text-sm uppercase tracking-tight">{selectedDispatch.status}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-1.5 rounded-md text-xs font-bold transition-colors">
                    View Full Route
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-sm">
                No active dispatches.
              </div>
            )}
          </div>
          
          {/* Dispatch List */}
          <div className="border-t border-slate-200 bg-slate-50 p-3 h-48 overflow-y-auto">
             <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2">All Dispatches</h4>
             <div className="space-y-2">
               {dispatches.map(d => (
                 <button 
                   key={d.id} 
                   onClick={() => setSelectedDispatchId(d.id)}
                   className={`w-full text-left p-2 rounded border text-xs transition-colors ${selectedDispatchId === d.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                 >
                   <div className="font-bold text-slate-700">{d.vehicleId}</div>
                   <div className="text-slate-500 truncate">{d.driverName} • {d.liters} L</div>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
