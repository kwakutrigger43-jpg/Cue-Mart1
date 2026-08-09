import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductFormModal } from './ProductFormModal';
import { OrdersManager } from './OrdersManager';
import { SettingsManager } from './SettingsManager';
import { 
  Package, Plus, Search, Edit3, Trash2, 
  DollarSign, AlertCircle, Settings, 
  MessageCircle, Layers, ExternalLink, LogOut, ShieldCheck 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    products, deleteProduct, toggleStock, 
    categories, addCategory, deleteCategory,
    orders, settings, setViewMode, adminLogout
  } = useStore();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'categories', 'orders', 'settings'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const [newCatInput, setNewCatInput] = useState('');

  const currency = settings.currency || "$";

  // Compute metrics
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (p.stockQuantity || 1)), 0);
  const outOfStockCount = products.filter(p => !p.inStock).length;

  // Filter products in admin table
  const filteredAdminProducts = products.filter(p => {
    const pCat = p?.category || "";
    const pName = p?.name || "";
    const matchesCat = adminCategoryFilter === 'All' || pCat.toLowerCase() === adminCategoryFilter.toLowerCase();
    const matchesQuery = adminSearch === '' || 
      pName.toLowerCase().includes(adminSearch.toLowerCase()) || 
      pCat.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    setNewCatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img src="/assets/logo.png" alt="CueMart Logo" className="h-10 w-auto object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-xl sm:text-2xl text-white">
                    CueMart Merchant Admin
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-orange-600 text-white">
                    Merchant Console
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Managing <strong className="text-slate-200">{settings.storeName}</strong> ({settings.whatsappNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Verified Admin badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Verified</span>
              </div>

              <button
                onClick={() => setViewMode('store')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Preview Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={adminLogout}
                title="Logout from Admin Panel"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-900/80 border border-slate-700 hover:border-red-700 text-slate-300 hover:text-red-300 text-xs font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inventory Stock Value</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{currency}{totalValue.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Orders</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Out of Stock Alerts</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{outOfStockCount}</div>
            </div>
            <div className={`p-3 rounded-xl ${outOfStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 scrollbar-none">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length - 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </button>
        </div>

        {/* Tab 1: Product Inventory */}
        {activeTab === 'inventory' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search item title or category..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3.5 py-2 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all self-end sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                          No matching inventory items found.
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image || '/assets/silk_evening_gown.jpg'}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  {product.badge && (
                                    <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">
                                      {product.badge}
                                    </span>
                                  )}
                                  <span>{product.sizes?.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              {currency}{Number(product.price).toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="text-[10px] text-slate-400 line-through">
                                {currency}{Number(product.originalPrice).toLocaleString()}
                              </div>
                            )}
                          </td>

                          {/* Stock Status */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStock(product.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                product.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Category Management */}
        {activeTab === 'categories' && (
          <div className="mt-6 max-w-2xl space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Catalogue Category Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create new departments or remove unused categories for CueMart.
                </p>
              </div>

              <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category e.g. Electronics, Footwear..."
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                  Add Category
                </button>
              </form>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Active Categories
                </label>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {categories.map((cat) => (
                    <div key={cat} className="p-3 bg-white flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{cat}</span>
                      {cat !== 'All' ? (
                        <button
                          onClick={() => deleteCategory(cat)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Default System Pill</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Log */}
        {activeTab === 'orders' && (
          <div className="mt-6 animate-fade-in">
            <OrdersManager />
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="mt-6 animate-fade-in">
            <SettingsManager />
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
      />

    </div>
  );
};
