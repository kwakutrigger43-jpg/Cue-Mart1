import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, ArrowRight, Sparkles, MessageCircle, Truck, ShieldCheck, MapPin } from 'lucide-react';

export const HeroSection = () => {
  const { settings, setActiveCategory } = useStore();

  return (
    <section className="relative overflow-hidden text-white py-10 lg:py-14 border-b border-orange-900/30">
      
      {/* Store Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/hero_bg.jpg')" }}
      />

      {/* Lightened translucent overlay: lets the bright, vibrant store interior shine through */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20" />

      {/* Warm amber glow accent to blend with store's golden lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/25 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-400/20 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Welcome Heading & Attractive Small Description */}
          <div className="space-y-4 max-w-2xl animate-fade-in">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Everything You Need, Delivered.</span>
            </div>

            {/* Main Title: Welcome to Cue Mart */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Cue Mart</span>
            </h1>

            {/* Attractive Small Description */}
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
              {settings.description || "Discover high-quality fashion, artisanal leather accessories, fine gold jewelry, and lifestyle essentials. Shop effortlessly with direct WhatsApp delivery."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog"
                onClick={() => setActiveCategory("All")}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-600/30 hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Get Directions Button */}
              {settings.shopLocation ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.shopLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md transition-all"
                >
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Get Directions to Store</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 bg-slate-800/40 text-slate-500 border border-slate-700/50 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-default select-none">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span>Store Location Coming Soon</span>
                </span>
              )}
            </div>

            {/* Compact Trust Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-[11px] text-slate-400 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-orange-400" />
                <span>Fast Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct WhatsApp Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Brand Visual Box with Logo */}
          <div className="w-full md:w-auto flex justify-center shrink-0">
            <div className="relative p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center max-w-xs space-y-3 transform hover:scale-[1.02] transition-transform">
              <img 
                src="/assets/logo.png" 
                alt="CueMart Logo" 
                className="h-28 w-auto mx-auto object-contain drop-shadow-md"
              />
              <div className="border-t border-slate-800 pt-3">
                <span className="text-xs font-bold text-white block">CueMart Concierge</span>
                <span className="text-[10px] text-orange-400 font-semibold block">Order via WhatsApp in Seconds</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
