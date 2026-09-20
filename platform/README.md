# QureML Clinical Platform (Deliverable 5 Demonstrator)

This directory contains the minimal, working demonstrator for **Deliverable 5** of Problem Statement SIH26139: *Hybrid Quantum Machine Learning Platform for Early Disease Detection* (Egreen Quanta).

---

## 🚀 How to Run Locally

### 1. Launch the FastAPI Backend Service
From the repository root (with the Python virtual environment activated):

```bash
# Using Python inside .venv:
.\.venv\Scripts\uvicorn.exe platform.backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be live at `http://127.0.0.1:8000`. Interactive OpenAPI documentation is accessible at `http://127.0.0.1:8000/docs`.

### 2. Open the Clinical Dashboard UI
Open `platform/frontend/index.html` directly in any web browser (or serve it via any static file server). The page will connect automatically to the local backend on port 8000.

---

## 📡 API Endpoints

- **`POST /predict`**: Accepts a JSON body with either 30 raw standardized WDBC features or 6 PCA-reduced features, executes an inference pass using the saved weights of **Control A** (6-qubit trained hybrid VQC), and returns the malignancy probability, risk tier (`Low Risk`, `Medium Risk`, `High Risk`), and calibrated threshold interpretation.
- **`GET /model-info`**: Returns the model architecture details, PennyLane backend configuration, qubit topology, and validated headline metrics on the WDBC benchmark.
- **`GET /results-summary`**: Returns the full 36-row 4-control ablation comparison table (from `phase2_stats_summary.csv`) as structured JSON for dashboard rendering.
- **`GET /health`**: Healthcheck endpoint returning `{ "status": "ok" }`.

---

## 📋 Scope & Intent (What it Demonstrates vs. What it Deliberately Omits)

This platform is a **functional proof-of-concept demonstrator** designed to satisfy the hackathon and research paper requirements for an interactive software interface and API. It demonstrates end-to-end clinical workflow feasibility: ingestion of fine-needle aspirate biomarkers, non-leaking PCA projection, 6-qubit quantum state encoding, VQC expectation evaluation, and threshold-calibrated risk stratification.

**Deliberate Non-Goals & Omissions:** It intentionally omits production-grade enterprise infrastructure—there is no user authentication, session management, cloud deployment (Docker/Kubernetes), or persistent SQL/NoSQL clinical database. It is scoped strictly as a transparent, reproducible prototype proving that the hybrid quantum model can serve live predictions to clinicians through standard HTTP protocols.
