# 📊 DSA Review — 数据结构与算法交互复习平台

一个**纯前端、零依赖构建**的数据结构与算法复习网站，基于王贝贝老师《数据结构与算法》课程（2025 秋季）内容整理，覆盖 10 章知识体系、19 门交互课程、19 种算法动画、21 道在线评测编程题和 219 道测验题。

> 无需安装任何依赖，双击 `index.html` 即可使用。

---

## ✨ 功能总览

| 模块 | 内容 |
|------|------|
| 📖 知识检索 | 10 章 80 个知识点，逐节详述 + 复杂度徽章 + C++ 代码；倒排索引全文搜索；每章末一键跳转章节测验 |
| 🎓 交互教学 | 19 门分步课程（127 步）：步内小测（答对解锁）、数组状态条、代码逐行走读、键盘翻页、进度记忆 |
| 📈 算法可视化 | **36 种算法/操作** Canvas 动画，与交互教学课程一一呼应：排序×6、链表×3、顺序表插删、循环队列、中缀→后缀、汉诺塔、BST 插删、前/中/后序遍历（非递归栈过程）、筛选建堆、堆插入、哈夫曼、AVL 旋转、图×3、拓扑排序、二分/线性查找、散列线性探测、KMP、快速转置、正交链表、LCS/背包填表、B 树插入分裂 |
| 💻 代码评判 | 21 道数据结构编程题（C++17），双引擎在线编译（Piston → Godbolt 自动回退），**并行评测**（总耗时≈最慢用例），区分程序真实执行时间与网络耗时；**模板库**集中管理 55+ 个代码模板（起步骨架 / 完整类模板 / 知识库全部数据结构代码），分类筛选 + 搜索 + 一键使用 |
| 📝 练习测验 | 219 道选择题（78 道代码追踪题），按章节/难度筛选，动态计时，结果页错题/全题回顾 |
| 📕 错题本 | 自动收藏测验错题；逐题重做（答对自动移出）、筛选重练、JSON 导入导出 |
| 🤖 AI 助教 | 规则引擎问答（37 条课程知识规则），关键词匹配 + 相关话题推荐，可替换为 LLM API |
| 🔗 拓展资源 | 18 个精选学习资源，分类筛选与收藏 |
| ⚙️ 设置与存档 | 自动存档（数据变化即快照 + 定时兜底 + 关页前保存）、最多 10 份手动命名存档（保存/恢复/覆盖/重命名/导出/导入 JSON）、打开时自动恢复上次状态（浏览位置、代码草稿、对话记录等，各项可独立开关）、一键清空 |

---

## 🚀 快速开始

```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务器（推荐）
cd dsa-review
python -m http.server 8000    # 或 npx http-server -p 8000
# 浏览器访问 http://localhost:8000
```

详细使用说明见 [QUICKSTART.md](QUICKSTART.md)。

**代码评判需要联网**（在线编译 API），其余模块全部离线可用。

---

## 📁 项目结构

```
dsa-review/
├── index.html                    # 单页应用入口（SPA，hash 路由）
├── css/
│   ├── main.css                  # 主题变量 + 全局样式（亮/暗主题）
│   ├── layout.css                # 布局（侧边栏 + 主区域）
│   ├── components.css            # 通用组件 + 教学/可视化新增样式
│   ├── judge.css                 # 代码评判样式
│   └── mistakes.css              # 错题本样式
├── js/
│   ├── app.js                    # 应用入口 + 全局搜索/快捷键
│   ├── store.js                  # 发布-订阅状态管理
│   ├── core/
│   │   ├── router.js             # hash 路由（支持 #/quiz/chX 带参跳转）
│   │   ├── eventBus.js           # 事件总线
│   │   └── storage.js            # localStorage 封装
│   ├── utils/
│   │   ├── dom.js                # DOM 工具（$、create、toast、codeBlock…）
│   │   └── constants.js          # 路由/存储键/常量
│   └── modules/
│       ├── knowledge/            # 知识检索（searchEngine 倒排索引）
│       ├── teaching/             # 交互教学（lessonPlayer + 19 门课程数据 + 代码走读）
│       ├── visualization/        # 算法可视化（renderer/animator + 36 种算法）
│       │   └── algorithms/courseViz.js  # 教学配套算法合集（顺序表/队列/表达式/
│       │                                  #   汉诺塔/遍历/堆/哈夫曼/AVL/散列/
│       │                                  #   拓扑/DP填表/B树/正交链表 + 渲染器）
│       ├── codeJudge/            # 代码评判（CodeMirror + 双引擎执行器 + 并行评测）
│       ├── quiz/                 # 练习测验（出题/评分/视图）
│       ├── mistakes/             # 错题本（数据层 + 视图）
│       ├── aiChat/               # AI 助教（规则引擎 + 聊天视图）
│       └── resources/            # 拓展资源
├── data/
│   ├── chapters.js               # 10 章章节树（80 个小节）
│   ├── knowledge.js              # 80 条知识点详情（与章节树一一对应）
│   ├── questions.js              # 219 道测验题
│   ├── codeExamples.js           # 代码示例 + 21 道评测题
│   └── resources.js              # 18 个拓展资源
└── tools/                        # 开发者工具（需 Node.js）
    ├── validate-knowledge.js     # 校验章节树与知识点一一对应
    ├── validate-questions.js     # 校验题库结构/答案索引/难度分布
    └── verify-judge-tests.js     # 用参考解 + Godbolt 真实编译验证题库用例
```

---

## ⚙️ 代码执行引擎（双通道自动回退）

代码评判的在线编译按以下顺序尝试，对用户透明：

