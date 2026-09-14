import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Clock,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Package,
  Boxes,
  ArrowRightLeft,
  SlidersHorizontal,
  Truck,
  Building2,
  FileCheck2,
  Receipt,
  PieChart,
  BarChart3,
  LineChart,
  FileSearch,
  FileCheck,
  FolderKanban,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  Settings,
  Lock,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { name: 'Mon', sales: 42000, expenses: 14000 },
  { name: 'Tue', sales: 58000, expenses: 21000 },
  { name: 'Wed', sales: 69000, expenses: 18000 },
  { name: 'Thu', sales: 84000, expenses: 32000 },
  { name: 'Fri', sales: 112000, expenses: 29000 },
  { name: 'Sat', sales: 145000, expenses: 41000 },
  { name: 'Sun', sales: 98000, expenses: 23000 },
];

interface AppCard {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
}

const ALL_APPS: AppCard[] = [
  { id: 'pos', name: 'POS Terminal', category: 'Sales', icon: ShoppingCart, color: 'bg-blue-500' },
  { id: 'sales', name: 'Sales Ledger', category: 'Sales', icon: ShoppingBag, color: 'bg-indigo-500' },
  { id: 'returns', name: 'Returns', category: 'Sales', icon: RotateCcw, color: 'bg-sky-500' },
  { id: 'customers', name: 'Customers', category: 'Sales', icon: Users, color: 'bg-emerald-500' },
  { id: 'credit_sales', name: 'Credit Sales', category: 'Sales', icon: CreditCard, color: 'bg-amber-500' },

  { id: 'products', name: 'Products', category: 'Inventory', icon: Package, color: 'bg-teal-500' },
  { id: 'stock', name: 'Stock Levels', category: 'Inventory', icon: Boxes, color: 'bg-green-500' },
  { id: 'adjustments', name: 'Reconciliation', category: 'Inventory', icon: SlidersHorizontal, color: 'bg-cyan-500' },

  { id: 'purchases', name: 'Purchase Orders', category: 'Purchasing', icon: Truck, color: 'bg-purple-500' },
  { id: 'suppliers', name: 'Suppliers', category: 'Purchasing', icon: Building2, color: 'bg-fuchsia-500' },
  { id: 'vendor_bills', name: 'Vendor Bills', category: 'Purchasing', icon: FileCheck2, color: 'bg-rose-500' },

  { id: 'expenses', name: 'Expenses', category: 'Finance', icon: Receipt, color: 'bg-amber-600' },
  { id: 'profit_loss', name: 'Profit & Loss', category: 'Finance', icon: PieChart, color: 'bg-emerald-600' },

  { id: 'receipt_scanner', name: 'Receipt Scanner', category: 'AI Suite', icon: FileSearch, color: 'bg-violet-500' },
  { id: 'audit_logs', name: 'Audit Logs', category: 'Admin', icon: ClipboardList, color: 'bg-slate-600' },
  { id: 'settings', name: 'Admin Settings', category: 'Admin', icon: Settings, color: 'bg-navy-700' },
];

export const Dashboard: React.FC = () => {
  const { sales, products, customers, auditLogs, setActiveTab, currentUser, salesPermissions, showToast } = useApp();
  const [loading, setLoading] = useState(false);

  const totalRevenue = sales.reduce((acc, s) => acc + (s.status !== 'VOIDED' ? s.totalAmount : 0), 0);
  const totalOrders = sales.filter((s) => s.status !== 'VOIDED').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleAppClick = (appId: string) => {
    if (currentUser.role === 'sales_team' && !salesPermissions[appId]) {
      showToast(`Access Restricted: Sales Team role does not have permission for ${appId.replace('_', ' ')}`, 'error');
      return;
    }
    setActiveTab(appId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Enterprise Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time business performance & operational diagnostics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-3.5 py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale (POS)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              KSh {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% from last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Sales</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-navy-800 text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalOrders}</div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.5% order volume</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{customers.length}</div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500 font-semibold">
              <span>{customers.filter(c => c.outstandingBalance > 0).length} with active credit</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Warnings</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-navy-800 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{lowStockCount} Items</div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-amber-600 font-medium">
              <span>Requires immediate replenishment</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUZZ APP SUITE LAUNCHER (ICON GRID) */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <span>Buzz App Suite Launcher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick access module launcher. Restricted apps are locked based on role permissions.</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 dark:bg-navy-800 text-slate-500 rounded font-bold">
            Role: {currentUser.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ALL_APPS.map((app) => {
            const Icon = app.icon;
            const isRestricted = currentUser.role === 'sales_team' && !salesPermissions[app.id];

            return (
              <div
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none relative group ${
                  isRestricted
                    ? 'opacity-40 bg-slate-100 dark:bg-navy-950/60 border-slate-200 dark:border-navy-800 hover:border-red-400'
                    : 'bg-slate-50/80 dark:bg-navy-800/80 hover:bg-white dark:hover:bg-navy-800 border-slate-200/80 dark:border-navy-700 hover:border-brand-500 hover:shadow-md'
                }`}
              >
                {isRestricted && (
                  <div className="absolute top-2 right-2 p-0.5 bg-red-100 text-red-600 rounded">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl ${app.color} text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">{app.name}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5 font-semibold">{app.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Weekly Revenue vs Expenses</h3>
              <p className="text-xs text-slate-400">Visual breakdown for current 7-day operational cycle</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-300">Sales</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-300">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334E68" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="expenses" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-navy-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Recent Audit Activities</h3>
              <button
                onClick={() => setActiveTab('audit_logs')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-xs border-b border-slate-100 dark:border-navy-800/60 pb-3 last:border-none">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      <span className="font-bold">{log.userName}</span> ({log.action})
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Module: <span className="text-slate-600 dark:text-slate-300 font-medium">{log.module}</span> • ID: {log.recordId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-center">
            <span className="text-xs text-slate-400">All audit events strictly logged with immutable timestamps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
