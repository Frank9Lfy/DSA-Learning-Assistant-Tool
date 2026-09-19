/* ========================================
   mistakes/index.js - 错题本模块入口
   ======================================== */

const MistakesModule = (() => {
  let initialized = false;

  return {
    init() {
      if (initialized) return;
      initialized = true;

      if (typeof Router !== 'undefined' && Router.register) {
        Router.register('mistakes', () => {
          MistakesView.render();
        });
      }
      console.log('[Mistakes] Module initialized');
    },
  };
})();

// Auto-init when script loads
document.addEventListener('DOMContentLoaded', () => {
  MistakesModule.init();
});
