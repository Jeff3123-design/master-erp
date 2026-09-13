import { User, Product, Customer, Supplier, Sale, Purchase, VendorBill, Expense, AuditLog, AIDocument, NotificationItem } from '../types';

export const INITIAL_USER: User = {
  id: 'usr-1',
  email: 'admin@nexuserp.io',
  fullName: 'Alex Morgan',
  role: 'owner',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
};

export const INITIAL_SALES_PERMISSIONS: Record<string, boolean> = {
  pos: true,
  sales: true,
  returns: true,
  customers: true,
  credit_sales: true,
  products: false,
  stock: false,
  stock_movements: false,
  adjustments: false,
  purchases: false,
  suppliers: false,
  vendor_bills: false,
  expenses: false,
  payments: false,
  profit_loss: false,
  financial_reports: false,
  sales_analytics: false,
  inventory_analytics: false,
  customer_analytics: false,
  receipt_scanner: false,
  invoice_scanner: false,
  documents: false,
  users: false,
  roles: false,
  audit_logs: false,
  settings: false,
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'PRD-1001', barcode: '8901001', name: 'MacBook Pro 16 M3 Max', category: 'Electronics', costPrice: 2800, sellingPrice: 3499, stockQuantity: 14, minStockLevel: 5, unit: 'pcs' },
  { id: 'p2', sku: 'PRD-1002', barcode: '8901002', name: 'Logitech MX Master 3S', category: 'Accessories', costPrice: 65, sellingPrice: 99.99, stockQuantity: 3, minStockLevel: 10, unit: 'pcs' },
  { id: 'p3', sku: 'PRD-1003', barcode: '8901003', name: 'Dell UltraSharp 27 4K Monitor', category: 'Monitors', costPrice: 450, sellingPrice: 619.99, stockQuantity: 8, minStockLevel: 4, unit: 'pcs' },
  { id: 'p4', sku: 'PRD-1004', barcode: '8901004', name: 'Keychron Q1 Pro Wireless Keyboard', category: 'Accessories', costPrice: 120, sellingPrice: 199.50, stockQuantity: 0, minStockLevel: 5, unit: 'pcs' },
  { id: 'p5', sku: 'PRD-1005', barcode: '8901006', name: 'Ergonomic Mesh Task Chair', category: 'Furniture', costPrice: 220, sellingPrice: 389.00, stockQuantity: 18, minStockLevel: 3, unit: 'pcs' },
  { id: 'p6', sku: 'PRD-1006', barcode: '8901007', name: 'Sony WH-1000XM5 Headphones', category: 'Audio', costPrice: 240, sellingPrice: 398.00, stockQuantity: 22, minStockLevel: 6, unit: 'pcs' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Apex Tech Solutions', email: 'procurement@apextech.com', phone: '+1 (555) 019-2831', creditLimit: 10000, outstandingBalance: 2450.00, totalPurchases: 48900 },
  { id: 'c2', name: 'Vanguard Design Studio', email: 'hello@vanguarddesign.co', phone: '+1 (555) 014-9981', creditLimit: 5000, outstandingBalance: 4890.00, totalPurchases: 12400 },
  { id: 'c3', name: 'Starlight Retailers', email: 'orders@starlight.io', phone: '+1 (555) 088-3312', creditLimit: 15000, outstandingBalance: 0, totalPurchases: 89000 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', companyName: 'Global Microchips Inc', contactPerson: 'Sarah Jenkins', email: 'sales@globalmicro.com', phone: '+1 800 555 0199', balanceOwed: 14200.00 },
  { id: 's2', companyName: 'Nordic Logistics & Hardware', contactPerson: 'Lars Olesen', email: 'lars@nordic-hardware.dk', phone: '+45 33 12 34 56', balanceOwed: 3400.00 },
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    invoiceNumber: 'INV-2025-001',
    customerId: 'c1',
    customerName: 'Apex Tech Solutions',
    items: [
      { id: 'si-1', productId: 'p1', productName: 'MacBook Pro 16 M3 Max', quantity: 2, unitPrice: 3499, totalPrice: 6998 }
    ],
    subtotal: 6998,
    tax: 559.84,
    discount: 0,
    totalAmount: 7557.84,
    paymentMethod: 'CREDIT',
    status: 'COMPLETED',
    createdBy: 'Alex Morgan',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-2025-002',
    customerId: 'c3',
    customerName: 'Starlight Retailers',
    items: [
      { id: 'si-2', productId: 'p2', productName: 'Logitech MX Master 3S', quantity: 5, unitPrice: 99.99, totalPrice: 499.95 }
    ],
    subtotal: 499.95,
    tax: 39.99,
    discount: 25,
    totalAmount: 514.94,
    paymentMethod: 'CASH',
    status: 'COMPLETED',
    createdBy: 'Alex Morgan',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  { id: 'po-101', poNumber: 'PO-2025-881', supplierId: 's1', supplierName: 'Global Microchips Inc', itemsCount: 15, totalAmount: 14200.00, status: 'APPROVED', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'po-102', poNumber: 'PO-2025-882', supplierId: 's2', supplierName: 'Nordic Logistics & Hardware', itemsCount: 40, totalAmount: 3400.00, status: 'DRAFT', createdAt: new Date(Date.now() - 86400000).toISOString() }
];

export const INITIAL_VENDOR_BILLS: VendorBill[] = [
  { id: 'vb-1', billNumber: 'BILL-9901', purchaseId: 'po-101', supplierId: 's1', supplierName: 'Global Microchips Inc', amount: 14200.00, dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], status: 'OVERDUE' },
  { id: 'vb-2', billNumber: 'BILL-9902', purchaseId: 'po-102', supplierId: 's2', supplierName: 'Nordic Logistics & Hardware', amount: 3400.00, dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], status: 'UNPAID' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', category: 'Utilities', description: 'Server Facility Electric & Cooling Bill', amount: 1850.00, recordedBy: 'Alex Morgan', expenseDate: new Date().toISOString().split('T')[0] },
  { id: 'exp-2', category: 'Software & SaaS', description: 'AWS Enterprise Cloud Hosting', amount: 3450.00, recordedBy: 'Alex Morgan', expenseDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', userId: 'usr-1', userName: 'Alex Morgan', action: 'PRICE_CHANGE', module: 'Products', recordId: 'PRD-1001', previousValue: { sellingPrice: 3299 }, newValue: { sellingPrice: 3499 }, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'aud-2', userId: 'usr-1', userName: 'Alex Morgan', action: 'STOCK_ADJUSTMENT', module: 'Inventory', recordId: 'PRD-1002', previousValue: { stock: 10 }, newValue: { stock: 3 }, timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'aud-3', userId: 'usr-1', userName: 'Alex Morgan', action: 'PURCHASE_APPROVED', module: 'Purchasing', recordId: 'PO-2025-881', previousValue: { status: 'DRAFT' }, newValue: { status: 'APPROVED' }, timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
];

export const INITIAL_AI_DOCUMENTS: AIDocument[] = [
  {
    id: 'doc-1',
    filename: 'Vendor_Invoice_GlobalMicro_Oct.pdf',
    docType: 'INVOICE',
    vendorName: 'Global Microchips Inc',
    amount: 14200.00,
    confidenceScore: 98.5,
    status: 'PENDING_REVIEW',
    extractedItems: [
      { description: 'MacBook Pro 16 M3 Chips Batch', amount: 11200.00 },
      { description: 'Shipping & Logistics Express', amount: 3000.00 }
    ],
    uploadedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'doc-2',
    filename: 'Store_Receipt_OfficeSupplies.jpg',
    docType: 'RECEIPT',
    vendorName: 'Staples Office Depot',
    amount: 349.50,
    confidenceScore: 94.2,
    status: 'APPROVED',
    extractedItems: [
      { description: 'Printer Paper 5000 Sheets', amount: 149.50 },
      { description: 'Ergonomic Desk Pads', amount: 200.00 }
    ],
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', type: 'LOW_STOCK', title: 'Low Stock Alert', message: 'Logitech MX Master 3S has reached critical level (3 remaining)', severity: 'warning', timestamp: '10 mins ago', read: false },
  { id: 'notif-2', type: 'OUT_OF_STOCK', title: 'Out of Stock Alert', message: 'Keychron Q1 Pro Wireless Keyboard is completely out of stock!', severity: 'danger', timestamp: '1 hour ago', read: false },
  { id: 'notif-3', type: 'OVERDUE_BILL', title: 'Overdue Vendor Bill', message: 'Bill BILL-9901 for Global Microchips Inc ($14,200.00) is past due', severity: 'danger', timestamp: '2 hours ago', read: false },
  { id: 'notif-4', type: 'AI_REVIEW', title: 'AI Document Review Required', message: 'Invoice Vendor_Invoice_GlobalMicro_Oct.pdf ready for verification', severity: 'info', timestamp: '3 hours ago', read: false },
];
