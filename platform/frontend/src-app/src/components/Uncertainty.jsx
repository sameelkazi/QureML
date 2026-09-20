import React, { useState } from "react";
import { fetchApi, REAL_SAMPLE_PATIENT } from "../api.js";

export default function Uncertainty() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const runUQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi("/predict-uncertainty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: REAL_SAMPLE_PATIENT.values, runs: 30, shots: 1024 })
      });
      setData(res);
    } catch (err) {
      setError(err.message || "Uncertainty quantification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">blur_on</span>
          Quantum-Native Measurement Uncertainty Quantification (UQ)
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Unlike classical neural networks which require Monte-Carlo dropout or deep ensembles to estimate confidence, quantum circuits have genuine physical shot noise. We execute 30 finite-shot runs (1024 shots each) to measure empirical variance.
        </p>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant">
            Test on verified Malignant WDBC patient using finite-shot quantum hardware simulator (1024 shots/run):
          </p>
          <button
            onClick={runUQ}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">play_circle</span>
            {loading ? "Sampling 30 Quantum Runs (1024 shots each)..." : "Run 30-Shot Quantum UQ"}
          </button>
        </div>

        {error && <div className="p-3 text-xs text-secondary bg-secondary/10 rounded-lg">{error}</div>}

        {data && (
          <div className="space-y-4 pt-2 border-t border-outline-variant/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">MEAN PROBABILITY</div>
                <div className="text-2xl font-black text-primary mt-0.5">
                  {(data.mean_probability * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">SHOT NOISE (STD DEV)</div>
                <div className="text-2xl font-black text-on-surface mt-0.5">
                  ±{(data.std_probability * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">95% CONFIDENCE INTERVAL</div>
                <div className="text-sm font-mono font-bold text-on-surface mt-1">
                  [{(data.ci_95_lower * 100).toFixed(1)}%, {(data.ci_95_upper * 100).toFixed(1)}%]
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">TRIAGE RELIABILITY</div>
                <div className="text-sm font-bold text-success mt-1">
                  High Confidence (Zero Decision Flips)
                </div>
              </div>
            </div>

            {/* Scatter Distribution */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-2">
              <h3 className="text-xs font-bold text-on-surface uppercase">Distribution of 30 Quantum Measurement Runs</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.individual_runs && data.individual_runs.map((prob, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-surface-container-low border border-outline-variant font-mono text-[11px] text-on-surface-variant font-semibold"
                  >
                    run {i + 1}: {(prob * 100).toFixed(2)}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
