import { describe, it, expect, vi, afterEach } from 'vitest';
import { supportsWasmSimd } from './wasm-simd-check';

describe('supportsWasmSimd', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when WebAssembly.validate returns true', async () => {
    vi.spyOn(WebAssembly, 'validate').mockReturnValue(true);
    const result = await supportsWasmSimd();
    expect(result).toBe(true);
    expect(WebAssembly.validate).toHaveBeenCalledOnce();
  });

  it('should return false when WebAssembly.validate returns false', async () => {
    vi.spyOn(WebAssembly, 'validate').mockReturnValue(false);
    const result = await supportsWasmSimd();
    expect(result).toBe(false);
    expect(WebAssembly.validate).toHaveBeenCalledOnce();
  });

  it('should return false when WebAssembly.validate throws an error', async () => {
    vi.spyOn(WebAssembly, 'validate').mockImplementation(() => {
      throw new Error('Validation failed');
    });
    const result = await supportsWasmSimd();
    expect(result).toBe(false);
    expect(WebAssembly.validate).toHaveBeenCalledOnce();
  });
});
