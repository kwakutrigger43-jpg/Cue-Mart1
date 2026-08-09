import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialCategories, initialStoreSettings, initialOrders } from '../data/initialData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Mode state: 'store' or 'admin' — always starts on 'store' for security
  const [viewMode, setViewMode] = useState('store');

  // Admin Authentication state — session cleared on every page load
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cue_settings');
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  // Categories state
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cue_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Products state
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('cue_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Orders log state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cue_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Cart state: [{ cartItemId, product, size, color, quantity }]
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cue_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state: array of product IDs
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('cue_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('cue_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('cue_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cue_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cue_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cue_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cue_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cue_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Admin Login / Logout
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

  // Intercept setViewMode to require auth when switching to admin
  const requestAdminView = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  // Toast notification helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Product Management (Admin CRUD)
  const addProduct = (newProd) => {
    const createdProduct = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [createdProduct, ...prev]);
    showToast(`"${createdProduct.name}" added successfully!`);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast(`Product updated successfully.`);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    showToast(`Product deleted.`);
  };

  const toggleStock = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = !p.inStock;
        showToast(`${p.name} is now ${newStock ? 'In Stock' : 'Out of Stock'}.`);
        return { ...p, inStock: newStock };
      }
      return p;
    }));
  };

  // Settings Management
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Store settings saved!");
  };

  // Category Management
  const addCategory = (catName) => {
    if (!catName || categories.includes(catName)) return;
    setCategories(prev => [...prev, catName]);
    showToast(`Category "${catName}" added.`);
  };

  const deleteCategory = (catName) => {
    if (catName === "All") return;
    setCategories(prev => prev.filter(c => c !== catName));
    if (activeCategory === catName) setActiveCategory("All");
    showToast(`Category "${catName}" deleted.`);
  };

  // Cart Functions
  const addToCart = (product, size, color, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color.name || color}`;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          cartItemId,
          product,
          size: size || (product.sizes && product.sizes[0]) || "Standard",
          color: color ? (color.name || color) : (product.colors && product.colors[0]?.name) || "Default",
          quantity
        }];
      }
    });

    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  // WhatsApp Order Generator
  const checkoutViaWhatsApp = (customerDetails) => {
    const { name, phone, address, notes } = customerDetails;
    
    // Clean phone number format for WhatsApp api
    const cleanMerchantPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Build line items text
    let itemDetailsText = "";
    cart.forEach((item, index) => {
      itemDetailsText += `${index + 1}. *${item.product.name}*\n`;
      itemDetailsText += `   • Size: ${item.size} | Color: ${item.color}\n`;
      itemDetailsText += `   • Qty: ${item.quantity} x ${settings.currency}${item.product.price.toLocaleString()} = *${settings.currency}${(item.product.price * item.quantity).toLocaleString()}*\n\n`;
    });

    // Build formatted message
    const orderMsg = 
`🛍️ *NEW ORDER - ${settings.storeName.toUpperCase()}*
---------------------------------------
👤 *Customer Name:* ${name}
📞 *Customer Phone:* ${phone}
📍 *Delivery Address:* ${address}
${notes ? `📝 *Notes:* ${notes}\n` : ''}---------------------------------------
📦 *ORDER SUMMARY:*

${itemDetailsText}---------------------------------------
💰 *TOTAL AMOUNT:* *${settings.currency}${cartTotal.toLocaleString()}*

Thank you! Please confirm item availability and delivery time.`;

    const encodedMsg = encodeURIComponent(orderMsg);
    const whatsappUrl = `https://wa.me/${cleanMerchantPhone}?text=${encodedMsg}`;

    // Record order dispatch log in local state
    const newOrderRecord = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerPhone: phone,
      address,
      notes: notes || "N/A",
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        size: i.size,
        color: i.color,
        price: i.product.price,
        quantity: i.quantity
      })),
      total: cartTotal,
      status: "Dispatched to WhatsApp",
      date: new Date().toISOString()
    };

    setOrders(prev => [newOrderRecord, ...prev]);

    // Open WhatsApp URL in new window/tab
    window.open(whatsappUrl, '_blank');

    // Reset Cart & Close Drawer
    clearCart();
    setIsCartOpen(false);
    showToast("Opening WhatsApp with your order receipt! 🎉");
  };

  // Filtered & Sorted products computation
  const filteredProducts = products.filter(p => {
    const pCategory = p?.category || "";
    const pName = p?.name || "";
    const pDesc = p?.description || "";
    
    const matchesCategory = activeCategory === "All" || pCategory.toLowerCase() === activeCategory.toLowerCase();
    const query = (searchQuery || "").toLowerCase();
    const matchesSearch = query === "" || 
      pName.toLowerCase().includes(query) || 
      pDesc.toLowerCase().includes(query) ||
      pCategory.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const priceA = Number(a?.price) || 0;
    const priceB = Number(b?.price) || 0;
    if (sortOption === "price-low") return priceA - priceB;
    if (sortOption === "price-high") return priceB - priceA;
    if (sortOption === "newest") return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    return ((b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
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
      adminLogin, adminLogout,
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
      toastMessage, showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
