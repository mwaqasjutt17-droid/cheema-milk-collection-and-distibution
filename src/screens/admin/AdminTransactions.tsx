import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Edit2, Search, PlusCircle, 
  X, Check, DollarSign, MapPin, User, Truck, Droplets,
  ArrowUpRight, ArrowDownRight, Package, RefreshCw
} from 'lucide-react';
import { useTransactionContext, SaleRecord, PurchaseRecord } from '../../contexts/TransactionContext';

export default function AdminTransactions() {
  const { 
    sales, purchases, addSale, addPurchase, deleteSale, deletePurchase, updateSale, updatePurchase,
    totalSalesLiters, totalPurchaseLiters, totalSalesAmount, totalPurchaseAmount 
  } = useTransactionContext();

  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [saleForm, setSaleForm] = useState({ customerName: '', location: '', liters: '', rate: '' });
  const [purchaseForm, setPurchaseForm] = useState({ source: '', location: '', liters: '', rate: '' });

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaleData, setEditSaleData] = useState<{ customerName: string; location: string; liters: number; rate: number } | null>(null);
  const [editPurchaseData, setEditPurchaseData] = useState<{ source: string; location: string; liters: number; rate: number } | null>(null);

  // Totals calculations
  const totalSalesCount = sales.length;
  const totalPurchasesCount = purchases.length;
  const netActivityAmount = totalSalesAmount - totalPurchaseAmount;

  // Handles adding sale
  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    const { customerName, location, liters, rate } = saleForm;
    if (!customerName || !location || !liters || !rate) return;

    const litVal = parseFloat(liters);
    const rateVal = parseFloat(rate);
    const totalVal = parseFloat((litVal * rateVal).toFixed(2));

    addSale({
      customerName,
      location,
      liters: litVal,
      rate: rateVal,
      total: totalVal
    });

    setSaleForm({ customerName: '', location: '', liters: '', rate: '' });
    setShowAddForm(false);
  };

  // Handles adding purchase
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const { source, location, liters, rate } = purchaseForm;
    if (!source || !location || !liters || !rate) return;

    const litVal = parseFloat(liters);
    const rateVal = parseFloat(rate);
    const totalVal = parseFloat((litVal * rateVal).toFixed(2));

    addPurchase({
      source,
      location,
      liters: litVal,
      rate: rateVal,
      total: totalVal
    });

    setPurchaseForm({ source: '', location: '', liters: '', rate: '' });
    setShowAddForm(false);
  };

  // Enable edit mode
  const startEditSale = (sale: SaleRecord) => {
    setEditingId(sale.id);
    setEditSaleData({
      customerName: sale.customerName,
      location: sale.location,
      liters: sale.liters,
      rate: sale.rate
    });
  };

  const startEditPurchase = (purchase: PurchaseRecord) => {
    setEditingId(purchase.id);
    setEditPurchaseData({
      source: purchase.source,
      location: purchase.location,
      liters: purchase.liters,
      rate: purchase.rate
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditSaleData(null);
    setEditPurchaseData(null);
  };

  // Save edits
  const saveSaleEdit = (id: string) => {
    if (!editSaleData) return;
    const { customerName, location, liters, rate } = editSaleData;
    if (!customerName || !location || !liters || !rate) return;

    updateSale(id, {
      customerName,
      location,
      liters,
      rate,
      total: liters * rate
    });
    cancelEdit();
  };

  const savePurchaseEdit = (id: string) => {
    if (!editPurchaseData) return;
    const { source, location, liters, rate } = editPurchaseData;
    if (!source || !location || !liters || !rate) return;

    updatePurchase(id, {
      source,
      location,
      liters,
      rate,
      total: liters * rate
    });
    cancelEdit();
  };

  // Hard Delete
  const handleDeleteSale = (id: string) => {
    if (confirm('Are you sure you want to delete this sale transaction? This affects all consolidated executive matrices.')) {
      deleteSale(id);
    }
  };

  const handleDeletePurchase = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase transaction? This affects all consolidated executive matrices.')) {
      deletePurchase(id);
    }
  };

  // Filters
  const filteredSales = sales.filter(s => 
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPurchases = purchases.filter(p => 
    p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upper Title Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Ledger & Transactions Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Perform administrative CRUD adjustments. Enter direct overrides for sales or purchases and modify history.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            cancelEdit();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{showAddForm ? 'Cancel Entry' : `Record ${activeTab === 'sales' ? 'Direct Sale' : 'Direct Purchase'}`}</span>
        </button>
      </div>

      {/* Top Statistical Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Liters & Sales Revenue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-slate-800 dark:text-white">PKR {totalSalesAmount.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-semibold font-mono flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Sales
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{totalSalesLiters.toLocaleString()} L total / {totalSalesCount} entries</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Liters & Purchase Cost</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-slate-800 dark:text-white">PKR {totalPurchaseAmount.toLocaleString()}</span>
              <span className="text-xs text-blue-600 font-semibold font-mono flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" /> Cost
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{totalPurchaseLiters.toLocaleString()} L total / {totalPurchasesCount} entries</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Admin Operational Margin</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-black ${netActivityAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                PKR {netActivityAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Running</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Sales minus Purchases offset</span>
          </div>
          <div className={`p-3 rounded-lg ${netActivityAmount >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <DollarSign className={`w-6 h-6 ${netActivityAmount >= 0 ? 'text-green-600' : 'text-red-500'}`} />
          </div>
        </div>
      </div>

      {/* Record New Entry Expandable Admin Form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-5 shadow-inner transition-all duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Direct Entry Override: {activeTab === 'sales' ? 'Record Sale' : 'Record Purchase'}
            </h3>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-black uppercase">
              Admin Mode
            </span>
          </div>

          {activeTab === 'sales' ? (
            <form onSubmit={handleAddSale} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={saleForm.customerName}
                  onChange={e => setSaleForm({ ...saleForm, customerName: e.target.value })}
                  placeholder="e.g. Metro Distributors"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Customer Location</label>
                <input
                  type="text"
                  required
                  value={saleForm.location}
                  onChange={e => setSaleForm({ ...saleForm, location: e.target.value })}
                  placeholder="e.g. Zone 4 Depot"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quantity (Liters)</label>
                <input
                  type="number"
                  required
                  value={saleForm.liters}
                  onChange={e => setSaleForm({ ...saleForm, liters: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Rate (PKR / Liter)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={saleForm.rate}
                    onChange={e => setSaleForm({ ...saleForm, rate: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded h-[32px] transition-colors"
                >
                  Confirm Sale
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddPurchase} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Supplier / Farm Name</label>
                <input
                  type="text"
                  required
                  value={purchaseForm.source}
                  onChange={e => setPurchaseForm({ ...purchaseForm, source: e.target.value })}
                  placeholder="e.g. Crestview Farm"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Supplier Location</label>
                <input
                  type="text"
                  required
                  value={purchaseForm.location}
                  onChange={e => setPurchaseForm({ ...purchaseForm, location: e.target.value })}
                  placeholder="e.g. North Fields"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quantity (Liters)</label>
                <input
                  type="number"
                  required
                  value={purchaseForm.liters}
                  onChange={e => setPurchaseForm({ ...purchaseForm, liters: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Cost (PKR / Liter)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={purchaseForm.rate}
                    onChange={e => setPurchaseForm({ ...purchaseForm, rate: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 border rounded text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded h-[32px] transition-colors"
                >
                  Confirm Purchase
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Main Ledger Tables (Sales and Purchases logs) */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Nav Tabs & Search bar */}
        <div className="p-4 border-b dark:border-gray-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('sales');
                setSearchQuery('');
                cancelEdit();
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeTab === 'sales'
                  ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Sales Ledger ({sales.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('purchases');
                setSearchQuery('');
                cancelEdit();
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeTab === 'purchases'
                  ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Purchases Ledger ({purchases.length})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-4 py-1.5 border dark:border-gray-700 bg-white dark:bg-gray-800 text-xs rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sales Table */}
        {activeTab === 'sales' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/20 border-b dark:border-gray-800 text-[10px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-right">Milk Volume</th>
                  <th className="px-6 py-3 text-right">Price Rate</th>
                  <th className="px-6 py-3 text-right">Total Revenue</th>
                  <th className="px-6 py-3">Recorded On</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {filteredSales.length > 0 ? (
                  filteredSales.map(sale => {
                    const isEditing = editingId === sale.id;
                    return (
                      <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 font-mono font-bold text-slate-500">{sale.id}</td>
                        <td className="px-6 py-3 font-semibold">
                          {isEditing && editSaleData ? (
                            <input
                              type="text"
                              value={editSaleData.customerName}
                              onChange={e => setEditSaleData({ ...editSaleData, customerName: e.target.value })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs"
                            />
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {sale.customerName}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {isEditing && editSaleData ? (
                            <input
                              type="text"
                              value={editSaleData.location}
                              onChange={e => setEditSaleData({ ...editSaleData, location: e.target.value })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs"
                            />
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {sale.location}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono font-bold">
                          {isEditing && editSaleData ? (
                            <input
                              type="number"
                              value={editSaleData.liters}
                              onChange={e => setEditSaleData({ ...editSaleData, liters: parseFloat(e.target.value) || 0 })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs text-right w-20"
                            />
                          ) : (
                            <span>{sale.liters.toLocaleString()} L</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono">
                          {isEditing && editSaleData ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editSaleData.rate}
                              onChange={e => setEditSaleData({ ...editSaleData, rate: parseFloat(e.target.value) || 0 })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs text-right w-20"
                            />
                          ) : (
                            <span>PKR {sale.rate.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono font-black text-emerald-600">
                          {isEditing && editSaleData ? (
                            <span>PKR {(editSaleData.liters * editSaleData.rate).toFixed(2)}</span>
                          ) : (
                            <span>PKR {sale.total.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveSaleEdit(sale.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  title="Cancel Edit"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditSale(sale)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                  title="Edit Entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSale(sale.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-905/20 rounded-md transition-colors"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No sales matching search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Purchases Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/20 border-b dark:border-gray-800 text-[10px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Supplier / Farm</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-right">Milk Volume</th>
                  <th className="px-6 py-3 text-right">Cost Rate</th>
                  <th className="px-6 py-3 text-right">Total Outflow</th>
                  <th className="px-6 py-3">Recorded On</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map(purchase => {
                    const isEditing = editingId === purchase.id;
                    return (
                      <tr key={purchase.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 font-mono font-bold text-slate-500">{purchase.id}</td>
                        <td className="px-6 py-3 font-semibold">
                          {isEditing && editPurchaseData ? (
                            <input
                              type="text"
                              value={editPurchaseData.source}
                              onChange={e => setEditPurchaseData({ ...editPurchaseData, source: e.target.value })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs"
                            />
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                              <Truck className="w-3.5 h-3.5 text-slate-400" />
                              {purchase.source}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {isEditing && editPurchaseData ? (
                            <input
                              type="text"
                              value={editPurchaseData.location}
                              onChange={e => setEditPurchaseData({ ...editPurchaseData, location: e.target.value })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs"
                            />
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {purchase.location}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono font-bold">
                          {isEditing && editPurchaseData ? (
                            <input
                              type="number"
                              value={editPurchaseData.liters}
                              onChange={e => setEditPurchaseData({ ...editPurchaseData, liters: parseFloat(e.target.value) || 0 })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs text-right w-20"
                            />
                          ) : (
                            <span>{purchase.liters.toLocaleString()} L</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono">
                          {isEditing && editPurchaseData ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPurchaseData.rate}
                              onChange={e => setEditPurchaseData({ ...editPurchaseData, rate: parseFloat(e.target.value) || 0 })}
                              className="px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white font-sans text-xs text-right w-20"
                            />
                          ) : (
                            <span>PKR {purchase.rate.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-mono font-black text-blue-600">
                          {isEditing && editPurchaseData ? (
                            <span>PKR {(editPurchaseData.liters * editPurchaseData.rate).toFixed(2)}</span>
                          ) : (
                            <span>PKR {purchase.total.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(purchase.date).toLocaleDateString()} {new Date(purchase.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => savePurchaseEdit(purchase.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  title="Cancel Edit"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditPurchase(purchase)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                  title="Edit Entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePurchase(purchase.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-95px/20 rounded-md transition-colors"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No purchases matching search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
