/* ========================================
   eventBus.js - Publish/Subscribe event system
   ======================================== */

const EventBus = (() => {
  const listeners = new Map();

  return {
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(callback);
      // Return unsubscribe function
      return () => listeners.get(event)?.delete(callback);
    },

    /**
     * Subscribe once
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    once(event, callback) {
      const unsub = this.on(event, (...args) => {
        callback(...args);
        unsub();
      });
      return unsub;
    },

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass
     */
    emit(event, ...args) {
      if (listeners.has(event)) {
        listeners.get(event).forEach(cb => {
          try {
            cb(...args);
          } catch (err) {
            console.error(`EventBus error in "${event}":`, err);
          }
        });
      }
    },

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    off(event) {
      listeners.delete(event);
    },

    /**
     * Clear all listeners
     */
    clear() {
      listeners.clear();
    }
  };
})();
