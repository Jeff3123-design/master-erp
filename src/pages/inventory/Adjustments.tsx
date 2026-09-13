import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SlidersHorizontal } from 'lucide-react';

export const Adjustments: React.FC = () => {
  const { products, adjustStock } = useApp();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState('');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    adjustStock(selectedProductId, Number(newStock), reason || 'Manual Audit Count Adjustment');
    setSelectedProductId('');
    setNewStock(0);
    setReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Stock Adjustments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Perform stock reconciliation, write-offs, damage write-downs, or stock intake.</p>
      </div>

      <form onSubmit={handleAdjust} className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Select Product *</label>
          <select
            required
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              const p = products.find((prod) => prod.id === e.target.value);
              if (p) setNewStock(p.stockQuantity);
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-semibold"
          >
            <option value="">Select a product to reconcile...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Current Stock: {p.stockQuantity}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="p-3 bg-slate-50 dark:bg-navy-800/60 rounded-xl text-xs space-y-1">
            <div className="flex justify-between"><span>Current Recorded Stock:</span> <span className="font-bold">{selectedProduct.stockQuantity} {selectedProduct.unit}</span></div>
            <div className="flex justify-between"><span>Unit Cost:</span> <span className="font-bold">${selectedProduct.costPrice.toFixed(2)}</span></div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">New Physical Stock Count *</label>
          <input
            type="number"
            required
            min="0"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-bold text-brand-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Reason for Adjustment</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Physical inventory count variance / Damaged goods written off"
            className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={!selectedProductId}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Save Stock Adjustment & Log Audit Record</span>
        </button>
      </form>
    </div>
  );
};
