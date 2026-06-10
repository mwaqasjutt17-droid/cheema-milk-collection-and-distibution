import React, { createContext, useContext, useState } from 'react';

export interface AccountRecord {
  id: string;
  type: string;
  category: string;
  amount: number;
  method: string;
  payer: string;
  payee: string;
  note: string;
  date: string;
  time: string;
  user: string;
  liters?: number;
}

interface AccountContextType {
  accountRecords: AccountRecord[];
  addAccountRecord: (record: Omit<AccountRecord, 'id' | 'date' | 'time'>) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountRecords, setAccountRecords] = useState<AccountRecord[]>([]);

  const addAccountRecord = (record: Omit<AccountRecord, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAccountRecords(prev => [{ ...record, id: `ACC-${Date.now()}`, date: dateStr, time: timeStr }, ...prev]);
  };

  return (
    <AccountContext.Provider value={{ accountRecords, addAccountRecord }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
}
