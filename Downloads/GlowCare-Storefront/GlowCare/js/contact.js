document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form), messages = Glow.read(Glow.KEYS.messages, []);
    messages.unshift({
      id: `MSG-${Date.now()}`
      , name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      subject: String(data.get("subject")).trim(),
      message: String(data.get("message")).trim(),
      createdAt: new Date().toISOString()
    });
    if (!Glow.write(Glow.KEYS.messages, messages)) {
      Glow.showMessage(document.getElementById("contact-message"),
        "Browser storage is unavailable. Message was not saved.",
        "error");
      return;
    }
    Glow.showMessage(document.getElementById("contact-message"),
      "Your message has been saved in this browser. It has not been emailed.");
    form.reset();
  });
});
