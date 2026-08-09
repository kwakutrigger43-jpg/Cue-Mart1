import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, User, Phone, MapPin, FileText } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen, setIsCartOpen,
    cart, updateCartQuantity, removeFromCart, clearCart,
    checkoutViaWhatsApp, settings
  } = useStore();

  const [step, setStep] = useState('cart'); // 'cart' or 'checkout'
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + ((Number(item.product?.price) || 0) * item.quantity), 0);
  const currency = settings.currency || "$";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setStep('checkout');
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!customerDetails.name.trim()) newErrors.name = "Full name is required";
    if (!customerDetails.phone.trim()) newErrors.phone = "Phone number is required";
    if (!customerDetails.address.trim()) newErrors.address = "Delivery address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    checkoutViaWhatsApp(customerDetails);
    setStep('cart');
    setCustomerDetails({ name: '', phone: '', address: '', notes: '' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop overlay */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="CueMart" className="h-8 w-auto object-contain" />
              <div>
                <h2 className="font-extrabold text-lg leading-tight">
                  {step === 'cart' ? 'Shopping Bag' : 'WhatsApp Delivery Info'}
                </h2>
                <p className="text-xs text-slate-400">
                  {step === 'cart' ? `${cart.length} items in cart` : 'Fill details to generate receipt'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setStep('cart');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'cart' ? (
              cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Your bag is empty</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Explore CueMart inventory and add your favorite pieces.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.cartItemId}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <img 
                        src={item.product.image || '/assets/silk_evening_gown.jpg'} 
                        alt={item.product.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                          <span>Size: <strong className="text-slate-800">{item.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-slate-800">{item.color}</strong></span>
                        </div>
                        <div className="text-xs font-extrabold text-orange-600 mt-1">
                          {currency}{Number(item.product.price).toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1.5 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, -1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, 1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Checkout Form */
              <form onSubmit={handleWhatsAppSubmit} className="space-y-4 animate-fade-in">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    Submitting this form opens WhatsApp with an automated itemized CueMart invoice ready to send to our order desk!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Jane Doe"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 ${
                        errors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+234 812 345 6789"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 ${
                        errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      name="address"
                      rows={3}
                      placeholder="Street address, City, Landmark..."
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                        errors.address ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Instructions / Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="Gift wrap request, preferred delivery time..."
                      value={customerDetails.notes}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold"
                  >
                    ← Back to Bag items
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer Summary (Cart Step) */}
          {step === 'cart' && cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Subtotal</span>
                  <span>{currency}{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Estimated Delivery</span>
                  <span className="text-emerald-700 font-bold">Calculated on WhatsApp</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-orange-600">{currency}{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Proceed to Order Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <button 
                  onClick={clearCart}
                  className="hover:text-red-500 underline"
                >
                  Clear Bag
                </button>
                <span>🔒 Direct Merchant Dispatch</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
