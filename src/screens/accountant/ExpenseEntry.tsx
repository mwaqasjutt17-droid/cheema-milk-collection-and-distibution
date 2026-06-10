import React, { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useAccountContext } from '../../contexts/AccountContext';
import { useUserContext } from '../../contexts/UserContext';

export default function ExpenseEntry() {
  const { addAccountRecord } = useAccountContext();
  const { user } = useUserContext();
  
  const [formData, setFormData] = useState({
    type: 'Expense',
    category: '',
    method: 'Cash',
    payer: '',
    payee: '',
    amount: '',
    liters: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isMilkTx = formData.type === 'Purchase' || formData.type === 'Sale';
    const effectiveCategory = isMilkTx ? (formData.category || 'Milk') : formData.category;

    if (!effectiveCategory || !formData.amount || !formData.payer || !formData.payee) {
      alert("Please fill all required fields");
      return;
    }

    addAccountRecord({
      type: formData.type,
      category: effectiveCategory,
      amount: parseFloat(formData.amount),
      method: formData.method,
      payer: formData.payer,
      payee: formData.payee,
      note: formData.note,
      liters: isMilkTx && formData.liters ? parseFloat(formData.liters) : undefined,
      user: user?.fullName || 'Accountant'
    });

    alert('Account record saved permanently.');
    setFormData({
      type: 'Expense',
      category: '',
      method: 'Cash',
      payer: '',
      payee: '',
      amount: '',
      liters: '',
      note: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Log New Account Entry</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6">
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3 flex items-start space-x-3 text-amber-800 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="text-xs">Once a record is submitted, it cannot be edited or deleted to ensure accounting integrity. Please verify all details before confirming.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Entry Type</label>
              <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
                <option value="Transfer">Transfer</option>
                <option value="Purchase">Purchase (Milk)</option>
                <option value="Sale">Sale (Milk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Category...</option>
                <option value="Milk">Milk</option>
                <option value="Fuel">Fuel</option>
                <option value="Salary">Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Payment">Payment</option>
                <option value="Receipt">Receipt</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Payer (From)</label>
              <input 
                type="text" 
                name="payer"
                value={formData.payer}
                onChange={handleChange}
                placeholder="e.g. John Doe / Company Account"
                required
                className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Payee (To)</label>
              <input 
                type="text" 
                name="payee"
                value={formData.payee}
                onChange={handleChange}
                placeholder="e.g. Supplier A / Employee Name"
                required
                className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Payment Method</label>
              <select required name="method" value={formData.method} onChange={handleChange} className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
              </select>
            </div>

            {(formData.type === 'Purchase' || formData.type === 'Sale') && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Milk Quantity (Liters) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  name="liters"
                  value={formData.liters}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Amount (PKR)</label>
              <input 
                type="number" 
                required
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-tight">Description / Notes</label>
              <textarea 
                required
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Provide details about this transaction..."
                className="w-full px-3 py-1.5 border rounded text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Submit Entry Permanently</span>
          </button>
        </form>
      </div>
    </div>
  );
}
