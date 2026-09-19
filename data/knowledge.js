/* ========================================
   knowledge.js - Knowledge point details
   Each entry: id, title, content (HTML), code, complexity, related
   ======================================== */

const KNOWLEDGE = {
  // === Chapter 1: 绪论 ===
  'ch1-1': {
    title: '什么是数据结构',
    content: `
      <h3>1.1 什么是数据结构</h3>
      <p><b>数据结构</b>是一门研究<b>非数值计算</b>的程序设计问题中计算机的<b>操作对象</b>以及它们之间的<b>关系</b>和<b>操作</b>的学科。描述这类问题的数学模型不再是数学方程，而是诸如<b>表、树、图</b>之类的数据结构。</p>
      <h4>三个引例（课件）</h4>
      <ol>
        <li><b>学生信息管理系统</b>：处理对象是<b>表</b>，元素之间是<b>线性关系</b>（一对一），操作有遍历、查找、插入、删除；</li>
        <li><b>人机博弈（井字棋对弈树）</b>：处理对象是<b>树</b>，元素之间是<b>一对多的层次关系</b>；</li>
        <li><b>社交网络</b>：处理对象是<b>图</b>，元素之间是<b>多对多的网状关系</b>。</li>
      </ol>
      <h4>数据结构的三个层面</h4>
      <table>
        <tr><th>层面</th><th>含义</th><th>示例</th></tr>
        <tr><td><b>逻辑结构</b></td><td>数据元素之间的逻辑关系（面向问题、用户视图）</td><td>线性结构、树形结构、图状结构、集合</td></tr>
        <tr><td><b>存储结构</b></td><td>数据在计算机中的表示（物理结构，面向计算机）</td><td>顺序存储、链接存储、索引存储、散列存储</td></tr>
        <tr><td><b>数据运算</b></td><td>在数据结构上执行的操作及其实现</td><td>插入、删除、查找、排序、遍历</td></tr>
      </table>
      <h4>四种基本逻辑结构</h4>
      <ul>
        <li><b>集合结构</b>：元素之间除了"同属一个集合"外无其他关系（无序）；</li>
        <li><b>线性结构</b>：元素之间存在一对一的关系（第一个无前驱，最后一个无后继，其余元素有唯一前驱和唯一后继）；</li>
        <li><b>树形结构</b>：一对多关系，除根外每个结点有且仅有一个前驱，后继数目不限；</li>
        <li><b>图状结构</b>：多对多关系，每个元素的前驱和后继数目都不限。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>逻辑结构与存储结构是两回事：任何一个<b>算法的设计取决于选定的逻辑结构</b>，而算法的<b>最终实现依赖于采用的存储结构</b>；</li>
        <li>逻辑上相邻的元素在链接存储中物理位置<b>不要求相邻</b>。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch1-2', 'ch1-3', 'ch2-1'],
  },

  'ch1-2': {
    title: '基本概念和术语',
    content: `
      <h3>1.2 基本概念和术语</h3>
      <h4>四个层次分明的概念</h4>
      <table>
        <tr><th>术语</th><th>定义</th><th>例子</th></tr>
        <tr><td><b>数据(Data)</b></td><td>能被计算机识别和处理的符号的集合</td><td>—</td></tr>
        <tr><td><b>数据元素(Data Element)</b></td><td>数据的基本单位，也称结点、顶点、记录</td><td>学生表中一整行记录</td></tr>
        <tr><td><b>数据项(Data Item)</b></td><td>组成数据元素的、不可分割的<b>最小单位</b></td><td>学号、姓名、性别</td></tr>
        <tr><td><b>数据对象(Data Object)</b></td><td>性质相同的数据元素的<b>集合</b></td><td>整数数据对象 N</td></tr>
      </table>
      <p><b>关键对应关系</b>：学生表中<b>每一行是一个数据元素，行中的每一列是一个数据项</b>；数据元素是数据项的集合，数据对象是数据元素的集合。若数据元素由若干数据项组成，常称之为<b>记录(Record)</b>，含大量记录的线性表又称为<b>文件(File)</b>。</p>
      <h4>数据结构的形式定义</h4>
      <p class="formula">Data_Structure = (D, R)</p>
      <p>其中 D 是数据元素的有限集合，R 是 D 上<b>关系</b>的有限集合。例：班级 Class = (D, S)，其中 R₁ = {⟨a₁,b₁⟩,⟨a₁,c₁⟩,⟨a₁,d₁⟩}（班长–组长），R₂ = {⟨b₁,bⱼ⟩,…}（组长–组员），两种关系叠加构成树形结构。</p>
      <h4>数据的八种基本运算</h4>
      <p>创建、清除、插入、删除、搜索、更新、访问、遍历（遍历要求每个元素恰好被访问一次）。</p>
      <h4>四种存储（物理）结构</h4>
      <ol>
        <li><b>顺序存储</b>：连续存储单元，逻辑相邻则物理相邻；</li>
        <li><b>链接存储</b>：地址可不连续，用<b>指针</b>表示元素间关系；</li>
        <li><b>索引存储</b>：元素地址收集在一张地址表中（间接寻址）；</li>
        <li><b>散列存储</b>：地址 = Hash(元素)。</li>
      </ol>
    `,
    complexity: null,
    related: ['ch1-1', 'ch1-3', 'ch1-4'],
  },

  'ch1-3': {
    title: '抽象数据类型(ADT)',
    content: `
      <h3>1.3 抽象数据类型 (Abstract Data Type)</h3>
      <p><b>数据类型</b>是一组<b>性质相同的值的集合</b>以及定义于这个值集合上的<b>一组操作</b>的总称（如 int 的取值范围与 +、−、*、/、% 运算）。</p>
      <p><b>抽象数据类型 (ADT)</b> 由用户定义、用以表示应用问题的<b>数据模型</b>：由基本数据类型组成，并包括一组相关的<b>服务（操作）</b>。所谓"抽象"，是指抽取反映问题本质的东西，<b>不涉及具体实现细节</b>。</p>
      <h4>三元组表示</h4>
      <p class="formula">ADT = (D, R, P)</p>
      <ul>
        <li><b>D</b>：数据对象（具有相同特性的数据元素的集合）</li>
        <li><b>R</b>：数据关系（D 上关系的集合）</li>
        <li><b>P</b>：基本操作（对 D 的基本操作集合）</li>
      </ul>
      <h4>两种视图</h4>
      <ul>
        <li><b>设计者角度</b>：定义信息、给出功能实现、提供公共接口；</li>
        <li><b>用户角度</b>：只通过接口操作，ADT 对用户是一个<b>黑盒子</b>。</li>
      </ul>
      <h4>ADT 的特点</h4>
      <ul>
        <li>支持<b>逻辑设计和物理实现的分离</b>，支持封装和信息隐蔽；</li>
        <li>降低软件设计复杂性、提高可读性与可维护性、正确性容易保证。</li>
      </ul>
      <h4>示例：线性表的ADT</h4>
      <pre><code>ADT LinearList {
  数据对象: D = {a₁, a₂, ..., aₙ | aᵢ ∈ ElemSet}
  数据关系: R = {&lt;aᵢ₋₁, aᵢ&gt; | aᵢ₋₁, aᵢ ∈ D}
  基本操作:
    InitList(&L)       // 初始化
    DestroyList(&L)    // 销毁
    ListInsert(&L,i,e) // 插入
    ListDelete(&L,i,e) // 删除
    ListLength(L)      // 求长度
    GetElem(L,i,&e)    // 取值
    LocateElem(L,e)    // 查找
}</code></pre>
      <p>面向对象方法中类的定义充分体现了 ADT 思想：<b>面向对象 = 对象 + 类 + 继承 + 通信</b>。</p>
    `,
    complexity: null,
    related: ['ch1-1', 'ch1-2', 'ch2-1'],
  },

  'ch1-4': {
    title: '算法的定义与特性',
    content: `
      <h3>1.4 算法的定义与特性</h3>
      <p><b>算法 (Algorithm)</b> 是对特定问题求解步骤的一种描述：一个<b>有穷的指令集</b>，这些指令为解决某一特定任务规定了一个运算序列。</p>
      <h4>算法的描述方式</h4>
      <ol>
        <li><b>自然语言</b>；</li>
        <li><b>流程图</b>：用特定图形符号描述；</li>
        <li><b>伪语言（伪代码）</b>：程序设计语言三大基本结构 + 自然语言；</li>
        <li><b>类语言</b>：如类 C、类 PASCAL 语言。</li>
      </ol>
      <h4>算法的五个重要特性</h4>
      <table>
        <tr><th>特性</th><th>含义</th></tr>
        <tr><td><b>输入</b></td><td>有 <b>0 个或多个</b>输入</td></tr>
        <tr><td><b>输出</b></td><td>有 <b>一个或多个</b>输出（处理结果）</td></tr>
        <tr><td><b>确定性</b></td><td>每条指令确切无歧义：相同输入必得相同结果</td></tr>
        <tr><td><b>有穷性</b></td><td>算法应在执行<b>有穷步</b>后结束，每步在有穷时间内完成</td></tr>
        <tr><td><b>有效性</b></td><td>每条运算足够基本，可通过已实现的基本运算有限次实现</td></tr>
      </table>
      <h4>易错点：程序 ≠ 算法</h4>
      <ul>
        <li>程序是算法用某种程序设计语言的具体实现；</li>
        <li>程序<b>不一定满足有穷性</b>（如操作系统的监控程序），因此<b>程序不一定是算法</b>；</li>
        <li>例：求 π 的精确值是无穷过程，只能称为"计算方法"，<b>不能称为算法</b>。</li>
      </ul>
      <h4>算法的性能标准（好算法的要求）</h4>
      <p><b>正确性</b>、<b>可使用性</b>（用户友好）、<b>可读性</b>、<b>效率</b>、<b>健壮性</b>（对非法输入能作出反应处理）、<b>简单性</b>。</p>
    `,
    complexity: null,
    related: ['ch1-5', 'ch1-6'],
  },

  'ch1-5': {
    title: '算法效率的度量',
    content: `
      <h3>1.5 算法效率的度量</h3>
      <h4>两种度量途径</h4>
      <ul>
        <li><b>事后统计（后期测试）</b>：运行程序并计时。缺点：必须先编出程序；统计结果依赖<b>硬件、编译器等环境因素</b>，容易掩盖算法本身的优劣；</li>
        <li><b>事前分析估计</b>：求出算法的时间界限函数（空间/时间复杂度），是课程采用的方法。</li>
      </ul>
      <h4>为什么不用绝对运行时间？</h4>
      <p>绝对运行时间不仅与算法本身有关，还与<b>机器性能、编程语言、编译器、编程技巧</b>相关。我们希望度量标准<b>独立于机器与语言</b>、不随软硬件进步失效，并且更关注<b>大规模输入</b>下的表现。</p>
      <h4>程序步（时间复杂性的基本度量）</h4>
      <p><b>程序步</b>指在语法（义）上有意义的一段指令：注释与声明为 0 步；赋值与表达式计算为 1 步；循环控制语句每次执行 1 步。用全局变量 count 统计：</p>
      <pre><code>float sum(float a[], const int n) {
    float s = 0.0;  count++;          // 1 步
    for (int i = 0; i &lt; n; i++) {
        count += 2;                   // for 语句每次 2 步
        s += a[i];  count++;          // 赋值 1 步
    }
    count += 2;  count++;             // for 最后一次 + return
    return s;
}   // 执行结束 count = 3n + 4</code></pre>
      <p><b>注意</b>：一个语句本身的程序步数 ≠ 它一次执行的程序步数。如 <code>x = sum(R, n);</code> 语句本身 1 步，但一次执行共 1 + (3n+4) = 3n+5 步。</p>
      <h4>关键操作频度</h4>
      <p>实际分析中通常统计<b>关键操作</b>（如最内层循环体）的重复执行次数 T(n)，作为问题规模 n 的函数，再进一步化为渐进复杂度。</p>
    `,
    complexity: null,
    related: ['ch1-4', 'ch1-6', 'ch1-7'],
  },

  'ch1-6': {
    title: '时间复杂度分析',
    content: `
      <h3>1.6 时间复杂度分析</h3>
      <h4>大 O 记号的规范定义</h4>
      <p><code>T(n) = O(f(n))</code> 是指：存在正常数 <b>c</b> 和 <b>n₀</b>，使得当 <b>n ≥ n₀</b> 时恒有</p>
      <p class="formula">T(n) ≤ c · f(n)</p>
      <p>即大 O 给出的是问题规模充分大时算法复杂度的<b>上界</b>——随着 n 增长，T(n) 的增长至多与 f(n) 一样快（上界的阶越低，评估越有价值）。例：T(n) = 2.7n³ + 3.8n² + 5.3 = O(n³)。</p>
      <h4>三种渐进记号的关系</h4>
      <ul>
        <li><b>O（大 O）</b>：上界，对应<b>最坏情况</b>的增长趋势；</li>
        <li><b>Ω（大 Omega）</b>：下界，即存在 c、n₀ 使 T(n) ≥ c·f(n)（n ≥ n₀），对应<b>最好情况</b>；</li>
        <li><b>Θ（Theta）</b>：当 T(n) = O(f(n)) <b>且</b> T(n) = Ω(f(n)) 同时成立时，记 T(n) = Θ(f(n))，给出精确的增长阶（上下界重合）。</li>
      </ul>
      <p>平时简称的"时间复杂度"通常指大 O 表示法。</p>
      <h4>O 的运算规则</h4>
      <ul>
        <li><b>加法规则</b>（并列程序段）：T(n,m) = T₁(n) + T₂(m) = O(max(f(n), g(m)))；</li>
        <li><b>乘法规则</b>（嵌套程序段）：T(n,m) = T₁(n) × T₂(m) = O(f(n) × g(m))；</li>
        <li>常系数、低阶项与常数项可忽略：O(C·f(n)) = O(f(n))。</li>
      </ul>
      <h4>经典例子：矩阵相乘</h4>
      <pre><code>for (i = 0; i &lt; n; i++)                 // 执行 n+1 次
    for (j = 0; j &lt; n; j++) {           // 执行 n(n+1) 次
        c[i][j] = 0.;                   // 执行 n² 次
        for (k = 0; k &lt; n; k++)         // 执行 n²(n+1) 次
            c[i][j] = c[i][j] + a[i][k] * b[k][j];  // n³ 次
    }
// T(n) = 2n³ + 3n² + 2n + 1 = O(n³)</code></pre>
      <h4>常见时间复杂度（从小到大）</h4>
      <p class="formula">O(1) &lt; O(log₂n) &lt; O(n) &lt; O(n log₂n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)</p>
      <table>
        <tr><th>复杂度</th><th>名称</th><th>典型示例</th></tr>
        <tr><td><span class="complexity-badge badge-time">O(1)</span></td><td>常数阶</td><td>数组下标访问</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(log n)</span></td><td>对数阶</td><td>二分查找、<code>j *= 2</code> 型循环</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(n)</span></td><td>线性阶</td><td>线性遍历</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(n log n)</span></td><td>线性对数阶</td><td>归并排序、外层 <code>j*=2</code> 内层 n 次循环</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(n²)</span></td><td>平方阶</td><td>冒泡排序、双层循环 n×n/4</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(n³)</span></td><td>立方阶</td><td>矩阵乘法</td></tr>
        <tr><td><span class="complexity-badge badge-time">O(2ⁿ)</span></td><td>指数阶</td><td>暴力子集枚举</td></tr>
      </table>
      <h4>分析方法与易错点</h4>
      <ol>
        <li>找<b>基本操作</b>（最深层循环体）；</li>
        <li>计算其执行频度 T(n)（注意循环判断本身多执行一次）；</li>
        <li>取最高阶项、忽略系数得 O(f(n))。</li>
      </ol>
      <ul>
        <li>循环变量<b>倍增</b>（i *= 2）的循环是 <code>O(log n)</code>，不是 O(n)；</li>
        <li>循环次数与 n 无关（如固定 10000 次）时是 <code>O(1)</code>；</li>
        <li>所有语句都与 n 无关时，即使上千条语句也只是 O(n⁰) = O(1)。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch1-5', 'ch1-7', 'ch9-1'],
  },

  'ch1-7': {
    title: '空间复杂度分析',
    content: `
      <h3>1.7 空间复杂度分析</h3>
      <p>算法的（渐进）空间复杂度记作 <code>S(n) = O(f(n))</code>：当问题规模 n 充分大时，算法所需<b>辅助存储空间</b>随 n 变化的增长趋势。</p>
      <h4>统计范围</h4>
      <ul>
        <li>指的是为解决问题所需的<b>额外（辅助）存储空间</b>，一般<b>不包括</b>输入数据本身占用的空间；</li>
        <li>包括：显式申请的辅助数组、递归调用时系统栈上的<b>活动记录</b>（参数、局部变量、返回地址）等。</li>
      </ul>
      <h4>典型例子</h4>
      <table>
        <tr><th>算法</th><th>辅助空间</th><th>说明</th></tr>
        <tr><td>冒泡 / 插入 / 选择排序</td><td><span class="complexity-badge badge-space">O(1)</span></td><td>只用一个交换临时变量</td></tr>
        <tr><td>归并排序</td><td><span class="complexity-badge badge-space">O(n)</span></td><td>需要与原表等大的辅助数组</td></tr>
        <tr><td>快速排序</td><td><span class="complexity-badge badge-space">O(log n) ~ O(n)</span></td><td>递归栈深度：均衡划分为 log n，单支树退化为 n</td></tr>
        <tr><td>递归求 n!</td><td><span class="complexity-badge badge-space">O(n)</span></td><td>递归工作栈保存 n 层活动记录</td></tr>
        <tr><td>图的邻接矩阵 DFS</td><td><span class="complexity-badge badge-space">O(V)</span></td><td>visited 数组 + 递归栈</td></tr>
      </table>
      <h4>易错点</h4>
      <ul>
        <li>递归算法的空间开销主要在<b>递归工作栈</b>，深度等于递归树的深度（如快排最坏 O(n)）；</li>
        <li>"原地 (in-place) 算法"指辅助空间 O(1) 或 O(log n)——快速排序相对归并排序的优势就是原位排序；</li>
        <li>时间与空间常常可以互换（如动态规划用 O(n) 或 O(nC) 的表换取避免指数级重复计算）。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch1-6', 'ch8-7', 'ch10-1'],
  },

  // === Chapter 2: 线性表 ===
  'ch2-1': {
    title: '线性表的定义与ADT',
    content: `
      <h3>2.1 线性表的定义</h3>
      <p><b>线性表</b>是 n（n≥0）个具有相同特性的数据元素的<b>有限序列</b>，记作 L = (a₁, a₂, ..., aₙ)。aᵢ 称为<b>表项</b>，n 为<b>表长度</b>，n=0 时称<b>空表</b>；第一个表项是<b>表头</b>，最后一个是<b>表尾</b>。</p>
      <h4>逻辑特征（三条）</h4>
      <ol>
        <li>有且仅有一个<b>开始结点 a₁</b>：没有直接前趋，仅有一个直接后继；</li>
        <li>有且仅有一个<b>终端结点 aₙ</b>：没有直接后继，仅有一个直接前趋；</li>
        <li>其余内部结点 aᵢ (2≤i≤n−1) 都<b>有且仅有一个</b>直接前趋和一个直接后继。</li>
      </ol>
      <h4>相关概念</h4>
      <ul>
        <li>数据元素由若干数据项组成时称为<b>记录</b>，含大量记录的线性表称为<b>文件</b>；</li>
        <li>线性表还分为<b>有序线性表</b>（sorted）与<b>无序线性表</b>（unsorted）。</li>
      </ul>
      <h4>基本操作</h4>
      <pre><code>InitList()      // 初始化空表
Length()        // 返回元素个数
Search(x)       // 按值查找，返回位序
Locate(i)       // 定位第i个元素
Insert(i, x)    // 在第i个位置插入x
Remove(i)       // 删除第i个元素
IsEmpty()       // 判空
Sort()          // 排序</code></pre>
      <h4>两种存储方式（比喻）</h4>
      <ul>
        <li><b>顺序表</b>像公寓楼：每个房间有固定门牌号（索引），凭地址直接到达（O(1) 访问），但中间加盖新房很困难（插入需移动大量元素）；</li>
        <li><b>链表</b>像寻宝游戏：每个结点告诉你下一个结点在哪，找第 100 个要经过 99 个线索（O(n) 访问），但在任意两个结点之间插入只需改一下指向（O(1) 插入/删除）。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch2-2', 'ch2-3', 'ch2-6'],
  },

  'ch2-2': {
    title: '顺序表 (Sequential List)',
    content: `
      <h3>2.2 顺序表</h3>
      <p>顺序表是用<b>一组地址连续的存储单元</b>依次存放线性表的数据元素——逻辑关系上相邻的两个元素在物理位置上也相邻。</p>
      <h4>地址计算</h4>
      <p>设每个元素占 m 个存储单元，则 <code>Loc(aᵢ₊₁) = Loc(aᵢ) + m</code>；令 V₀ = Loc(a₁) − m，有</p>
      <p class="formula">Loc(aᵢ) = V₀ + i × m</p>
      <p>因此顺序表既可以顺序访问，也可以<b>随机访问</b>（按位查找 O(1)）。</p>
      <h4>操作代价分析（重点）</h4>
      <ul>
        <li><b>按值搜索</b>：等概率下成功平均比较次数 <code>ACN = (n+1)/2</code>；搜索不成功比较 <b>n 次</b>；</li>
        <li><b>插入</b>（第 i 个位置，1≤i≤n+1，共有 n+1 个可插位置）：需将 data[i−1]..data[n−1] 后移，移动 n−i+1 项，平均移动次数 <code>AMN = n/2</code>；</li>
        <li><b>删除</b>（第 i 个，1≤i≤n，共 n 个位置）：需前移 n−i 项，平均移动 <code>AMN = (n−1)/2</code>。</li>
      </ul>
      <table>
        <tr><th>操作</th><th>平均时间</th><th>最坏时间</th></tr>
        <tr><td>按位查找</td><td><span class="complexity-badge badge-time">O(1)</span></td><td><span class="complexity-badge badge-time">O(1)</span></td></tr>
        <tr><td>按值查找</td><td><span class="complexity-badge badge-time">O(n)</span></td><td><span class="complexity-badge badge-time">O(n)</span></td></tr>
        <tr><td>插入 / 删除</td><td><span class="complexity-badge badge-time">O(n)</span></td><td><span class="complexity-badge badge-time">O(n)</span></td></tr>
      </table>
      <h4>应用：集合的并 / 交运算</h4>
      <pre><code>// 并：把 LB 中 LA 没有的元素插入 LA
void Union(SeqList&amp; LA, SeqList&amp; LB) {
    int n = LA.Length(), m = LB.Length();
    for (int i = 1; i &lt;= m; i++) {
        Type x = LB.getData(i);
        if (LA.Search(x) == 0) { LA.Insert(n, x); n++; }
    }
}
// 交：删除 LA 中 LB 没有的元素
void Intersection(SeqList&amp; LA, SeqList&amp; LB) {
    int n = LA.Length(), i = 1;
    while (i &lt;= n) {
        Type x = LA.getData(i);
        if (LB.Search(x) == 0) { LA.Remove(i, x); n--; }
        i++;
    }
}</code></pre>
      <h4>特点总结</h4>
      <ul>
        <li><b>优点</b>：无需额外空间表示元素间关系（存储密度高）；按序号定位 O(1)，存取速度快；适合存储<b>静态数据</b>；</li>
        <li><b>缺点</b>：插入删除需移动大量元素；需预先申请固定长度的数组。</li>
      </ul>
    `,
    code: `template <typename T>
class SeqList {
protected:
    T *data;      // 动态数组
    int maxSize;  // 最大容量
    int n;        // 当前元素个数
public:
    SeqList(int sz = 100);
    ~SeqList() { delete[] data; }
    void reSize(int newSize);     // 动态扩容
    int Length() const { return n; }
    int Search(T x) const;        // 按值查找，返回位序(1..n)，失败返回0
    bool Insert(int i, T x);      // 在第i个表项位置插入(1<=i<=n+1)
    bool Remove(int i, T &x);     // 删除第i个表项(1<=i<=n)
    bool IsEmpty() const { return n == 0; }
    bool IsFull()  const { return n == maxSize; }
};

// 按值搜索：返回位序（位序 = 下标 + 1）
template <typename T>
int SeqList<T>::Search(T x) const {
    for (int i = 1; i <= n; i++)
        if (data[i-1] == x) return i;   // 表项序号与下标差 1
    return 0;                            // 搜索失败
}

// 插入：新元素 x 插入为第 i 个表项（存入 data[i-1]），
// 原 data[i-1..n-1] 整体后移一位
template <typename T>
bool SeqList<T>::Insert(int i, T x) {
    if (n == maxSize) return false;      // 表满
    if (i < 1 || i > n + 1) return false;// 参数 i 不合理
    for (int j = n; j >= i; j--)
        data[j] = data[j-1];             // 依次后移（从后往前）
    data[i-1] = x;                       // 插入到 data[i-1] 处
    n++;
    return true;
}

// 删除：删除第 i 个表项，原 data[i..n-1] 整体前移一位
template <typename T>
bool SeqList<T>::Remove(int i, T &x) {
    if (n == 0) return false;            // 表空
    if (i < 1 || i > n) return false;
    x = data[i-1];                       // 取出被删元素
    for (int j = i; j <= n-1; j++)
        data[j-1] = data[j];             // 依次前移填补
    n--;
    return true;
}

// 动态扩容
template <typename T>
void SeqList<T>::reSize(int newSize) {
    T *newarray = new T[newSize];
    for (int i = 0; i < n; i++) newarray[i] = data[i];
    delete[] data;
    data = newarray;
    maxSize = newSize;
}`,
    complexity: { time: '按位O(1)，插删O(n)', space: 'O(n)' },
    related: ['ch2-1', 'ch2-3', 'ch2-6', 'ch2-7'],
  },

  'ch2-3': {
    title: '单链表 (Singly Linked List)',
    content: `
      <h3>2.3 单链表</h3>
      <p>单链表的每个元素由<b>结点 (Node)</b> 构成：结点 = <b>element（数据域）+ link（指针域）</b>。结点可以不连续存储，表长度可方便地扩充。</p>
      <h4>核心特性</h4>
      <ul>
        <li>逻辑相邻，物理不一定相邻（结点散布在空闲存储区中）；</li>
        <li>不能随机访问，必须沿链顺序扫描：<code>O(n)</code>；</li>
        <li><b>已知位置</b>时插入/删除只需修改指针：<code>O(1)</code>（连同查找位置共 O(n)）；</li>
        <li>动态分配空间，无需预知表长，是存储<b>动态变化数据</b>的理想选择。</li>
      </ul>
      <h4>插入的三种情况</h4>
      <ol>
        <li>在链表<b>最前端</b>插入：newnode->link = first; first = newnode;</li>
        <li>在链表<b>中间</b>插入（current 指示插入位置的前驱）：newnode->link = current->link; current->link = newnode;</li>
        <li>在<b>表尾</b>插入：与中间情况代码相同（current->link 原为 NULL）。</li>
      </ol>
      <h4>头结点（附加表头结点）的作用</h4>
      <ul>
        <li>表头结点本身不带数据，仅标志表头；</li>
        <li><b>统一空表与非空表的处理</b>：插入、删除不再区分"第一个结点"与"中间结点"两种特殊情形，简化实现。</li>
      </ul>
      <h4>建表：前插法与后插法</h4>
      <ul>
        <li><b>前插法 (inputFront)</b>：每个新结点插到链表前端，输入顺序与链序<b>相反</b>；</li>
        <li><b>后插法 (inputRear)</b>：设尾指针 last，新结点总插在表尾，链序与输入顺序<b>相同</b>。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>插入/删除必须<b>先改链再摘链</b>，顺序颠倒会丢失后继；</li>
        <li>删除结点要<b>先定位其前驱</b>（单链表无反向指针），所以删除第 i 个需 Locate(i−1)；</li>
        <li>插入函数的指针参数要用<b>引用型指针</b>（*&），否则新结点只挂到局部副本上。</li>
      </ul>
    `,
    code: `// 链表结点定义
template <typename T>
struct LinkNode {
    T data;             // 数据域
    LinkNode<T> *link;  // 指针域
    LinkNode(LinkNode<T> *ptr = NULL) : link(ptr) {}
    LinkNode(const T &item, LinkNode<T> *ptr = NULL)
        : data(item), link(ptr) {}
};

// 带头结点的单链表类
template <typename T>
class List {
protected:
    LinkNode<T> *first;  // 头指针（指向头结点）
public:
    List() { first = new LinkNode<T>; }  // 头结点不带数据
    ~List() { makeEmpty(); delete first; }
    void makeEmpty();
    int Length() const;
    LinkNode<T>* Search(const T &x);  // 按值查找
    LinkNode<T>* Locate(int i);       // 定位第i个元素(从1计)
    bool Insert(int i, T &x);         // 在第i个结点后插入
    bool Remove(int i, T &x);         // 删除第i个元素
    void Inverse();                   // 链表反转
};

// 插入：在第 i 个结点之后插入新结点（i=0 表示插到首元结点之前）
template <typename T>
bool List<T>::Insert(int i, T &x) {
    LinkNode<T> *current = Locate(i);
    if (!current) return false;
    LinkNode<T> *newNode = new LinkNode<T>(x);
    newNode->link = current->link;    // 新结点先链上后继
    current->link = newNode;          // 前驱再指向新结点
    return true;
}

// 删除：删除第 i 个元素（先找到第 i-1 个结点即前驱）
template <typename T>
bool List<T>::Remove(int i, T &x) {
    LinkNode<T> *current = Locate(i - 1);  // 找前驱
    if (!current || !current->link) return false;
    LinkNode<T> *del = current->link;
    current->link = del->link;        // 摘下被删结点
    x = del->data;
    delete del;
    return true;
}

// 链表反转（原地逆置）：依次把每个结点摘下头插到新链
template <typename T>
void List<T>::Inverse() {
    LinkNode<T> *h = NULL, *p = first->link, *pr;
    while (p) {
        pr = h;
        h = p;
        p = h->link;
        h->link = pr;
    }
    first->link = h;
}

// 置空（保留头结点）
template <typename T>
void List<T>::makeEmpty() {
    LinkNode<T> *q;
    while (first->link != NULL) {
        q = first->link;
        first->link = q->link;
        delete q;
    }
}`,
    complexity: { time: '查找O(n)，插删O(1)', space: 'O(n)' },
    related: ['ch2-1', 'ch2-2', 'ch2-4', 'ch2-5'],
  },

  'ch2-4': {
    title: '循环链表',
    content: `
      <h3>2.4 循环链表 (Circular List)</h3>
      <p>循环链表是一种<b>头尾相接</b>的链表：最后一个结点的 link 指针不为 NULL，而是<b>指向表头结点</b>。只要知道表中某一结点的地址，就能搜寻到所有其他结点。为使空表与非空表处理一致，通常也设置<b>头结点</b>。</p>
      <h4>与单链表的实现差别</h4>
      <p>最主要的不同：扫描到链尾时遇到的<b>不是 NULL，而是表头</b>。判空条件相应变为 <code>first->link == first</code>（带头结点）。</p>
      <h4>头指针 vs 尾指针</h4>
      <ul>
        <li>很多实际操作发生在<b>表尾</b>，用头指针表示的单循环链表找表尾要 O(n)；</li>
        <li>用<b>尾指针 last</b> 表示：查找开始结点 a₁ 是 <code>last->link->link</code>、终端结点 aₙ 是 <code>last</code>，两者都是 <b>O(1)</b>——因此实际中常采用尾指针表示单循环链表。</li>
      </ul>
      <h4>搜索算法</h4>
      <pre><code>template &lt;class T&gt;
CircLinkNode&lt;T&gt;* CircList&lt;T&gt;::Search(T x) {
    // 从首元结点出发搜索值为 x 的结点
    CircLinkNode&lt;T&gt; *current = first-&gt;link;
    while (current != first &amp;&amp; current-&gt;data != x)
        current = current-&gt;link;      // 绕回表头即失败
    return current != first ? current : NULL;
}</code></pre>
      <h4>应用：约瑟夫 (Josephus) 问题</h4>
      <p>n 个人围成一圈，从 1 开始报数，报到 m 的人出列，反复进行。数据结构三要素对应：<b>逻辑结构</b>是环形表；<b>存储结构</b>可用循环数组（<code>t = (t+1) % maxSize</code> 实现循环）或循环链表（<code>p = p->link</code> 自然成环）；<b>运算</b>是循环报数并删除出列者。</p>
      <pre><code>template &lt;class T, class E&gt;
void Josephus(CircList&lt;T, E&gt;&amp; Js, int n, int m) {
    CircLinkNode&lt;T, E&gt; *p = Js.getHead(), *pre = NULL;
    for (int i = 0; i &lt; n - 1; i++) {   // 共执行 n-1 次出列
        for (int j = 1; j &lt; m; j++)     // 数 m-1 个人
            { pre = p;  p = p-&gt;link; }
        cout &lt;&lt; "出列: " &lt;&lt; p-&gt;data &lt;&lt; endl;
        pre-&gt;link = p-&gt;link;            // 摘下出列结点
        delete p;
        p = pre-&gt;link;                  // 从下一个人重新报数
    }
}</code></pre>
    `,
    complexity: { time: '搜索O(n)', space: 'O(n)' },
    related: ['ch2-3', 'ch2-5', 'ch3-6'],
  },

  'ch2-5': {
    title: '双向链表',
    content: `
      <h3>2.5 双向链表 (Doubly Linked List)</h3>
      <p>在单链表每个结点里再增加一个<b>指向直接前趋的指针域</b>，形成两个方向不同的链。结点结构：<code>lLink | data | rLink</code>（左链指针、数据、右链指针）。</p>
      <h4>为什么需要双向链表</h4>
      <ul>
        <li>单链表找前驱必须从头扫描 O(n)；双向链表可直接 <code>p->lLink</code> 到达前驱；</li>
        <li>通常采用<b>带头结点的双向循环链表</b>：空表时 first 的 lLink、rLink 都指向自身。</li>
      </ul>
      <h4>对称性（重要性质）</h4>
      <p class="formula">p == p-&gt;lLink-&gt;rLink == p-&gt;rLink-&gt;lLink</p>
      <h4>插入（在 current 之后"后插"，共改 4 个指针）</h4>
      <pre><code>newNode-&gt;rLink = current-&gt;rLink;  // 1 新结点右链接后继
current-&gt;rLink   = newNode;       // 2 前驱右链接新结点
newNode-&gt;rLink-&gt;lLink = newNode;  // 3 后继左链接新结点
newNode-&gt;lLink   = current;       // 4 新结点左链接前驱</code></pre>
      <p><b>易错点</b>：步骤 1 必须在步骤 2 之前（先保存后继指针，否则断链）；空表时 current 即 first，上述四步同样适用。</p>
      <h4>删除（摘下 current，只改 2 个指针）</h4>
      <pre><code>current-&gt;rLink-&gt;lLink = current-&gt;lLink;  // 后继越过current连前驱
current-&gt;lLink-&gt;rLink = current-&gt;rLink;  // 前驱越过current连后继
delete current;</code></pre>
      <h4>类定义要点</h4>
      <p>搜索/定位/插入/删除均可带方向参数 <b>d</b>：d=0 按<b>前驱方向</b>，d≠0 按<b>后继方向</b>；判空为 <code>first->rLink == first</code>。</p>
    `,
    complexity: { time: '插删O(1)（已定位）', space: 'O(n)' },
    related: ['ch2-3', 'ch2-4'],
  },

  'ch2-6': {
    title: '顺序表与链表比较',
    content: `
      <h3>2.6 顺序表与链表比较</h3>
      <table>
        <tr><th>比较项</th><th>顺序表</th><th>链表</th></tr>
        <tr><td>存储方式</td><td>连续存储</td><td>离散存储 + 指针</td></tr>
        <tr><td>按位置访问</td><td>随机访问 O(1)</td><td>顺序访问 O(n)</td></tr>
        <tr><td>插入 / 删除</td><td>O(n) 需移动元素</td><td>找位置 O(n)，修改指针 O(1)</td></tr>
        <tr><td>空间分配</td><td>需预分配固定数组，可能溢出或浪费</td><td>动态按需分配，长度无限制</td></tr>
        <tr><td>存储密度</td><td>高（仅存数据）</td><td>低（每结点附加指针，结构性开销）</td></tr>
        <tr><td>结构性存储开销</td><td>数组填得满时没有</td><td>每个元素都有</td></tr>
        <tr><td>适用数据</td><td>静态数据</td><td>动态变化的数据</td></tr>
        <tr><td>适用场景</td><td>频繁按位查找、少增删</td><td>频繁增删、表长难以估计</td></tr>
      </table>
      <h4>要点辨析</h4>
      <ul>
        <li>链表插入删除"O(1)"指<b>找到位置之后</b>改指针的代价；算上定位第 i 个结点仍是 O(n)；</li>
        <li>顺序表省空间的前提是数组较满；若数组大量空置，反而比链表浪费；</li>
        <li>选型口诀：<b>查询多、增删少 → 顺序表；增删多、长度不定 → 链表</b>。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch2-2', 'ch2-3'],
  },

  'ch2-7': {
    title: '线性表的应用：多项式与静态链表',
    content: `
      <h3>2.7 线性表的应用</h3>
      <h4>一元多项式的表示</h4>
      <p class="formula">Pₙ(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ = Σ aᵢxⁱ</p>
      <p>n 阶多项式有 n+1 项，每项由<b>系数</b>和<b>指数</b>确定。四种存储表示：</p>
      <ol>
        <li><b>静态数组</b>：<code>float coef[maxDegree+1]</code>，下标即指数——只适用于<b>指数连续</b>的多项式；</li>
        <li><b>动态数组</b>：<code>float *coef</code>，按需分配，仍要求指数连续；</li>
        <li><b>系数+指数项数组</b>：<code>struct term { float coef; int exp; }</code>，适合<b>稀疏多项式</b>（如 3 + 5x⁵⁰ − 4x¹⁰¹，大量系数为 0）；</li>
        <li><b>链表存储</b>：结点 <code>Coef | Exp | Link</code>，项数可动态增长、插入删除不移动元素、不存在溢出问题。</li>
      </ol>
      <p><b>顺序存储的缺点</b>：项数变化大时要移动大量数据；不利于多个多项式同时处理、有溢出问题。</p>
      <h4>静态链表</h4>
      <p>给数组每个元素<b>附加一个链接指针</b>即成静态链表：每个结点由 data 域（数据）和 link 域（<b>数组下标形式的整数指针</b>）构成。</p>
      <ul>
        <li>通常 <b>0 号单元作表头结点</b>，其 link 给出首元结点的物理位置；</li>
        <li>非循环表收尾结点 <code>link = -1</code>；循环链表收尾 <code>link = 0</code>（回到表头）；</li>
        <li>处理时可<b>不改变元素物理位置</b>，只重新链接即可改变逻辑顺序；空间大小在整个运算期间固定。</li>
      </ul>
      <table>
        <tr><th></th><th>静态链表</th><th>动态链表</th></tr>
        <tr><td>实现方式</td><td>数组（顺序存储结构）模拟</td><td>new 动态申请内存</td></tr>
        <tr><td>物理地址</td><td>连续</td><td>不连续，靠指针访问</td></tr>
        <tr><td>空间分配</td><td>预先分配、长度固定</td><td>长度没有限制</td></tr>
        <tr><td>插入/删除</td><td>改"指针"（下标），不移动元素</td><td>改指针，不移动元素</td></tr>
      </table>
      <p>静态链表最初是为<b>没有指针的高级语言</b>设计的一种实现链表能力的方法。</p>
    `,
    complexity: null,
    related: ['ch2-2', 'ch2-3', 'ch2-8'],
  },

  'ch2-8': {
    title: '多项式相加',
    content: `
      <h3>2.8 多项式相加（链表应用重点）</h3>
      <h4>运算规则</h4>
      <p><b>指数相同的项，系数相加</b>；和为零的项不保留；其余项按指数升序抄入结果。</p>
      <h4>例</h4>
      <ul>
        <li>A(x) = 1 − 3x⁶ + 7x¹²（链：(1,0)→(−3,6)→(7,12)）</li>
        <li>B(x) = −x⁴ + 3x⁶ − 9x¹⁰ + 8x¹⁴（链：(−1,4)→(3,6)→(−9,10)→(8,14)）</li>
        <li>C(x) = 1 − x⁴ − 9x¹⁰ + 7x¹² + 8x¹⁴（注意 6 次项系数 −3+3=0，被消去）</li>
      </ul>
      <h4>算法步骤（两链均带头结点，pa、pb 为检测指针，结果链表设存放指针 pc）</h4>
      <ol>
        <li>当 pa、pb 都没检测完：比较两结点<b>指数域</b>——
          <ul>
            <li>指数<b>不等</b>：指数小者链入 C，相应指针进 1；</li>
            <li>指数<b>相等</b>：系数相加；若和<b>不为零</b>则链入 C，pa、pb 同时进 1（和为零则两结点都丢弃）；</li>
          </ul></li>
        <li>某一链检测完后，把另一链的<b>剩余部分</b>链接到 C 尾。</li>
      </ol>
      <h4>易错点</h4>
      <ul>
        <li>系数相加为零时<b>两结点都要跳过</b>，且不产生结果结点；</li>
        <li>结果链需另设存放指针 pc（或尾指针），不能改动 pa/pb 所在原链；</li>
        <li>比较的是<b>指数</b>而非系数。</li>
      </ul>
    `,
    code: `struct Term {                  // 多项式结点：系数 + 指数 + 链指针
    float coef;
    int exp;
    Term *link;
    Term(float c, int e, Term *next = NULL)
        { coef = c; exp = e; link = next; }
};

// 多项式链表均带表头结点（头结点 exp = -1）
void Add(Term *AH, Term *BH, Term *&CH) {
    Term *pa = AH->link, *pb = BH->link;
    Term *first = new Term(0, -1);   // 结果链表头结点
    Term *pc = first;
    while (pa != NULL && pb != NULL) {
        if (pa->exp < pb->exp) {         // A 的指数小，抄入 A 项
            pc->link = new Term(pa->coef, pa->exp);
            pa = pa->link;
        }
        else if (pa->exp > pb->exp) {    // B 的指数小，抄入 B 项
            pc->link = new Term(pb->coef, pb->exp);
            pb = pb->link;
        }
        else {                            // 指数相等：系数相加
            float sum = pa->coef + pb->coef;
            if (sum != 0)                 // 和非零才产生结果项
                pc->link = new Term(sum, pa->exp);
            pa = pa->link;  pb = pb->link;
        }
        if (pc->link != NULL) pc = pc->link;
    }
    Term *rest = (pa != NULL) ? pa : pb;  // 链接剩余部分
    while (rest != NULL) {
        pc->link = new Term(rest->coef, rest->exp);
        pc = pc->link;  rest = rest->link;
    }
    pc->link = NULL;
    CH = first;
}`,
    complexity: { time: 'O(m+n)', space: 'O(m+n)' },
    related: ['ch2-3', 'ch2-7'],
  },

  // === Chapter 3: 栈与队列 ===
  'ch3-1': {
    title: '栈的定义与ADT',
    content: `
      <h3>3.1 栈 (Stack)</h3>
      <p><b>栈</b>是仅在一端（栈顶）进行插入和删除的线性表，遵循<b>后进先出 (LIFO)</b>，也称先进后出 (FILO)。栈、队列、优先级队列与普通线性表的区别：<b>它们都是限制存取位置的线性结构</b>。</p>
      <h4>基本术语</h4>
      <ul>
        <li><b>栈顶(Top)</b>：允许插入和删除的一端；<b>栈底(Bottom)</b>：另一端；</li>
        <li><b>进栈(Push)</b>：栈顶插入元素；<b>出栈(Pop)</b>：删除栈顶元素；</li>
        <li>无元素时称<b>空栈</b>。元素按 a₁..aₙ 次序进栈，退出的第一个元素必为栈顶 aₙ。</li>
      </ul>
      <h4>ADT</h4>
      <pre><code>void Push(const Type&amp; item);  // 进栈
Type Pop();                   // 出栈
Type GetTop();                // 取栈顶元素（不删除）
void MakeEmpty();             // 置空栈
int IsEmpty() const;          // 判栈空
int IsFull() const;           // 判栈满</code></pre>
      <h4>重点：出栈序列问题</h4>
      <p>元素 1,2,3,4,5 依次进栈（进栈与出栈可交替），出栈序列不唯一，但<b>任一出栈序列中，某个元素之后出栈的、比它小的元素必须按降序出现</b>。例如出栈序列 <code>4,3,1,2,5</code> 是<b>不可能</b>的（1 出栈后，2 必须先于 3、4 出栈）；而 5,4,3,2,1、2,1,5,4,3、2,3,5,4,1 都合法。</p>
      <h4>应用场景</h4>
      <ul>
        <li>函数调用栈（递归，见 <code>ch9-2</code>）；</li>
        <li>表达式求值（后缀表达式）与括号匹配；</li>
        <li>二叉树非递归遍历、浏览器前进/后退、撤销(Undo)。</li>
      </ul>
    `,
    complexity: { time: 'Push/Pop O(1)', space: 'O(n)' },
    related: ['ch3-2', 'ch3-3', 'ch3-4', 'ch9-2'],
  },

  'ch3-2': {
    title: '顺序栈',
    content: `
      <h3>3.2 顺序栈（数组实现）</h3>
      <p>栈的顺序存储结构简称<b>顺序栈</b>。<b>栈底固定不变</b>（可设在数组任一端），<b>栈顶随进栈/出栈变化</b>，用整型变量 <b>top（栈顶指针）</b>指示。约定：数组下标 0..maxSize−1，<b>栈空时 top = −1</b>。</p>
      <h4>溢出问题</h4>
      <ul>
        <li><b>上溢 (Overflow)</b>：栈中已有 maxSize 个元素时再进栈；</li>
        <li><b>下溢 (Underflow)</b>：对空栈执行出栈；</li>
        <li>解决空间分配不当的办法：<b>双栈共享一个栈空间</b>，或改用<b>链式栈</b>。</li>
      </ul>
      <h4>双栈共享一个栈空间</h4>
      <p>两个栈共享数组 V[maxSize]：两栈栈底设在数组<b>两端</b>，b[0] = −1、b[1] = maxSize，两栈顶 t[0]、t[1] 向中间延伸。</p>
      <ul>
        <li>栈满条件：<code>t[0] + 1 == t[1]</code>（栈顶相遇）；</li>
        <li>栈空条件：<code>t[i] == b[i]</code>（退回各自栈底）。</li>
      </ul>
      <h4>核心操作（Push 先加 top 再存，Pop 先取再减 top）</h4>
    `,
    code: `template <class E>
class SeqStack {
private:
    int top;            // 栈顶指针
    E *elements;        // 栈元素数组
    int maxSize;        // 栈最大容量
    void overflowProcess();        // 溢出处理
public:
    SeqStack(int sz = 10) : top(-1), maxSize(sz)
        { elements = new E[maxSize]; }
    ~SeqStack() { delete[] elements; }
    void Push(E x);
    bool Pop(E &x);
    bool getTop(E &x) const;
    void MakeEmpty() { top = -1; }
    bool IsEmpty() const { return top == -1; }
    bool IsFull()  const { return top == maxSize - 1; }
};

// 栈满时扩容为原来的 2 倍（均摊 O(1)）
template <class E>
void SeqStack<E>::overflowProcess() {
    E *newArray = new E[2 * maxSize];
    for (int i = 0; i <= top; i++) newArray[i] = elements[i];
    maxSize += maxSize;
    delete[] elements;
    elements = newArray;
}

template <class E>
void SeqStack<E>::Push(E x) {
    if (IsFull()) overflowProcess();   // 栈满先扩容
    elements[++top] = x;               // 栈顶指针先加 1，再进栈
}

template <class E>
bool SeqStack<E>::Pop(E &x) {
    if (IsEmpty()) return false;       // 下溢
    x = elements[top--];               // 先取元素，栈顶指针再退 1
    return true;
}

template <class E>
bool SeqStack<E>::getTop(E &x) const {
    if (IsEmpty()) return false;
    x = elements[top];                 // 只读栈顶，不出栈
    return true;
}`,
    complexity: { time: '均摊 O(1)', space: 'O(n)' },
    related: ['ch3-1', 'ch3-3', 'ch3-6'],
  },

  'ch3-3': {
    title: '链式栈',
    content: `
      <h3>3.3 链式栈（链栈）</h3>
      <p>用单链表实现的栈。<b>栈顶在链头</b>：进栈、出栈都在链头进行，避免了顺序栈的栈满问题。</p>
      <h4>特点</h4>
      <ul>
        <li><b>无栈满问题</b>，空间可动态扩充（只要内存允许）；</li>
        <li>插入与删除<b>仅在栈顶（链头）</b>执行，Push/Pop 均 O(1)；</li>
        <li>栈空条件：<code>top == NULL</code>；</li>
        <li>适合<b>多栈操作</b>（多个栈各自一条链，互不牵制）。</li>
      </ul>
      <h4>与顺序栈比较</h4>
      <table>
        <tr><th></th><th>顺序栈</th><th>链式栈</th></tr>
        <tr><td>栈满</td><td>可能上溢（需扩容）</td><td>不存在</td></tr>
        <tr><td>额外开销</td><td>无指针开销</td><td>每结点一个指针域</td></tr>
        <tr><td>多栈共享</td><td>复杂（双栈共享数组）</td><td>自然（各自独立链）</td></tr>
      </table>
      <h4>易错点</h4>
      <ul>
        <li>Push 用 <code>top = new StackNode(x, top)</code> 一句完成"新结点指向原栈顶 + top 前移"；</li>
        <li>Pop 必须<b>暂存被删结点</b>再移动 top，最后 delete，避免内存泄漏/悬空指针。</li>
      </ul>
    `,
    code: `template <class E>
struct StackNode {                 // 栈结点
    E data;
    StackNode<E> *link;
    StackNode(E d = 0, StackNode<E> *next = NULL)
        : data(d), link(next) {}
};

template <class E>
class LinkedStack {
private:
    StackNode<E> *top;             // 栈顶指针（即链头）
public:
    LinkedStack() : top(NULL) {}
    ~LinkedStack() { makeEmpty(); }
    void Push(E x);
    bool Pop(E &x);
    bool getTop(E &x) const;
    bool IsEmpty() const { return top == NULL; }
    void makeEmpty();
};

// 进栈：新结点插入链头
template <class E>
void LinkedStack<E>::Push(E x) {
    top = new StackNode<E>(x, top);   // 新结点 link 指向原栈顶
}

// 出栈：摘下链头结点
template <class E>
bool LinkedStack<E>::Pop(E &x) {
    if (IsEmpty()) return false;
    StackNode<E> *p = top;            // 暂存栈顶结点
    top = top->link;                  // 栈顶指针退到下一结点
    x = p->data;
    delete p;
    return true;
}

template <class E>
bool LinkedStack<E>::getTop(E &x) const {
    if (IsEmpty()) return false;
    x = top->data;
    return true;
}

template <class E>
void LinkedStack<E>::makeEmpty() {    // 逐个释放结点
    StackNode<E> *p;
    while (top != NULL) { p = top; top = top->link; delete p; }
}`,
    complexity: { time: 'O(1)', space: 'O(n)' },
    related: ['ch3-1', 'ch3-2', 'ch2-3'],
  },

  'ch3-4': {
    title: '栈的应用(表达式求值)',
    content: `
      <h3>3.4 栈的应用：表达式求值与括号匹配</h3>
      <h4>表达式的三种表示</h4>
      <table>
        <tr><th>表示</th><th>形式</th><th>例 (A+B)</th></tr>
        <tr><td>中缀 (infix)</td><td>操作数 运算符 操作数</td><td>A+B</td></tr>
        <tr><td>前缀 (prefix)</td><td>运算符 操作数 操作数</td><td>+AB</td></tr>
        <tr><td>后缀 (postfix)</td><td>操作数 操作数 运算符</td><td>AB+</td></tr>
      </table>
      <p>例：中缀 <code>A + B * (C − D) − E / F</code> 的后缀表达式为 <code>A B C D − * + E F / −</code>。<b>后缀表达式中不出现括号，但已隐含加括号的优先次序</b>。</p>
      <h4>后缀表达式求值（一个操作数栈）</h4>
      <p>从左向右扫描：<b>遇操作数压栈；遇运算符弹出两个操作数</b>（注意次序：先弹出的是右操作数 b，后弹出的是左操作数 a，计算 a op b），<b>结果压栈</b>；最后栈顶即结果。</p>
      <p>例：<code>12 6 2 / 0.5 - *</code>：压 12,6,2 → 遇 / 弹 2、6 得 3 压入 → 压 0.5 → 遇 − 弹 0.5、3 得 2.5 → 遇 * 弹 2.5、12 得 <b>30</b>。</p>
      <h4>中缀表达式求值（双栈法）</h4>
      <p>设置<b>运算符栈 optr</b> 与<b>操作数栈 opnd</b>。先把 '='（优先级最低）压入 optr 作栈底，然后从左到右扫描：</p>
      <ol>
        <li>操作数 → 拼数后压入 opnd；</li>
        <li>运算符与 optr 栈顶比较优先级：<b>高于</b>栈顶则入栈；<b>低于</b>栈顶则弹出栈顶运算符和 opnd 的两个操作数计算，结果压回 opnd，再继续比较；</li>
        <li>'(' 直接入栈；遇 ')' 时不断弹栈计算，直到弹出 '(' 消去括号；遇 '=' 时持续弹栈计算至 optr 只剩 '='，结果在 opnd 栈顶。</li>
      </ol>
      <p>运算符优先关系表（数值越大优先级越高，栈内外不同是为了正确处理连续运算与括号）：</p>
      <table>
        <tr><th>运算符</th><th>=</th><th>(</th><th>* /</th><th>+ −</th><th>)</th></tr>
        <tr><td>栈内优先级</td><td>0</td><td>1</td><td>5</td><td>3</td><td>6</td></tr>
        <tr><td>栈外优先级</td><td>0</td><td>6</td><td>4</td><td>2</td><td>1</td></tr>
      </table>
      <h4>中缀 → 后缀（手工方法）</h4>
      <p>先按运算优先次序<b>加全括号</b>，再把每个运算符<b>后移到对应右括号处</b>（就近移动），最后<b>消去所有括号</b>。例：(A+B)*D−E/(F+A*D)+C 全括号后得后缀 <code>A B + D * E F A D * + / - C +</code>。</p>
      <h4>括号匹配检验</h4>
      <p>左括号一律入栈；遇右括号时若栈空或栈顶不是对应左括号则失配；扫描结束后<b>栈必须为空</b>才匹配（否则左括号多余）。</p>
    `,
    code: `// 括号匹配检验：exp[low..high] 为表达式字符序列
bool paren(const char exp[], int low, int high) {
    SeqStack<char> S;
    while (low <= high) {              // 自左向右逐一检查
        switch (exp[low]) {
        case '(': case '[': case '{':
            S.Push(exp[low]);          // 左括号入栈
            break;
        case ')':
            if (S.IsEmpty()) return false;
            { char c; S.Pop(c); if (c != '(') return false; }
            break;
        case ']':
            if (S.IsEmpty()) return false;
            { char c; S.Pop(c); if (c != '[') return false; }
            break;
        case '}':
            if (S.IsEmpty()) return false;
            { char c; S.Pop(c); if (c != '{') return false; }
            break;
        default: break;                // 非括号字符忽略
        }
        low++;
    }
    return S.IsEmpty();                // 栈空才算全部匹配
}`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    related: ['ch3-1', 'ch3-2', 'ch5-4'],
  },

  'ch3-5': {
    title: '队列的定义与ADT',
    content: `
      <h3>3.5 队列 (Queue)</h3>
      <p><b>队列</b>是只允许在一端删除、在另一端插入的线性表：允许<b>删除</b>的一端叫<b>队头 (front)</b>，允许<b>插入</b>的一端叫<b>队尾 (rear)</b>。特性：<b>先进先出 (FIFO)</b>。</p>
      <h4>基本操作（ADT，纯虚函数形式）</h4>
      <pre><code>virtual bool EnQueue(E x) = 0;    // 进队列（队尾）
virtual bool DeQueue(E &amp;x) = 0;   // 出队列（队头）
virtual bool getFront(E &amp;x) = 0;  // 取队头元素
virtual bool IsEmpty() const = 0; // 判队列空
virtual bool IsFull() const = 0;  // 判队列满</code></pre>
      <h4>指针变化规则</h4>
      <ul>
        <li>进队：rear 加 1，新元素存入 rear 处；</li>
        <li>出队：取出 front 处元素，front 加 1；</li>
        <li>队空：rear == front（顺序队列）。</li>
      </ul>
      <h4>假溢出问题（引出循环队列）</h4>
      <p>非循环顺序队列中，出队后 front 前面的空间无法再利用——rear 已到数组末尾但前部仍有空位，此时再进队就"溢出"，称为<b>假溢出</b>。解决办法：把数组视为<b>首尾相接的环形</b>，即循环队列（见 <code>ch3-6</code>）。</p>
      <h4>应用场景</h4>
      <ul>
        <li><b>广度优先搜索 (BFS)</b> 与二叉树<b>层次序遍历</b>；</li>
        <li>操作系统任务调度、缓冲区 (Buffer)、打印机队列；</li>
        <li><b>逐行打印杨辉三角形</b>：第 i 行两端补 0 后相邻两数相加即得第 i+1 行——用队列保存当前行，逐个出队计算 <code>s+t</code> 入队即可生成下一行（课件 YANGHVI 算法）。</li>
      </ul>
    `,
    complexity: { time: 'EnQueue/DeQueue O(1)', space: 'O(n)' },
    related: ['ch3-6', 'ch3-7', 'ch6-5', 'ch3-9'],
  },

  'ch3-6': {
    title: '循环队列',
    content: `
      <h3>3.6 循环队列 (Circular Queue)</h3>
      <p>为解决顺序队列的<b>假溢出</b>，把队列的存放数组当作<b>首尾相接的环表</b>处理：指针加 1 时从 maxSize−1 直接绕回到 0，用<b>取模（余数）运算</b>实现。</p>
      <h4>关键公式（必须熟记）</h4>
      <pre><code>front = (front + 1) % maxSize;   // 队头指针循环前进
rear  = (rear + 1)  % maxSize;   // 队尾指针循环前进
// 判空：front == rear          （初始化 front = rear = 0）
// 判满：(rear + 1) % maxSize == front   （牺牲一个存储单元）
// 队列长度：(rear - front + maxSize) % maxSize</code></pre>
      <h4>为什么牺牲一个单元</h4>
      <p>若不牺牲单元，队空（front==rear）与队满（rear 绕一圈追上 front）条件都会变成 <code>front == rear</code>，无法区分。因此规定"rear 的下一个位置是 front 即队满"，实际最多只能存 <b>maxSize−1</b> 个元素。（另一种方案是增设 size 计数器或标志位。）</p>
      <h4>核心操作</h4>
      <ul>
        <li>入队 <b>先存后移</b>：<code>elements[rear] = x; rear = (rear+1)%maxSize;</code></li>
        <li>出队 <b>先取后移</b>：<code>x = elements[front]; front = (front+1)%maxSize;</code></li>
        <li>front 指向队头元素，rear 指向队尾元素的<b>下一个位置</b>。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>判满是 <code>(rear+1)%maxSize == front</code>，不是 <code>rear+1 == front</code>（必须取模）；</li>
        <li>求长度必须 <code>+maxSize</code> 再取模，防止 rear &lt; front 时出现负数；</li>
        <li>容量为 maxSize 的循环队列最多容纳 <b>maxSize−1</b> 个元素。</li>
      </ul>
    `,
    code: `template <class E>
class SeqQueue {
protected:
    int rear, front;      // 队尾、队头指针
    E *elements;          // 队列存放数组
    int maxSize;
public:
    SeqQueue(int sz = 10) : front(0), rear(0), maxSize(sz)
        { elements = new E[maxSize]; }
    ~SeqQueue() { delete[] elements; }
    void MakeEmpty() { front = rear = 0; }
    bool IsEmpty() const { return front == rear; }
    bool IsFull()  const { return (rear + 1) % maxSize == front; }
    int  getSize() const { return (rear - front + maxSize) % maxSize; }
    bool EnQueue(E x);
    bool DeQueue(E &x);
    bool getFront(E &x) const;
};

template <class E>
bool SeqQueue<E>::EnQueue(E x) {
    if (IsFull()) return false;        // 队满
    elements[rear] = x;                // 先存入
    rear = (rear + 1) % maxSize;       // 尾指针循环加一
    return true;
}

template <class E>
bool SeqQueue<E>::DeQueue(E &x) {
    if (IsEmpty()) return false;       // 队空
    x = elements[front];               // 先取队头
    front = (front + 1) % maxSize;     // 头指针循环加一
    return true;
}

template <class E>
bool SeqQueue<E>::getFront(E &x) const {
    if (IsEmpty()) return false;
    x = elements[front];
    return true;
}`,
    complexity: { time: 'O(1)', space: 'O(n)' },
    related: ['ch3-5', 'ch3-7', 'ch2-4'],
  },

  'ch3-7': {
    title: '链式队列',
    content: `
      <h3>3.7 链式队列</h3>
      <p>用单链表实现的队列：<b>队头在链头，队尾在链尾</b>，设 front、rear 两个指针。</p>
      <h4>特点</h4>
      <ul>
        <li>进队时<b>无队满问题</b>（动态分配结点），但有<b>队空问题</b>；</li>
        <li>队空条件：<code>front == NULL</code>（此时 rear 也应为 NULL）；</li>
        <li>进队在<b>链尾</b>插入（rear->link = 新结点; rear 后移），出队在<b>链头</b>删除——两处都 O(1)。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>进队时要特判"队列原本为空"：此时 <code>front = rear = 新结点</code>，否则 front 悬空；</li>
        <li>出队后若队列变空（front 变 NULL），必须<b>同时把 rear 置空</b>，否则下次进队 rear 悬空；</li>
        <li>出队先保存被删结点再改 front，最后 delete。</li>
      </ul>
      <h4>应用</h4>
      <p>与循环队列相同：BFS、层次遍历、缓冲区；以及课件中的<b>杨辉三角形逐行打印</b>（队列逐元素出队，s+t 入队生成下一行）。</p>
    `,
    code: `template <class E>
struct QueueNode {                 // 队列结点
    E data;
    QueueNode<E> *link;
    QueueNode(E d = 0, QueueNode<E> *next = NULL)
        : data(d), link(next) {}
};

template <class E>
class LinkedQueue {
private:
    QueueNode<E> *front, *rear;    // 队头、队尾指针
public:
    LinkedQueue() : front(NULL), rear(NULL) {}
    ~LinkedQueue() { MakeEmpty(); }
    bool IsEmpty() const { return front == NULL; }
    bool EnQueue(E x);
    bool DeQueue(E &x);
    bool GetFront(E &x) const;
    void MakeEmpty();
};

template <class E>
bool LinkedQueue<E>::EnQueue(E x) {    // 插入到队尾
    QueueNode<E> *p = new QueueNode<E>(x);
    if (front == NULL) { front = rear = p; }   // 原队空
    else { rear->link = p; rear = p; }
    return true;
}

template <class E>
bool LinkedQueue<E>::DeQueue(E &x) {   // 删除队头结点
    if (IsEmpty()) return false;
    QueueNode<E> *p = front;
    x = front->data;
    front = front->link;
    if (front == NULL) rear = NULL;    // 队列变空，rear 同步置空
    delete p;
    return true;
}

template <class E>
bool LinkedQueue<E>::GetFront(E &x) const {
    if (IsEmpty()) return false;
    x = front->data;
    return true;
}

template <class E>
void LinkedQueue<E>::MakeEmpty() {
    QueueNode<E> *p;
    while (front != NULL) { p = front; front = front->link; delete p; }
    rear = NULL;
}`,
    complexity: { time: 'O(1)', space: 'O(n)' },
    related: ['ch3-5', 'ch3-6'],
  },

  'ch3-8': {
    title: '双端队列',
    content: `
      <h3>3.8 双端队列 (Deque, Double-Ended Queue)</h3>
      <p><b>双端队列</b>是限定插入和删除操作在表<b>两端</b>进行的线性表：既可以在队头也可以在队尾插入和删除。可以看作栈与队列的推广——限制它一端操作即得栈，限制一端进一端出即得队列。</p>
      <h4>两种受限变种</h4>
      <table>
        <tr><th>变种</th><th>限制</th></tr>
        <tr><td><b>输入受限的双端队列</b></td><td>只允许一端插入，两端删除</td></tr>
        <tr><td><b>输出受限的双端队列</b></td><td>只允许一端删除，两端插入</td></tr>
      </table>
      <h4>核心操作</h4>
      <pre><code>push_front(x) / pop_front()   // 队头插入 / 删除
push_back(x)  / pop_back()    // 队尾插入 / 删除
front() / back() / empty()    // 取两端元素 / 判空</code></pre>
      <h4>实现方式</h4>
      <ul>
        <li><b>双向循环链表</b>：两端插入删除均 O(1)，最自然的实现；</li>
        <li><b>循环数组</b>：设 front、rear 两端均可伸缩，注意判满条件；</li>
        <li>C++ STL 提供 <code>std::deque</code>（分段连续空间，支持随机访问）。</li>
      </ul>
      <h4>应用</h4>
      <ul>
        <li><b>滑动窗口最大值</b>：窗口内维护一个单调递减的双端队列，队头始终是当前窗口最大值；</li>
        <li>工作窃取 (work stealing) 调度、回溯算法的双向剪枝。</li>
      </ul>
    `,
    complexity: { time: '两端操作 O(1)', space: 'O(n)' },
    related: ['ch3-5', 'ch3-6', 'ch2-5'],
  },

  'ch3-9': {
    title: '优先级队列',
    content: `
      <h3>3.9 优先级队列 (Priority Queue)</h3>
      <p><b>优先级队列</b>是不同于先进先出队列的另一种队列：<b>每次从队列中取出的是具有最高优先权的元素</b>。优先权根据问题而定；出现相同优先级的元素时按 <b>FIFO</b> 处理。</p>
      <h4>引例（课件）</h4>
      <p>五个任务优先权依次为 20、0、40、30、10（数字越小优先权越高），则执行顺序为任务 2、5、1、4、3。应用场景如<b>任务调度</b>：先处理优先级高的任务使效率最大化。</p>
      <h4>数组实现（本章做法）</h4>
      <p>用一个数组按优先权<b>有序</b>存放：</p>
      <ul>
        <li><b>插入 Insert(x)</b>：新元素先放到末尾，再用 <code>adjust()</code> 从后向前比较、把较大者后移，插到正确的有序位置——类似直接插入排序的一趟，最坏 <code>O(n)</code>；</li>
        <li><b>出队 RemoveMin(x)</b>：直接取数组 0 号元素（优先权最小者），其后元素整体前移一位——<code>O(n)</code>；</li>
        <li><b>GetFront</b>：只读 0 号元素，O(1)。</li>
      </ul>
      <p>例：已有 10 20 40 50 70 90，插入 60：先放末尾得 ...90 60，再向前比较使 60 与 90、70 交换前移，最终为 10 20 40 50 60 70 90。</p>
      <h4>堆实现（更优）</h4>
      <p>数组实现的插入与删除都是 O(n)；用<b>堆</b>（见 <code>ch5-8</code>）实现优先级队列，插入与删除堆顶都只需 <code>O(log n)</code>，是优先级队列的标准实现。</p>
      <h4>易错点</h4>
      <ul>
        <li>优先级队列"出队"出的<b>不是最早进入的元素</b>，而是优先权最高（本课件约定数值最小）的元素；</li>
        <li>相同优先级才按 FIFO 次序处理。</li>
      </ul>
    `,
    code: `template <class E>
class PQueue {
private:
    E *pqelements;         // 存放数组（按优先权有序）
    int count;             // 当前元素个数
    int maxPQSize;         // 最大元素个数
    void adjust();         // 插入后调整
public:
    PQueue(int sz = 50) : count(0), maxPQSize(sz)
        { pqelements = new E[maxPQSize]; }
    ~PQueue() { delete[] pqelements; }
    bool Insert(E x);      // 入队
    bool RemoveMin(E &x);  // 出队：优先权最小者出队
    bool GetFront(E &x) const;
    bool IsEmpty() const { return count == 0; }
};

template <class E>
bool PQueue<E>::Insert(E x) {
    if (count == maxPQSize) return false;
    pqelements[count++] = x;   // 先插到末尾
    adjust();                  // 再调整到有序位置
    return true;
}

// 将最后元素暂存，从后向前找插入位置（类似插入排序一趟）
template <class E>
void PQueue<E>::adjust() {
    E temp = pqelements[count - 1];
    int j;
    for (j = count - 2; j >= 0; j--)
        if (pqelements[j] <= temp) break;
        else pqelements[j + 1] = pqelements[j];
    pqelements[j + 1] = temp;
}

template <class E>
bool PQueue<E>::RemoveMin(E &x) {
    if (count == 0) return false;
    x = pqelements[0];                     // 取 0 号（最小优先权）
    for (int i = 1; i < count; i++)        // 其余元素前移填补
        pqelements[i - 1] = pqelements[i];
    count--;
    return true;
}

template <class E>
bool PQueue<E>::GetFront(E &x) const {
    if (count == 0) return false;
    x = pqelements[0];
    return true;
}`,
    complexity: { time: '插入/出队O(n)', space: 'O(n)' },
    related: ['ch3-5', 'ch5-8', 'ch8-8'],
  },

  // === Chapter 4: 串与数组 ===
  'ch4-1': {
    title: '串的定义与ADT',
    content: `
      <h3>4.1 串（字符串 String）的定义</h3>
      <p><b>字符串</b>是 n（n≥0）个字符的<b>有限序列</b>，记作 S = "c₁c₂…cₙ"。其中 S 是<b>串名</b>，引号内是<b>串值</b>，cᵢ 是<b>串中字符</b>，n 是<b>串的长度</b>。例如 S = "Nanjing University"。</p>
      <h4>易混概念（常考）</h4>
      <ul>
        <li><b>空串</b>：长度为 0 的串，写作 ""；</li>
        <li><b>空白串</b>：由一个或多个空格组成的串，如 " " 长度为 1——<b>空串和空白串不同</b>；</li>
        <li><b>子串</b>：串中任意个<b>连续</b>字符组成的子序列；包含子串的串称<b>主串</b>；</li>
        <li>子串在主串中的位置 = 子串<b>首个字符</b>在主串中的位置（课件从 0 计）。例：A="This is a string"，B="is"，B 在 A 中首次出现位置为 2；</li>
        <li><b>空串是任意串的子串，任意串是其自身的子串</b>。</li>
      </ul>
      <h4>AString 类的核心操作</h4>
      <pre><code>int Length() const;                 // 求长度
AString&amp; operator() (int pos, int len); // 求子串
bool operator == (AString&amp; ob);     // 判串相等（strcmp）
AString&amp; operator += (AString&amp; ob); // 串连接
char&amp; operator [] (int i);          // 取第i个字符
int Find(AString&amp; pat, int k);      // 串匹配（模式匹配）</code></pre>
      <h4>取子串的边界处理</h4>
      <p>以串 "infinity"（长度 8）为例：pos=2, len=3 可全部提取得 "fin"；若 pos=5, len=4 超出串尾，则<b>只能取到串尾</b>，需调整 <code>len = curLength − pos</code>（得 "ity"）。</p>
      <h4>串赋值要点</h4>
      <p>重载 <code>=</code> 时须先判断<b>自我赋值</b>（<code>&ob != this</code>），再释放旧空间、重新分配并复制，防止自我赋值导致数据丢失。</p>
    `,
    complexity: null,
    related: ['ch4-2', 'ch4-3'],
  },

  'ch4-2': {
    title: '串的模式匹配(BF)',
    content: `
      <h3>4.2 朴素的模式匹配（B-F 算法）</h3>
      <p><b>模式匹配</b>：在主串中寻找子串（第一个字符）出现的位置。术语：<b>子串称为模式 (Pattern)</b>，<b>主串称为目标 (Target)</b>。例：目标 T="Beijing"，模式 P="jin"，匹配结果为 3。</p>
      <h4>B-F（Brute-Force）算法思想</h4>
      <p>从目标的第 k 个字符起，与模式逐位比较；一旦失配，<b>目标指针回退到本次起点的下一位</b>，模式指针回到 p₀，重新开始下一趟比较，直到匹配成功或目标剩余长度不足。</p>
      <p>例：T="abbaba"，P="aba"：第 1 趟从 i=0 比到 j=2 失配；第 2 趟从 i=1 起首字符即失配；第 3 趟从 i=2 起失配；第 4 趟从 i=3 起完全匹配，返回位置 3。</p>
      <h4>复杂度分析</h4>
      <p>最坏情况：最多比较 <b>n−m+1 趟</b>，每趟都比较到模式尾部（m 次比较），总比较次数达 <b>(n−m+1)×m</b>。多数场合 m ≪ n，故时间复杂度为</p>
      <p class="formula">O(n × m)</p>
      <h4>低效的根源（引出 KMP）</h4>
      <p>每趟失配后<b>目标串的检测指针要回退</b>，前面已比较过的信息全部丢弃。而事实上，失配前"模式前缀与目标已匹配部分"中蕴含<b>前缀/后缀匹配信息</b>，可以复用——这正是 KMP 算法的出发点。</p>
    `,
    code: `// 在当前串（目标）中从第 k 个字符起寻找模式 pat，
// 成功返回首次匹配位置，失败返回 -1
int AString::Find(AString& pat, int k) const {
    int i, j, n = curLength, m = pat.curLength;
    for (i = k; i <= n - m; i++) {          // 逐趟比较
        for (j = 0; j < m; j++)
            if (ch[i+j] != pat.ch[j]) break; // 本次失配
        if (j == m) return i;               // 模式扫描完，成功
    }
    return -1;                              // 匹配失败
}`,
    complexity: { time: 'O(n*m)', space: 'O(1)' },
    related: ['ch4-1', 'ch4-3'],
  },

  'ch4-3': {
    title: 'KMP算法',
    content: `
      <h3>4.3 改进的模式匹配（KMP 算法）</h3>
      <p>KMP 由 <b>D.E.Knuth、J.H.Morris、V.R.Pratt</b> 同时提出，本质是<b>从失败中吸取经验</b>：只要消除每趟失配后<b>目标指针的回溯</b>，就能提高匹配效率。</p>
      <h4>原理</h4>
      <p>设在 pⱼ 处失配，失配前已有 tₛ…tₛ₊ⱼ₋₁ = p₀…pⱼ₋₁。下一趟模式该滑动到哪？取决于模式前 j 个字符中"<b>最长相等前缀与后缀</b>"的长度 k——它<b>仅依赖于模式 P 本身，与目标串无关</b>。于是用一个 <b>next 特征向量</b>记录：pⱼ 失配时，应改由 p 的第 k+1 个字符与目标刚失配的字符继续比较。</p>
      <p class="formula">next(j) = −1（j=0）；= 满足 p₀…pₖ = p_{j−k−1}…pⱼ₋₁ 的最大 k 加 1；= 0（其他）</p>
      <h4>例：P = "abaabcac"</h4>
      <table>
        <tr><th>j</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>
        <tr><th>P</th><td>a</td><td>b</td><td>a</td><td>a</td><td>b</td><td>c</td><td>a</td><td>c</td></tr>
        <tr><th>next[j]</th><td>−1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>2</td><td>0</td><td>1</td></tr>
      </table>
      <h4>匹配处理规则</h4>
      <ul>
        <li>在 <b>j &gt; 0</b> 处失配：目标指针<b>不回溯</b>，模式改由 p_{next(j)} 继续比较；</li>
        <li>在 <b>j = 0</b> 处失配（无可用信息）：目标指针<b>进 1</b>，模式回到 p₀。</li>
      </ul>
      <h4>复杂度</h4>
      <p>目标串指针只进不退，字符比较次数最多 <code>O(lengthT)</code>；求 next 数组本身 <code>O(lengthP)</code>。总时间 <b>O(m+n)</b>。</p>
      <h4>易错点</h4>
      <ul>
        <li>next 数组只与<b>模式串</b>有关，换目标串 next 不变；</li>
        <li>next[0] 约定为 −1（有的教材约定为 0，注意与课件一致）；</li>
        <li>计算 next 时"模式串同时被看作目标串和模式串"，用递推 + 回退 k = next[k]。</li>
      </ul>
    `,
    code: `// KMP 快速匹配：从目标第 k 个字符起寻找模式 pat
// 数组 next[] 存放 pat 的 next[j] 值
int AString::fastFind(AString& pat, int k, int next[]) const {
    int posP = 0, posT = k;           // 模式、目标的扫描指针
    int lengthP = pat.curLength;
    int lengthT = curLength;
    while (posP < lengthP && posT < lengthT)
        if (posP == -1 || pat.ch[posP] == ch[posT])
            { posP++; posT++; }        // 对应字符匹配，双指针进 1
        else posP = next[posP];        // 失配：模式右滑，目标不回溯
    if (posP < lengthP) return -1;     // 匹配失败
    else return posT - lengthP;        // 成功，返回起点下标
}

// 计算 next 特征向量（模式串自己与自己匹配，递推）
void getNext(char *pat, int *next) {
    next[0] = -1;
    int m = strlen(pat);
    for (int j = 1; j < m; j++) {
        int k = next[j - 1];
        while (k != -1 && pat[k] != pat[j - 1])
            k = next[k];               // 回退继续找更短的相等前后缀
        next[j] = k + 1;
    }
}`,
    complexity: { time: 'O(m+n)', space: 'O(m)' },
    related: ['ch4-1', 'ch4-2'],
  },

  'ch4-4': {
    title: '数组的定义与存储',
    content: `
      <h3>4.4 数组的定义与存储</h3>
      <p><b>数组</b>是相同类型数据元素的集合：一维数组的每个元素是一个由<b>下标 (index)</b> 和<b>值 (value)</b> 组成的序对。n 维数组是线性结构的推广，每个元素可有<b>多个直接前驱和多个直接后继</b>，属于<b>非线性结构</b>。</p>
      <h4>一维数组地址计算</h4>
      <p>设首地址为 a，每个元素占 l 个存储单元：<code>LOC(i) = a + i*l</code>。一维数组常被称为<b>向量 (Vector)</b>。</p>
      <h4>二维数组：行优先与列优先</h4>
      <p>二维数组 A[n][m] 存入一维地址空间有两种映射方式（设 LOC(0,0)=a，每元素占 l 单元）：</p>
      <table>
        <tr><th>存放方式</th><th>公式</th><th>说明</th></tr>
        <tr><td><b>行优先</b></td><td class="formula">LOC(j, k) = a + ( j*m + k ) * l</td><td>前 j 行共 j*m 个元素，第 j 行内再有 k 个</td></tr>
        <tr><td><b>列优先</b></td><td class="formula">LOC(j, k) = a + ( k*n + j ) * l</td><td>前 k 列共 k*n 个元素，第 k 列内再有 j 个</td></tr>
      </table>
      <p><b>C++ 是行优先存储</b>。</p>
      <h4>三维与 n 维数组</h4>
      <p>三维数组各维元素个数 m₁, m₂, m₃，按<b>页/行/列</b>存放：</p>
      <p class="formula">LOC(i₁, i₂, i₃) = a + ( i₁*m₂*m₃ + i₂*m₃ + i₃ ) * l</p>
      <p>n 维推广：<code>LOC = a + ( i₁·m₂···mₙ + i₂·m₃···mₙ + ... + iₙ₋₁·mₙ + iₙ ) * l</code>，每一项 = "该维下标 × 后面各维大小的连乘"。</p>
      <h4>静态数组与动态数组</h4>
      <ul>
        <li><b>静态</b>：维数和维界编译时确定，空间不能扩充；</li>
        <li><b>动态</b>：运行时用 new 分配、delete 释放。二维动态分配：</li>
      </ul>
      <pre><code>int **A;  int row = 3, col = 3;
A = new int*[row];          // 先分配 row 个行指针
for (int i = 0; i &lt; row; i++)
    A[i] = new int[col];    // 再为每一行分配空间</code></pre>
    `,
    complexity: null,
    related: ['ch4-5', 'ch4-6'],
  },

  'ch4-5': {
    title: '特殊矩阵压缩存储',
    content: `
      <h3>4.5 特殊矩阵的压缩存储</h3>
      <p><b>特殊矩阵</b>：非零元素（或零元素）的分布<b>有规律</b>的矩阵，典型如对称矩阵、三对角矩阵。利用规律只存必要元素，可节省大量存储。</p>
      <h4>对称矩阵（压缩到一维数组 B）</h4>
      <p>n×n 对称矩阵 aᵢⱼ = aⱼᵢ（0 ≤ i,j ≤ n−1），只需存<b>下三角（含对角线）</b>或上三角，共</p>
      <p class="formula">n + (n−1) + ... + 1 = n(n+1)/2 个元素</p>
      <p><b>下三角存储</b>（按行存 a₀₀, a₁₀, a₁₁, a₂₀, ...）：</p>
      <ul>
        <li>当 <b>i ≥ j</b>：<code>k = i(i+1)/2 + j</code>（前 i 行共 i(i+1)/2 个，本行内第 j 个）；</li>
        <li>当 <b>i &lt; j</b>（上三角，未直接存储）：取对称元素，<code>k = j(j+1)/2 + i</code>；</li>
        <li><b>反查</b>（已知 k 求行列号）：找 i 满足 <code>i(i+1)/2 ≤ k &lt; (i+1)(i+2)/2</code>，则行号 i、列号 <code>j = k − i(i+1)/2</code>。例：k=8 时 6 ≤ 8 &lt; 10，得 i=3、j=2。</li>
      </ul>
      <p><b>上三角存储</b>（按行存 a₀₀, a₀₁, ..., a₀,ₙ₋₁, a₁₁, ...）：当 i ≤ j 时 <code>k = (2n−i−1)·i/2 + j</code>；当 i &gt; j 时取 <code>A[j][i]</code> 的位置 <code>k = (2n−j−1)·j/2 + i</code>。</p>
      <h4>三对角矩阵</h4>
      <p>只有主对角线及其上下相邻两条对角线非零，共 <b>3n−2 个非零元素</b>（aᵢⱼ 满足 |i−j| ≤ 1）。按行存入一维数组 B（a₀₀ 存于 B[0]）：</p>
      <ul>
        <li>正查：<code>k = 2i + j</code>；</li>
        <li>反查：<code>i = ⌊(k+1)/3⌋，j = k − 2i</code>。例：k=8 → i=3, j=2；k=10 → i=3, j=4。</li>
      </ul>
      <h4>应用</h4>
      <ul>
        <li>对称矩阵：机器学习中的<b>协方差矩阵</b>、<b>无向图</b>的邻接关系表示；</li>
        <li>三对角矩阵：求解<b>差分方程、热传导方程、振动方程</b>等物理问题。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch4-4', 'ch4-6'],
  },

  'ch4-6': {
    title: '稀疏矩阵',
    content: `
      <h3>4.6 稀疏矩阵 (Sparse Matrix)</h3>
      <p>设矩阵 A 中有 s 个非零元素，若 s 远小于元素总数，则称 A 为<b>稀疏矩阵</b>。定量描述：</p>
      <p class="formula">稀疏因子 e = s / (m×n)，通常认为 e ≤ 0.05 时为稀疏矩阵</p>
      <p>存储时<b>只存非零元素</b>。每个非零元素由 <b>(行, 列, 值)</b> 唯一确定。</p>
      <h4>一、三元组表示（数组）</h4>
      <p>非零元素<b>按行存放，行号相同时按列号递增</b>，构成三元组表；再辅以行数 Rows、列数 Cols、非零元个数 Terms 即可唯一确定矩阵。</p>
      <h4>转置运算</h4>
      <ul>
        <li><b>普通转置</b>：对三元组表<b>按列号扫描 Cols 次</b>，第 k 次把列号为 k 的项"行列互换"顺次存入结果表。时间 <code>O(Cols × Terms)</code>；当 t 与 m·n 同数量级时退化为 O(m·n²)；</li>
        <li><b>快速转置</b>：只扫描三元组表<b>一遍</b>。借助两个辅助数组——<code>rowSize[col]</b> 统计原矩阵<b>各列</b>非零元个数（= 转置后各行个数），<code>rowStart[col]</b> 由前缀和求出转置后<b>各行起始位置</b>（rowStart[0]=0，rowStart[i]=rowStart[i−1]+rowSize[i−1]），再按位置直接装入。时间 <code>O(Cols + Terms)</code>。</li>
      </ul>
      <h4>二、带行指针数组的二元组表</h4>
      <p>行指针数组第 i 个元素指向第 i 行第一个非零元在二元组表中的位置；二元组只记 (列号, 值)，行内按列号递增。</p>
      <h4>三、正交链表（十字链表）</h4>
      <p>稀疏矩阵表示为<b>行链表与列链表的十字交叉</b>：每个非零元结点同时挂在所在行链和列链上，结点含 head 标志、row、col、value、down、right 域。优点：适应矩阵加、减、乘运算中<b>非零元素的动态变化</b>（插入删除只需改指针）。</p>
      <h4>易错点</h4>
      <ul>
        <li>快速转置中 rowStart 是<b>转置矩阵</b>各行的起始位置，对应原矩阵的<b>列</b>；</li>
        <li>三元组表中元素必须<b>有序</b>（行主序），否则转置结果顺序错乱。</li>
      </ul>
    `,
    code: `template <class E>
struct Triple {                  // 三元组
    int row, col;                // 非零元素行号、列号
    E value;
};

template <class E>
class SparseMatrix {
private:
    int Rows, Cols, Terms;       // 行、列、非零元素数
    Triple<E> *smArray;          // 三元组表
public:
    void FastTranspos(SparseMatrix<E>& B);  // 快速转置
};

// 快速转置：扫描三元组表一遍，O(Cols + Terms)
template <class E>
void SparseMatrix<E>::FastTranspos(SparseMatrix<E>& B) {
    int *rowSize  = new int[Cols];   // 各列（转置后各行）非零元个数
    int *rowStart = new int[Cols];   // 转置后各行起始位置
    B.Rows = Cols;  B.Cols = Rows;  B.Terms = Terms;
    for (int i = 0; i < Cols; i++) rowSize[i] = 0;
    for (int i = 0; i < Terms; i++)
        rowSize[smArray[i].col]++;             // 统计各列非零元个数
    rowStart[0] = 0;
    for (int i = 1; i < Cols; i++)
        rowStart[i] = rowStart[i-1] + rowSize[i-1];
    for (int i = 0; i < Terms; i++) {
        int j = rowStart[smArray[i].col];      // 直接定位
        B.smArray[j].row   = smArray[i].col;   // 行列互换
        B.smArray[j].col   = smArray[i].row;
        B.smArray[j].value = smArray[i].value;
        rowStart[smArray[i].col]++;            // 同一列的下一项顺延
    }
    delete[] rowSize;  delete[] rowStart;
}`,
    complexity: { time: '转置O(Cols*t)，快速转置O(Cols+Terms)', space: 'O(Terms)' },
    related: ['ch4-4', 'ch4-5'],
  },

  'ch4-7': {
    title: '广义表',
    content: `
      <h3>4.7 广义表 (General Lists)</h3>
      <p><b>广义表</b>是 n（n≥0）个表元素组成的有限序列，记作 LS = (a₁, a₂, ..., aₙ)。LS 是<b>表名</b>，n 为<b>表的长度</b>（n=0 为空表）。表元素 aᵢ 可以是：<b>原子</b>（单个数据元素）或<b>子表</b>（本身还是表）。</p>
      <h4>表头与表尾（易错重点）</h4>
      <ul>
        <li><b>表头 head</b>：n&gt;0 时表的<b>第一个元素</b>（可能是原子也可能是子表）；</li>
        <li><b>表尾 tail</b>：除表头外，<b>其余元素组成的表</b>——表尾<b>一定是表</b>（即使只剩一个元素也要加一层括号）；</li>
        <li>空表 A( ) 的 head 和 tail <b>不存在</b>；</li>
        <li>例：B(6,2)：head=6, tail=(2)；C('a',(5,3,'x'))：head='a', tail=((5,3,'x'))；head(((5,3,'x')))=(5,3,'x')，tail(((5,3,'x')))=()。</li>
      </ul>
      <h4>取元素操作序列例题</h4>
      <p>L = ((X,Y,z), a, (u,v,w))，取出原子 u：<code>head( head( tail( tail(L) ) ) )</code>。过程：tail(L)=(a,(u,v,w)) → tail 再取=((u,v,w)) → head 得 (u,v,w) → head 得 u。</p>
      <h4>长度与深度</h4>
      <ul>
        <li><b>长度</b>：最外层包含的<b>元素个数</b>；</li>
        <li><b>深度</b>：括号展开后的<b>最大重数</b>。递归定义：空表深度为 1，原子深度为 0，否则 Depth = 1 + max{各子表深度}；</li>
        <li>例：A( ) 长0深1；B(6,2) 长2深1；C('a',(5,3,'x')) 长2深2；D(B,C,A) 长3深3；E(B,D) 长2深4；F(4,F) 为<b>递归表</b>，深度为 ∞。</li>
        <li>课堂练习：(a,(a,b),d,e,((i,j),k)) 长度 5、深度 3。</li>
      </ul>
      <h4>特性</h4>
      <p>广义表：<b>有次序性、有长度、有深度、可共享、可递归</b>（表可以是自己的子表）。分类：线性表（只含原子）→ 纯表 → 再入/共享表 → 递归表。</p>
      <h4>存储表示（utype 结点）</h4>
      <p>结点结构 <code>utype | info | tlink</code>：utype=0 表头（info 存引用计数 ref）、=1 原子（info 存 value）、=2 子表（info 存指向子表表头的 hlink）；tlink：表头结点指向第一个结点，其余指向<b>同层下一结点</b>。共享表删除时先对表头<b>引用计数 ref 减 1</b>，减到 0 才真正释放。</p>
    `,
    code: `// 求广义表深度（递归）：空表 1，否则 1 + max{子表深度}
template <class T>
int GenList<T>::depth(GenListNode<T> *ls) {
    if (ls->tlink == NULL) return 1;      // 空表，深度为 1
    GenListNode<T> *temp = ls->tlink;
    int m = 0, n;
    while (temp != NULL) {                // 在顶层横扫
        if (temp->utype == 2) {           // 扫描到子表结点
            n = depth(temp->info.hlink);  // 递归求子表深度
            if (m < n) m = n;             // 取最大深度
        }
        temp = temp->tlink;
    }
    return m + 1;                         // 深度 = 最大子表深度 + 1
}

// 广义表的复制（递归）：先复制结点，再递归复制子表与同层后继
template <class T>
GenListNode<T>* GenList<T>::Copy(GenListNode<T> *ls) {
    GenListNode<T> *q = NULL;
    if (ls != NULL) {
        q = new GenListNode<T>;
        q->utype = ls->utype;
        switch (ls->utype) {
        case 0: q->info.ref = ls->info.ref; break;
        case 1: q->info.value = ls->info.value; break;
        case 2: q->info.hlink = Copy(ls->info.hlink); break;
        }
        q->tlink = Copy(ls->tlink);       // 处理同层下一结点
    }
    return q;
}`,
    complexity: { time: '求深度/复制O(结点数)', space: 'O(深度)' },
    related: ['ch4-1', 'ch5-6'],
  },

  // === Chapter 5: 树与二叉树 ===
  'ch5-1': {
    title: '树的定义与术语',
    content: `
      <h3>5.1 树的定义与术语</h3>
      <p><b>树 (Tree)</b> 是 n（n≥0）个结点的<b>有限集合</b>。n=0 时为空树；否则它是唯一一个<b>根结点 r</b> 加上 m（m≥0）棵<b>互不相交</b>的子树 T₁, ..., Tₘ：根只有直接后继没有直接前驱；每棵子树的根有且仅有一个直接前驱（即 r），可有 0 个或多个直接后继。这是<b>递归定义</b>。</p>
      <h4>基本术语</h4>
      <table>
        <tr><th>术语</th><th>定义</th></tr>
        <tr><td>子女 / 双亲</td><td>结点子树的根是该结点的子女；该结点是子女的双亲</td></tr>
        <tr><td>兄弟结点</td><td>同一结点的子女互称兄弟</td></tr>
        <tr><td>度</td><td>结点的子女个数；树的各结点度的<b>最大值</b>称树的度</td></tr>
        <tr><td>叶结点 / 分支结点</td><td>度为 0 的结点（终端结点）/ 度不为 0 的结点</td></tr>
        <tr><td>祖先 / 子孙</td><td>根到该结点路径上的所有结点 / 该结点所有下属结点</td></tr>
        <tr><td>层次</td><td>根为第 1 层，子女的层次 = 双亲层次 + 1</td></tr>
        <tr><td>深度</td><td>离根<b>最远结点的层次</b>即树的深度</td></tr>
        <tr><td>高度</td><td><b>叶结点高度为 1</b>，双亲高度 = 子女高度最大值 + 1；树高 = 根的高度</td></tr>
        <tr><td>有序树 / 无序树</td><td>各子树有次序 / 次序不重要可互换</td></tr>
        <tr><td>森林</td><td>m（m≥0）棵互不相交的树的集合</td></tr>
      </table>
      <h4>易错点</h4>
      <ul>
        <li><b>度与层次</b>：结点的度是子女个数，不是子树高度；</li>
        <li>树的定义中"m 个子树互不相交"——任何两个结点之间<b>有且仅有一条路径</b>；</li>
        <li>n 个结点的树恰有 <b>n−1 条边</b>（每个结点一条指向双亲的边，根除外）。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch5-2', 'ch5-4', 'ch5-6'],
  },

  'ch5-2': {
    title: '二叉树的定义与性质',
    content: `
      <h3>5.2 二叉树</h3>
      <p><b>二叉树 (Binary Tree)</b>是结点的有限集合：它<b>或者为空</b>，或者由一个根结点加上两棵互不相交的、分别称为<b>左子树</b>和<b>右子树</b>的二叉树组成。二叉树是<b>有序树</b>——左右子树次序固定，不能随意颠倒。</p>
      <h4>二叉树的五种形态</h4>
      <p>①空树；②仅有根结点；③根 + 左子树（右空）；④根 + 右子树（左空）；⑤根 + 左右子树均非空。</p>
      <h4>五个重要性质（含推导）</h4>
      <ol>
        <li><b>第 i 层至多有 2^(i−1) 个结点</b>（i≥1）。推导：第 1 层 1 个 = 2⁰，每个结点至多两个孩子，逐层翻倍，归纳可证。</li>
        <li><b>深度为 k 的二叉树最少 k 个、至多 2^k − 1 个结点</b>。最少：每层至少 1 个；最多：由性质 1 求等比级数前 k 项和 2⁰+2¹+...+2^(k−1) = 2^k − 1。</li>
        <li><b>叶结点数 n₀ = n₂ + 1</b>（n₂ 为度 2 结点数）。证明：设 n₁ 为度 1 结点数、n 为总结点数、e 为边数，则 n = n₀+n₁+n₂，且 e = 2n₂+n₁ = n−1，两式联立解得 n₂ = n₀ − 1。∎</li>
        <li><b>具有 n 个结点的完全二叉树深度为 ⌊log₂n⌋ + 1</b>（等价写法 ⌈log₂(n+1)⌉）。推导思路：设深度为 k，则完全二叉树满足 2^(k−1) − 1 &lt; n ≤ 2^k − 1（左端为前 k−1 层满时的结点数，右端为 k 层全满），即 2^(k−1) &lt; n+1 ≤ 2^k，取对数得 k−1 &lt; log₂(n+1) ≤ k，故 k = ⌈log₂(n+1)⌉；再由 log₂n 的整数部分关系即 ⌊log₂n⌋+1。</li>
        <li><b>编号性质</b>：n 个结点的完全二叉树自顶向下、自左向右编号 1..n——若 i&gt;1 则双亲为 <code>⌊i/2⌋</code>；若 2i≤n 则左孩子为 2i；若 2i+1≤n 则右孩子为 2i+1。这是<b>顺序存储的依据</b>。</li>
      </ol>
      <h4>满二叉树与完全二叉树</h4>
      <ul>
        <li><b>满二叉树</b>：每层结点数都达到最大值；</li>
        <li><b>完全二叉树</b>：深度 k 的树中，前 k−1 层结点数都达到最大，第 k 层结点<b>从左向右连续排列</b>（右边可缺）。<b>满二叉树必是完全二叉树，反之不然</b>。</li>
      </ul>
      <h4>课堂思考（叶结点数公式）</h4>
      <p>由 n₀+n₁+n₂ = n、n₀ = n₂+1、n₁∈{0,1} 可得完全二叉树叶子数 <code>n₀ = ⌈n/2⌉</code>。例：n=100 时 n₁=0，n₀=50；n=101 时 n₁=1，n₀ 也为 50。</p>
    `,
    complexity: null,
    related: ['ch5-1', 'ch5-3', 'ch5-4'],
  },

  'ch5-3': {
    title: '二叉树的存储结构',
    content: `
      <h3>5.3 二叉树的存储结构</h3>
      <h4>一、顺序存储（数组）</h4>
      <p>按<b>完全二叉树编号</b>（性质 5）把结点依次放入数组下标 1..n：</p>
      <ul>
        <li><b>完全二叉树</b>：编号连续，空间无浪费，且可由下标直接算出双亲/孩子（⌊i/2⌋、2i、2i+1）——堆就采用这种存储；</li>
        <li><b>一般二叉树</b>：也按完全二叉树编号，缺结点的位置<b>空缺</b>。极端情形——只有右单支的二叉树（编号 1,3,7,15,31）需要 2^k−1 个位置只存 k 个结点，<b>空间浪费严重</b>。</li>
      </ul>
      <h4>二、链式存储（二叉链表）</h4>
      <p>每个结点 3 个域：<code>leftChild | data | rightChild</code>。n 个结点的二叉链表共有 <b>2n 个指针域</b>，其中非空指针（边）为 <b>n−1</b> 个，空指针 <b>n+1</b> 个（这些空指针正是线索化的素材）。</p>
      <h4>三、三叉链表</h4>
      <p>再增加一个<b>指向双亲的指针 parent</b>：<code>leftChild | data | parent | rightChild</code>，使得查找双亲无需从根遍历（后序线索树找后继就需要双亲信息）。</p>
      <h4>静态结构（数组模拟链表）</h4>
      <p>用数组元素的下标代替指针，可把二叉树存成静态结构（root=0）：</p>
      <table>
        <tr><th>下标</th><th>data</th><th>parent</th><th>leftChild</th><th>rightChild</th></tr>
        <tr><td>0</td><td>A</td><td>−1</td><td>1</td><td>−1</td></tr>
        <tr><td>1</td><td>B</td><td>0</td><td>2</td><td>3</td></tr>
        <tr><td>2</td><td>C</td><td>1</td><td>−1</td><td>−1</td></tr>
        <tr><td>3</td><td>D</td><td>1</td><td>4</td><td>5</td></tr>
        <tr><td>4</td><td>E</td><td>3</td><td>−1</td><td>−1</td></tr>
      </table>
      <p>要点：会做<b>二叉树 ⇄ 静态结构</b>的双向转换。</p>
    `,
    code: `template <class T>
struct BinTreeNode {              // 二叉链表结点
    T data;                       // 数据域
    BinTreeNode<T> *leftChild, *rightChild;
    BinTreeNode() { leftChild = NULL; rightChild = NULL; }
    BinTreeNode(T x, BinTreeNode<T> *l = NULL,
                BinTreeNode<T> *r = NULL)
        { data = x; leftChild = l; rightChild = r; }
};

// 递归销毁整棵树（后序：先左右后根）
template <class T>
void destroy(BinTreeNode<T> *& subTree) {
    if (subTree != NULL) {
        destroy(subTree->leftChild);
        destroy(subTree->rightChild);
        delete subTree;
        subTree = NULL;
    }
}`,
    complexity: null,
    related: ['ch5-2', 'ch5-4', 'ch5-5', 'ch5-8'],
  },

  'ch5-4': {
    title: '二叉树的遍历',
    content: `
      <h3>5.4 二叉树的遍历</h3>
      <p><b>遍历</b>：按某种次序访问树中结点，要求<b>每个结点访问一次且仅访问一次</b>。设访问根记 V、遍历左子树记 L、右子树记 R，限定先左后右时有三种次序：</p>
      <table>
        <tr><th>遍历</th><th>次序</th><th>特点 / 应用</th></tr>
        <tr><td><b>前序(Pre-order)</b></td><td>VLR（根→左→右）</td><td>复制树、前缀表达式、按前序建树</td></tr>
        <tr><td><b>中序(In-order)</b></td><td>LVR（左→根→右）</td><td>BST 中序输出有序序列、中缀表达式</td></tr>
        <tr><td><b>后序(Post-order)</b></td><td>LRV（左→右→根）</td><td>释放树（先删子女后删根）、后缀表达式、统计结点数/树高</td></tr>
        <tr><td><b>层次序</b></td><td>自上而下逐层、自左向右</td><td>用<b>队列</b>实现，非递归</td></tr>
      </table>
      <h4>递归实现要点</h4>
      <p>三种递归遍历只是"访问根"语句的位置不同，框架完全一致；时间 O(n)（每结点访问一次），空间 O(h)（递归栈深 = 树高）。</p>
      <h4>非递归遍历（借助栈）</h4>
      <ul>
        <li><b>前序</b>：访问 p 后把右孩子压栈，沿左链下行；左空则弹栈；</li>
        <li><b>中序</b>：沿左链把沿途结点全部进栈，左空后退栈访问，再转右子树；</li>
        <li><b>后序</b>：栈结点需附加 <b>tag 标记</b>——tag=L 表示从左子树返回（还要去右子树），tag=R 表示从右子树返回（此时才能访问根）。</li>
      </ul>
      <h4>由遍历序列还原二叉树（易错重点）</h4>
      <table>
        <tr><th>已知序列</th><th>能否唯一确定二叉树</th></tr>
        <tr><td>前序 + 中序</td><td><b>一定可以</b></td></tr>
        <tr><td>中序 + 后序</td><td><b>一定可以</b></td></tr>
        <tr><td>前序 + 后序</td><td><b>不一定</b>（无法区分左右子树）</td></tr>
      </table>
      <p>方法：前序（或后序）确定根，再到中序中定位根从而划分左右子树，递归进行。例：前序 EBADCFHG + 中序 ABCDEFGH → 根 E，左子树 {A,B,C,D}，右子树 {F,G,H}。</p>
      <h4>遍历的应用</h4>
      <ul>
        <li><b>建树</b>：按<b>扩展前序序列</b>（用特殊符号 @ 表示空结点）递归建树，如 "A B C @ @ D E @ G @ @ F @ @ @"；</li>
        <li><b>统计</b>：结点数 = 1 + Size(左) + Size(右)；树高 = max(左高, 右高) + 1（后序思想）；</li>
        <li><b>表达式树</b>：中序得中缀（需补括号）、前序得前缀、后序得后缀表达式。</li>
      </ul>
    `,
    code: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

// 前序遍历：根-左-右
void preorder(TreeNode* root) {
    if (!root) return;
    visit(root->val);         // 访问根
    preorder(root->left);     // 遍历左子树
    preorder(root->right);    // 遍历右子树
}

// 中序遍历：左-根-右（BST 中序可得有序序列）
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    visit(root->val);
    inorder(root->right);
}

// 后序遍历：左-右-根（可用于释放树）
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    visit(root->val);
}

// 层次序遍历（用队列，非递归）
void levelorder(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        visit(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}

// 中序遍历的非递归算法：沿左链进栈，退栈访问后转右子树
void inorderIter(TreeNode* root) {
    stack<TreeNode*> S;
    TreeNode* p = root;
    do {
        while (p != NULL) { S.push(p); p = p->left; }
        if (!S.empty()) {
            p = S.top(); S.pop();
            visit(p->val);
            p = p->right;
        }
    } while (p != NULL || !S.empty());
}`,
    complexity: { time: 'O(n)', space: 'O(h)' },
    related: ['ch5-2', 'ch5-3', 'ch5-5', 'ch7-4'],
  },

  'ch5-5': {
    title: '线索二叉树',
    content: `
      <h3>5.5 线索二叉树（穿线树，Threaded Binary Tree）</h3>
      <h4>动机</h4>
      <p>遍历可以把二叉树结点排成线性序列，从而每个结点有该次序下的<b>前驱和后继</b>。若每次都靠重新遍历找前驱后继太慢。观察：n 个结点的二叉链表有 <b>2n 个指针域</b>，非空指针（边）只有 <b>n−1</b> 个，还有 <b>n+1 个空指针域</b>没有利用——正好用它们存放前驱/后继线索。</p>
      <h4>结点结构</h4>
      <p>在原结点上增设两个标志 <b>ltag、rtag</b>：</p>
      <ul>
        <li><b>tag = 0</b>：相应指针指向<b>子女</b>；</li>
        <li><b>tag = 1</b>：相应指针是<b>线索</b>——leftChild 指向<b>前驱</b>，rightChild 指向<b>后继</b>。</li>
      </ul>
      <h4>中序线索化算法</h4>
      <p>在中序遍历过程中用指针 <b>pre</b> 记录刚访问过的结点：若当前结点左空，则置左线索指向 pre；若 pre 的右空，则置 pre 的右线索指向当前结点。遍历结束后对<b>最后一个结点</b>做后处理：rightChild = NULL、rtag = 1。</p>
      <h4>在中序线索树中找前驱 / 后继</h4>
      <pre><code>找后继：若 rtag == 1，后继 = current-&gt;rightChild（线索直达）
        否则后继 = 右子树中"中序第一个结点"（沿左链走到最左）
找前驱：若 ltag == 1，前驱 = current-&gt;leftChild
        否则前驱 = 左子树中"中序最后一个结点"（沿右链走到最右）</code></pre>
      <h4>前序 / 后序线索树的差异（易错）</h4>
      <ul>
        <li><b>前序</b>找后继：有左子女（ltag==0）→ leftChild；否则 → rightChild（无论 rtag 是 0 还是 1）；</li>
        <li><b>后序</b>找后继：rtag==1 时用线索即可；<b>若该结点有右子女，则需要知道双亲指针</b>（双亲无右子树时后继即双亲，否则为双亲右子树后序第一个结点）——所以后序线索树常用<b>三叉链表</b>实现。</li>
      </ul>
      <h4>优点与代价</h4>
      <ul>
        <li>一次预处理后，找前驱/后继、遍历均无需栈、无递归；</li>
        <li>代价：结点增加两个标志位；插入/删除结点时要同时维护线索，较麻烦。</li>
      </ul>
    `,
    code: `template <class T>
struct ThreadNode {                 // 线索树结点
    int ltag, rtag;                 // 0:子女指针  1:线索
    ThreadNode<T> *leftChild, *rightChild;
    T data;
    ThreadNode(const T item) : data(item), leftChild(NULL),
        rightChild(NULL), ltag(0), rtag(0) {}
};

// 通过中序遍历对二叉树线索化（pre 记录中序前驱）
template <class T>
void createInThread(ThreadNode<T> *current, ThreadNode<T> *& pre) {
    if (current == NULL) return;
    createInThread(current->leftChild, pre);    // 左子树线索化
    if (current->leftChild == NULL) {           // 建当前结点的前驱线索
        current->leftChild = pre;
        current->ltag = 1;
    }
    if (pre != NULL && pre->rightChild == NULL) {
        pre->rightChild = current;              // 建前驱结点的后继线索
        pre->rtag = 1;
    }
    pre = current;                              // 前驱跟上
    createInThread(current->rightChild, pre);   // 右子树线索化
}`,
    complexity: { time: '线索化O(n)，找前驱后继O(1)/O(h)', space: 'O(n)' },
    related: ['ch5-3', 'ch5-4'],
  },

  'ch5-6': {
    title: '树与森林的转换',
    content: `
      <h3>5.6 树与森林</h3>
      <h4>树的五种存储表示</h4>
      <ol>
        <li><b>广义表表示</b>：树 A(B(E,F), C, D(G)) 直接写成嵌套括号串；</li>
        <li><b>双亲表示</b>：数组存 data + parent 下标（根 parent=−1），<b>找双亲 O(1)</b>、找孩子要扫描全表（并查集即采用它）；</li>
        <li><b>子女链表表示</b>：每个结点的子女组成一个单链表，表头构成一个向量；</li>
        <li><b>子女指针（多重链表）表示</b>：结点设 d 个指针（d=树的度）——结点等长易管理，但空指针多（d 度树 n 个结点空链域 <b>2n+1</b> 个），浪费存储；</li>
        <li><b>子女-兄弟表示</b>（树的二叉树表示）：结点 <code>data | firstChild | nextSibling</code>，firstChild 指第一个子女，nextSibling 指下一兄弟——<b>这是树与二叉树转换的桥梁</b>。</li>
      </ol>
      <h4>树 / 森林 ⇄ 二叉树的转换规则</h4>
      <ul>
        <li><b>树 → 二叉树</b>：左指针连<b>第一个子女</b>，右指针连<b>下一兄弟</b>（"左孩子右兄弟"）；</li>
        <li><b>森林 → 二叉树</b>：根 = 第一棵树的根；其<b>左子树</b> = 第一棵树根的子树森林转换的二叉树；其<b>右子树</b> = 其余树构成的森林转换的二叉树（各棵树沿右链相连）；</li>
        <li><b>二叉树 → 森林</b>：反向拆——根的左子树转成第一棵树的子树森林，根的右子树转成其余树的森林。</li>
      </ul>
      <h4>树 / 森林的遍历与二叉树遍历的对应（重点结论）</h4>
      <table>
        <tr><th>树 / 森林的遍历</th><th>对应二叉树的遍历</th></tr>
        <tr><td>先根（先访问根，再依次先根遍历各子树）</td><td><b>前序遍历</b></td></tr>
        <tr><td>后根（先依次后根遍历各子树，再访问根）</td><td><b>中序遍历</b></td></tr>
        <tr><td>广度优先（层次）遍历</td><td>用队列逐层访问，无对应递归遍历</td></tr>
      </table>
      <p>例：树 A(B(E,F), C, D(G)) 先根遍历 A B E F C D G = 其对应二叉树的前序；后根遍历 E F B C G D A = 对应二叉树的中序。因此树的遍历可<b>借助对应二叉树的遍历算法</b>实现。</p>
    `,
    complexity: null,
    related: ['ch5-1', 'ch5-4', 'ch4-7'],
  },

  'ch5-7': {
    title: '哈夫曼树与编码',
    content: `
      <h3>5.7 哈夫曼树 (Huffman Tree)</h3>
      <h4>基本概念</h4>
      <ul>
        <li><b>路径长度 PL</b>：两结点间路径上的<b>分支数</b>；外部路径长度 EPL = 各叶结点到根的路径长度之和；内部路径长度 IPL = 各非叶结点到根的路径长度之和；PL = EPL + IPL；</li>
        <li><b>扩充二叉树</b>：叶结点（外结点）赋权值 wᵢ、路径长度 lᵢ，仅含度为 2 的内结点与度为 0 的外结点；n 个外结点对应 n−1 个内结点，共 <b>2n−1</b> 个结点；</li>
        <li><b>带权路径长度</b>：</li>
      </ul>
      <p class="formula">WPL = Σ wᵢ × lᵢ</p>
      <p><b>哈夫曼树</b>（最优二叉树）就是 <b>WPL 最小的扩充二叉树</b>；其中权值大的结点离根最近。例：权值 {2,4,5,7} 三种组织方式 WPL 分别为 36、46、<b>35</b>（最小）。</p>
      <h4>构造算法（贪心）</h4>
      <ol>
        <li>n 个权值各构造一棵只有根结点的树，组成森林 F；</li>
        <li>重复直到 F 只剩一棵树：在 F 中选<b>两棵根权值最小</b>的树作为左右子树合并，新根权值 = 两者之和；从 F 删去这两棵，加入新树。</li>
      </ol>
      <p>例：权 {7,5,2,4}：合并 2+4=6 → 合并 5+6=11 → 合并 7+11=18（共 <b>n−1 次合并</b>）。实现时用<b>最小堆</b>存森林：每次 Remove 最小两个、mergeTree、Insert 新树，复杂度 <code>O(n log n)</code>。</p>
      <h4>哈夫曼编码</h4>
      <ul>
        <li>从根到各叶结点的路径：左分支 = 0，右分支 = 1；</li>
        <li>频率高的字符编码短、频率低的编码长；</li>
        <li><b>总编码长度 = WPL</b>；</li>
        <li>是<b>前缀编码</b>：任何字符的编码都不是其他编码的前缀（字符都在叶结点上），<b>解码时不会混淆</b>。</li>
      </ul>
      <h4>课件例：报文 CAST CAST SAT AT A TASA</h4>
      <p>字符频度 W = {C:2, A:7, S:4, T:5}。等长编码（2 位）总长 (2+7+4+5)×2 = <b>36</b>；建哈夫曼树得变长编码 A:0、T:10、C:110、S:111，总长 7×1 + 5×2 + (2+4)×3 = <b>35</b>，更短。</p>
      <h4>易错点</h4>
      <ul>
        <li>哈夫曼树中<b>没有度为 1 的结点</b>（每次都是两两合并）；</li>
        <li>两棵最小权树谁左谁右不唯一，故哈夫曼树形态不唯一，但 <b>WPL 唯一</b>；</li>
        <li>合并顺序必须"每次取当前最小两个"，不能先算总层数。</li>
      </ul>
    `,
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    related: ['ch5-2', 'ch5-8'],
  },

  'ch5-8': {
    title: '堆与优先队列',
    content: `
      <h3>5.8 堆 (Heap) 与优先队列</h3>
      <p><b>堆</b>是用<b>完全二叉树的顺序表示（一维数组）</b>组织的结构，分为：</p>
      <ul>
        <li><b>最小堆</b>：任一结点的值 ≤ 其左右子女的值，即 <code>Kᵢ ≤ K₂ᵢ₊₁ 且 Kᵢ ≤ K₂ᵢ₊₂</code>——堆顶是<b>最小</b>元素；</li>
        <li><b>最大堆</b>：任一结点的值 ≥ 其左右子女的值——堆顶是<b>最大</b>元素。</li>
      </ul>
      <h4>下标计算（数组从 0 开始，共 n 个元素）</h4>
      <pre><code>父结点：⌊(i-1)/2⌋          （i=0 为根，无双亲）
左子女：2i+1               （2i+1 &gt; n-1 时无左子女）
右子女：2i+2               （2i+2 &gt; n-1 时无右子女）</code></pre>
      <h4>筛选法建堆 O(n)（重点推导）</h4>
      <p>从<b>最后一个分支结点</b>（下标 <code>(currentSize−2)/2</code>）开始，自下向上对每个非叶结点执行 <code>siftDown</code>（下滑调整），逐步扩大堆。复杂度分析：设树高 h，第 k 层至多 2^k 个结点，下沉至多 h−k 层，总调整代价为 Σ 2^k·(h−k) ≤ 2^h ≈ n，故建堆为 <b>O(n)</b>（注意：不是 O(n log n)）。</p>
      <p>例：数组 53 17 78 23 45 65 87 09 建最小堆，最终得 <code>09 17 65 23 45 78 87 53</code>。</p>
      <h4>siftDown 与 siftUp</h4>
      <ul>
        <li><b>siftDown(start, m)</b>：从 start 向下比较，让<b>两子女中较小（大）者上浮</b>，空位下移，直至 temp 找到合适位置——用于<b>建堆</b>与<b>删除堆顶后重调</b>；</li>
        <li><b>siftUp(start)</b>：新元素先放到堆尾，再<b>自下向上</b>与双亲比较，双亲大则下移——用于<b>插入</b>。</li>
      </ul>
      <h4>插入与删除</h4>
      <ul>
        <li><b>插入</b>：加到堆<b>最后</b>，siftUp 向上调整——<code>O(log n)</code>。例：堆 09(17,65)(23,45,78,87)(53) 插入 11：11 与父 23 交换、再与 17 交换、与根 09 比较后停止；</li>
        <li><b>删除堆顶</b>：输出根 → 把<b>最后一个元素</b>移到堆顶 → <code>siftDown(0, currentSize−1)</code> 重调——<code>O(log n)</code>。<b>易错点：是用末尾元素补顶，而不是用较矮子树的根顶替</b>。</li>
      </ul>
      <h4>与优先队列的关系</h4>
      <p>堆是<b>优先级队列的标准实现</b>：最小堆支持 RemoveMin O(log n)、Insert O(log n)，优于数组实现的 O(n)（见 <code>ch3-9</code>）。堆还直接用于<b>堆排序</b>（<code>ch8-8</code>）与 <b>Huffman 树构造</b>（<code>ch5-7</code>）。</p>
    `,
    code: `template <class E>
class MinHeap {                    // 最小堆
private:
    E *heap;                       // 堆元素存储数组
    int currentSize, maxHeapSize;
    void siftDown(int start, int m);   // 下滑调整
    void siftUp(int start);            // 上浮调整
public:
    MinHeap(int sz = 100) : currentSize(0), maxHeapSize(sz)
        { heap = new E[maxHeapSize]; }
    MinHeap(E arr[], int n);           // 筛选法建堆
    bool Insert(const E &x);
    bool Remove(E &x);                 // 删除堆顶（最小元素）
    bool IsEmpty() const { return currentSize == 0; }
};

// 筛选法建堆：从最后一个分支结点起逐个 siftDown
template <class E>
MinHeap<E>::MinHeap(E arr[], int n) {
    maxHeapSize = n;  heap = new E[n];
    for (int i = 0; i < n; i++) heap[i] = arr[i];
    currentSize = n;
    int currentPos = (currentSize - 2) / 2;   // 最后分支结点
    while (currentPos >= 0) {
        siftDown(currentPos, currentSize - 1);
        currentPos--;
    }
}

// 下滑调整：小者上浮，空位下移，局部调整为最小堆
template <class E>
void MinHeap<E>::siftDown(int start, int m) {
    int i = start, j = 2 * i + 1;      // j 是 i 的左子女
    E temp = heap[i];
    while (j <= m) {
        if (j < m && heap[j] > heap[j+1]) j++;  // j 指向两子女中的小者
        if (temp <= heap[j]) break;             // 已满足堆序，停止
        else { heap[i] = heap[j]; i = j; j = 2*j + 1; }  // 小者上移
    }
    heap[i] = temp;                    // 暂存元素放回最终位置
}

// 上浮调整：子女小于双亲则双亲下移
template <class E>
void MinHeap<E>::siftUp(int start) {
    int j = start, i = (j - 1) / 2;    // i 是 j 的双亲
    E temp = heap[j];
    while (j > 0) {
        if (heap[i] <= temp) break;    // 双亲更小，停止
        else { heap[j] = heap[i]; j = i; i = (i - 1) / 2; }
    }
    heap[j] = temp;
}

template <class E>
bool MinHeap<E>::Insert(const E &x) {  // 插入：加末尾，向上调
    if (currentSize == maxHeapSize) return false;
    heap[currentSize] = x;
    siftUp(currentSize);
    currentSize++;
    return true;
}

template <class E>
bool MinHeap<E>::Remove(E &x) {        // 删除堆顶：末尾补顶，向下调
    if (currentSize == 0) return false;
    x = heap[0];
    heap[0] = heap[currentSize - 1];
    currentSize--;
    siftDown(0, currentSize - 1);
    return true;
}`,
    complexity: { time: '建堆O(n)，插删O(log n)', space: 'O(n)' },
    related: ['ch3-9', 'ch8-8', 'ch5-7', 'ch5-2'],
  },

  // === Chapter 6: 图 ===
  'ch6-1': {
    title: '图的定义与术语',
    content: `
      <h3>6.1 图的定义与术语</h3>
      <p><b>图 (Graph)</b> 由顶点集合和边集合组成：<code>Graph = (V, E)</code>。V 是顶点的<b>有穷非空</b>集合；E 是顶点间关系的有穷集合——无向图 E 中是<b>无序对</b> (x,y)，有向图 E 中是<b>有序对</b> &lt;x,y&gt;（Path(x,y) 表示从 x 到 y 的单向通路）。</p>
      <h4>基本术语</h4>
      <table>
        <tr><th>术语</th><th>定义</th></tr>
        <tr><td>完全图</td><td>n 个顶点：完全无向图有 <b>n(n−1)/2</b> 条边；完全有向图有 <b>n(n−1)</b> 条弧</td></tr>
        <tr><td>邻接顶点</td><td>(u,v) 是图中一条边，则 u 与 v 互为邻接顶点</td></tr>
        <tr><td>子图</td><td>V' ⊆ V 且 E' ⊆ E，则 G'=(V',E') 是 G 的子图</td></tr>
        <tr><td>权 / 网络</td><td>边附带的数值称权；带权图叫做<b>网络</b></td></tr>
        <tr><td>顶点的度</td><td>与 v 关联的边数 TD(v)；有向图 TD(v) = ID(v) + OD(v)（入度+出度）</td></tr>
        <tr><td>路径 / 路径长度</td><td>顶点序列 v_i,...,v_j 各相邻顶点间均有边；非带权图路径长度 = <b>边数</b>，带权图 = <b>各边权值之和</b></td></tr>
        <tr><td>简单路径 / 回路</td><td>路径上各顶点互不重复 / 第一个与最后一个顶点重合</td></tr>
        <tr><td>连通图 / 连通分量</td><td>（无向图）任意两顶点间都有路径；非连通图的<b>极大连通子图</b>称连通分量</td></tr>
        <tr><td>强连通图 / 强连通分量</td><td>（有向图）每一对顶点 vᵢ、vⱼ 之间<b>双向</b>都有路径；极大强连通子图</td></tr>
        <tr><td>生成树</td><td>连通图的<b>极小连通子图</b>：n 个顶点、<b>n−1 条边</b>；再加一条边必形成回路</td></tr>
      </table>
      <h4>易错点</h4>
      <ul>
        <li>"极大连通子图"的<b>极大</b>指不能再加入顶点，"极小"（生成树）指保持连通的<b>最少边数</b>；</li>
        <li>有向图 v 到 w 有路径 ≠ w 到 v 有路径；强连通要求<b>双向</b>；</li>
        <li>n 个顶点 n−1 条边的子图不一定是生成树（还必须连通且无回路）。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch6-2', 'ch6-4', 'ch6-6'],
  },

  'ch6-2': {
    title: '图的存储(邻接矩阵)',
    content: `
      <h3>6.2 邻接矩阵</h3>
      <p>图的邻接矩阵存储 = <b>顶点表</b>（记录顶点信息）+ <b>邻接矩阵</b>（二维数组，表示顶点间关系）。设图有 n 个顶点：</p>
      <p class="formula">Edge[i][j] = 1 若 &lt;i,j&gt; ∈ E 或 (i,j) ∈ E；否则 0</p>
      <h4>带权图（网络）的邻接矩阵</h4>
      <p class="formula">Edge[i][j] = W(i,j)（i≠j 且有边）；= ∞（i≠j 且无边）；= 0（i == j，对角线）</p>
      <h4>性质</h4>
      <ul>
        <li><b>无向图的邻接矩阵是对称矩阵</b>（(i,j) 与 (j,i) 同时存在）；<b>有向图可能不对称</b>；</li>
        <li>有向图：统计第 <b>i 行</b> 1 的个数 = 顶点 i 的<b>出度</b>；第 <b>j 列</b> 1 的个数 = 顶点 j 的<b>入度</b>；</li>
        <li>无向图：第 i 行（或列）1 的个数 = 顶点 i 的度。</li>
      </ul>
      <h4>优缺点</h4>
      <table>
        <tr><th>优点</th><th>缺点</th></tr>
        <tr><td>判两顶点间是否有边、取边权 O(1)</td><td>空间 <b>O(V²)</b>，与边数无关——<b>不适合稀疏图</b></td></tr>
        <tr><td>容易求顶点的度、判断连通性（矩阵乘方）</td><td>统计某顶点所有邻接点需 O(V)；增删顶点要重构矩阵</td></tr>
      </table>
      <p>因此<b>稠密图用邻接矩阵，稀疏图用邻接表</b>（见 <code>ch6-3</code>）。</p>
    `,
    code: `// 邻接矩阵存储
const int MAXV = 100;
const int maxWeight = 1e9;        // 表示无穷（无边）
int Edge[MAXV][MAXV];             // Edge[i][j]：边(i,j)的信息
int n;                            // 顶点数

// 初始化：对角线为 0，其余为无穷
void init(int n0) {
    n = n0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            Edge[i][j] = (i == j) ? 0 : maxWeight;
}

// 插入边（无向图要写两处；有向图只写一处）
void addEdge(int u, int v, int w) {
    Edge[u][v] = w;
    Edge[v][u] = w;               // 无向图对称
}

// 无向图：顶点 v 的度 = 第 v 行非零非无穷元素个数
int degree(int v) {
    int deg = 0;
    for (int i = 0; i < n; i++)
        if (i != v && Edge[v][i] != maxWeight) deg++;
    return deg;
}

// 取顶点 v 的第一个邻接顶点，找不到返回 -1
int getFirstNeighbor(int v) {
    for (int col = 0; col < n; col++)
        if (Edge[v][col] > 0 && Edge[v][col] < maxWeight)
            return col;
    return -1;
}`,
    complexity: { time: '取边O(1)，求邻接O(V)', space: 'O(V²)' },
    related: ['ch6-1', 'ch6-3', 'ch6-4', 'ch6-5'],
  },

  'ch6-3': {
    title: '图的存储(邻接表)',
    content: `
      <h3>6.3 邻接表</h3>
      <p>邻接表是邻接矩阵的改进形式（<b>节省存储空间</b>）：把邻接矩阵的每一行组织成一个<b>单链表（边链表）</b>。</p>
      <ul>
        <li><b>边结点</b>：<code>dest（边的另一顶点下标）+ cost（权值）+ link（下一条边指针）</code>；</li>
        <li><b>顶点表</b>：每个顶点保存 data 及其边链表头指针 adj。</li>
      </ul>
      <h4>要点</h4>
      <ul>
        <li>空间复杂度 <code>O(V + E)</code>——<b>适合稀疏图</b>；</li>
        <li>无向图中一条边 (vᵢ, vⱼ) 在邻接表里有<b>两个边结点</b>（分别在第 i、j 个顶点的边链表中）；边链表结点数 = 该顶点的<b>度</b>；</li>
        <li>有向图分<b>出边表</b>（邻接表）与<b>入边表</b>（<b>逆邻接表</b>）：出边表结点数 = 出度，入边表结点数 = 入度；求入度需建逆邻接表或扫描全表；</li>
        <li>判断两顶点是否邻接需扫描边链表，最坏 O(V)，不如邻接矩阵 O(1)。</li>
      </ul>
      <table>
        <tr><th></th><th>邻接矩阵</th><th>邻接表</th></tr>
        <tr><td>空间</td><td>O(V²)</td><td>O(V+E)</td></tr>
        <tr><td>判边 (u,v)</td><td>O(1)</td><td>O(度(u))</td></tr>
        <tr><td>找所有邻接点</td><td>O(V)</td><td>O(度(u))</td></tr>
        <tr><td>适用</td><td>稠密图</td><td>稀疏图</td></tr>
      </table>
    `,
    code: `// 邻接表存储（C++ STL 简化版）
const int MAXV = 100;
vector<int> adj[MAXV];        // adj[v] = {u1, u2, ...} 出边表

void addEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);      // 无向图插两条；有向图只插第一条
}

// 带权邻接表：边结点含终点与权值
struct Edge {
    int to, weight;
};
vector<Edge> adjW[MAXV];

void addEdgeW(int u, int v, int w) {
    adjW[u].push_back({v, w});
    adjW[v].push_back({u, w});
}

// 课件版结点结构（链式边表）
// template <class T, class E>
// struct Edge { int dest; E cost; Edge<T,E> *link; };
// template <class T, class E>
// struct Vertex { T data; Edge<T,E> *adj; };   // 顶点表元素`,
    complexity: { time: '找邻接点O(度)', space: 'O(V+E)' },
    related: ['ch6-2', 'ch6-4', 'ch6-5'],
  },

  'ch6-4': {
    title: '深度优先搜索 (DFS)',
    content: `
      <h3>6.4 深度优先搜索 (DFS)</h3>
      <p><b>图的遍历</b>：从某顶点出发沿边访遍图中所有顶点，且每个顶点<b>仅被访问一次</b>。图中可能存在回路，为避免重复访问，需设置<b>辅助数组 visited[]</b>（访问前全初始化为 false，访问后立即置 true）。</p>
      <h4>DFS 思想</h4>
      <ol>
        <li>访问起始顶点 v，再访问 v 的一个未访问邻接点 w₁；</li>
        <li>从 w₁ 出发继续访问其未访问邻接点 w₂……一路深入；</li>
        <li>到达<b>所有邻接点都被访问过的顶点 u</b> 时，<b>退回一步</b>，检查前一顶点是否还有未访问邻接点，有则继续，无则再退回；</li>
        <li>重复直到所有顶点被访问。类似树的<b>前序遍历</b>，特点是<b>递归 + 回退</b>。</li>
      </ol>
      <h4>复杂度</h4>
      <ul>
        <li>邻接表存储：<code>O(V + E)</code>（每顶点、每边各处理一次）；</li>
        <li>邻接矩阵存储：<code>O(V²)</code>（找邻接点要扫一行）；</li>
        <li>空间：visited 数组 + 递归栈 <code>O(V)</code>。</li>
      </ul>
      <h4>连通分量与生成森林</h4>
      <ul>
        <li><b>非连通图</b>时，从某顶点出发只能遍历到它所在的<b>连通分量</b>；需对每个未访问顶点都调用一次 DFS，调用次数 = 连通分量个数；</li>
        <li>遍历过程中经过的边 + 全部顶点构成<b>深度优先生成树</b>；非连通图各分量的生成树组成<b>生成森林</b>；</li>
        <li>应用：求连通分量、拓扑排序、判环、求割点等。</li>
      </ul>
    `,
    code: `bool visited[MAXV];
vector<int> adj[MAXV];

// 递归 DFS：从顶点 v 出发
void DFS(int v) {
    visited[v] = true;
    visit(v);                       // 访问顶点 v
    for (int u : adj[v])            // 依次考察邻接点
        if (!visited[u]) DFS(u);    // 未访问则递归深入
}

// 非连通图求所有连通分量：对每个未访问顶点调一次 DFS
void Components(int n) {
    for (int i = 0; i < n; i++) visited[i] = false;
    for (int i = 0; i < n; i++)
        if (!visited[i]) {
            DFS(i);
            OutputNewComponent();   // 输出一个连通分量
        }
}

// 非递归版本（用栈模拟回退）
void DFS_iterative(int start) {
    stack<int> s;
    s.push(start);
    visited[start] = true;
    while (!s.empty()) {
        int v = s.top(); s.pop();
        visit(v);
        for (int u : adj[v])
            if (!visited[u]) { visited[u] = true; s.push(u); }
    }
}`,
    complexity: { time: 'O(V+E)（邻接表）', space: 'O(V)' },
    related: ['ch6-5', 'ch6-2', 'ch6-3', 'ch6-8'],
  },

  'ch6-5': {
    title: '广度优先搜索 (BFS)',
    content: `
      <h3>6.5 广度优先搜索 (BFS)</h3>
      <h4>BFS 思想</h4>
      <ol>
        <li>访问起始顶点 v；</li>
        <li>依次访问 v 的所有<b>未被访问的邻接点</b> w₁, w₂, ..., w_t；</li>
        <li>再按 w₁, w₂, ... 的顺序访问它们的所有未访问邻接点……</li>
        <li>直到所有顶点被访问。类似树的<b>层次序遍历</b>。</li>
      </ol>
      <h4>与 DFS 的关键区别</h4>
      <ul>
        <li>BFS 是<b>分层的搜索过程</b>，每向前一步访问一批顶点；</li>
        <li>BFS <b>没有回退</b>，因此<b>不是递归过程</b>——用<b>队列</b>记忆"正在访问的这一层"，逐层向下一层推进；</li>
        <li>DFS 深入到底再回退（递归），BFS 逐层扩散（队列）。</li>
      </ul>
      <h4>复杂度</h4>
      <ul>
        <li>邻接表：<code>O(V + E)</code>；邻接矩阵：<code>O(V²)</code>；空间 O(V)（队列 + visited）。</li>
      </ul>
      <h4>重要应用（易考）</h4>
      <ul>
        <li><b>无权图的单源最短路径</b>：BFS 首次到达某顶点时经过的边数即源点到它的最短距离（各边权值相同时）；</li>
        <li>求连通分量（与 DFS 等价）、广度优先生成树；</li>
        <li>关键：顶点<b>入队时立即置 visited</b>（而不是出队时才置），否则同一顶点可能重复入队。</li>
      </ul>
    `,
    code: `void BFS(int start) {
    queue<int> q;
    visited[start] = true;          // 入队时立即标记
    q.push(start);
    while (!q.empty()) {
        int v = q.front(); q.pop(); // 出队队头
        visit(v);
        for (int u : adj[v]) {      // 依次考察邻接点
            if (!visited[u]) {
                visited[u] = true;  // 标记后入队
                q.push(u);
            }
        }
    }
}`,
    complexity: { time: 'O(V+E)（邻接表）', space: 'O(V)' },
    related: ['ch6-4', 'ch3-5', 'ch6-2', 'ch6-3'],
  },

  'ch6-6': {
    title: '最小生成树(Kruskal/Prim)',
    content: `
      <h3>6.6 最小生成树 (Minimum Cost Spanning Tree)</h3>
      <p>问题背景：n 个城市间架设通信线路，边权为成本，求总成本最小的连通方案。生成树有 n 个顶点、n−1 条边；不同遍历方法/出发点可得到<b>不同</b>生成树。</p>
      <h4>构造最小生成树的三条准则</h4>
      <ol>
        <li>必须<b>使用且仅使用</b>网络中的 n−1 条边联结 n 个顶点；</li>
        <li><b>不能使用产生回路的边</b>；</li>
        <li>各边<b>权值总和最小</b>。</li>
      </ol>
      <h4>Kruskal 算法（归并边，适合<b>稀疏</b>图）</h4>
      <p>初始 T 只有 n 个顶点、无边（每个顶点自成一个连通分量）；反复从 E 中取<b>权值最小的边</b>：若该边两端点落在<b>不同连通分量</b>上则加入 T（用<b>并查集</b>判断与合并，见 <code>ch7-8</code>），否则舍去；直到选出 n−1 条边。</p>
      <ul>
        <li>实现：<b>最小堆</b>存所有边（取最小 O(log e)）+ <b>并查集</b>（判连通）；</li>
        <li>复杂度 <code>O(e·log e)</code>；</li>
        <li>例（7 顶点图）：依次选中 (0,5,10)、(2,3,12)、(1,6,14)、(1,2,16)，舍弃 (3,6,18)（成环），选中 (3,4,22)，舍弃 (4,6,24)，选中 (4,5,25)——完成。</li>
      </ul>
      <h4>Prim 算法（归并顶点，适合<b>稠密</b>图）</h4>
      <p>从某顶点 u₀ 出发，把 U={u₀} 视为已在生成树中的顶点集合；每步从"<b>一端在 U 中、另一端不在 U 中</b>"的边里选<b>权值最小</b>的边 (u,v)，把 v 并入 U；直到 U 含全部顶点。朴素实现 <code>O(V²)</code>，用最小堆可到 <code>O(e·log V)</code>。</p>
      <p>例（同一 7 顶点图，从 0 出发）：依次选中边 (0,5,10)、(5,4,25)、(4,3,22)、(3,2,12)、(2,1,16)、(1,6,14)。</p>
      <h4>易错点</h4>
      <ul>
        <li><b>各边权值互不相同时 MST 唯一；有相同权值时 MST 可能不唯一</b>（但总权值相同）；</li>
        <li>Kruskal 逐条"挑边"（全局排序思想），Prim 逐点"扩张"（局部最优）。</li>
      </ul>
    `,
    code: `// Kruskal：最小堆 + 并查集
struct MSTEdgeNode {       // 树边结点
    int tail, head;        // 两个顶点位置
    int cost;              // 权值
};
bool operator<(const MSTEdgeNode& a, const MSTEdgeNode& b)
    { return a.cost < b.cost; }

int parent[MAXV];          // 并查集（见 ch7-8）

int Find(int x) { return parent[x] < 0 ? x : parent[x] = Find(parent[x]); }

void Kruskal(int n, vector<MSTEdgeNode>& E, vector<MSTEdgeNode>& MST) {
    for (int i = 0; i < n; i++) parent[i] = -1;
    priority_queue<MSTEdgeNode> H(E.begin(), E.end()); // 最小堆
    int count = 1;                        // 已选边数 + 1
    while (count < n && !H.empty()) {
        MSTEdgeNode ed = H.top(); H.pop();
        int u = Find(ed.tail), v = Find(ed.head);
        if (u != v) {                     // 不在同一连通分量
            parent[u] += parent[v]; parent[v] = u;   // Union
            MST.push_back(ed);            // 加入最小生成树
            count++;
        }                                 // u == v：舍去（会成环）
    }
}`,
    complexity: { time: 'Kruskal O(e·log e)，Prim O(V²)', space: 'O(V+E)' },
    related: ['ch6-2', 'ch6-3', 'ch7-8'],
  },

  'ch6-7': {
    title: '最短路径 (Dijkstra/Floyd)',
    content: `
      <h3>6.7 最短路径</h3>
      <p>问题：从<b>源点</b>到<b>终点</b>的路径可能有多条，求各边<b>权值之和</b>最小的路径。</p>
      <h4>Dijkstra 算法（单源最短路径，权值非负）</h4>
      <p><b>贪心策略：按路径长度递增的次序</b>逐步产生最短路径——先求最短的一条，再参照它求次短的……</p>
      <ol>
        <li>引入辅助数组 <code>dist[i]</code>：当前找到的从源点 v₀ 到 vᵢ 的最短路径长度；初始：有边取边权，无边取 ∞；集合 S = {v₀}；</li>
        <li>取 V−S 中 <code>dist</code> 最小的顶点 k，将 k 并入 S（可证明：下一条最短路径的中间点必都在 S 中）；</li>
        <li><b>松弛</b>：对每个 i ∈ V−S，<code>dist[i] = min(dist[i], dist[k] + Edge[k][i])</code>，同时更新 path[i]=k；</li>
        <li>重复 ②③ 直到 S = V。</li>
      </ol>
      <ul>
        <li>复杂度：朴素实现 <code>O(V²)</code>；优先队列优化 <code>O((V+E)log V)</code>；</li>
        <li><b>只适用于权值非负的图</b>（负权边会破坏贪心前提）；</li>
        <li><b>读路径</b>：path[i] 存 i 的前驱，从终点回溯到源点再反转。例：path[4]=2, path[2]=3, path[3]=0 → 路径 0, 3, 2, 4。</li>
      </ul>
      <h4>Floyd 算法（所有顶点对之间的最短路径）</h4>
      <p><b>动态规划</b>：定义方阵序列 A⁽⁻¹⁾, A⁽⁰⁾, ..., A⁽ⁿ⁻¹⁾，A⁽ᵏ⁾[i][j] 表示 vᵢ 到 vⱼ、<b>中间顶点序号不大于 k</b> 的最短路径长度：</p>
      <p class="formula">A⁽ᵏ⁾[i][j] = min{ A⁽ᵏ⁻¹⁾[i][j], A⁽ᵏ⁻¹⁾[i][k] + A⁽ᵏ⁻¹⁾[k][j] }</p>
      <ul>
        <li>三重循环（k 在最外层，且 k 的循环必须在最外），复杂度 <code>O(V³)</code>，空间 O(V²)；</li>
        <li><b>允许负权边，但不允许负权回路</b>；</li>
        <li>path[i][j] 记录 j 的前驱，可递归读出完整路径；带权无向图可视为"有往返二重边的有向图"同样适用。</li>
      </ul>
    `,
    code: `const int INF = 1e9;
int dist[MAXV];
bool S[MAXV];               // 已求得最短路径的顶点集合

// Dijkstra：求源点 src 到其余各顶点的最短路径
void dijkstra(int src, int n) {
    fill(dist, dist + n, INF);
    fill(S, S + n, false);
    dist[src] = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;                       // 选不在 S 中 dist 最小者
        for (int j = 0; j < n; j++)
            if (!S[j] && (u == -1 || dist[j] < dist[u])) u = j;
        if (dist[u] == INF) break;
        S[u] = true;
        for (int k = 0; k < n; k++)       // 松弛 u 的所有邻接边
            if (!S[k] && Edge[u][k] < INF
                && dist[u] + Edge[u][k] < dist[k])
                dist[k] = dist[u] + Edge[u][k];
    }
}

// Floyd：所有顶点对之间的最短路径
void floyd(int n) {
    for (int k = 0; k < n; k++)           // 中间顶点 k 必须在最外层
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (A[i][k] + A[k][j] < A[i][j]) {
                    A[i][j] = A[i][k] + A[k][j];
                    path[i][j] = path[k][j];   // 记录前驱，便于读路径
                }
}`,
    complexity: { time: 'Dijkstra O(V²)，Floyd O(V³)', space: 'O(V²)' },
    related: ['ch6-2', 'ch6-6', 'ch10-1'],
  },

  'ch6-8': {
    title: '拓扑排序',
    content: `
      <h3>6.8 拓扑排序（AOV 网络与活动排序）</h3>
      <h4>AOV 网络</h4>
      <p>用<b>有向图</b>表示一个工程：<b>顶点表示活动 (Activity On Vertices)</b>，有向边 &lt;Vᵢ, Vⱼ&gt; 表示活动 Vᵢ 必须先于 Vⱼ 进行。<b>AOV 网络中不能出现有向回路（有向环）</b>，否则某活动以自己为先决条件，工程不可行。</p>
      <h4>拓扑排序的定义</h4>
      <p>把 AOV 网络的各顶点（活动）排成一个<b>线性有序序列</b>，使网络中所有应存在的前驱-后继关系都得到满足——这样的序列叫<b>拓扑有序序列</b>，构造运算叫<b>拓扑排序</b>。</p>
      <ul>
        <li>能排出全部顶点的拓扑序列 ⟺ 网络中<b>无有向环</b>（拓扑排序也是<b>检测有向环</b>的方法）；</li>
        <li>拓扑序列<b>不唯一</b>（原本无先后关系的顶点可任意排列）。</li>
      </ul>
      <h4>算法步骤</h4>
      <ol>
        <li>在 AOV 网络中选一个<b>没有直接前驱的顶点（入度为 0）</b>并输出；</li>
        <li>从图中<b>删去该顶点及其所有出边</b>（其邻接点入度减 1）；</li>
        <li>重复 ①②，直到全部顶点输出（完成）或<b>还有顶点但入度都不为 0</b>——此时网络中必存在<b>有向环</b>。</li>
      </ol>
      <h4>实现（入度数组 + 栈）</h4>
      <ul>
        <li>邻接表存储时增设数组 <code>count[]</code> 记录各顶点<b>入度</b>（输入边 &lt;j,k&gt; 时 count[k]++）；</li>
        <li><b>入度为 0 的顶点进栈</b>；每输出一个顶点，把它出边终点的入度减 1，减到 0 就进栈；</li>
        <li>节省空间的技巧：直接复用 count[] 数组当栈（<code>count[i] = top; top = i;</code> 进栈，<code>j = top; top = count[top];</code> 退栈）；</li>
        <li>若输出顶点个数 &lt; 网络顶点个数 → <b>报告有回路</b>。</li>
      </ul>
      <p>复杂度：建栈 O(n)，每个顶点进出栈各一次、每条边处理一次，总计 <code>O(n + e)</code>。</p>
      <h4>相关概念</h4>
      <p>拓扑排序要求的是<b>偏序关系</b>（部分元素可比）到<b>全序关系</b>（任意两元素可比）的构造。与 AOV 相对，<b>AOE 网络</b>用边表示活动（边权=活动持续时间），用于求<b>关键路径</b>：Ve 正向取 max、Vl 反向取 min，l[k]==e[k] 的活动为关键活动，关键路径 = 源点到汇点的<b>最长</b>路径。</p>
    `,
    code: `// 拓扑排序：count[] 兼作入度数组与入度为零顶点的栈
void TopologicalSort(int n, vector<int> adj[], int count[]) {
    int top = -1;                          // 栈顶指针
    for (int i = 0; i < n; i++)            // 入度为零的顶点进栈
        if (count[i] == 0) { count[i] = top; top = i; }
    for (int i = 0; i < n; i++) {          // 期望输出 n 个顶点
        if (top == -1) {                   // 中途栈空：有回路
            cout << "网络中有回路！" << endl;
            return;
        }
        int v = top;  top = count[top];    // 退栈并输出
        cout << v << " ";
        for (int w : adj[v]) {             // 扫描 v 的出边表
            if (--count[w] == 0) {         // 邻接点入度减一
                count[w] = top; top = w;   // 减至零则进栈
            }
        }
    }
}`,
    complexity: { time: 'O(n+e)', space: 'O(n)' },
    related: ['ch6-4', 'ch6-2', 'ch6-3'],
  },

  // === Chapter 7: 查找 ===
  'ch7-1': {
    title: '查找的基本概念',
    content: `
      <h3>7.1 查找（搜索）的基本概念</h3>
      <ul>
        <li><b>搜索</b>：在数据集合中寻找满足某种条件的数据对象；</li>
        <li><b>搜索成功</b>：找到对象，报告其在结构中的位置；<b>搜索失败</b>：给出失败标志等信息；</li>
        <li><b>关键码 (key)</b>：对象中能<b>唯一标识</b>该对象的属性；基于关键码的搜索结果是唯一的；</li>
        <li><b>搜索结构</b>：用于搜索的数据集合（同一类型对象的集合）。</li>
      </ul>
      <h4>静态搜索表与动态搜索表</h4>
      <table>
        <tr><th>环境</th><th>特点</th><th>结构</th></tr>
        <tr><td>静态环境</td><td>插入删除前后搜索结构<b>不改变</b></td><td>静态搜索表（顺序表、有序表、散列表）</td></tr>
        <tr><td>动态环境</td><td>为保持搜索效率，结构在插删后<b>自动调整</b></td><td>动态搜索表（BST、AVL、B 树）</td></tr>
      </table>
      <h4>平均搜索长度 ASL（衡量标准）</h4>
      <p>搜索过程中<b>关键码的平均比较次数</b>：</p>
      <p class="formula">ASL_succ = Σ pᵢ × cᵢ　（Σpᵢ = 1）</p>
      <p>其中 pᵢ 是搜索第 i 个元素的概率，cᵢ 是所需比较次数。等概率下顺序搜索 ASL_succ = (n+1)/2；<b>搜索失败</b>的情形可用<b>判定树</b>分析（成功停在内结点，失败停在外结点）。</p>
      <h4>各搜索方法对比（速查）</h4>
      <table>
        <tr><th>方法</th><th>结构</th><th>ASL（成功）</th><th>类型</th></tr>
        <tr><td>顺序搜索</td><td>无序/有序表</td><td>(n+1)/2</td><td>静态</td></tr>
        <tr><td>折半搜索</td><td>有序顺序表</td><td>≈ log₂(n+1) − 1</td><td>静态</td></tr>
        <tr><td>BST 搜索</td><td>二叉搜索树</td><td>平均 O(log n)，最坏 O(n)</td><td>动态</td></tr>
        <tr><td>AVL 搜索</td><td>平衡 BST</td><td>O(log n)（h ≤ 1.44·log₂(n+2)）</td><td>动态</td></tr>
        <tr><td>散列搜索</td><td>散列表</td><td>与装填因子 α 有关，近似 O(1)</td><td>静态/动态</td></tr>
      </table>
    `,
    complexity: null,
    related: ['ch7-2', 'ch7-3', 'ch7-7'],
  },

  'ch7-2': {
    title: '顺序查找',
    content: `
      <h3>7.2 顺序搜索 (Sequential Search)</h3>
      <p>从表的一端开始，顺序用各元素关键码与给定值 x 比较：相等则成功并返回位置；全表检测完仍未找到则失败。适用于<b>顺序表和链表</b>，无论有序无序。</p>
      <h4>监视哨（哨兵）技巧</h4>
      <p>把待查值 x 预先存入表尾"监视哨"位置（如 <code>Element[CurrentSize].key = x</code>），搜索循环就<b>不必每次判断是否越界</b>——x 必然被监视哨拦住，省去一次比较判断：</p>
      <pre><code>int SeqSearch(const K x) {
    Element[CurrentSize].key = x;    // 设置监视哨
    int i = 0;
    while (Element[i].key != x) i++; // 从前向后顺序搜索
    return i + 1;   // 成功返回序号；失败返回 CurrentSize+1
}</code></pre>
      <h4>平均搜索长度</h4>
      <ul>
        <li>等概率下<b>成功</b>：cᵢ = i+1，<code>ASL_succ = (1/n)Σ(i+1) = (n+1)/2</code>；</li>
        <li><b>失败</b>：每个位置都要比较到监视哨，<code>ASL_unsucc = n + 1</code>；</li>
        <li>复杂度 <code>O(n)</code>。</li>
      </ul>
      <h4>优化思路</h4>
      <ul>
        <li>若各元素搜索概率不同，<b>按概率从高到低排列表中元素</b>可降低 ASL；</li>
        <li><b>有序顺序表</b>上失败时可提前终止（遇到更大关键码即可断定失败），但成功 ASL 不变；要根本提速需用<b>折半搜索</b>（<code>ch7-3</code>）；</li>
        <li>也可写递归版本：每层向待查元素逼近一个位置，递归深度 = 元素位置 i。</li>
      </ul>
    `,
    code: `// 顺序搜索的递归版本：在 Element[loc-1..] 中搜索 x
template <class E, class K>
int dataList<E, K>::SeqSearch(const K x, int loc) const {
    if (loc > CurrentSize) return 0;               // 搜索失败
    else if (Element[loc-1].key == x) return loc;  // 搜索成功
    else return SeqSearch(x, loc + 1);             // 递归搜索
}`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    related: ['ch7-1', 'ch7-3', 'ch2-2'],
  },

  'ch7-3': {
    title: '折半查找 (二分查找)',
    content: `
      <h3>7.3 折半搜索（Binary Search）</h3>
      <p>对<b>有序</b>顺序表：先取搜索区间正中元素 mid 与给定值 x 比较——相等则成功；x 小则缩到<b>前半区</b>，x 大则缩到<b>后半区</b>，区间缩小到空仍未找到则失败。</p>
      <h4>前提条件（易错）</h4>
      <ul>
        <li>关键字必须<b>有序</b>；</li>
        <li>必须支持<b>随机访问</b>——只适用于<b>顺序存储</b>，链表不行。</li>
      </ul>
      <h4>性能分析（判定树）</h4>
      <p>描述折半搜索过程的二叉树称<b>判定树</b>：成功停在内结点，失败停在外结点。若 n = 2^h − 1，判定树是高 h 的<b>满二叉树</b>，第 i 层结点比较 i 次：</p>
      <p class="formula">ASL_succ = ((n+1)·log₂(n+1) − n) / n ≈ log₂(n+1) − 1，即 O(log₂n)</p>
      <p>例：有序表 (10,20,30,40,50,60) 的判定树：ASL_succ = (1+2×2+3×3)/6 = 14/6；ASL_unsucc = 20/7。搜索长度练习：从 {12,18,30,43,56,78,82,95} 中折半搜索 56 需比较 <b>3 次</b>（43&lt;56 → 78&gt;56 → 56 命中）。</p>
      <h4>易错点</h4>
      <ul>
        <li><code>mid = low + (high − low)/2</code> 可防止 (low+high) 溢出；</li>
        <li>循环条件是 <code>low &lt;= high</code>（带等号），否则漏判区间仅剩一个元素的情形；</li>
        <li>折半搜索<b>最坏与平均都是 O(log n)</b>，但只对静态有序表合适；频繁插删的表维护有序代价高，应改用 BST/AVL。</li>
      </ul>
    `,
    code: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;  // 防溢出写法
        if (arr[mid] == target)
            return mid;         // 找到
        else if (arr[mid] < target)
            low = mid + 1;      // 在右半部分
        else
            high = mid - 1;     // 在左半部分
    }
    return -1;  // 未找到
}

