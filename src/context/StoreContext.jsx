import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection, doc, onSnapshot, setDoc, addDoc,
  updateDoc, deleteDoc, query, orderBy
} from 'firebase/firestore';
import { initialCategories, initialStoreSettings } from '../data/initialData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Mode state
  const [viewMode, setViewMode] = useState('store');

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Loading state (while Firestore first loads)
  const [isLoading, setIsLoading] = useState(true);

  // ── Firestore-synced state ──────────────────────────────────────────────
  const [settings, setSettings] = useState(initialStoreSettings);
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // ── Device-local state (intentionally NOT synced — per device) ──────────
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cue_cart') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cue_wishlist') || '[]'); } catch { return []; }
  });

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // UI drawers & modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // ── Firestore real-time listeners ───────────────────────────────────────

  // Store settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'settings'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data());
      } else {
        // Seed defaults on first run
        setDoc(doc(db, 'config', 'settings'), initialStoreSettings).catch(console.error);
      }
    }, console.error);
    return unsub;
  }, []);

  // Categories
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'categories'), (snap) => {
      if (snap.exists()) {
        setCategories(snap.data().list || initialCategories);
      } else {
        setDoc(doc(db, 'config', 'categories'), { list: initialCategories }).catch(console.error);
      }
    }, console.error);
    return unsub;
  }, []);

  // Products — real-time listener (cross-device sync happens here)
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(prods);
      setIsLoading(false);
    }, (err) => {
      console.error('Products listener:', err);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // Orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);
    return unsub;
  }, []);

  // Persist cart & wishlist locally (device-specific by design)
  useEffect(() => { localStorage.setItem('cue_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('cue_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // ── Toast helper ────────────────────────────────────────────────────────
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Admin Auth ──────────────────────────────────────────────────────────
  const adminLogin = (enteredPin) => {
    const correctPin = settings.adminPin || '1234';
    if (enteredPin === correctPin) {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setViewMode('admin');
      showToast('Welcome back, Admin! 👋');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setViewMode('store');
    showToast('Logged out of Admin Portal.');
  };

  const requestAdminView = () => {
    if (isAdminAuthenticated) setViewMode('admin');
    else setShowAdminLogin(true);
  };

  // ── Product CRUD (Firestore → all admins see changes instantly) ─────────
  const addProduct = async (newProd) => {
    try {
      const payload = {
        ...newProd,
        rating: 5.0,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'products'), payload);
      showToast(`"${newProd.name}" added successfully!`);
    } catch (err) {
      console.error('addProduct error:', err);
      showToast('Error saving product. Please try again.');
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await updateDoc(doc(db, 'products', id), updatedFields);
      showToast('Product updated successfully.');
    } catch (err) {
      console.error('updateProduct error:', err);
      showToast('Error updating product.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setCart(prev => prev.filter(item => item.product.id !== id));
      showToast('Product deleted.');
    } catch (err) {
      console.error('deleteProduct error:', err);
    }
  };

  const toggleStock = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newStock = !prod.inStock;
    try {
      await updateDoc(doc(db, 'products', id), { inStock: newStock });
      showToast(`${prod.name} is now ${newStock ? 'In Stock' : 'Out of Stock'}.`);
    } catch (err) {
      console.error('toggleStock error:', err);
    }
  };

  // ── Settings (Firestore) ────────────────────────────────────────────────
  const updateSettings = async (newSettings) => {
    try {
      await setDoc(doc(db, 'config', 'settings'), { ...settings, ...newSettings }, { merge: true });
      showToast('Store settings saved!');
    } catch (err) {
      console.error('updateSettings error:', err);
    }
  };

  // ── Category CRUD (Firestore) ───────────────────────────────────────────
  const addCategory = async (catName) => {
    if (!catName || categories.includes(catName)) return;
    const newList = [...categories, catName];
    try {
      await setDoc(doc(db, 'config', 'categories'), { list: newList });
      showToast(`Category "${catName}" added.`);
    } catch (err) { console.error(err); }
  };

  const deleteCategory = async (catName) => {
    if (catName === 'All') return;
    const newList = categories.filter(c => c !== catName);
    try {
      await setDoc(doc(db, 'config', 'categories'), { list: newList });
      if (activeCategory === catName) setActiveCategory('All');
      showToast(`Category "${catName}" deleted.`);
    } catch (err) { console.error(err); }
  };

  // ── Cart (local-only, per device) ───────────────────────────────────────
  const addToCart = (product, size, color, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color?.name || color}`;
    setCart(prev => {
      const idx = prev.findIndex(i => i.cartItemId === cartItemId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, {
        cartItemId,
        product,
        size: size || product.sizes?.[0] || 'Standard',
        color: color ? (color.name || color) : (product.colors?.[0]?.name || 'Default'),
        quantity
      }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId !== cartItemId) return item;
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
    showToast('Item removed from cart');
  };

  const clearCart = () => setCart([]);

  // ── Wishlist (local-only) ───────────────────────────────────────────────
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      showToast(exists ? 'Removed from wishlist' : 'Added to wishlist ❤️');
      return exists ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  };

  // ── WhatsApp Checkout ───────────────────────────────────────────────────
  const checkoutViaWhatsApp = async (customerDetails, singleItem = null) => {
    const { name, phone, address, notes } = customerDetails;
    const cleanPhone = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

    const itemsToOrder = singleItem ? [{
      id: singleItem.product.id,
      name: singleItem.product.name,
      size: singleItem.size,
      color: singleItem.color,
      price: singleItem.product.price,
      quantity: singleItem.quantity
    }] : cart.map(i => ({
      id: i.product.id,
      name: i.product.name,
      size: i.size,
      color: i.color,
      price: i.product.price,
      quantity: i.quantity
    }));

    const totalAmount = itemsToOrder.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);

    let itemDetailsText = '';
    itemsToOrder.forEach((item, idx) => {
      itemDetailsText += `${idx + 1}. *${item.name}*\n`;
      itemDetailsText += `   • Size: ${item.size} | Color: ${item.color}\n`;
      itemDetailsText += `   • Qty: ${item.quantity} x ${settings.currency}${Number(item.price).toLocaleString()} = *${settings.currency}${(Number(item.price) * item.quantity).toLocaleString()}*\n\n`;
    });

    const orderMsg =
`🛍️ *NEW ORDER - ${(settings.storeName || 'CUEMART').toUpperCase()}*
---------------------------------------
👤 *Customer Name:* ${name}
📞 *Customer Phone:* ${phone}
📍 *Delivery Address:* ${address}
${notes ? `📝 *Notes:* ${notes}\n` : ''}---------------------------------------
📦 *ORDER SUMMARY:*

${itemDetailsText}---------------------------------------
💰 *TOTAL AMOUNT:* *${settings.currency}${totalAmount.toLocaleString()}*

Thank you! Please confirm item availability and delivery time.`;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerPhone: phone,
      address,
      notes: notes || 'N/A',
      items: itemsToOrder,
      total: totalAmount,
      status: 'Dispatched to WhatsApp',
      date: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'orders'), newOrder);
    } catch (err) { console.error('Order save error:', err); }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMsg)}`, '_blank');
    if (!singleItem) clearCart();
    setIsCartOpen(false);
    showToast('Opening WhatsApp with your order receipt! 🎉');
  };

  // ── Filtered & Sorted Products ──────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const cat = p?.category || '';
    const name = p?.name || '';
    const desc = p?.description || '';
    const matchCat = activeCategory === 'All' || cat.toLowerCase() === activeCategory.toLowerCase();
    const q = (searchQuery || '').toLowerCase();
    const matchSearch = !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortOption === 'price-low') return (Number(a?.price) || 0) - (Number(b?.price) || 0);
    if (sortOption === 'price-high') return (Number(b?.price) || 0) - (Number(a?.price) || 0);
    if (sortOption === 'newest') return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    return (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0);
  });

  return (
    <StoreContext.Provider value={{
      viewMode,
      setViewMode: (mode) => {
        if (mode === 'admin') {
          if (isAdminAuthenticated) setViewMode('admin');
          else setShowAdminLogin(true);
        } else {
          setViewMode(mode);
        }
      },
      isAdminAuthenticated,
      showAdminLogin, setShowAdminLogin,
      adminLogin, adminLogout, requestAdminView,
      settings, updateSettings,
      categories, addCategory, deleteCategory,
      products, filteredProducts, addProduct, updateProduct, deleteProduct, toggleStock,
      orders,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
      wishlist, toggleWishlist,
      activeCategory, setActiveCategory,
      searchQuery, setSearchQuery,
      sortOption, setSortOption,
      isCartOpen, setIsCartOpen,
      isWishlistOpen, setIsWishlistOpen,
      selectedProductModal, setSelectedProductModal,
      checkoutViaWhatsApp,
      toastMessage, showToast,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
