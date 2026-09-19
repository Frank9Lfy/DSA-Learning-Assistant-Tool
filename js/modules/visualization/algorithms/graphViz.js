/**
 * GraphViz - Graph Algorithm Visualization Step Generator
 * Supports BFS, DFS, Dijkstra on adjacency matrix representations
 */
(function () {
    'use strict';

    const COLORS = {
        default: '#4a90d9',
        visiting: '#f5a623',
        visited: '#2ecc71',
        current: '#e74c3c',
        path: '#9b59b6',
        edge: '#bbb',
        edgeActive: '#f5a623'
    };

    /**
     * Calculate circular layout positions for graph vertices
     */
    function calculateGraphLayout(numVertices, width, height) {
        const positions = [];
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.32;

        for (let i = 0; i < numVertices; i++) {
            const angle = (2 * Math.PI * i) / numVertices - Math.PI / 2;
            positions.push({
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle),
                label: String.fromCharCode(65 + i) // A, B, C...
            });
        }
        return positions;
    }

    /**
     * Extract edges from adjacency matrix
     */
    function getEdges(adjMatrix) {
        const edges = [];
        const n = adjMatrix.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (adjMatrix[i][j] > 0) {
                    edges.push({ from: i, to: j, weight: adjMatrix[i][j] });
                }
            }
        }
        return edges;
    }

    const GraphViz = {

        /**
         * Generate BFS animation steps
         * @param {Array<Array>} adjMatrix - Adjacency matrix
         * @param {number} start - Starting vertex index
         * @returns {Array} steps array
         */
        bfs(adjMatrix, start) {
            const steps = [];
            const n = adjMatrix.length;
            const visited = new Set();
            const queue = [];

            start = start || 0;

            steps.push({
                type: 'graph',
                vertexStates: {},
                activeEdges: [],
                queue: [],
                description: `开始广度优先搜索 (BFS)，起始节点: ${String.fromCharCode(65 + start)}`
            });

            queue.push(start);
            visited.add(start);

            steps.push({
                type: 'graph',
                vertexStates: { [start]: COLORS.visiting },
                activeEdges: [],
                queue: [start],
                description: `将起始节点 ${String.fromCharCode(65 + start)} 加入队列`
            });

            while (queue.length > 0) {
                const current = queue.shift();
                const vertexStates = {};
                for (const v of visited) vertexStates[v] = COLORS.visited;
                vertexStates[current] = COLORS.current;

                steps.push({
                    type: 'graph',
                    vertexStates: { ...vertexStates },
                    activeEdges: [],
                    queue: queue.slice(),
                    description: `出队节点 ${String.fromCharCode(65 + current)}，开始探索其邻居`
                });

                for (let neighbor = 0; neighbor < n; neighbor++) {
                    if (adjMatrix[current][neighbor] > 0 && !visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);

                        const nextStates = {};
                        for (const v of visited) nextStates[v] = COLORS.visited;
                        nextStates[current] = COLORS.current;
                        nextStates[neighbor] = COLORS.visiting;

                        steps.push({
                            type: 'graph',
                            vertexStates: { ...nextStates },
                            activeEdges: [{ from: current, to: neighbor }],
                            queue: queue.slice(),
                            description: `发现未访问邻居 ${String.fromCharCode(65 + neighbor)}，加入队列`
                        });
                    }
                }

                const afterStates = {};
                for (const v of visited) afterStates[v] = COLORS.visited;

                steps.push({
                    type: 'graph',
                    vertexStates: { ...afterStates },
                    activeEdges: [],
                    queue: queue.slice(),
                    description: `节点 ${String.fromCharCode(65 + current)} 探索完毕，队列剩余: [${queue.map(v => String.fromCharCode(65 + v)).join(', ')}]`
                });
            }

            const finalStates = {};
            for (let i = 0; i < n; i++) finalStates[i] = visited.has(i) ? COLORS.visited : COLORS.default;

            steps.push({
                type: 'graph',
                vertexStates: finalStates,
                activeEdges: [],
                queue: [],
                description: `BFS 完成！访问了 ${visited.size} 个节点`
            });

            return steps;
        },

        /**
         * Generate DFS animation steps
         * @param {Array<Array>} adjMatrix - Adjacency matrix
         * @param {number} start - Starting vertex index
         * @returns {Array} steps array
         */
        dfs(adjMatrix, start) {
            const steps = [];
            const n = adjMatrix.length;
            const visited = new Set();
            const stack = [];

            start = start || 0;

            steps.push({
                type: 'graph',
                vertexStates: {},
                activeEdges: [],
                stack: [],
                description: `开始深度优先搜索 (DFS)，起始节点: ${String.fromCharCode(65 + start)}`
            });

            function dfsHelper(node) {
                visited.add(node);
                stack.push(node);

                const enterStates = {};
                for (const v of visited) enterStates[v] = COLORS.visited;
                enterStates[node] = COLORS.current;

                steps.push({
                    type: 'graph',
                    vertexStates: { ...enterStates },
                    activeEdges: [],
                    stack: stack.slice(),
                    description: `访问节点 ${String.fromCharCode(65 + node)}，递归深入`
                });

                for (let neighbor = 0; neighbor < n; neighbor++) {
                    if (adjMatrix[node][neighbor] > 0 && !visited.has(neighbor)) {
                        const exploreStates = {};
                        for (const v of visited) exploreStates[v] = COLORS.visited;
                        exploreStates[node] = COLORS.current;
                        exploreStates[neighbor] = COLORS.visiting;

                        steps.push({
                            type: 'graph',
                            vertexStates: { ...exploreStates },
                            activeEdges: [{ from: node, to: neighbor }],
                            stack: stack.slice(),
                            description: `从 ${String.fromCharCode(65 + node)} 探索邻居 ${String.fromCharCode(65 + neighbor)}`
                        });

                        dfsHelper(neighbor);
                    }
                }

                stack.pop();
                const afterStates = {};
                for (const v of visited) afterStates[v] = COLORS.visited;

                steps.push({
                    type: 'graph',
                    vertexStates: { ...afterStates },
                    activeEdges: [],
                    stack: stack.slice(),
                    description: `回溯：节点 ${String.fromCharCode(65 + node)} 的所有邻居已探索完毕`
                });
            }

            dfsHelper(start);

            const finalStates = {};
            for (let i = 0; i < n; i++) finalStates[i] = visited.has(i) ? COLORS.visited : COLORS.default;

            steps.push({
                type: 'graph',
                vertexStates: finalStates,
                activeEdges: [],
                stack: [],
                description: `DFS 完成！访问了 ${visited.size} 个节点`
            });

            return steps;
        },

        /**
         * Generate Dijkstra's shortest path animation steps
         * @param {Array<Array>} adjMatrix - Adjacency matrix (weights, 0 = no edge)
         * @param {number} start - Starting vertex index
         * @returns {Array} steps array
         */
        dijkstra(adjMatrix, start) {
            const steps = [];
            const n = adjMatrix.length;
            start = start || 0;

            const dist = new Array(n).fill(Infinity);
            const prev = new Array(n).fill(-1);
            const visited = new Set();
            dist[start] = 0;

            steps.push({
                type: 'graph',
                vertexStates: {},
                activeEdges: [],
                distances: dist.slice(),
                description: `开始 Dijkstra 最短路径算法，源节点: ${String.fromCharCode(65 + start)}`
            });

            steps.push({
                type: 'graph',
                vertexStates: { [start]: COLORS.visiting },
                activeEdges: [],
                distances: dist.slice(),
                description: `初始化距离数组: dist[${String.fromCharCode(65 + start)}]=0，其余为 ∞`
            });

            for (let iter = 0; iter < n; iter++) {
                // Find minimum distance unvisited vertex
                let u = -1;
                let minDist = Infinity;
                for (let i = 0; i < n; i++) {
                    if (!visited.has(i) && dist[i] < minDist) {
                        minDist = dist[i];
                        u = i;
                    }
                }

                if (u === -1) break;

                visited.add(u);
                const states = {};
                for (const v of visited) states[v] = COLORS.visited;
                states[u] = COLORS.current;

                steps.push({
                    type: 'graph',
                    vertexStates: { ...states },
                    activeEdges: [],
                    distances: dist.slice(),
                    description: `选择未访问节点中距离最小的: ${String.fromCharCode(65 + u)} (距离=${dist[u]})`
                });

                // Relax neighbors
                for (let v = 0; v < n; v++) {
                    if (adjMatrix[u][v] > 0 && !visited.has(v)) {
                        const newDist = dist[u] + adjMatrix[u][v];
                        const edgeStates = { ...states };
                        edgeStates[v] = COLORS.visiting;

                        steps.push({
                            type: 'graph',
                            vertexStates: { ...edgeStates },
                            activeEdges: [{ from: u, to: v }],
                            distances: dist.slice(),
                            description: `松弛边 ${String.fromCharCode(65 + u)}→${String.fromCharCode(65 + v)}: ${dist[u]}+${adjMatrix[u][v]}=${newDist} ${newDist < dist[v] ? '< ' + dist[v] + '，更新!' : '≥ ' + dist[v] + '，不更新'}`
                        });

                        if (newDist < dist[v]) {
                            dist[v] = newDist;
                            prev[v] = u;
                            steps.push({
                                type: 'graph',
                                vertexStates: { ...edgeStates },
                                activeEdges: [{ from: u, to: v }],
                                distances: dist.slice(),
                                description: `更新 dist[${String.fromCharCode(65 + v)}] = ${newDist}，前驱节点: ${String.fromCharCode(65 + u)}`
                            });
                        }
                    }
                }
            }

            const finalStates = {};
            for (let i = 0; i < n; i++) finalStates[i] = visited.has(i) ? COLORS.visited : COLORS.default;

            const distStr = dist.map((d, i) => `${String.fromCharCode(65 + i)}:${d === Infinity ? '∞' : d}`).join(', ');
            steps.push({
                type: 'graph',
                vertexStates: finalStates,
                activeEdges: [],
                distances: dist.slice(),
                description: `Dijkstra 完成！最短距离: ${distStr}`
            });

            return steps;
        },

        /**
         * Render a graph on canvas
         * @param {VizRenderer} renderer
         * @param {Object} step - Current step data
         * @param {Array<Array>} adjMatrix - The adjacency matrix
         */
        render(renderer, step, adjMatrix) {
            if (!renderer || !step || !adjMatrix) return;

            const n = adjMatrix.length;
            const positions = calculateGraphLayout(n, renderer.width, renderer.height - 40);
            const edges = getEdges(adjMatrix);
            const vertexStates = step.vertexStates || {};
            const activeEdges = new Set(
                (step.activeEdges || []).map(e => `${e.from}-${e.to}`)
            );

            const nodeRadius = Math.min(28, renderer.width / (n * 3));

            // Draw edges
            for (const edge of edges) {
                const from = positions[edge.from];
                const to = positions[edge.to];
                const isActive = activeEdges.has(`${edge.from}-${edge.to}`) ||
                    activeEdges.has(`${edge.to}-${edge.from}`);

                const color = isActive ? COLORS.edgeActive : COLORS.edge;
                const width = isActive ? 3 : 1.5;
                renderer.drawLine(from.x, from.y, to.x, to.y, color, width);

                // Weight label
                if (edge.weight > 1) {
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;
                    renderer.drawText(edge.weight, midX, midY - 8, '#666', 11);
                }
            }

            // Draw vertices
            for (let i = 0; i < n; i++) {
                const pos = positions[i];
                const color = vertexStates[i] || COLORS.default;
                const label = pos.label;

                renderer.drawCircle(pos.x, pos.y, nodeRadius, color, label);

                // Distance label if available
                if (step.distances && step.distances[i] !== undefined) {
                    const distVal = step.distances[i] === Infinity ? '∞' : step.distances[i];
                    renderer.drawText(`d=${distVal}`, pos.x, pos.y + nodeRadius + 14, '#555', 10);
                }
            }

            // Draw queue/stack info
            if (step.queue && step.queue.length > 0) {
                const qText = '队列: [' + step.queue.map(v => String.fromCharCode(65 + v)).join(', ') + ']';
                renderer.drawText(qText, renderer.width / 2, renderer.height - 20, '#555', 12);
            }
            if (step.stack && step.stack.length > 0) {
                const sText = '栈: [' + step.stack.map(v => String.fromCharCode(65 + v)).join(', ') + ']';
                renderer.drawText(sText, renderer.width / 2, renderer.height - 20, '#555', 12);
            }
        }
    };

    window.GraphViz = GraphViz;
})();
