import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Announcement } from './components/common/Announcement';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { HeroSection } from './components/storefront/HeroSection';
import { CategoryFilter } from './components/storefront/CategoryFilter';
import { ProductCard } from './components/storefront/ProductCard';
import { CartDrawer } from './components/drawers/CartDrawer';
import { WishlistDrawer } from './components/drawers/WishlistDrawer';
import { ProductModal } from './components/modals/ProductModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { PackageSearch } from 'lucide-react';
import './App.css';

function MainAppContent() {
  const { viewMode, isAdminAuthenticated, filteredProducts, searchQuery, activeCategory, setActiveCategory, setSearchQuery } = useStore();

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Announcement Bar */}
      <Announcement />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* View Switcher: Storefront vs Merchant Admin */}
      {viewMode === 'store' ? (
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroSection />

          {/* Catalog Section Container */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Category Filter & Sorting */}
            <CategoryFilter />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty Search Results State */
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-xs space-y-4 max-w-lg mx-auto my-8 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">No products match your search</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    We couldn't find any items matching "{searchQuery}" in category "{activeCategory}".
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                    className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

          </section>

          {/* Footer */}
          <Footer />
        </main>
      ) : (
        /* Merchant Admin Dashboard - only renders if authenticated */
        isAdminAuthenticated ? (
          <main className="flex-1">
            <AdminDashboard />
          </main>
        ) : (
          /* Fallback: redirect to store if somehow reached without auth */
          <main className="flex-1">
            <HeroSection />
          </main>
        )
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductModal />
      <AdminLoginModal />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
