export type UserRole = 'owner' | 'admin' | 'manager' | 'sales_team';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ModulePermission {
  moduleKey: string;
  label: string;
  category: string;
  isAccessible: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  recordId: string;
  previousValue: any;
  newValue: any;
  timestamp: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditLimit: number;
  outstandingBalance: number;
  totalPurchases: number;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  balanceOwed: number;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'CREDIT' | 'SPLIT';
  status: 'COMPLETED' | 'VOIDED' | 'RETURNED';
  createdBy: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  itemsCount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'RECEIVED';
  createdAt: string;
}

export interface VendorBill {
  id: string;
  billNumber: string;
  purchaseId?: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  recordedBy: string;
  expenseDate: string;
}

export interface AIDocument {
  id: string;
  filename: string;
  docType: 'RECEIPT' | 'INVOICE';
  vendorName: string;
  amount: number;
  confidenceScore: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  extractedItems: Array<{ description: string; amount: number }>;
  uploadedAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERDUE_CREDIT' | 'OVERDUE_BILL' | 'PURCHASE_RECEIVED' | 'LARGE_EXPENSE' | 'STOCK_ADJUSTMENT' | 'AI_REVIEW';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
}
