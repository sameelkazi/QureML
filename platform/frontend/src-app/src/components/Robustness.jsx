import React, { useState, useEffect } from "react";
import { fetchApi } from "../api.js";

export default function Robustness() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/robustness-summary")
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">security</span>
          Biomarker Input-Sensitivity & Robustness Stress Test
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Stress test across all 114 locked test patients perturbing 30 raw biomarker features by ±1%, ±5%, and ±10% of their population standard deviations, comparing quantum and classical stability.
        </p>
      </section>

      {loading ? (
        <div className="py-12 text-center text-xs text-tertiary">
          <span className="spinner"></span> Loading biomarker robustness data...
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Table */}
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">Clinical Decision Stability Across Perturbation Levels</h3>
              <span className="text-xs text-tertiary font-mono">114 Locked Test Patients</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface-container text-xs uppercase text-on-surface-variant">
                    <th className="py-2.5 px-3">Model Architecture</th>
                    <th className="py-2.5 px-3 text-center">Noise Magnitude</th>
                    <th className="py-2.5 px-3 text-right">Mean |Δ Probability|</th>
                    <th className="py-2.5 px-3 text-right">Max |Δ Probability|</th>
                    <th className="py-2.5 px-3 text-right">Flipped Patients</th>
                    <th className="py-2.5 px-3 text-right">Diagnostic Flip Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.map((row, idx) => (
                    <tr key={idx} className="border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-xs text-on-surface">{row.model}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs font-bold text-primary">
                        ±{row.perturbation_pct}% SD
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs">
                        {row.mean_abs_delta_prob.toFixed(4)} ± {row.std_abs_delta_prob.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs font-bold">{row.max_abs_delta_prob.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs">{row.n_class_flipped} / 114</td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.class_flip_rate_pct === 0 ? "bg-success-container text-success" : "bg-secondary/10 text-secondary"
                        }`}>
                          {row.class_flip_rate_pct.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              <b>Clinical Safety Finding:</b> Both architectures are highly resilient to realistic measurement noise (zero diagnostic flips at ≤5% error). At 10% extreme noise, Control A flips 2 boundary patients and Control B flips 1 boundary patient, confirming statistical parity in boundary resilience.
            </p>
          </section>

          {/* Figure */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-on-surface">Probability Shift and Diagnostic Stability Figures</h3>
            <div className="w-full rounded-lg overflow-hidden border border-outline-variant/60 bg-surface-container-low flex items-center justify-center p-2">
              <img
                src="http://127.0.0.1:8000/paper_figures/fig_input_robustness_stress_test.png"
                alt="Robustness Stress Test"
                className="max-h-[460px] w-auto rounded object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-xs text-secondary">Could not load robustness summary.</div>
      )}
    </div>
  );
}