// 折半搜索的递归版本（课件形式：失败返回 0）
template <class E, class K>
int SortedList<E, K>::BinarySearch(K k1, int low, int high) const {
    int mid = 0;
    if (low <= high) {
        mid = (low + high) / 2;
        if (data[mid-1] < k1) mid = BinarySearch(k1, mid + 1, high);
        else if (data[mid-1] > k1) mid = BinarySearch(k1, low, mid - 1);
    }
    return mid;                 // low > high 时 mid 保持 0（失败）
}`,
    complexity: { time: 'O(log n)', space: 'O(1)' },
    related: ['ch7-1', 'ch7-2', 'ch7-4', 'ch9-3'],
  },

  'ch7-4': {
    title: '二叉排序树 (BST)',
    content: `
      <h3>7.4 二叉搜索树（二叉排序树，BST）</h3>
      <p><b>定义（递归）</b>：二叉搜索树或者为空树，或者满足：每个结点有关键码且各结点关键码<b>互不相同</b>；<b>左子树（非空）上所有结点的关键码都小于根</b>；<b>右子树（非空）上所有结点的关键码都大于根</b>；左右子树也是二叉搜索树。</p>
      <h4>重要性质</h4>
      <ul>
        <li><b>中序遍历 BST 得到关键码从小到大的有序序列</b>——故又称二叉排序树；</li>
        <li>易错：从根到某叶的路径上，"路径左边结点的关键码不一定小于路径上结点的关键码"（祖先的右子树里的结点可能在路径左侧）；</li>
        <li>搜索过程：从根出发沿某分支<b>逐层向下比较判等</b>；成功停在某个结点，失败停在某个<b>空子树</b>；设树高 h，最多比较 <b>h 次</b>。</li>
      </ul>
      <h4>插入</h4>
      <p>先搜索：已存在则<b>不再插入</b>；搜索失败时<b>把新结点作为叶结点插到搜索停止处</b>。建树就是依次插入（例：输入 {53,78,65,17,87,09,81,15}，53 为根……）。注意插入函数要用<b>引用型指针参数 (*&)</b> 才能把新结点真正挂到树上。</p>
      <h4>删除（四种情况，易错重点）</h4>
      <ol>
        <li><b>叶结点</b>：双亲指向它的指针置 NULL，释放即可；</li>
        <li><b>右子树为空</b>：用<b>左子女</b>顶替其位置；</li>
        <li><b>左子树为空</b>：用<b>右子女</b>顶替其位置（子女的子树一起上移）；</li>
        <li><b>左右子树均非空</b>：在<b>右子树中找中序下第一个结点（关键码最小者）</b>，用它的值填补被删结点，再转去删除那个填补结点（它至多只有右子女，落入情况 2）。（也可以对称地用左子树中序最后一个结点。）</li>
      </ol>
      <p>删除必须保证：断开的链重新接好、BST 性质不破坏、<b>树高不增加</b>。</p>
      <h4>性能</h4>
      <ul>
        <li>平均（随机插入序列）：<code>O(log n)</code>；</li>
        <li><b>最坏</b>：按有序序列插入退化为<b>单支链</b>，搜索 <code>O(n)</code>——这正是引入 AVL 树（<code>ch7-5</code>）的原因。</li>
      </ul>
    `,
    code: `struct BSTNode {
    int key;
    BSTNode *left, *right;
    BSTNode(int k) : key(k), left(NULL), right(NULL) {}
};

