/* ========================================
   quizEngine.js - Quiz Generation & Scoring Logic
   Handles question selection, answer checking, scoring
   ======================================== */

const QuizEngine = (() => {
  // ─── State ─────────────────────────────────────────────────────
  let currentQuiz = [];    // Array of question objects for active quiz
  let userAnswers = {};    // { questionId: selectedOptionIndex }
  let quizStartTime = 0;

  // ─── Fisher-Yates Shuffle ─────────────────────────────────────
  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ─── Generate Quiz ────────────────────────────────────────────
  /**
   * Generate a quiz with filtered questions
   * @param {string} chapter - Chapter ID ('all' or 'ch1', 'ch2', etc.)
   * @param {number} count - Number of questions (5, 10, 20)
   * @param {string} difficulty - 'all', 'easy', 'medium', 'hard'
   * @returns {Object[]} Array of question objects
   */
  function generateQuiz(chapter = 'all', count = 10, difficulty = 'all') {
    // Filter from QUESTIONS bank
    let pool = [...QUESTIONS];

    // Filter by chapter
    if (chapter && chapter !== 'all') {
      pool = pool.filter(q => q.chapter === chapter);
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // Shuffle the pool
    pool = shuffleArray(pool);

    // Take requested count (never more than available from THIS chapter)
    // IMPORTANT: Never pad from other chapters - each chapter is independent
    const selected = pool.slice(0, Math.min(count, pool.length));

    // Reset state
    currentQuiz = selected;
    userAnswers = {};
    quizStartTime = Date.now();

    // Store in global state
    Store.set('quiz.active', true);
    Store.set('quiz.questions', selected);
    Store.set('quiz.currentIndex', 0);
    Store.set('quiz.answers', {});
    Store.set('quiz.chapter', chapter || 'all');
    Store.set('quiz.difficulty', difficulty || 'all');
    Store.set('quiz.timeRemaining', APP_CONSTANTS.DEFAULTS.QUIZ_TIME_LIMIT);

    return selected;
  }

  // ─── Sync External Question Set ──────────────────────────────
  /**
   * Sync the engine's question set with an externally-built quiz
   * (e.g. mistake-book re-practice). checkAnswer / calculateScore
   * read the engine's internal currentQuiz, so any quiz started
   * outside generateQuiz MUST go through here first.
   * @param {Object[]} questions
   */
  function setCustomQuiz(questions) {
    currentQuiz = Array.isArray(questions) ? questions.slice() : [];
    userAnswers = {};
    quizStartTime = Date.now();

    Store.set('quiz.active', true);
    Store.set('quiz.questions', currentQuiz);
    Store.set('quiz.currentIndex', 0);
    Store.set('quiz.answers', {});
    return currentQuiz;
  }

  // ─── Check Answer ─────────────────────────────────────────────
  /**
   * Check if a selected answer is correct
   * @param {string} questionId - The question ID
   * @param {number} selectedAnswer - The selected option index
   * @returns {{correct: boolean, explanation: string, correctAnswer: number}}
   */
  function checkAnswer(questionId, selectedAnswer) {
    const question = currentQuiz.find(q => q.id === questionId);
    if (!question) {
      return { correct: false, explanation: '题目未找到', correctAnswer: -1 };
    }

    const correct = selectedAnswer === question.answer;

    // Save user answer
    userAnswers[questionId] = selectedAnswer;
    Store.set('quiz.answers', { ...userAnswers });

    return {
      correct,
      explanation: question.explanation || '',
      correctAnswer: question.answer
    };
  }

  // ─── Calculate Score ──────────────────────────────────────────
  /**
   * Calculate quiz score from answers
   * @param {Object} answers - { questionId: selectedOptionIndex }
   * @returns {{correct: number, total: number, percentage: number,
   *            diffStats: Object, details: Object[]}}
   *  diffStats: { easy:{correct,total}, medium:{...}, hard:{...} }
   */
  function calculateScore(answers = userAnswers) {
    let correctCount = 0;
    const details = [];
    const diffStats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };

    currentQuiz.forEach(question => {
      const userAns = answers[question.id];
      const isCorrect = userAns === question.answer;
      const isAnswered = userAns !== undefined;

      if (isCorrect) correctCount++;

      const diff = diffStats[question.difficulty] ? question.difficulty : 'medium';
      diffStats[diff].total++;
      if (isCorrect) diffStats[diff].correct++;

      details.push({
        question,
        userAnswer: userAns,
        correct: isCorrect,
        answered: isAnswered
      });
    });

    const total = currentQuiz.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    return {
      correct: correctCount,
      total,
      percentage,
      timeTaken,
      diffStats,
      details
    };
  }

  // ─── Get Question by Index ─────────────────────────────────────
  function getQuestion(index) {
    return currentQuiz[index] || null;
  }

  // ─── Get Total Count ───────────────────────────────────────────
  function getQuestionCount() {
    return currentQuiz.length;
  }

  // ─── Check if Question is Answered ────────────────────────────
  function isAnswered(questionId) {
    return userAnswers.hasOwnProperty(questionId);
  }

  // ─── Get User's Answer for a Question ─────────────────────────
  function getUserAnswer(questionId) {
    return userAnswers[questionId];
  }

  // ─── Get Answered Count ───────────────────────────────────────
  function getAnsweredCount() {
    return Object.keys(userAnswers).length;
  }

  // ─── Get Chapter Title ────────────────────────────────────────
  function getChapterTitle(chapterId) {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    return chapter ? chapter.title : chapterId;
  }

  // ─── Get Available Count ──────────────────────────────
  /**
   * Get the number of available questions for a chapter/difficulty
   * @param {string} chapter - Chapter ID or 'all'
   * @param {string} difficulty - 'all', 'easy', 'medium', 'hard'
   * @returns {number}
   */
  function getAvailableCount(chapter = 'all', difficulty = 'all') {
    let pool = [...QUESTIONS];
    if (chapter && chapter !== 'all') {
      pool = pool.filter(q => q.chapter === chapter);
    }
    if (difficulty && difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }
    return pool.length;
  }

  // ─── Save to History ──────────────────────────────────────────
  function saveToHistory(report) {
    const history = Storage.get(APP_CONSTANTS.STORAGE_KEYS.QUIZ_HISTORY, []);
    const record = {
      date: new Date().toISOString(),
      score: report.percentage,
      correct: report.correct,
      total: report.total,
      timeTaken: report.timeTaken,
      chapter: Store.get('quiz.chapter') || 'all',
      difficulty: Store.get('quiz.difficulty') || 'all'
    };
    history.unshift(record);
    // Keep last 50 records
    if (history.length > 50) history.length = 50;
    Storage.set(APP_CONSTANTS.STORAGE_KEYS.QUIZ_HISTORY, history);
    Store.set('quiz.history', history);
  }  // ─── Public API ───────────────────────────────────────────────
  return {
    generateQuiz,
    setCustomQuiz,
    checkAnswer,
    calculateScore,
    shuffleArray,
    getQuestion,
    getQuestionCount,
    isAnswered,
    getUserAnswer,
    getAnsweredCount,
    getChapterTitle,
    getAvailableCount,
    saveToHistory,
  };
})();
