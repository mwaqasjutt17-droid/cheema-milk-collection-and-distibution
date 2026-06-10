import React from 'react';
import { 
  Users, Truck, Droplets, MapPin, DollarSign, TrendingUp, TrendingDown,
  Activity, Package, AlertCircle, RefreshCw, ShoppingCart
} from 'lucide-react';
import { useDispatchContext } from '../../contexts/DispatchContext';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useAccountContext } from '../../contexts/AccountContext';

export default function AdminDashboard() {
  const { dispatches, remainingDispatches } = useDispatchContext();
  const { totalSalesLiters, totalPurchaseLiters, totalSalesAmount, totalPurchaseAmount } = useTransactionContext();
  const { accountRecords } = useAccountContext();

  const activeDispatches = dispatches.filter(d => d.status === 'Dispatched').length;

  // 1. Accountant transactions (from AccountContext)
  const accountantPurchasesAmt = accountRecords
    .filter(r => r.type === 'Purchase')
    .reduce((sum, r) => sum + r.amount, 0);

  const accountantSalesAmt = accountRecords
    .filter(r => r.type === 'Sale')
    .reduce((sum, r) => sum + r.amount, 0);

  const accountantExpensesAmt = accountRecords
    .filter(r => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const accountantPurchasesLiters = accountRecords
    .filter(r => r.type === 'Purchase')
    .reduce((sum, r) => sum + (r.liters || 0), 0);

  const accountantSalesLiters = accountRecords
    .filter(r => r.type === 'Sale')
    .reduce((sum, r) => sum + (r.liters || 0), 0);

  // 2. Driver transactions (from TransactionContext)
  const driverPurchasesAmt = totalPurchaseAmount;
  const driverSalesAmt = totalSalesAmount;

  const driverPurchasesLiters = totalPurchaseLiters;
  const driverSalesLiters = totalSalesLiters;

  // 3. Consolidated Calculations
  // Total Purchases: Accountant Purchases + Driver Purchases
  const consolidatedPurchasedAmt = accountantPurchasesAmt + driverPurchasesAmt;
  const consolidatedPurchasedLiters = accountantPurchasesLiters + driverPurchasesLiters;

  // Total Sales (consolidated): Accountant Sales + Driver Sales
  const consolidatedSoldAmt = accountantSalesAmt + driverSalesAmt;
  const consolidatedSoldLiters = accountantSalesLiters + driverSalesLiters;

  // Admin Total: "purchasing adds, selling deducts, driver purchase adds" -> Total Purchases - Accountant Sales
  const adminConsolidatedTotalAmt = consolidatedPurchasedAmt - accountantSalesAmt;

  // Total dispatches (no driver sales deduction)
  const baseDispatchedLiters = dispatches.reduce((acc, d) => acc + d.liters, 0);
  const adjustedDispatchedLiters = baseDispatchedLiters;

  // Remaining Dispatched with drivers
  const remainingDispatchedWithDrivers = Math.max(0, adjustedDispatchedLiters - totalSalesLiters);

  const consolidatedDispatchedAmt = dispatches.reduce((sum, d) => sum + d.totalAmount, 0);
  const remainingMilkLiters = Math.max(0, consolidatedPurchasedLiters - consolidatedSoldLiters - adjustedDispatchedLiters);

  const stats = [
    { 
      title: "Today's Purchase", 
      value: `${consolidatedPurchasedLiters.toLocaleString()} L`, 
      description: `Amount: PKR ${consolidatedPurchasedAmt.toLocaleString()}`, 
      icon: ShoppingCart, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100 dark:bg-blue-900/30' 
    },
    { 
      title: "Today's Sale", 
      value: `${consolidatedSoldLiters.toLocaleString()} L`, 
      description: `Amount: PKR ${consolidatedSoldAmt.toLocaleString()}`, 
      icon: Package, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100 dark:bg-emerald-950/30' 
    },
    { 
      title: "Today's Dispatch", 
      value: `${adjustedDispatchedLiters.toLocaleString()} L`, 
      description: `Amount: PKR ${consolidatedDispatchedAmt.toLocaleString()}`, 
      icon: Truck, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100 dark:bg-purple-900/30' 
    },
    { 
      title: "Today's Remaining Milk", 
      value: `${remainingMilkLiters.toLocaleString()} L`, 
      description: 'Available stock', 
      icon: Droplets, 
      color: 'text-sky-600', 
      bg: 'bg-sky-100 dark:bg-sky-950/30' 
    },
    { 
      title: 'Net Operational Cash', 
      value: `PKR ${adminConsolidatedTotalAmt.toLocaleString()}`, 
      description: 'Purchases - Sales Limit', 
      icon: DollarSign, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100 dark:bg-indigo-900/30' 
    },
    { 
      title: 'Total Expenses', 
      value: `PKR ${accountantExpensesAmt.toLocaleString()}`, 
      description: 'General overheads', 
      icon: TrendingDown, 
      color: 'text-red-600', 
      bg: 'bg-red-100 dark:bg-red-900/30' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-3 rounded-lg border dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 truncate pr-2">{stat.title}</span>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-70`} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 dark:text-white leading-tight font-mono">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
