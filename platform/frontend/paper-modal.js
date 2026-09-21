/**
 * QureML — In-Website White Paper Modal & Research Gallery Gateway
 * Neo-Brutalist Gold & Onyx Edition
 * Features native local PDF embedding (/paper.pdf) to eliminate Google Drive iframe white-screen bugs,
 * single unified Research Gallery action, and strict Neo-Brutalist styling.
 */

(function () {
  const LOCAL_PDF_URL = "/paper.pdf";
  const DRIVE_VIEW_URL = "https://drive.google.com/file/d/1CzP8Fg-207rTSUjH-5K3us4KTSWe31kN/view?usp=drivesdk";
  const GALLERY_URL = "/architecture";

  function injectModalStyles() {
    if (document.getElementById("qureml-paper-modal-styles")) return;
    const style = document.createElement("style");
    style.id = "qureml-paper-modal-styles";
    style.textContent = `
      .qpm-backdrop {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.88);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s ease;
      }
      .qpm-backdrop.active {
        opacity: 1;
        visibility: visible;
      }
      .qpm-dialog {
        background: #080808;
        color: #FFFFFF;
        border: 3px solid #D4AF37;
        box-shadow: 10px 10px 0px #000000, 0 0 0 1px #D4AF37;
        border-radius: 0px;
        width: 95vw;
        max-width: 1320px;
        height: 92vh;
        max-height: 940px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.97) translateY(8px);
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .qpm-backdrop.active .qpm-dialog {
        transform: scale(1) translateY(0);
      }
      .qpm-header {
        background: #000000;
        border-bottom: 2px solid #D4AF37;
        padding: 0.75rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-shrink: 0;
      }
      .qpm-title-group {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
      }
      .qpm-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        background: #000000;
        color: #D4AF37;
        border: 1px solid #D4AF37;
        padding: 3px 8px;
        border-radius: 0px;
        letter-spacing: 0.08em;
        white-space: nowrap;
      }
      .qpm-title {
        font-family: 'Kanit', sans-serif;
        font-size: 1.15rem;
        font-weight: 900;
        color: #FFFFFF;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .qpm-actions {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        flex-shrink: 0;
      }
      .qpm-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-family: 'Kanit', sans-serif;
        font-size: 0.8rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 0.45rem 0.95rem;
        border-radius: 0px;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.12s ease;
        white-space: nowrap;
      }
      .qpm-btn-gold {
        background: #D4AF37;
        color: #000000;
        border: 2px solid #000000;
        box-shadow: 3px 3px 0px #000000;
      }
      .qpm-btn-gold:hover {
        background: #F3E5AB;
        color: #000000;
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0px #000000;
      }
      .qpm-btn-dark {
        background: #121212;
        color: #E2E8F0;
        border: 1.5px solid rgba(212, 175, 55, 0.4);
        box-shadow: 2px 2px 0px #000000;
      }
      .qpm-btn-dark:hover {
        border-color: #D4AF37;
        color: #D4AF37;
        background: #1C1C1C;
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0px #000000;
      }
      .qpm-btn-close {
        background: #000000;
        color: #D4AF37;
        border: 2px solid #D4AF37;
        font-size: 1.35rem;
        line-height: 1;
        width: 36px;
        height: 36px;
        border-radius: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 2px 2px 0px #000000;
        transition: all 0.12s ease;
      }
      .qpm-btn-close:hover {
        background: #EF4444;
        border-color: #EF4444;
        color: #FFFFFF;
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0px #000000;
      }
      .qpm-body {
        position: relative;
        flex: 1;
        min-height: 0;
        background: #141414;
        display: flex;
        flex-direction: column;
      }
      .qpm-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #1A1A1A;
      }
      .qpm-footer {
        background: #000000;
        border-top: 2px solid #1E1E1E;
        padding: 0.6rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-shrink: 0;
      }
      .qpm-footer-stats {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: #718096;
      }
      .qpm-tag {
        border: 1px solid #2D3748;
        background: #0C0C0C;
        padding: 2px 6px;
        color: #A0AEC0;
      }
      .qpm-tag b {
        color: #D4AF37;
      }
      .qpm-footer-right {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.68rem;
        color: #A0AEC0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .qpm-actions-mobile-bar {
        display: none;
      }
      @media (min-width: 769px) and (max-width: 1080px) {
        .qpm-dialog {
          width: 96vw;
          height: 94vh;
        }
        .qpm-header {
          padding: 0.6rem 1rem;
          gap: 0.75rem;
        }
        .qpm-title {
          font-size: 0.96rem;
        }
        .qpm-btn {
          font-size: 0.72rem;
          padding: 0.4rem 0.65rem;
          gap: 0.35rem;
        }
      }
      @media (max-width: 768px) {
        .qpm-backdrop {
          padding: 0;
        }
        .qpm-dialog {
          width: 100vw;
          height: 100%;
          max-height: 100dvh;
          border-width: 2.5px;
          border-radius: 0px;
          box-shadow: none;
        }
        .qpm-header {
          padding: 0.55rem 0.75rem;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .qpm-actions-desktop {
          display: none !important;
        }
        .qpm-actions-mobile-bar {
          display: flex !important;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.65rem;
          background: #0D0D0D;
          border-bottom: 2px solid #222222;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          flex-shrink: 0;
        }
        .qpm-mobile-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.65rem;
          font-family: 'Kanit', sans-serif;
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-radius: 2px;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .qpm-title {
          font-size: 0.88rem;
        }
        .qpm-badge {
          font-size: 0.6rem;
          padding: 2px 5px;
        }
        .qpm-btn-close {
          width: 36px;
          height: 36px;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .qpm-footer {
          flex-direction: column;
          align-items: stretch;
          gap: 0.35rem;
          padding: 0.45rem 0.75rem max(0.45rem, env(safe-area-inset-bottom)) 0.75rem;
        }
        .qpm-footer-stats {
          font-size: 0.6rem;
          overflow-x: auto;
          white-space: nowrap;
          width: 100%;
          gap: 0.4rem;
        }
        .qpm-footer-right {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createModalDOM() {
    let backdrop = document.getElementById("qureml-paper-modal");
    if (backdrop) return backdrop;

    injectModalStyles();

    backdrop = document.createElement("div");
    backdrop.id = "qureml-paper-modal";
    backdrop.className = "qpm-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "QureML Scientific White Paper");

    backdrop.innerHTML = `
      <div class="qpm-dialog" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="qpm-header">
          <div class="qpm-title-group">
            <span class="qpm-badge">PDF DOCUMENT</span>
            <div class="qpm-title">QureML Scientific White Paper</div>
          </div>
          <!-- Desktop Action Buttons -->
          <div class="qpm-actions qpm-actions-desktop">
            <!-- 1-Click Direct Fullscreen PDF Tab -->
            <a href="${LOCAL_PDF_URL}" target="_blank" rel="noopener noreferrer" class="qpm-btn qpm-btn-gold" title="Open full PDF in native high-performance browser tab">
              <span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span>
              <span>Open In New Tab ↗</span>
            </a>
            <!-- SINGLE Unified Research Gallery Button -->
            <a href="${GALLERY_URL}" class="qpm-btn qpm-btn-dark" title="Explore all 14 empirical figures and telemetry curves">
              <span class="material-symbols-outlined" style="font-size: 16px;">gallery_thumbnail</span>
              <span>Research Figures &rarr;</span>
            </a>
            <!-- Cloud Viewer Toggle -->
            <button type="button" id="qpm-cloud-toggle-btn" class="qpm-btn qpm-btn-dark" title="Switch between native PDF and Google Docs cloud viewer if blank">
              <span class="material-symbols-outlined" style="font-size: 15px;">cloud_sync</span>
              <span id="qpm-cloud-toggle-text">Cloud Viewer ⇄</span>
            </button>
            <!-- Download Local PDF -->
            <a href="${LOCAL_PDF_URL}" download="QureML_SIH26139_paper.pdf" class="qpm-btn qpm-btn-dark" title="Download offline PDF copy">
              <span class="material-symbols-outlined" style="font-size: 15px;">download</span>
              <span>Download</span>
            </a>
            <!-- Close Button -->
            <button type="button" class="qpm-btn-close" id="qpm-close-btn" aria-label="Close White Paper Modal">&times;</button>
          </div>
          <!-- Mobile Close Button (Top-Right) -->
          <button type="button" class="qpm-btn-close sm:hidden" id="qpm-close-btn-mobile" aria-label="Close White Paper Modal">&times;</button>
        </div>

        <!-- Dedicated Mobile Quick Action Toolbar (Thumb-Friendly, No Horizontal Overflow) -->
        <div class="qpm-actions-mobile-bar">
          <a href="${LOCAL_PDF_URL}" target="_blank" rel="noopener noreferrer" class="qpm-mobile-btn qpm-btn-gold">
            <span class="material-symbols-outlined" style="font-size: 15px;">fullscreen</span>
            <span>Fullscreen PDF ↗</span>
          </a>
          <button type="button" id="qpm-mobile-cloud-toggle" class="qpm-mobile-btn qpm-btn-dark">
            <span class="material-symbols-outlined" style="font-size: 14px;">cloud_sync</span>
            <span>Cloud Mode</span>
          </button>
          <a href="${GALLERY_URL}" class="qpm-mobile-btn qpm-btn-dark">
            <span class="material-symbols-outlined" style="font-size: 15px;">gallery_thumbnail</span>
            <span>Figures &rarr;</span>
          </a>
          <a href="${LOCAL_PDF_URL}" download="QureML_SIH26139_paper.pdf" class="qpm-mobile-btn qpm-btn-dark">
            <span class="material-symbols-outlined" style="font-size: 14px;">download</span>
            <span>Download</span>
          </a>
        </div>

        <!-- Body with Dual-Engine Viewer & Fallback Notification -->
        <div class="qpm-body">
          <div style="background: #111111; padding: 6px 12px; border-bottom: 1px solid #282828; display: flex; align-items: center; justify-content: space-between; font-family: monospace; font-size: 0.72rem; color: #9CA3AF; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="qpm-status-dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></span>
              <span id="qpm-status-text">Native PDF Renderer (/paper.pdf)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="hidden sm:inline" style="color: #6B7280;">If blank:</span>
              <button id="qpm-bar-switch-btn" type="button" style="background: #1E1E1E; color: #D4AF37; border: 1px solid #D4AF37; padding: 2px 8px; font-size: 0.68rem; font-weight: 700; cursor: pointer; text-transform: uppercase;">Switch to Cloud Viewer ⇄</button>
              <a href="${LOCAL_PDF_URL}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; font-weight: 700; text-decoration: underline;">Direct PDF ↗</a>
            </div>
          </div>
          <iframe id="qpm-iframe" class="qpm-iframe" src="" type="application/pdf" title="QureML Peer-Reviewed Scientific White Paper"></iframe>
        </div>

        <!-- Brutalist Footer Specs (Zero Duplicate Gallery Buttons) -->
        <div class="qpm-footer">
          <div class="qpm-footer-stats">
            <span class="qpm-tag"><b>6</b> CLINICAL COHORTS</span>
            <span class="qpm-tag"><b>73</b> PARAMETERS MATCHED</span>
            <span class="qpm-tag"><b>156-QUBIT</b> IBM HERON</span>
            <span class="qpm-tag"><b>ZERO-MISS</b> GATE</span>
          </div>
          <div class="qpm-footer-right">
            <span>SIH26139 COMPLIANT SPECIFICATION</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Event handlers
    const closeBtn = backdrop.querySelector("#qpm-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeWhitePaperModal);
    const closeBtnMobile = backdrop.querySelector("#qpm-close-btn-mobile");
    if (closeBtnMobile) closeBtnMobile.addEventListener("click", closeWhitePaperModal);
    backdrop.addEventListener("click", closeWhitePaperModal);

    // Cloud Viewer Toggle logic
    let useCloudViewer = false;
    function toggleViewerEngine() {
      useCloudViewer = !useCloudViewer;
      const iframe = backdrop.querySelector("#qpm-iframe");
      const statusText = backdrop.querySelector("#qpm-status-text");
      const barSwitchBtn = backdrop.querySelector("#qpm-bar-switch-btn");
      const cloudToggleText = backdrop.querySelector("#qpm-cloud-toggle-text");

      const cloudUrl = "https://docs.google.com/viewer?url=" + encodeURIComponent("https://qureml.vercel.app/paper.pdf") + "&embedded=true";
      const localUrl = LOCAL_PDF_URL + "#toolbar=1&navpanes=0";

      if (useCloudViewer) {
        if (iframe) iframe.src = cloudUrl;
        if (statusText) statusText.textContent = "Google Docs Cloud PDF Engine (Universal HTML5)";
        if (barSwitchBtn) barSwitchBtn.textContent = "Switch to Native Engine ⇄";
        if (cloudToggleText) cloudToggleText.textContent = "Native Engine ⇄";
      } else {
        if (iframe) iframe.src = localUrl;
        if (statusText) statusText.textContent = "Native PDF Renderer (/paper.pdf)";
        if (barSwitchBtn) barSwitchBtn.textContent = "Switch to Cloud Viewer ⇄";
        if (cloudToggleText) cloudToggleText.textContent = "Cloud Viewer ⇄";
      }
    }

    const cloudBtn = backdrop.querySelector("#qpm-cloud-toggle-btn");
    if (cloudBtn) cloudBtn.addEventListener("click", toggleViewerEngine);
    const barSwitchBtn = backdrop.querySelector("#qpm-bar-switch-btn");
    if (barSwitchBtn) barSwitchBtn.addEventListener("click", toggleViewerEngine);
    const mobileCloudBtn = backdrop.querySelector("#qpm-mobile-cloud-toggle");
    if (mobileCloudBtn) mobileCloudBtn.addEventListener("click", toggleViewerEngine);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("active")) {
        closeWhitePaperModal();
      }
    });

    return backdrop;
  }

  function openWhitePaperModal() {
    const backdrop = createModalDOM();
    const iframe = backdrop.querySelector("#qpm-iframe");
    // On phone screens, mobile browsers refuse inline PDF iframes, so default to cloud viewer or native url
    const isMobile = window.innerWidth <= 768;
    const initialUrl = isMobile 
      ? ("https://docs.google.com/viewer?url=" + encodeURIComponent("https://qureml.vercel.app/paper.pdf") + "&embedded=true")
      : (LOCAL_PDF_URL + "#toolbar=1&navpanes=0");
    
    if (iframe && (!iframe.src || iframe.src === "about:blank" || iframe.src === window.location.href)) {
      iframe.src = initialUrl;
      const statusText = backdrop.querySelector("#qpm-status-text");
      if (statusText) {
        statusText.textContent = isMobile 
          ? "Google Docs Cloud Engine (Mobile Safe)" 
          : "Native PDF Renderer (/paper.pdf)";
      }
    }
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeWhitePaperModal() {
    const backdrop = document.getElementById("qureml-paper-modal");
    if (backdrop) {
      backdrop.classList.remove("active");
    }
    document.body.style.overflow = "";
  }

  // Bind globally
  window.openWhitePaperModal = openWhitePaperModal;
  window.closeWhitePaperModal = closeWhitePaperModal;

  // Intercept all links referencing the White Paper Drive URL across the page
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
      const targetLink = e.target.closest('a[href*="1CzP8Fg-207rTSUjH-5K3us4KTSWe31kN"], [data-open-paper-modal="true"]');
      if (targetLink) {
        e.preventDefault();
        openWhitePaperModal();
      }
    });
  });
})();
