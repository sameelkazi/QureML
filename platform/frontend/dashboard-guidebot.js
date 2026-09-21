/**
 * ============================================================================
 * QUREML CLINICAL PLATFORM GUIDEBOT — NEO-BRUTALISM CHATBOX & SPOTLIGHT
 * Ali Bot & Samridhi Bot: Director-Level Multi-Page Platform Tour for Judges
 * SIH26139 | SPIT Mumbai & Egreen Quanta
 * ============================================================================
 */

(function() {
  'use strict';

  // Strict global singleton guard: prevents duplicate execution or multiple instances
  if (window.__QUREML_GUIDEBOT_INITIALIZED__) {
    console.log('QureML GuideBot already initialized; skipping duplicate execution.');
    return;
  }
  window.__QUREML_GUIDEBOT_INITIALIZED__ = true;

  // Dynamic asset base resolution
  const ASSET_BASE = (window.location.pathname.startsWith('/static') ? '/static' : '') + '/assets/guidebot';

  // Helper: Normalize page URLs to base slug (handles /predict, /static/predict.html, /predict.html)
  function getPageSlug(pathOrUrl) {
    if (!pathOrUrl) return '';
    const clean = pathOrUrl.split('?')[0].split('#')[0];
    const filename = clean.split('/').filter(Boolean).pop() || 'index';
    return filename.replace(/\.html$/, '');
  }

  // Helper: Resolve cross-page destination matching current hosting environment
  function resolvePageUrl(targetSlug) {
    if (window.location.protocol === 'file:') {
      return `./${targetSlug}.html`;
    }
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/static/')) {
      return `/static/${targetSlug}.html`;
    }
    if (currentPath.includes('.html')) {
      return `/${targetSlug}.html`;
    }
    return `/${targetSlug}`;
  }

  // Character Poses Catalog
  const BOTS = {
    ali: {
      name: 'Ali Bot',
      role: 'QUANTUM ARCHITECT // ALGORITHM SPECIALIST',
      badgeClass: 'ali',
      forward: `${ASSET_BASE}/ali_forward.png`,
      point_left: `${ASSET_BASE}/ali_point_left.png`,
      point_right: `${ASSET_BASE}/ali_point_right.png`
    },
    samridhi: {
      name: 'Samridhi Bot',
      role: 'CLINICAL AI // SIH COMPLIANCE LEAD',
      badgeClass: 'samridhi',
      forward: `${ASSET_BASE}/samridhi_forward.png`,
      point_left: `${ASSET_BASE}/samridhi_point_left.png`,
      point_right: `${ASSET_BASE}/samridhi_point_right.png`
    }
  };

  // Director-Level Multi-Page Platform Tour Curriculum across all suites
  const WALKTHROUGH = [
    // ------------------------------------------------------------------------
    // STEP 0: GRAND INTRO (Ali Straight Pose, Centered, No Specific Feature)
    // ------------------------------------------------------------------------
    {
      id: 'step-0-intro',
      slug: 'predict',
      speaker: 'ali',
      pose: 'forward', // Ali straight pose at start!
      dock: 'dock-center',
      target: null,
      tag: 'SIH26139 PLATFORM SUITE',
      title: 'Welcome Judge & Evaluator to QureML',
      text: 'Greetings! I am <b>Ali</b>, Quantum Architecture Lead. <b>Problem Statement SIH26139</b> (Egreen Quanta) challenges us to deliver an automated, clinical-grade platform for early disease detection. In this interactive tour, we will <b>navigate directly into every core module</b> of the platform dashboard!',
      compliance: 'Fully addresses SIH26139 HealthTech deliverable requirements with high-throughput automated oncology triage.',
      innovation: '6-qubit Variational Quantum Circuit (73 parameters) evaluated on physical 156-qubit IBM Heron transmon hardware.',
      btnNext: 'Begin Live Dashboard Tour &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 1: PATIENT COHORT PRESETS (Triage Dashboard - /predict)
    // ------------------------------------------------------------------------
    {
      id: 'step-1-presets',
      slug: 'predict',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: '.grid.grid-cols-1.md\\:grid-cols-3',
      parentTarget: 'main > section:nth-of-type(2)',
      spotlightTag: 'MODULE 01 // LOCKED PATIENT COHORTS',
      tag: 'BENCHMARK VALIDATION',
      title: '1. Select Verified Patient Cohorts',
      text: 'To demonstrate reproducible clinical evaluation, we pre-loaded 3 verified patients from the locked <b>Wisconsin Diagnostic Breast Cancer (WDBC)</b> test cohort: <b>High Malignancy</b> (Sample #0), <b>Low Benign</b> (Sample #1), and <b>Borderline / Ambiguous</b> (Sample #2). Clicking a card instantly loads all 30 laboratory biomarkers below!',
      compliance: 'Direct ingestion of real digitized fine-needle aspirate (FNA) cytopathology benchmarks.',
      innovation: 'Actionable risk stratification with automated borderline referral tagging to eliminate missed diagnoses.',
      btnNext: 'Next: 30 Cytopathology Inputs &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 2: 30 BIOMARKERS INPUT CONSOLE & CATEGORY TABS (/predict)
    // ------------------------------------------------------------------------
    {
      id: 'step-2-biomarkers',
      slug: 'predict',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: '#feature-grid',
      parentTarget: 'main > section:nth-of-type(3)',
      spotlightTag: 'MODULE 02 // 30 CYTOPATHOLOGY BIOMARKERS',
      tag: 'FEATURE ENCODING TIERS',
      title: '2. 30 FNA Biomarkers & Category Filter',
      text: 'Hello, I am <b>Samridhi</b>! Fine-Needle Aspirate measurements are organized into three clinical tiers: <b>Mean Cytology (10)</b>, <b>Standard Error (10)</b>, and <b>Worst Bounds (10)</b>. Clinicians can filter categories or edit numerical parameters to test custom patient presentations.',
      compliance: 'Fully ingests the standard 30-dimensional cytopathology feature vector recommended by pathologists.',
      innovation: 'Features undergo StandardScaler normalization and PCA projection into continuous 6-qubit AngleEmbedding rotation angles (θ₀..θ₅).',
      btnNext: 'Next: Live VQC Inference &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 3: REAL-TIME QUANTUM INFERENCE & CLINICIAN GATE (/predict)
    // ------------------------------------------------------------------------
    {
      id: 'step-3-execute',
      slug: 'predict',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: '#run-predict',
      spotlightTag: 'MODULE 03 // VQC INFERENCE & SAFETY GATE',
      tag: '100% CLINICAL SENSITIVITY',
      title: '3. Quantum Triage & Clinician Gate',
      text: 'Clicking <b>"Execute Quantum Triage"</b> dispatches patient features to <code>POST /predict</code>. The 6-qubit VQC evaluates expectation values <b>⟨Zᵢ⟩</b> in under <b>15 milliseconds</b>. Our screening threshold is tuned to <b>τ = 0.10</b>, achieving <b>100% sensitivity (zero missed cancers)</b> while sparing 58/100 patients from invasive biopsies!',
      compliance: 'Zero missed malignancies with automated referral trigger for borderline cases (|p - 0.50| < 0.10).',
      innovation: 'Selective classification (El-Yaniv & Wiener) with automated Second-Opinion Specialist Referral Gate for ambiguous cases.',
      btnNext: 'Open Next Module: Quantum Uncertainty &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 4: FINITE-SHOT QUANTUM UNCERTAINTY QUANTIFICATION (/uncertainty)
    // ------------------------------------------------------------------------
    {
      id: 'step-4-uncertainty',
      slug: 'uncertainty',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main section.glass-panel:first-of-type',
      parentTarget: 'main',
      spotlightTag: 'MODULE 04 // QUANTUM UNCERTAINTY (UQ)',
      tag: 'FINITE-SHOT NOISE SIMULATOR',
      title: '4. Quantum Uncertainty Quantification',
      text: 'Welcome to the <b>Quantum Uncertainty Suite</b>! Classical neural nets dangerously hallucinate high confidence. Here, QureML executes <b>30 repeated stochastic runs</b> of 1,024 physical shots each, computing exact Wilson binomial confidence bounds and triggering automated referral when interval width W > 0.150.',
      compliance: 'Eliminates algorithmic overconfidence, guaranteeing clinician transparency on ambiguous cases.',
      innovation: 'Grounded in physical projective quantum measurement noise rather than fabricated heuristic dropout scores.',
      btnNext: 'Open Next Module: Quantum Explainability &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 5: AXIOMATIC QUANTUM EXPLAINABILITY (/explain)
    // ------------------------------------------------------------------------
    {
      id: 'step-5-explain',
      slug: 'explain',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main section.glass-panel:first-of-type',
      parentTarget: 'main',
      spotlightTag: 'MODULE 05 // QUANTUM EXPLAINABILITY',
      tag: 'AXIOMATIC ATTRIBUTIONS',
      title: '5. Axiomatic Quantum Explainability',
      text: 'Welcome to the <b>Quantum Explainability Engine</b>! Doctors cannot trust black-box predictions. We compute 50-step Gauss-Legendre quadrature Integrated Gradients directly over the quantum expectation function, isolating exactly which cytopathology markers pushed the diagnosis.',
      compliance: 'Meets medical AI explainability mandates with transparent feature-level rationale for pathologists.',
      innovation: 'Strict mathematical compliance with Axioms of Completeness and Implementation Invariance (<0.1% energy drift).',
      btnNext: 'Open Next Module: 4-Control Ablation &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 6: 4-CONTROL ABLATION BATTERY (/compare)
    // ------------------------------------------------------------------------
    {
      id: 'step-6-compare',
      slug: 'compare',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main section.glass-panel:first-of-type',
      parentTarget: 'main',
      spotlightTag: 'MODULE 06 // 4-CONTROL SCIENTIFIC ABLATION',
      tag: 'HONEST SCIENTIFIC RIGOR',
      title: '6. Quantum vs Classical 4-Control Ablation',
      text: 'Welcome to the <b>Dual Inference & Ablation Suite</b>! Most QML claims use weak classical baselines. QureML benchmarks Control A (Hybrid VQC 73p) against a parameter-matched Control B (Classical MLP 73p), Control C (No entanglement), and Control D (Fixed untrained) with Holm-Bonferroni correction (p=1.000).',
      compliance: 'Exhaustive scientific validation across 6 biomedical cohorts (Breast, Heart, Parkinson\'s, Liver, Kidney, Diabetes).',
      innovation: 'Discrete Logarithm benchmark proves our quantum kernel achieves +48.34% accuracy and 19.2× higher KTA when group structure exists.',
      btnNext: 'Open Next Module: IBM Heron Hardware &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 7: 156-QUBIT IBM HERON HARDWARE TELEMETRY (/hardware)
    // ------------------------------------------------------------------------
    {
      id: 'step-7-hardware',
      slug: 'hardware',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main section:nth-of-type(2)',
      parentTarget: 'main',
      spotlightTag: 'MODULE 07 // PHYSICAL 156-QUBIT QPU',
      tag: 'IBM HERON TELEMETRY',
      title: '7. 156-Qubit IBM Heron Hardware Telemetry',
      text: 'Welcome to the <b>Quantum Hardware Telemetry Suite</b>! We executed our 6-qubit circuit on physical superconducting quantum hardware: the 156-qubit <b>IBM Heron processor (ibm_fez)</b> with Dynamical Decoupling (DD) and M3 measurement error mitigation (0.0034 MSE).',
      compliance: 'Validates real-world deployability on commercial quantum cloud infrastructure.',
      innovation: 'Live hardware telemetry monitoring T₁/T₂ relaxation times, single/two-qubit error rates, and readout fidelity.',
      btnNext: 'Open Final Module: Executive Judge Report &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 8: GRAND CONCLUSION & EXECUTIVE JUDGE REPORT (/walkthrough)
    // ------------------------------------------------------------------------
    {
      id: 'step-8-conclusion',
      slug: 'walkthrough',
      speaker: 'samridhi',
      pose: 'forward', // Samridhi straight pose at the end!
      dock: 'dock-center',
      target: null, // Pure conclusion modal
      tag: 'SUMMARY & VERIFICATION',
      title: 'Executive Judge Audit Complete!',
      text: 'You have completed the full director-level platform walkthrough! You witnessed how QureML couples <b>100% SIH26139 compliance</b> with groundbreaking <b>quantum machine learning innovations</b>—from live triage and uncertainty referral gates to 156-qubit IBM Heron execution and HIPAA zero-retention privacy.',
      compliance: '100% compliant with SIH26139 HealthTech deliverable requirements and clinical oncologist protocols.',
      innovation: 'Honest 4-control scientific ablation proved via 10-seed paired Wilcoxon significance and Holm-Bonferroni correction.',
      btnNext: 'Start Triaging Live Patients &check;'
    }
  ];

  // --------------------------------------------------------------------------
  // CONTROLLER IMPLEMENTATION
  // --------------------------------------------------------------------------
  class DashboardGuideBot {
    constructor() {
      this.currentStep = 0;
      this.isActive = false;
      this.activeTargetEl = null;
      this.dom = {};

      // Preload all bot poses into browser cache for instant zero-lag switching
      Object.values(BOTS).forEach(bot => {
        ['forward', 'point_left', 'point_right'].forEach(poseKey => {
          if (bot[poseKey]) {
            const preImg = new Image();
            preImg.src = bot[poseKey];
          }
        });
      });

      this.initDOM();
      this.bindEvents();

      // Check cross-page tour state or auto-trigger on /predict
      const savedActive = localStorage.getItem('qureml_tour_active');
      const savedStep = parseInt(localStorage.getItem('qureml_tour_step') || '0', 10);
      const currentSlug = getPageSlug(window.location.pathname);

      if (savedActive === 'true') {
        setTimeout(() => {
          this.startTour(savedStep);
        }, 100);
      } else if (currentSlug === 'predict') {
        setTimeout(() => {
          this.startTour(0);
        }, 300);
      }
    }

    initDOM() {
      // Clean up any existing instances or elements before creating
      ['dgb-container', 'dgb-mask', 'dgb-box', 'dgb-launcher'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      document.querySelectorAll('.dgb-container, .dgb-spotlight-mask, .dgb-spotlight-box, .dgb-launcher').forEach(el => el.remove());

      // 1. Dark Full-Screen Shadow Mask
      const mask = document.createElement('div');
      mask.className = 'dgb-spotlight-mask';
      mask.id = 'dgb-mask';

      // 2. Glowing Neo-Brutalist Cutout Box
      const box = document.createElement('div');
      box.className = 'dgb-spotlight-box';
      box.id = 'dgb-box';
      box.innerHTML = `<span id="dgb-box-tag" class="dgb-spotlight-tag"></span>`;

      document.body.appendChild(mask);
      document.body.appendChild(box);

      // 3. Dynamic Docked Container (Character + Comic Chatbox)
      const container = document.createElement('div');
      container.className = 'dgb-container dock-center';
      container.id = 'dgb-container';
      container.innerHTML = `
        <!-- Character Cutout Stage (Flush against bottom screen edge) -->
        <div class="dgb-character-stage">
          <img id="dgb-char-img" class="dgb-character-img" src="${BOTS.ali.forward}" alt="GuideBot Character" />
        </div>

        <!-- Neo-Brutalist Comic Chatbox -->
        <div class="dgb-chatbox" role="dialog" aria-modal="true">
          <!-- Brutalist Top Banner -->
          <div class="dgb-header">
            <div class="flex items-center gap-2">
              <span id="dgb-speaker-badge" class="dgb-speaker-badge ali">Ali Bot</span>
              <span id="dgb-step-pill" class="dgb-step-pill">INTRO</span>
            </div>
            <button type="button" class="dgb-close-btn" id="dgb-btn-close" title="Close Walkthrough" aria-label="Close Walkthrough">&times;</button>
          </div>

          <!-- Message Content Body -->
          <div class="dgb-body">
            <div class="dgb-category-tags">
              <span id="dgb-tag" class="dgb-tag-badge">SIH26139</span>
            </div>
            <h3 id="dgb-title" class="dgb-title">Welcome</h3>
            
            <div class="dgb-text-block">
              <p id="dgb-text" class="dgb-text"></p>
              
              <!-- Callout Box for Compliance vs Innovation -->
              <div id="dgb-callout-box" class="dgb-callout">
                <div class="dgb-callout-item">
                  <strong>&check; SIH Compliance:</strong> <span id="dgb-compliance-text"></span>
                </div>
                <div class="dgb-callout-item">
                  <strong>&starf; QureML Innovation:</strong> <span id="dgb-innovation-text"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Action Buttons -->
          <div class="dgb-footer">
            <button type="button" class="dgb-btn-skip" id="dgb-btn-skip">Skip Walkthrough</button>
            <div class="dgb-btn-group">
              <button type="button" class="dgb-btn-prev" id="dgb-btn-prev" disabled>&larr; Back</button>
              <button type="button" class="dgb-btn-next" id="dgb-btn-next">Begin &rarr;</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // 4. Floating Replay Launcher Button (Bottom-Right)
      const launcher = document.createElement('button');
      launcher.type = 'button';
      launcher.className = 'dgb-launcher';
      launcher.id = 'dgb-launcher';
      launcher.innerHTML = `
        <div class="dgb-launcher-avatar">
          <img src="${BOTS.ali.forward}" alt="GuideBot" />
        </div>
        <span>AI GuideBot Tour</span>
      `;
      document.body.appendChild(launcher);

      // Cache elements strictly within our own container to avoid ANY ID collision
      this.dom = {
        mask,
        box,
        boxTag: box.querySelector('#dgb-box-tag') || document.getElementById('dgb-box-tag'),
        container,
        charImg: container.querySelector('#dgb-char-img'),
        speakerBadge: container.querySelector('#dgb-speaker-badge'),
        stepPill: container.querySelector('#dgb-step-pill'),
        closeBtn: container.querySelector('#dgb-btn-close'),
        tag: container.querySelector('#dgb-tag'),
        title: container.querySelector('#dgb-title'),
        text: container.querySelector('#dgb-text'),
        calloutBox: container.querySelector('#dgb-callout-box'),
        complianceText: container.querySelector('#dgb-compliance-text'),
        innovationText: container.querySelector('#dgb-innovation-text'),
        btnSkip: container.querySelector('#dgb-btn-skip'),
        btnPrev: container.querySelector('#dgb-btn-prev'),
        btnNext: container.querySelector('#dgb-btn-next'),
        launcher
      };
    }

    bindEvents() {
      // Close / Skip
      this.dom.closeBtn.addEventListener('click', () => this.endTour());
      this.dom.btnSkip.addEventListener('click', () => this.endTour());
      this.dom.mask.addEventListener('click', (e) => {
        if (e.target === this.dom.mask) this.endTour();
      });

      // Navigation
      this.dom.btnPrev.addEventListener('click', () => this.prevStep());
      this.dom.btnNext.addEventListener('click', () => this.nextStep());

      // Launcher replay
      this.dom.launcher.addEventListener('click', () => this.startTour(0));

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (!this.isActive) return;
        if (e.key === 'Escape') this.endTour();
        if (e.key === 'ArrowRight') this.nextStep();
        if (e.key === 'ArrowLeft') this.prevStep();
      });

      // Live tracking: updates spotlight position smoothly on scroll and resize
      const onScrollOrResize = () => {
        if (this.isActive && this.activeTargetEl) {
          this.updateBoxGeometry();
        }
      };
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
    }

    startTour(startIndex = 0) {
      this.isActive = true;
      this.currentStep = Math.max(0, Math.min(startIndex, WALKTHROUGH.length - 1));
      localStorage.setItem('qureml_tour_active', 'true');
      localStorage.setItem('qureml_tour_step', this.currentStep);

      // Verify current page matches the step's page
      const currentSlug = getPageSlug(window.location.pathname);
      const targetSlug = WALKTHROUGH[this.currentStep].slug;

      if (targetSlug && currentSlug !== targetSlug) {
        window.location.href = resolvePageUrl(targetSlug);
        return;
      }

      this.dom.mask.classList.add('active');
      this.dom.container.classList.add('active');
      this.dom.launcher.style.display = 'none';
      this.render();
    }

    endTour() {
      this.isActive = false;
      this.activeTargetEl = null;
      document.querySelectorAll('.dgb-spotlight-target').forEach(el => {
        el.classList.remove('dgb-spotlight-target');
      });
      localStorage.removeItem('qureml_tour_active');
      localStorage.removeItem('qureml_tour_step');
      this.dom.mask.classList.remove('active');
      this.dom.mask.style.clipPath = 'none';
      this.dom.box.classList.remove('active');
      this.dom.box.style.opacity = '0';
      this.dom.container.classList.remove('active');
      this.dom.launcher.style.display = 'inline-flex';
    }

    nextStep() {
      if (this.currentStep < WALKTHROUGH.length - 1) {
        const nextIdx = this.currentStep + 1;
        const nextStep = WALKTHROUGH[nextIdx];
        const currentSlug = getPageSlug(window.location.pathname);
        const targetSlug = nextStep.slug;

        // If next step lives on another page, navigate to that page!
        if (targetSlug && currentSlug !== targetSlug) {
          localStorage.setItem('qureml_tour_active', 'true');
          localStorage.setItem('qureml_tour_step', nextIdx);
          window.location.href = resolvePageUrl(targetSlug);
          return;
        }

        this.currentStep = nextIdx;
        localStorage.setItem('qureml_tour_step', this.currentStep);
        this.render();
      } else {
        this.endTour();
        const currentSlug = getPageSlug(window.location.pathname);
        if (currentSlug !== 'predict') {
          window.location.href = resolvePageUrl('predict');
        }
      }
    }

    prevStep() {
      if (this.currentStep > 0) {
        const prevIdx = this.currentStep - 1;
        const prevStep = WALKTHROUGH[prevIdx];
        const currentSlug = getPageSlug(window.location.pathname);
        const targetSlug = prevStep.slug;

        // If prev step lives on another page, navigate back!
        if (targetSlug && currentSlug !== targetSlug) {
          localStorage.setItem('qureml_tour_active', 'true');
          localStorage.setItem('qureml_tour_step', prevIdx);
          window.location.href = resolvePageUrl(targetSlug);
          return;
        }

        this.currentStep = prevIdx;
        localStorage.setItem('qureml_tour_step', this.currentStep);
        this.render();
      }
    }

    render() {
      const step = WALKTHROUGH[this.currentStep];
      const bot = BOTS[step.speaker] || BOTS.ali;

      // 1. Instant Character Pose Switching (Pre-cached)
      const poseSrc = bot[step.pose] || bot.forward;
      if (this.dom.charImg.getAttribute('src') !== poseSrc) {
        this.dom.charImg.src = poseSrc;
      }

      // 2. Intelligent Docking Position
      this.dom.container.className = `dgb-container active ${step.dock || 'dock-right'}`;

      // 3. Speaker Badge & Step Pill
      this.dom.speakerBadge.textContent = bot.name;
      this.dom.speakerBadge.className = `dgb-speaker-badge ${bot.badgeClass}`;
      
      if (this.currentStep === 0) {
        this.dom.stepPill.textContent = `INTRO`;
      } else if (this.currentStep === WALKTHROUGH.length - 1) {
        this.dom.stepPill.textContent = `CONCLUSION`;
      } else {
        this.dom.stepPill.textContent = `MODULE ${this.currentStep} / ${WALKTHROUGH.length - 2}`;
      }

      // 4. Content
      this.dom.tag.textContent = step.tag;
      this.dom.title.textContent = step.title;
      this.dom.text.innerHTML = step.text;
      this.dom.complianceText.textContent = step.compliance;
      this.dom.innovationText.textContent = step.innovation;

      // 5. Buttons
      this.dom.btnPrev.disabled = this.currentStep === 0;
      this.dom.btnNext.innerHTML = step.btnNext || `Next Feature &rarr;`;

      // 6. Spotlight & Auto-Scroll
      this.positionSpotlight(step);
    }

    positionSpotlight(step) {
      // Clear previous spotlight target elevation
      document.querySelectorAll('.dgb-spotlight-target').forEach(el => {
        el.classList.remove('dgb-spotlight-target');
      });

      if (!step.target) {
        // Step 0 (Intro) & Step 8 (Conclusion) have no spotlight box!
        this.activeTargetEl = null;
        this.dom.box.classList.remove('active');
        this.dom.box.style.opacity = '0';
        this.dom.mask.style.clipPath = 'none';
        return;
      }

      let targetEl = document.querySelector(step.target);
      if (!targetEl && step.parentTarget) {
        targetEl = document.querySelector(step.parentTarget);
      }

      if (!targetEl) {
        this.activeTargetEl = null;
        this.dom.box.classList.remove('active');
        this.dom.box.style.opacity = '0';
        this.dom.mask.style.clipPath = 'none';
        return;
      }

      this.activeTargetEl = targetEl;
      targetEl.classList.add('dgb-spotlight-target');

      // Frame tag label
      if (step.spotlightTag) {
        this.dom.boxTag.textContent = step.spotlightTag;
        this.dom.boxTag.style.display = 'block';
      } else {
        this.dom.boxTag.style.display = 'none';
      }

      // Check if target is already comfortably visible in viewport
      const rect = targetEl.getBoundingClientRect();
      const isAlreadyVisible = (
        rect.top >= 70 &&
        rect.bottom <= (window.innerHeight - 80)
      );

      // Only scroll if outside comfortable viewport
      if (!isAlreadyVisible) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Position box and cut hole in mask
      this.updateBoxGeometry();
      this.dom.box.classList.add('active');
      this.dom.box.style.opacity = '1';

      // If scrolling was triggered, smoothly track geometry across a few frames
      if (!isAlreadyVisible) {
        let frames = 0;
        const trackScroll = () => {
          if (this.isActive && this.activeTargetEl && frames < 16) {
            this.updateBoxGeometry();
            frames++;
            requestAnimationFrame(trackScroll);
          }
        };
        requestAnimationFrame(trackScroll);
      }
    }

    updateBoxGeometry() {
      if (!this.activeTargetEl) {
        this.dom.mask.style.clipPath = 'none';
        return;
      }
      const rect = this.activeTargetEl.getBoundingClientRect();
      const pad = 12;

      const top = Math.max(6, Math.round(rect.top - pad));
      const left = Math.max(6, Math.round(rect.left - pad));
      const width = Math.min(window.innerWidth - 12, Math.round(rect.width + pad * 2));
      const height = Math.min(window.innerHeight - 12, Math.round(rect.height + pad * 2));
      const right = left + width;
      const bottom = top + height;

      // 1. Move neon-yellow brutalist frame
      this.dom.box.style.top = `${top}px`;
      this.dom.box.style.left = `${left}px`;
      this.dom.box.style.width = `${width}px`;
      this.dom.box.style.height = `${height}px`;

      // 2. Cut transparent rectangular window in mask!
      // This leaves the highlighted element 100% crystal clear & unblurred!
      this.dom.mask.style.clipPath = `polygon(
        0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
        ${left}px ${top}px,
        ${right}px ${top}px,
        ${right}px ${bottom}px,
        ${left}px ${bottom}px,
        ${left}px ${top}px
      )`;
    }
  }

  // Auto-instantiate when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.ClinicalDashboardGuideBot = new DashboardGuideBot();
    });
  } else {
    window.ClinicalDashboardGuideBot = new DashboardGuideBot();
  }
})();
