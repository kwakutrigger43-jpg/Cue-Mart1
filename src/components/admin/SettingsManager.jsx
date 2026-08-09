import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, Phone, Store, Tag, Megaphone, Mail, MapPin, Globe, Lock, ShieldCheck, Eye, EyeOff, Navigation } from 'lucide-react';

export const SettingsManager = () => {
  const { settings, updateSettings } = useStore();
  const [formState, setFormState] = useState({ ...settings });

  // PIN change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setNewPin(value);
    setPinError('');
    setPinSuccess(false);
  };

  const handleConfirmPinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setConfirmPin(value);
    setPinError('');
    setPinSuccess(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (newPin.length < 4) { setPinError('PIN must be exactly 4 digits.'); return; }
    if (newPin !== confirmPin) { setPinError('PINs do not match. Please try again.'); return; }
    updateSettings({ ...settings, adminPin: newPin });
    setFormState(prev => ({ ...prev, adminPin: newPin }));
    setNewPin('');
    setConfirmPin('');
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formState);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            CueMart Storefront Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your merchant contact number, currency, branding & promotional announcement.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        
        {/* WhatsApp & Currency Highlight Box */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Ordering Channel Config</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Merchant WhatsApp Phone Number *
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">Include country code (e.g. 2348123456789 or 15551234567)</p>
              <input
                type="text"
                name="whatsappNumber"
                required
                value={formState.whatsappNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Currency Symbol *
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">e.g. $, ₦, €, £, AED</p>
              <input
                type="text"
                name="currency"
                required
                value={formState.currency}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Branding Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Name
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="storeName"
                  value={formState.storeName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Subheading
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="tagline"
                  value={formState.tagline}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Announcement Banner
            </label>
            <div className="relative">
              <Megaphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="announcement"
                value={formState.announcement}
                onChange={handleChange}
                placeholder="Promo text shown at top of website..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store Bio / Description
            </label>
            <textarea
              name="description"
              rows={2}
              value={formState.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Footer Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Concierge Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formState.contactEmail}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Social / Instagram Handle
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="instagram"
                  value={formState.instagram}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          {/* Shop Location for Google Maps Directions */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-600" />
              <label className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                Shop Location — Get Directions Button
              </label>
            </div>
            <p className="text-[11px] text-orange-700/80 leading-relaxed">
              Enter your shop address or Google Maps search query below. Once saved, the <strong>"Get Directions to Store"</strong> button on the homepage will automatically activate and link customers directly to your location.
            </p>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input
                type="text"
                name="shopLocation"
                value={formState.shopLocation || ''}
                onChange={handleChange}
                placeholder="e.g. 14 Fashion Boulevard, Victoria Island, Lagos"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-orange-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-400"
              />
            </div>
            {formState.shopLocation && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formState.shopLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-700 hover:text-orange-900 underline underline-offset-2"
              >
                <Navigation className="w-3 h-3" />
                Preview this location on Google Maps
              </a>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>

      </form>

      {/* Admin PIN Management Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5 mt-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="p-2 rounded-xl bg-slate-900/10 text-slate-900">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Admin PIN Security</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Change the 4-digit PIN required to access the Admin Panel.</p>
          </div>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">New Admin PIN</label>
              <div className="relative">
                <input
                  type={showNewPin ? 'text' : 'password'}
                  value={newPin}
                  onChange={handlePinChange}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  inputMode="numeric"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Confirm New PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                placeholder="Repeat the PIN"
                maxLength={4}
                inputMode="numeric"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {pinError && (
            <p className="text-xs text-red-600 font-bold flex items-center gap-1.5">
              <span>⚠</span> {pinError}
            </p>
          )}

          {pinSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin PIN updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Update Admin PIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
