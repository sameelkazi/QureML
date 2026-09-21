# 🚀 QureML Cloud Deployment Guide (Render + Vercel)

This repository is pre-configured for a **hybrid decoupled deployment**:
- **Backend (FastAPI + Quantum PyTorch Engine)**: Hosted on [Render](https://render.com) (Free Tier).
- **Frontend (Interactive Neo-Brutalist Dashboard)**: Hosted on [Vercel](https://vercel.com) (Global Edge CDN).

---

## ⚡ Part 1: Deploy Backend to Render (FastAPI + QML)

Render runs Python 3.10+, installs PyTorch (CPU-optimized for ultra-fast, lightweight builds), PennyLane, and runs Uvicorn on `$PORT`.

### Method A: 1-Click Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** &rarr; **Blueprint**.
3. Connect your GitHub repository: `sameelkazi/QureML`.
4. Render will detect the included `render.yaml` file automatically.
5. Click **Apply**.
6. Wait 2–3 minutes for the build to complete. Once finished, Render gives you a live URL, e.g.:
   ```
   https://qureml-backend.onrender.com
   ```

### Method B: Manual Web Service Setup
If not using Blueprints:
1. Click **New +** &rarr; **Web Service**.
2. Connect `sameelkazi/QureML`.
3. Set the following settings:
   - **Name**: `qureml-backend` (recommended so it matches the default URL)
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install torch --index-url https://download.pytorch.org/whl/cpu && pip install -r platform/backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
4. Click **Create Web Service**.

> **Note on Render Free Tier Sleep**: Render spins down free containers after 15 minutes of inactivity. When a request is made, it performs a cold start (~45 seconds). The QureML navigation bar includes an automated ping status badge that notifies users and auto-retries during cold starts.

---

## ⚡ Part 2: Deploy Frontend to Vercel (Edge CDN)

The frontend is completely static, ultra-fast, and styled with vanilla CSS + Tailwind CDN.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** &rarr; **Project**.
3. Import `sameelkazi/QureML`.
4. Vercel automatically detects the included `vercel.json` configuration:
   - **Output Directory**: `platform/frontend` (handled by `vercel.json`)
   - **Framework Preset**: Other
5. Click **Deploy**.
6. Within 15 seconds, your platform is live at:
   ```
   https://qure-ml.vercel.app  (or your assigned vercel domain)
   ```

---

## 🔗 Part 3: Connecting Frontend to Backend

QureML features a smart client-side API proxy built directly into `nav.js`:

1. **Default Target**: By default, the frontend automatically routes all API requests (`/predict`, `/explain`, `/evaluation-metrics`, etc.) to `https://qureml-backend.onrender.com`.
2. **If your Render service has a different URL**:
   - In the top navigation bar, click the **`API`** button (next to MENU and REPO).
   - A modal appears showing the **Render Service URL**.
   - Paste your Render URL (e.g., `https://my-custom-qureml.onrender.com`).
   - Click **Test / Ping** to verify connectivity and latency.
   - Click **Save & Apply**! Your preference is saved in `localStorage` across all pages.
3. **Local Development**: When accessing via `http://localhost:8000` or `http://127.0.0.1:8000`, the platform automatically uses relative local routes without any proxying.
