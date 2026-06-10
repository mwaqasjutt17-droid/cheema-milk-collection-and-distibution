/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DispatchProvider } from './contexts/DispatchContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { LabProvider } from './contexts/LabContext';
import { AccountProvider } from './contexts/AccountContext';
import { UserProvider } from './contexts/UserContext';
import { VehicleProvider } from './contexts/VehicleContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Login from './screens/Login';

// Admin Screens
import AdminDashboard from './screens/admin/AdminDashboard';
import UserManagement from './screens/admin/UserManagement';
import VehicleManagement from './screens/admin/VehicleManagement';
import LiveTracking from './screens/admin/LiveTracking';
import MilkDispatch from './screens/admin/MilkDispatch';
import AdminReports from './screens/admin/AdminReports';
import AdminPnL from './screens/admin/AdminPnL';
import ExpenseMonitor from './screens/admin/ExpenseMonitor';
import AdminTransactions from './screens/admin/AdminTransactions';

// Driver Screens
import DriverDashboard from './screens/driver/DriverDashboard';
import SaleEntry from './screens/driver/SaleEntry';
import PurchaseEntry from './screens/driver/PurchaseEntry';
import DriverHistory from './screens/driver/DriverHistory';

// Accountant Screens
import AccountantDashboard from './screens/accountant/AccountantDashboard';
import ExpenseEntry from './screens/accountant/ExpenseEntry';
import AccountantReports from './screens/accountant/AccountantReports';

// Lab Technician Screens
import LabDashboard from './screens/lab/LabDashboard';
import LabReports from './screens/lab/LabReports';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
        <VehicleProvider>
        <DispatchProvider>
        <TransactionProvider>
        <LabProvider>
        <AccountProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/vehicles" element={<VehicleManagement />} />
              <Route path="/admin/tracking" element={<LiveTracking />} />
              <Route path="/admin/dispatch" element={<MilkDispatch />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/pnl" element={<AdminPnL />} />
              <Route path="/admin/expenses" element={<ExpenseMonitor />} />
            </Route>

            {/* Driver Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Driver']} />}>
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/driver/sale" element={<SaleEntry />} />
              <Route path="/driver/purchase" element={<PurchaseEntry />} />
              <Route path="/driver/history" element={<DriverHistory />} />
            </Route>

            {/* Accountant Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Accountant']} />}>
              <Route path="/accountant" element={<AccountantDashboard />} />
              <Route path="/accountant/expense-entry" element={<ExpenseEntry />} />
              <Route path="/accountant/reports" element={<AccountantReports />} />
            </Route>

            {/* Lab Technician Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Lab Technician']} />}>
              <Route path="/lab" element={<LabDashboard />} />
              <Route path="/lab/reports" element={<LabReports />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        </AccountProvider>
        </LabProvider>
        </TransactionProvider>
        </DispatchProvider>
        </VehicleProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
