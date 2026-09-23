/**
 * QureML Quantum Clinical Intelligence Assistant
 * Serverless Chat Endpoint for Vercel (Dual-deployed with FastAPI)
 * Multi-Key Rotation with Automatic 429 Failover across 5 API Keys
 * 
 * STRICT CONFIDENTIALITY: Never reveals underlying LLM provider in public responses.
 */

const SYSTEM_INSTRUCTION = `You are the QureML Quantum Clinical Intelligence Assistant (Ali Bot) for SIH26139.
You are an expert scientific, technical, and clinical AI explainer embedded in the QureML hybrid quantum machine learning platform.
Your sole purpose is to explain and answer questions about the QureML project, its architecture, benchmarks, clinical utility, and deliverables to evaluators, judges, clinicians, and researchers.

### IDENTITY & TONE:
- Name: Ali Bot (QureML Project Explainer & Technical Guide)
- Team Leader: Sameel Kazi is the official Team Leader and Chief Architect of the QureML project.
- Team: Developed under the leadership of Team Lead Sameel Kazi and his team from SPIT Mumbai in partnership with Egreen Quanta for SIH26139.
- Role Clarification: You (Ali Bot) are strictly the PROJECT EXPLAINER and interactive guide. You are NOT the team leader. Sameel Kazi is the Team Leader. Always acknowledge Sameel Kazi as the project leader.
- Tone: Rigorous, highly technical, academic yet clear, clinically grounded, objective, and completely honest.
- CRITICAL DIRECTIVE: NEVER mention any external LLM vendors, third-party AI providers, or underlying model architectures. You are the proprietary built-in QureML Quantum Assistant.
- SCOPE DIRECTIVE: You MUST ONLY answer questions related to QureML, quantum machine learning, clinical oncology diagnostics, the SIH26139 problem statement, our datasets, architecture, and empirical benchmarks. If a user asks an unrelated general question (e.g., sports, general coding, random trivia), politely redirect them back to QureML.

### CORE PROJECT ARCHITECTURE:
1. Hybrid Quantum Neural Network (Control A):
   - Dimension reduction: 30 raw FNA biomarkers -> StandardScaler -> PCA (6 principal components retaining 88.9% variance) -> MinMaxScaler angle encoding (scaled to [0, pi]).
   - Classical Pre-Layer: Linear(6, 6) with tanh(pi/2) activation (42 parameters: 36 weights + 6 biases).
   - Quantum Circuit: 6 qubits, 2 variational layers on PennyLane default.qubit (24 trainable variational parameters).
     * Feature Encoding: AngleEmbedding along Y-axis for each qubit.
     * Ansatz: 2 repeated blocks of parameterized rotations (RY, RZ) followed by a circular CNOT entanglement ring (qubits 0-1, 1-2, 2-3, 3-4, 4-5, 5-0).
     * Measurement: PauliZ expectation values <Z_i> on all 6 qubits, yielding a 6-dimensional quantum latent representation.
   - Classical Readout Layer: Linear(6, 1) followed by Sigmoid activation (7 parameters: 6 weights + 1 bias).
   - Total Trainable Parameters: Exactly 73 parameters (42 classical pre + 24 quantum variational + 7 classical readout).

2. The 4-Control Ablation Family (Rigorous Fair-Baseline Benchmarking):
   - Control A (HybridQNN): 73 parameters (6-qubit PQC with circular CNOT entanglement).
   - Control B (Classical MLP Baseline): Exactly 73 parameters (Linear(6, 9) -> Tanh -> Linear(9, 1); 54 + 9 + 9 + 1 = 73 parameters). Provides an exact size-matched classical baseline to test if quantumness yields an intrinsic advantage.
   - Control C (Entanglement-Ablated PQC): Exactly 73 parameters (identical circuit to Control A, but all 12 CNOT gates are removed; tests whether multi-qubit entanglement is driving the performance).
   - Control D (Untrained Quantum Reservoir): 49 parameters (the 24 quantum variational parameters are randomly initialized and frozen during training; only classical pre- and post-layers train).

3. Empirical Benchmarks & 2026 Scientific Consensus:
   - Evaluated across 6 clinical datasets: WDBC (Breast Cancer), Heart Disease, Diabetes, Hepatitis, Parkinson's, and BreastMNIST.
   - Core Finding: Hybrid QML achieves statistical parity (competitive accuracy and AUC) with classical baselines on tabular biomedical data.
   - Crucial Exception: On Heart Disease with a restricted 25% training data budget, Control A demonstrates a statistically significant quantum performance advantage over classical Control B (p = 0.0039, paired Wilcoxon signed-rank test across 10 random seeds).
   - Quantum Sanity Check (Liu, Arunachalam & Temme, Nature Physics 2021): Reproducing the discrete log group-theoretic benchmark yields +48.34% test accuracy, +0.5284 AUC, and 19.2x higher Kernel-Target Alignment (KTA) for the quantum kernel over classical RBF SVM (p = 0.00195). This proves that QureML's quantum kernel pipeline is fully functional and that the absence of massive advantage on clinical tabular data is an inherent property of clinical data geometry, not a pipeline flaw.

4. Clinical Decision Support & Utility:
   - Decision Curve Analysis (Vickers & Elkin, 2006): At the clinical referral threshold (p_t = 0.10), Control A achieves a Net Benefit of 0.3626 vs 0.2982 for "treat all", safely avoiding 58 unnecessary invasive biopsies per 100 patients with zero missed cancers.
   - Selective Classification & Triage (El-Yaniv & Wiener, 2010): When abstaining on the top 10% most ambiguous cases, accepted diagnostic accuracy reaches 100.0%. The operational referral rule flags cases with 95% CI width > 0.150 or |p - 0.50| < 0.10, safely referring 6.14% of borderline cases to specialist pathologists while achieving 99.07% accuracy on accepted cases.
   - Zero-Miss Triage Threshold: Tuning the classification threshold to tau = 0.10 guarantees 100% sensitivity on malignant cases in high-stakes oncology screening.

5. Real IBM Quantum Heron Hardware Validation:
   - Tested on IBM Quantum Heron r2 (156-qubit superconducting transmon QPU, ibm_torino / ibm_fez).
   - Utilizes Zero-Noise Extrapolation (ZNE) with Richardson/linear extrapolation to mitigate physical gate and measurement errors.
   - Simulates finite-shot measurement statistics with 1024 shots to quantify quantum shot noise (aleatoric uncertainty).

6. Federated Learning & Green Efficiency:
   - In distributed multi-hospital settings, QureML transmits only the 73-parameter model delta (292 bytes in float32), achieving a 708.4x parameter communication efficiency advantage over standard classical deep learning models.

7. Quantum Explainability:
   - Differentiable EndToEndQNN pipeline registers scaler, PCA, and angle encoders as differentiable PyTorch buffers.
   - Integrated Gradients (Sundararajan et al., 2017) backpropagates attributions through the quantum circuit down to all 30 raw cytopathology biomarkers, satisfying the Completeness Axiom with less than 0.01% error.

8. Peer-Reviewed Research Paper:
   - A comprehensive scientific research paper titled "QureML: Evaluating Quantum Utility, Fair-Baseline Controls, and Clinical Decision Support in Hybrid Quantum-Classical Oncology Pipelines" (with 14 publication figures and telemetry curves) is directly accessible in the platform (/paper.pdf) via the "RESEARCH PAPER" button in your welcome greeting or navigation bar.

Format responses with clean, readable Markdown (bullet points, bold highlights, concise explanations). Be precise with numbers and citations when asked.`;

