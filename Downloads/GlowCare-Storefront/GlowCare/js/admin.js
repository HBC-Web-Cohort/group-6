document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-product-form");
  if (!form) return;
  const list = document.getElementById("admin-products");
  const ordersRoot = document.getElementById("admin-orders");
  const stats = document.getElementById("admin-stats");
  const msg = document.getElementById("admin-message");
  const idField = form.elements.id;
  function render() {
    const products = GlowProducts.getProducts();
    const orders = Glow.getOrders();
    stats.innerHTML = `
    <div class="stat-card"><span class="muted">Products</span><strong>${products.length}
    </strong>
    </div>
    <div class="stat-card"><span class="muted">Orders</span>
    <strong>${orders.length}</strong>
    </div>
    <div class="stat-card"><span class="muted">Order Value</span>
    <strong>${Glow.money(orders.reduce((s,o)=>s+(Number(o.total)||0),0))}</strong>
    </div>`;
    list.innerHTML = products.map(p => `
      <tr><td>${p.id}</td>
      <td>${Glow.escapeHtml(p.name)}</td>
      <td>${Glow.escapeHtml(p.category)}</td>
      <td>${Glow.money(p.price)}</td>
      <td>${p.stock}</td>
      <td>
      <button class="button button-secondary button-small" data-edit="${p.id}">Edit</button>
       <button class="button button-danger button-small" data-delete="${p.id}">Delete</button>
       </td>
       </tr>`).join("");
    ordersRoot.innerHTML = orders.length ? orders.map(o => `
      <div class="content-card" style="margin-bottom:12px">
      <div class="inline-actions" style="justify-content:space-between">
      <strong>${Glow.escapeHtml(o.id)} · ${Glow.escapeHtml(o.customer.name)}</strong>
      <span class="status-pill">${Glow.money(o.total)}</span>
      </div><p class="muted small">${Glow.escapeHtml(new Date(o.createdAt).toLocaleString())} · ${Glow.escapeHtml(o.status)}</p>
      <p class="small">${o.items.map(i=>`${Glow.escapeHtml(i.name)} × ${i.qty}`).join(", ")}</p></div>`).join("") : `
      <p class="muted">No orders yet.</p>`;
  }
  function clearForm() { form.reset();
     idField.readOnly = false; 
     document.getElementById("admin-form-title").textContent = "Add Product"; }
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const products = GlowProducts.getProducts();
    const product = { id: Number(data.get("id")),
       name: String(data.get("name")).trim(), 
       brand: String(data.get("brand")).trim(),
        category: String(data.get("category")),
         price: Number(data.get("price")), 
         stock: Number(data.get("stock")), 
         image: String(data.get("image")).trim() || "https://placehold.co/600x600/e9eee2/38583c?text=GlowCare",
          description: String(data.get("description")).trim(), 
          createdAt: new Date().toISOString().slice(0,10),
           rating: 4.2, badge: "" 
      };
    if (![product.id, 
      product.price, 
      product.stock].every(Number.isFinite) || product.id < 1 || product.price < 0 || product.stock < 0) 
      { Glow.showMessage(msg, "Check the ID, price, and stock values.", "error"); 
        return; 
      }
    const existing = products.findIndex(p => Number(p.id) === product.id);
    if (existing >= 0) {
      if (!idField.readOnly) { 
        Glow.showMessage(msg,
           "That product ID already exists. Use a unique ID or edit an existing product.",
           "error");
       return; }
      products[existing] = product;
    } else products.push(product);
    GlowProducts.saveProducts(products); clearForm(); render(); Glow.showMessage(msg, "Product saved to this browser's catalog.");
  });
  list.addEventListener("click", e => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-delete]");
    const products = GlowProducts.getProducts();
    if (edit) {
      const p = products.find(x => Number(x.id) === Number(edit.dataset.edit)); if (!p) return;
      for (const key of ["id","name","brand","category","price","stock","image","description"]) form.elements[key].value = p[key] ?? "";
      idField.readOnly = true; document.getElementById("admin-form-title").textContent = "Edit Product"; form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (del) {
      const id = Number(del.dataset.delete);
      if (!confirm("Delete this product from the catalog?")) return;
      GlowProducts.saveProducts(products.filter(p => Number(p.id) !== id));
      Glow.saveCart(Glow.getCart().filter(i => Number(i.id) !== id));
      Glow.saveFavorites(Glow.getFavorites().filter(x => Number(x) !== id));
      render();
    }
  });
  document.getElementById("admin-clear-form").addEventListener("click", clearForm);
  document.getElementById("admin-reset").addEventListener("click", () => {
    if (!confirm("Reset the product catalog and clear local orders, cart, and favorites?")) return;
    GlowProducts.resetProducts(); Glow.saveOrders([]); Glow.saveCart([]); Glow.saveFavorites([]); Glow.write(Glow.KEYS.lastOrder, null); render(); clearForm(); Glow.showMessage(msg, "Local store data has been reset.");
  });
  render();
});
