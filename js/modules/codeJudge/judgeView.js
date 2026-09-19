/* ========================================
   judgeView.js - Code Judge View Controller
   Manages UI, events, and rendering for code judge

   模板库（重构）：
   - 旧的「模板下拉框 + 插入模板」按钮已移除（两步操作且易误解为追加插入）。
   - 新增「📚 模板库」按钮：弹窗内集中展示全部模板（起步骨架 / 完整类模板 /
     知识库 46 个数据结构代码模板），支持分类筛选、关键字搜索、代码预览，
     一键「使用」（直接替换编辑器内容，草稿自动持久化）或「复制」，
     可跳转对应知识点。
   - 编辑器草稿（代码 + 当前题目）持久化到 localStorage，重开页面自动恢复。
   - 换题 / 使用模板均直接覆盖编辑器，不再弹确认框。
   ======================================== */

const JudgeView = (() => {
  let initialized = false;
  let currentProblem = null;

  // 模板库弹窗的筛选状态（弹窗关闭后保留，便于反复打开）
  let tplSearch = '';
  let tplCategory = 'all';
  let tplDelegationBound = false;   // modal-body 事件委托只绑一次

  // ─── Initialization ──────────────────────────────────────

  function init() {
    if (initialized) return;
    initialized = true;

    // Initialize editor
    CodeEditor.init('judge-editor');

    // Populate problem selector
    populateProblemSelector();

    // Bind events
    bindEvents();

    // 恢复上次会话的编辑器草稿（设置允许时）
    const restored = restoreJudgeState();

    if (!restored) {
      // 无草稿：加载第一道题（或默认空骨架）
      if (typeof JUDGE_PROBLEMS !== 'undefined' && JUDGE_PROBLEMS.length > 0) {
        loadProblem(JUDGE_PROBLEMS[0].id, { silent: true });
      } else {
        CodeEditor.setCode(`#include <iostream>
using namespace std;

int main() {
    // Write your code here

    return 0;
}`);
      }
    }

    // 编辑器内容变化：保存草稿（防抖，避免每次击键都写 localStorage）
    CodeEditor.on('change', DOM.debounce(() => {
      const code = CodeEditor.getCode();
      Store.set('codeJudge.code', code);
      persistJudgeState();
    }, 800));
  }

  // ─── Judge State (draft persistence) ─────────────────────

  function persistJudgeState() {
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.JUDGE_STATE, {
      code: CodeEditor.getCode ? CodeEditor.getCode() : '',
      problemId: currentProblem ? currentProblem.id : null,
      savedAt: Date.now(),
    });
  }

  /**
   * 恢复草稿。返回 true 表示已恢复（调用方不再加载默认题）。
   */
  function restoreJudgeState() {
    if (!Archive.getSettings().restoreJudge) return false;
    const state = Storage.get(APP_CONSTANTS.STORAGE_KEYS.JUDGE_STATE, null);
    if (!state || !state.code) return false;

    if (state.problemId && typeof JUDGE_PROBLEMS !== 'undefined') {
      const problem = JUDGE_PROBLEMS.find(p => p.id === state.problemId || p.id === Number(state.problemId));
      if (problem) {
        loadProblem(problem.id, { silent: true });
      }
    }
    CodeEditor.setCode(state.code);
    DOM.toast('已恢复上次的代码草稿', 'info');
    return true;
  }

  // ─── Problem Selector ────────────────────────────────────

  function populateProblemSelector() {
    const select = DOM.$('#judge-problem');
    if (!select) return;

    select.innerHTML = '';

    if (typeof JUDGE_PROBLEMS === 'undefined' || JUDGE_PROBLEMS.length === 0) {
      select.innerHTML = '<option value="">暂无题目</option>';
      return;
    }

    // Group by category
    const categories = {};
    JUDGE_PROBLEMS.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    Object.entries(categories).forEach(([cat, problems]) => {
      const optgroup = DOM.create('optgroup', { label: cat });
      problems.forEach(p => {
        const option = DOM.create('option', { value: p.id }, DOM.escapeHtml(p.title));
        // Difficulty badge via data attribute
        option.dataset.difficulty = p.difficulty;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });
  }

  // ─── Event Binding ───────────────────────────────────────

  function bindEvents() {
    // Problem selector change
    const problemSelect = DOM.$('#judge-problem');
    if (problemSelect) {
      problemSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          loadProblem(e.target.value);
        }
      });
    }

    // 模板库按钮
    const tplBtn = DOM.$('#judge-templates');
    if (tplBtn) {
      tplBtn.addEventListener('click', () => openTemplateLibrary());
    }

    // Run button
    const runBtn = DOM.$('#judge-run');
    if (runBtn) {
      runBtn.addEventListener('click', () => runCode());
    }

    // Submit button
    const submitBtn = DOM.$('#judge-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => submitCode());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        submitCode();
      }
      // Ctrl/Cmd + T：快速打开模板库（编辑器未聚焦时）
      if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T') &&
          !e.target.closest('.CodeMirror')) {
        const judgeView = DOM.$('#view-code-judge');
        if (judgeView && judgeView.classList.contains('active')) {
          e.preventDefault();
          openTemplateLibrary();
        }
      }
    });
  }

  // ─── Template Library ────────────────────────────────────

  function openTemplateLibrary() {
    if (typeof CODE_TEMPLATES === 'undefined' || CODE_TEMPLATES.all.length === 0) {
      DOM.toast('模板库数据未加载', 'error');
      return;
    }
    DOM.showModal('📚 代码模板库', buildTemplateLibraryHtml(), { wide: true });
    bindTemplateLibraryEvents();
  }

  function filteredTemplates() {
    const kw = tplSearch.trim().toLowerCase();
    return CODE_TEMPLATES.all.filter(t => {
      if (tplCategory !== 'all' && t.category !== tplCategory) return false;
      if (!kw) return true;
      return (t.title || '').toLowerCase().includes(kw) ||
             (t.desc || '').toLowerCase().includes(kw) ||
             (t.code || '').toLowerCase().includes(kw);
    });
  }

  function buildTemplateLibraryHtml() {
    const cats = CODE_TEMPLATES.categories();
    const countOf = c => CODE_TEMPLATES.all.filter(t => t.category === c).length;
    const total = CODE_TEMPLATES.all.length;

    let html = `
      <div class="tpl-lib">
        <div class="tpl-lib-toolbar">
          <input type="text" id="tpl-lib-search" class="tpl-lib-search"
                 placeholder="🔍 搜索模板名称 / 描述 / 代码关键字…（当前共 ${total} 个模板）"
                 value="${DOM.escapeHtml(tplSearch)}">
          <div class="tpl-lib-cats" id="tpl-lib-cats">
            <button class="tpl-cat-chip ${tplCategory === 'all' ? 'active' : ''}" data-cat="all">全部 ${total}</button>
            ${cats.map(c => `
              <button class="tpl-cat-chip ${tplCategory === c ? 'active' : ''}" data-cat="${DOM.escapeHtml(c)}">
                ${DOM.escapeHtml(c)} ${countOf(c)}
              </button>`).join('')}
          </div>
          <p class="tpl-lib-hint text-sm text-muted">
            💡 类 / 算法模板多数不含 <code>main()</code>，直接「运行」会链接失败——评测题请先选择题目，
            或搭配「起步骨架」分类中的 main 模板使用。「使用」会替换编辑器全部内容（当前代码已自动存为草稿，可在设置板块找回）。
          </p>
        </div>
        <div class="tpl-lib-list" id="tpl-lib-list">${renderTemplateItems()}</div>
      </div>
    `;
    return html;
  }

  function renderTemplateItems() {
    const list = filteredTemplates();
    if (list.length === 0) {
      return '<div class="tpl-lib-empty">没有匹配的模板，换个关键字试试</div>';
    }
    return list.map(t => {
      const preview = (t.code || '').split('\n').slice(0, 6).join('\n');
      const more = (t.code || '').split('\n').length - 6;
      const cx = t.complexity
        ? `<span class="complexity-badge badge-time">时间 ${DOM.escapeHtml(String(t.complexity.time))}</span>
           <span class="complexity-badge badge-space">空间 ${DOM.escapeHtml(String(t.complexity.space))}</span>`
        : '';
      return `
        <div class="tpl-item" data-tpl-id="${t.id}">
          <div class="tpl-item-head">
            <span class="tpl-item-title">${DOM.escapeHtml(t.title)}</span>
            <span class="tpl-item-cat">${DOM.escapeHtml(t.category)}</span>
          </div>
          ${t.desc ? `<div class="tpl-item-desc">${DOM.escapeHtml(t.desc)}</div>` : ''}
          <div class="tpl-item-badges">${cx}</div>
          <pre class="tpl-item-code">${DOM.escapeHtml(preview)}${more > 0 ? `\n… 共 ${(more + 6)} 行` : ''}</pre>
          <div class="tpl-item-actions">
            <button class="btn btn-primary btn-sm tpl-use" data-action="use" data-tpl-id="${t.id}">✓ 使用此模板</button>
            <button class="btn btn-outline btn-sm" data-action="copy" data-tpl-id="${t.id}">📋 复制</button>
            ${t.knowledgeId ? `<button class="btn btn-outline btn-sm" data-action="knowledge" data-tpl-id="${t.id}" title="在知识检索中查看详细讲解">📖 查看讲解</button>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  function bindTemplateLibraryEvents() {
    const body = DOM.$('#modal-body');
    if (!body) return;

    // 动作按钮（事件委托，modal-body 是静态元素，只绑一次避免重复触发）
    if (!tplDelegationBound) {
      tplDelegationBound = true;
      body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const t = CODE_TEMPLATES.getById(btn.dataset.tplId);
        if (!t) return;

        if (btn.dataset.action === 'use') {
          useTemplate(t);
        } else if (btn.dataset.action === 'copy') {
          copyTemplate(t);
        } else if (btn.dataset.action === 'knowledge') {
          DOM.hideModal();
          Router.navigate('knowledge', t.knowledgeId);
        }
      });
    }

    // 搜索（重渲染仅更新列表，保持搜索框焦点）
    const search = DOM.$('#tpl-lib-search', body);
    if (search) {
      search.addEventListener('input', DOM.debounce(() => {
        tplSearch = search.value;
        const listEl = DOM.$('#tpl-lib-list', body);
        if (listEl) listEl.innerHTML = renderTemplateItems();
        // 恢复焦点与光标
        const s = DOM.$('#tpl-lib-search', body);
        if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      }, 200));
    }

    // 分类筛选（chips 元素随弹窗内容重建，需重新绑定）
    const cats = DOM.$('#tpl-lib-cats', body);
    if (cats) {
      cats.addEventListener('click', (e) => {
        const chip = e.target.closest('.tpl-cat-chip');
        if (!chip) return;
        tplCategory = chip.dataset.cat;
        // 重建整个弹窗内容（chips 高亮 + 列表）
        DOM.$('#modal-body').innerHTML = buildTemplateLibraryHtml();
        bindTemplateLibraryEvents();
      });
    }
  }

  /** 使用模板：直接替换编辑器内容 */
  function useTemplate(t) {
    CodeEditor.setCode(t.code);
    persistJudgeState();
    DOM.hideModal();
    DOM.toast(`已载入模板：${t.title}`, 'success');
  }

  function copyTemplate(t) {
    const done = () => DOM.toast('模板代码已复制到剪贴板', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t.code).then(done).catch(() => fallbackCopy(t.code, done));
    } else {
      fallbackCopy(t.code, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { DOM.toast('复制失败，请手动选择代码', 'error'); }
    ta.remove();
  }

  // ─── Load Problem ────────────────────────────────────────

  function loadProblem(problemId, opts = {}) {
    if (typeof JUDGE_PROBLEMS === 'undefined') return;

    const problem = JUDGE_PROBLEMS.find(p => p.id === problemId || p.id === Number(problemId));
    if (!problem) {
      DOM.toast('题目未找到', 'error');
      return;
    }

    currentProblem = problem;
    Store.set('codeJudge.currentProblem', problem.id);

    // Set template code（直接覆盖编辑器；用户草稿已自动持久化，可从设置板块找回）
    if (problem.template) {
      CodeEditor.setCode(problem.template);
    }

    // Render problem description
    renderProblemDescription(problem);

    // Clear previous results
    clearResults();

    persistJudgeState();

    if (!opts.silent) {
      DOM.toast(`已加载: ${problem.title}`, 'success');
    }
  }

  function renderProblemDescription(problem) {
    const outputEl = DOM.$('#judge-output');
    if (!outputEl) return;

    const difficultyColors = {
      'easy': '#4caf50',
      'medium': '#ff9800',
      'hard': '#f44336'
    };
    const difficultyText = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    const color = difficultyColors[problem.difficulty] || '#607d8b';
    const diffText = difficultyText[problem.difficulty] || problem.difficulty;

    outputEl.innerHTML = `
      <div class="judge-problem-info">
        <div class="judge-problem-header">
          <h3 class="judge-problem-title">
            <span class="problem-icon">📝</span>
            ${DOM.escapeHtml(problem.title)}
          </h3>
          <span class="judge-difficulty-badge" style="background: ${color}; color: #fff;">
            ${diffText}
          </span>
        </div>
        <div class="judge-problem-desc">${problem.description || '暂无描述'}</div>
        ${problem.testCases && problem.testCases.length > 0 ? `
          <div class="judge-testcase-hint">
            <span class="hint-icon">💡</span>
            <strong>测试用例数:</strong> ${problem.testCases.length}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ─── Run Code ────────────────────────────────────────────

  async function runCode() {
    const code = CodeEditor.getCode();
    const stdinEl = DOM.$('#judge-stdin');
    const stdin = stdinEl ? stdinEl.value : '';

    if (!code.trim()) {
      DOM.toast('请先编写代码', 'warning');
      return;
    }

    setRunningState(true);

    try {
      const startTime = performance.now();
      const result = await CodeExecutor.execute(code, stdin, 'cpp');
      const elapsed = performance.now() - startTime;

      renderOutput(result, elapsed);
      Store.set('codeJudge.output', result);

    } catch (error) {
      renderOutput({
        stdout: '',
        stderr: error.message,
        code: -1,
        success: false,
        error: error.message
      }, 0);
    } finally {
      setRunningState(false);
    }
  }

  // ─── Submit Code (Run All Tests) ─────────────────────────

  async function submitCode() {
    const code = CodeEditor.getCode();

    if (!code.trim()) {
      DOM.toast('请先编写代码', 'warning');
      return;
    }

    if (!currentProblem || !currentProblem.testCases || currentProblem.testCases.length === 0) {
      DOM.toast('当前题目没有测试用例', 'warning');
      return;
    }

    setRunningState(true);

    try {
      const results = await CodeJudge.runTests(code, currentProblem.testCases);
      const report = CodeJudge.generateReport(results);

      renderTestResults(results, report);
      Store.set('codeJudge.testResults', results);

      // Save progress
      if (report.allPassed) {
        saveProgress(currentProblem.id);
        DOM.toast('🎉 恭喜！所有测试用例通过！', 'success');
      } else {
        DOM.toast(`通过 ${report.passed}/${report.total} 个测试用例`, 'warning');
      }

    } catch (error) {
      DOM.toast('提交失败: ' + error.message, 'error');
    } finally {
      setRunningState(false);
    }
  }

  // ─── Render Output ───────────────────────────────────────

  function renderOutput(result, elapsed = 0) {
    const outputEl = DOM.$('#judge-output');
    if (!outputEl) return;

    let html = '';

    // Status header
    if (result.compileError) {
      html += `
        <div class="judge-result-header judge-result-error">
          <span class="result-icon">❌</span>
          <span class="result-title">编译错误</span>
          <span class="result-time">${elapsed ? formatTime(elapsed) : ''}</span>
        </div>
        <div class="judge-error-output">
          <div class="error-label">编译输出:</div>
          <pre class="error-pre">${DOM.escapeHtml(result.compileError)}</pre>
        </div>
      `;
    } else if (result.success) {
      html += `
        <div class="judge-result-header judge-result-success">
          <span class="result-icon">✅</span>
          <span class="result-title">运行成功</span>
          <span class="result-time">${elapsed ? formatTime(elapsed) : ''}</span>
        </div>
      `;
    } else if (result.error) {
      html += `
        <div class="judge-result-header judge-result-error">
          <span class="result-icon">⚠️</span>
          <span class="result-title">执行错误</span>
          <span class="result-time">${elapsed ? formatTime(elapsed) : ''}</span>
        </div>
        <div class="judge-error-output">
          <pre class="error-pre">${DOM.escapeHtml(result.error)}</pre>
        </div>
      `;
    } else {
      html += `
        <div class="judge-result-header judge-result-warning">
          <span class="result-icon">⚡</span>
          <span class="result-title">运行结束 (exit code: ${result.code})</span>
          <span class="result-time">${elapsed ? formatTime(elapsed) : ''}</span>
        </div>
      `;
    }

    // Stdout
    if (result.stdout) {
      html += `
        <div class="judge-stdout-section">
          <div class="stdout-label">标准输出:</div>
          <pre class="stdout-pre">${DOM.escapeHtml(result.stdout)}</pre>
        </div>
      `;
    } else if (result.success) {
      html += `
        <div class="judge-stdout-section">
          <div class="stdout-label">标准输出:</div>
          <pre class="stdout-pre stdout-empty">(无输出)</pre>
        </div>
      `;
    }

    // Stderr (non-compile)
    if (result.stderr && !result.compileError) {
      html += `
        <div class="judge-stderr-section">
          <div class="stderr-label">标准错误:</div>
          <pre class="stderr-pre">${DOM.escapeHtml(result.stderr)}</pre>
        </div>
      `;
    }

    outputEl.innerHTML = html;
  }

  // ─── Render Test Results ─────────────────────────────────

  function renderTestResults(results, report) {
    const container = DOM.$('#judge-test-results');
    if (!container) return;

    // Summary card
    let html = `
      <div class="judge-report-card">
        <div class="report-header">
          <div class="report-score ${report.allPassed ? 'score-perfect' : report.score >= 50 ? 'score-partial' : 'score-low'}">
            <span class="score-number">${report.score}</span>
            <span class="score-label">分</span>
          </div>
          <div class="report-stats">
            <div class="stat-item stat-passed">
              <span class="stat-value">${report.passed}</span>
              <span class="stat-label">通过</span>
            </div>
            <div class="stat-item stat-failed">
              <span class="stat-value">${report.total - report.passed}</span>
              <span class="stat-label">失败</span>
            </div>
            <div class="stat-item stat-total">
              <span class="stat-value">${report.total}</span>
              <span class="stat-label">总计</span>
            </div>
            <div class="stat-item stat-time">
              <span class="stat-value">${report.avgExec !== null && report.avgExec !== undefined ? report.avgExec + 'ms' : report.avgTime + 'ms'}</span>
              <span class="stat-label">${report.avgExec !== null && report.avgExec !== undefined ? '平均执行' : '平均耗时'}</span>
            </div>
          </div>
        </div>
        ${report.avgExec !== null && report.avgExec !== undefined ? `<div class="text-sm text-muted" style="text-align:center">程序在服务器上的真实执行时间 · 各用例并行评测（含网络传输的总耗时见每用例详情）</div>` : ''}
        ${report.compileErrors > 0 ? `<div class="report-tag report-tag-compile">编译错误: ${report.compileErrors}</div>` : ''}
        ${report.runtimeErrors > 0 ? `<div class="report-tag report-tag-runtime">运行时错误: ${report.runtimeErrors}</div>` : ''}
        ${report.wrongAnswers > 0 ? `<div class="report-tag report-tag-wrong">答案错误: ${report.wrongAnswers}</div>` : ''}
        ${report.allPassed ? `
          <div class="report-congrats">
            <span class="congrats-icon">🎉</span>
            <span>太棒了！所有测试用例全部通过！</span>
          </div>
        ` : ''}
      </div>
    `;

    // Progress bar
    html += `
      <div class="judge-progress-bar">
        <div class="judge-progress-fill" style="width: ${report.score}%"></div>
      </div>
    `;

    // Test case detail table
    html += `<div class="judge-test-list">`;
    results.forEach((r, idx) => {
      const statusClass = r.passed ? 'test-passed' : 'test-failed';
      const statusIcon = r.passed ? '✅' : getFailureIcon(r.type);
      const statusText = r.passed ? '通过' : getFailureText(r.type);

      html += `
        <div class="judge-test-item ${statusClass}">
          <div class="test-item-header" onclick="this.parentElement.classList.toggle('expanded')">
            <div class="test-item-left">
              <span class="test-icon">${statusIcon}</span>
              <span class="test-label">测试用例 ${idx + 1}</span>
              <span class="test-status-text">${statusText}</span>
            </div>
            <div class="test-item-right">
              <span class="test-time">${r.execMs !== null && r.execMs !== undefined ? `程序 ${r.execMs}ms · 总 ${r.time.toFixed(0)}ms` : `${r.time.toFixed(0)}ms`}</span>
              <span class="test-expand-icon">▼</span>
            </div>
          </div>
          <div class="test-item-body">
            <div class="test-detail-row">
              <div class="test-detail-label">📥 输入:</div>
              <pre class="test-detail-value">${DOM.escapeHtml(r.stdin || '(空)')}</pre>
            </div>
            <div class="test-detail-row">
              <div class="test-detail-label">✨ 期望输出:</div>
              <pre class="test-detail-value test-expected">${DOM.escapeHtml(r.expected)}</pre>
            </div>
            <div class="test-detail-row">
              <div class="test-detail-label">📤 实际输出:</div>
              <pre class="test-detail-value ${r.passed ? 'test-actual-pass' : 'test-actual-fail'}">${DOM.escapeHtml(r.actual || '(无输出)')}</pre>
            </div>
            ${r.error ? `
              <div class="test-detail-row">
                <div class="test-detail-label">❌ 错误信息:</div>
                <pre class="test-detail-value test-error-msg">${DOM.escapeHtml(r.error)}</pre>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
  }

  // ─── Helper Functions ────────────────────────────────────

  function getFailureIcon(type) {
    switch (type) {
      case 'compile_error': return '🔧';
      case 'runtime_error': return '💥';
      case 'wrong_answer': return '❌';
      case 'error': return '⚠️';
      default: return '❌';
    }
  }

  function getFailureText(type) {
    switch (type) {
      case 'compile_error': return '编译错误';
      case 'runtime_error': return '运行时错误';
      case 'wrong_answer': return '答案错误';
      case 'error': return '执行错误';
      default: return '失败';
    }
  }

  function formatTime(ms) {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  function setRunningState(isRunning) {
    Store.set('codeJudge.isRunning', isRunning);

    const runBtn = DOM.$('#judge-run');
    const submitBtn = DOM.$('#judge-submit');

    if (runBtn) {
      runBtn.disabled = isRunning;
      runBtn.textContent = isRunning ? '⏳ 运行中...' : '▶ 运行';
    }
    if (submitBtn) {
      submitBtn.disabled = isRunning;
      submitBtn.textContent = isRunning ? '⏳ 评测中...' : '✓ 提交评测';
    }
  }

  function clearResults() {
    const testResults = DOM.$('#judge-test-results');
    if (testResults) testResults.innerHTML = '';
  }

  function saveProgress(problemId) {
    const progress = Store.get('codeJudge.progress') || {};
    progress[problemId] = {
      passed: true,
      timestamp: Date.now()
    };
    Store.set('codeJudge.progress', progress);
    EventBus.emit('judge:problem-passed', { problemId });
  }

  // ─── Load Example（对外兼容 API：按模板库 id 载入） ──────

  function loadExample(exampleId) {
    // 兼容旧 CODE_EXAMPLES key（seqlist / linkedlist / ...）
    if (typeof CODE_TEMPLATES !== 'undefined') {
      const t = CODE_TEMPLATES.getById('tpl-ex-' + exampleId) || CODE_TEMPLATES.getById(exampleId);
      if (t) {
        CodeEditor.setCode(t.code);
        persistJudgeState();
        DOM.toast('已载入代码模板', 'info');
        return;
      }
    }
    if (typeof CODE_EXAMPLES !== 'undefined' && CODE_EXAMPLES[exampleId]) {
      const example = CODE_EXAMPLES[exampleId];
      const code = typeof example === 'object' ? (example.code || example) : example;
      CodeEditor.setCode(code);
      persistJudgeState();
      DOM.toast('已载入代码模板', 'info');
      return;
    }
    DOM.toast('示例未找到', 'error');
  }

  return {
    init,
    loadProblem,
    runCode,
    submitCode,
    renderOutput,
    renderTestResults,
    loadExample,
    openTemplateLibrary,
  };
})();
