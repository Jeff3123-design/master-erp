import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, Search } from 'lucide-react';

export const Returns: React.FC = () => {
  const { sales, showToast } = useApp();
  const [invoiceQuery, setInvoiceQuery] = useState('');
  const [reason, setReason] = useState('');

  const foundSale = sales.find((s) => s.invoiceNumber.toLowerCase() === invoiceQuery.trim().toLowerCase());

  const handleProcessReturn = () => {
    if (!foundSale) {
      showToast('No valid sale invoice found to return', 'error');
      return;
    }
    showToast(`Return processed for ${foundSale.invoiceNumber}. Inventory restocked.`, 'success');
    setInvoiceQuery('');
    setReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Returns & Refunds</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Process customer product returns, restock inventory, and issue store credit/refunds.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-6 shadow-xs">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Lookup Invoice Number</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Invoice # (e.g. INV-2025-001)"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {foundSale && (
          <div className="p-4 bg-slate-50 dark:bg-navy-800/60 rounded-xl border border-slate-200 dark:border-navy-700 space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-navy-700 pb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Invoice: {foundSale.invoiceNumber}</span>
              <span className="text-xs text-slate-500">Total: ${foundSale.totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Returnable Items</h4>
              {foundSale.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs p-2 bg-white dark:bg-navy-900 rounded border border-slate-100 dark:border-navy-800">
                  <span>{item.productName} (Qty: {item.quantity})</span>
                  <span className="font-bold">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Return Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Defective item / Customer exchange request..."
                className="w-full p-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl text-xs"
                rows={2}
              />
            </div>

            <button
              onClick={handleProcessReturn}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Process Full Return & Restock Inventory</span>
            </button>
          </div>
        )}

        {!foundSale && invoiceQuery && (
          <div className="text-center py-6 text-slate-400 text-sm">
            No sale found matching "{invoiceQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
