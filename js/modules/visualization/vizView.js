/**
 * VizView - Visualization View Controller
 * Connects the renderer, animator, and algorithm modules
 * Handles UI interactions and data flow
 */
(function () {
    'use strict';

    // 课件默认数据（Lesson04）：KMP 匹配示例
    // T = "acabaabaabcacaabc"，P = "abaabcac"，next = [-1,0,0,1,1,2,0,1]
    const DEFAULT_STRINGS = { T: 'acabaabaabcacaabc', P: 'abaabcac' };

    // 课件默认稀疏矩阵（Lesson04 4.3.4 示例，6 行 7 列 8 个非零元）
    // num = [1,1,1,2,0,2,1]，cpot = [0,1,2,3,5,5,7]
    const DEFAULT_SPARSE = {
        rows: 6,
        cols: 7,
        triples: [
            { r: 0, c: 3, v: 22 }, { r: 0, c: 6, v: 15 },
            { r: 1, c: 1, v: 11 }, { r: 1, c: 5, v: 17 },
            { r: 2, c: 3, v: -6 },
            { r: 3, c: 5, v: 39 },
            { r: 4, c: 0, v: 91 },
            { r: 5, c: 2, v: 28 }
        ]
    };

    const VizView = {
        renderer: null,
        animator: null,
        currentAlgo: null,
        currentData: null,
        currentCategory: 'sort',
        currentStrings: null,   // KMP 输入 {T, P}
        currentTriples: null,   // 快速转置输入 {rows, cols, triples}
        comparisonCount: 0,
        swapCount: 0,

        // Algorithm registry
        algorithms: {
            // Sorting
            'bubble-sort': { category: 'sort', name: '冒泡排序', fn: 'bubbleSort' },
            'selection-sort': { category: 'sort', name: '选择排序', fn: 'selectionSort' },
            'insertion-sort': { category: 'sort', name: '插入排序', fn: 'insertionSort' },
            'merge-sort': { category: 'sort', name: '归并排序', fn: 'mergeSort' },
            'quick-sort': { category: 'sort', name: '快速排序', fn: 'quickSort' },
            'heap-sort': { category: 'sort', name: '堆排序', fn: 'heapSort' },
            // Linked list
            'list-insert': { category: 'list', name: '链表插入', fn: 'listInsert' },
            'list-delete': { category: 'list', name: '链表删除', fn: 'listDelete' },
            'list-reverse': { category: 'list', name: '链表反转', fn: 'listReverse' },
            // 顺序表 & 队列（courseViz）
            'array-insert': { category: 'seqlist', name: '顺序表插入', fn: 'arrayInsert' },
            'array-delete': { category: 'seqlist', name: '顺序表删除', fn: 'arrayDelete' },
            'circular-queue': { category: 'queue', name: '循环队列', fn: 'circularQueue' },
            // 栈与递归（courseViz）
            'infix-to-postfix': { category: 'stackexpr', name: '中缀→后缀表达式', fn: 'infixToPostfix' },
            'hanoi': { category: 'hanoi', name: '汉诺塔（递归）', fn: 'hanoi' },
            // BST
            'bst-insert': { category: 'tree', name: 'BST 插入', fn: 'bstInsert' },
            'bst-delete': { category: 'tree', name: 'BST 删除', fn: 'bstDelete' },
            // 二叉树遍历（courseViz，非递归栈过程）
            'bst-preorder': { category: 'tree2', name: '先序遍历（非递归）', fn: 'treeTraverse', order: 'pre' },
            'bst-inorder': { category: 'tree2', name: '中序遍历（非递归）', fn: 'treeTraverse', order: 'in' },
            'bst-postorder': { category: 'tree2', name: '后序遍历（非递归）', fn: 'treeTraverse', order: 'post' },
            // 堆 / 哈夫曼 / AVL（courseViz）
            'heap-build': { category: 'heap', name: '筛选法建堆', fn: 'heapBuild' },
            'heap-insert': { category: 'heap', name: '堆插入（上滤）', fn: 'heapInsert' },
            'huffman': { category: 'huffman', name: '哈夫曼树构造', fn: 'huffman' },
            'avl-insert': { category: 'avl', name: 'AVL 插入与旋转', fn: 'avlInsert' },
            // Graph
            'graph-bfs': { category: 'graph', name: 'BFS', fn: 'bfs' },
            'graph-dfs': { category: 'graph', name: 'DFS', fn: 'dfs' },
            'graph-dijkstra': { category: 'graph', name: 'Dijkstra', fn: 'dijkstra' },
            'topo-sort': { category: 'topo', name: '拓扑排序', fn: 'topoSort' },
            // Search
            'linear-search': { category: 'search', name: '线性查找', fn: 'linearSearch' },
            'binary-search': { category: 'search', name: '二分查找', fn: 'binarySearch' },
            'hash-probe': { category: 'hash', name: '散列线性探测', fn: 'hashProbe' },
            // String matching (Lesson04)
            'kmp': { category: 'string', name: 'KMP 模式匹配', fn: 'kmp' },
            // Sparse matrix (Lesson04)
            'sparse-transpose': { category: 'sparse', name: '稀疏矩阵快速转置', fn: 'fastTranspose' },
            'ortho-list': { category: 'ortho', name: '正交链表（十字链表）', fn: 'orthoList' },
            // 动态规划填表（courseViz）
            'dp-lcs': { category: 'dp', name: 'LCS 填表', fn: 'dpLCS' },
            'dp-knapsack': { category: 'dp', name: '0-1 背包填表', fn: 'dpKnapsack' },
            // B 树（courseViz）
            'btree-insert': { category: 'btree', name: 'B 树插入与分裂', fn: 'btreeInsert' },
        },

        // 下拉选项分组（动态注入；value 即注册表 key）
        algoGroups: [
            { label: '排序算法', keys: ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort'] },
            { label: '线性表操作', keys: ['list-insert', 'list-delete', 'list-reverse', 'array-insert', 'array-delete', 'circular-queue'] },
            { label: '栈与递归', keys: ['infix-to-postfix', 'hanoi'] },
            { label: '树与堆', keys: ['bst-insert', 'bst-delete', 'bst-preorder', 'bst-inorder', 'bst-postorder', 'heap-build', 'heap-insert', 'huffman', 'avl-insert'] },
            { label: '图算法', keys: ['graph-bfs', 'graph-dfs', 'graph-dijkstra', 'topo-sort'] },
            { label: '查找算法', keys: ['linear-search', 'binary-search', 'hash-probe', 'btree-insert', 'kmp'] },
            { label: '矩阵与串', keys: ['sparse-transpose', 'ortho-list'] },
            { label: '动态规划', keys: ['dp-lcs', 'dp-knapsack'] }
        ],

        /**
         * 每类算法的「数据规模」滑杆量程（min/max 为该类演示真实支持的范围，
         * unit 是滑杆数值的实际含义，随算法切换自动应用并同步到标签）。
         * 此前滑杆固定 1~30，多类算法（队列/表达式/散列/背包等）根本不使用
         * 该值，或默默钳制（图>10、顺序表>12 等），滑杆形同虚设——现已逐一修正。
         */
        sliderSpec: {
            sort:      { min: 4, max: 30, unit: '元素' },
            list:      { min: 4, max: 30, unit: '结点' },
            tree:      { min: 4, max: 30, unit: '结点' },
            search:    { min: 4, max: 30, unit: '元素' },
            graph:     { min: 2, max: 10, unit: '顶点' },
            seqlist:   { min: 4, max: 12, unit: '元素' },
            queue:     { min: 3, max: 8,  unit: '容量' },
            stackexpr: { min: 2, max: 8,  unit: '操作数' },
            hanoi:     { min: 3, max: 6,  unit: '盘子' },
            tree2:     { min: 3, max: 9,  unit: '结点' },
            heap:      { min: 4, max: 10, unit: '元素' },
            huffman:   { min: 4, max: 8,  unit: '权值' },
            avl:       { min: 3, max: 12, unit: '关键字' },
            hash:      { min: 3, max: 9,  unit: '关键字' },
            topo:      { min: 4, max: 8,  unit: '顶点' },
            dp:        { min: 4, max: 14, unit: '规模' },
            string:    { min: 5, max: 30, unit: '主串长度' },
            sparse:    { min: 4, max: 16, unit: '非零元' },
            ortho:     { min: 4, max: 16, unit: '非零元' },
            btree:     { min: 3, max: 8,  unit: '关键字' },
        },

        /**
         * Initialize the visualization view
         */
        init() {
            // Create renderer
            this.renderer = new VizRenderer();
            const canvas = document.getElementById('viz-canvas');
            if (canvas) {
                this.renderer.init(canvas);
            }

            // Create animator
            this.animator = new Animator();

            // Setup animator callbacks
            this.animator.onStep((stepIndex, step) => {
                this._updateUI(stepIndex, step);
            });

            this.animator.onComplete(() => {
                this._updatePlayButton(false);
            });

            // Bind events
            this.bindEvents();

            // 动态注入算法选项（含新增的 kmp / sparse-transpose，原有 17 项 value 不变）
            this._injectAlgoOptions();

            // 注入配色图例
            this._injectLegend();

            // Generate initial data
            this.generateData();

            // Load first algorithm
            const selector = document.getElementById('viz-algo-selector');
            if (selector && selector.value) {
                this.loadAlgorithm(selector.value);
            }

            // Update labels
            this._updateLabels();
        },

        /**
         * Bind all UI events
         */
        bindEvents() {
            const playBtn = document.getElementById('viz-play');
            const prevBtn = document.getElementById('viz-prev');
            const nextBtn = document.getElementById('viz-next');
            const resetBtn = document.getElementById('viz-reset');
            const randomBtn = document.getElementById('viz-random');
            const customBtn = document.getElementById('viz-custom');
            const selector = document.getElementById('viz-algo-selector');
            const sizeSlider = document.getElementById('viz-size');
            const speedSlider = document.getElementById('viz-speed');

            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    if (this.animator.isPlaying) {
                        this.animator.pause();
                        this._updatePlayButton(false);
                    } else {
                        this.animator.play();
                        this._updatePlayButton(true);
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.animator.pause();
                    this._updatePlayButton(false);
                    this.animator.prev();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.animator.pause();
                    this._updatePlayButton(false);
                    this.animator.next();
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.animator.pause();
                    this._updatePlayButton(false);
                    this.animator.reset();
                    this.comparisonCount = 0;
                    this.swapCount = 0;
                    this._updateCounters();
                });
            }

            if (randomBtn) {
                randomBtn.addEventListener('click', () => {
                    this.generateData();
                    if (this.currentAlgo) {
                        this.loadAlgorithm(this.currentAlgo);
                    }
                });
            }

            if (customBtn) {
                customBtn.addEventListener('click', () => {
                    this._showCustomInput();
                });
            }

            if (selector) {
                selector.addEventListener('change', (e) => {
                    this.loadAlgorithm(e.target.value);
                });
            }

            if (sizeSlider) {
                sizeSlider.addEventListener('input', (e) => {
                    this._updateLabels();
                    this.generateData();
                    if (this.currentAlgo) {
                        this.loadAlgorithm(this.currentAlgo);
                    }
                });
            }

            if (speedSlider) {
                speedSlider.addEventListener('input', (e) => {
                    const speed = parseFloat(e.target.value);
                    this.animator.setSpeed(speed);
                    this._updateLabels();
                });
            }
        },

        /**
         * Load an algorithm and generate steps
         * @param {string} algoKey - Algorithm key from registry
         */
        loadAlgorithm(algoKey) {
            const algo = this.algorithms[algoKey];
            if (!algo) {
                console.warn('VizView: Unknown algorithm', algoKey);
                return;
            }

            this.currentAlgo = algoKey;
            const prevCategory = this.currentCategory;
            this.currentCategory = algo.category;
            this.comparisonCount = 0;
            this.swapCount = 0;

            // 按算法类别应用滑杆量程；
            // 切换到新类别时也必须重新生成数据（各类别的专属数据互不通用：
            // 表达式 / 汉诺塔层数 / KMP 串 / 散列表长等都是 generateData 按滑杆生成的）
            if (this._applySliderSpec() || prevCategory !== algo.category) {
                this.generateData();
            }

            // Stop current animation
            this.animator.pause();
            this.animator.clear();
            this._updatePlayButton(false);

            // Generate steps
            let rawSteps = [];

            try {
                switch (algo.category) {
                    case 'sort':
                        rawSteps = SortViz[algo.fn](this.currentData);
                        break;
                    case 'list':
                        if (algo.fn === 'listInsert') {
                            const pos = Math.floor(this.currentData.length / 2);
                            rawSteps = ListViz.listInsert(this.currentData, pos, Math.floor(Math.random() * 50) + 10);
                        } else if (algo.fn === 'listDelete') {
                            const pos = Math.min(Math.floor(this.currentData.length / 2), this.currentData.length - 1);
                            rawSteps = ListViz.listDelete(this.currentData, pos);
                        } else if (algo.fn === 'listReverse') {
                            rawSteps = ListViz.listReverse(this.currentData);
                        }
                        break;
                    case 'tree':
                        if (algo.fn === 'bstInsert') {
                            rawSteps = TreeViz.bstInsert(this.currentData);
                        } else if (algo.fn === 'bstDelete') {
                            const val = this.currentData[Math.floor(this.currentData.length / 2)];
                            rawSteps = TreeViz.bstDelete(this.currentData, val);
                        } else if (algo.fn === 'bstTraverse') {
                            rawSteps = TreeViz.bstTraverse(this.currentData, 'inorder');
                        }
                        break;
                    case 'graph': {
                        // 优先使用用户自定义的边表矩阵，否则按滑杆顶点数随机生成
                        const matrix = this._customMatrix || this._generateAdjMatrix();
                        if (algo.fn === 'bfs') {
                            rawSteps = GraphViz.bfs(matrix, 0);
                        } else if (algo.fn === 'dfs') {
                            rawSteps = GraphViz.dfs(matrix, 0);
                        } else if (algo.fn === 'dijkstra') {
                            rawSteps = GraphViz.dijkstra(matrix, 0);
                        }
                        this._currentMatrix = matrix;
                        break;
                    }
                    case 'search': {
                        const sortedData = this.currentData.slice().sort((a, b) => a - b);
                        const target = sortedData[Math.floor(Math.random() * sortedData.length)];
                        if (this.currentData.join(',') !== sortedData.join(',')) {
                            DOM.toast('查找演示要求数据有序，已自动排序', 'info');
                        }
                        if (algo.fn === 'linearSearch') {
                            rawSteps = SearchViz.linearSearch(sortedData, target);
                        } else if (algo.fn === 'binarySearch') {
                            rawSteps = SearchViz.binarySearch(sortedData, target);
                        }
                        this.currentData = sortedData;
                        break;
                    }
                    // ── 以下为 courseViz 提供的教学配套算法 ──
                    case 'seqlist': {
                        const a = this.currentData.slice(0, 12);
                        const pos = Math.max(0, Math.floor(a.length / 2) - (algo.fn === 'arrayDelete' ? 0 : 0));
                        rawSteps = algo.fn === 'arrayInsert'
                            ? CourseViz.arrayInsert(a, Math.min(pos, a.length - 1), Math.floor(Math.random() * 90) + 10)
                            : CourseViz.arrayDelete(a, Math.min(pos, a.length - 1));
                        break;
                    }
                    case 'queue':
                        // 循环队列：滑杆值 = 队列容量（CourseViz 内部再钳制 3~8）
                        rawSteps = CourseViz.circularQueue(this._sizeValue());
                        break;
                    case 'stackexpr':
                        rawSteps = CourseViz.infixToPostfix(this.currentExpr || 'a+b*c-(d-e)');
                        break;
                    case 'hanoi':
                        rawSteps = CourseViz.hanoi(this.currentHanoiN || 4);
                        break;
                    case 'tree2':
                        rawSteps = CourseViz.treeTraverse(this.currentData.slice(0, 9), algo.order || 'in');
                        break;
                    case 'heap':
                        rawSteps = algo.fn === 'heapBuild'
                            ? CourseViz.heapBuild(this.currentData.slice(0, 10))
                            : CourseViz.heapInsert(this.currentData.slice(0, 10));
                        break;
                    case 'huffman':
                        rawSteps = CourseViz.huffman(this.currentData.slice(0, 8));
                        break;
                    case 'avl':
                        rawSteps = CourseViz.avlInsert(this.currentData.slice(0, 12));
                        break;
                    case 'hash':
                        // 滑杆值 = 关键字个数（3~9），表长随之 11~17，保证装填因子变化可感
                        rawSteps = CourseViz.hashProbe(this.currentData.slice(0, 9), this.currentHashM || 11);
                        break;
                    case 'topo':
                        rawSteps = CourseViz.topoSort(this.currentDigraph || { n: 6, edges: [{ u: 1, v: 2 }, { u: 1, v: 3 }, { u: 2, v: 4 }, { u: 3, v: 4 }, { u: 4, v: 5 }, { u: 5, v: 6 }] });
                        break;
                    case 'dp':
                        if (algo.fn === 'dpLCS') {
                            const s = this.currentStrings || { T: 'xyxxz', P: 'zxzyyz' };
                            rawSteps = CourseViz.dpLCS(s.T, s.P);
                        } else {
                            rawSteps = CourseViz.dpKnapsack(this.currentKnapsack || { W: 5, items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }] });
                        }
                        break;
                    case 'ortho': {
                        const sm = this.currentTriples || DEFAULT_SPARSE;
                        rawSteps = CourseViz.orthoList(sm.triples, sm.rows, sm.cols);
                        break;
                    }
                    case 'btree':
                        rawSteps = CourseViz.btreeInsert(this.currentData.slice(0, 8));
                        break;
                    case 'string': {
                        const s = this.currentStrings || DEFAULT_STRINGS;
                        rawSteps = SearchViz.kmp(s.T, s.P);
                        break;
                    }
                    case 'sparse': {
                        const sm = this.currentTriples || DEFAULT_SPARSE;
                        rawSteps = SparseMatrixViz.fastTranspose(sm.triples, sm.rows, sm.cols);
                        break;
                    }
                }
            } catch (e) {
                console.error('VizView: Error generating steps', e);
                rawSteps = [];
            }

            // Convert raw steps to animator steps
            this._buildAnimatorSteps(rawSteps);

            // Update UI
            this._updateCounters();
            this._updateDescription(rawSteps.length > 0 ? rawSteps[0].description : '就绪');

            // Run first step
            if (this.animator.steps.length > 0) {
                this.animator.currentStep = 0;
                this.animator.runStep();
            }
        },

        /**
         * Convert raw algorithm steps into animator steps with render functions
         * @param {Array} rawSteps - Steps from algorithm module
         * @private
         */
        _buildAnimatorSteps(rawSteps) {
            this.animator.clear();

            for (let i = 0; i < rawSteps.length; i++) {
                const step = rawSteps[i];
                const stepIndex = i;
                const self = this;

                this.animator.addStep(() => {
                    self.render(step);

                    // Track comparisons and swaps
                    if (step.type === 'compare') self.comparisonCount++;
                    if (step.type === 'swap') self.swapCount++;
                    self._updateCounters();
                }, step.description);
            }
        },

        /**
         * Render the current step
         * NOTE: 先按 step.type_list（模块显式声明的图元类型）分发，
         * 再按 step.type 兜底。旧实现 `step.type_list || step.type === 'tree' ? 'tree' : ...`
         * 因运算符优先级，凡 type_list 为真（如 'list'）一律被当成树渲染，
         * 导致链表可视化画布上只显示"空树"，此处已修复。
         * @param {Object} step - Step data from algorithm module
         */
        render(step) {
            if (!this.renderer) return;
            this.renderer.clear();

            // 1) 显式图元类型：链表 / KMP 串匹配 / 稀疏矩阵 / courseViz 系列
            switch (step.type_list) {
                case 'list':
                    ListViz.render(this.renderer, step);
                    return;
                case 'kmp':
                    SearchViz.renderKmp(this.renderer, step);
                    return;
                case 'sparse':
                    if (typeof SparseMatrixViz !== 'undefined') {
                        SparseMatrixViz.render(this.renderer, step);
                    }
                    return;
                case 'array':
                case 'expr':
                case 'hanoi':
                case 'dp':
                case 'ctree':
                case 'btree':
                case 'ortho':
                    if (typeof CourseViz !== 'undefined') {
                        CourseViz.render(this.renderer, step);
                    }
                    return;
            }

            // 2) 兼容旧的按 step.type 分发
            switch (step.type) {
                case 'tree':
                    TreeViz.render(this.renderer, step);
                    break;
                case 'graph':
                    GraphViz.render(this.renderer, step, this._currentMatrix);
                    break;
                case 'search':
                    SearchViz.render(this.renderer, step);
                    break;
                default:
                    this._renderSort(step);
            }
        },

        /**
         * Render sorting step as bar chart
         * @private
         */
        _renderSort(step) {
            if (!step.values) return;
            const highlights = {
                comparing: [],
                swapping: [],
                sorted: step.sorted || []
            };

            if (step.type === 'compare' || step.type === 'highlight') {
                highlights.comparing = step.indices || [];
            } else if (step.type === 'swap') {
                highlights.swapping = step.indices || [];
            } else if (step.type === 'set') {
                // Highlight the active index if any
                highlights.comparing = step.indices || [];
            }

            this.renderer.drawBars(step.values, highlights);
        },

        /**
         * Generate random data based on size slider
         * 每个分支都直接使用滑杆值（在类别量程内），保证滑杆真实控制数据规模
         */
        generateData() {
            const sizeSlider = document.getElementById('viz-size');
            const size = sizeSlider ? parseInt(sizeSlider.value) || 10 : 10;

            // KMP：随机主串 / 模式串（长度与滑杆联动：主串 8~30，模式串 3~12）
            if (this.currentCategory === 'string') {
                this.currentData = [];
                this.currentStrings = this._randomStrings(size);
                return;
            }

            // 快速转置 / 正交链表：滑杆值 = 非零元个数（4~16）
            if (this.currentCategory === 'sparse' || this.currentCategory === 'ortho') {
                this.currentData = [];
                this.currentTriples = this._randomTriples(size);
                return;
            }

            // 图：滑杆/随机重新生成时会丢弃自定义边表
            if (this.currentCategory === 'graph') {
                this._customMatrix = null;
            }

            // ── courseViz 各类别 ──
            if (this.currentCategory === 'seqlist') {
                this.currentData = Array.from({ length: Math.max(4, Math.min(12, size)) }, () => Math.floor(Math.random() * 90) + 10);
                return;
            }
            if (this.currentCategory === 'queue') {
                // 队列容量在 loadAlgorithm 时直接取滑杆值，这里无需生成数据
                this.currentData = [];
                return;
            }
            if (this.currentCategory === 'heap') {
                this.currentData = Array.from({ length: Math.max(4, Math.min(10, size)) }, () => Math.floor(Math.random() * 90) + 10);
                return;
            }
            if (this.currentCategory === 'avl' || this.currentCategory === 'btree') {
                const cap = this.currentCategory === 'avl' ? 12 : 8;
                const len = Math.max(3, Math.min(cap, size));
                const seen = {}, a = [];
                while (a.length < len && a.length < 99) {
                    const v = Math.floor(Math.random() * 99) + 1;
                    if (!seen[v]) { seen[v] = 1; a.push(v); }
                }
                this.currentData = a;
                return;
            }
            if (this.currentCategory === 'huffman') {
                // 滑杆值 = 权值个数（4~8）
                const len = Math.max(4, Math.min(8, size));
                this.currentData = Array.from({ length: len }, () => Math.floor(Math.random() * 19) + 1);
                return;
            }
            if (this.currentCategory === 'hash') {
                // 滑杆值 = 关键字个数（3~9）；表长 = 关键字数 + 8（11~17），冲突概率随规模上升
                const n = Math.max(3, Math.min(9, size));
                this.currentHashM = Math.max(11, Math.min(17, n + 8));
                const seen = {}, a = [];
                while (a.length < n && a.length < 99) {
                    const v = Math.floor(Math.random() * 90) + 10;
                    if (!seen[v]) { seen[v] = 1; a.push(v); }
                }
                this.currentData = a;
                return;
            }
            if (this.currentCategory === 'topo') {
                // 随机 DAG：只允许 i→j (i<j)，天然无环；滑杆值 = 顶点数（4~8）
                const n = Math.max(4, Math.min(8, size));
                const edges = [];
                for (let i = 1; i <= n; i++)
                    for (let j = i + 1; j <= n; j++)
                        if (Math.random() < 0.35) edges.push({ u: i, v: j });
                if (edges.length === 0) edges.push({ u: 1, v: n });
                this.currentDigraph = { n: n, edges: edges };
                this.currentData = [];
                return;
            }
            if (this.currentCategory === 'stackexpr') {
                // 滑杆值 = 表达式操作数个数（2~8），随机生成合法中缀表达式
                this.currentExpr = this._randomExpr(Math.max(2, Math.min(8, size)));
                this.currentData = [];
                return;
            }
            if (this.currentCategory === 'hanoi') {
                // 滑杆值 = 盘子数（3~6）
                this.currentHanoiN = Math.max(3, Math.min(6, size));
                this.currentData = [];
                return;
            }
            if (this.currentCategory === 'dp') {
                // LCS：串长随滑杆增长（T 6~9，P 4~8），填表规模直观可控
                const tLen = Math.max(4, Math.min(9, 4 + Math.round(size / 2)));
                const pLen = Math.max(3, Math.min(8, 3 + Math.round(size / 4)));
                const s = this._randomStringsOf(tLen, pLen);
                this.currentStrings = s;
                // 背包：物品数（2~5）与容量（4~9）随滑杆增长
                const items = Array.from({ length: Math.max(2, Math.min(5, 2 + Math.round(size / 4))) },
                    () => ({ w: Math.floor(Math.random() * 4) + 1, v: Math.floor(Math.random() * 9) + 1 }));
                this.currentKnapsack = { W: Math.max(4, Math.min(9, 3 + Math.round(size / 3))), items: items };
                this.currentData = [];
                return;
            }

            this.currentData = [];
            for (let i = 0; i < size; i++) {
                this.currentData.push(Math.floor(Math.random() * 90) + 10);
            }
        },

        /**
         * Generate a random string pair for KMP demo
         * @param {number} [size] - 滑杆数据规模（5~30）= 主串长度（不足 8 时取 8），
         *                          模式串长度随其增长（3~12）
         * @private
         */
        _randomStrings(size) {
            const s0 = typeof size === 'number' ? size : 15;
            const tLen = Math.max(8, Math.min(30, s0));                    // 滑杆值 = 主串长度
            const pLen = Math.max(3, Math.min(12, Math.round(s0 * 0.4)));  // 5→3, 15→6, 30→12
            return this._randomStringsOf(tLen, pLen);
        },

        /**
         * Generate a random string pair with explicit lengths
         * @private
         */
        _randomStringsOf(tLen, pLen) {
            const letters = ['a', 'a', 'a', 'b', 'b', 'c'];
            const randStr = (len) => {
                let s = '';
                for (let i = 0; i < len; i++) {
                    s += letters[Math.floor(Math.random() * letters.length)];
                }
                return s;
            };
            return { T: randStr(tLen), P: randStr(pLen) };
        },

        /**
         * Generate a random sparse matrix triple table (row-major order)
         * @param {number} [size] - 滑杆数据规模（4~16），直接作为非零元个数
         * @private
         */
        _randomTriples(size) {
            const s0 = typeof size === 'number' ? size : 8;
            const count = Math.max(4, Math.min(16, s0));
            const rows = 4 + Math.floor(Math.random() * 3);   // 4~6
            const cols = 5 + Math.floor(Math.random() * 3);   // 5~7
            const seen = {};
            const triples = [];
            let guard = 0;
            while (triples.length < count && guard++ < 200) {
                const r = Math.floor(Math.random() * rows);
                const c = Math.floor(Math.random() * cols);
                const key = r + ',' + c;
                if (seen[key]) continue;
                seen[key] = true;
                let v = Math.floor(Math.random() * 99) + 1;
                if (Math.random() < 0.15) v = -v;
                triples.push({ r: r, c: c, v: v });
            }
            triples.sort((a, b) => (a.r - b.r) || (a.c - b.c));
            return { rows: rows, cols: cols, triples: triples };
        },

        /**
         * 生成含 nOperands 个操作数的合法随机中缀表达式（含必要的括号）。
         * 采用表达式树：按优先级决定左右子式是否加括号，保证任意拆分都合法，
         * 且长度随操作数个数单调增长——供「中缀→后缀」滑杆（2~8 操作数）使用。
         * @param {number} nOperands
         * @returns {string}
         * @private
         */
        _randomExpr(nOperands) {
            const operands = ['a', 'b', 'c', 'd', 'e', 'x', 'y', 'z'];
            const ops = ['+', '-', '*', '/'];
            const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
            function gen(n) {
                if (n <= 1) return { s: rand(operands), prec: 3 };
                const nl = randInt(1, n - 1), nr = n - nl;
                const L = gen(nl), R = gen(nr);
                const op = rand(ops);
                const prec = (op === '+' || op === '-') ? 1 : 2;
                // 左子式优先级更低需加括号；右子式优先级 ≤ 当前（含同级右结合歧义）需加括号
                const ls = L.prec < prec ? '(' + L.s + ')' : L.s;
                const rs = R.prec <= prec ? '(' + R.s + ')' : R.s;
                return { s: ls + op + rs, prec: prec };
            }
            return gen(Math.max(1, nOperands | 0)).s;
        },

        /**
         * 读取当前滑杆值（数值）
         * @private
         */
        _sizeValue() {
            const slider = document.getElementById('viz-size');
            return slider ? (parseInt(slider.value, 10) || 10) : 10;
        },

        /**
         * 按当前算法类别应用滑杆量程（min/max）。
         * 若原值超出量程被钳制，返回 true（调用方应重新生成数据）。
         * @returns {boolean}
         * @private
         */
        _applySliderSpec() {
            const slider = document.getElementById('viz-size');
            if (!slider) return false;
            const spec = this.sliderSpec[this.currentCategory] || { min: 4, max: 30 };
            slider.min = String(spec.min);
            slider.max = String(spec.max);
            const v = parseInt(slider.value, 10);
            const clamped = Math.max(spec.min, Math.min(spec.max, isNaN(v) ? spec.min : v));
            const changed = clamped !== v;
            if (changed) slider.value = String(clamped);
            this._updateLabels();
            return changed;
        },

        /**
         * Generate an adjacency matrix for graph algorithms
         * @private
         */
        _generateAdjMatrix() {
            const n = Math.max(2, Math.min(this._sizeValue(), 10));   // 图类滑杆量程 2~10
            const matrix = Array.from({ length: n }, () => new Array(n).fill(0));

            // Create a connected graph with random edges
            // First ensure connectivity with a spanning tree
            for (let i = 1; i < n; i++) {
                const j = Math.floor(Math.random() * i);
                const w = Math.floor(Math.random() * 9) + 1;
                matrix[i][j] = w;
                matrix[j][i] = w;
            }

            // Add a few extra random edges
            const extraEdges = Math.floor(n * 0.6);
            for (let e = 0; e < extraEdges; e++) {
                const i = Math.floor(Math.random() * n);
                const j = Math.floor(Math.random() * n);
                if (i !== j && matrix[i][j] === 0) {
                    const w = Math.floor(Math.random() * 9) + 1;
                    matrix[i][j] = w;
                    matrix[j][i] = w;
                }
            }

            return matrix;
        },

        /**
         * Update play button icon
         * @private
         */
        _updatePlayButton(playing) {
            const btn = document.getElementById('viz-play');
            if (btn) {
                btn.textContent = playing ? '⏸ 暂停' : '▶ 播放';
                btn.classList.toggle('playing', playing);
            }
        },

        /**
         * Update UI after a step change
         * @private
         */
        _updateUI(stepIndex, step) {
            this._updateDescription(step ? step.description : '');
            const stepCount = document.getElementById('viz-step-count');
            if (stepCount) {
                stepCount.textContent = `${stepIndex + 1} / ${this.animator.getTotalSteps()}`;
            }
        },

        /**
         * Update description text area
         * @private
         */
        _updateDescription(text) {
            const desc = document.getElementById('viz-description');
            if (desc) {
                desc.textContent = text || '';
            }
        },

        /**
         * Update comparison and swap counters
         * @private
         */
        _updateCounters() {
            const compEl = document.getElementById('viz-comparisons');
            const swapEl = document.getElementById('viz-swaps');
            if (compEl) compEl.textContent = this.comparisonCount;
            if (swapEl) swapEl.textContent = this.swapCount;
        },

        /**
         * Update slider value labels（数据规模标签带单位，随算法类别变化）
         * @private
         */
        _updateLabels() {
            const sizeSlider = document.getElementById('viz-size');
            const sizeLabel = document.getElementById('viz-size-label');
            const speedSlider = document.getElementById('viz-speed');
            const speedLabel = document.getElementById('viz-speed-label');

            if (sizeSlider && sizeLabel) {
                const spec = this.sliderSpec[this.currentCategory];
                sizeLabel.textContent = sizeSlider.value + (spec && spec.unit ? ' ' + spec.unit : '');
            }
            if (speedSlider && speedLabel) {
                speedLabel.textContent = parseFloat(speedSlider.value).toFixed(2) + 'x';
            }
        },

        /**
         * Show custom data input dialog (dispatched by current category)
         * @private
         */
        _showCustomInput() {
            if (this.currentCategory === 'string') {
                this._showCustomStrings();
                return;
            }
            if (this.currentCategory === 'sparse' || this.currentCategory === 'ortho') {
                this._showCustomTriples();
                return;
            }
            if (this.currentCategory === 'graph') {
                this._showCustomGraph();
                return;
            }
            if (this.currentCategory === 'queue') {
                DOM.toast('循环队列已支持「数据规模」滑杆调节容量（3~8），演示序列自动覆盖判满/判空/回绕', 'info');
                return;
            }
            if (this.currentCategory === 'topo') {
                DOM.toast('拓扑排序数据随机生成且保证无环，可用「数据规模」滑杆调节顶点数（4~8）', 'info');
                return;
            }
            if (this.currentCategory === 'stackexpr') {
                this._showCustomExpr();
                return;
            }
            if (this.currentCategory === 'hanoi') {
                this._showCustomHanoi();
                return;
            }
            if (this.currentCategory === 'dp') {
                this._showCustomDP();
                return;
            }

            // 数值类：顺序表 / 堆 / 哈夫曼 / AVL / B 树 / 散列
            const caps = { seqlist: 12, heap: 10, avl: 12, btree: 8, huffman: 8, hash: 9 };
            const cap = caps[this.currentCategory] || 30;
            const catName = { seqlist: '顺序表', heap: '堆', avl: 'AVL 树', btree: 'B 树', huffman: '哈夫曼权值', hash: '散列关键字' }[this.currentCategory] || '数据';
            const input = prompt(
                `请输入${catName}数据（逗号分隔的整数，0~9999，最多 ${cap} 个）：`,
                this.currentData ? this.currentData.join(', ') : '5, 3, 8, 1, 9, 2, 7'
            );

            if (input === null) return;
            const parsed = this._parseNumericInput(input, cap);
            if (!parsed.ok) {
                alert(parsed.msg);
                return;
            }

            this.currentData = parsed.values;
            // 散列：关键字需去重（同一关键字重复插入无意义），并联动表长
            if (this.currentCategory === 'hash') {
                const seen = {};
                this.currentData = parsed.values.filter(v => (seen[v] ? false : (seen[v] = 1, true)));
                if (this.currentData.length === 0) { alert('去重后没有可用关键字'); return; }
                this.currentHashM = Math.max(11, Math.min(17, this.currentData.length + 8));
            }
            // 滑杆与实际数据规模保持一致（自定义后拖动滑杆会重新随机生成）
            const sizeSlider = document.getElementById('viz-size');
            if (sizeSlider) {
                sizeSlider.value = Math.max(parseInt(sizeSlider.min, 10) || 1, parsed.values.length);
                this._updateLabels();
            }

            if (this.currentAlgo) {
                this.loadAlgorithm(this.currentAlgo);
            }
        },

        /**
         * 中缀表达式自定义输入
         */
        _showCustomExpr() {
            const input = prompt(
                '请输入中缀表达式（操作数为单字母或数字，支持 + - * / 和括号，长度 ≤ 24）：',
                this.currentExpr || 'a+b*c-(d-e)'
            );
            if (input === null) return;
            const s = String(input || '').replace(/\s+/g, '');
            if (!s) { alert('表达式不能为空'); return; }
            if (s.length > 24) { alert('表达式过长（最多 24 个字符）'); return; }
            if (/[^a-zA-Z0-9+\-*/()]/.test(s)) { alert('存在不支持的字符（只允许字母/数字/+-*/和括号）'); return; }
            // 括号配对检查
            let depth = 0;
            for (const ch of s) {
                if (ch === '(') depth++;
                else if (ch === ')') { depth--; if (depth < 0) { alert('括号不匹配：多余的右括号'); return; } }
            }
            if (depth !== 0) { alert('括号不匹配：左括号未闭合'); return; }
            if (!/[a-zA-Z0-9]/.test(s)) { alert('表达式中没有操作数'); return; }
            this.currentExpr = s;
            if (this.currentAlgo) this.loadAlgorithm(this.currentAlgo);
        },

        /**
         * 汉诺塔自定义：盘数
         */
        _showCustomHanoi() {
            const input = prompt('请输入盘子数（3~6，移动次数为 2^n - 1）：', String(this.currentHanoiN || 4));
            if (input === null) return;
            const n = parseInt(input, 10);
            if (isNaN(n) || n < 3 || n > 6) { alert('请输入 3~6 之间的整数'); return; }
            this.currentHanoiN = n;
            // 滑杆值 = 盘子数（量程 3~6，直接同步）
            const sizeSlider = document.getElementById('viz-size');
            if (sizeSlider) { sizeSlider.value = String(n); this._updateLabels(); }
            if (this.currentAlgo) this.loadAlgorithm(this.currentAlgo);
        },

        /**
         * DP 自定义输入：LCS 两串 / 背包容量+物品
         */
        _showCustomDP() {
            const algo = this.algorithms[this.currentAlgo] || {};
            if (algo.fn === 'dpLCS') {
                const input = prompt('请输入两个串 X,Y（英文逗号分隔，各 ≤ 8 字符）：',
                    (this.currentStrings ? this.currentStrings.T + ',' + this.currentStrings.P : 'xyxxz,zxzyyz'));
                if (input === null) return;
                const parts = String(input).split(/[,，]/).map(s => s.replace(/\s+/g, ''));
                if (!parts[0] || !parts[1]) { alert('请输入两段非空字符'); return; }
                if (parts[0].length > 8 || parts[1].length > 8) { alert('串过长（各最多 8 个字符）'); return; }
                this.currentStrings = { T: parts[0], P: parts[1] };
            } else {
                const cur = this.currentKnapsack || { W: 5, items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }] };
                const input = prompt(
                    '0-1 背包：第一项为容量 W（1~9），随后每件物品 2 个数 w v（重量 1~9，价值 1~99），最多 5 件\n示例：5; 2 3; 3 4; 4 5',
                    cur.W + '; ' + cur.items.map(it => it.w + ' ' + it.v).join('; ')
                );
                if (input === null) return;
                const tokens = String(input).split(/[,;；、\s]+/).filter(t => t.length);
                if (!/^\d+$/.test(tokens[0] || '')) { alert('第一项必须是容量 W（整数）'); return; }
                const W = parseInt(tokens[0], 10);
                if (W < 1 || W > 9) { alert('容量需在 1~9 之间'); return; }
                const rest = tokens.slice(1).map(Number);
                if (rest.length === 0 || rest.length % 2 !== 0) { alert('每件物品需要 2 个数（w v），请检查格式'); return; }
                if (rest.length / 2 > 5) { alert('物品过多（最多 5 件）'); return; }
                const items = [];
                for (let i = 0; i < rest.length; i += 2) {
                    if (!Number.isInteger(rest[i]) || !Number.isInteger(rest[i + 1]) || rest[i] < 1 || rest[i] > 9 || rest[i + 1] < 1 || rest[i + 1] > 99) {
                        alert('存在非法物品 (w=' + rest[i] + ', v=' + rest[i + 1] + ')：w 需 1~9，v 需 1~99');
                        return;
                    }
                    items.push({ w: rest[i], v: rest[i + 1] });
                }
                this.currentKnapsack = { W: W, items: items };
            }
            if (this.currentAlgo) this.loadAlgorithm(this.currentAlgo);
        },

        /**
         * 严格解析逗号分隔的整数序列（供排序/链表/树/查找演示使用）
         * 全部 token 必须是 0~9999 的整数，最多 30 个；任一非法整条拒绝并指明原因
         * @param {string} input
         * @returns {{ok:boolean, values?:number[], msg?:string}}
         */
        _parseNumericInput(input, cap) {
            cap = cap || 30;
            const tokens = String(input || '').split(/[,，、\s]+/).filter(s => s.length > 0);
            if (tokens.length === 0) {
                return { ok: false, msg: '请输入至少一个数字' };
            }
            if (tokens.length > cap) {
                return { ok: false, msg: '元素过多（最多 ' + cap + ' 个，当前 ' + tokens.length + ' 个）' };
            }
            const values = [];
            for (const tok of tokens) {
                if (!/^-?\d+$/.test(tok)) {
                    return { ok: false, msg: '存在无法识别的元素："' + tok + '"（请输入整数）' };
                }
                const n = parseInt(tok, 10);
                if (n < 0) {
                    return { ok: false, msg: '不支持负数：' + tok + '（请输入 0~9999 的整数）' };
                }
                if (n > 9999) {
                    return { ok: false, msg: '数值过大：' + tok + '（请输入 0~9999 的整数）' };
                }
                values.push(n);
            }
            return { ok: true, values: values };
        },

        /**
         * 图算法自定义输入：顶点数 + 边表
         * @private
         */
        _showCustomGraph() {
            const input = prompt(
                '自定义图：第一项为顶点数 n（2~10），随后每条边 3 个数：u v w\n' +
                '（顶点编号 1~n，无向边，权值 1~99，边数不超过 n(n-1)/2）\n' +
                '示例：5; 1 2 4; 1 3 2; 2 4 3; 3 4 5',
                '5; 1 2 4; 1 3 2; 2 4 3; 3 4 5'
            );
            if (input === null) return;
            const parsed = this._parseGraphInput(input);
            if (!parsed.ok) {
                alert(parsed.msg);
                return;
            }
            // 由边表构建对称邻接矩阵
            const n = parsed.n;
            const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
            for (const e of parsed.edges) {
                matrix[e.u - 1][e.v - 1] = e.w;
                matrix[e.v - 1][e.u - 1] = e.w;
            }
            this._customMatrix = matrix;
            // 滑杆与顶点数同步（图类滑杆上限 10）
            const sizeSlider = document.getElementById('viz-size');
            if (sizeSlider) {
                sizeSlider.value = n;
                this._updateLabels();
            }
            if (this.currentAlgo) {
                this.loadAlgorithm(this.currentAlgo);
            }
        },

        /**
         * 解析图自定义输入 "n; u v w; u v w; ..."
         * @param {string} input
         * @returns {{ok:boolean, n?:number, edges?:Array, msg?:string}}
         */
        _parseGraphInput(input) {
            const tokens = String(input || '').split(/[,;；、\s]+/).filter(s => s.length > 0);
            if (tokens.length === 0) {
                return { ok: false, msg: '请输入顶点数和边表' };
            }
            const nums = [];
            for (const tok of tokens) {
                if (!/^\d+$/.test(tok)) {
                    return { ok: false, msg: '存在无法识别的数字："' + tok + '"' };
                }
                nums.push(parseInt(tok, 10));
            }
            const n = nums[0];
            if (n < 2 || n > 10) {
                return { ok: false, msg: '顶点数需在 2~10 之间（当前 ' + n + '）' };
            }
            const rest = nums.slice(1);
            if (rest.length === 0 || rest.length % 3 !== 0) {
                return { ok: false, msg: '每条边需要 3 个数（u v 权值），请检查边表格式' };
            }
            const maxEdges = n * (n - 1) / 2;
            const seen = {};
            const edges = [];
            for (let i = 0; i < rest.length; i += 3) {
                const u = rest[i], v = rest[i + 1], w = rest[i + 2];
                if (u < 1 || u > n || v < 1 || v > n) {
                    return { ok: false, msg: '边 (' + u + ',' + v + ') 超出顶点范围 1~' + n };
                }
                if (u === v) {
                    return { ok: false, msg: '不支持自环：(' + u + ',' + v + ')' };
                }
                if (w < 1 || w > 99) {
                    return { ok: false, msg: '边 (' + u + ',' + v + ') 的权值需在 1~99 之间' };
                }
                const key = Math.min(u, v) + ',' + Math.max(u, v);
                if (seen[key]) {
                    return { ok: false, msg: '重复边：(' + u + ',' + v + ')' };
                }
                seen[key] = true;
                edges.push({ u: u, v: v, w: w });
            }
            if (edges.length > maxEdges) {
                return { ok: false, msg: '边数超过 n(n-1)/2 = ' + maxEdges };
            }
            return { ok: true, n: n, edges: edges };
        },

        /**
         * KMP 自定义输入：主串,模式串
         * @private
         */
        _showCustomStrings() {
            const input = prompt(
                '请输入主串,模式串（英文逗号分隔，如 acabaabaabcacaabc,abaabcac）',
                this.currentStrings ? this.currentStrings.T + ',' + this.currentStrings.P : DEFAULT_STRINGS.T + ',' + DEFAULT_STRINGS.P
            );
            if (input === null) return;
            const parsed = this._parseKmpInput(input);
            if (!parsed.ok) {
                DOM.toast(parsed.msg, 'error');
                return;
            }
            this.currentStrings = { T: parsed.T, P: parsed.P };
            if (this.currentAlgo) {
                this.loadAlgorithm(this.currentAlgo);
            }
        },

        /**
         * 解析 KMP 输入 "主串,模式串"
         * @param {string} input
         * @returns {{ok:boolean, T?:string, P?:string, msg?:string}}
         */
        _parseKmpInput(input) {
            const parts = String(input || '').split(/[,，]/).map(s => s.replace(/\s+/g, ''));
            const T = parts[0] || '';
            const P = parts[1] || '';
            if (!T || !P) {
                return { ok: false, msg: '请按 "主串,模式串" 格式输入两段非空字符' };
            }
            if (T.length > 30) {
                return { ok: false, msg: '主串过长（最多 30 个字符）' };
            }
            if (P.length > 12) {
                return { ok: false, msg: '模式串过长（最多 12 个字符）' };
            }
            return { ok: true, T: T, P: P };
        },

        /**
         * 快速转置自定义输入：每项 "行,列,值"，用分号/换行/逗号分隔
         * @private
         */
        _showCustomTriples() {
            const d = this.currentTriples || DEFAULT_SPARSE;
            const def = d.triples.map(t => t.r + ',' + t.c + ',' + t.v).join(';');
            const input = prompt(
                '请输入非零元，每项格式 行,列,值，用分号分隔\n（如 0,3,22;0,6,15;1,1,11。行/列从 0 开始，按行序输入）',
                def
            );
            if (input === null) return;
            const parsed = this._parseSparseInput(input);
            if (!parsed.ok) {
                DOM.toast(parsed.msg, 'error');
                return;
            }
            this.currentTriples = { rows: parsed.rows, cols: parsed.cols, triples: parsed.triples };
            if (this.currentAlgo) {
                this.loadAlgorithm(this.currentAlgo);
            }
        },

        /**
         * 解析三元组输入，自动按行序排序并去重
         * @param {string} input
         * @returns {{ok:boolean, triples?:Array, rows?:number, cols?:number, msg?:string}}
         */
        _parseSparseInput(input) {
            const tokens = String(input || '').split(/[,;；、\s]+/).filter(s => s.length > 0);
            if (tokens.length === 0 || tokens.length % 3 !== 0) {
                return { ok: false, msg: '请按 "行,列,值" 三数一组输入非零元' };
            }
            const nums = tokens.map(s => parseInt(s, 10));
            for (let t = 0; t < nums.length; t++) {
                if (isNaN(nums[t])) {
                    return { ok: false, msg: '存在无法识别的数字：' + tokens[t] };
                }
            }
            const seen = {};
            const triples = [];
            for (let i = 0; i < nums.length; i += 3) {
                const r = nums[i], c = nums[i + 1], v = nums[i + 2];
                if (r < 0 || c < 0) {
                    return { ok: false, msg: '行号/列号不能为负：(' + r + ',' + c + ',' + v + ')' };
                }
                if (r > 29 || c > 29) {
                    return { ok: false, msg: '行号/列号过大（最大 29）：(' + r + ',' + c + ',' + v + ')' };
                }
                if (v === 0) {
                    return { ok: false, msg: '稀疏矩阵只存非零元，值不能为 0：(' + r + ',' + c + ',' + v + ')' };
                }
                const key = r + ',' + c;
                if (seen[key]) continue; // 同一位置重复输入时保留第一个
                seen[key] = true;
                triples.push({ r: r, c: c, v: v });
            }
            if (triples.length === 0) {
                return { ok: false, msg: '没有有效的非零元' };
            }
            if (triples.length > 16) {
                return { ok: false, msg: '非零元过多（最多 16 个，便于展示）' };
            }
            triples.sort((a, b) => (a.r - b.r) || (a.c - b.c));
            const rows = Math.max(...triples.map(t => t.r)) + 1;
            const cols = Math.max(...triples.map(t => t.c)) + 1;
            return { ok: true, triples: triples, rows: rows, cols: cols };
        },

        /**
         * 按注册表重建算法下拉选项（含 optgroup 分组与动态注入的新算法），
         * 原有 17 个 option 的 value 保持不变
         * @private
         */
        _injectAlgoOptions() {
            const selector = document.getElementById('viz-algo-selector');
            if (!selector) return;
            const prev = selector.value;

            selector.innerHTML = '';
            for (const group of this.algoGroups) {
                const og = document.createElement('optgroup');
                og.label = group.label;
                for (const key of group.keys) {
                    const algo = this.algorithms[key];
                    if (!algo) continue;
                    const opt = document.createElement('option');
                    opt.value = key;
                    opt.textContent = algo.name;
                    og.appendChild(opt);
                }
                if (og.children.length > 0) {
                    selector.appendChild(og);
                }
            }
            if (prev && this.algorithms[prev]) {
                selector.value = prev;
            }
        },

        /**
         * 注入画布配色图例（蓝常规 / 琥珀比较 / 红修改 / 绿完成 / 紫辅助）
         * @private
         */
        _injectLegend() {
            const controls = document.getElementById('viz-controls');
            if (!controls || document.getElementById('viz-legend')) return;

            const items = [
                ['#4a90d9', '常规'],
                ['#f5a623', '比较 / 当前指针'],
                ['#e74c3c', '修改 / 失配'],
                ['#2ecc71', '完成 / 匹配成功'],
                ['#9b59b6', '辅助指针']
            ];

            const legend = document.createElement('div');
            legend.id = 'viz-legend';
            legend.className = 'viz-legend';
            for (const it of items) {
                const item = document.createElement('span');
                item.className = 'viz-legend-item';
                const swatch = document.createElement('span');
                swatch.className = 'viz-legend-swatch';
                swatch.style.background = it[0];
                item.appendChild(swatch);
                item.appendChild(document.createTextNode(it[1]));
                legend.appendChild(item);
            }
            controls.appendChild(legend);
        }
    };

    window.VizView = VizView;


    /* ============================================================
     * SparseMatrixViz - 稀疏矩阵快速转置可视化（Lesson04 课件 4.3.4）
     *
     * 步骤设计：
     *   ① 统计 num[col]  = A 表中列 col 的非零元个数（扫描 A 表一遍）
     *   ② 递推 cpot[0]=0; cpot[col] = cpot[col-1] + num[col-1]
     *      （cpot[col] 为 B 表中第 col 行非零元的起始存放位置）
     *   ③ 扫描 A 表：j = cpot[A[t].col]，B[j] = 转置(A[t])，cpot[col]++
     *   只扫描 A 表一遍，时间复杂度 O(Cols + Terms)。
     *
     * 注：index.html 的脚本标签为固定顺序且不允许改动，无法新增 js
     * 文件加载入口，故本模块与视图控制器 vizView 同文件定义。
     * ============================================================ */
    (function () {
        'use strict';

        const SM_COLORS = {
            default: '#4a90d9',   // 常规三元组（蓝）
            active: '#f5a623',    // 正在读取 / 统计（琥珀）
            modify: '#e74c3c',    // 正在写入 / 被修改（红）
            done: '#2ecc71',      // 完成（绿）
            empty: '#eef1f5',     // 空槽位
            label: '#666666',
            sub: '#999999'
        };

        const SparseMatrixViz = {

            /**
             * 生成快速转置动画步骤
             * @param {Array<{r:number,c:number,v:number}>} triples - A 的行序三元组表
             * @param {number} rows - A 的行数
             * @param {number} cols - A 的列数
             * @returns {Array} steps
             */
            fastTranspose(triples, rows, cols) {
                const A = (triples || []).map(t => ({ r: t.r, c: t.c, v: t.v }));
                const terms = A.length;
                const Cols = Math.max(cols | 0, 1);
                const Rows = Math.max(rows | 0, 1);
                const steps = [];

                const mk = (extra) => Object.assign({
                    type_list: 'sparse',
                    phase: 'init',
                    A: A.map(t => ({ r: t.r, c: t.c, v: t.v })),
                    B: new Array(terms).fill(null),
                    num: new Array(Cols).fill(0),
                    cpot: new Array(Cols).fill(null),
                    activeA: null,   // 正在读取的 A 表下标
                    activeB: null,   // 正在写入的 B 表下标
                    activeNum: null, // 正在统计的 num 列
                    activeCpot: null,// 正在计算/更新的 cpot 列
                    description: ''
                }, extra);

                steps.push(mk({
                    description: `稀疏矩阵快速转置：A 为 ${Rows}×${Cols} 矩阵，三元组表共 ${terms} 项（按行序存放）。思想：按列号直接确定该项在 B 表中的位置`
                }));

                if (terms === 0) {
                    steps.push(mk({
                        phase: 'done',
                        description: '三元组表为空（零矩阵），转置结果 B 仍为空表'
                    }));
                    return steps;
                }

                /* ---------- ① 统计 num[col] ---------- */
                const num = new Array(Cols).fill(0);
                steps.push(mk({
                    phase: 'num',
                    num: num.slice(),
                    description: '① 统计各列非零元个数：num[col] 全部清零。num[col] 即 A 第 col 列（转置后 B 第 col 行）的非零元个数'
                }));
                for (let t = 0; t < terms; t++) {
                    const col = A[t].c;
                    num[col]++;
                    steps.push(mk({
                        phase: 'num',
                        num: num.slice(),
                        activeA: t,
                        activeNum: col,
                        description: `扫描 A 表第 ${t} 项 (${A[t].r},${col},${A[t].v})：列号 = ${col}，num[${col}]++ → ${num[col]}`
                    }));
                }

                /* ---------- ② 递推 cpot ---------- */
                const cpot = new Array(Cols).fill(0);
                steps.push(mk({
                    phase: 'cpot',
                    num: num.slice(),
                    cpot: cpot.slice(),
                    activeCpot: 0,
                    description: '② 求各行起始位置：cpot[0] = 0，即 B 表第 0 行的非零元从下标 0 开始存放'
                }));
                for (let col = 1; col < Cols; col++) {
                    cpot[col] = cpot[col - 1] + num[col - 1];
                    steps.push(mk({
                        phase: 'cpot',
                        num: num.slice(),
                        cpot: cpot.slice(),
                        activeNum: col - 1,
                        activeCpot: col,
                        description: `cpot[${col}] = cpot[${col - 1}] + num[${col - 1}] = ${cpot[col - 1]} + ${num[col - 1]} = ${cpot[col]}（B 表第 ${col} 行的起始存放位置）`
                    }));
                }
                steps.push(mk({
                    phase: 'cpot',
                    num: num.slice(),
                    cpot: cpot.slice(),
                    description: `位置表计算完成：cpot = [${cpot.join(', ')}]，num = [${num.join(', ')}]`
                }));

                /* ---------- ③ 逐项装入 B ---------- */
                const B = new Array(terms).fill(null);
                const work = cpot.slice();
                for (let t = 0; t < terms; t++) {
                    const it = A[t];
                    const j = work[it.c];
                    B[j] = { r: it.c, c: it.r, v: it.v };
                    work[it.c]++;
                    steps.push(mk({
                        phase: 'place',
                        B: B.map(x => (x ? { r: x.r, c: x.c, v: x.v } : null)),
                        num: num.slice(),
                        cpot: work.slice(),
                        activeA: t,
                        activeB: j,
                        activeCpot: it.c,
                        description: `③ 取 A 表第 ${t} 项 (${it.r},${it.c},${it.v})：转置后行号 = ${it.c}，直接定位 j = cpot[${it.c}] = ${j}，写入 B[${j}] = (${it.c},${it.r},${it.v})；cpot[${it.c}]++ → ${work[it.c]}（同列下一项的存放位置）`
                    }));
                }

                steps.push(mk({
                    phase: 'done',
                    B: B.map(x => (x ? { r: x.r, c: x.c, v: x.v } : null)),
                    num: num.slice(),
                    cpot: cpot.slice(),
                    description: `快速转置完成！B 表自然按行序有序。只扫描 A 表一遍：时间复杂度 O(Cols + Terms) = O(${Cols} + ${terms})，普通转置为 O(Cols × Terms) = O(${Cols} × ${terms})`
                }));

                return steps;
            },

            /**
             * 渲染：A 三元组表 / num 表 / cpot 表 / B 三元组表
             * @param {VizRenderer} renderer
             * @param {Object} step
             */
            render(renderer, step) {
                if (!renderer || !step) return;
                const W = renderer.width;
                const H = renderer.height;
                const A = step.A || [];
                const B = step.B || [];
                const num = step.num || [];
                const cpot = step.cpot || [];
                const Cols = num.length;
                const terms = A.length;

                const pad = 28;
                // 自适应：先按标尺测高，超出则整体压缩行高
                let cellH = 28, gap = 6, labelH = 16;
                const perRowA = Math.max(1, Math.floor((W - pad * 2 + gap) / 74));
                const rowsA = Math.max(1, Math.ceil(Math.max(terms, 1) / perRowA));
                const rowsB = Math.max(1, Math.ceil(Math.max(B.length, 1) / perRowA));
                let needed = labelH * 3 + rowsA * (cellH + gap) + rowsB * (cellH + gap) +
                    (cellH + gap) * 2 + 26 + 30;
                if (needed > H - 16) {
                    const f = (H - 16) / needed;
                    cellH = Math.max(14, Math.floor(cellH * f));
                    gap = Math.max(3, Math.floor(gap * f));
                    labelH = Math.max(11, Math.floor(labelH * f));
                }

                const drawLabel = (text, y, color) => {
                    renderer.drawText(text, pad + 86, y + labelH / 2, color || SM_COLORS.label, 12);
                };

                let y = 14;

                /* ---- A 三元组表 ---- */
                drawLabel('A 的三元组表（行序）', y);
                y += labelH;
                for (let t = 0; t < terms; t++) {
                    const row = Math.floor(t / perRowA);
                    const k = t % perRowA;
                    const x = pad + k * 74;
                    const yy = y + row * (cellH + gap);
                    let color = SM_COLORS.default;
                    if (step.activeA === t) {
                        color = step.phase === 'place' ? SM_COLORS.modify : SM_COLORS.active;
                    }
                    renderer.drawRoundedRect(x, yy, 68, cellH, 4, color, `${A[t].r},${A[t].c},${A[t].v}`);
                    renderer.drawText('(' + t + ')', x + 34, yy + cellH + 8, SM_COLORS.sub, 9);
                }
                y += rowsA * (cellH + gap) + 16;

                /* ---- num 表 ---- */
                drawLabel('num[col]：各列非零元个数', y);
                y += labelH;
                for (let col = 0; col < Cols; col++) {
                    const x = pad + col * 38;
                    let color = SM_COLORS.empty;
                    if (step.activeNum === col) {
                        color = step.phase === 'num' ? SM_COLORS.active : SM_COLORS.modify;
                    }
                    renderer.drawRect(x, y, 34, cellH, color, String(num[col]));
                    renderer.drawText('col' + col, x + 17, y + cellH + 8, SM_COLORS.sub, 9);
                }
                y += cellH + 20;

                /* ---- cpot 表 ---- */
                drawLabel('cpot[col]：B 表各行起始位置', y);
                y += labelH;
                for (let col = 0; col < Cols; col++) {
                    const x = pad + col * 38;
                    const known = cpot[col] !== null && cpot[col] !== undefined;
                    let color = SM_COLORS.empty;
                    let text = '—';
                    if (known) {
                        text = String(cpot[col]);
                        if (step.activeCpot === col) {
                            color = step.phase === 'cpot' ? SM_COLORS.active : SM_COLORS.modify;
                        } else if (step.phase === 'done') {
                            color = SM_COLORS.done;
                        }
                    }
                    renderer.drawRect(x, y, 34, cellH, color, text);
                    renderer.drawText('col' + col, x + 17, y + cellH + 8, SM_COLORS.sub, 9);
                }
                y += cellH + 20;

                /* ---- B 三元组表 ---- */
                drawLabel('B 的三元组表（转置结果）', y, step.phase === 'done' ? SM_COLORS.done : SM_COLORS.label);
                y += labelH;
                for (let t = 0; t < B.length; t++) {
                    const row = Math.floor(t / perRowA);
                    const k = t % perRowA;
                    const x = pad + k * 74;
                    const yy = y + row * (cellH + gap);
                    const it = B[t];
                    if (it) {
                        let color = SM_COLORS.done;
                        if (step.activeB === t && step.phase === 'place') color = SM_COLORS.modify;
                        renderer.drawRoundedRect(x, yy, 68, cellH, 4, color, `${it.r},${it.c},${it.v}`);
                    } else {
                        const ctx = renderer.ctx;
                        if (ctx) {
                            ctx.setLineDash([3, 3]);
                            ctx.strokeStyle = '#cccccc';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(x + 1, yy + 1, 66, cellH - 2);
                            ctx.setLineDash([]);
                        }
                    }
                    renderer.drawText('B[' + t + ']', x + 34, yy + cellH + 8, SM_COLORS.sub, 9);
                }
            }
        };

        window.SparseMatrixViz = SparseMatrixViz;
    })();
})();
