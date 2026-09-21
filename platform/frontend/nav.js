(function () {
  // ---------------------------------------------------------------------------
  // Universal API Base URL Resolver & Interceptor for Vercel + Render
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = "qureml_backend_url";
  const DEFAULT_RENDER_URL = "https://qureml-backend.onrender.com";
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  let backendUrl = localStorage.getItem(STORAGE_KEY);
  if (backendUrl) {
    try {
      const parsed = new URL(backendUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        backendUrl = isLocal ? "" : DEFAULT_RENDER_URL;
      } else {
        backendUrl = parsed.origin + parsed.pathname.replace(/\/$/, "");
      }
    } catch (_) {
      backendUrl = isLocal ? "" : DEFAULT_RENDER_URL;
    }
  } else {
    backendUrl = isLocal ? "" : DEFAULT_RENDER_URL;
  }
  backendUrl = backendUrl.replace(/\/$/, "");
  window.QUREML_BACKEND_URL = backendUrl;

  // Intercept window.fetch for relative API calls when running on Vercel or remote
  const _fetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.startsWith("/")) {
      const isStatic =
        input.match(/\.(html|css|js|png|jpg|jpeg|svg|webp|pdf|json|ico|woff2?)$/i) ||
        input.startsWith("/assets/") ||
        input.startsWith("/paper_figures/") ||
        input.startsWith("/team/") ||
        input.startsWith("/static/");

      if (!isStatic && window.QUREML_BACKEND_URL) {
        input = window.QUREML_BACKEND_URL + input;
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

  const apiDocsUrl = window.QUREML_BACKEND_URL ? (window.QUREML_BACKEND_URL + "/docs") : "/docs";

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
        <!-- Live Backend API Status Pill -->
        <button id="api-status-btn" type="button" class="px-2.5 py-1 rounded bg-[#FFFDF0] hover:bg-[#FFF8D6] border-2 border-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]" title="Click to inspect or change Backend API URL">
          <span id="api-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; transition: background 0.3s ease;"></span>
          <span id="api-status-text">API ONLINE</span>
        </button>
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
  // Backend API Health Poller & Connection Modal
  // ---------------------------------------------------------------------------
  const apiStatusBtn = document.getElementById("api-status-btn");
  const mobileApiStatusBtn = document.getElementById("mobile-api-status-btn");
  const apiDot = document.getElementById("api-status-dot");
  const mobileApiDot = document.getElementById("mobile-api-status-dot");
  const apiText = document.getElementById("api-status-text");

  function setStatus(state, msg) {
    const color = state === "online" ? "#10b981" : state === "waking" ? "#f59e0b" : "#ef4444";
    if (apiDot) apiDot.style.background = color;
    if (mobileApiDot) mobileApiDot.style.background = color;
    if (apiText) apiText.textContent = msg || (state === "online" ? "API ONLINE" : state === "waking" ? "WAKING UP..." : "OFFLINE");
  }

  async function checkBackendHealth() {
    try {
      const t0 = performance.now();
      const res = await _fetch((window.QUREML_BACKEND_URL || "") + "/health", { cache: "no-store" });
      const t1 = performance.now();
      if (res.ok) {
        setStatus("online", "API ONLINE");
        window.__QUREML_API_STATUS = { online: true, latency: Math.round(t1 - t0) };
      } else {
        setStatus("waking", "WAKING UP...");
        window.__QUREML_API_STATUS = { online: false, waking: true };
        setTimeout(checkBackendHealth, 5000);
      }
    } catch (e) {
      if (!isLocal) {
        setStatus("waking", "WAKING UP...");
        window.__QUREML_API_STATUS = { online: false, waking: true };
        setTimeout(checkBackendHealth, 7000);
      } else {
        setStatus("offline", "OFFLINE");
        window.__QUREML_API_STATUS = { online: false, waking: false };
      }
    }
  }

  // Initial check
  checkBackendHealth();

  // Settings Modal Creation
  function openApiModal() {
    let modal = document.getElementById("qureml-api-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "qureml-api-modal";
      modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;";
      modal.innerHTML = `
        <div style="background:#fff;border:4px solid #000;box-shadow:8px 8px 0 #000;width:100%;max-width:540px;padding:1.5rem;font-family:Kanit,sans-serif;color:#000;">
          <div style="display:flex;align-items:center;justify-content:between;border-bottom:2px solid #000;padding-bottom:0.75rem;margin-bottom:1rem;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#10b981;" id="modal-api-dot"></span>
              <h3 style="font-weight:800;font-size:1.25rem;text-transform:uppercase;margin:0;">QureML API Backend Settings</h3>
            </div>
            <button id="close-api-modal-btn" style="background:#000;color:#fff;border:none;width:28px;height:28px;font-weight:bold;cursor:pointer;margin-left:auto;">&times;</button>
          </div>
          <p style="font-size:0.875rem;margin-bottom:1rem;line-height:1.4;color:#333;">
            Configure the Render FastAPI service URL. In production, QureML frontend on Vercel routes inference and evaluation requests directly to this backend.
          </p>
          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.75rem;font-weight:700;font-family:monospace;text-transform:uppercase;margin-bottom:4px;">Render Service URL</label>
            <input id="api-url-input" type="text" value="${window.QUREML_BACKEND_URL || ''}" placeholder="https://qureml-backend.onrender.com" style="width:100%;padding:8px 12px;border:2px solid #000;font-family:monospace;font-size:0.875rem;box-sizing:border-box;" />
          </div>
          <div style="background:#fef9c3;border:2px solid #ca8a04;padding:10px;font-size:0.75rem;margin-bottom:1.25rem;line-height:1.4;">
            <strong>Render Free Tier Note:</strong> If the backend has been inactive for 15 minutes, Render spins down the container. The first request will trigger a cold start (~45s).
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button id="test-api-btn" style="background:#fff;border:2px solid #000;padding:6px 14px;font-weight:700;cursor:pointer;box-shadow:2px 2px 0 #000;">Test / Ping</button>
            <button id="reset-api-btn" style="background:#f3f4f6;border:2px solid #000;padding:6px 14px;font-weight:700;cursor:pointer;box-shadow:2px 2px 0 #000;">Reset Default</button>
            <button id="save-api-btn" style="background:#D4AF37;border:2px solid #000;padding:6px 16px;font-weight:800;cursor:pointer;box-shadow:2px 2px 0 #000;">Save & Apply</button>
          </div>
          <div id="modal-test-output" style="margin-top:10px;font-family:monospace;font-size:0.75rem;display:none;padding:6px;border:1px solid #000;background:#f8fafc;"></div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = document.getElementById("close-api-modal-btn");
      const testBtn = document.getElementById("test-api-btn");
      const resetBtn = document.getElementById("reset-api-btn");
      const saveBtn = document.getElementById("save-api-btn");
      const input = document.getElementById("api-url-input");
      const out = document.getElementById("modal-test-output");

      closeBtn.onclick = () => modal.remove();
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

      testBtn.onclick = async () => {
        out.style.display = "block";
        out.textContent = "Pinging " + (input.value.trim() || "(local)") + "/health ...";
        try {
          const t0 = performance.now();
          const target = (input.value.trim().replace(/\/$/, "") || "") + "/health";
          const res = await _fetch(target, { cache: "no-store" });
          const t1 = performance.now();
          if (res.ok) {
            const data = await res.json();
            out.textContent = `SUCCESS (HTTP ${res.status}, ${Math.round(t1 - t0)}ms): ${JSON.stringify(data)}`;
            out.style.color = "#15803d";
          } else {
            out.textContent = `HTTP ${res.status}: ${res.statusText}`;
            out.style.color = "#b45309";
          }
        } catch (err) {
          out.textContent = `Connection error: ${err.message}. If Render is asleep, please wait 30-45s and retry.`;
          out.style.color = "#b91c1c";
        }
      };

      resetBtn.onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        input.value = isLocal ? "" : DEFAULT_RENDER_URL;
        out.style.display = "none";
      };

      saveBtn.onclick = () => {
        let val = input.value.trim().replace(/\/$/, "");
        if (val) {
          if (!/^https?:\/\//i.test(val)) {
            val = "https://" + val;
          }
          try {
            const parsed = new URL(val);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
              out.style.display = "block";
              out.textContent = "Error: Only http:// or https:// URLs are allowed.";
              out.style.color = "#b91c1c";
              return;
            }
            const cleanUrl = parsed.origin + parsed.pathname.replace(/\/$/, "");
            localStorage.setItem(STORAGE_KEY, cleanUrl);
            window.QUREML_BACKEND_URL = cleanUrl;
          } catch (e) {
            out.style.display = "block";
            out.textContent = "Error: Please enter a valid URL.";
            out.style.color = "#b91c1c";
            return;
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
          window.QUREML_BACKEND_URL = isLocal ? "" : DEFAULT_RENDER_URL;
        }
        modal.remove();
        checkBackendHealth();
      };
    }
  }

  if (apiStatusBtn) apiStatusBtn.onclick = openApiModal;
  if (mobileApiStatusBtn) mobileApiStatusBtn.onclick = openApiModal;
})();

