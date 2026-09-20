import React from "react";

export default function Overview({ setActiveRoute }) {
  const cards = [
    {
      id: "walkthrough",
      title: "📋 One-Click Judge Report",
      desc: "Fast 60-second skim of project deliverables, 6-dataset evaluation table, and print-to-PDF audit.",
      icon: "fact_check",
      badge: "Judge Recommended",
      color: "border-secondary/40 bg-secondary/5 text-secondary"
    },
    {
      id: "predict",
      title: "Predict & Clinician Decision Log",
      desc: "Real-time Control A inference on 30 WDBC features, advisory risk tiers, and clinician override audit trail.",
      icon: "bolt",
      badge: "PS Deliverable 4",
      color: "border-primary/30 bg-surface-container-lowest text-primary"
    },
    {
      id: "explain",
      title: "Circuit Visualizer & Explainability",
      desc: "Live-trained 6-qubit VQC diagram with exact gate angle magnitudes and Integrated Gradients attributions.",
      icon: "account_tree",
      badge: "PS Deliverable 2",
      color: "border-primary/30 bg-surface-container-lowest text-primary"
    },
    {
      id: "compare",
      title: "Quantum vs. Classical Head-to-Head",
      desc: "Live side-by-side inference of Control A (Quantum) and Control B (Classical MLP) across 114 test patients.",
      icon: "balance",
      badge: "Ablation Study",
      color: "border-outline-variant bg-surface-container-lowest text-on-surface"
    },
    {
      id: "curves",
      title: "Model Training & Validation Dynamics",
      desc: "Per-epoch loss, AUC, and accuracy curves over 60 epochs for both Quantum and Classical controls.",
      icon: "show_chart",
      badge: "PS Deliverable 5",
      color: "border-outline-variant bg-surface-container-lowest text-on-surface"
    },
    {
      id: "federated",
      title: "Differential Privacy in Federated Learning",
      desc: "Real DP-FedAvg simulation with Opacus RDP accountant across 4 hospitals and multiple (ε, δ) operating points.",
      icon: "lock",
      badge: "Part I Feature",
      color: "border-outline-variant bg-surface-container-lowest text-on-surface"
    },
    {
      id: "robustness",
      title: "Biomarker Input-Noise Stress Test",
      desc: "Perturbation robustness testing across 114 locked-test patients under ±1%, ±5%, ±10% measurement error.",
      icon: "security",
      badge: "Clinical Safety",
      color: "border-outline-variant bg-surface-container-lowest text-on-surface"
    },
    {
      id: "uncertainty",
      title: "Quantum Measurement Uncertainty (UQ)",
      desc: "30 finite-shot (1024 shots) inference runs on physical simulators to quantify genuine quantum variance.",
      icon: "blur_on",
      badge: "Part G Feature",
      color: "border-outline-variant bg-surface-container-lowest text-on-surface"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              SIH 2026 · Problem Statement SIH26139
            </span>
            <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs border border-outline-variant">
              Sponsor: Egreen Quanta · SPIT Mumbai
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
            A hybrid quantum-classical machine learning platform, benchmarked honestly against classical baselines.
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            A 6-qubit variational quantum classifier, strictly parameter-matched against a classical MLP, evaluated across six real clinical datasets with Holm-Bonferroni corrected statistics — reporting statistical parity, communication efficiency, and measurement uncertainty.
          </p>

          {/* 4 Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="text-[11px] text-tertiary font-bold uppercase tracking-wider">DATASETS BENCHMARKED</div>
              <div className="text-2xl font-black text-primary mt-1">6</div>
              <div className="text-xs text-on-surface-variant mt-0.5">Tabular & imaging benchmarks</div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="text-[11px] text-tertiary font-bold uppercase tracking-wider">ZERO-MISS SENSITIVITY</div>
              <div className="text-2xl font-black text-primary mt-1">100%</div>
              <div className="text-xs text-on-surface-variant mt-0.5">τ=0.10, WDBC locked test cohort</div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="text-[11px] text-tertiary font-bold uppercase tracking-wider">PARAMETER BUDGET</div>
              <div className="text-2xl font-black text-primary mt-1">73 params</div>
              <div className="text-xs text-on-surface-variant mt-0.5">6 qubits, strictly matched</div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="text-[11px] text-tertiary font-bold uppercase tracking-wider">VS. CLASSICAL BASELINE</div>
              <div className="text-2xl font-black text-secondary mt-1">Parity</div>
              <div className="text-xs text-on-surface-variant mt-0.5">No advantage after Holm-Bonferroni</div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => setActiveRoute("walkthrough")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              📋 Open 60-Second Judge Report
            </button>
            <button
              onClick={() => setActiveRoute("predict")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              Run Live Diagnostic Triage
            </button>
            <button
              onClick={() => setActiveRoute("explain")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-xs sm:text-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">account_tree</span>
              View Live Quantum Circuit
            </button>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">apps</span>
          Explore Platform Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {cards.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveRoute(c.id)}
              className={`rounded-xl border p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between ${c.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/60 text-tertiary">
                    {c.badge}
                  </span>
                </div>
                <div className="text-sm font-bold leading-snug">{c.title}</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{c.desc}</p>
              </div>
              <div className="pt-3 flex items-center gap-1 text-xs font-semibold hover:underline">
                Open Module <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
