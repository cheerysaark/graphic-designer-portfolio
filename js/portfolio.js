(function () {
  const toolbar = document.querySelector("[data-filter-toolbar]");
  const cards = Array.from(document.querySelectorAll("[data-project-category]"));
  if (!toolbar || !cards.length) {
    return;
  }

  toolbar.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-filter]");
    if (!button) {
      return;
    }

    const filter = button.getAttribute("data-filter");
    toolbar.querySelectorAll("button[data-filter]").forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    cards.forEach(function (card) {
      const category = card.getAttribute("data-project-category");
      const show = filter === "all" || filter === category;
      card.hidden = !show;
    });
  });

  const compares = document.querySelectorAll("[data-compare]");
  compares.forEach(function (compare) {
    compare.addEventListener("click", function (event) {
      const button = event.target.closest(".compare-btn[data-compare-target]");
      if (!button) {
        return;
      }

      const target = button.getAttribute("data-compare-target");
      compare.querySelectorAll(".compare-btn").forEach(function (btn) {
        btn.classList.toggle("is-active", btn === button);
      });

      compare.querySelectorAll(".compare-img[data-state]").forEach(function (img) {
        const state = img.getAttribute("data-state");
        img.classList.toggle("is-active", state === target);
      });
    });
  });
})();
