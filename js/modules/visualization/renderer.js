/**
 * VizRenderer - Canvas 2D Rendering Engine
 * High-DPI aware rendering with clean primitives
 */
(function () {
    'use strict';

    class VizRenderer {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.dpr = window.devicePixelRatio || 1;
            this.width = 0;
            this.height = 0;
            this.backgroundColor = '#ffffff';
        }

        /**
         * Initialize renderer with a canvas element
         * @param {HTMLCanvasElement|string} canvas - Canvas element or its ID
         */
        init(canvas) {
            if (typeof canvas === 'string') {
                this.canvas = document.getElementById(canvas);
            } else {
                this.canvas = canvas;
            }
            if (!this.canvas) {
                console.error('VizRenderer: canvas element not found');
                return;
            }
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this._bindResize();
        }

        /**
         * Bind window resize listener for responsive canvas
         * @private
         */
        _bindResize() {
            this._resizeHandler = () => this.resize();
            window.addEventListener('resize', this._resizeHandler);
        }

        /**
         * Resize canvas to fit container, handling high-DPI displays
         */
        resize() {
            if (!this.canvas) return;
            const parent = this.canvas.parentElement;
            const rect = parent.getBoundingClientRect();
            this.dpr = window.devicePixelRatio || 1;
            this.width = rect.width;
            this.height = rect.height;

            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';

            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        /**
         * Clear the canvas with background color
         */
        clear() {
            if (!this.ctx) return;
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        /**
         * Draw a rectangle with optional text
         */
        drawRect(x, y, w, h, color, text) {
            const ctx = this.ctx;
            ctx.fillStyle = color || '#4a90d9';
            ctx.fillRect(x, y, w, h);

            // Subtle border
            ctx.strokeStyle = this._darken(color || '#4a90d9', 0.15);
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);

            if (text !== undefined && text !== null && text !== '') {
                const fontSize = Math.min(14, Math.max(10, h * 0.35));
                ctx.fillStyle = '#333';
                ctx.font = `600 ${fontSize}px "Segoe UI", Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(text), x + w / 2, y + h / 2);
            }
        }

        /**
         * Draw a circle with optional text
         */
        drawCircle(x, y, r, color, text) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = color || '#4a90d9';
            ctx.fill();

            // Border
            ctx.strokeStyle = this._darken(color || '#4a90d9', 0.2);
            ctx.lineWidth = 2;
            ctx.stroke();

            if (text !== undefined && text !== null && text !== '') {
                const fontSize = Math.min(16, r * 0.8);
                ctx.fillStyle = '#fff';
                ctx.font = `bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(text), x, y);
            }
        }

        /**
         * Draw a line between two points
         */
        drawLine(x1, y1, x2, y2, color, width) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color || '#999';
            ctx.lineWidth = width || 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        /**
         * Draw an arrow from (x1,y1) to (x2,y2)
         */
        drawArrow(x1, y1, x2, y2, color) {
            const ctx = this.ctx;
            const headLen = 10;
            const angle = Math.atan2(y2 - y1, x2 - x1);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color || '#555';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(
                x2 - headLen * Math.cos(angle - Math.PI / 6),
                y2 - headLen * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                x2 - headLen * Math.cos(angle + Math.PI / 6),
                y2 - headLen * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = color || '#555';
            ctx.fill();
        }

        /**
         * Draw text at a position
         */
        drawText(text, x, y, color, size) {
            const ctx = this.ctx;
            ctx.fillStyle = color || '#333';
            ctx.font = `${size || 14}px "Segoe UI", Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(text), x, y);
        }

        /**
         * Draw a rounded rectangle
         */
        drawRoundedRect(x, y, w, h, radius, color, text) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();

            ctx.fillStyle = color || '#4a90d9';
            ctx.fill();
            ctx.strokeStyle = this._darken(color || '#4a90d9', 0.2);
            ctx.lineWidth = 2;
            ctx.stroke();

            if (text !== undefined && text !== null && text !== '') {
                const fontSize = Math.min(14, Math.max(10, h * 0.4));
                ctx.fillStyle = '#fff';
                ctx.font = `bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(text), x + w / 2, y + h / 2);
            }
        }

        /**
         * Darken a hex color by a factor (0-1)
         * @private
         */
        _darken(hex, factor) {
            if (!hex || hex.charAt(0) !== '#') return '#333';
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            r = Math.floor(r * (1 - factor));
            g = Math.floor(g * (1 - factor));
            b = Math.floor(b * (1 - factor));
            return `rgb(${r},${g},${b})`;
        }

        /**
         * Draw a bar chart for sorting visualization
         * @param {Array} data - Array of values
         * @param {Object} highlights - {comparing: [], swapping: [], sorted: []}
         */
        drawBars(data, highlights) {
            if (!data || data.length === 0) return;
            highlights = highlights || {};
            const comparing = new Set(highlights.comparing || []);
            const swapping = new Set(highlights.swapping || []);
            const sorted = new Set(highlights.sorted || []);
            const active = new Set(highlights.active || []);

            const padding = { top: 40, bottom: 40, left: 20, right: 20 };
            const chartW = this.width - padding.left - padding.right;
            const chartH = this.height - padding.top - padding.bottom;
            const barWidth = Math.max(4, (chartW / data.length) * 0.8);
            const gap = (chartW - barWidth * data.length) / (data.length + 1);
            const maxVal = Math.max(...data, 1);

            for (let i = 0; i < data.length; i++) {
                const barH = (data[i] / maxVal) * chartH;
                const x = padding.left + gap + i * (barWidth + gap);
                const y = padding.top + chartH - barH;

                let color = '#4a90d9'; // default blue
                if (swapping.has(i)) color = '#e74c3c'; // red
                else if (comparing.has(i)) color = '#f5a623'; // amber
                else if (sorted.has(i)) color = '#2ecc71'; // green
                else if (active.has(i)) color = '#9b59b6'; // purple

                this.drawRect(x, y, barWidth, barH, color);

                // Value label on top
                if (barWidth > 14) {
                    const fontSize = Math.min(12, barWidth * 0.6);
                    this.drawText(data[i], x + barWidth / 2, y - 12, '#333', fontSize);
                }

                // Index label at bottom
                if (gap + barWidth > 16) {
                    this.drawText(i, x + barWidth / 2, padding.top + chartH + 16, '#888', 10);
                }
            }
        }

        /**
         * Clean up event listeners
         */
        destroy() {
            if (this._resizeHandler) {
                window.removeEventListener('resize', this._resizeHandler);
            }
        }
    }

    // Export as global
    window.VizRenderer = VizRenderer;
})();
