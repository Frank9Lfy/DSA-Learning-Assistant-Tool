/* ========================================
   resourceView.js - Resources display view
   ======================================== */

const ResourceView = (() => {
  let activeCategory = 'all';
  let bookmarks = new Set(Storage.get(APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS, []));

  /**
   * Render resource cards
   */
  function render() {
    const container = DOM.$('#resources-container');
    if (!container) return;

    // Category filter tabs
    const categories = ['all', ...new Set(RESOURCES.map(r => r.category))];
    let html = '<div class="flex gap-1 mb-3" style="flex-wrap:wrap">';
    categories.forEach(cat => {
      const label = cat === 'all' ? '全部' : cat;
      const active = activeCategory === cat ? 'btn-primary' : 'btn-outline';
      html += `<button class="btn btn-sm ${active}" onclick="ResourceView.filterCategory('${cat}')">${label}</button>`;
    });
    html += '</div>';

    // Resource cards
    const filtered = activeCategory === 'all'
      ? RESOURCES
      : RESOURCES.filter(r => r.category === activeCategory);

    html += '<div class="resources-container">';
    filtered.forEach(r => {
      const isBookmarked = bookmarks.has(r.id);
      const bookmarkIcon = isBookmarked ? '⭐' : '☆';
      html += `
        <div class="resource-card">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div class="resource-card-icon">${r.icon}</div>
            <button class="btn-icon" style="font-size:1.2rem" onclick="ResourceView.toggleBookmark('${r.id}')" 
                    title="${isBookmarked ? '取消收藏' : '收藏'}">${bookmarkIcon}</button>
          </div>
          <div class="resource-card-title">${r.title}</div>
          <div class="resource-card-desc">${r.description}</div>
          <div style="display:flex;gap:4px;margin:8px 0">
            ${(r.tags || []).map(t => `<span class="tag tag-easy">${t}</span>`).join('')}
            <span class="tag tag-medium">${r.language || ''}</span>
          </div>
          <div class="resource-card-link">
            ${r.url !== '#' ? `<a href="${r.url}" target="_blank" rel="noopener">访问链接 →</a>` : '<span class="text-muted">书籍资源</span>'}
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  return {
    init() {
      render();
    },

    filterCategory(cat) {
      activeCategory = cat;
      render();
    },

    toggleBookmark(id) {
      if (bookmarks.has(id)) {
        bookmarks.delete(id);
        DOM.toast('已取消收藏', 'info');
      } else {
        bookmarks.add(id);
        DOM.toast('已收藏', 'success');
      }
      Storage.set(APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS, [...bookmarks]);
      render();
    }
  };
})();
