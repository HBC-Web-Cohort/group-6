document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("cart-content");
  if (!root) return;
  function render() {
    const items = Glow.cartDetails();
    if (!items.length) {
      root.innerHTML = `
      <div class="empty-state cart-empty">
      <h2>Your cart is empty</h2>
      <p>Find something lovely for your daily routine.</p>
      <a class="button button-primary" href="products.html">Explore Products</a>
      </div>`;
      return;
    }
    root.innerHTML = `
    <div class="table-wrap"><table class="cart-table">
    <thead>
    <tr>
    <th>Product</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
    <th>Action</th>
    </tr>
    </thead>
    <tbody>
      ${items.map(p => `<tr>
        <td>
        <div class="cart-item">
        <img src="${Glow.escapeHtml(p.image)}" alt="${Glow.escapeHtml(p.name)}"
         onerror="this.onerror=null;this.src='https://placehold.co/100x100/e9eee2/38583c?text=Item';"><div><strong>
         ${Glow.escapeHtml(p.name)}</strong>
         <div class="muted small">${p.stock > 0 ? `
          ${p.stock} available` : "Out of stock"}
          </div>
          </div>
          </div>
          </td>
      <td>${Glow.money(p.price)}
      </td>
      <td>
      <div class="quantity-control"><button data-minus="${p.id}" 
      aria-label="Decrease ${Glow.escapeHtml(p.name)}">−
      </button><span>${p.qty}</span>
      <button data-plus="${p.id}" aria-label="Increase ${
        Glow.escapeHtml(p.name)}" ${
          p.qty >= p.stock ? "disabled" : ""}>+</button>
          </div>
          </td>
      <td>
      <strong>${Glow.money(p.lineTotal)}</strong>
      </td>
      <td>
      <button class="button button-danger button-small" data-remove="${p.id}">Remove</button>
      </td>
      </tr>`).join("")}
      </tbody>
      </table>
      </div>
      <div class="cart-summary"><h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><strong>${
        Glow.money(Glow.cartSubtotal())}</strong>
        </div>
        <div class="summary-row"><span>Shipping</span>
        <span>Calculated at checkout</span>
        </div>
        <div class="summary-row summary-total">
        <span>Subtotal</span>
        <strong>${Glow.money(Glow.cartSubtotal())}</strong>
        </div>
        <div class="stack" style="margin-top:18px">
        <a class="button button-primary" href="checkout.html">Proceed to Checkout</a>
        <a class="button button-secondary" href="products.html">Continue Shopping</a>
        </div>
        </div>`;
    root.querySelectorAll("[data-minus]").forEach(btn => btn.addEventListener("click", 
      () => updateQty(btn.dataset.minus, -1)));
    root.querySelectorAll("[data-plus]").forEach(btn => btn.addEventListener("click", 
      () => updateQty(btn.dataset.plus, 1)));
    root.querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", 
      () => { Glow.saveCart(Glow.getCart().filter(i => Number(i.id) !== Number(btn.dataset.remove)));
         render(); }));
  }
  function updateQty(id, delta) {
    const cart = Glow.getCart();
    const item = cart.find(i => Number(i.id) === Number(id));
    const p = Glow.productById(id);
    if (!item || !p) return;
    const next = Number(item.qty) + delta;
    if (next < 1) item.qty = 1;
    else if (next > Number(p.stock)) { 
      Glow.notify("That quantity exceeds available stock.");
       return; }
    else item.qty = next;
    Glow.saveCart(cart); 
    render();
  }
  render();
});
