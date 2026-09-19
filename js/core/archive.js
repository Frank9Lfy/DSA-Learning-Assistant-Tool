/* ========================================
   archive.js - 存档管理器（自动存档 / 多存档槽位 / 启动恢复）

   设计说明（可行性结论：纯前端即可完整实现）：
   - 本应用所有用户数据都存于 localStorage（教学进度、错题本、测验历史、
     收藏等），因此"存档"= 对一组固定 key 做一次性快照，"恢复"= 把快照写回
     localStorage 后刷新页面，让各模块按既有初始化逻辑重新读取，不影响正常使用。
   - 自动存档：包装 Storage.set，任一被跟踪 key 变化即防抖快照；
     另有 60s 定时兜底 + 页面隐藏/关闭前强制快照。
   - 启动恢复：
     ① 上次浏览位置（路由/知识点）、代码评判草稿、AI 对话记录原本只存在内存，
        由各自模块新增持久化，打开时按设置恢复；
     ② 若检测到"存在自动存档但当前数据为空"（如数据被误清），主动询问是否恢复。
   - 多存档：dsa-archive-slots 保存命名槽位列表（默认上限 10 份），
     支持保存 / 恢复 / 重命名 / 删除 / 导出 JSON / 导入 JSON。
   ======================================== */

const Archive = (() => {
  'use strict';

  const K = APP_CONSTANTS.STORAGE_KEYS;

  // 纳入存档的全部数据 key（模块自身实现里硬编码的 key 以字面量列出）
  const TRACKED_KEYS = [
    K.THEME,
    K.SIDEBAR,
    'dsa-lesson-progress-v1',           // 交互教学进度（lessonPlayer.js）
    K.QUIZ_HISTORY,                     // 测验历史
    K.MISTAKE_BOOK,                     // 错题本
    'dsa-mistake-custom-questions',     // 错题本自定义题目（mistakeEngine.js）
    K.BOOKMARKS,                        // 资源收藏
    K.LAST_ROUTE,                       // 上次浏览位置
    K.JUDGE_STATE,                      // 代码评判草稿
    K.CHAT_HISTORY,                     // AI 对话记录
    K.KNOWLEDGE_POS,                    // 知识检索位置
  ];

  // 存档系统自身写入的 key（不触发自动快照，避免自触发循环）
  const INTERNAL_KEYS = [K.ARCHIVE_AUTO, K.ARCHIVE_SLOTS, K.SETTINGS];

  const DEFAULT_SETTINGS = {
    autoArchive: true,        // 自动存档开关
    restoreRoute: true,       // 打开时恢复上次浏览位置
    restoreJudge: true,       // 打开时恢复代码评判草稿
    restoreChat: true,        // 打开时恢复 AI 对话
    restoreKnowledge: true,   // 打开时恢复知识检索位置
    maxSlots: 10,             // 手动存档上限
  };

  /* ---------- 设置 ---------- */

  function getSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, Storage.get(K.SETTINGS, {}));
  }

  function saveSettings(patch) {
    const next = Object.assign(getSettings(), patch || {});
    Storage.set(K.SETTINGS, next);
    return next;
  }

  /* ---------- 快照 ---------- */

  /** 收集当前全部被跟踪数据，生成一份快照对象 */
  function collect() {
    const data = {};
    TRACKED_KEYS.forEach(key => {
      const val = Storage.get(key, null);
      if (val !== null && val !== undefined) data[key] = val;
    });
    return {
      app: 'dsa-review',
      version: 1,
      savedAt: Date.now(),
      data: data,
    };
  }

  /** 快照是否为空 */
  function isEmpty(snapshot) {
    return !snapshot || !snapshot.data || Object.keys(snapshot.data).length === 0;
  }

  /** 把快照写入 localStorage（只写白名单 key，不刷新页面） */
  function writeBack(snapshot) {
    if (!snapshot || !snapshot.data) return 0;
    let n = 0;
    Object.entries(snapshot.data).forEach(([key, val]) => {
      if (!TRACKED_KEYS.includes(key)) return;
      Storage.set(key, val);
      n++;
    });
    return n;
  }

  /* ---------- 自动存档 ---------- */

  // 业务数据 key（学习进度类；用于识别"数据被清空"的异常状态）
  const BIZ_KEYS = [
    'dsa-lesson-progress-v1',
    K.QUIZ_HISTORY,
    K.MISTAKE_BOOK,
    'dsa-mistake-custom-questions',
    K.BOOKMARKS,
  ];

  /* ---------- 启动恢复 ---------- */

  /**
   * 业务数据是否全部为空（主题/侧栏等界面偏好不算）
   */
  function liveDataMissing() {
    return BIZ_KEYS.every(k => localStorage.getItem(k) === null);
  }

  /** 快照里是否真的存有业务数据（没有可恢复的学习数据就不该打扰用户） */
  function snapshotHasBiz(snapshot) {
    return !!snapshot && BIZ_KEYS.some(k => snapshot.data && snapshot.data[k] !== undefined);
  }

  let autoTimer = null;

  function scheduleAutoSave() {
    if (!getSettings().autoArchive) return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(autoSave, 1500);   // 防抖：连续写入只存一次
  }

  /**
   * 立即写一次自动存档，返回是否成功。
   * 保护：若当前业务数据全部消失、而已有快照中存在业务数据（多半是误清），
   * 不覆盖快照——保留最后一份有数据的版本，供启动时兜底询问恢复。
   * @param {boolean} [force] - 用户主动保存时强制写入
   */
  function autoSave(force) {
    if (!getSettings().autoArchive) return false;
    const snap = collect();
    const prev = getAutoSnapshot();
    const bizEmpty = BIZ_KEYS.every(k => snap.data[k] === undefined);
    const prevHasBiz = !!prev && BIZ_KEYS.some(k => prev.data[k] !== undefined);
    if (!force && bizEmpty && prevHasBiz) return false;
    Storage.set(K.ARCHIVE_AUTO, snap);
    return true;
  }

  function getAutoSnapshot() {
    return Storage.get(K.ARCHIVE_AUTO, null);
  }

  /* ---------- 手动存档槽位 ---------- */

  function listSlots() {
    return Storage.get(K.ARCHIVE_SLOTS, []);
  }

  function saveSlots(slots) {
    Storage.set(K.ARCHIVE_SLOTS, slots);
  }

  /** 保存当前状态为新存档，返回新槽位 */
  function saveSlot(name) {
    const settings = getSettings();
    const slots = listSlots();
    const slot = {
      id: 'slot-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: (name || '').trim() || defaultSlotName(),
      savedAt: Date.now(),
      data: collect(),
    };
    slots.unshift(slot);
    while (slots.length > settings.maxSlots) slots.pop();
    saveSlots(slots);
    return slot;
  }

  function overwriteSlot(id) {
    const slots = listSlots();
    const slot = slots.find(s => s.id === id);
    if (!slot) return null;
    slot.savedAt = Date.now();
    slot.data = collect();
    saveSlots(slots);
    return slot;
  }

  function deleteSlot(id) {
    saveSlots(listSlots().filter(s => s.id !== id));
  }

  function renameSlot(id, name) {
    const slots = listSlots();
    const slot = slots.find(s => s.id === id);
    if (slot && (name || '').trim()) {
      slot.name = name.trim();
      saveSlots(slots);
    }
    return slot;
  }

  function getSlot(id) {
    return listSlots().find(s => s.id === id) || null;
  }

  function defaultSlotName() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `存档 ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /* ---------- 恢复 ---------- */

  /** 恢复快照并刷新页面（先净化，再写回；各模块初始化时自动读取，无需逐个通知） */
  function restoreAndReload(snapshot) {
    const { snapshot: safe } = sanitizeSnapshot(snapshot || {});
    if (Object.keys(safe.data).length === 0) {
      DOM.toast('存档中没有可恢复的数据', 'warning');
      return false;
    }
    autoSave();                       // 恢复前先给当前状态留一份自动存档
    const n = writeBack(safe);
    try { sessionStorage.setItem('dsa-restored-keys', String(n)); } catch (e) { /* file:// 下可能受限 */ }
    location.reload();
    return true;
  }

  /* ---------- 导入 / 导出 ---------- */

  function exportSnapshot(snapshot, filename) {
    const text = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || ('dsa-archive-' + new Date().toISOString().slice(0, 10) + '.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ─── 导入校验：白名单 key + 类型/大小净化 ─────────────────
  // 用户可能导入任意 JSON：这里保证只有「认识的 key + 形状合法 + 大小可控」
  // 的数据才会被写回 localStorage，畸形项丢弃并计数，绝不因导入卡死或写坏状态。

  const MAX_ARCHIVE_TEXT = 8 * 1024 * 1024;   // 8MB 文本上限

  function isPlainObj(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  // 每个 key 的形状校验器（宽松：能防畸形/超大即可，不做逐条语义校验）
  const SNAPSHOT_CHECKS = {
    [K.THEME]: v => v === 'light' || v === 'dark',
    [K.SIDEBAR]: v => typeof v === 'boolean',
    ['dsa-lesson-progress-v1']: v => isPlainObj(v) && Object.keys(v).length <= 500
      && Object.values(v).every(x => isPlainObj(x)),
    [K.QUIZ_HISTORY]: v => Array.isArray(v) && v.length <= 500,
    [K.MISTAKE_BOOK]: v => Array.isArray(v) && v.length <= 5000
      && v.every(r => isPlainObj(r) && (typeof r.id === 'string' || typeof r.id === 'number')),
    ['dsa-mistake-custom-questions']: v => Array.isArray(v) && v.length <= 5000
      && v.every(q => isPlainObj(q) && typeof q.question === 'string' && Array.isArray(q.options)),
    [K.BOOKMARKS]: v => Array.isArray(v) && v.length <= 500 && v.every(x => typeof x === 'string'),
    [K.LAST_ROUTE]: v => typeof v === 'string' && v.length <= 200 && v.startsWith('#/'),
    [K.JUDGE_STATE]: v => isPlainObj(v) && typeof v.code === 'string' && v.code.length <= 200000,
    [K.CHAT_HISTORY]: v => Array.isArray(v) && v.length <= 200
      && v.every(m => isPlainObj(m) && typeof m.content === 'string'
        && (m.role === 'user' || m.role === 'assistant')),
    [K.KNOWLEDGE_POS]: v => typeof v === 'string' && v.length <= 20,
  };

  /**
   * 净化快照：只保留白名单 key 中通过形状校验的数据。
   * @returns {{snapshot: Object, skipped: number}}
   */
  function sanitizeSnapshot(raw) {
    const src = isPlainObj(raw) && isPlainObj(raw.data) ? raw.data : {};
    const data = {};
    let skipped = 0;
    Object.entries(src).forEach(([key, val]) => {
      const check = SNAPSHOT_CHECKS[key];
      if (!check || !check(val)) { skipped++; return; }   // 未知 key 或形状非法：丢弃
      data[key] = val;
    });
    return {
      snapshot: { app: 'dsa-review', version: 1, savedAt: isPlainObj(raw) && raw.savedAt ? raw.savedAt : Date.now(), data: data },
      skipped: skipped,
    };
  }

  /**
   * 解析导入文本，返回 {ok, snapshot?, skipped?, msg?}
   */
  function parseImport(text) {
    text = String(text === undefined || text === null ? '' : text);
    if (!text.trim()) {
      return { ok: false, msg: '导入内容为空' };
    }
    if (text.length > MAX_ARCHIVE_TEXT) {
      return { ok: false, msg: '文件过大（超过 8MB），不是有效的存档文件' };
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return { ok: false, msg: 'JSON 解析失败：' + e.message };
    }
    if (!isPlainObj(parsed)) {
      return { ok: false, msg: '不是有效的存档文件（顶层必须是 JSON 对象，收到 ' + (Array.isArray(parsed) ? '数组' : typeof parsed) + '）' };
    }
    if (parsed.app !== 'dsa-review') {
      return { ok: false, msg: '这不是本应用的存档文件（缺少 dsa-review 标识）' };
    }
    if (!isPlainObj(parsed.data)) {
      return { ok: false, msg: '存档缺少有效的 data 字段' };
    }
    const { snapshot, skipped } = sanitizeSnapshot(parsed);
    if (Object.keys(snapshot.data).length === 0) {
      return { ok: false, msg: '存档中没有可识别的数据项' + (skipped ? '（' + skipped + ' 项格式非法已被忽略）' : '') };
    }
    return { ok: true, snapshot: snapshot, skipped: skipped };
  }

  /* ---------- 启动恢复 ---------- */

  /**
   * 应用启动时调用（各模块读取 storage 之前）。
   * ① 兜底恢复：存在**含业务数据**的自动存档、且当前业务数据全部为空
   *   （如被误清除）→ 主动询问恢复。
   *   注意两个条件缺一不可：只有草稿/对话等非业务数据的快照（或用户从未
   *   产生过学习数据）不该弹窗，否则会陷入"确定→恢复→依旧为空→再弹"的循环。
   * ② 用户取消后，本次浏览会话内不再询问（sessionStorage 标记）。
   * ③ 为 Storage.set 挂自动快照钩子，并启动定时/卸载兜底。
   */
  function init() {
    installStorageHook();
    startLifecycle();

    try {
      if (sessionStorage.getItem('dsa-archive-declined')) {
        // 用户本会话已拒绝恢复，不再打扰
      } else {
        const auto = getAutoSnapshot();
        if (snapshotHasBiz(auto) && liveDataMissing()) {
          // 延迟到首屏渲染后再询问，避免打断加载
          setTimeout(() => {
            if (confirm('检测到上一次会话的自动存档，但当前学习数据（教学进度/错题本等）为空（可能被清除）。\n\n是否从自动存档恢复？（选择"取消"将从空白开始，存档仍保留）')) {
              writeBack(auto);
              location.reload();
            } else {
              try { sessionStorage.setItem('dsa-archive-declined', '1'); } catch (e) { /* ignore */ }
            }
          }, 400);
        }
      }
    } catch (e) { /* sessionStorage 不可用时跳过 */

    }

    // 恢复完成后提示
    try {
      const n = sessionStorage.getItem('dsa-restored-keys');
      if (n) {
        sessionStorage.removeItem('dsa-restored-keys');
        setTimeout(() => DOM.toast('✅ 存档已恢复（' + n + ' 项数据）', 'success'), 500);
      }
    } catch (e) { /* ignore */ }
  }

  /** 包装 Storage.set：被跟踪数据变化 → 防抖自动快照 */
  function installStorageHook() {
    if (Storage.__archiveHooked) return;
    const origSet = Storage.set.bind(Storage);
    Storage.set = function (key, value) {
      origSet(key, value);
      if (!INTERNAL_KEYS.includes(key) && TRACKED_KEYS.includes(key)) {
        scheduleAutoSave();
      }
    };
    Storage.__archiveHooked = true;
  }

  /** 定时兜底 + 页面隐藏/关闭前强制快照 */
  function startLifecycle() {
    setInterval(() => { if (getSettings().autoArchive) autoSave(); }, 60000);
    window.addEventListener('beforeunload', () => autoSave());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') autoSave();
    });
  }

  /* ---------- 展示辅助 ---------- */

  /** 快照大小（格式化） */
  function sizeOf(snapshot) {
    try {
      const bytes = new Blob([JSON.stringify(snapshot)]).size;
      return bytes > 1024 ? (bytes / 1024).toFixed(1) + ' KB' : bytes + ' B';
    } catch (e) {
      return '-';
    }
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  /** 快照内容摘要（按模块统计，供设置页展示） */
  function summarize(snapshot) {
    if (!snapshot || !snapshot.data) return [];
    const d = snapshot.data;
    const items = [];
    const cnt = v => Array.isArray(v) ? v.length : (v && typeof v === 'object' ? Object.keys(v).length : 0);
    if (d['dsa-lesson-progress-v1']) items.push({ icon: '🎓', label: '交互教学进度', detail: cnt(d['dsa-lesson-progress-v1']) + ' 门课' });
    if (d[K.QUIZ_HISTORY]) items.push({ icon: '📝', label: '测验历史', detail: cnt(d[K.QUIZ_HISTORY]) + ' 次' });
    if (d[K.MISTAKE_BOOK]) items.push({ icon: '📕', label: '错题本', detail: cnt(d[K.MISTAKE_BOOK]) + ' 道错题' });
    if (d['dsa-mistake-custom-questions']) items.push({ icon: '📥', label: '自定义题目', detail: cnt(d['dsa-mistake-custom-questions']) + ' 道' });
    if (d[K.BOOKMARKS]) items.push({ icon: '🔗', label: '资源收藏', detail: cnt(d[K.BOOKMARKS]) + ' 个' });
    if (d[K.JUDGE_STATE]) items.push({ icon: '💻', label: '代码评判草稿', detail: '已保存' });
    if (d[K.CHAT_HISTORY]) items.push({ icon: '🤖', label: 'AI 对话', detail: cnt(d[K.CHAT_HISTORY]) + ' 条' });
    if (d[K.KNOWLEDGE_POS]) items.push({ icon: '📖', label: '知识检索位置', detail: d[K.KNOWLEDGE_POS] });
    if (d[K.LAST_ROUTE]) items.push({ icon: '🧭', label: '上次位置', detail: routeName(d[K.LAST_ROUTE]) });
    return items;
  }

  function routeName(route) {
    const names = {
      'knowledge': '知识检索', 'teaching': '交互教学', 'visualization': '算法可视化',
      'code-judge': '代码评判', 'quiz': '练习测验', 'mistakes': '错题本',
      'ai-chat': 'AI 助教', 'resources': '拓展资源', 'settings': '设置',
    };
    const r = typeof route === 'string' ? route.replace(/^#\/?/, '').split('/')[0] : '';
    return names[r] || r || '首页';
  }

  return {
    TRACKED_KEYS,
    getSettings,
    saveSettings,
    collect,
    isEmpty,
    autoSave,
    getAutoSnapshot,
    listSlots,
    saveSlot,
    overwriteSlot,
    deleteSlot,
    renameSlot,
    getSlot,
    restoreAndReload,
    writeBack,
    exportSnapshot,
    parseImport,
    sanitizeSnapshot,
    snapshotHasBiz,
    liveDataMissing,
    init,
    sizeOf,
    formatTime,
    summarize,
    routeName,
  };
})();

window.Archive = Archive;
