/* ========================================
   lessons-data-2.js - 课程数据（第 2 部分）
   覆盖：ch5 树 / ch6 图 / ch7 查找 / ch8 排序 / ch10 动态规划
   格式同 lessons-data-1.js
   ======================================== */

window.LessonData = window.LessonData || {};

Object.assign(window.LessonData, {

  /* ============ ch5 树与二叉树 ============ */

  'lesson-traversal': {
    title: '二叉树遍历：递归框架与非递归栈过程',
    chapter: 'ch5',
    summary: [
      '前序 VLR、中序 LVR、后序 LRV，"前中后"说的是根结点被访问的时机。',
      '非递归遍历靠栈：中序 = 沿左链进栈、左空退栈访问、再转右子树，循环直到栈空且指针为空。',
      '层次序遍历用队列（先进先出），不是栈。',
      '还原二叉树：前序+中序、中序+后序一定可以；前序+后序不一定。',
    ],
    steps: [
      {
        title: '三种遍历次序：根在何时被访问',
        content: `<p>遍历 = 每个结点被访问一次且仅一次。设 <b>V</b> = 访问根，<b>L</b> = 遍历左子树，<b>R</b> = 遍历右子树：</p>
          <table>
            <tr><th>遍历</th><th>次序</th><th>含义</th></tr>
            <tr><td>前序</td><td>V L R</td><td>根最先被访问</td></tr>
            <tr><td>中序</td><td>L V R</td><td>根夹在左右子树中间</td></tr>
            <tr><td>后序</td><td>L R V</td><td>根最后被访问</td></tr>
          </table>
          <p>💡 <em>记忆技巧："前中后"描述的是<b>根</b>的位置。左子树永远先于右子树。</em></p>`,
      },
      {
        title: '示例：一棵表达式树',
        content: `<p>用表达式 (a + b*(c−d)) − e/f 的表达式树做例子（与课件一致），本课全部围绕它展开：</p>`,
        html: `<pre class="lesson-tree">                -(根)
            /        \
          +(L)        /(R)
         /    \      /   \
        a     *(L)  e     f
             /    \
            b     -(R)
                 /   \
                c     d</pre>`,
      },
      {
        title: '三种遍历结果',
        content: `<pre><code>前序（根左右）：−  +  a  *  b  −  c  d  /  e  f
中序（左根右）：a  +  b  *  c  −  d  −  e  /  f   ← 恰好是中缀式
后序（左右根）：a  b  c  d  −  *  +  e  f  /  −   ← 恰好是后缀式</code></pre>
          <p>观察两个惊喜：表达式树的<b>中序序列带括号读就是中缀式</b>（不打印括号时会丢失优先级信息，所以中序遍历表达式树时要注意补括号）；<b>后序序列就是后缀表达式</b>——这正是"栈的应用"一课里转出的那个式子。</p>`,
        interaction: {
          type: 'quiz',
          question: '对上面的表达式树做前序遍历，前 3 个被访问的结点是？',
          options: ['−, +, a', 'a, +, −', '−, +, *', 'a, b, c'],
          answer: 0,
          hint: '前序 = 根最先：先访问根 −，再进左子树访问其根 +，继续深入左子树到达叶 a。',
        },
      },
      {
        title: '递归框架（代码走读）',
        content: `<p>三种遍历只差一行"访问"的位置。以中序为例：</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `template <class T>
void BinaryTree<T>::InOrder(BinTreeNode<T>* subTree,
                            void (*visit)(BinTreeNode<T>* t)) {
    if (subTree == NULL) return;          // 递归出口：空树
    InOrder(subTree->leftChild, visit);   // L：递归左子树
    visit(subTree);                       // V：访问根（中序：夹中间）
    InOrder(subTree->rightChild, visit);  // R：递归右子树
}`,
          explanations: {
            4: '空树什么都不做——所有递归遍历的出口。',
            5: '前序遍历把这一行放到递归左子树之前；后序遍历放到最后。框架完全一样。',
            6: 'visit 是函数指针，"访问"可以是打印、计数等任意操作。',
            7: '左子树彻底处理完才轮到右子树。',
          },
        },
      },
      {
        title: '非递归中序：栈的逐步过程（上）',
        content: `<p>递归的本质是系统栈，非递归版本就是自己管理一个栈。中序口诀：<b>沿左链一路进栈 → 左空退栈访问 → 转向右子树</b>。跟踪前几步：</p>`,
        array: {
          data: ['−', '+', 'a'],
          pointers: { top: 2 },
          caption: '第1阶段：从根出发沿左链进栈：−、+、a 依次入栈（a 的左子为空，停止）',
        },
      },
      {
        title: '非递归中序：栈的逐步过程（下）',
        content: `<p>接着上一步：a 左空 → 弹栈<b>访问 a</b> → a 无右子 → 弹 + 访问 → 转 + 的右子树 *：* 、b 进栈 → 弹 b 访问 → 弹 * 访问 → 转 * 的右子树 − … 最终访问次序 <code>a + b * c − d − e / f</code> ✓</p>
          <p>中间时刻的栈状态：</p>`,
        array: {
          data: ['−', '*', 'b'],
          highlights: [2],
          pointers: { top: 2 },
          caption: '访问过 a、+ 之后，* 与 b 进栈。栈里保存的全是"右子树还没处理"的祖先——这就是栈的作用：替我们记住回头的路',
        },
        interaction: {
          type: 'quiz',
          question: '非递归中序遍历中，栈里保存的结点有什么共同点？',
          options: ['右子树尚未处理的祖先结点', '已经访问过的结点', '所有叶结点', '当前路径上的全部结点'],
          answer: 0,
          hint: '结点进栈是因为它的左子树还没走完；退栈访问后立即转向右子树。所以栈中结点的右子树都还没处理。',
        },
      },
      {
        title: '非递归中序代码走读',
        code: {
          lang: 'cpp',
          activeLine: 6,
          code: `template <class T>
void BinaryTree<T>::InOrder(void (*visit)(BinTreeNode<T>* t)) {
    stack<BinTreeNode<T>*> S;
    BinTreeNode<T>* p = root;
    do {
        while (p != NULL) {          // 遍历指针向左下一路走
            S.Push(p);               // 沿途结点进栈
            p = p->leftChild;
        }
        if (!S.IsEmpty()) {          // 左边走完了
            S.Pop(p);  visit(p);     // 退栈并访问
            p = p->rightChild;       // 转进右子树
        }
    } while (p != NULL || !S.IsEmpty());  // 栈空且 p 空才结束
}`,
          explanations: {
            4: 'p 是"遍历指针"，代表当前走到了哪。',
            6: '内层 while：只要还有左孩子就一路向左，把路上的结点全压栈。',
            12: '弹栈即"回头"，被弹出者左子树已处理完，正是该访问它的时候（LVR 的 V）。',
            13: '访问后转向右子树，右子树内部重复同样的左链-退栈过程。',
            15: '两个条件都为假才结束：栈空说明没有待回溯的祖先，p 空说明没有新子树。',
          },
        },
      },
      {
        title: '层次序遍历与还原二叉树',
        content: `<p><b>层次序</b>：自上而下、自左向右逐层访问。它需要<b>队列</b>（不是栈！）：访问结点时把它的子女（先左后右）加到队尾，上一层处理完，下一层恰好排在队头。上例树的层次序：<code>− + / a * e f b − c d</code>。</p>
          <p><b>由遍历序列还原二叉树</b>（重要结论）：</p>
          <table>
            <tr><th>组合</th><th>能否唯一还原</th></tr>
            <tr><td>前序 + 中序</td><td>✅ 一定可以</td></tr>
            <tr><td>后序 + 中序</td><td>✅ 一定可以</td></tr>
            <tr><td>前序 + 后序</td><td>❌ 不一定（如只有左孩子的树无法区分）</td></tr>
          </table>
          <p>原理：前/后序定位根，中序分出左右子树，递归还原。没有中序就分不开左右。</p>
          <p>👉 去<a href="#/quiz/ch5" class="lesson-link">练习测验巩固第 5 章</a>。</p>`,
      },
    ],
  },

  'lesson-heap': {
    title: '堆：筛选建堆与插入删除',
    chapter: 'ch5',
    summary: [
      '最小堆：每个结点 ≤ 其子女；用数组存储，结点 i 的左子女 2i+1、右子女 2i+2、父结点 (i-1)/2。',
      '筛选法建堆：从最后一个分支结点 (currentSize-2)/2 起，自下向上对每个非叶结点做 siftDown。',
      '插入：新元素加到末尾，再 siftUp 自下向上调整，O(log n)。',
      '删除（堆顶）：末尾元素补到堆顶，再 siftDown 自上向下调整，O(log n)。每次出堆的都是最值。',
    ],
    steps: [
      {
        title: '堆的定义与数组存储',
        content: `<p><b>最小堆</b>是一棵完全二叉树，且每个结点的值都<b>不大于</b>其左右子女。于是<b>堆顶（根）永远是全堆最小值</b>——这就是优先级队列的底层。</p>
          <p>完全二叉树可以直接放进数组，编号关系（0 起点）：</p>
          <ul>
            <li>结点 i 的左子女：<code>2i + 1</code>；右子女：<code>2i + 2</code></li>
            <li>结点 i 的父结点：<code>(i − 1) / 2</code>（整除）</li>
          </ul>
          <p>本课以课件例为准：初始数组 <b>[53, 17, 78, 23, 45, 65, 87, 09]</b>，目标是把它调整成最小堆。</p>`,
        array: {
          data: [53, 17, 78, 23, 45, 65, 87, 9],
          caption: '初始状态：还不是堆（53 > 17，违反最小堆性质）',
        },
      },
      {
        title: '筛选法建堆：从哪开始？',
        content: `<p>关键观察：<b>叶子结点天然是合法的堆</b>（单个结点没有子女可违反性质）。所以只需从<b>最后一个分支（非叶）结点</b>开始调整：</p>
          <p class="lesson-tip">起始下标 <code>currentPos = (currentSize − 2) / 2</code>。n=8 时为 (8−2)/2 = <b>3</b>，正是结点 23（下标 3，它的左子女 2×3+1=7 是最后一个元素 09）。</p>
          <p>对 currentPos 从 3 到 0 <b>倒序</b>逐个执行 siftDown（下滑调整）：把该结点与左右子女中较小者比较，若比子女大就让小的上浮、自己下沉，一路沉到合法位置。</p>
          <p>为什么要<b>从下往上</b>？保证调整每个结点时，它的两棵子树已经各自是堆——siftDown 的前提成立。</p>`,
        interaction: {
          type: 'quiz',
          question: '对 8 个元素的数组筛选法建堆，第一个执行 siftDown 的是哪个结点？',
          options: ['下标 3（值 23）', '下标 0（值 53）', '下标 4（值 45）', '下标 7（值 09）'],
          answer: 0,
          hint: '(currentSize−2)/2 = (8−2)/2 = 3。叶子（下标 4~7）不用调整。',
        },
      },
      {
        title: '建堆演示：i = 3 和 i = 2',
        content: `<p><b>i=3：</b>结点 23 与唯一子女 09 比较，09 小 → 交换（09 上浮，23 沉底）。<br>
          <b>i=2：</b>结点 78 与子女 65、87 中较小者 65 比较 → 交换。</p>`,
        array: {
          data: [53, 17, 65, 9, 45, 78, 87, 23],
          highlights: [2, 5],
          caption: 'i=3 与 i=2 完成后：09、23 互换，78、65 互换',
        },
      },
      {
        title: '建堆演示：i = 1',
        content: `<p>结点 17 与子女 09、45 中较小者 09 交换；17 落到下标 3 后还要<b>继续下滑</b>：再与子女 23 比较，17 ≤ 23，停止。</p>
          <p>⚠️ 这就是 siftDown 的要点：交换后要<b>一路沉到底</b>，不是只换一层。</p>`,
        array: {
          data: [53, 9, 65, 17, 45, 78, 87, 23],
          highlights: [1, 3],
          caption: 'i=1 完成后：09 上浮到下标 1，17 一路滑到下标 3',
        },
      },
      {
        title: '建堆演示：i = 0，完成！',
        content: `<p>最后调整根：53 与子女 09、65 中较小的 09 交换 → 53 落到下标 1，与 17、45 中较小的 17 交换 → 53 落到下标 3，与子女 23 交换 → 53 落到叶子层，停止。</p>`,
        array: {
          data: [9, 17, 65, 23, 45, 78, 87, 53],
          highlights: [0, 1, 3, 7],
          caption: '最终最小堆：09 17 65 23 45 78 87 53（与课件结论一致）',
        },
        interaction: {
          type: 'quiz',
          question: '对初始数组 [53, 17, 78, 23, 45, 65, 87, 09] 筛选法建堆（最小堆），最终的堆数组是？',
          options: ['09 17 65 23 45 78 87 53', '09 17 23 45 53 65 78 87', '53 17 78 23 45 65 87 09', '09 23 17 53 45 65 87 78'],
          answer: 0,
          hint: '按 i=3,2,1,0 的顺序 siftDown。注意堆只要求"父 ≤ 子"，同层之间和左右子树之间没有大小关系（排除完全有序的选项）。',
        },
      },
      {
        title: 'siftDown 代码走读',
        code: {
          lang: 'cpp',
          activeLine: 8,
          code: `template <class T, class E>
void MinHeap<T>::siftDown(int start, int m) {
    int i = start, j = 2*i+1;        // j 是 i 的左子女
    E temp = heap[i];                // 暂存待下滑的元素
    while (j <= m) {                 // 还有子女可比较
        if (j < m && heap[j] > heap[j+1]) j++;
        // 让 j 指向左右子女中的较小者
        if (temp <= heap[j]) break;  // 不比子女大，位置合法，停
        else {
            heap[i] = heap[j];       // 小者上移填空位
            i = j;  j = 2*j+1;       // i、j 一同下降一层
        }
    }
    heap[i] = temp;                  // 放回最终位置
}`,
          explanations: {
            3: 'temp 暂存起始元素，空位随 i 移动——和快排挖坑法类似的"空位搬运"思想。',
            7: 'j < m 保证右子女存在；然后取两子女中较小者比较（最小堆要与更小的比）。',
            9: 'temp 已经不大于较小的子女，堆性质满足，提前结束。',
            12: '子女上移填补空位，空位下降一层，继续向下比较。',
            15: '最终把 temp 放进最后一次的空位——不是逐步交换，是"平移+落位"，省次数。',
          },
        },
      },
      {
        title: '插入：siftUp 向上调整',
        content: `<p>插入新元素 <b>11</b>：先加到<b>堆的最后</b>（下标 8），再自下向上比较——比父结点小就交换上浮，直到不比父结点小或到达根。</p>
          <p>路径：11 与父 23（下标3）交换 → 11 与父 17（下标1）交换 → 11 与父 09 比较，09 ≤ 11，停止。</p>`,
        array: {
          data: [9, 11, 65, 17, 45, 78, 87, 53, 23],
          highlights: [1, 3],
          caption: '插入 11 并 siftUp 完成后的堆（与课件一致）',
        },
        interaction: {
          type: 'quiz',
          question: '往 n 个元素的最小堆中插入一个元素，最坏情况下的时间复杂度是？',
          options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
          answer: 0,
          hint: 'siftUp 最坏沿一条从叶到根的路径上浮，路径长即树高 O(log n)。',
        },
      },
      {
        title: '删除堆顶：末尾补顶 + 下滑',
        content: `<p>删除只能从堆顶拿（每次拿最小值）。步骤：<b>堆顶 09 出堆 → 最后一个元素 23 补到堆顶 → siftDown(0)</b>。</p>
          <p>23 与左子女 11 交换 → 23 再与 17 交换 → 23 落到合法位置。</p>`,
        array: {
          data: [11, 17, 65, 23, 45, 78, 87, 53],
          highlights: [0, 3],
          caption: '删除 09 后重新成堆：11 17 65 23 45 78 87 53（与课件一致）',
        },
      },
      {
        title: '小结与易错点',
        content: `<table>
            <tr><th>操作</th><th>做法</th><th>复杂度</th></tr>
            <tr><td>插入</td><td>加到末尾，siftUp</td><td>O(log n)</td></tr>
            <tr><td>删除堆顶</td><td>末尾补顶，siftDown</td><td>O(log n)</td></tr>
            <tr><td>建堆</td><td>从 (n−2)/2 起倒序 siftDown</td><td>O(n)</td></tr>
          </table>
          <ul>
            <li>易错①：堆只保证"父 ≤ 子"，<b>同层元素之间、左右子树之间没有任何大小关系</b>——"堆是有序序列"是经典错误说法；</li>
            <li>易错②：删除堆顶时不能用"把较小子女直接提上来"的逐层交换，标准做法是<b>末尾元素补顶</b>，保证仍是完全二叉树；</li>
            <li>易错③：下标换算别用错基准——课件代码是 0 起点下标，有些教材是 1 起点（左子女 2i），看题先确认。</li>
          </ul>
          <p>👉 去<a href="#/quiz/ch5" class="lesson-link">练习测验巩固</a>，或看<a href="#/visualization" class="lesson-link">堆排序动画</a>（堆排序就靠反复"取堆顶+调整"）。</p>`,
      },
    ],
  },

  'lesson-huffman': {
    title: '哈夫曼树：构造与编码',
    chapter: 'ch5',
    summary: [
      'WPL = Σ wᵢ·lᵢ；带权路径长度最小的扩充二叉树就是哈夫曼树，权值大的叶离根近。',
      '构造：反复取权值最小的两棵树合并，直到只剩一棵；n 个叶共需 n−1 次合并，总结点数 2n−1。',
      '哈夫曼编码 = 左 0 右 1，叶到根路径即编码；是前缀码，解码不会混淆。',
      '报文总编码长度恰好等于哈夫曼树的 WPL。',
    ],
    steps: [
      {
        title: '带权路径长度 WPL',
        content: `<p>给树的<b>叶结点（外结点）</b>赋权值 wᵢ，叶到根的路径长度（边数）为 lᵢ，则树的<b>带权路径长度</b>：</p>
          <p class="formula">WPL = Σ wᵢ · lᵢ</p>
          <p>只有度为 0 的外结点和度为 2 的内结点的二叉树叫<b>扩充二叉树</b>；n 个外结点必有 n−1 个内结点，共 <b>2n−1</b> 个结点。</p>
          <p><b>核心问题</b>：同一组权值，摆成不同的树，WPL 不同——权值大的放浅处、权值小的放深处，WPL 就小。<b>WPL 最小的那棵扩充二叉树就是哈夫曼树</b>。</p>`,
        interaction: {
          type: 'quiz',
          question: '权值 {2, 4, 5, 7} 摆成"7 在第 1 层、5 在第 2 层、2 和 4 在第 3 层"的二叉树，WPL 是？',
          options: ['35', '36', '46', '18'],
          answer: 0,
          hint: '7×1 + 5×2 + 2×3 + 4×3 = 7 + 10 + 12 = 35，是课件对比的三种组织方式中最小的（另两种为 36 / 46）。',
        },
      },
      {
        title: '构造算法：贪心地"取小合并"',
        content: `<p>构造过程（对权值 {7, 5, 2, 4}）：</p>
          <ol>
            <li>每个权值先做成一棵单结点树，得到森林 F = {7} {5} {2} {4}；</li>
            <li>重复：<b>取出根权值最小的两棵树</b>，合并成一棵新树（新根权值 = 二者之和），放回森林；</li>
            <li>直到森林只剩一棵树。</li>
          </ol>
          <pre><code>F: {7} {5} {2} {4}   合并 2+4 → 6
F: {7} {5} {6}       合并 5+6 → 11
F: {7} {11}          合并 7+11 → 18
F: {18}              完成！</code></pre>
          <p>⚠️ 第 2 步里 {5} 和 {6} 合并而不是 {5} 和 {7}——永远是<b>当前最小的两个</b>。实现时用最小堆存森林（课件代码即如此），每次 Remove 两个最小、合并、Insert 回去。</p>`,
      },
      {
        title: '构造结果与 WPL',
        content: `<p>最终的哈夫曼树（权 {7,5,2,4}）：</p>`,
        html: `<pre class="lesson-tree">            18
           /    \
          7      11
                /   \
               5     6
                    / \
                   2   4

叶: 7(深度1)  5(深度2)  2(深度3)  4(深度3)
WPL = 7×1 + 5×2 + 2×3 + 4×3 = 35</pre>`
      },
      {
        title: '哈夫曼编码：左 0 右 1',
        content: `<p>给每个左分支标 0、右分支标 1，则每个叶结点的编码 = 从根到它的路径上的 0/1 序列。</p>
          <p>课件实例：报文 <b>CAST CAST SAT AT A TASA</b>，字符频度 A:7、T:5、S:4、C:2（共 18 字符）。</p>
          <table>
            <tr><th>方案</th><th>A</th><th>T</th><th>C</th><th>S</th><th>总长</th></tr>
            <tr><td>等长 2 位编码</td><td>00</td><td>10</td><td>01</td><td>11</td><td>(2+7+4+5)×2 = 36</td></tr>
            <tr><td><b>哈夫曼编码</b></td><td><b>0</b></td><td><b>10</b></td><td><b>110</b></td><td><b>111</b></td><td><b>35</b></td></tr>
          </table>
          <p>频度最高的 A 编码最短（深度 1）——"权值大的离根近"在编码上的体现。总编码长度 7×1+5×2+(2+4)×3 = <b>35 = WPL</b>。</p>`,
        interaction: {
          type: 'quiz',
          question: '哈夫曼编码的总编码长度（对整段报文）等于什么？',
          options: ['哈夫曼树的 WPL', '树的总结点数', '字符种类数 × 最大深度', '报文长度 × 2'],
          answer: 0,
          hint: '每个字符的出现频度 × 编码长度求和 = Σ wᵢ·lᵢ = WPL。',
        },
      },
      {
        title: '为什么必须是"前缀码"？',
        content: `<p>哈夫曼编码是<b>前缀编码</b>：任一字符的编码都不是另一字符编码的<b>前缀</b>。</p>
          <p>验证：A=0、T=10、C=110、S=111。任何编码都以 0/1 开头往下走，字符只出现在<b>叶子</b>上——从根出发解码时，走到叶子就确定一个字符，不可能出现歧义。</p>
          <p>反例：若 A=0、T=01，收到 "01" 就无法确定是 T 还是"A 开头的什么"。</p>
          <p>💡 <em>这也解释了为什么频率高的字符编码短却不会冲突：所有编码都终止在叶子上，而叶子的深度不同但互不为前缀。</em></p>`,
      },
      {
        title: '小结与易错点',
        content: `<ul>
          <li>n 个权值需 <b>n−1 次合并</b>，哈夫曼树总结点数 <b>2n−1</b>，没有度为 1 的结点；</li>
          <li>合并时若出现"权值并列最小"，取哪两个都行，答案不唯一（但 WPL 相同）；</li>
          <li>同一棵树左右子树互换得到的是<b>不同的编码方案</b>（0/1 对调），同样合法；</li>
          <li>求哈夫曼树要用最小堆（或排序）反复找最小两棵，每次合并 O(log n)。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch5" class="lesson-link">练习测验巩固第 5 章</a>。</p>`,
      },
    ],
  },

  /* ============ ch6 图 ============ */

  'lesson-dijkstra': {
    title: '图：Dijkstra 逐步松弛',
    chapter: 'ch6',
    summary: [
      'Dijkstra 解决边权非负的单源最短路径：按路径长度递增的次序逐个"收编"终点。',
      'dist[i] 记录当前源点到 i 的最短距离；每轮选 V−S 中 dist 最小的顶点 k 加入 S。',
      '松弛：dist[i] = min{ dist[i], dist[k] + Edge[k][i] }，path 数组同步记录前驱。',
      'path 数组从终点反向回溯即可读出完整路径；不适用于有负权边的图。',
    ],
    steps: [
      {
        title: '问题与辅助数组',
        content: `<p><b>单源最短路径</b>：给定带权有向图和源点 v₀，求 v₀ 到其余各顶点的最短路径（各边权 ≥ 0）。</p>
          <p>Dijkstra 的思路：<b>按路径长度递增的次序</b>逐个产生最短路径——先确定最短的，再参照它求次短的……</p>
          <ul>
            <li><b>S</b>：已求得最短路径的终点集合；</li>
            <li><b>dist[i]</b>：当前求得的 v₀ 到 vᵢ 的最短路径长度（初始：有边则边权，无边则 ∞）；</li>
            <li><b>path[i]</b>：vᵢ 最短路径上的前驱顶点，用于回溯路径。</li>
          </ul>
          <p>核心保证（可证明）：下一条最短路径的终点一定在 <b>V−S 中 dist 最小</b>的那个顶点处。</p>`,
      },
      {
        title: '示例图',
        content: `<p>课件例：6 个顶点的有向网（v₀ 为源点）：</p>`,
        html: `<pre class="lesson-tree">边及权值（共 6 条有向边）：
  v0 → v1 : 10      v0 → v3 : 30      v0 → v4 : 100
  v1 → v2 : 50      v3 → v2 : 20      v2 → v4 : 10</pre>
        <p>直觉先猜一猜：v0→v4 直达要 100，但绕道 v3→v2→v4 呢（30+20+10）？继续往下看。</p>`,
      },
      {
        title: '算法四步（伪代码）',
        content: `<pre><code>① 初始化: S ← {v0};
          dist[j] ← Edge[0][j],  j = 1..n-1;   // 直接边的权或 ∞
② 选点:   dist[k] ← min{ dist[i] }, i ∈ V−S;   S ← S ∪ {k};
③ 松弛:   dist[i] ← min{ dist[i], dist[k] + Edge[k][i] }, i ∈ V−S;
④ 判断:   若 S = V 结束，否则转②。</code></pre>
          <p>第③步叫<b>松弛（relax）</b>："借道 k 会不会更近？"每确定一个新顶点，就对所有未确定顶点试松一次。path 数组在松弛成功时同步更新为 k。</p>`,
        interaction: {
          type: 'quiz',
          question: 'Dijkstra 每一轮从哪个顶点集合中挑选"下一个确定"的顶点？',
          options: ['V−S 中 dist 最小者', 'S 中 dist 最大者', '编号最小的顶点', '入度为 0 的顶点'],
          answer: 0,
          hint: '贪心：未确定顶点里 dist 最小的那个，它的 dist 已经不可能再变小（边权非负）。',
        },
      },
      {
        title: '逐步松弛表',
        content: `<p>对示例图执行（每行加粗顶点为本轮选入 S 者）：</p>
          <pre><code>初始   S={v0}        dist: v1=10  v2=∞   v3=30   v4=100
第1轮  选 v1(10)     松弛: v2 = min(∞, 10+50)=60
       S={v0,v1}     dist: v1=10  v2=60  v3=30   v4=100
第2轮  选 v3(30)     松弛: v2 = min(60, 30+20)=50 ✓（借道v3更近！）
       S={v0,v1,v3}  dist: v1=10  v2=50  v3=30   v4=100
第3轮  选 v2(50)     松弛: v4 = min(100, 50+10)=60 ✓
       S={v0,v1,v3,v2}  dist: v1=10  v2=50  v3=30  v4=60
第4轮  选 v4(60)     全部确定</code></pre>
          <p>最终 dist：<b>v1=10, v2=50, v3=30, v4=60</b>（与课件一致）。v0→v4 的答案正是 60 而不是直达的 100。</p>`,
      },
      {
        title: 'path 数组与路径回溯',
        content: `<p>松弛成功时记 <code>path[i] = k</code>。最终：</p>
          <table>
            <tr><th></th><th>v1</th><th>v2</th><th>v3</th><th>v4</th></tr>
            <tr><td>dist</td><td>10</td><td>50</td><td>30</td><td>60</td></tr>
            <tr><td>path</td><td>0</td><td>3</td><td>0</td><td>2</td></tr>
          </table>
          <p>读路径（以 v4 为例）：<code>path[4]=2 → path[2]=3 → path[3]=0</code>，反向排列得 <b>0, 3, 2, 4</b>，即 v0 → v3 → v2 → v4。</p>`,
        interaction: {
          type: 'quiz',
          question: '承示例：v0 到 v2 的最短路径是？',
          options: ['v0 → v3 → v2（长 50）', 'v0 → v1 → v2（长 60）', 'v0 → v2 直达', 'v0 → v4 → v2'],
          answer: 0,
          hint: 'path[2]=3 说明 v2 的前驱是 v3；30+20=50 优于 10+50=60。',
        },
      },
      {
        title: '核心代码走读',
        code: {
          lang: 'cpp',
          activeLine: 12,
          code: `void ShortestPath(Graph<T, E>& G, T v, E dist[], int path[]) {
    int n = G.NumberOfVertices();
    bool* S = new bool[n];               // 顶点是否已加入集合 S
    for (int i = 0; i < n; i++) {
        dist[i] = G.getWeight(v, i);     // 初始化：直接边权或 ∞
        S[i] = false;
        if (i != v && dist[i] < maxValue) path[i] = v;
        else path[i] = -1;
    }
    S[v] = true;  dist[v] = 0;           // 源点入集合
    for (i = 0; i < n - 1; i++) {        // 还需确定 n-1 个顶点
        min = maxValue;  int u = v;
        for (j = 0; j < n; j++)          // 选 V−S 中 dist 最小的 u
            if (!S[j] && dist[j] < min) { u = j;  min = dist[j]; }
        S[u] = true;                     // u 加入集合
        for (k = 0; k < n; k++) {        // 松弛 u 的所有出边
            E w = G.getWeight(u, k);
            if (!S[k] && w < maxValue && dist[u] + w < dist[k]) {
                dist[k] = dist[u] + w;   // 借道 u 更近
                path[k] = u;             // 记录前驱
            }
        }
    }
}`,
          explanations: {
            5: '初始化 dist 为源点的直接边权（无边则 maxValue 表示 ∞）。',
            6: 'path[i] 记 v 的直接后继，回溯路径用。',
            10: '循环 n−1 轮，每轮确定一个新顶点。',
            13: '线性扫描找 V−S 中 dist 最小者（也可用小根堆优化）。',
            16: '三个条件缺一不可：k 未确定、边存在、且借道确实更近。',
            17: '松弛成功：更新 dist 并让 path 记住"我是从 u 过来的"。',
          },
        },
      },
      {
        title: '适用条件与小结',
        content: `<ul>
          <li>贪心成立的前提是<b>边权非负</b>：有负权边时"dist 最小即最终确定"不再成立（可能绕道更近），需用 Bellman-Ford 类算法（课件未讲）；</li>
          <li>朴素实现 O(n²)（每轮线性找最小 + 全表松弛）；</li>
          <li>所有顶点对之间的最短路径用 <b>Floyd</b> 算法：A⁽ᵏ⁾[i][j] = min{A⁽ᵏ⁻¹⁾[i][j], A⁽ᵏ⁻¹⁾[i][k] + A⁽ᵏ⁻¹⁾[k][j]}，O(n³)。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch6" class="lesson-link">练习测验巩固第 6 章</a>，或看<a href="#/visualization" class="lesson-link">Dijkstra 动画演示</a>。</p>`,
      },
    ],
  },

  'lesson-topo': {
    title: '图：拓扑排序与入度栈',
    chapter: 'ch6',
    summary: [
      'AOV 网：顶点=活动，有向边=先后关系；拓扑排序把所有顶点排成满足全部先后关系的线性序列。',
      '方法：反复"输出一个无前驱（入度 0）的顶点 + 删除它及其出边"；实现上用入度数组 + 栈。',
      '输出顶点数 < n ⇒ 网中存在有向环，工程不可行——拓扑排序也是判环手段。',
      '复杂度 O(n + e)：每顶点进出栈各一次，每条边入度减一一次。',
    ],
    steps: [
      {
        title: 'AOV 网与拓扑排序',
        content: `<p><b>AOV 网络</b>（Activity On Vertices）：顶点表示活动，有向边 &lt;Vᵢ, Vⱼ&gt; 表示"活动 Vᵢ 必须先于 Vⱼ"。</p>
          <p><b>拓扑排序</b>：把所有顶点排成一个线性序列，使图中所有的前驱→后继关系都得到满足。</p>
          <ul>
            <li>排完全部顶点 ⇒ 网中<b>无有向环</b>（工程可行）；</li>
            <li>排不完（剩顶点都有前驱）⇒ <b>存在有向环</b>（某活动以自己为先决条件，矛盾！）。</li>
          </ul>
          <p>AOV 网中<b>不允许出现有向环</b>，所以拓扑排序也是检测有向环的手段。</p>`,
      },
      {
        title: '示例与入度数组',
        content: `<p>DAG（有向无环图）：边 C0→C1、C0→C3、C1→C4、C2→C1、C2→C5、C3→C5。</p>
          <pre class="lesson-tree">C0 → C1 → C4
C0 → C3 → C5
C2 → C1 ,  C2 → C5</pre>
          <p>邻接表上增设 <b>count[] 入度数组</b>：入度为 0 ⇔ 无直接前驱 ⇔ 当前可以"毕业"。各顶点入度：C0=0, C1=2, C2=0, C3=1, C4=1, C5=2，即 count = [0, 2, 0, 1, 1, 2]。</p>
          <p>输入每条边 &lt;j, k&gt; 时建立边结点并 <code>count[k]++</code> 统计入度。</p>`,
        interaction: {
          type: 'quiz',
          question: '拓扑排序中，"当前可以输出的顶点"满足什么条件？',
          options: ['入度为 0', '出度为 0', '度数最大', '编号最小'],
          answer: 0,
          hint: '入度 0 说明它的所有前驱都已输出，不会再有约束',
        },
      },
      {
        title: '栈式算法：用 count[] 自身做栈',
        content: `<p>算法流程：① 所有入度 0 的顶点进栈 → ② 弹出顶点 v 输出 → ③ v 的所有出边终点入度减一，减到 0 者进栈 → 重复。</p>
          <p>省空间的技巧：直接拿 count[] 数组元素当链栈用（<code>count[i] = top; top = i;</code>）。</p>
          <p>对示例追踪（count = [0,2,0,1,1,2]）：</p>
          <pre><code>建栈: C0、C2 入栈(top=2)
弹 C2: C1 入度 2→1, C5 入度 2→1（无新入栈）      输出: C2
弹 C0: C1 入度 1→0 入栈, C3 入度 1→0 入栈       输出: C2,C0
弹 C3: C5 入度 1→0 入栈                         输出: C2,C0,C3
弹 C5: （无出边）                               输出: C2,C0,C3,C5
弹 C1: C4 入度 1→0 入栈                         输出: C2,C0,C3,C5,C1
弹 C4: 栈空                                     输出: C2,C0,C3,C5,C1,C4 ✓</code></pre>
          <p>6 个顶点全部输出 ⇒ <b>无有向环</b>。同一个图的合法拓扑序列不止一个（如 C0,C2,C3,C1,C5,C4 也合法），排序结果不唯一。</p>`,
      },
      {
        title: '练一练：辨认合法拓扑序列',
        content: `<p>对上图（边 C0→C1、C0→C3、C1→C4、C2→C1、C2→C5、C3→C5），逐条检查序列是否满足所有先后关系：</p>
          <ul>
            <li><code>C2, C0, C3, C5, C1, C4</code> ✅ 逐边验证全部满足；</li>
            <li><code>C0, C1, C4, C2, C3, C5</code> ❌ C1 排在 C2 前面，违反 C2→C1；</li>
            <li><code>C0, C2, C3, C1, C5, C4</code> ✅ 合法。</li>
          </ul>
          <p>判断方法：<b>只看图中给出的边</b>，每条边 u→v 都要求 u 在序列中先于 v；图中没有先后关系的顶点（如 C4 与 C2）怎么排都行。另一个快速技巧：合法序列的<b>任何前缀</b>都不可能"漏掉"某个顶点的全部前驱。</p>`,
        interaction: {
          type: 'quiz',
          question: '对上图的 DAG，序列 C0, C1, C2, C3, C4, C5 是否为合法拓扑序列？',
          options: ['不合法：C1 排在 C2 之前违反了边 C2→C1', '合法', '不合法：C5 排在 C4 之前', '不合法：C3 应该最前'],
          answer: 0,
          hint: '检查每条边：C2→C1 要求 C2 先于 C1，但序列里 C1 在第 2 位、C2 在第 3 位。',
        },
      },
      {
        title: '拓扑排序代码走读',
        code: {
          lang: 'cpp',
          activeLine: 13,
          code: `template <class T, class E>
void TopologicalSort(Graph<T, E>& G) {
    int top = -1;                        // 栈顶指针
    int n = G.NumberOfVertices();
    int* count = new int[n];             // 入度数组兼入度为零顶点栈
    for (i = 0; i < n; i++) count[i] = 0;
    cin >> i >> j;                       // 输入一条边 (i, j)
    while (i > -1 && i < n && j > -1 && j < n) {
        G.insertEdge(i, j);  count[j]++; // 统计入度
        cin >> i >> j;
    }
    for (i = 0; i < n; i++)              // 入度为零的顶点进栈
        if (count[i] == 0) { count[i] = top;  top = i; }
    for (i = 0; i < n; i++) {            // 期望输出 n 个顶点
        if (top == -1) {                 // 中途栈空！
            cout << "网络中有回路！" << endl;  return;
        }
        v = top;  top = count[top];      // 退栈 v 并输出
        cout << G.getValue(v) << endl;
        for (w = G.getFirstNeighbor(v); w != -1;
             w = G.getNextNeighbor(v, w)) {
            count[w]--;                  // 邻接点入度减一
            if (count[w] == 0) { count[w] = top;  top = w; }
        }
    }
}`,
          explanations: {
            3: 'top 为栈顶指针，-1 表示空栈。',
            6: 'count[] 一数组两用：先存真实入度，之后兼任链栈（存"下一个栈元素"的下标）。',
            12: '进栈操作：count[i] 记住原栈顶，自己成为新栈顶。',
            15: '循环 n 次，期望每次都能弹出一个顶点。',
            16: '中途栈空 = 剩余顶点都有前驱 = 存在有向环，这是判环出口。',
            19: '退栈：取出 v，top 退到 count[v] 里记着的下一个。',
            23: '每条边执行一次入度减一；减到 0 的新"毕业生"立即进栈。',
          },
        },
        interaction: {
          type: 'quiz',
          question: '拓扑排序结束时，若输出的顶点个数少于图中顶点个数，说明什么？',
          options: ['图中存在有向环', '图不连通', '图中存在入度为 0 的顶点', '算法写错了'],
          answer: 0,
          hint: '排不完说明剩下的顶点互相构成"前驱循环"——有向环，工程不可行。',
        },
      },
      {
        title: '复杂度与易错点',
        content: `<ul>
          <li>时间复杂度 <b>O(n + e)</b>：建栈扫描 O(n)；每顶点进出栈各一次；每条边做一次入度减一（共 e 次）；</li>
          <li>易错①：删顶点时是"删除它的所有<b>出</b>边"（入度减一），方向别搞反；</li>
          <li>易错②：拓扑序列<b>不唯一</b>，选择题问"可能/不可能的序列"——逐一验证每条边的前后关系即可；</li>
          <li>易错③：AOV 网用顶点表示活动；还有一种 <b>AOE 网</b>（边表示活动）用于求关键路径，别混淆。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch6" class="lesson-link">练习测验巩固第 6 章</a>。</p>`,
      },
    ],
  },

  /* ============ ch7 查找 ============ */

  'lesson-binary-search': {
    title: '二分查找：过程与代码',
    chapter: 'ch7',
    summary: [
      '二分查找前提：数据有序 + 支持随机访问（顺序存储）。',
      '每轮与中间元素比较，搜索范围缩小一半，最多比较 ⌊log₂n⌋ + 1 次，O(log n)。',
      'mid = low + (high - low) / 2 防止 (low + high) 溢出。',
      '循环条件 low <= high（带等号），错写成 < 会漏掉单元素区间。',
    ],
    steps: [
      {
        title: '两个前提条件',
        content: `<ul>
            <li>✅ 数据必须<b>有序</b>（以递增为例）；</li>
            <li>✅ 结构必须支持<b>随机访问</b>（数组/顺序表）——链表走不到"中间元素"。</li>
          </ul>
          <p>核心思想：比较中间元素，要么直接命中，要么排除一半，<b>范围每次折半</b>。</p>`,
      },
      {
        title: '执行过程演示',
        content: `<p>在 [1, 3, 5, 7, 9, 11, 13]（下标 0~6）中查找 <b>9</b>：</p>
          <p>第1步：low=0, high=6, mid=3，arr[3]=7 &lt; 9 → <code>low = mid + 1 = 4</code>，左半区 [0..3] 全部淘汰：</p>`,
        array: {
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [4, 5, 6],
          caption: '高亮的是存活区间 [4..6]，左边四个元素已被排除',
        },
      },
      {
        title: '继续折半',
        content: `<p>第2步：low=4, high=6, mid=5，arr[5]=11 &gt; 9 → high = mid−1 = 4。<br>第3步：low=4, high=4, mid=4，arr[4]=9 == 9，<b>找到！</b></p>`,
        array: {
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [4],
          caption: '第3步：区间收缩到单元素 [4,4]，恰好命中',
        },
        interaction: {
          type: 'quiz',
          question: '承上例：在长度为 n 的有序表上二分查找，最多比较多少次？',
          options: ['⌊log₂n⌋ + 1 次', 'n/2 次', 'n 次', '2·log₂n + 1 次'],
          answer: 0,
          hint: 'n → n/2 → n/4 → … → 1，折半 log₂n 次后区间只剩 1 个元素，还需比较这一次。',
        },
      },
      {
        title: '查找失败：区间何时为空',
        content: `<p>查找一个<b>不存在</b>的元素 6：</p>
          <p>第1步：low=0, high=6, mid=3，arr[3]=7 &gt; 6 → high = 2；<br>
          第2步：low=0, high=2, mid=1，arr[1]=3 &lt; 6 → low = 2；<br>
          第3步：low=2, high=2, mid=2，arr[2]=5 &lt; 6 → low = 3；<br>
          此时 <b>low=3 &gt; high=2，区间为空</b>，循环退出，返回 −1。</p>`,
        array: {
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [],
          caption: 'low 与 high 交叉（low > high）就是"找遍整个范围都没有"的信号——这正是循环条件 low <= high 的由来',
        },
        interaction: {
          type: 'quiz',
          question: '二分查找中，while 循环写成 low < high（漏了等号）会怎样？',
          options: [
            '区间只剩一个元素时不再比较，可能漏掉目标',
            '会陷入死循环',
            '没有影响，结果一样',
            'mid 计算会出错',
          ],
          answer: 0,
          hint: '闭区间写法下 low == high 时区间还有 1 个元素必须比较；漏等号就漏查了它。',
        },
      },
      {
        title: '代码走读',
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {                  // 注意带等号
        int mid = low + (high - low) / 2;  // 防溢出写法！
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;                             // 未找到
}`,
          explanations: {
            3: 'low <= high：区间 [low, high] 闭区间写法。写成 < 会漏查只剩一个元素的情况。',
            4: 'mid = low + (high-low)/2 与 (low+high)/2 数学上等价，但避免了 low+high 相加溢出——面试常考。',
            5: '命中直接返回下标。',
            6: '目标在右半区：mid 已经比过了，low 越过它（+1），否则可能死循环。',
            9: 'low > high 说明区间为空，查找失败返回 -1。',
          },
        },
      },
      {
        title: '性能与易错点',
        content: `<p>判定树分析：n 个元素的二分查找判定树是平衡的，<b>平均搜索长度 ASL ≈ log₂(n+1) − 1</b>，时间复杂度 <span class="complexity-badge badge-time">O(log n)</span>，空间 O(1)（迭代版）。</p>
          <ul>
            <li>易错①：循环条件漏等号（low &lt;= high）；</li>
            <li>易错②：移动边界时忘了 ±1（<code>low = mid</code> 会死循环）；</li>
            <li>易错③：递归版空间是 O(log n)（栈），迭代版才是 O(1)；</li>
            <li>易错④：有序表用<b>链表</b>存时二分不划算——定位 mid 要 O(n)。</li>
          </ul>
          <p>👉 去<a href="#/quiz/ch7" class="lesson-link">练习测验巩固第 7 章</a>。</p>`,
      },
    ],
  },

  'lesson-bst': {
    title: '二叉搜索树（BST）：查找、插入与删除',
    chapter: 'ch7',
    summary: [
      'BST 性质：左子树所有结点 < 根 < 右子树所有结点，左右子树也是 BST。',
      '中序遍历 BST 得到递增有序序列——这是检验/构造 BST 的利器。',
      '删除有三种情况：叶子直接删；单孩子用子树顶替；双孩子用中序后继（右子树最小）顶替后转情况一/二。',
      '查找、插入、删除都是 O(h)；平衡时 O(log n)，退化成链表时 O(n)——引出 AVL 树。',
    ],
    steps: [
      {
        title: 'BST 的定义与推论',
        content: `<p><b>二叉搜索树</b>或者为空，或者满足：</p>
          <ul>
            <li>左子树上所有结点值 <b>&lt;</b> 根结点值；</li>
            <li>右子树上所有结点值 <b>&gt;</b> 根结点值；</li>
            <li>左右子树也分别是 BST（递归定义）。</li>
          </ul>
          <p>两个重要推论：</p>
          <ol>
            <li><b>中序遍历 BST 得到递增有序序列</b>；</li>
            <li>查找时每次比较可以排除一整棵子树——效率取决于<b>树高 h</b>。</li>
          </ol>`,
      },
      {
        title: '动手构造：逐个插入',
        content: `<p>依次插入 <b>23, 12, 43, 10, 18</b>（空树开始，新结点总挂在叶子层）：</p>
          <pre class="lesson-tree">插 23:  [23]                 （成为根）
插 12:  23 的左孩子
插 43:  23 的右孩子
插 10:  12 的左孩子（10<23→左，10<12→左）
插 18:  12 的右孩子（18<23→左，18>12→右）

         23
        /  \\
      12    43
     /  \\
   10    18</pre>
          <p>验证：中序遍历得 <code>10 12 18 23 43</code>——递增有序 ✓。插入次序影响树形：同样 5 个数，若按 10,12,18,23,43 插入就退化成链了。</p>`,
        interaction: {
          type: 'quiz',
          question: '按 23, 12, 43, 10, 18 的次序插入一棵空 BST 后，其中序遍历序列是？',
          options: ['10 12 18 23 43', '23 12 10 18 43', '10 18 12 43 23', '43 23 18 12 10'],
          answer: 0,
          hint: 'BST 的中序遍历一定是递增有序的——不管以什么次序插入。',
        },
      },
      {
        title: '查找与插入（代码走读）',
        content: `<p>查找：从根出发，小往左、大往右。插入：一路查找到底，作为新叶挂上去——<b>新结点总是插在叶子层</b>。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `BSTNode* search(BSTNode* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key)
        return search(root->left, key);    // 比根小，进左子树
    else
        return search(root->right, key);   // 比根大，进右子树
}

bool insert(BSTNode*& subRoot, int x) {
    if (subRoot == NULL) {                 // 空位：正是插入点
        subRoot = new BSTNode(x);  return true;
    }
    if (x < subRoot->key) return insert(subRoot->left, x);
    if (x > subRoot->key) return insert(subRoot->right, x);
    return false;                          // 已存在，插入失败
}`,
          explanations: {
            2: '两个出口：走到空（失败）或值相等（成功）。',
            4: 'BST 性质让每次比较排除一整棵子树。',
            8: '用引用传指针：找到空位后直接改父结点的孩子指针。',
            9: '插入即查找"失败的终点"，所以插入的新结点必然是叶子。',
            12: 'BST 通常不允许重复键，视约定也可挂在右子树。',
          },
        },
      },
      {
        title: '删除：三种情况',
        content: `<ol>
            <li><b>叶子结点</b>：直接删除，父指针置 NULL；</li>
            <li><b>只有一个孩子</b>：让孩子顶替被删结点的位置（父指针改指孩子）；</li>
            <li><b>有两个孩子</b>：用<b>中序后继</b>（右子树中最小的结点）或中序前驱的值顶替它，然后转去删除那个后继结点——后继必无左孩子，回到情况一/二。</li>
          </ol>
          <pre class="lesson-tree">删除 8（双孩子）：后继是右子树最小者 10
        8              10
       / \\            /  \\
      3   12    →    3    12
         /  \\             /  \\
          <pre class="lesson-tree">删除 8（双孩子）：后继是右子树最小者 10
        8                    10
       / \\                  /  \\
      3   12       →      3    12
         /  \\                /  \\
       10    15            11*    15
         \\
          11                （10 顶替 8 后，其原位置由 11 顶替）</pre>
          <p>为什么选中序后继？它是"比 8 大的最小结点"，顶替 8 后仍然满足 BST 性质。</p>`,
        interaction: {
          type: 'quiz',
          question: '删除一个有两个孩子的 BST 结点时，通常用什么顶替它？',
          options: [
            '其右子树中的最小结点（中序后继）',
            '其左子树中的最小结点',
            '其右子树中的最大结点',
            '根结点',
          ],
          answer: 0,
          hint: '中序后继 = 右子树最左下结点，恰好"夹"在大小关系中间。用中序前驱（左子树最大）也可以。',
        },
      },
      {
        title: '查找效率：ASL 怎么算',
        content: `<p>查找某结点的比较次数 = 它的<b>深度 + 1</b>（从根走下来的层数）。对"动手构造"一步得到的树：</p>
          <table>
            <tr><th>结点</th><td>23</td><td>12</td><td>43</td><td>10</td><td>18</td></tr>
            <tr><th>比较次数</th><td>1</td><td>2</td><td>2</td><td>3</td><td>3</td></tr>
          </table>
          <p class="formula">ASL_succ = (1 + 2 + 2 + 3 + 3) / 5 = 11/5</p>
          <p>同理可算失败查找的 ASL：对每个"空指针位置"（共 n+1 个）数从根走到那里的比较次数取平均。</p>`,
        interaction: {
          type: 'quiz',
          question: 'n 个结点的 BST 查找成功时的平均比较次数，最好与最差情况分别是？',
          options: ['最好 O(log n)，最差 O(n)', '最好 O(n)，最差 O(log n)', '都是 O(log n)', '都是 O(n)'],
          answer: 0,
          hint: '树形均衡时深度约 log₂n；退化成单支链时深度为 n。',
        },
      },
      {
        title: '性能与退化的危险',
        content: `<p>查找/插入/删除都正比于树高：平衡时 O(log n)。</p>
          <p>但如果按<b>有序序列</b>插入（如 1,2,3,4,5…），BST 退化成一条链（单支树），查找沦为 O(n)——比顺序查找还多了指针开销。</p>
          <pre class="lesson-tree">输入 1,2,3,4,5 的退化 BST:
1 ── 2 ── 3 ── 4 ── 5   （全是右孩子）</pre>
          <p>怎么办？在插入/删除后<b>自动调整树形保持平衡</b>——这就是下一课的 AVL 树。</p>
          <p>👉 去<a href="#/quiz/ch7" class="lesson-link">练习测验巩固第 7 章</a>，或看<a href="#/visualization" class="lesson-link">BST 插入删除动画</a>。</p>`,
      },
    ],
  },

  'lesson-hash': {
    title: '散列表：线性探测插入演示',
    chapter: 'ch7',
    summary: [
      '散列思想：Address = Hash(key)，不经比较直接定位；不同关键码映到同一地址称为冲突，冲突双方互为同义词。',
      '除留余数法 hash(key) = key % p，p 取不超过表长 m 的最大质数且不接近 2 的幂。',
      '线性探测 Hi = (Hi−1 + 1) % m：冲突就顺次后找，到表尾绕回表头。',
      '非同义词抢占同一批后继位置连成一片，叫堆积（clustering），会显著拉长探测序列。',
    ],
    steps: [
      {
        title: '散列的思想与冲突',
        content: `<p>理想搜索是<b>不经比较、一次直达</b>。散列方法在关键码与存储位置间建立函数 <code>Address = Hash(key)</code>，插入和查找都按同一函数计算地址。</p>
          <p>但关键码集合远大于地址集合，散列是<b>压缩映象</b>——不同关键码可能映到同一地址，即<b>冲突</b>；这些互为<b>同义词</b>。</p>
          <p>课件例：hash(x) = x % 73 + 13420，则 12361、7251、3309、30976 四个关键码全部映到 13444。</p>
          <p>所以散列要回答两个问题：<b>①选一个分布均匀的散列函数；②冲突了怎么办。</b></p>`,
      },
      {
        title: '除留余数法 + 线性探测',
        content: `<p><b>除留余数法</b>：hash(key) = key % p，p 取"不超过 m 的最大质数，且不接近 2 的幂"。本课例（课件例 3）：</p>
          <ul>
            <li>散列表 A[0..11]，m = 12；散列函数 <b>H(K) = K mod 11</b>（地址实际只能取 0~10，槽 11 只能被探测到达）；</li>
            <li>关键码序列：10, 20, 15, 17, 21, 6, 8, 25, 40, 35, 27。</li>
          </ul>
          <p><b>线性探查法</b>：H₀ = hash(key)；若冲突，Hᵢ = (Hᵢ₋₁ + 1) % m，顺次向后找下一个空位，<b>表尾绕回表头</b>。</p>`,
        interaction: {
          type: 'quiz',
          question: '散列表长 m=12，为什么除数 p 取 11 而不取 12？',
          options: [
            '12 是合数且为 2 的幂附近，用合数做除数容易造成地址分布不均',
            '12 超出了表长范围',
            '取 11 能减少冲突到零',
            '没有道理，只是习惯',
          ],
          answer: 0,
          hint: 'p 应取"不超过 m 的最大质数"。用合数（尤其是 2 的幂）取模，关键码的低位信息会主导地址，分布倾斜。',
        },
      },
      {
        title: '插入演示（前半段）',
        content: `<p>依次插入，直到 21 为止：</p>
          <pre><code>10 → H=10，槽10空 ✓ 落位
20 → H=9，槽9空 ✓ 落位
15 → H=4，槽4空 ✓ 落位
17 → H=6，槽6空 ✓ 落位
21 → H=10 冲突！探测11：槽11空 ✓ 落位（探测2次）</code></pre>`,
        array: {
          data: [null, null, null, null, 15, null, 17, null, null, 20, 10, 21],
          highlights: [11],
          pointers: { },
          caption: '21 本该进槽 10，被 10 占了，顺次探测一格落进槽 11',
        },
      },
      {
        title: '插入演示（后半段）：40 的"环球旅行"',
        content: `<p>6 → 7 ✓；8 → 8 ✓；25 → 3 ✓；35 → 2 ✓；轮到 <b>40</b>：H(40)=7，但 7、8、9、10、11 已全部被占，<b>绕回表头</b>继续 0——槽 0 空，落位，共探测 <b>6</b> 次！最后 27 → 5 ✓。</p>`,
        array: {
          data: [40, null, 35, 25, 15, 27, 17, 6, 8, 20, 10, 21],
          highlights: [0],
          caption: '最终散列表。40 从 7 号槽一路探测绕回 0 号槽——这就是堆积的威力',
        },
        interaction: {
          type: 'quiz',
          question: '承上例：40 的散列地址是 7，最终却落位在槽 0，它一共探测了几次？',
          options: ['6 次', '2 次', '5 次', '7 次'],
          answer: 0,
          hint: '探测序列 7→8→9→10→11→0，共 6 个地址。',
        },
      },
      {
        title: '成功 ASL 的计算',
        content: `<p>各关键码成功查找所需比较（探测）次数 = 落位时探测的次数：</p>
          <table>
            <tr><th>关键码</th><td>10</td><td>20</td><td>15</td><td>17</td><td>21</td><td>6</td><td>8</td><td>25</td><td>40</td><td>35</td><td>27</td></tr>
            <tr><th>次数</th><td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>1</td><td>1</td><td>6</td><td>1</td><td>1</td></tr>
          </table>
          <p class="formula">ASL_succ = (8×1 + 2 + 2 + 6) / 11 = 18/11 ≈ 1.64</p>
          <p>查找<b>失败</b>的 ASL 则要按散列地址 0~10 逐个算"从该地址探测到第一个空槽"的次数（本例 75/11 ≈ 6.82）——失败探测可能绕全表一圈，比成功更贵。</p>`,
      },
      {
        title: '堆积问题与改进',
        content: `<p><b>堆积（clustering）</b>：不仅同义词会冲突，<b>非同义词</b>也会争夺同一段连续后继位置，越挤越长、越长越挤——40 探测 6 次就是被别人"连坐"的。</p>
          <p>缓解办法（课件介绍的其他闭散列法）：</p>
          <ul>
            <li><b>平方探测</b>：Hᵢ = (H₀ + i²) % m，跳跃式探测减少聚焦；</li>
            <li><b>双散列</b>：冲突时用第二个散列函数定步长 hash₂(key)，探测序列 d₁+c, d₁+2c, …；</li>
            <li><b>链地址法（开散列）</b>：同义词串成单链表挂在桶上，插删都在链表上做，不会堆积。</li>
          </ul>
          <p>👉 去<a href="#/quiz/ch7" class="lesson-link">练习测验巩固第 7 章</a>。</p>`,
      },
    ],
  },

  'lesson-avl': {
    title: 'AVL 树：四种旋转图解',
    chapter: 'ch7',
    summary: [
      '平衡因子 bf = 右子树高度 − 左子树高度；AVL 树任一结点 |bf| ≤ 1。',
      '失衡结点回溯查找：三个相关结点成直线用单旋，成折线用双旋（先拉直再单旋）。',
      'LL→右单旋、RR→左单旋、LR→先左后右双旋、RL→先右后左双旋。',
      '插入后高度保持，AVL 高度 O(log n)（不超过约 1.44·log₂(n+2)），查找稳定高效。',
    ],
    steps: [
      {
        title: '平衡因子与失衡',
        content: `<p><b>AVL 树</b>：左右子树都是 AVL 树，且左右子树<b>高度之差绝对值 ≤ 1</b>。</p>
          <p>每个结点带<b>平衡因子</b>（课件定义）：<code>bf = 右子树高度 − 左子树高度</code>，只能取 −1、0、1。一旦某结点 |bf| = 2，以它为根的子树就<b>失衡</b>了。</p>
          <p>插入新结点后，要<b>从插入位置沿通向根的路径回溯</b>，检查各祖先的 bf；发现第一个失衡结点就停止回溯，用旋转修复。</p>`,
        interaction: {
          type: 'quiz',
          question: '按课件定义（bf = 右高 − 左高），某结点 bf = −2 意味着什么？',
          options: ['左子树比右子树高 2 层，需要向右方向的调整', '右子树比左子树高 2 层', '该结点是叶结点', '树已经平衡'],
          answer: 0,
          hint: 'bf 是"右减左"，负数说明左边高。左高 2 层对应 LL 或 LR 型失衡。',
        },
      },
      {
        title: '旋转的判型总则',
        content: `<p>设失衡结点为 A，沿插入路径取 A 之下<b>直接的两层结点</b>，共三个结点：</p>
          <table>
            <tr><th>三结点形态</th><th>类型</th><th>调整</th></tr>
            <tr><td>左孩子的左子树高（直线）</td><td>LL</td><td><b>右单旋</b>（以 B 为轴）</td></tr>
            <tr><td>右孩子的右子树高（直线）</td><td>RR</td><td><b>左单旋</b>（以 C 为轴）</td></tr>
            <tr><td>左孩子的右子树高（折线）</td><td>LR</td><td><b>先左后右双旋</b></td></tr>
            <tr><td>右孩子的左子树高（折线）</td><td>RL</td><td><b>先右后左双旋</b></td></tr>
          </table>
          <p>记忆：<b>直线单旋、折线双旋</b>。为什么折线要旋两次？一次旋转无法同时满足 BST 性质与平衡条件——先"把折线拉直"，再单旋即可。</p>`,
      },
      {
        title: 'LL 型：右单旋转',
        content: `<p>在 A 的<b>左孩子的左子树</b>插入使 A 的 bf 变为 −2。以 B 为轴把 A 顺时针转下来：</p>
          <pre class="lesson-tree">   A(-2)              B(0)
   /   \\             /    \\
  B(-1) C     →      D      A(0)
 /   \\                     /   \\
D(h+1) E                  E     C</pre>
          <p>B 升为子树新根；B 原来的右子树 E"过继"给 A 当左子树（E 中的值介于 B、A 之间，正好放这）。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `template <class E, class K>
void AVLTree<E, K>::RotateR(AVLNode<E, K>*& ptr) {
    AVLNode<E, K>* subR = ptr;       // A 结点
    ptr = subR->left;                // B 上升成为新根
    subR->left = ptr->right;         // B 的原右子树 E 交给 A 当左子树
    ptr->right = subR;               // A 成为 B 的右孩子
    ptr->bf = subR->bf = 0;          // A、B 平衡因子归 0
}`,
          explanations: {
            3: 'ptr 是指向 A 的引用，旋转后要让它指向新根 B。',
            5: '关键交接：E 原本是 B 的右子树，B 上升后空出来，交给 A 接管——顺序不能反。',
            6: 'A 挂到 B 的右边。',
            7: 'LL 单旋后 A、B 的 bf 都回到 0。',
          },
        },
      },
      {
        title: 'RR 型：左单旋转',
        content: `<p>在 A 的<b>右孩子的右子树</b>插入使 bf 变为 2。以 C 为轴把 A 逆时针转下来——与右单旋完全镜像：</p>
          <pre class="lesson-tree">  A(2)                    C(0)
 /   \\                  /     \\
B     C(1)     →      A(0)     E
     /   \\            /   \\
    D(h) E(h+1)      B     D</pre>
          <p>C 升为新根；C 原来的左子树 D 交给 A 当右子树。A、C 的 bf 归 0。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `template <class E, class K>
void AVLTree<E, K>::RotateL(AVLNode<E, K>*& ptr) {
    AVLNode<E, K>* subL = ptr;       // A 结点
    ptr = subL->right;               // C 上升成为新根
    subL->right = ptr->left;         // C 的原左子树 D 交给 A 当右子树
    ptr->left = subL;                // A 成为 C 的左孩子
    ptr->bf = subL->bf = 0;
}`,
          explanations: {
            4: '与 RotateR 逐行镜像：left 和 right 全部对调。',
            5: 'D 是"中间值"子树，从 C 手里转到 A 手里。',
          },
        },
      },
      {
        title: 'LR 型：先左后右双旋',
        content: `<p>在 A 的<b>左孩子的右子树</b>插入（折线！）。两步走：</p>
          <ol>
            <li>以 <b>E</b> 为轴把 B 左旋——把折线<b>拉直</b>；</li>
            <li>再以 <b>E</b> 为轴把 A 右旋——恢复平衡。</li>
          </ol>
          <pre class="lesson-tree">    A(-2)          对B左旋        E(0)
   /    \\          ────→        /     \\
  B(1)   C        再对A右旋    B        A
 /    \\                        / \\     / \\
D      E(插入)               D   F   G   C
      / \\
     F   G</pre>
          <p>E 上两层的左右孩子 F、G 分别被 B、A 接走：F（介于 B、E 之间）归 B 当右孩子，G（介于 E、A 之间）归 A 当左孩子。新根 E 的 bf = 0；B、A 的 bf 依据插入位置修正（课件 RotateLR 代码中的两个 if）。</p>`,
        interaction: {
          type: 'quiz',
          question: '插入后某结点 bf = −2，且其左孩子的 bf = 1，应执行哪种旋转？',
          options: ['先左后右双旋（LR）', '右单旋（LL）', '左单旋（RR）', '先右后左双旋（RL）'],
          answer: 0,
          hint: 'bf=−2 → 左边高；左孩子 bf=1 → 孩子右子树更高 → 折线（左-右）→ LR 双旋。',
        },
      },
      {
        title: 'RL 型：先右后左双旋',
        content: `<p>LR 的镜像：在 A 的<b>右孩子的左子树</b>插入。先以 <b>D</b> 为轴把 C 右旋拉直，再以 <b>D</b> 为轴把 A 左旋：</p>
          <pre class="lesson-tree">  A(2)             先对C右旋      D(0)
 /    \\            再对A左旋    /    \\
B      C(-1)      ────→       B       C
      /    \\                         /   \\
     D(插入) E                      F     A → E
    / \\                                   / \\
   F   G                                 G   E</pre>
          <p>D 上升为新根：G 归 C 当左孩子、F 保持在 D 的左子树。新根 D 的 bf = 0。</p>
          <p>四种旋转口诀：<b>LL 右旋、RR 左旋、LR 左-右、RL 右-左</b>——名字写的是"插入位置"，操作写的是"旋转方向"，方向与插入位置正好相反。</p>`,
      },
      {
        title: '完整插入实例',
        content: `<p>依次插入 <b>{16, 3, 7, 11, 9, 26, 18, 14, 15}</b>，调整过程：</p>
          <table>
            <tr><th>插入</th><th>失衡与调整</th></tr>
            <tr><td>16</td><td>根 16</td></tr>
            <tr><td>3</td><td>bf(16)=−1，无需旋转</td></tr>
            <tr><td>7</td><td>bf(16)=−2，左孩子 3 的 bf=1 → <b>LR 双旋</b> → 根 7</td></tr>
            <tr><td>11</td><td>无需旋转</td></tr>
            <tr><td>9</td><td>bf(16)=−2，LL 直线 → <b>右单旋</b> → 11(9,16)</td></tr>
            <tr><td>26</td><td>bf(7)=2，RR 直线 → <b>左单旋</b> → 根 11</td></tr>
            <tr><td>18, 14</td><td>无需旋转</td></tr>
            <tr><td>15</td><td>bf(18)=−2，左孩子 14 的 bf=1 → <b>LR 双旋</b> → 15(14,18)</td></tr>
          </table>
          <p>最终 AVL 树：<b>11( 7(3, 9), 16( 15(14, 18), 26 ) )</b>，所有结点 bf ∈ {−1, 0, 1} ✓（与课件一致）。</p>`,
      },
      {
        title: '复杂度与小结',
        content: `<p>AVL 树高度上界：由递推 N<sub>h</sub> = N<sub>h−1</sub> + N<sub>h−2</sub> + 1（与 Fibonacci 数列同构），可得有 n 个结点的 AVL 树高度 <b>h &lt; 1.44·log₂(n+2)</b>——保证最坏情况查找也是 <span class="complexity-badge badge-time">O(log n)</span>。插入、删除（含旋转）均为 O(log n)。</p>
          <ul>
            <li>判型口诀：bf=2 看右孩子（bf=1 左单旋 / bf=−1 RL 双旋）；bf=−2 看左孩子（bf=−1 右单旋 / bf=1 LR 双旋）；</li>
            <li>旋转是<b>局部</b>操作：单旋 O(1) 修复整个失衡，子树高度恢复，上层无需继续；</li>
            <li>AVL 适合内存中的搜索结构；外存索引用 B 树（后面有专门课程）。</li>
          </ul>
          <p>👉 去<a href="#/quiz/ch7" class="lesson-link">练习测验巩固第 7 章</a>。</p>`,
      },
    ],
  },

  /* ============ ch8 排序 ============ */

  'lesson-bubble': {
    title: '冒泡排序详解',
    chapter: 'ch8',
    summary: [
      '每趟从前往后比较相邻元素，逆序就交换，最大值"冒泡"到末尾。',
      '优化：某趟无交换说明已有序，可提前结束——最好情况 O(n)。',
      '最坏/平均 O(n²)，空间 O(1)，稳定排序。',
      '第 i 趟结束后末尾 i 个元素就位，内层循环范围 n-1-i。',
    ],
    steps: [
      {
        title: '什么是冒泡排序？',
        content: `<p>冒泡是最直观的<b>交换排序</b>：反复比较<b>相邻</b>两个元素，逆序就交换。每一趟把当前未排序部分的最大值"冒泡"到末尾。</p>
          <p>为什么相邻比较就够？一趟下来最大值一定会被"接力"推到最右——像水底的气泡一路浮到水面。</p>`,
      },
      {
        title: '第一趟冒泡演示',
        content: `<p>对 [5, 3, 8, 1, 2] 做第一趟（j 从 0 到 3）：</p>`,
        array: {
          data: [3, 5, 1, 2, 8],
          highlights: [4],
          caption: '第一趟结束：比较 (5,3)交换 → (5,8)不换 → (8,1)交换 → (8,2)交换，最大值 8 冒泡到末尾',
        },
      },
      {
        title: '第二趟与提前结束优化',
        content: `<p>第二趟只需比较前 4 个元素（8 已就位）：<code>[3, 5, 1, 2, 8] → [3, 1, 2, 5, 8]</code>。第三趟后整体有序。</p>
          <p><b>关键优化</b>：设 swapped 标志，一趟下来没有任何交换 ⇒ 序列已经有序 ⇒ <b>提前 break</b>。这让<b>最好情况（已有序）只需 n−1 次比较，O(n)</b>。</p>`,
        array: {
          data: [3, 1, 2, 5, 8],
          highlights: [3, 4],
          caption: '第二趟结束：5 和 8 均就位（高亮），下一趟比较范围再缩小一格',
        },
      },
      {
        title: '代码走读',
        code: {
          lang: 'cpp',
          activeLine: 5,
          code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {        // 共 n-1 趟
        bool swapped = false;                // 优化标志
        for (int j = 0; j < n - 1 - i; j++) {   // 范围逐趟缩小
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;                 // 本趟无交换：已有序！
    }
}`,
          explanations: {
            2: 'n 个元素最多 n−1 趟：每趟固定一个最大值。',
            4: '内层上界 n−1−i：末尾 i 个元素已经就位，不必再比。',
            6: '相邻逆序才交换——相等元素不交换，这正是冒泡<b>稳定</b>的原因。',
            10: '一趟零交换 ⇒ 后面也不可能再有逆序对，直接收工。',
          },
        },
      },
      {
        title: '复杂度与稳定性',
        content: `<table>
          <tr><th>情况</th><th>比较次数</th><th>交换次数</th><th>时间复杂度</th></tr>
          <tr><td>最好（已有序）</td><td>n−1</td><td>0</td><td>O(n)</td></tr>
          <tr><td>最坏（逆序）</td><td>n(n−1)/2</td><td>n(n−1)/2</td><td>O(n²)</td></tr>
          <tr><td>平均</td><td>n(n−1)/2</td><td>n(n−1)/4</td><td>O(n²)</td></tr>
        </table>
        <p><b>空间</b> O(1)；<b>稳定性</b>：✅ 稳定（相等不交换）。</p>`,
        interaction: {
          type: 'quiz',
          question: '对已排好序的序列做带 swapped 优化的冒泡排序，比较次数是？',
          options: ['n−1 次（一趟就提前结束）', 'n(n−1)/2 次', 'n 次', 'log n 次'],
          answer: 0,
          hint: '第一趟扫完全程一次交换都不发生，swapped 为 false 直接 break。',
        },
      },
      {
        title: '小结与对比',
        content: `<p>一句话总结：<b>好写、稳定、但慢</b>——适合教学和小规模数据。</p>
          <p>同门对比：简单选择排序每趟选最值放前端，交换次数少（≤ n−1）但不稳定；快速排序平均 O(n log n) 但不稳定。稳定性速记：<b>稳定的有插入、冒泡、归并；不稳定的有希尔、快排、选择、堆</b>。</p>
          <p>👉 去<a href="#/quiz/ch8" class="lesson-link">练习测验巩固第 8 章</a>，或看<a href="#/visualization" class="lesson-link">冒泡排序动画</a>。</p>`,
      },
    ],
  },

  'lesson-quicksort': {
    title: '快速排序：partition 逐步追踪',
    chapter: 'ch8',
    summary: [
      '快排 = 选基准 + 划分（partition）+ 左右子序列递归；划分是灵魂。',
      '挖坑法（SPLIT）：基准暂存留空位，high 端小元素填左坑、low 端大元素填右坑，最后基准归位。',
      '理想划分均衡 T(n)=Θ(n log n)；已有序/逆序时划分极不平衡，退化 Θ(n²)。',
      '随机选取基准可把最坏情况概率降到极小；快排是原地排序但不稳定。',
    ],
    steps: [
      {
        title: '分治思想与快排框架',
        content: `<p>快速排序（Hoare, 1960）是分治策略的招牌应用：</p>
          <ol>
            <li><b>划分</b>：任取一个元素（如第一个）作<b>基准 pivot</b>，把序列分成"≤ pivot"和"&gt; pivot"两部分，pivot 落在中间——<b>它的最终位置就此确定</b>；</li>
            <li><b>递归</b>：对左右两个子序列重复上述过程；</li>
            <li>子序列长度 ≤ 1 时自然有序。</li>
          </ol>
          <p>框架：<code>QuickSort(L, left, right): 若 left<right, w=Partition(L,left,right), 递归左、递归右</code>。注意顺序存储下两个子序列还在原数组中，<b>不需要真正的合并步骤</b>。</p>`,
      },
      {
        title: '挖坑法划分：规则',
        content: `<p>以数组 <b>A = [4, 6, 3, 1, 8, 7, 2, 5]</b>、low=0、high=7 为例（课件 SPLIT 算法原例）。基准 x = A[low] = 4，A[low] 的位置成为<b>空坑 Φ</b>：</p>
          <ol>
            <li>从 high 端向左找<b>小于 x</b> 的元素，填入左坑，坑换到它原来的位置；</li>
            <li>再从 low 端向右找<b>大于 x</b> 的元素，填入右坑；</li>
            <li>low 与 high 相遇时，把 x 放进最后的坑。</li>
          </ol>
          <p>整个过程中"坑"在 low 与 high 之间左右跳动，被跳过的元素分别归入左、右两侧——<b>原地</b>完成，不需要辅助数组。</p>`,
      },
      {
        title: '逐步追踪（第 1~2 步）',
        content: `<p>x = 4，空坑在下标 0：</p>
          <pre><code>初始   [4, 6, 3, 1, 8, 7, 2, 5]   x=4, low=0, high=7, 坑在0
step1  A[high]=2 < 4 → 填入坑0, low++
       [2, 6, 3, 1, 8, 7, Φ, 5]   坑在6, high不动
step2  A[low]=6 > 4 → 填入坑6, high--
       [2, Φ, 3, 1, 8, 7, 6, 5]   坑在1</code></pre>`,
        array: {
          data: [2, 'Φ', 3, 1, 8, 7, 6, 5],
          highlights: [1, 6],
          caption: 'step2 后：坑（Φ）在下标 1；2 已归左区、6 已归右区（下标 6）',
        },
      },
      {
        title: '逐步追踪（第 3~4 步）',
        content: `<pre><code>step3  A[high]=7≥4、8≥4，high 前移；A[high]=1 < 4 → 填入坑1, low++
       [2, 1, 3, Φ, 8, 7, 6, 5]   坑在3, low=2
step4  A[low]=3 ≤ 4 → low++；low==high，循环结束
最终   A[low] ← x=4
       [2, 1, 3, 4, 8, 7, 6, 5]   w = 3</code></pre>
          <p>基准 4 落在下标 3：左边 {2,1,3} 全 ≤ 4，右边 {8,7,6,5} 全 &gt; 4 ✓（与课件 SPLIT 输出一致）。</p>`,
        array: {
          data: [2, 1, 3, 4, 8, 7, 6, 5],
          highlights: [0, 1, 2, 3],
          caption: '划分完成：4 就位（w=3），左侧 ≤4，右侧 >4',
        },
        interaction: {
          type: 'quiz',
          question: '承上例：一轮 SPLIT 之后，接下来快排怎么做？',
          options: [
            '对 [2,1,3] 和 [8,7,6,5] 分别递归做同样的划分',
            '把两部分归并排序',
            '再对整个数组做一遍 SPLIT',
            '直接输出，已经有序',
          ],
          answer: 0,
          hint: '基准已就位不再参与；左右两个子序列各自独立递归。顺序存储下无需合并。',
        },
      },
      {
        title: '划分代码走读',
        code: {
          lang: 'cpp',
          activeLine: 5,
          code: `// 挖坑法划分（课件 Partition_Classic，按 Vector 风格整理）
int Partition(int s, int t) {
    int pivot = a[s];                  // ① 基准暂存，s 处成坑
    int i = s, j = t;
    while (i < j) {
        while (i < j && a[j] >= pivot) j--;   // ② 右端找 < pivot 者
        if (i < j) { a[i] = a[j];  i++; }     //    填左坑
        while (i < j && a[i] <= pivot) i++;   // ③ 左端找 > pivot 者
        if (i < j) { a[j] = a[i];  j--; }     //    填右坑
    }
    a[i] = pivot;                      // ④ 基准归位（i == j）
    return i;                          // 返回基准最终位置
}

// 主算法
void QuickSort(int left, int right) {
    if (left < right) {                        // 长度 > 1 才划分
        int w = Partition(left, right);
        QuickSort(left, w - 1);                // 递归左子序列
        QuickSort(w + 1, right);               // 递归右子序列
    }
}`,
          explanations: {
            3: '基准取区间第一个元素，它的位置立刻成为"坑"。',
            6: '内层 while 都带 i<j 边界保护，两个指针相遇就停。',
            7: 'a[j] 填入左坑后，坑转移到 j 处；i 前进一格让位。',
            10: '返回值 w 是基准的最终位置，左右递归都以 w 为界跳过它。',
            15: 'left < right 即区间至少两个元素；单元素区间天然有序。',
          },
        },
      },
      {
        title: '复杂度：理想与退化',
        content: `<p>复杂度取决于<b>递归树的形状</b>（划分的均衡程度）：</p>
          <table>
            <tr><th>情形</th><th>递归方程</th><th>结果</th></tr>
            <tr><td>理想（每次划分均衡）</td><td>T(n) = 2T(n/2) + Θ(n)</td><td><b>Θ(n log n)</b></td></tr>
            <tr><td>最坏（已有序/逆序）</td><td>T(n) = T(n−1) + Θ(n)</td><td><b>Θ(n²)</b></td></tr>
          </table>
          <p>最坏情况剖析：序列已排好序时，每次划分只得到"一侧为空"，递归树退化成单支树，要 n−1 趟、共 Σ(n−i) = n(n−1)/2 次比较——速度退化到简单排序水平，递归栈深也达到 O(n)。</p>
          <p><b>随机化快排</b>：划分前随机选一个元素与首位交换再作基准。最坏仍是 O(n²)，但坏情况概率被压到极小——工程实践的标配。</p>`,
        interaction: {
          type: 'quiz',
          question: '用第一个元素作基准时，快排最坏情况发生在？',
          options: ['序列已经有序（或逆序）', '序列完全随机', '元素个数是奇数', '所有元素相等且使用了三路划分'],
          answer: 0,
          hint: '有序序列的首元素总是最小/最大，每趟划分只能确定一个元素，递归树成为单支树。',
        },
      },
      {
        title: '小结与易错点',
        content: `<ul>
          <li>快排<b>平均 O(n log n)、原地（O(log n) 栈空间）、不稳定</b>；</li>
          <li>元素全部相等时挖坑法也会退化（划分极度不均），改进是三路划分（课件未展开，了解即可）；</li>
          <li>易错①：内层比较 <code>a[j] >= pivot</code> / <code>a[i] <= pivot</code> 的等号不能丢——遇到与基准相等的元素必须跳过，否则死循环；</li>
          <li>易错②：递归区间是 <code>[left, w−1]</code> 和 <code>[w+1, right]</code>，基准 w 本身不再参与；</li>
          <li>易错③："快排任何情况都快"是错觉——n 很小时反而不如直接插入排序，工程上常做混合（小区间切插入排序）。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch8" class="lesson-link">练习测验巩固第 8 章</a>，或看<a href="#/visualization" class="lesson-link">快速排序动画</a>。</p>`,
      },
    ],
  },

  /* ============ ch10 动态规划 ============ */

  'lesson-dp': {
    title: '动态规划：0-1 背包与 LCS 填表',
    chapter: 'ch10',
    summary: [
      'DP 适用：最优子结构 + 重叠子问题；用表保存子问题解，每个子问题只算一次。',
      '0-1 背包：V[i,j] = max{ V[i-1,j], V[i-1,j-wᵢ]+vᵢ }（装得下时），时间 Θ(nC)。',
      'LCS：字符相等 C[i,j]=C[i-1,j-1]+1，否则 max{C[i,j-1], C[i-1,j]}，时间 Θ(nm)。',
      'DP 四步法：定义状态 → 转移方程 → 初始条件 → 计算顺序。',
    ],
    steps: [
      {
        title: '为什么需要动态规划？',
        content: `<p>从 Fibonacci 回顾：朴素递归 <code>fib(n) = fib(n−1) + fib(n−2)</code> 里 fib(3)、fib(2) 被<b>反复重算</b>，时间 O(2ⁿ)。</p>
          <p>病根是<b>重叠子问题</b>。解法：把每个子问题的答案<b>存进表里</b>（记忆化或递推填表），每个子问题只算一次——这就是动态规划。</p>
          <p>DP 有效的另一前提是<b>最优子结构</b>：原问题的最优解由子问题的最优解构成。两条凑齐，就可以放心填表了。</p>`,
      },
      {
        title: 'DP 设计四步法',
        content: `<ol>
            <li><b>定义状态</b>：dp[i][…] 到底表示什么？（一句话说清"子问题的答案"）</li>
            <li><b>状态转移方程</b>：大问题如何由更小的子问题推出来？</li>
            <li><b>初始条件</b>：最小的子问题直接可解（表的第一行/列）；</li>
            <li><b>计算顺序</b>：保证算 dp[i] 时依赖的状态已经算好。</li>
          </ol>
          <p>下面用两个经典问题练这套流程：<b>0-1 背包</b>和<b>最长公共子序列 LCS</b>。</p>`,
      },
      {
        title: '0-1 背包：状态与转移',
        content: `<p><b>问题</b>：n 个物品，物品 i 重 wᵢ、价值 vᵢ，背包容量 C。每件物品<b>要么装、要么不装</b>（0 或 1），求不超重时的最大总价值。</p>
          <p><b>状态定义</b>：V[i, j] = 从前 i 个物品中选、容量为 j 时的最大价值。答案即 V[n, C]。</p>
          <p><b>转移方程</b>（对第 i 个物品做决策）：</p>
          <pre><code>V[i,j] = V[i-1,j]                              若 j < wᵢ（装不下）
V[i,j] = max{ V[i-1,j],                        不装
              V[i-1, j-wᵢ] + vᵢ }              装：先腾出 wᵢ 容量</code></pre>
          <p>⚠️ 装 uᵢ 时查的是 <b>V[i−1, j−wᵢ]</b>——用"前 i−1 个物品"的状态，保证每件物品最多装一次。</p>`,
      },
      {
        title: '0-1 背包：填表演示',
        content: `<p>课件实例：C = 9，w = (2, 3, 4, 5)，v = (3, 4, 5, 7)。逐行填写 V 表（行 = 物品 i，列 = 容量 j）：</p>
          <table>
            <tr><th>i \\ j</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
            <tr><th>0</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><th>1 (w=2,v=3)</th><td>0</td><td>0</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
            <tr><th>2 (w=3,v=4)</th><td>0</td><td>0</td><td>3</td><td>4</td><td>4</td><td>7</td><td>7</td><td>7</td><td>7</td><td>7</td></tr>
            <tr><th>3 (w=4,v=5)</th><td>0</td><td>0</td><td>3</td><td>4</td><td><b>5</b></td><td>7</td><td>8</td><td><b>9</b></td><td>9</td><td><b>12</b></td></tr>
            <tr><th>4 (w=5,v=7)</th><td>0</td><td>0</td><td>3</td><td>4</td><td>5</td><td>7</td><td>8</td><td>10</td><td>11</td><td><b>12</b></td></tr>
          </table>
          <p>演算示例（课件原例）：算 V[3,7] 时 w₃=4 ≤ 7：<code>V[3,7] = max{ V[2,7], V[2,7−4]+5 } = max{7, 4+5} = 9</code>；算 V[3,4] 时同理 <code>max{ V[2,4], V[2,0]+5 } = max{4, 5} = 5</code>（只装物品3）。</p>`,
        interaction: {
          type: 'quiz',
          question: '承上例：V[3,7] = max{ V[2,7], V[2,3] + v₃ } 的值是？',
          options: ['9', '7', '12', '8'],
          answer: 0,
          hint: 'V[2,7]=7（不装物品3），V[2,3]+5=4+5=9（装物品3）——取大者 9。',
        },
      },
      {
        title: 'LCS：状态与转移',
        content: `<p><b>问题</b>：求字符串 A、B 的<b>最长公共子序列</b>长度。子序列 = 保序抽取（可跳字符）：A="zxy" 的子序列有 zxy、zx、zy… 但 xz 不是（不保序）。</p>
          <p>穷举要检查 2ⁿ 个子序列，Θ(m·2ⁿ)，不可行。DP 状态：<b>C[i, j] = 前缀 a₁…aᵢ 与 b₁…bⱼ 的 LCS 长度</b>：</p>
          <pre><code>aᵢ == bⱼ:  C[i,j] = C[i-1, j-1] + 1        （公共字符进 LCS）
aᵢ ≠ bⱼ:   C[i,j] = max{ C[i, j-1], C[i-1, j] }   （丢 aᵢ 或丢 bⱼ）</code></pre>
          <p>初始：C[i,0] = C[0,j] = 0。</p>`,
      },
      {
        title: 'LCS：填表演示',
        content: `<p>课件实例：A = <b>xyxxz</b>，B = <b>zxzyyz</b>。逐行填 (n+1)×(m+1) 表：</p>
          <table>
            <tr><th>C \\ j</th><td>0</td><td>1(z)</td><td>2(x)</td><td>3(z)</td><td>4(y)</td><td>5(y)</td><td>6(z)</td></tr>
            <tr><th>0</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><th>1 (x)</th><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
            <tr><th>2 (y)</th><td>0</td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td></tr>
            <tr><th>3 (x)</th><td>0</td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td></tr>
            <tr><th>4 (x)</th><td>0</td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td></tr>
            <tr><th>5 (z)</th><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td><td><b>3</b></td></tr>
          </table>
          <p>课件演算：a₃≠b₄（x≠y）→ C[3,4] = max{C[3,3], C[2,4]} = max{1,2} = 2；a₅==b₆（z==z）→ C[5,6] = C[4,5]+1 = 3。</p>
          <p><b>答案：LCS 长度 = 3</b>，对应子序列 x y z（从表回溯：沿 +1 的对角线收集相等字符）。</p>`,
        interaction: {
          type: 'quiz',
          question: '求两个长度分别为 n、m 的串的 LCS，DP 填表的时间复杂度是？',
          options: ['Θ(nm)', 'Θ(n+m)', 'Θ(2ⁿ)', 'Θ(n log m)'],
          answer: 0,
          hint: '表中 (n+1)×(m+1) 个格子每格 O(1) 算出。',
        },
      },
      {
        title: '0-1 背包伪代码走读',
        code: {
          lang: 'cpp',
          activeLine: 8,
          code: `// 输入：物品重量 w[i]、价值 v[i]（下标 1..n），背包容量 C
// 输出：可装入的最大总价值 V[n][C]
int knapsack(int n, int C, int w[], int v[]) {
    vector<vector<int>> V(n + 1, vector<int>(C + 1, 0));
    for (int j = 0; j <= C; j++) V[0][j] = 0;   // 0 个物品：价值 0
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= C; j++) {
            V[i][j] = V[i-1][j];                // 默认：不装物品 i
            if (w[i] <= j)                      // 装得下才比较"装"
                if (V[i-1][j - w[i]] + v[i] > V[i][j])
                    V[i][j] = V[i-1][j - w[i]] + v[i];
        }
    }
    return V[n][C];
}`,
          explanations: {
            5: '初始条件：没有物品可选时价值恒为 0（V[i][0] 同理，容量 0 也装不下任何东西）。',
            8: '先按"不装"取上一行的值。',
            9: '只有 w[i] ≤ j（装得下）才考虑"装"的分支。',
            10: '比较"不装"与"装"两种决策谁更优。',
            11: '装：占用 w[i] 容量后，从"前 i−1 个物品、容量 j−w[i]"的状态转移过来。',
            14: '表右下角 V[n][C] 即原问题的答案。',
          },
        },
      },
      {
        title: '小结：三个经典问题对比',
        content: `<table>
          <tr><th>问题</th><th>状态</th><th>复杂度</th></tr>
          <tr><td>0-1 背包</td><td>V[i,j]：前 i 物品、容量 j 的最大价值</td><td>Θ(nC)</td></tr>
          <tr><td>LCS</td><td>C[i,j]：两前缀的公共子序列长度</td><td>Θ(nm)</td></tr>
          <tr><td>矩阵链乘</td><td>m[i,j]：Aᵢ..Aⱼ 最少数乘次数</td><td>Θ(n³)</td></tr>
        </table>
        <ul>
          <li>易错①：0-1 背包"装"的分支查的是 <b>V[i−1][j−wᵢ]</b>，写成 V[i][…] 就变成每件物品可装多次（完全背包）；</li>
          <li>易错②：LCS 相等分支的来源是<b>对角线</b> C[i−1][j−1]+1，不相等才在上方/左方取 max；</li>
          <li>易错③：Θ(nC) 是<b>伪多项式</b>——关于容量数值 C 是多项式，但 C 的二进制位数是指数关系，别混淆"多项式时间"的说法。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch10" class="lesson-link">练习测验巩固第 10 章</a>，或到<a href="#/code-judge" class="lesson-link">代码评判</a>亲手写一版背包。</p>`,
      },
    ],
  },

  /* ============ ch7-扩展：B 树 ============ */

  'lesson-btree': {
    title: 'B 树：插入与分裂',
    chapter: 'ch7',
    summary: [
      'm 阶 B 树：根至少 2 个子女，非根至少 ⌈m/2⌉ 个、至多 m 个子女，所有叶子同层。',
      '结点关键码个数范围 [⌈m/2⌉−1, m−1]；插入总发生在叶结点。',
      '插入后关键码数超过 m−1 就分裂：中间关键码上移进双亲，左右两半留下。',
      '分裂可级联到根——根分裂是 B 树长高的唯一方式；高度 h 的 B 树插入需 h 次读盘 + 自底向上分裂。',
    ],
    steps: [
      {
        title: '为什么需要 B 树？',
        content: `<p>AVL、BST 是内存里的结构；但数据库、文件系统的索引存在<b>磁盘</b>上，读一次盘代价巨大。我们希望树<b>矮胖</b>：每层读一次盘，三层就能覆盖海量数据。</p>
          <p><b>B 树</b>让每个结点装<b>多个关键码、多个子女</b>，同样的关键码总量下层数大幅减少。</p>
          <p><b>m 阶 B 树的定义</b>（要点）：</p>
          <ul>
            <li>根结点至少 2 个子女；非根结点至少 <b>⌈m/2⌉</b> 个、至多 m 个子女；</li>
            <li>结点结构 (n, P₀, K₁, P₁, K₂, …, Kₙ, Pₙ)：K 递增，子树 Pᵢ 的关键码介于 Kᵢ 与 Kᵢ₊₁ 之间；</li>
            <li><b>所有叶子在同一层</b>（树是绝对平衡的）。</li>
          </ul>`,
        interaction: {
          type: 'quiz',
          question: '3 阶 B 树的一个结点最多能存几个关键码？',
          options: ['2 个（m−1）', '3 个', '1 个', '4 个'],
          answer: 0,
          hint: 'm 阶 B 树结点至多 m 个子女、m−1 个关键码。3 阶即"最多 2 个关键码"。',
        },
      },
      {
        title: '结点分裂：插入的核心动作',
        content: `<p>插入总是落在<b>叶结点</b>。若插入后关键码个数<b>超过上界 m−1</b>，结点必须<b>分裂</b>：</p>
          <p>课件例（m=3）：结点 (P₀, 53, P₁, 75, P₂) 中插入 139 后变成 (P₀, 53, P₁, 75, P₂, 139, P₃)——3 个关键码，溢出！</p>
          <pre class="lesson-tree">分裂前:  [ 53 | 75 | 139 ]        （溢出，取中间码上移）

分裂后:      [ 75 ]              ← 中间关键码 75 上移进双亲
            /     \\
        [ 53 ]   [ 139 ]        ← 左右两半留在同一层</pre>
          <p>关键点：<b>取中间关键码上移</b>，左右各留一半。若双亲也满了，分裂继续向上——<b>一直可以传到根</b>；根分裂创建新根，是 B 树<b>长高的唯一方式</b>（所以叶子永远同层）。</p>`,
      },
      {
        title: '实战：从空树建 3 阶 B 树（上）',
        content: `<p>依次插入 53, 75, 139, 49, 145, 36, 101：</p>
          <pre><code>插 53 : [53]
插 75 : [53, 75]
插 139: [53, 75, 139] 溢出 → 75 上移
        根 [75]，孩子 [53]、[139]
插 49 : 落入左叶 → [49, 53]
插 145: 落入右叶 → [139, 145]</code></pre>`,
        html: `<pre class="lesson-tree">        [75]
        /   \\
   [49, 53] [139, 145]</pre>`,
      },
      {
        title: '实战：从空树建 3 阶 B 树（下）',
        content: `<pre><code>插 36 : 进左叶 → [36, 49, 53] 溢出 → 49 上移
        根 [49, 75]，孩子 [36]、[53]、[139, 145]
插 101: 75<101<139 进叶 [139,145] → [101, 139, 145] 溢出 → 139 上移
        根 [49, 75, 139] 又溢出 → 根分裂！75 上移成新根
        树高加一层：</code></pre>`,
        html: `<pre class="lesson-tree">           [75]            ← 新根（根分裂产生）
          /    \\
      [49]      [139]
      /  \\      /    \\
  [36] [53] [101]   [145]</pre>
          <p>本轮发生了 3 次分裂，最后一次是<b>根分裂</b>——B 树凭这一招保持绝对平衡。</p>`,
        interaction: {
          type: 'quiz',
          question: 'B 树的高度（层数）在什么情况下会增加？',
          options: ['根结点分裂时', '任何叶结点分裂时', '删除关键码时', '从不增加'],
          answer: 0,
          hint: '普通分裂把关键码上移给双亲，树高不变；只有根分裂会创建新根，全体叶子随之下移一层。',
        },
      },
      {
        title: '删除概览：先借，借不到才合并',
        content: `<p>删除的关键码若<b>不在叶结点</b>，先用它的<b>后继</b>（比它大的最小数）或前驱替换，把问题转化为"删除叶子中的关键码"。叶上删除后按关键码是否够数分四种情况（m=3 时够数 = 至少 ⌈3/2⌉−1 = 1 个关键码）：</p>
          <ol>
            <li>被删结点<b>就是根</b>且 n ≥ 2：直接删；</li>
            <li>删除前 n ≥ ⌈m/2⌉（够数）：<b>简单删除</b>，结束；</li>
            <li>不够数，但相邻兄弟<b>有多余</b>（n ≥ ⌈m/2⌉）：<b>借</b>——双亲的关键码下移补位，兄弟的关键码上移补双亲（"旋转"一下）；</li>
            <li>不够数，兄弟也不富余：<b>合并</b>——双亲的一个关键码下移，把被删结点与兄弟合成一个结点。</li>
          </ol>
          <p>⚠️ 合并会让双亲少一个关键码，若双亲也不够数，就要<b>继续向上借或合并</b>（级联调整），最坏波及到根。</p>`,
        interaction: {
          type: 'quiz',
          question: '3 阶 B 树叶结点删除一个关键码后只剩 0 个关键码，而左右兄弟都只有 1 个关键码（最少数目），应当怎么办？',
          options: ['与某个兄弟合并，双亲的一个关键码下移参与合并', '直接让该结点空着', '从更下层借关键码', '把整棵树重建'],
          answer: 0,
          hint: '兄弟无可借时只能合并；合并消耗双亲一个关键码，可能引起级联调整。',
        },
      },
      {
        title: '性能与易错点',
        content: `<ul>
          <li>查找一个关键码自顶向下走 h 层，需 <b>h 次读盘</b>；插入时自底向上分裂，最坏从叶到根<b>路径上的结点全部分裂</b>；</li>
          <li>3 阶 B 树又称 2-3 树：结点 1~2 个关键码、2~3 个子女；</li>
          <li>易错①：分裂上移的是<b>中间</b>关键码，不是最大或最小；</li>
          <li>易错②：m 阶 B 树"阶"指<b>最多子女数 m</b>，关键码上限是 m−1，别背反；</li>
          <li>易错③：删除时"不够数"先向兄弟<b>借</b>，借不到才和兄弟<b>合并</b>（合并会让双亲少一个关键码，可能级联）。</li>
        </ul>
        <p>B+ 树是 B 树的变形：n 个关键码 n 棵子树、数据全在叶子且叶子链成有序链表，更适合范围查询与数据库索引。</p>
        <p>👉 去<a href="#/quiz/ch7" class="lesson-link">练习测验巩固第 7 章</a>。</p>`,
      },
    ],
  },

});
