(function () {
  const createBox = document.getElementById("createBox");
  const loginBox = document.getElementById("loginBox");
  const auth = document.getElementById("auth");
  const editor = document.getElementById("editor");

  const newPass = document.getElementById("newPass");
  const createBtn = document.getElementById("createBtn");
  const showLogin = document.getElementById("showLogin");
  const pass = document.getElementById("pass");
  const loginBtn = document.getElementById("loginBtn");
  const backCreate = document.getElementById("backCreate");

  const imagesTA = document.getElementById("images");
  const servicesTA = document.getElementById("services");
  const applyBtn = document.getElementById("applyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const imagesList = document.getElementById("imagesList");
  const servicesList = document.getElementById("servicesList");
  const addImageBtn = document.getElementById("addImageBtn");
  const addServiceBtn = document.getElementById("addServiceBtn");

  function setPassword(p) {
    localStorage.setItem("_admin_pass", p);
    localStorage.setItem("_admin_created", String(Date.now()));
  }

  function checkPassword(p) {
    return localStorage.getItem("_admin_pass") === p;
  }

  function showLoginBox() {
    createBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  }

  function showCreateBox() {
    loginBox.classList.add("hidden");
    createBox.classList.remove("hidden");
  }

  showLogin.addEventListener("click", showLoginBox);
  backCreate.addEventListener("click", showCreateBox);

  createBtn.addEventListener("click", function () {
    const v = newPass.value && newPass.value.trim();
    if (!v) {
      alert("Enter a non-empty password");
      return;
    }
    setPassword(v);
    alert("Password saved locally. Use it to unlock the admin page.");
    newPass.value = "";
    showLoginBox();
  });

  loginBtn.addEventListener("click", function () {
    const v = pass.value && pass.value.trim();
    if (!v) {
      alert("Enter password");
      return;
    }
    if (!checkPassword(v)) {
      alert("Incorrect password");
      return;
    }
    auth.classList.add("hidden");
    editor.classList.remove("hidden");
    loadContentToEditor();
  });

  function loadContentToEditor() {
    const content = window.siteContent || { portfolioImages: [], contactServices: [] };
    renderImages(content.portfolioImages || []);
    renderServices(content.contactServices || []);
  }

  applyBtn.addEventListener("click", function () {
    try {
      const imgs = gatherImagesFromUI();
      const services = gatherServicesFromUI();
      window.siteContent = window.siteContent || {};
      window.siteContent.portfolioImages = imgs;
      window.siteContent.contactServices = services;
      alert("Preview applied — the running pages will now reflect the content in this tab.\nTo publish, download and commit the file.");
    } catch (e) {
      alert("Invalid JSON — please fix before applying.");
    }
  });

  function buildSiteContentText() {
    let contentObj = {
      portfolioImages: [],
      contactServices: []
    };
    try {
      contentObj.portfolioImages = gatherImagesFromUI();
    } catch (e) {}
    try {
      contentObj.contactServices = gatherServicesFromUI();
    } catch (e) {}
    return "window.siteContent = " + JSON.stringify(contentObj, null, 2) + ";\n";
  }

  downloadBtn.addEventListener("click", function () {
    const text = buildSiteContentText();
    const blob = new Blob([text], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  copyBtn.addEventListener("click", function () {
    const text = buildSiteContentText();
    navigator.clipboard
      .writeText(text)
      .then(function () {
        alert("site-content.js copied to clipboard — paste into GitHub editor or a file in your repo.");
      })
      .catch(function () {
        alert("Copy failed — use Download instead.");
      });
  });

  // --- New UI helpers for list editing ---
  function createImageRow(item) {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    wrap.style.marginBottom = '8px';

    const src = document.createElement('input');
    src.type = 'text';
    src.placeholder = 'assets/images/example.jpg';
    src.value = item && item.src ? item.src : '';
    src.style.flex = '1';
    src.style.padding = '8px';
    src.style.borderRadius = '6px';
    src.style.border = '1px solid rgba(255,255,255,0.04)';

    const alt = document.createElement('input');
    alt.type = 'text';
    alt.placeholder = 'Image alt text';
    alt.value = item && item.alt ? item.alt : '';
    alt.style.width = '260px';
    alt.style.padding = '8px';
    alt.style.borderRadius = '6px';
    alt.style.border = '1px solid rgba(255,255,255,0.04)';

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.style.background = '#6b2d2d';
    remove.addEventListener('click', function () { wrap.remove(); });

    wrap.appendChild(src);
    wrap.appendChild(alt);
    wrap.appendChild(remove);
    return wrap;
  }

  function createServiceRow(text) {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    wrap.style.marginBottom = '8px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g., Brand Identity';
    input.value = text || '';
    input.style.flex = '1';
    input.style.padding = '8px';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid rgba(255,255,255,0.04)';

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.style.background = '#6b2d2d';
    remove.addEventListener('click', function () { wrap.remove(); });

    wrap.appendChild(input);
    wrap.appendChild(remove);
    return wrap;
  }

  function renderImages(items) {
    imagesList.innerHTML = '';
    if (!Array.isArray(items)) items = [];
    items.forEach(function (it) {
      imagesList.appendChild(createImageRow(it));
    });
  }

  function renderServices(items) {
    servicesList.innerHTML = '';
    if (!Array.isArray(items)) items = [];
    items.forEach(function (it) {
      servicesList.appendChild(createServiceRow(it));
    });
  }

  function gatherImagesFromUI() {
    const rows = Array.from(imagesList.children);
    const out = [];
    rows.forEach(function (r) {
      const src = r.querySelector('input[type=text]');
      const alt = r.querySelectorAll('input[type=text]')[1];
      if (src && src.value && src.value.trim()) {
        out.push({ src: src.value.trim(), alt: alt ? alt.value.trim() : '' });
      }
    });
    return out;
  }

  function gatherServicesFromUI() {
    const rows = Array.from(servicesList.children);
    const out = [];
    rows.forEach(function (r) {
      const input = r.querySelector('input[type=text]');
      if (input && input.value && input.value.trim()) out.push(input.value.trim());
    });
    return out;
  }

  addImageBtn.addEventListener('click', function () {
    imagesList.appendChild(createImageRow({ src: '', alt: '' }));
  });

  addServiceBtn.addEventListener('click', function () {
    servicesList.appendChild(createServiceRow(''));
  });

  // Auto-show login if password exists
  if (localStorage.getItem("_admin_pass")) {
    showLoginBox();
  }
})();
