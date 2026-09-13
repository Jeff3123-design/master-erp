import React from 'react';
import { useApp } from '../../context/AppContext';

export const ProfitLoss: React.FC = () => {
  const { sales, expenses } = useApp();

  const totalGrossRevenue = sales.reduce((acc, s) => acc + (s.status !== 'VOIDED' ? s.totalAmount : 0), 0);
  const totalOperatingExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const estimatedCOGS = totalGrossRevenue * 0.55;
  const grossProfit = totalGrossRevenue - estimatedCOGS;
  const netProfit = grossProfit - totalOperatingExpenses;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profit & Loss (P&L) Statement</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Income summary, Cost of Goods Sold (COGS), operating expenses, and net profit margins.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Operating Income</span>
            <div className={`text-3xl font-extrabold mt-1 ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
              ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Profit Margin</span>
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
              {totalGrossRevenue > 0 ? ((netProfit / totalGrossRevenue) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-navy-800">
            <span>Gross Sales Revenue</span>
            <span className="text-emerald-600 dark:text-emerald-400">${totalGrossRevenue.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-4 text-xs">
            <span>Cost of Goods Sold (COGS 55%)</span>
            <span>-${estimatedCOGS.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 pt-2 border-t border-slate-100 dark:border-navy-800">
            <span>Gross Operating Profit</span>
            <span>${grossProfit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-4 text-xs">
            <span>Operating Overheads & Expenses</span>
            <span className="text-amber-600">-${totalOperatingExpenses.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-slate-100 pt-3 border-t-2 border-slate-200 dark:border-navy-800">
            <span>Net Profit / (Loss)</span>
            <span className={netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}>
              ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
