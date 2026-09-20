import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, FileSpreadsheet, BookOpen, Users, DollarSign, Plus } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const { showToast, formatCurrency } = useApp();

  const chartOfAccounts = [
    { code: '1010', name: 'Cash on Hand & Cash Drawer', type: 'Asset', balance: 18072.78 },
    { code: '1020', name: 'Accounts Receivable (Customer Credit)', type: 'Asset', balance: 2450.00 },
    { code: '1200', name: 'Inventory Asset Valuation', type: 'Asset', balance: 52235.00 },
    { code: '2010', name: 'Accounts Payable (Vendor Bills)', type: 'Liability', balance: 14500.00 },
    { code: '3010', name: 'Owner Retained Earnings', type: 'Equity', balance: 58257.78 },
  ];

  const doubleEntryJournal = [
    { id: 'JNL-001', date: '2026-09-17', desc: 'POS Sale INV-891023 (Cash)', debitAcc: '1010 - Cash', creditAcc: '4010 - Sales Revenue', amount: 8072.78 },
    { id: 'JNL-002', date: '2026-09-16', desc: 'Inventory Stock Purchase PO-9912', debitAcc: '1200 - Inventory Asset', creditAcc: '2010 - Accounts Payable', amount: 3200.00 },
    { id: 'JNL-003', date: '2026-09-15', desc: 'Monthly Office Utilities Expense', debitAcc: '5010 - Utilities Expense', creditAcc: '1010 - Cash', amount: 349.50 },
  ];

  const payrollLogs = [
    { id: 'PAY-001', employee: 'Jane Smith', role: 'Head Cashier', grossSalary: 3500.00, deductions: 420.00, netPay: 3080.00, status: 'PROCESSED' },
    { id: 'PAY-002', employee: 'David Ochieng', role: 'Store Manager', grossSalary: 4800.00, deductions: 576.00, netPay: 4224.00, status: 'PROCESSED' },
  ];

  const handleExport = (reportName: string) => {
    showToast(`${reportName} exported to CSV format successfully`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financial Reports & Tax Export</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Export compliance tax audit reports, cashflow summaries, and ledger balances.</p>
      </div>

      {/* Chart of Accounts & Ledger */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Chart of Accounts (General Ledger)</h3>
          </div>
          <button
            onClick={() => handleExport('Chart of Accounts')}
            className="px-3 py-1.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export COA</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-navy-800 text-xs">
          {chartOfAccounts.map((acc) => (
            <div key={acc.code} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold mr-2">[{acc.code}]</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{acc.name}</span>
                <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-navy-800 text-slate-500 rounded text-[10px] font-semibold">{acc.type}</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(acc.balance)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Double-Entry Journal Entry Logs */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Double-Entry Journal Entry Audit Trail</h3>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[10px] font-bold text-slate-400 uppercase">
                <th className="py-2 px-3">Entry ID</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Debit Account</th>
                <th className="py-2 px-3">Credit Account</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 font-mono">
              {doubleEntryJournal.map((j) => (
                <tr key={j.id}>
                  <td className="py-2.5 px-3 font-bold text-brand-600">{j.id}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800 dark:text-slate-200">{j.desc}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-semibold">{j.debitAcc}</td>
                  <td className="py-2.5 px-3 text-amber-600 font-semibold">{j.creditAcc}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">{formatCurrency(j.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Management */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Basic Staff Payroll & Statutory Logging</h3>
          </div>
          <button
            onClick={() => showToast('Batch Payroll Run initiated for active staff', 'success')}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Process Monthly Payroll</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-navy-800 text-xs">
          {payrollLogs.map((p) => (
            <div key={p.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{p.employee} ({p.role})</div>
                <div className="text-slate-400">Gross: {formatCurrency(p.grossSalary)} | Statutory Deductions: {formatCurrency(p.deductions)}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">Net: {formatCurrency(p.netPay)}</span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold rounded text-[10px]">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
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
