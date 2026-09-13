import React from 'react';
import { useApp } from '../../context/AppContext';

export const Payments: React.FC = () => {
  const { sales, vendorBills } = useApp();

  const customerPayments = sales.map((s) => ({
    id: s.id,
    type: 'CUSTOMER_SALE',
    ref: s.invoiceNumber,
    entity: s.customerName || 'Walk-in Customer',
    amount: s.totalAmount,
    date: new Date(s.createdAt).toLocaleDateString(),
    status: 'RECEIVED',
  }));

  const vendorPayments = vendorBills
    .filter((b) => b.status === 'PAID')
    .map((b) => ({
      id: b.id,
      type: 'VENDOR_BILL',
      ref: b.billNumber,
      entity: b.supplierName,
      amount: b.amount,
      date: b.dueDate,
      status: 'PAID_OUT',
    }));

  const allPayments = [...customerPayments, ...vendorPayments];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payments Ledger</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Unified audit history of inbound customer payments and outbound vendor settlements.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Reference #</th>
              <th className="py-3.5 px-4">Party</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {allPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 text-xs font-mono text-slate-400">{p.date}</td>
                <td className="py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-400">{p.type}</td>
                <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">{p.ref}</td>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{p.entity}</td>
                <td className={`py-3 px-4 font-extrabold ${p.status === 'RECEIVED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {p.status === 'RECEIVED' ? '+' : '-'}${p.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
