import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { Search, Filter, Eye, AlertOctagon, X } from 'lucide-react';

export const SalesList: React.FC = () => {
  const { sales, voidSale, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [voidModalSale, setVoidModalSale] = useState<Sale | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const filteredSales = sales.filter((s) => {
    const matchesQuery =
      s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleConfirmVoid = () => {
    if (!voidModalSale) return;
    if (!voidReason.trim()) {
      showToast('Please provide a reason for voiding this sale', 'error');
      return;
    }
    voidSale(voidModalSale.id, voidReason);
    setVoidModalSale(null);
    setVoidReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Complete historical record of all completed, voided, and returned sales.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="VOIDED">Voided</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No sales transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-brand-600 dark:text-brand-400">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {sale.customerName || 'Walk-in Customer'}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {sale.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sale.status === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600'
                            : 'bg-red-100 dark:bg-red-950/80 text-red-600'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {sale.status === 'COMPLETED' && (
                        <button
                          onClick={() => setVoidModalSale(sale)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                          title="Void Sale"
                        >
                          <AlertOctagon className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Sale Details: {selectedSale.invoiceNumber}</h3>
              <button onClick={() => setSelectedSale(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSale.customerName || 'Walk-in'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(selectedSale.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSale.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-navy-800 pt-3">
              <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Line Items</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedSale.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs p-2 rounded bg-slate-50 dark:bg-navy-800">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.productName}</div>
                      <div className="text-[10px] text-slate-400">{item.quantity} x ${item.unitPrice.toFixed(2)}</div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">${item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-navy-800 pt-3 text-right">
              <span className="text-xs text-slate-400 block">Total Paid</span>
              <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">${selectedSale.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {voidModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Void Sale Transaction?</h3>
            </div>
            <p className="text-xs text-slate-500">
              Voiding invoice <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{voidModalSale.invoiceNumber}</span> will restore stock inventory levels and write an audit event.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Reason for voiding *</label>
              <textarea
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g. Customer cancelled order / Wrong barcode scanned"
                className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs focus:outline-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setVoidModalSale(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVoid}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
