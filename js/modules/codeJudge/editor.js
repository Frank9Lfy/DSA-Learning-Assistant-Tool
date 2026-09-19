/* ========================================
   editor.js - CodeMirror editor wrapper
   Provides a clean API for code editor operations
   ======================================== */

const CodeEditor = (() => {
  let editorInstance = null;
  const eventHandlers = new Map();

  /**
   * Initialize CodeMirror instance in container
   * @param {string} containerId - Container element ID
   * @param {Object} options - Optional config overrides
   * @returns {Object} editor instance
   */
  function init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`CodeEditor: Container #${containerId} not found`);
      return null;
    }

    // Clear container
    container.innerHTML = '';

    // Create CodeMirror instance
    editorInstance = CodeMirror(container, {
      value: options.value || '',
      mode: options.mode || 'text/x-c++src',
      theme: options.theme || 'dracula',
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: false,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      extraKeys: {
        'Ctrl-/': 'toggleComment',
        'Cmd-/': 'toggleComment',
        'Ctrl-Space': 'autocomplete',
        'Tab': (cm) => {
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            cm.replaceSelection('  ', 'end');
          }
        }
      },
      ...options
    });

    // Set reasonable height
    editorInstance.setSize('100%', '400px');

    // Bind stored event handlers
    eventHandlers.forEach((callbacks, eventName) => {
      callbacks.forEach(cb => {
        editorInstance.on(eventName, cb);
      });
    });

    return editorInstance;
  }

  /**
   * Get current code from editor
   * @returns {string}
   */
  function getCode() {
    if (!editorInstance) return '';
    return editorInstance.getValue();
  }

  /**
   * Set code in editor
   * @param {string} code - Code to set
   */
  function setCode(code) {
    if (!editorInstance) return;
    editorInstance.setValue(code || '');
  }

  /**
   * Change editor theme
   * @param {string} theme - Theme name
   */
  function setTheme(theme) {
    if (!editorInstance) return;
    editorInstance.setOption('theme', theme);
  }

  /**
   * Focus the editor
   */
  function focus() {
    if (!editorInstance) return;
    editorInstance.focus();
  }

  /**
   * Register event handler
   * @param {string} event - Event name (change, focus, blur, etc.)
   * @param {Function} callback - Handler function
   */
  function on(event, callback) {
    if (!eventHandlers.has(event)) {
      eventHandlers.set(event, []);
    }
    eventHandlers.get(event).push(callback);

    // Bind immediately if editor exists
    if (editorInstance) {
      editorInstance.on(event, callback);
    }
  }

  /**
   * Get editor instance (for advanced operations)
   * @returns {Object} CodeMirror instance
   */
  function getInstance() {
    return editorInstance;
  }

  /**
   * Refresh editor (call after container resize)
   */
  function refresh() {
    if (editorInstance) {
      editorInstance.refresh();
    }
  }

  return {
    init,
    getCode,
    setCode,
    setTheme,
    focus,
    on,
    getInstance,
    refresh
  };
})();
