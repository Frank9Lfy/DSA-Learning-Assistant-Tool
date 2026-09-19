/* ========================================
   validate-knowledge.js - 知识条目一致性校验
   运行：node tools/validate-knowledge.js
   校验内容：
   1. CHAPTERS 所有 children id 在 KNOWLEDGE 中都有条目；
   2. KNOWLEDGE 中没有 CHAPTERS 之外的“孤儿”条目；
   3. 每个条目的 related 引用的 id 都真实存在；
   4. 基本字段完整（title/content 非空，complexity 结构合法）。
   ======================================== */

const fs = require('fs');
const path = require('path');

function load(file, name) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf-8');
  const fn = new Function(src + '\nreturn ' + name + ';');
  return fn();
}

const CHAPTERS = load('chapters.js', 'CHAPTERS');
const KNOWLEDGE = load('knowledge.js', 'KNOWLEDGE');

let errors = 0;

// 1. 收集章节树的所有小节 id
const chapterIds = [];
CHAPTERS.forEach(ch =>
  ch.children.forEach(sec => chapterIds.push(sec.id))
);
const chapterIdSet = new Set(chapterIds);

// 2. KNOWLEDGE 的全部键
const knowledgeIds = Object.keys(KNOWLEDGE);
const knowledgeIdSet = new Set(knowledgeIds);

console.log('章节数：' + CHAPTERS.length);
console.log('章节小节总数：' + chapterIds.length);
console.log('KNOWLEDGE 条目总数：' + knowledgeIds.length);

// 3. 每个 chapters id 都有条目
chapterIds.forEach(id => {
  if (!knowledgeIdSet.has(id)) {
    console.error('[缺失] 章节小节 ' + id + ' 在 KNOWLEDGE 中没有条目');
    errors++;
  }
});

// 4. 没有孤儿条目
knowledgeIds.forEach(id => {
  if (!chapterIdSet.has(id)) {
    console.error('[孤儿] KNOWLEDGE 条目 ' + id + ' 不属于任何章节小节');
    errors++;
  }
});

// 5. related 引用与字段完整性
knowledgeIds.forEach(id => {
  const e = KNOWLEDGE[id];
  if (!e.title || !String(e.title).trim()) {
    console.error('[字段] ' + id + ' 缺少 title'); errors++;
  }
  if (!e.content || !String(e.content).trim()) {
    console.error('[字段] ' + id + ' 缺少 content'); errors++;
  }
  if (e.complexity !== null && e.complexity !== undefined) {
    if (typeof e.complexity !== 'object' ||
        !('time' in e.complexity) || !('space' in e.complexity)) {
      console.error('[字段] ' + id + ' complexity 应为 {time, space} 或 null'); errors++;
    }
  }
  (e.related || []).forEach(rid => {
    if (!knowledgeIdSet.has(rid)) {
      console.error('[引用] ' + id + ' 的 related 指向不存在的 id：' + rid);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log('校验通过：所有章节小节均有条目，related 引用与字段完整。');
  process.exit(0);
} else {
  console.error('共发现 ' + errors + ' 处问题。');
  process.exit(1);
}
