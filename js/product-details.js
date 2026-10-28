document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("product-detail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = Glow.productById(id);
  if (!p) {
    root.innerHTML = `<div class="empty-state">
    <h2>Product not found</h2>
    <p>We couldn't find that product.</p>
    <a class="button button-primary" href="products.html">Browse Products</a>
    </div>`;
    return;
  }
  const out = Number(p.stock) <= 0;
  root.innerHTML = `<div class="two-column">
  <div class="detail-image"><img src="${Glow.escapeHtml(p.image)}" alt="${Glow.escapeHtml(p.name)}" onerror="this.onerror=null;this.src='https://placehold.co/700x700/e9eee2/38583c?text=GlowCare';"></div>
    <div class="detail-copy">
    <span class="eyebrow">${Glow.escapeHtml(p.category)}</span>
    <h1>${Glow.escapeHtml(p.name)}</h1>
    <p class="muted">${Glow.escapeHtml(p.brand)} · Rating ${Number(p.rating || 0).toFixed(1)}/5</p>
    <div class="price">
    ${Glow.money(p.price)} <small>AFN</small>
    </div>
    <p>${Glow.escapeHtml(p.description)}</p>
    <p>
    <span class="status-pill ${out ? "danger" : ""}">${out ? "Out of Stock" : `
      ${p.stock} available`}
      </span>
      </p>
    <div class="inline-actions"><div class="quantity-control">
    <button id="qty-minus" aria-label="Decrease quantity">−</button>
    <span id="detail-qty">1</span>
    <button id="qty-plus" aria-label="Increase quantity" ${out ? "disabled" : ""}>+</button>
    </div>
    <button class="button button-primary" id="detail-add" ${out ? "disabled" : ""}>${out ? "Out of Stock" : "Add to Cart"}</button>
      <button class="button button-secondary" data-favorite="${p.id}">♡ Favorite</button>
      </div>
    <p class="muted small">Product details and stock are managed in this browser. They are not synchronized with a remote inventory system.
    </p>
    </div>
    </div>`;
  let qty = 1;
  const label = document.getElementById("detail-qty");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1); label.textContent = qty;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qty = Math.min(Number(p.stock), qty + 1); label.textContent = qty;
  });
  document.getElementById("detail-add").addEventListener("click", () => {
    const result = Glow.addToCart(p.id, qty); Glow.notify(result.message);
  });
  const related = document.getElementById("related-products");
  if (related) related.innerHTML = GlowProducts.getProducts().filter(x =>
    x.category === p.category && x.id !== p.id).slice(0, 4).map(Glow.renderProductCard).join("");
});
