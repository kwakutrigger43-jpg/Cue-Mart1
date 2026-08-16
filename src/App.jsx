import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Announcement } from './components/common/Announcement';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { HeroSection } from './components/storefront/HeroSection';
import { CatalogSection } from './components/storefront/CatalogSection';
import { CartDrawer } from './components/drawers/CartDrawer';
import { WishlistDrawer } from './components/drawers/WishlistDrawer';
import { ProductModal } from './components/modals/ProductModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import './App.css';

function MainAppContent() {
  const { viewMode, isAdminAuthenticated } = useStore();

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">

      {/* Top Announcement Bar */}
      <Announcement />

      {/* Main Navigation */}
      <Navbar />

      {/* View Switcher */}
      {viewMode === 'store' ? (
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroSection />

          {/* SHEIN-style Catalog: sticky tab bar, circles, banners, deals, grid */}
          <CatalogSection />

          {/* Footer */}
          <Footer />
        </main>
      ) : (
        isAdminAuthenticated ? (
          <main className="flex-1">
            <AdminDashboard />
          </main>
        ) : (
          <main className="flex-1">
            <HeroSection />
            <CatalogSection />
            <Footer />
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
