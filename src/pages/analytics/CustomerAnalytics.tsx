import React from 'react';
import { useApp } from '../../context/AppContext';

export const CustomerAnalytics: React.FC = () => {
  const { customers } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customer Analytics & Lifetime Value</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Client purchasing power, debt risk profile, and repeat order rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{c.name}</h4>
            <div className="text-xs text-slate-400">Lifetime Purchase Value</div>
            <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
              ${c.totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
