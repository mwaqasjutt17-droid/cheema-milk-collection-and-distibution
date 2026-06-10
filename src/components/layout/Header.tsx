import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b shadow-sm z-10 transition-colors duration-200">
      <div className="flex items-center gap-4 hidden md:flex">
        <h2 className="text-xl font-bold text-slate-800">Command Center</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> System Online
        </div>
      </div>

      <div className="flex-1 max-w-md md:pl-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <button className="relative text-slate-400 hover:text-slate-600">
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold uppercase text-slate-400">Current Date</p>
          <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </header>
  );
}
