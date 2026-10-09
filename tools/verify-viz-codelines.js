/* ═══════════════════════════════════════════════════════════════
 * verify-viz-codelines.js — 右侧代码面板回归校验（常驻）
 *
 * 校验三件事：
 *  1. 每个提供代码片段的算法，其生成步骤的 codeLine 全部落在
 *     1..lines.length 范围内（0 = 无行号，允许，用于错误提示步骤）；
 *  2. 片段行宽 ≤ 46 字符（面板宽 340px，13px 等宽字体）；
 *  3. 关键步骤的行号映射抽查（防片段重排后行号错位）。
 * 运行：node tools/verify-viz-codelines.js
 * ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.window = {};
const base = path.join(__dirname, '..', 'js', 'modules', 'visualization', 'algorithms');
for (const f of ['sortViz.js', 'searchViz.js', 'graphViz.js', 'listViz.js', 'courseViz.js']) {
    vm.runInThisContext(fs.readFileSync(path.join(base, f), 'utf8'), { filename: f });
}
const SortViz = global.window.SortViz, SearchViz = global.window.SearchViz,
    GraphViz = global.window.GraphViz, ListViz = global.window.ListViz, CourseViz = global.window.CourseViz;

const lib = Object.assign({},
    SortViz.code, SearchViz.code, GraphViz.code, ListViz.code, CourseViz.code);

// 每个片段 key 生成步骤的入口（模拟 vizView.loadAlgorithm 的调用形态）
const gens = {
    'bubble-sort': () => SortViz.bubbleSort([5, 2, 8, 1, 9, 3]),
    'selection-sort': () => SortViz.selectionSort([5, 2, 8, 1, 9, 3]),
    'insertion-sort': () => SortViz.insertionSort([5, 2, 8, 1, 9, 3]),
    'merge-sort': () => SortViz.mergeSort([5, 2, 8, 1, 9, 3]),
    'quick-sort': () => SortViz.quickSort([5, 2, 8, 1, 9, 3]),
    'heap-sort': () => SortViz.heapSort([5, 2, 8, 1, 9, 3]),
    'linear-search': () => SearchViz.linearSearch([3, 9, 14, 27, 35, 48], 27),
    'binary-search': () => SearchViz.binarySearch([3, 9, 14, 27, 35, 48], 35),
    'kmp': () => SearchViz.kmp('acabaabaabcacaabc', 'abaabcac'),
    'graph-bfs': () => GraphViz.bfs([[0, 4, 2, 0], [4, 0, 1, 3], [2, 1, 0, 0], [0, 3, 0, 0]], 0),
    'graph-dfs': () => GraphViz.dfs([[0, 4, 2, 0], [4, 0, 1, 3], [2, 1, 0, 0], [0, 3, 0, 0]], 0),
    'graph-dijkstra': () => GraphViz.dijkstra([[0, 4, 2, 0], [4, 0, 1, 3], [2, 1, 0, 0], [0, 3, 0, 0]], 0),
    'list-insert': () => ListViz.listInsert([5, 8, 2, 9], 2, 7),
    'list-delete': () => ListViz.listDelete([5, 8, 2, 9], 3),
    'circular-queue': () => CourseViz.circularQueue(5),
    'infix-to-postfix': () => CourseViz.infixToPostfix('a+b*c-(d-e)'),
    'hanoi': () => CourseViz.hanoi(3),
    'bst-preorder': () => CourseViz.treeTraverse([5, 3, 8, 1, 9, 4], 'pre'),
    'bst-inorder': () => CourseViz.treeTraverse([5, 3, 8, 1, 9, 4], 'in'),
    'bst-postorder': () => CourseViz.treeTraverse([5, 3, 8, 1, 9, 4], 'post'),
    'heap-build': () => CourseViz.heapBuild([7, 3, 9, 1, 8, 2]),
    'heap-insert': () => CourseViz.heapInsert([7, 3, 9, 1, 8, 2]),
    'hash-probe': () => CourseViz.hashProbe([22, 41, 53, 46, 30], 11),
    'topo-sort': () => CourseViz.topoSort({ n: 6, edges: [{ u: 1, v: 2 }, { u: 1, v: 3 }, { u: 2, v: 4 }, { u: 3, v: 4 }, { u: 4, v: 5 }, { u: 5, v: 6 }] }),
    'dp-lcs': () => CourseViz.dpLCS('xyxxz', 'zxzyyz'),
    'dp-knapsack': () => CourseViz.dpKnapsack({ W: 5, items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }] }),
    'glist-build': () => CourseViz.glistBuild('(a,(b,c),d)'),
    'glist-depth': () => CourseViz.glistDepth('(a,(b,c),d)'),
    'glist-print': () => CourseViz.glistPrint('(a,(b,c),d)'),
};

let failures = 0;
const fail = (msg) => { failures++; console.log('  ✗ ' + msg); };

/* ① codeLine 全部在片段范围内 */
for (const key of Object.keys(lib)) {
    const spec = lib[key];
    const n = spec.lines.length;
    const gen = gens[key];
    if (typeof gen !== 'function') { fail(`${key}: 校验表缺少生成入口`); continue; }
    const steps = gen();
    if (!steps.length) { fail(`${key}: 未生成任何步骤`); continue; }
    const bad = steps.filter(s => s.codeLine !== 0 && s.codeLine !== undefined &&
        !(Number.isInteger(s.codeLine) && s.codeLine >= 1 && s.codeLine <= n));
    const noLine = steps.filter(s => !s.codeLine).length;
    if (bad.length) {
        fail(`${key}: ${bad.length} 步 codeLine 越界（片段共 ${n} 行）`);
        bad.slice(0, 3).forEach(s => console.log(`      codeLine=${s.codeLine} "${(s.description || '').slice(0, 40)}"`));
    }
    // 有行号的步骤占比（结构演示步骤允许无行号，但算法主体步骤必须有）
    const withLine = steps.length - noLine;
    if (withLine < Math.ceil(steps.length * 0.8)) {
        fail(`${key}: 仅 ${withLine}/${steps.length} 步带行号（<80%）`);
    }
    console.log(`✓ ${key.padEnd(18)} 片段 ${String(n).padStart(2)} 行 · 步骤 ${String(steps.length).padStart(3)} · 带行号 ${withLine}`);
}

