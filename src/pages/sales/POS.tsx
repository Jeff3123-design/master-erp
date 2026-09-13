import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Customer } from '../../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Barcode,
} from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

export const POS: React.FC = () => {
  const { products, customers, addSale, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'CREDIT'>('CASH');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCategory && matchesQuery;
  });

  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      showToast(`Cannot add ${product.name}: Out of stock!`, 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= product.stockQuantity) {
          showToast(`Maximum available stock reached for ${product.name}`, 'info');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stockQuantity) {
              showToast(`Cannot exceed stock limit (${item.product.stockQuantity})`, 'info');
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal + tax - discountAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is currently empty!', 'error');
      return;
    }

    if (paymentMethod === 'CREDIT' && !selectedCustomer) {
      showToast('Please select a customer for Credit Sales!', 'error');
      return;
    }

    if (paymentMethod === 'CREDIT' && selectedCustomer) {
      const availableCredit = selectedCustomer.creditLimit - selectedCustomer.outstandingBalance;
      if (total > availableCredit) {
        showToast(`Credit limit exceeded! Customer available credit: $${availableCredit.toFixed(2)}`, 'error');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const invNum = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      addSale({
        invoiceNumber: invNum,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer?.name,
        items: cart.map((i) => ({
          id: `item-${Date.now()}-${i.product.id}`,
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.sellingPrice,
          totalPrice: i.product.sellingPrice * i.quantity,
        })),
        subtotal,
        tax,
        discount: discountAmount,
        totalAmount: total,
        paymentMethod,
        status: 'COMPLETED',
        createdBy: 'Cashier Station 1',
      });

      setLastInvoiceNumber(invNum);
      setIsProcessing(false);
      setShowSuccessModal(true);
      setCart([]);
      setDiscountAmount(0);
      setSelectedCustomer(null);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 animate-fade-in overflow-hidden">
      <div className="flex-1 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-4 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or scan Barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Barcode className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No products match your criteria</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const outOfStock = p.stockQuantity <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => !outOfStock && addToCart(p)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all select-none ${
                    outOfStock
                      ? 'opacity-50 bg-slate-100 dark:bg-navy-950/40 border-slate-200 dark:border-navy-800 cursor-not-allowed'
                      : 'bg-slate-50/70 dark:bg-navy-800/60 hover:bg-white dark:hover:bg-navy-800 border-slate-200/80 dark:border-navy-700 hover:border-brand-500 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.category}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          outOfStock
                            ? 'bg-red-100 dark:bg-red-950 text-red-600'
                            : p.stockQuantity <= p.minStockLevel
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                        }`}
                      >
                        {outOfStock ? 'Out of stock' : `${p.stockQuantity} ${p.unit}`}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1.5 line-clamp-2 leading-tight">
                      {p.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono mt-1 block">{p.sku}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-navy-700">
                    <span className="font-extrabold text-brand-600 dark:text-brand-400 text-base">
                      ${p.sellingPrice.toFixed(2)}
                    </span>
                    <button
                      disabled={outOfStock}
                      className="p-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-800">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Current Sale</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                setSelectedCustomer(found || null);
              }}
              className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">Walk-in Customer (General)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Credit: ${(c.creditLimit - c.outstandingBalance).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Cart is empty. Click products on left to add.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-100 dark:border-navy-700"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ${item.product.sellingPrice.toFixed(2)} × {item.quantity} = ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="p-1 rounded bg-slate-200 dark:bg-navy-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="p-1 rounded bg-slate-200 dark:bg-navy-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 rounded text-red-400 hover:text-red-600 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-navy-800 pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {(['CASH', 'CARD', 'CREDIT'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  paymentMethod === method
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-navy-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-700 hover:bg-slate-100'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount ($)</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="0.00"
                className="w-20 text-right p-1 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded text-xs text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-navy-800">
              <span>Total Payable</span>
              <span className="text-brand-600 dark:text-brand-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-navy-800 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Processing Sale...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Complete Checkout (${total.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 max-w-sm w-full text-center space-y-4 animate-scale-up">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Transaction Complete!</h3>
              <p className="text-xs text-slate-400 mt-1">Invoice Reference: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{lastInvoiceNumber}</span></p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1 text-left">
              <div className="flex justify-between"><span>Payment Method:</span> <span className="font-bold">{paymentMethod}</span></div>
              <div className="flex justify-between"><span>Audit Log:</span> <span className="font-bold text-emerald-600">Recorded</span></div>
              <div className="flex justify-between"><span>Stock Levels:</span> <span className="font-bold text-emerald-600">Updated</span></div>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm"
            >
              Print Receipt & Next Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