1. **Piston API**（emkc.org）——注意：emkc 公共 API 自 2026-02-15 起改为白名单制，未获授权时返回 401
2. **Godbolt（Compiler Explorer）公共执行 API**——GCC 12.2 / C++17，免费无需注册

两个通道都不可达时给出明确的网络错误提示。评测方式为 stdin/期望输出比对（自动归一化行尾与首尾空白）。

---

## 💾 数据保存与重置

所有用户数据保存在浏览器 `localStorage`（`js/core/storage.js` 封装，JSON 序列化），**仅存在于当前浏览器，不上传服务器**：

| 键 | 内容 |
|----|------|
| `dsa-theme` | 亮/暗主题偏好 |
| `dsa-sidebar` | 侧边栏折叠状态 |
| `dsa-lesson-progress-v1` | 交互教学：每门课学到第几步、完成状态、未掌握步骤 |
| `dsa-quiz-history` | 测验历史（最近 50 次） |
| `dsa-mistake-book` | 错题本记录 |
| `dsa-mistake-custom-questions` | 手动导入的自定义题目 |
| `dsa-bookmarks` | 收藏的拓展资源 |
| `dsa-last-route` | 上次浏览位置（板块 + 参数） |
| `dsa-judge-state` | 代码评判草稿（编辑器代码 + 当前题目） |
| `dsa-chat-history` | AI 助教对话记录（最多 100 条） |
| `dsa-knowledge-pos` | 知识检索上次阅读的知识点 |
| `dsa-archive-auto` | 自动存档快照（上述数据的定期合集） |
| `dsa-archive-slots` | 手动存档槽位列表（默认最多 10 份） |
| `dsa-settings` | 设置板块偏好（自动存档/恢复项开关） |

**自动存档与恢复**（`js/core/archive.js`）：任一学习数据变化后 1.5s 防抖生成快照，另有 60s 定时兜底与页面关闭前强制保存；打开页面时按设置恢复浏览位置、代码草稿、对话记录等。若检测到「存在自动存档但当前数据为空」（如被误清），会主动询问是否恢复。「设置与存档」板块支持手动保存最多 10 份命名存档，可随时恢复（恢复前会自动快照当前状态）、重命名、下载 / 导入 JSON。

**重置方法**（任选其一）：
- 「⚙️ 设置与存档」→ 危险区 → 清空全部数据（建议先保存/下载一份存档）
- 模块内重置：错题本「🗑 清空」、AI 助教清空聊天
- 控制台（F12）执行 `localStorage.clear()` 后刷新 —— 清除全部数据
- 只清进度：删除对应键，如 `localStorage.removeItem('dsa-lesson-progress-v1')`

---

## 🔧 自定义与扩展

所有内容都在 `data/` 目录，改完刷新即生效：

```js
// data/knowledge.js —— 添加知识点（id 须与 chapters.js 的章节小节对应）
'chX-Y': {
  title: '标题',
  content: '<h3>HTML 内容</h3>',
  code: 'C++ 代码',
  complexity: { time: 'O(n)', space: 'O(1)' },
  related: ['chX-Z']
}

// data/questions.js —— 添加测验题
{ id: 'chX-NN', chapter: 'chX', difficulty: 'easy|medium|hard',
  type: 'choice|code-output', question: '题干\n可含换行',
  options: ['A', 'B', 'C', 'D'], answer: 0, explanation: '解析' }

// data/codeExamples.js —— 添加评测题
{ id: 'xxx', title: '题名', description: '题面', difficulty: '...', category: '...',
  template: 'C++ 模板代码', testCases: [{ stdin: '...', expected: '...' }] }
```

**修改后请运行校验工具**：

```bash
node tools/validate-knowledge.js     # 章节树 ⇆ 知识点 一一对应
node tools/validate-questions.js     # 题库结构/答案索引/难度分布
node tools/verify-judge-tests.js     # 需联网：参考解真实编译验证全部测试用例
```

---

## 🎓 课程对应

基于《数据结构与算法（王贝贝，2025 秋季）》课件整理：

| 课件 | 网站章节 |
|------|----------|
| 第1章 绪论 / 第2章 线性表 / 第3章 栈和队列 / 第4章 数组、串与广义表 / 第5章 树与二叉树 | 网站第 1~5 章（同名） |
| 第6章 集合与字典（并查集、散列） | 网站第 7 章查找（7.7 散列、7.8 并查集） |
| 第7章 搜索结构（BST、AVL） | 网站第 7 章查找（7.1~7.5） |
| 第8章 图 / 第9章 排序 | 网站第 6 章图 / 第 8 章排序 |
| 第10章 多级索引结构（B/B+ 树） | 网站第 7 章（7.6） |
| 算法部分：分治策略 / 动态规划 | 网站第 9 章 / 第 10 章 |

> 章节编号沿用项目既有的教材式编排，与课件章节号不完全一致，但内容一一对应。

---

## 🧪 浏览器兼容

✅ Chrome 90+ / Edge 90+ / Firefox 88+ / Safari 14+
❌ 不支持 IE（依赖 ES6+）

---

## 🤝 参与贡献

1. Fork / 克隆仓库
2. 修改数据文件或模块（无需构建，保持原生 JS 全局命名空间风格）
3. 运行 `tools/` 下三个校验脚本确保数据一致性
4. 提交 PR，附上改动说明与自测结果

## 📄 许可证

[MIT](LICENSE)（学习资料内容基于课程课件整理，仅供学习交流使用）

---

**如果这个项目对你的复习有帮助，欢迎点亮 Star ⭐**
