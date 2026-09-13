import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationOpen, setNotificationOpen, notifications, markNotificationsAsRead } = useApp();

  if (!isNotificationOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 shadow-2xl border-l border-slate-200 dark:border-navy-800 flex flex-col h-full animate-slide-left">
        <div className="p-4 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between bg-slate-50/50 dark:bg-navy-950/50">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markNotificationsAsRead}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium mr-2"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  !item.read
                    ? 'bg-slate-50 dark:bg-navy-800/80 border-slate-200 dark:border-navy-700 shadow-xs'
                    : 'bg-white dark:bg-navy-900 border-slate-100 dark:border-navy-800 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getIcon(item.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.title}</h4>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
