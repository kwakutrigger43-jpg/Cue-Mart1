import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Heart, Search, Store, X, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { 
    viewMode, setViewMode, 
    settings, 
    cart, wishlist, 
    searchQuery, setSearchQuery, 
    filteredProducts,
    setIsCartOpen, setIsWishlistOpen 
  } = useStore();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const mobileInputRef = useRef(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMobileSearch = () => {
    setIsSearchExpanded(prev => !prev);
    if (!isSearchExpanded) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">

          {/* Left: Store Logo & Brand Name */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button 
              onClick={() => setViewMode('store')}
              className="group flex items-center gap-2.5 sm:gap-3 focus:outline-none"
            >
              <img 
                src="/assets/logo.png" 
                alt="CueMart Logo" 
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                onError={e => e.target.style.display = 'none'}
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1">
                  {settings.storeName || "CueMart"}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-orange-600 -mt-1 hidden sm:inline">
                  Everything You Need, Delivered.
                </span>
              </div>
            </button>

            {/* View Status Pill */}
            {viewMode === 'admin' ? (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-900 border border-orange-200">
                <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
                Admin Portal
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                WhatsApp Direct Checkout
              </span>
            )}
          </div>

          {/* Center: Search input for tablet & desktop */}
          {viewMode === 'store' && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog, fashion, accessories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400 shadow-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Right Action Icons & Admin Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">

            {/* Mobile Search Toggle Button */}
            {viewMode === 'store' && (
              <button
                onClick={toggleMobileSearch}
                className={`md:hidden p-2.5 rounded-full transition-all ${
                  isSearchExpanded || searchQuery
                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Toggle Search Bar"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {viewMode === 'store' && (
              <>
                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="relative p-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-full transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">Bag</span>
                  <span className="bg-orange-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartItemsCount}
                  </span>
                </button>
              </>
            )}

            {/* Admin Back Button */}
            {viewMode === 'admin' && (
              <button
                onClick={() => setViewMode('store')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-md"
              >
                <Store className="w-4 h-4 text-white" />
                <span>Customer Store</span>
              </button>
            )}

          </div>
        </div>

        {/* Fully Responsive Mobile Search Input Bar */}
        {viewMode === 'store' && (isSearchExpanded || searchQuery) && (
          <div className="md:hidden pb-3.5 pt-1 animate-fade-in">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search fashion, accessories, products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-orange-50/50 border border-orange-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[11px] font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-1.5 px-1">
                <span>Results for "{searchQuery}":</span>
                <span className="text-orange-600 font-bold">{filteredProducts.length} items found</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
