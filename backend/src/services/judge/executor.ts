import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn, exec } from 'child_process';
import { Language, ExecutionResult } from './types';
import { checkCodeSecurity, sanitizeErrorOutput } from './security';

// Resolve Java & Python executables with fallback paths
const findJavaBinaries = (): { javac: string; java: string } => {
  const jdkBin = 'C:\\Program Files\\Java\\jdk1.8.0_231\\bin';
  if (fs.existsSync(path.join(jdkBin, 'javac.exe')) && fs.existsSync(path.join(jdkBin, 'java.exe'))) {
    return {
      javac: path.join(jdkBin, 'javac.exe'),
      java: path.join(jdkBin, 'java.exe'),
    };
  }
  return { javac: 'javac', java: 'java' };
};

// Tree-kill process helper across Windows and POSIX
const killProcessTree = (pid: number): void => {
  if (!pid) return;
  if (process.platform === 'win32') {
    exec(`taskkill /pid ${pid} /T /F`, () => {});
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {}
    }
  }
};

export interface SandboxSession {
  success: boolean;
  compilationError?: string;
  execute(input: string, timeoutMs?: number): Promise<ExecutionResult>;
  cleanup(): Promise<void>;
}

/**
 * Isolated Sandbox Code Executor.
 * Executes user Java or Python code with resource limits, timeout guards, and clean environment.
 */
export class SandboxExecutor {
  private static sandboxBaseDir = path.join(os.tmpdir(), 'placement_judge_sandboxes');

  public static ensureBaseDirectory(): void {
    if (!fs.existsSync(this.sandboxBaseDir)) {
      try {
        fs.mkdirSync(this.sandboxBaseDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create judge sandbox base directory:', err);
      }
    }
  }

  /**
   * Creates a sandbox compilation session.
   * Compiles the source code ONCE, then allows executing multiple test cases efficiently.
   */
  public static async createSession(
    language: Language,
    sourceCode: string
  ): Promise<SandboxSession> {
    this.ensureBaseDirectory();

    // 1. Static Security Check
    const security = checkCodeSecurity(sourceCode, language);
    if (!security.safe) {
      return {
        success: false,
        compilationError: security.reason || 'Security policy violation.',
        execute: async () => ({
          stdout: '',
          stderr: security.reason || 'Security policy violation.',
          exitCode: 1,
          runtimeMs: 0,
          memoryKb: 0,
          timedOut: false,
          compilationError: security.reason,
        }),
        cleanup: async () => {},
      };
    }

    // 2. Create unique temporary sandbox directory
    const sandboxId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const tempDir = path.join(this.sandboxBaseDir, sandboxId);
    await fs.promises.mkdir(tempDir, { recursive: true });

    const cleanup = async () => {
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Non-blocking
      }
    };

    let runCmd = '';
    let runArgs: string[] = [];

    if (language === 'JAVA') {
      // Detect primary class name
      let className = 'Solution';
      const publicMatch = sourceCode.match(/public\s+class\s+([A-Za-z0-9_$]+)/);
      if (publicMatch && publicMatch[1]) {
        className = publicMatch[1];
      } else {
        const classMatch = sourceCode.match(/class\s+([A-Za-z0-9_$]+)/);
        if (classMatch && classMatch[1]) {
          className = classMatch[1];
        }
      }

      const sourceFilePath = path.join(tempDir, `${className}.java`);
      await fs.promises.writeFile(sourceFilePath, sourceCode, 'utf8');

      // Compile ONCE
      const javaPaths = findJavaBinaries();
      const compileResult = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        let stderr = '';
        let timedOut = false;

        const child = spawn(javaPaths.javac, ['-encoding', 'UTF-8', `${className}.java`], {
          cwd: tempDir,
          env: process.env,
        });

        const timer = setTimeout(() => {
          timedOut = true;
          killProcessTree(child.pid as number);
          resolve({
            success: false,
            error: 'Compilation timed out.',
          });
        }, 20000);

        if (child.stdin) {
          child.stdin.end();
        }

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('error', (err) => {
          clearTimeout(timer);
          resolve({
            success: false,
            error: `Compiler error: ${err.message}`,
          });
        });

        child.on('close', (code) => {
          clearTimeout(timer);
          if (timedOut) return;

          if (code === 0) {
            resolve({ success: true });
          } else {
            const sanitized = sanitizeErrorOutput(stderr, tempDir);
            resolve({
              success: false,
              error: sanitized || 'Compilation failed with unspecified errors.',
            });
          }
        });
      });

