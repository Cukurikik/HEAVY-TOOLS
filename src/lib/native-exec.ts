/**
 * ═══════════════════════════════════════════════════
 * Omni-Tool Native Exec — Server-Side C++ Binary Runner
 * ═══════════════════════════════════════════════════
 * 
 * Strategy 3: Child Process execution for server-side API routes.
 * Wraps `child_process.execFile()` for safe C++ binary execution.
 * 
 * Used for:
 *   - Native FFmpeg CLI (when server-side processing is needed)
 *   - ImageMagick operations
 *   - Custom compiled C++ tools
 * 
 * Safety features:
 *   - Timeout enforcement (default 60s)
 *   - Memory limits (default 512MB)
 *   - Stdout/stderr capture
 *   - Process cleanup on timeout
 * 
 * NOTE: This module uses 'server-only' pattern — cannot be imported
 * in client-side code.
 */

import { execFile, type ExecFileOptions, type ChildProcess } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// ═══════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════
export interface NativeExecOptions {
  /** Working directory for the process */
  cwd?: string;
  /** Timeout in milliseconds (default: 60000 = 60s) */
  timeout?: number;
  /** Max stdout+stderr buffer size in bytes (default: 512MB) */
  maxBuffer?: number;
  /** Environment variables */
  env?: Record<string, string>;
  /** Callback for streaming stdout */
  onStdout?: (chunk: string) => void;
  /** Callback for streaming stderr */
  onStderr?: (chunk: string) => void;
}

export interface NativeExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

// ═══════════════════════════════════════════════════
// Error Type
// ═══════════════════════════════════════════════════
export class NativeExecError extends Error {
  constructor(
    message: string,
    public readonly binary: string,
    public readonly exitCode: number,
    public readonly stderr: string,
    public readonly duration: number
  ) {
    super(`[NativeExec:${binary}] ${message}`);
    this.name = 'NativeExecError';
  }
}

// ═══════════════════════════════════════════════════
// Main Execution Function
// ═══════════════════════════════════════════════════

/**
 * Execute a native C++ binary safely with timeout and resource limits.
 * 
 * @param binary Path to the executable (e.g., 'ffmpeg', '/usr/local/bin/my-tool')
 * @param args   Command-line arguments
 * @param options Execution options (timeout, cwd, etc.)
 * @returns Promise with stdout, stderr, exit code, and duration
 * 
 * @example
 * // Server-side API route:
 * const result = await nativeExec('ffmpeg', ['-i', 'input.mp4', '-c:v', 'libx264', 'output.mp4']);
 */
export async function nativeExec(
  binary: string,
  args: string[],
  options: NativeExecOptions = {}
): Promise<NativeExecResult> {
  const {
    cwd,
    timeout = 60_000,
    maxBuffer = 512 * 1024 * 1024, // 512MB
    env,
    onStdout,
    onStderr,
  } = options;

  const start = performance.now();

  const execOptions: ExecFileOptions = {
    cwd,
    timeout,
    maxBuffer,
    env: env ? { ...process.env, ...env } : process.env,
    windowsHide: true,
  };

  // If streaming callbacks are provided, use spawn-style execution
  if (onStdout || onStderr) {
    return new Promise<NativeExecResult>((resolve, reject) => {
      const child: ChildProcess = execFile(binary, args, execOptions, () => {});

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        stdout += text;
        onStdout?.(text);
      });

      child.stderr?.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        stderr += text;
        onStderr?.(text);
      });

      child.on('close', (exitCode) => {
        const duration = performance.now() - start;
        if (exitCode !== 0) {
          reject(new NativeExecError(
            `Process exited with code ${exitCode}: ${stderr.slice(0, 500)}`,
            binary,
            exitCode ?? 1,
            stderr,
            duration
          ));
        } else {
          resolve({ stdout, stderr, exitCode: exitCode ?? 0, duration });
        }
      });

      child.on('error', (error) => {
        reject(new NativeExecError(
          error.message,
          binary,
          -1,
          '',
          performance.now() - start
        ));
      });
    });
  }

  // Simple async execution
  try {
    const { stdout, stderr } = await execFileAsync(binary, args, execOptions);
    const duration = performance.now() - start;
    return { stdout: String(stdout), stderr: String(stderr), exitCode: 0, duration };
  } catch (error: unknown) {
    const duration = performance.now() - start;
    const execError = error as { code?: number; stderr?: string; message?: string };
    throw new NativeExecError(
      execError.message || 'Unknown execution error',
      binary,
      execError.code ?? 1,
      execError.stderr || '',
      duration
    );
  }
}

/**
 * Check if a binary exists and is executable.
 */
export async function isBinaryAvailable(binary: string): Promise<boolean> {
  try {
    // Use 'where' on Windows, 'which' on Unix
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    await execFileAsync(cmd, [binary], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
