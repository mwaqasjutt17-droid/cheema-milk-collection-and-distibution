import React from 'react';
import { Package, Droplets, DollarSign, Archive } from 'lucide-react';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useDispatchContext } from '../../contexts/DispatchContext';

export default function DriverDashboard() {
  const { totalSalesLiters, totalPurchaseLiters, totalSalesAmount } = useTransactionContext();
  const { dispatches } = useDispatchContext();
  
  // Sum up all dispatches (Received Milk from Admin)
  const totalReceivedLiters = dispatches.reduce((acc, d) => acc + d.liters, 0);

  const currentStock = totalReceivedLiters - totalSalesLiters + totalPurchaseLiters;

  const stats = [
    { title: 'Total Milk Received', value: `${totalReceivedLiters.toLocaleString()} L`, icon: Droplets, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'Total Milk Sold', value: `${totalSalesLiters.toLocaleString()} L`, icon: Package, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Total Milk Purchased', value: `${totalPurchaseLiters.toLocaleString()} L`, icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Remaining Milk', value: `${currentStock.toLocaleString()} L`, icon: Archive, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'Total Amount Collected', value: `PKR ${totalSalesAmount.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-lg border shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 truncate pr-2">{stat.title}</span>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-70`} />
            </div>
            <p className="text-xl font-black text-slate-800 font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5 max-w-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2 text-sm">
          <Archive className="w-4 h-4 text-blue-500" />
          <span>Stock Reconciliation</span>
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-semibold">Received Milk</span>
            <span className="font-mono text-slate-800">+ {totalReceivedLiters.toLocaleString()} L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-semibold">Sold Milk</span>
            <span className="font-mono text-red-600">- {totalSalesLiters.toLocaleString()} L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-semibold">Purchased Milk</span>
            <span className="font-mono text-green-600">+ {totalPurchaseLiters.toLocaleString()} L</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between mt-2">
            <span className="font-bold text-slate-800 text-sm">Current Stock</span>
            <span className="font-black font-mono text-blue-600">{currentStock.toLocaleString()} L</span>
          </div>
        </div>
      </div>
    </div>
  );
}
