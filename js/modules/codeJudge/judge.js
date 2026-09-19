/* ========================================
   judge.js - Test case judging logic
   Runs code against test cases and compares output
   ======================================== */

const CodeJudge = (() => {

  /**
   * Run all test cases against the code.
   * 各用例**并行**请求执行服务（总耗时≈最慢的一个，而非逐个累加）；
   * 若因限流（429）失败，对失败用例串行重试一次。
   * @param {string} code - Source code
   * @param {Array} testCases - [{stdin, expected}]
   * @returns {Promise<Array>} Array of TestResult objects
   */
  async function runTests(code, testCases) {
    if (!testCases || testCases.length === 0) {
      return [];
    }

    const runOne = async (testCase, index) => {
      const startTime = performance.now();
      try {
        const execResult = await CodeExecutor.execute(code, testCase.stdin, 'cpp');
        const elapsed = performance.now() - startTime;

        if (execResult.compileError) {
          return {
            index: index, passed: false, stdin: testCase.stdin,
            expected: testCase.expected, actual: '',
            error: '编译错误: ' + execResult.compileError,
            time: elapsed, execMs: execResult.execTimeMs || null,
            type: 'compile_error'
          };
        }
        if (execResult.code !== 0) {
          return {
            index: index, passed: false, stdin: testCase.stdin,
            expected: testCase.expected, actual: execResult.stdout,
            error: execResult.stderr || '运行时错误 (exit code: ' + execResult.code + ')',
            time: elapsed, execMs: execResult.execTimeMs || null,
            type: 'runtime_error'
          };
        }
        const actualOutput = execResult.stdout;
        const passed = compareOutput(testCase.expected, actualOutput);
        return {
          index: index, passed: passed, stdin: testCase.stdin,
          expected: testCase.expected, actual: actualOutput,
          error: passed ? '' : '输出不匹配',
          time: elapsed, execMs: execResult.execTimeMs || null,
          type: passed ? 'passed' : 'wrong_answer'
        };
      } catch (error) {
        const elapsed = performance.now() - startTime;
        return {
          index: index, passed: false, stdin: testCase.stdin,
          expected: testCase.expected, actual: '',
          error: '执行失败: ' + error.message,
          time: elapsed, execMs: null, type: 'error'
        };
      }
    };

    // 第一轮：并行
    let results = await Promise.all(testCases.map(runOne));

    // 限流重试：对因 429/频繁 失败的用例串行重试一次
    const throttled = results.filter(r => r.type === 'error' && /频繁|429/.test(r.error));
    if (throttled.length > 0) {
      for (const r of throttled) {
        const retry = await runOne(testCases[r.index], r.index);
        Object.assign(r, retry);
      }
    }

    return results;
  }

  /**
   * Compare expected and actual output
   * Trims whitespace, normalizes line endings, handles trailing newlines
   * @param {string} expected - Expected output
   * @param {string} actual - Actual output
   * @returns {boolean}
   */
  function compareOutput(expected, actual) {
    if (expected === actual) return true;

    // Normalize line endings and trim
    const normalize = (str) => {
      return str
        .replace(/\r\n/g, '\n')       // Windows -> Unix
        .replace(/\r/g, '\n')          // Old Mac -> Unix
        .replace(/[ \t]+$/gm, '')      // Trim trailing spaces per line
        .replace(/\n+$/, '\n')         // Normalize trailing newlines
        .replace(/^\n+/, '')           // Trim leading blank lines
        .trim();
    };

    return normalize(expected) === normalize(actual);
  }

  /**
   * Generate summary report from test results
   * @param {Array} results - Array of TestResult objects
   * @returns {Object} Report object
   */
  function generateReport(results) {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    const allPassed = passed === total && total > 0;

    // Categorize failures
    const compileErrors = results.filter(r => r.type === 'compile_error').length;
    const runtimeErrors = results.filter(r => r.type === 'runtime_error').length;
    const wrongAnswers = results.filter(r => r.type === 'wrong_answer').length;

    // Average execution time
    const avgTime = total > 0
      ? Math.round(results.reduce((sum, r) => sum + r.time, 0) / total)
      : 0;

    // 程序在服务器上的真实执行时间均值（Godbolt 引擎提供；不含编译与网络）
    const execTimes = results.map(r => r.execMs).filter(t => typeof t === 'number');
    const avgExec = execTimes.length === total && total > 0
      ? Math.round(execTimes.reduce((s, t) => s + t, 0) / total)
      : (execTimes.length ? Math.round(execTimes.reduce((s, t) => s + t, 0) / execTimes.length) : null);

    return {
      passed,
      total,
      score,
      allPassed,
      compileErrors,
      runtimeErrors,
      wrongAnswers,
      avgTime,
      avgExec
    };
  }

  return {
    runTests,
    compareOutput,
    generateReport
  };
})();
