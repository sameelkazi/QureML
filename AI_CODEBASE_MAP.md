# QureML (SIH26139) — Codebase Map for AI Context

This file is a structural map of the real repository, built by directly reading the code (not from README/paper claims). Give this to any AI/coding agent before it touches the codebase so it doesn't have to re-discover the structure. It answers "where does X live and what calls it" — for feature-level/marketing content see `FEATURES_REFERENCE.md` and `RESEARCH_AND_NOVELTY_REFERENCE.md` instead; this file is architecture-only.

## 1. Top-level layout

```
QureML/
├── platform/
│   ├── backend/main.py        # single-file FastAPI app — ALL backend logic lives here (~1889 lines)
│   ├── backend/model_weights.pt   # trained Control A HybridQNN state_dict
│   ├── backend/preprocessor.pkl   # pickled {scaler, pca, angle_scaler} fit on WDBC training split
│   └── frontend/*.html        # 15 static HTML pages, vanilla JS + fetch(), no build step, no framework
├── notebooks/                 # 3 Jupyter notebooks — this is where results/*.{csv,json} are actually generated
├── results/                   # 67 data files (CSV/JSON/JSONL) — outputs of the notebooks, read live by backend endpoints
├── paper/QureML_SIH26139_paper.tex   # IEEEtran conference paper
├── paper_figures/, outputs_proofs/   # generated figures + a README cataloguing what each proves
├── team/                      # team member assets served at /team
├── server.py                  # thin Render/Vercel entrypoint: imports platform/backend/main.py's `app`
├── vercel.json                # static-hosting rewrite rules (frontend-only deploy path, no FastAPI)
├── requirements.txt
├── README.md, FEATURES_REFERENCE.md, RESEARCH_AND_NOVELTY_REFERENCE.md, PROBLEM_STATEMENT.md, EXECUTION_PLAN.md, DEPLOYMENT.md
└── Claude outputs/            # prompts/docs I (Claude) hand-deliver here for the local coding agent
```

**Two separate deployment paths exist** — don't confuse them:
- `server.py` + `platform/backend/main.py` (FastAPI, uvicorn) — the real live backend, serves both the API and the HTML pages (mounts `/static`, and also serves each page directly at its route slug, see §3).
- `vercel.json` — a static-only rewrite config for hosting the frontend HTML directly on Vercel with clean URLs (`/predict` → `/predict.html` etc.), independent of FastAPI. If both are deployed, the two routing tables must be kept in sync manually (they currently are, except `/imaging`, `/federated`, `/fusion` — see §5).

## 2. Backend: `platform/backend/main.py` — section-by-section

| Lines | Section | What it is |
|---|---|---|
| 1-20 | Imports | FastAPI, PennyLane, PyTorch, sklearn, statsmodels (`mcnemar`) |
| 22-45 | Quantum circuit definition | `N_QUBITS=6`, `N_LAYERS=2`, `variational_layer()`, `make_qnode()` — the actual PennyLane circuit: AngleEmbedding(Y) → 2×(RY/RZ + circular CNOT ring) → PauliZ expvals |
| 47-63 | `HybridQNN` | Control A model class: `Linear(6,6) → tanh·(π/2) → q_layer (TorchLayer) → Linear(6,1) → sigmoid`. 73 total trainable params. |
| 65-82 | `ClassicalControl` | Control B model class: `Linear(6,9) → Tanh → Linear(9,1)`, exactly 73 params (comment in code spells out the arithmetic). |
| 85-100 | `EndToEndQNN` | Wraps scaler+PCA+angle-scaler+HybridQNN into ONE differentiable `nn.Module` (registers them as buffers) so Integrated Gradients can backprop through preprocessing, not just the model. Used only by `/explain`. |
| 103-137 | FastAPI app + static mounts | `app = FastAPI(...)`, CORS wide open (`allow_origins=["*"]`), mounts `/paper_figures`, `/static` (→ `platform/frontend`), `/assets`, `/team` |
| 139-176 | Model + preprocessor loading at import time | Loads `model_weights.pt` into a **module-level global** `model` (analytic/exact statevector, unlimited shots) AND a second global `model_shots` (same weights, `shots=1024`, used only by `/predict-uncertainty` for genuine finite-shot noise). Loads `preprocessor.pkl` into globals `preprocessors` and `e2e_model`. **If these files are missing, the app still boots** (prints a WARNING) but predictions come from randomly-initialized weights — worth checking for on any "predictions look wrong" bug report. |
| 178-196 | `WDBC_FEATURES` / `CLINICAL_LABELS` | Hardcoded ordered lists of the 30 raw WDBC feature names — index order MUST match `sklearn.datasets.load_breast_cancer().feature_names` order; several endpoints assume this. |
| 198+ | Pydantic request/response models | One pair per endpoint family (`PredictRequest/Response`, `ExplainRequest/Response`, etc.) — **these are the single source of truth for real JSON field names**. Any frontend `d.xxx` access that doesn't match a field here will silently be `undefined` (this exact class of bug was found and fixed in `predict.html`/`explain.html`, commit `5def09c`). |
| 267-354 | Static asset + page routing | `/shared.css`, `/nav.js`, `/guidebot.css`/`.js`, `/paper-modal.js`, `/paper.pdf` served as raw files from `frontend_dir`. `PAGES_CONFIG` (list of `(slug, filename)` tuples, ~line 320) is looped to auto-register both `/slug` and `/filename.html` as GET routes returning that HTML file. |
| 362+ | All feature endpoints | See §4 table below. |

