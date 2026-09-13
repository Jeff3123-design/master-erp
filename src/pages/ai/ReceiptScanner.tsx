import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ReceiptScanner: React.FC = () => {
  const { addExpense, showToast } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    vendor: string;
    amount: number;
    category: string;
    items: Array<{ desc: string; price: number }>;
  } | null>(null);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedData({
        vendor: 'Staples Office Supply Center',
        amount: 349.50,
        category: 'Utilities',
        items: [
          { desc: 'High-speed Barcode Scanner Unit', price: 249.50 },
          { desc: 'Thermal Receipt Rolls 50pk', price: 100.00 },
        ],
      });
      showToast('AI Receipt OCR extraction completed with 98.2% confidence', 'success');
    }, 1500);
  };

  const handleApproveExpense = () => {
    if (!scannedData) return;
    addExpense({
      category: scannedData.category,
      description: `[AI OCR] ${scannedData.vendor} Receipt`,
      amount: scannedData.amount,
      recordedBy: 'AI Document Processor',
      expenseDate: new Date().toISOString().split('T')[0],
    });
    setScannedData(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>AI Receipt Scanner</span>
          <span className="px-2 py-0.5 bg-brand-100 text-brand-700 dark:bg-navy-800 dark:text-brand-400 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous OCR
          </span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Scan paper receipt images or PDFs to auto-populate expenses and line items.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-navy-700 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Drop store receipt image here</h3>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP, or PDF (Up to 10MB)</p>
        </div>
        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/20"
        >
          {scanning ? 'Processing AI Neural Network OCR...' : 'Upload & Simulate AI Receipt Scan'}
        </button>
      </div>

      {scannedData && (
        <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-base">Extracted Receipt Metadata</h3>
            </div>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
              Confidence: 98.2%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Vendor Name:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{scannedData.vendor}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Detected Total Amount:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">${scannedData.amount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Extracted Line Items</span>
            <div className="space-y-1">
              {scannedData.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-navy-800 rounded">
                  <span className="text-slate-700 dark:text-slate-300">{it.desc}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">${it.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleApproveExpense}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2"
          >
            <span>Approve & Post directly to Expenses Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
