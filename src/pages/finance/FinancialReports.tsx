import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const { showToast } = useApp();

  const handleExport = (reportName: string) => {
    showToast(`${reportName} exported to CSV format successfully`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financial Reports & Tax Export</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Export compliance tax audit reports, cashflow summaries, and ledger balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Sales Tax Ledger (VAT / GST)</h3>
              <p className="text-xs text-slate-400">Calculated sales tax collected vs input tax credits.</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('Sales Tax Ledger')}
            className="w-full py-2 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>

        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-navy-800 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Accounts Receivable Aging</h3>
              <p className="text-xs text-slate-400">Detailed customer credit balances aged by 30/60/90 days.</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('Accounts Receivable Aging')}
            className="w-full py-2 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