### Key architectural gotcha
`model` and `model_shots` are loaded **once at import time** as module-level globals, not per-request. There is no hot-reload — restarting the uvicorn process is required to pick up a new `model_weights.pt`.

## 3. Page routing (`PAGES_CONFIG`, `main.py` ~line 320)

```python
PAGES_CONFIG = [
    ("index", "index.html"), ("predict", "predict.html"), ("uncertainty", "uncertainty.html"),
    ("compare", "compare.html"), ("explain", "explain.html"), ("batch", "batch.html"),
    ("evaluation", "evaluation.html"), ("imaging", "imaging.html"), ("federated", "federated.html"),
    ("fusion", "fusion.html"), ("hardware", "hardware.html"), ("architecture", "architecture.html"),
    ("train", "train.html"), ("compliance", "compliance.html"), ("roadmap", "roadmap.html"),
    ("walkthrough", "walkthrough.html"),
]
```
Each entry registers **two** routes: `/{slug}` and `/{filename}`. `triage.html` is a small standalone redirect stub (not in `PAGES_CONFIG`) — `vercel.json` rewrites `/triage → /predict.html`.

⚠️ **`imaging`, `federated`, `fusion` are dead routes** — registered in `PAGES_CONFIG` but `imaging.html`/`federated.html`/`fusion.html` do not exist on disk (confirmed via `ls`). They 404 if hit and are not linked from any nav/index page. Low-risk cleanup item, not currently causing user-facing bugs.

## 4. Backend endpoint inventory — grouped by which frontend page(s) actually call them

Built by grepping every `fetch(...)` call in every `platform/frontend/*.html` file against every `@app.get`/`@app.post` in `main.py`. This is the REAL wiring, not what a doc claims.

| Frontend page | Endpoints it calls |
|---|---|
| `predict.html` | `/health`, `/predict` |
| `explain.html` | `/health`, `/explain` |
| `uncertainty.html` | `/health`, `/predict-uncertainty`, `/selective-prediction-summary` |
| `compare.html` | `/health`, `/compare-patients`, `/compare/{patient_index}` |
| `batch.html` | `/health`, `/predict-batch`, `/sample-batch-csv` |
| `evaluation.html` | `/evaluation-metrics`, `/decision-curve-analysis` |
| `walkthrough.html` | `/health`, `/evaluation-metrics` |
| `train.html` | `/health`, `/sample-dataset`, `/custom-dataset-train` |
| `architecture.html` | `/barren-plateau-summary`, `/decision-curve-analysis`, `/domain-shift-summary`, `/ensemble-summary`, `/federated-dp-results`, `/generalization-benchmark`, `/ibm-live-telemetry`, `/kfold-summary`, `/kta-summary`, `/missing-data-robustness`, `/noise-aware-summary`, `/quantum-advantage-sanity-check`, `/related-work-positioning`, `/resource-estimation-summary`, `/selective-prediction-summary` |
| `index_ios_backup.html` | `/ibm-live-telemetry` (this is a backup file, likely unused — see §5) |
| `index.html`, `hardware.html`, `roadmap.html`, `compliance.html`, `triage.html` | none (static/marketing content, or hardware.html may render server-embedded data — check before assuming) |

**Backend endpoints that exist but are NOT called by any current frontend page** (confirmed via repo-wide grep, not just spot-checked):
- `/model-info`, `/results-summary`, `/robustness-summary`, `/training-curves`, `/zne-mitigation-summary`, `/explainability-comparison`, `/green-efficiency-summary`

These are real, working, live-data endpoints (the last two back the ZNE and quantum-vs-classical-explainability features added in commit history) — they're just not yet wired into any UI page. If a future task is "surface ZNE/explainability-comparison results in the UI," these are the endpoints to hit; no backend work needed, only frontend.

## 5. Frontend file hygiene notes

- `platform/frontend/index.html.bak` and `platform/frontend/index_ios_backup.html` — backup/legacy copies sitting next to `index.html`. `index_ios_backup.html` still makes a live `fetch('/ibm-live-telemetry')` call, so it's not fully inert, but nothing links to it from nav. Treat both as safe-to-archive/remove candidates, not active pages, unless told otherwise.
- Every `d.xxx` reference in a frontend `.html` file that reads a `POST`/`GET` JSON response MUST be checked against the matching Pydantic response model in `main.py` (§2 table) before trusting it — this is the exact bug class fixed in commit `5def09c` (`predict.html`/`explain.html` were reading field names like `d.decision_classification`/`d.malignancy_probability`/`d.completeness_error` that never existed on `PredictResponse`/`ExplainResponse`; real fields were `predicted_class`/`probability`/`completeness_error_pct`). Don't assume other pages are clean — this hasn't been audited page-by-page beyond `predict.html`/`explain.html`.
- A large "everything is modified" `git status` in this repo has historically turned out to be 100% CRLF/LF line-ending noise (verified via `git diff --ignore-space-at-eol --stat` returning empty) — don't panic-diagnose a huge diff without checking that first.

