import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { Printer, X, Zap, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, sale }) => {
  const { activeBranch, formatCurrency } = useApp();

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800 max-w-sm w-full p-5 space-y-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Thermal Receipt Preview</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Paper Simulation */}
        <div className="flex-1 overflow-y-auto bg-amber-50/40 dark:bg-navy-950/80 p-4 rounded-2xl border border-amber-200/60 dark:border-navy-800 font-mono text-[11px] leading-tight text-slate-800 dark:text-slate-200 space-y-3 custom-scrollbar">
          {/* Receipt Header */}
          <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300 dark:border-navy-700">
            <div className="font-extrabold text-sm flex items-center justify-center gap-1 text-slate-900 dark:text-white">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> BUZZ ERP
            </div>
            <div className="font-bold uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-300">{activeBranch.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Branch Code: {activeBranch.code}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Tel: +254 (0) 700 000 000 | PIN: P051239820Z</div>
          </div>

          {/* Invoice Meta */}
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 pb-2 border-b border-dashed border-slate-300 dark:border-navy-700">
            <div className="flex justify-between"><span>INVOICE #:</span><span className="font-bold text-slate-900 dark:text-slate-100">{sale.invoiceNumber}</span></div>
            <div className="flex justify-between"><span>DATE / TIME:</span><span>{new Date(sale.createdAt).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>CUSTOMER:</span><span>{sale.customerName || 'Walk-In Customer'}</span></div>
            <div className="flex justify-between"><span>CASHIER:</span><span>{sale.createdBy}</span></div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 py-1">
            <div className="grid grid-cols-12 font-bold border-b border-slate-300 dark:border-navy-700 pb-1 text-[10px] uppercase">
              <span className="col-span-2">Qty</span>
              <span className="col-span-6">Item</span>
              <span className="col-span-4 text-right">Total</span>
            </div>
            {sale.items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 text-[10px] gap-1">
                <span className="col-span-2 font-bold">{it.quantity}x</span>
                <span className="col-span-6 truncate">{it.productName}</span>
                <span className="col-span-4 text-right font-bold">{formatCurrency(it.totalPrice)}</span>
              </div>
            ))}
          </div>

          {/* Total Calculation */}
          <div className="pt-2 border-t border-dashed border-slate-300 dark:border-navy-700 space-y-1 text-[10px]">
            <div className="flex justify-between"><span>SUBTOTAL:</span><span>{formatCurrency(sale.subtotal)}</span></div>
            <div className="flex justify-between"><span>TAX (8%):</span><span>{formatCurrency(sale.tax)}</span></div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>DISCOUNT:</span><span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-300 dark:border-navy-700">
              <span>TOTAL PAID:</span><span>{formatCurrency(sale.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>METHOD:</span><span className="font-bold uppercase text-slate-800 dark:text-slate-200">{sale.paymentMethod}</span>
            </div>
          </div>

          {/* Footer Barcode Simulation */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 dark:border-navy-700 space-y-2">
            <div className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 font-mono text-[10px] font-bold tracking-widest rounded">
              * {sale.invoiceNumber} *
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              Thank you for shopping with us! <br />
              Goods once sold are returnable within 7 days with valid receipt.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
