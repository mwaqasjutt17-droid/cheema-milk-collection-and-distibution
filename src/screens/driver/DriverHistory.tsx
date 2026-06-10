import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useDispatchContext } from '../../contexts/DispatchContext';

export default function DriverHistory() {
  const [filter, setFilter] = useState('All');
  const { sales, purchases } = useTransactionContext();
  const { dispatches } = useDispatchContext();

  const history = useMemo(() => {
    const list: any[] = [];
    
    dispatches.forEach(d => {
      list.push({
        id: `dispatch-${d.id}`,
        type: 'Dispatch',
        date: new Date(d.date).toLocaleDateString(),
        detail: `Received from Admin - Dest: ${d.destination}`,
        amount: d.liters,
        rate: 0,
        total: 0,
        status: 'Admin Record'
      });
    });

    sales.forEach(s => {
      list.push({
        id: `sale-${s.id}`,
        type: 'Sale',
        date: new Date(s.date).toLocaleDateString(),
        detail: `Customer: ${s.customerName}`,
        amount: s.liters,
        rate: s.rate,
        total: s.total,
        status: 'Editable'
      });
    });

    purchases.forEach(p => {
      list.push({
        id: `purchase-${p.id}`,
        type: 'Purchase',
        date: new Date(p.date).toLocaleDateString(),
        detail: `Supplier: ${p.source}`,
        amount: p.liters,
        rate: p.rate,
        total: p.total,
        status: 'Editable'
      });
    });

    // sorting by most recent
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, purchases, dispatches]);

  const filteredHistory = filter === 'All' ? history : history.filter(h => h.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <Filter className="w-4 h-4 text-gray-500 ml-2" />
          {['All', 'Purchase', 'Sale', 'Dispatch'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === f 
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300">Date</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300">Type</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300">Description</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300">Quantity</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300">Total Amount</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.date}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'Sale' ? 'bg-green-100 text-green-800 dark:bg-green-900/30' :
                      item.type === 'Purchase' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{item.detail}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{item.amount} L</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.total > 0 ? `PKR ${item.total.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    {item.status === 'Editable' ? (
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium">Edit</button>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs italic">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
