import React, { useState, useEffect } from "react";
import { fetchApi } from "../api.js";

export default function Compare() {
  const [patients, setPatients] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi("/compare-patients")
      .then((data) => {
        setPatients(data);
        if (data.length > 0) loadPatient(0);
      })
      .catch(() => {});
  }, []);

  const loadPatient = async (idx) => {
    setSelectedIndex(idx);
    setLoading(true);
    try {
      const data = await fetchApi(`/compare/${idx}`);
      setComparison(data);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">balance</span>
          Live Head-to-Head: Quantum VQC vs. Classical MLP
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Evaluate Control A (6-qubit VQC, 73 params) and parameter-matched Control B (Classical MLP, 73 params) side-by-side on identical locked out-of-sample WDBC test patients.
        </p>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-tertiary uppercase">Select Verified Patient:</label>
            <select
              value={selectedIndex}
              onChange={(e) => loadPatient(parseInt(e.target.value))}
              className="text-xs font-semibold rounded-lg border-outline-variant py-1.5 px-3 bg-surface-container-low"
            >
              {patients.map((p) => (
                <option key={p.index} value={p.index}>
                  {p.patient_id} — Ground Truth: {p.ground_truth}
                </option>
              ))}
            </select>
          </div>
          {comparison && (
            <div className={`text-xs px-3 py-1 rounded-full font-bold border ${
              comparison.concordance ? "bg-success-container text-success border-success/30" : "bg-secondary/10 text-secondary border-secondary/30"
            }`}>
              {comparison.concordance ? "✓ Both Architectures Concordant" : "⚠️ Diagnostic Discordance"}
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-tertiary">
            <span className="spinner"></span> Running dual quantum and classical inference...
          </div>
        ) : comparison ? (
          <div className="space-y-4 pt-2">
            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Control A: Quantum */}
              <div className="p-4 rounded-xl border border-primary/30 bg-surface-container-low space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">CONTROL A</span>
                    <div className="text-base font-bold text-on-surface mt-1">Hybrid Quantum VQC</div>
                    <div className="text-[11px] text-tertiary">6 qubits, 73 trainable parameters</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    comparison.control_a.decision === "Malignant" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-success-container text-success border-success/20"
                  }`}>
                    {comparison.control_a.decision}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-tertiary">Predicted Probability:</div>
                  <div className="text-2xl font-black text-primary">
                    {(comparison.control_a.probability * 100).toFixed(2)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-outline-variant/40 pt-2 text-on-surface-variant">
                  <div>Risk Tier: <b>{comparison.control_a.risk_tier}</b></div>
                  <div>Latency: <b>{comparison.control_a.latency_ms} ms</b></div>
                  <div>Accuracy: <b>{comparison.control_a.correct ? "✓ Correct" : "✗ Error"}</b></div>
                </div>
              </div>

              {/* Control B: Classical */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">CONTROL B</span>
                    <div className="text-base font-bold text-on-surface mt-1">Classical MLP Baseline</div>
                    <div className="text-[11px] text-tertiary">Linear(6,9)→Tanh→Linear(9,1), 73 parameters</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    comparison.control_b.decision === "Malignant" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-success-container text-success border-success/20"
                  }`}>
                    {comparison.control_b.decision}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-tertiary">Predicted Probability:</div>
                  <div className="text-2xl font-black text-on-surface">
                    {(comparison.control_b.probability * 100).toFixed(2)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-outline-variant/40 pt-2 text-on-surface-variant">
                  <div>Risk Tier: <b>{comparison.control_b.risk_tier}</b></div>
                  <div>Latency: <b>{comparison.control_b.latency_ms} ms</b></div>
                  <div>Accuracy: <b>{comparison.control_b.correct ? "✓ Correct" : "✗ Error"}</b></div>
                </div>
              </div>
            </div>

            {/* Feature Summary */}
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs flex flex-wrap gap-4 text-on-surface-variant">
              <span>Patient: <b className="font-mono text-on-surface">{comparison.patient_id}</b></span>
              <span>Ground Truth: <b className="text-on-surface">{comparison.ground_truth}</b></span>
              <span>Mean Radius: <b className="text-on-surface">{comparison.features_summary.mean_radius}</b></span>
              <span>Mean Texture: <b className="text-on-surface">{comparison.features_summary.mean_texture}</b></span>
              <span>Worst Area: <b className="text-on-surface">{comparison.features_summary.worst_area}</b></span>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
