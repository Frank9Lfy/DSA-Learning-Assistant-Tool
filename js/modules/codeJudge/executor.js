/* ========================================
   executor.js - Code execution via public APIs
   主通道：Piston API（emkc.org）
   回退通道：Godbolt (Compiler Explorer) 公共执行 API
   ── 2026-02 起 emkc 公共 API 改为白名单制（execute 返回 401），
   ── 因此请求失败时自动切换到 Godbolt，对上层透明。
   ======================================== */

const CodeExecutor = (() => {
  const PISTON_API = 'https://emkc.org/api/v2/piston/execute';
  const RUNTIMES_API = 'https://emkc.org/api/v2/piston/runtimes';
  const GODBOLT_API = 'https://godbolt.org/api/compiler/g122/compile'; // GCC 12.2, C++17

  /**
   * Execute code (auto fallback: Piston → Godbolt)
   * @param {string} code - Source code
   * @param {string} stdin - Standard input
   * @param {string} language - Language (default: cpp)
   * @returns {Promise<Object>} Execution result
   */
  async function execute(code, stdin = '', language = 'cpp') {
    if (language !== 'cpp') language = 'cpp';

    // ── 通道 1：Piston ──
    const piston = await executeViaPiston(code, stdin);
    // 返回 null 表示"此通道不可用"（认证/限流/服务端/网络问题），走回退；
    // 若代码真的被执行了（哪怕编译错误/运行错误），直接返回其结果。
    if (piston) return piston;

    // ── 通道 2：Godbolt ──
    return executeViaGodbolt(code, stdin);
  }

  // ─── Piston 通道 ────────────────────────────────────────────────
  async function executeViaPiston(code, stdin) {
    const payload = {
      language: 'cpp',
      version: '10.2.0',
      files: [{ name: 'main.cpp', content: code }],
      stdin: stdin,
      compile_timeout: 10000,
      run_timeout: 5000,
    };

    try {
      const response = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('[Executor] Piston 需要白名单/API Key（HTTP ' + response.status + '），自动切换 Godbolt。');
        } else if (response.status === 429) {
          console.warn('[Executor] Piston 限流（HTTP 429），自动切换 Godbolt。');
        } else {
          console.warn('[Executor] Piston HTTP ' + response.status + '，自动切换 Godbolt。');
        }
        return null; // 触发回退
      }

      const data = await response.json();
      return {
        stdout: data.run?.stdout || '',
        stderr: data.run?.stderr || '',
        code: data.run?.code || 0,
        signal: data.run?.signal || null,
        output: data.run?.output || '',
        compileError: data.compile?.stderr || '',
        success: !data.compile?.stderr && data.run?.code === 0,
        engine: 'piston',
      };
    } catch (error) {
      console.warn('[Executor] Piston 网络失败，自动切换 Godbolt：', error.message);
      return null;
    }
  }

  // ─── Godbolt 通道 ───────────────────────────────────────────────
  async function executeViaGodbolt(code, stdin) {
    const payload = {
      source: code,
      compiler: 'g122',
      lang: 'c++',
      options: {
        userArguments: '-O2 -std=c++17',
        executeParameters: { args: [], stdin: stdin },
        compilerOptions: { executorRequest: true, skipAsm: true },
        filters: { execute: true },
      },
      allowStoreCodeDebug: false,
    };

    try {
      const response = await fetch(GODBOLT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = response.status === 429
          ? 'Godbolt 请求过于频繁 (HTTP 429)，请稍后再试。'
          : 'Godbolt 服务错误 (HTTP ' + response.status + ')，请稍后重试。';
        return failed(errText);
      }

      const data = await response.json();
      // Godbolt 的诊断输出带 ANSI 颜色码，展示前清洗掉
      const joinLines = (arr) => (arr || [])
        .map(l => l.text || '')
        .join('\n')
        .replace(/\u001b\[[0-9;]*m/g, '');

      const compileError = data.buildResult && data.buildResult.code !== 0
        ? joinLines(data.buildResult.stderr) || '编译失败'
        : '';

      const exitCode = data.code || 0;
      const stdout = joinLines(data.stdout);
      const stderr = joinLines(data.stderr);

      return {
        stdout,
        stderr,
        code: data.didExecute ? exitCode : -1,
        signal: data.timedOut ? 'TIMEOUT' : null,
        output: stdout,
        compileError,
        success: !compileError && data.didExecute && exitCode === 0,
        engine: 'godbolt',
        // 程序在服务器上的真实执行时间（不含编译与网络传输）
        execTimeMs: typeof data.execTime === 'number' ? Math.round(data.execTime) : null,
      };
    } catch (error) {
      console.error('[Executor] Godbolt 也失败了：', error.message);
      return failed(
        '代码执行服务不可用。\n\n' +
        '两个执行通道（Piston / Godbolt）都无法访问，请检查网络连接后重试。\n' +
        '也可以将代码复制到 https://www.onlinegdb.com 手动运行。'
      );
    }
  }

  function failed(message) {
    return {
      stdout: '',
      stderr: message,
      code: -1,
      signal: null,
      output: '',
      compileError: '',
      success: false,
      error: message,
    };
  }

  /**
   * Check if at least one execution channel is available
   * @returns {Promise<boolean>}
   */
  async function isAvailable() {
    try {
      const response = await fetch(RUNTIMES_API, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) return true;
    } catch (error) { /* Piston 不可达，继续探测 Godbolt */ }
    try {
      const response = await fetch('https://godbolt.org/api/compilers/c%2B%2B', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.warn('No execution backend available:', error);
      return false;
    }
  }

  /**
   * Execute with timeout protection
   */
  async function executeWithTimeout(code, stdin = '', language = 'cpp', timeoutMs = 20000) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('执行超时 (' + timeoutMs + 'ms)')), timeoutMs);
    });

    try {
      return await Promise.race([execute(code, stdin, language), timeoutPromise]);
    } catch (error) {
      return {
        stdout: '',
        stderr: error.message,
        code: -1,
        signal: 'TIMEOUT',
        output: '',
        compileError: '',
        success: false,
        error: error.message,
      };
    }
  }

  return {
    execute,
    isAvailable,
    executeWithTimeout,
  };
})();
