import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Send } from 'lucide-react';

export const CreditSales: React.FC = () => {
  const { customers, showToast } = useApp();

  const creditAccounts = customers.filter((c) => c.outstandingBalance > 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const handleSendReminder = (customerName: string) => {
    showToast(`Payment reminder notification sent to ${customerName}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Credit Sales & Accounts Receivable</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track unpaid customer balances, credit limits, and aging invoices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accounts Receivable</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            ${totalReceivables.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Debtors</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {creditAccounts.length} Customers
          </div>
        </div>
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Risk Health</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            Good (82%)
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-navy-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Active Credit Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Credit Limit</th>
                <th className="py-3.5 px-4">Outstanding Balance</th>
                <th className="py-3.5 px-4">Available Credit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
              {creditAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No active credit accounts with outstanding balances.
                  </td>
                </tr>
              ) : (
                creditAccounts.map((c) => {
                  const available = c.creditLimit - c.outstandingBalance;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{c.name}</td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">${c.creditLimit.toFixed(2)}</td>
                      <td className="py-3 px-4 font-extrabold text-amber-600 dark:text-amber-400">${c.outstandingBalance.toFixed(2)}</td>
                      <td className="py-3 px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">${available.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSendReminder(c.name)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Reminder</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
