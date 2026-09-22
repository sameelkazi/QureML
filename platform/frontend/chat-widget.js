/**
 * ============================================================================
 * QureML Quantum Clinical Intelligence Assistant — Client-Side Chat Widget
 * Interactive Multi-Turn Grounded Architecture & Benchmarks Q&A
 * SIH26139 | Egreen Quanta & SPIT Mumbai
 * ============================================================================
 */

(function () {
  'use strict';

  // Prevent duplicate initialization
  if (window.__QUREML_CHAT_INITIALIZED__) return;
  window.__QUREML_CHAT_INITIALIZED__ = true;

  const CHAT_STORAGE_KEY = 'qureml_chat_history';
  let isRequestInProgress = false;

  // Simple Markdown Parser for clean, rich message rendering
  function renderMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced Code blocks
    escaped = escaped.replace(/```([\s\S]*?)```/g, function (match, code) {
      return '<pre style="background:#111;color:#F5D77F;padding:8px 10px;border-radius:3px;overflow-x:auto;font-family:monospace;font-size:0.8em;border:1px solid #333;margin:6px 0;"><code>' + code.trim() + '</code></pre>';
    });

    // Inline code
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold text (**text**)
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic text (*text*)
    escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Markdown Bullet lists
    const lines = escaped.split('\n');
    let inList = false;
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^[-*•]\s+/.test(line)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += '<li>' + line.replace(/^[-*•]\s+/, '') + '</li>';
      } else if (/^\d+\.\s+/.test(line)) {
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += '<li>' + line.replace(/^\d+\.\s+/, '') + '</li>';
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (line) {
          html += '<p>' + line + '</p>';
        }
      }
    }
    if (inList) html += '</ul>';

    return html || escaped;
  }

  // Load chat history from sessionStorage
  function getHistory() {
    try {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history.slice(-14)));
    } catch (_) {}
  }

  // Inject Widget DOM
  function createWidgetDOM() {
    // 1. Trigger Floating Button
    const trigger = document.createElement('button');
    trigger.id = 'qureml-chat-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open QureML AI Assistant');
    trigger.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:1.15rem;">smart_toy</span>
      <span>ASK QUREML AI</span>
    `;

    // 2. Chat Window Container
    const win = document.createElement('div');
    win.id = 'qureml-chat-window';
    win.className = 'hidden';
    win.innerHTML = `
      <!-- Header -->
      <div class="qureml-chat-header">
        <div class="qureml-chat-title-group">
          <div class="qureml-chat-logo-badge">Q</div>
          <div>
            <div class="qureml-chat-title">QURE<span>ML</span> ASSISTANT</div>
            <div class="qureml-chat-subtitle">GROUNDED QUANTUM CLINICAL AI</div>
          </div>
        </div>
        <div class="qureml-chat-header-actions">
          <button id="qureml-chat-clear-btn" type="button" class="qureml-chat-header-btn" title="Clear Conversation">
            <span class="material-symbols-outlined" style="font-size:1.05rem;">restart_alt</span>
          </button>
          <button id="qureml-chat-close-btn" type="button" class="qureml-chat-header-btn" title="Close Assistant">
            <span class="material-symbols-outlined" style="font-size:1.1rem;">close</span>
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Chips for Judges -->
      <div class="qureml-chat-chips">
        <button type="button" class="qureml-chat-chip" data-query="Explain Control A vs Control B with the exact 73-parameter matching.">73 Params Match</button>
        <button type="button" class="qureml-chat-chip" data-query="How does the 6-qubit PQC run on IBM Quantum Heron hardware with ZNE mitigation?">IBM Heron Hardware</button>
        <button type="button" class="qureml-chat-chip" data-query="Explain the clinical triage referral gate (tau = 0.10) and 100% sensitivity.">Clinical Triage (τ=0.10)</button>
        <button type="button" class="qureml-chat-chip" data-query="What was the statistically significant quantum advantage on Heart Disease at 25% data?">Heart Disease p=0.0039</button>
        <button type="button" class="qureml-chat-chip" data-query="How does Integrated Gradients explainability work across the quantum ansatz?">Explainability (IG)</button>
        <button type="button" class="qureml-chat-chip" data-query="Why is federated learning 708.4x lighter in parameter transmission?">Federated 708.4× Win</button>
      </div>

      <!-- Messages Stream -->
      <div id="qureml-chat-messages" class="qureml-chat-messages"></div>

      <!-- Footer Input Console -->
      <form id="qureml-chat-form" class="qureml-chat-footer">
        <input 
          id="qureml-chat-input" 
          type="text" 
          class="qureml-chat-input" 
          placeholder="Ask anything about architecture, benchmarks, or clinical utility..." 
          autocomplete="off"
        />
        <button id="qureml-chat-send-btn" type="submit" class="qureml-chat-send-btn" title="Send Message">
          <span class="material-symbols-outlined" style="font-size:1.2rem;">send</span>
        </button>
      </form>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    // Initial Welcome Message
    const messagesBox = win.querySelector('#qureml-chat-messages');
    renderMessages(messagesBox);

    // Event Handlers
    trigger.addEventListener('click', toggleChatWindow);
    win.querySelector('#qureml-chat-close-btn').addEventListener('click', closeChatWindow);
    win.querySelector('#qureml-chat-clear-btn').addEventListener('click', clearConversation);

    // Chip Click
    win.querySelectorAll('.qureml-chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        if (q && !isRequestInProgress) {
          sendMessage(q);
        }
      });
    });

    // Submit Form
    const form = win.querySelector('#qureml-chat-form');
    const input = win.querySelector('#qureml-chat-input');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (txt && !isRequestInProgress) {
        input.value = '';
        sendMessage(txt);
      }
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !win.classList.contains('hidden')) {
        closeChatWindow();
      }
    });
  }

  function toggleChatWindow() {
    const win = document.getElementById('qureml-chat-window');
    const trigger = document.getElementById('qureml-chat-trigger');
    if (!win) return;
    const isClosed = win.classList.contains('hidden');
    if (isClosed) {
      win.classList.remove('hidden');
      if (trigger) trigger.classList.add('active');
      const input = document.getElementById('qureml-chat-input');
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      closeChatWindow();
    }
  }

  function closeChatWindow() {
    const win = document.getElementById('qureml-chat-window');
    const trigger = document.getElementById('qureml-chat-trigger');
    if (win) win.classList.add('hidden');
    if (trigger) trigger.classList.remove('active');
  }

  function clearConversation() {
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    const messagesBox = document.getElementById('qureml-chat-messages');
    if (messagesBox) {
      renderMessages(messagesBox);
    }
  }

  function renderMessages(container) {
    if (!container) return;
    const history = getHistory();
    container.innerHTML = '';

    // Default System Greeting
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'qureml-chat-bubble assistant';
    welcomeDiv.innerHTML = renderMarkdown(
      "Greetings! I am the **QureML Quantum Clinical Intelligence Assistant** (SIH26139).\n\n" +
      "I am strictly grounded in our **hybrid quantum machine learning architecture**, 73-parameter matched controls, real IBM Quantum Heron r2 execution, and empirical benchmarks across 6 clinical datasets.\n\n" +
      "Select a suggested topic above or ask any technical question!"
    );
    container.appendChild(welcomeDiv);

    history.forEach(item => {
      const bubble = document.createElement('div');
      bubble.className = `qureml-chat-bubble ${item.role === 'user' ? 'user' : 'assistant'}`;
      bubble.innerHTML = renderMarkdown(item.text);
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  // Resolve active backend chat endpoint across Vercel & local FastAPI
  async function executeChatRequest(payload) {
    const candidateEndpoints = [];
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (isLocal) {
      // Running locally: prioritize local server, then Vercel endpoint
      if (window.QUREML_BACKEND_URL) {
        candidateEndpoints.push(window.QUREML_BACKEND_URL + '/chat');
      }
      candidateEndpoints.push('http://127.0.0.1:8000/chat');
      candidateEndpoints.push('/api/chat');
    } else {
      // Hosted on Vercel or remote: prioritize Vercel Serverless Function where Vercel Env Vars reside!
      candidateEndpoints.push('/api/chat');
      if (window.QUREML_BACKEND_URL) {
        candidateEndpoints.push(window.QUREML_BACKEND_URL + '/chat');
      }
      candidateEndpoints.push('/chat');
    }

    let lastResponse = null;

    for (const url of candidateEndpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          return data;
        }

        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.detail || errData.error || `Server responded with HTTP ${res.status}`;
        lastResponse = new Error(errMsg);

        // If this candidate returned 404 (not found) or 500 (unconfigured), continue trying next candidate
        if (res.status === 404 || res.status === 500 || res.status === 502) {
          continue;
        }
      } catch (err) {
        lastResponse = err;
        // Network error on this candidate, try next
      }
    }

    throw lastResponse || new Error('Unable to connect to QureML Assistant endpoint.');
  }

  async function sendMessage(userText) {
    if (!userText || isRequestInProgress) return;
    isRequestInProgress = true;

    const messagesBox = document.getElementById('qureml-chat-messages');
    const sendBtn = document.getElementById('qureml-chat-send-btn');
    const input = document.getElementById('qureml-chat-input');
    if (sendBtn) sendBtn.disabled = true;

    // Append user message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'qureml-chat-bubble user';
    userBubble.textContent = userText;
    messagesBox.appendChild(userBubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Append typing indicator
    const typingElem = document.createElement('div');
    typingElem.className = 'qureml-typing-indicator';
    typingElem.id = 'qureml-active-typing';
    typingElem.innerHTML = `
      <div class="qureml-typing-dot"></div>
      <div class="qureml-typing-dot"></div>
      <div class="qureml-typing-dot"></div>
    `;
    messagesBox.appendChild(typingElem);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    const history = getHistory();
    const payload = {
      message: userText,
      history: history.slice(-10)
    };

    try {
      const data = await executeChatRequest(payload);
      const replyText = data.reply || 'No response received from assistant.';

      // Save to conversation history
      history.push({ role: 'user', text: userText });
      history.push({ role: 'model', text: replyText });
      saveHistory(history);

      // Replace typing indicator with assistant bubble
      if (typingElem.parentNode) typingElem.remove();
      const assistantBubble = document.createElement('div');
      assistantBubble.className = 'qureml-chat-bubble assistant';
      assistantBubble.innerHTML = renderMarkdown(replyText);
      messagesBox.appendChild(assistantBubble);
    } catch (err) {
      if (typingElem.parentNode) typingElem.remove();
      const errorBubble = document.createElement('div');
      errorBubble.className = 'qureml-chat-bubble assistant';
      errorBubble.style.borderColor = '#b91c1c';
      errorBubble.style.background = '#fef2f2';
      errorBubble.innerHTML = renderMarkdown(
        `**Connection Notice:** ${err.message || 'The assistant is currently unavailable.'}\n\n` +
        `*If running locally or on Vercel, verify that API credentials (API_KEY_1 through API_KEY_5) are configured in the environment settings.*`
      );
      messagesBox.appendChild(errorBubble);
    } finally {
      isRequestInProgress = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
  }

  // Global Programmatic Launcher (callable from nav or walkthrough)
  window.openQureMLChat = function (initialQuery) {
    const win = document.getElementById('qureml-chat-window');
    const trigger = document.getElementById('qureml-chat-trigger');
    if (win && win.classList.contains('hidden')) {
      win.classList.remove('hidden');
      if (trigger) trigger.classList.add('active');
    }
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  };

  // Wait for DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidgetDOM);
  } else {
    createWidgetDOM();
  }
})();
