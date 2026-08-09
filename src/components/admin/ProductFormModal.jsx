import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Image, PlusCircle, Upload, Trash2, Plus } from 'lucide-react';

export const ProductFormModal = ({ isOpen, onClose, editingProduct }) => {
  const { categories, addCategory, addProduct, updateProduct, settings } = useStore();

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: categories[1] || 'Dresses',
    price: '',
    originalPrice: '',
    inStock: true,
    stockQuantity: 10,
    badge: '',
    image: '/assets/silk_evening_gown.jpg',
    galleryImages: [],
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Green', hex: '#065F46' },
      { name: 'Midnight Black', hex: '#0F172A' }
    ],
    featured: false
  });

  const [isCreatingNewCat, setIsCreatingNewCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FF5722');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || categories[1] || 'Dresses',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        stockQuantity: editingProduct.stockQuantity || 10,
        badge: editingProduct.badge || '',
        image: editingProduct.image || '/assets/silk_evening_gown.jpg',
        galleryImages: editingProduct.galleryImages || [],
        description: editingProduct.description || '',
        sizes: editingProduct.sizes || ['S', 'M', 'L'],
        colors: editingProduct.colors || [{ name: 'Black', hex: '#000000' }],
        featured: editingProduct.featured || false
      });
    } else {
      setFormData({
        name: '',
        category: categories[1] || 'Dresses',
        price: '',
        originalPrice: '',
        inStock: true,
        stockQuantity: 10,
        badge: 'New Arrival',
        image: '/assets/silk_evening_gown.jpg',
        galleryImages: [],
        description: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Emerald Green', hex: '#065F46' },
          { name: 'Midnight Black', hex: '#0F172A' }
        ],
        featured: false
      });
    }
    setIsCreatingNewCat(false);
    setCustomCatInput('');
  }, [editingProduct, categories, isOpen]);

  // File Upload Handler for Main Display Image
  const handleMainImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData(prev => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // File Upload Handler for Gallery/Variety Images (Up to 5)
  const handleGalleryImageFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentCount = formData.galleryImages?.length || 0;
    const maxAllowed = 5 - currentCount;
    const filesToProcess = files.slice(0, maxAllowed);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData(prev => {
            const currentList = prev.galleryImages || [];
            if (currentList.length >= 5) return prev;
            return {
              ...prev,
              galleryImages: [...currentList, reader.result]
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index)
    }));
  };

  const handleSetAsMainImage = (index) => {
    const targetImage = formData.galleryImages?.[index];
    if (!targetImage) return;

    const oldMain = formData.image;
    const newGallery = (formData.galleryImages || []).filter((_, i) => i !== index);
    if (oldMain && oldMain !== targetImage) {
      newGallery.push(oldMain);
    }

    setFormData(prev => ({
      ...prev,
      image: targetImage,
      galleryImages: newGallery.slice(0, 5)
    }));
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNewCategoryInline = () => {
    if (!customCatInput.trim()) return;
    const catName = customCatInput.trim();
    addCategory(catName);
    setFormData(prev => ({ ...prev, category: catName }));
    setIsCreatingNewCat(false);
    setCustomCatInput('');
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    if (!formData.sizes.includes(newSizeInput.trim())) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSizeInput.trim()] }));
    }
    setNewSizeInput('');
  };

  const handleRemoveSize = (sz) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== sz) }));
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
    setNewColorHex('#FF5722');
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 animate-fade-in my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="CueMart" className="h-8 w-auto object-contain" />
            <div>
              <h3 className="font-extrabold text-lg">
                {editingProduct ? 'Edit Inventory Item' : 'Add New Product'}
              </h3>
              <p className="text-xs text-slate-400">
                CueMart Merchant Product Management
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Silk Evening Gown"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCat(!isCreatingNewCat)}
                  className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>{isCreatingNewCat ? 'Choose Existing' : '+ New Category'}</span>
                </button>
              </div>

              {isCreatingNewCat ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type new category..."
                    value={customCatInput}
                    onChange={(e) => setCustomCatInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-orange-300 bg-orange-50/30 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategoryInline}
                    className="px-3 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price ({settings.currency}) *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                placeholder="185"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Original/Strikethrough Price ({settings.currency})
              </label>
              <input
                type="number"
                name="originalPrice"
                step="0.01"
                placeholder="230"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                placeholder="10"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Badge & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                name="badge"
                placeholder="Best Seller, Limited Stock, New Arrival..."
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Product Image Upload & Gallery Manager */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Product Image Gallery (Main + Up to 5 Variety Photos)
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload directly from your phone photo gallery or computer files.
                </p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                {1 + (formData.galleryImages?.length || 0)} / 6 Photos
              </span>
            </div>

            {/* Main Image Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Main Display Image (Shown on Storefront Card) *
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-orange-600 bg-white border border-orange-200 px-2 py-0.5 rounded">
                  Primary Cover
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Main Image Preview Box */}
                <div className="relative w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden shrink-0 group flex items-center justify-center">
                  {formData.image ? (
                    <img src={formData.image} alt="Main Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Image className="w-6 h-6 mx-auto" />
                      <span className="text-[10px] font-bold">No Image</span>
                    </div>
                  )}
                </div>

                {/* Upload Action Buttons */}
                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => mainFileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Main Photo from Gallery / Files</span>
                    </button>
                    <input
                      ref={mainFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageFileUpload}
                    />
                  </div>

                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="image"
                      required
                      placeholder="Or paste image URL / asset path..."
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary / Variety Images (Up to 5) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Additional Variety & Angle Photos (Up to 5)
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Customers can click through these photos in the product detail view.
                  </p>
                </div>
                {formData.galleryImages?.length < 5 && (
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery Photo</span>
                  </button>
                )}
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryImageFileUpload}
                />
              </div>

              {/* Gallery Thumbnails List */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                {formData.galleryImages?.map((imgUrl, index) => (
                  <div key={index} className="relative group rounded-xl bg-white border border-slate-200 overflow-hidden aspect-square flex items-center justify-center shadow-xs">
                    <img src={imgUrl} alt={`Variety ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      <button
                        type="button"
                        onClick={() => handleSetAsMainImage(index)}
                        className="px-2 py-1 rounded bg-orange-600 text-white text-[9px] font-bold uppercase"
                        title="Set as main photo"
                      >
                        Set Main
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>
                ))}

                {/* Empty Upload Trigger Card if under 5 images */}
                {formData.galleryImages?.length < 5 && (
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50/50 rounded-xl aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-orange-600 transition-all p-2 text-center"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                    <span className="text-[9px] text-slate-400">({5 - (formData.galleryImages?.length || 0)} left)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Materials & Details
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the product details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Sizes Creator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Available Sizes
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.sizes.map((sz) => (
                <span 
                  key={sz} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
                >
                  {sz}
                  <button type="button" onClick={() => handleRemoveSize(sz)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add size e.g. XL, 42"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-orange-600"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Color Creator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Color Variations
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.colors.map((c, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                >
                  <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                  <button type="button" onClick={() => handleRemoveColor(i)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Color name e.g. Sunset Orange"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-orange-600"
              >
                + Add Color
              </button>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>In Stock & Ready to Sell</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Highlight in Featured Section</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-md"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
