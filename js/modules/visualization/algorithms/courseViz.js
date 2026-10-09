/* ============================================================
 * courseViz.js - 交互教学配套算法可视化合集
 *
 * 覆盖教学模块讲解的其余算法/数据结构操作：
 *   顺序表插入/删除、循环队列、中缀→后缀（栈）、汉诺塔（递归栈）、
 *   二叉树前/中/后序遍历（非递归栈过程）、筛选法建堆、堆插入（上滤）、
 *   哈夫曼树构造、AVL 插入与四种旋转、散列线性探测、拓扑排序、
 *   LCS / 0-1 背包 DP 填表、B 树插入与分裂、正交链表（十字链表）、
 *   广义表建立 / 求表头表尾 / 递归求深度 / 递归遍历打印
 *
 * 步骤通过 type_list 分发到本文件的轻量渲染器：
 *   'array'  通用数组格子（顺序表/队列/堆/散列/拓扑，支持指针标记与序列行）
 *   'expr'   表达式三行视图（输入串+指针 / 运算符栈 / 输出串）
 *   'hanoi'  汉诺塔三柱
 *   'dp'     DP 填表网格（LCS / 背包）
 *   'ctree'  通用二叉树（按结点 id 布局，支持 bf 标注；哈夫曼/AVL）
 *   'btree'  B 树多键结点分层布局
 *   'ortho'  正交链表（行链表 + 列链表双向箭头）
 *   'glist'  广义表（utype 三类结点 + tlink/hlink 指针）
 * ============================================================ */

