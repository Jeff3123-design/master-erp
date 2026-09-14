import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Pagination } from '../../components/common/Pagination';
import { Search, Plus, Edit2, X } from 'lucide-react';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [minStockLevel, setMinStockLevel] = useState<number>(5);

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesQ =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode(`${Math.floor(8900000 + Math.random() * 99999)}`);
    setName('');
    setCategory('Electronics');
    setCostPrice(100);
    setSellingPrice(149.99);
    setStockQuantity(15);
    setMinStockLevel(5);
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setSku(p.sku);
    setBarcode(p.barcode || '');
    setName(p.name);
    setCategory(p.category);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setStockQuantity(p.stockQuantity);
    setMinStockLevel(p.minStockLevel);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        sku,
        barcode,
        name,
        category,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity),
        minStockLevel: Number(minStockLevel),
      });
    } else {
      addProduct({
        sku,
        barcode,
        name,
        category,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity),
        minStockLevel: Number(minStockLevel),
        unit: 'pcs',
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Products Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Master inventory items, SKUs, barcode tracking, and pricing rules.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${
                selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
              {paginatedProducts.map((p) => {
                const low = p.stockQuantity <= p.minStockLevel;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.barcode || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-500">{p.category}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">${p.costPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-600 dark:text-brand-400">${p.sellingPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${low ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                        {p.stockQuantity} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Barcode</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="font-semibold text-slate-400 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-bold text-brand-600"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Initial Stock Quantity</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
