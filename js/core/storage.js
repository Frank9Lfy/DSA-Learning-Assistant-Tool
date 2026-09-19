/* ========================================
   storage.js - localStorage wrapper
   ======================================== */

const Storage = {
  /**
   * Get value from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default if not found
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set value to localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage write failed:', err);
    }
  },

  /**
   * Remove a key from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear all DSH-related storage
   */
  clearAll() {
    Object.values(APP_CONSTANTS.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
