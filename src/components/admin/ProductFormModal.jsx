import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Image, PlusCircle, Upload, Trash2, Plus, Loader2, CheckCircle2 } from 'lucide-react';

// ── Image compressor (canvas-based) ─────────────────────────────────────────
// Keeps images under ~150KB so Firestore docs stay within the 1MB limit
const compressImage = (file, maxWidth = 900, quality = 0.72) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

export const ProductFormModal = ({ isOpen, onClose, editingProduct }) => {
  const { categories, addCategory, addProduct, updateProduct, settings } = useStore();

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  const blankForm = () => ({
    name: '',
    category: categories.find(c => c !== 'All') || 'Dresses',
    price: '',
    originalPrice: '',
    inStock: true,
    stockQuantity: 10,
    badge: 'New Arrival',
    image: '',
    galleryImages: [],
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0F172A' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    featured: false
  });

  const [formData, setFormData] = useState(blankForm());
  const [isCreatingNewCat, setIsCreatingNewCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FF5722');
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || categories.find(c => c !== 'All') || 'Dresses',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        stockQuantity: editingProduct.stockQuantity || 10,
        badge: editingProduct.badge || '',
        image: editingProduct.image || '',
        galleryImages: editingProduct.galleryImages || [],
        description: editingProduct.description || '',
        sizes: editingProduct.sizes || ['S', 'M', 'L'],
        colors: editingProduct.colors || [{ name: 'Black', hex: '#000000' }],
        featured: editingProduct.featured || false
      });
    } else {
      setFormData(blankForm());
    }
    setIsCreatingNewCat(false);
    setCustomCatInput('');
    setIsSaving(false);
  }, [editingProduct, isOpen]);

  // ── Image handlers ───────────────────────────────────────────────────────
  const handleMainImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, image: compressed }));
    } catch (err) {
      console.error('Main image compression failed:', err);
    } finally {
      setUploadingMain(false);
      // Reset file input so same file can be re-picked
      if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    }
  };

  const handleGalleryImageFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const currentCount = formData.galleryImages?.length || 0;
      const slots = 5 - currentCount;
      const toProcess = files.slice(0, slots);
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)));
      setFormData(prev => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...compressed].slice(0, 5)
      }));
    } catch (err) {
      console.error('Gallery compression failed:', err);
    } finally {
      setUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (idx) =>
    setFormData(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== idx) }));

  const handleSetAsMainImage = (idx) => {
    const target = formData.galleryImages?.[idx];
    if (!target) return;
    const oldMain = formData.image;
    const newGallery = formData.galleryImages.filter((_, i) => i !== idx);
    if (oldMain && oldMain !== target) newGallery.push(oldMain);
    setFormData(prev => ({ ...prev, image: target, galleryImages: newGallery.slice(0, 5) }));
  };

  if (!isOpen) return null;

  // ── Field change ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // ── Category helpers ─────────────────────────────────────────────────────
  const handleAddNewCategoryInline = () => {
    if (!customCatInput.trim()) return;
    const catName = customCatInput.trim();
    addCategory(catName);
    setFormData(prev => ({ ...prev, category: catName }));
    setIsCreatingNewCat(false);
    setCustomCatInput('');
  };

  // ── Sizes ────────────────────────────────────────────────────────────────
  const handleAddSize = () => {
    if (!newSizeInput.trim() || formData.sizes.includes(newSizeInput.trim())) return;
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSizeInput.trim()] }));
    setNewSizeInput('');
  };
  const handleRemoveSize = (sz) =>
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== sz) }));

  // ── Colors ───────────────────────────────────────────────────────────────
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }] }));
    setNewColorName('');
    setNewColorHex('#FF5722');
  };
  const handleRemoveColor = (i) =>
    setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i) }));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let finalCategory = formData.category;
    if (isCreatingNewCat && customCatInput.trim()) {
      finalCategory = customCatInput.trim();
      addCategory(finalCategory);
    }

    const payload = {
      ...formData,
      category: finalCategory,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stockQuantity: parseInt(formData.stockQuantity) || 0
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setIsSaving(false);
    }
  };

  const isUploading = uploadingMain || uploadingGallery;

  return (
    // ── Outer overlay — fixed, full viewport, flex-centered ─────────────
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 my-6 mx-4 overflow-hidden flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 48px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="CueMart" className="h-8 w-auto object-contain" onError={e => e.target.style.display='none'} />
            <div>
              <h3 className="font-extrabold text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-[11px] text-slate-400">CueMart Inventory Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload status banner */}
        {isUploading && (
          <div className="flex items-center gap-3 px-6 py-3 bg-orange-50 border-b border-orange-100 text-orange-700 text-xs font-bold shrink-0">
            <Loader2 className="w-4 h-4 animate-spin" />
            Compressing & processing image… please wait
          </div>
        )}

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text" name="name" required
                placeholder="e.g. Silk Evening Gown"
                value={formData.name} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Category *</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCat(v => !v)}
                  className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  {isCreatingNewCat ? 'Choose Existing' : '+ New Category'}
                </button>
              </div>
              {isCreatingNewCat ? (
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="Type new category..."
                    value={customCatInput} onChange={e => setCustomCatInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-orange-300 bg-orange-50/30 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    autoFocus
                  />
                  <button
                    type="button" onClick={handleAddNewCategoryInline}
                    className="px-3 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price ({settings.currency}) *</label>
              <input
                type="number" name="price" required step="0.01" placeholder="185"
                value={formData.price} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price ({settings.currency})</label>
              <input
                type="number" name="originalPrice" step="0.01" placeholder="230"
                value={formData.originalPrice} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Qty</label>
              <input
                type="number" name="stockQuantity" placeholder="10"
                value={formData.stockQuantity} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag (Optional)</label>
            <input
              type="text" name="badge"
              placeholder="Best Seller, Limited Stock, New Arrival…"
              value={formData.badge} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* ── Image Section ─────────────────────────────────────────── */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Product Images
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload from your phone gallery — images auto-compressed for fast sync.
                </p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                {1 + (formData.galleryImages?.length || 0)} / 6
              </span>
            </div>

            {/* Main image */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                Main Display Image *
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Preview */}
                <div className="relative w-28 h-28 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {uploadingMain ? (
                    <div className="flex flex-col items-center gap-1 text-orange-500">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[9px] font-bold">Processing…</span>
                    </div>
                  ) : formData.image ? (
                    <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-300">
                      <Image className="w-8 h-8 mx-auto" />
                      <span className="text-[9px] font-bold block mt-1">No Image</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-1 space-y-2 w-full">
                  <button
                    type="button"
                    disabled={uploadingMain}
                    onClick={() => mainFileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {uploadingMain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingMain ? 'Uploading…' : 'Upload Main Photo'}
                  </button>
                  <input
                    ref={mainFileInputRef}
                    type="file" accept="image/*" className="hidden"
                    onChange={handleMainImageFileUpload}
                  />
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text" name="image"
                      placeholder="Or paste image URL…"
                      value={formData.image} onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery images */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">Additional Photos (up to 5)</span>
                  <p className="text-[10px] text-slate-500">Customers swipe through these in product view.</p>
                </div>
                {(formData.galleryImages?.length || 0) < 5 && (
                  <button
                    type="button" disabled={uploadingGallery}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photos
                  </button>
                )}
                <input
                  ref={galleryFileInputRef}
                  type="file" accept="image/*" multiple className="hidden"
                  onChange={handleGalleryImageFileUpload}
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {formData.galleryImages?.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl bg-white border border-slate-200 overflow-hidden aspect-square flex items-center justify-center shadow-sm">
                    <img src={img} alt={`Variety ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      <button type="button" onClick={() => handleSetAsMainImage(idx)}
                        className="px-2 py-1 rounded bg-orange-600 text-white text-[9px] font-bold">
                        Set Main
                      </button>
                      <button type="button" onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1 rounded-full bg-red-600 text-white">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Uploading placeholders */}
                {uploadingGallery && (
                  <div className="rounded-xl bg-orange-50 border-2 border-orange-200 aspect-square flex flex-col items-center justify-center gap-1">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    <span className="text-[9px] font-bold text-orange-500">Processing</span>
                  </div>
                )}

                {/* Empty slot trigger */}
                {!uploadingGallery && (formData.galleryImages?.length || 0) < 5 && (
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50/50 rounded-xl aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 transition-all"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold">Add Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Details</label>
            <textarea
              name="description" rows={3}
              placeholder="Describe materials, fit, details…"
              value={formData.description} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Available Sizes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.sizes.map(sz => (
                <span key={sz} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                  {sz}
                  <button type="button" onClick={() => handleRemoveSize(sz)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text" placeholder="e.g. XL, 42"
                value={newSizeInput} onChange={e => setNewSizeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
              <button type="button" onClick={handleAddSize}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
                + Add
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color Variations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button type="button" onClick={() => handleRemoveColor(i)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text" placeholder="Color name e.g. Sunset Orange"
                value={newColorName} onChange={e => setNewColorName(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500 flex-1 min-w-0"
              />
              <input
                type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer shrink-0"
              />
              <button type="button" onClick={handleAddColor}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-orange-600 transition-colors shrink-0">
                + Color
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange}
                className="w-4 h-4 rounded accent-orange-600"
              />
              In Stock & Ready to Sell
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                className="w-4 h-4 rounded accent-orange-600"
              />
              Highlight in Featured Section
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> {editingProduct ? 'Save Changes' : 'Create Product'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
