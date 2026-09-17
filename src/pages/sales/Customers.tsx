import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Mail, Phone, X, Award } from 'lucide-react';

export const Customers: React.FC = () => {
  const { customers, addCustomer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(5000);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addCustomer({
      name,
      email,
      phone,
      creditLimit: Number(creditLimit),
    });

    setName('');
    setEmail('');
    setPhone('');
    setCreditLimit(5000);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customer Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage client profiles, contact records, and enterprise credit limits.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{c.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-navy-800">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{c.email || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-800/60 rounded-xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Credit Balance</span>
                <span className={`font-extrabold ${c.outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  KSh {c.outstandingBalance.toLocaleString()}
                </span>
              </div>
              <div className="text-center">
                <span className="text-slate-400 block text-[10px]">Loyalty Points</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{c.loyaltyPoints || 0} pts</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Credit Limit</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">KSh {c.creditLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Add Customer</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Full Name / Company *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@acme.com"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Credit Limit ($)</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
                Create Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
