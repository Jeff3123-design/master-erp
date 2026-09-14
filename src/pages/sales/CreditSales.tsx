import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Send, DollarSign, X } from 'lucide-react';

export const CreditSales: React.FC = () => {
  const { customers, setCustomers, addAuditLog, showToast } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const creditAccounts = customers.filter((c) => c.outstandingBalance > 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const handleSendReminder = (customerName: string) => {
    showToast(`Payment reminder notification sent to ${customerName}`, 'info');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || paymentAmount <= 0) return;

    const prevBalance = selectedCustomer.outstandingBalance;
    const newBalance = Math.max(0, prevBalance - paymentAmount);

    setCustomers((prev) =>
      prev.map((c) => (c.id === selectedCustomer.id ? { ...c, outstandingBalance: newBalance } : c))
    );

    addAuditLog(
      'CREDIT_PAYMENT_RECORDED',
      'Sales',
      selectedCustomer.id,
      { outstandingBalance: prevBalance },
      { outstandingBalance: newBalance, amountPaid: paymentAmount }
    );

    showToast(`Payment of $${paymentAmount.toFixed(2)} recorded for ${selectedCustomer.name}`, 'success');
    setSelectedCustomer(null);
    setPaymentAmount(0);
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
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(c);
                            setPaymentAmount(c.outstandingBalance);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          Settle Payment
                        </button>
                        <button
                          onClick={() => handleSendReminder(c.name)}
                          className="p-1.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
                          title="Send Reminder"
                        >
                          <Send className="w-3.5 h-3.5" />
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

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleRecordPayment} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span>Settle Credit Payment</span>
              </h3>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between"><span>Customer:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCustomer.name}</span></div>
              <div className="flex justify-between"><span>Current Outstanding:</span> <span className="font-extrabold text-amber-600">${selectedCustomer.outstandingBalance.toFixed(2)}</span></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                max={selectedCustomer.outstandingBalance}
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-bold text-emerald-600"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl">
                Confirm Payment Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
