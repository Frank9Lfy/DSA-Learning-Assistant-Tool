/* ========================================
   dom.js - DOM utility functions
   ======================================== */

const DOM = {
  /**
   * Query single element
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (default: document)
   * @returns {Element|null}
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query all matching elements
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {Element[]}
   */
  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Create element with attributes
   * @param {string} tag - Tag name
   * @param {Object} attrs - Attributes
   * @param {string|Element[]} children - innerHTML or child elements
   * @returns {Element}
   */
  create(tag, attrs = {}, children = '') {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      }
      else if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      }
      else if (key === 'dataset') {
        Object.entries(val).forEach(([k, v]) => el.dataset[k] = v);
      }
      else el.setAttribute(key, val);
    });
    if (typeof children === 'string') {
      el.innerHTML = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child) el.appendChild(
          typeof child === 'string' ? document.createTextNode(child) : child
        );
      });
    }
    return el;
  },

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - success|error|warning|info
   * @param {number} duration - Duration in ms
   */
  toast(message, type = 'info', duration = APP_CONSTANTS.TOAST_DURATION) {
    const container = DOM.$('#toast-container');
    const toast = DOM.create('div', {
      className: `toast toast-${type}`
    }, message);
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Show modal dialog
   * @param {string} title - Modal title
   * @param {string} content - Modal body HTML
   * @param {Object} [opts] - { wide: boolean } 宽屏弹窗（如模板库）
   */
  showModal(title, content, opts = {}) {
    DOM.$('#modal-title').textContent = title;
    DOM.$('#modal-body').innerHTML = content;
    const modal = DOM.$('#modal');
    if (modal) modal.classList.toggle('modal-wide', !!opts.wide);
    DOM.$('#modal-overlay').style.display = 'flex';
  },

  /**
   * Hide modal
   */
  hideModal() {
    const modal = DOM.$('#modal');
    if (modal) modal.classList.remove('modal-wide');
    DOM.$('#modal-overlay').style.display = 'none';
  },

  /**
   * Escape HTML entities
   * @param {string} str - Raw string
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Debounce function
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in ms
   * @returns {Function}
   */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Format code block with syntax highlighting (basic)
   * @param {string} code - Source code
   * @param {string} lang - Language name
   * @returns {string} HTML
   */
  codeBlock(code, lang = 'cpp') {
    const escaped = DOM.escapeHtml(code);
    const lines = escaped.split('\n').map((line, i) => {
      return `<span class="code-line"><span class="code-line-num">${i + 1}</span>${line}</span>`;
    }).join('\n');
    return `<div class="code-block">
      <span class="code-lang">${lang}</span>
      <button class="code-copy" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').textContent)">复制</button>
      <pre><code>${lines}</code></pre>
    </div>`;
  },

  /**
   * Generate unique ID
   * @returns {string}
   */
  uid() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  },
};
