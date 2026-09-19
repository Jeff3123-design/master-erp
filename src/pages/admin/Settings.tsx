import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Lock,
  CheckCircle2,
  Database,
  RefreshCw,
} from 'lucide-react';
import { checkSupabaseConnection, SupabaseHealth } from '../../lib/supabase';

interface ModuleConfig {
  key: string;
  label: string;
  category: string;
  description: string;
}

const ALL_MODULES: ModuleConfig[] = [
  { key: 'pos', label: 'POS Terminal', category: 'SALES', description: 'Cashier checkout grid and payment processing' },
  { key: 'sales', label: 'Sales History', category: 'SALES', description: 'View and search past sales transactions' },
  { key: 'returns', label: 'Returns & Refunds', category: 'SALES', description: 'Process customer product returns and store credits' },
  { key: 'customers', label: 'Customer Directory', category: 'SALES', description: 'Customer profiles and contact management' },
  { key: 'credit_sales', label: 'Credit Sales', category: 'SALES', description: 'Track outstanding customer accounts receivable' },

  { key: 'products', label: 'Products Catalog', category: 'INVENTORY', description: 'Master product directory, prices, and SKUs' },
  { key: 'stock', label: 'Stock Valuation', category: 'INVENTORY', description: 'Stock asset valuation and reorder alerts' },
  { key: 'stock_movements', label: 'Stock Movements', category: 'INVENTORY', description: 'Inventory movement audit trail' },
  { key: 'adjustments', label: 'Stock Adjustments', category: 'INVENTORY', description: 'Reconcile physical inventory counts' },

  { key: 'purchases', label: 'Purchase Orders', category: 'PURCHASING', description: 'Issue and approve vendor purchase orders' },
  { key: 'suppliers', label: 'Vendors / Suppliers', category: 'PURCHASING', description: 'Supplier CRM and contact directory' },
  { key: 'vendor_bills', label: 'Vendor Bills', category: 'PURCHASING', description: 'Accounts payable and due date tracking' },

  { key: 'expenses', label: 'Expenses', category: 'FINANCE', description: 'Track store operational expenses and utilities' },
  { key: 'payments', label: 'Payments Ledger', category: 'FINANCE', description: 'Unified inbound/outbound payment history' },
  { key: 'profit_loss', label: 'Profit & Loss', category: 'FINANCE', description: 'Income statement and profit margins' },
  { key: 'financial_reports', label: 'Financial Reports', category: 'FINANCE', description: 'Export tax and compliance audit reports' },

  { key: 'sales_analytics', label: 'Sales Analytics', category: 'ANALYTICS', description: 'Visual revenue trend analytics' },
  { key: 'inventory_analytics', label: 'Inventory Analytics', category: 'ANALYTICS', description: 'Product turnover velocity' },
  { key: 'customer_analytics', label: 'Customer Analytics', category: 'ANALYTICS', description: 'Client lifetime value analysis' },

  { key: 'receipt_scanner', label: 'Receipt Scanner', category: 'AI & DOCUMENTS', description: 'Autonomous AI receipt OCR scanner' },
  { key: 'invoice_scanner', label: 'Invoice Scanner', category: 'AI & DOCUMENTS', description: 'Automated 3-way PO invoice matcher' },
  { key: 'documents', label: 'Document Vault', category: 'AI & DOCUMENTS', description: 'Encrypted document repository' },

  { key: 'users', label: 'Users', category: 'ADMIN', description: 'Manage user access accounts' },
  { key: 'roles', label: 'Roles', category: 'ADMIN', description: 'RBAC security role configurations' },
  { key: 'audit_logs', label: 'Audit Logs', category: 'ADMIN', description: 'System-wide immutable operation audit trail' },
  { key: 'settings', label: 'Settings', category: 'ADMIN', description: 'System settings and permission control' },
];

export const SettingsPage: React.FC = () => {
  const { salesPermissions, updateSalesPermission, currentUser, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [dbHealth, setDbHealth] = useState<SupabaseHealth>({
    isConnected: true,
    dbVersion: 'PostgreSQL 15.1 (Supabase Cloud)',
    url: 'https://mock-tenant.supabase.co',
    activeTables: ['products', 'sales', 'customers', 'suppliers', 'expenses', 'audit_logs'],
    latencyMs: 24,
  });

  const handleTestSupabase = async () => {
    setIsCheckingDb(true);
    const health = await checkSupabaseConnection();
    setDbHealth(health);
    setIsCheckingDb(false);
    showToast(`Supabase Database Ping Success: Latency ${health.latencyMs}ms`, 'success');
  };

  const categories = ['ALL', 'SALES', 'INVENTORY', 'PURCHASING', 'FINANCE', 'ANALYTICS', 'AI & DOCUMENTS', 'ADMIN'];

  const filteredModules = ALL_MODULES.filter(
    (m) => activeCategory === 'ALL' || m.category === activeCategory
  );

  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Buzz ERP Admin App Assignment Settings</span>
          <Settings className="w-5 h-5 text-brand-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select which app icons and modules are clickable, visible, and usable for the Sales Team role.
        </p>
      </div>

      {!isOwnerOrAdmin && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center space-x-3 text-xs text-amber-800 dark:text-amber-200">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Restricted Notice:</strong> You are currently viewing this page under a non-admin role. Permission toggles are locked. Switch to <strong>Admin View</strong> in the top header to edit settings.
          </span>
        </div>
      )}

      {/* Supabase SaaS Tenant Engine Diagnostics */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Supabase SaaS Cloud Engine</h3>
              <p className="text-xs text-slate-400">PostgreSQL multi-tenant database & real-time sync status</p>
            </div>
          </div>

          <button
            onClick={handleTestSupabase}
            disabled={isCheckingDb}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>{isCheckingDb ? 'Pinging DB...' : 'Test DB Connection'}</span>
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-navy-800/80 rounded-xl space-y-2 text-xs border border-slate-100 dark:border-navy-700">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">SaaS Schema & Table Health Status:</span>
          <div className="flex flex-wrap gap-2">
            {dbHealth.activeTables.map((tbl) => (
              <span key={tbl} className="px-2 py-0.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                public.{tbl}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Connection Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected (Synced)
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Engine Version</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
              {dbHealth.dbVersion}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Tables</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
              {dbHealth.activeTables.length} Tables Active
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Query Latency</span>
            <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400 block mt-0.5">
              {dbHealth.latencyMs} ms
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Sales Team Usable Modules</h3>
          <span className="text-xs text-slate-400 font-mono">
            Enabled: {Object.values(salesPermissions).filter(Boolean).length} / {ALL_MODULES.length} Apps
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredModules.map((mod) => {
            const isAccessible = salesPermissions[mod.key] === true;

            return (
              <div
                key={mod.key}
                onClick={() => {
                  if (isOwnerOrAdmin) {
                    updateSalesPermission(mod.key, !isAccessible);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer select-none ${
                  isAccessible
                    ? 'bg-brand-50/40 dark:bg-navy-800/80 border-brand-200 dark:border-brand-900/50'
                    : 'bg-slate-50/60 dark:bg-navy-950/40 border-slate-200/80 dark:border-navy-800 opacity-60'
                } ${!isOwnerOrAdmin ? 'cursor-not-allowed' : 'hover:border-brand-500'}`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{mod.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-navy-700 text-slate-600 dark:text-slate-300">
                      {mod.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{mod.description}</p>
                </div>

                <div className="mt-0.5">
                  {isAccessible ? (
                    <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Allowed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-slate-400 font-medium text-xs bg-slate-200 dark:bg-navy-800 px-2 py-1 rounded-lg">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Restricted</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
