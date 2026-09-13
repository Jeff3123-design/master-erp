import React from 'react';
import { useApp } from '../../context/AppContext';

export const Stock: React.FC = () => {
  const { products } = useApp();

  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.costPrice * p.stockQuantity, 0);
  const lowStock = products.filter((p) => p.stockQuantity <= p.minStockLevel);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Stock Valuation & Inventory Summary</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time inventory asset valuation and stock level diagnostics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory Asset Valuation</span>
          <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Physical Units in Stock</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {totalUnits.toLocaleString()} units
          </div>
        </div>
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Health Status</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {lowStock.length} Low / Out-of-stock
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Critical Reorder List</h3>
        <div className="divide-y divide-slate-100 dark:divide-navy-800">
          {lowStock.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{p.name} ({p.sku})</div>
                <div className="text-slate-400">Min Threshold: {p.minStockLevel} | Current: {p.stockQuantity}</div>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold rounded">
                Reorder Required
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
