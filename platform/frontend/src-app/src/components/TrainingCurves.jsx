import React, { useState, useEffect } from "react";
import { fetchApi } from "../api.js";

export default function TrainingCurves() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/training-curves")
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">show_chart</span>
          Model Training Dynamics & Evaluation Dashboard (PS Deliverable 5)
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Real per-epoch loss, AUC-ROC, and accuracy curves logged over 60 epochs comparing Control A (Quantum VQC) and Control B (Classical MLP) on identical WDBC train/validation splits.
        </p>
      </section>

      {loading ? (
        <div className="py-12 text-center text-xs text-tertiary">
          <span className="spinner"></span> Loading real training dynamics data...
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Control A Card */}
            <div className="p-4 rounded-xl border border-primary/30 bg-surface-container-lowest shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">CONTROL A</span>
                  <div className="text-base font-bold text-on-surface mt-1">Hybrid Quantum VQC</div>
                  <div className="text-xs text-tertiary">73 parameters · Train Time: {data.models.control_a.runtime_sec}s</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-primary/10 text-primary">
                  Val AUC: {data.models.control_a.final_val_auc}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/60 text-xs">
                <div>Train Loss: <b>{data.models.control_a.final_train_loss}</b></div>
                <div>Val Loss: <b>{data.models.control_a.final_val_loss}</b></div>
                <div>Val Acc: <b>{(data.models.control_a.final_val_acc * 100).toFixed(2)}%</b></div>
              </div>
            </div>

            {/* Control B Card */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">CONTROL B</span>
                  <div className="text-base font-bold text-on-surface mt-1">Classical MLP Baseline</div>
                  <div className="text-xs text-tertiary">73 parameters · Train Time: {data.models.control_b.runtime_sec}s (~16.8x faster)</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-surface-container text-on-surface">
                  Val AUC: {data.models.control_b.final_val_auc}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/60 text-xs">
                <div>Train Loss: <b>{data.models.control_b.final_train_loss}</b></div>
                <div>Val Loss: <b>{data.models.control_b.final_val_loss}</b></div>
                <div>Val Acc: <b>{(data.models.control_b.final_val_acc * 100).toFixed(2)}%</b></div>
              </div>
            </div>
          </div>

          {/* Generated Training Curves Figure */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">
                Training & Validation Convergence Trajectories (Epochs 1–60)
              </h3>
              <span className="text-xs text-tertiary font-mono">Real Run Log</span>
            </div>
            <div className="w-full rounded-lg overflow-hidden border border-outline-variant/60 bg-surface-container-low flex items-center justify-center p-2">
              <img
                src="http://127.0.0.1:8000/paper_figures/fig_training_curves_comparison.png"
                alt="Training Curves Comparison"
                className="max-h-[460px] w-auto rounded object-contain"
              />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <b>Empirical Finding:</b> Both models reach identical out-of-sample discrimination ceilings (Val AUC: 0.9964 vs 0.9967, Val Accuracy: 97.37% vs 97.37%). Control B converges smoothly within 10 epochs, while Control A experiences brief initial barren plateau hesitation in epochs 1–4 before descending rapidly.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 text-xs text-secondary">Could not load training curves.</div>
      )}
    </div>
  );
}
