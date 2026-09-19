/* ========================================
   templates.js - 代码评判 · 模板库数据

   模板来源（自动聚合，保持单一数据源，改 knowledge.js / codeExamples.js 后刷新即同步）：
   1. 起步骨架：读写输入输出的 main 骨架，评测题直接可用；
   2. 完整类模板：来自 data/codeExamples.js 的 CODE_EXAMPLES（顺序表 / 单链表 /
      排序合集 / BST / 图 / DP 六大完整类实现）；
   3. 知识库模板：data/knowledge.js 中所有带代码的知识点（46 个）——覆盖顺序表、
      单链表、多项式、顺序栈、链栈、表达式求值、循环队列、链式队列、优先级队列、
      BF/KMP 匹配、稀疏矩阵（三元组）、广义表、二叉树存储与遍历、线索二叉树、
      堆、邻接矩阵/邻接表、DFS/BFS、MST、最短路、拓扑排序、顺序/二分查找、
      BST、AVL、散列、并查集、八大排序、分治、LCS/LIS/背包/编辑距离等。

   注意：类 / 算法模板多数不含 main()，直接「运行」会链接失败；
   评测题请先选择题目加载题面模板，或配合「起步骨架」补写主程序。
   ======================================== */

const CODE_TEMPLATES = (() => {
  'use strict';

  // 章节 → 模板分类
  const CHAPTER_CATEGORY = {
    ch1: '基础概念',
    ch2: '线性表',
    ch3: '栈与队列',
    ch4: '串、数组与广义表',
    ch5: '树与二叉树',
    ch6: '图',
    ch7: '查找',
    ch8: '排序',
    ch9: '分治策略',
    ch10: '动态规划',
  };

  // 分类展示顺序
  const CATEGORY_ORDER = [
    '起步骨架',
    '完整类模板',
    '基础概念',
    '线性表',
    '栈与队列',
    '串、数组与广义表',
    '树与二叉树',
    '图',
    '查找',
    '排序',
    '分治策略',
    '动态规划',
  ];

  const templates = [];

  /* ────────── 1. 起步骨架（可直接编译运行的 main） ────────── */

  templates.push({
    id: 'tpl-blank-main',
    category: '起步骨架',
    title: 'C++ 起步骨架（空 main）',
    desc: '最小可编译运行骨架，从零写题从这里开始。',
    code: `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码

    return 0;
}`,
  });

  templates.push({
    id: 'tpl-read-array',
    category: '起步骨架',
    title: '读入数组 → 处理 → 输出',
    desc: '评测题最常用骨架：读 n 和 n 个整数，处理后空格分隔输出。',
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;          // 第一行：元素个数 n
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];   // 第二行：n 个整数

    // TODO: 在这里处理

    for (int i = 0; i < n; i++) {       // 结果按空格分隔输出
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << endl;
    return 0;
}`,
  });

  templates.push({
    id: 'tpl-read-string',
    category: '起步骨架',
    title: '逐串读入处理（串匹配类）',
    desc: '适合串匹配、表达式等以字符串为输入的题目。',
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    while (cin >> s) {      // 逐个读入空白分隔的串（如：主串 模式串）
        // TODO: 处理 s
        cout << s << endl;
    }
    return 0;
}`,
  });

  /* ────────── 2. 完整类模板（来自 codeExamples.js） ────────── */

  if (typeof CODE_EXAMPLES !== 'undefined') {
    Object.entries(CODE_EXAMPLES).forEach(([key, ex]) => {
      if (!ex || !ex.code) return;
      templates.push({
        id: 'tpl-ex-' + key,
        category: '完整类模板',
        title: ex.title || key,
        desc: '完整 C++ 类实现（来自课程代码示例），配合起步骨架的 main 使用。',
        code: ex.code,
      });
    });
  }

  /* ────────── 3. 知识库模板（来自 knowledge.js 带代码的知识点） ────────── */

  // 从 HTML 内容提取第一句作为简介
  function briefFrom(html) {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const m = text.match(/^(.{20,80}?[。；;!！？?])/);
    return m ? m[1] : text.slice(0, 60);
  }

  if (typeof KNOWLEDGE !== 'undefined') {
    Object.entries(KNOWLEDGE).forEach(([id, item]) => {
      if (!item || !item.code) return;
      const ch = id.split('-')[0];
      templates.push({
        id: 'tpl-' + id,
        category: CHAPTER_CATEGORY[ch] || '其他',
        title: item.title,
        desc: briefFrom(item.content),
        code: item.code,
        complexity: item.complexity || null,
        knowledgeId: id,     // 可一键跳转知识检索对应条目
      });
    });
  }

  // 按分类顺序 + 标题排序
  const orderOf = c => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  templates.sort((a, b) => orderOf(a.category) - orderOf(b.category) || a.title.localeCompare(b.title, 'zh'));

  function getById(id) {
    return templates.find(t => t.id === id) || null;
  }

  function categories() {
    const seen = [];
    templates.forEach(t => { if (!seen.includes(t.category)) seen.push(t.category); });
    return seen;
  }

  return { all: templates, getById, categories, CATEGORY_ORDER };
})();

window.CODE_TEMPLATES = CODE_TEMPLATES;
