document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const summary = document.getElementById("checkout-summary");
  const message = document.getElementById("checkout-message");
  const items = Glow.cartDetails();
  if (!items.length) {
    form.innerHTML = `<div class="empty-state">
    <h2>Your cart is empty</h2><p>Add products before checkout.</p>
    <a class="button button-primary" href="products.html">Browse Products</a>
    </div>`;
    summary.innerHTML = "";
    return;
  }
  summary.innerHTML = `<h2>Order Summary</h2>${items.map(p => `
    <div class="summary-row"><span>${Glow.escapeHtml(p.name)} × ${p.qty}</span>
    <strong>${Glow.money(p.lineTotal)}
        </strong>
        </div>`).join("")}<hr>
        <div class="summary-row">
        <span>Subtotal</span><strong>${Glow.money(Glow.cartSubtotal())}</strong>
        </div>
          <div class="summary-row"><span>Delivery</span>
          <span>0 AFN</span></div>
          <div class="summary-row summary-total">
          <span>Total</span>
          <strong>${Glow.money(Glow.cartSubtotal())}</strong>
          </div>
          <p class="muted small">Cash on Delivery. Order information is saved in this browser only.
          </p>`;
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const current = Glow.cartDetails();
    if (!current.length || current.some(p => p.qty > p.stock || p.stock <= 0)) {
      Glow.showMessage(message, "One or more products are unavailable. Please review your cart.", "error"); return;
    }
    const data = new FormData(form);
    const order = {
      id: "GC-" + Date.now().toString().slice(-8),
      createdAt: new Date().toISOString(),
      status: "Pending",
      paymentMethod: "Cash on Delivery",
      customer: {
        name: data.get("name"),
        phone: data.get("phone"),
        email: data.get("email"),
        address: data.get("address"),
        city: data.get("city"),
        notes: data.get("notes")
      },
      items: current.map(p => ({
        id: p.id, name: p.name, price: p.price, qty: p.qty, lineTotal: p.lineTotal
      })),
      subtotal: Glow.cartSubtotal(), deliveryFee: 0, total: Glow.cartSubtotal()
    };
    const products = GlowProducts.getProducts();
    const before = JSON.stringify(products);
    current.forEach(item => {
      const product = products.find(p => Number(p.id) === Number(item.id));
      if (product) product.stock = Number(product.stock) - Number(item.qty);
    });
    try {
      GlowProducts.saveProducts(products);
      const orders = Glow.getOrders(); orders.unshift(order);
      if (!Glow.write(Glow.KEYS.orders, orders) || !Glow.write(Glow.KEYS.lastOrder, order))
        throw new Error("Could not save order");
      Glow.saveCart([]);
    } catch (error) {
      try {
        localStorage.setItem("glowcare_products_v1", before);
      } catch { }
      Glow.showMessage(message, "Could not save this order in browser storage. Please try again.", "error"); return;
    }
    location.href = "order-success.html";
  });
});
