/* ========================================
   quizView.js - Chapter-based Quiz UI
   Each chapter has independent quiz panel
   + Comprehensive test mode
   ======================================== */

const QuizView = (() => {
  let currentQuiz = null;
  let currentIndex = 0;
  let userAnswers = {};
  let timerInterval = null;
  let timeRemaining = 0;
  let timerDeadline = 0;   // 绝对截止时间戳：后台标签页定时器被浏览器节流时仍保持计时准确
  let currentChapterId = 'all';   // 'all' = comprehensive test
  let quizSource = 'normal';      // 'normal' | 'mistakes'（错题重练）
  let pendingCustomQuiz = null;   // 从错题本跳转来时暂存的题目
  let finished = false;           // guard: finishQuiz must run only once
  let resultMode = 'wrong';       // result page view: 'wrong' | 'all'
  let lastReport = null;          // keep report for result view toggling
  let routeListenerBound = false; // 防止重复注册 route:change 监听

  /**
   * Initialize quiz module
   */
  function init() {
    // 测验进行中不重建面板（hashchange 异步触发 init 时会洗掉刚开的测验）
    const act = DOM.$('#quiz-active-container');
    if (currentQuiz && act && act.style.display === 'block') return;
    renderChapterPanels();
    bindGlobalEvents();
  }

  /**
   * Compute quiz time limit dynamically:
   * 45s per question, at least 5 minutes.
   */
  function computeTimeLimit(count) {
    const perQuestion = 45;
    const minimum = APP_CONSTANTS.DEFAULTS.QUIZ_TIME_LIMIT || 300; // 5 min floor
    return Math.max(minimum, count * perQuestion);
  }

  /**
   * Render each chapter as independent quiz card
   */
  function renderChapterPanels() {
    const container = DOM.$('#quiz-container');
    if (!container) return;

    let html = '';

    // 章节快速跳转 chips（点击滚动到对应章节卡片）
    html += `
      <div class="card" style="padding:14px 18px;margin-bottom:16px">
        <div class="text-sm text-muted" style="margin-bottom:8px">⚡ 快速跳转到章节</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${CHAPTERS.map(ch => `<span class="suggestion-chip" style="cursor:pointer" onclick="QuizView.jumpToChapter('${ch.id}')">${ch.icon} ${ch.title}</span>`).join('')}
        </div>
      </div>
    `;

    // Chapter cards
    html += '<div class="quiz-chapters-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:24px">';

    CHAPTERS.forEach(chapter => {
      const totalCount = QuizEngine.getAvailableCount(chapter.id);
      const easyCount = QuizEngine.getAvailableCount(chapter.id, 'easy');
      const mediumCount = QuizEngine.getAvailableCount(chapter.id, 'medium');
      const hardCount = QuizEngine.getAvailableCount(chapter.id, 'hard');

      html += `
        <div class="card quiz-chapter-card" data-chapter="${chapter.id}">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <span style="font-size:1.5rem">${chapter.icon}</span>
            <h4 style="margin:0">${chapter.title}</h4>
          </div>
          <div class="text-sm text-muted mb-2">
            共 ${totalCount} 题
            <span class="tag tag-easy">简单 ${easyCount}</span>
            <span class="tag tag-medium">中等 ${mediumCount}</span>
            <span class="tag tag-hard">困难 ${hardCount}</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select class="quiz-chapter-diff" data-chapter="${chapter.id}" style="flex:1;min-width:80px">
              <option value="all">全部难度</option>
              <option value="easy">简单 (${easyCount})</option>
              <option value="medium">中等 (${mediumCount})</option>
              <option value="hard">困难 (${hardCount})</option>
            </select>
            <select class="quiz-chapter-count" data-chapter="${chapter.id}" style="flex:1;min-width:80px">
              ${generateCountOptions(totalCount)}
            </select>
            <button class="btn btn-primary btn-sm" onclick="QuizView.startChapterQuiz('${chapter.id}')">
              开始
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';

    // Comprehensive test card
    const totalAll = QuizEngine.getAvailableCount('all');
    html += `
      <div class="card quiz-comprehensive-card" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px">
        <h3 style="color:white;margin-bottom:8px">🎯 综合测试</h3>
        <p class="text-sm" style="opacity:0.9;margin-bottom:16px">从所有章节随机抽题，全面检验学习效果</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <select id="comprehensive-diff" style="flex:1;min-width:100px">
            <option value="all">全部难度</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
          <select id="comprehensive-count" style="flex:1;min-width:100px">
            ${generateCountOptions(totalAll)}
          </select>
          <button class="btn btn-lg" style="background:white;color:#764ba2;font-weight:600" onclick="QuizView.startComprehensive()">
            开始综合测试
          </button>
        </div>
        <div class="text-sm mt-2" style="opacity:0.8">题库共 ${totalAll} 题 · 计时规则：每题45秒，至少5分钟</div>
      </div>
    `;

    // Active quiz container (hidden by default)
    html += '<div id="quiz-active-container" style="display:none"></div>';

    // Result container (hidden by default)
    html += '<div id="quiz-result-container" style="display:none"></div>';

    container.innerHTML = html;

    // Bind difficulty change events to update count options
    DOM.$$('.quiz-chapter-diff').forEach(select => {
      select.addEventListener('change', (e) => {
        const chapterId = e.target.dataset.chapter;
        const difficulty = e.target.value;
        const countSelect = DOM.$(`.quiz-chapter-count[data-chapter="${chapterId}"]`);
        if (countSelect) {
          const available = QuizEngine.getAvailableCount(chapterId, difficulty);
          countSelect.innerHTML = generateCountOptions(available);
        }
      });
    });
  }

  /**
   * Generate count options based on available questions.
   * Handles edge cases: 0, 1~4 questions (no 5/10 steps available).
   */
  function generateCountOptions(maxCount) {
    if (!maxCount || maxCount <= 0) {
      return '<option value="0" disabled>暂无题目</option>';
    }

    const options = [];
    const candidates = [5, 10, 15, 20, 30, 50];

    candidates.forEach(c => {
      if (c <= maxCount) {
        options.push(c);
      }
    });

    // Always include maxCount if not already in list
    if (options.length === 0 || maxCount > options[options.length - 1]) {
      options.push(maxCount);
    }

    // Remove duplicates and sort
    const unique = [...new Set(options)].sort((a, b) => a - b);

    return unique.map(c =>
      `<option value="${c}">${c === maxCount ? `全部 (${c}题)` : `${c} 题`}</option>`
    ).join('\n');
  }

  /**
   * Scroll to a chapter card (quick-jump chips)
   */
  function jumpToChapter(chapterId) {
    const card = DOM.$(`.quiz-chapter-card[data-chapter="${chapterId}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'box-shadow 0.3s';
    card.style.boxShadow = '0 0 0 3px var(--accent-primary)';
    setTimeout(() => { card.style.boxShadow = ''; }, 1200);
  }

  /**
   * Start chapter-specific quiz
   */
  function startChapterQuiz(chapterId) {
    const diffSelect = DOM.$(`.quiz-chapter-diff[data-chapter="${chapterId}"]`);
    const countSelect = DOM.$(`.quiz-chapter-count[data-chapter="${chapterId}"]`);

    const difficulty = diffSelect ? diffSelect.value : 'all';
    const count = countSelect ? (parseInt(countSelect.value, 10) || 10) : 10;

    const quiz = QuizEngine.generateQuiz(chapterId, count, difficulty);

    if (!quiz || quiz.length === 0) {
      DOM.toast('该章节没有符合条件的题目！', 'warning');
      return;
    }

    beginQuiz(quiz, chapterId);
  }

  /**
   * Start comprehensive test
   */
  function startComprehensive() {
    const diffSelect = DOM.$('#comprehensive-diff');
    const countSelect = DOM.$('#comprehensive-count');

    const difficulty = diffSelect ? diffSelect.value : 'all';
    const count = countSelect ? (parseInt(countSelect.value, 10) || 20) : 20;

    const quiz = QuizEngine.generateQuiz('all', count, difficulty);

    if (!quiz || quiz.length === 0) {
      DOM.toast('没有符合条件的题目！', 'warning');
      return;
    }

    beginQuiz(quiz, 'all');
  }

  /**
   * Begin a quiz (shared logic)
   * @param {Object[]} quiz questions
   * @param {string} chapterId 'all' | 'chX' | 'mistakes'
   */
  function beginQuiz(quiz, chapterId) {
    stopTimer();
    currentQuiz = quiz;
    currentIndex = 0;
    userAnswers = {};
    finished = false;
    currentChapterId = chapterId || 'all';
    quizSource = currentChapterId === 'mistakes' ? 'mistakes' : 'normal';
    // Dynamic timer: 45s per question, minimum 5 minutes
    timeRemaining = computeTimeLimit(quiz.length);
    // 关键：同步引擎内部题目集，否则 checkAnswer/calculateScore
    // 会针对上一次 generateQuiz 的旧题（错题重练等自定义题目集必须走这里）
    if (typeof QuizEngine.setCustomQuiz === 'function') {
      QuizEngine.setCustomQuiz(quiz);
    }

    // Hide chapter panels, show quiz (guard every element)
    const grid = DOM.$('.quiz-chapters-grid');
    const compCard = DOM.$('.quiz-comprehensive-card');
    const resultContainer = DOM.$('#quiz-result-container');
    if (grid) grid.style.display = 'none';
    if (compCard) compCard.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'none';

    const activeContainer = DOM.$('#quiz-active-container');
    if (!activeContainer) return;
    activeContainer.style.display = 'block';

    renderQuestion();
    startTimer();
  }

  /**
   * Get the display title of the running quiz.
   * Comprehensive mode must NOT show the first question's chapter name.
   */
  function quizTitle() {
    if (currentChapterId === 'mistakes') return '错题重练';
    if (currentChapterId === 'all' || !currentChapterId) return '综合测试';
    return QuizEngine.getChapterTitle(currentChapterId);
  }

  /**
   * 错题本入口：从错题本页面发起一套重练。
   * 先切到 quiz 路由（路由处理器会重建面板），再开始测验。
   */
  function startMistakeQuiz(questions) {
    if (!questions || !questions.length) {
      DOM.toast('没有可重练的题目', 'warning');
      return;
    }
    pendingCustomQuiz = questions;
    Router.navigate('quiz'); // 若已在 quiz 页会强制触发 handleRouteChange 重建面板
    setTimeout(flushPendingMistakeQuiz, 150);
  }

  function flushPendingMistakeQuiz() {
    if (!pendingCustomQuiz) return;
    const q = pendingCustomQuiz;
    pendingCustomQuiz = null;
    beginQuiz(q, 'mistakes');
  }

  /**
   * Render current question
   */
  function renderQuestion() {
    const container = DOM.$('#quiz-active-container');
    if (!container || !currentQuiz) return;

    const question = currentQuiz[currentIndex];
    if (!question) return;

    const total = currentQuiz.length;
    const progress = ((currentIndex + 1) / total) * 100;
    const answered = Object.keys(userAnswers).length;

    let html = `
      <div class="quiz-active fade-in">
        <div class="quiz-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3>${quizTitle()}</h3>
          <div class="quiz-timer" style="font-family:monospace;font-size:1.2em;color:var(--accent-primary)">
            ⏱️ ${formatTime(timeRemaining)}
          </div>
        </div>

        <div class="step-progress" style="margin-bottom:16px">
          <span class="text-sm">第 ${currentIndex + 1} / ${total} 题 (已答 ${answered})</span>
          <div class="step-progress-bar">
            <div class="step-progress-fill" style="width:${progress}%"></div>
          </div>
        </div>

        <div class="quiz-question-card" style="background:var(--bg-card);padding:24px;border-radius:12px;border:1px solid var(--border-light)">
          <div class="quiz-question-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <span style="font-size:1.5em;font-weight:700;color:var(--accent-primary)">Q${currentIndex + 1}</span>
            <span class="tag tag-${question.difficulty}">
              ${difficultyLabel(question.difficulty)}
            </span>
            ${question.type === 'code-output' ? '<span class="tag badge-time">代码题</span>' : ''}
          </div>

          <div class="quiz-question-text" style="font-size:1.1em;line-height:1.6;margin-bottom:20px;white-space:pre-wrap">${DOM.escapeHtml(question.question)}</div>

          <div class="quiz-options" style="display:flex;flex-direction:column;gap:8px">
    `;

    question.options.forEach((option, i) => {
      const selected = userAnswers[question.id] === i;
      const marker = String.fromCharCode(65 + i);
      html += `
        <div class="quiz-option ${selected ? 'selected' : ''}"
             onclick="QuizView.selectAnswer('${question.id}', ${i})"
             style="padding:12px 16px;border:2px solid ${selected ? 'var(--accent-primary)' : 'var(--border-light)'};border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all 0.2s">
          <span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;background:${selected ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};color:${selected ? 'white' : 'var(--text-primary)'}">
            ${marker}
          </span>
          <span style="flex:1;white-space:pre-wrap">${DOM.escapeHtml(option)}</span>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="quiz-nav" style="display:flex;justify-content:space-between;margin-top:20px">
          <button class="btn btn-outline" ${currentIndex === 0 ? 'disabled' : ''} onclick="QuizView.prevQuestion()">
            ← 上一题
          </button>
          <span class="text-muted">${currentIndex + 1} / ${total}</span>
          ${currentIndex === total - 1
            ? `<button class="btn btn-success" onclick="QuizView.finishQuiz()">提交测验 ✓</button>`
            : `<button class="btn btn-primary" onclick="QuizView.nextQuestion()">下一题 →</button>`
          }
        </div>

        <button class="btn btn-outline btn-sm mt-2" onclick="QuizView.abortQuiz()" style="margin-top:12px">
          退出测验
        </button>
      </div>
    `;

    container.innerHTML = html;
  }

  function difficultyLabel(difficulty) {
    return difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难';
  }

  /**
   * Select an answer
   */
  function selectAnswer(questionId, index) {
    userAnswers[questionId] = index;
    renderQuestion();
  }

  /**
   * Next question
   */
  function nextQuestion() {
    if (currentQuiz && currentIndex < currentQuiz.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  }

  /**
   * Previous question
   */
  function prevQuestion() {
    if (currentQuiz && currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  }

  /**
   * Finish quiz and show results.
   * Guarded so the timer's auto-submit and a manual submit
   * cannot both trigger it.
   */
  function finishQuiz(silent) {
    if (finished || !currentQuiz) return;
    finished = true;
    stopTimer();

    const answered = Object.keys(userAnswers).length;
    const total = currentQuiz.length;
    const unanswered = total - answered;

    // Silent submit (time up) skips the confirm dialog
    if (!silent && unanswered > 0) {
      const ok = confirm(`还有 ${unanswered} 题未作答，确定要提交吗？`);
      if (!ok) {
        finished = false;
        startTimer();
        return;
      }
    }

    const report = QuizEngine.calculateScore(userAnswers);
    QuizEngine.saveToHistory(report);

    // 错题本联动：普通测验 → 自动收藏错题；错题重练 → 答对的移出、仍错的刷新
    if (quizSource === 'mistakes' && typeof MistakeEngine !== 'undefined') {
      const res = MistakeEngine.applyRedoResult(report.details || []);
      if (res.removed > 0) DOM.toast(`重练完成：${res.removed} 题已掌握并移出错题本`, 'success');
      if (res.kept > 0) DOM.toast(`${res.kept} 题仍然出错，已保留在错题本`, 'warning');
    } else if (typeof MistakeEngine !== 'undefined') {
      const wrongCount = (report.details || []).filter(d => !d.correct).length;
      if (wrongCount > 0) {
        MistakeEngine.recordFromDetails(report.details, 'quiz');
        DOM.toast(`${wrongCount} 道错题已收进错题本`, 'info');
      }
    }

    lastReport = report;
    resultMode = 'wrong';
    showResults(report);
  }

  /**
   * Toggle between wrong-only review and full review
   */
  function setResultMode(mode) {
    resultMode = mode;
    if (lastReport) showResults(lastReport);
  }

  /**
   * Show quiz results
   */
  function showResults(report) {
    const activeContainer = DOM.$('#quiz-active-container');
    const container = DOM.$('#quiz-result-container');
    if (!container) return;
    if (activeContainer) activeContainer.style.display = 'none';
    container.style.display = 'block';

    const percentage = report.percentage;
    const emoji = percentage >= 90 ? '🎉' :
                  percentage >= 70 ? '👍' :
                  percentage >= 50 ? '💪' : '📚';

    let html = `
      <div class="quiz-result-card fade-in" style="text-align:center;padding:32px">
        <div style="font-size:4rem;margin-bottom:16px">${emoji}</div>
        <div style="font-size:3rem;font-weight:700;color:var(--accent-primary)">${report.correct}</div>
        <div style="font-size:1.2em;color:var(--text-secondary);margin-bottom:8px">
          / ${report.total} 题正确 (${percentage}%)
        </div>
        <div class="text-sm text-muted" style="margin-bottom:16px">
          ${quizTitle()} · 用时 ${formatTime(report.timeTaken || 0)}
        </div>
        ${renderDifficultyStats(report)}
        <div style="margin-bottom:24px">
          ${percentage >= 90 ? '<p style="color:var(--accent-success);font-size:1.1em">太棒了！你已经掌握得很好！</p>' :
            percentage >= 70 ? '<p style="color:var(--accent-primary)">不错的成绩，继续加油！</p>' :
            percentage >= 50 ? '<p style="color:var(--accent-warning)">还需努力，建议复习相关知识点。</p>' :
            '<p style="color:var(--accent-danger)">建议重新学习相关章节内容。</p>'}
        </div>
    `;

    // Review section
    const details = report.details || [];
    const wrongAnswers = details.filter(d => !d.correct);
    const list = resultMode === 'all' ? details : wrongAnswers;

    html += `
      <div class="quiz-review-tabs" style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">
        <button class="btn btn-sm ${resultMode === 'wrong' ? 'btn-primary' : 'btn-outline'}"
                onclick="QuizView.setResultMode('wrong')">
          ❌ 错题回顾 (${wrongAnswers.length})
        </button>
        <button class="btn btn-sm ${resultMode === 'all' ? 'btn-primary' : 'btn-outline'}"
                onclick="QuizView.setResultMode('all')">
          📋 全部题目回顾 (${details.length})
        </button>
      </div>
    `;

    if (list.length === 0) {
      html += '<p class="text-muted" style="text-align:center">全部答对，没有错题 🎉</p>';
    } else {
      html += '<div class="quiz-review-list" style="text-align:left">';
      list.forEach((item, i) => {
        const q = item.question;
        const userAns = item.userAnswer !== undefined && q.options[item.userAnswer] !== undefined
          ? q.options[item.userAnswer] : '未作答';
        const correctAns = q.options[q.answer];
        const statusIcon = item.correct ? '✅' : (item.answered ? '❌' : '⭕ 未作答');

        html += `
          <div class="card quiz-review-item" style="margin-bottom:12px;padding:16px">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-bottom:8px">
              <div style="font-weight:600;white-space:pre-wrap">${i + 1}. ${DOM.escapeHtml(q.question)}</div>
              <span style="white-space:nowrap">${statusIcon}</span>
            </div>
            <div style="margin-bottom:8px">
              <span class="tag tag-${q.difficulty}">${difficultyLabel(q.difficulty)}</span>
              <span class="text-sm text-muted">${QuizEngine.getChapterTitle(q.chapter)}</span>
            </div>
            <div style="color:${item.correct ? 'var(--accent-success)' : 'var(--accent-danger)'};margin-bottom:4px">
              你的答案: ${DOM.escapeHtml(String(userAns))}
            </div>
            ${item.correct ? '' : `<div style="color:var(--accent-success);margin-bottom:8px">正确答案: ${DOM.escapeHtml(String(correctAns))}</div>`}
            ${q.explanation ? `<div class="text-sm text-muted quiz-explanation" style="white-space:pre-wrap;border-top:1px dashed var(--border-light);padding-top:8px">${DOM.escapeHtml(q.explanation)}</div>` : ''}
          </div>
        `;
      });
      html += '</div>';
    }

    html += `
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="QuizView.resetQuiz()">返回</button>
          <button class="btn btn-outline" onclick="Router.navigate('mistakes')">📕 查看错题本</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Difficulty-dimension mini statistics: correct / total per difficulty
   */
  function renderDifficultyStats(report) {
    const stats = report.diffStats;
    if (!stats) return '';
    const order = ['easy', 'medium', 'hard'];
    const totalCorrect = order.reduce((s, d) => s + stats[d].correct, 0);
    const totalAll = order.reduce((s, d) => s + stats[d].total, 0);
    if (totalAll === 0) return '';

    let html = '<div class="quiz-diff-stats" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">';
    order.forEach(d => {
      const s = stats[d];
      if (s.total === 0) return;
      const pct = Math.round((s.correct / s.total) * 100);
      const color = pct >= 80 ? 'var(--accent-success)' : pct >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)';
      html += `
        <div class="quiz-diff-stat" style="min-width:96px;padding:8px 12px;border-radius:8px;background:var(--bg-hover);border:1px solid var(--border-light);text-align:center">
          <div class="text-sm text-muted">${difficultyLabel(d)}</div>
          <div style="font-weight:700;color:${color}">${s.correct} / ${s.total}</div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  }

  /**
   * Reset to chapter selection
   */
  function resetQuiz() {
    stopTimer();
    currentQuiz = null;
    currentIndex = 0;
    userAnswers = {};
    finished = false;
    lastReport = null;

    const active = DOM.$('#quiz-active-container');
    const result = DOM.$('#quiz-result-container');
    const grid = DOM.$('.quiz-chapters-grid');
    const compCard = DOM.$('.quiz-comprehensive-card');
    if (active) active.style.display = 'none';
    if (result) result.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (compCard) compCard.style.display = 'block';
  }

  /**
   * Abort quiz
   */
  function abortQuiz() {
    if (confirm('确定要退出测验吗？当前进度将丢失。')) {
      resetQuiz();
    }
  }

  /**
   * Start timer.
   * When time hits 0, stop the timer first and submit silently
   * (finishQuiz is guarded against repeated invocation anyway).
   *
   * 计时以「截止时间戳」倒推，而不是每秒 timeRemaining--：
   * 后台标签页的 setInterval 会被浏览器节流甚至暂停，切走再切回后
   * 按次递减的计时几乎没走、与真实用时脱节；时间戳基准不受节流影响。
   */
  function startTimer() {
    stopTimer();
    timerDeadline = Date.now() + timeRemaining * 1000;
    timerInterval = setInterval(tickTimer, 1000);
    tickTimer();   // 立即渲染，避免 1s 空档
  }

  /**
   * Timer tick: recompute remaining seconds from the deadline.
   */
  function tickTimer() {
    timeRemaining = Math.max(0, Math.round((timerDeadline - Date.now()) / 1000));
    const timerEl = DOM.$('.quiz-timer');
    if (timerEl) {
      timerEl.textContent = `⏱️ ${formatTime(timeRemaining)}`;
      if (timeRemaining <= 30) {
        timerEl.style.color = 'var(--accent-danger)';
      }
    }
    if (timeRemaining <= 0) {
      stopTimer();
      DOM.toast('时间到！已自动提交测验', 'warning');
      finishQuiz(true); // silent: no confirm dialog on timeout
    }
  }

  /**
   * Stop timer
   */
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /**
   * Format seconds to MM:SS
   */
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Bind global events
   */
  function bindGlobalEvents() {
    // 只绑定一次：init 会在每次进入 quiz 路由时被调用，
    // 重复绑定会导致一次深链接触发多次 startChapterQuiz。
    if (routeListenerBound) return;
    routeListenerBound = true;
    // Listen for route changes to quiz with chapter param
    EventBus.on('route:change', ({ route, params }) => {
      if (route === 'quiz' && params.length > 0) {
        const chapterId = params[0];
        // Auto-start quiz for this chapter
        setTimeout(() => startChapterQuiz(chapterId), 100);
      }
    });
    // 标签页切回时立即校准倒计时显示（后台被节流的定时器此刻才恢复，
    // 时间戳基准保证数值正确，这里只是让显示即刻刷新而非等下一次 tick）
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && timerInterval) tickTimer();
    });
  }

  // Public API
  return {
    init,
    startChapterQuiz,
    startComprehensive,
    startMistakeQuiz,
    jumpToChapter,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
    abortQuiz,
    setResultMode,
  };
})();
