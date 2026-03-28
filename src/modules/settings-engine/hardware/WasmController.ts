export class WasmController {
  /**
   * Evaluates the maximum allowed WebAssembly memory in bytes.
   * @param configuredMB - The user's configuration limit in Megabytes.
   */
  static getDynamicMemoryLimitBytes(configuredMB: number): number {
    const bytes = configuredMB * 1024 * 1024;
    // Hardcap browser limits roughly 4GB (32-bit wasm limitation)
    const MAX_SAFE_WASM = 4 * 1024 * 1024 * 1024; 
    
    if (bytes > MAX_SAFE_WASM) {
      console.warn(`[WasmController] Requested ${configuredMB}MB exceeds safe browser limits. Capped at 4GB.`);
      return MAX_SAFE_WASM;
    }
    
    return bytes;
  }

  /**
   * Attaches the configured memory constraints to any new Web Worker configuration.
   */
  static injectWorkerConstraints(workerOptions: WorkerOptions, configuredMB: number): WorkerOptions {
    // Advanced WASM instantiation flags could be injected here
    // Example: Deno/Node worker threads accept resourceLimits
    return {
      ...workerOptions,
      // If browsers supported worker resource limiting directly, it would go here.
      // Currently, memory limits are enforced inside the WASM compilation step itself.
    };
  }

  /**
   * Evaluates if WebGPU is supported AND allowed by user configuration
   */
  static async evaluateWebGpuAccess(userWantsWebGpu: boolean): Promise<boolean> {
    if (!userWantsWebGpu) return false;
    
    if (!('gpu' in navigator)) {
      console.warn('[WasmController] User requested WebGPU but navigator.gpu is not available.');
      return false;
    }
    
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    } catch (e) {
      return false;
    }
  }
}
