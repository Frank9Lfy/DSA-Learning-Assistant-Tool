/* ========================================
   index.js - AI Chat Module Entry Point
   Initializes all chat sub-modules
   ======================================== */

const AIChat = (() => {
  let initialized = false;

  return {
    /**
     * Initialize the AI Chat module
     * Should be called when the chat route is first visited
     */
    init() {
      if (initialized) return;
      initialized = true;

      // Initialize rule engine info (log rule count)
      console.log(`[AIChat] Loaded ${RuleEngine.getRuleCount()} Q&A rules`);

      // Initialize chat view
      ChatView.init();

      // Register clear chat button if present
      const clearBtn = DOM.$('#chat-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('确定要清空聊天记录吗？')) {
            ChatView.clearChat();
            DOM.toast('聊天记录已清空', 'success');
          }
        });
      }

      // Listen for route activation
      EventBus.on('route:ai-chat', () => {
        // Chat is now visible, focus input
        const input = DOM.$('#chat-input');
        if (input) setTimeout(() => input.focus(), 100);
      });

      console.log('[AIChat] Module initialized');
    },

    /**
     * Programmatically ask a question (for integration with other modules)
     * @param {string} question
     */
    ask(question) {
      const input = DOM.$('#chat-input');
      if (input) {
        input.value = question;
        ChatView.handleSend();
      }
    },

    /**
     * Get the answer to a question without UI (for other modules)
     * @param {string} question
     * @returns {{text: string, confidence: number, related: string[]}}
     */
    getAnswer(question) {
      return RuleEngine.answer(question);
    }
  };
})();

// ─── 以下代码必须在 IIFE 外执行（放在 return 之后是永远跑不到的死代码）───

// Register with router：进入 ai-chat 路由时确保已初始化
if (typeof Router !== 'undefined' && Router.register) {
  Router.register('ai-chat', () => {
    AIChat.init();
    EventBus.emit('route:ai-chat', {});
  });
}

// Auto-init when script loads（否则发送按钮永远没有绑定事件）
function _aiChatAutoInit() {
  try {
    AIChat.init();
    window.__aiChatAutoInit = 'ok';
  } catch (e) {
    window.__aiChatAutoInit = 'error: ' + e.message;
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _aiChatAutoInit);
} else {
  _aiChatAutoInit();
}
