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
  Camera,
  X,
  DollarSign,
  Clock,
  Lock,
  Printer,
} from 'lucide-react';
import { ReceiptModal } from '../../components/common/ReceiptModal';

interface CartItem {
  product: Product;
  quantity: number;
}

export const POS: React.FC = () => {
  const { products, customers, addSale, showToast, activeShift, startShift, closeShift } = useApp();
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftStartingCash, setShiftStartingCash] = useState<number>(5000);
  const [shiftActualCash, setShiftActualCash] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'CREDIT'>('CASH');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [tenderedAmount, setTenderedAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Cashier PIN Lock Screen & Manager Override state
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [showManagerOverrideModal, setShowManagerOverrideModal] = useState<boolean>(false);
  const [managerPin, setManagerPin] = useState<string>('');
  const [pendingOverrideAction, setPendingOverrideAction] = useState<(() => void) | null>(null);

  const handlePinKeyPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin === '1234' || nextPin === '0000') {
        setIsLocked(false);
        setEnteredPin('');
        showToast('Cashier authenticated successfully', 'success');
      } else if (nextPin.length === 4) {
        showToast('Invalid PIN entered (Try default: 1234)', 'error');
        setTimeout(() => setEnteredPin(''), 500);
      }
    }
  };

  const handleManagerOverrideConfirm = () => {
    if (managerPin === '9999' || managerPin === '1234') {
      showToast('Manager override approved', 'success');
      setShowManagerOverrideModal(false);
      setManagerPin('');
      if (pendingOverrideAction) {
        pendingOverrideAction();
        setPendingOverrideAction(null);
      }
    } else {
      showToast('Invalid Manager PIN (Default: 9999)', 'error');
      setManagerPin('');
    }
  };

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
  const changeDue = Math.max(0, tenderedAmount - total);

  const handleRedeemPoints = () => {
    if (!selectedCustomer) return;
    if (selectedCustomer.loyaltyPoints <= 0) {
      showToast('Customer has no loyalty points available to redeem!', 'error');
      return;
    }
    const maxRedeemableValue = Math.min(selectedCustomer.loyaltyPoints * 10, total);
    setDiscountAmount((prev) => prev + maxRedeemableValue);
    setRedeemedPoints(selectedCustomer.loyaltyPoints);
    showToast(`Redeemed ${selectedCustomer.loyaltyPoints} points for KSh ${maxRedeemableValue.toFixed(2)} discount!`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is currently empty!', 'error');
      return;
    }

    if (paymentMethod === 'CASH' && tenderedAmount < total) {
      showToast(`Tendered amount ($${tenderedAmount.toFixed(2)}) is less than total payable ($${total.toFixed(2)})`, 'error');
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
      const completed = addSale({
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
      setLastCompletedSale(completed);
      setIsProcessing(false);
      setShowSuccessModal(true);
      setCart([]);
      setDiscountAmount(0);
      setTenderedAmount(0);
      setSelectedCustomer(null);
    }, 600);
  };

  const handleSimulateScan = (product: Product) => {
    addToCart(product);
    setShowScannerModal(false);
    showToast(`Barcode Scanned: ${product.name}`, 'success');
  };

  if (isLocked) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center animate-fade-in">
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto border border-brand-200 dark:border-navy-700">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Front-Desk POS Locked</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter 4-digit Cashier PIN to unlock terminal (Default: 1234)</p>
          </div>

          <div className="flex justify-center space-x-3 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  enteredPin.length > i
                    ? 'bg-brand-600 border-brand-600 scale-110'
                    : 'border-slate-300 dark:border-navy-700'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') setEnteredPin('');
                  else if (btn === '⌫') setEnteredPin((p) => p.slice(0, -1));
                  else handlePinKeyPress(btn);
                }}
                className="py-3 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-base transition-all active:scale-95"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 animate-fade-in overflow-hidden">
      {/* Top POS Action Toolbar */}
      <div className="hidden">
        <button onClick={() => setIsLocked(true)}>Lock Station</button>
      </div>
      <div className="flex-1 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-4 flex flex-col min-h-0">
        {/* Cash Drawer Shift Banner */}
        <div className="mb-3 p-3 bg-slate-50 dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            onClick={() => setIsLocked(true)}
            className="px-2.5 py-1 bg-slate-200 dark:bg-navy-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg font-bold flex items-center space-x-1"
            title="Lock POS Terminal"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Lock Terminal</span>
          </button>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              Shift Status:{' '}
              {activeShift ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  OPEN (Started {activeShift.startTime} by {activeShift.cashierName})
                </span>
              ) : (
                <span className="text-red-500 font-bold">CLOSED</span>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-3 font-semibold text-slate-600 dark:text-slate-300">
            {activeShift && (
              <>
                <span>Starting: KSh {activeShift.startingCash.toLocaleString()}</span>
                <span className="hidden sm:inline">Expected: KSh {activeShift.expectedCash.toLocaleString()}</span>
              </>
            )}
            <button
              onClick={() => setShowShiftModal(true)}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition-colors flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{activeShift ? 'Reconcile & Close Shift' : 'Open Cash Shift'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search product name, SKU, or scan Barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => setShowScannerModal(true)}
              className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shrink-0"
              title="Camera Barcode Scanner"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scanner</span>
            </button>
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
                  {c.name} ({c.loyaltyPoints || 0} pts | Credit: KSh {(c.creditLimit - c.outstandingBalance).toLocaleString()})
                </option>
              ))}
            </select>
            {selectedCustomer && (selectedCustomer.loyaltyPoints || 0) > 0 && (
              <div className="mt-2 flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {selectedCustomer.loyaltyPoints} Loyalty Points Available
                </span>
                <button
                  type="button"
                  onClick={handleRedeemPoints}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-[11px]"
                >
                  Redeem Points
                </button>
              </div>
            )}
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
                onClick={() => {
                  setPaymentMethod(method);
                  if (method === 'CASH') setTenderedAmount(total);
                }}
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

          {paymentMethod === 'CASH' && (
            <div className="space-y-2 p-2 bg-slate-50 dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700 text-xs">
              <span className="font-semibold text-slate-400 uppercase text-[10px] block">Quick Cash Presets</span>
              <div className="flex gap-1.5">
                {[10, 20, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTenderedAmount(amt)}
                    className="flex-1 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-brand-500 rounded font-bold text-slate-700 dark:text-slate-200 text-[11px]"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center pt-1">
                <span>Tendered ($):</span>
                <input
                  type="number"
                  min="0"
                  value={tenderedAmount || ''}
                  onChange={(e) => setTenderedAmount(Number(e.target.value))}
                  className="w-24 text-right p-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded text-xs font-bold text-emerald-600"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Change Due:</span>
                <span className="text-emerald-600 dark:text-emerald-400">${changeDue.toFixed(2)}</span>
              </div>
            </div>
          )}

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

      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-500" />
                <span>Camera Barcode Scanner</span>
              </h3>
              <button onClick={() => setShowScannerModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-44 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-brand-500/50">
              <div className="w-full h-0.5 bg-red-500 absolute top-1/2 animate-pulse shadow-lg shadow-red-500" />
              <span className="text-xs font-mono text-slate-400">Simulated Camera Feed Active...</span>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Click a product to simulate barcode scan:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {products.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateScan(p)}
                    className="p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 hover:border-brand-500 rounded-xl font-bold text-slate-800 dark:text-slate-200 truncate"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open/Close Shift Reconciliation Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" />
                <span>{activeShift ? 'Cash Drawer Shift Reconciliation' : 'Open New Cash Shift'}</span>
              </h3>
              <button onClick={() => setShowShiftModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeShift ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl space-y-1.5 text-slate-700 dark:text-slate-200">
                  <div className="flex justify-between"><span>Cashier:</span><span className="font-bold">{activeShift.cashierName}</span></div>
                  <div className="flex justify-between"><span>Starting Float:</span><span className="font-bold">KSh {activeShift.startingCash.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Cash Sales:</span><span className="font-bold text-emerald-600">+KSh {activeShift.totalCashSales.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t border-slate-200 dark:border-navy-700 pt-1.5 text-slate-900 dark:text-white">
                    <span>Expected Drawer Balance:</span>
                    <span>KSh {activeShift.expectedCash.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Actual Cash Counted (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={shiftActualCash || ''}
                    onChange={(e) => setShiftActualCash(Number(e.target.value))}
                    placeholder="Enter physical cash in drawer..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    closeShift(shiftActualCash);
                    setShowShiftModal(false);
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
                >
                  Close & Reconcile Cash Shift
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Starting Cash Float (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={shiftStartingCash || ''}
                    onChange={(e) => setShiftStartingCash(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    startShift(shiftStartingCash);
                    setShowShiftModal(false);
                  }}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all"
                >
                  Start Cash Shift
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
              {paymentMethod === 'CASH' && <div className="flex justify-between"><span>Change Given:</span> <span className="font-bold text-emerald-600">${changeDue.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Audit Log:</span> <span className="font-bold text-emerald-600">Recorded</span></div>
              <div className="flex justify-between"><span>Stock Levels:</span> <span className="font-bold text-emerald-600">Updated</span></div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Next Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manager PIN Override Modal */}
      {showManagerOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Manager Override Required</h3>
              <p className="text-xs text-slate-400 mt-1">Enter Manager/Admin PIN to approve price override or restricted operation (Default: 9999)</p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center tracking-widest text-xl p-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-mono font-bold"
            />

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowManagerOverrideModal(false);
                  setManagerPin('');
                }}
                className="flex-1 py-2 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleManagerOverrideConfirm}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
              >
                Approve Override
              </button>
            </div>
          </div>
        </div>
      )}

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        sale={lastCompletedSale}
      />
    </div>
  );
};
