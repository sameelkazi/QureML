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
      <a class="nav-brand" href="/" title="QureML Hybrid Quantum Clinical Platform">
        <div class="nav-brand-logo" style="overflow: hidden; padding: 2px; background: #000000 !important; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
          <img src="https://img.logo.dev/egreenquanta.com?token=pk_FLId-NEERDqqd_EiW6JE-Q" onerror="this.onerror=null; this.src='/assets/egreenquanta.png'" alt="Egreen Quanta" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" />
        </div>
        <div>
          <div class="nav-brand-name">QURE<span>ML</span></div>
          <div class="nav-brand-tag">HYBRID VQC &middot; EGREEN QUANTA</div>
        </div>
      </a>

      <nav class="hidden xl:block min-w-0">
        <ul class="nav-links-row">
          ${linksHtml}
        </ul>
      </nav>

      <div class="hidden sm:flex items-center gap-2.5 flex-shrink-0">
        <a href="https://github.com/sameelkazi/QureML" target="_blank" rel="noopener noreferrer" class="nav-action-btn btn-white flex items-center gap-1.5" title="View QureML on GitHub">
          <img src="https://img.logo.dev/github.com?token=pk_FLId-NEERDqqd_EiW6JE-Q" alt="GitHub" class="w-4 h-4 rounded-full" />
          <span>REPO</span>
        </a>
        <a href="/docs" target="_blank" class="nav-action-btn btn-white">API</a>
        <button type="button" onclick="if(window.ClinicalDashboardGuideBot){window.ClinicalDashboardGuideBot.startCurrentPageTour();}else{window.location.href='/predict?ai_tour=1';}" class="nav-action-btn btn-gold flex items-center gap-1" title="Start AI GuideBot Walkthrough">
          <span class="material-symbols-outlined text-sm">smart_toy</span>
          <span>AI TOUR</span>
        </button>
        <a href="/walkthrough" class="nav-action-btn btn-white">REPORT</a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button id="mobile-nav-toggle" class="xl:hidden p-2 text-black hover:text-[#D4AF37] focus:outline-none flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000]" aria-label="Toggle Menu">
        <span class="material-symbols-outlined" style="font-size: 1.5rem;">menu</span>
      </button>
    </div>

    <!-- Mobile Navigation Drawer (Light Neo-Brutalism) -->
    <div id="mobile-nav-drawer" class="hidden xl:hidden bg-white border-b-4 border-black px-4 sm:px-6 py-4 shadow-2xl">
      <div class="flex flex-col gap-1">
        ${mobileLinksHtml}
      </div>
      <div class="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t-2 border-black">
        <a href="https://github.com/sameelkazi/QureML" target="_blank" rel="noopener noreferrer" class="nav-action-btn btn-white flex items-center justify-center gap-1.5" style="width: 100% !important; min-height: 40px !important;">
          <img src="https://img.logo.dev/github.com?token=pk_FLId-NEERDqqd_EiW6JE-Q" alt="GitHub" class="w-4 h-4 rounded-full" />
          <span>REPO</span>
        </a>
        <a href="/docs" target="_blank" class="nav-action-btn btn-white flex items-center justify-center" style="width: 100% !important; min-height: 40px !important;">API</a>
        <button type="button" onclick="if(window.ClinicalDashboardGuideBot){window.ClinicalDashboardGuideBot.startCurrentPageTour();}else{window.location.href='/predict?ai_tour=1';}" class="nav-action-btn btn-gold flex items-center justify-center gap-1.5" style="width: 100% !important; min-height: 40px !important;">
          <span class="material-symbols-outlined text-sm">smart_toy</span>
          <span>AI TOUR</span>
        </button>
        <a href="/walkthrough" class="nav-action-btn btn-white flex items-center justify-center" style="width: 100% !important; min-height: 40px !important;">REPORT</a>
      </div>
    </div>
  </header>
  `;

  const toggleBtn = document.getElementById("mobile-nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  if (toggleBtn && drawer) {
    const iconSpan = toggleBtn.querySelector(".material-symbols-outlined");
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isClosed = drawer.classList.contains("hidden");
      drawer.classList.toggle("hidden");
      if (iconSpan) {
        iconSpan.textContent = isClosed ? "close" : "menu";
      }
    });

    document.addEventListener("click", (e) => {
      if (!drawer.classList.contains("hidden") && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.add("hidden");
        if (iconSpan) iconSpan.textContent = "menu";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !drawer.classList.contains("hidden")) {
        drawer.classList.add("hidden");
        if (iconSpan) iconSpan.textContent = "menu";
      }
    });
  }

  // Universal GuideBot Loader for all platform dashboard subpages (excluding root hero landing)
  const isRootLanding = path === "/" || path === "/index" || path === "/index.html";
  if (!isRootLanding) {
    if (!document.getElementById("qureml-dgb-css")) {
      const link = document.createElement("link");
      link.id = "qureml-dgb-css";
      link.rel = "stylesheet";
      link.href = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/dashboard-guidebot.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById("qureml-dgb-js") && !document.querySelector('script[src*="dashboard-guidebot.js"]')) {
      const s = document.createElement("script");
      s.id = "qureml-dgb-js";
      s.src = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/dashboard-guidebot.js';
      s.defer = true;
      document.body.appendChild(s);
    }
  }
})();
