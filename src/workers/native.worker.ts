/**
 * ═══════════════════════════════════════════════════
 * Omni-Tool Native C++ WASM Worker
 * ═══════════════════════════════════════════════════
 * 
 * Dedicated Web Worker that loads and executes C++ WASM modules.
 * Runs in a separate thread to keep UI at 120 FPS.
 * 
 * Supported operations:
 *   - IMAGE: resize, sharpen, denoise, grayscale, blur, sepia, invert, brightness/contrast
 *   - AUDIO: equalize, compress, limit, normalize, pitchShift
 *   - CRYPTO: sha256, randomBytes, encrypt, decrypt
 * 
 * Message Protocol:
 *   IN:  { type: 'PROCESS_NATIVE', payload: { module, operation, args } }
 *   OUT: { type: 'PROGRESS' | 'SUCCESS' | 'ERROR' | 'LOG', ... }
 */

// ═══════════════════════════════════════════════════
// Module Loading (inside worker context)
// ═══════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleCache: Map<string, any> = new Map();

const MODULE_PATHS: Record<string, { js: string; wasm: string }> = {
  'image-kernel': { js: '/wasm/omni-image-kernel.js', wasm: '/wasm/omni-image-kernel.wasm' },
  'audio-dsp':    { js: '/wasm/omni-audio-dsp.js',    wasm: '/wasm/omni-audio-dsp.wasm' },
  'crypto-engine': { js: '/wasm/omni-crypto-engine.js', wasm: '/wasm/omni-crypto-engine.wasm' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadModule(name: string): Promise<any> {
  if (moduleCache.has(name)) return moduleCache.get(name);

  const paths = MODULE_PATHS[name];
  if (!paths) throw new Error(`Unknown native module: ${name}`);

  self.postMessage({ type: 'LOG', message: `[NativeWorker] Loading C++ module: ${name}` });

  // Fetch and evaluate the Emscripten JS glue
  const response = await fetch(paths.js);
  if (!response.ok) throw new Error(`WASM glue not found: ${paths.js}`);
  const code = await response.text();

  // eslint-disable-next-line no-new-func
  const factory = new Function(`return ${code}`)();
  const instance = await factory({
    locateFile: (path: string) => {
      if (path.endsWith('.wasm')) return paths.wasm;
      return path;
    },
  });

  moduleCache.set(name, instance);
  self.postMessage({ type: 'LOG', message: `[NativeWorker] ✅ Module loaded: ${name}` });
  return instance;
}

// ═══════════════════════════════════════════════════
// Message Handler
// ═══════════════════════════════════════════════════
self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_NATIVE') {
    const { module: moduleName, operation, args = [] } = payload;

    try {
      self.postMessage({ type: 'PROGRESS', progress: 5 });

      // Load the C++ WASM module
      const mod = await loadModule(moduleName);
      self.postMessage({ type: 'PROGRESS', progress: 20 });

      // Verify the operation exists
      if (typeof mod[operation] !== 'function') {
        throw new Error(`Operation "${operation}" not found in module "${moduleName}". Available: ${Object.keys(mod).filter(k => typeof mod[k] === 'function').join(', ')}`);
      }

      self.postMessage({ type: 'LOG', message: `[NativeWorker] Executing: ${moduleName}.${operation}(${args.length} args)` });
      self.postMessage({ type: 'PROGRESS', progress: 30 });

      // Execute the C++ function
      const startTime = performance.now();
      const result = mod[operation](...args);
      const elapsed = performance.now() - startTime;

      self.postMessage({ type: 'PROGRESS', progress: 90 });
      self.postMessage({ type: 'LOG', message: `[NativeWorker] ⚡ ${moduleName}.${operation} completed in ${elapsed.toFixed(2)}ms` });

      // Handle different result types
      if (result instanceof Uint8Array || result instanceof Float32Array) {
        // For typed arrays, create a Blob URL for large results
        // or transfer directly for small results
        if (result.byteLength > 1024 * 1024) {
          // > 1MB: use Blob URL
          const blob = new Blob([result as unknown as BlobPart], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          self.postMessage({
            type: 'SUCCESS',
            resultUrls: [url],
            metadata: { size: result.byteLength, elapsed, operation },
          });
        } else {
          // Small result: transfer the buffer directly
          const copy = new Uint8Array(result);
          self.postMessage(
            {
              type: 'SUCCESS',
              resultData: copy.buffer,
              metadata: { size: result.byteLength, elapsed, operation },
            },
            [copy.buffer]
          );
        }
      } else if (typeof result === 'object' && result !== null) {
        // Object result (e.g., EncryptedPayload from crypto)
        self.postMessage({
          type: 'SUCCESS',
          resultObject: result,
          metadata: { elapsed, operation },
        });
      } else {
        // Scalar or null result
        self.postMessage({
          type: 'SUCCESS',
          resultValue: result,
          metadata: { elapsed, operation },
        });
      }

      self.postMessage({ type: 'PROGRESS', progress: 100 });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Native Engine failure';
      self.postMessage({
        type: 'ERROR',
        error: errorMessage,
        operation,
        module: moduleName,
      });
    }

  } else if (type === 'CHECK_AVAILABLE') {
    // Check if a module's WASM file exists
    const { module: name } = payload;
    try {
      const paths = MODULE_PATHS[name];
      if (!paths) {
        self.postMessage({ type: 'AVAILABLE', module: name, available: false });
        return;
      }
      const response = await fetch(paths.wasm, { method: 'HEAD' });
      self.postMessage({ type: 'AVAILABLE', module: name, available: response.ok });
    } catch {
      self.postMessage({ type: 'AVAILABLE', module: name, available: false });
    }

  } else if (type === 'TERMINATE') {
    self.postMessage({ type: 'LOG', message: '[NativeWorker] Termination order received.' });
    moduleCache.clear();
    self.close();
  }
};
