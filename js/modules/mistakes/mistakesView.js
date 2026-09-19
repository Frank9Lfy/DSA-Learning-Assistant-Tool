/* ========================================
   mistakesView.js - 错题本视图
   列表 / 筛选 / 单题重做 / 重练 / 导入导出
   依赖：MistakeEngine、QuizView、CHAPTERS、DOM、Storage
   ======================================== */

const MistakesView = (() => {
  let chapterFilter = 'all';
  let difficultyFilter = 'all';
  let redoId = null;          // 当前正在"单题重做"的题目 id
  let redoAnswered = null;    // { id, selected } 重做后立即反馈

  // ─── 主渲染 ─────────────────────────────────────────────────────

  function render() {
    const container = DOM.$('#mistakes-container');
    if (!container) return;

    const st = MistakeEngine.stats();
    const filtered = MistakeEngine.getFiltered(chapterFilter, difficultyFilter);

    let html = '';

    // 顶部统计卡
    html += `
      <div class="card mbook-stats" style="padding:20px;margin-bottom:16px">
        <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:12px">
          <h3 style="margin:0">📕 错题本</h3>
          <span class="text-sm text-muted">共收藏 <b style="color:var(--accent-primary)">${st.total}</b> 道错题
          （easy ${st.byDifficulty.easy} · medium ${st.byDifficulty.medium} · hard ${st.byDifficulty.hard}）</span>
        </div>
        <div class="mbook-chips" style="display:flex;gap:6px;flex-wrap:wrap">
          ${renderChapterChips(st)}
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px">
          <select id="mbook-diff-filter" class="mbook-select" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-light);background:var(--bg-card);color:var(--text-primary)">
            <option value="all" ${difficultyFilter === 'all' ? 'selected' : ''}>全部难度</option>
            <option value="easy" ${difficultyFilter === 'easy' ? 'selected' : ''}>简单</option>
            <option value="medium" ${difficultyFilter === 'medium' ? 'selected' : ''}>中等</option>
            <option value="hard" ${difficultyFilter === 'hard' ? 'selected' : ''}>困难</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="MistakesView.startRedoQuiz()">🔁 重练筛选结果 (${filtered.length})</button>
          <button class="btn btn-outline btn-sm" onclick="MistakesView.toggleImport()">📥 导入</button>
          <button class="btn btn-outline btn-sm" onclick="MistakesView.exportBook()">📤 导出</button>
          <button class="btn btn-outline btn-sm" onclick="MistakesView.clearAll()" style="color:var(--accent-danger)">🗑 清空</button>
        </div>
      </div>
    `;

    // 导入面板（默认隐藏）
    html += `
      <div id="mbook-import-panel" class="card" style="display:none;padding:20px;margin-bottom:16px">
        <h4 style="margin-top:0">📥 导入题目到错题本</h4>
        <p class="text-sm text-muted">支持两种格式混用的 JSON 数组：① 完整题目对象（结构同题库，id 可省略）；② 内置题库的题目 id 字符串。</p>
        <textarea id="mbook-import-text" rows="8" class="mbook-textarea"
          style="width:100%;padding:12px;border-radius:8px;border:1px solid var(--border-light);background:var(--bg-main);color:var(--text-primary);font-family:monospace;font-size:0.9em"
          placeholder='[
  "ch3-02",
  {
    "chapter": "ch5",
    "difficulty": "medium",
    "question": "深度为4的满二叉树有多少个结点？",
    "options": ["8", "15", "16", "31"],
    "answer": 1,
    "explanation": "2^4 - 1 = 15。"
  }
]'></textarea>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary btn-sm" onclick="MistakesView.doImport()">导入</button>
          <button class="btn btn-outline btn-sm" onclick="MistakesView.toggleImport()">取消</button>
        </div>
      </div>
    `;

    // 题目列表
    if (filtered.length === 0) {
      html += `
        <div class="welcome-card mbook-empty">
          <h3>${st.total === 0 ? '错题本是空的' : '当前筛选条件下没有错题'}</h3>
          <p>${st.total === 0
            ? '在「练习测验」中答错的题目会自动收进这里；也可以点「📥 导入」手动添加题目。'
            : '换个章节或难度筛选试试。'}</p>
        </div>
      `;
    } else {
      html += '<div class="mbook-list">';
      filtered.forEach((rec, i) => {
        html += renderMistakeCard(rec, i);
      });
      html += '</div>';
    }

    container.innerHTML = html;

    const diffSelect = DOM.$('#mbook-diff-filter');
    if (diffSelect) {
      diffSelect.addEventListener('change', e => {
        difficultyFilter = e.target.value;
        render();
      });
    }
  }

  function renderChapterChips(st) {
    const chips = [`<span class="suggestion-chip mbook-chip ${chapterFilter === 'all' ? 'mbook-chip-active' : ''}" onclick="MistakesView.setChapter('all')">全部 (${st.total})</span>`];
    CHAPTERS.forEach(ch => {
      const n = st.byChapter[ch.id] || 0;
      if (n === 0 && chapterFilter !== ch.id) return;
      chips.push(`<span class="suggestion-chip mbook-chip ${chapterFilter === ch.id ? 'mbook-chip-active' : ''}" onclick="MistakesView.setChapter('${ch.id}')">${ch.title.replace(/^第/, '第')} (${n})</span>`);
    });
    return chips.join('');
  }

  function renderMistakeCard(rec, index) {
    const q = MistakeEngine.getQuestionById(rec.id);
    if (!q) {
      return `<div class="card mbook-item" style="padding:14px;margin-bottom:10px">
        <span class="text-muted">题目数据缺失（id: ${DOM.escapeHtml(rec.id)}）
          <button class="btn btn-outline btn-sm" onclick="MistakesView.removeOne('${rec.id}')">移除</button></span>
      </div>`;
    }

    const chapter = CHAPTERS.find(c => c.id === q.chapter);
    const timeStr = new Date(rec.lastTime).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const redoing = redoId === rec.id;

    let optionsHtml = '';
    const showing = redoing ? (redoAnswered && redoAnswered.id === rec.id) : true;
    q.options.forEach((opt, oi) => {
      let style = `border:1px solid var(--border-light);background:var(--bg-card);color:var(--text-primary)`;
      let icon = '';
      if (redoing) {
        if (redoAnswered && redoAnswered.id === rec.id) {
          if (oi === q.answer) { style = 'border:1px solid var(--accent-success);background:rgba(46,204,113,.12)'; icon = ' ✅'; }
          else if (oi === redoAnswered.selected) { style = 'border:1px solid var(--accent-danger);background:rgba(231,76,60,.12)'; icon = ' ❌'; }
        }
      } else if (oi === rec.userAnswer) {
        style = 'border:1px solid var(--accent-danger);background:rgba(231,76,60,.12)'; icon = ' ← 你上次选的';
      }
      const click = redoing && !(redoAnswered && redoAnswered.id === rec.id)
        ? ` onclick="MistakesView.answerRedo('${rec.id}', ${oi})" style="cursor:pointer;${style}"`
        : ` style="${style}"`;
      optionsHtml += `
        <div class="mbook-opt" ${click}>
          <b>${String.fromCharCode(65 + oi)}.</b> ${DOM.escapeHtml(opt)}${icon ? `<span class="text-sm">${icon}</span>` : ''}
        </div>`;
    });

    const redoArea = redoing
      ? `<div class="text-sm text-muted" style="margin-top:8px">
           ${redoAnswered && redoAnswered.id === rec.id
             ? (redoAnswered.selected === q.answer
                 ? '🎉 答对了！已自动从错题本移除。'
                 : '❌ 还是错了，正确答案已标绿，题目保留在错题本中。')
             : '👆 点击选项作答，答对自动移出错题本'}
         </div>`
      : '';

    return `
      <div class="card mbook-item" style="padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
          <div style="font-weight:600;white-space:pre-wrap">${index + 1}. ${DOM.escapeHtml(q.question)}</div>
          <span class="tag tag-${q.difficulty}">${difficultyLabel(q.difficulty)}</span>
        </div>
        <div class="mbook-opts" style="display:flex;flex-direction:column;gap:6px;margin:10px 0">
          ${optionsHtml}
        </div>
        ${redoArea}
        ${q.explanation && (!redoing || (redoAnswered && redoAnswered.id === rec.id))
          ? `<div class="text-sm text-muted quiz-explanation" style="white-space:pre-wrap;border-top:1px dashed var(--border-light);padding-top:8px">💡 ${DOM.escapeHtml(q.explanation)}</div>`
          : ''}
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px">
          <div class="text-sm text-muted">
            📂 ${chapter ? chapter.title : q.chapter} · 错过 ${rec.wrongCount} 次 · ${timeStr}
            ${redoing ? '<button class="btn btn-outline btn-sm" onclick="MistakesView.cancelRedo()" style="margin-left:8px">收起</button>' : ''}
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-outline btn-sm" onclick="MistakesView.startRedo('${rec.id}')">✏️ 重做</button>
            <button class="btn btn-outline btn-sm" onclick="MistakesView.removeOne('${rec.id}')">移除</button>
          </div>
        </div>
      </div>
    `;
  }

  function difficultyLabel(d) {
    return d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难';
  }

  // ─── 交互动作 ───────────────────────────────────────────────────

  function setChapter(ch) { chapterFilter = ch; redoId = null; redoAnswered = null; render(); }

  function startRedo(id) {
    redoId = id;
    redoAnswered = null;
    render();
  }

  function cancelRedo() { redoId = null; redoAnswered = null; render(); }

  function answerRedo(id, selected) {
    const q = MistakeEngine.getQuestionById(id);
    if (!q) return;
    redoAnswered = { id, selected };
    if (selected === q.answer) {
      MistakeEngine.remove(id);
    } else {
      MistakeEngine.recordWrong(q, selected, 'redo');
    }
    render();
  }

  function removeOne(id) {
    MistakeEngine.remove(id);
    DOM.toast('已从错题本移除', 'success');
    render();
  }

  function clearAll() {
    if (!MistakeEngine.getRecords().length) { DOM.toast('错题本已经是空的', 'info'); return; }
    if (confirm('确定清空整个错题本吗？此操作不可恢复。')) {
      MistakeEngine.clear();
      DOM.toast('错题本已清空', 'success');
      render();
    }
  }

  function toggleImport() {
    const panel = DOM.$('#mbook-import-panel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }

  function doImport() {
    const text = DOM.$('#mbook-import-text');
    if (!text || !text.value.trim()) { DOM.toast('请先粘贴 JSON 内容', 'warning'); return; }
    const result = MistakeEngine.importJSON(text.value.trim());
    if (result.added > 0) DOM.toast(`成功导入 ${result.added} 道题` + (result.skipped ? `（${result.skipped} 道已在错题本中跳过）` : ''), 'success');
    if (result.errors.length) {
      alert('导入完成，但有以下问题：\n' + result.errors.slice(0, 10).join('\n') + (result.errors.length > 10 ? `\n...共 ${result.errors.length} 条` : ''));
    } else if (result.added === 0 && result.skipped === 0) {
      DOM.toast('没有可导入的题目', 'warning');
    }
    if (result.added > 0) {
      text.value = '';
      toggleImport();
    }
    render();
  }

  function exportBook() {
    const records = MistakeEngine.getRecords();
    if (!records.length) { DOM.toast('错题本是空的，没有可导出的内容', 'warning'); return; }
    const json = MistakeEngine.exportJSON();
    // 下载文件
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'dsa-mistake-book-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      DOM.toast('已导出 JSON 文件', 'success');
    } catch (e) {
      // 下载失败时退化为复制到剪贴板
      copyText(json);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => DOM.toast('已复制到剪贴板', 'success'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      DOM.toast('已复制到剪贴板', 'success');
    } catch (e) {
      DOM.toast('复制失败，请手动导出', 'danger');
    }
    document.body.removeChild(ta);
  }

  /**
   * 把筛选后的错题发给练习测验做一套重练。
   * 重练结束（提交或超时）后，答对的自动移出错题本（见 quizView 钩子）。
   */
  function startRedoQuiz() {
    const filtered = MistakeEngine.getFiltered(chapterFilter, difficultyFilter);
    const questions = filtered.map(r => MistakeEngine.getQuestionById(r.id)).filter(Boolean);
    if (!questions.length) { DOM.toast('当前筛选条件下没有可重练的错题', 'warning'); return; }
    QuizView.startMistakeQuiz(questions);
  }

  // ─── 公开 API ───────────────────────────────────────────────────

  return {
    init: render,
    render,
    setChapter,
    startRedo,
    cancelRedo,
    answerRedo,
    removeOne,
    clearAll,
    toggleImport,
    doImport,
    exportBook,
    startRedoQuiz,
  };
})();
