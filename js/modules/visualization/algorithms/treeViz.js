/**
 * TreeViz - Binary Search Tree Visualization Step Generator
 * Generates animation steps for BST operations with layout calculation
 */
(function () {
    'use strict';

    const COLORS = {
        default: '#4a90d9',
        active: '#f5a623',
        found: '#2ecc71',
        delete: '#e74c3c',
        visited: '#9b59b6'
    };

    // Internal BST node class
    class TreeNode {
        constructor(val) {
            this.val = val;
            this.left = null;
            this.right = null;
        }
    }

    // Build BST from array of insertions
    function buildBST(values) {
        let root = null;
        for (const v of values) {
            root = insertNode(root, v);
        }
        return root;
    }

    function insertNode(node, val) {
        if (!node) return new TreeNode(val);
        if (val < node.val) node.left = insertNode(node.left, val);
        else if (val > node.val) node.right = insertNode(node.right, val);
        return node;
    }

    function findMin(node) {
        while (node.left) node = node.left;
        return node;
    }

    function deleteNode(root, val) {
        if (!root) return null;
        if (val < root.val) {
            root.left = deleteNode(root.left, val);
        } else if (val > root.val) {
            root.right = deleteNode(root.right, val);
        } else {
            if (!root.left) return root.right;
            if (!root.right) return root.left;
            const successor = findMin(root.right);
            root.val = successor.val;
            root.right = deleteNode(root.right, successor.val);
        }
        return root;
    }

    // Calculate tree layout positions
    function calculateLayout(root) {
        if (!root) return { nodes: [], edges: [] };

        const nodes = [];
        const edges = [];
        const depthMap = {};

        // First pass: get depth and horizontal positions
        function getDepth(node) {
            if (!node) return 0;
            return 1 + Math.max(getDepth(node.left), getDepth(node.right));
        }

        const maxDepth = getDepth(root);

        // Assign positions using in-order traversal for x, depth for y
        let xCounter = 0;
        function assignPositions(node, depth) {
            if (!node) return;
            assignPositions(node.left, depth + 1);
            node._x = xCounter++;
            node._depth = depth;
            assignPositions(node.right, depth + 1);
        }
        assignPositions(root, 0);

        // Collect nodes and edges
        function collect(node) {
            if (!node) return;
            nodes.push({
                val: node.val,
                x: node._x,
                depth: node._depth
            });
            if (node.left) {
                edges.push({ from: node.val, to: node.left.val });
                collect(node.left);
            }
            if (node.right) {
                edges.push({ from: node.val, to: node.right.val });
                collect(node.right);
            }
        }
        collect(root);

        return { nodes, edges, maxDepth, totalNodes: xCounter };
    }

    // Clone tree for step snapshots
    function cloneTree(node) {
        if (!node) return null;
        const n = new TreeNode(node.val);
        n.left = cloneTree(node.left);
        n.right = cloneTree(node.right);
        return n;
    }

    function treeToArray(root) {
        const arr = [];
        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            arr.push(node.val);
            traverse(node.right);
        }
        traverse(root);
        return arr;
    }

    const TreeViz = {

        /**
         * Generate BST insert animation steps
         * @param {Array} data - Sequence of values to build BST from
         * @returns {Array} steps array
         */
        bstInsert(data) {
            const steps = [];
            let root = null;

            steps.push({
                type: 'tree',
                tree: null,
                highlights: {},
                description: `开始构建二叉搜索树，依次插入 ${data.length} 个元素`
            });

            for (let i = 0; i < data.length; i++) {
                const val = data[i];
                const path = [];

                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: {},
                    description: `插入第 ${i + 1} 个元素: ${val}`
                });

                // Traverse to find insertion point
                let current = root;
                let parent = null;
                let direction = null;

                while (current) {
                    path.push(current.val);
                    const highlightMap = {};
                    for (const p of path) highlightMap[p] = COLORS.active;

                    steps.push({
                        type: 'tree',
                        tree: cloneTree(root),
                        highlights: highlightMap,
                        description: `比较 ${val} 和 ${current.val}: ${val < current.val ? '去左子树' : '去右子树'}`
                    });

                    parent = current;
                    if (val < current.val) {
                        direction = 'left';
                        current = current.left;
                    } else if (val > current.val) {
                        direction = 'right';
                        current = current.right;
                    } else {
                        // Duplicate
                        steps.push({
                            type: 'tree',
                            tree: cloneTree(root),
                            highlights: { [current.val]: COLORS.delete },
                            description: `${val} 已存在于树中，跳过重复值`
                        });
                        break;
                    }
                }

                // Insert the node
                if (!root) {
                    root = new TreeNode(val);
                } else if (current === null && parent && direction) {
                    parent[direction] = new TreeNode(val);
                } else if (current === null) {
                    // Duplicate was found, skip
                    continue;
                }

                const highlightMap = {};
                highlightMap[val] = COLORS.found;
                for (const p of path) {
                    if (p !== val) highlightMap[p] = '#3498db';
                }

                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: highlightMap,
                    description: `${val} 插入成功${parent ? `，作为 ${parent.val} 的${direction === 'left' ? '左' : '右'}子节点` : '，作为根节点'}`
                });
            }

            steps.push({
                type: 'tree',
                tree: cloneTree(root),
                highlights: {},
                description: `二叉搜索树构建完成！中序遍历: [${treeToArray(root).join(', ')}]`
            });

            return steps;
        },

        /**
         * Generate BST delete animation steps
         * @param {Array} data - Current BST values (insertion order)
         * @param {number} val - Value to delete
         * @returns {Array} steps array
         */
        bstDelete(data, val) {
            const steps = [];
            let root = buildBST(data);

            steps.push({
                type: 'tree',
                tree: cloneTree(root),
                highlights: {},
                description: `准备从 BST 中删除值 ${val}`
            });

            // Search for the node
            let current = root;
            const path = [];

            while (current) {
                path.push(current.val);
                const highlightMap = {};
                for (const p of path) highlightMap[p] = COLORS.active;

                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: highlightMap,
                    description: `搜索 ${val}: 比较当前节点 ${current.val}`
                });

                if (val === current.val) {
                    highlightMap[current.val] = COLORS.delete;
                    steps.push({
                        type: 'tree',
                        tree: cloneTree(root),
                        highlights: highlightMap,
                        description: `找到节点 ${val}，准备删除`
                    });

                    // Determine case
                    if (!current.left && !current.right) {
                        steps.push({
                            type: 'tree',
                            tree: cloneTree(root),
                            highlights: { [val]: COLORS.delete },
                            description: `节点 ${val} 是叶节点，直接删除`
                        });
                    } else if (!current.left || !current.right) {
                        const child = current.left || current.right;
                        steps.push({
                            type: 'tree',
                            tree: cloneTree(root),
                            highlights: { [val]: COLORS.delete, [child.val]: COLORS.found },
                            description: `节点 ${val} 有一个子节点 ${child.val}，用子节点替代`
                        });
                    } else {
                        const successor = findMin(current.right);
                        steps.push({
                            type: 'tree',
                            tree: cloneTree(root),
                            highlights: { [val]: COLORS.delete, [successor.val]: COLORS.active },
                            description: `节点 ${val} 有两个子节点，找中序后继: ${successor.val}`
                        });
                    }

                    // Perform deletion
                    root = deleteNode(root, val);
                    steps.push({
                        type: 'tree',
                        tree: cloneTree(root),
                        highlights: {},
                        description: `节点 ${val} 已删除，树已更新`
                    });
                    break;
                } else if (val < current.val) {
                    current = current.left;
                } else {
                    current = current.right;
                }
            }

            if (!current) {
                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: {},
                    description: `值 ${val} 不在树中，无法删除`
                });
            }

            steps.push({
                type: 'tree',
                tree: cloneTree(root),
                highlights: {},
                description: `删除操作完成！中序遍历: [${treeToArray(root).join(', ')}]`
            });

            return steps;
        },

        /**
         * Generate BST traversal animation steps
         * @param {Array} data - BST values (insertion order)
         * @param {string} type - 'inorder' | 'preorder' | 'postorder'
         * @returns {Array} steps array
         */
        bstTraverse(data, type) {
            const steps = [];
            const root = buildBST(data);
            type = type || 'inorder';

            const typeNames = {
                inorder: '中序遍历 (左-根-右)',
                preorder: '前序遍历 (根-左-右)',
                postorder: '后序遍历 (左-右-根)'
            };

            steps.push({
                type: 'tree',
                tree: cloneTree(root),
                highlights: {},
                visited: [],
                description: `开始${typeNames[type]}`
            });

            const visited = [];

            function traverseInorder(node) {
                if (!node) return;
                traverseInorder(node.left);
                visited.push(node.val);
                const highlightMap = {};
                for (const v of visited) highlightMap[v] = COLORS.found;
                highlightMap[node.val] = COLORS.active;
                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: highlightMap,
                    visited: visited.slice(),
                    description: `访问节点 ${node.val}，已访问: [${visited.join(', ')}]`
                });
                traverseInorder(node.right);
            }

            function traversePreorder(node) {
                if (!node) return;
                visited.push(node.val);
                const highlightMap = {};
                for (const v of visited) highlightMap[v] = COLORS.found;
                highlightMap[node.val] = COLORS.active;
                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: highlightMap,
                    visited: visited.slice(),
                    description: `访问节点 ${node.val}，已访问: [${visited.join(', ')}]`
                });
                traversePreorder(node.left);
                traversePreorder(node.right);
            }

            function traversePostorder(node) {
                if (!node) return;
                traversePostorder(node.left);
                traversePostorder(node.right);
                visited.push(node.val);
                const highlightMap = {};
                for (const v of visited) highlightMap[v] = COLORS.found;
                highlightMap[node.val] = COLORS.active;
                steps.push({
                    type: 'tree',
                    tree: cloneTree(root),
                    highlights: highlightMap,
                    visited: visited.slice(),
                    description: `访问节点 ${node.val}，已访问: [${visited.join(', ')}]`
                });
            }

            if (type === 'inorder') traverseInorder(root);
            else if (type === 'preorder') traversePreorder(root);
            else if (type === 'postorder') traversePostorder(root);

            steps.push({
                type: 'tree',
                tree: cloneTree(root),
                highlights: {},
                visited: visited.slice(),
                description: `${typeNames[type]}完成！结果: [${visited.join(', ')}]`
            });

            return steps;
        },

        /**
         * Render a BST on canvas
         * @param {VizRenderer} renderer
         * @param {Object} step - Current step data
         */
        render(renderer, step) {
            if (!renderer) return;
            if (!step || !step.tree) {
                renderer.drawText('空树', renderer.width / 2, renderer.height / 2, '#888', 16);
                return;
            }

            const layout = calculateLayout(step.tree);
            if (layout.nodes.length === 0) {
                renderer.drawText('空树', renderer.width / 2, renderer.height / 2, '#888', 16);
                return;
            }

            const highlights = step.highlights || {};
            const padding = { top: 50, bottom: 40, left: 40, right: 40 };
            const availW = renderer.width - padding.left - padding.right;
            const availH = renderer.height - padding.top - padding.bottom;

            const nodeRadius = Math.min(22, availW / (layout.totalNodes * 2.5));
            const xSpacing = availW / Math.max(layout.totalNodes, 1);
            const ySpacing = availH / Math.max(layout.maxDepth + 1, 2);

            // Build position map
            const posMap = {};
            for (const n of layout.nodes) {
                posMap[n.val] = {
                    x: padding.left + n.x * xSpacing + xSpacing / 2,
                    y: padding.top + n.depth * ySpacing + ySpacing / 2
                };
            }

            // Draw edges first
            for (const edge of layout.edges) {
                const from = posMap[edge.from];
                const to = posMap[edge.to];
                if (from && to) {
                    renderer.drawLine(from.x, from.y, to.x, to.y, '#ccc', 2);
                }
            }

            // Draw nodes
            for (const n of layout.nodes) {
                const pos = posMap[n.val];
                const color = highlights[n.val] || COLORS.default;
                renderer.drawCircle(pos.x, pos.y, nodeRadius, color, n.val);
            }

            // Draw visited sequence at bottom
            if (step.visited && step.visited.length > 0) {
                const seqY = renderer.height - 25;
                const seqText = `遍历序列: [${step.visited.join(', ')}]`;
                renderer.drawText(seqText, renderer.width / 2, seqY, '#555', 13);
            }
        }
    };

    window.TreeViz = TreeViz;
})();
