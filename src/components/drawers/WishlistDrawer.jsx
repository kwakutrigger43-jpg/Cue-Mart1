import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen, setIsWishlistOpen,
    wishlist, toggleWishlist,
    products, addToCart, settings
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  const currency = settings.currency || "$";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg leading-tight">Saved Favorites</h2>
                <p className="text-xs text-slate-400">{wishlistedProducts.length} items in wishlist</p>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">No saved favorites yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Tap the heart icon on any product to save items for later.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <img 
                      src={product.image || '/assets/silk_evening_gown.jpg'} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                        {product.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {currency}{Number(product.price).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const defaultSize = product.sizes ? product.sizes[0] : "Standard";
                          const defaultColor = product.colors ? product.colors[0] : "Default";
                          addToCart(product, defaultSize, defaultColor, 1);
                        }}
                        disabled={!product.inStock}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          !product.inStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 hover:bg-orange-600 text-white shadow-xs'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Action */}
          {wishlistedProducts.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => {
                  wishlistedProducts.forEach(product => {
                    if (product.inStock) {
                      const defaultSize = product.sizes ? product.sizes[0] : "Standard";
                      const defaultColor = product.colors ? product.colors[0] : "Default";
                      addToCart(product, defaultSize, defaultColor, 1);
                    }
                  });
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Add All Available To Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
