import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VendorBill } from '../../types';
import { DollarSign, X } from 'lucide-react';

export const VendorBills: React.FC = () => {
  const { vendorBills, setVendorBills, setSuppliers, addAuditLog, showToast } = useApp();
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handleSettleBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill || paymentAmount <= 0) return;

    setVendorBills((prev) =>
      prev.map((b) => (b.id === selectedBill.id ? { ...b, status: 'PAID' } : b))
    );

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedBill.supplierId
          ? { ...s, balanceOwed: Math.max(0, s.balanceOwed - paymentAmount) }
          : s
      )
    );

    addAuditLog('VENDOR_BILL_PAID', 'Finance', selectedBill.billNumber, { status: selectedBill.status }, { status: 'PAID', amount: paymentAmount });
    showToast(`Payment of $${paymentAmount.toFixed(2)} posted for Bill ${selectedBill.billNumber}`, 'success');
    setSelectedBill(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vendor Bills & Accounts Payable</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track incoming invoices, payment due dates, and overdue alerts.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Bill #</th>
              <th className="py-3.5 px-4">Supplier</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {vendorBills.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">{b.billNumber}</td>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{b.supplierName}</td>
                <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-100">${b.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-xs font-mono text-slate-500">{b.dueDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      b.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : b.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {b.status !== 'PAID' && (
                    <button
                      onClick={() => {
                        setSelectedBill(b);
                        setPaymentAmount(b.amount);
                      }}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Record Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSettleBill} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-500" />
                <span>Settle Vendor Bill</span>
              </h3>
              <button type="button" onClick={() => setSelectedBill(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between"><span>Bill Number:</span> <span className="font-bold font-mono">{selectedBill.billNumber}</span></div>
              <div className="flex justify-between"><span>Supplier:</span> <span className="font-bold">{selectedBill.supplierName}</span></div>
              <div className="flex justify-between"><span>Bill Amount:</span> <span className="font-extrabold text-amber-600">${selectedBill.amount.toFixed(2)}</span></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-bold text-brand-600"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl">
                Post Outbound Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
