/**
 * Verifies if the current browser environment supports WebAssembly SIMD.
 * This is extremely important for detecting if the client can run the high-performance
 * FFmpeg WASM core, or if we need to fallback to standard WASM or Cloud encoding.
 */
export async function supportsWasmSimd(): Promise<boolean> {
  try {
    // A minimal WASM module using SIMD instructions (v128)
    const wasm = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
      10, 1, 8, 0, 65, 0, 253, 15, 253, 95, 11
    ]);
    return await WebAssembly.validate(wasm);
  } catch (e) {
    return false;
  }
}
