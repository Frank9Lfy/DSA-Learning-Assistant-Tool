/* ========================================
   visualization/index.js - Module entry point
   FIXED: Uses correct Router.register API
   ======================================== */

Router.register('visualization', (params) => {
  // Initialize VizView when this route is activated
  if (typeof VizView !== 'undefined' && VizView.init) {
    VizView.init();
  }
});
