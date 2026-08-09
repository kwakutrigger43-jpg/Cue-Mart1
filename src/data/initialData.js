export const initialStoreSettings = {
  storeName: "CueMart",
  tagline: "Everything You Need, Delivered.",
  whatsappNumber: "2348123456789", // Default merchant WhatsApp number (with country code)
  currency: "$",
  announcement: "🛒 Welcome to CueMart! Enjoy express delivery on all orders | Direct WhatsApp Checkout",
  contactEmail: "orders@cuemart.com",
  instagram: "@cuemart_official",
  address: "14 Fashion Boulevard, Victoria Island",
  shopLocation: "", // Google Maps query string — fill in from Settings to activate the Get Directions button
  description: "Welcome to CueMart - Your premier online shopping destination. Discover curated fashion, premium accessories, gold jewelry, and lifestyle products delivered right to your doorstep.",
  adminPin: "1234" // Default PIN - change this from the Admin Settings panel
};

export const initialCategories = [
  "All",
  "Dresses",
  "Outerwear",
  "Handbags",
  "Jewelry",
  "Footwear"
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Emerald Silk Evening Gown",
    category: "Dresses",
    price: 185,
    originalPrice: 230,
    inStock: true,
    stockQuantity: 12,
    badge: "Best Seller",
    rating: 4.9,
    image: "/assets/silk_evening_gown.jpg",
    galleryImages: [
      "/assets/silk_evening_gown.jpg",
      "/assets/tailored_blazer.jpg"
    ],
    description: "Flowing floor-length evening gown tailored from pure mulberry silk. Features a subtle cowl neckline, open back design, and a flattering slitted side detail.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Emerald Green", hex: "#065F46" },
      { name: "Midnight Black", hex: "#0F172A" },
      { name: "Orange Harvest", hex: "#FF5722" }
    ],
    featured: true,
    createdAt: "2026-07-01T10:00:00.000Z"
  },
  {
    id: "prod-2",
    name: "Artisanal Cream Leather Handbag",
    category: "Handbags",
    price: 140,
    originalPrice: 175,
    inStock: true,
    stockQuantity: 8,
    badge: "New Arrival",
    rating: 5.0,
    image: "/assets/leather_bag.jpg",
    galleryImages: [
      "/assets/leather_bag.jpg",
      "/assets/gold_necklace.jpg"
    ],
    description: "Handcrafted from full-grain Italian leather with gold-plated hardware. Features a detachable chain strap, secure magnetic closure, and multiple interior pockets.",
    sizes: ["One Size"],
    colors: [
      { name: "Cream White", hex: "#FDFBF7" },
      { name: "Caramel Brown", hex: "#92400E" },
      { name: "Onyx Black", hex: "#18181B" }
    ],
    featured: true,
    createdAt: "2026-07-05T14:30:00.000Z"
  },
  {
    id: "prod-3",
    name: "Double-Breasted Beige Blazer",
    category: "Outerwear",
    price: 165,
    originalPrice: 195,
    inStock: true,
    stockQuantity: 15,
    badge: "Trending",
    rating: 4.8,
    image: "/assets/tailored_blazer.jpg",
    galleryImages: [
      "/assets/tailored_blazer.jpg",
      "/assets/silk_evening_gown.jpg"
    ],
    description: "Sharp tailored blazer crafted from breathable wool-linen blend. Structure padded shoulders, tortoiseshell buttons, and full silk lining.",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Warm Beige", hex: "#D6C7B2" },
      { name: "Ivory", hex: "#F5F5F0" },
      { name: "Navy Blue", hex: "#1E293B" }
    ],
    featured: true,
    createdAt: "2026-07-10T09:15:00.000Z"
  },
  {
    id: "prod-4",
    name: "18K Gold Solstice Pendant Necklace",
    category: "Jewelry",
    price: 95,
    originalPrice: 120,
    inStock: true,
    stockQuantity: 20,
    badge: "Popular",
    rating: 4.9,
    image: "/assets/gold_necklace.jpg",
    galleryImages: [
      "/assets/gold_necklace.jpg",
      "/assets/designer_heels.jpg"
    ],
    description: "Tarnish-free 18k solid gold plated pendant necklace with micro-pave crystal center. Adjustable 18-20 inch delicate link chain.",
    sizes: ["Adjustable"],
    colors: [
      { name: "Yellow Gold", hex: "#EAB308" },
      { name: "Rose Gold", hex: "#FB7185" }
    ],
    featured: false,
    createdAt: "2026-07-12T11:20:00.000Z"
  },
  {
    id: "prod-5",
    name: "Noir Pointed Stiletto Heels",
    category: "Footwear",
    price: 130,
    originalPrice: 150,
    inStock: true,
    stockQuantity: 6,
    badge: "Limited Stock",
    rating: 4.7,
    image: "/assets/designer_heels.jpg",
    galleryImages: [
      "/assets/designer_heels.jpg",
      "/assets/leather_bag.jpg"
    ],
    description: "Classic pointed-toe stiletto pumps featuring genuine leather upper, cushioned memory-foam footbed, and polished gold buckle accent. 90mm heel height.",
    sizes: ["37", "38", "39", "40", "41"],
    colors: [
      { name: "Nero Black", hex: "#09090B" },
      { name: "Nude Rose", hex: "#E0A996" }
    ],
    featured: true,
    createdAt: "2026-07-15T16:45:00.000Z"
  }
];

export const initialOrders = [
  {
    id: "ORD-9821",
    customerName: "Sophia Martinez",
    customerPhone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Apt 4B, Springfield",
    notes: "Please deliver before 4 PM or leave with security.",
    items: [
      { id: "prod-1", name: "Emerald Silk Evening Gown", size: "M", color: "Emerald Green", price: 185, quantity: 1 },
      { id: "prod-4", name: "18K Gold Solstice Pendant Necklace", size: "Adjustable", color: "Yellow Gold", price: 95, quantity: 1 }
    ],
    total: 280,
    status: "Dispatched to WhatsApp",
    date: "2026-07-20T14:22:00.000Z"
  },
  {
    id: "ORD-9820",
    customerName: "Amara Chukwu",
    customerPhone: "+234 803 111 2233",
    address: "Block 5, Admiralty Way, Lekki Phase 1, Lagos",
    notes: "Call when nearby.",
    items: [
      { id: "prod-2", name: "Artisanal Cream Leather Handbag", size: "One Size", color: "Cream White", price: 140, quantity: 1 }
    ],
    total: 140,
    status: "Completed",
    date: "2026-07-19T09:10:00.000Z"
  }
];
