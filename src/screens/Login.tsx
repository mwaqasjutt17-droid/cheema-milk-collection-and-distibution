import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { Milk, Eye, EyeOff } from 'lucide-react';
import SplashScreen from '../components/layout/SplashScreen';

export default function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      login(username, role);
      // Route based on role
      switch (role) {
        case 'Admin': navigate('/admin'); break;
        case 'Driver': navigate('/driver'); break;
        case 'Accountant': navigate('/accountant'); break;
        case 'Lab Technician': navigate('/lab'); break;
      }
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 p-3 rounded mb-3">
            <Milk className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-xl tracking-tight font-bold text-gray-900 dark:text-white">
            Welcome to Cheema Milk
          </h2>
          <p className="mt-1 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
            Collection & Distribution
          </p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-tight text-gray-700 dark:text-gray-300">
                Select Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full pl-3 pr-10 py-1.5 text-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Driver">Driver</option>
                <option value="Accountant">Accountant</option>
                <option value="Lab Technician">Lab Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-tight text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm mt-1"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-tight text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-1.5 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold tracking-tight rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
