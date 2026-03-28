import { Worker } from 'worker_threads';
import { join } from 'path';
import { existsSync } from 'fs';
import { PLUGINS_DIR } from '../system/health-monitor';
import { EventEmitter } from 'events';
import PQueue from 'p-queue';

export interface PluginExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTimeMs?: number;
}

// Task 49: Task Queue System (Custom in-memory)
// Membatasi concurrency maksimal 5 eksekusi plugin bersamaan
const executionQueue = new PQueue({ concurrency: 5 });

// Task 51 (Preparation): Event emitter untuk IPC / pubsub
export const OmniEventBus = new EventEmitter();

// Setup the absolute path to the worker script
const workerScriptPath = join(process.cwd(), 'src/modules/plugin-engine/backend/sandbox-worker.js');

/**
 * Task 41-47: Execute a plugin in a separate thread.
 */
export async function executePluginTask(
  pluginId: string, 
  action: string, 
  payload: any, 
  onProgress?: (progress: number) => void
): Promise<PluginExecutionResult> {
  return executionQueue.add(async () => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const pluginDir = join(PLUGINS_DIR, pluginId);

      // Verify directory exists
      if (!existsSync(pluginDir)) {
        return resolve({ success: false, error: 'Plugin folder missing or uninstalled' });
      }

      // Task 41: Setup Node.js worker_threads
      // Task 46: Memory Limit Enforcer (V8 Heap) -> execArgv
      const worker = new Worker(workerScriptPath, {
        execArgv: ['--max-old-space-size=256'], // Batasi RAM ~256MB
        workerData: {
          pluginDir,
          action,
          payload
        }
      });

      // Task 45, 66: Execution Timeout Manager (Watchdog 10s)
      const timeoutId = setTimeout(() => {
        worker.terminate();
        resolve({
          success: false,
          error: 'Execution Timeout: Plugin running longer than 10 seconds',
          executionTimeMs: Date.now() - startTime
        });
      }, 10 * 1000); // 10 detik

      // Task 44 & 50: IPC Manager & Progress Emitter
      // Task 69: Audit, Task 68: DB Set/Get
      worker.on('message', async (message) => {
        if (message.type === 'progress' && onProgress) {
          onProgress(message.value);
        } else if (message.type === 'audit') {
          // Dyn-import to avoid circular
          const { logPluginAudit } = await import('../security/plugin-security');
          logPluginAudit(pluginId, message.action, message.details);
        } else if (message.type === 'db_set') {
          const { pluginDb } = await import('@/lib/db');
          await pluginDb.run(
            'INSERT INTO plugin_permissions (plugin_id, user_id, granted_scopes) VALUES ($1, $2, $3) ON CONFLICT (plugin_id, user_id) DO UPDATE SET granted_scopes = EXCLUDED.granted_scopes',
            [pluginId, 'system-admin', JSON.stringify({ [message.key]: message.value })]
          );
        } else if (message.type === 'db_get') {
          // Placeholder implementation mapping to generic scopes for plugin storage
          worker.postMessage({ type: 'db_get_result', reqId: message.reqId, value: null });
        } else if (message.type === 'result') {
          clearTimeout(timeoutId);
          resolve({
            success: true,
            data: message.data,
            executionTimeMs: Date.now() - startTime
          });
        } else if (message.type === 'error') {
          clearTimeout(timeoutId);
          resolve({
            success: false,
            error: message.error,
            executionTimeMs: Date.now() - startTime
          });
        }
      });

      // Task 47: Plugin Error Boundary
      worker.on('error', (err) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          error: `Worker thread crashed: ${err.message}`,
          executionTimeMs: Date.now() - startTime
        });
      });

      worker.on('exit', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          resolve({
            success: false,
            error: `Worker stopped with exit code ${code}`,
            executionTimeMs: Date.now() - startTime
          });
        }
      });
    });
  });
}
