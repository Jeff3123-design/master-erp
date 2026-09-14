import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';

// Dashboard
import { Dashboard } from './pages/Dashboard';

// Sales
import { POS } from './pages/sales/POS';
import { SalesList } from './pages/sales/SalesList';
import { Returns } from './pages/sales/Returns';
import { Customers } from './pages/sales/Customers';
import { CreditSales } from './pages/sales/CreditSales';

// Inventory
import { Products } from './pages/inventory/Products';
import { Stock } from './pages/inventory/Stock';
import { StockMovements } from './pages/inventory/StockMovements';
import { Adjustments } from './pages/inventory/Adjustments';

// Purchasing
import { Purchases } from './pages/purchasing/Purchases';
import { Suppliers } from './pages/purchasing/Suppliers';
import { VendorBills } from './pages/purchasing/VendorBills';

// Finance
import { Expenses } from './pages/finance/Expenses';
import { Payments } from './pages/finance/Payments';
import { ProfitLoss } from './pages/finance/ProfitLoss';
import { FinancialReports } from './pages/finance/FinancialReports';

// Analytics
import { SalesAnalytics } from './pages/analytics/SalesAnalytics';
import { InventoryAnalytics } from './pages/analytics/InventoryAnalytics';
import { CustomerAnalytics } from './pages/analytics/CustomerAnalytics';

// AI & Documents
import { ReceiptScanner } from './pages/ai/ReceiptScanner';
import { InvoiceScanner } from './pages/ai/InvoiceScanner';
import { Documents } from './pages/ai/Documents';

// Admin
import { UsersPage } from './pages/admin/Users';
import { RolesPage } from './pages/admin/Roles';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SettingsPage } from './pages/admin/Settings';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, salesPermissions, showToast } = useApp();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  // Role Redirection Guard
  useEffect(() => {
    if (currentUser.role === 'sales_team') {
      if (activeTab !== 'dashboard' && !salesPermissions[activeTab]) {
        // Find first allowed app
        const firstAllowed = Object.keys(salesPermissions).find((key) => salesPermissions[key]) || 'pos';
        setActiveTab(firstAllowed);
        showToast(`Redirected: Sales Team role does not have access to restricted route`, 'info');
      }
    }
  }, [currentUser.role, activeTab, salesPermissions]);

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;

      // Sales
      case 'pos':
        return <POS />;
      case 'sales':
        return <SalesList />;
      case 'returns':
        return <Returns />;
      case 'customers':
        return <Customers />;
      case 'credit_sales':
        return <CreditSales />;

      // Inventory
      case 'products':
        return <Products />;
      case 'stock':
        return <Stock />;
      case 'stock_movements':
        return <StockMovements />;
      case 'adjustments':
        return <Adjustments />;

      // Purchasing
      case 'purchases':
        return <Purchases />;
      case 'suppliers':
        return <Suppliers />;
      case 'vendor_bills':
        return <VendorBills />;

      // Finance
      case 'expenses':
        return <Expenses />;
      case 'payments':
        return <Payments />;
      case 'profit_loss':
        return <ProfitLoss />;
      case 'financial_reports':
        return <FinancialReports />;

      // Analytics
      case 'sales_analytics':
        return <SalesAnalytics />;
      case 'inventory_analytics':
        return <InventoryAnalytics />;
      case 'customer_analytics':
        return <CustomerAnalytics />;

      // AI & Documents
      case 'receipt_scanner':
        return <ReceiptScanner />;
      case 'invoice_scanner':
        return <InvoiceScanner />;
      case 'documents':
        return <Documents />;

      // Admin
      case 'users':
        return <UsersPage />;
      case 'roles':
        return <RolesPage />;
      case 'audit_logs':
        return <AuditLogs />;
      case 'settings':
        return <SettingsPage />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col lg:flex-row font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      <Sidebar isOpenMobile={isMobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>

        <MobileNav />
      </div>

      <GlobalSearchModal />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
