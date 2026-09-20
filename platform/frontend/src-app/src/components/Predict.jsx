import React, { useState, useEffect } from "react";
import { fetchApi, REAL_SAMPLE_PATIENT } from "../api.js";

const STORAGE_KEY = "qureml_decision_log";

export default function Predict() {
  const [features, setFeatures] = useState([...REAL_SAMPLE_PATIENT.values]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [logs, setLogs] = useState([]);
  const [lastLoggedAction, setLastLoggedAction] = useState(null);

  // Load decision log from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setLogs(stored);
    } catch {}
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setLastLoggedAction(null);
    try {
      const data = await fetchApi("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });
      setPrediction({
        ...data,
        summary: `Rad:${features[0].toFixed(1)}, Tex:${features[1].toFixed(1)}, Area:${features[3].toFixed(0)}`
      });
    } catch (err) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const logDecision = (action) => {
    if (!prediction) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const reasonText = overrideReason.trim() || (action === "agree" ? "Clinician confirmed agreement with quantum model risk tier." : "Clinician exercised clinical override based on patient history / palpable mass discordance.");

    const newEntry = {
      timestamp: timeStr,
      patient_summary: prediction.summary,
      model_prob: `${(prediction.probability * 100).toFixed(1)}%`,
      model_class: prediction.predicted_class,
      action: action,
      reason: reasonText
    };

    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch {}

    setLastLoggedAction(newEntry);
    setOverrideReason("");
  };

  const handleClearLog = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLogs([]);
    setLastLoggedAction(null);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
          Diagnostic Prediction & Clinician Oversight (PS Deliverable 4)
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Live inference through the trained 6-qubit Control A model with advisory risk stratification and auditable clinician override logging.
        </p>
      </section>

      {/* Feature Input Panel */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-on-surface-variant">
            Pre-filled with real Malignant WDBC patient sample (first sample of dataset). Edit any biomarker or click Run Prediction:
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
          onClick={handlePredict}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">bolt</span>
          {loading ? "Running Quantum Inference..." : "Run Prediction"}
        </button>

        {error && (
          <div className="p-3 rounded-lg border border-secondary/40 bg-secondary/10 text-secondary text-xs font-medium">
            Error: {error}
          </div>
        )}

        {/* Prediction Results */}
        {prediction && (
          <div className="space-y-4 pt-2 border-t border-outline-variant/60">
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <div className="text-[10px] text-tertiary font-bold uppercase">PROBABILITY (MALIGNANT)</div>
                <div className="text-2xl font-black text-primary mt-0.5">
                  {(prediction.probability * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-tertiary font-bold uppercase">PREDICTED CLASS</div>
                <div className={`text-xl font-bold mt-0.5 ${prediction.predicted_class === "Malignant" ? "text-secondary" : "text-success"}`}>
                  {prediction.predicted_class}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-tertiary font-bold uppercase">RISK TIER</div>
                <div className="text-sm font-bold text-on-surface mt-0.5">{prediction.risk_tier}</div>
              </div>
              <div>
                <div className="text-[10px] text-tertiary font-bold uppercase">MODEL ARCHITECTURE</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{prediction.model_used}</div>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/40">
                {prediction.interpretation}
              </div>
            </div>

            {/* Feature 4: Clinician Decision Support & Override Controls */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">medical_services</span>
                  Clinician Oversight & Decision Support (PS Deliverable 4)
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  Interactive Triage Action
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Model recommendation: <b>{prediction.predicted_class}</b> ({(prediction.probability * 100).toFixed(1)}%). Confirm agreement or exercise clinical override:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => logDecision("agree")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  ✓ Agree with model
                </button>
                <button
                  onClick={() => logDecision("override")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  ✗ Override — clinician disagrees
                </button>
                <div className="flex-1 min-w-[260px]">
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Optional clinician rationale (e.g., palpable mass discordance, family history)..."
                    className="w-full rounded-lg border-outline-variant text-xs py-1.5 px-3 bg-surface-container-low"
                  />
                </div>
              </div>

              {lastLoggedAction && (
                <div className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between ${
                  lastLoggedAction.action === "agree" ? "border-success/40 bg-success-container text-success" : "border-secondary/40 bg-secondary/10 text-secondary"
                }`}>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">
                      {lastLoggedAction.action === "agree" ? "check_circle" : "warning"}
                    </span>
                    Logged decision: <b>{lastLoggedAction.action === "agree" ? "Agreed with model" : "Overridden by clinician"}</b> ({lastLoggedAction.reason})
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{lastLoggedAction.timestamp}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Feature 4: Session Decision Log Table (Audit Trail) */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <div className="text-base font-bold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
              Session Decision Log (Client-Side Audit Trail)
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Local demo decision-log feature (stored in browser <code>localStorage</code>) demonstrating transparent clinical override auditing.
            </p>
          </div>
          {logs.length > 0 && (
            <button
              onClick={handleClearLog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface-variant transition-all"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span> Clear Log
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-container text-xs uppercase text-on-surface-variant">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Patient Summary</th>
                <th className="py-2.5 px-3">Model Advisory</th>
                <th className="py-2.5 px-3">Clinician Decision</th>
                <th className="py-2.5 px-3">Clinical Rationale / Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 px-3 text-center text-xs text-tertiary">
                    No clinician decisions logged yet in this session. Run a prediction above to review and record actions.
                  </td>
                </tr>
              ) : (
                logs.map((item, idx) => {
                  const isAgree = item.action === "agree";
                  return (
                    <tr key={idx} className="border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 font-mono text-xs text-on-surface-variant whitespace-nowrap">{item.timestamp}</td>
                      <td className="py-2 px-3 font-mono text-xs text-tertiary">{item.patient_summary}</td>
                      <td className="py-2 px-3 font-bold text-xs">
                        <span className={item.model_class === "Malignant" ? "text-secondary" : "text-success"}>
                          {item.model_prob} ({item.model_class})
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isAgree ? "bg-success-container text-success border-success/30" : "bg-secondary/10 text-secondary border-secondary/30"
                        }`}>
                          <span className="material-symbols-outlined text-xs">{isAgree ? "check_circle" : "cancel"}</span>
                          {isAgree ? "Agreed with Model" : "Clinician Override"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-on-surface-variant">{item.reason}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-tertiary">
          *Note: Decision logs are stored locally in the browser for demo triage verification and are not transmitted to external EHR servers.
        </p>
      </section>
    </div>
  );
}
