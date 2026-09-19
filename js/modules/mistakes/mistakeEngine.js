/* ========================================
   mistakeEngine.js - 错题本数据层
   自动收集测验错题 + 手动导入/导出
   依赖：Storage、APP_CONSTANTS、QUESTIONS、CHAPTERS
   ======================================== */

const MistakeEngine = (() => {
  // ─── 存取 ───────────────────────────────────────────────────────

  function getRecords() {
    return Storage.get(APP_CONSTANTS.STORAGE_KEYS.MISTAKE_BOOK, []);
  }

  function saveRecords(records) {
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.MISTAKE_BOOK, records);
  }

  function getCustomQuestions() {
    return Storage.get('dsa-mistake-custom-questions', []);
  }

  function saveCustomQuestions(list) {
    Storage.set('dsa-mistake-custom-questions', list);
  }

  // ─── 题目解析 ───────────────────────────────────────────────────

  /** 按 id 在内置题库与导入题库中查找完整题目 */
  function getQuestionById(id) {
    const inBank = QUESTIONS.find(q => q.id === id);
    if (inBank) return inBank;
    return getCustomQuestions().find(q => q.id === id) || null;
  }

  // ─── 记录维护 ───────────────────────────────────────────────────

  /**
   * 记录一道错题（去重，累计错误次数）
   * @param {Object} question 完整题目对象
   * @param {number|null} userAnswer 用户所选索引
   * @param {string} source 'quiz' | 'manual' | 'redo'
   */
  function recordWrong(question, userAnswer, source) {
    if (!question || !question.id) return;
    const records = getRecords();
    const now = Date.now();
    const existing = records.find(r => r.id === question.id);
    if (existing) {
      existing.wrongCount += 1;
      existing.lastTime = now;
      existing.userAnswer = userAnswer;
      existing.source = source || existing.source;
    } else {
      records.unshift({
        id: question.id,
        userAnswer: userAnswer === undefined ? null : userAnswer,
        wrongCount: 1,
        firstTime: now,
        lastTime: now,
        source: source || 'quiz',
      });
    }
    saveRecords(records);
  }

  function remove(id) {
    const records = getRecords().filter(r => r.id !== id);
    saveRecords(records);
  }

  function has(id) {
    return getRecords().some(r => r.id === id);
  }

  function clear() {
    saveRecords([]);
  }

  /**
   * 批量记录（测验提交后调用）
   * @param {Object[]} wrongDetails QuizEngine.calculateScore().details 中 correct=false 的项
   */
  function recordFromDetails(details, source) {
    (details || []).forEach(d => {
      if (!d.correct) recordWrong(d.question, d.userAnswer, source || 'quiz');
    });
  }

  /**
   * 错题重练结束后调用：答对的移出错题本，仍错的刷新记录
   * @returns {{removed: number, kept: number}}
   */
  function applyRedoResult(details) {
    let removed = 0, kept = 0;
    (details || []).forEach(d => {
      if (!d.question || !d.question.id) return;
      if (d.correct) { remove(d.question.id); removed++; }
      else { recordWrong(d.question, d.userAnswer, 'redo'); kept++; }
    });
    return { removed, kept };
  }

  // ─── 校验与导入导出 ─────────────────────────────────────────────

  const validChapters = () => CHAPTERS.map(c => c.id);

  // 导入限制：防止超大输入卡死页面或撑爆 localStorage 配额
  const MAX_IMPORT_TEXT = 2 * 1024 * 1024;    // 单次导入文本上限 2MB
  const MAX_IMPORT_COUNT = 1000;              // 单次导入条数上限
  const LIMITS = {
    question: 2000,     // 题干长度上限
    option: 500,        // 单个选项长度上限
    explanation: 5000,  // 解析长度上限
    options: 8,         // 选项个数上限
  };

  /**
   * 校验一道导入题。返回错误信息字符串，通过则返回 null。
   */
  function validateQuestion(q) {
    if (!q || typeof q !== 'object' || Array.isArray(q)) return '不是题目对象';
    if (typeof q.question !== 'string' || !q.question.trim()) return '缺少题干 question';
    if (q.question.length > LIMITS.question) return '题干过长（最多 ' + LIMITS.question + ' 字符，当前 ' + q.question.length + '）';
    if (!Array.isArray(q.options) || q.options.length < 2) return 'options 至少 2 个选项';
    if (q.options.length > LIMITS.options) return '选项过多（最多 ' + LIMITS.options + ' 个）';
    if (q.options.some(o => typeof o !== 'string')) return '选项必须都是字符串';
    const longOpt = q.options.findIndex(o => o.length > LIMITS.option);
    if (longOpt !== -1) return '第 ' + (longOpt + 1) + ' 个选项过长（最多 ' + LIMITS.option + ' 字符）';
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      return 'answer 必须是选项索引（0 ~ ' + (q.options.length - 1) + '）';
    }
    if (!validChapters().includes(q.chapter)) return 'chapter 必须是 ' + validChapters().join('/') + ' 之一';
    const diff = q.difficulty || 'medium';
    if (!['easy', 'medium', 'hard'].includes(diff)) return 'difficulty 必须是 easy/medium/hard';
    if (q.explanation !== undefined && typeof q.explanation !== 'string') return 'explanation 必须是字符串';
    if (typeof q.explanation === 'string' && q.explanation.length > LIMITS.explanation) {
      return '解析过长（最多 ' + LIMITS.explanation + ' 字符）';
    }
    if (q.id !== undefined && typeof q.id !== 'string') return 'id 必须是字符串（省略则自动编号）';
    return null;
  }

  /**
   * 导入题目。支持两种元素混合的数组：
   *  1. 完整题目对象（同 questions.js 结构，id 可省略）
   *  2. 字符串 id（引用内置题库已有的题）
   * 全程严格校验：文本大小 / 条数 / 字段类型 / 长度超限均整条拒绝并在结果中指明原因。
   * @param {string} text JSON 文本
   * @returns {{added: number, skipped: number, errors: string[]}}
   */
  function importJSON(text) {
    const result = { added: 0, skipped: 0, errors: [] };
    text = String(text === undefined || text === null ? '' : text);
    if (!text.trim()) {
      result.errors.push('导入内容为空');
      return result;
    }
    if (text.length > MAX_IMPORT_TEXT) {
      result.errors.push('导入内容过大（超过 2MB），请分批导入');
      return result;
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      result.errors.push('JSON 解析失败：' + e.message);
      return result;
    }
    if (!Array.isArray(data)) {
      result.errors.push('导入内容必须是题目数组，例如 [{"chapter":"ch1","question":"...","options":["A","B"],"answer":0}]');
      return result;
    }
    if (data.length === 0) {
      result.errors.push('导入数组为空');
      return result;
    }
    if (data.length > MAX_IMPORT_COUNT) {
      result.errors.push('一次最多导入 ' + MAX_IMPORT_COUNT + ' 条（当前 ' + data.length + ' 条），请分批导入');
      return result;
    }

    const customs = getCustomQuestions();
    const records = getRecords();
    let seq = Date.now();

    data.forEach((item, i) => {
      const tag = '第 ' + (i + 1) + ' 项';
      // 形式2：引用已有题目 id
      if (typeof item === 'string') {
        const q = getQuestionById(item);
        if (!q) { result.errors.push(tag + '：id "' + item + '" 在题库中不存在'); return; }
        if (records.some(r => r.id === q.id)) { result.skipped++; return; }
        records.unshift({ id: q.id, userAnswer: null, wrongCount: 1, firstTime: Date.now(), lastTime: Date.now(), source: 'manual' });
        result.added++;
        return;
      }
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        result.errors.push(tag + '：元素必须是题目对象或题库 id 字符串（收到 ' + (item === null ? 'null' : Array.isArray(item) ? '数组' : typeof item) + '）');
        return;
      }
      // 形式1：完整题目对象
      const err = validateQuestion(item);
      if (err) { result.errors.push(tag + '：' + err); return; }
      let id = item.id;
      if (!id || getQuestionById(id) || customs.some(c => c.id === id)) {
        id = 'm-' + seq++; // 无 id 或与现有题/已导入题冲突时重新编号
      }
      const normalized = {
        id,
        chapter: item.chapter,
        difficulty: item.difficulty || 'medium',
        type: 'choice',
        question: item.question.trim(),
        options: item.options.slice(),
        answer: item.answer,
        explanation: item.explanation || '',
      };
      if (!customs.some(c => c.id === id)) customs.push(normalized);
      if (records.some(r => r.id === id)) { result.skipped++; return; }
      records.unshift({ id, userAnswer: null, wrongCount: 1, firstTime: Date.now(), lastTime: Date.now(), source: 'manual' });
      result.added++;
    });

    saveCustomQuestions(customs);
    saveRecords(records);
    return result;
  }

  /**
   * 导出错题本中所有题目（完整题目对象数组，可直接再导入）
   */
  function exportJSON() {
    return JSON.stringify(
      getRecords().map(r => getQuestionById(r.id)).filter(Boolean),
      null,
      2,
    );
  }

  // ─── 统计 ───────────────────────────────────────────────────────

  /**
   * 统计信息。chapterFilter/difficultyFilter 传入时同时返回过滤后的记录。
   */
  function getFiltered(chapterFilter, difficultyFilter) {
    return getRecords().filter(r => {
      const q = getQuestionById(r.id);
      if (!q) return false;
      if (chapterFilter && chapterFilter !== 'all' && q.chapter !== chapterFilter) return false;
      if (difficultyFilter && difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      return true;
    });
  }

  function stats() {
    const records = getRecords();
    const byChapter = {};
    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    let total = 0;
    records.forEach(r => {
      const q = getQuestionById(r.id);
      if (!q) return;
      total++;
      byChapter[q.chapter] = (byChapter[q.chapter] || 0) + 1;
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    });
    return { total, byChapter, byDifficulty };
  }

  return {
    getRecords,
    getQuestionById,
    getCustomQuestions,
    recordWrong,
    recordFromDetails,
    applyRedoResult,
    remove,
    has,
    clear,
    validateQuestion,
    importJSON,
    exportJSON,
    getFiltered,
    stats,
  };
})();
