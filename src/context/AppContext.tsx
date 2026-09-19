import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Branch, CashShift, Product, Customer, Supplier, Sale, Purchase, VendorBill, Expense, AuditLog, AIDocument, NotificationItem, CurrencyCode, CurrencyConfig } from '../types';
import {
  INITIAL_USER,
  INITIAL_SALES_PERMISSIONS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_VENDOR_BILLS,
  INITIAL_EXPENSES,
  INITIAL_AUDIT_LOGS,
  INITIAL_AI_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from '../lib/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  salesPermissions: Record<string, boolean>;
  updateSalesPermission: (moduleKey: string, allowed: boolean) => void;

  products: Product[];
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  sales: Sale[];
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  vendorBills: VendorBill[];
  setVendorBills: React.Dispatch<React.SetStateAction<VendorBill[]>>;
  expenses: Expense[];
  auditLogs: AuditLog[];
  aiDocuments: AIDocument[];
  notifications: NotificationItem[];

  // Dynamic Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (productId: string, newStock: number, reason: string) => void;

  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Sale;
  voidSale: (saleId: string, reason: string) => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'outstandingBalance' | 'totalPurchases' | 'loyaltyPoints'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'balanceOwed'>) => void;

  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  updatePurchaseStatus: (id: string, status: Purchase['status']) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  payVendorBill: (id: string) => void;

  addAuditLog: (action: string, module: string, recordId: string, previousValue: any, newValue: any) => void;
  markNotificationsAsRead: () => void;

  // Search Modal state
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Notification Drawer state
  isNotificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Global Active Navigation Route
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Multi-Branch Location Switcher
  branches: Branch[];
  activeBranch: Branch;
  setActiveBranch: (branch: Branch) => void;

  // Shift / Cash Drawer Management
  activeShift: CashShift | null;
  startShift: (startingCash: number) => void;
  closeShift: (actualCash: number) => void;

  // Multi-Currency Engine
  currencies: Record<CurrencyCode, CurrencyConfig>;
  activeCurrency: CurrencyConfig;
  setActiveCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amountInUSD: number) => string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1.0 },
  KSH: { code: 'KSH', symbol: 'KSh ', name: 'Kenyan Shilling', exchangeRate: 130.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.79 },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_BRANCHES: Branch[] = [
  { id: 'b-main', name: 'Main Store - Nairobi HQ', code: 'NRB-01', isMain: true },
  { id: 'b-west', name: 'Westlands Retail Outlet', code: 'WST-02', isMain: false },
  { id: 'b-msa', name: 'Mombasa Port Branch', code: 'MSA-03', isMain: false },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranch, setActiveBranchState] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<CurrencyCode>('USD');

  const activeCurrency = CURRENCIES[activeCurrencyCode];

  const setActiveCurrency = (code: CurrencyCode) => {
    setActiveCurrencyCode(code);
    showToast(`Base currency switched to ${CURRENCIES[code].name} (${CURRENCIES[code].symbol})`, 'info');
  };

  const formatCurrency = (amountInUSD: number): string => {
    const converted = amountInUSD * activeCurrency.exchangeRate;
    return `${activeCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const [activeShift, setActiveShift] = useState<CashShift | null>({
    id: 'shift-001',
    cashierName: 'Jane Smith',
    startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    startingCash: 5000,
    totalCashSales: 8072.78,
    totalCardSales: 0,
    totalCreditSales: 0,
    expectedCash: 13072.78,
    status: 'OPEN',
  });

  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [salesPermissions, setSalesPermissions] = useState<Record<string, boolean>>(INITIAL_SALES_PERMISSIONS);

  const setActiveBranch = (branch: Branch) => {
    setActiveBranchState(branch);
    showToast(`Switched active store location to ${branch.name}`, 'info');
  };

  const startShift = (startingCash: number) => {
    const newShift: CashShift = {
      id: `shift-${Date.now()}`,
      cashierName: currentUser.fullName,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startingCash,
      totalCashSales: 0,
      totalCardSales: 0,
      totalCreditSales: 0,
      expectedCash: startingCash,
      status: 'OPEN',
    };
    setActiveShift(newShift);
    addAuditLog('SHIFT_STARTED', 'POS', newShift.id, null, { startingCash });
    showToast(`Cash shift opened with starting balance of KSh ${startingCash.toLocaleString()}`);
  };

  const closeShift = (actualCash: number) => {
    if (!activeShift) return;
    const variance = actualCash - activeShift.expectedCash;
    const closedShift: CashShift = {
      ...activeShift,
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actualCash,
      variance,
      status: 'CLOSED',
    };
    setActiveShift(null);
    addAuditLog('SHIFT_CLOSED', 'POS', closedShift.id, activeShift, closedShift);
    showToast(
      `Shift closed. Cash Variance: ${
        variance >= 0 ? `+KSh ${variance.toLocaleString()}` : `-KSh ${Math.abs(variance).toLocaleString()}`
      }`,
      variance < 0 ? 'error' : 'success'
    );
  };

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [vendorBills, setVendorBills] = useState<VendorBill[]>(INITIAL_VENDOR_BILLS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [aiDocuments, setAiDocuments] = useState<AIDocument[]>(INITIAL_AI_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, module: string, recordId: string, previousValue: any, newValue: any) => {
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      action,
      module,
      recordId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const updateSalesPermission = (moduleKey: string, allowed: boolean) => {
    setSalesPermissions((prev) => ({ ...prev, [moduleKey]: allowed }));
    addAuditLog('PERMISSION_CHANGE', 'Admin', moduleKey, { [moduleKey]: !allowed }, { [moduleKey]: allowed });
    showToast(`Sales team access for ${moduleKey} updated`, 'info');
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog('PRODUCT_CREATED', 'Products', newProduct.sku, null, newProduct);
    showToast(`Product "${newProduct.name}" created successfully`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;

    if (updates.sellingPrice !== undefined && updates.sellingPrice !== existing.sellingPrice) {
      addAuditLog('PRICE_CHANGE', 'Products', existing.sku, { sellingPrice: existing.sellingPrice }, { sellingPrice: updates.sellingPrice });
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast(`Product updated successfully`);
  };

  const adjustStock = (productId: string, newStock: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const prevStock = prod.stockQuantity;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newStock } : p))
    );

    addAuditLog('STOCK_ADJUSTMENT', 'Inventory', prod.sku, { stockQuantity: prevStock }, { stockQuantity: newStock, reason });

    if (newStock <= prod.minStockLevel) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: newStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        title: newStock === 0 ? 'Out of Stock Alert' : 'Low Stock Alert',
        message: `${prod.name} stock level is now ${newStock} units.`,
        severity: newStock === 0 ? 'danger' : 'warning',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast(`Stock updated for ${prod.name}`);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    newSale.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - item.quantity) }
            : p
        )
      );
    });

    const pointsEarned = Math.floor(newSale.totalAmount / 100);
    if (newSale.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newSale.customerId
            ? {
                ...c,
                outstandingBalance: newSale.paymentMethod === 'CREDIT' ? c.outstandingBalance + newSale.totalAmount : c.outstandingBalance,
                totalPurchases: c.totalPurchases + newSale.totalAmount,
                loyaltyPoints: (c.loyaltyPoints || 0) + pointsEarned,
              }
            : c
        )
      );
    }

    setSales((prev) => [newSale, ...prev]);
    addAuditLog('SALE_RECORDED', 'Sales', newSale.invoiceNumber, null, { total: newSale.totalAmount, method: newSale.paymentMethod });
    showToast(`Sale ${newSale.invoiceNumber} completed!`);
    return newSale;
  };

  const voidSale = (saleId: string, reason: string) => {
    const targetSale = sales.find((s) => s.id === saleId);
    if (!targetSale || targetSale.status === 'VOIDED') return;

    targetSale.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === item.productId ? { ...p, stockQuantity: p.stockQuantity + item.quantity } : p))
      );
    });

    if (targetSale.paymentMethod === 'CREDIT' && targetSale.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === targetSale.customerId
            ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - targetSale.totalAmount) }
            : c
        )
      );
    }

    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: 'VOIDED' } : s))
    );

    addAuditLog('SALE_VOIDED', 'Sales', targetSale.invoiceNumber, { status: targetSale.status }, { status: 'VOIDED', reason });
    showToast(`Sale ${targetSale.invoiceNumber} voided`, 'error');
  };

  const addCustomer = (cData: Omit<Customer, 'id' | 'outstandingBalance' | 'totalPurchases' | 'loyaltyPoints'>) => {
    const newCust: Customer = {
      ...cData,
      id: `c-${Date.now()}`,
      outstandingBalance: 0,
      totalPurchases: 0,
      loyaltyPoints: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Customer ${newCust.name} added`);
  };

  const addSupplier = (sData: Omit<Supplier, 'id' | 'balanceOwed'>) => {
    const newSupp: Supplier = {
      ...sData,
      id: `s-${Date.now()}`,
      balanceOwed: 0,
    };
    setSuppliers((prev) => [newSupp, ...prev]);
    showToast(`Supplier ${newSupp.companyName} added`);
  };

  const addPurchase = (pData: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
      ...pData,
      id: `po-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPurchases((prev) => [newPurchase, ...prev]);
    addAuditLog('PURCHASE_CREATED', 'Purchasing', newPurchase.poNumber, null, newPurchase);
    showToast(`Purchase order ${newPurchase.poNumber} created`);
  };

  const updatePurchaseStatus = (id: string, status: Purchase['status']) => {
    const existing = purchases.find((p) => p.id === id);
    if (!existing) return;

    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    if (status === 'APPROVED') {
      addAuditLog('PURCHASE_APPROVED', 'Purchasing', existing.poNumber, { status: existing.status }, { status });
    }

    showToast(`PO ${existing.poNumber} status changed to ${status}`);
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);

    if (newExp.amount > 2000) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'LARGE_EXPENSE',
        title: 'Large Expense Recorded',
        message: `$${newExp.amount.toLocaleString()} recorded under ${newExp.category}`,
        severity: 'warning',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addAuditLog('EXPENSE_RECORDED', 'Finance', newExp.id, null, newExp);
    showToast(`Expense recorded`);
  };

  const payVendorBill = (id: string) => {
    const bill = vendorBills.find((b) => b.id === id);
    if (!bill) return;

    setVendorBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'PAID' } : b))
    );

    addAuditLog('PAYMENT_RECORDED', 'Finance', bill.billNumber, { status: bill.status }, { status: 'PAID' });
    showToast(`Vendor bill ${bill.billNumber} marked as paid`);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        salesPermissions,
        updateSalesPermission,
        products,
        customers,
        setCustomers,
        suppliers,
        setSuppliers,
        sales,
        purchases,
        setPurchases,
        vendorBills,
        setVendorBills,
        expenses,
        auditLogs,
        aiDocuments,
        notifications,
        addProduct,
        updateProduct,
        adjustStock,
        addSale,
        voidSale,
        addCustomer,
        addSupplier,
        addPurchase,
        updatePurchaseStatus,
        addExpense,
        payVendorBill,
        addAuditLog,
        markNotificationsAsRead,
        isSearchOpen,
        setSearchOpen,
        isNotificationOpen,
        setNotificationOpen,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
        branches,
        activeBranch,
        setActiveBranch,
        activeShift,
        startShift,
        closeShift,
        currencies: CURRENCIES,
        activeCurrency,
        setActiveCurrency,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
