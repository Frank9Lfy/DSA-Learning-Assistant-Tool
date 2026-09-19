/* ========================================
   codeExamples.js - Code examples from course
   Extracted and improved from PPT/assignments
   ======================================== */

const CODE_EXAMPLES = {
  // === Sequential List ===
  'seqlist': {
    title: '顺序表 SeqList (C++模板)',
    category: '线性表',
    difficulty: 'easy',
    code: `#include <iostream>
#include <cassert>
using namespace std;

const int DEFAULT_SIZE = 100;

template <typename T>
class SeqList {
protected:
    T *data;       // 动态数组指针
    int maxSize;   // 最大容量
    int last;      // 最后元素下标（-1=空表）

public:
    // 构造函数
    SeqList(int sz = DEFAULT_SIZE) : maxSize(sz), last(-1) {
        data = new T[maxSize];
        assert(data != NULL);
    }

    // 拷贝构造函数
    SeqList(const SeqList<T>& L) : maxSize(L.maxSize), last(L.last) {
        data = new T[maxSize];
        for (int i = 0; i <= last; i++)
            data[i] = L.data[i];
    }

    ~SeqList() { delete[] data; }

    // 动态扩容
    void reSize(int newSize) {
        if (newSize <= 0 || newSize == maxSize) return;
        T* newData = new T[newSize];
        int n = min(last + 1, newSize);
        for (int i = 0; i < n; i++) newData[i] = data[i];
        delete[] data;
        data = newData;
        maxSize = newSize;
        if (last >= newSize) last = newSize - 1;
    }

    int Length() const { return last + 1; }
    int Size() const { return maxSize; }
    bool IsEmpty() const { return last == -1; }
    bool IsFull() const { return last == maxSize - 1; }

    // 按值查找 O(n)
    int Search(const T& x) const {
        for (int i = 0; i <= last; i++)
            if (data[i] == x) return i + 1;  // 返回位序
        return 0;  // 未找到
    }

    // 按位取值 O(1)
    bool getData(int i, T& x) const {
        if (i < 1 || i > last + 1) return false;
        x = data[i - 1];
        return true;
    }

    // 插入 O(n)
    bool Insert(int i, const T& x) {
        if (IsFull()) reSize(2 * maxSize);  // 自动扩容
        if (i < 0 || i > last + 1) return false;
        for (int j = last; j >= i; j--)
            data[j + 1] = data[j];
        data[i] = x;
        last++;
        return true;
    }

    // 删除 O(n)
    bool Remove(int i, T& x) {
        if (IsEmpty() || i < 1 || i > last + 1) return false;
        x = data[i - 1];
        for (int j = i; j <= last; j++)
            data[j - 1] = data[j];
        last--;
        return true;
    }

    // 冒泡排序 O(n²)
    void Sort() {
        for (int i = 0; i < last; i++) {
            bool swapped = false;
            for (int j = last; j > i; j--) {
                if (data[j - 1] > data[j]) {
                    swap(data[j - 1], data[j]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    // 输出
    void output() const {
        for (int i = 0; i <= last; i++)
            cout << data[i] << " ";
        cout << endl;
    }
};`,
    testCases: [
      {
        name: '基本插入和删除',
        input: '',
        code: `int main() {
    SeqList<int> list(10);
    for (int i = 1; i <= 5; i++) list.Insert(i-1, i*10);
    list.output();  // 10 20 30 40 50
    
    int val;
    list.Remove(3, val);  // 删除第3位(30)
    cout << "Removed: " << val << endl;
    list.output();  // 10 20 40 50
    
    cout << "Search 40: " << list.Search(40) << endl;  // 3
    return 0;
}`
      }
    ],
    problems: [
      {
        id: 'seqlist-reverse',
        title: '反转顺序表',
        description: '在不使用额外数组的情况下，反转顺序表中的所有元素。',
        difficulty: 'easy',
        template: `// 在SeqList类中添加 Reverse() 方法
// 要求时间O(n)，空间O(1)
void Reverse() {
    // 你的代码
}`,
        testCases: [
          { input: '1 2 3 4 5', expected: '5 4 3 2 1' },
          { input: '10 20 30', expected: '30 20 10' },
        ]
      }
    ]
  },

  // === Linked List ===
  'linkedlist': {
    title: '单链表 LinkedList (C++模板)',
    category: '线性表',
    difficulty: 'easy',
    code: `#include <iostream>
#include <cassert>
using namespace std;

template <typename T>
struct LinkNode {
    T data;
    LinkNode<T>* link;
    LinkNode(LinkNode<T>* ptr = NULL) : link(ptr) {}
    LinkNode(const T& item, LinkNode<T>* ptr = NULL)
        : data(item), link(ptr) {}
};

template <typename T>
class LinkedList {
protected:
    LinkNode<T>* first;  // 头结点指针

public:
    LinkedList() { first = new LinkNode<T>; }
    LinkedList(const T& x) { first = new LinkNode<T>(x); }
    
    ~LinkedList() {
        makeEmpty();
        delete first;
    }

    void makeEmpty() {
        LinkNode<T>* q;
        while (first->link) {
            q = first->link;
            first->link = q->link;
            delete q;
        }
    }

    int Length() const {
        int count = 0;
        LinkNode<T>* p = first->link;
        while (p) { count++; p = p->link; }
        return count;
    }

    // 按值查找 O(n)
    LinkNode<T>* Search(const T& x) {
        LinkNode<T>* cur = first->link;
        while (cur && cur->data != x)
            cur = cur->link;
        return cur;
    }

    // 按位定位 O(n)：返回第i个结点的指针
    LinkNode<T>* Locate(int i) {
        if (i < 0) return NULL;
        LinkNode<T>* cur = first;
        int k = 0;
        while (cur && k < i) { cur = cur->link; k++; }
        return cur;
    }

    // 在第i个结点后插入 O(1)（已定位时）
    bool Insert(int i, const T& x) {
        LinkNode<T>* cur = Locate(i);
        if (!cur) return false;
        LinkNode<T>* node = new LinkNode<T>(x);
        node->link = cur->link;
        cur->link = node;
        return true;
    }

    // 删除第i个结点 O(1)（已定位时）
    bool Remove(int i, T& x) {
        LinkNode<T>* prev = Locate(i - 1);
        if (!prev || !prev->link) return false;
        LinkNode<T>* del = prev->link;
        prev->link = del->link;
        x = del->data;
        delete del;
        return true;
    }

    // 链表反转（原地逆置）
    void Inverse() {
        LinkNode<T>* h = NULL, *p = first->link, *pr;
        while (p) {
            pr = h;
            h = p;
            p = h->link;
            h->link = pr;
        }
        first->link = h;
    }

    // 尾插法建表
    void inputRear(T endTag) {
        LinkNode<T>* last = first;
        T val;
        while (cin >> val && val != endTag) {
            last->link = new LinkNode<T>(val);
            last = last->link;
        }
    }

    void output() const {
        LinkNode<T>* cur = first->link;
        while (cur) {
            cout << cur->data << " ";
            cur = cur->link;
        }
        cout << endl;
    }
};`,
    testCases: [
      {
        name: '插入与反转',
        input: '',
        code: `int main() {
    LinkedList<int> list;
    for (int i = 1; i <= 5; i++) list.Insert(i-1, i);
    list.output();   // 1 2 3 4 5
    list.Inverse();
    list.output();   // 5 4 3 2 1
    cout << "Length: " << list.Length() << endl;
    return 0;
}`
      }
    ],
    problems: [
      {
        id: 'list-merge',
        title: '合并两个有序链表',
        description: '给定两个升序链表，将它们合并为一个新的升序链表。',
        difficulty: 'medium',
        template: `// 合并两个有序链表（返回新链表的头指针）
LinkNode<int>* Merge(LinkNode<int>* h1, LinkNode<int>* h2) {
    // 你的代码
}`,
        testCases: [
          { input: '1 3 5 / 2 4 6', expected: '1 2 3 4 5 6' },
        ]
      }
    ]
  },

  // === Sorting Algorithms ===
  'sorting': {
    title: '排序算法合集',
    category: '排序',
    difficulty: 'medium',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 1. 冒泡排序 O(n²) 稳定
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// 2. 选择排序 O(n²) 不稳定
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        swap(arr[i], arr[minIdx]);
    }
}

