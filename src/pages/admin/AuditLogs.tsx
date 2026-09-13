import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Lock,
  X,
  FileCode2,
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';

  if (!isOwnerOrAdmin) {
    return (
      <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-red-200 dark:border-red-900 my-8 space-y-3">
        <Lock className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Access Restricted</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Audit Logs contain sensitive security events and are accessible exclusively by <strong>Owner</strong> or <strong>Admin</strong> privileges.
        </p>
      </div>
    );
  }

  const modulesList = ['ALL', ...Array.from(new Set(auditLogs.map((l) => l.module)))];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesQuery =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMod = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchesQuery && matchesMod;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Immutable Audit Trail</span>
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cryptographically verifiable audit log of sensitive system operations, price edits, stock adjustments, and voids.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, or record ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {modulesList.map((m) => (
              <option key={m} value={m}>
                {m === 'ALL' ? 'All Modules' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Operation Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4 text-right">Value Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No audit events match your search filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{log.userName}</td>
                    <td className="py-3 px-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md font-bold bg-brand-50 text-brand-700 dark:bg-navy-800 dark:text-brand-400 border border-brand-200 dark:border-navy-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">{log.module}</td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{log.recordId}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Diff</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Audit State Inspector</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLog.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Action:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.recordId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-500">{selectedLog.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-red-600 uppercase block">Previous Value</span>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.previousValue, null, 2) || 'null'}
                </pre>
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">New Value</span>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.newValue, null, 2) || 'null'}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
