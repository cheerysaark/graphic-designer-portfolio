(function () {
  const body = document.body;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const loader = document.querySelector("[data-loader]");
  const revealItems = document.querySelectorAll(".reveal");
  const yearNode = document.querySelector("[data-year]");

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = body.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      body.setAttribute("data-theme", next);
      localStorage.setItem("portfolio-theme", next);
      themeToggle.textContent = next === "light" ? "Dark Mode" : "Light Mode";
    });

    const current = body.getAttribute("data-theme") === "light" ? "light" : "dark";
    themeToggle.textContent = current === "light" ? "Dark Mode" : "Light Mode";
  }

  if (loader) {
    const hideLoader = function () {
      loader.classList.add("hidden");
      loader.setAttribute("aria-hidden", "true");
    };
    window.addEventListener("load", hideLoader, { once: true });
    setTimeout(hideLoader, 1500);
  }

  if (revealItems.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transitionLayer = document.createElement("div");
  transitionLayer.className = "page-transition";
  body.appendChild(transitionLayer);

  if (!reducedMotion) {
    transitionLayer.classList.add("is-entering");
    requestAnimationFrame(function () {
      transitionLayer.classList.remove("is-entering");
    });
  }

  const orb = document.querySelector("[data-cursor-orb]");
  if (orb && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (event) {
      orb.style.left = event.clientX + "px";
      orb.style.top = event.clientY + "px";
    });
  }

  const linkPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    // Handle both "index.html" and "" (when on root)
    const isCurrentPage = href === linkPath || (linkPath === "index.html" && href === "index.html") || (!linkPath && href === "index.html");
    if (isCurrentPage) {
      link.classList.add("is-active");
    }
  });

  const pageLinks = document.querySelectorAll('a[href$=".html"]');
  pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      if (!href || href === linkPath || reducedMotion) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      transitionLayer.classList.add("is-leaving");
      setTimeout(function () {
        window.location.href = href;
      }, 240);
    });
  });

  const magneticButtons = document.querySelectorAll(".btn");
  if (window.matchMedia("(pointer: fine)").matches) {
    magneticButtons.forEach(function (button) {
      button.addEventListener("mousemove", function (event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = "translate(" + x * 0.08 + "px, " + y * 0.14 + "px)";
      });

      button.addEventListener("mouseleave", function () {
        button.style.transform = "translate(0, 0)";
      });
    });

    const hero = document.querySelector(".hero");
    const parallaxCards = document.querySelectorAll("[data-parallax-level]");
    if (hero && parallaxCards.length) {
      hero.addEventListener("mousemove", function (event) {
        const rect = hero.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

        parallaxCards.forEach(function (card) {
          const depth = Number(card.getAttribute("data-parallax-level")) || 10;
          const translateX = offsetX * depth;
          const translateY = offsetY * depth;
          card.style.transform =
            "translate3d(" + translateX + "px, " + translateY + "px, 0) rotateX(" +
            -offsetY * 5 +
            "deg) rotateY(" +
            offsetX * 6 +
            "deg)";
        });
      });

      hero.addEventListener("mouseleave", function () {
        parallaxCards.forEach(function (card) {
          card.style.transform = "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
        });
      });
    }
  }
})();
