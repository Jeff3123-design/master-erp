import React from 'react';
import { useApp } from '../../context/AppContext';

export const VendorBills: React.FC = () => {
  const { vendorBills, payVendorBill } = useApp();

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
                      onClick={() => payVendorBill(b.id)}
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
    </div>
  );
};