// 3. 插入排序 O(n²) 稳定
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// 4. 快速排序 O(n log n) 不稳定
int partition(int arr[], int lo, int hi) {
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}
void quickSort(int arr[], int lo, int hi) {
    if (lo < hi) {
        int pi = partition(arr, lo, hi);
        quickSort(arr, lo, pi - 1);
        quickSort(arr, pi + 1, hi);
    }
}

// 5. 归并排序 O(n log n) 稳定
void merge(int arr[], int l, int m, int r) {
    vector<int> L(arr+l, arr+m+1), R(arr+m+1, arr+r+1);
    int i=0, j=0, k=l;
    while (i < L.size() && j < R.size())
        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r-l)/2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}

// 6. 堆排序 O(n log n) 不稳定
void heapify(int arr[], int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    testCases: [],
    problems: []
  },

  // === Binary Search Tree ===
  'bst': {
    title: '二叉搜索树 BST',
    category: '树',
    difficulty: 'medium',
    code: `#include <iostream>
#include <queue>
using namespace std;

struct BSTNode {
    int key;
    BSTNode *left, *right;
    BSTNode(int k) : key(k), left(NULL), right(NULL) {}
};

// 查找 O(h)
BSTNode* search(BSTNode* root, int key) {
    if (!root || root->key == key) return root;
    return (key < root->key) ? search(root->left, key)
                             : search(root->right, key);
}

// 插入 O(h)
BSTNode* insert(BSTNode* root, int key) {
    if (!root) return new BSTNode(key);
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;
}

// 找最小结点
BSTNode* findMin(BSTNode* node) {
    while (node && node->left) node = node->left;
    return node;
}

// 删除 O(h)
BSTNode* remove(BSTNode* root, int key) {
    if (!root) return NULL;
    if (key < root->key)
        root->left = remove(root->left, key);
    else if (key > root->key)
        root->right = remove(root->right, key);
    else {
        if (!root->left) {
            BSTNode* tmp = root->right;
            delete root; return tmp;
        }
        if (!root->right) {
            BSTNode* tmp = root->left;
            delete root; return tmp;
        }
        BSTNode* succ = findMin(root->right);
        root->key = succ->key;
        root->right = remove(root->right, succ->key);
    }
    return root;
}

// 中序遍历（有序输出）
void inorder(BSTNode* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->key << " ";
    inorder(root->right);
}

// 层序遍历
void levelorder(BSTNode* root) {
    if (!root) return;
    queue<BSTNode*> q;
    q.push(root);
    while (!q.empty()) {
        BSTNode* n = q.front(); q.pop();
        cout << n->key << " ";
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
}`,
    testCases: [],
    problems: [
      {
        id: 'bst-height',
        title: '计算BST的高度',
        description: '给定BST的根结点，计算树的高度。',
        difficulty: 'easy',
        template: `int height(BSTNode* root) {
    // 你的代码
}`,
        testCases: []
      }
    ]
  },

  // === Graph Algorithms ===
  'graph': {
    title: '图算法合集',
    category: '图',
    difficulty: 'hard',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <climits>
using namespace std;

const int MAXV = 100;
vector<int> adj[MAXV];
bool visited[MAXV];

// DFS 深度优先搜索
void dfs(int v) {
    visited[v] = true;
    cout << v << " ";
    for (int u : adj[v])
        if (!visited[u]) dfs(u);
}

// BFS 广度优先搜索
void bfs(int start) {
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        cout << v << " ";
        for (int u : adj[v])
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
            }
    }
}

