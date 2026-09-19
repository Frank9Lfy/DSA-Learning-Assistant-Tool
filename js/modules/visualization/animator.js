/**
 * Animator - Animation Controller
 * Manages step-based animation playback with requestAnimationFrame
 */
(function () {
    'use strict';

    class Animator {
        constructor() {
            this.steps = [];
            this.currentStep = -1;
            this.isPlaying = false;
            this.speed = 1.0; // multiplier
            this._rafId = null;
            this._lastFrameTime = 0;
            this._onStepCallback = null;
            this._onCompleteCallback = null;
        }

        /**
         * Add a step to the animation sequence
         * @param {Function} fn - Rendering function to execute for this step
         * @param {string} description - Human-readable description of this step
         * @returns {Animator} this for chaining
         */
        addStep(fn, description) {
            this.steps.push({
                fn: fn,
                description: description || ''
            });
            return this;
        }

        /**
         * Set the animation speed multiplier
         * @param {number} s - Speed (0.25 to 3)
         */
        setSpeed(s) {
            this.speed = Math.max(0.25, Math.min(3, s));
        }

        /**
         * Get the interval in ms between steps based on speed
         * @private
         */
        _getInterval() {
            // Base interval: 400ms at speed 1
            return 400 / this.speed;
        }

        /**
         * Start or resume playback
         */
        play() {
            if (this.isPlaying) return;
            if (this.currentStep >= this.steps.length - 1) {
                this.reset();
            }
            this.isPlaying = true;
            this._lastFrameTime = performance.now();
            this._tick();
        }

        /**
         * Pause playback
         */
        pause() {
            this.isPlaying = false;
            if (this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }

        /**
         * Internal animation loop using requestAnimationFrame
         * @private
         */
        _tick() {
            if (!this.isPlaying) return;

            const now = performance.now();
            const elapsed = now - this._lastFrameTime;
            const interval = this._getInterval();

            if (elapsed >= interval) {
                this._lastFrameTime = now - (elapsed - interval);
                if (!this.next()) {
                    this.pause();
                    if (this._onCompleteCallback) {
                        this._onCompleteCallback();
                    }
                    return;
                }
            }

            this._rafId = requestAnimationFrame(() => this._tick());
        }

        /**
         * Advance to the next step
         * @returns {boolean} true if advanced, false if at end
         */
        next() {
            if (this.currentStep >= this.steps.length - 1) {
                return false;
            }
            this.currentStep++;
            this.runStep();
            return true;
        }

        /**
         * Go back to the previous step
         * @returns {boolean} true if went back, false if at beginning
         */
        prev() {
            if (this.currentStep <= 0) {
                return false;
            }
            this.currentStep--;
            this.runStep();
            return true;
        }

        /**
         * Reset animation to the beginning
         */
        reset() {
            this.pause();
            this.currentStep = -1;
            if (this.steps.length > 0) {
                this.currentStep = 0;
                this.runStep();
            }
        }

        /**
         * Execute the current step's render function
         */
        runStep() {
            if (this.currentStep < 0 || this.currentStep >= this.steps.length) return;
            const step = this.steps[this.currentStep];
            if (step && typeof step.fn === 'function') {
                step.fn();
            }
            if (this._onStepCallback) {
                this._onStepCallback(this.currentStep, step);
            }
        }

        /**
         * Register callback for step changes
         * @param {Function} fn - callback(stepIndex, step)
         */
        onStep(fn) {
            this._onStepCallback = fn;
        }

        /**
         * Register callback for animation completion
         * @param {Function} fn - callback()
         */
        onComplete(fn) {
            this._onCompleteCallback = fn;
        }

        /**
         * Get the current step's description
         * @returns {string}
         */
        getDescription() {
            if (this.currentStep >= 0 && this.currentStep < this.steps.length) {
                return this.steps[this.currentStep].description;
            }
            return '';
        }

        /**
         * Get total number of steps
         * @returns {number}
         */
        getTotalSteps() {
            return this.steps.length;
        }

        /**
         * Clear all steps and reset state
         */
        clear() {
            this.pause();
            this.steps = [];
            this.currentStep = -1;
        }

        /**
         * Load a pre-built array of steps
         * @param {Array} stepsArr - Array of {fn, description} objects
         */
        loadSteps(stepsArr) {
            this.clear();
            this.steps = stepsArr;
            if (this.steps.length > 0) {
                this.currentStep = 0;
                this.runStep();
            }
        }
    }

    // Export as global
    window.Animator = Animator;
})();
