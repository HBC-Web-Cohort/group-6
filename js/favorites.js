document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favorites-grid");
  if (!grid) return;
  const empty = document.getElementById("favorites-empty");
  function render() {
    const ids = Glow.getFavorites();
    const products = GlowProducts.getProducts().filter(p => ids.includes(Number(p.id)));
    grid.innerHTML = products.map(Glow.renderProductCard).join("");
    grid.hidden = products.length === 0;
    empty.hidden = products.length !== 0;
  }
  render();
  window.addEventListener("favorites-changed", render);
});