// 搜索（递归版）
BSTNode* search(BSTNode* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key) return search(root->left, key);
    return search(root->right, key);
}

// 插入：新结点总是作为叶结点插入
BSTNode* insert(BSTNode* root, int key) {
    if (!root) return new BSTNode(key);
    if (key < root->key)
        root->left = insert(root->left, key);
    else if (key > root->key)
        root->right = insert(root->right, key);
    return root;                 // key 已存在则不插入
}

// 查找最小值结点（左链一直到底）
BSTNode* findMin(BSTNode* node) {
    while (node->left) node = node->left;
    return node;
}

// 删除：分四种情况处理
BSTNode* remove(BSTNode* root, int key) {
    if (!root) return NULL;
    if (key < root->key)
        root->left = remove(root->left, key);
    else if (key > root->key)
        root->right = remove(root->right, key);
    else {
        // 找到要删除的结点
        if (!root->left) {        // 左子树空（含叶）：右子女顶替
            BSTNode* tmp = root->right;
            delete root;
            return tmp;
        }
        if (!root->right) {       // 右子树空：左子女顶替
            BSTNode* tmp = root->left;
            delete root;
            return tmp;
        }
        // 左右子树都在：用右子树中序第一个结点（最小值）填补
        BSTNode* succ = findMin(root->right);
        root->key = succ->key;
        root->right = remove(root->right, succ->key);
    }
    return root;
}`,
    complexity: { time: '平均O(log n)，最坏O(n)', space: 'O(h)' },
    related: ['ch5-4', 'ch7-3', 'ch7-5'],
  },

  'ch7-5': {
    title: '平衡二叉树(AVL)',
    content: `
      <h3>7.5 平衡二叉树 (AVL 树)</h3>
      <p><b>定义</b>：AVL 树或者是空树，或者是这样的二叉搜索树——左、右子树都是 AVL 树，且<b>左右子树高度之差的绝对值不超过 1</b>。</p>
      <ul>
        <li><b>平衡因子 bf</b> = 结点<b>右子树高度 − 左子树高度</b>；AVL 树任一结点 bf ∈ {−1, 0, 1}；</li>
        <li>某结点 |bf| &gt; 1 即<b>失去平衡</b>；</li>
        <li>n 个结点的 AVL 树高度可保持在 O(log₂n)，平均搜索长度也 O(log₂n)。</li>
      </ul>
      <h4>平衡化旋转（核心）</h4>
      <p>插入新结点后，从插入位置<b>沿通向根的路径回溯</b>检查平衡因子；发现不平衡的结点时停止回溯，取该结点及其下两层共 3 个结点：</p>
      <table>
        <tr><th>失衡类型</th><th>形状</th><th>旋转</th></tr>
        <tr><td>LL（左孩子的左子树插入，bf=−2）</td><td>三结点一直线</td><td><b>右单旋 RotateR</b></td></tr>
        <tr><td>RR（右孩子的右子树插入，bf=2）</td><td>三结点一直线</td><td><b>左单旋 RotateL</b></td></tr>
        <tr><td>LR（左孩子的右子树插入，bf=−2）</td><td>三结点一折线</td><td><b>先左后右双旋 RotateLR</b></td></tr>
        <tr><td>RL（右孩子的左子树插入，bf=2）</td><td>三结点一折线</td><td><b>先右后左双旋 RotateRL</b></td></tr>
      </table>
      <p>口诀：<b>直线单旋、折线双旋</b>（折线需先把中间结点"拉直"再单旋）。单旋后新根 bf=0、原根 bf=0；双旋后新根 bf=0，另两个结点的 bf 依插入位置修正。</p>
      <h4>插入后回溯的三种情况（pr 为新结点的父结点）</h4>
      <ol>
        <li><b>pr 的 bf 变为 0</b>：在较矮子树上插入，子树高度不变，<b>停止回溯</b>；</li>
        <li><b>|pr 的 bf| = 1</b>：子树增高但未失衡，<b>继续向上回溯</b>；</li>
        <li><b>|pr 的 bf| = 2</b>：失衡，做平衡化旋转——pr 的 bf=2（右高）时：其右孩子 q 的 bf=1 做<b>左单旋</b>、q 的 bf=−1 做<b>右左双旋</b>；pr 的 bf=−2 时：q 的 bf=−1 做<b>右单旋</b>、q 的 bf=1 做<b>左右双旋</b>。</li>
      </ol>
      <h4>插入实例（课件）</h4>
      <p>依次插入 {16, 3, 7, 11, 9, 26, 18, 14, 15}：插 7 触发<b>左右双旋</b>（根变 7）；插 9 触发<b>右单旋</b>；插 26 触发<b>左单旋</b>；插 15 触发<b>左右双旋</b>。最终树：<code>11( 7(3, 9), 16( 15(14, 18), 26 ) )</code>，所有 bf ∈ {−1,0,1}。</p>
      <h4>删除</h4>
      <p>双子女时用<b>中序直接前驱</b>（或后继）顶替后删除；删除可能使子树变矮，用布尔变量 <b>shorter</b> 控制向上回溯：bf 为 0 → 置 ±1 且停止；较高子树缩短 → bf 置 0 且继续；<b>较矮子树缩短 → 失衡需旋转</b>（旋转方向取决于被缩短的是哪棵子树，分单旋/双旋三种情形）。删除时间 O(log₂n)。</p>
      <h4>AVL 树的高度</h4>
      <p>设 N_h 是高度为 h 的 AVL 树的最小结点数，则 N₀=0、N₁=1、<code>N_h = N_{h−1} + N_{h−2} + 1</code>（Fibonacci 型递推），N_h = F_{h+2} − 1。由此可得 <code>h ≤ 1.44·log₂(n+2)</code>——最坏情况下 AVL 也保持对数高度。BST 适合内存中的小索引；外存大文件索引用 <b>B 树/B+ 树</b>（<code>ch7-6</code>）。</p>
    `,
    code: `// 左单旋转（RR 型）：ptr 的右子树比左子树高
