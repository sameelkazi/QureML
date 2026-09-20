import React, { useState } from "react";
import { fetchApi, REAL_SAMPLE_PATIENT } from "../api.js";
import CircuitVisualizer from "./CircuitVisualizer.jsx";

export default function Explain() {
  const [features, setFeatures] = useState([...REAL_SAMPLE_PATIENT.values]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features, steps: 35 })
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to compute integrated gradients");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">troubleshoot</span>
          Explainability & Circuit Attribution (PS Deliverable 2)
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Axiomatic Integrated Gradients (Sundararajan et al., ICML 2017) through the end-to-end pipeline, plus real trained quantum circuit visualization.
        </p>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-on-surface-variant">
            Pre-filled with real Malignant WDBC patient sample (first sample of dataset). Edit any biomarker or click Compute:
          </p>
          <button
            onClick={() => setFeatures([...REAL_SAMPLE_PATIENT.values])}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Reset Sample
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 border border-outline-variant/60 rounded-lg">
          {REAL_SAMPLE_PATIENT.labels.map((lbl, i) => (
            <div key={lbl} className="space-y-0.5">
              <label className="text-[10px] font-bold text-tertiary uppercase truncate block">
                {lbl}
              </label>
              <input
                type="number"
                step="any"
                value={features[i]}
                onChange={(e) => {
                  const updated = [...features];
                  updated[i] = parseFloat(e.target.value) || 0;
                  setFeatures(updated);
                }}
                className="w-full text-xs font-mono rounded border-outline-variant py-1 px-1.5 bg-surface-container-low"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">troubleshoot</span>
          {loading ? "Computing Integrated Gradients (35 steps)..." : "Compute Attributions & Circuit Angles"}
        </button>

        {error && (
          <div className="p-3 rounded-lg border border-secondary/40 bg-secondary/10 text-secondary text-xs font-medium">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="space-y-6 pt-2">
            {/* Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">PROBABILITY</div>
                <div className="text-2xl font-black text-primary mt-0.5">
                  {(result.probability * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">PREDICTED CLASS</div>
                <div className={`text-xl font-bold mt-0.5 ${result.predicted_class === "Malignant" ? "text-secondary" : "text-success"}`}>
                  {result.predicted_class}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">Δ FROM BASELINE</div>
                <div className="text-xl font-bold text-on-surface mt-0.5">
                  {result.delta_probability.toFixed(4)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="text-[10px] text-tertiary font-bold uppercase">COMPLETENESS ERROR</div>
                <div className="text-xl font-bold text-on-surface mt-0.5">
                  {result.completeness_error_pct.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Top 5 Attributions Table */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-on-surface">Top Biomarker Feature Drivers (Axiomatic IG)</h3>
              <div className="overflow-x-auto rounded-lg border border-outline-variant">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-surface-container text-xs uppercase text-on-surface-variant">
                      <th className="py-2 px-3">Clinical Biomarker</th>
                      <th className="py-2 px-3 text-right">Attribution (Integrated Grad)</th>
                      <th className="py-2 px-3">Directional Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.top_features.slice(0, 5).map((t, idx) => (
                      <tr key={idx} className="border-b border-outline-variant/60 hover:bg-surface-container-low">
                        <td className="py-2 px-3 font-medium text-xs">{t.clinical_label}</td>
                        <td className="py-2 px-3 text-right font-mono text-xs font-bold text-primary">
                          {t.attribution.toFixed(5)}
                        </td>
                        <td className="py-2 px-3 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            t.direction.includes("Elevates") ? "bg-secondary/10 text-secondary" : "bg-success-container text-success"
                          }`}>
                            {t.direction}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {result.methodology} Sum of attributions accounts for {(100 - result.completeness_error_pct).toFixed(2)}% of total probability shift.
              </p>
            </div>

            {/* Feature 3: Dynamic Inline SVG Circuit Visualizer */}
            <CircuitVisualizer angles={result.circuit_qubit_angles} />
          </div>
        )}
      </section>
    </div>
  );
}
