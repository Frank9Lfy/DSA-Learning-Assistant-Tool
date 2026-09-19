/**
 * ListViz - Linked List Visualization Step Generator + Canvas Renderer
 *
 * 绘制真正的链表图元：结点由 [数据域 | 指针域] 两格组成，
 * 结点之间用箭头（next 指针）连接，带 head 头指针标记，
 * 被修改 / 遍历经过的指针用颜色高亮（蓝常规 / 琥珀遍历 / 红修改 / 绿完成）。
 *
 * 步骤数据结构（由 render() 消费）：
 *   {
 *     type_list: 'list',
 *     nodes:  [v0, v1, ...],         // 结点值，按布局顺序（下标即布局槽位）
 *     next:   [1, 2, ..., -1],       // next[i] = 后继结点下标，-1 表示空 (null)
 *     head:   0,                     // head 指针指向的结点下标，-1 表示空表
 *     highlights: { i: color },      // 结点数据域颜色
 *     arrowHighlights: { 'head'|'<i>': color }, // 高亮（被修改/经过）的指针箭头
 *     pointLabels: { i: {text,color} },         // 结点上方的指针标签（p/q/prev/curr/next）
 *     newNode: { value, pos, headTarget } | null, // 待插入的悬浮新结点
 *     newArrow: 'none'|'toNext'|'both',           // 新结点的连线阶段
 *     deletedNode: { value, pos } | null,         // 已删除的悬浮结点
 *     description: '...'
 *   }
 */
