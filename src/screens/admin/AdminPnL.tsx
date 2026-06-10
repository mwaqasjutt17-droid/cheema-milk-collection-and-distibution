import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAccountContext } from '../../contexts/AccountContext';
import { useTransactionContext } from '../../contexts/TransactionContext';

export default function AdminPnL() {
  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { accountRecords } = useAccountContext();
  const { totalSalesAmount, totalPurchaseAmount } = useTransactionContext();

  // Accountant transaction sums
  const accountantPurchasesAmt = accountRecords
    .filter(r => r.type === 'Purchase')
    .reduce((sum, r) => sum + r.amount, 0);

  const accountantSalesAmt = accountRecords
    .filter(r => r.type === 'Sale')
    .reduce((sum, r) => sum + r.amount, 0);

  const accountantExpensesAmt = accountRecords
    .filter(r => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  // Consolidated quantities
  const actualTodayPurchases = accountantPurchasesAmt + totalPurchaseAmount;
  const actualTodaySales = accountantSalesAmt - totalSalesAmount; // If a driver sells, it is deducted from sales
  const actualTodayExpenses = accountantExpensesAmt;

  // Mock data generator based on date range
  const generateData = () => {
    let numDays = 1;
    if (dateRange === '3 Days') numDays = 3;
    else if (dateRange === '7 Days') numDays = 7;
    else if (dateRange === '1 Month') numDays = 30;
    else if (dateRange === 'Custom Date' && startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      numDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)));
    } else if (dateRange === 'Custom Date') {
      numDays = 7; // Fallback
    }

    const data = [];
    const today = new Date();
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const baseSales = isWeekend ? 5000 : 3500;
      
      const isTodayDay = i === 0;

      data.push({
        name: d.toLocaleDateString('en-US', { weekday: numDays <= 7 ? 'short' : undefined, month: numDays > 7 ? 'short' : undefined, day: 'numeric' }),
        Purchase: isTodayDay ? actualTodayPurchases : Math.floor(baseSales * 0.4 + Math.random() * 1000),
        Sales: isTodayDay ? Math.max(0, actualTodaySales) : Math.floor(baseSales + Math.random() * 2000),
        Expenses: isTodayDay ? actualTodayExpenses : Math.floor(baseSales * 0.2 + Math.random() * 500),
      });
    }
    return data;
  };

  const data = useMemo(generateData, [dateRange, startDate, endDate]);

  const totals = useMemo(() => {
    return data.reduce((acc, curr) => ({
      Purchase: acc.Purchase + curr.Purchase,
      Sales: acc.Sales + curr.Sales,
      Expenses: acc.Expenses + curr.Expenses,
    }), { Purchase: 0, Sales: 0, Expenses: 0 });
  }, [data]);

  const netProfit = totals.Sales - totals.Purchase - totals.Expenses;
  const isLoss = netProfit < 0;

  const pieData = [
    { name: isLoss ? 'Net Loss' : 'Net Profit', value: Math.abs(netProfit) },
    { name: 'Expenses + Purchase', value: totals.Purchase + totals.Expenses },
  ];
  const COLORS = [isLoss ? '#ef4444' : '#10b981', '#94a3b8'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Profit & Loss Report</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="Today">Today (1 Day)</option>
            <option value="3 Days">Last 3 Days</option>
            <option value="7 Days">Last 7 Days</option>
            <option value="1 Month">Last 1 Month</option>
            <option value="Custom Date">Custom Date</option>
          </select>

          {dateRange === 'Custom Date' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
              <span className="text-slate-400 font-medium text-sm">to</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-[#F1F5F9] p-4 rounded-lg border shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Purchase Cost</p>
          <p className="text-xl font-black text-slate-800">PKR {totals.Purchase.toLocaleString()}</p>
        </div>
        <div className="bg-[#F1F5F9] p-4 rounded-lg border shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Sales</p>
          <p className="text-xl font-black text-green-600">PKR {totals.Sales.toLocaleString()}</p>
        </div>
        <div className="bg-[#F1F5F9] p-4 rounded-lg border shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Expenses</p>
          <p className="text-xl font-black text-red-600">PKR {totals.Expenses.toLocaleString()}</p>
        </div>
        <div className="bg-white border rounded-lg shadow-sm p-4 lg:col-span-2 flex flex-col justify-center">
           <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{isLoss ? 'Net Loss' : 'Net Profit'}</p>
           <p className={`text-2xl font-black ${isLoss ? 'text-red-600' : 'text-blue-600'}`}>PKR {Math.abs(netProfit).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b bg-slate-50">
             <h3 className="font-bold text-slate-800 text-sm">Income vs Expenses Overview</h3>
          </div>
          <div className="p-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `PKR ${v/1000}k`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Purchase" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Sales" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
           <div className="px-5 py-3 border-b bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Distribution</h3>
           </div>
           <div className="p-4 flex-1 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