// 旋转后新根在 ptr，A、C 的平衡因子均归 0
template <class E, class K>
void AVLTree<E, K>::RotateL(AVLNode<E, K> *& ptr) {
    AVLNode<E, K> *subL = ptr;         // A 结点
    ptr = subL->right;                 // C 上升为新根
    subL->right = ptr->left;           // C 的原左子树 D 挂到 A 右侧
    ptr->left = subL;                  // A 成为 C 的左孩子
    ptr->bf = subL->bf = 0;            // 平衡因子归 0
}

// 右单旋转（LL 型）：ptr 的左子树比右子树高
template <class E, class K>
void AVLTree<E, K>::RotateR(AVLNode<E, K> *& ptr) {
    AVLNode<E, K> *subR = ptr;         // A 结点
    ptr = subR->left;                  // B 上升为新根
    subR->left = ptr->right;           // B 的原右子树 E 挂到 A 左侧
    ptr->right = subR;                 // A 成为 B 的右孩子
    ptr->bf = subR->bf = 0;
}

// 左右双旋（LR 型）：先对左孩子左旋拉直，再对 A 右旋
// 折线 (A(-2), B(1), E)：E 上升为新根
template <class E, class K>
void AVLTree<E, K>::RotateLR(AVLNode<E, K> *& ptr) {
    AVLNode<E, K> *subR = ptr;             // A
    AVLNode<E, K> *subL = subR->left;      // B
    ptr = subL->right;                     // E 上升为新根
    subL->right = ptr->left;               // E 的左孩子成为 B 的右孩子
    ptr->left = subL;                      // B 成为 E 的左孩子
    if (ptr->bf <= 0) subL->bf = 0;        // 依插入位置修正 bf
    else subL->bf = -1;
    subR->left = ptr->right;               // E 的右孩子成为 A 的左孩子
    ptr->right = subR;                     // A 成为 E 的右孩子
    if (ptr->bf == -1) subR->bf = 1;
    else subR->bf = 0;
    ptr->bf = 0;                           // 新根 bf 归 0
}`,
    complexity: { time: '插删/搜索O(log n)', space: 'O(n)' },
    related: ['ch7-4', 'ch7-3', 'ch7-6'],
  },

  'ch7-6': {
    title: 'B树与B+树',
    content: `
      <h3>7.6 多级索引：B 树与 B+ 树</h3>
      <h4>为什么需要 B 树</h4>
      <p>数据记录特别大时索引表本身在内存放不下，要建立<b>索引的索引</b>（二级、三级索引……），形成 <b>m 路搜索树</b>：分支结点=索引块（最多 m 个索引项，给出子树最大关键码与地址），叶结点给出记录关键码与存放地址。<b>访问外存次数 = 读入索引次数 + 1 次读记录</b>——降低树高、减少读盘次数是关键，故需要<b>平衡的 m 路搜索树</b>即 B 树。</p>
      <h4>m 阶 B 树的定义（6 条）</h4>
      <ol>
        <li><b>根结点至少有 2 个子女</b>；</li>
        <li>非根结点<b>至少有 ⌈m/2⌉ 个子女</b>；</li>
        <li>每个结点<b>至多有 m 个子女</b>；</li>
        <li>结点结构 (n, P₀, K₁, P₁, ..., Kₙ, Pₙ)：Kᵢ &lt; Kᵢ₊₁，子树 Pᵢ 中所有关键码大于 Kᵢ 且小于 Kᵢ₊₁；</li>
        <li><b>所有叶结点出现在同一层上</b>；</li>
        <li>所有子树同样满足 B 树定义（递归）。</li>
      </ol>
      <p>每个非失败结点的关键码个数 ∈ <b>[⌈m/2⌉−1, m−1]</b>。</p>
      <h4>B 树的插入与删除</h4>
      <ul>
        <li><b>插入</b>：总是在<b>叶结点</b>插入；若关键码个数超出上界 m−1 则<b>结点分裂</b>——中间关键码上移到双亲，分裂可<b>一直进行到根</b>（根分裂则新建根，树高加一）。例（m=3，依次插入 53,75,139,49,145,36,101）：多次分裂后根 [49,75,139] 又溢出，根分裂创建新根 [75]，树高加一；</li>
        <li><b>删除</b>：关键码不在叶上时，用其<b>后继（或前驱）替换</b>，转化为叶上删除。叶上删除分四种情况：①够数直接删；②不够数但兄弟<b>有余</b>——"借"（双亲关键码下移、兄弟最小/最大关键码上移）；③兄弟也无余——<b>合并</b>（双亲关键码下移参与合并）；④合并可能使双亲又不足，<b>级联调整直至根</b>。</li>
      </ul>
      <h4>B+ 树（B 树的变种）</h4>
      <ul>
        <li><b>所有关键码都存放在叶结点</b>，非叶结点的关键码是其子树中<b>最大（或最小）关键码的复写</b>，只起索引（分界）作用；</li>
        <li>n 棵子树的结点恰有 <b>n 个关键码</b>；<b>根结点最少 1 棵子树</b>（其他结点 ≥⌈m/2⌉）；</li>
        <li><b>叶结点包含全部关键码及记录地址指针，且按关键码顺序链接</b>——支持<b>顺序（范围）查找</b>，B 树不能；</li>
        <li>两个头指针：指向根（自顶向下随机搜索）、指向最小关键码的叶（沿叶链顺序搜索）；</li>
        <li>插入仅在叶层：关键码数 &gt; m 时分裂为 ⌈(m+1)/2⌉ 与 ⌊(m+1)/2⌋ 个；删除仅在叶层：≥⌈m/2⌉ 简单删除（<b>上层副本可保留</b>作分界），不足则借/合并，级联至根的最后两个子女合并时<b>层数减一</b>。</li>
      </ul>
      <h4>B 树 vs B+ 树</h4>
      <table>
        <tr><th></th><th>B 树</th><th>B+ 树</th></tr>
        <tr><td>数据存放</td><td>每个结点存 key + data</td><td>仅<b>叶结点</b>存 data，含全部关键码</td></tr>
        <tr><td>查找路径</td><td>越靠近根越快找到</td><td>每个记录都要走到叶层，查找时间基本一致</td></tr>
        <tr><td>顺序/范围查找</td><td>不支持</td><td>叶链顺序链接，支持</td></tr>
        <tr><td>实际应用</td><td>—</td><td>非叶不存数据 → 单结点容纳更多索引项、<b>树更矮</b>，性能更好（文件系统/数据库索引常用）</td></tr>
      </table>
      <p>易错：m 阶 B 树定义中<b>没有</b>"叶结点通过指针链接"的要求（那是 B+ 树）；B+ 树根结点可以只有 1 棵子树，不受 ⌈m/2⌉ 限制。</p>
    `,
    complexity: { time: '搜索O(log n)（读写盘O(h)次）', space: 'O(n)' },
    related: ['ch7-4', 'ch7-5', 'ch7-7'],
  },

  'ch7-7': {
    title: '散列表 (Hash Table)',
    content: `
      <h3>7.7 散列（Hashing）</h3>
      <p>理想搜索是<b>不经比较、一次直接</b>得到元素：建立存储地址与关键码的函数关系 <code>Address = Hash(key)</code>——这就是<b>散列方法</b>，构造的表叫<b>散列表</b>。</p>
      <h4>冲突与同义词</h4>
      <p>散列函数是<b>压缩映象</b>：关键码集合远大于地址集合，不同关键码可能映射到同一地址，产生<b>冲突 (collision)</b>；这些关键码互称<b>同义词 (synonym)</b>。冲突不可避免，需解决两大问题：选<b>计算简单且分布均匀</b>的散列函数；<b>拟订处理冲突的方案</b>。</p>
      <h4>五种散列函数</h4>
      <ol>
        <li><b>直接定址法</b>：Hash(key) = a·key + b，一对一映射不冲突，但要求地址空间与关键码集合同大小；</li>
        <li><b>数字分析法</b>：取关键码中符号分布均匀的若干位（λₖ = Σ(αᵢₖ − n/r)² 越小越均匀），需事先知道关键码分布；</li>
        <li><b>除留余数法</b>：Hash(key) = key % p，p 为<b>不大于 m 但最接近 m 的质数</b>，且 p <b>不接近 2 的幂</b>（如 m=16 取 p=13）；</li>
        <li><b>平方取中法</b>：关键码内码平方后取中间若干位（中间位由所有字符决定）；</li>
        <li><b>折叠法</b>：关键码分成等长几段叠加（移位法/分界折叠法），取低位为地址，适合位数很多的关键码。</li>
      </ol>
      <h4>处理冲突——闭散列（开地址法）</h4>
      <ul>
        <li><b>线性探查</b>：Hᵢ = (H₀ + i) % m——依次向后找空位；缺点：<b>堆积（聚集，clustering）</b>——非同义词争夺同一后继位置连成一片，使探查次数激增；</li>
        <li><b>平方探查</b>：Hᵢ = (H₀ + i²) % m，可减轻堆积；</li>
        <li><b>双散列（二次散列）</b>：Hᵢ = (d₁ + i·hash₂(key)) % m，取 hash₂(key) = R − (key % R)（R 为小于表长的质数）。</li>
      </ul>
      <h4>处理冲突——开散列（链地址法）</h4>
      <p>同义词存入同一<b>桶 (bucket)</b> 的<b>同义词子表</b>（单链表），各桶表头组成向量。平均每桶长度 n/m，用搜索长度 n/m 的子表代替长度 n 的顺序表，速度快得多。</p>
      <h4>ASL 例（必会计算）</h4>
      <p>关键码 {89, 18, 49, 58, 69}，hash(key) = key % 10，线性探查：89→9 号；18→8 号；49→9 冲突→0 号（2 次）；58→8,9 冲突→1 号（4 次）；69→9,0,1 冲突→2 号（4 次）。ASL_succ = (1+1+2+4+4)/5 = <b>12/5</b>。</p>
      <h4>装填因子（负载因子）</h4>
      <p class="formula">α = 表中已装入元素数 n / 散列表长度 m</p>
      <p>α 越大冲突越多、ASL 越大；α 越小空间浪费越大。一般把 α 控制在 <b>0.7 左右</b>（超过则扩容再散列）。散列搜索的平均复杂度是与 α 有关的 <code>O(1)</code>，与 n 无关。</p>
      <h4>应用</h4>
      <p><b>MD5</b> 等加密散列：产生 128 位（32 个十六进制数字）散列值，用于密码存储校验（王小云团队 2004 年前后攻破 MD5、SHA-1）。</p>
    `,
    code: `// 线性探查散列表：插入与搜索
