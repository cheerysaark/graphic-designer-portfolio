(function () {
  const form = document.querySelector("[data-contact-form]");
  const note = document.querySelector("[data-form-note]");
  const whatsappNumber = "94703771851";
  if (!form || !note) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      note.textContent = "Please complete all fields before continuing to WhatsApp.";
      note.style.color = "#f17878";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      note.textContent = "Please enter a valid email address.";
      note.style.color = "#f17878";
      return;
    }

    const whatsappMessage = [
      "Hello Saarkesh,",
      "",
      "Name: " + name.value.trim(),
      "Email: " + email.value.trim(),
      "Message: " + message.value.trim(),
    ].join("\n");

    const whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);
    note.textContent = "Opening WhatsApp with your message...";
    note.style.color = "#8ad28f";
    form.reset();
    window.open(whatsappUrl, "_blank", "noopener");
  });
})();
