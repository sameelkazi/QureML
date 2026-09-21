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
    // STEP 0: GRAND INTRO (Ali Straight Pose, Centered, Triage Portal)
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
      text: 'Greetings! I am <b>Ali</b>, Quantum Architecture Lead. <b>Problem Statement SIH26139</b> (Egreen Quanta) challenges us to deliver an automated, clinical-grade platform for early oncology detection. In this director-level tour, we will <b>navigate directly into every core module</b> across the entire clinical platform dashboard!',
      compliance: 'Fully addresses SIH26139 HealthTech deliverable requirements with automated clinical triage workflows.',
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
      target: 'main > section:nth-of-type(2)',
      parentTarget: '.grid.grid-cols-1.md\\:grid-cols-3',
      spotlightTag: 'MODULE 01 // 3 VERIFIED PATIENT COHORTS',
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
      target: 'main > section.glass-panel:first-of-type',
      parentTarget: '#feature-grid',
      spotlightTag: 'MODULE 02 // 30 CYTOPATHOLOGY BIOMARKERS & TABS',
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
      target: 'main > section.glass-panel:first-of-type > .flex.flex-wrap.items-center.justify-between:first-of-type',
      parentTarget: '#run-predict',
      spotlightTag: 'MODULE 03 // VQC INFERENCE & SAFETY GATE',
      tag: '100% CLINICAL SENSITIVITY',
      title: '3. Quantum Triage & Clinician Gate',
      text: 'Clicking <b>"Execute Quantum Triage"</b> dispatches patient features to <code>POST /predict</code>. The 6-qubit VQC evaluates expectation values <b>⟨Zᵢ⟩</b> in under <b>15 milliseconds</b>. Our screening threshold is tuned to <b>τ = 0.10</b>, achieving <b>100% sensitivity (zero missed cancers)</b> while sparing 58/100 patients from invasive biopsies!',
      compliance: 'Zero missed malignancies with automated referral trigger for borderline cases (|p - 0.50| < 0.10).',
      innovation: 'Selective classification (El-Yaniv & Wiener) with automated Second-Opinion Specialist Referral Gate for ambiguous cases.',
      btnNext: 'Open Next Module: 6-Qubit Register &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 4: 6-QUBIT QUANTUM LATENT REGISTER HUD (/uncertainty)
    // ------------------------------------------------------------------------
    {
      id: 'step-4-hud',
      slug: 'uncertainty',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: '.p-6.rounded-xl.bg-white.border-2.border-black',
      parentTarget: '#quantum-qubits-hud',
      spotlightTag: 'MODULE 04 // 6-QUBIT HILBERT SPACE REGISTER',
      tag: 'LATENT REGISTER MAPPING',
      title: '4. 6-Qubit Quantum Latent Register',
      text: 'Welcome to the <b>Uncertainty Suite</b>! Here, 30 cytopathology biomarkers are compressed into a 6-qubit continuous rotation state (θ₀..θ₅) across nuclear scale, contour concavity, boundary margin, standard error, chromatin texture, and extreme bounds on physical Bloch spheres.',
      compliance: 'Zero compression loss on dominant variance components explaining 88.4% of cytology spectrum.',
      innovation: 'AngleEmbedding encodings mapping patient biology into a 2⁶ = 64-dimensional complex Hilbert state space.',
      btnNext: 'Next: Finite-Shot Shot-Noise Gate &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 5: FINITE-SHOT QUANTUM UNCERTAINTY QUANTIFICATION (/uncertainty)
    // ------------------------------------------------------------------------
    {
      id: 'step-5-uncertainty',
      slug: 'uncertainty',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel-subtle',
      parentTarget: '#run-uncertainty',
      spotlightTag: 'MODULE 05 // QUANTUM UNCERTAINTY (UQ) PROTOCOL',
      tag: 'FINITE-SHOT NOISE SIMULATOR',
      title: '5. Quantum Uncertainty Quantification',
      text: 'Classical neural nets dangerously hallucinate confidence. QureML executes <b>30 repeated stochastic runs</b> of 1,024 physical measurement shots each (30,720 Monte Carlo samples), computing exact Wilson binomial confidence intervals and triggering automated referral when interval width W > 0.150.',
      compliance: 'Eliminates algorithmic overconfidence, guaranteeing clinician transparency on ambiguous cases.',
      innovation: 'Grounded in physical projective quantum measurement noise rather than fabricated heuristic dropout scores.',
      btnNext: 'Open Next Module: Quantum Explainability &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 6: AXIOMATIC QUANTUM EXPLAINABILITY (/explain)
    // ------------------------------------------------------------------------
    {
      id: 'step-6-explain',
      slug: 'explain',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel',
      parentTarget: '#run-explain',
      spotlightTag: 'MODULE 06 // QUANTUM EXPLAINABILITY ENGINE',
      tag: 'AXIOMATIC ATTRIBUTIONS',
      title: '6. Axiomatic Quantum Explainability',
      text: 'Welcome to the <b>Quantum Explainability Engine</b>! Doctors cannot trust black-box predictions. We compute 50-step Gauss-Legendre quadrature Integrated Gradients directly over the quantum expectation function, isolating exactly which cytopathology markers pushed the diagnosis.',
      compliance: 'Meets medical AI explainability mandates with transparent feature-level rationale for pathologists.',
      innovation: 'Strict mathematical compliance with Axioms of Completeness and Implementation Invariance (<0.1% energy drift).',
      btnNext: 'Open Next Module: 4-Control Ablation &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 7: 4-CONTROL ABLATION BATTERY (/compare)
    // ------------------------------------------------------------------------
    {
      id: 'step-7-compare',
      slug: 'compare',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel',
      parentTarget: '#run-compare',
      spotlightTag: 'MODULE 07 // 4-CONTROL SCIENTIFIC ABLATION',
      tag: 'HONEST SCIENTIFIC RIGOR',
      title: '7. Quantum vs Classical 4-Control Ablation',
      text: 'Welcome to the <b>Dual Inference & Ablation Suite</b>! Most QML claims use weak classical baselines. QureML benchmarks Control A (Hybrid VQC 73p) against a parameter-matched Control B (Classical MLP 73p), Control C (No entanglement), and Control D (Fixed untrained) with Holm-Bonferroni correction (p=1.000).',
      compliance: 'Exhaustive scientific validation across 6 biomedical cohorts (Breast, Heart, Parkinson\'s, Liver, Kidney, Diabetes).',
      innovation: 'Discrete Logarithm benchmark proves our quantum kernel achieves +48.34% accuracy and 19.2× higher KTA when group structure exists.',
      btnNext: 'Open Next Module: On-Demand Training &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 8: LIVE DATASET INGESTION (/train)
    // ------------------------------------------------------------------------
    {
      id: 'step-8-train-ingest',
      slug: 'train',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'section.lg\\:col-span-2.glass-panel',
      parentTarget: '#drop-zone',
      spotlightTag: 'MODULE 08 // TABULAR DATASET INGESTION SUITE',
      tag: 'SIH DELIVERABLE 5 COMPLIANCE',
      title: '8. Clinical Cohort Dataset Ingestion',
      text: 'Welcome to the <b>Live Quantum Training Portal</b>! Pathologists and hospital IT can drag and drop custom tabular binary classification CSVs. QureML performs automated adaptive scaling, held-out test splitting, and PCA projection completely on-demand!',
      compliance: 'Fulfills SIH26139 Deliverable 5: Live model retraining on custom hospital cohorts without code changes.',
      innovation: 'Zero-persistence ephemeral training executed entirely in volatile server RAM to satisfy HIPAA patient privacy.',
      btnNext: 'Next: On-Demand Quantum Optimizer &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 9: ON-DEMAND VQC OPTIMIZATION (/train)
    // ------------------------------------------------------------------------
    {
      id: 'step-9-train-exec',
      slug: 'train',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main section.glass-panel-subtle',
      parentTarget: '#btn-train',
      spotlightTag: 'MODULE 09 // DUAL ARCHITECTURE SPECS & OPTIMIZER',
      tag: 'REAL-TIME ADAMW FITTING',
      title: '9. On-Demand Quantum Model Training',
      text: 'Clicking <b>"Train Models On-Demand"</b> compiles the VQC with PennyLane backpropagation. It simultaneously fits both Control A (Quantum VQC) and Control B (Classical MLP) across selected epochs, displaying real-time loss curves, convergence telemetry, and test accuracy.',
      compliance: 'Direct comparison on identical user-provided validation data with zero synthetic data leakage.',
      innovation: 'Real-time parameter updates across 73 variational circuit angles with automatic bar-chart accuracy delta computation.',
      btnNext: 'Open Next Module: Batch Screening &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 10: HOSPITAL-SCALE BATCH SCREENING (/batch)
    // ------------------------------------------------------------------------
    {
      id: 'step-10-batch',
      slug: 'batch',
      speaker: 'samridhi',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel',
      parentTarget: '#run-batch',
      spotlightTag: 'MODULE 10 // HOSPITAL BATCH TRIAGE SUITE',
      tag: 'HIGH-THROUGHPUT CLINICAL RUNS',
      title: '10. Hospital-Scale Batch Screening',
      text: 'Welcome to the <b>Cohort Batch Screening Portal</b>! Designed for diagnostic laboratories, hospital oncology wards can upload multi-patient CSV records (e.g. 50+ patients). The VQC executes vector batch inference in seconds, triaging urgent cases into a priority review queue.',
      compliance: 'Provides scalable high-throughput oncology triage matching national healthcare screening requirements.',
      innovation: 'Automated 3-tier risk stratification (Low / Borderline / High) with batch export and decision log audit trail.',
      btnNext: 'Open Next Module: Multi-Cohort Benchmarks &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 11: MULTI-COHORT EMPIRICAL EVALUATION (/evaluation)
    // ------------------------------------------------------------------------
    {
      id: 'step-11-eval',
      slug: 'evaluation',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel:first-of-type',
      parentTarget: '#eval-table-body',
      spotlightTag: 'MODULE 11 // 6 BIOMEDICAL COHORTS MATRIX',
      tag: 'PEER-REVIEWED METHODOLOGY',
      title: '11. Multi-Cohort Performance Matrix',
      text: 'Welcome to the <b>Empirical Evaluation Matrix</b>! We benchmarked QureML across 6 real biomedical cohorts: <b>WDBC Breast Cancer</b>, <b>Cleveland Heart Disease</b>, <b>Parkinson\'s Telemonitoring</b>, <b>BUPA Liver</b>, <b>Chronic Kidney Disease</b>, and <b>Pima Diabetes</b>, with paired Wilcoxon signed-rank tests.',
      compliance: 'Fully reproducible empirical evidence with real-time backend metric verification from <code>GET /evaluation-metrics</code>.',
      innovation: 'Honest statistical reporting: shows parity on low-dimensional data while highlighting discrete logarithm algebraic advantage.',
      btnNext: 'Open Next Module: 156-Qubit IBM Heron &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 12: 156-QUBIT IBM HERON HARDWARE TELEMETRY (/hardware)
    // ------------------------------------------------------------------------
    {
      id: 'step-12-hardware',
      slug: 'hardware',
      speaker: 'ali',
      pose: 'point_left',
      dock: 'dock-right',
      target: 'main > section.glass-panel',
      parentTarget: 'main > section:first-of-type',
      spotlightTag: 'MODULE 12 // PHYSICAL 156-QUBIT HERON QPU',
      tag: 'IBM HERON TELEMETRY',
      title: '12. 156-Qubit IBM Heron Hardware Telemetry',
      text: 'Welcome to the <b>Quantum Hardware Telemetry Suite</b>! We executed our 6-qubit circuit on physical superconducting quantum hardware: the 156-qubit <b>IBM Heron processor (ibm_fez)</b> with Dynamical Decoupling (DD) and M3 measurement error mitigation (0.0034 MSE).',
      compliance: 'Validates real-world deployability on commercial quantum cloud infrastructure.',
      innovation: 'Live hardware telemetry monitoring T₁/T₂ relaxation times, single/two-qubit error rates, and readout fidelity.',
      btnNext: 'Open Final Module: Executive Judge Report &rarr;'
    },

    // ------------------------------------------------------------------------
    // STEP 13: GRAND CONCLUSION & EXECUTIVE JUDGE REPORT (/walkthrough)
    // ------------------------------------------------------------------------
    {
      id: 'step-13-conclusion',
      slug: 'walkthrough',
      speaker: 'samridhi',
      pose: 'forward', // Samridhi straight pose at the end!
      dock: 'dock-center',
      target: null, // Pure conclusion modal
      hideComplianceBox: true,
      tag: 'SIH26139 PLATFORM VERIFICATION',
      title: 'Executive Platform Walkthrough Complete!',
      text: 'Congratulations! You have toured the complete QureML Clinical Platform. Every deliverable for <b>Problem Statement SIH26139</b> is live and functional. Select any module below to dive directly into live inference, noise simulations, or physical IBM quantum hardware telemetry:',
      btnNext: 'Explore Clinical Triage Portal &check;'
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

      // Check URL parameters, cross-page tour state, or auto-trigger on entering dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const forceTour = urlParams.get('ai_tour') === '1' || urlParams.get('ai_tour') === 'true' || urlParams.get('tour') === '1';
      const dontShow = localStorage.getItem('qureml_tour_dont_show') === 'true';
      const currentSlug = getPageSlug(window.location.pathname);

      if (dontShow && !forceTour) {
        // User explicitly chose "Don't Show Again" or concluded walkthrough:
        // NEVER auto-popup GuideBot! They can still trigger manually via "AI TOUR" anytime.
        return;
      }

      const savedActive = localStorage.getItem('qureml_tour_active');
      const savedStep = parseInt(localStorage.getItem('qureml_tour_step') || '0', 10);
      const isDismissedOnPage = sessionStorage.getItem('qureml_tour_dismissed_' + currentSlug) === 'true';
      const isDismissedGlobal = sessionStorage.getItem('qureml_tour_dismissed') === 'true';

      if (forceTour) {
        // Explicit AI Tour request: reset flags and start
        localStorage.removeItem('qureml_tour_dont_show');
        sessionStorage.removeItem('qureml_tour_dismissed_' + currentSlug);
        sessionStorage.removeItem('qureml_tour_dismissed');
        setTimeout(() => {
          this.startTour(0);
        }, 120);
      } else if (savedActive === 'true') {
        // Resuming multi-page tour sequence
        setTimeout(() => {
          this.startTour(savedStep);
        }, 80);
      } else if (!isDismissedOnPage && !isDismissedGlobal && !dontShow) {
        // Auto-trigger only once on fresh session if never dismissed
        const matchedStepIndex = WALKTHROUGH.findIndex(s => s.slug === currentSlug);
        const initialStep = (matchedStepIndex !== -1) ? matchedStepIndex : 0;
        setTimeout(() => {
          this.startTour(initialStep);
        }, 220);
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
          <!-- Brutalist Top Banner (Draggable Handle) -->
          <div class="dgb-header" title="Click and drag to move GuideBot anywhere (Double-click to reset)">
            <div class="flex items-center gap-2">
              <span id="dgb-speaker-badge" class="dgb-speaker-badge ali">Ali Bot</span>
              <span id="dgb-step-pill" class="dgb-step-pill">INTRO</span>
              <span class="dgb-drag-indicator" title="Click and drag to move GuideBot anywhere">
                <span class="material-symbols-outlined" style="font-size: 13px;">drag_indicator</span>
                DRAG
              </span>
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
              
              <!-- Callout Box for Compliance vs Innovation (Hidden in Conclusion) -->
              <div id="dgb-callout-box" class="dgb-callout">
                <div class="dgb-callout-item">
                  <strong>&check; SIH Compliance:</strong> <span id="dgb-compliance-text"></span>
                </div>
                <div class="dgb-callout-item">
                  <strong>&starf; QureML Innovation:</strong> <span id="dgb-innovation-text"></span>
                </div>
              </div>

              <!-- Interactive Explore Modules Grid (Active in Conclusion Step) -->
              <div id="dgb-explore-container" class="dgb-explore-grid" style="display: none;"></div>
            </div>
          </div>

          <!-- Footer Action Buttons -->
          <div class="dgb-footer">
            <div class="dgb-footer-left">
              <button type="button" class="dgb-btn-skip" id="dgb-btn-skip">Skip</button>
              <button type="button" class="dgb-btn-dont-show" id="dgb-btn-dont-show" title="Permanently stop GuideBot from automatically opening">Don't Show Again</button>
            </div>
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
        exploreContainer: container.querySelector('#dgb-explore-container'),
        btnSkip: container.querySelector('#dgb-btn-skip'),
        btnDontShow: container.querySelector('#dgb-btn-dont-show'),
        btnPrev: container.querySelector('#dgb-btn-prev'),
        btnNext: container.querySelector('#dgb-btn-next'),
        launcher
      };
    }

    bindEvents() {
      // Close / Skip / Don't Show Again
      this.dom.closeBtn.addEventListener('click', () => this.endTour());
      this.dom.btnSkip.addEventListener('click', () => this.endTour());
      if (this.dom.btnDontShow) {
        this.dom.btnDontShow.addEventListener('click', () => this.dontShowAgain());
      }
      this.dom.mask.addEventListener('click', (e) => {
        if (e.target === this.dom.mask) this.endTour();
      });

      // Navigation
      this.dom.btnPrev.addEventListener('click', () => this.prevStep());
      this.dom.btnNext.addEventListener('click', () => this.nextStep());

      // Launcher replay on current page
      this.dom.launcher.addEventListener('click', () => this.startCurrentPageTour());

      // Draggable popup support
      this.bindDragEvents();

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

    bindDragEvents() {
      const header = this.dom.container.querySelector('.dgb-header');
      if (!header) return;

      let isDragging = false;
      let startX = 0, startY = 0;
      let initLeft = 0, initTop = 0;

      const onStart = (e) => {
        if (e.target.closest('#dgb-btn-close')) return;

        isDragging = true;
        this.isUserPositioned = true; // Mark as custom positioned by user

        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
        startX = clientX;
        startY = clientY;

        const rect = this.dom.container.getBoundingClientRect();
        initLeft = rect.left;
        initTop = rect.top;

        // Switch container to fixed top/left coordinates
        this.dom.container.style.position = 'fixed';
        this.dom.container.style.bottom = 'auto';
        this.dom.container.style.right = 'auto';
        this.dom.container.style.left = `${initLeft}px`;
        this.dom.container.style.top = `${initTop}px`;
        this.dom.container.style.transform = 'none';
        this.dom.container.classList.add('is-dragging');
        document.body.style.userSelect = 'none';
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        let newLeft = initLeft + deltaX;
        let newTop = initTop + deltaY;

        const maxLeft = window.innerWidth - this.dom.container.offsetWidth - 8;
        const maxTop = window.innerHeight - this.dom.container.offsetHeight - 8;
        newLeft = Math.max(8, Math.min(newLeft, maxLeft));
        newTop = Math.max(8, Math.min(newTop, maxTop));

        this.dom.container.style.left = `${newLeft}px`;
        this.dom.container.style.top = `${newTop}px`;
      };

      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        this.dom.container.classList.remove('is-dragging');
        document.body.style.userSelect = '';
      };

      header.addEventListener('mousedown', onStart);
      header.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);

      // Double-click header resets back to default docking!
      header.addEventListener('dblclick', () => {
        this.isUserPositioned = false;
        this.dom.container.style.top = '';
        this.dom.container.style.left = '';
        this.dom.container.style.right = '';
        this.dom.container.style.bottom = '';
        this.dom.container.style.transform = '';
        const step = WALKTHROUGH[this.currentStep];
        this.applyDockAndPose(step, this.activeTargetEl);
      });
    }

    dontShowAgain() {
      localStorage.setItem('qureml_tour_dont_show', 'true');
      localStorage.removeItem('qureml_tour_active');
      localStorage.removeItem('qureml_tour_step');
      sessionStorage.setItem('qureml_tour_dismissed', 'true');
      this.endTour(true);
    }

    startCurrentPageTour() {
      const currentSlug = getPageSlug(window.location.pathname);
      sessionStorage.removeItem('qureml_tour_dismissed_' + currentSlug);
      sessionStorage.removeItem('qureml_tour_dismissed');
      localStorage.removeItem('qureml_tour_dont_show');
      const matchIdx = WALKTHROUGH.findIndex(s => s.slug === currentSlug);
      this.startTour(matchIdx !== -1 ? matchIdx : 0);
    }

    startTour(startIndex = 0) {
      const currentSlug = getPageSlug(window.location.pathname);
      sessionStorage.removeItem('qureml_tour_dismissed_' + currentSlug);
      sessionStorage.removeItem('qureml_tour_dismissed');
      localStorage.removeItem('qureml_tour_dont_show');
      this.isActive = true;
      this.currentStep = Math.max(0, Math.min(startIndex, WALKTHROUGH.length - 1));
      localStorage.setItem('qureml_tour_active', 'true');
      localStorage.setItem('qureml_tour_step', this.currentStep);

      // Verify current page matches the step's page
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

    endTour(isDismiss = true) {
      this.isActive = false;
      this.activeTargetEl = null;
      document.querySelectorAll('.dgb-spotlight-target').forEach(el => {
        el.classList.remove('dgb-spotlight-target');
      });
      localStorage.removeItem('qureml_tour_active');
      localStorage.removeItem('qureml_tour_step');
      if (isDismiss) {
        const currentSlug = getPageSlug(window.location.pathname);
        sessionStorage.setItem('qureml_tour_dismissed_' + currentSlug, 'true');
      }
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
        // Last step (Conclusion): mark don't show again and end tour!
        this.dontShowAgain();
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

      // 1. Speaker Badge & Step Pill
      this.dom.speakerBadge.textContent = bot.name;
      this.dom.speakerBadge.className = `dgb-speaker-badge ${bot.badgeClass}`;
      
      if (this.currentStep === 0) {
        this.dom.stepPill.textContent = `INTRO`;
      } else if (this.currentStep === WALKTHROUGH.length - 1) {
        this.dom.stepPill.textContent = `CONCLUSION`;
      } else {
        this.dom.stepPill.textContent = `MODULE ${this.currentStep} / ${WALKTHROUGH.length - 2}`;
      }

      // 2. Content
      this.dom.tag.textContent = step.tag;
      this.dom.title.textContent = step.title;
      this.dom.text.innerHTML = step.text;

      // 3. Conclusion Step vs Normal Step Layout
      if (step.id === 'step-13-conclusion' || step.hideComplianceBox) {
        // Remove innovation & compliance box completely in conclusion!
        if (this.dom.calloutBox) this.dom.calloutBox.style.display = 'none';

        // Render interactive exploration buttons for all 9 platform features!
        if (this.dom.exploreContainer) {
          this.dom.exploreContainer.style.display = 'grid';
          const modules = [
            { slug: 'predict', title: 'Clinical Triage', icon: 'biotech', desc: '30 FNA Inputs &middot; Zero-Miss Gate' },
            { slug: 'uncertainty', title: 'Quantum Uncertainty', icon: 'blur_on', desc: '30,720 Shots &middot; Wilson CIs' },
            { slug: 'explain', title: 'Explainability', icon: 'troubleshoot', desc: 'Gauss-Legendre Attributions' },
            { slug: 'compare', title: '4-Control Ablation', icon: 'balance', desc: 'VQC 73p vs MLP 73p Baseline' },
            { slug: 'train', title: 'On-Demand Training', icon: 'model_training', desc: 'Upload CSV &middot; Live AdamW' },
            { slug: 'batch', title: 'Hospital Batch Triage', icon: 'clinical_notes', desc: 'Multi-Patient Queue Review' },
            { slug: 'evaluation', title: 'Multi-Cohort Matrix', icon: 'table_chart', desc: '6 Datasets &middot; Wilcoxon Tests' },
            { slug: 'hardware', title: '156-Qubit IBM Heron', icon: 'hub', desc: 'Physical QPU (ibm_fez) Telemetry' },
            { slug: 'walkthrough', title: 'Judge Executive Report', icon: 'verified', desc: 'SIH26139 Compliance Dossier' }
          ];

          this.dom.exploreContainer.innerHTML = modules.map(m => `
            <a href="${resolvePageUrl(m.slug)}" class="dgb-explore-btn" title="Explore ${m.title}">
              <span class="material-symbols-outlined">${m.icon}</span>
              <div class="min-w-0 flex-1">
                <div class="dgb-explore-title">${m.title}</div>
                <div class="dgb-explore-desc">${m.desc}</div>
              </div>
              <span class="dgb-explore-arrow">&rarr;</span>
            </a>
          `).join('');

          // Gracefully handle clicks on explore buttons: disable auto-popup so user can explore without GuideBot opening!
          this.dom.exploreContainer.querySelectorAll('.dgb-explore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const href = btn.getAttribute('href');
              this.dontShowAgain();
              window.location.href = href;
            });
          });
        }
      } else {
        // Normal steps: show compliance and innovation callout, hide explore grid
        if (this.dom.calloutBox) {
          this.dom.calloutBox.style.display = 'block';
          this.dom.complianceText.textContent = step.compliance || '';
          this.dom.innovationText.textContent = step.innovation || '';
        }
        if (this.dom.exploreContainer) {
          this.dom.exploreContainer.style.display = 'none';
        }
      }

      // 4. Buttons
      this.dom.btnPrev.disabled = this.currentStep === 0;
      this.dom.btnNext.innerHTML = step.btnNext || `Next Feature &rarr;`;

      // 5. Spotlight, Dynamic Upper Viewport Positioning & Pose Selection
      this.positionSpotlight(step);
    }

    applyDockAndPose(step, targetEl) {
      const bot = BOTS[step.speaker] || BOTS.ali;
      let dockClass = 'dock-right';
      let poseKey = 'point_left';

      if (!step.target || step.dock === 'dock-center' || !targetEl) {
        dockClass = 'dock-center';
        poseKey = step.pose || 'forward';
      } else {
        const rect = targetEl.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const elemCenterX = rect.left + rect.width / 2;
        const botWidth = Math.min(760, screenWidth * 0.70);
        const botHeight = 440;
        const bottomOverlapZone = screenHeight - botHeight;

        // Check if spotlighted element overlaps bottom-right dock area
        const inRightZone = (rect.right > (screenWidth - botWidth - 20)) && (rect.bottom > bottomOverlapZone);
        // Check if spotlighted element overlaps bottom-left dock area
        const inLeftZone = (rect.left < (botWidth + 20)) && (rect.bottom > bottomOverlapZone);

        if (inRightZone && !inLeftZone) {
          // Feature is in bottom-right: dock on left, point right!
          dockClass = 'dock-left';
          poseKey = 'point_right';
        } else if (inLeftZone && !inRightZone) {
          // Feature is in bottom-left: dock on right, point left!
          dockClass = 'dock-right';
          poseKey = 'point_left';
        } else if (elemCenterX > (screenWidth * 0.48)) {
          // Feature center is on right half of screen: dock on left, point right!
          dockClass = 'dock-left';
          poseKey = 'point_right';
        } else {
          // Feature center is on left half of screen: dock on right, point left!
          dockClass = 'dock-right';
          poseKey = 'point_left';
        }
      }

      // If user hasn't manually dragged the popup, use automatic dock class
      if (!this.isUserPositioned) {
        this.dom.container.style.top = '';
        this.dom.container.style.left = '';
        this.dom.container.style.right = '';
        this.dom.container.style.bottom = '';
        this.dom.container.style.transform = '';
        this.dom.container.classList.remove('dock-left', 'dock-right', 'dock-center');
        this.dom.container.classList.add(dockClass, 'active');
      }

      // Update character pose instantly with subtle smooth transition
      const targetSrc = bot[poseKey] || bot.forward;
      if (this.dom.charImg.getAttribute('src') !== targetSrc) {
        this.dom.charImg.classList.add('switching');
        this.dom.charImg.src = targetSrc;
        setTimeout(() => {
          this.dom.charImg.classList.remove('switching');
        }, 160);
      }
    }

    positionSpotlight(step) {
      // Clear previous spotlight target elevation
      document.querySelectorAll('.dgb-spotlight-target').forEach(el => {
        el.classList.remove('dgb-spotlight-target');
      });

      if (!step.target) {
        // Step 0 (Intro) & Step 13 (Conclusion) have no spotlight box!
        this.activeTargetEl = null;
        this.applyDockAndPose(step, null);
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
        this.applyDockAndPose(step, null);
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

      // Smoothly scroll target panel into upper viewport so the whole feature + heading sits at top: 85px!
      // This leaves the upper 55% of the screen for the spotlighted feature, completely clear of the GuideBot!
      const elementDocTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const targetScrollY = Math.max(0, elementDocTop - 85);

      const rect = targetEl.getBoundingClientRect();
      const isAlreadyComfortable = (
        rect.top >= 70 &&
        rect.top <= 140 &&
        rect.bottom <= (window.innerHeight - 80)
      );

      if (!isAlreadyComfortable) {
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }

      // Dynamically position docking and character pose
      this.applyDockAndPose(step, targetEl);

      // Position box and cut hole in mask
      this.updateBoxGeometry();
      this.dom.box.classList.add('active');
      this.dom.box.style.opacity = '1';

      // Track geometry smoothly during scroll
      if (!isAlreadyComfortable) {
        let frames = 0;
        const trackScroll = () => {
          if (this.isActive && this.activeTargetEl && frames < 18) {
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