/* ② 片段行宽 */
for (const key of Object.keys(lib)) {
    for (let i = 0; i < lib[key].lines.length; i++) {
        const w = lib[key].lines[i].length;
        if (w > 46) fail(`${key} 第 ${i + 1} 行过宽（${w} > 46 字符）`);
    }
}

/* ③ 关键行号映射抽查（片段重排会在这里暴露） */
const spot = (key, predicate, wantLine, label) => {
    const steps = gens[key]();
    const st = steps.find(predicate);
    if (!st) { fail(`${key}: 找不到抽查步骤「${label}」`); return; }
    if (st.codeLine !== wantLine) {
        fail(`${key}「${label}」行号 ${st.codeLine} ≠ 期望 ${wantLine}（第 ${st.codeLine} 行是「${lib[key].lines[st.codeLine - 1]}」，期望行是「${lib[key].lines[wantLine - 1]}」）`);
    } else {
        console.log(`✓ ${key}「${label}」→ 第 ${wantLine} 行 (${lib[key].lines[wantLine - 1].trim().slice(0, 34)})`);
    }
};
spot('quick-sort', s => /^选择基准元素 pivot/.test(s.description), 8, '选基准');
spot('quick-sort', s => /把它交换到左侧/.test(s.description), 13, '小于区交换');
spot('binary-search', s => /目标在右半部分/.test(s.description), 8, 'low=mid+1');
spot('kmp', s => /失配 → 查 next/.test(s.description), 18, '失配查next');
spot('graph-bfs', s => /加入队列$/.test(s.description) && /邻居/.test(s.description), 11, '邻居入队');
spot('graph-dijkstra', s => /前驱节点/.test(s.description), 8, '松弛更新');
spot('infix-to-postfix', s => /操作数 .* 直接进入输出区/.test(s.description), 4, '操作数直出');
spot('list-insert', s => /① 执行 s->next/.test(s.description), 7, '先接后继');
spot('list-insert', s => /② 执行 p->next = s/.test(s.description), 8, '再改前驱');
spot('circular-queue', s => /rear 后移/.test(s.description), 6, '入队rear后移');
spot('hanoi', s => /移到/.test(s.description) && /第 \d+ 步/.test(s.description), 4, 'move语句');
spot('bst-preorder', s => /弹出栈顶.*并立即访问/.test(s.description), 6, '弹出即访问');
spot('bst-inorder', s => /入栈，cur 走向左孩子/.test(s.description), 5, '左链入栈');
spot('bst-postorder', s => /第一次到栈顶/.test(s.description), 7, '置tag压孩子');
spot('heap-insert', s => /交换上浮/.test(s.description), 7, '上浮交换');
spot('hash-probe', s => /线性探测第/.test(s.description), 5, '向后探测');
spot('dp-lcs', s => /相等 →/.test(s.description), 7, '取左上+1');
spot('dp-knapsack', s => /装不下/.test(s.description), 5, '装不下');
spot('glist-build', s => /——原子 /.test(s.description), 8, '原子入链');
spot('glist-depth', s => /递归求其深度/.test(s.description), 7, '递归子表');
spot('glist-print', s => /本层扫描结束/.test(s.description), 10, '离开输出右括号');

console.log(failures === 0 ? '\n结果：全部通过' : `\n结果：${failures} 项未通过`);
process.exit(failures === 0 ? 0 : 1);
