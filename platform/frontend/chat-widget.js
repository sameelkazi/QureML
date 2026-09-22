/**
 * QureML Quantum Clinical Intelligence Assistant (SIH26139)
 * Ali Bot — Grounded AI Assistant & Clinical Co-Pilot
 * Neo-Brutalist UI/UX with Ali Bot Avatar & Multi-Key Failover
 */

(function () {
  'use strict';

  if (window.__QUREML_CHAT_INITIALIZED__) return;
  window.__QUREML_CHAT_INITIALIZED__ = true;

  const CHAT_STORAGE_KEY = 'qureml_chat_history_v2';
  const ALI_AVATAR_SRC = '/assets/guidebot/ali_forward.png';
  let isRequestInProgress = false;

  // Simple Markdown Renderer
  function renderMarkdown(md) {
    if (!md) return '';
    let escaped = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]*?)```/g, (match, p1) => {
      return `<pre class="qureml-code-block"><code>${p1.trim()}</code></pre>`;
    });

    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Lists and paragraphs
    const lines = escaped.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${trimmed.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
      } else {
        if (inList) {
          html += inList === true ? '</ul>' : '</ol>';
          inList = false;
        }
        if (trimmed) {
          html += `<p>${trimmed}</p>`;
        }
      }
    });
    if (inList) html += '</ul>';

    return html || escaped;
  }

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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
    // 1. Trigger Floating Button (Bottom Right)
    const trigger = document.createElement('button');
    trigger.id = 'qureml-chat-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open Ali Bot AI Assistant');
    trigger.innerHTML = `
      <div class="qureml-trigger-avatar-wrap">
        <img src="${ALI_AVATAR_SRC}" alt="Ali Bot Avatar" />
        <span class="qureml-trigger-status-dot"></span>
      </div>
      <div class="qureml-trigger-text-block">
        <span class="qureml-trigger-name">ALI BOT</span>
        <span class="qureml-trigger-role">ASK QUREML AI</span>
      </div>
    `;

    // 2. Chat Window Container
    const win = document.createElement('div');
    win.id = 'qureml-chat-window';
    win.className = 'hidden';
    win.innerHTML = `
      <!-- Header -->
      <div class="qureml-chat-header">
        <div class="qureml-chat-title-group">
          <div class="qureml-header-avatar-wrap">
            <img src="${ALI_AVATAR_SRC}" alt="Ali Bot Avatar" />
            <span class="qureml-header-status-badge"></span>
          </div>
          <div class="qureml-header-titles">
            <div class="qureml-chat-title">
              ALI BOT
              <span class="qureml-chat-role-badge">QUANTUM ARCHITECT</span>
            </div>
            <div class="qureml-chat-subtitle">QUREML CLINICAL INTELLIGENCE // SIH26139</div>
          </div>
        </div>
        <div class="qureml-chat-header-actions">
          <button id="qureml-chat-clear-btn" type="button" class="qureml-chat-header-btn" title="Clear Conversation">
            <span class="material-symbols-outlined" style="font-size:1rem;">restart_alt</span>
          </button>
          <button id="qureml-chat-close-btn" type="button" class="qureml-chat-header-btn" title="Close Assistant">
            <span class="material-symbols-outlined" style="font-size:1.1rem;">close</span>
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Chips for Judges -->
      <div class="qureml-chat-chips">
        <button type="button" class="qureml-chat-chip" data-query="Explain Control A vs Control B with the exact 73-parameter matching.">⚡ 73 Params Match</button>
        <button type="button" class="qureml-chat-chip" data-query="How does the 6-qubit PQC run on IBM Quantum Heron hardware with ZNE mitigation?">⚛️ IBM Heron Hardware</button>
        <button type="button" class="qureml-chat-chip" data-query="Explain the clinical triage referral gate (tau = 0.10) and 100% sensitivity.">🩺 Triage Gate (τ=0.10)</button>
        <button type="button" class="qureml-chat-chip" data-query="What was the statistically significant quantum advantage on Heart Disease at 25% data?">📈 Heart Disease p=0.0039</button>
        <button type="button" class="qureml-chat-chip" data-query="How does Integrated Gradients explainability work across the quantum ansatz?">🔬 Explainability (IG)</button>
        <button type="button" class="qureml-chat-chip" data-query="Why is federated learning 708.4x lighter in parameter transmission?">🌐 Federated 708.4× Win</button>
      </div>

      <!-- Messages Stream -->
      <div id="qureml-chat-messages" class="qureml-chat-messages"></div>

      <!-- Footer Input Console -->
      <form id="qureml-chat-form" class="qureml-chat-footer">
        <input 
          id="qureml-chat-input" 
          type="text" 
          class="qureml-chat-input" 
          placeholder="Ask Ali about architecture, benchmarks, or clinical utility..." 
          autocomplete="off"
        />
        <button id="qureml-chat-send-btn" type="submit" class="qureml-chat-send-btn" title="Send Message">
          <span class="material-symbols-outlined" style="font-size:1.15rem;">send</span>
        </button>
      </form>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    // Initial Messages Render
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

  // Create Assistant Message Row DOM
  function createAssistantRow(replyText) {
    const row = document.createElement('div');
    row.className = 'qureml-msg-row assistant';

    const avatar = document.createElement('div');
    avatar.className = 'qureml-msg-avatar';
    avatar.innerHTML = `<img src="${ALI_AVATAR_SRC}" alt="Ali Bot" />`;

    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'qureml-chat-bubble-wrap';

    const senderTag = document.createElement('span');
    senderTag.className = 'qureml-msg-sender-tag';
    senderTag.textContent = 'ALI BOT • QUANTUM ARCHITECT';

    const bubble = document.createElement('div');
    bubble.className = 'qureml-chat-bubble assistant';
    bubble.innerHTML = renderMarkdown(replyText);

    const actions = document.createElement('div');
    actions.className = 'qureml-bubble-actions';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'qureml-copy-btn';
    copyBtn.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:12px;">content_copy</span>
      <span>COPY</span>
    `;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(replyText).then(() => {
        copyBtn.innerHTML = `
          <span class="material-symbols-outlined" style="font-size:12px;">check</span>
          <span>COPIED!</span>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <span class="material-symbols-outlined" style="font-size:12px;">content_copy</span>
            <span>COPY</span>
          `;
        }, 1800);
      }).catch(() => {});
    });

    actions.appendChild(copyBtn);
    bubbleWrap.appendChild(senderTag);
    bubbleWrap.appendChild(bubble);
    bubbleWrap.appendChild(actions);

    row.appendChild(avatar);
    row.appendChild(bubbleWrap);
    return row;
  }

  // Create User Message Row DOM
  function createUserRow(userText) {
    const row = document.createElement('div');
    row.className = 'qureml-msg-row user';

    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'qureml-chat-bubble-wrap';

    const senderTag = document.createElement('span');
    senderTag.className = 'qureml-msg-sender-tag';
    senderTag.style.textAlign = 'right';
    senderTag.textContent = 'YOU (EVALUATOR)';

    const bubble = document.createElement('div');
    bubble.className = 'qureml-chat-bubble user';
    bubble.textContent = userText;

    bubbleWrap.appendChild(senderTag);
    bubbleWrap.appendChild(bubble);
    row.appendChild(bubbleWrap);
    return row;
  }

  function renderMessages(container) {
    if (!container) return;
    const history = getHistory();
    container.innerHTML = '';

    // Default System Greeting from Ali Bot
    const welcomeText = 
      "Greetings! I am **Ali**, Quantum Architecture Lead for **QureML** (SIH26139).\n\n" +
      "I am strictly grounded in our **73-parameter hybrid quantum architecture**, empirical evaluations across 6 clinical cohorts, and physical execution on the 156-qubit **IBM Quantum Heron r2** processor.\n\n" +
      "Feel free to click any suggestion chip above or ask me about our quantum controls, clinical referral threshold (τ = 0.10), or explainability benchmarks!";

    container.appendChild(createAssistantRow(welcomeText));

    history.forEach(item => {
      if (item.role === 'user') {
        container.appendChild(createUserRow(item.text));
      } else {
        container.appendChild(createAssistantRow(item.text));
      }
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
      }
    }

    throw lastResponse || new Error('Unable to connect to Ali Bot AI Assistant.');
  }

  async function sendMessage(userText) {
    if (!userText || isRequestInProgress) return;
    isRequestInProgress = true;

    const messagesBox = document.getElementById('qureml-chat-messages');
    const sendBtn = document.getElementById('qureml-chat-send-btn');
    const input = document.getElementById('qureml-chat-input');
    if (sendBtn) sendBtn.disabled = true;

    // Append user message row
    messagesBox.appendChild(createUserRow(userText));
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Append typing indicator with Ali Bot avatar
    const typingRow = document.createElement('div');
    typingRow.className = 'qureml-typing-row';
    typingRow.id = 'qureml-active-typing';
    typingRow.innerHTML = `
      <div class="qureml-msg-avatar">
        <img src="${ALI_AVATAR_SRC}" alt="Ali Bot" />
      </div>
      <div class="qureml-typing-bubble">
        <div class="qureml-typing-dot"></div>
        <div class="qureml-typing-dot"></div>
        <div class="qureml-typing-dot"></div>
      </div>
    `;
    messagesBox.appendChild(typingRow);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    const history = getHistory();
    const payload = {
      message: userText,
      history: history.slice(-10)
    };

    try {
      const data = await executeChatRequest(payload);
      const replyText = data.reply || 'No response received from Ali Bot.';

      // Save to conversation history
      history.push({ role: 'user', text: userText });
      history.push({ role: 'model', text: replyText });
      saveHistory(history);

      // Remove typing indicator & append Ali Bot assistant row
      if (typingRow.parentNode) typingRow.remove();
      messagesBox.appendChild(createAssistantRow(replyText));
    } catch (err) {
      if (typingRow.parentNode) typingRow.remove();
      const errorRow = createAssistantRow(
        `**Connection Notice:** ${err.message || 'Ali Bot is currently unavailable.'}\n\n` +
        `*If running locally or on Vercel, verify that API credentials (GEMINI_API_KEYS) are configured in the environment settings.*`
      );
      messagesBox.appendChild(errorRow);
    } finally {
      isRequestInProgress = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
  }

  // Global Programmatic Launcher (callable from nav menu or walkthrough)
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