const int M = 26;               // 表长
const int EMPTY = -1;           // 空槽标志
int HT[M];

int hashKey(int key) { return key % M; }        // 除留余数法

// 插入：冲突则线性探查下一个位置（绕回表头）
bool hashInsert(int key) {
    int H0 = hashKey(key), i = 0;
    while (i < M) {
        int pos = (H0 + i) % M;                 // H_i = (H0 + i) % m
        if (HT[pos] == EMPTY) { HT[pos] = key; return true; }
        i++;                                    // 冲突，继续探查
    }
    return false;                               // 表满
}

// 搜索：沿同一探查序列找，遇空槽即失败
int hashSearch(int key) {
    int H0 = hashKey(key), i = 0;
    while (i < M) {
        int pos = (H0 + i) % M;
        if (HT[pos] == EMPTY) return -1;        // 探查到空槽：失败
        if (HT[pos] == key) return pos;         // 成功
        i++;
    }
    return -1;
}`,
    complexity: { time: '平均O(1)（与α有关）', space: 'O(m)' },
    related: ['ch7-1', 'ch7-3', 'ch7-6', 'ch7-8'],
  },

  'ch7-8': {
    title: '并查集',
    content: `
      <h3>7.8 并查集（Union-Find Sets / 不相交集合）</h3>
      <h4>等价类问题背景</h4>
      <p><b>等价关系</b>是集合上满足<b>自反性</b>（x≡x）、<b>对称性</b>（x≡y 则 y≡x）、<b>传递性</b>（x≡y 且 y≡z 则 x≡z）的关系。等价关系把集合划分为若干<b>互不相交的等价类</b>。解法：每个元素先自成单元素集合，读入等价对时把两个元素所在集合<b>合并</b>——所需操作就是 <b>Find</b>（确定元素属于哪个集合）与 <b>Union</b>（合并两个集合）。</p>
      <h4>存储表示：树的双亲表示</h4>
      <p><b>每个集合用一棵树表示，采用双亲数组 parent[]</b>：</p>
      <ul>
        <li>parent[i] 存结点 i 的双亲下标；<b>根结点的 parent 为负数，其绝对值 = 该集合元素个数</b>（初始全为 −1）；</li>
        <li>忽略集合名，<b>用树的根标识集合</b>：Find(i) 返回 i 所在树的根；Find(i)==Find(j) 说明 i、j 同属一个集合。</li>
      </ul>
      <h4>朴素实现的性能问题</h4>
      <p>一次 Union 是 O(1)，n−1 次 Union 共 O(n)；但若依次做 Union(n−2,n−1), ..., Union(0,1)，会得到<b>退化的链状树</b>，此后执行 Find(0)..Find(n−1) 的总时间达 <code>O(Σi) = O(n²)</code>。</p>
      <h4>三种改进（必考）</h4>
      <ol>
        <li><b>按结点个数合并（Weighted Union）</b>：结点个数多的树的根作新根（比较负数大小即可）；</li>
        <li><b>按树高度合并（UnionByHeight）</b>：高度高的树的根作根；等高时高度加 1；</li>
        <li><b>路径压缩（Path Compression）</b>：执行 <b>Find 时</b>把查找路径上的所有结点<b>直接挂到根</b>下，使树变矮。路径压缩后 Find 的均摊复杂度近乎 O(1)。</li>
      </ol>
      <h4>应用</h4>
      <ul>
        <li><b>省份数量</b>（LeetCode 547）：每个城市为一个元素，isConnected[i][j]=1 作为等价对做 Union，最后统计 parent 值小于 0 的根的个数；</li>
        <li><b>Kruskal 最小生成树</b>：用 Find 判断边的两端是否在同一连通分量（<code>ch6-6</code>）；</li>
        <li>判断图连通性、传递闭包等。</li>
      </ul>
    `,
    code: `class UFSets {
private:
    int *parent;               // 双亲表示数组
    int size;
public:
    UFSets(int sz = 100) : size(sz) {
        parent = new int[sz];
        for (int i = 0; i < sz; i++) parent[i] = -1;  // 各自成集合
    }
    ~UFSets() { delete[] parent; }

    // 查找：返回包含元素 x 的树的根（根的 parent 值为负）
    int Find(int x) {
        if (parent[x] < 0) return x;
        return Find(parent[x]);
    }

    // 合并：parent 值（负数）累加，Root2 挂到 Root1 下
    void Union(int Root1, int Root2) {
        parent[Root1] += parent[Root2];    // 集合元素个数累加
        parent[Root2] = Root1;             // Root2 指向 Root1
    }

    // 改进一：按结点个数合并（结点多的根作根）
    void WeightedUnion(int Root1, int Root2) {
        int temp = parent[Root1] + parent[Root2];
        if (parent[Root2] < parent[Root1]) {   // 负数比较：Root2 集合大
            parent[Root1] = Root2;
            parent[Root2] = temp;
        }
        else {                                 // Root1 集合大
            parent[Root2] = Root1;
            parent[Root1] = temp;
        }
    }
}`,
    complexity: { time: '朴素Find O(h)，压缩后近O(1)', space: 'O(n)' },
    related: ['ch6-6', 'ch5-6', 'ch7-1'],
  },

  // === Chapter 8: 排序 ===
  'ch8-1': {
    title: '排序的基本概念',
    content: `
      <h3>8.1 排序的基本概念</h3>
      <ul>
        <li><b>排序</b>：将一组杂乱无章的数据按一定规律顺次排列起来；</li>
        <li><b>排序码 (key)</b>：数据元素多个属性域中用来作为排序依据的域（视应用需要而定）；</li>
        <li><b>数据表 (datalist)</b>：待排序数据元素的有限集合。</li>
      </ul>
      <h4>稳定性（必考定义）</h4>
      <p>若序列中有两个元素 r[i]、r[j]，排序码 k[i] == k[j]，且排序前 r[i] 排在 r[j] 前面；排序后 r[i] 仍在 r[j] 前面，则称该排序方法<b>稳定</b>，否则<b>不稳定</b>。稳定性针对<b>排序算法</b>而言，与具体数据无关。</p>
      <h4>内排序与外排序</h4>
      <ul>
        <li><b>内排序</b>：排序期间元素<b>全部在内存</b>；</li>
        <li><b>外排序</b>：元素太多不能同时放入内存，需<b>不断在内外存之间移动</b>（如多路归并）。</li>
      </ul>
      <h4>排序算法的衡量标准</h4>
      <ol>
        <li><b>时间开销</b>（最重要）：用<b>排序码比较次数 KCN</b> 与<b>元素移动次数 RMN</b> 衡量；受初始排列影响大的算法需分<b>最好、最坏、平均</b>讨论；</li>
        <li><b>空间开销</b>：算法执行所需的<b>附加存储</b>（交换临时变量、辅助数组、递归栈）；</li>
        <li><b>稳定性</b>。</li>
      </ol>
      <h4>稳定性速记（配合 ch8-10）</h4>
      <ul>
        <li><b>稳定</b>：直接插入、折半插入、冒泡、锦标赛、归并、基数；</li>
        <li><b>不稳定</b>：希尔、快速、简单选择、堆。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch8-2', 'ch8-10'],
  },

  'ch8-2': {
    title: '冒泡排序',
    content: `
      <h3>8.2 冒泡排序 (Bubble Sort)</h3>
      <p><b>交换排序</b>思想：两两比较相邻元素排序码，发生<b>逆序</b>则交换，直到全部有序。冒泡排序：设 n 个元素，最多做 n−1 趟；第 i 趟对 V[i−1..n−1] <b>从后向前</b>顺次比较相邻元素，把该区间<b>最小元素交换（冒泡）到最前面</b>位置 i−1。</p>
      <h4>优化：交换标志 exchange</h4>
      <p>每趟开始置 exchange=0；一趟中发生交换则置 1。<b>一趟无交换说明已全部有序，提前结束</b>。最好情形（初始有序）只执行一趟、比较 n−1 次、不移动元素。</p>
      <h4>性能分析</h4>
      <ul>
        <li><b>最好</b>：KCN = n−1，RMN = 0；</li>
        <li><b>最坏</b>（逆序）：KCN = Σ(n−i) = n(n−1)/2；每次交换需移动 3 个元素，RMN = 3n(n−1)/2；</li>
        <li>平均/最坏 <code>O(n²)</code>，附加空间 O(1)（一个交换暂存单元）；</li>
        <li><b>稳定排序</b>（比较用严格大于 "&gt;"，相等不交换）。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>每趟冒泡至少把<b>一个元素放到最终位置</b>（区间最小者就位），据此可判断"若干趟后的序列属于哪种排序"的选择题；</li>
        <li>比较方向从前向后也可（大数冒向尾部），但<i>课堂课件采用从后向前、小数冒到首位</i>。</li>
      </ul>
    `,
    code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;  // 交换标志
        for (int j = n - 1; j > i; j--) {   // 从后向前两两比较
            if (arr[j - 1] > arr[j]) {      // 逆序
                swap(arr[j - 1], arr[j]);
                swapped = true;
            }
        }
        if (!swapped) break;  // 一趟无交换：已有序，提前结束
    }
}`,
    complexity: { time: 'O(n²)', space: 'O(1)' },
    related: ['ch8-3', 'ch8-4', 'ch8-10'],
  },

  'ch8-3': {
    title: '选择排序',
    content: `
      <h3>8.3 直接选择排序 (Select Sort)</h3>
      <p><b>选择排序</b>思想：每一趟从后面 n−i 个待排序元素中<b>选出排序码最小</b>的元素，作为有序序列的第 i 个元素。基本步骤：①在 V[i..n−1] 中找最小排序码元素（用 k 指示）；②若它不是这组元素的第一个，则与第一个<b>对调</b>；③剔除它，在剩余元素中重复，直到只剩一个。</p>
      <h4>性能分析（与冒泡的对比是考点）</h4>
      <ul>
        <li><b>比较次数与初始排列无关</b>：第 i 趟总是比较 n−i−1 次，KCN = n(n−1)/2，故<b>最好、最坏、平均都是 O(n²)</b>；</li>
        <li><b>移动次数与初始排列有关</b>：初始有序时 RMN = 0；最坏每趟都交换，RMN = 3(n−1)——<b>移动次数远少于冒泡</b>；</li>
        <li>附加空间 O(1)；</li>
        <li><b>不稳定</b>：跨距离交换会打乱相等元素的相对次序。反例：(3a, 3b, 1) → 第一趟 1 与 3a 交换 → (1, 3b, 3a)，3a 跑到 3b 之后。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>选择排序每趟也把一个元素放到最终位置，但它做的是"与第 i 位交换"而非相邻交换；</li>
        <li>内层循环找最小用 <code>&lt;</code> 记下标 k，<b>循环结束后才交换一次</b>（不是边比较边交换）。</li>
      </ul>
    `,
    code: `template <class T>
