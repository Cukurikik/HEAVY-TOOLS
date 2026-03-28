const { parentPort, workerData } = require('worker_threads');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

// Task 41, 48: Script inside the worker thread
async function runSandbox() {
  try {
    const { pluginDir, action, payload } = workerData;
    
    // Check manifest
    const manifestPath = path.join(pluginDir, 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('plugin.json not found in plugin directory');
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const entryFile = manifest.main || 'index.js';
    const entryPath = path.join(pluginDir, entryFile);
    
    if (!fs.existsSync(entryPath)) {
      throw new Error(`Entry file ${entryFile} not found`);
    }

    const code = fs.readFileSync(entryPath, 'utf8');

    // Task 48: Sandboxed API Context (Backend)
    const safeRequire = (moduleName) => {
      const allowedModules = ['crypto', 'path', 'url', 'querystring', 'buffer', 'util', 'stream'];
      if (!allowedModules.includes(moduleName)) {
        throw new Error(`Module ${moduleName} is not allowed in sandbox.`);
      }
      return require(moduleName);
    };

    const sandbox = {
      console: {
        log: (...args) => parentPort.postMessage({ type: 'log', level: 'info', args }),
        error: (...args) => parentPort.postMessage({ type: 'log', level: 'error', args }),
        warn: (...args) => parentPort.postMessage({ type: 'log', level: 'warn', args }),
      },
      require: safeRequire,
      module: { exports: {} },
      exports: {},
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      Buffer,
      OmniPluginAPI: {
        // Task 50: Progress
        emitProgress: (value) => parentPort.postMessage({ type: 'progress', value }),
        
        // Task 64: Virtual File System (VFS)
        fs: {
          readFile: (file, encoding) => {
            const safePath = path.resolve(path.join(pluginDir, file));
            if (!safePath.startsWith(pluginDir)) throw new Error("VFS Escape Attempt!");
            return fs.readFileSync(safePath, encoding);
          },
          writeFile: (file, data) => {
            const safePath = path.resolve(path.join(pluginDir, file));
            if (!safePath.startsWith(pluginDir)) throw new Error("VFS Escape Attempt!");
            fs.writeFileSync(safePath, data);
          }
        },

        // Task 63: Network Request Interceptor
        fetch: async (url, options) => {
          const parsedUrl = new URL(url);
          if (parsedUrl.protocol !== 'https:') {
            throw new Error("Only HTTPS is allowed in Plugin Sandbox");
          }
          parentPort.postMessage({ type: 'audit', action: 'NETWORK_FETCH', details: url });
          return fetch(url, options); // Node 18+ native fetch
        },

        // Task 68: Secure Storage API
        db: {
          set: (key, value) => {
            parentPort.postMessage({ type: 'db_set', key, value });
          },
          get: (key) => {
            return new Promise((resolve) => {
              const reqId = Math.random().toString();
              const listener = (msg) => {
                if (msg.type === 'db_get_result' && msg.reqId === reqId) {
                  parentPort.removeListener('message', listener);
                  resolve(msg.value);
                }
              };
              parentPort.on('message', listener);
              parentPort.postMessage({ type: 'db_get', reqId, key });
            });
          }
        }
      }
    };

    // Evaluate in VM
    vm.createContext(sandbox);
    const script = new vm.Script(code);
    script.runInContext(sandbox);

    const pluginExport = sandbox.module.exports;

    if (typeof pluginExport[action] !== 'function') {
      throw new Error(`Action '${action}' is not exported by the plugin`);
    }

    const result = await pluginExport[action](payload, sandbox.OmniPluginAPI);
    parentPort.postMessage({ type: 'result', data: result });
  } catch (err) {
    parentPort.postMessage({ type: 'error', error: err.message });
  }
}

runSandbox();
