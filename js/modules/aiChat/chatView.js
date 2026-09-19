/* ========================================
   chatView.js - Chat UI Controller
   FIXED: Uses correct CSS class names from components.css
   ======================================== */

const ChatView = (() => {
  let elements = {};
  let isProcessing = false;
  let typingTimer = null;

  // 对话记录持久化（供存档/启动恢复使用）
  const CHAT_KEY = APP_CONSTANTS.STORAGE_KEYS.CHAT_HISTORY;
  const CHAT_LIMIT = 100;

  function persistMessage(role, content) {
    if (!Archive.getSettings().restoreChat) return;
    const list = Storage.get(CHAT_KEY, []);
    list.push({ role: role, content: content, t: Date.now() });
    while (list.length > CHAT_LIMIT) list.shift();
    Storage.set(CHAT_KEY, list);
  }

  function restoreHistory() {
    if (!Archive.getSettings().restoreChat || !elements.messages) return;
    const list = Storage.get(CHAT_KEY, []);
    list.forEach(m => {
      if (m && (m.role === 'user' || m.role === 'assistant') && m.content) {
        addMessage(m.role, m.content, { skipPersist: true });
      }
    });
    if (list.length > 0) {
      // 有历史记录后隐藏欢迎建议
      if (elements.suggestions && elements.suggestions.children.length > 0) {
        elements.suggestions.innerHTML = '';
      }
      scrollToBottom();
    }
  }

  function cacheElements() {
    elements = {
      messages: DOM.$('#chat-messages'),
      input: DOM.$('#chat-input'),
      sendBtn: DOM.$('#chat-send'),
      suggestions: DOM.$('#chat-suggestions'),
    };
  }

  function init() {
    cacheElements();
    if (!elements.messages) return;

    // Bind events
    if (elements.sendBtn) {
      elements.sendBtn.addEventListener('click', handleSend);
    }
    if (elements.input) {
      elements.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
      elements.input.addEventListener('input', autoResize);
    }

    // Render initial suggestions
    renderSuggestions();

    // 恢复上次的对话记录
    restoreHistory();

    console.log('[ChatView] Initialized');
  }

  function autoResize() {
    const ta = elements.input;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  /**
   * Add a message bubble using CSS classes that exist in components.css
   * @param {Object} [opts] - { skipPersist: boolean } 恢复历史时不重复写入存储
   */
  function addMessage(role, content, opts = {}) {
    if (!elements.messages) return null;

    // Use classes matching components.css: .chat-message, .chat-message.user
    const msgEl = DOM.create('div', {
      className: `chat-message ${role}`
    });

    const avatar = DOM.create('div', {
      className: 'chat-avatar'
    }, role === 'user' ? '🧑' : '🤖');

    const bubble = DOM.create('div', {
      className: 'chat-bubble'
    });

    if (role === 'assistant') {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }

    msgEl.appendChild(avatar);
    msgEl.appendChild(bubble);

    elements.messages.appendChild(msgEl);
    scrollToBottom();

    // 写入对话记录（跳过恢复时的重放）
    if (!opts.skipPersist && (role === 'user' || role === 'assistant')) {
      persistMessage(role, content);
    }

    return bubble;
  }

  function showTypingIndicator() {
    if (!elements.messages) return;
    hideTypingIndicator();

    const indicator = DOM.create('div', {
      className: 'chat-message assistant',
      id: 'chat-typing-indicator'
    });

    const avatar = DOM.create('div', { className: 'chat-avatar' }, '🤖');
    const bubble = DOM.create('div', { className: 'chat-bubble' });
    bubble.innerHTML = '<span class="typing-dot">●</span> <span class="typing-dot">●</span> <span class="typing-dot">●</span>';
    bubble.style.opacity = '0.6';
    bubble.style.fontStyle = 'italic';

    indicator.appendChild(avatar);
    indicator.appendChild(bubble);
    elements.messages.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = DOM.$('#chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  function handleSend() {
    if (isProcessing) return;

    const input = elements.input;
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show user message
    addMessage('user', text);

    // Hide suggestions after first message
    if (elements.suggestions && elements.suggestions.children.length > 0) {
      elements.suggestions.innerHTML = '';
    }

    // Processing state
    isProcessing = true;
    if (elements.sendBtn) elements.sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI "thinking" delay
    const thinkTime = 400 + Math.random() * 600;

    setTimeout(() => {
      // Get answer from RuleEngine
      const response = RuleEngine.answer(text);

      // Hide typing indicator
      hideTypingIndicator();

      // Add response
      const bubble = addMessage('assistant', response.text);

      // Show related topics as clickable chips
      if (response.related && response.related.length > 0) {
        const relatedEl = DOM.create('div', {
          style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }
        });

        response.related.forEach(topic => {
          const chip = DOM.create('button', {
            className: 'suggestion-chip',
            onClick: () => {
              if (elements.input) {
                elements.input.value = topic;
                handleSend();
              }
            }
          }, topic);
          relatedEl.appendChild(chip);
        });

        if (bubble && bubble.parentElement) {
          bubble.appendChild(relatedEl);
        }
      }

      // Low confidence disclaimer
      if (response.confidence < 0.5) {
        const disclaimer = DOM.create('div', {
          style: { marginTop: '8px', fontSize: '0.8em', color: 'var(--text-secondary)', fontStyle: 'italic' }
        }, '⚠️ 以上回答仅供参考，建议结合教材确认。');
        if (bubble) bubble.appendChild(disclaimer);
      }

      // Reset state
      isProcessing = false;
      if (elements.sendBtn) elements.sendBtn.disabled = false;
      if (elements.input) elements.input.focus();
    }, thinkTime);
  }

  function renderSuggestions() {
    if (!elements.suggestions) return;

    const suggestions = RuleEngine.getSuggestions();
    elements.suggestions.innerHTML = '';

    suggestions.forEach(text => {
      const chip = DOM.create('button', {
        className: 'suggestion-chip',
        onClick: () => {
          if (elements.input) {
            elements.input.value = text;
            handleSend();
          }
        }
      }, text);
      elements.suggestions.appendChild(chip);
    });
  }

  function clearChat() {
    if (!elements.messages) return;
    if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
    elements.messages.innerHTML = '';
    isProcessing = false;
    Storage.remove(CHAT_KEY);   // 同步清空持久化的对话记录
    renderSuggestions();
  }

  function scrollToBottom() {
    if (!elements.messages) return;
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  return {
    init,
    addMessage,
    handleSend,
    renderSuggestions,
    clearChat,
  };
})();
