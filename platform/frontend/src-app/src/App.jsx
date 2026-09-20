import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Overview from "./components/Overview.jsx";
import Predict from "./components/Predict.jsx";
import Explain from "./components/Explain.jsx";
import Compare from "./components/Compare.jsx";
import Uncertainty from "./components/Uncertainty.jsx";
import TrainingCurves from "./components/TrainingCurves.jsx";
import FederatedDP from "./components/FederatedDP.jsx";
import Robustness from "./components/Robustness.jsx";
import JudgeReport from "./components/JudgeReport.jsx";

export default function App() {
  const getRouteFromHash = () => {
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    return hash || "overview";
  };

  const [activeRoute, setActiveRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => {
      setActiveRoute(getRouteFromHash());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (route) => {
    window.location.hash = `#/${route}`;
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar activeRoute={activeRoute} setActiveRoute={navigate} />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeRoute === "overview" && <Overview setActiveRoute={navigate} />}
        {activeRoute === "predict" && <Predict />}
        {activeRoute === "explain" && <Explain />}
        {activeRoute === "compare" && <Compare />}
        {activeRoute === "uncertainty" && <Uncertainty />}
        {activeRoute === "curves" && <TrainingCurves />}
        {activeRoute === "federated" && <FederatedDP />}
        {activeRoute === "robustness" && <Robustness />}
        {activeRoute === "walkthrough" && <JudgeReport />}
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto py-5 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between items-center gap-2 text-xs text-on-surface-variant">
          <div>
            © 2026 QureML · Smart India Hackathon (SIH26139) · Sponsor: Egreen Quanta · SPIT Mumbai
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-tertiary">Control A (Hybrid VQC 73p) vs Control B (MLP 73p)</span>
            <button onClick={() => navigate("walkthrough")} className="text-primary font-semibold hover:underline">
              Judge Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