## 6. `results/` — how the 67 data files are actually produced

The backend **never computes ML results live** (except `/custom-dataset-train`, `/predict`, `/predict-uncertainty`, `/explain`, `/predict-batch`, which run the loaded model against request data in real time). Every other data endpoint (`/generalization-benchmark`, `/domain-shift-summary`, `/zne-mitigation-summary`, etc.) is a thin `json.load()`/`pd.read_csv()` wrapper around a static file in `results/`, generated ahead of time by one of the 3 notebooks:

| Notebook | Produces |
|---|---|
| `notebooks/01_wdbc_mvp_ablation.ipynb` | Phase 1 — single-seed Control A vs Control B on WDBC (`results/phase1_mvp_wdbc.json` and friends) |
| `notebooks/02_ablation_sweep.ipynb` | Phase 2/3 — the primary 4-control × 3-dataset × 4-fraction × 10-seed ablation battery (480 fits) feeding `results/phase2_stats_summary.csv`, `results/generalization_performance_benchmark.csv`, PCA-dim sweep, etc. |
| `notebooks/QureML_ibm_hardware_validation.ipynb` | Standalone — real IBM Quantum Heron r2 hardware execution → `results/ibm_hardware_validation.csv`, `results/ibm_live_hardware_telemetry.json` |

Some `results/*.json` files (ZNE, quantum-vs-classical explainability, green efficiency) were added later outside these 3 notebooks — check each file's own structure/methodology field (most self-document their generation method) rather than assuming one of the 3 notebooks made it.

**Implication for future work**: to add a new "real" metric to the platform, the actual computation almost always needs to happen in a notebook (or a new standalone script) that writes a `results/*.json`, and then a thin FastAPI GET endpoint that reads it — following the exact pattern of `/zne-mitigation-summary` and `/explainability-comparison` (both just `open()` + `json.load()` + return, no live computation, see `main.py` ~line 1848-1880). Don't hardcode numbers directly in `main.py` or in frontend JS — that breaks the project's whole "no fabrication" discipline.

## 7. Core ML architecture cheat-sheet (for any AI reasoning about the model itself)

- 6 qubits, 2 variational layers, circular CNOT entanglement ring, `default.qubit` PennyLane device, `diff_method="backprop"` (exact/analytic) for training/inference, `shots=1024` finite-shot variant only for `/predict-uncertainty`.
- Control A (`HybridQNN`): 73 trainable params (24 quantum + 42 classical-pre-linear + 7 classical-post-linear, per `results/quantum_resource_estimation.json`).
- Control B (`ClassicalControl`): 73 params, exact match, `Linear(6,9)→Tanh→Linear(9,1)`.
- Control C (entanglement-ablated): also 73 params in the real data (CNOTs are non-parameterized, so removing them doesn't reduce trainable count) — a paper/README claim of "61 params" for Control C was found to be fabricated and needs correcting wherever it still appears.
- Control D (untrained/frozen reservoir): 49 params (quantum weights frozen, only classical pre/post layers train).
- Preprocessing for the 30-raw-feature path: `StandardScaler → PCA(n_components=6) → MinMaxScaler("angle_scaler", presumably to [0, π])`. `/predict` also accepts an already-6-dimensional PCA input directly (skips scaler+PCA, goes straight through `angle_scaler`).

## 8. Known unresolved issues (as of this file's writing — re-check before relying on this section)

- `paper/QureML_SIH26139_paper.tex` and `README.md` still contain 4 unfixed fabrications: wrong Bowles et al. 2024 citation (should be arXiv:2403.07059), wrong Control C param count (61 → should be 73), overclaimed universal statistical parity (should note the real significant Heart-Disease-at-25%-fraction exception, p=0.0039), and a false "100% zero-miss + close fidelity" IBM hardware claim (real `results/ibm_hardware_validation.csv` shows only 5/10 sim/hardware agreement).
- A ">2,000×" federated-efficiency figure appears in `FEATURES_REFERENCE.md` and possibly PPT slides — the real, recomputed figure from `results/green_quantum_efficiency.json` is **708.4×** lighter than a classical MLP.
- `/imaging`, `/federated`, `/fusion` dead routes in `PAGES_CONFIG` (§3).
- `index.html.bak`, `index_ios_backup.html` — backup file hygiene (§5).

---
*This file describes the codebase as read directly from source on the date it was generated. It is not auto-updated — re-verify against the real files before trusting a claim here that materially affects a decision, especially §4 (frontend↔backend wiring) and §8 (known issues), which change as fixes land.*
