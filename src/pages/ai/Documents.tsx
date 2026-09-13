import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye } from 'lucide-react';

export const Documents: React.FC = () => {
  const { aiDocuments, showToast } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Document Vault</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Encrypted enterprise document store for invoices, receipts, and compliance contracts.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Filename</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Vendor</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Upload Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {aiDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{doc.filename}</td>
                <td className="py-3 px-4 text-xs font-semibold text-slate-500">{doc.docType}</td>
                <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{doc.vendorName}</td>
                <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-100">${doc.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-xs text-slate-400">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => showToast(`Previewing ${doc.filename}`, 'info')}
                    className="p-1.5 rounded text-slate-400 hover:text-brand-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
