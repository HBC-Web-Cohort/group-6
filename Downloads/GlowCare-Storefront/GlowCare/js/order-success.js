document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("order-confirmation");
  if (!root) return;
  const order = Glow.read(Glow.KEYS.lastOrder, null);
  if (!order) {
    root.innerHTML = `<div class="empty-state">
    <h2>No recent order found</h2>
    <p>Place an order to see a confirmation here.</p>
    <a class="button button-primary" href="products.html">Browse Products</a>
    </div>`;
    return;
  }
  root.innerHTML = `
  <div class="content-card" style="max-width:760px;margin:auto;text-align:center">
  <div style="font-size:3rem">✓</div>
  <span class="eyebrow">Order received</span><h1>Thank you, 
  ${Glow.escapeHtml(order.customer.name)}!</h1>
  <p>Your order reference is <strong>$
  {Glow.escapeHtml(order.id)}</strong>.</p>
  <p class="muted">This order is saved in this browser only.
   It has not been sent to a server or delivery service.</p><hr>
   <div style="text-align:left"><h2>Order Summary</h2>${order.items.map(p => `
      <div class="summary-row"><span>${Glow.escapeHtml(p.name)} × ${p.qty}</span>
      <strong>${Glow.money(p.lineTotal)}</strong>
      </div>`).join("")}
      <div class="summary-row summary-total"><span>Total</span>
      <strong>${Glow.money(order.total)}</strong></div>
      </div>
      <a class="button button-primary" href="products.html" style="margin-top:20px">Continue Shopping</a>
      </div>`;
});
