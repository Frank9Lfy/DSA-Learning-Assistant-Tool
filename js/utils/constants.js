/* ========================================
   constants.js - Application constants
   ======================================== */

const APP_CONSTANTS = {
  // Routes
  ROUTES: {
    KNOWLEDGE: 'knowledge',
    TEACHING: 'teaching',
    VISUALIZATION: 'visualization',
    CODE_JUDGE: 'code-judge',
    QUIZ: 'quiz',
    MISTAKES: 'mistakes',
    AI_CHAT: 'ai-chat',
    RESOURCES: 'resources',
    SETTINGS: 'settings',
  },

  // Piston API (free, no key needed)
  PISTON_API: 'https://emkc.org/api/v2/piston/execute',

  // Storage keys
  STORAGE_KEYS: {
    THEME: 'dsa-theme',
    SIDEBAR: 'dsa-sidebar',
    PROGRESS: 'dsa-progress',
    QUIZ_HISTORY: 'dsa-quiz-history',
    MISTAKE_BOOK: 'dsa-mistake-book',
    BOOKMARKS: 'dsa-bookmarks',
    CODE_SNIPPETS: 'dsa-code-snippets',
    // —— 存档 / 设置 ——
    ARCHIVE_AUTO: 'dsa-archive-auto',          // 自动存档快照
    ARCHIVE_SLOTS: 'dsa-archive-slots',        // 手动存档槽位列表
    SETTINGS: 'dsa-settings',                  // 设置板块偏好
    LAST_ROUTE: 'dsa-last-route',              // 上次浏览位置（路由 + 参数）
    JUDGE_STATE: 'dsa-judge-state',            // 代码评判草稿（代码 + 当前题目）
    CHAT_HISTORY: 'dsa-chat-history',          // AI 助教对话记录
    KNOWLEDGE_POS: 'dsa-knowledge-pos',        // 知识检索当前知识点
  },

  // Default settings
  DEFAULTS: {
    THEME: 'light',
    VIZ_SPEED: 1,
    VIZ_SIZE: 10,
    QUIZ_COUNT: 10,
    QUIZ_TIME_LIMIT: 300, // seconds
  },

  // Algorithm categories
  ALGO_CATEGORIES: {
    SORT: '排序算法',
    LIST: '线性表操作',
    TREE: '树操作',
    GRAPH: '图算法',
    SEARCH: '查找算法',
  },

  // Complexity notation
  COMPLEXITY: {
    O1: 'O(1)',
    OLOGN: 'O(log n)',
    ON: 'O(n)',
    ONLOGN: 'O(n log n)',
    ON2: 'O(n²)',
    ON3: 'O(n³)',
    O2N: 'O(2ⁿ)',
    ONFACT: 'O(n!)',
  },

  // Toast durations
  TOAST_DURATION: 3000,
};