void SelectSort(dataList<T>& L, int left, int right) {
    for (int i = left; i < right; i++) {
        int k = i;
        // 在 L[i]..L[right] 中找最小排序码元素，k 指示其位置
        for (int j = i + 1; j <= right; j++)
            if (L[j] < L[k]) k = j;
        if (k != i) L.Swap(L[i], L[k]);   // 与第 i 个元素对调
    }
}`,
    complexity: { time: 'O(n²)（与初始排列无关）', space: 'O(1)' },
    related: ['ch8-2', 'ch8-8', 'ch8-10'],
  },

  'ch8-4': {
    title: '插入排序',
    content: `
      <h3>8.4 直接插入排序 (Insert Sort)</h3>
      <p><b>基本思想</b>：当插入第 i（i≥1）个元素时，前面的 V[0..i−1] 已经排好序；用 V[i] 的排序码与 V[i−1], V[i−2], ... <b>顺序比较</b>，找到插入位置插入，原来位置上的元素<b>向后顺移</b>。</p>
      <p>例（i=4，temp=16，序列 21 25 49 25* 16 08 的前段）：16 依次与 49、25*、25、21 比较均小，四者依次后移，16 插入最前——"比较与移动同时进行"。</p>
      <h4>性能分析</h4>
      <ul>
        <li>共执行 <b>n−1 趟</b>；</li>
        <li><b>最好情况</b>（已有序）：每趟只比较 1 次，KCN = n−1，RMN = 0——O(n)；</li>
        <li><b>最坏情况</b>（逆序）：第 i 趟比较 i 次、移动 i+2 次，KCN ≈ n(n−1)/2，RMN ≈ (n+4)(n−1)/2——O(n²)；平均 O(n²)；</li>
        <li>附加空间 O(1)（temp）；<b>稳定</b>（后移用严格小于，相等元素不越过）。</li>
      </ul>
      <h4>折半插入排序 (Binary Insert Sort)</h4>
      <ul>
        <li>插入 V[i] 时用<b>折半搜索</b>在有序区 V[0..i−1] 中定位插入位置，再<b>成块后移</b>元素；</li>
        <li>插入第 i 个元素需 <code>⌊log₂i⌋ + 1</code> 次比较，总比较次数 ≈ <b>n·log₂n</b>；</li>
        <li>关键结论：<b>比较次数与初始排列无关，仅依赖 n</b>；但<b>移动次数与直接插入相同</b>，仍依赖初始排列；</li>
        <li>平均性能优于直接插入；但<b>初始序列已有序或接近有序时，直接插入比较次数更少</b>（比折半插入好）；</li>
        <li><b>稳定</b>。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>折半插入只减少了<b>比较</b>，没有减少<b>移动</b>；</li>
        <li>折半定位到 low 位置插入时，相等元素应插入其后（用 temp &lt; L[middle] 向左缩区间即可保持稳定）。</li>
      </ul>
    `,
    code: `// 直接插入排序
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];  // 比key大的元素后移
            j--;
        }
        arr[j + 1] = key;  // 插入到正确位置
    }
}

// 折半插入排序：折半搜索定位 + 成块移动
template <class T>
void BinaryInsertSort(dataList<T>& L, int left, int right) {
    Element<T> temp;
    int i, low, high, middle, k;
    for (i = left + 1; i <= right; i++) {
        temp = L[i];  low = left;  high = i - 1;
        while (low <= high) {              // 折半搜索插入位置
            middle = (low + high) / 2;
            if (temp < L[middle]) high = middle - 1;  // 向左缩区间
            else low = middle + 1;                    // 向右缩区间
        }
        for (k = i - 1; k >= low; k--)     // 成块移动，空出位置
            L[k+1] = L[k];
        L[low] = temp;                     // 插入
    }
}`,
    complexity: { time: 'O(n²)（最好O(n)）', space: 'O(1)' },
    related: ['ch8-2', 'ch8-5', 'ch8-10'],
  },

  'ch8-5': {
    title: '希尔排序',
    content: `
      <h3>8.5 希尔排序 (Shell Sort，缩小增量排序)</h3>
      <h4>基本思想（由粗到细，Coarse to fine）</h4>
      <ol>
        <li>取一个整数 <b>gap &lt; n</b> 作间隔，把全部元素分成 <b>gap 个子序列</b>——所有相距为 gap 的元素属同一子序列；</li>
        <li>对每个子序列分别做<b>直接插入排序</b>；</li>
        <li><b>缩小 gap</b>（如 gap = gap/2），重复分组与组内排序；直到 gap = 1，全体做一次直接插入排序为止。</li>
      </ol>
      <p>原理：开始 gap 大、子序列短、排序快；随着 gap 缩小，虽然子序列变长，但<b>大多数元素已基本有序</b>，直接插入在接近有序时效率很高。</p>
      <p>例（21, 25, 49, 25*, 16, 08）：gap=3 时子序列 {21,16}、{25,08}、{49,25*} 组内排序；gap=2 再排 {·,25*,49}、{·,25}；gap=1 全体插入排序 → 08 16 21 25* 25 49。</p>
      <h4>性能分析（重点：依赖增量序列）</h4>
      <ul>
        <li>增量取法很多：Shell 原方案 gap = ⌊n/2⌋, ⌊gap/2⌋, ..., 1；<b>Knuth 提出 gap = ⌊gap/3⌋ + 1</b>；也有人建议取奇数或互质；</li>
        <li>比较/移动次数与<b>增量选择之间的依赖关系至今没有完整的数学分析</b>；</li>
        <li><b>Knuth 大量实验统计</b>：n 很大时，平均比较次数与移动次数约在 <code>n^1.25 ~ 1.6·n^1.25</code> 之间（以直接插入为组内排序方法）；</li>
        <li><b>希尔排序是不稳定的</b>：相等元素可能分到不同子序列而改变相对次序（例中 25 与 25*）。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>把 gap 换成 1 后，希尔排序就是<b>直接插入排序</b>；</li>
        <li>希尔排序不能保证每趟至少一个元素就位（对比快排/冒泡/选择）；</li>
        <li>复杂度不能笼统写 O(n^1.3)——必须注明"依赖增量序列"。</li>
      </ul>
    `,
    code: `template <class T>