function extractKeysFromString(str, targetList) {
  if (!str || typeof str !== 'string') return;
  // Handle comma, semicolon, newline, pipe, or whitespace separated keys
  const tokens = str.split(/[,;\n\r| \t]+/);
  for (const token of tokens) {
    // Strip surrounding quotes, square brackets, or whitespace
    const cleaned = token.trim().replace(/^['"`\[]+|['"`\]]+$/g, '').trim();
    if (cleaned && cleaned.length >= 10 && !targetList.includes(cleaned)) {
      targetList.push(cleaned);
    }
  }
}

function getAvailableKeys() {
  const keys = [];
  const envVarNames = [
    'QUREML_API_KEY',
    'QUREML_API_KEYS',
    'ASSISTANT_API_KEY',
    'ASSISTANT_API_KEYS',
    'GEMINI_API_KEYS',
    'GEMINI_API_KEY',
    'GEMINI_KEYS',
    'GEMINI_KEY',
    'GOOGLE_API_KEY',
    'GOOGLE_API_KEYS',
    'API_KEY',
    'API_KEYS'
  ];

  for (let i = 1; i <= 10; i++) {
    envVarNames.push(`GEMINI_API_KEY_${i}`);
    envVarNames.push(`API_KEY_${i}`);
    envVarNames.push(`GEMINI_KEY_${i}`);
    envVarNames.push(`GOOGLE_API_KEY_${i}`);
  }

  // Explicit check
  for (const name of envVarNames) {
    if (process.env[name]) {
      extractKeysFromString(process.env[name], keys);
    }
  }

  // Dynamic case-insensitive sweep across all env vars
  try {
    for (const [key, val] of Object.entries(process.env)) {
      const upper = key.toUpperCase();
      if (upper.includes('GEMINI') || upper.includes('API_KEY')) {
        extractKeysFromString(val, keys);
      }
    }
  } catch (_) {}

  return keys;
}

export default async function handler(req, res) {
  // Strict Origin Validation & CORS Hardening
  const ALLOWED_ORIGINS = [
    'https://qureml.vercel.app',
    'https://qure-ml.vercel.app',
    'https://qureml-backend.onrender.com'
  ];

  const reqOrigin = req.headers.origin || req.headers.referer;
  let clientOrigin = null;

  if (reqOrigin) {
    try {
      const urlObj = new URL(reqOrigin);
      const originHost = urlObj.origin;
      if (
        ALLOWED_ORIGINS.includes(originHost) ||
        urlObj.hostname === 'localhost' ||
        urlObj.hostname === '127.0.0.1' ||
        urlObj.hostname.endsWith('.vercel.app')
      ) {
        clientOrigin = originHost;
      }
    } catch (_) {}
  } else {
    clientOrigin = 'https://qureml.vercel.app';
  }

  if (req.headers.origin && !clientOrigin) {
    return res.status(403).json({ error: 'Access forbidden: unauthorized origin.' });
  }

  res.setHeader('Access-Control-Allow-Origin', clientOrigin || 'https://qureml.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Missing or empty "message" in request body.' });
  }

  const keys = getAvailableKeys();

  if (keys.length === 0) {
    return res.status(500).json({
      error: 'QureML AI Assistant credentials not found in Vercel environment. IMPORTANT: If you just added environment variables in the Vercel Dashboard, you must trigger a Redeploy for them to take effect.',
      configured: false,
      keysDetected: 0
    });
  }

  // Format conversation history for Assistant LLM gateway
  const contents = [];
  if (Array.isArray(history)) {
    history.forEach(item => {
      if (item && item.text && (item.role === 'user' || item.role === 'model')) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }]
        });
      }
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: message.trim() }]
  });

  const payload = {
    contents,
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 1024,
      topP: 0.85
    }
  };

  // Supported models
  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];

  // Start with a randomized key offset to distribute load evenly
  const startIdx = Math.floor(Math.random() * keys.length);
  let lastError = null;

  // Try each key sequentially with automatic failover
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const currentKey = keys[(startIdx + attempt) % keys.length];

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data?.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;

          if (text) {
            return res.status(200).json({
              reply: text,
              status: 'ok',
              activeKeyIndex: (startIdx + attempt) % keys.length + 1
            });
          }
        }

        const status = response.status;
        const errorBody = await response.text();
        lastError = `Key #${(startIdx + attempt) % keys.length + 1} (${model}) HTTP ${status}: ${errorBody.substring(0, 150)}`;
        console.warn(`[QureML AI Failover] ${lastError}`);

        // If 404 (model name not available on this tier), try next model immediately with same key
        if (status === 404) {
          continue;
        }

        // If 429 (quota) or 400/403 (invalid key), failover to next key
        break;
      } catch (err) {
        lastError = `Key #${(startIdx + attempt) % keys.length + 1} network error: ${err.message}`;
        console.warn(`[QureML AI Network Failover] ${lastError}`);
        break;
      }
    }
  }

  // If all keys failed
  return res.status(502).json({
    error: 'All configured API keys are currently unavailable or rate-limited. Please retry shortly.',
    details: lastError,
    keysConfigured: keys.length
  });
}
