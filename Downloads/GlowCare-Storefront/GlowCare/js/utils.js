(function () {
  const KEYS = { cart: "glowcare_cart_v1", favorites: "glowcare_favorites_v1", orders: "glowcare_orders_v1", lastOrder: "glowcare_last_order_v1", session: "glowcare_session_v1", users: "glowcare_users_v1", newsletter: "glowcare_newsletter_v1", messages: "glowcare_contact_messages_v1" };
  function read(key, fallback) { try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { console.error("GlowCare storage write failed", error); return false; } }
  function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "AFN", maximumFractionDigits: 0 }).format(Number(value) || 0).replace("AFN", "AFN"); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function getCart() { const value = read(KEYS.cart, []); return Array.isArray(value) ? value : []; }
  function saveCart(cart) { write(KEYS.cart, cart); updateHeaderCounts(); window.dispatchEvent(new Event("glowcare-storage-change")); }
  function getFavorites() { const value = read(KEYS.favorites, []); return Array.isArray(value) ? value.map(Number) : []; }
  function saveFavorites(ids) { write(KEYS.favorites, [...new Set(ids.map(Number))]); updateHeaderCounts(); window.dispatchEvent(new Event("glowcare-storage-change")); }
  function getOrders() { const value = read(KEYS.orders, []); return Array.isArray(value) ? value : []; }
  function saveOrders(orders) { return write(KEYS.orders, orders); }
  function getCartCount() { return getCart().reduce((n, item) => n + (Number(item.qty) || 0), 0); }
  function updateHeaderCounts() {
    document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = getCartCount());
    document.querySelectorAll("[data-favorites-count]").forEach(el => el.textContent = getFavorites().length);
  }
  function productById(id) { return GlowProducts.getProducts().find(p => Number(p.id) === Number(id)); }
  function addToCart(id, qty = 1) {
    const product = productById(id);
    if (!product) return { ok: false, message: "This product could not be found." };
    if (Number(product.stock) <= 0) return { ok: false, message: "This product is out of stock." };
    const cart = getCart();
    const existing = cart.find(item => Number(item.id) === Number(id));
    const nextQty = (existing ? Number(existing.qty) : 0) + Number(qty);
    if (!Number.isInteger(nextQty) || nextQty < 1 || nextQty > Number(product.stock)) return { ok: false, message: `Only ${product.stock} item(s) are currently available.` };
    if (existing) existing.qty = nextQty; else cart.push({ id: Number(id), qty: Number(qty) });
    saveCart(cart);
    return { ok: true, message: `${product.name} added to your cart.` };
  }
  function toggleFavorite(id) {
    const ids = getFavorites();
    const exists = ids.includes(Number(id));
    saveFavorites(exists ? ids.filter(x => x !== Number(id)) : [...ids, Number(id)]);
    return !exists;
  }
  function cartDetails() {
    const products = GlowProducts.getProducts();
    const cart = getCart();
    return cart.map(item => {
      const product = products.find(p => Number(p.id) === Number(item.id));
      return product ? { ...product, qty: Math.max(1, Number(item.qty) || 1), lineTotal: product.price * Math.max(1, Number(item.qty) || 1) } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() { return cartDetails().reduce((sum, p) => sum + p.lineTotal, 0); }
  function showMessage(target, message, type = "success") {
    if (!target) return;
    target.textContent = message;
    target.className = type === "error" ? "form-message" : "form-message";
    target.style.background = type === "error" ? "#fff0ef" : "#e9f2e5";
    target.style.color = type === "error" ? "#a83d3d" : "#263b2b";
    target.hidden = false;
  }
  function renderProductCard(product) {
    const favorite = getFavorites().includes(Number(product.id));
    const out = Number(product.stock) <= 0;
    const image = escapeHtml(product.image || "");
    return `<article class="product-card">
      <div class="product-image"><img src="${image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x600/e9eee2/38583c?text=GlowCare';">
      ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
      ${out ? '<span class="product-badge out">Out of Stock</span>' : ""}
      <button class="favorite-toggle ${favorite ? "is-favorite" : ""}" data-favorite="${Number(product.id)}" aria-label="${favorite ? "Remove from" : "Add to"} favorites">${favorite ? "♥" : "♡"}</button></div>
      <div class="product-info"><div class="product-brand">${escapeHtml(product.brand)}</div>
      <h3><a href="product-details.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
      <div class="product-price">${money(product.price)} <small>AFN</small></div>
      <div class="product-actions"><a class="button button-secondary" href="product-details.html?id=${encodeURIComponent(product.id)}">View Details</a>
      <button class="button button-primary" data-add-cart="${Number(product.id)}" ${out ? "disabled aria-disabled='true'" : ""}>${out ? "Out of Stock" : "Add to Cart"}</button></div></div></article>`;
  }
  function notify(message) {
    let box = document.getElementById("global-notice");
    if (!box) { box = document.createElement("div"); box.id = "global-notice"; box.setAttribute("role", "status"); box.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:100;background:#263b2b;color:white;padding:13px 18px;border-radius:12px;box-shadow:0 8px 30px #0002;max-width:min(90vw,360px)"; document.body.appendChild(box); }
    box.textContent = message;
    box.hidden = false;
    clearTimeout(box._timer);
    box._timer = setTimeout(() => { box.hidden = true; }, 2600);
  }
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add-cart]");
    if (add) { const result = addToCart(add.dataset.addCart); notify(result.message); if (result.ok) updateHeaderCounts(); }
    const fav = event.target.closest("[data-favorite]");
    if (fav) { const on = toggleFavorite(fav.dataset.favorite); fav.classList.toggle("is-favorite", on); fav.textContent = on ? "♥" : "♡"; fav.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites"); notify(on ? "Added to favorites." : "Removed from favorites."); updateHeaderCounts(); if (document.body.dataset.page === "favorites") window.dispatchEvent(new Event("favorites-changed")); }
  });
  window.Glow = { KEYS, read, write, money, escapeHtml, getCart, saveCart, getFavorites, saveFavorites, getOrders, saveOrders, getCartCount, updateHeaderCounts, productById, addToCart, toggleFavorite, cartDetails, cartSubtotal, showMessage, renderProductCard, notify };
  document.addEventListener("DOMContentLoaded", updateHeaderCounts);
})();
