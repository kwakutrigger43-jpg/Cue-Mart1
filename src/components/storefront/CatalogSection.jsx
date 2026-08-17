import React, { useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search, X, SlidersHorizontal, ChevronRight,
  ShoppingBag, Heart, Star, Zap, TrendingUp, Sparkles, Loader2, Filter, ArrowLeft
} from 'lucide-react';

// ── Emoji mapping for dynamic category icons ────────────────────────────────
const CATEGORY_EMOJI = {
  all: '🛍️', dresses: '👗', dress: '👗', outerwear: '🧥', jackets: '🧥',
  jacket: '🧥', coats: '🧥', coat: '🧥', handbags: '👜', handbag: '👜',
  bags: '👜', bag: '👜', jewelry: '💎', jewellery: '💎', accessories: '💍',
  footwear: '👠', shoes: '👟', heels: '👠', sneakers: '👟', tops: '👕',
  shirts: '👔', shirt: '👔', pants: '👖', shorts: '🩳', swimwear: '🩱',
  underwear: '🩲', kids: '🧒', men: '👔', women: '👗', sale: '🏷️',
  new: '✨', watches: '⌚', sunglasses: '🕶️', hats: '🎩', sportswear: '🏃',
  lingerie: '🎀', suits: '🤵', skirts: '👗', jeans: '👖', hoodie: '🧣',
  sweater: '🧶', perfume: '🌸', beauty: '💄', makeup: '💋',
};

const getCategoryEmoji = (cat) => {
  const key = cat.toLowerCase().trim();
  return CATEGORY_EMOJI[key] || CATEGORY_EMOJI[key.split(' ')[0]] || '🏷️';
};

