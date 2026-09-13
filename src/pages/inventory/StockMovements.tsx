import React from 'react';
import { useApp } from '../../context/AppContext';

export const StockMovements: React.FC = () => {
  const { auditLogs } = useApp();

  const movements = auditLogs.filter(
    (log) => log.action === 'STOCK_ADJUSTMENT' || log.action === 'SALE_RECORDED' || log.module === 'Inventory'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Stock Movements Ledger</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Audit trail of all physical inventory additions, sales deductions, and adjustments.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Event Type</th>
              <th className="py-3.5 px-4">Record / SKU</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-xs">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                  <td className="py-3 px-4 text-slate-400 font-mono">{new Date(m.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                      {m.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-brand-600 dark:text-brand-400">{m.recordId}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">{m.userName}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{JSON.stringify(m.newValue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
