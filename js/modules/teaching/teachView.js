/* ========================================
   teachView.js - 交互教学视图控制器（重构版）
   功能：
   - 课程列表：章节分组 + 搜索筛选 + 进度徽标
   - 分步播放器：content / html / array(数组状态条) / code(代码走读) / quiz(步内小测)
   - 键盘：← → 翻步，Enter 确认答题
   - 进度记忆：Storage 记录每门课学到第几步、完成状态
   - 结课页：要点回顾 + 未掌握步骤 + 测验/可视化链接
   ======================================== */

const TeachView = (() => {
  let currentLessonId = null;
  let currentStep = 0;
  let searchKeyword = '';

  // 小测会话状态（每换一步重置）
  let quizState = null; // { selected: -1, answered: bool, correct: bool, skipped: bool }
  // 本次学习中未掌握（跳过）的步骤下标
  let sessionWeak = [];

  /* ---------------- 进度工具 ---------------- */

  function getLessonProgress(lessonId) {
    return LessonPlayer.getLessonProgress(lessonId);
  }

  /* ---------------- 课程列表 ---------------- */

  function renderLessonList() {
    const container = DOM.$('#lesson-selector');
    if (!container) return;

    const stats = LessonPlayer.getStats();
    const kw = searchKeyword.trim().toLowerCase();

    let html = `
      <h4 style="margin-bottom:8px">📚 课程列表
        <span class="lesson-stats">${stats.done}/${stats.total} 已完成</span>
      </h4>
      <input type="text" id="lesson-search" class="lesson-search"
             placeholder="🔍 搜索课程…" value="${DOM.escapeHtml(searchKeyword)}">`;

    const lessons = LessonPlayer.getAll();
    const filtered = kw
      ? lessons.filter(l => l.title.toLowerCase().includes(kw) || (l.chapter || '').includes(kw))
      : lessons;

    if (filtered.length === 0) {
      html += '<div class="lesson-empty">没有匹配的课程</div>';
    }

    // Group by chapter
    const grouped = {};
    filtered.forEach(l => {
      (grouped[l.chapter] = grouped[l.chapter] || []).push(l);
    });

    html += '<ul class="lesson-list">';
    Object.entries(grouped).forEach(([chId, items]) => {
      const ch = (typeof CHAPTERS !== 'undefined' ? CHAPTERS : []).find(c => c.id === chId);
      html += `<li class="lesson-group">${ch ? ch.icon + ' ' + ch.title : chId}</li>`;
      items.forEach(item => {
        const p = getLessonProgress(item.id);
        let badge;
        if (p && p.done) badge = '<span class="lesson-badge lesson-badge-done">✓</span>';
        else if (p && p.step > 0) badge = `<span class="lesson-badge">${p.step + 1}/${item.stepCount}</span>`;
        else badge = `<span class="lesson-badge">${item.stepCount}</span>`;

        html += `<li class="lesson-item ${currentLessonId === item.id ? 'active' : ''}"
                      onclick="TeachView.loadLesson('${item.id}')">
          ${badge}
          <span>${item.title}</span>
        </li>`;
      });
    });
    html += '</ul>';

    container.innerHTML = html;

    // 搜索框事件（重新渲染后需重绑）
    const search = DOM.$('#lesson-search', container);
    if (search) {
      search.addEventListener('input', DOM.debounce((e) => {
        searchKeyword = e.target.value;
        renderLessonList();
        // 恢复焦点与光标
        const s = DOM.$('#lesson-search', container);
        if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      }, 250));
    }
  }

  /* ---------------- 播放器渲染 ---------------- */

  function renderArrayState(arr) {
    if (!arr || !Array.isArray(arr.data)) return '';
    const cells = arr.data.map((v, i) => {
      const hl = (arr.highlights || []).includes(i) ? ' lesson-arr-cell-hl' : '';
      const val = (v === null || v === undefined) ? '·' : String(v);
      let pointer = '';
      if (arr.pointers) {
        Object.entries(arr.pointers).forEach(([name, idx]) => {
          if (idx === i) pointer += `<span class="lesson-arr-pointer">${name}</span>`;
        });
      }
      return `<div class="lesson-arr-col">
        <div class="lesson-arr-cell${hl}">${DOM.escapeHtml(val)}</div>
        <div class="lesson-arr-idx">${i}</div>
        ${pointer}
      </div>`;
    }).join('');
    const caption = arr.caption ? `<div class="lesson-arr-caption">${arr.caption}</div>` : '';
    return `<div class="lesson-arr"><div class="lesson-arr-row">${cells}</div>${caption}</div>`;
  }

  function renderCodeBlock(code) {
    const html = CodeWalkthrough.create(code.code, code.explanations || {});
    return `<div class="lesson-code">${html}</div>`;
  }

  function renderQuiz(quiz, stepIndex) {
    const disabled = quizState && (quizState.correct || quizState.skipped);
    const opts = quiz.options.map((opt, i) => {
      let cls = 'lesson-quiz-opt';
      if (quizState && quizState.selected === i && !quizState.correct) cls += ' selected';
      if (quizState && quizState.correct && i === quiz.answer) cls += ' correct';
      return `<button class="${cls}" data-idx="${i}" ${disabled ? 'disabled' : ''}>
        <span class="lesson-quiz-marker">${'ABCD'[i] || i + 1}</span>
        <span>${opt}</span>
      </button>`;
    }).join('');
    return `<div class="lesson-quiz" data-step="${stepIndex}">
      <div class="lesson-quiz-title">✏️ 想一想：答对才能继续（可跳过，但会计入"未掌握"）</div>
      <div class="lesson-quiz-question">${quiz.question}</div>
      <div class="lesson-quiz-options">${opts}</div>
      <div class="lesson-quiz-feedback" style="display:none"></div>
      <div class="lesson-quiz-actions">
        <button class="lesson-quiz-skip btn btn-sm btn-outline" ${disabled ? 'disabled' : ''}>跳过这题</button>
        <span class="lesson-quiz-tip text-muted text-sm">提示：也可以用数字键 1-4 选择，Enter 确认</span>
      </div>
    </div>`;
  }

  function renderCurrentStep() {
    const player = DOM.$('#lesson-player');
    if (!player || !currentLessonId) return;

    const lesson = LessonPlayer.get(currentLessonId);
    const step = LessonPlayer.getStep(currentLessonId, currentStep);
    const totalSteps = LessonPlayer.getStepCount(currentLessonId);
    if (!step) return;

    const progress = ((currentStep + 1) / totalSteps) * 100;
    const isLast = currentStep === totalSteps - 1;
    const hasQuiz = step.interaction && step.interaction.type === 'quiz';

    let inner = `<h4 class="lesson-step-title">${step.title}</h4>`;
    if (step.content) inner += `<div class="lesson-step-content">${step.content}</div>`;
    if (step.html) inner += `<div class="lesson-step-html">${step.html}</div>`;
    if (step.array) inner += renderArrayState(step.array);
    if (step.code) inner += renderCodeBlock(step.code);
    if (hasQuiz) inner += renderQuiz(step.interaction, currentStep);

    const navHtml = `
      <button class="btn btn-outline" ${currentStep === 0 ? 'disabled' : ''}
              onclick="TeachView.prevStep()">← 上一步</button>
      <span class="text-muted text-sm">${currentStep + 1} / ${totalSteps}</span>
      ${isLast
        ? `<button class="btn btn-success" onclick="TeachView.completeLesson()">完成学习 ✓</button>`
        : `<button class="btn btn-primary" id="lesson-next-btn" ${hasQuiz && !quizUnlocked() ? 'disabled' : ''}
              onclick="TeachView.nextStep()">下一步 →</button>`}`;

    player.innerHTML = `
      <div class="step-player fade-in">
        <div class="lesson-header">
          <h3>${lesson.title}</h3>
          <span class="lesson-tag">${chapterTitle(lesson.chapter)}</span>
        </div>
        <div class="step-progress">
          <span class="text-sm">步骤 ${currentStep + 1} / ${totalSteps}</span>
          <div class="step-progress-bar">
            <div class="step-progress-fill" style="width:${progress}%"></div>
          </div>
        </div>
        <div class="step-content">${inner}</div>
        <div class="step-nav">${navHtml}</div>
      </div>`;

    // 渲染后统一绑定事件
    DOM.$$('.cw-wrap', player).forEach(el => CodeWalkthrough.bindEvents(el));
    if (step.code && step.code.activeLine) {
      const wrap = DOM.$('.cw-wrap', player);
      if (wrap) CodeWalkthrough.setActiveLine(wrap, step.code.activeLine);
    }
    const quizBox = DOM.$('.lesson-quiz', player);
    if (quizBox) bindQuizEvents(quizBox, step.interaction);

    // 保存进度
    LessonPlayer.saveStep(currentLessonId, currentStep);
  }

  function chapterTitle(chId) {
    const ch = (typeof CHAPTERS !== 'undefined' ? CHAPTERS : []).find(c => c.id === chId);
    return ch ? ch.title : chId;
  }

  /* ---------------- 小测逻辑 ---------------- */

  function quizUnlocked() {
    return quizState && (quizState.correct || quizState.skipped);
  }

  function resetQuizState() {
    quizState = { selected: -1, answered: false, correct: false, skipped: false };
  }

  function bindQuizEvents(box, quiz) {
    DOM.$$('.lesson-quiz-opt', box).forEach(btn => {
      btn.addEventListener('click', () => {
        quizState.selected = parseInt(btn.dataset.idx);
        evaluateOption(box, quiz);
      });
    });
    const skip = DOM.$('.lesson-quiz-skip', box);
    if (skip) {
      skip.addEventListener('click', () => skipQuiz(box, quiz));
    }
  }

  /**
   * 评定当前选中的选项（点击选项或按 Enter 时调用）
   */
  function evaluateOption(box, quiz) {
    if (!quizState || quizState.selected < 0) return;
    if (quizState.correct || quizState.skipped) return;

    const idx = quizState.selected;
    const options = DOM.$$('.lesson-quiz-opt', box);
    const feedback = DOM.$('.lesson-quiz-feedback', box);

    options.forEach(b => b.classList.remove('selected', 'wrong'));
    options[idx].classList.add('selected');
    quizState.answered = true;

    if (idx === quiz.answer) {
      quizState.correct = true;
      options.forEach((b, i) => {
        b.disabled = true;
        if (i === idx) b.classList.add('correct');
      });
      feedback.style.display = 'block';
      feedback.className = 'lesson-quiz-feedback ok';
      feedback.innerHTML = '🎉 回答正确！';
      updateNextButton();
    } else {
      options[idx].classList.add('wrong');
      feedback.style.display = 'block';
      feedback.className = 'lesson-quiz-feedback bad';
      feedback.innerHTML = `❌ 不对哦。提示：${quiz.hint || '再想想看'}（可以换一个选项重试）`;
      // 不锁定，可重选
    }
  }

  function skipQuiz(box, quiz) {
    if (quizState.correct || quizState.skipped) return;
    quizState.skipped = true;
    sessionWeak.push(currentStep);
    const feedback = DOM.$('.lesson-quiz-feedback', box);
    feedback.style.display = 'block';
    feedback.className = 'lesson-quiz-feedback warn';
    feedback.innerHTML = `⏭ 已跳过（计入未掌握）。正确答案：${DOM.escapeHtml(quiz.options[quiz.answer])}`;
    DOM.$$('.lesson-quiz-opt', box).forEach((b, i) => {
      b.disabled = true;
      if (i === quiz.answer) b.classList.add('correct');
    });
    updateNextButton();
  }

  function updateNextButton() {
    const btn = DOM.$('#lesson-next-btn');
    const step = LessonPlayer.getStep(currentLessonId, currentStep);
    if (btn && step && step.interaction) btn.disabled = !quizUnlocked();
  }

  /* ---------------- 结课页 ---------------- */

  function renderComplete() {
    const player = DOM.$('#lesson-player');
    if (!player || !currentLessonId) return;

    const lesson = LessonPlayer.get(currentLessonId);
    LessonPlayer.markDone(currentLessonId);
    renderLessonList();

    const weakItems = [...new Set(sessionWeak)].map(i => {
      const s = LessonPlayer.getStep(currentLessonId, i);
      return s ? `<li class="lesson-weak-item">
        <a href="javascript:void(0)" onclick="TeachView.reviewStep(${i})">第 ${i + 1} 步 · ${s.title}</a>
      </li>` : '';
    }).join('');

    const summaryItems = (lesson.summary || [])
      .map(s => `<li>${s}</li>`).join('');

    const weakHtml = weakItems
      ? `<div class="lesson-complete-section">
           <h4>📌 本次学习中未掌握的步骤</h4>
           <ul class="lesson-weak-list">${weakItems}</ul>
           <p class="text-muted text-sm">建议点回去重新看一下这几步～</p>
         </div>`
      : `<div class="lesson-complete-section">
           <p class="lesson-all-mastered">🎉 本次全部小测都答对了，掌握得很扎实！</p>
         </div>`;

    player.innerHTML = `
      <div class="step-player fade-in lesson-complete">
        <h3>🎓 《${lesson.title}》学习完成！</h3>
        <div class="lesson-complete-section">
          <h4>📝 本课要点回顾</h4>
          <ul class="lesson-summary-list">${summaryItems}</ul>
        </div>
        ${weakHtml}
        <div class="lesson-complete-section">
          <h4>🚀 接下来</h4>
          <div class="lesson-links">
            <a class="btn btn-primary" href="#/quiz/${lesson.chapter}">去练习测验做相关题</a>
            <a class="btn btn-outline" href="#/visualization">去算法可视化看动画</a>
            <button class="btn btn-outline" onclick="TeachView.loadLesson('${currentLessonId}', true)">重新学习本课</button>
          </div>
        </div>
      </div>`;

    // 滚回顶部
    player.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- 对外 API ---------------- */

  function loadLesson(lessonId, forceRestart) {
    currentLessonId = lessonId;
    sessionWeak = [];
    resetQuizState();

    // 进度恢复（重新学习时不恢复）
    const p = getLessonProgress(lessonId);
    const total = LessonPlayer.getStepCount(lessonId);
    if (!forceRestart && p && !p.done && typeof p.step === 'number' && p.step < total) {
      currentStep = p.step;
      DOM.toast('已恢复到上次的学习进度', 'info');
    } else {
      currentStep = 0;
      if (p && p.done && !forceRestart) {
        DOM.toast('本课已完成，可从头复习', 'info');
      }
    }
    if (forceRestart) LessonPlayer.markUnDone(lessonId);

    renderLessonList();
    renderCurrentStep();
  }

  function nextStep() {
    const totalSteps = LessonPlayer.getStepCount(currentLessonId);
    if (currentStep < totalSteps - 1) {
      const step = LessonPlayer.getStep(currentLessonId, currentStep);
      if (step.interaction && !quizUnlocked()) {
        DOM.toast('请先回答本步的小测（或跳过）', 'warning');
        return;
      }
      currentStep++;
      resetQuizState();
      renderCurrentStep();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      resetQuizState();
      renderCurrentStep();
    }
  }

  function reviewStep(stepIndex) {
    currentStep = stepIndex;
    resetQuizState();
    LessonPlayer.markUnDone(currentLessonId);
    renderCurrentStep();
  }

  function completeLesson() {
    const step = LessonPlayer.getStep(currentLessonId, currentStep);
    if (step && step.interaction && !quizUnlocked()) {
      DOM.toast('请先回答最后一步的小测（或跳过）', 'warning');
      return;
    }
    renderComplete();
  }

  /* ---------------- 键盘支持 ---------------- */

  function handleKeydown(e) {
    const view = DOM.$('#view-teaching');
    if (!view || !view.classList.contains('active')) return;
    if (!currentLessonId) return;
    // 输入框聚焦时不拦截
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const player = DOM.$('#lesson-player');
    const isCompletePage = player && DOM.$('.lesson-complete', player);

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevStep();
    } else if (e.key === 'ArrowRight' && !isCompletePage) {
      e.preventDefault();
      nextStep();
    } else if (e.key === 'Enter' && !isCompletePage) {
      const step = LessonPlayer.getStep(currentLessonId, currentStep);
      if (step && step.interaction && quizState && !quizState.correct && !quizState.skipped) {
        const box = DOM.$('.lesson-quiz', player);
        if (box && quizState.selected >= 0) {
          e.preventDefault();
          evaluateOption(box, step.interaction);
        }
      }
    } else if (/^[1-4]$/.test(e.key) && !isCompletePage) {
      // 数字键 1-4：仅选中（高亮），Enter 确认
      const step = LessonPlayer.getStep(currentLessonId, currentStep);
      if (step && step.interaction && quizState && !quizState.correct && !quizState.skipped) {
        const idx = parseInt(e.key) - 1;
        if (idx < step.interaction.options.length) {
          quizState.selected = idx;
          const box = DOM.$('.lesson-quiz', player);
          if (box) {
            DOM.$$('.lesson-quiz-opt', box).forEach((b, i) => {
              b.classList.toggle('selected', i === idx);
            });
          }
        }
      }
    }
  }

  let keyBound = false;

  return {
    init() {
      renderLessonList();
      if (!keyBound) {
        document.addEventListener('keydown', handleKeydown);
        keyBound = true;
      }
    },

    loadLesson,
    nextStep,
    prevStep,
    reviewStep,
    completeLesson,
  };
})();
