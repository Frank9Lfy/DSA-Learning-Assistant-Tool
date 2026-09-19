/* ========================================
   chapters.js - Course chapter structure
   Data Structures & Algorithms Course
   ======================================== */

const CHAPTERS = [
  {
    id: 'ch1',
    title: '第1章 绪论',
    icon: '📋',
    children: [
      { id: 'ch1-1', title: '1.1 什么是数据结构', icon: '📄' },
      { id: 'ch1-2', title: '1.2 基本概念和术语', icon: '📄' },
      { id: 'ch1-3', title: '1.3 抽象数据类型(ADT)', icon: '📄' },
      { id: 'ch1-4', title: '1.4 算法的定义与特性', icon: '📄' },
      { id: 'ch1-5', title: '1.5 算法效率的度量', icon: '📄' },
      { id: 'ch1-6', title: '1.6 时间复杂度分析', icon: '📄' },
      { id: 'ch1-7', title: '1.7 空间复杂度分析', icon: '📄' },
    ]
  },
  {
    id: 'ch2',
    title: '第2章 线性表',
    icon: '📋',
    children: [
      { id: 'ch2-1', title: '2.1 线性表的定义与ADT', icon: '📄' },
      { id: 'ch2-2', title: '2.2 顺序表(Sequential List)', icon: '📄' },
      { id: 'ch2-3', title: '2.3 单链表(Singly Linked List)', icon: '📄' },
      { id: 'ch2-4', title: '2.4 循环链表', icon: '📄' },
      { id: 'ch2-5', title: '2.5 双向链表', icon: '📄' },
      { id: 'ch2-6', title: '2.6 顺序表与链表比较', icon: '📄' },
      { id: 'ch2-7', title: '2.7 线性表的应用', icon: '📄' },
      { id: 'ch2-8', title: '2.8 多项式相加', icon: '📄' },
    ]
  },
  {
    id: 'ch3',
    title: '第3章 栈与队列',
    icon: '📋',
    children: [
      { id: 'ch3-1', title: '3.1 栈的定义与ADT', icon: '📄' },
      { id: 'ch3-2', title: '3.2 顺序栈', icon: '📄' },
      { id: 'ch3-3', title: '3.3 链式栈', icon: '📄' },
      { id: 'ch3-4', title: '3.4 栈的应用(表达式求值)', icon: '📄' },
      { id: 'ch3-5', title: '3.5 队列的定义与ADT', icon: '📄' },
      { id: 'ch3-6', title: '3.6 循环队列', icon: '📄' },
      { id: 'ch3-7', title: '3.7 链式队列', icon: '📄' },
      { id: 'ch3-8', title: '3.8 双端队列', icon: '📄' },
      { id: 'ch3-9', title: '3.9 优先级队列', icon: '📄' },
    ]
  },
  {
    id: 'ch4',
    title: '第4章 串与数组',
    icon: '📋',
    children: [
      { id: 'ch4-1', title: '4.1 串的定义与ADT', icon: '📄' },
      { id: 'ch4-2', title: '4.2 串的模式匹配(BF)', icon: '📄' },
      { id: 'ch4-3', title: '4.3 KMP算法', icon: '📄' },
      { id: 'ch4-4', title: '4.4 数组的定义与存储', icon: '📄' },
      { id: 'ch4-5', title: '4.5 特殊矩阵压缩存储', icon: '📄' },
      { id: 'ch4-6', title: '4.6 稀疏矩阵', icon: '📄' },
      { id: 'ch4-7', title: '4.7 广义表', icon: '📄' },
    ]
  },
  {
    id: 'ch5',
    title: '第5章 树与二叉树',
    icon: '📋',
    children: [
      { id: 'ch5-1', title: '5.1 树的定义与术语', icon: '📄' },
      { id: 'ch5-2', title: '5.2 二叉树的定义与性质', icon: '📄' },
      { id: 'ch5-3', title: '5.3 二叉树的存储结构', icon: '📄' },
      { id: 'ch5-4', title: '5.4 二叉树的遍历', icon: '📄' },
      { id: 'ch5-5', title: '5.5 线索二叉树', icon: '📄' },
      { id: 'ch5-6', title: '5.6 树与森林的转换', icon: '📄' },
      { id: 'ch5-7', title: '5.7 哈夫曼树与编码', icon: '📄' },
      { id: 'ch5-8', title: '5.8 堆与优先队列', icon: '📄' },
    ]
  },
  {
    id: 'ch6',
    title: '第6章 图',
    icon: '📋',
    children: [
      { id: 'ch6-1', title: '6.1 图的定义与术语', icon: '📄' },
      { id: 'ch6-2', title: '6.2 图的存储(邻接矩阵)', icon: '📄' },
      { id: 'ch6-3', title: '6.3 图的存储(邻接表)', icon: '📄' },
      { id: 'ch6-4', title: '6.4 深度优先搜索(DFS)', icon: '📄' },
      { id: 'ch6-5', title: '6.5 广度优先搜索(BFS)', icon: '📄' },
      { id: 'ch6-6', title: '6.6 最小生成树(Kruskal/Prim)', icon: '📄' },
      { id: 'ch6-7', title: '6.7 最短路径(Dijkstra/Floyd)', icon: '📄' },
      { id: 'ch6-8', title: '6.8 拓扑排序', icon: '📄' },
    ]
  },
  {
    id: 'ch7',
    title: '第7章 查找',
    icon: '📋',
    children: [
      { id: 'ch7-1', title: '7.1 查找的基本概念', icon: '📄' },
      { id: 'ch7-2', title: '7.2 顺序查找', icon: '📄' },
      { id: 'ch7-3', title: '7.3 折半查找(二分查找)', icon: '📄' },
      { id: 'ch7-4', title: '7.4 二叉排序树(BST)', icon: '📄' },
      { id: 'ch7-5', title: '7.5 平衡二叉树(AVL)', icon: '📄' },
      { id: 'ch7-6', title: '7.6 B树与B+树', icon: '📄' },
      { id: 'ch7-7', title: '7.7 散列表(Hash Table)', icon: '📄' },
      { id: 'ch7-8', title: '7.8 并查集', icon: '📄' },
    ]
  },
  {
    id: 'ch8',
    title: '第8章 排序',
    icon: '📋',
    children: [
      { id: 'ch8-1', title: '8.1 排序的基本概念', icon: '📄' },
      { id: 'ch8-2', title: '8.2 冒泡排序', icon: '📄' },
      { id: 'ch8-3', title: '8.3 选择排序', icon: '📄' },
      { id: 'ch8-4', title: '8.4 插入排序', icon: '📄' },
      { id: 'ch8-5', title: '8.5 希尔排序', icon: '📄' },
      { id: 'ch8-6', title: '8.6 快速排序', icon: '📄' },
      { id: 'ch8-7', title: '8.7 归并排序', icon: '📄' },
      { id: 'ch8-8', title: '8.8 堆排序', icon: '📄' },
      { id: 'ch8-9', title: '8.9 基数排序', icon: '📄' },
      { id: 'ch8-10', title: '8.10 排序算法比较', icon: '📄' },
    ]
  },
  {
    id: 'ch9',
    title: '第9章 分治策略',
    icon: '📋',
    children: [
      { id: 'ch9-1', title: '9.1 分治法的基本思想', icon: '📄' },
      { id: 'ch9-2', title: '9.2 递归与分治', icon: '📄' },
      { id: 'ch9-3', title: '9.3 二分搜索(分治实现)', icon: '📄' },
      { id: 'ch9-4', title: '9.4 合并排序(分治实现)', icon: '📄' },
      { id: 'ch9-5', title: '9.5 快速排序(分治实现)', icon: '📄' },
      { id: 'ch9-6', title: '9.6 大整数乘法', icon: '📄' },
      { id: 'ch9-7', title: '9.7 Strassen矩阵乘法', icon: '📄' },
      { id: 'ch9-8', title: '9.8 最近点对问题', icon: '📄' },
    ]
  },
  {
    id: 'ch10',
    title: '第10章 动态规划',
    icon: '📋',
    children: [
      { id: 'ch10-1', title: '10.1 动态规划基本思想', icon: '📄' },
      { id: 'ch10-2', title: '10.2 最优子结构与重叠子问题', icon: '📄' },
      { id: 'ch10-3', title: '10.3 矩阵链乘法', icon: '📄' },
      { id: 'ch10-4', title: '10.4 最长公共子序列(LCS)', icon: '📄' },
      { id: 'ch10-5', title: '10.5 最长递增子序列(LIS)', icon: '📄' },
      { id: 'ch10-6', title: '10.6 0-1背包问题', icon: '📄' },
      { id: 'ch10-7', title: '10.7 编辑距离', icon: '📄' },
    ]
  },
];
