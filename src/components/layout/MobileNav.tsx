import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ShoppingCart, Package, DollarSign, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, salesPermissions } = useApp();

  const primaryItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'expenses', label: 'Finance', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredItems = primaryItems.filter((item) => {
    if (currentUser.role === 'sales_team') {
      if (item.id === 'settings' || item.id === 'expenses') return false;
      return salesPermissions[item.id] !== false;
    }
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 lg:hidden shadow-lg px-2 py-1 flex items-center justify-around">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : ''}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
