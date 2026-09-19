/* ========================================
   codeWalkthrough.js - 代码逐行走读组件（重构版）
   - create(code, explanations) 返回 HTML（不再内嵌 <script>，
     事件由 teachView 渲染后统一绑定）
   - setActiveLine(container, line) 高亮指定行并同步注释面板
   - 点击带注释标记的行可查看解释
   ======================================== */

const CodeWalkthrough = (() => {

  /**
   * 生成代码走读 HTML
   * @param {string} code - 源代码
   * @param {Object} explanations - 行号 -> 解释文本
   * @returns {string} HTML
   */
  function create(code, explanations = {}) {
    const lines = code.split('\n');
    let html = '<div class="cw-wrap">';
    html += '<div class="cw-code"><pre><code>';

    lines.forEach((line, i) => {
      const n = i + 1;
      const note = explanations[n];
      const hasNote = note ? ' cw-has-note' : '';
      const noteAttr = note ? ` data-note="${DOM.escapeHtml(note)}"` : '';
      html += `<span class="cw-line${hasNote}" data-line="${n}"${noteAttr}>`;
      html += `<span class="cw-line-num">${n}</span>`;
      html += `<span class="cw-line-text">${DOM.escapeHtml(line) || ' '}</span>`;
      html += '</span>\n';
    });

    html += '</code></pre></div>';
    html += '<div class="cw-note-panel">';
    html += '<span class="cw-note-title">💡 行注释</span>';
    html += '<div class="cw-note-body">点击代码行中有 ● 标记的位置查看解释</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  /**
   * 高亮指定行（并同步注释面板）
   * @param {Element} container - .cw-wrap 容器
   * @param {number} lineNum - 行号（1-based），传 0/null 清除
   */
  function setActiveLine(container, lineNum) {
    if (!container) return;
    DOM.$$('.cw-line', container).forEach(el => {
      el.classList.toggle('cw-active', parseInt(el.dataset.line) === lineNum);
    });
    if (lineNum) showNote(container, lineNum);
  }

  /**
   * 在注释面板中显示某行的解释
   */
  function showNote(container, lineNum) {
    const body = DOM.$('.cw-note-body', container);
    if (!body) return;
    const line = DOM.$(`.cw-line[data-line="${lineNum}"]`, container);
    if (line && line.classList.contains('cw-has-note')) {
      body.innerHTML = `<b>第 ${lineNum} 行：</b>${DOM.escapeHtml(line.dataset.note || '')}`;
    } else {
      body.innerHTML = `第 ${lineNum} 行暂无注释`;
    }
  }

  /**
   * 为走读块绑定事件（在 teachView 渲染后统一调用）
   * @param {Element} container - .cw-wrap 容器
   */
  function bindEvents(container) {
    if (!container || container.dataset.cwBound) return;
    container.dataset.cwBound = '1';
    DOM.$$('.cw-line.cw-has-note', container).forEach(el => {
      el.addEventListener('click', () => {
        setActiveLine(container, parseInt(el.dataset.line));
      });
    });
  }

  return { create, setActiveLine, showNote, bindEvents };
})();
