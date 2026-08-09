import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Globe, Mail, MapPin, ShieldCheck, Truck, LayoutDashboard } from 'lucide-react';

export const Footer = () => {
  const { settings, setViewMode, setShowAdminLogin, isAdminAuthenticated } = useStore();

  const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello CueMart! I would like to inquire about your products.")}`;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant WhatsApp Checkout</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct concierge service & quick order dispatches.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Doorstep Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Secure insulated packaging & fast handling.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Authentic Quality</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% genuine products & artisanal craftsmanship.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Boutique Info with Logo */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="CueMart Logo" className="h-10 w-auto object-contain" />
            <h3 className="text-2xl text-white font-extrabold tracking-tight">
              {settings.storeName || "CueMart"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {settings.description || "Everything You Need, Delivered. Curated fashion, artisanal leather goods & fine jewelry."}
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-950/50"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-orange-400">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#catalog" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#catalog" className="hover:text-white transition-colors">Bestseller Dresses</a></li>
            <li><a href="#catalog" className="hover:text-white transition-colors">Leather Accessories</a></li>
            <li><a href="#catalog" className="hover:text-white transition-colors">Jewelry & Gold</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-orange-400">Store Concierge</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{settings.address || "Victoria Island, Lagos"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{settings.contactEmail || "orders@cuemart.com"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{settings.instagram || "@cuemart_official"}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        <p className="hidden sm:flex items-center gap-1">
          Everything You Need, Delivered.
        </p>
        {/* Discreet Merchant Admin Entry — tucked at the bottom-right for curious eyes */}
        <button
          onClick={() => {
            if (isAdminAuthenticated) {
              setViewMode('admin');
            } else {
              setShowAdminLogin(true);
            }
          }}
          title="Merchant Portal Access"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-500 hover:text-orange-400 hover:border-orange-500/40 hover:bg-slate-900 transition-all text-[10px] font-semibold tracking-wide group"
        >
          <LayoutDashboard className="w-3 h-3 group-hover:text-orange-400" />
          <span>Merchant Portal</span>
        </button>
      </div>

    </footer>
  );
};
