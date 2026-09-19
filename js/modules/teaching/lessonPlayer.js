/* ========================================
   lessonPlayer.js - 课程注册表与查询 API
   课程数据来自 lessons-data-1.js / lessons-data-2.js
   （挂在 window.LessonData 命名空间上，本文件负责合并与查询）
   ======================================== */

const LessonPlayer = (() => {
  // 合并所有数据文件提供的课程
  const lessons = window.LessonData || {};

  // 进度存储 key（teachView 与本模块共用）
  const PROGRESS_KEY = 'dsa-lesson-progress-v1';

  /**
   * 读取全部学习进度
   * 结构: { [lessonId]: { step: 最后到达的步骤下标, done: 是否完成 } }
   */
  function getProgress() {
    return Storage.get(PROGRESS_KEY, {});
  }

  /**
   * 保存某门课的进度
   */
  function setProgress(lessonId, data) {
    const all = getProgress();
    all[lessonId] = Object.assign({}, all[lessonId] || {}, data);
    Storage.set(PROGRESS_KEY, all);
  }

  return {
    PROGRESS_KEY,

    /**
     * Get all available lessons
     * @returns {{id,title,chapter,stepCount,summary}[]}
     */
    getAll() {
      return Object.entries(lessons).map(([id, l]) => ({
        id,
        title: l.title,
        chapter: l.chapter,
        stepCount: (l.steps || []).length,
        summary: l.summary || [],
      }));
    },

    /**
     * Get lesson by ID
     */
    get(lessonId) {
      return lessons[lessonId] || null;
    },

    /**
     * Get step
     */
    getStep(lessonId, stepIndex) {
      const lesson = lessons[lessonId];
      if (!lesson || stepIndex < 0 || stepIndex >= lesson.steps.length) return null;
      return lesson.steps[stepIndex];
    },

    /**
     * Get step count
     */
    getStepCount(lessonId) {
      return (lessons[lessonId] && lessons[lessonId].steps.length) || 0;
    },

    /**
     * 进度：读取 / 写入 / 标记完成
     */
    getProgress,
    setProgress,

    getLessonProgress(lessonId) {
      return getProgress()[lessonId] || null;
    },

    saveStep(lessonId, stepIndex) {
      setProgress(lessonId, { step: Math.max(stepIndex, 0) });
    },

    markDone(lessonId) {
      setProgress(lessonId, { done: true });
    },

    markUnDone(lessonId) {
      setProgress(lessonId, { done: false });
    },

    /**
     * 完成率统计（供课程列表头部展示）
     */
    getStats() {
      const all = getProgress();
      const total = Object.keys(lessons).length;
      let done = 0;
      Object.keys(lessons).forEach(id => { if (all[id] && all[id].done) done++; });
      return { total, done };
    },
  };
})();