// Dijkstra 最短路径
struct Edge { int to, w; };
vector<Edge> adjW[MAXV];
int dist[MAXV];

void dijkstra(int src, int n) {
    fill(dist, dist + n, INT_MAX);
    fill(visited, visited + n, false);
    dist[src] = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int j = 0; j < n; j++)
            if (!visited[j] && (u == -1 || dist[j] < dist[u])) u = j;
        if (dist[u] == INT_MAX) break;
        visited[u] = true;
        for (auto& e : adjW[u])
            if (dist[u] + e.w < dist[e.to])
                dist[e.to] = dist[u] + e.w;
    }
}`,
    testCases: [],
    problems: []
  },

  // === Dynamic Programming ===
  'dp': {
    title: '动态规划经典问题',
    category: '算法',
    difficulty: 'hard',
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// 1. 斐波那契数列（记忆化）
int fib(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}

// 2. 最长公共子序列 LCS
int lcs(const string& X, const string& Y) {
    int m = X.size(), n = Y.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (X[i-1]==Y[j-1]) ?
                dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}

// 3. 0-1 背包
int knapsack(int W, vector<int>& w, vector<int>& v) {
    int n = w.size();
    vector<int> dp(W+1, 0);
    for (int i = 0; i < n; i++)
        for (int j = W; j >= w[i]; j--)
            dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
    return dp[W];
}

// 4. 最长递增子序列 LIS
int lis(vector<int>& arr) {
    int n = arr.size();
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (arr[j] < arr[i])
                dp[i] = max(dp[i], dp[j]+1);
        ans = max(ans, dp[i]);
    }
    return ans;
}

// 5. 编辑距离
int editDistance(const string& a, const string& b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (a[i-1]==b[j-1]) ?
                dp[i-1][j-1] :
                1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[m][n];
}`,
    testCases: [],
    problems: [
      {
        id: 'dp-climb',
        title: '爬楼梯',
        description: '每次可以爬1或2个台阶，求到第n阶有多少种方法。',
        difficulty: 'easy',
        template: `int climbStairs(int n) {
    // 你的代码（动态规划）
}`,
        testCases: [
          { input: '2', expected: '2' },
          { input: '3', expected: '3' },
          { input: '5', expected: '8' },
        ]
      }
    ]
  },
};

