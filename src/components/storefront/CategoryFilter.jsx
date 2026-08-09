import React from 'react';
import { useStore } from '../../context/StoreContext';
import { SlidersHorizontal, Sparkles, Search, X } from 'lucide-react';

export const CategoryFilter = () => {
  const { 
    categories, 
    activeCategory, setActiveCategory, 
    sortOption, setSortOption,
    filteredProducts,
    searchQuery, setSearchQuery
  } = useStore();

  return (
    <div id="catalog" className="scroll-mt-24 mb-8 space-y-5">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inventory Catalogue</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Featured CueMart Collection
          </h2>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-xs"
          >
            <option value="featured">Featured / Highlighted</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Search Bar — full width, always visible on storefront */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          id="catalog-search"
          placeholder="Search products, fashion, accessories, jewelry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-800
            focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500
            placeholder:text-slate-400 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills + Count */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Count Indicator */}
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline shrink-0">
          {searchQuery
            ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
            : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`
          }
        </span>
      </div>

    </div>
  );
};
