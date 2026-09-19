/* ========================================
   quiz/index.js - Quiz Module Entry Point
   Initializes quiz engine and view
   ======================================== */

const QuizModule = (() => {
  let initialized = false;

  return {
    /**
     * Initialize the Quiz module
     */
    init() {
      if (initialized) return;
      initialized = true;

      // Initialize quiz view
      QuizView.init();

      // Register route handler
      if (typeof Router !== 'undefined' && Router.register) {
        Router.register('quiz', () => {
          QuizView.init();
        });
      }

      // Listen for route events
      EventBus.on('route:quiz', () => {
        // Re-cache elements in case they were re-rendered
        // QuizView.init() handles this
      });

      console.log('[Quiz] Module initialized');
    },

    /**
     * Get quiz history from storage
     * @returns {Object[]}
     */
    getHistory() {
      return Storage.get(APP_CONSTANTS.STORAGE_KEYS.QUIZ_HISTORY, []);
    },

    /**
     * Clear quiz history
     */
    clearHistory() {
      Storage.set(APP_CONSTANTS.STORAGE_KEYS.QUIZ_HISTORY, []);
      Store.set('quiz.history', []);
      DOM.toast('测验历史已清空', 'success');
    },

    /**
     * Get average score from history
     * @returns {number|null}
     */
    getAverageScore() {
      const history = this.getHistory();
      if (history.length === 0) return null;
      const total = history.reduce((sum, r) => sum + (r.percentage || r.score || 0), 0);
      return Math.round(total / history.length);
    },

    /**
     * Get total quizzes taken
     * @returns {number}
     */
    getTotalQuizzes() {
      return this.getHistory().length;
    }
  };
})();

// Auto-init when script loads
document.addEventListener('DOMContentLoaded', () => {
  QuizModule.init();
});

// Legacy Router registration (backward compatibility)
if (typeof Router !== 'undefined' && Router.register) {
  Router.register('quiz', () => {
    QuizView.init();
  });
}