void Shellsort(dataList<T>& L, int left, int right) {
    int i, j, gap = right - left + 1;   // 增量初值
    Element<T> temp;
    do {
        gap = gap / 2;                  // 求下一增量（缩小增量）
        for (i = left + gap; i <= right; i++)  // 各子序列做直接插入
            if (L[i] < L[i - gap]) {    // 逆序则需插入
                temp = L[i];  j = i - gap;
                do {
                    L[j + gap] = L[j];  // 相距 gap 的元素后移
                    j = j - gap;
                } while (j >= left && temp < L[j]);
                L[j + gap] = temp;      // 回送插入
            }
    } while (gap > 1);                  // gap == 1 时最后一趟
}`,
    complexity: { time: '约O(n^1.25)~O(1.6n^1.25)（依赖增量序列）', space: 'O(1)' },
    related: ['ch8-4', 'ch8-10'],
  },

  'ch8-6': {
    title: '快速排序',
    content: `
      <h3>8.6 快速排序 (Quick Sort)</h3>
      <p><b>分治思想</b>：任取一个元素作<b>基准 (pivot)</b>（课件取第一个元素），把序列划分为两部分——左侧排序码 ≤ pivot、右侧 &gt; pivot，pivot 位于两子序列中间（即其<b>最终位置</b>）；再对左右子序列递归，直到全部就位。</p>
      <h4>划分方法（两种实现）</h4>
      <ul>
        <li><b>前后指针法</b>：pivot = Vector[low]，指针 i 扫描全序列，把小于 pivot 的元素交换到左侧区域（pivotpos 指示），最后把 pivot 与 Vector[pivotpos] 交换就位；</li>
        <li><b>挖坑法</b>：pivot 暂存，形成"坑"；j 从右向左找小于 pivot 的元素填左坑，i 从左向右找大于 pivot 的元素填右坑，i==j 时 pivot 入坑。</li>
      </ul>
      <h4>性能分析（重点）</h4>
      <ul>
        <li>趟数取决于<b>递归树高度</b>：理想（每次划分均衡）递归树高 ⌈log₂(n+1)⌉，递归栈 <b>O(log₂n)</b>，时间 <code>O(n·log₂n)</code>；</li>
        <li><b>最坏情况</b>：序列<b>已经有序（或逆序）</b>时，每次划分只得到一个子序列（单支递归树），需 n−1 趟，KCN = n(n−1)/2 ≈ n²/2，时间退化为 <code>O(n²)</code>，比直接插入还慢；栈深达 <b>O(n)</b>；</li>
        <li><b>随机化快速排序</b>：划分前随机选一个元素与首位交换作基准——最坏仍 O(n²)，但最坏情况概率降到极小；</li>
        <li>n 很小时快排反而比简单排序慢，此时宜用<b>直接插入</b>；</li>
        <li><b>不稳定</b>（划分中的长距离交换打乱相等元素次序）。</li>
      </ul>
      <h4>每趟至少一个元素就位</h4>
      <p>每趟划分后 pivot 处于最终位置，可据此做"两趟后序列属于哪种排序"的判别题。</p>
    `,
    code: `// 前后指针法划分：pivot = Vector[low]，返回 pivot 最终位置
template <class T>
int dataList<T>::Partition(const int low, const int high) {
    int pivotpos = low;
    Element<T> pivot = Vector[low];        // 基准元素
    for (int i = low + 1; i <= high; i++)  // 检测整个序列
        if (Vector[i] < pivot) {           // 小于基准的交换到左侧
            pivotpos++;
            if (pivotpos != i)
                Swap(Vector[pivotpos], Vector[i]);
        }
    Vector[low] = Vector[pivotpos];
    Vector[pivotpos] = pivot;              // 基准元素就位
    return pivotpos;                       // 返回基准位置
}

// 挖坑法划分：pivot 暂存，空位（坑）在 i、j 间左右移动
int Partition_Classic(int a[], int s, int t) {
    int pivot = a[s], i = s, j = t;
    while (i < j) {
        while (i < j && a[j] >= pivot) j--;    // 从右找小的填左坑
        if (i < j) { a[i] = a[j]; i++; }
        while (i < j && a[i] <= pivot) i++;    // 从左找大的填右坑
        if (i < j) { a[j] = a[i]; j--; }
    }
    a[i] = pivot;                              // 此时 i == j
    return i;
}

// 快速排序主算法
void quickSort(int arr[], int low, int high) {
    if (low < high) {                  // 序列长度大于 1
        int pivotpos = Partition_Classic(arr, low, high);  // 划分
        quickSort(arr, low, pivotpos - 1);   // 递归排左半部分
        quickSort(arr, pivotpos + 1, high);  // 递归排右半部分
    }
}`,
    complexity: { time: '平均O(n log n)，最坏O(n²)', space: 'O(log n)~O(n)（递归栈）' },
    related: ['ch8-7', 'ch8-10', 'ch9-5'],
  },

  'ch8-7': {
    title: '归并排序',
    content: `
      <h3>8.7 归并排序 (Merge Sort)</h3>
      <p><b>归并</b>：将两个或两个以上的有序表合并成一个新有序表。两个有序表 Vector[left..mid] 与 Vector[mid+1..right] 归并到辅助表的方法称<b>两路归并 (2-way merging)</b>：i、j 是两表检测指针，k 是存放指针——排序码小者放入新表；一表扫完后<b>另一表剩余部分照抄</b>。</p>
      <h4>迭代（自底向上）归并排序</h4>
      <p>先把 n 个元素看成 n 个长度为 1 的有序归并项，两两归并得 ⌈n/2⌉ 个长度 2 的归并项；再两两归并得 ⌈n/4⌉ 个长度 4 的归并项……最后得长度 n 的有序序列。例：21 25 49 25* 93 62 72 08 37 16 54 经 len=1,2,4,8 归并得 08 16 21 25 25* 37 49 54 62 72 93。</p>
      <h4>递归（自顶向下）归并排序</h4>
      <p>与快排类似：<b>对半分</b>成左右子表 → 分别递归排序 → 归并两个有序子表。递归深度 <code>O(log₂n)</code>；也可用静态链表实现归并（ListMerge 改 link 不移动元素）。</p>
      <h4>复杂度分析</h4>
      <ul>
        <li>一趟归并 MergePass 调用 merge 约 ⌈n/(2·len)⌉ 次，每次比较 O(len)，一趟 O(n)；共需 ⌈log₂n⌉ 趟；</li>
        <li>总时间 <code>O(n·log₂n)</code>——<b>最好、最坏、平均相同</b>；</li>
        <li><b>空间 O(n)</b>：需要与原表<b>同样大小的辅助数组</b>——这是归并排序的主要缺点（对比快排的原位排序）；</li>
        <li><b>稳定</b>：<b>易错点</b>——稳定性依赖归并时"相等取左边"的写法，即 <code>if (L1[i] &lt;= L1[j])</code> 取左表元素；若写成 &lt; 则不稳定。</li>
      </ul>
    `,
    code: `// 两个有序表归并：L1[left..mid] + L1[mid+1..right] → L2[left..right]
template <class T>
void merge(dataList<T>& L1, dataList<T>& L2,
           int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;   // i,j检测指针, k存放指针
    while (i <= mid && j <= right)         // 两两比较
        if (L1[i] <= L1[j])                // 相等取左边：保证稳定
            L2[k++] = L1[i++];
        else
            L2[k++] = L1[j++];
    while (i <= mid)   L2[k++] = L1[i++];  // 抄送剩余部分
    while (j <= right) L2[k++] = L1[j++];
}

// 一趟完整归并：把长度为 len 的归并项两两归并成长度 2len
template <class T>
void MergePass(dataList<T>& L1, dataList<T>& L2, int len) {
    int i = 0, j, n = L1.Length();
    while (i + 2 * len <= n - 1) {         // 循环两两归并
        merge(L1, L2, i, i + len - 1, i + 2 * len - 1);
        i += 2 * len;
    }
    if (i + len <= n - 1)                  // 剩两个不足 len 的归并项
        merge(L1, L2, i, i + len - 1, n - 1);
    else
        for (j = i; j <= n - 1; j++)       // 剩一个：直接复制
            L2[j] = L1[j];
}

// 迭代归并排序主算法
template <class T>
void MergeSort(dataList<T>& L) {
    int n = L.Length();
    dataList<T> tempList(n);               // 辅助表
    int len = 1;
    while (len < n) {
        MergePass(L, tempList, len);  len *= 2;
        MergePass(tempList, L, len);  len *= 2;
    }
}`,
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    related: ['ch8-6', 'ch8-10', 'ch9-4'],
  },

  'ch8-8': {
    title: '堆排序',
    content: `
      <h3>8.8 堆排序 (Heap Sort)</h3>
      <p>利用<b>堆</b>（完全二叉树的顺序存储）实现选择排序的思想。两步走：</p>
      <ol>
        <li>用 siftDown 调整算法把初始序列<b>建成最大堆</b>（升序排序用最大堆——每次取出的最大元素放到表尾）；</li>
        <li>反复"<b>交换堆顶与堆尾 + 缩小堆 + 重新 siftDown 调整</b>"完成排序。</li>
      </ol>
      <h4>具体过程</h4>
      <ul>
        <li><b>建堆</b>：从最后一个分支结点 <code>i = (n−2)/2</code> 起倒序对每个 i 调 <code>siftDown(L, i, n−1)</code>（建堆本身 O(n)）；</li>
        <li><b>排序</b>：堆顶 L[0]（最大）与 L[n−1] 交换 → 对前 n−1 个元素 siftDown(L, 0, n−2) → 再交换 L[0] 与 L[n−2] → …… 共 n−1 次交换与调整。</li>
      </ul>
      <p>例（21, 25, 49, 25*, 16, 08 → 最大堆 49, 25, 21, 25*, 16, 08）：49 与 08 交换后调整……依次就位 49、25、25*、21、16，最终 08 16 21 25* 25 49。</p>
      <h4>性能分析</h4>
      <ul>
        <li>第二个循环调用 <b>n−1 次 siftDown</b>，每次至多 O(log₂n)，总时间 <code>O(n·log₂n)</code>（建堆 O(n) 不改变量级）；</li>
        <li><b>空间 O(1)</b>：只用于交换的一个临时元素——是 O(n log n) 级排序中唯一原地的；</li>
        <li><b>不稳定</b>：堆顶与堆尾的长距离交换打乱相等元素次序；</li>
        <li>最好、最坏、平均都是 O(n log n)，不受初始排列影响。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>升序要建<b>最大</b>堆（降序建最小堆），方向不要弄反；</li>
        <li>siftDown 中 j 要指向<b>两子女中的大者</b>再比较（与最小堆相反）；</li>
        <li>删除/交换后调整范围是 <code>0..i−1</code>（已就位的尾部不在堆内）。</li>
      </ul>
    `,
    code: `// 最大堆的向下调整：大者上浮
void siftDown(int arr[], int start, int m) {
    int i = start, j = 2 * i + 1;      // j 是 i 的左子女
    int temp = arr[i];                 // 暂存子树根
    while (j <= m) {
        if (j < m && arr[j] < arr[j+1]) j++;   // j 指向两子女中的大者
        if (temp >= arr[j]) break;     // 根更大，已满足堆序
        else {                         // 子女中的大者上移
            arr[i] = arr[j];
            i = j;  j = 2 * j + 1;
        }
    }
    arr[i] = temp;                     // 放回最终位置
}

// 堆排序：先建最大堆，再逐个取出堆顶放到表尾
void heapSort(int arr[], int n) {
    for (int i = (n - 2) / 2; i >= 0; i--)   // 建初始最大堆
        siftDown(arr, i, n - 1);
    for (int i = n - 1; i >= 1; i--) {       // n-1 次交换与调整
        swap(arr[0], arr[i]);                // 堆顶（最大）与堆尾交换
        siftDown(arr, 0, i - 1);             // 对剩余部分重新调成堆
    }
}`,
    complexity: { time: 'O(n log n)', space: 'O(1)' },
    related: ['ch5-8', 'ch8-3', 'ch8-10'],
  },

  'ch8-9': {
    title: '基数排序',
    content: `
      <h3>8.9 基数排序 (Radix Sort)</h3>
      <p>前面的排序都基于"比较排序码"；<b>基数排序</b>是基于<b>多关键字排序</b>思想、<b>不比较排序码</b>的分配排序：把排序码拆成 d 个"关键字位"（如 r 进制整数的个位、十位、百位），逐位进行"<b>分配—收集</b>"。</p>
      <h4>最低位优先法 LSD（常用）</h4>
      <ol>
        <li>按<b>最低位</b>（个位）把元素分配到 r 个队列（桶）中——桶 0~r−1；</li>
        <li>按桶号 0 到 r−1 的顺序<b>收集</b>（依次串联各队列）成一趟结果；</li>
        <li>再按十位、百位……重复分配—收集，<b>共 d 趟</b>；每趟必须用<b>稳定</b>的方式收集（同位相等的元素保持上一趟的次序）。</li>
      </ol>
      <p>例（三位数序列 278, 109, 063, 930, 589, 184, 505, 269, 008, 083）：按个位分配收集 → 按十位 → 按百位，三趟后整体有序。</p>
      <h4>性能分析</h4>
      <ul>
        <li>每趟分配扫描 n 个元素、收集扫描 r 个桶：一趟 O(n + r)，d 趟共</li>
      </ul>
      <p class="formula">时间 O(d × (n + r))，空间 O(n + r)（r 个桶队列 + 临时数组）</p>
      <ul>
        <li>其中 d = 排序码位数（关键字位数），r = 基数（每位取值数目）；</li>
        <li><b>稳定</b>（分配—收集保持相对次序）；</li>
        <li>d、r 为小常数时近似线性 <code>O(n)</code>，但依赖关键码结构，不适合浮点数与长字符串等场景。</li>
      </ul>
      <h4>易错点</h4>
      <ul>
        <li>每趟必须<b>先分配后收集</b>，且收集顺序按桶号从小到大；</li>
        <li>从最低位开始（LSD）时，高位趟的稳定性依赖低位趟的有序性；</li>
        <li>与计数排序的区别：基数排序对"每一位"做多趟分配，计数排序一次性按值计数。</li>
      </ul>
    `,
    code: `// LSD 基数排序（以 r=10 进制整数为例）
int getDigit(int key, int k) {          // 取第 k 位数字（0 为个位）
    for (int i = 0; i < k; i++) key /= 10;
    return key % 10;
}

