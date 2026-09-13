import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export const InvoiceScanner: React.FC = () => {
  const { aiDocuments, showToast } = useApp();

  const handleApproveDoc = (docId: string) => {
    showToast(`Invoice document approved & linked to purchasing vendor accounts`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>AI Invoice Queue & Matcher</span>
          <Sparkles className="w-5 h-5 text-brand-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Automated vendor bill extraction and 3-way purchase order matching.</p>
      </div>

      <div className="space-y-4">
        {aiDocuments.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{doc.filename}</h4>
                <div className="text-xs text-slate-400">Vendor: {doc.vendorName} • Confidence: {doc.confidenceScore}%</div>
              </div>
              <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                ${doc.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => handleApproveDoc(doc.id)}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold"
              >
                Approve & Match Purchase Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
