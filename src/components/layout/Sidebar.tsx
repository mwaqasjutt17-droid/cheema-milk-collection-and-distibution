import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, Users, Truck, Send, FileText, Settings, 
  DollarSign, Activity, TestTube, LogOut, Milk, ShoppingBag
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Role } from '../../types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  // Admin Links
  { title: 'Dashboard', href: '/admin', icon: Home, roles: ['Admin'] },
  { title: 'Users', href: '/admin/users', icon: Users, roles: ['Admin'] },
  { title: 'Vehicles', href: '/admin/vehicles', icon: Truck, roles: ['Admin'] },
  { title: 'Live Tracking', href: '/admin/tracking', icon: Activity, roles: ['Admin'] },
  { title: 'Milk Dispatch', href: '/admin/dispatch', icon: Send, roles: ['Admin'] },
  { title: 'Sales & Purchases', href: '/admin/transactions', icon: ShoppingBag, roles: ['Admin'] },
  { title: 'Reports', href: '/admin/reports', icon: FileText, roles: ['Admin'] },
  { title: 'Profit & Loss', href: '/admin/pnl', icon: DollarSign, roles: ['Admin'] },
  { title: 'Expenses & Inventory', href: '/admin/expenses', icon: DollarSign, roles: ['Admin'] },

  // Driver Links
  { title: 'Dashboard', href: '/driver', icon: Home, roles: ['Driver'] },
  { title: 'Sale Entry', href: '/driver/sale', icon: DollarSign, roles: ['Driver'] },
  { title: 'Purchase Entry', href: '/driver/purchase', icon: DollarSign, roles: ['Driver'] },
  { title: 'History', href: '/driver/history', icon: FileText, roles: ['Driver'] },

  // Accountant Links
  { title: 'Dashboard', href: '/accountant', icon: Home, roles: ['Accountant'] },
  { title: 'Expense Entry', href: '/accountant/expense-entry', icon: DollarSign, roles: ['Accountant'] },
  { title: 'Accounting Reports', href: '/accountant/reports', icon: FileText, roles: ['Accountant'] },

  // Lab Technician Links
  { title: 'Quality Test', href: '/lab', icon: TestTube, roles: ['Lab Technician'] },
  { title: 'Lab Reports', href: '/lab/reports', icon: FileText, roles: ['Lab Technician'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const filteredLinks = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shadow-xl transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
          <Milk className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white uppercase">Cheema <span className="text-blue-400 font-black">Milk</span></span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {filteredLinks.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin' || item.href === '/driver' || item.href === '/accountant' || item.href === '/lab'}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-300 hover:bg-slate-800"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4 px-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
