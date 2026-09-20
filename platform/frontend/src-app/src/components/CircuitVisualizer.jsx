import React from "react";

export default function CircuitVisualizer({ angles }) {
  if (!angles || angles.length !== 6) return null;

  const maxMag = Math.max(...angles.map((a) => a.total_magnitude_radians));
  const minMag = Math.min(...angles.map((a) => a.total_magnitude_radians));
  const magRange = maxMag - minMag || 1.0;

  const wiresY = [55, 105, 155, 205, 255, 305];

  // Helper for CNOT ring
  const makeCnotRing = (baseX) => {
    const cnotOffsets = [0, 26, 52, 78, 104, 130];
    return cnotOffsets.map((dx, i) => {
      const x = baseX + dx;
      const cY = wiresY[i];
      const tY = wiresY[(i + 1) % 6];
      const topY = Math.min(cY, tY);
      const botY = Math.max(cY, tY);
      return (
        <g key={`cnot-${baseX}-${i}`}>
          <line x1={x} y1={topY} x2={x} y2={botY} stroke="#ba0035" strokeWidth="1.8" />
          <circle cx={x} cy={cY} r="4.5" fill="#ba0035" />
          <circle cx={x} cy={tY} r="7" fill="#ffffff" stroke="#ba0035" strokeWidth="1.8" />
          <line x1={x - 5} y1={tY} x2={x + 5} y2={tY} stroke="#ba0035" strokeWidth="1.5" />
          <line x1={x} y1={tY - 5} x2={x} y2={tY + 5} stroke="#ba0035" strokeWidth="1.5" />
        </g>
      );
    });
  };

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 space-y-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <div className="text-base font-bold flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-xl">account_tree</span>
            Interactive Quantum Circuit Visualizer (Control A Architecture)
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Exact PennyLane VQC: 6-qubit AngleEmbedding(Y) → 2× [RY(θ) + RZ(ϕ) + CNOT Ring] → Pauli-Z Measurements (73 trainable parameters).
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
          Live Trained Weights
        </span>
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-x-auto border border-outline-variant/60 rounded-lg bg-surface-container-lowest p-2">
        <svg viewBox="0 0 880 345" className="w-full min-w-[820px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Column labels */}
          <rect x="90" y="8" width="75" height="18" rx="3" fill="#eff4ff" />
          <text x="127" y="21" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#006194" textAnchor="middle">
            EMBEDDING
          </text>

          <rect x="175" y="8" width="280" height="18" rx="3" fill="#e5eeff" />
          <text x="315" y="21" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#006194" textAnchor="middle">
            VARIATIONAL LAYER 1 (RY + RZ + CNOT RING)
          </text>

          <rect x="485" y="8" width="280" height="18" rx="3" fill="#e5eeff" />
          <text x="625" y="21" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#006194" textAnchor="middle">
            VARIATIONAL LAYER 2 (RY + RZ + CNOT RING)
          </text>

          <rect x="805" y="8" width="58" height="18" rx="3" fill="#eff4ff" />
          <text x="834" y="21" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#545c72" textAnchor="middle">
            MEASURE
          </text>

          {/* 6 Wires */}
          {wiresY.map((y, i) => {
            const q = angles[i];
            return (
              <g key={`wire-${i}`}>
                <line x1="85" y1={y} x2="860" y2={y} stroke="#bfc7d2" strokeWidth="1.5" />
                <text x="15" y={y + 4} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700" fill="#006194">
                  q{i}
                </text>
                <text x="40" y={y + 4} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="#545c72">
                  {q.total_magnitude_radians.toFixed(2)} rad
                </text>
              </g>
            );
          })}

          {/* AngleEmbedding Box */}
          <rect x="95" y="32" width="65" height="295" rx="6" fill="#eff4ff" stroke="#006194" strokeWidth="1.8" strokeDasharray="4 3" />
          <text
            x="127"
            y="180"
            fontFamily="Inter, sans-serif"
            fontSize="11"
            fontWeight="700"
            fill="#006194"
            textAnchor="middle"
            transform="rotate(-90 127 180)"
          >
            AngleEmbedding(RY)
          </text>

          {/* Variational Gates for Layer 1 and 2 */}
          {wiresY.map((y, i) => {
            const q = angles[i];
            const norm = (q.total_magnitude_radians - minMag) / magRange;
            const opacity = (0.25 + 0.65 * norm).toFixed(2);
            const fillRy = `rgba(0, 97, 148, ${opacity})`;
            const fillRz = `rgba(84, 92, 114, ${opacity})`;

            return (
              <g key={`gates-${i}`}>
                {/* L1 RY */}
                <rect x="180" y={y - 16} width="42" height="32" rx="4" fill={fillRy} stroke="#006194" strokeWidth="1.5" />
                <text x="201" y={y + 4} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="#ffffff" textAnchor="middle">
                  RY
                </text>

                {/* L1 RZ */}
                <rect x="232" y={y - 16} width="42" height="32" rx="4" fill={fillRz} stroke="#545c72" strokeWidth="1.5" />
                <text x="253" y={y + 4} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="#ffffff" textAnchor="middle">
                  RZ
                </text>

                {/* L2 RY */}
                <rect x="490" y={y - 16} width="42" height="32" rx="4" fill={fillRy} stroke="#006194" strokeWidth="1.5" />
                <text x="511" y={y + 4} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="#ffffff" textAnchor="middle">
                  RY
                </text>

                {/* L2 RZ */}
                <rect x="542" y={y - 16} width="42" height="32" rx="4" fill={fillRz} stroke="#545c72" strokeWidth="1.5" />
                <text x="563" y={y + 4} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="#ffffff" textAnchor="middle">
                  RZ
                </text>

                {/* Meter */}
                <rect x="815" y={y - 16} width="38" height="32" rx="4" fill="#ffffff" stroke="#707881" strokeWidth="1.5" />
                <text x="834" y={y + 4} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#0b1c30" textAnchor="middle">
                  ⟨Z⟩
                </text>
              </g>
            );
          })}

          {/* CNOT Rings */}
          {makeCnotRing(295)}
          {makeCnotRing(605)}
        </svg>
      </div>

      {/* Qubit Magnitude Mini-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {angles.map((q) => {
          const norm = (q.total_magnitude_radians - minMag) / magRange;
          const pct = Math.round(norm * 100);
          return (
            <div key={q.qubit} className="p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary font-mono">Qubit {q.qubit}</span>
                <span className="font-mono text-[11px] font-semibold">{q.total_magnitude_radians.toFixed(3)} rad</span>
              </div>
              <div className="w-full bg-outline-variant/40 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.max(12, pct)}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant">
                <span>RY: {q.mean_ry_radians.toFixed(2)} rad</span>
                <span>RZ: {q.mean_rz_radians.toFixed(2)} rad</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-on-surface-variant font-medium text-center sm:text-left">
        <span className="font-bold text-primary">Caption:</span> Real trained circuit — gate angles and wire color intensity reflect actual parameter magnitudes from the model weights (<code>circuit_qubit_angles</code>), not illustrative.
      </p>
    </div>
  );
}
