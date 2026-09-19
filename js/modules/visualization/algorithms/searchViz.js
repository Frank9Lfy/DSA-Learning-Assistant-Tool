/**
 * SearchViz - Search Algorithm Visualization Step Generator
 * Generates animation steps for linear and binary search
 */
(function () {
    'use strict';

    const COLORS = {
        default: '#4a90d9',
        active: '#f5a623',
        found: '#2ecc71',
        notFound: '#e74c3c',
        range: '#d5e8f7',
        eliminated: '#e0e0e0'
    };

    const SearchViz = {

        /**
         * Generate linear search animation steps
         * @param {Array} data - Array of numbers
         * @param {number} target - Value to search for
         * @returns {Array} steps array
         */
        linearSearch(data, target) {
            const steps = [];

            steps.push({
                type: 'search',
                data: data.slice(),
                highlights: {},
                range: { low: 0, high: data.length - 1 },
                eliminated: [],
                description: `开始线性搜索：在数组中查找目标值 ${target}`
            });

            for (let i = 0; i < data.length; i++) {
                const highlights = {};
                highlights[i] = COLORS.active;
                // Mark previously checked as gray
                for (let j = 0; j < i; j++) {
                    highlights[j] = COLORS.eliminated;
                }

                steps.push({
                    type: 'search',
                    data: data.slice(),
                    highlights: highlights,
                    range: { low: i, high: i },
                    eliminated: Array.from({ length: i }, (_, idx) => idx),
                    description: `检查位置 ${i}: arr[${i}]=${data[i]}${data[i] === target ? '' : ` ≠ ${target}`}`
                });

                if (data[i] === target) {
                    highlights[i] = COLORS.found;
                    steps.push({
                        type: 'search',
                        data: data.slice(),
                        highlights: highlights,
                        range: { low: i, high: i },
                        eliminated: [],
                        description: `✓ 找到目标！${target} 在位置 ${i}，共比较了 ${i + 1} 次`
                    });
                    return steps;
                }
            }

            // Not found
            const finalHighlights = {};
            for (let i = 0; i < data.length; i++) {
                finalHighlights[i] = COLORS.eliminated;
            }
            steps.push({
                type: 'search',
                data: data.slice(),
                highlights: finalHighlights,
                range: null,
                eliminated: Array.from({ length: data.length }, (_, idx) => idx),
                description: `✗ 未找到目标值 ${target}，已遍历全部 ${data.length} 个元素`
            });

            return steps;
        },

        /**
         * Generate binary search animation steps
         * @param {Array} data - Sorted array of numbers
         * @param {number} target - Value to search for
         * @returns {Array} steps array
         */
        binarySearch(data, target) {
            const steps = [];
            let low = 0;
            let high = data.length - 1;
            const eliminated = [];

            steps.push({
                type: 'search',
                data: data.slice(),
                highlights: {},
                range: { low, high },
                eliminated: [],
                description: `开始二分搜索：在有序数组中查找目标值 ${target}（数组长度 ${data.length}）`
            });

            let comparisons = 0;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);

                // Show current range
                const rangeHighlights = {};
                for (let i = low; i <= high; i++) {
                    rangeHighlights[i] = COLORS.range;
                }
                rangeHighlights[mid] = COLORS.active;

                steps.push({
                    type: 'search',
                    data: data.slice(),
                    highlights: { ...rangeHighlights },
                    range: { low, high },
                    eliminated: eliminated.slice(),
                    description: `搜索范围 [${low}..${high}]，中间位置 mid=${mid}，arr[${mid}]=${data[mid]}`
                });

                comparisons++;

                if (data[mid] === target) {
                    const foundHighlights = {};
                    for (const e of eliminated) foundHighlights[e] = COLORS.eliminated;
                    foundHighlights[mid] = COLORS.found;

                    steps.push({
                        type: 'search',
                        data: data.slice(),
                        highlights: foundHighlights,
                        range: { low: mid, high: mid },
                        eliminated: eliminated.slice(),
                        description: `✓ 找到目标！arr[${mid}]=${target}，共比较了 ${comparisons} 次`
                    });
                    return steps;
                } else if (data[mid] < target) {
                    // Eliminate left half
                    const elimHighlights = {};
                    for (const e of eliminated) elimHighlights[e] = COLORS.eliminated;
                    for (let i = low; i <= mid; i++) {
                        elimHighlights[i] = COLORS.eliminated;
                        eliminated.push(i);
                    }
                    for (let i = mid + 1; i <= high; i++) {
                        elimHighlights[i] = COLORS.range;
                    }

                    steps.push({
                        type: 'search',
                        data: data.slice(),
                        highlights: elimHighlights,
                        range: { low: mid + 1, high },
                        eliminated: eliminated.slice(),
                        description: `${data[mid]} < ${target}，目标在右半部分，排除 [${low}..${mid}]`
                    });
                    low = mid + 1;
                } else {
                    // Eliminate right half
                    const elimHighlights = {};
                    for (const e of eliminated) elimHighlights[e] = COLORS.eliminated;
                    for (let i = mid; i <= high; i++) {
                        elimHighlights[i] = COLORS.eliminated;
                        eliminated.push(i);
                    }
                    for (let i = low; i < mid; i++) {
                        elimHighlights[i] = COLORS.range;
                    }

                    steps.push({
                        type: 'search',
                        data: data.slice(),
                        highlights: elimHighlights,
                        range: { low, high: mid - 1 },
                        eliminated: eliminated.slice(),
                        description: `${data[mid]} > ${target}，目标在左半部分，排除 [${mid}..${high}]`
                    });
                    high = mid - 1;
                }
            }

            // Not found
            const finalHighlights = {};
            for (let i = 0; i < data.length; i++) {
                finalHighlights[i] = COLORS.eliminated;
            }
            steps.push({
                type: 'search',
                data: data.slice(),
                highlights: finalHighlights,
                range: null,
                eliminated: Array.from({ length: data.length }, (_, idx) => idx),
                description: `✗ 未找到目标值 ${target}，共比较了 ${comparisons} 次，搜索范围为空`
            });

            return steps;
        },

        /**
         * Render search visualization on canvas (bar chart style)
         * @param {VizRenderer} renderer
         * @param {Object} step - Current step data
         */
        render(renderer, step) {
            if (!renderer || !step || !step.data) return;

            const data = step.data;
            const highlights = step.highlights || {};
            const range = step.range;

            const padding = { top: 50, bottom: 60, left: 20, right: 20 };
            const chartW = renderer.width - padding.left - padding.right;
            const chartH = renderer.height - padding.top - padding.bottom;
            const barWidth = Math.max(8, (chartW / data.length) * 0.75);
            const gap = (chartW - barWidth * data.length) / (data.length + 1);
            const maxVal = Math.max(...data, 1);

            // Draw range bracket
            if (range && range.low <= range.high) {
                const rx = padding.left + gap + range.low * (barWidth + gap) - 4;
                const rw = (range.high - range.low + 1) * (barWidth + gap) + 4;
                const ry = padding.top - 8;
                const rh = chartH + 16;

                renderer.ctx.fillStyle = 'rgba(74, 144, 217, 0.08)';
                renderer.ctx.fillRect(rx, ry, rw, rh);
                renderer.ctx.strokeStyle = 'rgba(74, 144, 217, 0.3)';
                renderer.ctx.lineWidth = 1;
                renderer.ctx.setLineDash([4, 4]);
                renderer.ctx.strokeRect(rx, ry, rw, rh);
                renderer.ctx.setLineDash([]);
            }

            // Draw bars
            for (let i = 0; i < data.length; i++) {
                const barH = (data[i] / maxVal) * chartH;
                const x = padding.left + gap + i * (barWidth + gap);
                const y = padding.top + chartH - barH;

                let color = COLORS.default;
                if (highlights[i]) {
                    color = highlights[i];
                }

                renderer.drawRect(x, y, barWidth, barH, color);

                // Value label on top
                if (barWidth > 16) {
                    const fontSize = Math.min(12, barWidth * 0.55);
                    renderer.drawText(data[i], x + barWidth / 2, y - 12, '#333', fontSize);
                }

                // Index label at bottom
                renderer.drawText(i, x + barWidth / 2, padding.top + chartH + 14, '#888', 9);
            }

            // Draw "low", "mid", "high" pointers if range exists
            if (range && range.low <= range.high) {
                const mid = Math.floor((range.low + range.high) / 2);
                const pointerY = padding.top + chartH + 32;

                const drawPointer = (idx, label, color) => {
                    const px = padding.left + gap + idx * (barWidth + gap) + barWidth / 2;
                    renderer.drawText(`▲ ${label}`, px, pointerY, color, 11);
                };

                drawPointer(range.low, 'low', '#e74c3c');
                if (mid !== range.low && mid !== range.high) {
                    drawPointer(mid, 'mid', '#f5a623');
                }
                drawPointer(range.high, 'high', '#e74c3c');
            }
        },

        /* ============================================================
         * KMP 模式匹配（Lesson04 课件：无回溯匹配 + next 特征向量）
         * next 定义（0 基）：next[0] = -1；
         * next[j] = 使 p0..p(k) = p(j-k-1)..p(j-1) 的最大 k+1（0<=k<j-1），否则 0
         * ============================================================ */

        /**
         * Generate KMP pattern matching animation steps
         * @param {string} target - 主串 T
         * @param {string} pattern - 模式串 P
         * @returns {Array} steps array
         */
        kmp(target, pattern) {
            const T = String(target == null ? '' : target);
            const P = String(pattern == null ? '' : pattern);
            const n = T.length;
            const m = P.length;
            const steps = [];

            const mk = (extra) => Object.assign({
                type_list: 'kmp',
                phase: 'match',
                T: T,
                P: P,
                next: [],
                nextComputed: 0,
                i: 0,
                j: 0,
                k: null,
                compare: null,
                result: '',
                align: 0,
                prevAlign: null,
                description: ''
            }, extra);

            if (n === 0 || m === 0) {
                steps.push(mk({ result: 'fail', description: '输入为空串，无法进行模式匹配' }));
                return steps;
            }

            /* ---------- 阶段一：递推计算 next 特征向量 ---------- */
            const next = new Array(m).fill(0);
            next[0] = -1;
            steps.push(mk({
                phase: 'build-next',
                next: next.slice(),
                nextComputed: 1,
                description: '第一步：计算 next 特征向量。按课件定义 next[0] = -1（j=0 时前面没有前缀可复用）'
            }));

            for (let j = 1; j < m; j++) {
                let k = next[j - 1];
                steps.push(mk({
                    phase: 'build-next',
                    next: next.slice(),
                    nextComputed: j,
                    j: j,
                    k: k,
                    compare: k >= 0 ? { p: k, pj: j - 1 } : null,
                    description: `求 next[${j}]：令 k = next[${j - 1}] = ${k}` +
                        (k >= 0 ? `，比较 P[${k}]='${P[k]}' 与 P[${j - 1}]='${P[j - 1]}'` : '（k = -1，无前缀可复用）')
                }));
                while (k !== -1 && P[k] !== P[j - 1]) {
                    k = next[k];
                    steps.push(mk({
                        phase: 'build-next',
                        next: next.slice(),
                        nextComputed: j,
                        j: j,
                        k: k,
                        compare: k >= 0 ? { p: k, pj: j - 1 } : null,
                        description: `两者不等，利用已求出的 next 回退：k = next[旧k] = ${k}` +
                            (k >= 0 ? `，继续比较 P[${k}]='${P[k]}' 与 P[${j - 1}]='${P[j - 1]}'` : '，k = -1（已退到头）')
                    }));
                }
                next[j] = k + 1;
                steps.push(mk({
                    phase: 'build-next',
                    next: next.slice(),
                    nextComputed: j + 1,
                    j: j,
                    k: k,
                    compare: k >= 0 ? { p: k, pj: j - 1 } : null,
                    result: 'compute-done',
                    description: (k >= 0 ? `P[${k}] = P[${j - 1}] = '${P[k]}'，前缀可复用，` : 'k = -1，从零开始，') +
                        `→ next[${j}] = k + 1 = ${next[j]}`
                }));
            }

            steps.push(mk({
                phase: 'build-next',
                next: next.slice(),
                nextComputed: m,
                result: 'compute-done',
                description: `next 特征向量计算完成：[${next.join(', ')}]——匹配失配时由它决定模式串右移位置，主串指针不回溯`
            }));

            /* ---------- 阶段二：KMP 匹配（课件 fastFind） ---------- */
            let i = 0;
            let j = 0;
            let comparisons = 0;

            while (i < n && j < m) {
                if (j === -1) {
                    steps.push(mk({
                        phase: 'match',
                        next: next.slice(),
                        nextComputed: m,
                        i: i,
                        j: -1,
                        align: i + 1,
                        result: 'reset',
                        description: `j = -1（P[0] 已滑过 T[${i}]，无可复用前缀）：主串指针 i 进 1，模式串回到 P[0]，继续比较 T[${i + 1}] 与 P[0]`
                    }));
                    i++;
                    j++;
                    continue;
                }

                comparisons++;
                if (T[i] === P[j]) {
                    steps.push(mk({
                        phase: 'match',
                        next: next.slice(),
                        nextComputed: m,
                        i: i,
                        j: j,
                        align: i - j,
                        compare: { t: i, p: j },
                        result: 'match',
                        type: 'compare',
                        description: `T[${i}]='${T[i]}' = P[${j}]='${P[j]}' ✓ 匹配，两指针同时右移（已连续匹配 ${j + 1} 个字符）`
                    }));
                    i++;
                    j++;
                } else {
                    const nj = next[j];
                    steps.push(mk({
                        phase: 'match',
                        next: next.slice(),
                        nextComputed: m,
                        i: i,
                        j: j,
                        align: i - nj,
                        prevAlign: i - j,
                        compare: { t: i, p: j },
                        result: 'shift',
                        type: 'compare',
                        description: `T[${i}]='${T[i]}' ≠ P[${j}]='${P[j]}' ✗ 失配 → 查 next[${j}] = ${nj}，模式串右移` +
                            (nj >= 0
                                ? `，改用 P[${nj}] 与 T[${i}] 继续比较（主串指针不回溯）`
                                : '，P[0] 将对齐 T[' + (i + 1) + ']（主串指针将进 1）')
                    }));
                    j = nj;
                }
            }

            if (j >= m) {
                steps.push(mk({
                    phase: 'match',
                    next: next.slice(),
                    nextComputed: m,
                    i: i,
                    j: j,
                    align: i - m,
                    result: 'found',
                    description: `✓ 匹配成功！模式串 "${P}" 出现在主串下标 ${i - m} 处（T[${i - m}..${i - 1}]），共比较 ${comparisons} 次。目标串指针无回溯，时间复杂度 O(lengthT)`
                }));
            } else {
                steps.push(mk({
                    phase: 'match',
                    next: next.slice(),
                    nextComputed: m,
                    i: i,
                    j: j,
                    align: Math.max(0, i - Math.max(j, 0)),
                    result: 'fail',
                    description: `✗ 匹配失败：主串中不存在模式串 "${P}"，共比较 ${comparisons} 次`
                }));
            }

            return steps;
        },

        /**
         * Render KMP visualization: 主串 / 模式串两行字符格 + next 数组行
         * @param {VizRenderer} renderer
         * @param {Object} step
         */
        renderKmp(renderer, step) {
            if (!renderer || !step) return;
            const T = step.T || '';
            const P = step.P || '';
            const n = T.length;
            const m = P.length;
            if (!n || !m) return;

            const next = step.next || [];
            const nextComputed = step.nextComputed === undefined ? next.length : step.nextComputed;
            const compare = step.compare || null;
            const result = step.result || '';
            const phase = step.phase || 'match';
            const align = Math.max(0, step.align === undefined ? 0 : step.align);
            const prevAlign = (step.prevAlign === undefined || step.prevAlign === null) ? null : Math.max(0, step.prevAlign);
            const i = step.i === undefined ? 0 : step.i;
            const j = step.j === undefined ? 0 : step.j;

            // 布局：列数需容纳主串 + 模式串右移的最大越出量
            const padL = 64;
            const availW = Math.max(renderer.width - padL - 14, 120);
            const cols = Math.max(n + m - 1, 1);
            let cellW = Math.floor(availW / cols);
            cellW = Math.max(14, Math.min(34, cellW));
            const cellH = Math.min(34, Math.max(20, cellW));
            const totalW = cols * cellW;
            const x0 = Math.max(padL, (renderer.width - totalW) / 2);
            const labelX = Math.max(30, x0 - 34);

            const yMain = 60;
            const yPat = yMain + cellH + 54;
            const yNext = yPat + cellH + 40;

            const cellX = (k) => x0 + k * cellW;
            const cx = (k) => cellX(k) + cellW / 2;

            /* ---- 主串 T ---- */
            renderer.drawText('主串 T', labelX, yMain + cellH / 2, '#888888', 12);
            for (let k = 0; k < n; k++) {
                let color = COLORS.default;
                if (phase === 'match') {
                    const isMatched = align <= k && k < i && j >= 0;
                    const isCompare = compare && compare.t === k;
                    if (isCompare && result === 'shift') color = COLORS.notFound;
                    else if (isCompare && result === 'match') color = COLORS.found;
                    else if (isMatched) color = COLORS.found;
                }
                renderer.drawRect(cellX(k), yMain, cellW, cellH, color, T[k]);
                renderer.drawText(String(k), cx(k), yMain + cellH + 11, '#999999', 9);
            }
            // i 指针
            if (phase === 'match' && i >= 0 && i < n) {
                renderer.drawText('▲ i', cx(i), yMain - 12, COLORS.active, 11);
            }

            /* ---- 模式串 P（旧位置虚影 → 右移） ---- */
            renderer.drawText('模式串 P', labelX, yPat + cellH / 2, '#888888', 12);
            if (prevAlign !== null && prevAlign !== align) {
                const ctx = renderer.ctx;
                if (ctx) {
                    ctx.setLineDash([3, 3]);
                    for (let k = 0; k < m; k++) {
                        ctx.strokeStyle = 'rgba(153,153,153,0.7)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(cellX(prevAlign + k) + 1, yPat + 1, cellW - 2, cellH - 2);
                    }
                    ctx.setLineDash([]);
                }
                const ax1 = cx(prevAlign);
                const ax2 = cx(align);
                renderer.drawArrow(ax1, yPat - 26, ax2, yPat - 26, COLORS.notFound);
                renderer.drawText('按 next[j] 右移', (ax1 + ax2) / 2, yPat - 38, COLORS.notFound, 11);
            }
            for (let k = 0; k < m; k++) {
                let color = COLORS.default;
                if (phase === 'build-next') {
                    if (compare) {
                        if (compare.p === k || compare.pj === k) {
                            color = result === 'compute-done' ? COLORS.found : COLORS.active;
                        }
                    }
                } else if (j >= 0) {
                    const isMatched = k < j;
                    const isCompare = compare && compare.p === k;
                    if (isCompare && result === 'shift') color = COLORS.notFound;
                    else if (isCompare && result === 'match') color = COLORS.found;
                    else if (isMatched) color = COLORS.found;
                }
                renderer.drawRect(cellX(align + k), yPat, cellW, cellH, color, P[k]);
                renderer.drawText(String(k), cx(align + k), yPat + cellH + 11, '#999999', 9);
            }
            // j / k 指针
            if (phase === 'match') {
                if (j >= 0 && j < m) {
                    renderer.drawText('▲ j', cx(align + j), yPat + cellH + 22, COLORS.active, 11);
                } else if (j < 0) {
                    renderer.drawText('▲ j = -1', cx(align), yPat + cellH + 22, COLORS.notFound, 11);
                }
            } else if (phase === 'build-next' && step.j !== undefined && step.j >= 1) {
                renderer.drawText('▲ j', cx(step.j), yPat + cellH + 22, COLORS.active, 11);
            }

            /* ---- next 特征向量行 ---- */
            const nextH = Math.max(16, cellH - 10);
            renderer.drawText('next[j]', labelX, yNext + nextH / 2, '#888888', 12);
            for (let k = 0; k < m; k++) {
                const known = k < nextComputed;
                let color = '#eef1f5';
                let text = known ? String(next[k]) : '?';
                if (phase === 'build-next' && result === 'compute-done' && k === nextComputed - 1) {
                    color = COLORS.found;
                } else if (phase === 'build-next' && compare && (compare.p === k || compare.pj === k)) {
                    color = COLORS.active;
                } else if (phase === 'match' && result === 'shift' && k === j) {
                    color = COLORS.notFound;
                } else if (phase === 'match' && j >= 0 && k === j) {
                    color = COLORS.active;
                }
                renderer.drawRect(cellX(align + k), yNext, cellW, nextH, color, text);
            }

            /* ---- 结果标注 ---- */
            if (result === 'found') {
                renderer.drawText(`匹配成功：位置 ${i - m}`, renderer.width / 2, yNext + nextH + 26, COLORS.found, 15);
            } else if (result === 'fail') {
                renderer.drawText('匹配失败', renderer.width / 2, yNext + nextH + 26, COLORS.notFound, 15);
            } else if (phase === 'match' && j > 0 && align + j <= n) {
                // 已匹配前缀提示
                renderer.drawText(`已匹配 ${j} 个字符`, cx(align) + (j * cellW) / 2 - cellW / 2, yNext + nextH + 26, '#666666', 11);
            }
        }
    };

    window.SearchViz = SearchViz;
})();
