/// <reference lib="webworker" />

/**
 * OMNI PLUGIN SANDBOX WORKER
 * 
 * Each plugin runs inside this isolated Web Worker.
 * The plugin code is injected via postMessage and executed
 * within a controlled environment with a limited API bridge.
 */

let pluginName = 'unknown';

// Handle messages from the main thread
self.addEventListener('message', async (event: MessageEvent) => {
  const msg = event.data;

  switch (msg.type) {
    case 'INIT': {
      pluginName = msg.pluginName || 'unknown';
      const allowedPermissions: string[] = msg.permissions || [];
      const code: string = msg.code;

      // Build the sandboxed API bridge based on granted permissions
      const omni: Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>> = {};

      if (allowedPermissions.includes('ui.toast')) {
        omni['ui'] = omni['ui'] || {};
        omni['ui']['toast'] = async (message: unknown) => {
          self.postMessage({ type: 'API_CALL', method: 'ui.toast', args: [message] });
        };
      }

      if (allowedPermissions.includes('ui.panel')) {
        omni['ui'] = omni['ui'] || {};
        omni['ui']['showPanel'] = async (html: unknown) => {
          self.postMessage({ type: 'API_CALL', method: 'ui.showPanel', args: [html] });
        };
      }

      if (allowedPermissions.includes('media.convert')) {
        omni['media'] = omni['media'] || {};
        omni['media']['convert'] = async (file: unknown, options: unknown) => {
          self.postMessage({ type: 'API_CALL', method: 'media.convert', args: [file, options] });
        };
      }

      if (allowedPermissions.includes('storage.read')) {
        omni['storage'] = omni['storage'] || {};
        omni['storage']['read'] = async (key: unknown) => {
          self.postMessage({ type: 'API_CALL', method: 'storage.read', args: [key] });
        };
      }

      if (allowedPermissions.includes('storage.write')) {
        omni['storage'] = omni['storage'] || {};
        omni['storage']['write'] = async (key: unknown, value: unknown) => {
          self.postMessage({ type: 'API_CALL', method: 'storage.write', args: [key, value] });
        };
      }

      if (allowedPermissions.includes('network.fetch')) {
        omni['network'] = omni['network'] || {};
        omni['network']['fetch'] = async (url: unknown)  => {
          self.postMessage({ type: 'API_CALL', method: 'network.fetch', args: [url] });
        };
      }

      // Execute plugin code in a sandboxed scope
      try {
        // Create a function wrapper with 'omni' as the only global available
        const sandboxedFn = new Function('omni', 'console', code);
        
        // Create a safe console proxy
        const safeConsole = {
          log: (...args: unknown[]) => self.postMessage({ type: 'LOG', args }),
          warn: (...args: unknown[]) => self.postMessage({ type: 'LOG', args: ['[WARN]', ...args] }),
          error: (...args: unknown[]) => self.postMessage({ type: 'ERROR', error: args.join(' ') }),
        };

        sandboxedFn(omni, safeConsole);
        self.postMessage({ type: 'LOG', args: [`[PLUGIN:${pluginName}] Initialized successfully.`] });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        self.postMessage({ type: 'ERROR', error: `[PLUGIN:${pluginName}] Execution failed: ${errorMsg}` });
      }
      break;
    }

    case 'SHUTDOWN': {
      self.postMessage({ type: 'LOG', args: [`[PLUGIN:${pluginName}] Shutting down.`] });
      self.close();
      break;
    }

    case 'API_RESPONSE': {
      // Handle responses from main thread (future: resolve promises)
      break;
    }
  }
});
