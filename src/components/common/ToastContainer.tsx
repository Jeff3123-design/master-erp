import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800'
              : toast.type === 'info'
              ? 'bg-blue-50 dark:bg-navy-800 text-brand-900 dark:text-brand-200 border-brand-200 dark:border-navy-700'
              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-500 shrink-0" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
