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
      @media (max-width: 768px) {
        .qpm-dialog {
          width: 98vw;
          height: 95vh;
          border-width: 2px;
        }
        .qpm-header {
          padding: 0.5rem 0.75rem;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }
        .qpm-actions {
          justify-content: space-between;
          width: 100%;
        }
        .qpm-title {
          font-size: 0.9rem;
        }
        .qpm-footer {
          flex-direction: column;
          align-items: stretch;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
        }
        .qpm-footer-stats {
          font-size: 0.62rem;
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
          <div class="qpm-actions">
            <!-- SINGLE Unified Research Gallery Button -->
            <a href="${GALLERY_URL}" class="qpm-btn qpm-btn-gold" title="Explore all 14 empirical figures and telemetry curves">
              <span class="material-symbols-outlined" style="font-size: 16px;">gallery_thumbnail</span>
              <span>Research Figures Gallery &rarr;</span>
            </a>
            <!-- Direct Drive view link -->
            <a href="${DRIVE_VIEW_URL}" target="_blank" rel="noopener noreferrer" class="qpm-btn qpm-btn-dark" title="Open PDF in Google Drive full page">
              <span class="material-symbols-outlined" style="font-size: 15px;">open_in_new</span>
              <span>Drive Link</span>
            </a>
            <!-- Download Local PDF -->
            <a href="${LOCAL_PDF_URL}" download="QureML_SIH26139_paper.pdf" class="qpm-btn qpm-btn-dark" title="Download offline PDF copy">
              <span class="material-symbols-outlined" style="font-size: 15px;">download</span>
              <span>Download</span>
            </a>
            <!-- Close Button -->
            <button type="button" class="qpm-btn-close" id="qpm-close-btn" aria-label="Close White Paper Modal">&times;</button>
          </div>
        </div>

        <!-- Body with Direct Local PDF Viewer (No Google Drive white screen bug) -->
        <div class="qpm-body">
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
    backdrop.addEventListener("click", closeWhitePaperModal);

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
    // Point directly to local PDF to guarantee instant, 0-latency rendering without white screen
    if (iframe && (!iframe.src || iframe.src === "about:blank" || !iframe.src.includes(LOCAL_PDF_URL))) {
      iframe.src = LOCAL_PDF_URL + "#toolbar=1&navpanes=0";
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