void radixSort(int arr[], int n, int d) {
    const int R = 10;                   // 基数
    vector<vector<int>> bucket(R);      // r 个桶（队列）
    for (int k = 0; k < d; k++) {       // 共 d 趟"分配-收集"
        for (int i = 0; i < R; i++) bucket[i].clear();
        for (int i = 0; i < n; i++)     // 分配：按第 k 位入桶
            bucket[getDigit(arr[i], k)].push_back(arr[i]);
        int idx = 0;
        for (int b = 0; b < R; b++)     // 收集：按桶号顺序串回
            for (int x : bucket[b])
                arr[idx++] = x;
    }
}`,
    complexity: { time: 'O(d(n+r))', space: 'O(n+r)' },
    related: ['ch8-10', 'ch3-5'],
  },

  'ch8-10': {
    title: '排序算法比较',
    content: `
      <h3>8.10 排序算法综合比较（重点表）</h3>
      <table>
        <tr>
          <th>算法</th><th>最好</th><th>最坏</th><th>平均</th><th>空间</th><th>稳定性</th>
        </tr>
        <tr>
          <td>冒泡排序</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>稳定</td>
        </tr>
        <tr>
          <td>直接插入排序</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>稳定</td>
        </tr>
        <tr>
          <td>折半插入排序</td><td colspan="2">比较恒为 O(n log n)（与初始排列无关），移动 O(n²)</td><td>O(n²)（受移动主导）</td><td>O(1)</td><td>稳定</td>
        </tr>
        <tr>
          <td>希尔排序</td><td>—</td><td>—</td><td>依赖增量序列（Knuth 实验统计约 n^1.25 ~ 1.6·n^1.25）</td><td>O(1)</td><td>不稳定</td>
        </tr>
        <tr>
          <td>快速排序</td><td>O(n log n)</td><td>O(n²)（已有序时）</td><td>O(n log n)</td><td>O(log n)~O(n)（递归栈）</td><td>不稳定</td>
        </tr>
        <tr>
          <td>简单选择排序</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)（比较与初始排列无关）</td><td>O(1)</td><td>不稳定</td>
        </tr>
        <tr>
          <td>锦标赛排序</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)（至少 2n−1 结点）</td><td>稳定</td>
        </tr>
        <tr>
          <td>堆排序</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>不稳定</td>
        </tr>
        <tr>
          <td>归并排序</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)（辅助数组）</td><td>稳定</td>
        </tr>
        <tr>
          <td>基数排序</td><td colspan="3">O(d(n+r))，d=位数、r=基数，与初始排列无关</td><td>O(n+r)</td><td>稳定</td>
        </tr>
      </table>
      <h4>要点辨析</h4>
      <ul>
        <li><b>希尔排序</b>的复杂度不能写死：它<b>依赖增量序列</b>，尚无完整数学分析；Knuth 用实验统计得到平均约 n^1.25 ~ 1.6·n^1.25（采用直接插入为组内排序、增量 ⌊gap/3⌋+1 等方案）；</li>
        <li><b>稳定性速记</b>——稳定：直接插入、折半插入、冒泡、锦标赛、归并、基数；不稳定：希尔、快速、简单选择、堆；</li>
        <li><b>空间</b>：快排 O(log n)（最好）~ O(n)（单支递归树）；归并 O(n)；锦标赛 O(n)；其余简单排序 O(1)；</li>
        <li><b>每趟至少一个元素就位</b>的：冒泡、简单选择、快排、堆排序；<b>不保证</b>的：插入类（希尔）——常考判断题；</li>
        <li>规模小或基本有序 → 插入/冒泡；规模大、通用 → 快排；要求稳定 + O(n log n) → 归并；要求原地 + O(n log n) → 堆排序；关键码位数少且 d、r 小 → 基数排序。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch8-2', 'ch8-4', 'ch8-5', 'ch8-6', 'ch8-7', 'ch8-8', 'ch8-9'],
  },

  // === Chapter 9: 分治策略 ===
  'ch9-1': {
    title: '分治法的基本思想',
    content: `
      <h3>9.1 分治策略 (Divide and Conquer)</h3>
      <p><b>核心思想</b>：把规模较大的问题<b>分解</b>为若干规模较小的、<b>相互独立</b>且<b>与原问题同类</b>的子问题；依次求出子问题的解，再把它们<b>组合</b>成原问题的解。由于子问题与原问题同类，分治法可以很自然地用<b>递归</b>实现。</p>
      <h4>设计模式（伪代码）</h4>
      <pre><code>divide_and_conquer(P) {
    if ( |P| &lt;= n0 ) direct_process(P);       // 规模够小，直接处理
    else {
        divide P into P1, P2, ..., Pa;        // 分解
        for (i = 1; i &lt;= a; i++)
            y[i] = divide_and_conquer(P[i]);  // 递归求解
        merge(y1, y2, ..., ya);               // 合并各子问题的解
    }
}</code></pre>
      <h4>递归方程（复杂度分析的基本工具）</h4>
      <p>设规模 n 的问题分解为 a（a≥1）个规模 n/b（b&gt;1）的子问题，分解与合并的代价为 s(n)：</p>
      <p class="formula">T(n) = c（n ≤ n₀）；　T(n) = aT(n/b) + s(n)（n &gt; n₀）</p>
      <p>当 s(n) 与 n 成正比、a = b = 2 时，T(n) = 2T(n/2) + Θ(n) 解得 <b>Θ(n log n)</b>（合并排序、理想快排即此情形）。</p>
      <h4>适用条件（4 条）</h4>
      <ol>
        <li>问题规模缩小到一定程度可以<b>容易地解决</b>；</li>
        <li>问题可以<b>分解为若干规模较小的同类问题</b>；</li>
        <li>子问题的解<b>可以合并</b>为原问题的解；</li>
        <li>各子问题<b>相互独立</b>（不包含公共子问题）。</li>
      </ol>
      <p><b>注意</b>：第 4 条关系到效率——若子问题不独立（重叠），分治会重复求解公共子问题，此时<b>动态规划更合适</b>。</p>
      <h4>经典应用</h4>
      <ul>
        <li>二分搜索 T(n) = T(n/2) + O(1) → O(log n)；</li>
        <li>合并排序 / 理想快排 T(n) = 2T(n/2) + Θ(n) → Θ(n log n)；</li>
        <li>大整数乘法、Strassen 矩阵乘法、最近点对问题。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch9-2', 'ch9-3', 'ch9-4', 'ch9-5', 'ch10-1'],
  },

  'ch9-2': {
    title: '递归与分治',
    content: `
      <h3>9.2 递归与分治</h3>
      <h4>三种使用递归的情形</h4>
      <ol>
        <li><b>定义是递归的</b>：阶乘 n! = n×(n−1)!（n=0 时为 1）、斐波那契 Fib(n) = Fib(n−1)+Fib(n−2)；</li>
        <li><b>数据结构是递归的</b>：单链表（一个结点 + 一条单链表仍是单链表）、二叉树、树；</li>
        <li><b>问题的解法是递归的</b>：汉诺塔问题——n 盘解 = (n−1 盘 A→B) + (最大盘 A→C) + (n−1 盘 B→C)，共 <code>2ⁿ − 1</code> 次移动。</li>
      </ol>
      <h4>构成递归的条件（易错）</h4>
      <ul>
        <li>子问题与原问题做<b>同样的事情且更简单</b>；</li>
        <li><b>必须有出口（递归结束条件）</b>，化简到非递归状况直接处理，不能无限制调用自身。</li>
      </ul>
      <h4>递归工作栈与活动记录</h4>
      <p>每次递归调用都要为<b>参数、局部变量、返回地址</b>分配存储——形成<b>递归工作记录（活动记录）</b>，按<b>后进先出的栈</b>组织。递推时层层向下（n! → (n−1)! → ... → 0!），回归时次序正好相反。递归的空间开销 = 栈中活动记录数 = 递归深度。</p>
      <h4>递归 → 非递归</h4>
      <ul>
        <li>递归简洁易编，但可能<b>效率低、重复计算多</b>（如 Fib）；</li>
        <li><b>单向递归/尾递归用迭代</b>实现（高效）：Fib 用 twoback、oneback 两个变量滚动推进，O(n)；尾递归（递归调用只有一句且在最后）可直接改成循环；</li>
        <li><b>一般递归借助栈</b>实现功能等价的非递归；</li>
        <li><b>动态规划</b>：存储子问题的解消除重复计算（Fib 递归调用次数 NumCall(k) = 2×Fib(k+1) − 1，指数级 → 迭代 O(n)）。</li>
      </ul>
    `,
    code: `// 汉诺塔：n 个盘子从 A 借助 B 移到 C，共 2^n - 1 次移动
void Hanoi(int n, char A, char B, char C) {
    if (n == 1)
        cout << " move " << A << " to " << C << endl;
    else {
        Hanoi(n - 1, A, C, B);   // 上面的 n-1 个盘 A -> B（借 C）
        cout << " move " << A << " to " << C << endl;  // 最大盘 A -> C
        Hanoi(n - 1, B, A, C);   // n-1 个盘 B -> C（借 A）
    }
}

// 斐波那契：递归（指数级重复计算）→ 迭代 O(n)
long FibIter(long n) {
    if (n <= 1) return n;
    long twoback = 0, oneback = 1, Current;
    for (int i = 2; i <= n; i++) {
        Current = twoback + oneback;
        twoback = oneback;
        oneback = Current;
    }
    return Current;
}`,
    complexity: null,
    related: ['ch9-1', 'ch3-1', 'ch10-1'],
  },

  'ch9-3': {
    title: '二分搜索(分治实现)',
    content: `
      <h3>9.3 二分搜索（分治视角）</h3>
      <p>对非降序数组 A[1..n] 判定元素 x 是否出现。分治视角：<b>分解</b>——与中点 A[mid] 比较后只保留一半；<b>求解</b>——在半个数组上递归（规模 n/2）；<b>合并</b>——无需合并（结果就是子问题的结果）。</p>
      <pre><code>low &lt;- 1;  high &lt;- n;  j &lt;- -1
while (low &lt;= high) and (j = -1):
    mid &lt;- ⌊(low + high)/2⌋
    if x = A[mid] then j &lt;- mid
    else if x &lt; A[mid] then high &lt;- mid - 1
    else low &lt;- mid + 1
return j</code></pre>
      <h4>复杂度分析</h4>
      <p>递归方程：</p>
      <p class="formula">T(n) = O(1)（n = 1）；T(n) = T(n/2) + O(1)（n &gt; 1）　⟹　T(n) = O(log n)</p>
      <h4>最坏比较次数推导（课件）</h4>
      <ul>
        <li>最好情形：比较 1 次即命中；</li>
        <li>每次循环抛弃约一半元素：第 j 次 while 循环时剩余元素个数为 ⌊n / 2^(j−1)⌋；</li>
        <li>搜索在子序列长度达到 1 时终止：⌊n/2^(j−1)⌋ = 1 ⟺ 2^(j−1) ≤ n &lt; 2^j ⟺ j = <b>⌊log n⌋ + 1</b>——最坏比较 ⌊log n⌋+1 次。</li>
      </ul>
      <h4>与 ch7-3 的关系</h4>
      <p>本节强调<b>分治框架与递归方程分析</b>；查找章节（<code>ch7-3</code>）侧重判定树与 ASL。二者结论一致：O(log n)，最坏 ⌊log n⌋+1 次比较。</p>
    `,
    complexity: { time: 'O(log n)', space: 'O(1)（迭代）/O(log n)（递归）' },
    related: ['ch7-3', 'ch9-1'],
  },

  'ch9-4': {
    title: '合并排序(分治实现)',
    content: `
      <h3>9.4 合并排序（Merge Sort，分治框架）</h3>
      <h4>分治三步（例：A = 8 4 3 1 6 2 9 7）</h4>
      <ol>
        <li><b>分解</b>：把数组对半分成 <code>8 4 3 1</code> 与 <code>6 2 9 7</code>；</li>
        <li><b>求解</b>：递归排序两个子数组（1 3 4 8 与 2 6 7 9）；</li>
        <li><b>合并</b>：用 MERGE 把两个有序子数组合并为整体有序数组。</li>
      </ol>
      <h4>MERGE 合并过程</h4>
      <p>设两段有序区 A[p..q] 与 A[q+1..r]，指针 s、t 分别指向两段起点，k 指向暂存数组 B：比较 A[s] 与 A[t]，<b>较小者加入 B</b> 并移动相应指针；直到一段取完，把<b>剩余段拷贝</b>到 B，最后 A ← B。每次合并 Θ(n)。</p>
      <h4>递归方程与复杂度</h4>
      <p class="formula">T(n) = 2T(n/2) + Θ(n)　⟹　T(n) = Θ(n log n)</p>
      <ul>
        <li>合并是 Θ(n)，递归树高 log₂n，每层合并总代价 Θ(n)；</li>
        <li><b>代价是需要 Θ(n) 的辅助空间</b>（数组 B）；</li>
        <li>对比快速排序：<b>快排的优势是原位 (in-place) 排序</b>，不需要额外辅助存储（但最坏 O(n²)；合并排序任何情况都 Θ(n log n)）。</li>
      </ul>
      <p>排序章节的实现细节、稳定性与迭代版见 <code>ch8-7</code>。</p>
    `,
    code: `// 合并两个有序子数组 A[p..q] 与 A[q+1..r]
void MERGE(int A[], int B[], int p, int q, int r) {
    int s = p, t = q + 1, k = p;
    while (s <= q && t <= r) {         // 两段都未取完
        if (A[s] <= A[t]) B[k++] = A[s++];
        else              B[k++] = A[t++];
    }
    if (s == q + 1)                    // 前段取完：抄后段剩余
        while (t <= r) B[k++] = A[t++];
    else                               // 后段取完：抄前段剩余
        while (s <= q) B[k++] = A[s++];
    for (int i = p; i <= r; i++)       // 写回原数组
        A[i] = B[i];
}

// 合并排序主算法：对半分治
void MERGESORT(int A[], int B[], int low, int high) {
    if (low < high) {
        int mid = (low + high) / 2;
        MERGESORT(A, B, low, mid);       // 排左半
        MERGESORT(A, B, mid + 1, high);  // 排右半
        MERGE(A, B, low, mid, high);     // 合并
    }
}`,
    complexity: { time: 'Θ(n log n)', space: 'Θ(n)' },
    related: ['ch8-7', 'ch9-1', 'ch9-5'],
  },

  'ch9-5': {
    title: '快速排序(分治实现)',
    content: `
      <h3>9.5 快速排序（Quicksort，分治框架）</h3>
      <p><b>历史</b>：C. A. R. Hoare 于 <b>1960 年</b>提出 Quicksort，是当前使用最广泛的算法之一；<b>1980 年获图灵奖</b>，2000 年被封为英国爵士。</p>
      <h4>分治三步</h4>
      <ol>
        <li><b>分解</b>：SPLIT 用 A[low] 作基准，把数组<b>原位 (in-place)</b> 划分为 ≤ 基准与 ≥ 基准两部分，返回基准新位置 w；</li>
        <li><b>求解</b>：递归对 A[low..w−1] 与 A[w+1..high] 快速排序；</li>
        <li><b>合并</b>：<b>无需合并</b>——划分后基准已就位，子数组仍在原数组中。</li>
      </ol>
      <h4>SPLIT 原位划分（挖坑法，例：4 6 3 1 8 7 2 5，x=4）</h4>
      <p>基准 x 暂存，low 处成"坑"；high 端找 &lt; x 的元素填坑（2 填入，坑移到 high），low 端找 &gt; x 的元素填坑（6 填入，坑移到 low）……空位左右交替移动，最后 x 放回坑位 w=3：得 <code>2 1 3 4 8 7 6 5</code>。</p>
      <h4>复杂度分析</h4>
      <table>
        <tr><th>情形</th><th>递归方程</th><th>复杂度</th></tr>
        <tr><td>理想（每次划分规模相当）</td><td>T(n) = 2T(n/2) + Θ(n)</td><td>Θ(n log n)（平均）</td></tr>
        <tr><td>最差（已排序/逆序，划分极不均衡）</td><td>T(n) = T(n−1) + Θ(n)</td><td>Θ(n²)</td></tr>
      </table>
      <ul>
        <li>SPLIT 是 Θ(n) 的<b>原位划分</b>——快排<b>优于合并排序</b>之处：不需要 Θ(n) 辅助空间；</li>
        <li><b>随机化</b>：划分前随机取一元素与首位交换作基准，最坏仍 O(n²) 但概率极小（见 <code>ch8-6</code>）。</li>
      </ul>
    `,
    code: `// SPLIT：用 A[low] 作基准原位划分，返回基准新位置 w
int SPLIT(int A[], int low, int high) {
    int x = A[low];                     // 基准暂存，low 处为"坑"
    while (low < high) {
        while (low < high && A[high] >= x) high--;
        A[low++] = A[high];             // 右端小元素填左坑
        while (low < high && A[low] <= x) low++;
        A[high--] = A[low];             // 左端大元素填右坑
    }
    A[low] = x;                         // 基准放入最终位置
    return low;                         // w = low
}

// QUICKSORT 主算法
void QUICKSORT(int A[], int low, int high) {
    if (low < high) {
        int w = SPLIT(A, low, high);    // 划分，w 为基准新位置
        QUICKSORT(A, low, w - 1);
        QUICKSORT(A, w + 1, high);
    }
}`,
    complexity: { time: '平均Θ(n log n)，最差Θ(n²)', space: 'O(log n)递归栈（原位排序）' },
    related: ['ch8-6', 'ch9-1', 'ch9-4'],
  },

  'ch9-6': {
    title: '大整数乘法',
    content: `
      <h3>9.6 大整数乘法（Karatsuba 算法）</h3>
      <p>问题：两个 n 位大整数相乘。直接按竖式逐位相乘需要 <b>O(n²)</b> 次一位乘法。分治可以更快。</p>
      <h4>直接分治（仍是 O(n²)）</h4>
      <p>把 n 位数从中间分成两半（m = n/2）：x = x₁·2^m + x₀，y = y₁·2^m + y₀，则</p>
      <p class="formula">x·y = x₁y₁·2^{2m} + (x₁y₀ + x₀y₁)·2^m + x₀y₀</p>
      <p>需要 <b>4 次</b> n/2 位乘法（x₁y₁、x₁y₀、x₀y₁、x₀y₀）加 O(n) 次移位与加法：T(n) = 4T(n/2) + O(n) → <b>O(n²)</b>——直接分治没有改进。</p>
      <h4>Karatsuba 改进：4 次乘减为 3 次</h4>
      <p>关键恒等式：</p>
      <p class="formula">x₁y₀ + x₀y₁ = (x₀ + x₁)(y₀ + y₁) − x₀y₀ − x₁y₁</p>
      <p>只需计算 3 个乘积：(x₀+x₁)(y₀+y₁)、x₀y₀、x₁y₁，中间项用加减法拼出（加减法是 O(n) 的）：</p>
      <p class="formula">T(n) = 3T(n/2) + O(n)　⟹　T(n) = O(n^{log₂3}) ≈ O(n^1.585)</p>
      <h4>要点</h4>
      <ul>
        <li>改进来自<b>减少子问题个数 a</b>（4 → 3），而合并代价不变——与 Strassen（<code>ch9-7</code>）思想完全一致；</li>
        <li>递归深度 log₂n，到个位数（或机器字长）直接相乘；</li>
        <li>易错：中间项公式展开后 2^m 项系数是 (x₁y₀ + x₀y₁)，别漏掉 2^{2m} 与 2^m 两种移位。</li>
      </ul>
    `,
    complexity: { time: 'O(n^1.585)（log2(3)）', space: 'O(n)' },
    related: ['ch9-1', 'ch9-7'],
  },

  'ch9-7': {
    title: 'Strassen矩阵乘法',
    content: `
      <h3>9.7 Strassen 矩阵乘法</h3>
      <p>问题：n×n 矩阵 C = A×B，cᵢⱼ = Σ aᵢₖ·bₖⱼ。</p>
      <h4>方法一：直接相乘 Θ(n³)</h4>
      <p>共 n³ 次标量乘法、n²(n−1) 次标量加法，T(n) = Θ(n³)。</p>
      <h4>方法二：分块矩阵（直接分治）Θ(n³)——没有改进</h4>
      <p>矩阵分块（n 为 2 的幂）：</p>
      <pre><code>C11 = A11*B11 + A12*B21      C12 = A11*B12 + A12*B22
C21 = A21*B11 + A22*B21      C22 = A21*B12 + A22*B22</code></pre>
      <p>需 <b>8 次</b> (n/2)×(n/2) 子矩阵乘法 + 4 次子矩阵加法：</p>
      <p class="formula">T(n) = 8T(n/2) + 4(n/2)²·a　⟹　T(n) = Θ(n^{log₂8}) = Θ(n³)</p>
      <p><b>直接分治并没有降低复杂度</b>（8 = 2³，指数恰好抵消降维收益）。</p>
      <h4>方法三：Strassen 算法（1969，改进分治）Θ(n^2.81)</h4>
      <ul>
        <li>Volker Strassen 于 1969 年提出，是<b>第一个在朴素 O(n³) 之上更快的矩阵乘法算法</b>；</li>
        <li>核心思想：通过巧妙的加减组合，把 8 次子矩阵乘法<b>减少为 7 次</b>，代价是约 18 次 (n/2)² 规模的加法；</li>
        <li>递归方程：</li>
      </ul>
      <p class="formula">T(n) = 7T(n/2) + 18(n/2)²·a　⟹　T(n) = Θ(n^{log₂7}) ≈ Θ(n^2.81)</p>
      <h4>三种方法对比</h4>
      <table>
        <tr><th>方法</th><th>子乘法次数</th><th>复杂度</th></tr>
        <tr><td>直接相乘</td><td>—</td><td>Θ(n³)</td></tr>
        <tr><td>分块矩阵（直接分治）</td><td>8 次</td><td>Θ(n³)</td></tr>
        <tr><td>Strassen（改进分治）</td><td>7 次</td><td>Θ(n^2.81)</td></tr>
      </table>
      <p><b>要点</b>：与大整数乘法（<code>ch9-6</code>）同理——降低子问题个数 a 是分治提速的关键；Strassen 对中大规模稠密矩阵仍是实用方法，后续理论改进更多但实用性有限。</p>
    `,
    complexity: { time: 'Θ(n^2.81)（log2(7)）', space: 'O(n²)' },
    related: ['ch9-1', 'ch9-6'],
  },

  'ch9-8': {
    title: '最近点对问题',
    content: `
      <h3>9.8 平面最近点对问题（分治）</h3>
      <p>问题：平面上给定 n 个点，找距离最近的两个点。朴素做法两两比较 <code>O(n²)</code>；分治可到 <code>O(n log n)</code>。</p>
      <h4>分治三步</h4>
      <ol>
        <li><b>分解</b>：把所有点按 <b>x 坐标排序</b>，取中线 x = m 把点集分为左、右两半（各 n/2 个点）；</li>
        <li><b>求解</b>：递归求出左半部最近点对距离 dL、右半部 dR，令 <code>d = min(dL, dR)</code>；</li>
        <li><b>合并（关键）</b>：最近点对还可能<b>横跨中线</b>——只需检查到中线距离 &lt; d 的<b>垂直条带</b>（宽 2d）内的点：把条带内点按 <b>y 坐标排序</b>，对每个点只需与 y 方向上紧随其后的<b>常数个</b>（≤7 个，几何性质保证）点比较；条带检查为 O(n)。</li>
      </ol>
      <p class="formula">T(n) = 2T(n/2) + O(n)　⟹　T(n) = O(n log n)</p>
      <h4>为什么条带内只需检查常数个后继点</h4>
      <p>条带内任一点 p 与其后继点 q 若距离 &lt; d，则两点必位于一个 d×2d 的小矩形内；而该矩形分属中线两侧的部分中，任意两点距离都 ≥ d（否则与 dL/dR 的定义矛盾），故矩形内至多容纳常数个点——沿 y 序只需向后检查常数个。</p>
      <h4>要点与易错点</h4>
        <ul>
        <li>预处理排序一次 O(n log n)；若每层递归都重新按 x/y 排序则退化为 O(n log²n)——可预排序后<b>归并方式维护</b>两个有序序列；</li>
        <li>距离比较用<b>平方距离</b>可避免开方（比较目的不变）；</li>
        <li>合并步骤是"筛选 + 常数次比较"，不是把两半点两两比较。</li>
      </ul>
    `,
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    related: ['ch9-1', 'ch9-4'],
  },

  // === Chapter 10: 动态规划 ===
  'ch10-1': {
    title: '动态规划基本思想',
    content: `
      <h3>10.1 动态规划 (Dynamic Programming)</h3>
      <h4>引例：斐波那契数列（理解 DP 的起点）</h4>
      <ul>
        <li>递归定义 f(n)=1（n=1,2），f(n)=f(n−1)+f(n−2)（n≥3）；递归算法<b>简洁但效率低下</b>——大量重复计算；</li>
        <li>递归调用次数 T(n) = T(n−1) + T(n−2)，解得 <code>T(n) ≈ 0.447 × 1.618ⁿ</code>——<b>指数级</b>：T(100) ≈ 3.53×10²⁰，每秒 10⁸ 次需约 11 万年；</li>
        <li>解决方法：<b>用变量/表格存储中间结果</b>，消除重复计算——迭代算法 T(n) = <b>Θ(n)</b>。指数级 → 线性级，这正是动态规划的威力。</li>
      </ul>
      <h4>核心思想</h4>
      <p>动态规划的实质是<b>分治 + 消除冗余</b>：将问题实例分解为更小的、相似的子问题，并<b>存储子问题的解以避免重复计算</b>，用来解决<b>最优化问题</b>。</p>
      <ul>
        <li>与<b>分治</b>的区别：分治的子问题<b>相互独立</b>；动态规划的子问题<b>相互重叠</b>，所以必须"存表"；</li>
        <li>与<b>贪心</b>的区别：DP 穷举所有可行子决策取最优，不依赖局部最优选择。</li>
      </ul>
      <h4>设计步骤（四步法）</h4>
      <ol>
        <li><b>找出最优解的性质，刻划其结构特征</b>（最优子结构）；</li>
        <li><b>递归地定义最优值</b>（写出状态转移方程）；</li>
        <li><b>以自底向上的方式计算出最优值</b>（填表，确定计算顺序）；</li>
        <li><b>根据计算最优值时得到的信息，构造最优解</b>（记录决策、回溯）。</li>
      </ol>
      <h4>两种实现方式</h4>
      <ul>
        <li><b>自顶向下（记忆化搜索）</b>：递归 + 缓存已算过的子问题；</li>
        <li><b>自底向上（递推/填表）</b>：从小规模开始按依赖顺序求解，通常更省栈。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch10-2', 'ch10-3', 'ch10-4', 'ch10-6'],
  },

  'ch10-2': {
    title: '最优子结构与重叠子问题',
    content: `
      <h3>10.2 最优子结构与重叠子问题</h3>
      <h4>最优子结构（适用前提）</h4>
      <p><b>定义</b>：问题的<b>最优解包含其子问题的最优解</b>——即原问题的解可以由子问题的最优解构造出来。这是能用动态规划的<b>前提</b>。</p>
      <ul>
        <li>矩阵链：C[i,j] 的最优划分必由 C[i,k−1] 与 C[k,j] 的最优划分组成；</li>
        <li>LCS：X 与 Y 的 LCS 含 X' 与 Y'（去掉尾字符后）的 LCS；</li>
        <li>最短路径：v→w 的最短路径上，任何中间顶点 u 处截断，两段也都是最短路径（"最短路径的最优子结构"）；</li>
        <li><b>反例</b>：最长<b>简单</b>路径不具有最优子结构（子路径可以不最长）。</li>
      </ul>
      <h4>重叠子问题（使用 DP 的理由）</h4>
      <p><b>定义</b>：递归求解时<b>同一子问题被反复计算多次</b>，而不是产生全新的子问题。</p>
      <ul>
        <li>Fibonacci：Fib(5) 的递归调用树中 Fib(3) 被算 2 次、Fib(2) 被算 3 次……调用总次数 NumCall(k) = 2×Fib(k+1) − 1，指数级；</li>
        <li>分治（如归并排序）的子问题互不重叠，无需存表；DP 的子问题数通常只是 n、n² 或 nC 的<b>多项式规模</b>，存表后每个子问题只算一次。</li>
      </ul>
      <h4>两种实现方式对比</h4>
      <table>
        <tr><th></th><th>自顶向下（备忘录）</th><th>自底向上（填表）</th></tr>
        <tr><td>方式</td><td>递归 + 缓存，用到才算</td><td>按依赖顺序从小规模递推</td></tr>
        <tr><td>优点</td><td>只计算需要的子问题</td><td>无递归开销，顺序清晰</td></tr>
        <tr><td>缺点</td><td>递归栈开销</td><td>可能计算用不到的子问题</td></tr>
      </table>
      <h4>易错点</h4>
      <ul>
        <li>有<b>最优子结构但子问题不重叠</b> → 用分治即可（如归并排序）；</li>
        <li>子问题<b>重叠但不满足最优子结构</b> → DP 也不适用；</li>
        <li>定义状态时维度要"足够"：如 0-1 背包必须同时记录"前 i 个物品"和"剩余容量 j"两个维度，否则无法无后效性地转移。</li>
      </ul>
    `,
    complexity: null,
    related: ['ch10-1', 'ch10-3', 'ch10-4', 'ch10-6'],
  },

  'ch10-3': {
    title: '矩阵链乘法',
    content: `
      <h3>10.3 矩阵链相乘（Matrix-Chain Multiplication）</h3>
      <h4>问题</h4>
      <p>n 个矩阵连乘 M₁M₂...Mₙ，求：<b>最小乘法次数（最优值）</b>与对应的<b>结合方式（最优解）</b>。乘法次数公式：<b>p×q 矩阵乘 q×r 矩阵需 p·q·r 次标量乘法</b>。</p>
      <h4>观察：结合方式影响巨大</h4>
      <p>M₁(2×10)、M₂(10×2)、M₃(2×10)：</p>
      <ul>
        <li>(M₁×M₂)×M₃：(2·10·2) + (2·2·10) = 40+40 = <b>80</b> 次；</li>
        <li>M₁×(M₂×M₃)：(10·2·10) + (2·10·10) = 200+200 = <b>400</b> 次。</li>
      </ul>
      <h4>穷举不可行</h4>
      <p>结合方式数 f(n) 满足 f(n) = Σ f(k)·f(n−k)（划分点 k），即 <b>Catalan 数</b>：</p>
      <p class="formula">f(n) = C_{n−1} ≈ 4ⁿ / (4√π·n^1.5) = Ω(4ⁿ / n^1.5)——指数级，穷举不可行</p>
      <h4>动态规划求解</h4>
      <p>矩阵规模由向量 r₁..r_{n+1} 给出（Mᵢ 是 rᵢ × rᵢ₊₁ 阵）。设 <b>C[i,j]</b> = 计算 Mᵢ...Mⱼ 所需最小乘法次数；在"最后一次相乘"的划分点 k 处分开：</p>
      <p class="formula">C[i,i] = 0；　C[i,j] = min{ C[i,k−1] + C[k,j] + rᵢ·rₖ·rⱼ₊₁ }，i &lt; k ≤ j</p>
      <p>计算顺序：<b>按对角线 d（链长 j−i）从小到大填表</b>——先算所有长度 1 的子链，再长度 2……最后 C[1,n]。</p>
      <h4>完整实例（课件）</h4>
      <p>r = (5, 10, 4, 6, 10, 2)，即 M₁=5×10, M₂=10×4, M₃=4×6, M₄=6×10, M₅=10×2：</p>
      <table>
        <tr><th>C</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        <tr><th>1</th><td>0</td><td>200</td><td>320</td><td>620</td><td><b>348</b></td></tr>
        <tr><th>2</th><td></td><td>0</td><td>240</td><td>640</td><td>248</td></tr>
        <tr><th>3</th><td></td><td></td><td>0</td><td>240</td><td>168</td></tr>
        <tr><th>4</th><td></td><td></td><td></td><td>0</td><td>120</td></tr>
        <tr><th>5</th><td></td><td></td><td></td><td></td><td>0</td></tr>
      </table>
      <p>演算示例：C[1,3]：k=3 时 200+0+5·4·6=320 &lt; k=2 时 0+240+5·10·6=540，取 320。最优值 <b>C[1,5] = 348</b>；记录每个 C[i,j] 取 min 的 k 即可<b>回溯构造最优结合方式</b>。</p>
      <h4>复杂度</h4>
      <p>三重循环（对角线 d、起点 i、划分点 k），求和化简得</p>
      <p class="formula">T(n) = Θ(n³)，空间 Θ(n²)</p>
    `,
    code: `// 矩阵链乘法：r[1..n+1] 为矩阵规模，返回最小乘法次数
int matrixChain(int r[], int n) {
    // C[i][j]：Mi..Mj 的最小乘法次数；按对角线 d 填表
    int C[N][N] = {0};
    for (int i = 1; i <= n; i++) C[i][i] = 0;      // 对角线 d0
    for (int d = 1; d <= n - 1; d++) {             // 对角线 d1..d(n-1)
        for (int i = 1; i <= n - d; i++) {
            int j = i + d;                         // j - i = d
            C[i][j] = INT_MAX;
            for (int k = i + 1; k <= j; k++) {     // 枚举划分点 k
                int cost = C[i][k-1] + C[k][j] + r[i] * r[k] * r[j+1];
                if (cost < C[i][j]) C[i][j] = cost;
            }
        }
    }
    return C[1][n];                                // 最优值
}`,
    complexity: { time: 'Θ(n³)', space: 'Θ(n²)' },
    related: ['ch10-1', 'ch10-2', 'ch10-4'],
  },

  'ch10-4': {
    title: '最长公共子序列 (LCS)',
    content: `
      <h3>10.4 最长公共子序列 (LCS)</h3>
      <h4>子序列定义（易错）</h4>
      <p>A = a₁a₂...aₙ 的子序列是形如 a_{i₁}a_{i₂}...a_{i_k} 的串，其中 <b>1 ≤ i₁ &lt; i₂ &lt; ... &lt; i_k ≤ n</b>——<b>保序抽取、可跳过字符</b>。例：A=zxy 的子序列共 2ⁿ=8 个（"", z, x, y, zx, zy, xy, zxy），但 xz、yz、xyz <b>不是</b>（不保序）。</p>
      <p>问题：给定字符串 A（长 n）与 B（长 m），求<b>最长公共子序列的长度</b>及对应子序列。</p>
      <h4>穷举不可行</h4>
      <p>A 有 2ⁿ 个子序列，逐一判断是否 B 的子序列需 Θ(m)，总时间 <b>Θ(m·2ⁿ)</b>，指数级。</p>
      <h4>递归定义最优值</h4>
      <p>设 C[i,j] = 前缀 a₁..aᵢ 与 b₁..bⱼ 的 LCS 长度：</p>
      <pre><code>C[i,j] = 0                                  若 i = 0 或 j = 0
C[i,j] = C[i-1,j-1] + 1                     若 a[i] == b[j]（尾字符相等）
C[i,j] = max{ C[i,j-1], C[i-1,j] }          若 a[i] != b[j]（丢一个尾字符）</code></pre>
      <p>三情形图解：相等时公共字符 aᵢ/bⱼ 加入 LCS；不等时"丢掉 aᵢ"或"丢掉 bⱼ"取较优。</p>
      <h4>实例（课件）</h4>
      <p>A = xyxxz，B = zxzyyz：逐行填 (n+1)×(m+1) 表格。演算：a₃≠b₄（x≠y）→ C[3,4] = max{C[3,3], C[2,4]} = max{1,2} = 2；a₅==b₆（z==z）→ C[5,6] = C[4,5]+1 = 3。<b>答案：LCS 长度 = 3</b>（对应子序列 x y z）。</p>
      <h4>复杂度</h4>
      <ul>
        <li>填表时间 <code>Θ(nm)</code>，空间 Θ(nm)（可滚动优化到 O(min(n,m))）；</li>
        <li><b>构造最优解</b>：从 C[n,m] 回溯——相等则记录 aᵢ 并走向左上角，否则走向较大邻居。</li>
      </ul>
      <h4>相关变形</h4>
      <ul>
        <li>最长递增子序列 LIS（<code>ch10-5</code>）可转化为 LCS 或直接 DP；</li>
        <li>编辑距离（<code>ch10-7</code>）与 LCS 同框架，转移式多了"替换"分支。</li>
      </ul>
    `,
    code: `int lcs(string X, string Y) {
    int m = X.length(), n = Y.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (X[i-1] == Y[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;      // 尾字符相等
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);  // 丢一个尾字符
        }
    }
    return dp[m][n];      // LCS 长度；回溯 dp 表可构造子序列本身
}`,
    complexity: { time: 'Θ(nm)', space: 'Θ(nm)' },
    related: ['ch10-1', 'ch10-2', 'ch10-5', 'ch10-7'],
  },

  'ch10-5': {
    title: '最长递增子序列 (LIS)',
    content: `
      <h3>10.5 最长递增子序列 (LIS)</h3>
      <p>问题：给定序列 a₁..aₙ，求其<b>最长递增（严格上升）子序列</b>的长度。它是课程动态规划框架（状态定义 → 转移方程 → 填表 → 回溯构造）的典型应用。</p>
      <h4>解法一：O(n²) 线性 DP</h4>
      <p><b>状态定义（以 i 结尾）</b>：<code>dp[i]</code> = 以 a[i] <b>结尾</b>的最长递增子序列长度（必须以 i 结尾才能保证无后效性地转移）。</p>
      <p class="formula">dp[i] = max{ dp[j] + 1 }，其中 0 ≤ j &lt; i 且 a[j] &lt; a[i]；dp[i] 初始为 1</p>
      <p>答案 = max{ dp[i] }（<b>易错：不是 dp[n−1]</b>，LIS 可以结束在任何位置）。双循环填表，时间 O(n²)、空间 O(n)；记录每个 dp[i] 取自哪个 j 即可回溯构造子序列。</p>
      <h4>解法二：贪心 + 二分，O(n log n)</h4>
      <ul>
        <li>维护数组 <code>tails[k]</code>：长度为 k+1 的递增子序列的<b>最小可能结尾值</b>；tails 恒有序（递增）；</li>
        <li>对每个 a[i]：在 tails 中二分查找第一个 ≥ a[i] 的位置，<b>替换</b>之（若无则追加）—— tails 长度即为当前 LIS 长度；</li>
        <li>正确性：替换使"同长度子序列的结尾尽量小"，给后续元素留更多接续机会。此法只能求长度，构造具体序列需额外记录前驱。</li>
      </ul>
      <h4>例</h4>
      <p>a = [10, 9, 2, 5, 3, 7, 101, 18]：dp = [1,1,1,2,2,3,4,4]，答案 <b>4</b>（如 2,3,7,101 或 2,5,7,18）。</p>
      <h4>与 LCS 的关系（易错）</h4>
      <ul>
        <li>LIS 可转化为"原序列与<b>排序去重后</b>的原序列"的 LCS（<code>ch10-4</code>），复杂度 O(n²)；</li>
        <li>"递增"若允许相等（非降序），转移条件改为 a[j] ≤ a[i]；</li>
        <li>O(n log n) 解法中 tails 数组<b>本身不一定是一个合法的 LIS</b>，但其长度始终正确。</li>
      </ul>
    `,
    code: `// 解法一：O(n^2) 线性 DP
int lis1(int a[], int n) {
    vector<int> dp(n, 1);              // dp[i]: 以 a[i] 结尾的 LIS 长度
    int best = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i] && dp[j] + 1 > dp[i])
                dp[i] = dp[j] + 1;     // 接在 a[j] 之后
        if (dp[i] > best) best = dp[i];
    }
    return best;                       // 答案是 max{dp[i]}
}

// 解法二：贪心 + 二分，O(n log n)
int lis2(int a[], int n) {
    vector<int> tails;                 // tails[k]: 长k+1的LIS最小结尾
    for (int i = 0; i < n; i++) {
        auto it = lower_bound(tails.begin(), tails.end(), a[i]);
        if (it == tails.end()) tails.push_back(a[i]);  // 延长 LIS
        else *it = a[i];               // 替换，让结尾更小
    }
    return tails.size();
}`,
    complexity: { time: 'O(n²) 或 O(n log n)', space: 'O(n)' },
    related: ['ch10-1', 'ch10-4'],
  },

  'ch10-6': {
    title: '0-1背包问题',
    content: `
      <h3>10.6 0-1 背包问题</h3>
      <h4>问题与形式化</h4>
      <p>n 个物品 u₁..uₙ，物品 i 重量 wᵢ、价值 vᵢ，背包承重 C。每个物品<b>要么装（1）要么不装（0）</b>，求能装入背包的最大总价值：</p>
      <p class="formula">max Σ vᵢxᵢ　s.t. Σ wᵢxᵢ ≤ C，xᵢ ∈ {0,1}</p>
      <h4>递归定义最优值</h4>
      <p><b>V[i,j]</b> = 从前 i 个物品中选一部分装入承重 j 的背包能取得的最大价值（i=n、j=C 时即原问题的解）：</p>
      <pre><code>V[i,j] = 0                                       若 i = 0 或 j = 0
V[i,j] = V[i-1, j]                               若 j &lt; wᵢ（装不下，不装）
V[i,j] = max{ V[i-1,j], V[i-1,j-wᵢ] + vᵢ }       若 j ≥ wᵢ（不装 or 装）</code></pre>
      <p>两分支：<b>Case 1 不装 uᵢ</b>——价值即 V[i−1,j]；<b>Case 2 装 uᵢ</b>——先给 uᵢ 留出 wᵢ 容量（j−wᵢ），再加 vᵢ。</p>
      <h4>实例（课件）</h4>
      <p>C=9；w = (2,3,4,5)，v = (3,4,5,7)。演算 V[3,7]（w₃=4 ≤ 7）：</p>
      <p class="formula">V[3,7] = max{ V[2,7], V[2, 7−4] + 5 } = max{ 7, 4+5 } = 9</p>
      <table>
        <tr><th>i＼j</th><th>0</th><th>2</th><th>3</th><th>4</th><th>5</th><th>7</th><th>9</th></tr>
        <tr><th>1 (w2,v3)</th><td>0</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
        <tr><th>2 (w3,v4)</th><td>0</td><td>3</td><td>4</td><td>4</td><td>7</td><td>7</td><td>7</td></tr>
        <tr><th>3 (w4,v5)</th><td>0</td><td>3</td><td>4</td><td>4</td><td>7</td><td>9</td><td>12*</td></tr>
        <tr><th>4 (w5,v7)</th><td>0</td><td>3</td><td>4</td><td>5</td><td>7</td><td>10</td><td><b>12</b></td></tr>
      </table>
      <p>（表中只列部分列，完整表为 j = 0..9。）<b>答案 V[4,9] = 12</b>：由 V[3,9]=12 继承，对应选择物品 1、2、3——w = 2+3+4 = 9 恰满，v = 3+4+5 = 12；另一最优解为物品 3、4（w=9, v=12）。</p>
      <h4>复杂度</h4>
      <ul>
        <li>二维表 (n+1)×(C+1) 每格 O(1) 转移：<code>T(n) = Θ(nC)</code>——<b>伪多项式时间</b>（关于数值 C 是多项式，关于输入位数是指数）；</li>
        <li><b>一维滚动优化</b>：dp[j] = max(dp[j], dp[j−w[i]] + v[i])，内层 j 必须<b>从大到小（逆序）遍历</b>——保证 dp[j−w[i]] 还是"上一行"的值；<b>若正序遍历，同一物品会被重复装入，变成完全背包</b>（易错重点）。</li>
      </ul>
    `,
    code: `int knapsack(int W, vector<int>& w, vector<int>& v, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j];  // Case 1：不装第 i 件
            if (j >= w[i-1])        // Case 2：装第 i 件
                dp[i][j] = max(dp[i][j], dp[i-1][j-w[i-1]] + v[i-1]);
        }
    }
    return dp[n][W];
}

// 空间优化（一维滚动数组）：内层必须逆序遍历
int knapsack_opt(int W, vector<int>& w, vector<int>& v, int n) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++)
        for (int j = W; j >= w[i]; j--)        // 逆序！防止重复装入
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}`,
    complexity: { time: 'Θ(nC)', space: 'O(C)（滚动优化后）' },
    related: ['ch10-1', 'ch10-2', 'ch10-3'],
  },

  'ch10-7': {
    title: '编辑距离',
    content: `
      <h3>10.7 编辑距离（Levenshtein 距离）</h3>
      <h4>问题</h4>
      <p>给定字符串 A（长 n）与 B（长 m），允许三种编辑操作：<b>插入</b>一个字符、<b>删除</b>一个字符、<b>替换（修改）</b>一个字符，求把 A 变成 B 所需的<b>最少编辑操作次数</b>。应用于拼写检查、DNA 序列比对、模糊搜索。</p>
      <h4>递归定义最优值（与 LCS 同框架）</h4>
      <p>设 dp[i][j] = a₁..aᵢ 变换到 b₁..bⱼ 的最少编辑次数：</p>
      <pre><code>dp[i][0] = i，dp[0][j] = j          （边界：全删 / 全插入）
若 a[i] == b[j]：dp[i][j] = dp[i-1][j-1]                     （无需编辑）
否则：dp[i][j] = 1 + min{ dp[i-1][j]（删除a[i]）,
                          dp[i][j-1]（插入b[j]）,
                          dp[i-1][j-1]（替换a[i]为b[j]） }</code></pre>
      <p>三种操作各对应表格中"上、左、左上"三个邻居 +1。注意与 LCS 的差别：<b>LCS 没有替换分支</b>；编辑距离字符相等时直接继承左上角（不加 1）。</p>
      <h4>例</h4>
      <p>A = "kitten"，B = "sitting"：kitten → sitten（替换 k→s）→ sittin（替换 e→i）→ sitting（末尾插入 g），编辑距离 = <b>3</b>。</p>
      <h4>复杂度与要点</h4>
      <ul>
        <li>填 (n+1)×(m+1) 表，时间 <code>Θ(nm)</code>，空间 Θ(nm)（可滚动优化到 O(min(n,m))）；</li>
        <li>与 LCS 的关系：若只允许插入与删除（不允许替换），编辑距离 = n + m − 2·LCS(A,B)；</li>
        <li>易错点：边界初始化 dp[i][0]=i、dp[0][j]=j（空串到长度 i/j 的串需 i/j 次插入，反方向需删除）；比较的是<b>字符相等</b>时才免编辑，不是排序码。</li>
      </ul>
    `,
    code: `int editDistance(const string& A, const string& B) {
    int n = A.length(), m = B.length();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 0; i <= n; i++) dp[i][0] = i;   // 边界：删除 i 个
    for (int j = 0; j <= m; j++) dp[0][j] = j;   // 边界：插入 j 个
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (A[i-1] == B[j-1])
                dp[i][j] = dp[i-1][j-1];         // 尾字符相同，免编辑
            else
                dp[i][j] = 1 + min( min( dp[i-1][j],   // 删除 A[i]
                                         dp[i][j-1] ), // 插入 B[j]
                                    dp[i-1][j-1] );   // 替换
        }
    return dp[n][m];
}`,
    complexity: { time: 'Θ(nm)', space: 'Θ(nm)' },
    related: ['ch10-4', 'ch10-1'],
  },
};
