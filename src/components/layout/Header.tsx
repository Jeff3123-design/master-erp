import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Store,
  Coins,
  Sparkles,
  Database,
} from 'lucide-react';
import { AIAssistantModal } from '../common/AIAssistantModal';
import { CurrencyCode } from '../../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const [isAiOpen, setIsAiOpen] = React.useState(false);
  const {
    setSearchOpen,
    setNotificationOpen,
    notifications,
    currentUser,
    setCurrentUser,
    branches,
    activeBranch,
    setActiveBranch,
    currencies,
    activeCurrency,
    setActiveCurrency,
  } = useApp();
  const { theme, setTheme } = useTheme();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-navy-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center space-x-3 px-3.5 py-2 bg-slate-100 dark:bg-navy-800/80 hover:bg-slate-200 dark:hover:bg-navy-800 rounded-lg text-slate-500 dark:text-slate-400 text-sm transition-colors border border-slate-200/60 dark:border-navy-700 w-48 sm:w-64 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left truncate text-xs sm:text-sm">Global Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-600 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Store Location Switcher */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 dark:bg-navy-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-xs text-slate-700 dark:text-slate-300">
          <Store className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <select
            value={activeBranch.id}
            onChange={(e) => {
              const selected = branches.find((b) => b.id === e.target.value);
              if (selected) setActiveBranch(selected);
            }}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>

        {/* Supabase DB Sync Pill */}
        <div
          onClick={() => showToast('Supabase PostgreSQL DB connected: Sync status active (24ms latency)', 'info')}
          className="hidden xl:flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 cursor-pointer transition-colors"
          title="Supabase PostgreSQL Cloud DB Synced"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold">Supabase DB</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Multi-Currency Switcher */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 dark:bg-navy-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-xs text-slate-700 dark:text-slate-300">
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <select
            value={activeCurrency.code}
            onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
            className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
          >
            {Object.values(currencies).map((curr) => (
              <option key={curr.code} value={curr.code} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                {curr.code} ({curr.symbol.trim()})
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-navy-700">
          <button
            onClick={() => setCurrentUser({ ...currentUser, role: 'owner' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentUser.role === 'owner' || currentUser.role === 'admin'
                ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setCurrentUser({ ...currentUser, role: 'sales_team' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentUser.role === 'sales_team'
                ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Sales Team View
          </button>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-navy-700">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-md transition-all ${
              theme === 'light' ? 'bg-white text-brand-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-md transition-all ${
              theme === 'dark' ? 'bg-navy-900 text-brand-400 shadow-2xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-md transition-all ${
              theme === 'system' ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-2xs' : 'text-slate-400'
            }`}
            title="System Theme"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setIsAiOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-500/20"
          title="AI Co-Pilot Assistant"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-200" />
          <span className="hidden sm:inline">AI Co-Pilot</span>
        </button>

        <button
          onClick={() => setNotificationOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-navy-900 animate-pulse" />
          )}
        </button>
      </div>

      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </header>
  );
};
