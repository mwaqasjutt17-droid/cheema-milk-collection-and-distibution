import React, { createContext, useContext, useState } from 'react';
import { Role } from '../types';

export interface User {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  role: Role | string;
  status: 'Active' | 'Inactive';
}

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([
    { id: '1', fullName: 'John Driver', username: 'johnd', phone: '+1 234 567 8900', role: 'Driver', status: 'Active' },
    { id: '2', fullName: 'Sarah Acc', username: 'saraha', phone: '+1 234 567 8901', role: 'Accountant', status: 'Active' },
    { id: '3', fullName: 'Mike Lab', username: 'mikel', phone: '+1 234 567 8902', role: 'Lab Technician', status: 'Inactive' },
  ]);

  const addUser = (userData: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...userData, id: Date.now().toString() }]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, toggleUserStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
