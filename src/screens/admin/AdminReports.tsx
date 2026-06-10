import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { useDispatchContext } from '../../contexts/DispatchContext';

export default function AdminReports() {
  const { dispatches } = useDispatchContext();
  const [reportType, setReportType] = useState('All Reports');
  const [filterPeriod, setFilterPeriod] = useState('Today');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    'All Reports', 'Purchase Report', 'Sale Report', 'Dispatch Report', 
    'Expense Report'
  ];

  // Mock data for purchases, sales, expenses to merge with dispatches
  const extraRecords = [
    { id: 'E-1', date: new Date().toISOString().split('T')[0], type: 'Purchase Report', desc: 'Milk Purchase - Supplier A', amount: 1200.00, status: 'COMPLETED' },
    { id: 'E-2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: 'Expense Report', desc: 'Fuel - Station ABC', amount: 150.00, status: 'COMPLETED' },
    { id: 'E-3', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], type: 'Sale Report', desc: 'Milk Sale - Customer B', amount: 300.00, status: 'COMPLETED' },
  ];

  const allRecords = useMemo(() => {
    const dispatchRecords = dispatches.map(d => ({
      id: d.id,
      date: d.date,
      type: 'Dispatch Report',
      desc: `Dispatch - Driver ${d.driverName} (${d.liters} L)`,
      amount: d.totalAmount,
      status: d.status.toUpperCase()
    }));
    
    return [...dispatchRecords, ...extraRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dispatches]);

  const filteredRecords = useMemo(() => {
    let records = allRecords;

    if (reportType !== 'All Reports') {
      records = records.filter(r => r.type === reportType);
    }

    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);

    if (filterPeriod === 'Today') {
      records = records.filter(r => new Date(r.date) >= todayDate);
    } else if (filterPeriod === 'Yesterday') {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      records = records.filter(r => {
        const d = new Date(r.date);
        return d >= yesterday && d < todayDate;
      });
    } else if (filterPeriod === 'Last 3 Days') {
      const past = new Date(todayDate);
      past.setDate(past.getDate() - 3);
      records = records.filter(r => new Date(r.date) >= past);
    } else if (filterPeriod === 'Last 7 Days') {
      const past = new Date(todayDate);
      past.setDate(past.getDate() - 7);
      records = records.filter(r => new Date(r.date) >= past);
    } else if (filterPeriod === 'Last 30 Days') {
      const past = new Date(todayDate);
      past.setDate(past.getDate() - 30);
      records = records.filter(r => new Date(r.date) >= past);
    } else if (filterPeriod === 'Custom Date Range') {
      if (startDate) {
        records = records.filter(r => new Date(r.date) >= new Date(startDate));
      }
      if (endDate) {
        records = records.filter(r => new Date(r.date) <= new Date(endDate));
      }
    }

    return records;
  }, [allRecords, reportType, filterPeriod, startDate, endDate]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="bg-white border rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500">
                {reportTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Filter Period</label>
              <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500">
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 3 Days">Last 3 Days</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </select>
            </div>
            
            {filterPeriod === 'Custom Date Range' && (
              <>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </>
            )}

            <div className={`flex justify-end gap-2 ${filterPeriod === 'Custom Date Range' ? 'md:col-span-4' : 'md:col-span-2'}`}>
               <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-[500px]">
           <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Date</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Type</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Description</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 text-right">Amount</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-semibold text-slate-600">{record.date}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">{record.type}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">{record.desc}</td>
                  <td className="px-6 py-3 text-sm font-bold text-slate-800 font-mono text-right">${record.amount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">{record.status}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">No records found for the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
