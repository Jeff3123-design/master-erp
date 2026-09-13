import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight } from 'lucide-react';

export const InventoryAnalytics: React.FC = () => {
  const { products } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory Velocity & Turnover</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Stock turnover ratios, holding costs, and product demand metrics.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Top Performing SKU Velocity</h3>
        <div className="space-y-3">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-navy-800/60 rounded-xl">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{p.name}</div>
                <div className="text-xs text-slate-400">{p.category} • SKU: {p.sku}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> High Turnover
                </span>
                <span className="text-xs text-slate-400 block">${p.sellingPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