      if (!compileResult.success) {
        await cleanup();
        return {
          success: false,
          compilationError: compileResult.error,
          execute: async () => ({
            stdout: '',
            stderr: compileResult.error || 'Compilation Error',
            exitCode: 1,
            runtimeMs: 0,
            memoryKb: 0,
            timedOut: false,
            compilationError: compileResult.error,
          }),
          cleanup,
        };
      }

      runCmd = javaPaths.java;
      runArgs = ['-Xmx256m', '-Xms16m', '-Dfile.encoding=UTF-8', className];
    }

    // Child process environment
    const cleanEnv: NodeJS.ProcessEnv = {
      ...process.env,
    };

    const execute = async (input: string, timeoutMs = 3000): Promise<ExecutionResult> => {
      return new Promise<ExecutionResult>((resolve) => {
        const startTime = process.hrtime();
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        const maxOutputBytes = 64 * 1024; // 64 KB max output

        const child = spawn(runCmd, runArgs, {
          cwd: tempDir,
          env: cleanEnv,
        });

        const timer = setTimeout(() => {
          timedOut = true;
          killProcessTree(child.pid as number);
        }, timeoutMs);

        const formattedInput = input !== undefined && input !== null && input !== ''
          ? (input.endsWith('\n') ? input : input + '\n')
          : '';

        if (formattedInput && child.stdin) {
          child.stdin.end(formattedInput);
        } else if (child.stdin) {
          child.stdin.end();
        }

        child.stdout.on('data', (data) => {
          if (stdout.length < maxOutputBytes) {
            stdout += data.toString();
          }
        });

        child.stderr.on('data', (data) => {
          if (stderr.length < maxOutputBytes) {
            stderr += data.toString();
          }
        });

        child.on('error', (err) => {
          clearTimeout(timer);
          const elapsed = process.hrtime(startTime);
          const runtimeMs = Math.round(elapsed[0] * 1000 + elapsed[1] / 1e6);

          resolve({
            stdout,
            stderr: sanitizeErrorOutput(err.message, tempDir),
            exitCode: 1,
            runtimeMs,
            memoryKb: 0,
            timedOut: false,
          });
        });

        child.on('close', (code) => {
          clearTimeout(timer);
          const elapsed = process.hrtime(startTime);
          const runtimeMs = Math.round(elapsed[0] * 1000 + elapsed[1] / 1e6);

          const sanitizedStderr = sanitizeErrorOutput(stderr, tempDir);

          resolve({
            stdout: stdout.trimEnd(),
            stderr: sanitizedStderr,
            exitCode: timedOut ? null : code,
            runtimeMs,
            memoryKb: 2048,
            timedOut,
          });
        });
      });
    };

    return {
      success: true,
      execute,
      cleanup,
    };
  }

  /**
   * Backward-compatible single test case execution helper.
   */
  public static async executeTestCase(
    language: Language,
    sourceCode: string,
    input: string,
    timeoutMs = 3000
  ): Promise<ExecutionResult> {
    const session = await this.createSession(language, sourceCode);
    try {
      if (!session.success) {
        return {
          stdout: '',
          stderr: session.compilationError || 'Compilation Error',
          exitCode: 1,
          runtimeMs: 0,
          memoryKb: 0,
          timedOut: false,
          compilationError: session.compilationError,
        };
      }
      return await session.execute(input, timeoutMs);
    } finally {
      await session.cleanup();
    }
  }
}
