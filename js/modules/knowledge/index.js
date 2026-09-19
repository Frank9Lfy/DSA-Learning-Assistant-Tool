/* ========================================
   knowledge/index.js - Knowledge module entry
   ======================================== */

// 无详情的小节也可恢复（显示占位卡片）
function knowledgeSectionExists(id) {
  return typeof CHAPTERS !== 'undefined' && CHAPTERS.some(ch =>
    (ch.children || []).some(c => c.id === id));
}

Router.register('knowledge', (params) => {
  SearchEngine.init();
  KnowledgeView.init();

  if (params.length > 0) {
    KnowledgeView.selectItem(params[0]);
  } else if (Archive.getSettings().restoreKnowledge) {
    // 恢复上次浏览到的知识点
    const saved = Storage.get(APP_CONSTANTS.STORAGE_KEYS.KNOWLEDGE_POS, null);
    if (saved && (KNOWLEDGE[saved] || knowledgeSectionExists(saved))) {
      KnowledgeView.selectItem(saved);
    } else {
      KnowledgeView.showWelcome();
    }
  } else {
    KnowledgeView.showWelcome();
  }
});
