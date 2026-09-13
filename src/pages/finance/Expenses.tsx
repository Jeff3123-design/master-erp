import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X } from 'lucide-react';

export const Expenses: React.FC = () => {
  const { expenses, addExpense } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState('Utilities');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(250);

  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    addExpense({
      category,
      description,
      amount: Number(amount),
      recordedBy: 'Alex Morgan',
      expenseDate: new Date().toISOString().split('T')[0],
    });

    setDescription('');
    setAmount(250);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Expenses Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Record operational overheads, utilities, salaries, and store maintenance costs.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Operational Expenses</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            ${totalExpenseSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Recorded By</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 text-xs font-mono text-slate-400">{e.expenseDate}</td>
                <td className="py-3 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-navy-800 rounded">{e.category}</span>
                </td>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{e.description}</td>
                <td className="py-3 px-4 text-xs text-slate-500">{e.recordedBy}</td>
                <td className="py-3 px-4 text-right font-extrabold text-amber-600 dark:text-amber-400">
                  ${e.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Record New Expense</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                >
                  <option value="Utilities">Utilities & Cooling</option>
                  <option value="Software & SaaS">Software & SaaS</option>
                  <option value="Rent & Lease">Rent & Lease</option>
                  <option value="Salaries & Wages">Salaries & Wages</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. AWS Cloud Server Renewal"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-bold text-amber-600"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
                Log Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
