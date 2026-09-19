/* ========================================
   verify-judge-tests.js - 题库验证工具
   为每道评测题提供参考解，通过 Godbolt 公共 API 真实编译执行，
   与 JUDGE_PROBLEMS 中的期望输出逐一比对。
   用法：node tools/verify-judge-tests.js [题目id ...]（不传参则验证全部）
   需要：网络可达 https://godbolt.org
   ======================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ─── 加载题库 ────────────────────────────────────────────────────
const ctx = vm.createContext({ console });
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'data', 'codeExamples.js'), 'utf8'), ctx);
const JUDGE_PROBLEMS = vm.runInContext('JUDGE_PROBLEMS', ctx);

// ─── 参考解（与题目 IO 约定一致）─────────────────────────────────
const REFERENCE = {
  'seqlist-reverse': `#include <iostream>\nusing namespace std;\nvoid reverse(int arr[], int n) {\n    for (int i = 0, j = n - 1; i < j; i++, j--) { int t = arr[i]; arr[i] = arr[j]; arr[j] = t; }\n}\nint main() {\n    int n; cin >> n; int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    reverse(arr, n);\n    for (int i = 0; i < n; i++) { if (i > 0) cout << " "; cout << arr[i]; }\n    cout << endl; return 0;\n}`,
  'bubble-sort': `#include <iostream>\nusing namespace std;\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - 1 - i; j++)\n            if (arr[j] > arr[j + 1]) { int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t; }\n}\nint main() {\n    int n; cin >> n; int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    bubbleSort(arr, n);\n    for (int i = 0; i < n; i++) { if (i > 0) cout << " "; cout << arr[i]; }\n    cout << endl; return 0;\n}`,
  'binary-search': `#include <iostream>\nusing namespace std;\nint binarySearch(int arr[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\nint main() {\n    int n; cin >> n; int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    cout << binarySearch(arr, n, target) << endl; return 0;\n}`,
  'fibonacci-dp': `#include <iostream>\nusing namespace std;\nlong long fib(int n) {\n    if (n <= 1) return n;\n    long long a = 0, b = 1;\n    for (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }\n    return b;\n}\nint main() { int n; cin >> n; cout << fib(n) << endl; return 0; }`,
  'knapsack-01': `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, W; cin >> n >> W;\n    vector<int> w(n), v(n);\n    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];\n    vector<int> dp(W + 1, 0);\n    for (int i = 0; i < n; i++)\n        for (int j = W; j >= w[i]; j--)\n            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);\n    cout << dp[W] << endl; return 0;\n}`,
  'lcs': `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string X, Y; cin >> X >> Y;\n    int m = X.size(), n = Y.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++)\n            dp[i][j] = (X[i-1] == Y[j-1]) ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1]);\n    cout << dp[m][n] << endl; return 0;\n}`,
  'linked-list-reverse': `#include <iostream>\nusing namespace std;\nstruct Node {\n    int data; Node* next;\n    Node(int d) : data(d), next(NULL) {}\n};\nNode* reverseList(Node* head) {\n    Node* prev = NULL; Node* cur = head;\n    while (cur) { Node* nx = cur->next; cur->next = prev; prev = cur; cur = nx; }\n    return prev;\n}\nint main() {\n    int n; cin >> n;\n    Node dummy(0); Node* tail = &dummy;\n    for (int i = 0; i < n; i++) { int val; cin >> val; tail->next = new Node(val); tail = tail->next; }\n    Node* cur = reverseList(dummy.next);\n    while (cur) { cout << cur->data; if (cur->next) cout << " "; cur = cur->next; }\n    cout << endl; return 0;\n}`,
  'quick-sort': `#include <iostream>\nusing namespace std;\nvoid quickSort(int arr[], int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[lo], i = lo, j = hi;\n    while (i < j) {\n        while (i < j && arr[j] >= pivot) j--;\n        arr[i] = arr[j];\n        while (i < j && arr[i] <= pivot) i++;\n        arr[j] = arr[i];\n    }\n    arr[i] = pivot;\n    quickSort(arr, lo, i - 1); quickSort(arr, i + 1, hi);\n}\nint main() {\n    int n; cin >> n; int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    quickSort(arr, 0, n - 1);\n    for (int i = 0; i < n; i++) { if (i > 0) cout << " "; cout << arr[i]; }\n    cout << endl; return 0;\n}`,
  'stack-parentheses': `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nbool isValid(const string& s) {\n    stack<char> st;\n    for (char ch : s) {\n        if (ch == '(' || ch == '[' || ch == '{') st.push(ch);\n        else {\n            if (st.empty()) return false;\n            char t = st.top(); st.pop();\n            if ((ch == ')' && t != '(') || (ch == ']' && t != '[') || (ch == '}' && t != '{')) return false;\n        }\n    }\n    return st.empty();\n}\nint main() {\n    string s; cin >> s;\n    cout << (isValid(s) ? "Yes" : "No") << endl; return 0;\n}`,
  'postfix-eval': `#include <iostream>\n#include <stack>\n#include <string>\n#include <sstream>\nusing namespace std;\nint evalPostfix(const string& line) {\n    stack<int> st;\n    istringstream iss(line);\n    string tok;\n    while (iss >> tok) {\n        if (tok == "+" || tok == "-" || tok == "*" || tok == "/") {\n            int b = st.top(); st.pop();\n            int a = st.top(); st.pop();\n            if (tok == "+") st.push(a + b);\n            else if (tok == "-") st.push(a - b);\n            else if (tok == "*") st.push(a * b);\n            else st.push(a / b);\n        } else st.push(stoi(tok));\n    }\n    return st.top();\n}\nint main() {\n    string line; getline(cin, line);\n    cout << evalPostfix(line) << endl; return 0;\n}`,
  'circular-queue': `#include <iostream>\n#include <string>\nusing namespace std;\nint que[100005];\nint front_ = 0, rear = 0;\nint main() {\n    int k, m; cin >> k >> m;\n    while (m--) {\n        string op; cin >> op;\n        if (op == "E") {\n            int x; cin >> x;\n            if ((rear + 1) % k == front_) cout << "FULL" << endl;\n            else { que[rear] = x; rear = (rear + 1) % k; }\n        } else {\n            if (front_ == rear) cout << "EMPTY" << endl;\n            else { cout << que[front_] << endl; front_ = (front_ + 1) % k; }\n        }\n    }\n    return 0;\n}`,
  'string-match-count': `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint kmpCount(const string& T, const string& P) {\n    int n = T.size(), m = P.size();\n    if (m == 0 || m > n) return 0;\n    vector<int> nx(m); nx[0] = -1;\n    for (int i = 1, k = -1; i < m; i++) {\n        while (k >= 0 && P[k+1] != P[i]) k = nx[k];\n        if (P[k+1] == P[i]) k++;\n        nx[i] = k;\n    }\n    int cnt = 0;\n    for (int i = 0, k = -1; i < n; i++) {\n        while (k >= 0 && P[k+1] != T[i]) k = nx[k];\n        if (P[k+1] == T[i]) k++;\n        if (k == m - 1) { cnt++; k = nx[k]; }\n    }\n    return cnt;\n}\nint main() {\n    string T, P; cin >> T >> P;\n    cout << kmpCount(T, P) << endl; return 0;\n}`,
  'sparse-transpose': `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int mu, nu, tu; cin >> mu >> nu >> tu;\n    vector<int> r(tu), c(tu), v(tu);\n    for (int i = 0; i < tu; i++) cin >> r[i] >> c[i] >> v[i];\n    vector<int> num(nu + 1, 0), cpot(nu + 1, 0);\n    for (int i = 0; i < tu; i++) num[c[i]]++;\n    cpot[1] = 0;\n    for (int col = 2; col <= nu; col++) cpot[col] = cpot[col-1] + num[col-1];\n    vector<int> br(tu), bc(tu), bv(tu);\n    for (int i = 0; i < tu; i++) {\n        int pos = cpot[c[i]]++;\n        br[pos] = c[i]; bc[pos] = r[i]; bv[pos] = v[i];\n    }\n    for (int i = 0; i < tu; i++) cout << br[i] << " " << bc[i] << " " << bv[i] << endl;\n    return 0;\n}`,
  'rebuild-binary-tree': `#include <iostream>\n#include <string>\nusing namespace std;\nvoid postorder(const string& pre, const string& in, int pl, int pr, int il, int ir) {\n    if (pl > pr) return;\n    char root = pre[pl];\n    int k = il;\n    while (in[k] != root) k++;\n    int leftLen = k - il;\n    postorder(pre, in, pl + 1, pl + leftLen, il, k - 1);\n    postorder(pre, in, pl + leftLen + 1, pr, k + 1, ir);\n    cout << root;\n}\nint main() {\n    string pre, in; cin >> pre >> in;\n    postorder(pre, in, 0, pre.size() - 1, 0, in.size() - 1);\n    cout << endl; return 0;\n}`,
  'bst-inorder': `#include <iostream>\nusing namespace std;\nstruct Node {\n    int key; Node *left, *right;\n    Node(int k) : key(k), left(NULL), right(NULL) {}\n};\nNode* insert(Node* root, int key) {\n    if (!root) return new Node(key);\n    if (key < root->key) root->left = insert(root->left, key);\n    else if (key > root->key) root->right = insert(root->right, key);\n    return root;\n}\nvoid inorder(Node* root, bool& first) {\n    if (!root) return;\n    inorder(root->left, first);\n    if (!first) cout << " ";\n    cout << root->key; first = false;\n    inorder(root->right, first);\n}\nint main() {\n    int n; cin >> n; Node* root = NULL;\n    for (int i = 0; i < n; i++) { int x; cin >> x; root = insert(root, x); }\n    bool first = true;\n    inorder(root, first);\n    cout << endl; return 0;\n}`,
  'heap-k-smallest': `#include <iostream>\nusing namespace std;\nint heapArr[100005], heapSize = 0;\nvoid siftDown(int i) {\n    while (2 * i + 1 < heapSize) {\n        int child = 2 * i + 1;\n        if (child + 1 < heapSize && heapArr[child + 1] < heapArr[child]) child++;\n        if (heapArr[i] <= heapArr[child]) break;\n        int t = heapArr[i]; heapArr[i] = heapArr[child]; heapArr[child] = t;\n        i = child;\n    }\n}\nvoid siftUp(int i) {\n    while (i > 0 && heapArr[(i - 1) / 2] > heapArr[i]) {\n        int t = heapArr[i]; heapArr[i] = heapArr[(i - 1) / 2]; heapArr[(i - 1) / 2] = t;\n        i = (i - 1) / 2;\n    }\n}\nint popMin() {\n    int top = heapArr[0];\n    heapArr[0] = heapArr[--heapSize];\n    siftDown(0);\n    return top;\n}\nint main() {\n    int n, k; cin >> n >> k;\n    for (int i = 0; i < n; i++) { cin >> heapArr[heapSize++]; siftUp(heapSize - 1); }\n    for (int i = 0; i < k; i++) { if (i > 0) cout << " "; cout << popMin(); }\n    cout << endl; return 0;\n}`,
  'huffman-wpl': `#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < n; i++) { int w; cin >> w; pq.push(w); }\n    long long wpl = 0;\n    while (pq.size() > 1) {\n        int a = pq.top(); pq.pop();\n        int b = pq.top(); pq.pop();\n        wpl += a + b;\n        pq.push(a + b);\n    }\n    cout << wpl << endl; return 0;\n}`,
  'bfs-shortest': `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nvector<int> adj[100005];\nint bfs(int s, int t, int n) {\n    vector<int> dist(n + 1, -1);\n    queue<int> q;\n    dist[s] = 0; q.push(s);\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        if (u == t) return dist[u];\n        for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }\n    }\n    return dist[t];\n}\nint main() {\n    int n, m; cin >> n >> m;\n    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; adj[u].push_back(v); adj[v].push_back(u); }\n    int s, t; cin >> s >> t;\n    cout << bfs(s, t, n) << endl; return 0;\n}`,
  'dijkstra-shortest': `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\ntypedef pair<int,int> PII;\nconst int INF = 0x3f3f3f3f;\nvector<PII> adj[100005];\nint dijkstra(int n) {\n    vector<int> dist(n + 1, INF);\n    priority_queue<PII, vector<PII>, greater<PII>> pq;\n    dist[1] = 0; pq.push({0, 1});\n    while (!pq.empty()) {\n        PII top = pq.top(); pq.pop();\n        int d = top.first, u = top.second;\n        if (d > dist[u]) continue;\n        for (PII e : adj[u])\n            if (d + e.second < dist[e.first]) { dist[e.first] = d + e.second; pq.push({dist[e.first], e.first}); }\n    }\n    return dist[n] >= INF ? -1 : dist[n];\n}\nint main() {\n    int n, m; cin >> n >> m;\n    for (int i = 0; i < m; i++) { int u, v, w; cin >> u >> v >> w; adj[u].push_back({v, w}); }\n    cout << dijkstra(n) << endl; return 0;\n}`,
  'topological-sort': `#include <iostream>\n#include <vector>\n#include <queue>\n#include <functional>\nusing namespace std;\nvector<int> adj[100005];\nint indeg[100005];\nint main() {\n    int n, m; cin >> n >> m;\n    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; adj[u].push_back(v); indeg[v]++; }\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= n; i++) if (indeg[i] == 0) pq.push(i);\n    vector<int> order;\n    while (!pq.empty()) {\n        int u = pq.top(); pq.pop();\n        order.push_back(u);\n        for (int v : adj[u]) if (--indeg[v] == 0) pq.push(v);\n    }\n    if ((int)order.size() < n) cout << -1 << endl;\n    else {\n        for (int i = 0; i < n; i++) { if (i > 0) cout << " "; cout << order[i]; }\n        cout << endl;\n    }\n    return 0;\n}`,
  'union-find-components': `#include <iostream>\nusing namespace std;\nint parent[100005];\nint find(int x) {\n    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }\n    return x;\n}\nvoid unite(int a, int b) { parent[find(a)] = find(b); }\nint main() {\n    int n, m; cin >> n >> m;\n    for (int i = 1; i <= n; i++) parent[i] = i;\n    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; unite(u, v); }\n    int cnt = 0;\n    for (int i = 1; i <= n; i++) if (find(i) == i) cnt++;\n    cout << cnt << endl; return 0;\n}`,
};

// ─── Godbolt 执行 ────────────────────────────────────────────────
const normalize = (str) => String(str)
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n')
  .replace(/[ \t]+$/gm, '')
  .replace(/\n+$/, '\n')
  .replace(/^\n+/, '')
  .trim();

async function runOnGodbolt(source, stdin) {
  const resp = await fetch('https://godbolt.org/api/compiler/g122/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source,
      compiler: 'g122',
      lang: 'c++',
      options: {
        userArguments: '-O2 -std=c++17',
        executeParameters: { args: [], stdin },
        compilerOptions: { executorRequest: true, skipAsm: true },
        filters: { execute: true },
      },
      allowStoreCodeDebug: false,
    }),
  });
  if (!resp.ok) throw new Error('Godbolt HTTP ' + resp.status);
  const data = await resp.json();
  const join = (arr) => (arr || []).map(l => l.text || '').join('\n');
  const compileError = data.buildResult && data.buildResult.code !== 0 ? join(data.buildResult.stderr) : '';
  return { stdout: join(data.stdout), compileError, exitCode: data.code };
}

async function main() {
  const onlyIds = process.argv.slice(2);
  const problems = JUDGE_PROBLEMS.filter(p => onlyIds.length === 0 || onlyIds.includes(p.id));
  let passCount = 0, failCount = 0, skipCount = 0;
  const failures = [];

  for (const p of problems) {
    const ref = REFERENCE[p.id];
    if (!ref) { console.log(`⊘ 跳过 ${p.id}（无参考解）`); skipCount += p.testCases.length; continue; }
    for (let i = 0; i < p.testCases.length; i++) {
      const tc = p.testCases[i];
      try {
        const r = await runOnGodbolt(ref, tc.stdin);
        if (r.compileError) {
          failCount++;
          failures.push(`✗ ${p.id} #${i + 1} 参考解编译失败: ${r.compileError.slice(0, 120)}`);
        } else if (normalize(r.stdout) === normalize(tc.expected)) {
          passCount++;
        } else {
          failCount++;
          failures.push(`✗ ${p.id} #${i + 1} 期望[${JSON.stringify(tc.expected)}] 实际[${JSON.stringify(normalize(r.stdout))}]`);
        }
      } catch (e) {
        failCount++;
        failures.push(`✗ ${p.id} #${i + 1} 执行失败: ${e.message}`);
      }
    }
    process.stdout.write(`· ${p.id} 完成\n`);
  }

  console.log(`\n════ 验证结果：${passCount} 通过 / ${failCount} 失败 / ${skipCount} 跳过 ════`);
  failures.forEach(f => console.log(f));
  process.exit(failCount > 0 ? 1 : 0);
}

main();