const CourseViz = (() => {
    'use strict';

    const C = {
        blue: '#4a90d9', amber: '#f5a623', red: '#e74c3c', green: '#2ecc71',
        purple: '#9b59b6', gray: '#b9c2cc', empty: '#eef1f5',
        label: '#666666', sub: '#999999', text: '#333333'
    };

    /* ── 右侧代码面板配套片段（与各生成器步骤严格同构，key 与注册表一致） ── */
    const CODE = {
        'circular-queue': {
            title: '循环队列（牺牲一格法判满判空）',
            lines: [
                '// 队空: front == rear；队满: (rear+1)%k == front',
                'Status EnQueue(SqQueue Q, int x) {',
                '  if ((Q.rear + 1) % k == Q.front)',
                '    return ERROR;',
                '  Q.base[Q.rear] = x;',
                '  Q.rear = (Q.rear + 1) % k;',
                '  return OK;',
                '}',
                'Status DeQueue(SqQueue Q) {',
                '  if (Q.front == Q.rear)',
                '    return ERROR;',
                '  x = Q.base[Q.front];',
                '  Q.front = (Q.front + 1) % k;',
                '  return OK;',
                '}',
            ],
        },
        'infix-to-postfix': {
            title: '中缀转后缀（运算符栈法）',
            lines: [
                'void infixToPostfix(char E[]) {',
                '  for (读入的每个字符 ch) {',
                '    if (ch 是操作数)',
                '      直接输出 ch;',
                '    else if (ch == \'(\')',
                '      Push(OPTR, ch);',
                '    else if (ch == \')\') {',
                '      while (栈顶 != \'(\') 输出 Pop();',
                '      Pop();              // 弃 \'(\'',
                '    } else {               // 运算符',
                '      while (栈不空 && 优先级(栈顶) >= 优先级(ch))',
                '        输出 Pop();',
                '      Push(OPTR, ch);',
                '    }',
                '  }',
                '  while (栈不空) 输出 Pop();',
                '}',
            ],
        },
        'hanoi': {
            title: '汉诺塔（递归分解：n-1 + 1 + n-1）',
            lines: [
                'void hanoi(int n, char A, char B, char C) {',
                '  if (n == 0) return;',
                '  hanoi(n - 1, A, C, B);   // 上面 n-1 个: A→B',
                '  move(A, C);              // 最大盘: A→C',
                '  hanoi(n - 1, B, A, C);   // n-1 个: B→C',
                '}',
            ],
        },
        'bst-preorder': {
            title: '先序遍历（非递归：弹出即访问）',
            lines: [
                'void preorder(TreeNode root) {',
                '  Stack<TreeNode> S;',
                '  S.push(root);',
                '  while (!S.empty()) {',
                '    TreeNode node = S.pop();',
                '    visit(node);            // 根最先',
                '    if (node.right != null)',
                '      S.push(node.right);   // 先压右',
                '    if (node.left != null)',
                '      S.push(node.left);    // 再压左',
                '  }',
                '}',
            ],
        },
        'bst-inorder': {
            title: '中序遍历（非递归：左链入栈）',
            lines: [
                'void inorder(TreeNode root) {',
                '  TreeNode cur = root;',
                '  while (cur != null || !S.empty()) {',
                '    while (cur != null) {   // 左链一路入栈',
                '      S.push(cur);',
                '      cur = cur.left;',
                '    }',
                '    TreeNode node = S.pop();',
                '    visit(node);            // 左路到头才访问',
                '    cur = node.right;      // 转右子树',
                '  }',
                '}',
            ],
        },
        'bst-postorder': {
            title: '后序遍历（非递归：tag 标记二次到顶）',
            lines: [
                'void postorder(TreeNode root) {',
                '  // 栈元素 (node, tag)，tag 标记是否到过栈顶',
                '  S.push({root, false});',
                '  while (!S.empty()) {',
                '    top = S.top();',
                '    if (!top.tag) {         // 第一次到栈顶',
                '      top.tag = true;      // 暂不访问',
                '      if (top.node.right != null)',
                '        S.push({右孩子, false});',
                '      if (top.node.left != null)',
                '        S.push({左孩子, false});',
                '    } else {                // 第二次到栈顶',
                '      node = S.pop();',
                '      visit(node);          // 左右完成后访问',
                '    }',
                '  }',
                '}',
            ],
        },
        'heap-build': {
            title: '筛选法建堆（自底向上，最小堆）',
            lines: [
                'void buildMinHeap(int a[], int n) {',
                '  for (int i = n / 2 - 1; i >= 0; i--)',
                '    siftDown(a, i, n);   // 最后非叶结点起',
                '}',
                'void siftDown(int a[], int i, int n) {',
                '  while (2 * i + 1 < n) {',
                '    small = 左右孩子中较小者;',
                '    if (a[small] < a[i]) {',
                '      swap(a[i], a[small]); // 下沉',
                '      i = small;            // 继续向下',
                '    } else break;           // 父小则就位',
                '  }',
                '}',
            ],
        },
        'heap-insert': {
            title: '堆插入（上滤：与父比较逐层上浮）',
            lines: [
                'void heapInsert(int a[], int n, int x) {',
                '  a[n] = x;              // 放到堆尾',
                '  int i = n; n++;',
                '  while (i > 0) {',
                '    int p = (i - 1) / 2; // 父结点下标',
                '    if (a[i] < a[p]) {',
                '      swap(a[i], a[p]);  // 比父小，上浮',
                '      i = p;',
                '    } else break;        // 不小于父，就位',
                '  }',
                '}',
            ],
        },
        'hash-probe': {
            title: '散列线性探测（Hi = (H+i) % m）',
            lines: [
                '// H(key) = key % m；冲突时线性探测',
                'void insertHash(int HT[], int m, int key) {',
                '  int h = key % m, i = 0;',
                '  while (HT[(h + i) % m] != NULL)',
                '    i++;                  // 被占，向后一格',
                '  HT[(h + i) % m] = key;  // 空位落位',
                '}',
            ],
        },
        'topo-sort': {
            title: '拓扑排序（反复取入度 0 顶点）',
            lines: [
                'void topoSort(Graph G) {',
                '  // 初始化各顶点入度 indeg[]',
                '  for (int i = 0; i < n; i++) {',
                '    取入度为 0 且未输出的顶点 v;',
                '    output(v);             // 输出 v',
                '    for (v 的每条出边 (v, w))',
                '      if (--indeg[w] == 0) w 可输出;',
                '  }',
                '  已输出数 < n ? 有回路 : 成功;',
                '}',
            ],
        },
        'dp-lcs': {
            title: '最长公共子序列（双串填表）',
            lines: [
                '// dp[i][j]: X前i个与Y前j个的 LCS 长度',
                'for (int i = 0; i <= m; i++)',
                '  for (int j = 0; j <= n; j++) {',
                '    if (i == 0 || j == 0)',
                '      dp[i][j] = 0;            // 边界',
                '    else if (X[i-1] == Y[j-1])',
                '      dp[i][j] = dp[i-1][j-1] + 1; // ↖',
                '    else',
                '      dp[i][j] = max(dp[i-1][j],',
                '                    dp[i][j-1]); // ↑←',
                '  }',
                '// LCS 长度 = dp[m][n]',
            ],
        },
        'dp-knapsack': {
            title: '0-1 背包（二维填表，选/不选取大）',
            lines: [
                '// dp[i][j]: 前 i 件、容量 j 的最大价值',
                'for (j = 0; j <= W; j++) dp[0][j] = 0;',
                'for (int i = 1; i <= n; i++)',
                '  for (int j = 0; j <= W; j++) {',
                '    dp[i][j] = dp[i-1][j];    // 不选',
                '    if (j >= w[i]) {',
                '      take = dp[i-1][j-w[i]] + v[i];',
                '      if (take > dp[i][j])',
                '        dp[i][j] = take;      // 选更优',
                '    }',
                '  }',
                '// 最大价值 = dp[n][W]',
            ],
        },
        'glist-build': {
            title: '广义表建立（utype 三类结点 + tlink 链）',
            lines: [
                '// 表头 utype=0 / 原子=1 / 子表=2；tlink 同层链',
                'GList create(元素序列 S) {',
                '  建立本层表头结点 hp;',
                '  tail = hp;',
                '  for (S 中的每个元素 e) {',
                '    if (e 是原子) {',
                '      p = 新原子结点(utype=1, 值 e);',
                '      tail->tlink = p; tail = p;',
                '    } else {              // e 是子表',
                '      p = 新子表结点(utype=2);',
                '      tail->tlink = p; tail = p;',
                '      p->hlink = create(e); // 递归建子表',
                '    }',
                '  }',
                '  return hp;',
                '}',
            ],
        },
        'glist-depth': {
            title: '广义表递归求深度（1 + max 子表深度）',
            lines: [
                'int depth(GList L) {',
                '  if (L 是空表) return 1;    // 空表深度 1',
                '  int m = 0;',
                '  for (p = L 首元素; p; p = p->tlink) {',
                '    if (p->utype == 原子)',
                '      continue;             // 原子深度 0',
                '    int d = depth(p->hlink); // 递归子表',
                '    if (d > m) m = d;       // 记录最大',
                '  }',
                '  return m + 1;             // 本层+最深子表',
                '}',
            ],
        },
        'glist-print': {
            title: '广义表递归打印（建立的逆过程）',
            lines: [
                'void printGList(GList L) {',
                '  printf("(");',
                '  for (p = L 首元素; p; p = p->tlink) {',
                '    if (不是首个元素) printf(",");',
                '    if (p->utype == 原子)',
                '      printf(p->value);    // 输出原子值',
                '    else',
                '      printGList(p->hlink); // 递归进子表',
                '  }',
                '  printf(")");',
                '}',
            ],
        },
    };

    /* ══════════════════════ 通用工具 ══════════════════════ */

    function mkArrayStep(cells, pointers, description, extra) {
        return Object.assign({
            type_list: 'array',
            cells: cells,          // [{text, color, sub?}] 或字符串（默认蓝）
            pointers: pointers || {},   // { 下标: '标签' }
            seq: null,             // 底部序列文字（如遍历输出）
            description: description
        }, extra || {});
    }

    const cell = (text, color, sub) => ({ text: String(text), color: color || C.blue, sub: sub });

    function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

    /* ══════════════════════ 顺序表插入/删除 ══════════════════════ */

    function arrayInsert(arr, pos, val) {
        const a = arr.slice();
        const steps = [];
        const cells = () => a.map((v, i) => cell(v, i === pos ? C.amber : C.blue));
        steps.push(mkArrayStep(cells(), { pos: '插入位置' },
            `顺序表插入：在下标 ${pos} 处插入 ${val}。顺序表需要整体后移腾出空位，时间 O(n)`));
        // 从最后一个元素开始逐个后移
        for (let i = a.length - 1; i >= pos; i--) {
            a[i + 1] = a[i];
            const cs = a.map((v, k) => cell(k > a.length ? '' : v,
                k === i ? C.red : (k === i + 1 ? C.red : (k === pos ? C.amber : C.blue))));
            steps.push(mkArrayStep(cs, { [i]: '后移', pos: '插入位置' },
                `元素 ${a[i]}（原下标 ${i}）后移到下标 ${i + 1}（从尾部开始移，避免覆盖）`));
        }
        a[pos] = val;
        steps.push(mkArrayStep(a.map((v, i) => cell(v, i === pos ? C.green : C.blue)), { pos: '新元素' },
            `将 ${val} 放入下标 ${pos}，插入完成，表长变为 ${a.length}`));
        return steps;
    }

    function arrayDelete(arr, pos) {
        const orig = arr.slice();
        const n = orig.length;
        const removed = orig[pos];
        const steps = [];
        // 视图状态：前 k 个空位已被填补
        const view = (k, hl) => orig.map((v, i) => {
            let text, color;
            if (i < pos) { text = v; color = hl && hl[i] ? hl[i] : C.green; }
            else if (i <= pos + k - 1 && pos + k <= n - 1) { text = orig[i + 1]; color = hl && hl[i] ? hl[i] : C.green; }
            else if (pos + k >= n - 1 && i === n - 1) { text = ''; color = C.empty; }
            else { text = v; color = hl && hl[i] ? hl[i] : C.blue; }
            return cell(text, color);
        });

        steps.push(mkArrayStep(view(0, { [pos]: C.amber }), { [pos]: '删除' },
            `顺序表删除：删除下标 ${pos} 处的元素 ${removed}。后续元素需整体前移填补空位，时间 O(n)`));
        let k = 0;
        for (let i = pos; i < n - 1; i++) {
            k++;
            steps.push(mkArrayStep(view(k, { [i]: C.red }), { [i]: '前移' },
                `元素 ${orig[i + 1]}（原下标 ${i + 1}）前移到下标 ${i}，填补空位`));
        }
        steps.push(mkArrayStep(view(k, { [pos]: C.green }), {},
            `删除完成：${removed} 已移出，表长变为 ${n - 1}`));
        return steps;
    }

    /* ══════════════════════ 循环队列 ══════════════════════ */

    function circularQueue(k) {
        k = Math.max(3, Math.min(8, k | 0 || 4));
        const que = new Array(k).fill(null);
        let front = 0, rear = 0;
        const steps = [];
        const view = () => que.map((v, i) => v === null ? cell(' ', C.empty) : cell(v, C.blue));
        const ptrs = () => { const p = {}; p[front] = 'front'; p[rear] = 'rear'; return p; };

        steps.push(mkArrayStep(view(), ptrs(),
            `循环队列（容量 ${k}，牺牲一个单元法最多存 ${k - 1} 个）。队空：front == rear；队满：(rear+1) % ${k} == front`,
            { codeLine: 1 }));

        // 一组覆盖 判满/判空/回绕 的操作序列
        const ops = [
            { op: 'E', v: 11 }, { op: 'E', v: 22 }, { op: 'E', v: 33 },
            { op: 'E', v: 44 }, { op: 'D' }, { op: 'E', v: 44 },
            { op: 'E', v: 55 }, { op: 'D' }, { op: 'D' }, { op: 'D' }, { op: 'D' }
        ];
        let seqOut = [];
        for (const o of ops) {
            if (o.op === 'E') {
                if ((rear + 1) % k === front) {
                    steps.push(mkArrayStep(view(), ptrs(),
                        `入队 ${o.v}：(rear+1) % ${k} = ${(rear + 1) % k} == front → 队满，入队失败（牺牲一格用于区分队空/队满）`,
                        { codeLine: 4 }));
                    continue;
                }
                que[rear] = o.v;
                const at = rear;
                rear = (rear + 1) % k;
                steps.push(mkArrayStep(view(), ptrs(),
                    `入队 ${o.v}：存入下标 ${at}，rear 后移 rear = (rear+1) % ${k} = ${rear}${rear === 0 ? '（回绕到开头！）' : ''}`,
                    { codeLine: 6 }));
            } else {
                if (front === rear) {
                    steps.push(mkArrayStep(view(), ptrs(),
                        `出队：front == rear → 队空，出队失败`,
                        { codeLine: 11 }));
                    continue;
                }
                const x = que[front];
                que[front] = null;
                const at = front;
                front = (front + 1) % k;
                seqOut.push(x);
                steps.push(mkArrayStep(view(), ptrs(),
                    `出队：取走下标 ${at} 的 ${x}，front 后移 front = (front+1) % ${k} = ${front}${front === 0 ? '（回绕到开头！）' : ''}`,
                    { seq: '出队序列: [' + seqOut.join(', ') + ']', codeLine: 13 }));
            }
        }
        steps.push(mkArrayStep(view(), ptrs(),
            `演示结束。观察 front/rear 如何在数组上循环回绕：指针始终 = (旧值+1) % ${k}`,
            { seq: '出队序列: [' + seqOut.join(', ') + ']', codeLine: 15 }));
        return steps;
    }

    /* ══════════════════════ 中缀 → 后缀（栈） ══════════════════════ */

    const OP_PRIORITY = { '+': 1, '-': 1, '*': 2, '/': 2 };

    function infixToPostfix(expr) {
        const tokens = String(expr).replace(/\s+/g, '').split('');
        const steps = [];
        const stack = [];
        let output = [];
        let i = 0;

        const snap = (description, extra) => steps.push(Object.assign({
            type_list: 'expr',
            tokens: tokens.map((ch, idx) => ({ ch: ch, state: idx < i ? 'done' : idx === i ? 'cur' : 'wait' })),
            stack: stack.slice(),
            output: output.slice(),
            description: description
        }, extra || {}));

        snap('中缀 → 后缀：操作数直接输出；运算符按优先级入栈/弹栈；括号用于改变优先级。按课件双栈法（这里只需一个运算符栈）',
            { codeLine: 1 });

        let bad = null;
        for (i = 0; i < tokens.length; i++) {
            const ch = tokens[i];
            if (/[a-zA-Z0-9]/.test(ch)) {
                output.push(ch);
                snap(`操作数 '${ch}' 直接进入输出区`, { codeLine: 4 });
            } else if (ch === '(') {
                stack.push(ch);
                snap(`'(' 入栈（左括号在栈内优先级最低，只配对右括号时才弹出）`, { codeLine: 6 });
            } else if (ch === ')') {
                let popped = null;
                while (stack.length && stack[stack.length - 1] !== '(') {
                    popped = stack.pop();
                    output.push(popped);
                    snap(`')' 触发连续弹栈：'${popped}' 进入输出区`, { codeLine: 8 });
                }
                if (stack.length) { stack.pop(); snap(`弹出 '(' 丢弃（括号配对完成，括号本身不进入输出）`, { codeLine: 9 }); }
                else { bad = '括号不匹配：多余右括号'; break; }
            } else if (OP_PRIORITY[ch]) {
                while (stack.length && OP_PRIORITY[stack[stack.length - 1]] && OP_PRIORITY[stack[stack.length - 1]] >= OP_PRIORITY[ch]) {
                    const p = stack.pop();
                    output.push(p);
                    snap(`栈顶 '${p}' 优先级 ≥ '${ch}'，弹出进入输出区（同级从左到右计算）`, { codeLine: 12 });
                }
                stack.push(ch);
                snap(`'${ch}' 入栈`, { codeLine: 13 });
            } else {
                bad = '存在无法识别的字符：' + ch;
                break;
            }
        }
        if (!bad) {
            while (stack.length) {
                const p = stack.pop();
                if (p === '(') { bad = '括号不匹配：多余左括号'; break; }
                output.push(p);
                snap(`输入结束，弹出栈中剩余运算符：'${p}' 进入输出区`, { codeLine: 16 });
            }
        }
        if (bad) {
            snap('✗ ' + bad);
        } else {
            steps.push(Object.assign(steps.pop(), {
                description: `转换完成！后缀表达式：${output.join(' ')}（求值时从左到右扫一遍，遇运算符弹两个操作数即可，无需括号）`
            }));
            snap('—— 结束 ——');
        }
        return steps;
    }

    /* ══════════════════════ 汉诺塔 ══════════════════════ */

    function hanoi(n) {
        n = Math.max(3, Math.min(6, n | 0 || 4));
        const pegs = [[], [], []];
        for (let d = n; d >= 1; d--) pegs[0].push(d);
        const names = ['A', 'B', 'C'];
        const steps = [];
        let moveNo = 0;

        const snap = (from, to, disk, msg, codeLine) => steps.push({
            type_list: 'hanoi',
            pegs: clone(pegs),
            moved: disk || null,
            movedFrom: from,
            n: n,
            codeLine: codeLine || 0,
            description: msg
        });

        snap(null, null, null, `汉诺塔：把 ${n} 个盘子从 A 柱移到 C 柱。递归思路：先把上面 n-1 个移到 B（借助 C），再把最大盘移到 C，最后把 n-1 个从 B 移到 C（借助 A）。共需 2^n - 1 = ${Math.pow(2, n) - 1} 次移动`, 1);

        function solve(k, from, to, via, depth) {
            if (k === 0) return;
            solve(k - 1, from, via, to, depth + 1);
            const disk = pegs[from].pop();
            pegs[to].push(disk);
            moveNo++;
            snap(from, to, disk,
                `第 ${moveNo} 步：盘 ${disk} 从 ${names[from]} 移到 ${names[to]}（递归深度 ${depth}，这一层负责移动最大的 ${k} 个盘）`, 4);
            solve(k - 1, via, to, from, depth + 1);
        }
        solve(n, 0, 2, 1, 0);
        return steps;
    }

    /* ══════════════════════ 二叉树遍历（非递归栈过程） ══════════════════════ */

    function buildBST(values) {
        let root = null;
        const nodeOf = (v) => ({ id: 'n' + v + '_' + Math.random().toString(36).slice(2, 6), label: String(v), key: v, left: null, right: null });
        for (const v of values) {
            const nn = nodeOf(v);
            if (!root) { root = nn; continue; }
            let cur = root;
            while (true) {
                if (v < cur.key) { if (!cur.left) { cur.left = nn; break; } cur = cur.left; }
                else if (v > cur.key) { if (!cur.right) { cur.right = nn; break; } cur = cur.right; }
                else break; // 重复跳过
            }
        }
        return root;
    }

    /**
     * 非递归遍历（与教学演示一致），树快照 + 栈状态写入描述
     * order: 'pre' | 'in' | 'post'
     */
    function treeTraverse(values, order) {
        const root = buildBST(values);
        const steps = [];
        const orderNames = { pre: '前序遍历（根-左-右）', in: '中序遍历（左-根-右）', post: '后序遍历（左-右-根，需借助标记）' };
        const visited = [];
        const highlightVisited = (extra) => {
            const h = {};
            for (const v of visited) h[v.id] = C.green;
            if (extra) for (const k in extra) h[k] = extra[k];
            return h;
        };
        const snap = (desc, extraHl, codeLine) => steps.push({
            type_list: 'ctree',
            root: clone(root),
            highlights: highlightVisited(extraHl),
            seq: '输出: [' + visited.map(v => v.label).join(', ') + ']',
            codeLine: codeLine || 0,
            description: desc
        });

        const stackText = (labels) => labels.length > 0
            ? `（栈 底→顶: [${labels.join(', ')}]）`
            : '（栈已空）';

        if (order === 'pre') {
            const st = [];
            if (root) st.push(root);
            snap(`非递归${orderNames.pre}：根${root ? ' ' + root.label : ''} 入栈${stackText(root ? [root.label] : [])}。规则：弹出即访问（根最先输出），访问后先压右孩子、再压左孩子`, null, 3);
            while (st.length) {
                const node = st.pop();
                visited.push(node);
                snap(`弹出栈顶 ${node.label} 并立即访问${stackText(st.map(s => s.label))}` + (node.left || node.right
                    ? `；随后先压右孩子${node.right ? ' ' + node.right.label : '（无）'}、再压左孩子${node.left ? ' ' + node.left.label : '（无）'}——栈后进先出，左子树会先被处理`
                    : '（叶结点，无孩子可压）'),
                    { [node.id]: C.amber, ...(node.right ? { [node.right.id]: C.blue } : {}), ...(node.left ? { [node.left.id]: C.blue } : {}) }, 6);
                if (node.right) st.push(node.right);
                if (node.left) st.push(node.left);
                if (st.length) snap(`孩子已入栈，栈顶是 ${st[st.length - 1].label}，下一轮先处理它${stackText(st.map(s => s.label))}`, null, 10);
            }
        } else if (order === 'in') {
            const st = [];
            let cur = root;
            snap(`非递归${orderNames.in}：指针 cur 从根${root ? ' ' + root.label : ''}出发。规则：cur 沿左链一路入栈；左路走到底后弹出栈顶访问，再转入它的右子树，重复同样过程`, null, 2);
            while (cur || st.length) {
                while (cur) {
                    st.push(cur);
                    snap(`${cur.label} 入栈，cur 走向左孩子` + (cur.left ? ` ${cur.left.label}` : '（无左孩子，左路到头）') + stackText(st.map(s => s.label)),
                        { [cur.id]: C.purple }, 5);
                    cur = cur.left;
                }
                const node = st.pop();
                visited.push(node);
                snap(`左路到头，弹出栈顶 ${node.label} 并访问（中序：左子树全部完成后才轮到根）${stackText(st.map(s => s.label))}，cur 转向其右子树` + (node.right ? ` ${node.right.label}` : '（无右孩子，继续弹栈）'),
                    { [node.id]: C.amber }, 9);
                cur = node.right;
            }
        } else {
            // 后序（左-右-根）：栈元素 (结点, tag) 标记法。结点只入栈一次：
            // 第一次出现在栈顶 → 原地置 tag=true 并压入右、左孩子（本结点暂不出栈）；
            // 第二次出现在栈顶（左右子树都已完成）→ 弹出访问
            const st = [];
            const stText = () => stackText(st.map(e => e.node.label + (e.tag ? '*' : '')));
            if (root) st.push({ node: root, tag: false });
            snap(`非递归${orderNames.post}：栈元素带标记 tag（下方栈快照中 * 表示 tag=true）。第一次出现在栈顶：置 tag 并把右、左孩子压栈，本结点暂不出栈；第二次出现在栈顶（左右子树都完成）才弹出访问`, null, 3);
            while (st.length) {
                const top = st[st.length - 1];
                if (!top.tag) {
                    top.tag = true;
                    const n = top.node;
                    if (n.right) st.push({ node: n.right, tag: false });
                    if (n.left) st.push({ node: n.left, tag: false });
                    if (n.left || n.right) snap(`${n.label} 第一次到栈顶：暂不访问（后序要等左右子树全部完成），置 tag=true，先压右孩子${n.right ? ' ' + n.right.label : ''}、再压左孩子${n.left ? ' ' + n.left.label : ''}（左孩子在栈顶，左子树先完成）${stText()}`,
                        { [n.id]: C.purple }, 7);
                } else {
                    const node = st.pop().node;
                    visited.push(node);
                    snap(node.left || node.right
                        ? `${node.label} 第二次出现在栈顶（tag=true，左右子树已完成），弹出并访问${stText()}`
                        : `叶结点 ${node.label} 无孩子，弹出并直接访问${stText()}`,
                        { [node.id]: C.amber }, 14);
                }
            }
        }
        // 三个 order 的代码片段行数不同，收尾步骤各自取对应结束行
        const endLine = { pre: 12, in: 12, post: 17 };
        snap(`${orderNames[order]} 完成！输出: [${visited.map(v => v.label).join(', ')}]`, null, endLine[order] || 0);
        return steps;
    }

    /* ══════════════════════ 堆：筛选建堆 / 插入上滤 ══════════════════════ */

    function heapBuild(arr) {
        const a = arr.slice();
        const n = a.length;
        const steps = [];
        const view = (hl) => a.map((v, i) => cell(v, hl && hl[i] ? hl[i] : C.blue));

        steps.push(mkArrayStep(view(), {},
            `筛选法建堆（最小堆）：从最后一个非叶结点 i = ⌊n/2⌋ - 1 = ${Math.floor(n / 2) - 1} 开始，依次向前对每个结点执行 siftDown（数组即完全二叉树的层序存储）`,
            { codeLine: 2 }));

        let compares = 0, swaps = 0;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            let cur = i;
            steps.push(mkArrayStep(view({ [cur]: C.amber }), { [cur]: 'siftDown' },
                `对下标 ${cur}（值 ${a[cur]}）执行 siftDown：与左右孩子中较小者比较`,
                { codeLine: 3 }));
            while (2 * cur + 1 < n) {
                const l = 2 * cur + 1, r = l + 1;
                let small = l;
                if (r < n && a[r] < a[l]) small = r;
                compares++;
                if (a[small] < a[cur]) {
                    steps.push(mkArrayStep(view({ [cur]: C.amber, [small]: C.red }), { [cur]: '父', [small]: '较小孩子' },
                        `孩子 ${a[small]}（下标 ${small}）< 父 ${a[cur]}（下标 ${cur}），交换（第 ${compares} 次比较）`,
                        { codeLine: 9 }));
                    const t = a[cur]; a[cur] = a[small]; a[small] = t;
                    swaps++;
                    cur = small;
                    steps.push(mkArrayStep(view({ [cur]: C.amber }), { [cur]: '继续下沉' },
                        `交换后继续从下标 ${cur} 向下筛查`,
                        { codeLine: 10 }));
                } else {
                    steps.push(mkArrayStep(view({ [cur]: C.green }), { [cur]: '已就位' },
                        `父 ${a[cur]} ≤ 较小孩子 ${a[small]}，无需调整，siftDown 结束`,
                        { codeLine: 11 }));
                    break;
                }
            }
        }
        steps.push(mkArrayStep(view({ 0: C.green }), {},
            `建堆完成！共 ${compares} 次比较、${swaps} 次交换。筛选法建堆总时间 O(n)（逐个插入建堆为 O(n log n)）`,
            { codeLine: 13 }));
        return steps;
    }

    function heapInsert(arr) {
        // 前缀先用筛选法建成最小堆（保证演示基座是合法堆，末步才可宣称“堆性质保持”），
        // 再把最后一个值作为新元素插入，演示上滤过程
        const heap = arr.slice(0, Math.max(2, arr.length - 1));
        const n0 = heap.length;
        for (let i = Math.floor(n0 / 2) - 1; i >= 0; i--) {
            let cur = i;
            while (2 * cur + 1 < n0) {
                const l = 2 * cur + 1, r = l + 1;
                let small = l;
                if (r < n0 && heap[r] < heap[l]) small = r;
                if (heap[small] < heap[cur]) {
                    const t = heap[cur]; heap[cur] = heap[small]; heap[small] = t;
                    cur = small;
                } else break;
            }
        }
        const val = arr[arr.length - 1];
        const a = heap.concat([val]);
        const n = a.length;
        const steps = [];
        const view = (hl) => a.map((v, i) => cell(v, hl && hl[i] ? hl[i] : C.blue));

        steps.push(mkArrayStep(view({ [n - 1]: C.amber }), { [n - 1]: '新元素' },
            `堆插入（上滤）：前 ${n0} 个元素已构成最小堆（任一父结点 ≤ 孩子）。新元素 ${val} 先放到堆尾下标 ${n - 1}，再与父结点（下标 ⌊(i-1)/2⌋）比较：比父小就逐层上浮`,
            { codeLine: 2 }));
        let i = n - 1;
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (a[i] < a[p]) {
                const t = a[i]; a[i] = a[p]; a[p] = t;
                steps.push(mkArrayStep(view({ [i]: C.green, [p]: C.red }), { [i]: '↑', [p]: '↑' },
                    `${t} < 父 ${a[i]}，交换上浮：${t} 现在位于下标 ${p}`,
                    { codeLine: 7 }));
                i = p;
            } else {
                steps.push(mkArrayStep(view({ [i]: C.green, [p]: C.blue }), { [i]: '新位置' },
                    `${a[i]} ≥ 父 ${a[p]}，不再上浮，上滤结束`,
                    { codeLine: 9 }));
                break;
            }
        }
        steps.push(mkArrayStep(a.map(v => cell(v, C.green)), {},
            `插入完成，最小堆性质保持。上滤最多走树高 ⌈log₂n⌉ 步，时间 O(log n)`,
            { codeLine: 11 }));
        return steps;
    }

    /* ══════════════════════ 通用二叉树（id 布局）：哈夫曼 / AVL ══════════════════════ */

    function layoutTree(root) {
        const nodes = [], edges = [];
        const wCache = new Map();
        function width(nd) {
            if (!nd) return 0;
            if (!nd.left && !nd.right) { wCache.set(nd.id, 1); return 1; }
            const w = Math.max(1, width(nd.left) + width(nd.right));
            wCache.set(nd.id, w);
            return w;
        }
        width(root);
        function assign(nd, depth, xLeft) {
            if (!nd) return;
            const w = wCache.get(nd.id) || 1;
            nodes.push({ nd: nd, depth: depth, x: xLeft + w / 2 });
            if (nd.left) { edges.push([nd.id, nd.left.id]); assign(nd.left, depth + 1, xLeft); }
            // 右子树起点 = xLeft + 左子树宽（宽表按 id 存取——传结点对象永远查不到，
            // 兜底 1 会让宽左子树与右子树重叠，哈夫曼/AVL 上曾出现两结点完全重合）
            if (nd.right) { edges.push([nd.id, nd.right.id]); assign(nd.right, depth + 1, xLeft + (nd.left ? (wCache.get(nd.left.id) || 1) : 0)); }
        }
        assign(root, 0, 0);
        return { nodes: nodes, edges: edges };
    }

    function renderCTree(renderer, step) {
        if (!step.root) { renderer.drawText('（空树）', renderer.width / 2, renderer.height / 2, C.sub, 14); return; }
        const layout = layoutTree(step.root);
        const pad = { t: 46, b: 56, l: 30, r: 30 };
        const maxDepth = Math.max(...layout.nodes.map(n => n.depth), 0);
        const totalW = Math.max(...layout.nodes.map(n => n.x)) + 0.5;
        // 层距决定半径上限：退化单链树全部结点纵向下沉到各自层，
        // 若只按宽度定半径，矮画布上相邻层圆会相切重叠（截图反馈的问题）
        const levelH = (renderer.height - pad.t - pad.b) / Math.max(maxDepth, 1);
        const r = Math.min(
            24,
            Math.max(12, (renderer.width - 60) / Math.max(layout.nodes.length, 1) / 2.2),
            Math.max(9, levelH * 0.42)
        );
        const pos = {};
        for (const n of layout.nodes) pos[n.nd.id] = { x: pad.l + (n.x / totalW) * (renderer.width - pad.l - pad.r), y: pad.t + (n.depth / Math.max(maxDepth, 1)) * (renderer.height - pad.t - pad.b) };
        for (const [fa, ch] of layout.edges) {
            // 连线端点跟随半径（不再写死 14px），小圆时线头不会露在圆外
            if (pos[fa] && pos[ch]) renderer.drawLine(pos[fa].x, pos[fa].y + r * 0.6, pos[ch].x, pos[ch].y - r * 0.6, '#cccccc', 2);
        }
        for (const n of layout.nodes) {
            const p = pos[n.nd.id];
            const color = (step.highlights && step.highlights[n.nd.id]) || C.blue;
            renderer.drawCircle(p.x, p.y, r, color, n.nd.label);
            if (n.nd.sub) renderer.drawText(n.nd.sub, p.x, p.y + r + 9, C.sub, 10);
        }
        if (step.seq) renderer.drawText(step.seq, renderer.width / 2, renderer.height - 22, '#555555', 20);
    }

    function huffman(weights) {
        const ws = weights.slice(0, 12);
        const steps = [];
        if (ws.length < 2) {
            steps.push({ type_list: 'array', cells: ws.map(w => cell(w)), pointers: {}, description: '至少需要 2 个权值才能构造哈夫曼树' });
            return steps;
        }
        // 森林：每棵树 {id,label,sub,left,right}，用 w 值构造
        let uid = 0;
        const newNode = (label, w, left, right) => ({ id: 'h' + (uid++), label: String(label), w: w, left: left || null, right: right || null });
        let forest = ws.map(w => newNode(w, w));
        let wpl = 0;
        const forestCells = (hl) => forest.map((t, i) => cell(t.w, hl && hl.includes(i) ? C.red : C.blue, '权'));
        steps.push(mkArrayStep(forestCells(), {},
            `哈夫曼树构造：${ws.length} 个权值各自成单结点树。每步取权值最小的两棵树合并（新根权 = 两者之和），直到只剩一棵——即 WPL 最优二叉树`));

        const treeSnap = (root, desc, hl) => steps.push({
            type_list: 'ctree', root: clone(root), highlights: hl || {}, description: desc
        });

        while (forest.length > 1) {
            forest.sort((a, b) => a.w - b.w);
            const a = forest.shift(), b = forest.shift();
            const merged = newNode(a.w + b.w, a.w + b.w, a, b);
            wpl += a.w + b.w;
            steps.push(mkArrayStep(forest.map(t => cell(t.w, C.blue, '权')), {},
                `当前最小两棵：${a.w} 与 ${b.w} → 合并为新结点 ${merged.w}（WPL 累计 +${a.w + b.w}）`));
            forest.push(merged);
            treeSnap(merged, `合并 ${a.w} + ${b.w} = ${merged.w}。当前已合并子树形态（还有 ${forest.length} 棵树待合并，继续取最小两个）`,
                { [merged.id]: C.amber });
        }
        const root = forest[0];
        // 计算每个叶子深度验证 WPL
        let check = 0;
        (function depth(nd, d) { if (!nd) return; if (!nd.left && !nd.right) check += nd.w * d; depth(nd.left, d + 1); depth(nd.right, d + 1); })(root, 0);
        treeSnap(root, `构造完成！WPL = Σ(叶子权值×深度) = ${check}（= 所有非叶结点权值之和 ${wpl}）。权值越大的叶子离根越近`, { [root.id]: C.green });
        return steps;
    }

    /* ══════════════════════ AVL 插入与旋转 ══════════════════════ */

    function avlInsert(values) {
        const keys = values.slice(0, 15);
        const steps = [];
        let uid = 0;
        const h = (nd) => nd ? 1 + Math.max(h(nd.left), h(nd.right)) : 0;
        const bf = (nd) => nd ? h(nd.left) - h(nd.right) : 0;
        const mkNode = (key) => ({ id: 'a' + (uid++), key: key, label: String(key), sub: 'bf:0', left: null, right: null });
        const withBf = (nd) => { if (nd) { nd.sub = 'bf:' + bf(nd); withBf(nd.left); withBf(nd.right); } return nd; };

        let root = null;
        const snap = (desc, hl) => steps.push({
            type_list: 'ctree', root: clone(withBf(root)), highlights: hl || {}, description: desc
        });
        const findById = (nd, id) => { if (!nd) return null; if (nd.id === id) return nd; return findById(nd.left, id) || findById(nd.right, id); };

        snap('AVL 树：任一结点平衡因子 bf = 左子树高 − 右子树高 ∈ {-1,0,1}。依次插入关键字，失衡时旋转——LL 右单旋 / RR 左单旋 / LR 先左后右 / RL 先右后左');

        for (const key of keys) {
            // 1) 搜索路径（比较途经点）
            const pathKeys = [];
            let cur = root;
            while (cur) { pathKeys.push(cur.key); if (key < cur.key) cur = cur.left; else if (key > cur.key) cur = cur.right; else break; }
            const hlPath = {};
            (function mark(nd) { if (!nd) return; if (pathKeys.indexOf(nd.key) !== -1) hlPath[nd.id] = C.purple; mark(nd.left); mark(nd.right); })(root);

            const dup = (function find2(nd) { while (nd) { if (key === nd.key) return true; nd = key < nd.key ? nd.left : nd.right; } return false; })(root);
            if (dup) { snap(`插入 ${key}：已存在，跳过重复值`, {}); continue; }
            snap(`插入 ${key}：沿搜索路径 [${pathKeys.join(' → ')}]（紫色）找到插入位置`, hlPath);

            // 2) 标准 AVL 插入，收集旋转事件
            const rotations = [];
            function rotR(y) { const x = y.left; y.left = x.right; x.right = y; return x; }
            function rotL(x) { const y = x.right; x.right = y.left; y.left = x; return y; }
            function ins(nd, k) {
                if (!nd) return mkNode(k);
                if (k < nd.key) nd.left = ins(nd.left, k);
                else if (k > nd.key) nd.right = ins(nd.right, k);
                else return nd;
                const b = bf(nd);
                if (b > 1 && k < nd.left.key) { nd = rotR(nd); rotations.push({ type: 'LL', newRootKey: nd.key }); }
                else if (b < -1 && k > nd.right.key) { nd = rotL(nd); rotations.push({ type: 'RR', newRootKey: nd.key }); }
                else if (b > 1) { nd.left = rotL(nd.left); nd = rotR(nd); rotations.push({ type: 'LR（先左旋左子树，再整树右旋）', newRootKey: nd.key }); }
                else if (b < -1) { nd.right = rotR(nd.right); nd = rotL(nd); rotations.push({ type: 'RL（先右旋右子树，再整树左旋）', newRootKey: nd.key }); }
                return nd;
            }
            root = ins(root, key);
            withBf(root);

            for (const r of rotations) {
                const hl = {};
                (function mark(nd) { if (!nd) return; if (nd.key === r.newRootKey) hl[nd.id] = C.green; mark(nd.left); mark(nd.right); })(root);
                snap(`⚠ 结点失衡 → ${r.type}。旋转后子树根为 ${r.newRootKey}（绿色），子树高度恢复到插入前的水平`, hl);
            }
            if (rotations.length === 0) {
                const hl = {};
                (function mark(nd) { if (!nd) return; if (nd.key === key) hl[nd.id] = C.green; mark(nd.left); mark(nd.right); })(root);
                snap(`插入 ${key} 完成，沿途各结点 bf 仍 ∈ {-1,0,1}，无需旋转`, hl);
            }
        }
        snap(`全部插入完成，共 ${keys.length} 个关键字。AVL 高度 ≈ 1.44·log₂(n+2)，保证搜索 O(log n)`);
        return steps;
    }

    /* ══════════════════════ 散列线性探测 ══════════════════════ */

    function hashProbe(keys, m) {
        m = Math.max(7, Math.min(17, m | 0 || 11));
        const table = new Array(m).fill(null);
        const steps = [];
        let totalProbes = 0;
        const view = (hl) => table.map((v, i) => v === null ? cell(' ', C.empty) : cell(v, hl && hl[i] ? hl[i] : C.blue));

        steps.push(mkArrayStep(view(), {},
            `散列表（表长 m=${m}，散列函数 H(key) = key % ${m}），冲突处理：线性探测 Hi = (H(key) + di) % m，di = 0,1,2,…`,
            { codeLine: 1 }));

        for (const key of keys.slice(0, 9)) {
            const h = ((key % m) + m) % m;
            let probes = 0, pos = h;
            steps.push(mkArrayStep(view(), { [h]: 'H(key)' },
                `插入 ${key}：H(${key}) = ${key} % ${m} = ${h}，先试探下标 ${h}`,
                { codeLine: 3 }));
            while (table[pos] !== null) {
                probes++; totalProbes++;
                pos = (h + probes) % m;
                steps.push(mkArrayStep(view({ [pos]: C.amber }), { [pos]: '探测' + probes },
                    `下标 ${(h + probes - 1) % m} 已被 ${table[(h + probes - 1) % m]} 占用 → 线性探测第 ${probes} 次：(${h} + ${probes}) % ${m} = ${pos}`,
                    { codeLine: 5 }));
            }
            table[pos] = key;
            steps.push(mkArrayStep(view({ [pos]: C.green }), { [pos]: '落位' },
                `${key} 存入下标 ${pos}${probes > 0 ? `（共探测 ${probes + 1} 次，产生堆积）` : '（一步到位）'}`,
                { codeLine: 6 }));
        }
        const alpha = (keys.slice(0, 9).length / m).toFixed(2);
        steps.push(mkArrayStep(view(), {},
            `全部插入完成，装填因子 α = ${keys.slice(0, 9).length}/${m} = ${alpha}。α 越大冲突越频繁；线性探测易产生"堆积（聚集）"`,
            { codeLine: 7 }));
        return steps;
    }

    /* ══════════════════════ 拓扑排序 ══════════════════════ */

    function topoSort(graph) {
        const n = graph.n, edges = graph.edges;
        const indeg = new Array(n + 1).fill(0);
        const adj = Array.from({ length: n + 1 }, () => []);
        for (const e of edges) { adj[e.u].push(e.v); indeg[e.v]++; }
        const steps = [];
        let order = [];

        const view = (hl, gray) => {
            const cs = [];
            for (let v = 1; v <= n; v++) {
                if (gray && gray.includes(v)) cs.push(cell('✓', C.gray, '已输出'));
                else cs.push(cell(indeg[v], hl && hl[v] ? hl[v] : C.blue, '点' + v));
            }
            return cs;
        };
        const ptrs = (idx, label) => { const p = {}; if (idx >= 1 && idx <= n) p[idx - 1] = label; return p; };

        steps.push(mkArrayStep(view(), {},
            `拓扑排序（AOV 网，${n} 个顶点 / ${edges.length} 条边）：格子为各顶点入度。每轮取入度为 0 的顶点输出，并把它发出的边全部删除`,
            { seq: '拓扑序列: []', codeLine: 2 }));

        for (let round = 0; round < n; round++) {
            let v = -1;
            for (let i = 1; i <= n; i++) if (indeg[i] === 0 && !order.includes(i)) { v = i; break; }
            if (v === -1) {
                steps.push(mkArrayStep(view({}, order), {},
                    `✗ 没有入度为 0 的顶点 → 图中存在回路，拓扑排序失败（输出 -1）`,
                    { seq: '拓扑序列: [' + order.join(', ') + ']', codeLine: 9 }));
                return steps;
            }
            order.push(v);
            steps.push(mkArrayStep(view({ [v]: C.green }, order), { [v - 1]: '入度0→输出' },
                `顶点 ${v} 入度为 0，输出（当前序列: ${order.join(' → ')}），删除它的所有出边`,
                { seq: '拓扑序列: [' + order.join(', ') + ']', codeLine: 5 }));
            for (const w of adj[v]) {
                indeg[w]--;
                steps.push(mkArrayStep(view({ [w]: C.amber }, order), { [w - 1]: '入度-1' },
                    `删除边 ${v}→${w}：${w} 的入度变为 ${indeg[w]}${indeg[w] === 0 ? '（变为 0，可输出）' : ''}`,
                    { seq: '拓扑序列: [' + order.join(', ') + ']', codeLine: 7 }));
            }
        }
        steps.push(mkArrayStep(view({}, order), {},
            `拓扑排序完成：${order.join(' → ')}。时间复杂度 O(n + e)`,
            { seq: '拓扑序列: [' + order.join(', ') + ']', codeLine: 10 }));
        return steps;
    }

    /* ══════════════════════ DP 填表（LCS / 0-1 背包） ══════════════════════ */

    function dpLCS(X, Y) {
        X = String(X).slice(0, 9); Y = String(Y).slice(0, 9);
        const m = X.length, n = Y.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));
        const steps = [];
        const snap = (cur, desc, kind, codeLine) => steps.push({
            type_list: 'dp',
            rowHeaders: [''].concat(X.split('')),
            colHeaders: [''].concat(Y.split('')),
            grid: clone(dp),
            cur: cur,
            title: `LCS("${X}", "${Y}") — dp[i][j] = X 前 i 个字符与 Y 前 j 个字符的最长公共子序列长度`,
            description: desc,
            kind: kind || '',
            codeLine: codeLine || 0
        });
        for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) dp[i][j] = (i === 0 || j === 0) ? 0 : null;
        snap([0, 0], '边界：dp[0][j] = dp[i][0] = 0（空串与任何串的 LCS 为 0），其余格子待逐个递推', 'border', 5);

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (X[i - 1] === Y[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    snap([i, j], `X[${i - 1}]='${X[i - 1]}' = Y[${j - 1}]='${Y[j - 1]}' ✓ 相等 → dp[${i}][${j}] = 左上 dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}（↖）`, 'match', 7);
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    snap([i, j], `'${X[i - 1]}' ≠ '${Y[j - 1]}' → dp[${i}][${j}] = max(上方 ${dp[i - 1][j]}, 左方 ${dp[i][j - 1]}) = ${dp[i][j]}（${dp[i - 1][j] >= dp[i][j - 1] ? '↑' : '←'}）`, 'mismatch', 9);
                }
            }
        }
        snap([m, n], `填表完成！LCS 长度 = dp[${m}][${n}] = ${dp[m][n]}。时间/空间 O(mn)；从右下角沿箭头回溯可还原子序列本身`, 'done', 12);
        return steps;
    }

    function dpKnapsack(cfg) {
        const items = cfg.items.slice(0, 5);
        const W = Math.max(1, Math.min(9, cfg.W | 0));
        const n = items.length;
        const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(null));
        const steps = [];
        const snap = (cur, desc, kind, codeLine) => steps.push({
            type_list: 'dp',
            rowHeaders: ['前0件'].concat(items.map((it, i) => `前${i + 1}件(w${it.w},v${it.v})`)),
            colHeaders: Array.from({ length: W + 1 }, (_, j) => String(j)),
            grid: clone(dp),
            cur: cur,
            title: `0-1 背包：容量 W=${W}，物品 ${items.map(it => '(w' + it.w + ',v' + it.v + ')').join(' ')}`,
            description: desc,
            kind: kind || '',
            codeLine: codeLine || 0
        });
        for (let i = 0; i <= n; i++) for (let j = 0; j <= W; j++) dp[i][j] = (i === 0 || j === 0) ? 0 : null;
        snap([0, 0], `边界：dp[0][j] = dp[i][0] = 0。递推 dp[i][j] = max(不选第 i 件 dp[i-1][j], 能装则 选它 dp[i-1][j-wᵢ]+vᵢ)`, 'border', 2);
        for (let i = 1; i <= n; i++) {
            for (let j = 0; j <= W; j++) {
                dp[i][j] = dp[i - 1][j];
                if (j >= items[i - 1].w) {
                    const take = dp[i - 1][j - items[i - 1].w] + items[i - 1].v;
                    if (take > dp[i][j]) dp[i][j] = take;
                    snap([i, j], `dp[${i}][${j}] = max(不选: ${dp[i - 1][j]}, 选(w=${items[i - 1].w}): dp[${i - 1}][${j - items[i - 1].w}]+${items[i - 1].v}=${take}) = ${dp[i][j]}`, '', 8);
                } else {
                    snap([i, j], `容量 ${j} < 重量 ${items[i - 1].w}，装不下第 ${i} 件 → dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}`, '', 5);
                }
            }
        }
        snap([n, W], `填表完成！最大价值 = dp[${n}][${W}] = ${dp[n][W]}。一维滚动数组优化时容量必须倒序枚举（防止同一物品被选多次）`, 'done', 12);
        return steps;
    }

    /* ══════════════════════ B 树插入（3 阶） ══════════════════════ */

    function btreeInsert(keys) {
        const ks = keys.slice(0, 10);
        const MAXK = 2; // 3 阶 B 树：每结点最多 2 个关键字、3 棵子树
        let uid = 0;
        const mkNode = () => ({ id: 'b' + (uid++), keys: [], children: [] });
        let root = null;
        const steps = [];
        let splitCount = 0;

        /** 在以 nd 为根的子树中插入 k；返回 null 或 { mid, right }（向上分裂） */
        function insert(nd, k) {
            let i = 0;
            while (i < nd.keys.length && k > nd.keys[i]) i++;
            if (i < nd.keys.length && k === nd.keys[i]) return { dup: true };
            if (nd.children.length === 0) {
                // 叶子：直接有序插入
                nd.keys.splice(i, 0, k);
            } else {
                const r = insert(nd.children[i], k);
                if (r.dup) return { dup: true };
                if (!r.mid) return {};
                // 子结点分裂上浮：中间键插入本结点
                nd.keys.splice(i, 0, r.mid);
                nd.children.splice(i + 1, 0, r.right);
            }
            if (nd.keys.length <= MAXK) return {};
            // 溢出分裂：keys 一定为 3 个，中间上浮
            const mid = nd.keys[1];
            const right = mkNode();
            right.keys = [nd.keys[2]];
            if (nd.children.length === 4) {
                right.children = nd.children.splice(2, 2); // 后两个子树归右结点
            }
            nd.keys = [nd.keys[0]];
            splitCount++;   // 在真正发生分裂处计数（含被父结点吸收的中间层分裂）
            return { mid: mid, right: right };
        }

        function findPath(k) {
            const path = [];
            let nd = root;
            while (nd) {
                path.push(nd);
                let i = 0;
                while (i < nd.keys.length && k > nd.keys[i]) i++;
                if (i < nd.keys.length && k === nd.keys[i]) return { path: path, dup: true, leaf: nd };
                if (nd.children.length === 0) return { path: path, dup: false, leaf: nd };
                nd = nd.children[i];
            }
            return { path: path, dup: false, leaf: nd };
        }

        const snap = (desc, hlIds) => steps.push({
            type_list: 'btree', root: clone(root), highlights: hlIds || {}, maxKeys: MAXK,
            description: desc
        });

        snap(`B 树（3 阶）：每个结点最多 ${MAXK} 个关键字、最多 ${MAXK + 1} 棵子树。插入总落在叶子；关键字超上限时发生分裂——中间关键字上浮到父结点，因此所有叶子永远在同一层`);
        for (const k of ks) {
            if (typeof k !== 'number' || isNaN(k)) continue;
            const before = root ? findPath(k) : null;
            if (before && before.dup) { snap(`插入 ${k}：已存在，B 树不允许重复关键字，跳过`, before.path.map(n => n.id)); continue; }
            // 先快照路径/叶结点文本（insert 会原地修改结点）
            const pathText = before ? before.path.map(n => '[' + n.keys.join(',') + ']').join(' → ') : '';
            const leafText = before && before.leaf ? before.leaf.keys.join(',') : '';
            const splitsBefore = splitCount;
            const r = root ? insert(root, k) : (function () { root = mkNode(); root.keys = [k]; return {}; })();
            if (r && r.mid !== undefined) {
                // 分裂一路传到根：中间关键字成为新根，树高 +1
                const newRoot = mkNode();
                newRoot.keys = [r.mid];
                newRoot.children = [root, r.right];
                root = newRoot;
                snap(`插入 ${k}${pathText ? '（路径 ' + pathText + '）' : ''}：结点积到 3 个关键字，超过上限（最多 ${MAXK} 个）→ 分裂：中间关键字 ${r.mid} 上浮成为新根，左右各留 1 个；树高 +1`, []);
            } else if (splitCount > splitsBefore) {
                // 叶结点分裂，但中间关键字被父结点吸收，未传到根
                snap(`插入 ${k}：叶结点超上限发生分裂，中间关键字上浮被父结点吸收（父结点未超限，树高不变）`,
                    before ? before.path.map(n => n.id) : []);
            } else if (before) {
                snap(`插入 ${k}：沿路径 ${pathText} 落入叶结点 [${leafText}]，未超上限`,
                    before.path.map(n => n.id));
            } else {
                snap(`插入 ${k}：空树，直接作为根结点`);
            }
        }
        snap(`全部插入完成（共 ${splitCount} 次分裂）。B 树增高只靠"根分裂"，所有叶子永远同层——这正是它适合磁盘外存检索的原因`);
        return steps;
    }

    /* ══════════════════════ 正交链表（十字链表） ══════════════════════ */

    function orthoList(triples, rows, cols) {
        const list = triples.slice(0, 16).map(t => ({ r: t.r, c: t.c, v: t.v }));
        const R = Math.max(rows, 1), Cn = Math.max(cols, 1);
        const steps = [];

        const snap = (count, desc) => steps.push({
            type_list: 'ortho',
            rows: R, cols: Cn,
            nodes: list.slice(0, count),   // 已链入的结点（行序）
            description: desc
        });

        snap(0, `正交链表（十字链表）：稀疏矩阵的链式存储。每个非零元一个结点（含 行i、列j、值v、right、down 五个域）；每行、每列各有一条链表串起本行/本列的非零元——同一个结点既在行链表上、也在列链表上，十字交叉，适合矩阵"加法"等会改变非零元结构的运算`);

        // 按行序逐个链入
        for (let idx = 0; idx < list.length; idx++) {
            const it = list[idx];
            // 找到链入后同行/同列的邻居（用于讲解）
            const rowMate = list.slice(0, idx).reverse().find(o => o.r === it.r);
            const colMate = list.slice(0, idx).reverse().find(o => o.c === it.c);
            snap(idx + 1,
                `链入结点 (${it.r},${it.c},${it.v})：按列序挂到第 ${it.r} 行链表${rowMate ? `（接在 (${rowMate.r},${rowMate.c}) 之后）` : '（作为该行第一个非零元）'}，同时按行序挂到第 ${it.c} 列链表${colMate ? `（接在 (${colMate.r},${colMate.c}) 之下）` : '（作为该列第一个非零元）'}。横箭头 = right 指针，竖箭头 = down 指针`);
        }
        snap(list.length,
            `构建完成：共 ${list.length} 个结点。左侧一列是各行链表头指针 rhead[i]，顶部一行是各列链表头指针 chead[j]。遍历第 i 行沿 right 走，遍历第 j 列沿 down 走`);
        return steps;
    }

    /* ══════════════════════ 广义表（4.7，utype 三类结点存储） ══════════════════════
     * 与课件 / 知识库 4.7 节一致的存储表示：
     *   表头结点 utype=0（info 存引用计数 ref）   原子结点 utype=1（info 存值）
     *   子表结点 utype=2（info.hlink 指向子表表头）
     *   tlink：表头指向第一个元素结点；其余指向同层下一结点
     * 步骤 type_list = 'glist'，root 为整棵结构的快照（表头结点） */

    let glUid = 0;
    const glNewHeader = () => ({ id: 'gh' + (glUid++), utype: 0, tlink: null });
    const glNewAtom = (v) => ({ id: 'ga' + (glUid++), utype: 1, value: v, tlink: null });
    const glNewSub = (h) => ({ id: 'gs' + (glUid++), utype: 2, hlink: h, tlink: null });
    const glClone = (node) => JSON.parse(JSON.stringify(node));

    /** 解析书写串 "(a,(b,c))" → 嵌套数组 ['a',['b','c'],'d']；非法输入抛错（原子限单字符） */
    function glParseSpec(str) {
        const s = String(str || '').replace(/\s+/g, '');
        if (!s) throw new Error('广义表不能为空');
        let i = 0, atoms = 0, nest = 0, maxNest = 0;
        function list() {
            if (s[i] !== '(') throw new Error('应以 "(" 开始');
            i++; nest++; if (nest > maxNest) maxNest = nest;
            const out = [];
            if (s[i] === ')') { i++; nest--; return out; }
            for (; ;) {
                let el;
                if (s[i] === '(') {
                    el = list();
                } else {
                    const ch = s[i];
                    if (!/[A-Za-z0-9]/.test(ch || '')) {
                        throw new Error(`位置 ${i + 1} 附近有无法识别的字符 "${ch || ''}"（原子请用单个字母或数字）`);
                    }
                    i++; atoms++; el = ch;
                }
                out.push(el);
                if (atoms > 12) throw new Error('原子过多（最多 12 个，便于展示）');
                if (s[i] === ',') { i++; continue; }
                if (s[i] === ')') { i++; nest--; break; }
                throw new Error(`位置 ${i + 1} 附近格式有误（元素之间需用逗号分隔）`);
            }
            return out;
        }
        const spec = list();
        if (i !== s.length) throw new Error('末尾有多余字符：' + s.slice(i));
        if (maxNest > 4) throw new Error('嵌套过深（最多 4 层括号）');
        return spec;
    }

    const glSpecToStr = (spec) => '(' + spec.map(e => Array.isArray(e) ? glSpecToStr(e) : e).join(',') + ')';
    function glHeaderToStr(header) {
        const parts = [];
        for (let p = header.tlink; p; p = p.tlink) parts.push(glNodeToStr(p));
        return '(' + parts.join(',') + ')';
    }
    const glNodeToStr = (node) => node.utype === 2 ? glHeaderToStr(node.hlink) : String(node.value);

    /** 由嵌套数组静默建结构（不产生步骤，供 head/tail、深度、打印使用） */
    function glBuildQuiet(spec) {
        const header = glNewHeader();
        let tail = header;
        for (const el of spec) {
            const nd = Array.isArray(el) ? glNewSub(glBuildQuiet(el)) : glNewAtom(el);
            tail.tlink = nd; tail = nd;
        }
        return header;
    }

    function glDepthOf(header) {
        let m = 0;
        for (let p = header.tlink; p; p = p.tlink)
            if (p.utype === 2) { const d = glDepthOf(p.hlink); if (d > m) m = d; }
        return m + 1;
    }

    function glAtomCount(header) {
        let n = 0;
        (function cnt(h) { for (let p = h.tlink; p; p = p.tlink) { if (p.utype === 1) n++; else cnt(p.hlink); } })(header);
        return n;
    }

    /** 广义表步骤生成器的统一入口：解析失败时返回单条错误步骤 */
    function glTryParse(str, steps) {
        try {
            return { spec: glParseSpec(str) };
        } catch (e) {
            steps.push({ type_list: 'glist', root: null, highlights: {}, seq: null, description: '✗ 输入不是合法广义表：' + e.message });
            return null;
        }
    }

    /** ① 建立：从书写串逐结点构建 utype 存储结构 */
    function glistBuild(str) {
        const steps = [];
        const parsed = glTryParse(str, steps);
        if (!parsed) return steps;
        const root = glNewHeader();
        const snap = (desc, hl, codeLine) => steps.push({ type_list: 'glist', root: glClone(root), highlights: hl || {}, seq: null, codeLine: codeLine || 0, description: desc });

        snap(`广义表 ${glSpecToStr(parsed.spec)}：开始建立存储结构。规则：每个表先建一个表头结点（utype=0，info 存引用计数 ref），元素结点用 tlink 连成同层链`, null, 1);
        (function fill(header, arr) {
            let tail = header;
            arr.forEach((el, idx) => {
                const first = idx === 0;
                if (Array.isArray(el)) {
                    const h2 = glNewHeader();
                    const nd = glNewSub(h2);
                    tail.tlink = nd; tail = nd;
                    snap(`读入第 ${idx + 1} 个元素——子表 ${glSpecToStr(el)}：先建子表结点（utype=2，紫色），hlink 指向新表头，tlink 挂入本层链${first ? '（表头的 tlink 指向它）' : ''}`,
                        { [nd.id]: C.amber, [h2.id]: C.purple }, 11);
                    fill(h2, el);
                    snap(`子表 ${glSpecToStr(el)} 建立完毕，返回外层继续读入`, { [nd.id]: C.green }, 13);
                } else {
                    const nd = glNewAtom(el);
                    tail.tlink = nd; tail = nd;
                    snap(`读入第 ${idx + 1} 个元素——原子 ${el}：原子结点（utype=1，info 存值），接到同层链尾${first ? '（表头的 tlink 指向它）' : '（前一结点的 tlink 指向它）'}`,
                        { [nd.id]: C.amber }, 8);
                }
            });
        })(root, parsed.spec);
        snap(`建立完成！长度 = ${parsed.spec.length}（最外层元素个数），深度 = ${glDepthOf(root)}（括号最大重数）。表头 utype=0 / 原子 utype=1 / 子表 utype=2；tlink 连同层后继，hlink 进子表`, null, 15);
        return steps;
    }

    /** ② 求表头 / 表尾：head 取第一个元素，tail 是其余元素组成的表（必为表） */
    function glistHeadTail(str) {
        const steps = [];
        const parsed = glTryParse(str, steps);
        if (!parsed) return steps;
        const root = glBuildQuiet(parsed.spec);
        const snap = (desc, hl, seq) => steps.push({ type_list: 'glist', root: glClone(root), highlights: hl || {}, seq: seq || null, description: desc });

        const first = root.tlink;
        if (!first) {
            snap(`广义表 () 是空表：head / tail 无意义（对空表取表头表尾是非法操作）`);
            return steps;
        }
        snap(`L = ${glHeaderToStr(root)}。表头 head(L)：第一个元素（琥珀色）；表尾 tail(L)：其余元素组成的表（绿色）`, { [first.id]: C.amber });
        snap(`head(L) = ${glNodeToStr(first)}${first.utype === 2 ? ' —— 第一个元素是子表，表头就是该子表本身' : ' —— 第一个元素是原子'}`,
            { [first.id]: C.amber }, `head(L) = ${glNodeToStr(first)}`);

        const restIds = {};
        for (let p = first.tlink; p; p = p.tlink) restIds[p.id] = C.green;
        const tailStr = glHeaderToStr({ tlink: first.tlink });
        snap(`tail(L) = ${tailStr} —— ${first.tlink ? '其余元素组成的表，注意结果一定带括号（表尾必为表，这是最易错点）' : '表只剩这一个元素，表尾是空表 ()——空表的表头表尾不存在'}`,
            restIds, `tail(L) = ${tailStr}`);

        if (first.tlink) {
            const second = first.tlink;
            snap(`head(tail(L)) = ${glNodeToStr(second)}：对表尾再取表头，得到 L 的第二个元素`, { [second.id]: C.amber }, `head(tail(L)) = ${glNodeToStr(second)}`);
            if (second.utype === 2 && second.hlink.tlink) {
                const inner = second.hlink.tlink;
                snap(`head(head(tail(L))) = ${glNodeToStr(inner)}：第二个元素是子表，再取一层表头深入其内部——复合运算从里往外逐层化简`,
                    { [inner.id]: C.amber }, `head(head(tail(L))) = ${glNodeToStr(inner)}`);
            }
            if (second.tlink) {
                const ids2 = {};
                for (let p = second.tlink; p; p = p.tlink) ids2[p.id] = C.green;
                const t2 = glHeaderToStr({ tlink: second.tlink });
                snap(`tail(tail(L)) = ${t2}：连续取表尾，像剥洋葱一样去掉前面的元素`, ids2, `tail(tail(L)) = ${t2}`);
            } else {
                snap(`tail(tail(L)) = ()：已剥到只剩空表——空表不能再取 head / tail`);
            }
        }
        snap(`小结：head 取第一个元素（可能是原子也可能是子表）；tail 一定是表；经典考题 head(head(tail(tail(L)))) 之类，做法都是从最里层开始逐层化简`);
        return steps;
    }

    /** ③ 递归求深度：Depth(原子)=0，Depth(())=1，Depth(表)=1+max{子表深度} */
    function glistDepth(str) {
        const steps = [];
        const parsed = glTryParse(str, steps);
        if (!parsed) return steps;
        const root = glBuildQuiet(parsed.spec);
        const snap = (desc, hl, codeLine) => steps.push({ type_list: 'glist', root: glClone(root), highlights: hl || {}, seq: null, codeLine: codeLine || 0, description: desc });

        snap(`递归求深度。定义：Depth(原子) = 0；Depth(空表 ()) = 1；Depth(表) = 1 + max{各子表深度}（即括号的最大重数）。现在求 L = ${glHeaderToStr(root)} 的深度`, null, 1);
        function walk(header, name) {
            if (!header.tlink) {
                snap(`表 ${name} 是空表：直接返回深度 1（递归出口）`, { [header.id]: C.green }, 2);
                return 1;
            }
            snap(`进入表 ${name}：沿 tlink 扫描顶层元素，m 记录子表最大深度（初值 0）`, { [header.id]: C.purple }, 4);
            let m = 0, k = 0;
            for (let p = header.tlink; p; p = p.tlink) {
                k++;
                if (p.utype === 1) {
                    snap(`第 ${k} 个元素是原子 ${p.value}：深度 0，m 保持 ${m}`, { [p.id]: C.amber }, 6);
                } else {
                    const sub = glHeaderToStr(p.hlink);
                    snap(`第 ${k} 个元素是子表 ${sub}：沿 hlink 递归求其深度`, { [p.id]: C.purple, [p.hlink.id]: C.purple }, 7);
                    const d = walk(p.hlink, sub);
                    if (d > m) {
                        m = d;
                        snap(`子表 ${sub} 深度 = ${d} > 当前 m，更新 m = ${m}`, { [p.id]: C.green }, 8);
                    } else {
                        snap(`子表 ${sub} 深度 = ${d} ≤ 当前 m = ${m}，不更新`, { [p.id]: C.blue }, 8);
                    }
                }
            }
            snap(`表 ${name} 扫描完毕：深度 = m + 1 = ${m + 1}（本层括号 + 最深子表）`, { [header.id]: C.green }, 10);
            return m + 1;
        }
        const d = walk(root, glHeaderToStr(root));
        snap(`计算完成：Depth(L) = ${d}。整棵结构每个结点只访问一次，时间 O(结点数)，递归栈深 O(表的深度)`, null, 11);
        return steps;
    }

    /** ④ 递归遍历打印：进入子表输出 '('，原子输出值，离开输出 ')' */
    function glistPrint(str) {
        const steps = [];
        const parsed = glTryParse(str, steps);
        if (!parsed) return steps;
        const root = glBuildQuiet(parsed.spec);
        let out = '';
        const snap = (desc, hl, codeLine) => steps.push({ type_list: 'glist', root: glClone(root), highlights: hl || {}, seq: '输出: ' + out, codeLine: codeLine || 0, description: desc });

        snap(`递归打印 L = ${glHeaderToStr(root)}：进入子表输出 '('；遇原子输出其值；遇子表结点递归进入；离开子表输出 ')'；元素间补 ','`, null, 1);
        (function pH(header) {
            const empty = !header.tlink;
            out += '(';
            snap(empty ? `进入${header === root ? '' : '子'}表：输出 '('（本层没有任何元素——空表）` : `进入${header === root ? '' : '子'}表：输出 '('`, { [header.id]: C.purple }, 2);
            let first = true;
            for (let p = header.tlink; p; p = p.tlink) {
                const sep = first ? '' : `（前面已有元素，先补 ','）`;
                if (!first) out += ',';
                first = false;
                if (p.utype === 1) {
                    out += String(p.value);
                    snap(`原子 ${p.value}${sep}：输出 '${p.value}'`, { [p.id]: C.amber }, 6);
                } else {
                    snap(`子表结点${sep}：沿 hlink 递归进入`, { [p.id]: C.purple, [p.hlink.id]: C.purple }, 8);
                    pH(p.hlink);
                }
            }
            out += ')';
            snap(`本层扫描结束：输出 ')'`, { [header.id]: C.green }, 10);
        })(root);
        snap(`打印完成：${out} —— 与书写形式完全一致（打印是"建立"的逆过程）。时间 O(结点数)`, null, 11);
        return steps;
    }

    /** 校验自定义广义表输入（vizView 调用） */
    function glistValidate(str) {
        try { glParseSpec(str); return { ok: true }; }
        catch (e) { return { ok: false, msg: e.message }; }
    }

    /* ══════════════════════ 渲染器 ══════════════════════ */

    function renderArray(renderer, step) {
        const cells = step.cells || [];
        if (cells.length === 0) return;
        const w = renderer.width, h = renderer.height;
        const pad = 30;
        const cellW = Math.min(64, Math.max(30, (w - pad * 2) / cells.length * 0.8));
        const cellH = 36;
        const perRow = Math.max(1, Math.floor((w - pad * 2) / (cellW + 10)));
        const rows = Math.ceil(cells.length / perRow);
        const topPad = 40 + (rows > 1 ? 0 : 0);

        // 指针标记（画在格子上方）
        const pointers = step.pointers || {};
        for (let i = 0; i < cells.length; i++) {
            const row = Math.floor(i / perRow), colIdx = i % perRow;
            const x = pad + colIdx * (cellW + 10) + (w - pad * 2 - Math.min(perRow, cells.length - row * perRow) * (cellW + 10)) / 2;
            const y = topPad + row * (cellH + 34);
            const c = cells[i];
            renderer.drawRoundedRect(x, y, cellW, cellH, 5, c.color || C.blue, c.text);
            if (c.sub) renderer.drawText(c.sub, x + cellW / 2, y + cellH + 10, C.sub, 9);
            renderer.drawText(i, x + cellW / 2, y - 8, C.sub, 9);
            const label = pointers[i];
            if (label) {
                renderer.drawText(label, x + cellW / 2, y - 24, C.red, 11);
                renderer.drawArrow(x + cellW / 2, y - 20, x + cellW / 2, y - 4, C.red);
            }
        }
        if (step.seq) {
            renderer.drawText(step.seq, w / 2, h - 24, '#555555', 20);
        }
    }

    function renderExpr(renderer, step) {
        const w = renderer.width;
        const cw = Math.min(38, (w - 60) / Math.max(step.tokens.length, 1));
        // 三行内容各自整体居中；行标签画在内容上方并左对齐（drawText 默认居中对齐，
        // 若标签仍以内容起点为中心绘制，宽标签左半会落在画布外被截断）
        // 输入行
        const inX0 = (w - step.tokens.length * cw) / 2;
        renderer.drawText('输入（中缀）', inX0, 56, C.label, 12, 'left');
        step.tokens.forEach((t, i) => {
            const x = inX0 + i * cw;
            const color = t.state === 'cur' ? C.amber : t.state === 'done' ? C.gray : C.empty;
            renderer.drawRect(x, 66, cw - 4, 32, t.state === 'wait' ? '#f5f5f5' : color, t.ch);
            if (t.state === 'cur') renderer.drawText('▲', x + cw / 2 - 2, 106, C.red, 12);
        });
        // 栈行
        const stX0 = (w - step.stack.length * 40) / 2;
        renderer.drawText('运算符栈（栈底→栈顶）', stX0, 126, C.label, 12, 'left');
        step.stack.forEach((ch, i) => {
            renderer.drawRoundedRect(stX0 + i * 40, 136, 36, 32, 5, ch === '(' ? C.purple : C.blue, ch);
        });
        if (step.stack.length === 0) renderer.drawText('（空）', stX0 + 4, 152, C.sub, 11, 'left');
        // 输出行
        const outX0 = (w - step.output.length * cw) / 2;
        renderer.drawText('输出（后缀）', outX0, 194, C.label, 12, 'left');
        step.output.forEach((ch, i) => {
            renderer.drawRoundedRect(outX0 + i * cw, 204, cw - 4, 32, 5, C.green, ch);
        });
        if (step.output.length === 0) renderer.drawText('（空）', outX0 + 4, 220, C.sub, 11, 'left');
    }

    function renderHanoi(renderer, step) {
        const w = renderer.width, h = renderer.height;
        const pegY = h - 70;         // 底座 y
        const span = w / 3;
        const names = ['A', 'B', 'C'];
        const maxDisks = step.n || 4;
        const diskW = Math.min(150, span * 0.55);
        const diskH = Math.min(24, (h - 180) / Math.max(maxDisks, 1));
        for (let p = 0; p < 3; p++) {
            const cx = span * p + span / 2;
            renderer.drawLine(cx - 70, pegY, cx + 70, pegY, '#888888', 3);
            renderer.drawLine(cx, pegY, cx, pegY - diskH * maxDisks - 12, '#aaaaaa', 4);
            renderer.drawText(names[p] + ' 柱', cx, pegY + 18, C.label, 13);
            const disks = step.pegs[p] || [];
            disks.forEach((d, i) => {
                const y = pegY - (i + 1) * diskH;
                const halfW = diskW * (0.35 + 0.65 * d / maxDisks) / 1;
                const color = step.moved === d ? C.amber : (p === 2 ? '#5aa85a' : C.blue);
                renderer.drawRoundedRect(cx - halfW, y - diskH + 2, halfW * 2, diskH - 3, 6, color, d);
            });
        }
        renderer.drawText(`目标：全部移到 C 柱（大盘必须始终在小盘下方）`, w / 2, 30, C.label, 13);
    }

    function renderDP(renderer, step) {
        const grid = step.grid;
        if (!grid) return;
        const rows = grid.length, cols = grid[0].length;
        const padL = 30, padT = 66;
        const cellW = Math.min(52, (renderer.width - padL - 20) / cols);
        const cellH = Math.min(40, (renderer.height - padT - 60) / rows);
        // 标题
        renderer.drawText(step.title || '', renderer.width / 2, 24, C.label, 12);
        // 列头
        for (let j = 0; j < cols; j++) {
            const ch = step.colHeaders && step.colHeaders[j] ? step.colHeaders[j] : '';
            renderer.drawText(ch, padL + j * cellW + cellW / 2, padT - 22, C.label, 11);
        }
        for (let i = 0; i < rows; i++) {
            const rh = step.rowHeaders && step.rowHeaders[i] ? step.rowHeaders[i] : '';
            renderer.drawText(rh.length > 9 ? rh.slice(0, 9) : rh, padL - 6, padT + i * cellH + cellH / 2, C.label, 10);
            for (let j = 0; j < cols; j++) {
                const v = grid[i][j];
                const isCur = step.cur && step.cur[0] === i && step.cur[1] === j;
                let color = v === null || v === undefined ? '#f7f7f7' : (i === 0 || j === 0 ? '#e8eef5' : '#dce9f7');
                if (isCur) color = step.kind === 'match' || step.kind === 'done' ? C.green : C.amber;
                const x = padL + j * cellW, y = padT + i * cellH;
                renderer.drawRect(x + 1, y + 1, cellW - 2, cellH - 2, color, v === null || v === undefined ? '' : v);
            }
        }
    }

    function renderBTree(renderer, step) {
        if (!step.root) return;
        const nodes = [], edges = [];
        let leafCount = 0;
        // 递归分配叶子宽度
        const widths = new Map();
        function w(nd) {
            if (nd.children.length === 0) { widths.set(nd.id, 1); return 1; }
            let s = 0; for (const c of nd.children) s += w(c);
            widths.set(nd.id, Math.max(1, s));
            return widths.get(nd.id);
        }
        w(step.root);
        function assign(nd, depth, xLeft) {
            const x = xLeft + (widths.get(nd.id) || 1) / 2;
            nodes.push({ nd: nd, depth: depth, x: x });
            let acc = xLeft;
            for (const c of nd.children) { edges.push([nd.id, c.id]); assign(c, depth + 1, acc); acc += widths.get(c.id) || 1; }
        }
        assign(step.root, 0, 0);
        const maxDepth = Math.max(...nodes.map(n => n.depth));
        const totalW = Math.max(...nodes.map(n => n.x)) + 0.5;
        const pad = { t: 44, b: 40, l: 24, r: 24 };
        const xs = (x) => pad.l + (x / totalW) * (renderer.width - pad.l - pad.r);
        const ys = (d) => pad.t + d * Math.min(90, (renderer.height - pad.t - pad.b) / Math.max(maxDepth + 1, 1));
        const pos = {};
        for (const n of nodes) pos[n.nd.id] = { x: xs(n.x), y: ys(n.depth) };
        for (const [fa, ch] of edges) {
            if (pos[fa] && pos[ch]) renderer.drawLine(pos[fa].x, pos[fa].y + 16, pos[ch].x, pos[ch].y - 16, '#cccccc', 2);
        }
        for (const n of nodes) {
            const p = pos[n.nd.id];
            const kw = 44;
            const bw = 14 + n.nd.keys.length * kw;
            const hl = (step.highlights || {})[n.nd.id];
            const color = hl || (n.nd.keys.length >= step.maxKeys ? C.amber : C.blue);
            renderer.drawRoundedRect(p.x - bw / 2, p.y - 16, bw, 32, 6, color, n.nd.keys.join(' | '));
        }
    }

    function renderOrtho(renderer, step) {
        const R = step.rows, Cn = step.cols;
        const nodes = step.nodes || [];
        const padL = 96, padT = 66;
        const cellW = Math.min(84, (renderer.width - padL - 24) / Math.max(Cn, 1));
        const cellH = Math.min(52, (renderer.height - padT - 60) / Math.max(R, 1));
        const cx = (c) => padL + (c + 0.5) * cellW;
        const cy = (r) => padT + (r + 0.5) * cellH;

        // 列头 chead
        renderer.drawText('列头 chead[]', renderer.width / 2, 26, C.label, 12);
        for (let j = 0; j < Cn; j++) {
            const colNodes = nodes.filter(n => n.c === j);
            const has = colNodes.length > 0;
            renderer.drawCircle(cx(j), 48, 11, has ? C.purple : '#dddddd', j);
            if (has) renderer.drawArrow(cx(j), 59, cx(j), cy(colNodes[0].r) - 14, C.purple);
        }
        // 行头 rhead
        renderer.drawText('rhead[]', 24, padT - 34, C.label, 11);
        for (let i = 0; i < R; i++) {
            const rowNodes = nodes.filter(n => n.r === i);
            const has = rowNodes.length > 0;
            renderer.drawCircle(46, cy(i), 11, has ? C.purple : '#dddddd', i);
            if (has) renderer.drawArrow(57, cy(i), cx(rowNodes[0].c) - cellW / 2 - 4, cy(i), C.purple);
        }
        // 结点 + right 指针
        for (const n of nodes) {
            const x = cx(n.c), y = cy(n.r);
            const isLast = n === nodes[nodes.length - 1];
            renderer.drawRoundedRect(x - cellW / 2 + 6, y - cellH / 2 + 4, cellW - 12, cellH - 8, 5,
                isLast ? C.amber : C.blue, String(n.v));
            renderer.drawText(`(${n.r},${n.c})`, x, y + cellH / 2 - 2, 'rgba(255,255,255,0.85)', 9);
        }
        // 行内 right 箭头
        for (let i = 0; i < R; i++) {
            const rowNodes = nodes.filter(n => n.r === i).sort((a, b) => a.c - b.c);
            for (let k = 0; k < rowNodes.length; k++) {
                const a = rowNodes[k], b = rowNodes[k + 1];
                if (b) renderer.drawArrow(cx(a.c) + cellW / 2 - 6, cy(i), cx(b.c) - cellW / 2 + 6, cy(i), C.amber);
                else renderer.drawText('∅', cx(a.c) + cellW / 2 + 12, cy(i), C.sub, 12);
            }
            if (rowNodes.length === 0) renderer.drawText('∅', cx(0) - cellW / 2 - 14, cy(i), C.sub, 12);
        }
        // 列内 down 箭头
        for (let j = 0; j < Cn; j++) {
            const colNodes = nodes.filter(n => n.c === j).sort((a, b) => a.r - b.r);
            for (let k = 0; k < colNodes.length; k++) {
                const a = colNodes[k], b = colNodes[k + 1];
                if (b) renderer.drawArrow(cx(j), cy(a.r) + cellH / 2 - 4, cx(j), cy(b.r) - cellH / 2 + 4, C.green);
                else renderer.drawText('∅', cx(j), cy(a.r) + cellH / 2 + 12, C.sub, 12);
            }
            if (colNodes.length === 0) renderer.drawText('∅', cx(j), padT + 8, C.sub, 12);
        }
        renderer.drawText('横箭头 = right（行链表）· 竖箭头 = down（列链表）· 黄色 = 最新链入的结点', renderer.width / 2, renderer.height - 16, C.sub, 11);
    }

    /** 广义表渲染：表头(紫)/原子/子表结点横向 tlink 链 + hlink 垂直下钻 */
    function renderGList(renderer, step) {
        const root = step.root;
        const W = renderer.width, H = renderer.height;
        if (!root) { renderer.drawText('（空）', W / 2, H / 2, C.sub, 14); return; }
        const highlights = step.highlights || {};

        // 尺寸自适应：整体放不下时等比压缩结点宽与间距
        let elemW = 62, hdrW = 42, gapX = 26;
        const nodeH = 30, pad = 34;
        const availW = Math.max(W - pad * 2, 120);
        function slotW(node) {
            return node.utype === 2 ? Math.max(elemW, hdrW + gapX + chainW(node.hlink.tlink)) : elemW;
        }
        function chainW(node) {
            let w = 0;
            for (let p = node; p; p = p.tlink) w += slotW(p) + gapX;
            return Math.max(0, w - gapX);
        }
        if (hdrW + gapX + chainW(root.tlink) > availW) {
            const f = availW / (hdrW + gapX + chainW(root.tlink));
            elemW = Math.max(34, Math.floor(elemW * f));
            hdrW = Math.max(26, Math.floor(hdrW * f));
            gapX = Math.max(8, Math.floor(gapX * f));
        }
        const totalW = hdrW + gapX + chainW(root.tlink);
        const x0 = Math.max(pad, (W - totalW) / 2);

        // 布局：tp 链同行横排，子表整体下移一行
        const pos = new Map();
        let maxDepth = 0;
        (function placeChain(node, x, depth) {
            for (let p = node; p; p = p.tlink) {
                const sw = slotW(p);
                pos.set(p.id, { x: x + sw / 2, d: depth, node: p, header: false });
                if (p.utype === 2 && p.hlink) {
                    const hangW = hdrW + gapX + chainW(p.hlink.tlink);
                    const hx = x + Math.max(0, (sw - hangW) / 2);
                    pos.set(p.hlink.id, { x: hx + hdrW / 2, d: depth + 1, node: p.hlink, header: true });
                    if (depth + 1 > maxDepth) maxDepth = depth + 1;
                    placeChain(p.hlink.tlink, hx + hdrW + gapX, depth + 1);
                }
                x += sw + gapX;
            }
        })(root.tlink, hdrW + gapX, 0);
        pos.set(root.id, { x: 0, d: 0, node: root, header: true });

        const rowH = Math.min(86, (H - 96) / Math.max(maxDepth, 1));
        const cellY = (d) => 52 + d * rowH;
        const widthOf = (p) => p.header ? hdrW : elemW;

        // 表名 L 与指向根表头的箭头
        renderer.drawText('L', x0 - 16, cellY(0) + nodeH / 2, C.label, 12);
        renderer.drawArrow(x0 - 8, cellY(0) + nodeH / 2, x0 - 1, cellY(0) + nodeH / 2, '#777777');

        // 结点本体
        for (const p of pos.values()) {
            const cx = x0 + p.x, top = cellY(p.d);
            const hl = highlights[p.node.id];
            if (p.header) {
                renderer.drawRoundedRect(cx - hdrW / 2, top, hdrW, nodeH, 4, hl || C.purple, '头');
            } else if (p.node.utype === 1) {
                renderer.drawRect(cx - elemW / 2, top, 15, nodeH, '#8aa0b8', '1');
                renderer.drawRect(cx - elemW / 2 + 15, top, elemW - 15, nodeH, hl || C.blue, String(p.node.value));
            } else {
                renderer.drawRect(cx - elemW / 2, top, 15, nodeH, '#8aa0b8', '2');
                renderer.drawRect(cx - elemW / 2 + 15, top, elemW - 15, nodeH, hl || C.blue, '▼');
            }
        }

        // 指针：tlink 同层横箭头 / hlink 下钻箭头 / 链尾 ∧
        for (const p of pos.values()) {
            const cy = cellY(p.d) + nodeH / 2;
            const right = x0 + p.x + widthOf(p) / 2;
            if (p.node.tlink) {
                const t = pos.get(p.node.tlink.id);
                if (t) renderer.drawArrow(right + 1, cy, x0 + t.x - widthOf(t) / 2 - 2, cy, '#777777');
            } else {
                renderer.drawText('∧', right + 11, cy, '#999999', 12);
            }
            if (p.node.utype === 2 && p.node.hlink) {
                const h = pos.get(p.node.hlink.id);
                if (h) renderer.drawArrow(x0 + p.x, cellY(p.d) + nodeH + 1, x0 + h.x, cellY(p.d + 1) - 2, C.purple);
            }
        }

        if (step.seq) renderer.drawText(step.seq, W / 2, H - 16, '#555555', 20);
        renderer.drawText('头=表头结点(utype=0) · 1|值=原子(utype=1) · 2|▼=子表(utype=2) · 横箭头 tlink · 紫竖箭头 hlink',
            W / 2, H - 50, C.sub, 18);
    }

    /** 统一渲染入口 */
    function render(renderer, step) {
        if (!renderer || !step) return;
        switch (step.type_list) {
            case 'array': return renderArray(renderer, step);
            case 'expr': return renderExpr(renderer, step);
            case 'hanoi': return renderHanoi(renderer, step);
            case 'dp': return renderDP(renderer, step);
            case 'ctree': return renderCTree(renderer, step);
            case 'btree': return renderBTree(renderer, step);
            case 'ortho': return renderOrtho(renderer, step);
            case 'glist': return renderGList(renderer, step);
        }
    }

    /* ══════════════════════ 导出 ══════════════════════ */

    return {
        render,
        arrayInsert,
        arrayDelete,
        circularQueue,
        infixToPostfix,
        hanoi,
        treeTraverse,
        heapBuild,
        heapInsert,
        huffman,
        avlInsert,
        hashProbe,
        topoSort,
        dpLCS,
        dpKnapsack,
        btreeInsert,
        orthoList,
        glistBuild,
        glistHeadTail,
        glistDepth,
        glistPrint,
        glistValidate,
        code: CODE,          // 供 vizView 汇总为右侧代码面板的片段库
    };
})();

window.CourseViz = CourseViz;
