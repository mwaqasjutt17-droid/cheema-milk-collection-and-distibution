import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { useAccountContext } from '../../contexts/AccountContext';

export default function AccountantReports() {
  const { accountRecords } = useAccountContext();
  const [filterType, setFilterType] = useState('All Types');

  const baseReports = [
    { id: 'R-1', type: 'Purchase', date: '2026-06-09', amount: 1500, ref: 'PUR-8821' },
    { id: 'R-2', type: 'Sale', date: '2026-06-09', amount: 3200, ref: 'SAL-0092' },
    { id: 'R-3', type: 'Expense', date: '2026-06-08', amount: 450, ref: 'EXP-1123' },
    { id: 'R-4', type: 'Dispatch', date: '2026-06-07', amount: 800, ref: 'DSP-5542' },
  ];

  // Convert AccountRecords to the report row format
  const mappedAccountRecords = accountRecords.map(rec => ({
    id: rec.id,
    type: rec.type, // e.g., Expense, Income, Transfer, Purchase, Sale
    date: rec.date,
    amount: rec.amount,
    ref: rec.id.startsWith('ACC-') ? rec.id.replace('ACC-', 'TXN-') : rec.id
  }));

  const allReports = [...mappedAccountRecords, ...baseReports];

  const filteredReports = allReports.filter(report => {
    if (filterType === 'All Types') return true;
    if (filterType === 'Expenses') return report.type === 'Expense';
    return report.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
     <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Accounting Reports</h1>
        <div className="flex space-x-2">
           <button className="flex items-center space-x-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded transition-colors text-xs font-bold uppercase tracking-tight">
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button className="flex items-center space-x-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded transition-colors text-xs font-bold uppercase tracking-tight">
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold uppercase tracking-tight text-gray-700 dark:text-gray-300">Filter by:</span>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-2 py-1 text-xs border rounded dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none font-medium">
            <option value="All Types">All Types</option>
            <option value="Purchase">Purchase</option>
            <option value="Sale">Sale</option>
            <option value="Dispatch">Dispatch</option>
            <option value="Expenses">Expenses</option>
            <option value="Income">Income</option>
            <option value="Transfer">Transfer</option>
          </select>
          <select className="px-2 py-1 text-xs border rounded dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none font-medium">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-tight text-gray-500 dark:text-gray-400">Date</th>
                <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-tight text-gray-500 dark:text-gray-400">Reference</th>
                <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-tight text-gray-500 dark:text-gray-400">Transaction Type</th>
                <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-tight text-gray-500 dark:text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">{report.date}</td>
                  <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 font-mono">{report.ref}</td>
                  <td className="py-2 px-3 text-sm">
                     <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                      report.type === 'Sale' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 text-green-400' :
                      report.type === 'Purchase' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 text-blue-400' :
                      report.type === 'Expense' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 text-red-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 text-purple-400'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm font-bold text-gray-900 dark:text-white text-right font-mono">
                    PKR {report.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">No matching accounting records.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  );
}