// Judge problem database (for code judge module)
const JUDGE_PROBLEMS = [
  {
    id: 'seqlist-reverse',
    title: '反转顺序表',
    description: '实现一个函数，将顺序表中的元素反转。\n输入：第一行为元素个数n，第二行为n个整数。\n输出：反转后的元素，空格分隔。',
    difficulty: 'easy',
    category: '线性表',
    template: `#include <iostream>
using namespace std;

void reverse(int arr[], int n) {
    // 你的代码
    
}

int main() {
    int n;
    cin >> n;
    int arr[1000];
    for (int i = 0; i < n; i++) cin >> arr[i];
    reverse(arr, n);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << arr[i];
    }
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
      { stdin: '3\n10 20 30', expected: '30 20 10' },
      { stdin: '1\n42', expected: '42' },
    ]
  },
  {
    id: 'bubble-sort',
    title: '冒泡排序',
    description: '实现冒泡排序算法。\n输入：第一行为n，第二行为n个整数。\n输出：排序后的元素。',
    difficulty: 'easy',
    category: '排序',
    template: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    // 你的代码
    
}

int main() {
    int n;
    cin >> n;
    int arr[1000];
    for (int i = 0; i < n; i++) cin >> arr[i];
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << arr[i];
    }
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n5 3 1 4 2', expected: '1 2 3 4 5' },
      { stdin: '6\n6 5 4 3 2 1', expected: '1 2 3 4 5 6' },
      { stdin: '4\n1 1 1 1', expected: '1 1 1 1' },
    ]
  },
  {
    id: 'binary-search',
    title: '二分查找',
    description: '在有序数组中查找目标值。\n输入：第一行为n，第二行为n个有序整数，第三行为目标值。\n输出：目标值的下标（从0开始），未找到输出-1。',
    difficulty: 'easy',
    category: '查找',
    template: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    // 你的代码
    return -1;
}

int main() {
    int n;
    cin >> n;
    int arr[1000];
    for (int i = 0; i < n; i++) cin >> arr[i];
    int target;
    cin >> target;
    cout << binarySearch(arr, n, target) << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n1 3 5 7 9\n5', expected: '2' },
      { stdin: '5\n1 3 5 7 9\n6', expected: '-1' },
      { stdin: '5\n1 3 5 7 9\n1', expected: '0' },
    ]
  },
  {
    id: 'fibonacci-dp',
    title: '斐波那契数列 (DP)',
    description: '用动态规划求第n个斐波那契数。F(0)=0, F(1)=1。\n输入：n\n输出：F(n)',
    difficulty: 'easy',
    category: '动态规划',
    template: `#include <iostream>
using namespace std;

long long fib(int n) {
    // 你的代码（使用动态规划，不要用递归）
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << fib(n) << endl;
    return 0;
}`,
    testCases: [
      { stdin: '0', expected: '0' },
      { stdin: '1', expected: '1' },
      { stdin: '10', expected: '55' },
      { stdin: '20', expected: '6765' },
    ]
  },
  {
    id: 'knapsack-01',
    title: '0-1 背包问题',
    description: '输入：第一行为n和W（物品数和背包容量）。\n接下来n行，每行为w_i和v_i（重量和价值）。\n输出：最大价值。',
    difficulty: 'medium',
    category: '动态规划',
    template: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, W;
    cin >> n >> W;
    vector<int> w(n), v(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    
    // 你的代码
    
    cout << 0 << endl;
    return 0;
}`,
    testCases: [
      { stdin: '3 50\n10 60\n20 100\n30 120', expected: '220' },
      { stdin: '4 10\n2 3\n3 4\n4 5\n5 6', expected: '13' },
    ]
  },
  {
    id: 'lcs',
    title: '最长公共子序列',
    description: '输入两行字符串，输出它们的最长公共子序列的长度。',
    difficulty: 'medium',
    category: '动态规划',
    template: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string X, Y;
    cin >> X >> Y;
    
    // 你的代码
    
    cout << 0 << endl;
    return 0;
}`,
    testCases: [
      { stdin: 'ABCBDAB\nBDCAB', expected: '4' },
      { stdin: 'AGGTAB\nGXTXAYB', expected: '4' },
    ]
  },
  {
    id: 'linked-list-reverse',
    title: '链表反转',
    description: '输入n个整数构建链表，反转后输出。',
    difficulty: 'medium',
    category: '线性表',
    template: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(NULL) {}
};

Node* reverseList(Node* head) {
    // 你的代码
    return head;
}

int main() {
    int n;
    cin >> n;
    Node dummy(0);
    Node* tail = &dummy;
    for (int i = 0; i < n; i++) {
        int val; cin >> val;
        tail->next = new Node(val);
        tail = tail->next;
    }
    Node* newHead = reverseList(dummy.next);
    Node* cur = newHead;
    while (cur) {
        if (cur != newHead) cout << " ";
        cout << cur->data;
        cur = cur->next;
    }
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
      { stdin: '1\n42', expected: '42' },
    ]
  },
  {
    id: 'quick-sort',
    title: '快速排序',
    description: '实现快速排序算法。\n输入：第一行为n，第二行为n个整数。\n输出：排序后的元素。',
    difficulty: 'medium',
    category: '排序',
    template: `#include <iostream>
using namespace std;

void quickSort(int arr[], int lo, int hi) {
    // 你的代码
    
}

int main() {
    int n;
    cin >> n;
    int arr[1000];
    for (int i = 0; i < n; i++) cin >> arr[i];
    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << arr[i];
    }
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n5 3 1 4 2', expected: '1 2 3 4 5' },
      { stdin: '8\n38 27 43 3 9 82 10 19', expected: '3 9 10 19 27 38 43 82' },
    ]
  },

  // ═══════════ 新增：数据结构课程编程题 ═══════════
  {
    id: 'stack-parentheses',
    title: '括号匹配 (栈)',
    description: '给定一行仅含 ()[]{} 的括号串，判断是否合法匹配。\n合法：左右配对且嵌套正确。输出 Yes 或 No。\n提示：用栈，遇左括号入栈，遇右括号检查栈顶。',
    difficulty: 'easy',
    category: '栈与队列',
    template: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(const string& s) {
    // 你的代码：用栈判断括号匹配
    
    return true;
}

int main() {
    string s;
    cin >> s;
    cout << (isValid(s) ? "Yes" : "No") << endl;
    return 0;
}`,
    testCases: [
      { stdin: '([)]', expected: 'No' },
      { stdin: '{[()]}', expected: 'Yes' },
      { stdin: '(((', expected: 'No' },
      { stdin: '()[]{}', expected: 'Yes' },
    ]
  },
  {
    id: 'postfix-eval',
    title: '后缀表达式求值 (栈)',
    description: '求后缀表达式的值。输入一行空格分隔的 token：整数或 + - * /。\n输出计算结果（整数，除法为整除）。提示：操作数入栈，遇运算符弹出两个操作数计算后压回。',
    difficulty: 'medium',
    category: '栈与队列',
    template: `#include <iostream>
#include <stack>
#include <string>
#include <sstream>
using namespace std;

int evalPostfix(const string& line) {
    // 你的代码
    
    return 0;
}

int main() {
    string line;
    getline(cin, line);
    cout << evalPostfix(line) << endl;
    return 0;
}`,
    testCases: [
      { stdin: '3 4 5 * +', expected: '23' },
      { stdin: '5 3 - 2 *', expected: '4' },
      { stdin: '2 3 4 + *', expected: '14' },
      { stdin: '10 2 / 3 +', expected: '8' },
    ]
  },
  {
    id: 'circular-queue',
    title: '循环队列模拟',
    description: '容量为 k 的循环队列（牺牲一个单元法，最多存 k-1 个元素）。\n输入：第一行 k 和操作数 m；接下来 m 行每行 "E x"（入队）或 "D"（出队）。\n输出：队满时输出 FULL，队空时出队输出 EMPTY，正常出队输出该元素。',
    difficulty: 'medium',
    category: '栈与队列',
    template: `#include <iostream>
using namespace std;

int que[100005];
int front_ = 0, rear = 0;  // front 指向队头, rear 指向队尾下一位置

int main() {
    int k, m;
    cin >> k >> m;
    while (m--) {
        string op;
        cin >> op;
        if (op == "E") {
            int x; cin >> x;
            // 你的代码：判满 (rear+1)%k==front 输出 FULL，否则入队
            
        } else {
            // 你的代码：判空 front==rear 输出 EMPTY，否则出队输出
            
        }
    }
    return 0;
}`,
    testCases: [
      { stdin: '3 8\nE 1\nE 2\nE 3\nD\nE 3\nD\nD\nD', expected: 'FULL\n1\n2\n3\nEMPTY' },
      { stdin: '2 4\nE 5\nE 6\nD\nE 7', expected: 'FULL\n5' },
      { stdin: '3 2\nD\nE 9', expected: 'EMPTY' },
    ]
  },
  {
    id: 'string-match-count',
    title: '串匹配：统计出现次数 (KMP)',
    description: '统计模式串 P 在主串 T 中出现的次数（允许重叠）。\n输入两行：T 和 P。输出次数。\n提示：用 KMP，匹配成功后 j = next[j] 继续匹配。',
    difficulty: 'medium',
    category: '串',
    template: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int kmpCount(const string& T, const string& P) {
    int n = T.size(), m = P.size();
    if (m == 0 || m > n) return 0;
    // 你的代码：先求 next 数组，再匹配计数（允许重叠）
    
    return 0;
}

int main() {
    string T, P;
    cin >> T >> P;
    cout << kmpCount(T, P) << endl;
    return 0;
}`,
    testCases: [
      { stdin: 'abababa\naba', expected: '3' },
      { stdin: 'aaaa\naa', expected: '3' },
      { stdin: 'hello world\nxyz', expected: '0' },
    ]
  },
  {
    id: 'sparse-transpose',
    title: '稀疏矩阵快速转置',
    description: '用三元组顺序表存储稀疏矩阵，实现快速转置。\n输入：第一行 mu nu tu（行数 列数 非零元个数）；接下来 tu 行 i j v（1-based，按行序给出）。\n输出：转置矩阵的三元组（按行序，每行输出 j i v）。',
    difficulty: 'hard',
    category: '数组与矩阵',
    template: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int mu, nu, tu;
    cin >> mu >> nu >> tu;
    vector<int> r(tu), c(tu), v(tu);
    for (int i = 0; i < tu; i++) cin >> r[i] >> c[i] >> v[i];

    // 你的代码：统计 num[col] 与 cpot[col]，直接定位转置
    
    return 0;
}`,
    testCases: [
      { stdin: '3 3 3\n1 2 5\n2 1 3\n3 3 8', expected: '1 2 3\n2 1 5\n3 3 8' },
      { stdin: '6 7 8\n1 2 12\n1 3 9\n3 1 -3\n3 6 14\n4 3 24\n5 2 18\n6 1 15\n6 4 -7', expected: '1 3 -3\n1 6 15\n2 1 12\n2 5 18\n3 1 9\n3 4 24\n4 6 -7\n6 3 14' },
    ]
  },
  {
    id: 'rebuild-binary-tree',
    title: '前序 + 中序还原二叉树',
    description: '给定二叉树的前序遍历和中序遍历（大写字母，无重复），输出后序遍历。',
    difficulty: 'hard',
    category: '树',
    template: `#include <iostream>
