(function () {
  const NAV_ITEMS = [
    { slug: "index", label: "Overview", href: "/" },
    { slug: "predict", label: "Triage", href: "/predict" },
    { slug: "uncertainty", label: "Uncertainty", href: "/uncertainty" },
    { slug: "compare", label: "Compare", href: "/compare" },
    { slug: "explain", label: "Explain", href: "/explain" },
    { slug: "batch", label: "Batch", href: "/batch" },
    { slug: "train", label: "Train", href: "/train" },
    { slug: "evaluation", label: "Evaluation", href: "/evaluation" },
    { slug: "hardware", label: "IBM QPU", href: "/hardware" }
  ];

  const path = window.location.pathname.replace(/\/$/, "") || "/";
  let current = path === "/" ? "index" : path.replace(/^\//, "").replace(/\.html$/, "");
  if (current === "triage") current = "predict";

  const target = document.getElementById("site-nav");
  if (!target) return;

  const linksHtml = NAV_ITEMS.map(item => {
    const isActive = item.slug === current;
    return `<li><a href="${item.href}" class="nav-link-item ${isActive ? "active" : ""}">${item.label}</a></li>`;
  }).join("");

  const mobileLinksHtml = NAV_ITEMS.map(item => {
    const isActive = item.slug === current;
    return `<a href="${item.href}" class="nav-link-item ${isActive ? "active" : ""}" style="font-size: 1.1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.08); display: block;">${item.label}</a>`;
  }).join("");

  target.innerHTML = `
  <header class="global-nav-header">
    <div class="global-nav-container">
      <a class="nav-brand" href="/">
        <div class="nav-brand-logo" style="overflow: hidden; padding: 2px; background: #000000 !important;">
          <img src="/assets/logo.webp" alt="QureML" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.outerHTML='<span class=\'material-symbols-outlined\' style=\'font-size: 1.25rem; color: #D4AF37;\'>biotech</span>'" />
        </div>
        <div>
          <div class="nav-brand-name">QURE<span>ML</span></div>
          <div class="nav-brand-tag">HYBRID VQC &middot; SIH26139</div>
        </div>
      </a>

      <nav class="hidden xl:block min-w-0">
        <ul class="nav-links-row">
          ${linksHtml}
        </ul>
      </nav>

      <div class="hidden sm:flex items-center gap-2.5 flex-shrink-0">
        <a href="/docs" target="_blank" class="nav-action-btn btn-white">API</a>
        <a href="/architecture" class="nav-action-btn btn-white">FIGURES</a>
        <a href="/walkthrough" class="nav-action-btn btn-gold">REPORT</a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button id="mobile-nav-toggle" class="xl:hidden p-2 text-black hover:text-[#D4AF37] focus:outline-none flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000]" aria-label="Toggle Menu">
        <span class="material-symbols-outlined" style="font-size: 1.5rem;">menu</span>
      </button>
    </div>

    <!-- Mobile Navigation Drawer (Light Neo-Brutalism) -->
    <div id="mobile-nav-drawer" class="hidden xl:hidden bg-white border-b-4 border-black px-6 py-4 shadow-2xl">
      <div class="flex flex-col gap-1">
        ${mobileLinksHtml}
      </div>
      <div class="flex items-center gap-3 mt-4 pt-4 border-t-2 border-black">
        <a href="/docs" target="_blank" class="nav-action-btn btn-white w-full text-center" style="width: 100% !important;">API</a>
        <a href="/architecture" class="nav-action-btn btn-white w-full text-center" style="width: 100% !important;">Figures</a>
        <a href="/walkthrough" class="nav-action-btn btn-gold w-full text-center" style="width: 100% !important;">Report</a>
      </div>
    </div>
  </header>
  `;

  const toggleBtn = document.getElementById("mobile-nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.toggle("hidden");
    });
  }
})();
