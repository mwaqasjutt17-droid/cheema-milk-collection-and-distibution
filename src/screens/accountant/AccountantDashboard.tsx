import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, ShoppingCart } from 'lucide-react';
import { useAccountContext } from '../../contexts/AccountContext';
import { useTransactionContext } from '../../contexts/TransactionContext';

export default function AccountantDashboard() {
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

  // Consolidated figures
  const totalPurchaseAmt = accountantPurchasesAmt + totalPurchaseAmount;
  const totalSalesAmt = accountantSalesAmt; // Admin primary sales segment
  const netProfit = totalSalesAmt - totalPurchaseAmt - accountantExpensesAmt;

  const stats = [
    { title: 'Total Purchase Amount', value: `PKR ${totalPurchaseAmt.toLocaleString()}`, icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Total Sales Amount', value: `PKR ${totalSalesAmt.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Total Expenses', value: `PKR ${accountantExpensesAmt.toLocaleString()}`, icon: CreditCard, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
    { title: 'Net Profit', value: `PKR ${netProfit.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Accountant Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-3">
            <div className={`p-2 rounded ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize tracking-tight">{stat.title}</p>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mt-0.5 font-mono">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
       <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Financial Summary (Current Month)</h2>
           <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Opening Balance</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">PKR 15,000.00</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Inflow (Sales)</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400 font-mono">+PKR {totalSalesAmt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Outflow (Purchases + Expenses)</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 font-mono">-PKR {(totalPurchaseAmt + accountantExpensesAmt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-gray-900 dark:text-white font-bold uppercase tracking-tight">Closing Balance</span>
              <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">PKR {(15000 + netProfit).toLocaleString()}</span>
            </div>
           </div>
       </div>
    </div>
  );
}
