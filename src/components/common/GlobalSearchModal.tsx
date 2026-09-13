import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Package,
  Users,
  Building2,
  ShoppingCart,
  FileText,
  X,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, products, customers, suppliers, sales, vendorBills, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredProducts = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : [];
  const filteredCustomers = q ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)) : [];
  const filteredSuppliers = q ? suppliers.filter((s) => s.companyName.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q)) : [];
  const filteredSales = q ? sales.filter((s) => s.invoiceNumber.toLowerCase().includes(q) || (s.customerName && s.customerName.toLowerCase().includes(q))) : [];
  const filteredBills = q ? vendorBills.filter((b) => b.billNumber.toLowerCase().includes(q) || b.supplierName.toLowerCase().includes(q)) : [];

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-navy-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search products, customers, suppliers, sales, bills... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-4 pl-3 pr-10 text-slate-900 dark:text-slate-100 bg-transparent text-base focus:outline-none placeholder-slate-400"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {!q && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              Type anything to search across all system entities...
            </div>
          )}

          {q && filteredProducts.length === 0 && filteredCustomers.length === 0 && filteredSuppliers.length === 0 && filteredSales.length === 0 && filteredBills.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Package className="w-4 h-4 text-brand-500" />
                <span>Products ({filteredProducts.length})</span>
              </div>
              <div className="space-y-1">
                {filteredProducts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('products')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.sku} • Stock: {item.stockQuantity} {item.unit}</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">${item.sellingPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCustomers.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Customers ({filteredCustomers.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCustomers.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('customers')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.email} • {item.phone}</div>
                    </div>
                    <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300">
                      Balance: ${item.outstandingBalance.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredSuppliers.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Suppliers ({filteredSuppliers.length})</span>
              </div>
              <div className="space-y-1">
                {filteredSuppliers.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('suppliers')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.companyName}</div>
                      <div className="text-xs text-slate-400">{item.contactPerson}</div>
                    </div>
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Owed: ${item.balanceOwed.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredSales.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <ShoppingCart className="w-4 h-4 text-brand-500" />
                <span>Sales ({filteredSales.length})</span>
              </div>
              <div className="space-y-1">
                {filteredSales.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('sales')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.invoiceNumber}</div>
                      <div className="text-xs text-slate-400">{item.customerName || 'Walk-in Customer'} • {item.paymentMethod}</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${item.totalAmount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredBills.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span>Vendor Bills ({filteredBills.length})</span>
              </div>
              <div className="space-y-1">
                {filteredBills.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('vendor_bills')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.billNumber}</div>
                      <div className="text-xs text-slate-400">{item.supplierName} • Due: {item.dueDate}</div>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.status === 'OVERDUE' ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      ${item.amount.toFixed(2)} ({item.status})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-navy-800 rounded font-mono text-slate-600 dark:text-slate-300">CTRL + K</kbd> to access search anywhere</span>
          <span className="flex items-center space-x-1"><span>Esc to close</span></span>
        </div>
      </div>
    </div>
  );
};
