/* ========================================
   app.js - Main application entry point
   DSA Review Platform
   ======================================== */

const App = (() => {
  /**
   * Initialize the application
   */
  function init() {
    // 初始化存档系统（安装自动快照钩子 + 数据丢失兜底恢复）
    // 必须在其他模块读取 localStorage 之前执行
    Archive.init();

    // Apply saved theme
    const theme = Storage.get(APP_CONSTANTS.STORAGE_KEYS.THEME, APP_CONSTANTS.DEFAULTS.THEME);
    applyTheme(theme);

    // Bind global events
    bindEvents();

    // Initialize search engine
    SearchEngine.init();

    // 恢复上次浏览位置（Router.init 之前设置 hash）
    if (Archive.getSettings().restoreRoute && !location.hash) {
      const last = Storage.get(APP_CONSTANTS.STORAGE_KEYS.LAST_ROUTE, null);
      if (typeof last === 'string' && last.startsWith('#/')) {
        location.hash = last;
      }
    }

    // Initialize router (must be last)
    Router.init();

    console.log('🚀 DSA Review Platform initialized');
  }

  /**
   * Bind global event listeners
   */
  function bindEvents() {
    // Sidebar toggle
    const sidebarToggle = DOM.$('#sidebar-toggle');
    const menuBtn = DOM.$('#menu-btn');
    const sidebar = DOM.$('#sidebar');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        Storage.set(APP_CONSTANTS.STORAGE_KEYS.SIDEBAR, !sidebar.classList.contains('collapsed'));
      });
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Theme toggle
    const themeToggle = DOM.$('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    }

    // Global search
    const searchInput = DOM.$('#global-search');
    const searchResults = DOM.$('#search-results');

    if (searchInput) {
      searchInput.addEventListener('input', DOM.debounce((e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
          searchResults.classList.remove('visible');
          return;
        }

        const results = SearchEngine.search(query, 10);
        renderSearchResults(results, query);
      }, 200));

      searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
          searchResults.classList.add('visible');
        }
      });

      // Close search on click outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
          searchResults.classList.remove('visible');
        }
      });
    }

    // Modal close on overlay click
    const modalOverlay = DOM.$('#modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
      }
      // Escape to close modal/search
      if (e.key === 'Escape') {
        closeModal();
        searchResults?.classList.remove('visible');
      }
    });
  }

  /**
   * Render global search results dropdown
   */
  function renderSearchResults(results, query) {
    const container = DOM.$('#search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div class="search-result-item"><span class="text-muted">没有找到相关内容</span></div>';
      container.classList.add('visible');
      return;
    }

    container.innerHTML = results.map(r => {
      const chapterLabel = r.chapter?.title || '';
      return `<div class="search-result-item" onclick="App.navigateToItem('${r.id}')">
        <div class="search-result-title">
          <span class="search-result-tag">${chapterLabel.substring(0, 6)}</span>
          ${highlightMatch(r.title, query)}
        </div>
        <div class="search-result-desc">${highlightMatch(r.snippet.substring(0, 100), query)}...</div>
      </div>`;
    }).join('');
    container.classList.add('visible');
  }

  /**
   * Highlight matching text in search results
   */
  function highlightMatch(text, query) {
    if (!query) return DOM.escapeHtml(text);
    const escaped = DOM.escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark style="background:#fff3cd;padding:0 2px;border-radius:2px">$1</mark>');
  }

  /**
   * Apply theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.THEME, theme);
    const toggle = DOM.$('#theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  return {
    init,

    /**
     * Navigate to a knowledge item
     */
    navigateToItem(itemId) {
      const searchResults = DOM.$('#search-results');
      if (searchResults) searchResults.classList.remove('visible');
      const searchInput = DOM.$('#global-search');
      if (searchInput) searchInput.value = '';

      Router.navigate('knowledge', itemId);
    },

    /**
     * Close modal
     */
    closeModal() {
      DOM.hideModal();
    },

    /**
     * Get app version
     */
    version() {
      return '1.7.0';
    }
  };
})();

// Boot the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