(function () {
    'use strict';

    const COLORS = {
        default: '#4a90d9',   // 常规结点（蓝）
        active: '#f5a623',    // 遍历 / 当前工作指针（琥珀）
        modify: '#e74c3c',    // 被修改的指针、待删除结点（红）
        done: '#2ecc71',      // 完成（绿）
        aux: '#9b59b6',       // 辅助指针 next（紫）
        linkCell: '#e8edf3',  // 指针域底色
        linkDot: '#8aa0b8',   // 指针域默认圆点
        arrow: '#777777',     // 常规箭头
        nullMark: '#999999',  // null 标记
        label: '#888888'      // head / 下标标签
    };

    /** 生成 0..len-1 的顺序链 next 数组，尾结点为 -1 */
    function chainNext(len) {
        return Array.from({ length: len }, (_, i) => (i + 1 < len ? i + 1 : -1));
    }

    /** 构造一个步骤（深拷贝传入的数组快照） */
    function mkStep(op, nodes, next, extra) {
        const step = Object.assign({
            type_list: 'list',
            op: op,
            nodes: nodes.slice(),
            next: next.slice(),
            head: nodes.length ? 0 : -1,
            highlights: {},
            arrowHighlights: {},
            pointLabels: {},
            newNode: null,
            newArrow: 'none',
            deletedNode: null,
            description: ''
        }, extra);
        return step;
    }

    const ListViz = {

        /* ==================== 步骤生成 ==================== */

        /**
         * 单链表插入（课件标准两步：① s->next = p->next; ② p->next = s）
         * @param {Array} data - 当前链表数据
         * @param {number} pos - 插入位置（0 基）
         * @param {*} val - 插入值
         * @returns {Array} steps
         */
        listInsert(data, pos, val) {
            const steps = [];
            const list = (data || []).slice();
            const n = list.length;
            pos = Math.floor(pos);
            const nx = chainNext(n);

            steps.push(mkStep('insert', list, nx, {
                description: `单链表插入：在位置 ${pos} 插入值 ${val}，当前长度 ${n}（顺序：先接新结点的指针，再改前驱的指针）`
            }));

            if (pos < 0 || pos > n) {
                steps.push(mkStep('insert', list, nx, {
                    description: `位置 ${pos} 非法！合法范围为 0 ~ ${n}，插入取消`
                }));
                return steps;
            }

            // 工作指针 p 沿链移动到 pos-1
            for (let i = 0; i < pos; i++) {
                const ah = {};
                ah[i === 0 ? 'head' : String(i - 1)] = COLORS.active;
                steps.push(mkStep('insert', list, nx, {
                    highlights: { [i]: COLORS.active },
                    arrowHighlights: ah,
                    pointLabels: { [i]: { text: 'p', color: COLORS.active } },
                    description: `工作指针 p 沿 next 链移动到结点 ${i}（值 ${list[i]}）`
                }));
            }

            // 创建新结点（悬浮）
            steps.push(mkStep('insert', list, nx, {
                highlights: pos > 0 ? { [pos - 1]: COLORS.active } : {},
                newNode: { value: val, pos: pos, headTarget: false },
                newArrow: 'none',
                description: `创建新结点 s，数据域置为 ${val}，此时它的指针域尚未指向任何结点`
            }));

            // ① s->next = p->next
            steps.push(mkStep('insert', list, nx, {
                highlights: pos > 0 ? { [pos - 1]: COLORS.active } : {},
                newNode: { value: val, pos: pos, headTarget: false },
                newArrow: 'toNext',
                description: `① 执行 s->next = p->next：新结点的指针域指向原第 ${pos} 个结点${pos < n ? `（值 ${list[pos]}）` : '（null，原表尾之后）'}`
            }));

            // ② p->next = s
            const ah2 = {};
            if (pos > 0) ah2[String(pos - 1)] = COLORS.modify;
            else ah2['head'] = COLORS.modify;
            steps.push(mkStep('insert', list, nx, {
                highlights: pos > 0 ? { [pos - 1]: COLORS.modify } : {},
                arrowHighlights: ah2,
                newNode: { value: val, pos: pos, headTarget: pos === 0 },
                newArrow: 'both',
                description: pos > 0
                    ? `② 执行 p->next = s：前驱结点（值 ${list[pos - 1]}）的 next 改指新结点（红色指针为被修改的指针）。两句顺序不能颠倒，否则会丢失后继链！`
                    : `② 执行 head = s：head 指针改指新结点（表头插入）。两句顺序不能颠倒，否则会丢失后继链！`
            }));

            // 完成：新结点接入链中
            const doneList = list.slice();
            doneList.splice(pos, 0, val);
            steps.push(mkStep('insert', doneList, chainNext(doneList.length), {
                highlights: { [pos]: COLORS.done },
                description: `插入完成！新链表长度 ${doneList.length}：[${doneList.join(', ')}]`
            }));

            return steps;
        },

        /**
         * 单链表删除（p->next = q->next; free(q)）
         * @param {Array} data - 当前链表数据
         * @param {number} pos - 删除位置（0 基）
         * @returns {Array} steps
         */
        listDelete(data, pos) {
            const steps = [];
            const list = (data || []).slice();
            const n = list.length;
            pos = Math.floor(pos);
            const nx = chainNext(n);

            steps.push(mkStep('delete', list, nx, {
                description: `单链表删除：删除位置 ${pos} 的结点，当前长度 ${n}（先找到前驱，再修改指针摘除结点）`
            }));

            if (pos < 0 || pos >= n) {
                steps.push(mkStep('delete', list, nx, {
                    description: `位置 ${pos} 非法！合法范围为 0 ~ ${n - 1}，删除取消`
                }));
                return steps;
            }

            // 工作指针移动到前驱
            for (let i = 0; i < pos; i++) {
                const ah = {};
                ah[i === 0 ? 'head' : String(i - 1)] = COLORS.active;
                steps.push(mkStep('delete', list, nx, {
                    highlights: { [i]: COLORS.active },
                    arrowHighlights: ah,
                    pointLabels: { [i]: { text: 'p', color: COLORS.active } },
                    description: `工作指针 p 移动到结点 ${i}（值 ${list[i]}）${i === pos - 1 ? '，这正是待删结点的前驱' : ''}`
                }));
            }

            // 定位 q
            const qLabels = pos > 0
                ? { [pos - 1]: { text: 'p', color: COLORS.active }, [pos]: { text: 'q', color: COLORS.modify } }
                : { [pos]: { text: 'q', color: COLORS.modify } };
            steps.push(mkStep('delete', list, nx, {
                highlights: { [pos]: COLORS.modify },
                pointLabels: qLabels,
                description: `定位待删结点 q（值 ${list[pos]}）${pos > 0 ? `，前驱 p（值 ${list[pos - 1]}）已就位` : '，待删结点就是首元结点，需修改 head 指针'}`
            }));

            // 修改指针跳过 q
            const skipNext = chainNext(n);
            if (pos > 0) skipNext[pos - 1] = (pos + 1 < n) ? pos + 1 : -1;
            const newHead = pos === 0 ? (n > 1 ? 1 : -1) : 0;
            steps.push(mkStep('delete', list, skipNext, {
                head: newHead,
                highlights: pos > 0 ? { [pos - 1]: COLORS.modify, [pos]: COLORS.modify } : { [pos]: COLORS.modify },
                arrowHighlights: pos > 0 ? { [String(pos - 1)]: COLORS.modify } : { 'head': COLORS.modify },
                pointLabels: pos > 0 ? { [pos - 1]: { text: 'p', color: COLORS.modify } } : {},
                description: pos > 0
                    ? `执行 p->next = q->next：结点 ${pos - 1}（值 ${list[pos - 1]}）的 next 越过 q，改指其后继${pos + 1 < n ? `（值 ${list[pos + 1]}）` : '（null）'}`
                    : `执行 head = head->next：head 指针改指第二个结点${n > 1 ? `（值 ${list[1]}）` : '（null，表变空）'}`
            }));

            // 摘除结点
            const deletedVal = list[pos];
            const rest = list.slice();
            rest.splice(pos, 1);
            steps.push(mkStep('delete', rest, chainNext(rest.length), {
                deletedNode: { value: deletedVal, pos: pos },
                description: `结点 ${deletedVal} 已从链中摘除（free(q) 释放空间）`
            }));

            steps.push(mkStep('delete', rest, chainNext(rest.length), {
                description: `删除完成！链表长度 ${rest.length}：[${rest.join(', ')}]`
            }));

            return steps;
        },

        /**
         * 单链表反转（三指针法：prev / curr / next 逐结点翻转 next 指针）
         * @param {Array} data - 当前链表数据
         * @returns {Array} steps
         */
        listReverse(data) {
            const steps = [];
            const list = (data || []).slice();
            const n = list.length;
            const nx = chainNext(n);

            steps.push(mkStep('reverse', list, nx, {
                description: `单链表反转（三指针法）：prev / curr / next 协同，逐个结点把 next 指针反向，当前长度 ${n}`
            }));

            if (n <= 1) {
                steps.push(mkStep('reverse', list, nx, {
                    description: n === 0 ? '空链表无需反转' : '链表长度为 1，无需反转'
                }));
                return steps;
            }

            let prev = -1;
            let curr = 0;
            const nxt = chainNext(n);

            while (curr !== -1) {
                const nextIdx = nxt[curr];

                // 步骤 A：保存后继
                const labelsA = { [curr]: { text: 'curr', color: COLORS.active } };
                if (prev !== -1) labelsA[prev] = { text: 'prev', color: COLORS.done };
                if (nextIdx !== -1) labelsA[nextIdx] = { text: 'next', color: COLORS.aux };
                steps.push(mkStep('reverse', list, nxt, {
                    highlights: { [curr]: COLORS.active },
                    arrowHighlights: { [String(curr)]: COLORS.active },
                    pointLabels: labelsA,
                    description: `保存后继：next = curr->next${nextIdx !== -1 ? `（值 ${list[nextIdx]}）` : '（null）'}${prev !== -1 ? '，prev、curr 已整体右移一位' : ''}`
                }));

                // 步骤 B：反转指针
                nxt[curr] = prev;
                const labelsB = { [curr]: { text: 'curr', color: COLORS.active } };
                if (prev !== -1) labelsB[prev] = { text: 'prev', color: COLORS.done };
                steps.push(mkStep('reverse', list, nxt, {
                    highlights: prev !== -1 ? { [curr]: COLORS.active, [prev]: COLORS.done } : { [curr]: COLORS.active },
                    arrowHighlights: { [String(curr)]: COLORS.modify },
                    pointLabels: labelsB,
                    description: `执行 curr->next = prev：结点 ${curr}（值 ${list[curr]}）的 next 改指${prev !== -1 ? `前驱（值 ${list[prev]}）` : 'null（它成为新的表尾）'}——指针已反转`
                }));

                prev = curr;
                curr = nextIdx;
            }

            // 完成
            const doneHi = {};
            for (let i = 0; i < n; i++) doneHi[i] = COLORS.done;
            const reversedList = list.slice().reverse();
            steps.push(mkStep('reverse', list, nxt, {
                head: n - 1,
                highlights: doneHi,
                description: `反转完成！head 指向原表尾结点（值 ${list[n - 1]}），逻辑顺序: [${reversedList.join(', ')}]`
            }));

            return steps;
        },

        /* ==================== 渲染 ==================== */

        /**
         * Render a linked list step on the canvas
         * @param {VizRenderer} renderer
         * @param {Object} step - Current step data
         */
        render(renderer, step) {
            if (!renderer || !step) return;

            const nodes = step.nodes || [];
            const nextArr = step.next || [];
            const n = nodes.length;
            const head = step.head === undefined ? (n ? 0 : -1) : step.head;
            const highlights = step.highlights || {};
            const arrowHi = step.arrowHighlights || {};
            const labels = step.pointLabels || {};
            const newNode = step.newNode || null;
            const newArrow = step.newArrow || 'none';
            const deletedNode = step.deletedNode || null;

            const L = this._computeLayout(renderer, n, !!newNode);

            // 空链表
            if (n === 0 && !newNode) {
                renderer.drawText('head → ∅ （空链表）', renderer.width / 2, renderer.height / 2, '#888888', 16);
                return;
            }

            // head 指针（若被重定向到悬浮新结点，则画在其上方）
            if (newNode && newNode.headTarget) {
                const fp = this._floatingPos(renderer, L, newNode, n);
                const c = arrowHi['head'] || COLORS.modify;
                renderer.drawText('head', fp.cx, fp.yTop - 24, c, 12);
                renderer.drawArrow(fp.cx, fp.yTop - 18, fp.cx, fp.yTop - 3, c);
            } else if (head >= 0 && head < n) {
                const hp = L.pos[head];
                const c = arrowHi['head'] || COLORS.label;
                renderer.drawText('head', hp.cx, hp.yTop - 24, c, 12);
                renderer.drawArrow(hp.cx, hp.yTop - 18, hp.cx, hp.yTop - 3, c);
            }

            // 1) 链箭头（先画箭头，再画结点覆盖端点）
            for (let i = 0; i < n; i++) {
                const ac = arrowHi[String(i)] || null;
                // 前驱已改指悬浮新结点时，跳过其原链箭头
                const redirected = newNode && newArrow === 'both' && newNode.pos > 0 && i === newNode.pos - 1;
                if (redirected) continue;

                const succ = nextArr[i];
                if (succ === -1 || succ === undefined) {
                    this._drawNullFor(renderer, L, i, ac);
                    continue;
                }
                const to = L.pos[succ];
                if (!to) continue;
                const from = L.pos[i];
                if (to.row === from.row) {
                    if (succ === i + 1) {
                        renderer.drawArrow(from.right + 1, from.cy, to.left - 2, to.cy, ac || COLORS.arrow);
                    } else if (succ === i - 1) {
                        renderer.drawArrow(from.left - 1, from.cy, to.right + 2, to.cy, ac || COLORS.arrow);
                    } else {
                        // 跳过被删结点的长箭头（画弧线越过）
                        this._drawArcArrow(renderer, from, to, ac || COLORS.modify);
                    }
                } else {
                    this._drawWrapArrow(renderer, from, to, ac || COLORS.arrow);
                }
            }

            // 2) 结点本体 [数据域|指针域]
            for (let i = 0; i < n; i++) {
                const p = L.pos[i];
                renderer.drawRoundedRect(p.left, p.yTop, L.dataW, L.nodeH, 5, highlights[i] || COLORS.default, nodes[i]);
                renderer.drawRect(p.left + L.dataW + 2, p.yTop, L.linkW, L.nodeH, COLORS.linkCell);
                renderer.drawCircle(p.left + L.dataW + 2 + L.linkW / 2, p.cy, 3.5, arrowHi[String(i)] || COLORS.linkDot);
                renderer.drawText('[' + i + ']', p.cx, p.yBot + 12, COLORS.label, 10);
            }

            // 3) 指针标签（避开 head 标签位置）
            for (const key of Object.keys(labels)) {
                const idx = parseInt(key, 10);
                if (isNaN(idx) || idx < 0 || idx >= n) continue;
                const p = L.pos[idx];
                const avoidHead = head >= 0 && idx === head && !(newNode && newNode.headTarget);
                renderer.drawText(labels[key].text, avoidHead ? p.cx + 18 : p.cx, p.yTop - 10, labels[key].color, 11);
            }

            // 4) 悬浮新结点
            if (newNode) {
                this._drawFloatingNew(renderer, L, newNode, newArrow, n, arrowHi);
            }


            // 5) 已删除结点
            if (deletedNode) {
                this._drawFloatingDeleted(renderer, L, deletedNode, n);
            }
        },

        /* -------------------- 渲染辅助 -------------------- */

        /** 计算结点布局（自动换行、居中、缩放） */
        _computeLayout(renderer, n, hasFloating) {
            const padX = 34;
            const availW = Math.max(renderer.width - padX * 2, 120);
            let dataW = 46, linkW = 26, nodeH = 40, gapX = 34;
            let unit = dataW + linkW + 2 + gapX;
            while (unit > availW && dataW > 30) {
                dataW -= 4;
                unit = dataW + linkW + 2 + gapX;
            }
            let perRow = Math.max(1, Math.floor((availW + gapX) / unit));
            if (n > 0) perRow = Math.min(perRow, n);
            const rows = Math.max(1, Math.ceil(Math.max(n, 1) / perRow));

            let rowGap = 80;
            const availH = renderer.height - (hasFloating ? 170 : 100);
            if (rows * rowGap > Math.max(availH, 60)) rowGap = Math.max(56, availH / rows);
            const totalH = rows * rowGap;
            const topY = Math.max(hasFloating ? 100 : 58, (renderer.height - totalH) / 2);

            const pos = [];
            for (let i = 0; i < n; i++) {
                const row = Math.floor(i / perRow);
                const col = i % perRow;
                const inRow = Math.min(perRow, n - row * perRow);
                const rowW = inRow * unit - gapX;
                const rowX = rows === 1 ? Math.max(padX, (renderer.width - rowW) / 2) : padX;
                const left = rowX + col * unit;
                const yTop = topY + row * rowGap;
                pos.push({
                    row: row,
                    col: col,
                    left: left,
                    right: left + dataW + linkW + 2,
                    cx: left + (dataW + linkW + 2) / 2,
                    yTop: yTop,
                    yBot: yTop + nodeH,
                    cy: yTop + nodeH / 2
                });
            }
            return { dataW: dataW, linkW: linkW, nodeH: nodeH, gapX: gapX, unit: unit, perRow: perRow, rows: rows, rowGap: rowGap, pos: pos };
        },

        /** 悬浮新结点的位置 */
        _floatingPos(renderer, L, newNode, n) {
            const idx = Math.min(Math.max(newNode.pos, 0), Math.max(n - 1, 0));
            const p = L.pos[idx];
            if (!p) return { cx: 60, yTop: 60, yBot: 100, left: 30 };
            let cx = p.cx;
            if (newNode.pos > 0 && newNode.pos < n && L.pos[newNode.pos - 1] && L.pos[newNode.pos - 1].row === p.row) {
                cx = (L.pos[newNode.pos - 1].cx + p.cx) / 2;
            }
            const halfW = (L.dataW + L.linkW + 2) / 2;
            cx = Math.min(Math.max(cx, halfW + 6), renderer.width - halfW - 6);
            const yTop = p.yTop - L.nodeH - 26;
            return { cx: cx, yTop: yTop, yBot: yTop + L.nodeH, left: cx - halfW, halfW: halfW };
        },

        /** 绘制悬浮新结点及其连线 */
        _drawFloatingNew(renderer, L, newNode, newArrow, n, arrowHi) {
            const fp = this._floatingPos(renderer, L, newNode, n);
            const bodyColor = COLORS.done;
            renderer.drawRoundedRect(fp.left, fp.yTop, L.dataW, L.nodeH, 5, bodyColor, newNode.value);
            renderer.drawRect(fp.left + L.dataW + 2, fp.yTop, L.linkW, L.nodeH, COLORS.linkCell);
            renderer.drawCircle(fp.left + L.dataW + 2 + L.linkW / 2, fp.yTop + L.nodeH / 2, 3.5, COLORS.modify);
            renderer.drawText('新结点 s', fp.cx, fp.yTop - 10, COLORS.done, 11);

            // ① s->next：新结点指向后继（pos >= n 时指向 null）
            if (newArrow === 'toNext' || newArrow === 'both') {
                if (newNode.pos < n && L.pos[newNode.pos]) {
                    const t = L.pos[newNode.pos];
                    renderer.drawArrow(fp.cx, fp.yBot + 1, t.cx, t.yTop - 2, COLORS.modify);
                } else {
                    renderer.drawArrow(fp.cx + (L.dataW + L.linkW + 2) / 2 - 6, fp.cy, fp.cx + (L.dataW + L.linkW + 2) / 2 + 12, fp.cy, COLORS.modify);
                    renderer.drawText('∅', fp.cx + (L.dataW + L.linkW + 2) / 2 + 20, fp.cy, COLORS.nullMark, 14);
                }
            }
            // ② 前驱（或 head）指向新结点
            if (newArrow === 'both' && !newNode.headTarget && newNode.pos > 0 && L.pos[newNode.pos - 1]) {
                const pr = L.pos[newNode.pos - 1];
                renderer.drawArrow(pr.cx, pr.yTop - 2, fp.cx, fp.yBot + 1, arrowHi[String(newNode.pos - 1)] || COLORS.modify);
            }
        },

        /** 绘制已删除的悬浮结点 */
        _drawFloatingDeleted(renderer, L, deletedNode, n) {
            const idx = Math.min(Math.max(deletedNode.pos, 0), Math.max(L.pos.length - 1, 0));
            const p = L.pos[idx];
            if (!p) return;
            const halfW = (L.dataW + L.linkW + 2) / 2;
            const cx = p.cx;
            const yTop = p.yBot + 30;
            const left = cx - halfW;
            renderer.drawRoundedRect(left, yTop, L.dataW, L.nodeH, 5, COLORS.modify, deletedNode.value);
            renderer.drawRect(left + L.dataW + 2, yTop, L.linkW, L.nodeH, COLORS.linkCell);
            renderer.drawText('已删除', cx, yTop + L.nodeH + 12, COLORS.modify, 11);
        },

        /** 尾结点的 null 标记（行首画在左侧，其余画在右侧） */
        _drawNullFor(renderer, L, i, color) {
            const p = L.pos[i];
            if (!p) return;
            const c = color || COLORS.nullMark;
            if (p.col === 0) {
                renderer.drawArrow(p.left - 1, p.cy, p.left - 17, p.cy, c);
                renderer.drawText('∅', p.left - 27, p.cy, c, 14);
            } else {
                renderer.drawArrow(p.right + 1, p.cy, p.right + 17, p.cy, c);
                renderer.drawText('∅', p.right + 26, p.cy, c, 14);
            }
        },

        /** 同行跨结点弧线箭头（删除时越过被删结点） */
        _drawArcArrow(renderer, from, to, color) {
            const ctx = renderer.ctx;
            if (!ctx) return;
            const c = color || COLORS.modify;
            const x1 = from.right + 1, y1 = from.cy;
            const x2 = to.left - 2, y2 = to.cy;
            const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 30;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(mx, my, x2, y2);
            ctx.strokeStyle = c;
            ctx.lineWidth = 2;
            ctx.stroke();
            const ang = Math.atan2(y2 - my, x2 - mx);
            renderer.drawArrow(x2 - 10 * Math.cos(ang), y2 - 10 * Math.sin(ang), x2, y2, c);
        },

        /** 跨行连接箭头（绕行左右边距、走行间空隙） */
        _drawWrapArrow(renderer, from, to, color) {
            const c = color || COLORS.arrow;
            const goingDown = to.row > from.row;
            const gapY = goingDown ? (from.yBot + to.yTop) / 2 : (from.yTop + to.yBot) / 2;
            const edgeX = goingDown ? renderer.width - 10 : 10;
            if (goingDown) {
                renderer.drawLine(from.right + 1, from.cy, edgeX, from.cy, c);
                renderer.drawLine(edgeX, from.cy, edgeX, gapY, c);
                renderer.drawLine(edgeX, gapY, to.cx, gapY, c);
                renderer.drawArrow(to.cx, gapY, to.cx, to.yTop - 2, c);
            } else {
                renderer.drawLine(from.left - 1, from.cy, edgeX, from.cy, c);
                renderer.drawLine(edgeX, from.cy, edgeX, gapY, c);
                renderer.drawLine(edgeX, gapY, to.cx, gapY, c);
                renderer.drawArrow(to.cx, gapY, to.cx, to.yBot + 2, c);
            }
        }
    };

    window.ListViz = ListViz;
})();
