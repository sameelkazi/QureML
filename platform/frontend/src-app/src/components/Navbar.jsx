import React, { useEffect, useState } from "react";
import { API_BASE } from "../api.js";

export default function Navbar({ activeRoute, setActiveRoute }) {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.ok ? setOnline(true) : setOnline(false))
      .catch(() => setOnline(false));
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "predict", label: "Predict & Triage", icon: "bolt" },
    { id: "explain", label: "Circuit & Explain", icon: "account_tree" },
    { id: "compare", label: "Quantum vs Classical", icon: "balance" },
    { id: "uncertainty", label: "Uncertainty (UQ)", icon: "blur_on" },
    { id: "curves", label: "Training Curves", icon: "show_chart" },
    { id: "federated", label: "Federated DP", icon: "lock" },
    { id: "robustness", label: "Biomarker Stress", icon: "security" },
    { id: "walkthrough", label: "📋 Judge Report", icon: "fact_check", highlight: true }
  ];

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-y-2">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => setActiveRoute("overview")}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-lg">biotech</span>
          </div>
          <div>
            <div className="text-base font-extrabold text-primary leading-tight">QureML</div>
            <div className="text-[10px] text-tertiary font-mono">SIH26139 · Egreen Quanta</div>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveRoute(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  item.highlight
                    ? (isActive ? "bg-secondary text-white shadow-sm" : "bg-secondary/10 text-secondary hover:bg-secondary/20")
                    : (isActive ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container hover:text-primary")
                }`}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            online === true
              ? "bg-success-container text-success border-success/30"
              : (online === false ? "bg-secondary/10 text-secondary border-secondary/30" : "bg-surface-container text-tertiary border-outline-variant")
          }`}>
            <span className={`w-2 h-2 rounded-full ${online === true ? "bg-success animate-pulse" : (online === false ? "bg-secondary" : "bg-tertiary")}`}></span>
            {online === true ? "Backend Live" : (online === false ? "Offline" : "Checking...")}
          </div>
          <a
            href={`${API_BASE}/docs`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xs">api</span>
            API Docs
          </a>
        </div>
      </div>
    </header>
  );
}
