/* GlowCare product catalog. Product records are persisted locally in this browser. */
(function () {
  const seed = [
    { id: 101, name: "Aloe Vera Gel", brand: "GlowCare Naturals", category: "Skincare", price: 250, stock: 12, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80", description: "A lightweight gel for a refreshing daily skincare routine.", createdAt: "2026-09-01", rating: 4.7, badge: "Bestseller" },
    { id: 102, name: "Face Toner", brand: "GlowCare Naturals", category: "Skincare", price: 350, stock: 0, image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=80", description: "A refreshing toner for a simple daily skincare routine.", createdAt: "2026-09-02", rating: 4.5, badge: "" },
    { id: 103, name: "Hair Oil", brand: "Root & Bloom", category: "Haircare", price: 400, stock: 8, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80", description: "A nourishing hair oil for your weekly hair-care ritual.", createdAt: "2026-09-03", rating: 4.6, badge: "Popular" },
    { id: 104, name: "Sunscreen", brand: "SunKind", category: "Skincare", price: 500, stock: 5, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80", description: "A daily sun-care essential for your morning routine.", createdAt: "2026-09-04", rating: 4.8, badge: "Essential" },
    { id: 105, name: "Hydrating Serum", brand: "Dewdrop", category: "Skincare", price: 650, stock: 14, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80", description: "A lightweight serum step for a hydrated-feeling routine.", createdAt: "2026-09-05", rating: 4.8, badge: "New" },
    { id: 106, name: "Moisturizing Cream", brand: "GlowCare Naturals", category: "Skincare", price: 550, stock: 9, image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=80", description: "A daily moisturizer to complete your skincare routine.", createdAt: "2026-09-06", rating: 4.6, badge: "" },
    { id: 107, name: "Gentle Face Cleanser", brand: "PureLeaf", category: "Skincare", price: 320, stock: 11, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80", description: "A gentle cleansing step for everyday use.", createdAt: "2026-09-07", rating: 4.4, badge: "" },
    { id: 108, name: "Body Lotion", brand: "Soft Meadow", category: "Body Care", price: 420, stock: 7, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80", description: "A comforting body lotion for a simple self-care routine.", createdAt: "2026-09-08", rating: 4.3, badge: "" },
    { id: 109, name: "Hand Cream", brand: "Soft Meadow", category: "Body Care", price: 280, stock: 16, image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=80", description: "A compact hand-care essential for daily use.", createdAt: "2026-09-09", rating: 4.2, badge: "" },
    { id: 110, name: "Wide-Tooth Comb", brand: "Root & Bloom", category: "Beauty Accessories", price: 180, stock: 20, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80", description: "A simple accessory for your everyday hair-care routine.", createdAt: "2026-09-10", rating: 4.1, badge: "" },
    { id: 111, name: "Clay Face Mask", brand: "PureLeaf", category: "Skincare", price: 450, stock: 6, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80", description: "A weekly mask option for a relaxing at-home skincare ritual.", createdAt: "2026-09-11", rating: 4.5, badge: "" },
    { id: 112, name: "Beauty Headband", brand: "GlowCare Tools", category: "Beauty Accessories", price: 150, stock: 18, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80", description: "A soft accessory to keep hair away while doing skincare.", createdAt: "2026-09-12", rating: 4.0, badge: "Value" }
  ];
  const STORAGE_KEY = "glowcare_products_v1";
  function safeParse(value, fallback) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
  function normalizeProducts(items) { return items.map((p, index) => ({ slug: String(p.name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), gallery: [p.image].filter(Boolean), featured: index < 4, bestseller: Boolean(p.badge && /best|popular/i.test(p.badge)), ...p })); }
  function getProducts() {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
    return Array.isArray(saved) && saved.length ? normalizeProducts(saved) : normalizeProducts(seed);
  }
  function saveProducts(products) { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProducts(products))); }
  function resetProducts() { saveProducts(seed.slice()); return getProducts(); }
  window.GlowProducts = { seed, getProducts, saveProducts, resetProducts };
})();
