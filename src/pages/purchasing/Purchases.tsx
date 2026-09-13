import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X } from 'lucide-react';

export const Purchases: React.FC = () => {
  const { purchases, suppliers, addPurchase, updatePurchaseStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(1000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) return;

    const supp = suppliers.find((s) => s.id === supplierId);
    if (!supp) return;

    addPurchase({
      poNumber: `PO-2025-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: supp.id,
      supplierName: supp.companyName,
      itemsCount: 10,
      totalAmount: Number(totalAmount),
      status: 'DRAFT',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Purchase Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage procurement purchase orders, supplier fulfillment, and approval workflows.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">PO Number</th>
              <th className="py-3.5 px-4">Supplier</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date Created</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {purchases.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">{po.poNumber}</td>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{po.supplierName}</td>
                <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-100">${po.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      po.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {po.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-slate-400">{new Date(po.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  {po.status === 'DRAFT' && (
                    <button
                      onClick={() => updatePurchaseStatus(po.id, 'APPROVED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Approve PO
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Create Purchase Order</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Select Supplier *</label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                >
                  <option value="">Select a vendor...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Total Estimated Amount ($)</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
                Issue Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
