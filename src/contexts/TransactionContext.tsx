import React, { createContext, useContext, useState } from 'react';

export interface SaleRecord {
  id: string;
  customerName: string;
  location: string;
  liters: number;
  rate: number;
  total: number;
  date: string;
}

export interface PurchaseRecord {
  id: string;
  source: string;
  location: string;
  liters: number;
  rate: number;
  total: number;
  date: string;
}

interface TransactionContextType {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  addSale: (sale: Omit<SaleRecord, 'id' | 'date'>) => void;
  addPurchase: (purchase: Omit<PurchaseRecord, 'id' | 'date'>) => void;
  deleteSale: (id: string) => void;
  deletePurchase: (id: string) => void;
  updateSale: (id: string, updated: Omit<SaleRecord, 'id' | 'date'>) => void;
  updatePurchase: (id: string, updated: Omit<PurchaseRecord, 'id' | 'date'>) => void;
  totalSalesLiters: number;
  totalPurchaseLiters: number;
  totalSalesAmount: number;
  totalPurchaseAmount: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<SaleRecord[]>([
    { id: 'S-1', customerName: 'Metro Dairy Distributors', location: 'Zone 4 Logistics Hub', liters: 450, rate: 3.5, total: 1575, date: new Date(Date.now() - 3600000).toISOString() },
    { id: 'S-2', customerName: 'Greenfield Supermarket', location: 'Downtown Store 12', liters: 200, rate: 3.8, total: 760, date: new Date(Date.now() - 7200000).toISOString() },
    { id: 'S-3', customerName: 'Organic Foods Coop', location: 'West End Market', liters: 150, rate: 4.0, total: 600, date: new Date(Date.now() - 10800000).toISOString() },
  ]);

  const [purchases, setPurchases] = useState<PurchaseRecord[]>([
    { id: 'P-1', source: 'Crestview Dairy Farm', location: 'North Valley Fields', liters: 600, rate: 2.2, total: 1320, date: new Date(Date.now() - 14400000).toISOString() },
    { id: 'P-2', source: 'Highland Cattle Coop', location: 'East Foothills Drive', liters: 400, rate: 2.1, total: 840, date: new Date(Date.now() - 18000000).toISOString() },
  ]);

  const addSale = (sale: Omit<SaleRecord, 'id' | 'date'>) => {
    setSales(prev => [...prev, { ...sale, id: `S-${Date.now()}`, date: new Date().toISOString() }]);
  };

  const addPurchase = (purchase: Omit<PurchaseRecord, 'id' | 'date'>) => {
    setPurchases(prev => [...prev, { ...purchase, id: `P-${Date.now()}`, date: new Date().toISOString() }]);
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const updateSale = (id: string, updated: Omit<SaleRecord, 'id' | 'date'>) => {
    setSales(prev => prev.map(sale => sale.id === id ? { ...sale, ...updated, total: parseFloat((updated.liters * updated.rate).toFixed(2)) } : sale));
  };

  const updatePurchase = (id: string, updated: Omit<PurchaseRecord, 'id' | 'date'>) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, ...updated, total: parseFloat((updated.liters * updated.rate).toFixed(2)) } : p));
  };

  const totalSalesLiters = sales.reduce((acc, sale) => acc + sale.liters, 0);
  const totalPurchaseLiters = purchases.reduce((acc, p) => acc + p.liters, 0);
  
  const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalPurchaseAmount = purchases.reduce((acc, p) => acc + p.total, 0);

  return (
    <TransactionContext.Provider value={{ 
      sales, purchases, addSale, addPurchase, deleteSale, deletePurchase, updateSale, updatePurchase,
      totalSalesLiters, totalPurchaseLiters, totalSalesAmount, totalPurchaseAmount
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
}
