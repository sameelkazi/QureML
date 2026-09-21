/**
 * QureML — In-Website White Paper Modal & Research Gallery Gateway
 * Embeds the peer-reviewed White Paper PDF via Google Drive preview in an elegant
 * in-website popup with direct access to the 14-Figure Comprehensive Research Gallery.
 */

(function () {
  const DRIVE_PREVIEW_URL = "https://drive.google.com/file/d/1CzP8Fg-207rTSUjH-5K3us4KTSWe31kN/preview";
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
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s ease;
      }
      .qpm-backdrop.active {
        opacity: 1;
        visibility: visible;
      }
      .qpm-dialog {
        background: #0C0C0C;
        color: #FFFFFF;
        border: 3px solid #D4AF37;
        box-shadow: 8px 8px 0px #000000, 0 0 35px rgba(212, 175, 55, 0.3);
        border-radius: 14px;
        width: 94vw;
        max-width: 1280px;
        height: 90vh;
        max-height: 900px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.96) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .qpm-backdrop.active .qpm-dialog {
        transform: scale(1) translateY(0);
      }
      .qpm-header {
        background: #141414;
        border-bottom: 2px solid rgba(212, 175, 55, 0.4);
        padding: 0.85rem 1.25rem;
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
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        background: #D4AF37;
        color: #000000;
        padding: 2px 8px;
        border-radius: 4px;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }
      .qpm-title {
        font-family: var(--font-kanit, sans-serif);
        font-size: 1.05rem;
        font-weight: 800;
        color: #FFFFFF;
        text-transform: uppercase;
        letter-spacing: 0.02em;
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
        gap: 0.4rem;
        font-family: var(--font-kanit, sans-serif);
        font-size: 0.76rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        padding: 0.42rem 0.85rem;
        border-radius: 6px;
        border: 2px solid #000000;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s ease;
        white-space: nowrap;
      }
      .qpm-btn-gold {
        background: #FFE600;
        color: #000000;
        box-shadow: 2.5px 2.5px 0px #000000;
      }
      .qpm-btn-gold:hover {
        background: #5BFFA0;
        transform: translate(-1px, -1px);
        box-shadow: 3.5px 3.5px 0px #000000;
      }
      .qpm-btn-white {
        background: #FFFFFF;
        color: #000000;
        box-shadow: 2px 2px 0px #000000;
      }
      .qpm-btn-white:hover {
        background: #F1F5F9;
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0px #000000;
      }
      .qpm-btn-close {
        background: #1F1F1F;
        color: #FFFFFF;
        border: 1.5px solid rgba(255, 255, 255, 0.2);
        font-size: 1.3rem;
        line-height: 1;
        width: 34px;
        height: 34px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .qpm-btn-close:hover {
        background: #EF4444;
        border-color: #EF4444;
        color: #FFFFFF;
        transform: scale(1.05);
      }
      .qpm-body {
        position: relative;
        flex: 1;
        min-height: 0;
        background: #181818;
      }
      .qpm-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #FFFFFF;
      }
      .qpm-footer {
        background: #111111;
        border-top: 1.5px solid rgba(212, 175, 55, 0.3);
        padding: 0.65rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-shrink: 0;
      }
      .qpm-footer-stats {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.68rem;
        color: #A0AEC0;
      }
      .qpm-footer-stats span b {
        color: #D4AF37;
      }
      @media (max-width: 768px) {
        .qpm-dialog {
          width: 98vw;
          height: 94vh;
          margin: 0;
          border-width: 2px;
        }
        .qpm-header {
          padding: 0.6rem 0.85rem;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }
        .qpm-actions {
          justify-content: space-between;
          width: 100%;
        }
        .qpm-title {
          font-size: 0.85rem;
        }
        .qpm-footer {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
        }
        .qpm-footer-stats {
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
            <span class="qpm-badge">Peer-Reviewed PDF</span>
            <div class="qpm-title">QureML Scientific White Paper</div>
          </div>
          <div class="qpm-actions">
            <a href="${GALLERY_URL}" class="qpm-btn qpm-btn-gold" title="Explore all 14 empirical figures and telemetry curves">
              <span class="material-symbols-outlined" style="font-size: 15px;">gallery_thumbnail</span>
              <span>Research Figures Gallery &rarr;</span>
            </a>
            <a href="${DRIVE_VIEW_URL}" target="_blank" rel="noopener noreferrer" class="qpm-btn qpm-btn-white" title="Open PDF in Google Drive full page">
              <span class="material-symbols-outlined" style="font-size: 15px;">open_in_new</span>
              <span>Open Drive Full</span>
            </a>
            <button type="button" class="qpm-btn-close" id="qpm-close-btn" aria-label="Close White Paper Modal">&times;</button>
          </div>
        </div>

        <!-- Body with Google Drive Preview iFrame -->
        <div class="qpm-body">
          <iframe id="qpm-iframe" class="qpm-iframe" src="" allow="autoplay" loading="lazy"></iframe>
        </div>

        <!-- Footer -->
        <div class="qpm-footer">
          <div class="qpm-footer-stats">
            <span><b>6</b> Clinical Cohorts</span>
            <span>&bull;</span>
            <span><b>73</b> Matched Parameters</span>
            <span>&bull;</span>
            <span><b>156-Qubit</b> IBM Heron Telemetry</span>
            <span>&bull;</span>
            <span><b>Zero-Miss</b> Gate</span>
          </div>
          <div class="flex items-center gap-2">
            <a href="${GALLERY_URL}" class="qpm-btn qpm-btn-gold" style="font-size: 0.72rem; padding: 0.35rem 0.75rem;">
              <span>View 14 Empirical Figures &rarr;</span>
            </a>
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
    if (iframe && (!iframe.src || iframe.src === "about:blank")) {
      iframe.src = DRIVE_PREVIEW_URL;
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
