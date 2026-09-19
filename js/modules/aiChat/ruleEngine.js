/* ========================================
   ruleEngine.js - Rule-based Q&A engine for DSA topics
   Uses keyword matching with scoring to find the best answer
   ======================================== */

const RuleEngine = (() => {
  // ─── Rule Database ─────────────────────────────────────────────
  // Each rule: { keywords: [], patterns: [], answer: string, confidence: number, related: string[] }
  // confidence: 0.0–1.0, how specific/authoritative the answer is

  const rules = [
    // ── Chapter 1: 绪论 / Complexity ──────────────────────────────
    {
      id: 'r001',
      keywords: ['时间复杂度', '时间复杂性', '大O', 'O(', 'big o', '复杂度分析'],
      patterns: [/时间复杂度/, /大O表示/, /复杂度.*分析/, /O\(n/],
      answer: `<h4>📊 时间复杂度分析</h4>
<p>时间复杂度用<strong>大O表示法</strong>描述算法运行时间随输入规模增长的趋势：</p>
<ul>
  <li><strong>O(1)</strong> — 常数时间：数组下标访问、哈希表查找</li>
  <li><strong>O(log n)</strong> — 对数时间：二分查找、平衡树操作</li>
  <li><strong>O(n)</strong> — 线性时间：遍历数组、链表</li>
  <li><strong>O(n log n)</strong> — 归并排序、堆排序、快速排序(平均)</li>
  <li><strong>O(n²)</strong> — 冒泡排序、选择排序、嵌套循环</li>
  <li><strong>O(2ⁿ)</strong> — 指数级：暴力穷举、递归斐波那契</li>
</ul>
<p><strong>分析方法：</strong></p>
<pre>for(i=0; i&lt;n; i++)        // 外层 n 次
  for(j=0; j&lt;i; j++)     // 内层 i 次
    sum++;               // 总次数 = 1+2+...+n = n(n+1)/2 → O(n²)</pre>
<p>💡 <strong>口诀：</strong>忽略常数、保留最高阶、去掉系数。</p>`,
      confidence: 0.95,
      related: ['空间复杂度', '算法效率', '排序算法比较']
    },
    {
      id: 'r002',
      keywords: ['空间复杂度', '空间', '内存', 'extra space', 'auxiliary'],
      patterns: [/空间复杂度/, /占用.*内存/, /额外空间/],
      answer: `<h4>💾 空间复杂度分析</h4>
<p>空间复杂度衡量算法运行所需的<strong>额外内存空间</strong>：</p>
<ul>
  <li><strong>O(1)</strong> — 原地算法：冒泡排序、堆排序、双指针</li>
  <li><strong>O(log n)</strong> — 递归调用栈深度：快排(平均)、二分查找递归版</li>
  <li><strong>O(n)</strong> — 需要辅助数组：归并排序、计数排序</li>
  <li><strong>O(n²)</strong> — 二维DP表、邻接矩阵</li>
</ul>
<p><strong>常见空间优化技巧：</strong></p>
<ol>
  <li>用<strong>滚动数组</strong>减少DP空间（如斐波那契从O(n)→O(1)）</li>
  <li>用<strong>原地操作</strong>代替辅助数组（如原地反转链表）</li>
  <li>用<strong>位运算</strong>代替布尔数组</li>
  <li>用<strong>迭代</strong>代替递归（消除调用栈）</li>
</ol>
<p>💡 注意：递归算法的空间复杂度 = 递归深度 × 每层栈帧大小。</p>`,
      confidence: 0.93,
      related: ['时间复杂度', '递归', '动态规划']
    },
    {
      id: 'r003',
      keywords: ['算法特性', '算法定义', '五个特性', '有穷性', '确定性'],
      patterns: [/算法.*特性/, /算法.*定义/, /什么是算法/],
      answer: `<h4>📝 算法的五个基本特性</h4>
<ol>
  <li><strong>有穷性 (Finiteness)</strong> — 算法必须在有限步骤内终止</li>
  <li><strong>确定性 (Definiteness)</strong> — 每一步骤有明确定义，无歧义</li>
  <li><strong>可行性 (Feasibility)</strong> — 每步操作可通过基本运算实现</li>
  <li><strong>输入 (Input)</strong> — 有零个或多个输入</li>
  <li><strong>输出 (Output)</strong> — 有一个或多个输出</li>
</ol>
<p><strong>好算法还应满足：</strong></p>
<ul>
  <li>✅ 正确性 — 对所有合法输入产生正确结果</li>
  <li>✅ 可读性 — 便于理解、交流、维护</li>
  <li>✅ 健壮性 — 对非法输入能妥善处理</li>
  <li>✅ 高效率 — 时间/空间复杂度优</li>
</ul>`,
      confidence: 0.95,
      related: ['时间复杂度', '空间复杂度']
    },
    {
      id: 'r004',
      keywords: ['数据结构', '逻辑结构', '存储结构', '物理结构', '什么是数据结构'],
      patterns: [/什么是数据结构/, /数据结构.*定义/, /逻辑结构.*存储/],
      answer: `<h4>🏗️ 数据结构概述</h4>
<p><strong>数据结构</strong> = 数据元素 + 元素间关系 + 存储方式 + 操作集合</p>
<h5>逻辑结构（4种）：</h5>
<ul>
  <li><strong>集合</strong> — 元素间无特定关系</li>
  <li><strong>线性结构</strong> — 一对一（数组、链表、栈、队列）</li>
  <li><strong>树形结构</strong> — 一对多（二叉树、堆）</li>
  <li><strong>图状结构</strong> — 多对多（有向图、无向图）</li>
</ul>
<h5>存储结构（4种）：</h5>
<ul>
  <li><strong>顺序存储</strong> — 连续内存，支持随机访问</li>
  <li><strong>链式存储</strong> — 指针连接，动态分配</li>
  <li><strong>索引存储</strong> — 附加索引表</li>
  <li><strong>散列存储</strong> — 哈希函数映射</li>
</ul>`,
      confidence: 0.94,
      related: ['线性表', '树', '图']
    },

    // ── Chapter 2: 线性表 ─────────────────────────────────────────
    {
      id: 'r010',
      keywords: ['顺序表', '数组', '顺序存储', '线性表顺序', 'array'],
      patterns: [/顺序表/, /顺序存储/, /数组.*实现/],
      answer: `<h4>📋 顺序表 (Sequential List)</h4>
<p>用<strong>连续内存</strong>存储的线性表，支持随机访问。</p>
<pre>struct SeqList {
    int data[MAXSIZE];
    int length;
};</pre>
<p><strong>操作复杂度：</strong></p>
<table>
  <tr><th>操作</th><th>时间</th><th>说明</th></tr>
  <tr><td>按下标访问</td><td>O(1)</td><td>随机访问</td></tr>
  <tr><td>按值查找</td><td>O(n)</td><td>顺序扫描</td></tr>
  <tr><td>插入</td><td>O(n)</td><td>平均移动 n/2 个元素</td></tr>
  <tr><td>删除</td><td>O(n)</td><td>平均移动 (n-1)/2 个元素</td></tr>
</table>
<p>✅ <strong>优点：</strong>随机访问、存储密度高<br>
❌ <strong>缺点：</strong>插入删除需移动元素、需预分配空间</p>`,
      confidence: 0.93,
      related: ['链表', '顺序表vs链表']
    },
    {
      id: 'r011',
      keywords: ['链表', '单链表', 'linked list', '头结点', '指针'],
      patterns: [/链表/, /单链表/, /linked list/i, /头结点/],
      answer: `<h4>🔗 链表 (Linked List)</h4>
<p>用<strong>指针</strong>连接的离散存储线性表。</p>
<pre>struct Node {
    int data;
    struct Node* next;
};</pre>
<p><strong>操作复杂度：</strong></p>
<table>
  <tr><th>操作</th><th>时间</th><th>说明</th></tr>
  <tr><td>按下标访问</td><td>O(n)</td><td>顺序遍历</td></tr>
  <tr><td>已知位置插入/删除</td><td>O(1)</td><td>只改指针</td></tr>
  <tr><td>按值查找后插入/删除</td><td>O(n)</td><td>需先找到位置</td></tr>
</table>
<p><strong>头结点的作用：</strong></p>
<ul>
  <li>统一空表和非空表的处理</li>
  <li>统一首结点和其他结点的操作</li>
</ul>
<p>💡 <strong>经典操作：</strong>反转链表只需三个指针原地交换，O(n)时间 O(1)空间。</p>`,
      confidence: 0.94,
      related: ['顺序表', '循环链表', '双向链表']
    },
    {
      id: 'r012',
      keywords: ['顺序表', '链表', '比较', 'vs', '对比', '哪个好'],
      patterns: [/顺序表.*链表.*比较/, /链表.*顺序表.*区别/, /比较.*存储/],
      answer: `<h4>⚖️ 顺序表 vs 链表</h4>
<table>
  <tr><th>特性</th><th>顺序表</th><th>链表</th></tr>
  <tr><td>存储方式</td><td>连续内存</td><td>离散内存+指针</td></tr>
  <tr><td>随机访问</td><td>✅ O(1)</td><td>❌ O(n)</td></tr>
  <tr><td>插入/删除</td><td>O(n) 移动元素</td><td>O(1) 改指针(已知位置)</td></tr>
  <tr><td>存储密度</td><td>高（全部数据）</td><td>低（额外指针空间）</td></tr>
  <tr><td>容量</td><td>固定/需扩容</td><td>动态分配</td></tr>
  <tr><td>缓存友好</td><td>✅ 空间局部性好</td><td>❌ 指针跳跃</td></tr>
</table>
<p><strong>选择建议：</strong></p>
<ul>
  <li>频繁<strong>查找</strong>、数据量固定 → 顺序表</li>
  <li>频繁<strong>插入/删除</strong>、数据量不确定 → 链表</li>
</ul>`,
      confidence: 0.95,
      related: ['顺序表', '链表', '线性表应用']
    },

    // ── Chapter 3: 栈与队列 ───────────────────────────────────────
    {
      id: 'r020',
      keywords: ['栈', 'stack', 'LIFO', '后进先出', '压栈', '出栈', '入栈'],
      patterns: [/栈.*定义/, /什么是栈/, /栈.*特点/, /LIFO/i],
      answer: `<h4>📚 栈 (Stack) — 后进先出 LIFO</h4>
<p>只允许在<strong>一端（栈顶）</strong>进行插入和删除的线性表。</p>
<pre>// 顺序栈
struct Stack {
    int data[MAXSIZE];
    int top;  // 栈顶指针，初始为 -1
};
// 入栈
void push(Stack* s, int x) {
    s->data[++s->top] = x;
}
// 出栈
int pop(Stack* s) {
    return s->data[s->top--];
}</pre>
<p><strong>典型应用：</strong></p>
<ul>
  <li>🧮 表达式求值（中缀→后缀）</li>
  <li>🔗 括号匹配</li>
  <li>🌲 递归的调用栈</li>
  <li>🔄 DFS深度优先搜索</li>
  <li>↩️ 浏览器后退/撤销操作</li>
</ul>`,
      confidence: 0.95,
      related: ['队列', '表达式求值', 'DFS']
    },
    {
      id: 'r021',
      keywords: ['队列', 'queue', 'FIFO', '先进先出', '循环队列', '队头', '队尾'],
      patterns: [/队列/, /循环队列/, /FIFO/i, /队满/, /队空/],
      answer: `<h4>🚶 队列 (Queue) — 先进先出 FIFO</h4>
<p>在<strong>队尾</strong>插入、<strong>队头</strong>删除的线性表。</p>
<h5>循环队列（数组实现）</h5>
<pre>// 大小为 m 的数组，牺牲一格区分队满队空
队空: front == rear
队满: (rear + 1) % m == front
队长: (rear - front + m) % m
入队: data[rear] = x; rear = (rear+1) % m;
出队: x = data[front]; front = (front+1) % m;</pre>
<p><strong>为什么用循环队列？</strong></p>
<p>普通顺序队列出队后，前面的空间无法利用（"假溢出"），循环队列用取模运算让数组首尾相连。</p>
<p><strong>典型应用：</strong></p>
<ul>
  <li>🌐 BFS广度优先搜索</li>
  <li>📋 任务调度 / 缓冲区</li>
  <li>🌲 二叉树的层序遍历</li>
</ul>`,
      confidence: 0.95,
      related: ['栈', 'BFS', '循环队列']
    },
    {
      id: 'r022',
      keywords: ['表达式', '中缀', '后缀', '前缀', '波兰', '逆波兰'],
      patterns: [/表达式求值/, /中缀.*后缀/, /逆波兰/, /后缀表达式/],
      answer: `<h4>🧮 表达式求值与转换</h4>
<p><strong>三种表示法：</strong></p>
<ul>
  <li><strong>中缀</strong>：a + b * c（人读，需括号明确优先级）</li>
  <li><strong>后缀（逆波兰）</strong>：a b c * +（机器用，无需括号）</li>
  <li><strong>前缀（波兰）</strong>：+ a * b c</li>
</ul>
<h5>中缀→后缀 算法（栈辅助）：</h5>
<ol>
  <li>操作数 → 直接输出</li>
  <li>左括号 → 入栈</li>
  <li>右括号 → 弹出至左括号</li>
  <li>运算符 → 弹出优先级 ≥ 自己的，然后入栈</li>
  <li>遍历完 → 弹出栈中所有运算符</li>
</ol>
<h5>后缀求值（栈辅助）：</h5>
<ol>
  <li>遇到操作数 → 入栈</li>
  <li>遇到运算符 → 弹两个操作数计算，结果入栈</li>
  <li>最后栈顶就是结果</li>
</ol>`,
      confidence: 0.92,
      related: ['栈', '中缀转后缀']
    },

    // ── Chapter 4: 串 ────────────────────────────────────────────
    {
      id: 'r025',
      keywords: ['KMP', '模式匹配', '字符串匹配', 'next数组', 'BF'],
      patterns: [/KMP/, /模式匹配/, /next.*数组/, /字符串.*匹配/],
      answer: `<h4>🔤 字符串模式匹配</h4>
<h5>BF暴力法 — O(n×m)</h5>
<p>逐字符比较，失配时主串回退到下一个起始位置。</p>
<h5>KMP算法 — O(n+m)</h5>
<p>核心思想：<strong>利用已匹配的信息，主串不回退</strong>。</p>
<p><strong>next数组</strong>：记录模式串每个位置的最长相等前后缀长度。</p>
<pre>// next数组计算
void getNext(char* p, int next[]) {
    int i = 0, j = -1;
    next[0] = -1;
    while (i < strlen(p)) {
        if (j == -1 || p[i] == p[j]) {
            i++; j++;
            next[i] = j;
        } else {
            j = next[j];  // 回退
        }
    }
}</pre>
<p>💡 <strong>next数组含义</strong>：当p[i]失配时，模式串回退到 next[i] 处继续比较。</p>`,
      confidence: 0.93,
      related: ['BF算法', '字符串']
    },

    // ── Chapter 5: 树与二叉树 ─────────────────────────────────────
    {
      id: 'r030',
      keywords: ['二叉树', '遍历', '前序', '中序', '后序', '层序', 'inorder', 'preorder', 'postorder'],
      patterns: [/二叉树.*遍历/, /前序.*中序.*后序/, /遍历.*顺序/],
      answer: `<h4>🌲 二叉树的四种遍历</h4>
<pre>    A
   / \\
  B   C
 / \\   \\
D   E   F</pre>
<table>
  <tr><th>遍历方式</th><th>顺序</th><th>结果</th></tr>
  <tr><td>前序(Pre-order)</td><td>根→左→右</td><td>A B D E C F</td></tr>
  <tr><td>中序(In-order)</td><td>左→根→右</td><td>D B E A C F</td></tr>
  <tr><td>后序(Post-order)</td><td>左→右→根</td><td>D E B F C A</td></tr>
  <tr><td>层序(Level-order)</td><td>逐层从左到右</td><td>A B C D E F</td></tr>
</table>
<pre>// 递归实现（以中序为例）
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);    // 左
    visit(root);            // 根
    inorder(root->right);   // 右
}</pre>
<p>💡 <strong>层序遍历</strong>用队列实现；前三种用栈（或递归调用栈）。</p>
<p>📌 <strong>重要：</strong>中序遍历BST可得到有序序列！</p>`,
      confidence: 0.96,
      related: ['二叉排序树', '线索二叉树', '哈夫曼树']
    },
    {
      id: 'r031',
      keywords: ['二叉排序树', 'BST', '二叉搜索树', 'binary search tree'],
      patterns: [/二叉排序树/, /BST/i, /二叉搜索树/],
      answer: `<h4>🔍 二叉排序树 (BST)</h4>
<p><strong>性质：</strong>左子树所有节点 < 根节点 < 右子树所有节点</p>
<pre>// 查找
Node* search(Node* root, int key) {
    if (!root || root->data == key) return root;
    if (key < root->data) return search(root->left);
    return search(root->right);
}
// 插入
void insert(Node** root, int key) {
    if (!*root) { *root = newNode(key); return; }
    if (key < (*root)->data) insert(&(*root)->left, key);
    else if (key > (*root)->data) insert(&(*root)->right, key);
}</pre>
<p><strong>复杂度：</strong></p>
<table>
  <tr><th>操作</th><th>平衡时</th><th>退化(链表)</th></tr>
  <tr><td>查找</td><td>O(log n)</td><td>O(n)</td></tr>
  <tr><td>插入</td><td>O(log n)</td><td>O(n)</td></tr>
  <tr><td>删除</td><td>O(log n)</td><td>O(n)</td></tr>
</table>
<p>💡 <strong>平衡BST</strong>（AVL、红黑树）通过旋转保持O(log n)。</p>`,
      confidence: 0.94,
      related: ['平衡二叉树', 'B树', '二叉树遍历']
    },
    {
      id: 'r032',
      keywords: ['哈夫曼', 'Huffman', '最优二叉树', '编码', 'WPL'],
      patterns: [/哈夫曼/, /Huffman/i, /最优.*树/, /WPL/],
      answer: `<h4>🌳 哈夫曼树与编码</h4>
<p><strong>目标：</strong>构造带权路径长度(WPL)最小的二叉树。</p>
<h5>构造步骤：</h5>
<ol>
  <li>将所有权值看作独立节点，组成森林</li>
  <li>选两个<strong>最小权值</strong>节点作为新节点的左右子</li>
  <li>新节点权值 = 两子节点权值之和，放回森林</li>
  <li>重复直到只剩一棵树</li>
</ol>
<h5>哈夫曼编码：</h5>
<ul>
  <li>左分支标0，右分支标1</li>
  <li>从根到叶子的路径 = 该字符的编码</li>
  <li>✅ <strong>前缀编码</strong>：任何字符编码不是其他字符编码的前缀</li>
  <li>✅ 频率高的字符 → 短编码（离根近）</li>
</ul>
<p>💡 <strong>性质：</strong>n个叶子 → 哈夫曼树共 2n-1 个节点，无度为1的节点。</p>`,
      confidence: 0.93,
      related: ['二叉树', '二叉树遍历']
    },
    {
      id: 'r033',
      keywords: ['二叉树性质', '叶子', '深度', '高度', '满二叉树', '完全二叉树', 'n0', 'n2'],
      patterns: [/二叉树.*性质/, /满二叉树/, /完全二叉树/, /叶子.*结点/],
      answer: `<h4>🌿 二叉树的重要性质</h4>
<ol>
  <li>第 i 层最多 <strong>2^(i-1)</strong> 个节点</li>
  <li>深度为 k 的二叉树最多 <strong>2^k - 1</strong> 个节点</li>
  <li><strong>n₀ = n₂ + 1</strong>（叶子数 = 度为2的节点数 + 1）</li>
  <li>有 n 个节点的完全二叉树深度 = ⌊log₂n⌋ + 1</li>
  <li>完全二叉树中，节点 i 的：
    <ul>
      <li>父节点：⌊i/2⌋</li>
      <li>左孩子：2i</li>
      <li>右孩子：2i+1</li>
    </ul>
  </li>
</ol>
<p><strong>满二叉树 vs 完全二叉树：</strong></p>
<ul>
  <li><strong>满二叉树</strong>：每层都是满的，所有叶子在同一层</li>
  <li><strong>完全二叉树</strong>：除最后一层外都满，最后一层靠左排列</li>
</ul>
<p>💡 完全二叉树可以用<strong>数组</strong>高效存储（利用性质5）。</p>`,
      confidence: 0.95,
      related: ['二叉树遍历', '堆排序']
    },

    // ── Chapter 6: 图 ─────────────────────────────────────────────
    {
      id: 'r040',
      keywords: ['图', '有向图', '无向图', '邻接矩阵', '邻接表', 'graph'],
      patterns: [/图.*存储/, /邻接矩阵/, /邻接表/, /图的表示/],
      answer: `<h4>🕸️ 图的存储方式</h4>
<h5>1. 邻接矩阵 — O(V²)</h5>
<pre>int adj[MAXV][MAXV];  // adj[i][j] = 1 表示有边
// 无向图：对称矩阵
// 带权图：adj[i][j] = weight</pre>
<p>✅ 查询边 O(1)  ❌ 空间 O(V²) 不适合稀疏图</p>

<h5>2. 邻接表 — O(V + E)</h5>
<pre>struct Edge { int to; int weight; Edge* next; };
Edge* head[MAXV];  // 头指针数组</pre>
<p>✅ 空间省  ❌ 查询特定边需遍历链表</p>

<table>
  <tr><th>特性</th><th>邻接矩阵</th><th>邻接表</th></tr>
  <tr><td>空间</td><td>O(V²)</td><td>O(V+E)</td></tr>
  <tr><td>查询边</td><td>O(1)</td><td>O(degree)</td></tr>
  <tr><td>适合</td><td>稠密图</td><td>稀疏图</td></tr>
</table>`,
      confidence: 0.93,
      related: ['DFS', 'BFS', '最短路径']
    },
    {
      id: 'r041',
      keywords: ['DFS', '深度优先', 'BFS', '广度优先', '遍历图'],
      patterns: [/DFS/, /BFS/, /深度优先/, /广度优先/, /图.*遍历/],
      answer: `<h4>🔎 图的遍历：DFS & BFS</h4>
<h5>DFS（深度优先搜索）— 用栈/递归</h5>
<pre>void dfs(int u) {
    visited[u] = true;
    visit(u);
    for (int v : adj[u])
        if (!visited[v]) dfs(v);
}</pre>
<p>类比：走迷宫，一条路走到黑，走不通就回头换路。</p>

<h5>BFS（广度优先搜索）— 用队列</h5>
<pre>void bfs(int start) {
    queue q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        visit(u);
        for (int v : adj[u])
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
    }
}</pre>
<p>类比：水波纹扩散，一层层向外。</p>
<p>⏱️ 两者时间复杂度均为 <strong>O(V + E)</strong>。</p>`,
      confidence: 0.95,
      related: ['图存储', '最短路径', '拓扑排序']
    },
    {
      id: 'r042',
      keywords: ['最短路径', 'Dijkstra', '迪杰斯特拉', 'Floyd', '弗洛伊德', 'Bellman'],
      patterns: [/最短路径/, /Dijkstra/i, /Floyd/i, /Bellman/i],
      answer: `<h4>🛤️ 最短路径算法</h4>
<h5>Dijkstra（单源，无负权）— O(V²) 或 O((V+E)log V)</h5>
<p>贪心策略：每次选距离最小的未访问节点扩展。</p>
<pre>dist[] = {∞, ..., ∞}; dist[src] = 0;
for i = 0 to V-1:
    u = 未访问中 dist 最小的
    visited[u] = true
    for each edge (u, v, w):
        dist[v] = min(dist[v], dist[u] + w)</pre>
<p>❌ 不能处理<strong>负权边</strong>（贪心假设被违反）</p>

<h5>Floyd（全源）— O(V³)</h5>
<pre>for k = 0 to V-1:
  for i = 0 to V-1:
    for j = 0 to V-1:
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</pre>
<p>✅ 能处理负权边 ❌ 不能处理负权环</p>

<table>
  <tr><th>算法</th><th>类型</th><th>复杂度</th><th>负权</th></tr>
  <tr><td>Dijkstra</td><td>单源</td><td>O(V²)</td><td>❌</td></tr>
  <tr><td>Bellman-Ford</td><td>单源</td><td>O(VE)</td><td>✅</td></tr>
  <tr><td>Floyd</td><td>全源</td><td>O(V³)</td><td>✅</td></tr>
</table>`,
      confidence: 0.94,
      related: ['图遍历', '最小生成树']
    },
    {
      id: 'r043',
      keywords: ['最小生成树', 'Kruskal', '克鲁斯卡尔', 'Prim', '普里姆', 'MST'],
      patterns: [/最小生成树/, /Kruskal/i, /Prim/i, /MST/],
      answer: `<h4>🌲 最小生成树 (MST)</h4>
<p>连通图的生成树中，边权之和最小的。</p>

<h5>Kruskal（按边）— O(E log E)</h5>
<ol>
  <li>所有边按权值排序</li>
  <li>从小到大选边，若不形成环则加入（用<strong>并查集</strong>判环）</li>
  <li>选够 V-1 条边停止</li>
</ol>
<p>适合<strong>稀疏图</strong>。</p>

<h5>Prim（按点）— O(V²) 或 O(E log V)</h5>
<ol>
  <li>从任意点开始，加入已访问集合</li>
  <li>选连接已访问/未访问集合的最小权边</li>
  <li>将新点加入已访问集合，重复直到所有点都在</li>
</ol>
<p>适合<strong>稠密图</strong>。</p>`,
      confidence: 0.93,
      related: ['图遍历', '最短路径', '并查集']
    },
    {
      id: 'r044',
      keywords: ['拓扑排序', 'topological', 'AOV', '有向无环图', 'DAG'],
      patterns: [/拓扑排序/, /DAG/, /AOV/i],
      answer: `<h4>📊 拓扑排序 (Topological Sort)</h4>
<p>对<strong>有向无环图(DAG)</strong>的顶点排序，使得对每条边(u→v)，u都在v前面。</p>
<h5>Kahn算法（BFS）：</h5>
<ol>
  <li>计算所有节点的入度</li>
  <li>入度为0的入队</li>
  <li>出队一个节点，输出它，将其邻接点入度-1</li>
  <li>邻接点入度变为0则入队</li>
  <li>重复直到队空</li>
</ol>
<p>若输出节点数 < 总节点数 → 图<strong>有环</strong>！</p>
<p><strong>应用：</strong>课程先修关系、编译依赖、任务调度。</p>`,
      confidence: 0.92,
      related: ['图遍历', 'DFS']
    },

    // ── Chapter 7: 查找 ───────────────────────────────────────────
    {
      id: 'r050',
      keywords: ['二分查找', '折半查找', 'binary search', '二分搜索'],
      patterns: [/二分查找/, /折半查找/, /binary.*search/i],
      answer: `<h4>🔍 二分查找 (Binary Search)</h4>
<p>在<strong>有序顺序表</strong>中高效查找，每次排除一半。</p>
<pre>int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;  // 防溢出
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;  // 未找到
}</pre>
<p><strong>复杂度：</strong>O(log n)，最多比较 ⌊log₂n⌋ + 1 次</p>
<p><strong>条件：</strong>① 顺序存储 ② 元素有序</p>
<p>💡 <strong>注意：</strong>二分查找不适合链表（无法O(1)访问中间元素）。</p>
<p>📌 <strong>变体：</strong>查找第一个/最后一个等于target的位置、查找第一个≥target的位置。</p>`,
      confidence: 0.96,
      related: ['二叉排序树', '分治法']
    },
    {
      id: 'r051',
      keywords: ['哈希', '散列', 'hash', '冲突', '开放定址', '链地址', '装填因子'],
      patterns: [/哈希表/, /散列表/, /hash/i, /哈希冲突/, /散列冲突/],
      answer: `<h4>🗂️ 散列表 (Hash Table)</h4>
<p>通过<strong>哈希函数</strong>将键映射到数组下标，实现近似O(1)的查找。</p>
<h5>常用哈希函数：</h5>
<ul>
  <li><strong>直接定址法</strong>：H(key) = a·key + b</li>
  <li><strong>除留余数法</strong>：H(key) = key % p（p取≤表长的最大素数）</li>
  <li><strong>数字分析法</strong>：取数字分布均匀的几位</li>
</ul>
<h5>冲突处理：</h5>
<table>
  <tr><th>方法</th><th>策略</th></tr>
  <tr><td>开放定址法</td><td>线性探测 d=1,2,3... / 二次探测 d=1²,-1²,2²...</td></tr>
  <tr><td>链地址法</td><td>每个槽位挂链表（最常用）</td></tr>
  <tr><td>再哈希法</td><td>换另一个哈希函数</td></tr>
</table>
<p><strong>装填因子 α</strong> = 表中元素数/表长。α越大冲突越多。</p>
<p>💡 平均查找长度取决于<strong>哈希函数</strong>、<strong>冲突处理</strong>和<strong>装填因子</strong>。</p>`,
      confidence: 0.93,
      related: ['二分查找', '二叉排序树']
    },
    {
      id: 'r052',
      keywords: ['平衡二叉树', 'AVL', '旋转', 'LL', 'RR', 'LR', 'RL'],
      patterns: [/AVL/i, /平衡二叉树/, /平衡因子/, /旋转/],
      answer: `<h4>⚖️ 平衡二叉树 (AVL Tree)</h4>
<p><strong>定义：</strong>任意节点的左右子树高度差 ≤ 1（平衡因子 ∈ {-1, 0, 1}）</p>
<h5>四种旋转调整：</h5>
<ul>
  <li><strong>LL旋转</strong>（右单旋）：在左孩子的左子树插入</li>
  <li><strong>RR旋转</strong>（左单旋）：在右孩子的右子树插入</li>
  <li><strong>LR旋转</strong>（先左后右）：在左孩子的右子树插入</li>
  <li><strong>RL旋转</strong>（先右后左）：在右孩子的左子树插入</li>
</ul>
<p>保证查找始终为 <strong>O(log n)</strong>。</p>
<p>💡 <strong>记忆口诀：</strong>哪边高就往反方向旋。LR/RL需要两次旋转。</p>`,
      confidence: 0.92,
      related: ['二叉排序树', 'B树', '红黑树']
    },

    // ── Chapter 8: 排序 ───────────────────────────────────────────
    {
      id: 'r060',
      keywords: ['冒泡排序', 'bubble sort', '冒泡'],
      patterns: [/冒泡排序/, /bubble.*sort/i],
      answer: `<h4>🫧 冒泡排序 (Bubble Sort)</h4>
<p>相邻元素两两比较，大的"冒泡"到后面。</p>
<pre>void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // 优化：已有序则提前退出
    }
}</pre>
<table>
  <tr><th>最佳</th><th>平均</th><th>最坏</th><th>空间</th><th>稳定</th></tr>
  <tr><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✅</td></tr>
</table>`,
      confidence: 0.94,
      related: ['选择排序', '插入排序', '排序比较']
    },
    {
      id: 'r061',
      keywords: ['快速排序', 'quick sort', '快排', 'partition', 'pivot'],
      patterns: [/快速排序/, /quick.*sort/i, /快排/],
      answer: `<h4>⚡ 快速排序 (Quick Sort)</h4>
<p>选基准(pivot)，分区(partition)：小的左边，大的右边，递归。</p>
<pre>void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivot = partition(arr, low, high);
        quickSort(arr, low, pivot - 1);
        quickSort(arr, pivot + 1, high);
    }
}
int partition(int arr[], int low, int high) {
    int pivot = arr[high];  // 取最后元素
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot)
            swap(arr[++i], arr[j]);
    }
    swap(arr[i+1], arr[high]);
    return i + 1;
}</pre>
<table>
  <tr><th>最佳</th><th>平均</th><th>最坏</th><th>空间</th><th>稳定</th></tr>
  <tr><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>❌</td></tr>
</table>
<p>⚠️ <strong>最坏情况</strong>：数组已有序+取首/末元素作pivot → 退化为O(n²)</p>
<p>💡 <strong>优化</strong>：随机选pivot / 三数取中 / 小数组切插入排序</p>`,
      confidence: 0.95,
      related: ['归并排序', '堆排序', '分治法', '排序比较']
    },
    {
      id: 'r062',
      keywords: ['归并排序', 'merge sort', '归并'],
      patterns: [/归并排序/, /merge.*sort/i],
      answer: `<h4>🔀 归并排序 (Merge Sort)</h4>
<p>分治策略：分成两半→分别排序→合并。</p>
<pre>void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int mid = l + (r-l)/2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid+1, r);
    merge(arr, l, mid, r);  // 合并两个有序段
}
void merge(int arr[], int l, int mid, int r) {
    int temp[r-l+1];
    int i=l, j=mid+1, k=0;
    while (i<=mid && j<=r)
        temp[k++] = arr[i]<=arr[j] ? arr[i++] : arr[j++];
    while (i<=mid) temp[k++] = arr[i++];
    while (j<=r) temp[k++] = arr[j++];
    for (i=0; i<k; i++) arr[l+i] = temp[i];
}</pre>
<table>
  <tr><th>最佳</th><th>平均</th><th>最坏</th><th>空间</th><th>稳定</th></tr>
  <tr><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>✅</td></tr>
</table>
<p>💡 归并排序<strong>稳定且最坏也是O(n log n)</strong>，但需要O(n)额外空间。</p>`,
      confidence: 0.94,
      related: ['快速排序', '堆排序', '排序比较']
    },
    {
      id: 'r063',
      keywords: ['堆排序', 'heap sort', '堆', '大顶堆', '小顶堆', 'heapify'],
      patterns: [/堆排序/, /heap.*sort/i, /大顶堆/, /小顶堆/],
      answer: `<h4>🏔️ 堆排序 (Heap Sort)</h4>
<p>利用<strong>大顶堆</strong>性质：堆顶最大，交换到末尾，调整堆。</p>
<pre>void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2*i+1, right = 2*i+2;
    if (left<n && arr[left]>arr[largest]) largest = left;
    if (right<n && arr[right]>arr[largest]) largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i=n/2-1; i>=0; i--) heapify(arr, n, i); // 建堆
    for (int i=n-1; i>0; i--) {
        swap(arr[0], arr[i]);      // 堆顶→末尾
        heapify(arr, i, 0);         // 调整
    }
}</pre>
<table>
  <tr><th>最佳</th><th>平均</th><th>最坏</th><th>空间</th><th>稳定</th></tr>
  <tr><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>❌</td></tr>
</table>
<p>💡 堆排序是<strong>原地排序</strong>且最坏也是O(n log n)，但常数因子比快排大。</p>`,
      confidence: 0.94,
      related: ['快速排序', '归并排序', '排序比较']
    },
    {
      id: 'r064',
      keywords: ['排序比较', '排序算法比较', '排序总结', '哪种排序', '排序哪个好', '排序稳定性'],
      patterns: [/排序.*比较/, /排序.*总结/, /排序.*哪个好/, /排序.*稳定/],
      answer: `<h4>📊 排序算法全面比较</h4>
<table>
  <tr><th>算法</th><th>最佳</th><th>平均</th><th>最坏</th><th>空间</th><th>稳定</th></tr>
  <tr><td>冒泡</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✅</td></tr>
  <tr><td>选择</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>❌</td></tr>
  <tr><td>插入</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✅</td></tr>
  <tr><td>希尔</td><td>O(n log n)</td><td>O(n^1.3)</td><td>O(n²)</td><td>O(1)</td><td>❌</td></tr>
  <tr><td>快速</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>❌</td></tr>
  <tr><td>归并</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>✅</td></tr>
  <tr><td>堆</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>❌</td></tr>
  <tr><td>基数</td><td>O(d(n+r))</td><td>O(d(n+r))</td><td>O(d(n+r))</td><td>O(n+r)</td><td>✅</td></tr>
</table>
<p><strong>记忆口诀 — 不稳定排序：</strong>"<u>快</u>（快速）<u>选</u>（选择）<u>希</u>（希尔）<u>堆</u>（堆排序）"</p>
<p><strong>选择建议：</strong></p>
<ul>
  <li>小规模 → 插入排序</li>
  <li>大规模通用 → 快速排序（平均最快）</li>
  <li>需要稳定 → 归并排序</li>
  <li>需要最坏保证 + 原地 → 堆排序</li>
</ul>`,
      confidence: 0.96,
      related: ['快速排序', '归并排序', '堆排序']
    },
    {
      id: 'r065',
      keywords: ['插入排序', 'insertion sort', '希尔排序', 'shell sort'],
      patterns: [/插入排序/, /insertion.*sort/i, /希尔排序/, /shell.*sort/i],
      answer: `<h4>📌 插入排序 & 希尔排序</h4>
<h5>插入排序 — 类似整理扑克牌</h5>
<pre>void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}</pre>
<p>最佳O(n)（已有序），平均/最坏O(n²)。<strong>稳定</strong>，适合<strong>小规模或基本有序</strong>的数据。</p>

<h5>希尔排序 — 缩小增量排序</h5>
<p>将数组按<strong>增量gap</strong>分组，对每组做插入排序，逐渐减小gap直到1。</p>
<pre>for (gap = n/2; gap > 0; gap /= 2)
    for (i = gap; i < n; i++)
        // 对间隔gap的子序列做插入排序</pre>
<p>时间复杂度取决于增量序列，通常约O(n^1.3)。<strong>不稳定</strong>。</p>`,
      confidence: 0.92,
      related: ['冒泡排序', '排序比较']
    },

    // ── Chapter 9: 分治 ───────────────────────────────────────────
    {
      id: 'r070',
      keywords: ['分治', '分治法', 'divide and conquer', '主定理', 'master theorem'],
      patterns: [/分治法?/, /divide.*conquer/i, /主定理/, /master.*theorem/i],
      answer: `<h4>⚔️ 分治法 (Divide and Conquer)</h4>
<h5>三步策略：</h5>
<ol>
  <li><strong>分解 (Divide)</strong>：将问题分成若干规模更小的子问题</li>
  <li><strong>解决 (Conquer)</strong>：递归求解子问题（基本情况直接解）</li>
  <li><strong>合并 (Combine)</strong>：将子问题的解合并为原问题的解</li>
</ol>
<h5>经典应用：</h5>
<ul>
  <li>归并排序：T(n) = 2T(n/2) + O(n) → O(n log n)</li>
  <li>快速排序：T(n) = 2T(n/2) + O(n) → O(n log n) 平均</li>
  <li>二分查找：T(n) = T(n/2) + O(1) → O(log n)</li>
  <li>Strassen矩阵乘法：O(n^2.81)</li>
</ul>
<h5>主定理 (Master Theorem)：</h5>
<p>对 T(n) = aT(n/b) + f(n)：</p>
<ul>
  <li>若 f(n) = O(n^c), c < log_b(a) → T(n) = O(n^(log_b a))</li>
  <li>若 f(n) = Θ(n^(log_b a)) → T(n) = O(n^(log_b a) · log n)</li>
  <li>若 f(n) = Ω(n^c), c > log_b(a) → T(n) = O(f(n))</li>
</ul>`,
      confidence: 0.94,
      related: ['归并排序', '快速排序', '动态规划']
    },

    // ── Chapter 10: 动态规划 ──────────────────────────────────────
    {
      id: 'r080',
      keywords: ['动态规划', 'DP', 'dynamic programming', '重叠子问题', '最优子结构'],
      patterns: [/动态规划/, /DP/i, /dynamic.*programming/i, /重叠子问题/],
      answer: `<h4>🧩 动态规划 (Dynamic Programming)</h4>
<p><strong>适用条件：</strong></p>
<ol>
  <li><strong>最优子结构</strong>：问题最优解包含子问题最优解</li>
  <li><strong>重叠子问题</strong>：子问题被重复计算（区别于分治法）</li>
</ol>
<h5>解题步骤：</h5>
<ol>
  <li>定义状态（dp数组的含义）</li>
  <li>写状态转移方程</li>
  <li>确定初始条件和边界</li>
  <li>确定计算顺序</li>
  <li>（可选）空间优化</li>
</ol>
<h5>示例：斐波那契</h5>
<pre>// 递归(低效): O(2^n)
fib(n) = fib(n-1) + fib(n-2)

// DP(自底向上): O(n)
dp[0]=0, dp[1]=1
for i=2 to n: dp[i] = dp[i-1] + dp[i-2]

// 空间优化: O(1)
prev=0, curr=1
for i=2 to n: next=prev+curr; prev=curr; curr=next;</pre>
<p>💡 DP vs 分治法：DP的子问题有<strong>重叠</strong>，用备忘录/表格避免重复计算。</p>`,
      confidence: 0.95,
      related: ['背包问题', 'LCS', '分治法']
    },
    {
      id: 'r081',
      keywords: ['背包', '0-1背包', '01背包', 'knapsack', '完全背包'],
      patterns: [/背包问题/, /0.?1背包/, /knapsack/i],
      answer: `<h4>🎒 0-1背包问题</h4>
<p>n个物品（重量w[i]，价值v[i]），背包容量W。每个物品选或不选，使总价值最大。</p>
<h5>状态定义：</h5>
<p>dp[i][j] = 前i个物品、容量j时的最大价值</p>
<h5>状态转移：</h5>
<pre>dp[i][j] = max(
    dp[i-1][j],              // 不选第i个
    dp[i-1][j-w[i]] + v[i]   // 选第i个（需 j ≥ w[i]）
)</pre>
<h5>空间优化（一维数组）：</h5>
<pre>// 倒序遍历容量（避免重复选取）
for i = 1 to n:
    for j = W down to w[i]:
        dp[j] = max(dp[j], dp[j-w[i]] + v[i])</pre>
<p>⏱️ 时间O(nW)，空间O(W)。注意这是<strong>伪多项式</strong>时间。</p>
<p>💡 <strong>完全背包</strong>（物品无限取）：内层循环<strong>正序</strong>即可。</p>`,
      confidence: 0.94,
      related: ['动态规划', 'LCS']
    },
    {
      id: 'r082',
      keywords: ['LCS', '最长公共子序列', '最长递增子序列', 'LIS', '公共子序列'],
      patterns: [/LCS/i, /LIS/i, /最长.*子序列/, /公共子序列/],
      answer: `<h4>🔗 最长公共子序列 (LCS)</h4>
<p>求两个序列的最长公共子序列长度。</p>
<h5>状态转移：</h5>
<pre>if X[i] == Y[j]:
    dp[i][j] = dp[i-1][j-1] + 1
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])</pre>
<p>⏱️ O(mn) 时间，O(mn) 空间。</p>

<h4>📈 最长递增子序列 (LIS)</h4>
<h5>DP解法 O(n²)：</h5>
<pre>dp[i] = 以 arr[i] 结尾的LIS长度
dp[i] = max(dp[j]+1) for all j&lt;i where arr[j]&lt;arr[i]</pre>
<h5>贪心+二分 O(n log n)：</h5>
<p>维护一个tails数组，用二分查找维护最小末尾元素。</p>`,
      confidence: 0.93,
      related: ['动态规划', '背包问题']
    },

    // ── 通用/学习方法 ──────────────────────────────────────────────
    {
      id: 'r090',
      keywords: ['递归', 'recursion', '递归复杂度', '调用栈'],
      patterns: [/什么是递归/, /递归.*理解/, /递归.*复杂度/],
      answer: `<h4>🔄 递归 (Recursion)</h4>
<p>函数<strong>调用自身</strong>来解决问题的方法。</p>
<h5>递归三要素：</h5>
<ol>
  <li><strong>基本情况 (Base Case)</strong>：停止递归的条件</li>
  <li><strong>递归步骤</strong>：将问题分解为更小的同类子问题</li>
  <li><strong>趋近基本情况</strong>：每次递归都要使问题规模减小</li>
</ol>
<pre>// 阶乘
int factorial(int n) {
    if (n <= 1) return 1;      // 基本情况
    return n * factorial(n-1); // 递归步骤
}</pre>
<p><strong>空间复杂度</strong> = 递归深度 × 每层栈帧大小</p>
<p>💡 递归可以用<strong>迭代</strong>替代以避免栈溢出。也可以用<strong>尾递归优化</strong>。</p>`,
      confidence: 0.92,
      related: ['分治法', '动态规划', '二叉树遍历']
    },
    {
      id: 'r091',
      keywords: ['复习', '学习方法', '考试', '备考', '怎么学', '学习建议'],
      patterns: [/怎么.*复习/, /学习方法/, /如何.*学好/, /备考/, /考试/],
      answer: `<h4>📖 数据结构与算法学习建议</h4>
<ol>
  <li><strong>理解 > 记忆</strong>：搞懂"为什么"比记住"是什么"更重要</li>
  <li><strong>手动画图</strong>：画树的遍历过程、排序每一步、图的搜索路径</li>
  <li><strong>动手写代码</strong>：每种数据结构至少实现一遍</li>
  <li><strong>对比学习</strong>：
    <ul>
      <li>顺序表 vs 链表</li>
      <li>DFS vs BFS</li>
      <li>分治 vs 动态规划</li>
      <li>各种排序算法横向比较</li>
    </ul>
  </li>
  <li><strong>刷题巩固</strong>：用本网站的Quiz模块自测</li>
  <li><strong>总结模板</strong>：把常用算法的框架代码整理成模板</li>
</ol>
<p>🎯 <strong>重点章节：</strong>排序、树、图、动态规划（考试高频）</p>
<p>💡 <strong>口诀记忆：</strong>不稳定排序 → "快选希堆"；排序复杂度下界 → O(n log n)</p>`,
      confidence: 0.88,
      related: ['排序比较', '二叉树遍历', '动态规划']
    },
    {
      id: 'r092',
      keywords: ['代码', '编程', '实现', '怎么写', 'coding', '伪代码'],
      patterns: [/怎么写代码/, /如何.*实现/, /代码.*实现/, /编程.*技巧/],
      answer: `<h4>💻 数据结构代码实现技巧</h4>
<h5>通用编码框架：</h5>
<ol>
  <li>先定义<strong>数据结构的类型</strong>（struct / class）</li>
  <li>实现<strong>初始化</strong>和<strong>销毁</strong>函数</li>
  <li>实现<strong>基本操作</strong>（增删改查）</li>
  <li>加上<strong>边界检查</strong>（空、满、越界）</li>
</ol>
<h5>常见陷阱：</h5>
<ul>
  <li>🐛 忘记处理<strong>空表/空树</strong>的情况</li>
  <li>🐛 链表操作忘记<strong>更新头指针</strong>（用二级指针或返回新头）</li>
  <li>🐛 递归忘记<strong>基本情况</strong> → 栈溢出</li>
  <li>🐛 循环队列<strong>取模</strong>遗漏</li>
  <li>🐛 快排<strong>partition</strong>边界条件</li>
</ul>
<p>💡 建议使用本网站的<strong>代码评测</strong>模块练习实现！</p>`,
      confidence: 0.85,
      related: ['递归', '链表', '排序比较']
    },
    {
      id: 'r093',
      keywords: ['复杂度', 'O(n log n)', '下界', '比较排序'],
      patterns: [/排序.*下界/, /比较排序.*下界/, /n.*log.*n.*下界/],
      answer: `<h4>📐 比较排序的下界证明</h4>
<p><strong>定理：</strong>任何基于比较的排序算法，最坏情况至少需要 ⌈log₂(n!)⌉ 次比较。</p>
<h5>决策树证明：</h5>
<ol>
  <li>n个元素有 n! 种排列</li>
  <li>每次比较产生"是/否"两个分支 → 二叉决策树</li>
  <li>叶子节点 ≥ n!（每种排列至少一个叶子）</li>
  <li>树高 h ≥ log₂(n!)</li>
  <li>由Stirling公式：log₂(n!) ≈ n log₂ n - n log₂ e ≈ <strong>Ω(n log n)</strong></li>
</ol>
<p>因此，归并排序和堆排序达到了<strong>理论下界</strong>，是最优的。</p>
<p>💡 <strong>非比较排序</strong>（计数、基数、桶排序）可以突破此下界，但有特殊要求。</p>`,
      confidence: 0.94,
      related: ['排序比较', '归并排序', '堆排序']
    },
  ];

  // ─── Fallback Responses ────────────────────────────────────────
  const fallbacks = [
    `🤔 我不太确定你具体在问什么，但我可以帮你解答以下方面的问题：
<ul>
  <li>📊 <strong>复杂度分析</strong>：时间/空间复杂度怎么算</li>
  <li>📋 <strong>线性表</strong>：顺序表、链表及其比较</li>
  <li>📚 <strong>栈与队列</strong>：LIFO/FIFO、循环队列</li>
  <li>🌲 <strong>树</strong>：遍历、BST、哈夫曼树</li>
  <li>🕸️ <strong>图</strong>：DFS/BFS、最短路径、最小生成树</li>
  <li>🔍 <strong>查找</strong>：二分查找、哈希表、平衡树</li>
  <li>⚡ <strong>排序</strong>：各种排序算法及其比较</li>
  <li>🧩 <strong>算法设计</strong>：分治、动态规划</li>
</ul>
<p>试试更具体地描述你的问题？比如"快速排序的原理是什么？"</p>`,

    `💡 这是个好问题！不过我的知识库主要集中在数据结构与算法的课本内容上。你可以试着问我：
<ul>
  <li>"二叉树的前中后序遍历怎么区分？"</li>
  <li>"各种排序算法的稳定性如何记忆？"</li>
  <li>"动态规划和分治法有什么区别？"</li>
  <li>"Dijkstra算法为什么不能处理负权边？"</li>
</ul>`,

    `📝 我目前能回答数据结构与算法课程相关的问题。以下是一些热门话题：
<ul>
  <li>输入<strong>"排序比较"</strong>查看所有排序算法对比表</li>
  <li>输入<strong>"时间复杂度"</strong>学习复杂度分析方法</li>
  <li>输入<strong>"复习方法"</strong>获取学习建议</li>
</ul>
<p>请尝试用更具体的关键词提问！</p>`
  ];

  // ─── Scoring & Matching ────────────────────────────────────────

  function scoreRule(question, rule) {
    const q = question.toLowerCase();
    let score = 0;

    // Keyword matching
    for (const kw of rule.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.length * 2; // Longer keywords = more specific match
      }
    }

    // Pattern matching (regex)
    for (const pat of rule.patterns) {
      if (pat.test(question)) {
        score += 15;
      }
    }

    // Bonus for multiple keyword hits
    const keywordHits = rule.keywords.filter(kw => q.includes(kw.toLowerCase())).length;
    if (keywordHits >= 2) score += 10;
    if (keywordHits >= 3) score += 10;

    return score;
  }

  function findBestMatch(question) {
    let bestRule = null;
    let bestScore = 0;

    for (const rule of rules) {
      const score = scoreRule(question, rule);
      if (score > bestScore) {
        bestScore = score;
        bestRule = rule;
      }
    }

    // Require a minimum score to avoid weak matches
    const MIN_SCORE = 4;
    if (bestScore >= MIN_SCORE) {
      return {
        text: bestRule.answer,
        confidence: bestRule.confidence * Math.min(bestScore / 20, 1),
        related: bestRule.related || [],
        ruleId: bestRule.id
      };
    }

    return null;
  }

  function getRandomFallback() {
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // ─── Public API ────────────────────────────────────────────────

  return {
    /**
     * Answer a DSA-related question
     * @param {string} question - User's question
     * @returns {{text: string, confidence: number, related: string[]}}
     */
    answer(question) {
      if (!question || !question.trim()) {
        return {
          text: getRandomFallback(),
          confidence: 0.3,
          related: []
        };
      }

      const match = findBestMatch(question.trim());

      if (match) {
        return {
          text: match.text,
          confidence: match.confidence,
          related: match.related
        };
      }

      // Fallback
      return {
        text: getRandomFallback(),
        confidence: 0.3,
        related: []
      };
    },

    /**
     * Get suggestion topics
     * @returns {string[]}
     */
    getSuggestions() {
      return [
        '什么是时间复杂度？',
        '顺序表和链表有什么区别？',
        '二叉树有哪些遍历方式？',
        '快速排序的原理是什么？',
        '动态规划怎么解题？',
        '排序算法怎么比较？',
        'DFS和BFS的区别？',
        '如何复习数据结构？'
      ];
    },

    /**
     * Get the number of rules loaded
     * @returns {number}
     */
    getRuleCount() {
      return rules.length;
    }
  };
})();