#include <string>
using namespace std;

// 输出 pre[pl..pr] / in[il..ir] 子树的后序
void postorder(const string& pre, const string& in, int pl, int pr, int il, int ir) {
    if (pl > pr) return;
    // 你的代码：根为 pre[pl]，在中序中定位根，递归左右子树，最后输出根
    
}

int main() {
    string pre, in;
    cin >> pre >> in;
    postorder(pre, in, 0, pre.size() - 1, 0, in.size() - 1);
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: 'ABDECF\nDBEAFC', expected: 'DEBFCA' },
      { stdin: 'ABC\nBAC', expected: 'BCA' },
      { stdin: 'AB\nBA', expected: 'BA' },
    ]
  },
  {
    id: 'bst-inorder',
    title: '二叉搜索树的构建与中序遍历',
    description: '依次插入 n 个互不相同的整数构建 BST，输出其中序遍历序列（空格分隔）。',
    difficulty: 'easy',
    category: '树',
    template: `#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    Node(int k) : key(k), left(NULL), right(NULL) {}
};

Node* insert(Node* root, int key) {
    // 你的代码：BST 插入
    
    return root;
}

void inorder(Node* root, bool& first) {
    // 你的代码：中序遍历输出（第一个数前无空格）
    
}

int main() {
    int n; cin >> n;
    Node* root = NULL;
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        root = insert(root, x);
    }
    bool first = true;
    inorder(root, first);
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5\n50 30 70 20 40', expected: '20 30 40 50 70' },
      { stdin: '3\n2 1 3', expected: '1 2 3' },
      { stdin: '7\n5 3 8 1 4 7 9', expected: '1 3 4 5 7 8 9' },
    ]
  },
  {
    id: 'heap-k-smallest',
    title: '堆：输出最小的 k 个数',
    description: '建小顶堆，弹出堆顶 k 次，依次输出。\n输入：第一行 n 和 k；第二行 n 个整数。\n输出：最小的 k 个数（升序，空格分隔）。',
    difficulty: 'medium',
    category: '堆与排序',
    template: `#include <iostream>
using namespace std;

int heapArr[100005], heapSize = 0;

void siftDown(int i) {
    // 你的代码：小顶堆向下调整
    
}

void siftUp(int i) {
    // 你的代码：小顶堆向上调整
    
}

int popMin() {
    // 你的代码：弹出堆顶
    
    return 0;
}

int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        cin >> heapArr[heapSize++];
        siftUp(heapSize - 1);
    }
    for (int i = 0; i < k; i++) {
        if (i > 0) cout << " ";
        cout << popMin();
    }
    cout << endl;
    return 0;
}`,
    testCases: [
      { stdin: '5 3\n5 3 8 1 2', expected: '1 2 3' },
      { stdin: '4 4\n9 7 5 3', expected: '3 5 7 9' },
      { stdin: '6 1\n10 2 4 6 1 9', expected: '1' },
    ]
  },
  {
    id: 'huffman-wpl',
    title: '哈夫曼树的 WPL',
    description: '给定 n 个叶子权值，求哈夫曼树的带权路径长度 WPL（所有叶子的 权值×深度 之和）。\n提示：WPL 也等于所有合并产生的新结点权值之和。\n输入：n 及 n 个权值。输出：WPL。',
    difficulty: 'hard',
    category: '树',
    template: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n; cin >> n;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) {
        int w; cin >> w;
        pq.push(w);
    }
    // 你的代码：每次取最小两个合并，累计 WPL
    
    return 0;
}`,
    testCases: [
      { stdin: '4\n7 5 2 4', expected: '35' },
      { stdin: '3\n1 2 3', expected: '9' },
      { stdin: '5\n1 1 1 1 1', expected: '12' },
    ]
  },
  {
    id: 'bfs-shortest',
    title: '无权图最短路边数 (BFS)',
    description: 'n 个点（编号 1..n）m 条无向边的图，求 s 到 t 的最少边数，不可达输出 -1。\n输入：第一行 n m；接下来 m 行 u v；最后一行 s t。',
    difficulty: 'medium',
    category: '图',
    template: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> adj[100005];

int bfs(int s, int t, int n) {
    // 你的代码：BFS 求最少边数
    
    return -1;
}

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    int s, t; cin >> s >> t;
    cout << bfs(s, t, n) << endl;
    return 0;
}`,
    testCases: [
      { stdin: '4 4\n1 2\n1 3\n2 4\n3 4\n1 4', expected: '2' },
      { stdin: '4 3\n1 2\n2 3\n3 4\n1 4', expected: '3' },
      { stdin: '3 1\n2 3\n1 3', expected: '-1' },
    ]
  },
  {
    id: 'dijkstra-shortest',
    title: '单源最短路 (Dijkstra)',
    description: 'n 个点（1..n）m 条有向带权边（权值非负），求 1 到 n 的最短距离，不可达输出 -1。\n输入：第一行 n m；接下来 m 行 u v w。',
    difficulty: 'hard',
    category: '图',
    template: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int,int> PII; // (dist, node)
const int INF = 0x3f3f3f3f;
vector<PII> adj[100005];

int dijkstra(int n) {
    // 你的代码：dist 数组 + 优先队列松弛
    
    return -1;
}

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v, w; cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }
    cout << dijkstra(n) << endl;
    return 0;
}`,
    testCases: [
      { stdin: '4 5\n1 2 4\n1 3 2\n3 2 1\n2 4 3\n3 4 5', expected: '6' },
      { stdin: '3 1\n2 3 5', expected: '-1' },
      { stdin: '5 6\n1 2 10\n1 4 5\n2 4 2\n2 3 1\n4 3 9\n3 5 4', expected: '15' },
    ]
  },
  {
    id: 'topological-sort',
    title: '拓扑排序（字典序最小）',
    description: 'n 个点（1..n）m 条有向边，输出字典序最小的拓扑序列；若存在环输出 -1。\n提示：入度为 0 的点放入小顶堆（priority_queue），每次弹最小。',
    difficulty: 'hard',
    category: '图',
    template: `#include <iostream>
#include <vector>
#include <queue>
#include <functional>
using namespace std;

vector<int> adj[100005];
int indeg[100005];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        indeg[v]++;
    }
    // 你的代码：小顶堆拓扑排序，输出序列或 -1
    
    return 0;
}`,
    testCases: [
      { stdin: '4 3\n1 2\n1 3\n2 4', expected: '1 2 3 4' },
      { stdin: '3 3\n1 2\n2 3\n3 1', expected: '-1' },
      { stdin: '5 4\n2 1\n3 1\n4 2\n5 3', expected: '4 2 5 3 1' },
    ]
  },
  {
    id: 'union-find-components',
    title: '连通分量个数 (并查集)',
    description: 'n 个点（1..n）m 条无向边，求连通分量的个数。\n提示：并查集 Union/Find，最后统计根的个数。',
    difficulty: 'medium',
    category: '图',
    template: `#include <iostream>
using namespace std;

int parent[100005];

int find(int x) {
    // 你的代码：路径压缩
    
    return x;
}

void unite(int a, int b) {
    // 你的代码：合并
    
}

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) parent[i] = i;
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        unite(u, v);
    }
    // 你的代码：统计连通分量个数并输出
    
    return 0;
}`,
    testCases: [
      { stdin: '5 3\n1 2\n2 3\n4 5', expected: '2' },
      { stdin: '4 0', expected: '4' },
      { stdin: '6 5\n1 2\n3 4\n5 6\n4 5\n2 3', expected: '1' },
    ]
  },
];
