import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  RotateCcw,
  Users,
  CreditCard,
  Package,
  Boxes,
  ArrowRightLeft,
  SlidersHorizontal,
  Truck,
  Building2,
  FileCheck2,
  Receipt,
  DollarSign,
  PieChart,
  BarChart3,
  TrendingUp,
  LineChart,
  FileSearch,
  FileCheck,
  FolderKanban,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  Settings,
  X,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'DASHBOARD',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    groupName: 'SALES',
    items: [
      { id: 'pos', label: 'POS', icon: ShoppingCart },
      { id: 'sales', label: 'Sales', icon: ShoppingBag },
      { id: 'returns', label: 'Returns', icon: RotateCcw },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'credit_sales', label: 'Credit Sales', icon: CreditCard },
    ],
  },
  {
    groupName: 'INVENTORY',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'stock', label: 'Stock', icon: Boxes },
      { id: 'stock_movements', label: 'Stock Movements', icon: ArrowRightLeft },
      { id: 'adjustments', label: 'Adjustments', icon: SlidersHorizontal },
    ],
  },
  {
    groupName: 'PURCHASING',
    items: [
      { id: 'purchases', label: 'Purchases', icon: Truck },
      { id: 'suppliers', label: 'Suppliers', icon: Building2 },
      { id: 'vendor_bills', label: 'Vendor Bills', icon: FileCheck2 },
    ],
  },
  {
    groupName: 'FINANCE',
    items: [
      { id: 'expenses', label: 'Expenses', icon: Receipt },
      { id: 'payments', label: 'Payments', icon: DollarSign },
      { id: 'profit_loss', label: 'Profit & Loss', icon: PieChart },
      { id: 'financial_reports', label: 'Financial Reports', icon: BarChart3 },
    ],
  },
  {
    groupName: 'ANALYTICS',
    items: [
      { id: 'sales_analytics', label: 'Sales Analytics', icon: TrendingUp },
      { id: 'inventory_analytics', label: 'Inventory Analytics', icon: LineChart },
      { id: 'customer_analytics', label: 'Customer Analytics', icon: Users },
    ],
  },
  {
    groupName: 'AI & DOCUMENTS',
    items: [
      { id: 'receipt_scanner', label: 'Receipt Scanner', icon: FileSearch },
      { id: 'invoice_scanner', label: 'Invoice Scanner', icon: FileCheck },
      { id: 'documents', label: 'Documents', icon: FolderKanban },
    ],
  },
  {
    groupName: 'ADMIN',
    items: [
      { id: 'users', label: 'Users', icon: UserCheck },
      { id: 'roles', label: 'Roles', icon: ShieldCheck },
      { id: 'audit_logs', label: 'Audit Logs', icon: ClipboardList },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentUser, salesPermissions } = useApp();

  const filteredGroups = NAV_GROUPS.map((group) => {
    const validItems = group.items.filter((item) => {
      if (currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'manager') {
        return true;
      }
      if (currentUser.role === 'sales_team') {
        return salesPermissions[item.id] === true;
      }
      return true;
    });

    return {
      ...group,
      items: validItems,
    };
  }).filter((group) => group.items.length > 0);

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-navy-900 text-slate-300 border-r border-navy-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-navy-800 bg-navy-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-brand-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                BUZZ<span className="text-amber-500 font-extrabold">ERP</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-1 font-mono">Enterprise Suite</span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                {group.groupName}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-navy-800 bg-navy-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full border border-navy-700 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{currentUser.fullName}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider truncate">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
