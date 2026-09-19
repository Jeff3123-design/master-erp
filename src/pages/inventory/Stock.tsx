import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react';

export const Stock: React.FC = () => {
  const { products, suppliers, addPurchase, showToast, formatCurrency, setActiveTab } = useApp();

  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.costPrice * p.stockQuantity, 0);
  const lowStock = products.filter((p) => p.stockQuantity <= p.minStockLevel);

  const handleAutoGeneratePO = (product: typeof products[0]) => {
    const defaultSupplier = suppliers[0] || { id: 's-default', companyName: 'Global Wholesale Distributors Ltd' };
    const reorderQty = Math.max(20, product.minStockLevel * 2);
    const estimatedCost = product.costPrice * reorderQty;

    addPurchase({
      poNumber: `PO-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: defaultSupplier.id,
      supplierName: defaultSupplier.companyName,
      itemsCount: 1,
      totalAmount: estimatedCost,
      status: 'DRAFT',
    });

    showToast(`Draft Purchase Order generated for ${product.name} (${reorderQty} units)`, 'success');
  };

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
            {formatCurrency(totalValuation)}
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Critical Reorder Diagnostics & Auto-PO Generator</h3>
          <button
            onClick={() => setActiveTab('purchases')}
            className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Purchase Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-navy-800">
          {lowStock.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>All product inventory levels are healthy and above reorder thresholds!</span>
            </div>
          ) : (
            lowStock.map((p) => (
              <div key={p.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{p.name} ({p.sku})</div>
                  <div className="text-slate-400">Min Threshold: {p.minStockLevel} {p.unit} | Current: <span className="font-bold text-red-500">{p.stockQuantity} {p.unit}</span></div>
                </div>
                <button
                  onClick={() => handleAutoGeneratePO(p)}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Auto-Generate Purchase Order</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
