/* ========================================
   store.js - Global state management
   Publish/Subscribe state store
   ======================================== */

const Store = (() => {
  // Private state
  let state = {
    route: APP_CONSTANTS.ROUTES.KNOWLEDGE,
    theme: Storage.get(APP_CONSTANTS.STORAGE_KEYS.THEME, APP_CONSTANTS.DEFAULTS.THEME),
    sidebarOpen: true,

    knowledge: {
      chapters: [],
      currentChapter: null,
      currentItem: null,
      searchQuery: '',
      searchResults: [],
    },

    teaching: {
      lessons: [],
      currentLesson: null,
      currentStep: 0,
      totalSteps: 0,
      isPlaying: false,
    },

    visualization: {
      currentAlgo: 'bubble',
      speed: APP_CONSTANTS.DEFAULTS.VIZ_SPEED,
      dataSize: APP_CONSTANTS.DEFAULTS.VIZ_SIZE,
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0,
      comparisons: 0,
      swaps: 0,
      data: [],
    },

    codeJudge: {
      code: '',
      stdin: '',
      output: '',
      error: '',
      testResults: [],
      isRunning: false,
      currentProblem: null,
    },

    quiz: {
      active: false,
      questions: [],
      currentIndex: 0,
      answers: {},
      score: 0,
      timeRemaining: 0,
      history: Storage.get(APP_CONSTANTS.STORAGE_KEYS.QUIZ_HISTORY, []),
    },

    chat: {
      messages: [],
      isTyping: false,
    },

    resources: {
      bookmarks: Storage.get(APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS, []),
    },
  };

  // Subscribers
  const subscribers = new Map();

  return {
    /**
     * Get state value by path
     * @param {string} path - Dot-separated path (e.g., 'knowledge.currentChapter')
     * @returns {any}
     */
    get(path) {
      return path.split('.').reduce((obj, key) => obj?.[key], state);
    },

    /**
     * Set state value and notify subscribers
     * @param {string} path - Dot-separated path
     * @param {any} value - New value
     */
    set(path, value) {
      const keys = path.split('.');
      let obj = state;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      const oldVal = obj[keys[keys.length - 1]];
      obj[keys[keys.length - 1]] = value;

      // Notify relevant subscribers
      this._notify(path, value, oldVal);
    },

    /**
     * Update state with partial object (shallow merge at path)
     * @param {string} path - Path to object
     * @param {Object} updates - Properties to merge
     */
    update(path, updates) {
      const current = this.get(path) || {};
      const merged = { ...current, ...updates };
      this.set(path, merged);
    },

    /**
     * Subscribe to state changes
     * @param {string} path - State path to watch (or '*' for all)
     * @param {Function} callback - (newVal, oldVal, path) => void
     * @returns {Function} Unsubscribe function
     */
    subscribe(path, callback) {
      if (!subscribers.has(path)) {
        subscribers.set(path, new Set());
      }
      subscribers.get(path).add(callback);
      return () => subscribers.get(path)?.delete(callback);
    },

    /**
     * Notify subscribers of state changes
     * @private
     */
    _notify(path, newVal, oldVal) {
      // Exact match
      if (subscribers.has(path)) {
        subscribers.get(path).forEach(cb => {
          try { cb(newVal, oldVal, path); } catch(e) { console.error('Store subscriber error:', e); }
        });
      }
      // Parent path matches (e.g., subscribing to 'knowledge' gets 'knowledge.currentChapter')
      subscribers.forEach((callbacks, subPath) => {
        if (subPath !== '*' && path.startsWith(subPath + '.') && subPath !== path) {
          callbacks.forEach(cb => {
            try { cb(newVal, oldVal, path); } catch(e) { console.error('Store subscriber error:', e); }
          });
        }
      });
      // Wildcard
      if (subscribers.has('*')) {
        subscribers.get('*').forEach(cb => {
          try { cb(newVal, oldVal, path); } catch(e) { console.error('Store subscriber error:', e); }
        });
      }
    },

    /**
     * Get full state snapshot (for debugging)
     */
    getState() {
      return JSON.parse(JSON.stringify(state));
    },

    /**
     * Reset state to defaults
     */
    reset() {
      state.knowledge.currentChapter = null;
      state.knowledge.currentItem = null;
      state.teaching.currentLesson = null;
      state.teaching.currentStep = 0;
      state.visualization.currentStep = 0;
      state.visualization.comparisons = 0;
      state.visualization.swaps = 0;
      state.codeJudge.output = '';
      state.codeJudge.testResults = [];
      state.quiz.active = false;
      this._notify('*', state, null);
    }
  };
})();
