document.addEventListener("DOMContentLoaded", () => {
  const featured = document.getElementById("featured-products");
  if (featured) featured.innerHTML = GlowProducts.getProducts().filter(p => Number(p.stock) > 0).slice(0, 4).map(Glow.renderProductCard).join("");
  const newsletter = document.getElementById("newsletter-form");
  if (newsletter) newsletter.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.getElementById("newsletter-message");
    if (!newsletter.reportValidity()) return;
    const email = document.getElementById("newsletter-email").value.trim().toLowerCase();
    const subscribers = Glow.read(Glow.KEYS.newsletter, []);
    if (subscribers.some(item => item.email === email)) { Glow.showMessage(msg, "This email is already on this browser's subscription list.", "error"); return; }
    subscribers.push({ email, createdAt: new Date().toISOString() });
    if (!Glow.write(Glow.KEYS.newsletter, subscribers)) { Glow.showMessage(msg, "Browser storage is unavailable. Please try again.", "error"); return; }
    Glow.showMessage(msg, "Subscription saved in this browser. No email was sent.");
    newsletter.reset();
  });
});
