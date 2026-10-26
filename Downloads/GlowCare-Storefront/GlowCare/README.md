# GlowCare — Premium Skincare Storefront

A multi-page skincare storefront built with HTML5, CSS3, and vanilla JavaScript. It uses browser LocalStorage for catalog edits, cart, favorites, locally created accounts, order history, contact messages, and newsletter signups.

## Run locally
1. Open the `GlowCare` folder in VS Code.
2. Run `index.html` using the Live Server extension.
3. Use a modern browser with Web Crypto support for account password hashing.

## Pages
- `index.html`: Home and featured products
- `products.html`: Search, filters, sorting, and catalog
- `product-details.html?id=101`: Product details
- `favorites.html`: Saved products
- `cart.html`: Cart and totals
- `checkout.html`: Customer details and Cash on Delivery order creation
- `order-success.html`: Latest order confirmation
- `login.html`, `register.html`, `account.html`: Local account and order history
- `admin.html`: Local product and order management
- `about.html`, `contact.html`: Brand and contact pages

## Local storage behavior
The application persists data in this browser. Clearing site data removes local accounts, sessions, cart, favorites, orders, contact messages, and newsletter records. Products and orders are not shared across devices.

## Important limitations
This is a browser-only storefront, not a production-secure commerce system. LocalStorage can be inspected or modified by the person using the browser. Passwords are hashed with PBKDF2 via Web Crypto, but browser-only authentication and admin access are not secure against a user who can manipulate local data. Orders and messages are not transmitted to a business, delivery service, or email inbox. Cash on Delivery is recorded as the chosen method; no payment is processed. A real store needs a trusted backend, database, server-side validation, proper authentication/authorization, and integrations for delivery, email, and payments. Product imagery is remotely hosted and therefore requires an internet connection; fallback imagery is used if an image fails.

## Manual test checklist
- [ ] Search products and combine category, brand, stock, price, and sort filters.
- [ ] Confirm product 102 is out of stock.
- [ ] Add/remove favorites and refresh.
- [ ] Add products to cart, change quantities, and refresh.
- [ ] Register a local account, sign out, and sign back in.
- [ ] Submit checkout with invalid data, then valid data.
- [ ] Verify stock decreases and the order appears in Admin and account history.
- [ ] Add/edit/delete a product in Admin.
- [ ] Submit contact and newsletter forms; confirm records are stored locally.
- [ ] Test responsive navigation and keyboard focus.
- [ ] Test with browser storage unavailable or full.
