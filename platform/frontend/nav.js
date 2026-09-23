(function () {
  // ---------------------------------------------------------------------------
  // Secure Edge-Proxy API Gateway Routing
  // ---------------------------------------------------------------------------
  // When running in production (Vercel), requests to backend endpoints route via
  // the Vercel edge reverse proxy (/api/proxy/*), eliminating cross-origin exposure
  // of internal backend hostnames and protecting against client-side request tampering.
  // When running locally, calls route directly to relative endpoints.
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const API_PROXY_PREFIX = isLocal ? "" : "/api/proxy";

  // Intercept window.fetch for relative API calls to route securely through edge gateway
  const _fetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.startsWith("/")) {
      const cleanPath = input.split("?")[0].split("#")[0];
      const isStaticOrVercelApi =
        cleanPath.match(/\.(html|css|js|png|jpg|jpeg|svg|webp|pdf|json|ico|woff2?)$/i) ||
        cleanPath.startsWith("/api/") ||
        cleanPath.startsWith("/assets/") ||
        cleanPath.startsWith("/paper_figures/") ||
        cleanPath.startsWith("/team/") ||
        cleanPath.startsWith("/static/");

      if (!isStaticOrVercelApi && API_PROXY_PREFIX) {
        input = API_PROXY_PREFIX + input;
      }
    }
    return _fetch.call(this, input, init);
  };


  const NAV_ITEMS = [
    { slug: "index", label: "Overview", href: "/" },
    { slug: "predict", label: "Clinical Triage", href: "/predict" },
    { slug: "uncertainty", label: "Uncertainty Studio", href: "/uncertainty" },
    { slug: "compare", label: "Compare vs Classical", href: "/compare" },
    { slug: "explain", label: "Explainability (IG)", href: "/explain" },
    { slug: "batch", label: "Batch Screening", href: "/batch" },
    { slug: "train", label: "Active Training", href: "/train" },
    { slug: "evaluation", label: "Evaluation Metrics", href: "/evaluation" },
    { slug: "hardware", label: "IBM QPU Heron", href: "/hardware" },
    { slug: "architecture", label: "Research Gallery", href: "/architecture" },
    { slug: "walkthrough", label: "Judge Report", href: "/walkthrough" },
    { slug: "compliance", label: "Compliance & PS", href: "/compliance" },
    { slug: "roadmap", label: "Future Roadmap", href: "/roadmap" }
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
    return `<a href="${item.href}" class="nav-link-item ${isActive ? "active font-bold" : ""}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.08); display: block;">${item.label}</a>`;
  }).join("");

  const apiDocsUrl = "/docs";

  target.innerHTML = `
  <header class="global-nav-header">
    <div class="global-nav-container flex items-center justify-between">
      <a class="nav-brand" href="/" title="QureML Hybrid Quantum Clinical Platform">
        <div class="nav-brand-logo" style="overflow: hidden; padding: 2px; background: #000000 !important; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
          <img src="https://img.logo.dev/egreenquanta.com?token=pk_FLId-NEERDqqd_EiW6JE-Q" onerror="this.onerror=null; this.src='/assets/egreenquanta.png'" alt="Egreen Quanta" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" />
        </div>
        <div>
          <div class="nav-brand-name">QURE<span>ML</span></div>
          <div class="nav-brand-tag">HYBRID VQC &middot; EGREEN QUANTA</div>
        </div>
      </a>

      <!-- Clean Minimal Right Actions: Only GitHub REPO & MENU Toggle -->
      <div class="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <a href="https://github.com/sameelkazi/QureML" target="_blank" rel="noopener noreferrer" class="nav-action-btn btn-white flex items-center justify-center gap-1.5 font-bold" title="View QureML on GitHub">
          <img src="https://img.logo.dev/github.com?token=pk_FLId-NEERDqqd_EiW6JE-Q" alt="GitHub" class="w-4 h-4 rounded-full" />
          <span>REPO</span>
        </a>

        <button id="nav-menu-toggle" type="button" class="nav-action-btn btn-gold flex items-center justify-center gap-1.5 font-bold cursor-pointer" aria-label="Toggle Complete Navigation Menu" title="Open Complete Platform Navigation Menu">
          <span class="material-symbols-outlined text-base">menu</span>
          <span class="menu-label-text">MENU</span>
        </button>
      </div>
    </div>

    <!-- Navigation Drawer (Light Neo-Brutalism for Mobile, Tablet & Desktop Mega-Menu) -->
    <div id="mobile-nav-drawer" class="hidden bg-white border-b-4 border-black px-4 sm:px-8 py-6 shadow-2xl transition-all" style="max-height: calc(100vh - 65px); overflow-y: auto;">
      <!-- Drawer Header Row: Module Count + Live Backend Status -->
      <div class="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#B8860B] font-bold">apps</span>
          <span class="font-extrabold text-sm uppercase tracking-wider font-kanit">QureML Platform Modules & Navigation</span>
        </div>
        <!-- Live Backend API Status Pill (Read-Only Secured Badge) -->
        <div id="api-status-badge" class="px-2.5 py-1 rounded bg-[#FFFDF0] border-2 border-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_#000]" title="Quantum Inference Engine Status">
          <span id="api-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; transition: background 0.3s ease;"></span>
          <span id="api-status-text">QML ENGINE ONLINE</span>
        </div>
      </div>


      <!-- Quick Action Utilities Row (White Paper, AI Tour, AI Chat, Judge Report, API Docs) -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4 mb-5 border-b-2 border-black">
        <a href="/paper.pdf" onclick="event.preventDefault();if(window.openWhitePaperModal){window.openWhitePaperModal();}else{window.open('/paper.pdf','_blank');}" class="p-2.5 rounded bg-white hover:bg-[#FFFDF0] border-2 border-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] transition-all text-black">
          <span class="material-symbols-outlined text-base text-[#996515]">description</span>
          <span>WHITE PAPER</span>
        </a>
        <button type="button" onclick="if(window.ClinicalDashboardGuideBot){window.ClinicalDashboardGuideBot.startCurrentPageTour();}else{window.location.href='/predict?ai_tour=1';}" class="p-2.5 rounded bg-[#FFF8D6] hover:bg-[#FCEBA7] border-2 border-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] transition-all text-black cursor-pointer">
          <span class="material-symbols-outlined text-base text-[#996515]">smart_toy</span>
          <span>AI TOUR</span>
        </button>
        <button type="button" onclick="if(window.openQureMLChat){window.openQureMLChat();}else{alert('Assistant is initializing...');}" class="p-2.5 rounded bg-[#FFF8D6] hover:bg-[#FCEBA7] border-2 border-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] transition-all text-black cursor-pointer" title="Open QureML AI Assistant">
          <span class="material-symbols-outlined text-base text-[#996515]">chat</span>
          <span>AI CHAT</span>
        </button>
        <a href="/walkthrough" class="p-2.5 rounded bg-white hover:bg-[#FFFDF0] border-2 border-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] transition-all text-black">
          <span class="material-symbols-outlined text-base text-[#996515]">assignment</span>
          <span>JUDGE REPORT</span>
        </a>
        <a href="${apiDocsUrl}" target="_blank" class="p-2.5 rounded bg-white hover:bg-[#FFFDF0] border-2 border-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_#000] transition-all text-black">
          <span class="material-symbols-outlined text-base text-[#996515]">terminal</span>
          <span>API DOCS</span>
        </a>
      </div>

      <!-- Laptop / Desktop Mega-Menu Grid (Visible on md and larger) -->
      <div class="hidden md:block">
        <div class="grid grid-cols-4 gap-6 text-sm">
          <!-- Col 1: Clinical Diagnostics -->
          <div class="space-y-2">
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#996515] pb-1 border-b border-gray-200">Clinical Triage & Analysis</div>
            <a href="/" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Overview <span class="text-xs text-gray-500 block">Mission & benchmark summary</span></a>
            <a href="/predict" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Clinical Triage <span class="text-xs text-gray-500 block">30-parameter biomarker risk score</span></a>
            <a href="/uncertainty" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Uncertainty Studio <span class="text-xs text-gray-500 block">1024-shot quantum variance</span></a>
            <a href="/compare" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Benchmark Comparison <span class="text-xs text-gray-500 block">Head-to-head vs classical ML</span></a>
          </div>

          <!-- Col 2: Quantum Architecture & Engines -->
          <div class="space-y-2">
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#996515] pb-1 border-b border-gray-200">Quantum Engines</div>
            <a href="/explain" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Explainability (IG) <span class="text-xs text-gray-500 block">Integrated gradients on ansatz</span></a>
            <a href="/train" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Active Training <span class="text-xs text-gray-500 block">Live Adam/COBYLA parameter tuning</span></a>
            <a href="/batch" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">High-Throughput Batch <span class="text-xs text-gray-500 block">Multi-patient async processing</span></a>
            <a href="/evaluation" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Statistical Evaluation <span class="text-xs text-gray-500 block">10-fold CV & DeLong p-values</span></a>
          </div>

          <!-- Col 3: Hardware & Research Figures -->
          <div class="space-y-2">
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#996515] pb-1 border-b border-gray-200">Hardware & Research</div>
            <a href="/hardware" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">IBM Quantum Heron <span class="text-xs text-gray-500 block">156-qubit QPU & ZNE mitigation</span></a>
            <a href="/architecture" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Research Figures Gallery <span class="text-xs text-gray-500 block">14 empirical ablations & curves</span></a>
            <a href="/architecture#sec-barren" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Barren Plateau Scaling <span class="text-xs text-gray-500 block">McClean gradient variance analysis</span></a>
            <a href="/architecture#sec-federated" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">DP-Federated Learning <span class="text-xs text-gray-500 block">Multi-center privacy guarantees</span></a>
          </div>

          <!-- Col 4: Scientific Assets & Compliance -->
          <div class="space-y-2">
            <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#996515] pb-1 border-b border-gray-200">Compliance & Assets</div>
            <a href="/paper.pdf" onclick="event.preventDefault();if(window.openWhitePaperModal){window.openWhitePaperModal();}else{window.open('/paper.pdf','_blank');}" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">Scientific White Paper <span class="text-xs text-gray-500 block">Peer-reviewed full publication</span></a>
            <a href="/walkthrough" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">SIH26139 Report <span class="text-xs text-gray-500 block">Official judge walkthrough</span></a>
            <a href="${apiDocsUrl}" target="_blank" class="block p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">OpenAPI Interactive Docs <span class="text-xs text-gray-500 block">FastAPI swagger endpoints</span></a>
            <button type="button" onclick="if(window.openQureMLChat){window.openQureMLChat();}else{alert('Assistant is initializing...');}" class="w-full text-left p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">QureML AI Assistant <span class="text-xs text-gray-500 block">Grounded technical & clinical Q&A</span></button>
            <button type="button" onclick="if(window.ClinicalDashboardGuideBot){window.ClinicalDashboardGuideBot.startCurrentPageTour();}else{window.location.href='/predict?ai_tour=1';}" class="w-full text-left p-2 hover:bg-[#FFFDF0] border border-transparent hover:border-black rounded transition-all font-medium text-black">AI GuideBot Tour <span class="text-xs text-gray-500 block">Interactive step-by-step assistant</span></button>
          </div>
        </div>
      </div>

      <!-- Mobile Phone Simple List (Visible on < md) -->
      <div class="md:hidden">
        <div class="flex flex-col gap-1">
          ${mobileLinksHtml}
        </div>
      </div>
    </div>
  </header>
  `;

  const menuToggleBtn = document.getElementById("nav-menu-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");

  function handleDrawerToggle(e) {
    if (e) e.stopPropagation();
    if (!drawer) return;
    const isClosed = drawer.classList.contains("hidden");
    drawer.classList.toggle("hidden");
    if (menuToggleBtn) {
      const icon = menuToggleBtn.querySelector(".material-symbols-outlined");
      const label = menuToggleBtn.querySelector(".menu-label-text");
      if (icon) icon.textContent = isClosed ? "close" : "menu";
      if (label) label.textContent = isClosed ? "CLOSE" : "MENU";
    }
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener("click", handleDrawerToggle);

  if (drawer) {
    document.addEventListener("click", (e) => {
      const clickedInside = drawer.contains(e.target) || 
                            (menuToggleBtn && menuToggleBtn.contains(e.target));
      if (!drawer.classList.contains("hidden") && !clickedInside) {
        drawer.classList.add("hidden");
        if (menuToggleBtn) {
          const icon = menuToggleBtn.querySelector(".material-symbols-outlined");
          const label = menuToggleBtn.querySelector(".menu-label-text");
          if (icon) icon.textContent = "menu";
          if (label) label.textContent = "MENU";
        }
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !drawer.classList.contains("hidden")) {
        drawer.classList.add("hidden");
        if (menuToggleBtn) {
          const icon = menuToggleBtn.querySelector(".material-symbols-outlined");
          const label = menuToggleBtn.querySelector(".menu-label-text");
          if (icon) icon.textContent = "menu";
          if (label) label.textContent = "MENU";
        }
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

  // Universal White Paper Modal Loader
  if (!document.getElementById("qureml-paper-modal-js") && !document.querySelector('script[src*="paper-modal.js"]')) {
    const pmScript = document.createElement("script");
    pmScript.id = "qureml-paper-modal-js";
    pmScript.src = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/paper-modal.js';
    pmScript.defer = true;
    document.body.appendChild(pmScript);
  }

  // Universal QureML AI Assistant Chat Widget Loader
  if (!document.getElementById("qureml-chat-css")) {
    const cLink = document.createElement("link");
    cLink.id = "qureml-chat-css";
    cLink.rel = "stylesheet";
    cLink.href = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/chat-widget.css';
    document.head.appendChild(cLink);
  }
  if (!document.getElementById("qureml-chat-js") && !document.querySelector('script[src*="chat-widget.js"]')) {
    const cScript = document.createElement("script");
    cScript.id = "qureml-chat-js";
    cScript.src = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/chat-widget.js';
    cScript.defer = true;
    document.body.appendChild(cScript);
  }

  // ---------------------------------------------------------------------------
  // Backend QML Engine Health Telemetry (Read-Only Status Badge)
  // ---------------------------------------------------------------------------
  const apiDot = document.getElementById("api-status-dot");
  const mobileApiDot = document.getElementById("mobile-api-status-dot");
  const apiText = document.getElementById("api-status-text");

  function setStatus(state, msg) {
    const color = state === "online" ? "#10b981" : state === "waking" ? "#f59e0b" : "#ef4444";
    if (apiDot) apiDot.style.background = color;
    if (mobileApiDot) mobileApiDot.style.background = color;
    if (apiText) apiText.textContent = msg || (state === "online" ? "QML ENGINE ONLINE" : state === "waking" ? "INITIALIZING..." : "STANDBY");
  }

  async function checkBackendHealth() {
    try {
      const t0 = performance.now();
      const res = await _fetch((API_PROXY_PREFIX || "") + "/health", { cache: "no-store" });
      const t1 = performance.now();
      if (res.ok) {
        setStatus("online", "QML ENGINE ONLINE");
        window.__QUREML_API_STATUS = { online: true, latency: Math.round(t1 - t0) };
      } else {
        setStatus("waking", "INITIALIZING...");
        window.__QUREML_API_STATUS = { online: false, waking: true };
        setTimeout(checkBackendHealth, 5000);
      }
    } catch (e) {
      if (!isLocal) {
        setStatus("waking", "INITIALIZING...");
        window.__QUREML_API_STATUS = { online: false, waking: true };
        setTimeout(checkBackendHealth, 7000);
      } else {
        setStatus("offline", "STANDBY");
        window.__QUREML_API_STATUS = { online: false, waking: false };
      }
    }
  }

  // Initial telemetry health check
  checkBackendHealth();
})();


