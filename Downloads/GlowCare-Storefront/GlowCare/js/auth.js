document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-demo-auth]");
  if (!form) return;
  const isRegister = document.body.dataset.page === "register";
  const message = form.querySelector("[data-auth-message]");
  const passwordField = form.querySelector('[name="password"]');
  const confirmField = form.querySelector('[name="confirmPassword"]');
  const toHex = bytes => Array.from(new Uint8Array(bytes),
   b => b.toString(16).padStart(2, "0")).join("");
  async function hashPassword(password, saltHex) {
    const salt = saltHex ? Uint8Array.from(saltHex.match(/.{1,2}/g).map(x => parseInt(x, 16))) : crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), 
    "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2",
       salt, iterations: 210000, hash: "SHA-256" }, key, 256);
    return { salt: toHex(salt), hash: toHex(bits) };
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (!window.crypto?.subtle) { 
      Glow.showMessage(message,
         "Secure browser crypto is unavailable . Please use VS Code Live Server in a modern browser.", 
         "error"); 
         return; 
        }
    const data = new FormData(form), email = String(data.get("email") || "").trim().toLowerCase(),
     password = String(data.get("password") || "");
    const users = Glow.read(Glow.KEYS.users, []);
    try {
      if (isRegister) {
        const name = String(data.get("name") || "").trim();
        if (password.length < 8) { Glow.showMessage(message, "Use a password with at least 8 characters.", "error"); return; }
        if (password !== String(data.get("confirmPassword") || "")) { 
          Glow.showMessage(message, "Passwords do not match.", "error"); 
          return; }
        if (users.some(user => user.email === email)) {
           Glow.showMessage(message, 
            "An account with this email already exists.", "error"); 
            return; }
        const credential = await hashPassword(password);
        users.push({ id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
         name, email, 
         salt: credential.salt,
          passwordHash: credential.hash, 
         createdAt: new Date().toISOString() });
        if (!Glow.write(Glow.KEYS.users, users)) { 
          Glow.showMessage(message, "Storage is unavailable or full. Account was not saved.", "error"); return; }
        Glow.write(Glow.KEYS.session, {
           userId: users[users.length - 1].id, email, signedInAt: new Date().toISOString() });
        location.href = "account.html";
      } else {
        const user = users.find(item => item.email === email);
        if (!user) { Glow.showMessage(message,
           "Email or password is incorrect.", "error"); 
           return; }
        const credential = await hashPassword(password, user.salt);
        if (credential.hash !== user.passwordHash) { 
          Glow.showMessage(message, 
            "Email or password is incorrect.", "error"); 
            return; }
        Glow.write(Glow.KEYS.session, {
           userId: user.id, email, signedInAt: new Date().toISOString() });
        location.href = "account.html";
      }
    } catch (error) { Glow.showMessage(message,
       "Could not complete this action. Check browser storage and try again.",
        "error"); 
      }
  });
});
