import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  action?: {
    label: string;
    tab: string;
  };
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { products, sales, expenses, customers, setActiveTab, formatCurrency, activeBranch } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your Buzz ERP AI Co-Pilot for ${activeBranch.name}. Ask me anything about real-time sales, inventory stock levels, or financial health summaries!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Process AI response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = '';
      let action: { label: string; tab: string } | undefined;

      if (lower.includes('stock') || lower.includes('low') || lower.includes('inventory')) {
        const lowStock = products.filter((p) => p.stockQuantity <= p.minStockLevel);
        if (lowStock.length === 0) {
          responseText = 'Great news! All products are currently above their minimum stock reorder thresholds.';
        } else {
          const list = lowStock.map((p) => `• ${p.name}: ${p.stockQuantity} ${p.unit} remaining`).join('\n');
          responseText = `Found ${lowStock.length} items requiring stock replenishment:\n\n${list}`;
          action = { label: 'Go to Stock Adjustments', tab: 'adjustments' };
        }
      } else if (lower.includes('sale') || lower.includes('revenue') || lower.includes('performance')) {
        const totalRev = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        responseText = `Current total recorded revenue is ${formatCurrency(totalRev)} across ${sales.length} orders.\nAverage order value: ${formatCurrency(sales.length ? totalRev / sales.length : 0)}.`;
        action = { label: 'Open Sales Analytics', tab: 'sales_analytics' };
      } else if (lower.includes('expense') || lower.includes('cost') || lower.includes('financial')) {
        const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalRev = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const netMargin = totalRev - totalExp;
        responseText = `Financial Summary:\n• Total Sales: ${formatCurrency(totalRev)}\n• Total Expenses: ${formatCurrency(totalExp)}\n• Net Profit: ${formatCurrency(netMargin)}`;
        action = { label: 'View Profit & Loss', tab: 'profit_loss' };
      } else if (lower.includes('customer') || lower.includes('credit') || lower.includes('points')) {
        const totalDebt = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
        responseText = `Customer Database Insights:\n• Total Registered Customers: ${customers.length}\n• Outstanding Credit Balance: ${formatCurrency(totalDebt)}`;
        action = { label: 'View Credit Sales', tab: 'credit_sales' };
      } else if (lower.includes('pos') || lower.includes('checkout') || lower.includes('terminal')) {
        responseText = 'Opening POS cash register terminal for immediate sale execution...';
        action = { label: 'Launch POS Station', tab: 'pos' };
      } else {
        responseText = `I searched your ERP data for "${query}". Currently, you have ${products.length} catalog items, ${sales.length} completed transactions, and ${customers.length} customer records in store database.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl shadow-2xl w-full max-w-lg h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Buzz ERP AI Co-Pilot</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </h3>
              <p className="text-xs text-brand-100 font-medium">Real-time intelligent business advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => handleSendMessage('Check low stock items')}
            className="px-3 py-1.5 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 shrink-0 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Low Stock Alert</span>
          </button>
          <button
            onClick={() => handleSendMessage('Revenue performance summary')}
            className="px-3 py-1.5 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 shrink-0 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sales Summary</span>
          </button>
          <button
            onClick={() => handleSendMessage('Launch POS terminal')}
            className="px-3 py-1.5 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 shrink-0 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-brand-500" />
            <span>Open POS</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-navy-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-xs shadow-sm font-medium'
                    : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-navy-700 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.action && (
                  <button
                    onClick={() => {
                      setActiveTab(m.action!.tab);
                      onClose();
                    }}
                    className="mt-3 w-full py-2 px-3 bg-brand-50 dark:bg-navy-700 hover:bg-brand-100 text-brand-700 dark:text-brand-300 font-bold rounded-xl flex items-center justify-between transition-colors text-[11px]"
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    m.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask AI Co-Pilot about sales, stock, expenses..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl transition-all shadow-md shadow-brand-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