// ── Deal / Rank product mini-card ───────────────────────────────────────────
const HorizontalProductCard = ({ product }) => {
  const { settings, addToCart, wishlist, toggleWishlist, setSelectedProductModal } = useStore();
  const currency = settings.currency || '$';
  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPct = hasDiscount
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;
  const isWishlisted = wishlist?.includes(product.id);

  return (
    <div
      className="relative shrink-0 w-36 sm:w-40 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
      onClick={() => setSelectedProductModal(product)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
            -{discountPct}%
          </span>
        )}
        {product.badge && !hasDiscount && (
          <span className="absolute top-2 left-2 bg-orange-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow transition-all ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-500'}`}
        >
          <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1">
        <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">{product.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-orange-600">{currency}{Number(product.price).toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-[10px] text-slate-400 line-through">{currency}{Number(product.originalPrice).toLocaleString()}</span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-slate-500 font-semibold">{product.rating}</span>
          </div>
        )}
        {/* Quick add */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.inStock) {
              addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Default', 1);
            }
          }}
          disabled={!product.inStock}
          className={`w-full mt-1 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
            product.inStock
              ? 'bg-slate-900 hover:bg-orange-600 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-3 h-3" />
          {product.inStock ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

// ── Style Banner Card ───────────────────────────────────────────────────────
const StyleBannerCard = ({ category, image, onClick }) => (
  <div
    onClick={onClick}
    className="relative shrink-0 w-32 sm:w-36 h-44 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all"
  >
    <img
      src={image || '/assets/hero_bg.jpg'}
      alt={category}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
    <span className="absolute bottom-3 left-0 right-0 text-center text-white text-xs font-extrabold tracking-wide drop-shadow">
      {category}
    </span>
  </div>
);

// ── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, onSeeAll }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        {subtitle && <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>}
      </div>
    </div>
    {onSeeAll && (
      <button
        onClick={onSeeAll}
        className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors"
      >
        See All <ChevronRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// ── Main ProductCard (grid) ─────────────────────────────────────────────────
const GridProductCard = ({ product }) => {
  const { settings, addToCart, wishlist, toggleWishlist, setSelectedProductModal } = useStore();
  const currency = settings.currency || '$';
  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const isWishlisted = wishlist?.includes(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col">
      <div
        className="relative overflow-hidden bg-slate-50 cursor-pointer"
        style={{ paddingBottom: '120%' }}
        onClick={() => setSelectedProductModal(product)}
      >
        <img
          src={product.image || '/assets/silk_evening_gown.jpg'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {!product.inStock ? (
            <span className="px-2 py-0.5 rounded-lg bg-red-900/90 text-white text-[9px] font-bold uppercase">Sold Out</span>
          ) : product.badge ? (
            <span className="px-2 py-0.5 rounded-lg bg-orange-600 text-white text-[9px] font-bold uppercase">{product.badge}</span>
          ) : null}
          {hasDiscount && product.inStock && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[9px] font-bold uppercase">
              -{Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-all ${
            isWishlisted ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-white backdrop-blur-md'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick view */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:block">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedProductModal(product); }}
            className="w-full py-2 rounded-xl bg-slate-900/90 hover:bg-orange-600 text-white text-[11px] font-bold backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-orange-600 font-bold">{product.category}</span>
          <h3
            onClick={() => setSelectedProductModal(product)}
            className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight mt-0.5 hover:text-orange-600 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-base text-slate-900">{currency}{Number(product.price).toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through ml-1.5">{currency}{Number(product.originalPrice).toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => {
              if (product.inStock) addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Default', 1);
            }}
            disabled={!product.inStock}
            className={`p-2 rounded-xl transition-all ${
              !product.inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-orange-600 text-white shadow-sm'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN CATALOG SECTION
// ═══════════════════════════════════════════════════════════════════════════
export const CatalogSection = () => {
  const {
    categories, activeCategory, setActiveCategory,
    products, filteredProducts,
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
    isLoading
  } = useStore();

  const gridRef = useRef(null);

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    // Smooth scroll down to grid view when selecting any specific category
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter deals and top ranking items according to activeCategory if activeCategory !== 'All'
  const isAll = activeCategory.toLowerCase() === 'all';

  // Deals: products with a discount
  const dealProducts = [...products]
    .filter(p => p.inStock && p.originalPrice && Number(p.originalPrice) > Number(p.price))
    .filter(p => isAll || p.category?.toLowerCase() === activeCategory.toLowerCase())
    .sort((a, b) => (Number(b.originalPrice) - Number(b.price)) - (Number(a.originalPrice) - Number(a.price)));

  // Top Ranking: highest rated
  const topRanking = [...products]
    .filter(p => p.inStock && p.rating)
    .filter(p => isAll || p.category?.toLowerCase() === activeCategory.toLowerCase())
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 10);

  // Style banners: one per non-All category using first product image
  const styleBanners = categories
    .filter(c => c !== 'All')
    .map(cat => {
      const firstProd = products.find(p => p.category?.toLowerCase() === cat.toLowerCase() && p.image);
      return { category: cat, image: firstProd?.image || null };
    })
    .filter(b => b.image);

  // Loading skeleton
  if (isLoading) {
    return (
      <div id="catalog" className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading CueMart catalogue…</p>
      </div>
    );
  }

  return (
    <div id="catalog" className="scroll-mt-20">

      {/* ── Category Tab Bar (Sticky) ────────────────────────────────────── */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5">
            {categories.map(cat => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30 scale-105'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  <span>{getCategoryEmoji(cat)}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ── Active Category Indicator (when a specific category is selected) ── */}
        {!isAll && (
          <div className="bg-orange-50 border border-orange-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-orange-100">
                {getCategoryEmoji(activeCategory)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">Active Category</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{activeCategory}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing all {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} in "{activeCategory}"
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelectCategory('All')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-orange-600 text-slate-800 hover:text-white border border-slate-200 text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Show All Categories (ALL)</span>
            </button>
          </div>
        )}

        {/* ── Search Bar ─────────────────────────────────────────────────── */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            id="catalog-search"
            placeholder="Search products, fashion, accessories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() && gridRef.current) {
                gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 placeholder:text-slate-400 shadow-sm transition-all"
          />
          {searchQuery ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'match' : 'matches'}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* ── Circle Category Icons ───────────────────────────────────────── */}
        <div>
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
            {categories.map(cat => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-sm border-2 ${
                    isActive
                      ? 'bg-orange-600 border-orange-600 shadow-orange-300 scale-105 text-white'
                      : 'bg-white border-slate-200 hover:border-orange-400 hover:shadow-md group-hover:scale-105'
                  }`}>
                    {getCategoryEmoji(cat)}
                  </div>
                  <span className={`text-[11px] font-bold text-center leading-tight max-w-[64px] ${
                    isActive ? 'text-orange-600' : 'text-slate-600'
                  }`}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Style Banners (Show on 'All') ─────────────────────────────────── */}
        {isAll && styleBanners.length > 0 && (
          <div>
            <SectionHeader
              icon={<Sparkles className="w-4 h-4 text-orange-500" />}
              title="Shop by Style"
              subtitle="Tap a look to explore"
            />
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {styleBanners.map(banner => (
                <StyleBannerCard
                  key={banner.category}
                  category={banner.category}
                  image={banner.image}
                  onClick={() => handleSelectCategory(banner.category)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Super Deals ─────────────────────────────────────────────────── */}
        {dealProducts.length > 0 && (
          <div>
            <SectionHeader
              icon={<Zap className="w-4 h-4 text-amber-500 fill-amber-400" />}
              title={isAll ? "Super Deals" : `Deals in ${activeCategory}`}
              subtitle="Limited time savings"
              onSeeAll={() => handleSelectCategory('All')}
            />
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {dealProducts.slice(0, 8).map(p => (
                <HorizontalProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── Top Ranking ─────────────────────────────────────────────────── */}
        {topRanking.length > 0 && (
          <div>
            <SectionHeader
              icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
              title={isAll ? "Top Ranking Items" : `Top Rated in ${activeCategory}`}
              subtitle="Customer favourites"
              onSeeAll={() => { setSortOption('featured'); handleSelectCategory('All'); }}
            />
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {topRanking.map(p => (
                <HorizontalProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── Main Product Grid ────────────────────────────────────────────── */}
        <div ref={gridRef} id="catalog-grid" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-orange-500" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {isAll ? 'All Products' : `${activeCategory} Collection`}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {filteredProducts.map(product => (
                <GridProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-3xl">
                🛍️
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">No products found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery
                    ? `No results for "${searchQuery}" in "${activeCategory}"`
                    : `No items in "${activeCategory}" yet`}
                </p>
              </div>
              <button
                onClick={() => { setSearchQuery(''); handleSelectCategory('All'); }}
                className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
              >
                Show All Categories (ALL)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
