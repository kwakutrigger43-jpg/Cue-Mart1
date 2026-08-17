import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, MessageCircle, Star, ShieldCheck, Check, User, Phone, MapPin, FileText, ArrowLeft } from 'lucide-react';

export const ProductModal = () => {
  const {
    selectedProductModal, setSelectedProductModal,
    addToCart, checkoutViaWhatsApp,
    wishlist, toggleWishlist,
    settings
  } = useStore();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [step, setStep] = useState('product'); // 'product' or 'checkout'
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const product = selectedProductModal;

  const allImages = React.useMemo(() => {
    if (!product) return [];
    const list = [product.image, ...(product.galleryImages || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [product]);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setStep('product');
      setCustomerDetails({ name: '', phone: '', address: '', notes: '' });
      setErrors({});

      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Standard');
      }

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor({ name: 'Default', hex: '#000000' });
      }
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const activeImage = allImages[activeImageIndex] || product.image || '/assets/silk_evening_gown.jpg';
  const isWishlisted = wishlist.includes(product.id);
  const currency = settings.currency || "$";
  const colorName = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
  const itemTotal = Number(product.price) * quantity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStartQuickCheckout = () => {
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

    checkoutViaWhatsApp(customerDetails, {
      product,
      size: selectedSize,
      color: colorName,
      quantity
    });

    setSelectedProductModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Overlay */}
      <div 
        onClick={() => setSelectedProductModal(null)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 animate-fade-in my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'product' ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Image Viewer & Variety Thumbnails */}
            <div className="bg-slate-100 flex flex-col justify-between p-4 sm:p-6">
              
              {/* Main Stage Image */}
              <div className="relative rounded-2xl bg-white border border-slate-200/80 overflow-hidden aspect-4/5 sm:aspect-square md:aspect-auto md:h-[400px] flex items-center justify-center shadow-xs">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}

                {allImages.length > 1 && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-sm">
                    {activeImageIndex + 1} / {allImages.length} Varieties
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery (shown if multiple images exist) */}
              {allImages.length > 1 && (
                <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none justify-center">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-orange-600 ring-2 ring-orange-500/30 scale-105 shadow-sm'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-orange-600 uppercase tracking-widest">
                    {product.category}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{product.rating} / 5.0</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h2>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {currency}{Number(product.price).toLocaleString()}
                  </span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-sm text-slate-400 line-through">
                      {currency}{Number(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Size: <span className="text-orange-600">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedSize === sz
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Color: <span className="text-orange-600">{colorName}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c, i) => {
                        const cName = typeof c === 'object' ? c.name : c;
                        const cHex = typeof c === 'object' ? c.hex : '#000000';
                        const isSelected = colorName === cName;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedColor(c)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'ring-2 ring-orange-500 ring-offset-2 border-orange-600 scale-110' : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: cHex }}
                            title={cName}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Quantity
                  </label>
                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white font-extrabold text-slate-700 shadow-xs hover:bg-slate-100 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white font-extrabold text-slate-700 shadow-xs hover:bg-slate-100 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, selectedSize, colorName, quantity);
                      setSelectedProductModal(null);
                    }}
                    disabled={!product.inStock}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      !product.inStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleStartQuickCheckout}
                    disabled={!product.inStock}
                    className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quick WhatsApp Order</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isWishlisted ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quality Guaranteed</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Step 2: Customer Details Form for Quick WhatsApp Order */
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600">Quick WhatsApp Order</span>
                <h3 className="text-xl font-extrabold text-slate-900">Enter Your Delivery Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('product')}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            {/* Selected Product Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={activeImage}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-slate-900 truncate">{product.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Size: <strong className="text-slate-800">{selectedSize}</strong> | Color: <strong className="text-slate-800">{colorName}</strong> | Qty: <strong className="text-slate-800">{quantity}</strong>
                </p>
                <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                  Total: {currency}{itemTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Submitting this form generates an official itemized WhatsApp receipt to send directly to CueMart!
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

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('product')}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
