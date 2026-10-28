# GlowCare Manual Test Checklist

- [ ] Main navigation and all footer links open valid pages.
- [ ] Mobile menu toggles and exposes correct expanded state.
- [ ] Product search checks name, brand, category, and description.
- [ ] Category, brand, price, stock, and sort filters combine correctly.
- [ ] Empty results show a useful empty state.
- [ ] Product detail links open the selected product and handle invalid IDs.
- [ ] Out-of-stock products cannot be added to cart.
- [ ] Cart quantity cannot exceed current stock.
- [ ] Cart and favorites persist after refresh.
- [ ] Duplicate registration emails are rejected.
- [ ] Login rejects incorrect credentials.
- [ ] Checkout requires valid customer details.
- [ ] Successful checkout saves an order, reduces stock, and clears the cart.
- [ ] Order confirmation and account order history show the same order.
- [ ] Admin product CRUD persists after refresh.
- [ ] Contact and newsletter records persist locally.
- [ ] Missing/broken product images show a fallback.
- [ ] Layout works on mobile, tablet, and desktop.
- [ ] LocalStorage corruption or quota errors do not crash the whole page.

Note: these are manual checks to perform. Do not mark a check as passed unless you have actually tested it in a browser.
