/* ========================================
   teaching/index.js - Teaching module entry
   ======================================== */

Router.register('teaching', (params) => {
  TeachView.init();
  if (params.length > 0) {
    TeachView.loadLesson(params[0]);
  }
});
