/* ========================================
   settingsView.js - 设置与存档视图
   板块内容：
   ① 自动存档：开关 + 状态 + 立即快照 / 恢复 / 下载（自动存档随数据变化防抖更新，
      另有 60s 定时兜底与页面关闭前强制快照）
   ② 启动恢复：上次浏览位置 / 代码评判草稿 / AI 对话 / 知识检索位置 四项开关
   ③ 手动存档：最多 10 份命名存档，支持保存 / 恢复 / 覆盖更新 / 重命名 /
      下载 JSON / 导入 JSON（恢复通过写回 localStorage 后刷新实现）
   ④ 数据概览：各模块数据占用一览
   ⑤ 危险区：清空全部数据
   依赖：Archive、Storage、DOM、APP_CONSTANTS
   ======================================== */

const SettingsView = (() => {
  'use strict';

  /* ---------------- 渲染 ---------------- */

  function render() {
    const container = DOM.$('#settings-container');
    if (!container) return;

    const s = Archive.getSettings();
    const auto = Archive.getAutoSnapshot();
    const slots = Archive.listSlots();

    container.innerHTML = `
      ${renderAutoCard(s, auto)}
      ${renderRestoreCard(s)}
      ${renderSlotsCard(slots)}
      ${renderDangerCard()}
    `;
  }

  function renderAutoCard(s, auto) {
    const lastTime = auto && auto.savedAt ? Archive.formatTime(auto.savedAt) : '暂无';
    const size = auto ? Archive.sizeOf(auto) : '-';
    const summary = auto && !Archive.isEmpty(auto)
      ? Archive.summarize(auto).map(i => `<span class="set-chip">${i.icon} ${i.label} · ${i.detail}</span>`).join('')
      : '<span class="text-muted text-sm">暂无内容</span>';

    return `
      <div class="card set-card">
        <div class="set-card-head">
          <h3>💾 自动存档</h3>
          <label class="set-switch">
            <input type="checkbox" ${s.autoArchive ? 'checked' : ''}
                   onchange="SettingsView.toggleSetting('autoArchive', this.checked)">
            <span class="set-slider-ui"></span>
            <span class="set-switch-text">${s.autoArchive ? '已开启' : '已关闭'}</span>
          </label>
        </div>
        <p class="text-sm text-muted set-desc">
          学习数据（教学进度、错题本、测验历史、收藏、代码草稿、对话记录等）发生变化时自动生成快照；
          另有定时兜底与页面关闭前强制保存。若数据被误清，打开页面时会主动询问是否从自动存档恢复。
        </p>
        <div class="set-row">
          <span class="set-label">上次快照：</span><b>${lastTime}</b>
          <span class="set-label" style="margin-left:16px">大小：</span><b>${size}</b>
        </div>
        <div class="set-chips">${summary}</div>
        <div class="set-actions">
          <button class="btn btn-primary btn-sm" onclick="SettingsView.saveSnapshotNow()">立即保存快照</button>
          <button class="btn btn-outline btn-sm" onclick="SettingsView.restoreAuto()">从自动存档恢复</button>
          <button class="btn btn-outline btn-sm" onclick="SettingsView.downloadAuto()">下载快照 JSON</button>
        </div>
      </div>
    `;
  }

  function renderRestoreCard(s) {
    const items = [
      { key: 'restoreRoute', icon: '🧭', title: '恢复上次浏览位置', desc: '打开页面自动回到上次所在板块（含知识点位置）' },
      { key: 'restoreJudge', icon: '💻', title: '恢复代码评判草稿', desc: '保留上次编辑器中的代码与所选题目' },
      { key: 'restoreChat', icon: '🤖', title: '恢复 AI 对话记录', desc: '重新打开时显示历史对话（最多 100 条）' },
      { key: 'restoreKnowledge', icon: '📖', title: '恢复知识检索位置', desc: '回到上次阅读的知识点' },
    ];
    return `
      <div class="card set-card">
        <div class="set-card-head">
          <h3>🔄 打开时恢复</h3>
          <span class="text-sm text-muted">下列状态将在下次打开页面时自动还原</span>
        </div>
        <div class="set-restore-list">
          ${items.map(it => `
            <div class="set-restore-item">
              <div class="set-restore-info">
                <b>${it.icon} ${it.title}</b>
                <p class="text-sm text-muted">${it.desc}</p>
              </div>
              <label class="set-switch">
                <input type="checkbox" ${s[it.key] ? 'checked' : ''}
                       onchange="SettingsView.toggleSetting('${it.key}', this.checked)">
                <span class="set-slider-ui"></span>
              </label>
            </div>`).join('')}
        </div>
      </div>
    `;
  }

  function renderSlotsCard(slots) {
    const listHtml = slots.length === 0
      ? '<div class="set-empty">还没有手动存档。完成一阶段复习后存一份，随时可以回到这个状态。</div>'
      : slots.map(slot => {
          const summary = Archive.summarize(slot.data).map(i => `<span class="set-chip">${i.icon} ${i.label} · ${i.detail}</span>`).join('');
          return `
            <div class="set-slot">
              <div class="set-slot-main">
                <div class="set-slot-title">
                  <b>📦 ${DOM.escapeHtml(slot.name)}</b>
                  <span class="text-sm text-muted">${Archive.formatTime(slot.savedAt)} · ${Archive.sizeOf(slot.data)}</span>
                </div>
                <div class="set-chips">${summary || '<span class="text-muted text-sm">空存档</span>'}</div>
              </div>
              <div class="set-slot-actions">
                <button class="btn btn-primary btn-sm" onclick="SettingsView.restoreSlot('${slot.id}')">恢复</button>
                <button class="btn btn-outline btn-sm" onclick="SettingsView.overwriteSlot('${slot.id}')">覆盖更新</button>
                <button class="btn btn-outline btn-sm" onclick="SettingsView.renameSlot('${slot.id}')">重命名</button>
                <button class="btn btn-outline btn-sm" onclick="SettingsView.downloadSlot('${slot.id}')">下载</button>
                <button class="btn btn-outline btn-sm" style="color:var(--accent-danger)" onclick="SettingsView.deleteSlot('${slot.id}')">删除</button>
              </div>
            </div>`;
        }).join('');

    return `
      <div class="card set-card">
        <div class="set-card-head">
          <h3>🗂 手动存档（${slots.length}/${Archive.getSettings().maxSlots}）</h3>
        </div>
        <p class="text-sm text-muted set-desc">
          手动存档互不影响，也不会被自动快照覆盖。恢复时会先把当前状态存入自动存档，防止误恢复丢失进度。
        </p>
        <div class="set-save-row">
          <input type="text" id="set-slot-name" class="set-input" maxlength="30"
                 placeholder="存档名称（留空自动按时间命名）">
          <button class="btn btn-primary" onclick="SettingsView.saveNamedSlot()">📦 保存当前状态</button>
        </div>
        <div class="set-slot-list">${listHtml}</div>
        <div class="set-import">
          <h4>📥 导入存档文件</h4>
          <p class="text-sm text-muted">选择本平台导出的 JSON 存档（自动存档或手动存档均可），导入后立即恢复。</p>
          <input type="file" id="set-import-file" accept=".json,application/json"
                 onchange="SettingsView.importFile(this)">
        </div>
      </div>
    `;
  }

  function renderDangerCard() {
    return `
      <div class="card set-card set-danger">
        <div class="set-card-head"><h3>⚠️ 危险区</h3></div>
        <p class="text-sm text-muted">清空后将删除本浏览器的全部学习数据（含存档），不可恢复。</p>
        <button class="btn btn-danger" onclick="SettingsView.clearAllData()">🗑 清空全部数据</button>
      </div>
    `;
  }

  /* ---------------- 交互动作 ---------------- */

  function toggleSetting(key, checked) {
    Archive.saveSettings({ [key]: !!checked });
    DOM.toast('设置已保存', 'success');
    // 仅重绘受影响区域：整体重渲染最简单且开销极小
    render();
  }

  function saveSnapshotNow() {
    Archive.autoSave(true);
    DOM.toast('已保存自动快照', 'success');
    render();
  }

  function restoreAuto() {
    const auto = Archive.getAutoSnapshot();
    if (Archive.isEmpty(auto)) {
      DOM.toast('暂无自动存档可恢复', 'warning');
      return;
    }
    if (confirm('将恢复到自动快照的状态（' + Archive.formatTime(auto.savedAt) + '），当前未存档的改动会先被快照保留。继续吗？')) {
      Archive.restoreAndReload(auto);
    }
  }

  function downloadAuto() {
    const auto = Archive.getAutoSnapshot();
    if (Archive.isEmpty(auto)) {
      DOM.toast('暂无自动存档可下载', 'warning');
      return;
    }
    Archive.exportSnapshot(auto);
  }

  function saveNamedSlot() {
    const input = DOM.$('#set-slot-name');
    const name = input ? input.value : '';
    const slot = Archive.saveSlot(name);
    if (input) input.value = '';
    DOM.toast(`已保存存档「${slot.name}」`, 'success');
    render();
  }

  function restoreSlot(id) {
    const slot = Archive.getSlot(id);
    if (!slot) { DOM.toast('存档不存在', 'error'); return; }
    if (confirm(`恢复存档「${slot.name}」？\n当前未存档的改动会先被快照保留。`)) {
      Archive.restoreAndReload(slot.data);
    }
  }

  function overwriteSlot(id) {
    const slot = Archive.overwriteSlot(id);
    if (slot) {
      DOM.toast(`已覆盖更新「${slot.name}」`, 'success');
      render();
    }
  }

  function renameSlot(id) {
    const slot = Archive.getSlot(id);
    if (!slot) return;
    const name = prompt('新的存档名称：', slot.name);
    if (name === null) return;
    Archive.renameSlot(id, name);
    render();
  }

  function deleteSlot(id) {
    const slot = Archive.getSlot(id);
    if (!slot) return;
    if (confirm(`删除存档「${slot.name}」？此操作不可恢复。`)) {
      Archive.deleteSlot(id);
      DOM.toast('存档已删除', 'success');
      render();
    }
  }

  function downloadSlot(id) {
    const slot = Archive.getSlot(id);
    if (!slot) { DOM.toast('存档不存在', 'error'); return; }
    Archive.exportSnapshot(slot.data, 'dsa-archive-' + slot.name.replace(/[\\/:*?"<>|\s]+/g, '-') + '.json');
  }

  function importFile(inputEl) {
    const file = inputEl && inputEl.files && inputEl.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      DOM.toast('文件过大（超过 8MB），不是有效的存档文件', 'error');
      inputEl.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = Archive.parseImport(String(reader.result || ''));
      if (!parsed.ok) {
        DOM.toast(parsed.msg, 'error');
        return;
      }
      const snap = parsed.snapshot;
      const when = snap.savedAt ? Archive.formatTime(snap.savedAt) : '未知时间';
      const skipNote = parsed.skipped > 0 ? `\n（${parsed.skipped} 项无法识别或格式非法的数据将被忽略）` : '';
      if (confirm(`导入存档（保存于 ${when}）并立即恢复？\n当前未存档的改动会先被快照保留。${skipNote}`)) {
        Archive.restoreAndReload(snap);
      }
    };
    reader.onerror = () => DOM.toast('文件读取失败', 'error');
    reader.readAsText(file, 'utf-8');
    // 允许重复选择同一文件
    inputEl.value = '';
  }

  function clearAllData() {
    if (!confirm('确定清空全部学习数据（含存档）吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：真的要清空吗？建议先在上方保存或下载一份存档。')) return;
    Object.values(APP_CONSTANTS.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('dsa-lesson-progress-v1');
    localStorage.removeItem('dsa-mistake-custom-questions');
    location.hash = '#/knowledge';
    location.reload();
  }

  return {
    render,
    toggleSetting,
    saveSnapshotNow,
    restoreAuto,
    downloadAuto,
    saveNamedSlot,
    restoreSlot,
    overwriteSlot,
    renameSlot,
    deleteSlot,
    downloadSlot,
    importFile,
    clearAllData,
  };
})();

window.SettingsView = SettingsView;

// 注册路由
if (typeof Router !== 'undefined' && Router.register) {
  Router.register(APP_CONSTANTS.ROUTES.SETTINGS, () => {
    SettingsView.render();
  });
}
