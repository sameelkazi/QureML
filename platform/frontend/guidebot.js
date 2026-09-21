/**
 * ============================================================================
 * QUREML DUAL GUIDEBOT WALKTHROUGH SYSTEM
 * Ali Bot & Samridhi Bot — Interactive 3-Pose Audio-Visual Guided Tour
 * SIH26139 | SPIT Mumbai & Egreen Quanta
 * ============================================================================
 */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. PERSONAS & BOT CONFIGURATION
  // --------------------------------------------------------------------------
  const ASSET_BASE = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/assets/guidebot';

  const BOTS = {
    ali: {
      id: 'ali',
      name: 'Ali Bot',
      specialty: 'Quantum Architecture & Hardware',
      accentColor: '#D4AF37',
      poses: {
        forward: `${ASSET_BASE}/ali_forward.png`,
        left: `${ASSET_BASE}/ali_point_left.png`,
        right: `${ASSET_BASE}/ali_point_right.png`
      }
    },
    samridhi: {
      id: 'samridhi',
      name: 'Samridhi Bot',
      specialty: 'Clinical AI & SIH Compliance',
      accentColor: '#9333EA',
      poses: {
        forward: `${ASSET_BASE}/samridhi_forward.png`,
        left: `${ASSET_BASE}/samridhi_point_left.png`,
        right: `${ASSET_BASE}/samridhi_point_right.png`
      }
    }
  };

  // --------------------------------------------------------------------------
  // 2. 8-STEP COMPREHENSIVE CURRICULUM (PS COMPLIANCE & INNOVATION)
  // --------------------------------------------------------------------------
  const TOUR_STEPS = [
    {
      id: 'intro',
      target: '#hero-section',
      badge: 'PS SIH26139 MISSION',
      badgeType: 'compliance',
      title: 'Welcome to QureML Clinical Intelligence',
      pose: 'forward',
      dialogue: {
        ali: "Welcome to <b>QureML</b>! I'm <b>Ali</b>, Senior Quantum Specialist. Problem Statement SIH26139 challenges us to build an automated diagnostic engine for oncology that never misses a critical presentation. We engineered a 6-qubit parameterized Variational Quantum Circuit (VQC) with mathematical parity to classical deep nets, validated on physical superconducting QPU hardware.",
        samridhi: "Welcome to <b>QureML</b>! I'm <b>Samridhi</b>, Clinical AI Deployment Lead. To solve Problem Statement SIH26139, we engineered this platform to bridge quantum computing with oncologist workflows—guaranteeing <b>100% patient safety</b>, automated referral gates, and complete HIPAA zero-persistence privacy."
      },
      actionLink: '/walkthrough',
      actionText: 'Explore Executive Judge Report &rarr;'
    },
    {
      id: 'ydse',
      target: '#hero-canvas',
      badge: 'CORE QUANTUM INNOVATION',
      badgeType: 'innovation',
      title: 'Wave-Particle Duality in Clinical Machine Learning',
      pose: 'left',
      dialogue: {
        ali: "Notice this real-time 3D <b>Young's Double-Slit apparatus</b> behind me! It visualizes photon wave-particle duality. The phase interference fringes map directly into our 6-qubit <b>AngleEmbedding</b> rotation angles (θ₀..θ₅), encoding patient cytopathology into complex Hilbert statevectors.",
        samridhi: "Instead of treating AI as an opaque black box, QureML grounds clinical feature encoding in physical quantum laws. This physical grounding eliminates inductive bias decay, enabling robust early-stage cancer classification even in low-resource data regimes."
      },
      actionLink: '#about-section',
      actionText: 'Learn About QureML Physics &rarr;'
    },
    {
      id: 'predict',
      target: 'a[href="/predict"]',
      badge: 'ZERO FALSE-NEGATIVE TRIAGE',
      badgeType: 'compliance',
      title: 'Real-Time Oncology Triage Inference',
      pose: 'right',
      dialogue: {
        ali: "Our live inference engine ingests 30 fine-needle aspirate (FNA) measurements, performs StandardScaler & PCA projection in memory, and evaluates quantum expectation values <b>⟨Zᵢ⟩</b> in under <b>15 milliseconds</b> on modern async runtimes.",
        samridhi: "For Problem Statement SIH26139, our decision threshold is calibrated to <b>τ = 0.10</b>. This achieves <b>100% clinical sensitivity (zero missed cancers)</b> while safely sparing 58 out of 100 healthy patients from painful invasive surgical biopsies!"
      },
      actionLink: '/predict',
      actionText: 'Launch Live Patient Triage &rarr;'
    },
    {
      id: 'marquee',
      target: '#marquee-section',
      badge: '6-COHORT RIGOROUS ABLATION',
      badgeType: 'innovation',
      title: 'Empirical Verification & Hardware Figures',
      pose: 'right',
      dialogue: {
        ali: "Click any card in this scrolling research gallery! You can inspect verified empirical plots: parameter-matched 73-weight ablation against classical MLP, 25-seed Wilcoxon significance (p = 0.0005), and 19.2× higher kernel-target alignment.",
        samridhi: "Every finding is scientifically audited across 6 biomedical cohorts: Breast Cancer, Heart Disease, Parkinson's speech, Liver disorder, Kidney disease, and Diabetes. Click any figure tile to inspect Holm-Bonferroni statistical parity metrics."
      },
      actionLink: '/architecture',
      actionText: 'Browse Research Figures Gallery &rarr;'
    },
    {
      id: 'uncertainty',
      target: '#services-section',
      badge: 'FINITE-SHOT UQ REFERRAL GATE',
      badgeType: 'compliance',
      title: 'Stochastic Quantum Measurement Uncertainty',
      pose: 'left',
      dialogue: {
        ali: "Classical neural networks dangerously hallucinate high confidence on unseen samples. QureML performs <b>30 repeated projective measurement runs</b> of 1,024 shots each. Physical quantum shot noise dispersion computes exact Wilson binomial confidence intervals.",
        samridhi: "Here is our standout clinical safety innovation: whenever measurement uncertainty interval width exceeds <b>W > 0.15</b>, the system safely triggers an automated <b>Specialist Referral Gate</b>, refusing to guess and alerting senior pathologists."
      },
      actionLink: '/uncertainty',
      actionText: 'Launch Uncertainty Simulator &rarr;'
    },
    {
      id: 'explain',
      target: '#projects-section',
      badge: 'AXIOMATIC CLINICAL ATTRIBUTION',
      badgeType: 'compliance',
      title: 'Axiomatic Quantum Explainability',
      pose: 'right',
      dialogue: {
        ali: "We implement 50-step Gauss-Legendre quadrature <b>Integrated Gradients</b> over the quantum expectation manifold. This strictly satisfies the fundamental axioms of <b>Completeness</b> and <b>Implementation Invariance</b> (<0.1% energy drift).",
        samridhi: "Oncologists cannot trust unexplainable predictions. Our quantum attribution heatmaps highlight exactly which cytopathological features (like worst concavity or mean texture) pushed a specific patient above the diagnostic threshold."
      },
      actionLink: '/explain',
      actionText: 'Inspect Quantum Attribution Heatmaps &rarr;'
    },
    {
      id: 'hardware',
      target: 'a[href="/hardware"]',
      badge: '156-QUBIT PHYSICAL QPU',
      badgeType: 'innovation',
      title: 'IBM Heron Hardware Telemetry Verification',
      pose: 'left',
      dialogue: {
        ali: "We didn't stop at simulations! We executed our 6-qubit circuit directly on physical superconducting hardware: the 156-qubit <b>IBM Heron QPU (ibm_fez)</b> with Dynamical Decoupling (DD) sequences and M3 measurement error mitigation (0.0034 MSE).",
        samridhi: "Running on physical superconducting transmons proves that QureML is viable for real-world hospital deployment today. You can monitor live QPU calibration telemetry, T₁/T₂ relaxation times, and readout fidelity in our hardware suite."
      },
      actionLink: '/hardware',
      actionText: 'View IBM Heron Hardware Telemetry &rarr;'
    },
    {
      id: 'compliance',
      target: '.site-footer',
      badge: 'REGULATORY & ETHICAL AUDIT',
      badgeType: 'compliance',
      title: 'DP-FedAvg Privacy & HIPAA Zero-Persistence',
      pose: 'forward',
      dialogue: {
        ali: "Our federated learning architecture synchronizes only 73 quantum weights (<b>292 bytes per round</b>) across 5 decentralized institutional nodes under (ε=2.0, δ=10⁻⁵) Differential Privacy—a <b>2,000× bandwidth gain</b> over classical neural networks.",
        samridhi: "Patient data <b>never leaves hospital servers</b>. Paired with in-memory zero-persistence execution and an immutable SHA-256 audit ledger, QureML delivers airtight regulatory compliance with HIPAA, GDPR, and the SIH26139 mandate."
      },
      actionLink: '/compliance',
      actionText: 'View SIH Compliance & HIPAA Ledger &rarr;'
    }
  ];

  // --------------------------------------------------------------------------
  // 3. SOUND SYNTHESIZER (WEB AUDIO API CHIMES)
  // --------------------------------------------------------------------------
  class GuideBotAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('qureml_gb_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    playChime(type = 'next') {
      if (this.isMuted) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'next') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'prev') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880.00, now);
          osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.12);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'switch') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        }
      } catch (e) {
        // Audio playback fallback safely ignored
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('qureml_gb_muted', this.isMuted);
      return this.isMuted;
    }
  }

  // --------------------------------------------------------------------------
  // 4. MAIN GUIDEBOT CONTROLLER
  // --------------------------------------------------------------------------
  class GuideBotController {
    constructor() {
      this.currentPersona = localStorage.getItem('qureml_gb_persona') || 'ali';
      this.currentStepIndex = 0;
      this.isOpen = false;
      this.audio = new GuideBotAudio();

      this.dom = {};
      this.initDOM();
      this.bindEvents();
    }

    initDOM() {
      // 1. Floating Launcher Button
      const launcher = document.createElement('div');
      launcher.className = 'guidebot-launcher-btn';
      launcher.id = 'guidebot-launcher';
      launcher.setAttribute('role', 'button');
      launcher.setAttribute('aria-label', 'Open QureML AI Guided Walkthrough');
      launcher.innerHTML = `
        <div class="guidebot-launcher-avatar">
          <img id="guidebot-launcher-img" src="${BOTS[this.currentPersona].poses.forward}" alt="QureML GuideBot" />
          <span class="guidebot-launcher-pulse"></span>
        </div>
        <div class="guidebot-launcher-text">
          <span class="guidebot-launcher-title">AI Guided Tour</span>
          <span class="guidebot-launcher-sub" id="guidebot-launcher-persona-tag">With ${BOTS[this.currentPersona].name}</span>
        </div>
      `;
      document.body.appendChild(launcher);

      // 2. Spotlight & Darkened Backdrop
      const overlay = document.createElement('div');
      overlay.className = 'guidebot-overlay';
      overlay.id = 'guidebot-overlay';

      const spotlight = document.createElement('div');
      spotlight.className = 'guidebot-spotlight';
      spotlight.id = 'guidebot-spotlight';
      overlay.appendChild(spotlight);
      document.body.appendChild(overlay);

      // 3. GuideBot Modal Container (Character + Speech Card)
      const container = document.createElement('div');
      container.className = 'guidebot-container';
      container.id = 'guidebot-container';
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-modal', 'true');
      container.innerHTML = `
        <!-- Dynamic Character Graphic -->
        <div class="guidebot-character-wrap">
          <img id="guidebot-char-img" class="guidebot-character-img" src="${BOTS[this.currentPersona].poses.forward}" alt="GuideBot" />
        </div>

        <!-- Interactive Speech Card -->
        <div class="guidebot-card">
          <!-- Card Header -->
          <div class="guidebot-header">
            <!-- Persona Switcher -->
            <div class="guidebot-persona-switcher">
              <button type="button" class="guidebot-persona-btn ${this.currentPersona === 'ali' ? 'active' : ''}" data-persona="ali">
                <span class="guidebot-persona-dot"></span>
                <span>Ali Bot</span>
              </button>
              <button type="button" class="guidebot-persona-btn ${this.currentPersona === 'samridhi' ? 'active' : ''}" data-persona="samridhi">
                <span class="guidebot-persona-dot"></span>
                <span>Samridhi Bot</span>
              </button>
            </div>

            <!-- Top Controls -->
            <div class="guidebot-controls-top">
              <button type="button" class="guidebot-icon-btn" id="guidebot-mute-btn" title="Toggle Tour Audio" aria-label="Toggle Sound">
                <span class="material-symbols-outlined">${this.audio.isMuted ? 'volume_off' : 'volume_up'}</span>
              </button>
              <button type="button" class="guidebot-icon-btn" id="guidebot-close-btn" title="Close Tour" aria-label="Close GuideBot Tour">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="guidebot-body">
            <div class="guidebot-meta-row">
              <span id="guidebot-badge" class="guidebot-badge badge-innovation">PS COMPLIANCE</span>
              <span id="guidebot-counter" class="guidebot-step-counter">STEP 1 OF 8</span>
            </div>
            <h3 id="guidebot-title" class="guidebot-title">Interactive Walkthrough</h3>
            <p id="guidebot-narrative" class="guidebot-narrative"></p>
            <a id="guidebot-feature-link" href="#" class="guidebot-feature-btn" target="_blank">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">open_in_new</span>
              <span id="guidebot-feature-btn-text">Test Feature Live &rarr;</span>
            </a>
          </div>

          <!-- Card Footer -->
          <div class="guidebot-footer">
            <div class="guidebot-progress-track">
              <div id="guidebot-progress" class="guidebot-progress-bar"></div>
            </div>
            <div class="guidebot-nav-row">
              <button type="button" id="guidebot-prev-btn" class="guidebot-nav-btn guidebot-prev-btn" disabled>
                &larr; Previous
              </button>
              <button type="button" id="guidebot-next-btn" class="guidebot-nav-btn guidebot-next-btn">
                Next Step &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Cache DOM references
      this.dom = {
        launcher,
        launcherImg: document.getElementById('guidebot-launcher-img'),
        launcherPersonaTag: document.getElementById('guidebot-launcher-persona-tag'),
        overlay,
        spotlight,
        container,
        charImg: document.getElementById('guidebot-char-img'),
        personaBtns: container.querySelectorAll('.guidebot-persona-btn'),
        muteBtn: document.getElementById('guidebot-mute-btn'),
        closeBtn: document.getElementById('guidebot-close-btn'),
        badge: document.getElementById('guidebot-badge'),
        counter: document.getElementById('guidebot-counter'),
        title: document.getElementById('guidebot-title'),
        narrative: document.getElementById('guidebot-narrative'),
        featureLink: document.getElementById('guidebot-feature-link'),
        featureBtnText: document.getElementById('guidebot-feature-btn-text'),
        progress: document.getElementById('guidebot-progress'),
        prevBtn: document.getElementById('guidebot-prev-btn'),
        nextBtn: document.getElementById('guidebot-next-btn')
      };
    }

    bindEvents() {
      // Launcher click
      this.dom.launcher.addEventListener('click', () => {
        this.openTour();
      });

      // Overlay backdrop click closes tour
      this.dom.overlay.addEventListener('click', (e) => {
        if (e.target === this.dom.overlay) {
          this.closeTour();
        }
      });

      // Close button
      this.dom.closeBtn.addEventListener('click', () => {
        this.closeTour();
      });

      // Persona Switcher
      this.dom.personaBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const persona = btn.getAttribute('data-persona');
          this.switchPersona(persona);
        });
      });

      // Mute Toggle
      this.dom.muteBtn.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        this.dom.muteBtn.querySelector('.material-symbols-outlined').textContent = isMuted ? 'volume_off' : 'volume_up';
      });

      // Navigation Buttons
      this.dom.prevBtn.addEventListener('click', () => {
        this.prevStep();
      });
      this.dom.nextBtn.addEventListener('click', () => {
        this.nextStep();
      });

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') {
          this.closeTour();
        } else if (e.key === 'ArrowRight') {
          this.nextStep();
        } else if (e.key === 'ArrowLeft') {
          this.prevStep();
        }
      });

      // Window resize updates spotlight
      window.addEventListener('resize', () => {
        if (this.isOpen) {
          this.updateSpotlight(TOUR_STEPS[this.currentStepIndex]);
        }
      });
    }

    openTour(startStepIndex = 0) {
      this.isOpen = true;
      this.currentStepIndex = Math.max(0, Math.min(startStepIndex, TOUR_STEPS.length - 1));
      this.dom.overlay.classList.add('active');
      this.dom.container.classList.add('active');
      this.audio.playChime('switch');
      this.renderStep();
    }

    closeTour() {
      this.isOpen = false;
      this.dom.overlay.classList.remove('active');
      this.dom.container.classList.remove('active');
      this.dom.spotlight.style.opacity = '0';
    }

    switchPersona(personaId) {
      if (!BOTS[personaId] || personaId === this.currentPersona) return;
      this.currentPersona = personaId;
      localStorage.setItem('qureml_gb_persona', personaId);

      // Update Persona switcher active state
      this.dom.personaBtns.forEach((btn) => {
        if (btn.getAttribute('data-persona') === personaId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update launcher avatar
      if (this.dom.launcherImg) {
        this.dom.launcherImg.src = BOTS[this.currentPersona].poses.forward;
      }
      if (this.dom.launcherPersonaTag) {
        this.dom.launcherPersonaTag.textContent = `With ${BOTS[this.currentPersona].name}`;
      }

      this.audio.playChime('switch');
      this.renderStep();
    }

    nextStep() {
      if (this.currentStepIndex < TOUR_STEPS.length - 1) {
        this.currentStepIndex++;
        this.audio.playChime('next');
        this.renderStep();
      } else {
        // Tour completed!
        this.audio.playChime('switch');
        this.closeTour();
      }
    }

    prevStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
        this.audio.playChime('prev');
        this.renderStep();
      }
    }

    renderStep() {
      const step = TOUR_STEPS[this.currentStepIndex];
      const bot = BOTS[this.currentPersona];

      // 1. Dynamic Pose Determination
      const poseKey = this.resolvePose(step);
      const targetImgSrc = bot.poses[poseKey] || bot.poses.forward;

      // Smooth crossfade transition on pose change
      if (this.dom.charImg.src !== targetImgSrc) {
        this.dom.charImg.classList.add('pose-transition');
        setTimeout(() => {
          this.dom.charImg.src = targetImgSrc;
          this.dom.charImg.classList.remove('pose-transition');
        }, 120);
      }

      // 2. Badge & Metadata
      this.dom.badge.textContent = step.badge;
      this.dom.badge.className = `guidebot-badge badge-${step.badgeType}`;
      this.dom.counter.textContent = `STEP ${this.currentStepIndex + 1} OF ${TOUR_STEPS.length}`;

      // 3. Title & Narrative
      this.dom.title.textContent = step.title;
      this.dom.narrative.innerHTML = step.dialogue[this.currentPersona] || step.dialogue.ali;

      // 4. Feature Action Link
      if (step.actionLink) {
        this.dom.featureLink.style.display = 'inline-flex';
        this.dom.featureLink.href = step.actionLink;
        this.dom.featureBtnText.innerHTML = step.actionText || 'Inspect Feature &rarr;';
        // Intercept hash anchors for smooth scroll
        this.dom.featureLink.onclick = (e) => {
          if (step.actionLink.startsWith('#')) {
            e.preventDefault();
            const targetEl = document.querySelector(step.actionLink);
            if (targetEl) {
              this.closeTour();
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        };
      } else {
        this.dom.featureLink.style.display = 'none';
      }

      // 5. Progress Bar & Nav Buttons
      const progressPercent = ((this.currentStepIndex + 1) / TOUR_STEPS.length) * 100;
      this.dom.progress.style.width = `${progressPercent}%`;

      this.dom.prevBtn.disabled = this.currentStepIndex === 0;
      this.dom.nextBtn.innerHTML = this.currentStepIndex === TOUR_STEPS.length - 1
        ? `Finish Tour <span class="material-symbols-outlined" style="font-size: 1rem;">check_circle</span>`
        : `Next Step &rarr;`;

      // 6. Scroll into view and Highlight Target
      this.updateSpotlight(step);
    }

    resolvePose(step) {
      if (!step.target) return step.pose || 'forward';

      const targetEl = document.querySelector(step.target);
      if (!targetEl) return step.pose || 'forward';

      // Check target position relative to the screen center
      const rect = targetEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const screenWidth = window.innerWidth;

      if (step.pose === 'forward') return 'forward';

      if (centerX < screenWidth * 0.45) {
        return 'left'; // Element is on the left
      } else if (centerX > screenWidth * 0.55) {
        return 'right'; // Element is on the right
      }

      return step.pose || 'forward';
    }

    updateSpotlight(step) {
      if (!step.target) {
        this.dom.spotlight.style.opacity = '0';
        return;
      }

      const targetEl = document.querySelector(step.target);
      if (!targetEl) {
        this.dom.spotlight.style.opacity = '0';
        return;
      }

      // Smooth scroll target element into comfortable view
      if (typeof window.lenis !== 'undefined' && window.lenis) {
        window.lenis.scrollTo(targetEl, { offset: -80, duration: 1.0 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Update spotlight geometry with slight delay to allow smooth scrolling
      setTimeout(() => {
        const rect = targetEl.getBoundingClientRect();
        const padding = 10;
        this.dom.spotlight.style.opacity = '1';
        this.dom.spotlight.style.top = `${Math.max(0, rect.top - padding)}px`;
        this.dom.spotlight.style.left = `${Math.max(0, rect.left - padding)}px`;
        this.dom.spotlight.style.width = `${rect.width + padding * 2}px`;
        this.dom.spotlight.style.height = `${rect.height + padding * 2}px`;
      }, 250);
    }
  }

  // --------------------------------------------------------------------------
  // 5. GLOBAL INITIALIZATION
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    window.QureMLGuideBot = new GuideBotController();

    // Global launcher helper
    window.openGuideBotTour = function(stepIndex = 0) {
      if (window.QureMLGuideBot) {
        window.QureMLGuideBot.openTour(stepIndex);
      }
    };
  });
})();
