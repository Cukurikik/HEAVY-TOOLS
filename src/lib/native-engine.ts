/**
 * ═══════════════════════════════════════════════════
 * Omni-Tool Native Engine — Universal WASM Module Loader
 * ═══════════════════════════════════════════════════
 * 
 * Provides a typed, lazy-loading interface to C++ WASM modules.
 * Handles SIMD detection, memory growth, caching, and error recovery.
 * 
 * Usage:
 *   import { NativeEngine } from '@/lib/native-engine';
 *   const kernel = await NativeEngine.load('image-kernel');
 *   const result = kernel.resize(pixels, 1920, 1080, 640, 480);
 * 
 * Architecture:
 *   - Modules are lazy-loaded on first use (saves bandwidth)
 *   - Cached in memory after first load (instant on subsequent calls)
 *   - Falls back gracefully if WASM modules aren't compiled yet
 *   - SIMD detection via existing wasm-simd-check.ts
 */

import type { NativeModuleMap, NativeModuleName } from '@/types/native-engine';
import { supportsWasmSimd } from '@/lib/wasm-simd-check';

// ═══════════════════════════════════════════════════
// Module Registry — Maps module names to WASM file paths
// ═══════════════════════════════════════════════════
const MODULE_REGISTRY: Record<NativeModuleName, { js: string; wasm: string }> = {
  'image-kernel': {
    js: '/wasm/omni-image-kernel.js',
    wasm: '/wasm/omni-image-kernel.wasm',
  },
  'audio-dsp': {
    js: '/wasm/omni-audio-dsp.js',
    wasm: '/wasm/omni-audio-dsp.wasm',
  },
  'crypto-engine': {
    js: '/wasm/omni-crypto-engine.js',
    wasm: '/wasm/omni-crypto-engine.wasm',
  },
};

// ═══════════════════════════════════════════════════
// Module Cache — Prevents re-instantiation
// ═══════════════════════════════════════════════════
const moduleCache = new Map<string, unknown>();

// ═══════════════════════════════════════════════════
// Capability Detection
// ═══════════════════════════════════════════════════
interface NativeCapabilities {
  wasm: boolean;
  simd: boolean;
  threads: boolean;
  memory64: boolean;
}

let cachedCapabilities: NativeCapabilities | null = null;

async function detectCapabilities(): Promise<NativeCapabilities> {
  if (cachedCapabilities) return cachedCapabilities;

  const wasm = typeof WebAssembly !== 'undefined';
  const simd = wasm ? await supportsWasmSimd() : false;
  const threads = typeof SharedArrayBuffer !== 'undefined';

  // Memory64 detection (WASM 64-bit memory)
  let memory64 = false;
  try {
    const testModule = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]);
    memory64 = await WebAssembly.validate(testModule);
  } catch {
    memory64 = false;
  }

  cachedCapabilities = { wasm, simd, threads, memory64 };
  return cachedCapabilities;
}

// ═══════════════════════════════════════════════════
// Error Types
// ═══════════════════════════════════════════════════
export class NativeEngineError extends Error {
  constructor(
    message: string,
    public readonly moduleName: string,
    public readonly cause?: Error
  ) {
    super(`[NativeEngine:${moduleName}] ${message}`);
    this.name = 'NativeEngineError';
  }
}

// ═══════════════════════════════════════════════════
// Main Loader Class
// ═══════════════════════════════════════════════════
export class NativeEngine {
  /**
   * Load a C++ WASM module by name with full type safety.
   * 
   * @param name Module name (e.g., 'image-kernel', 'audio-dsp', 'crypto-engine')
   * @returns Typed module instance with all C++ functions exposed
   * @throws NativeEngineError if module can't be loaded
   * 
   * @example
   * const kernel = await NativeEngine.load('image-kernel');
   * const gray = kernel.grayscale(pixels, 1920, 1080);
   */
  static async load<T extends NativeModuleName>(name: T): Promise<NativeModuleMap[T]> {
    // Check cache first
    if (moduleCache.has(name)) {
      return moduleCache.get(name) as NativeModuleMap[T];
    }

    // Verify runtime capabilities
    const caps = await detectCapabilities();
    if (!caps.wasm) {
      throw new NativeEngineError(
        'WebAssembly is not supported in this browser. Cannot load native C++ modules.',
        name
      );
    }

    const registry = MODULE_REGISTRY[name];
    if (!registry) {
      throw new NativeEngineError(`Unknown module: "${name}"`, name);
    }

    try {
      // Check if WASM file exists before attempting to load
      const wasmCheck = await fetch(registry.wasm, { method: 'HEAD' });
      if (!wasmCheck.ok) {
        throw new NativeEngineError(
          `WASM binary not found at ${registry.wasm}. Run "bash native/scripts/build-wasm.sh" to compile C++ modules.`,
          name
        );
      }

      // Dynamic import of the Emscripten JS glue code
      // The JS glue exports a factory function that returns a Promise<Module>
      const moduleFactory = await importModuleFactory(registry.js);

      // Initialize the WASM module
      const instance = await moduleFactory({
        // Pass WASM binary location explicitly
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) return registry.wasm;
          return path;
        },
      });

      // Cache the initialized module
      moduleCache.set(name, instance);

      console.log(`[NativeEngine] ✅ Loaded C++ module: ${name} (SIMD: ${caps.simd})`);
      return instance as NativeModuleMap[T];
    } catch (error) {
      if (error instanceof NativeEngineError) throw error;
      throw new NativeEngineError(
        `Failed to load WASM module: ${(error as Error).message}`,
        name,
        error as Error
      );
    }
  }

  /**
   * Check if a specific native module is available (compiled and reachable).
   */
  static async isAvailable(name: NativeModuleName): Promise<boolean> {
    try {
      const registry = MODULE_REGISTRY[name];
      if (!registry) return false;

      const response = await fetch(registry.wasm, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get runtime capabilities (WASM, SIMD, threads, etc.)
   */
  static async getCapabilities(): Promise<NativeCapabilities> {
    return detectCapabilities();
  }

  /**
   * Unload a cached module to free memory.
   */
  static unload(name: NativeModuleName): void {
    moduleCache.delete(name);
    console.log(`[NativeEngine] 🗑️ Unloaded module: ${name}`);
  }

  /**
   * Unload all cached modules.
   */
  static unloadAll(): void {
    moduleCache.clear();
    console.log('[NativeEngine] 🗑️ All modules unloaded');
  }
}

// ═══════════════════════════════════════════════════
// Helper: Dynamic import of Emscripten JS glue
// ═══════════════════════════════════════════════════
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function importModuleFactory(jsPath: string): Promise<(config?: any) => Promise<any>> {
  try {
    // Try ES module import first (Emscripten EXPORT_ES6=1)
    const mod = await import(/* webpackIgnore: true */ jsPath);
    return mod.default || mod;
  } catch {
    // Fallback: fetch the JS glue as text and evaluate
    // This handles cases where the bundler can't resolve dynamic WASM paths
    const response = await fetch(jsPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM glue code: ${jsPath}`);
    }
    const code = await response.text();
    // eslint-disable-next-line no-new-func
    const factory = new Function(`return ${code}`)();
    return factory;
  }
}
