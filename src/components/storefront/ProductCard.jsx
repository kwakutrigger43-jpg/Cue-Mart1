import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    settings, 
    addToCart, 
    wishlist, toggleWishlist, 
    setSelectedProductModal 
  } = useStore();

  const isWishlisted = Boolean(wishlist?.includes(product.id));
  const hasDiscount = Boolean(product?.originalPrice && Number(product.originalPrice) > Number(product.price));
  const currency = settings.currency || "$";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => setSelectedProductModal(product)}>
        <img
          src={product.image || '/assets/silk_evening_gown.jpg'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!product.inStock ? (
            <span className="px-2.5 py-1 rounded-lg bg-red-900/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Out of Stock
            </span>
          ) : product.badge ? (
            <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          ) : null}

          {hasDiscount && product.inStock && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase">
              Save {currency}{(Number(product.originalPrice) - Number(product.price)).toFixed(0)}
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 z-10 ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md hover:scale-110 shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductModal(product);
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900/90 hover:bg-orange-600 text-white text-xs font-bold backdrop-blur-md flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Detail View</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span className="uppercase tracking-wider text-[10px] text-orange-600 font-bold">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-slate-700 text-[11px] font-bold">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => setSelectedProductModal(product)}
            className="font-bold text-base text-slate-900 line-clamp-1 hover:text-orange-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
              <span>Sizes:</span>
              <span className="text-slate-600 font-semibold">{product.sizes.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-slate-900">
                {currency}{Number(product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {currency}{Number(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={() => {
              if (product.inStock) {
                const defaultSize = product.sizes ? product.sizes[0] : "Standard";
                const defaultColor = product.colors ? product.colors[0] : "Default";
                addToCart(product, defaultSize, defaultColor, 1);
              }
            }}
            disabled={!product.inStock}
            className={`p-2.5 rounded-xl transition-all ${
              !product.inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-orange-600 text-white shadow-xs hover:shadow'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
