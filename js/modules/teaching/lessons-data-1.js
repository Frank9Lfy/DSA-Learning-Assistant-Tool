/* ========================================
   lessons-data-1.js - 课程数据（第 1 部分）
   覆盖：ch2 线性表 / ch3 栈与队列 / ch4 串与数组
   数据格式：
   {
     title: 课程名, chapter: 'chX',
     summary: ['要点', ...],          // 结课页回顾
     steps: [{
       title: 步骤标题,
       content: '<p>HTML 讲解</p>',    // 可选
       html: '<div>自定义结构图</div>', // 可选
       array: { data: [...], highlights: [...], pointers: {k:idx}, caption: '...' }, // 数组状态条
       code: { code: '源代码', lang: 'cpp', explanations: {行号: '解释'}, activeLine: n }, // 代码走读
       interaction: { type: 'quiz', question: '', options: [...], answer: n, hint: '' } // 步内小测
     }, ...]
   }
   ======================================== */

window.LessonData = window.LessonData || {};

Object.assign(window.LessonData, {

  /* ============ ch2 线性表 ============ */

  'lesson-seqlist': {
    title: '顺序表：插入与删除图解',
    chapter: 'ch2',
    summary: [
      '顺序表逻辑相邻、物理也相邻，支持 O(1) 随机存取，但插删要移动大量元素。',
      '插入第 i 个位置：从最后一个元素起从后往前依次后移，平均移动 n/2 项。',
      '删除第 i 个元素：从第 i+1 个元素起依次前移填补，平均移动 (n-1)/2 项。',
      '参数合法性检查（i 的范围、表满/表空）是插入删除算法的第一步，最容易丢分。',
    ],
    steps: [
      {
        title: '顺序表为什么"快在存取、慢在插删"？',
        content: `<p>顺序表把元素放进一段<b>连续的存储空间</b>：逻辑上相邻的两个元素，物理位置也相邻。于是"第 i 个元素"可以直接用下标算出来，<b>存取时间 O(1)</b>。</p>
          <p>但代价是：在中间插入或删除一个元素，为了保持"连续"，它后面的所有元素都得整体搬家。</p>
          <p class="lesson-tip">一句口诀：<b>查改快、插删慢</b>。这也是它与链表（ch2-6）对比的核心结论。</p>`,
      },
      {
        title: '插入的整体思路：从后往前依次后移',
        content: `<p>在长度 n=7 的顺序表 data = [25, 16, 22, 52, 48, 2, 63] 的第 4 个位置插入 47。为了不覆盖数据，必须<b>从表尾开始</b>，把 data[6]、data[5]、data[4]、data[3] 依次向后挪一位，最后把 47 放进空出来的 data[3]。</p>
          <p>为什么必须"从后往前"？如果先把 data[3]=52 后移，会直接把 48 覆盖掉——<b>移动方向错了就丢数据</b>。</p>
          <p>需要移动的元素个数：第 4~第 7 个，共 <code>n − i + 1 = 7 − 4 + 1 = 4</code> 项。</p>`,
        array: {
          data: [25, 16, 22, 52, 48, 2, 63],
          highlights: [3, 4, 5, 6],
          caption: '高亮部分（data[3..6]）需要依次后移一位，47 将插入到下标 3 处',
        },
      },
      {
        title: '插入完成后的数组状态',
        content: `<p>移动结束后，data[3] 空出，写入 47，表长 n 由 7 变为 8：</p>`,
        array: {
          data: [25, 16, 22, 47, 52, 48, 2, 63],
          highlights: [3],
          caption: '47 已就位（下标 3），表长 n = 8',
        },
        interaction: {
          type: 'quiz',
          question: '在长度为 n 的顺序表第 i 个位置插入新元素，平均需要移动多少项？（各插入位置等概率）',
          options: ['n/2 项', '(n-1)/2 项', 'n-i+1 项', 'n 项'],
          answer: 0,
          hint: '有 n+1 个插入位置，第 i 个位置移动 n-i+1 项，对 i=1..n+1 求平均：AMN = n(n+1)/2 / (n+1) = n/2。',
        },
      },
      {
        title: '插入算法（代码走读）',
        content: `<p>课件原版写法：注意先做<b>表满</b>和 <b>i 合法性</b>检查（1 ≤ i ≤ n+1），再移动。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `template <class T, class E>
bool SeqList<T, E>::Insert(int i, E x) {
    if (n == maxSize) return false;        // 表满
    if (i < 1 || i > n+1) return false;    // 参数 i 不合理
    for (int j = n; j >= i; j--)           // 依次后移
        data[j] = data[j-1];
    data[i-1] = x;                         // 插入第 i 表项在 data[i-1] 处
    n++;  return true;                     // 插入成功
}`,
          explanations: {
            3: '表满（n 已达 maxSize）则插入失败，防止越界写入。',
            4: 'i 的合法范围是 1..n+1：i=n+1 相当于"尾插"，不移动任何元素。',
            5: 'j 从 n 倒着走到 i：先挪 data[n-1]（最后一项）到 data[n]，再依次往前。倒序保证不覆盖。',
            6: '实际的数据搬运动作，每次把前一个元素抄到当前位置。',
            7: '空位写入新元素。注意 1-based 的第 i 项存放在 0-based 的 data[i-1]。',
            8: '表长加一，插入才算真正完成——忘记 n++ 是常见错误。',
          },
        },
      },
      {
        title: '删除：从前往后依次前移填补',
        content: `<p>删除第 4 个元素 52：它后面的 48、2、63 依次<b>向前挪一位</b>填补空缺，表长减一。</p>
          <p>移动方向与插入相反——<b>从前往后</b>挪。如果从后往前，63 会先覆盖 2，造成重复。</p>
          <p>需要移动 n − i = 7 − 4 = <b>3</b> 项，平均移动 (n−1)/2 项。</p>`,
        array: {
          data: [25, 16, 22, '52×', 48, 2, 63],
          highlights: [4, 5, 6],
          caption: '52 被删除，高亮的 48、2、63 依次前移一位',
        },
        interaction: {
          type: 'quiz',
          question: '删除顺序表第 i 个元素（表长 n）需要移动多少项？',
          options: ['n-i 项', 'n-i+1 项', 'i 项', 'n 项'],
          answer: 0,
          hint: '第 i+1 项到第 n 项都要前移，共 n-(i+1)+1 = n-i 项。',
        },
      },
      {
        title: '删除算法（代码走读）',
        content: `<p>对比插入算法：方向相反、合法性范围不同（1 ≤ i ≤ n）、表长减一。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 5,
          code: `template <class T, class E>
bool SeqList<T, E>::Remove(int i, E& x) {
    if (n == 0) return false;              // 表空
    if (i < 1 || i > n) return false;      // 参数 i 不合理
    x = data[i-1];
    for (int j = i; j <= n-1; j++)         // 依次前移，填补
        data[j-1] = data[j];
    n--;  return true;
}`,
          explanations: {
            3: '空表没有东西可删。',
            4: '删除位置的合法范围是 1..n，比插入少一个（没有"表尾后一格"的说法）。',
            5: '通过引用参数 x 把被删元素带出去，供调用者使用。',
            6: 'j 从 i 到 n-1 正序循环：用后面的元素覆盖前面的空位。',
            8: '表长减一。逻辑长度变小即可，物理数组尾部残留数据不用清。',
          },
        },
      },
      {
        title: '小结：插入删除的移动次数',
        content: `<table>
          <tr><th>操作</th><th>第 i 个位置</th><th>平均移动次数</th><th>时间复杂度</th></tr>
          <tr><td>插入</td><td>n-i+1 项</td><td>n/2</td><td>O(n)</td></tr>
          <tr><td>删除</td><td>n-i 项</td><td>(n-1)/2</td><td>O(n)</td></tr>
        </table>
        <p>💡 <em>按位序插删都是 O(n)；如果只给你"元素地址/指针"，链表插删才是 O(1)。这是两种结构选择的分水岭。</em></p>
        <p>👉 巩固：去<a href="#/quiz/ch2" class="lesson-link">练习测验做第 2 章题目</a>，或到<a href="#/visualization" class="lesson-link">算法可视化</a>看链表动画对比。</p>`,
      },
    ],
  },

  'lesson-linkedlist': {
    title: '单链表：插入、删除与反转',
    chapter: 'ch2',
    summary: [
      '单链表结点 = 数据域 + 指针域，结点存储可以不连续，长度扩充方便。',
      '插入必须"先接新、后断旧"：先改新结点的 link，再改前驱的 link，顺序反了会丢失后继。',
      '删除需要先找到前驱结点，摘下目标结点后记得 delete 释放内存。',
      '反转链表用三个指针逐个翻转链接方向，时间 O(n)、空间 O(1)。',
    ],
    steps: [
      {
        title: '结点结构与头指针',
        content: `<p>单链表的每个元素是一个<b>结点（Node）</b>：</p>
          <ul>
            <li><b>数据域 data</b>：存放表项；</li>
            <li><b>指针域 link</b>：指向后继结点。</li>
          </ul>
          <p>外部只通过<b>头指针 first</b> 访问链表；表尾结点的 link 为 <code>NULL</code>（记作 ∧）。</p>
          <pre class="lesson-tree">first ──▶ a₀ ──▶ a₁ ──▶ a₂ ──▶ a₃ ──▶ ∧</pre>
          <p>结点可以散布在内存各处（物理不连续），靠指针维持逻辑顺序——这就是链表"插删不用搬数据"的原因。</p>`,
      },
      {
        title: '插入：两种语句，顺序不能反',
        content: `<p>设 current 指向插入位置的前驱，新结点 newNode 要插到 current 之后：</p>
          <ol>
            <li><code>newNode->link = current->link;</code> ① 新结点先"牵手"后继</li>
            <li><code>current->link = newNode;</code> ② 前驱再指向新结点</li>
          </ol>
          <p>⚠️ 若先执行②，current->link 被覆盖，<b>后面的整条链就找不回来了</b>。</p>
          <p>三种情况（表头、中间、表尾）用的都是这两句；表头插入时前驱不存在，改为：</p>
          <pre><code>newNode->link = first;  first = newNode;</code></pre>`,
        html: `<pre class="lesson-tree">①  newNode->link = current->link;

  current ──▶ aᵢ        aᵢ₊₁ ──▶ ...
     └──────▶ newNode ──┘   （新结点已接上后继）

②  current->link = newNode;

  current ──▶ newNode ──▶ aᵢ₊₁ ──▶ ...   （完成）</pre>`,
        interaction: {
          type: 'quiz',
          question: '在结点 current 之后插入 newNode，下列哪组语句顺序是正确的？',
          options: [
            'current->link = newNode; newNode->link = current->link;',
            'newNode->link = current->link; current->link = newNode;',
            'newNode->link = current; current->link = newNode;',
            '两句顺序无所谓，效果一样',
          ],
          answer: 1,
          hint: '必须先用 current->link 的"旧值"给 newNode，再覆盖 current->link。先覆盖就丢了后继地址。',
        },
      },
      {
        title: '插入算法（代码走读）',
        content: `<p>课件版本：i = 0 表示插到首元结点之前，需要单独处理。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 11,
          code: `bool List::Insert(int i, int x) {
    // 将 x 插入到第 i 个结点之后。i=0 表示插在首元结点之前
    if (first == NULL || i == 0) {         // 空表或首元结点前
        LinkNode *newNode = new LinkNode(x);
        newNode->link = first;
        first = newNode;                   // 新结点成为首元结点
    }
    else {                                 // 寻找插入位置
        LinkNode *current = first;  int k = 1;
        while (k < i && current != NULL)   // 找第 i 个结点
            { current = current->link;  k++; }
        if (current == NULL && first != NULL)  // 链太短
            { cerr << "无效的插入位置!\\n";  return false; }
        else {
            LinkNode *newNode = new LinkNode(x);
            newNode->link = current->link; // ① 接后继
            current->link = newNode;       // ② 接前驱
        }
    }
    return true;
}`,
          explanations: {
            3: '空表或插在最前面：新结点直接当首元结点，头指针改指它。',
            9: '从 first 出发走 i-1 步找到第 i 个结点（新结点要插在它后面）。',
            11: 'current 走出了表尾说明 i 越界，报错返回。',
            15: '① 新结点先记住后继——这行必须在②之前！',
            16: '② 前驱改指新结点，插入完成。',
          },
        },
      },
      {
        title: '删除：先找前驱，再摘结点',
        content: `<p>删除第 i 个结点需要<b>它的前驱</b>（第 i−1 个结点），因为指向它的指针藏在父辈手里：</p>`,
        code: {
          lang: 'cpp',
          activeLine: 5,
          code: `template <class T>
bool List<T>::Remove(int i, T& x) {
    LinkNode<T>* prev = Locate(i - 1);    // 找第 i-1 个结点（前驱）
    if (!prev || !prev->link) return false;
    LinkNode<T>* del = prev->link;        // del 指向被删结点
    prev->link = del->link;               // 前驱跨过 del，直接连后继
    x = del->data;                        // 保存被删数据
    delete del;                           // 释放内存！
    return true;
}`,
          explanations: {
            3: '单链表没有"回头"指针，必须先定位前驱。',
            4: 'prev 不存在，或 prev 已是表尾（没有第 i 个结点），都删不了。',
            5: '先用临时指针 del 保存被删结点地址。',
            6: '核心一句：前驱的 link 跨过 del 指向后继，del 从链上"摘下"。',
            8: 'new 出来的结点必须 delete，否则内存泄漏——考试常考的易错点。',
          },
        },
      },
      {
        title: '反转链表：三个指针翻方向',
        content: `<p>经典操作：把 a₀→a₁→…→aₙ 变成 aₙ→…→a₀。思路是逐个结点"掉头"：用 h 指向已反转部分的头，p 指向还没处理的结点，pr 暂存。</p>
          <pre class="lesson-tree">初始:  first ──▶ 1 ──▶ 2 ──▶ 3 ──▶ ∧      h = ∧
一步后: h ──▶ 1        first ──▶ 2 ──▶ 3   （1 已反转）
两步后: h ──▶ 2 ──▶ 1  first ──▶ 3         （2 掉头指向 1）</pre>`,
        code: {
          lang: 'cpp',
          activeLine: 7,
          code: `void List::Inverse() {
    LinkNode *h = NULL;              // 反转后的头
    LinkNode *p = first->link;       // 当前待处理结点
    LinkNode *pr;                    // 临时指针
    while (p) {
        pr = h;                      // 已反转部分的头
        h = p;                       // h 前进
        p = p->link;                 // p 先走一步（否则翻转后走不动）
        h->link = pr;                // 翻转当前结点的指向
    }
    first->link = h;                 // 头结点接上新的第一个结点
}`,
          explanations: {
            6: 'pr 保存已反转部分的头，它是当前结点即将指向的"下一个"。',
            8: '一定要在翻转 h->link 之前让 p 前进，否则当前结点一旦回头就找不到后继了。',
            9: '掉头：当前结点反过来指向已反转部分。',
            11: '带附加头结点的链表最后把头结点的 link 接到原表尾。',
          },
        },
        interaction: {
          type: 'quiz',
          question: '反转长度为 n 的单链表的时间和空间复杂度是？',
          options: ['时间 O(n)，空间 O(1)', '时间 O(n)，空间 O(n)', '时间 O(n²)，空间 O(1)', '时间 O(log n)，空间 O(1)'],
          answer: 0,
          hint: 'while 循环每个结点处理一次共 n 次；只用了 h、p、pr 三个指针。',
        },
      },
      {
        title: '顺序表 vs 链表，怎么选？',
        content: `<table>
          <tr><th>维度</th><th>顺序表</th><th>单链表</th></tr>
          <tr><td>存取方式</td><td>随机存取 O(1)</td><td>顺序存取 O(n)</td></tr>
          <tr><td>插入/删除</td><td>需移动大量元素 O(n)</td><td>改指针 O(1)（已定位时）</td></tr>
          <tr><td>存储空间</td><td>连续、无额外开销</td><td>每个结点多一个指针域</td></tr>
          <tr><td>适用场景</td><td>长度稳定、按位查改多</td><td>频繁插删、长度变化大</td></tr>
        </table>
        <p>💡 <em>记忆：链表"以空间换时间"，把插删的代价从"搬数据"变成"改指针"。</em></p>
        <p>👉 到<a href="#/quiz/ch2" class="lesson-link">练习测验</a>巩固本章，或看<a href="#/visualization" class="lesson-link">链表插入/删除动画</a>。</p>`,
      },
    ],
  },

  /* ============ ch3 栈与队列 ============ */

  'lesson-stack-expr': {
    title: '栈的应用：中缀 → 后缀表达式',
    chapter: 'ch3',
    summary: [
      '后缀表达式不再需要括号和优先级规则，运算次序已经隐含在表达式里，适合用栈求值。',
      '后缀求值：遇操作数进栈；遇运算符弹出两个操作数（先弹的是右操作数！），计算后结果再进栈。',
      '中缀转后缀：操作数直接输出；运算符与栈顶比较优先级，高于栈顶则进栈，否则弹栈输出直到可以进栈。',
      '左括号直接进栈，右括号弹栈输出直到遇左括号（括号本身不输出）。',
    ],
    steps: [
      {
        title: '为什么要有后缀表达式？',
        content: `<p>中缀式 <code>A + B * (C − D) − E / F</code> 人好读，但计算机算起来麻烦：要考虑<b>优先级</b>、<b>结合性</b>、还要来回扫描找<b>括号</b>。</p>
          <p>后缀表示把运算符写在两个操作数之后，例如 <code>A+B</code> 写成 <code>AB+</code>。它的好处：</p>
          <ul>
            <li><b>不需要括号</b>——优先次序已经隐含在表达式的形状里；</li>
            <li><b>一遍扫描</b>即可求值，只需一个操作数栈。</li>
          </ul>
          <p>上式的后缀形式是 <code>A B C D − * + E F / −</code>。本课就讲清楚它怎么来、怎么算。</p>`,
      },
      {
        title: '后缀表达式怎么求值？',
        content: `<p>规则只有两条：</p>
          <ol>
            <li>从左到右扫描，<b>遇操作数 → 压栈</b>；</li>
            <li><b>遇运算符 → 弹出两个操作数</b>（先弹出的是右操作数 b，后弹出的是左操作数 a），计算 a op b，结果<b>再压栈</b>。</li>
          </ol>
          <p>课件例：后缀式 <code>12 6 2 / 0.5 - *</code> 的求值过程：</p>
          <pre><code>读 12 → 栈: 12
读 6  → 栈: 12 6
读 2  → 栈: 12 6 2
读 /  → 弹 2、弹 6，算 6/2=3 → 栈: 12 3
读 0.5→ 栈: 12 3 0.5
读 -  → 弹 0.5、弹 3，算 3-0.5=2.5 → 栈: 12 2.5
读 *  → 弹 2.5、弹 12，算 12*2.5=30 → 栈: 30   ← 最终结果在栈顶</code></pre>
          <p>⚠️ 易错点：减法和除法<b>不满足交换律</b>，操作数顺序弹反了结果就错。</p>`,
        interaction: {
          type: 'quiz',
          question: '计算后缀表达式 6 3 - 时，出栈的两个操作数应该怎样参与运算？',
          options: ['先弹出的 3 作为被减数：3-6', '后弹出的 6 作为被减数：6-3', '无所谓，结果一样', '两个都压回去再算'],
          answer: 1,
          hint: '遇运算符时先弹出的是右操作数，后弹出的是左操作数：a op b = 6 - 3 = 3。',
        },
      },
      {
        title: '中缀转后缀：转换规则',
        content: `<p>转换也要借助一个<b>运算符栈</b>，从左到右扫描中缀式：</p>
          <ul>
            <li><b>操作数</b>：直接送入输出序列；</li>
            <li><b>左括号 (</b>：进栈（栈外优先级最高，见下表）；</li>
            <li><b>右括号 )</b>：不断弹栈输出，直到弹出左括号（这一对括号直接"消失"）；</li>
            <li><b>运算符</b>：与栈顶运算符比优先级——<b>高于</b>栈顶则进栈；<b>不高于</b>栈顶则先弹栈输出，再继续比较，直到可以进栈；</li>
            <li>扫描结束后，把栈中剩余运算符依次弹栈输出。</li>
          </ul>
          <table>
            <tr><th>运算符</th><th>（</th><th>*，/</th><th>+，-</th></tr>
            <tr><td>栈外优先级</td><td>最高</td><td>4</td><td>2</td></tr>
            <tr><td>栈内优先级</td><td>最低</td><td>5</td><td>3</td></tr>
          </table>
          <p>💡 <em>左括号"栈外最高、栈内最低"：在栈外时谁也别想让它弹走；进来之后又得给别的运算符让路（等右括号来收它）。</em></p>`,
      },
      {
        title: '逐步追踪：A + B * (C − D) − E / F',
        content: `<p>跟着走一遍（输出列就是最终的后缀式）：</p>
          <pre><code>读 A  → 输出 A                          输出: A        栈: 空
读 +  → 栈空，进栈                       输出: A        栈: +
读 B  → 输出 B                          输出: A B      栈: +
读 *  → * 高于 +，进栈                   输出: A B      栈: + *
读 (  → 进栈                            输出: A B      栈: + * (
读 C  → 输出 C                          输出: A B C    栈: + * (
读 −  → 栈顶是 (，进栈                   输出: A B C    栈: + * ( -
读 D  → 输出 D                          输出: A B C D  栈: + * ( -
读 )  → 弹栈输出 − 直到弹出 (            输出: A B C D − 栈: + *
读 −  → − 不高于 *：弹 *；不高于 +：弹 +；栈空进栈
                                        输出: A B C D − * +   栈: -
读 E  → 输出 E                          输出: ... E    栈: -
读 /  → / 高于 −，进栈                   输出: ... E    栈: - /
读 F  → 输出 F                          输出: ... E F  栈: - /
结束  → 弹 / 再弹 −                     输出: A B C D − * + E F / −</code></pre>
          <p>与课件结论一致：<b>A B C D − * + E F / −</b>。</p>`,
        interaction: {
          type: 'quiz',
          question: '中缀式 A + B * C 转成后缀式是？',
          options: ['A B C * +', 'A B + C *', 'A B C + *', 'A + B C *'],
          answer: 0,
          hint: '先把 B*C 结合（* 优先级高，C 后面紧跟 *），再与 A 相加：B C * 输出后最后的 + 弹栈。',
        },
      },
      {
        title: '代码走读：后缀求值核心',
        content: `<p>课件 Calculator 类的骨架：扫描字符，操作数压栈，运算符交给 DoOperator 处理。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 8,
          code: `void Calculator::Run() {
    char ch;  double newoperand;
    while (cin >> ch, ch != ';') {       // ';' 为表达式结束符
        switch (ch) {
        case '+': case '-': case '*': case '/':
        case '^': DoOperator(ch); break; // 遇运算符：计算
        default:  cin.putback(ch);       // 字符放回输入流
                  cin >> newoperand;     // 拼读完整操作数
                  S.Push(newoperand);    // 操作数压栈
        }
    }
}

void Calculator::DoOperator(char op) {
    double left, right;
    if (!Get2Operands(left, right)) return; // 弹出右、左操作数
    switch (op) {
    case '+': S.Push(left + right); break;
    case '-': S.Push(left - right); break;  // left − right，顺序别反
    case '*': S.Push(left * right); break;
    case '/': if (right != 0.0) { S.Push(left / right); break; }
              else { cout << "除数为0!\\n"; exit(1); }
    case '^': S.Push(Power(left, right));
    }
}`,
          explanations: {
            3: '逐字符读入，读到约定的结束符 ; 停止。',
            6: '五类运算符都走"弹两个数、算、压回"的统一流程。',
            9: '默认分支说明读到了操作数的第一个字符，putback 后按数字重新读完整。',
            11: '操作数进栈，等待它后面的运算符。',
            18: 'Get2Operands 先弹出的是右操作数 right，再弹出左操作数 left。',
            21: '减法用 left − right：因为 left 是后弹出的（更靠左的操作数）。',
          },
        },
      },
      {
        title: '易错点与小结',
        content: `<ul>
          <li><b>操作数顺序</b>：a op b 中 a 是后弹出的那个，减法除法尤其要小心；</li>
          <li><b>括号不输出</b>：左右括号在栈里相遇后互相抵消，输出序列里永远不会出现括号；</li>
          <li><b>扫描结束后别忘清栈</b>：栈里剩下的运算符要依次弹出输出；</li>
          <li>优先级"不高于栈顶就弹栈"——同级运算符也要弹（保证<b>从左到右</b>结合）。</li>
        </ul>
        <p>整个过程只做一遍扫描，时间复杂度 <span class="complexity-badge badge-time">O(n)</span>，空间一个栈也是 O(n)。</p>
        <p>👉 去<a href="#/quiz/ch3" class="lesson-link">练习测验做第 3 章题目</a>。</p>`,
      },
    ],
  },

  'lesson-recursion': {
    title: '递归与调用栈：以汉诺塔为例',
    chapter: 'ch3',
    summary: [
      '递归的两个必要条件：问题可以分解为同类的更小子问题；必须有递归出口。',
      '汉诺塔三步：先把 n-1 个盘借 C 移到 B，再把最大盘 A→C，最后把 n-1 个盘借 A 移到 C。',
      'n 个盘子共需 2^n − 1 次移动；n=3 时为 7 次。',
      '系统为每次调用分配"活动记录"（参数+局部变量+返回地址），按后进先出组织成递归工作栈。',
    ],
    steps: [
      {
        title: '什么是递归？什么时候能用？',
        content: `<p>若一个过程<b>直接或间接地调用自己</b>，就是递归过程。课件归纳了三类常见递归场景：</p>
          <ul>
            <li><b>定义是递归的</b>：如阶乘 n! = n × (n−1)!；</li>
            <li><b>数据结构是递归的</b>：如单链表（一个结点+一条更短的链表）；</li>
            <li><b>问题的解法是递归的</b>：如汉诺塔。</li>
          </ul>
          <p>构成递归必须满足两个条件：</p>
          <ol>
            <li>子问题与原问题<b>做同样的事情、规模更小</b>；</li>
            <li><b>必须有出口</b>（递归结束条件），否则无限自我调用导致栈溢出。</li>
          </ol>`,
      },
      {
        title: '汉诺塔：分三步走',
        content: `<p>任务：把 A 柱上的 n 个盘子借助于 B 柱全部移到 C 柱，每次只能移一个盘，且大盘不能压小盘。</p>
          <p>别盯着 n 个盘发愁，把它拆成三步：</p>
          <ol>
            <li>用 C 做过渡，把 A 上面 <b>n−1 个盘</b>移到 B；</li>
            <li>把 A 柱剩下<b>最大的盘</b>直接移到 C；</li>
            <li>用 A 做过渡，把 B 上的 <b>n−1 个盘</b>移到 C。</li>
          </ol>
          <p>第 1、3 步和原问题一模一样，只是规模小一、柱子角色换了一下——这正是递归的形状。n=1 时直接移动，就是递归出口。</p>
          <pre class="lesson-tree">初始        第①步后      第②步后      第③步后
A: 盘1~n    A: 盘n      A: 空       A: 空
B: 空       B: 盘1~n-1  B: 盘1~n-1  B: 空
C: 空       C: 空       C: 盘n      C: 盘1~n  ✓</pre>`,
      },
      {
        title: '汉诺塔代码走读',
        content: `<p>课件原代码短得惊人——递归的威力就是把复杂过程交给"更小的自己"。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 6,
          code: `void Hanoi(int n, char A, char B, char C) {
    // 把 n 个盘从 A 柱借助 B 柱移到 C 柱
    if (n == 1)
        cout << " move " << A << " to " << C << endl;
    else {
        Hanoi(n - 1, A, C, B);   // ① 上面的 n-1 个盘 A 借 C 移到 B
        cout << " move " << A << " to " << C << endl;  // ② 最大盘 A→C
        Hanoi(n - 1, B, A, C);   // ③ n-1 个盘 B 借 A 移到 C
    }
}`,
          explanations: {
            2: '递归出口：只有一个盘时直接从 A 移到 C。',
            5: '① 注意参数顺序：借助于 C，所以第三个参数（辅助柱）是 C。',
            6: '② 此时 A 上只剩最大盘，直接移到目标柱 C 并打印。',
            7: '③ 现在问题变成"把 n-1 个盘从 B 借 A 移到 C"，柱子角色轮换。',
          },
        },
      },
      {
        title: 'n = 3 的完整移动序列',
        content: `<p>展开递归，7 次移动依次是：</p>
          <pre><code>Hanoi(3,A,B,C)
 ├─ Hanoi(2,A,C,B)
 │   ├─ Hanoi(1,A,C,B): A→C   ①
 │   ├─ A→B                   ②
 │   └─ Hanoi(1,B,A,C): B→C   ③
 ├─ A→C                       ④   （最大盘就位）
 └─ Hanoi(2,B,A,C)
     ├─ Hanoi(1,B,A,C): B→A   ⑤
     ├─ B→C                   ⑥
     └─ Hanoi(1,A,C,B): A→C   ⑦</code></pre>
          <p>即 <b>A→C, A→B, C→B, A→C, B→A, B→C, A→C</b>，共 7 步。</p>`,
        html: `<pre class="lesson-tree">步0:  A:[1,2,3]  B:[]      C:[]
步4:  A:[]        B:[1,2]   C:[3]     ← 最大盘3已在C
步7:  A:[]        B:[]      C:[1,2,3] ✓</pre>`,
        interaction: {
          type: 'quiz',
          question: 'n 个盘的汉诺塔最少需要移动多少次？',
          options: ['2^n − 1 次', '2n − 1 次', 'n^2 次', 'n(n-1)/2 次'],
          answer: 0,
          hint: '递推：f(n) = 2·f(n-1) + 1，f(1)=1，解得 f(n) = 2^n − 1。n=3 时正好 7 次。',
        },
      },
      {
        title: '递归的秘密：系统帮你在"压栈"',
        content: `<p>计算机怎么记住"每层递归进行到哪了"？答案是<b>递归工作栈</b>。每次调用，系统压入一个<b>活动记录</b>：</p>
          <ul><li><b>参数</b>（本层的 n、A、B、C）</li><li><b>局部变量</b></li><li><b>返回地址</b>（返回后从哪继续执行）</li></ul>
          <p>层层向下递归时不断压栈，返回时按<b>后进先出</b>的次序逐层弹栈——回归次序与递推次序正好相反。</p>
          <p>以 <code>Factorial(4)</code> 为例的活动记录（自底向上入栈）：</p>
          <table>
            <tr><th>参数 n</th><th>返回时的计算</th><th>返回值</th></tr>
            <tr><td>4</td><td>4 × 6</td><td>24</td></tr>
            <tr><td>3</td><td>3 × 2</td><td>6</td></tr>
            <tr><td>2</td><td>2 × 1</td><td>2</td></tr>
            <tr><td>1</td><td>1 × 1</td><td>1</td></tr>
            <tr><td>0</td><td>直接定值（出口）</td><td>1</td></tr>
          </table>
          <p>所以递归的空间开销 = 栈深。汉诺塔要递归 n 层，空间复杂度 <b>O(n)</b>。</p>`,
      },
      {
        title: '递归改非递归 & 小结',
        content: `<p>递归<b>简洁、易编、易懂</b>，但有的递归<b>效率低、重复计算多</b>（典型：Fib 数列朴素递归是 O(2^n)）。两种改法：</p>
          <ul>
            <li><b>迭代法</b>：单向递归（如 Fib、阶乘）可直接改成循环，最高效；</li>
            <li><b>手动加栈</b>：把系统栈里干的事自己用一个栈模拟，功能等价。</li>
          </ul>
          <p>汉诺塔小结：移动次数 2<sup>n</sup>−1，时间 O(2<sup>n</sup>)（指数级，问题本身就这么大），空间 O(n)（栈深）。</p>
          <p>💡 <em> DP 入门课会告诉你：Fib 的重复计算可以用"记忆化/递推"消掉，而汉诺塔的 2^n 次移动是问题固有的，优化不掉。</em></p>
          <p>👉 去<a href="#/quiz/ch3" class="lesson-link">练习测验巩固第 3 章</a>。</p>`,
      },
    ],
  },

  'lesson-cqueue': {
    title: '循环队列：判空与判满',
    chapter: 'ch3',
    summary: [
      '顺序队列出队后 front 前移，前面空间用不到，出现"假溢出"，解法是取模回绕构成循环队列。',
      '判空：front == rear；判满：(rear + 1) % maxSize == front —— 牺牲一个存储单元来区分两种状态。',
      '队列长度 (rear − front + maxSize) % maxSize，指针进一都是 (x+1) % maxSize。',
      '进队先存后移尾指针，出队先取后移头指针；链式队列没有队满问题。',
    ],
    steps: [
      {
        title: '顺序队列的"假溢出"',
        content: `<p>用数组做队列：front 指队头、rear 指队尾的下一格。出队 front++，进队 rear++。</p>
          <p>问题来了：几个元素出队后，<b>数组前段的格子废了</b>，而 rear 一旦到达 maxSize，明明前面还有空位却不能再进队——这就是<b>假溢出</b>。</p>
          <pre class="lesson-tree">front=3, rear=8 (maxSize=8)
下标:  0    1    2    3    4    5    6    7
      [废] [废] [废] [D]  [E]  [F]  [G]  [?]←rear 已到头
再来一个元素？rear==maxSize 报"队满"，但 0~2 明明空着！</pre>
          <p>解法：把数组想象成<b>首尾相接的环</b>——指针到 maxSize−1 后再进一就回到 0。</p>`,
      },
      {
        title: '取模运算实现"回绕"',
        content: `<p>环形的秘密就是一个 <code>%</code>：</p>
          <ul>
            <li>队头指针进一：<code>front = (front + 1) % maxSize;</code></li>
            <li>队尾指针进一：<code>rear = (rear + 1) % maxSize;</code></li>
            <li>队列长度：<code>(rear − front + maxSize) % maxSize</code>（加 maxSize 防止负数）。</li>
          </ul>
          <p>初始化时 <code>front = rear = 0</code>。指针在环上追赶：进队 rear 追 front，出队 front 追 rear。</p>`,
      },
      {
        title: '判空 vs 判满：为什么要"牺牲一个单元"',
        content: `<p>麻烦在于：队空时 front == rear；可 rear 绕一圈追上 front（队满）时，也是 front == rear！<b>两种状态无法区分</b>。</p>
          <p>课件采用的经典解法：<b>牺牲一个存储单元</b>，规定 rear 永远追不上 front，最多差一格：</p>
          <table>
            <tr><th>状态</th><th>条件</th></tr>
            <tr><td>队空</td><td><code>front == rear</code></td></tr>
            <tr><td>队满</td><td><code>(rear + 1) % maxSize == front</code></td></tr>
          </table>
          <p>代价：maxSize 大小的数组最多只能存 <b>maxSize − 1</b> 个元素。另一种做法是设一个 size 计数器，本课按课件方案。</p>`,
        interaction: {
          type: 'quiz',
          question: '循环队列（牺牲一个单元法）的队满条件是？',
          options: ['rear == front', '(rear + 1) % maxSize == front', 'rear == maxSize - 1', 'rear - front == maxSize'],
          answer: 1,
          hint: 'rear 的下一格是 front 就说明"再进一个就撞上队头"，即已满。取模处理 rear 在表尾绕回的情况。',
        },
      },
      {
        title: '操作代码走读',
        content: `<p>四个短小但考点密集的函数：</p>`,
        code: {
          lang: 'cpp',
          activeLine: 4,
          code: `void MakeEmpty() { front = rear = 0; }
int IsEmpty() const { return front == rear; }
int IsFull()  const { return (rear + 1) % maxSize == front; }
int getSize() const { return (rear - front + maxSize) % maxSize; }

template <class E>
bool SeqQueue<E>::EnQueue(E x) {        // 进队
    if (IsFull() == true) return false;
    elements[rear] = x;                 // 先存入
    rear = (rear + 1) % maxSize;        // 尾指针加一（取模回绕）
    return true;
}

template <class E>
bool SeqQueue<E>::DeQueue(E& x) {       // 出队
    if (IsEmpty() == true) return false;
    x = elements[front];                // 先取队头
    front = (front + 1) % maxSize;      // 再队头指针加一
    return true;
}`,
          explanations: {
            2: '队空：front 追平 rear。',
            3: '队满：rear 的下一格是 front。牺牲的正是 front 前那一格。',
            4: '长度公式加 maxSize 再取模，保证 rear < front（绕回）时结果非负。',
            10: '先写入数据，再移动指针；顺序颠倒会留下脏数据。',
            11: '取模让 rear 从 maxSize−1 跳回 0。',
            19: '出队同理：先取值再前移，front 不会真正"删除"数据，只是放弃它。',
          },
        },
      },
      {
        title: '实例演示：指针绕圈跑',
        content: `<p>maxSize = 8，依次执行：A、B、C 进队 → A、B 出队 → D、E、F、G、H 进队 → I 进队（rear 绕回到 0）。</p>`,
        array: {
          data: ['I', null, 'C', 'D', 'E', 'F', 'G', 'H'],
          highlights: [0],
          pointers: { front: 2, rear: 1 },
          caption: '此刻 front=2、rear=1（已绕回表头）。队满判定：(1+1)%8 == 2 ✓ 队满——注意下标 1 的格子是空的，这正是"牺牲"的那一格。队中实际有 7 个元素。',
        },
        interaction: {
          type: 'quiz',
          question: '承上例：front=2、rear=1、maxSize=8，此时队列中有多少个元素？',
          options: ['7 个', '8 个', '1 个', '9 个'],
          answer: 0,
          hint: '(rear − front + maxSize) % maxSize = (1 − 2 + 8) % 8 = 7。',
        },
      },
      {
        title: '易错点小结',
        content: `<ul>
          <li>判满条件里的 <b>% maxSize</b> 不能丢：rear 在表尾时 (rear+1) 会越界；</li>
          <li>牺牲单元法下，能存的最大元素个数是 <b>maxSize − 1</b>，选择题常挖这个坑；</li>
          <li>进队是"先存后移"，出队是"先取后移"，都不用真的清空格子；</li>
          <li>链式队列（队头在链头、队尾在链尾）只有队空问题（front == NULL），<b>没有队满问题</b>。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch3" class="lesson-link">练习测验巩固第 3 章</a>。</p>`,
      },
    ],
  },

  /* ============ ch4 串 ============ */

  'lesson-kmp': {
    title: 'KMP 算法：next 数组手推',
    chapter: 'ch4',
    summary: [
      '朴素匹配失配后目标串指针要回溯，最坏 O(n·m)；KMP 的本质是"从失败中吸取经验"，目标指针不回溯。',
      'next[j] 的含义：模式串 p[0..j-1]（前 j 个字符）中，最长相等前后缀的长度（本课件约定 next[0] = -1）。',
      '失配时 j 回退为 next[j]；j = 0 也失配则目标指针进一、j 归 0。',
      '求 next 是"模式串自己匹配自己"，从左到右递推；KMP 总时间 O(n + m)。',
    ],
    steps: [
      {
        title: '朴素匹配为什么慢？',
        content: `<p>朴素（蛮力）匹配：用目标串 T 的每个可能位置对齐模式 P，逐字符比较，失配后<b>T 的指针回退</b>、右移一格重来。</p>
          <p>最坏情况：每趟都比较到模式串末尾才失配，比较次数达 <code>(n−m+1) × m</code>，时间 <b>O(n·m)</b>。</p>
          <pre><code>T = a b a b a b a b ...
P = a b a b c          （第 5 位失配，前 4 位白比了？）
P 右移 1 位 → a 又从头比……信息全丢了！</code></pre>
          <p>其实失配时我们已经"知道"T 失配点之前的内容——<b>前缀和后缀能匹配的最大长度</b>蕴含着可复用的信息。这就是 KMP 的出发点：从失败中吸取经验。</p>`,
      },
      {
        title: 'next 数组的定义',
        content: `<p>KMP（Knuth、Morris、Pratt）用 <b>next 特征向量</b>记录"失配后模式串跳到哪"。</p>
          <p><b>通俗理解（课件原话）</b>：next[i] 表示模式串 A[0] 至 A[i−1] 这个前缀中，使<b>前 k 个字符等于后 k 个字符</b>的最大 k 值（真前缀 = 真后缀的长度）。课件约定：</p>
          <ul>
            <li><code>next(0) = −1</code>（第一位就失配，无任何可复用信息）；</li>
            <li>若存在最大 k 使 <code>p₀…pₖ = p_{j−k−1}…p_{j−1}</code>，则 <code>next(j) = k+1</code>；</li>
            <li>否则 <code>next(j) = 0</code>。</li>
          </ul>
          <p><b>失配处理规则</b>：在模式第 j 位失配时——</p>
          <ul>
            <li>j &gt; 0：模式串改用 <code>p_{next(j)}</code> 对准 T 中<b>刚失配的字符</b>继续比（目标指针不回溯！）；</li>
            <li>j = 0：目标指针进一，模式串回到 p₀ 重新开始。</li>
          </ul>`,
      },
      {
        title: '手推 next："abaabcac"',
        content: `<p>对模式 P = a b a a b c a c 逐位推：</p>
          <table>
            <tr><th>j</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
            <tr><td>P</td><td>a</td><td>b</td><td>a</td><td>a</td><td>b</td><td>c</td><td>a</td><td>c</td></tr>
            <tr><td>next[j]</td><td><b>−1</b></td><td>0</td><td>0</td><td>1</td><td>1</td><td><b>2</b></td><td>0</td><td>1</td></tr>
          </table>
          <p>手推时盯住"失配位<b>之前</b>的子串 p[0..j−1]"，找它的最长相等前后缀。几个关键位：</p>
          <pre><code>j=3: 看 "aba"——前缀 a = 后缀 a，长 1 → next[3] = 1 ✓
j=5: next[4]=1。比较 p[4]=b 与 p[1]=b 相等 → next[5] = next[4]+1 = 2 ✓（"abaa b"的相等前后缀 "ab"）
j=6: next[5]=2。p[5]=c ≠ p[2]=a → 回退 k=next[2]=0；p[5]=c ≠ p[0]=a → k=next[0]=−1 → next[6] = 0 ✓
j=7: next[6]=0。p[6]=a = p[0]=a → next[7] = 1 ✓</code></pre>
          <p>记住口诀：<b>相等就 +1 传递，失配就沿 next 链回退，退无可退记 0</b>。</p>`,
        interaction: {
          type: 'quiz',
          question: '模式串 "abaabcac" 的 next[5] 是多少？（按课件约定 next[0] = −1）',
          options: ['2', '1', '0', '3'],
          answer: 0,
          hint: '前 5 个字符 "abaab"：前缀 "ab" = 后缀 "ab"，最长相等前后缀长 2，next[5] = 2。',
        },
      },
      {
        title: 'next 的递推计算（代码走读）',
        content: `<p>求 next 的思想：<b>把模式串自己当成目标串，做一次"自己匹配自己"</b>，从左到右递推。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 6,
          code: `void AString::getNext(int next[]) {
    int j = 0, k = -1, lengthP = curLength;
    next[0] = -1;                        // 约定：next[0] = -1
    while (j < lengthP - 1) {            // 逐项计算 next[j+1]
        if (k == -1 || ch[k] == ch[j]) { // 匹配成功（或退到头）
            k++;  j++;
            next[j] = k;                 // 相等则长度加一传递
        }
        else k = next[k];                // 失配：k 沿 next 链回退
    }
}`,
          explanations: {
            3: '约定 next[0] = -1，代表"第一位失配，无信息可复用"。',
            4: 'k 是"当前已匹配的前缀长度"。k == -1 表示已经退到头，只能从头再来。',
            6: 'ch[k] == ch[j]：前缀可以再延长一位，j、k 同步前进。',
            7: 'next[j] = k：位置 j 失配时，模式串跳到第 k 位继续比。',
            9: '失配时不是从头开始，而是 k = next[k]——继续利用已有的 next 信息回退，这正是 KMP 高效的原因。',
          },
        },
      },
      {
        title: 'KMP 主算法（代码走读）',
        content: `<p>匹配主过程 fastFind：注意 <b>posT（目标指针）永远不会回退</b>。</p>`,
        code: {
          lang: 'cpp',
          activeLine: 6,
          code: `int AString::fastFind(AString& pat, int k, int next[]) const {
    // 从 k 开始找 pat 在 this 串中的位置，失败返回 -1
    int posP = 0, posT = k;              // 模式指针 / 目标指针
    int lengthP = pat.curLength;
    int lengthT = curLength;
    while (posP < lengthP && posT < lengthT)
        if (posP == -1 || pat.ch[posP] == ch[posT])
            { posP++;  posT++; }         // 对应字符匹配，双指针前进
        else posP = next[posP];          // 失配：模式指针回退，目标不动
    if (posP < lengthP) return -1;       // 匹配失败
    else return posT - lengthP;          // 成功：返回起始下标
}`,
          explanations: {
            3: 'posP 指模式串、posT 指目标串，都从约定起点出发。',
            6: 'posP == -1 表示模式已退无可退（next[0] 的情形），此时相当于"目标进一、模式归零"。',
            7: '匹配则两个指针同时前进。',
            8: 'KMP 的灵魂一句：目标指针 posT 原地不动，模式指针跳到 next[posP]。',
            11: 'posP 走完整个模式串说明匹配成功，起始位置 = posT − lengthP。',
          },
        },
      },
      {
        title: '完整匹配示例',
        content: `<p>目标 T = "acabaabaabcacaabc"，模式 P = "abaabcac"（next 同前）：</p>
          <table>
            <tr><th>趟次</th><th>失配情况</th><th>处理</th></tr>
            <tr><td>第1趟</td><td>j = 1 处失配</td><td>next(1) = 0，下次从 p₀ 比起</td></tr>
            <tr><td>第2趟</td><td>j = 0 处失配</td><td>目标指针进一，模式回到 p₀</td></tr>
            <tr><td>第3趟</td><td>j = 5 处失配</td><td>next(5) = 2，下次从 p₂ 比起</td></tr>
            <tr><td>第4趟</td><td>全部匹配</td><td>匹配成功 ✓</td></tr>
          </table>
          <p>注意第 3 趟：p₀p₁="ab" 已与目标中对应部分对上了（next 信息的功劳），所以失配后<b>直接从 p₂ 继续比</b>，中间的字符一个都没重比。</p>`,
      },
      {
        title: '复杂度与易错点',
        content: `<ul>
          <li>主算法中目标指针<b>只进不退</b>：要么双双 +1，要么只动模式指针，比较次数最多 O(lengthT)；加上求 next 的 O(m)，总复杂度 <b>O(n + m)</b>。</li>
          <li>易错①：next[0] 的约定值——课件取 <b>−1</b>，有些教材取 0，做题先看题目约定；</li>
          <li>易错②：手推 next 时比的是<b>失配位之前的子串</b> p[0..j−1]，别把 p[j] 自己算进去；</li>
          <li>易错③："回退"只发生在模式串上，说"目标串指针回溯"的选项直接排除。</li>
        </ul>
        <p>👉 去<a href="#/quiz/ch4" class="lesson-link">练习测验巩固第 4 章</a>。</p>`,
      },
    ],
  },

});
