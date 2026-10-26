document.addEventListener("DOMContentLoaded", () => { 
 const root = document.getElementById("account-content");
    if (!root) return;
    const session = Glow.read(Glow.KEYS.session, null);
    const users = Glow.read(Glow.KEYS.users, []);
    const user = session && users.find(item => item.id === session.userId);
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
    if (!user) { 
        root.innerHTML =
        `<h2>Welcome to GlowCare</h2>
        <p>Sign in or create an account to see your saved order history.</p>
        <div class="inline-actions">
        <a class="button button-primary" href="login.html">Sign In</a>
        <a class="button button-secondary" href="register.html">Create Account</a>
        </div>`;
     return; 
     } 
    const orders = Glow.getOrders().filter(order => order.customer && String(order.customer.email || "").toLowerCase() === user.email); 
    root.innerHTML = `
    <div class="inline-actions" style="
    justify-content:space-between;
    align-items:flex-start">
    <div><span class="eyebrow">Account profile</span>
    <h2>Welcome, ${Glow.escapeHtml(user.name)}</h2>
    <p class="muted">${Glow.escapeHtml(user.email)}</p>
    </div>
    <button class="button button-secondary" id="logout-button">Sign Out</button>
    </div><hr>
    <h2>Your Orders</h2>${orders.length ? orders.map(order => `
        <article class="content-card" style="margin:12px 0">
        <div class="inline-actions" style="justify-content:space-between">
        <strong>${Glow.escapeHtml(order.id)}</strong>
        <strong>${Glow.money(order.total)}</strong></div>
        <p class="small muted">
        ${Glow.escapeHtml(new Date(order.createdAt).toLocaleString()
        )} · ${Glow.escapeHtml(order.status)}
        </p><p>${(order.items || []).map(item => `
            ${Glow.escapeHtml(item.name)} × ${Number(item.qty)}`).join(", ")}
            </p></article>`).join("") : 
            `<div class="empty-state">
            <h3>No orders yet</h3>
            <p>Your placed orders will appear here.</p>
            <a class="button button-primary" href="products.html">Explore Products</a>
    </div>`}`;
    document.getElementById("logout-button").addEventListener("click", () => {
         Glow.write(Glow.KEYS.session, null);
          location.href = "index.html";
         });
     });
