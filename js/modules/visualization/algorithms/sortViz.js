/**
 * SortViz - Sorting Algorithm Visualization Step Generator
 * Generates animation steps for common sorting algorithms
 */
(function () {
    'use strict';

    const COLORS = {
        default: '#4a90d9',
        comparing: '#f5a623',
        swapping: '#e74c3c',
        sorted: '#2ecc71',
        active: '#9b59b6'
    };

    const SortViz = {

        /**
         * Generate bubble sort animation steps
         * @param {Array} data - Array of numbers
         * @returns {Array} steps array
         */
        bubbleSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set();

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '开始冒泡排序：重复比较相邻元素，将较大元素冒泡到末尾'
            });

            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    steps.push({
                        type: 'compare',
                        indices: [j, j + 1],
                        values: arr.slice(),
                        description: `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`
                    });

                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        steps.push({
                            type: 'swap',
                            indices: [j, j + 1],
                            values: arr.slice(),
                            description: `${arr[j + 1]} > ${arr[j]}，交换位置`
                        });
                    }
                }
                sorted.add(arr.length - 1 - i);
                steps.push({
                    type: 'set',
                    indices: [],
                    values: arr.slice(),
                    sorted: Array.from(sorted),
                    description: `第 ${i + 1} 轮完成，arr[${arr.length - 1 - i}]=${arr[arr.length - 1 - i]} 已就位`
                });
            }

            // Mark all sorted
            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '冒泡排序完成！时间复杂度 O(n²)'
            });

            return steps;
        },

        /**
         * Generate selection sort animation steps
         */
        selectionSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set();

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '开始选择排序：每次找到未排序部分的最小值放到正确位置'
            });

            for (let i = 0; i < arr.length - 1; i++) {
                let minIdx = i;

                steps.push({
                    type: 'compare',
                    indices: [i],
                    values: arr.slice(),
                    description: `从位置 ${i} 开始寻找最小值，当前最小: arr[${i}]=${arr[i]}`
                });

                for (let j = i + 1; j < arr.length; j++) {
                    steps.push({
                        type: 'compare',
                        indices: [minIdx, j],
                        values: arr.slice(),
                        description: `比较最小值 arr[${minIdx}]=${arr[minIdx]} 和 arr[${j}]=${arr[j]}`
                    });

                    if (arr[j] < arr[minIdx]) {
                        minIdx = j;
                        steps.push({
                            type: 'highlight',
                            indices: [minIdx],
                            values: arr.slice(),
                            description: `发现更小的值 arr[${minIdx}]=${arr[minIdx]}，更新最小值索引`
                        });
                    }
                }

                if (minIdx !== i) {
                    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                    steps.push({
                        type: 'swap',
                        indices: [i, minIdx],
                        values: arr.slice(),
                        description: `将最小值 ${arr[i]} 交换到位置 ${i}`
                    });
                }

                sorted.add(i);
                steps.push({
                    type: 'set',
                    indices: [],
                    values: arr.slice(),
                    sorted: Array.from(sorted),
                    description: `位置 ${i} 已排序完成，值为 ${arr[i]}`
                });
            }

            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '选择排序完成！时间复杂度 O(n²)'
            });

            return steps;
        },

        /**
         * Generate insertion sort animation steps
         */
        insertionSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set([0]);

            steps.push({
                type: 'highlight',
                indices: [0],
                values: arr.slice(),
                description: '开始插入排序：逐个将元素插入已排序部分的正确位置'
            });

            for (let i = 1; i < arr.length; i++) {
                const key = arr[i];
                let j = i - 1;

                steps.push({
                    type: 'compare',
                    indices: [i],
                    values: arr.slice(),
                    description: `取出 arr[${i}]=${key}，准备插入已排序部分`
                });

                while (j >= 0 && arr[j] > key) {
                    steps.push({
                        type: 'compare',
                        indices: [j, j + 1],
                        values: arr.slice(),
                        description: `比较 arr[${j}]=${arr[j]} > ${key}，向右移动`
                    });

                    arr[j + 1] = arr[j];
                    steps.push({
                        type: 'set',
                        indices: [j + 1],
                        values: arr.slice(),
                        sorted: Array.from(sorted),
                        description: `将 arr[${j}]=${arr[j]} 移动到位置 ${j + 1}`
                    });
                    j--;
                }

                arr[j + 1] = key;
                sorted.add(i);
                steps.push({
                    type: 'set',
                    indices: [j + 1],
                    values: arr.slice(),
                    sorted: Array.from(sorted),
                    description: `将 ${key} 插入到位置 ${j + 1}`
                });
            }

            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '插入排序完成！时间复杂度 O(n²)，最好情况 O(n)'
            });

            return steps;
        },

        /**
         * Generate merge sort animation steps
         */
        mergeSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set();

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '开始归并排序：分治法，递归地拆分数组再合并'
            });

            function merge(start, mid, end) {
                const left = arr.slice(start, mid + 1);
                const right = arr.slice(mid + 1, end + 1);
                let i = 0, j = 0, k = start;

                steps.push({
                    type: 'highlight',
                    indices: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                    values: arr.slice(),
                    description: `合并子数组 [${start}..${end}]，左半 [${start}..${mid}]，右半 [${mid + 1}..${end}]`
                });

                while (i < left.length && j < right.length) {
                    steps.push({
                        type: 'compare',
                        indices: [start + i, mid + 1 + j],
                        values: arr.slice(),
                        description: `比较左[${i}]=${left[i]} 和 右[${j}]=${right[j]}`
                    });

                    if (left[i] <= right[j]) {
                        arr[k] = left[i];
                        steps.push({
                            type: 'set',
                            indices: [k],
                            values: arr.slice(),
                            sorted: [],
                            description: `将左[${i}]=${left[i]} 放入位置 ${k}`
                        });
                        i++;
                    } else {
                        arr[k] = right[j];
                        steps.push({
                            type: 'set',
                            indices: [k],
                            values: arr.slice(),
                            sorted: [],
                            description: `将右[${j}]=${right[j]} 放入位置 ${k}`
                        });
                        j++;
                    }
                    k++;
                }

                while (i < left.length) {
                    arr[k] = left[i];
                    steps.push({
                        type: 'set',
                        indices: [k],
                        values: arr.slice(),
                        sorted: [],
                        description: `将剩余左[${i}]=${left[i]} 放入位置 ${k}`
                    });
                    i++; k++;
                }

                while (j < right.length) {
                    arr[k] = right[j];
                    steps.push({
                        type: 'set',
                        indices: [k],
                        values: arr.slice(),
                        sorted: [],
                        description: `将剩余右[${j}]=${right[j]} 放入位置 ${k}`
                    });
                    j++; k++;
                }
            }

            function mergeSortHelper(start, end) {
                if (start >= end) return;
                const mid = Math.floor((start + end) / 2);
                mergeSortHelper(start, mid);
                mergeSortHelper(mid + 1, end);
                merge(start, mid, end);
            }

            mergeSortHelper(0, arr.length - 1);

            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '归并排序完成！时间复杂度 O(n log n)'
            });

            return steps;
        },

        /**
         * Generate quick sort animation steps
         */
        quickSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set();

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '开始快速排序：选择基准元素，将小于基准的放左边，大于的放右边'
            });

            function partition(low, high) {
                const pivot = arr[high];
                steps.push({
                    type: 'highlight',
                    indices: [high],
                    values: arr.slice(),
                    description: `选择基准元素 pivot = arr[${high}] = ${pivot}`
                });

                let i = low - 1;

                for (let j = low; j < high; j++) {
                    steps.push({
                        type: 'compare',
                        indices: [j, high],
                        values: arr.slice(),
                        description: `比较 arr[${j}]=${arr[j]} 和 pivot=${pivot}`
                    });

                    if (arr[j] < pivot) {
                        i++;
                        if (i !== j) {
                            [arr[i], arr[j]] = [arr[j], arr[i]];
                            steps.push({
                                type: 'swap',
                                indices: [i, j],
                                values: arr.slice(),
                                description: `${arr[j]} < pivot，交换 arr[${i}] 和 arr[${j}]`
                            });
                        }
                    }
                }

                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                steps.push({
                    type: 'swap',
                    indices: [i + 1, high],
                    values: arr.slice(),
                    description: `将基准元素放到位置 ${i + 1}`
                });

                sorted.add(i + 1);
                return i + 1;
            }

            function quickSortHelper(low, high) {
                if (low >= high) {
                    if (low === high) {
                        sorted.add(low);
                    }
                    return;
                }
                const pi = partition(low, high);
                quickSortHelper(low, pi - 1);
                quickSortHelper(pi + 1, high);
            }

            quickSortHelper(0, arr.length - 1);

            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '快速排序完成！平均时间复杂度 O(n log n)，最坏 O(n²)'
            });

            return steps;
        },

        /**
         * Generate heap sort animation steps
         */
        heapSort(data) {
            const arr = data.slice();
            const steps = [];
            const sorted = new Set();

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '开始堆排序：先构建最大堆，再逐个取出堆顶元素'
            });

            function heapify(n, i) {
                let largest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;

                if (left < n) {
                    steps.push({
                        type: 'compare',
                        indices: [left, largest],
                        values: arr.slice(),
                        description: `比较左子节点 arr[${left}]=${arr[left]} 和当前最大 arr[${largest}]=${arr[largest]}`
                    });
                    if (arr[left] > arr[largest]) largest = left;
                }

                if (right < n) {
                    steps.push({
                        type: 'compare',
                        indices: [right, largest],
                        values: arr.slice(),
                        description: `比较右子节点 arr[${right}]=${arr[right]} 和当前最大 arr[${largest}]=${arr[largest]}`
                    });
                    if (arr[right] > arr[largest]) largest = right;
                }

                if (largest !== i) {
                    [arr[i], arr[largest]] = [arr[largest], arr[i]];
                    steps.push({
                        type: 'swap',
                        indices: [i, largest],
                        values: arr.slice(),
                        description: `交换 arr[${i}] 和 arr[${largest}]，维护堆性质`
                    });
                    heapify(n, largest);
                }
            }

            // Build max heap
            const n = arr.length;
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                steps.push({
                    type: 'highlight',
                    indices: [i],
                    values: arr.slice(),
                    description: `构建最大堆：对节点 ${i} 进行堆化`
                });
                heapify(n, i);
            }

            steps.push({
                type: 'highlight',
                indices: [],
                values: arr.slice(),
                description: '最大堆构建完成，开始排序'
            });

            // Extract elements one by one
            for (let i = n - 1; i > 0; i--) {
                [arr[0], arr[i]] = [arr[i], arr[0]];
                steps.push({
                    type: 'swap',
                    indices: [0, i],
                    values: arr.slice(),
                    description: `将堆顶 ${arr[i]} 与末尾 ${arr[0]} 交换`
                });

                sorted.add(i);
                steps.push({
                    type: 'set',
                    indices: [],
                    values: arr.slice(),
                    sorted: Array.from(sorted),
                    description: `arr[${i}]=${arr[i]} 已排序就位`
                });

                heapify(i, 0);
            }

            sorted.add(0);
            for (let i = 0; i < arr.length; i++) sorted.add(i);
            steps.push({
                type: 'set',
                indices: [],
                values: arr.slice(),
                sorted: Array.from(sorted),
                description: '堆排序完成！时间复杂度 O(n log n)'
            });

            return steps;
        },

        /**
         * Get color map for current step state
         */
        getColorMap(step, dataLength) {
            const map = {};
            const sorted = new Set(step.sorted || []);
            const comparing = new Set(step.indices || []);

            for (let i = 0; i < dataLength; i++) {
                if (step.type === 'swap' && (step.indices || []).includes(i)) {
                    map[i] = COLORS.swapping;
                } else if (step.type === 'compare' && (step.indices || []).includes(i)) {
                    map[i] = COLORS.comparing;
                } else if (sorted.has(i)) {
                    map[i] = COLORS.sorted;
                } else {
                    map[i] = COLORS.default;
                }
            }
            return map;
        }
    };

    window.SortViz = SortViz;
})();
