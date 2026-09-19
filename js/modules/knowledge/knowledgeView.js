/* ========================================
   knowledgeView.js - Knowledge display view
   FIXED: handles missing entries, adds prev/next navigation
   ======================================== */

const KnowledgeView = (() => {
  let expandedChapters = new Set(['ch1', 'ch2']);
  let currentItemId = null;

  // Build a flat list of all section IDs for prev/next navigation
  let flatSections = [];

  function buildFlatSections() {
    flatSections = [];
    CHAPTERS.forEach(ch => {
      if (ch.children) {
        ch.children.forEach(child => {
          flatSections.push({ id: child.id, title: child.title, chapterId: ch.id, chapterTitle: ch.title });
        });
      }
    });
  }

  /**
   * Render chapter tree in sidebar
   */
  function renderChapterTree() {
    const container = DOM.$('#chapter-tree');
    if (!container) return;

    container.innerHTML = '';

    CHAPTERS.forEach(chapter => {
      const isExpanded = expandedChapters.has(chapter.id);
      const item = DOM.create('div', {
        className: `tree-item ${isExpanded ? 'expanded' : ''}`,
        dataset: { chapterId: chapter.id },
      });

      // Chapter header
      const header = DOM.create('div', {
        className: 'tree-item-header',
        onClick: () => toggleChapter(chapter.id),
      });
      header.innerHTML = `
        <span class="tree-item-toggle">${chapter.children?.length ? '▶' : ''}</span>
        <span class="tree-item-icon">${chapter.icon}</span>
        <span class="tree-item-label">${chapter.title}</span>
      `;
      item.appendChild(header);

      // Children
      if (chapter.children?.length) {
        const childContainer = DOM.create('div', { className: 'tree-children' });
        chapter.children.forEach(child => {
          const childItem = DOM.create('div', { className: 'tree-item' });
          const childHeader = DOM.create('div', {
            className: `tree-item-header ${currentItemId === child.id ? 'active' : ''}`,
            onClick: () => selectItem(child.id),
          });
          const entry = KNOWLEDGE[child.id];
          const icon = entry ? '📄' : '📝';
          childHeader.innerHTML = `
            <span class="tree-item-icon">${icon}</span>
            <span class="tree-item-label">${child.title}</span>
          `;
          childItem.appendChild(childHeader);
          childContainer.appendChild(childItem);
        });
        item.appendChild(childContainer);
      }

      container.appendChild(item);
    });
  }

  function toggleChapter(chapterId) {
    if (expandedChapters.has(chapterId)) {
      expandedChapters.delete(chapterId);
    } else {
      expandedChapters.add(chapterId);
    }
    renderChapterTree();
  }

  /**
   * Select and display a knowledge item
   */
  function selectItem(itemId) {
    currentItemId = itemId;
    const entry = KNOWLEDGE[itemId];
    const detail = DOM.$('#knowledge-detail');
    if (!detail) return;

    // Expand parent chapter
    CHAPTERS.forEach(ch => {
      if (ch.children?.some(c => c.id === itemId)) {
        expandedChapters.add(ch.id);
      }
    });

    if (entry) {
      // Full knowledge entry exists
      let html = `<div class="knowledge-content fade-in">`;
      html += entry.content || '';

      if (entry.code) {
        html += `<h4>💻 代码实现</h4>`;
        html += DOM.codeBlock(entry.code, 'cpp');
      }

      if (entry.complexity) {
        html += `<div class="mt-2"><strong>复杂度：</strong>
          <span class="complexity-badge badge-time">时间 ${entry.complexity.time}</span>
          <span class="complexity-badge badge-space">空间 ${entry.complexity.space}</span></div>`;
      }

      if (entry.related?.length) {
        html += `<div class="mt-3"><h4>📎 相关知识点</h4><div class="flex gap-1" style="flex-wrap:wrap">`;
        entry.related.forEach(relId => {
          const rel = KNOWLEDGE[relId];
          if (rel) {
            html += `<a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('${relId}')">${rel.title}</a>`;
          }
        });
        html += `</div></div>`;
      }

      html += renderPrevNextNav(itemId);
      html += `</div>`;
      detail.innerHTML = html;

    } else {
      // No detailed entry - show section info with placeholder
      const sectionInfo = flatSections.find(s => s.id === itemId);
      const chapter = CHAPTERS.find(ch => ch.id === itemId);

      if (chapter) {
        // It's a chapter header
        expandedChapters.add(itemId);
        detail.innerHTML = renderChapterOverview(chapter);
      } else if (sectionInfo) {
        // It's a section without detailed content
        let html = `<div class="knowledge-content fade-in">`;
        html += `<h3>${sectionInfo.title}</h3>`;
        html += `<p class="text-muted">所属章节：${sectionInfo.chapterTitle}</p>`;
        html += `<div class="card mt-2" style="padding:24px;text-align:center">`;
        html += `<p style="font-size:1.1em">📝 此节的详细课件内容尚未录入知识库。</p>`;
        html += `<p class="text-muted">请将PPT中对应内容以文本形式提供，即可补充到这里。</p>`;
        html += `<p class="text-muted mt-2">你可以尝试：</p>`;
        html += `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px">`;
        html += `<a href="#/teaching" class="btn btn-outline btn-sm">📖 查看交互教学</a>`;
        html += `<a href="#/visualization" class="btn btn-outline btn-sm">📈 查看算法可视化</a>`;
        html += `<a href="#/ai-chat" class="btn btn-outline btn-sm">🤖 向AI助教提问</a>`;
        html += `</div></div>`;
        html += renderPrevNextNav(itemId);
        html += `</div>`;
        detail.innerHTML = html;
      }
    }

    detail.scrollTop = 0;
    renderChapterTree();
    Store.set('knowledge.currentItem', itemId);
    // 记住当前位置（供启动恢复 / 存档使用）
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.KNOWLEDGE_POS, itemId);
  }

  /**
   * Render prev/next navigation buttons
   */
  function renderPrevNextNav(itemId) {
    const idx = flatSections.findIndex(s => s.id === itemId);
    if (idx < 0) return '';

    const prev = idx > 0 ? flatSections[idx - 1] : null;
    const next = idx < flatSections.length - 1 ? flatSections[idx + 1] : null;

    // Check if this is the last section in its chapter
    const currentSection = flatSections[idx];
    const chapterSections = flatSections.filter(s => s.chapterId === currentSection.chapterId);
    const isLastInChapter = chapterSections[chapterSections.length - 1].id === itemId;

    let html = `<div class="knowledge-nav mt-3" style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-top:1px solid var(--border-light);margin-top:24px;gap:8px;flex-wrap:wrap">`;

    // Previous button
    if (prev) {
      html += `<button class="btn btn-outline" onclick="KnowledgeView.selectItem('${prev.id}')">
        ← ${prev.title.length > 12 ? prev.title.substring(0, 12) + '...' : prev.title}
      </button>`;
    } else {
      html += `<button class="btn btn-outline" disabled>已是第一节</button>`;
    }

    // Middle: chapter quiz link (if last in chapter)
    if (isLastInChapter) {
      const chapterOfSection = CHAPTERS.find(ch => ch.id === currentSection.chapterId);
      html += `<a href="#/quiz/${currentSection.chapterId}" class="btn btn-primary">
        📝 进入${chapterOfSection ? chapterOfSection.title : currentSection.chapterTitle}测试
      </a>`;
    }

    // Next button
    if (next) {
      html += `<button class="btn btn-outline" onclick="KnowledgeView.selectItem('${next.id}')">
        ${next.title.length > 12 ? next.title.substring(0, 12) + '...' : next.title} →
      </button>`;
    } else {
      html += `<button class="btn btn-outline" disabled>已是最后一节</button>`;
    }

    html += `</div>`;
    return html;
  }

  function renderChapterOverview(chapter) {
    let html = `<div class="knowledge-content fade-in">`;
    html += `<h2>${chapter.icon} ${chapter.title}</h2>`;
    html += `<p class="text-muted">本章包含 ${chapter.children?.length || 0} 个知识点：</p>`;
    html += `<div class="mt-2" style="display:flex;flex-direction:column;gap:8px">`;

    chapter.children?.forEach((child, i) => {
      const entry = KNOWLEDGE[child.id];
      const hasContent = entry ? '✅' : '📝';
      html += `<div class="card" style="cursor:pointer;padding:12px" onclick="KnowledgeView.selectItem('${child.id}')">
        <div style="display:flex;align-items:center;gap:8px">
          <span>${hasContent}</span>
          <strong>${child.title}</strong>
        </div>
        ${entry ? `<div class="text-sm text-muted mt-1">${(entry.content || '').replace(/<[^>]+>/g, '').substring(0, 80)}...</div>` : '<div class="text-sm text-muted mt-1">点击查看详情</div>'}
      </div>`;
    });

    html += `</div>`;
    // Link to chapter quiz
    html += `<div class="mt-3" style="text-align:center">
      <a href="#/quiz/${chapter.id}" class="btn btn-primary">📝 开始${chapter.title}练习</a>
    </div>`;
    html += `</div>`;
    return html;
  }

  return {
    init() {
      buildFlatSections();
      renderChapterTree();
    },
    selectItem,
    toggleChapter,

    showSearchResults(results) {
      const detail = DOM.$('#knowledge-detail');
      if (!detail) return;
      if (!results.length) {
        detail.innerHTML = `<div class="welcome-card"><h3>没有找到相关内容</h3><p>试试其他关键词</p></div>`;
        return;
      }
      let html = `<div class="knowledge-content fade-in"><h3>🔍 搜索结果 (${results.length})</h3>`;
      results.forEach(r => {
        html += `<div class="card mb-2" style="cursor:pointer" onclick="KnowledgeView.selectItem('${r.id}')">
          <div class="card-header">
            <span class="card-title">${r.title}</span>
            ${r.chapter ? `<span class="tag tag-easy">${r.chapter.title}</span>` : ''}
          </div>
          <div class="card-body">${DOM.escapeHtml(r.snippet).substring(0, 120)}...</div>
        </div>`;
      });
      html += `</div>`;
      detail.innerHTML = html;
    },

    showWelcome() {
      const detail = DOM.$('#knowledge-detail');
      if (!detail) return;
      detail.innerHTML = `<div class="welcome-card">
        <h3>📖 欢迎来到知识库</h3>
        <p>从左侧选择一个章节开始学习，或使用顶部搜索框查找特定知识点。</p>
        <div class="mt-2" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch1-6')">时间复杂度</a>
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch2-2')">顺序表</a>
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch2-3')">链表</a>
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch5-4')">二叉树遍历</a>
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch8-6')">快速排序</a>
          <a href="javascript:void(0)" class="suggestion-chip" onclick="KnowledgeView.selectItem('ch10-6')">0-1背包</a>
        </div>
      </div>`;
    }
  };
})();
