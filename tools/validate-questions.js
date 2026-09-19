/* ========================================
   tools/validate-questions.js - 题库自检脚本
   用法: node tools/validate-questions.js
   校验: 字段完整性 / answer 索引范围 / id 唯一性 /
         章节分布 / 难度分布 / 题型合法性
   ======================================== */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'questions.js');
const src = fs.readFileSync(file, 'utf8');

// 提取 QUESTIONS 数组并求值
const m = src.match(/const QUESTIONS = (\[[\s\S]*\]);\s*$/);
if (!m) {
  console.error('无法在 questions.js 中定位 QUESTIONS 数组');
  process.exit(1);
}
const QUESTIONS = eval(m[1]);

const CHAPTERS = ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10'];
const DIFFS = ['easy','medium','hard'];
const TYPES = ['choice','code-output'];

let errors = [];
const idSet = new Set();
const byChapter = {};
const byDifficulty = {};
const byType = {};

for (const q of QUESTIONS) {
  // 字段齐全
  for (const f of ['id','chapter','difficulty','type','question','options','answer','explanation']) {
    if (q[f] === undefined || q[f] === null || q[f] === '') {
      errors.push(`${q.id || '(无id)'}: 缺少字段 ${f}`);
    }
  }
  // id 唯一 + 格式
  if (idSet.has(q.id)) errors.push(`${q.id}: 重复 id`);
  idSet.add(q.id);
  if (!/^ch(10|[1-9])-\d{2}$/.test(q.id)) errors.push(`${q.id}: id 格式不符合 chX-NN`);
  const ch = (q.id.match(/^ch(10|[1-9])-/) || [])[1];
  if (q.chapter !== `ch${ch}`) errors.push(`${q.id}: chapter 字段(${q.chapter})与 id 前缀(ch${ch})不一致`);

  // answer 索引
  if (!Number.isInteger(q.answer) || q.answer < 0 || (q.options && q.answer >= q.options.length)) {
    errors.push(`${q.id}: answer 索引越界 (${q.answer}, options.length=${q.options ? q.options.length : '?'})`);
  }

  // 枚举值
  if (!DIFFS.includes(q.difficulty)) errors.push(`${q.id}: 非法 difficulty "${q.difficulty}"`);
  if (!TYPES.includes(q.type)) errors.push(`${q.id}: 非法 type "${q.type}"`);

  // options
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
    errors.push(`${q.id}: options 数量异常 (${q.options ? q.options.length : '?'})`);
  }
  if (q.options && new Set(q.options).size !== q.options.length) {
    errors.push(`${q.id}: options 有重复项`);
  }

  // 统计
  byChapter[q.chapter] = (byChapter[q.chapter] || 0) + 1;
  byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  byType[q.type] = (byType[q.type] || 0) + 1;
}

// 章节覆盖
for (const c of CHAPTERS) {
  if (!byChapter[c]) errors.push(`缺少章节 ${c} 的题目`);
  else if (byChapter[c] < 15) errors.push(`${c} 只有 ${byChapter[c]} 题（要求每章 ≥15）`);
}

// ── 报告 ──
console.log('══════════ 题库自检报告 ══════════');
console.log(`总题数: ${QUESTIONS.length}\n`);
console.log('章节分布:');
for (const c of CHAPTERS) {
  const n = byChapter[c] || 0;
  console.log(`  ${c.padEnd(4)} ${String(n).padStart(3)} 题  ${n >= 15 ? 'OK' : '!! 不足15'}`);
}
console.log('\n难度分布:');
for (const d of DIFFS) console.log(`  ${d.padEnd(6)} ${byDifficulty[d] || 0}`);
console.log('\n题型分布:');
for (const t of TYPES) console.log(`  ${t.padEnd(12)} ${byType[t] || 0}`);

if (errors.length) {
  console.log(`\n发现 ${errors.length} 个问题:`);
  errors.forEach(e => console.log('  ✗ ' + e));
  process.exit(1);
} else {
  console.log('\n全部校验通过 ✓（字段完整、answer 合法、id 唯一、每章≥15、无重复选项）');
}
