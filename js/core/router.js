/* ========================================
   router.js - Hash-based SPA router
   ======================================== */

const Router = (() => {
  const routes = new Map();
  let currentRoute = '';

  /**
   * Parse hash to route + params
   * @param {string} hash - URL hash (e.g., '#/knowledge/ch1')
   * @returns {{ route: string, params: string[] }}
   */
  function parseHash(hash) {
    const clean = hash.replace(/^#\/?/, '');
    const parts = clean.split('/').filter(Boolean);
    return {
      route: parts[0] || APP_CONSTANTS.ROUTES.KNOWLEDGE,
      params: parts.slice(1),
    };
  }

  /**
   * Handle route change
   */
  function handleRouteChange() {
    const { route, params } = parseHash(location.hash);

    if (!Object.values(APP_CONSTANTS.ROUTES).includes(route)) {
      location.hash = '#/' + APP_CONSTANTS.ROUTES.KNOWLEDGE;
      return;
    }

    currentRoute = route;
    Store.set('route', route);

    // Update nav active state
    DOM.$$('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === route);
    });

    // Update view visibility
    DOM.$$('.view').forEach(view => {
      view.classList.toggle('active', view.dataset.view === route);
    });

    // Update breadcrumb
    const routeNames = {
      'knowledge': '知识检索',
      'teaching': '交互教学',
      'visualization': '算法可视化',
      'code-judge': '代码评判',
      'quiz': '练习测验',
      'mistakes': '错题本',
      'ai-chat': 'AI 助教',
      'resources': '拓展资源',
      'settings': '设置与存档',
    };
    DOM.$('#breadcrumb').textContent = routeNames[route] || route;

    // 记住浏览位置（供下次打开时恢复）
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.LAST_ROUTE, location.hash);

    // Notify route-specific handlers
    EventBus.emit('route:change', { route, params });

    // Call registered handler
    if (routes.has(route)) {
      routes.get(route)(params);
    }
  }

  return {
    /**
     * Register a route handler
     * @param {string} route - Route name
     * @param {Function} handler - (params: string[]) => void
     */
    register(route, handler) {
      routes.set(route, handler);
    },

    /**
     * Navigate to a route
     * @param {string} route - Route name
     * @param {string[]} params - Route params
     */
    navigate(route, ...params) {
      const hash = '#/' + [route, ...params].join('/');
      if (location.hash === hash) {
        handleRouteChange(); // Force re-render
      } else {
        location.hash = hash;
      }
    },

    /**
     * Get current route
     * @returns {string}
     */
    current() {
      return currentRoute;
    },

    /**
     * Initialize router
     */
    init() {
      window.addEventListener('hashchange', handleRouteChange);
      // Handle initial route
      if (!location.hash) {
        location.hash = '#/' + APP_CONSTANTS.ROUTES.KNOWLEDGE;
      } else {
        handleRouteChange();
      }
    }
  };
})();
