/* ========================================
   index.js - Code Judge Module Entry Point
   Registers route and initializes on first visit
   ======================================== */

(() => {
  let initialized = false;

  /**
   * Initialize the code judge module
   * @param {string[]} params - Route parameters
   */
  function initModule(params) {
    if (!initialized) {
      JudgeView.init();
      initialized = true;
    }

    // Handle route params (e.g., #/code-judge/problem-id)
    if (params && params.length > 0) {
      const problemId = params[0];
      JudgeView.loadProblem(problemId);
    }

    // Refresh editor after view becomes visible
    setTimeout(() => {
      CodeEditor.refresh();
      CodeEditor.focus();
    }, 100);
  }

  // Register with router
  if (typeof Router !== 'undefined') {
    Router.register(APP_CONSTANTS.ROUTES.CODE_JUDGE, initModule);
  } else {
    // Fallback: listen to route:change event
    EventBus.on('route:change', ({ route, params }) => {
      if (route === APP_CONSTANTS.ROUTES.CODE_JUDGE) {
        initModule(params);
      }
    });
  }

  // Check API availability on load (non-blocking)
  if (typeof CodeExecutor !== 'undefined') {
    CodeExecutor.isAvailable().then(available => {
      if (!available) {
        console.warn('Piston API may not be available. Code execution might not work.');
      }
    });
  }
})();
