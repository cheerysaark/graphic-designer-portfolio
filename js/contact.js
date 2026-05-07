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
    const service = form.querySelector("#service");
    const message = form.querySelector("#message");

    if (!name.value.trim() || !service.value.trim() || !message.value.trim()) {
      note.textContent = "Please complete all fields before continuing to WhatsApp.";
      note.style.color = "#f17878";
      return;
    }

    const whatsappMessage = [
      "Hello Saarkesh,",
      "",
      "Name: " + name.value.trim(),
      "Service Looking For: " + service.value.trim(),
      "Message: " + message.value.trim(),
    ].join("\n");

    const whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);
    note.textContent = "Opening WhatsApp with your message...";
    note.style.color = "#8ad28f";
    form.reset();
    window.open(whatsappUrl, "_blank", "noopener");
  });
})();
