import { test, expect, vi, describe, afterEach } from 'vitest';
import { supportsWasmSimd } from './wasm-simd-check';

describe('supportsWasmSimd', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns true when WebAssembly.validate succeeds', async () => {
    vi.stubGlobal('WebAssembly', {
      validate: vi.fn().mockReturnValue(true)
    });

    const result = await supportsWasmSimd();
    expect(result).toBe(true);
    expect(WebAssembly.validate).toHaveBeenCalled();
  });

  test('returns false when WebAssembly.validate throws an error', async () => {
    vi.stubGlobal('WebAssembly', {
      validate: vi.fn().mockImplementation(() => {
        throw new Error('SIMD not supported');
      })
    });

    const result = await supportsWasmSimd();
    expect(result).toBe(false);
    expect(WebAssembly.validate).toHaveBeenCalled();
  });

  test('returns false when WebAssembly is not defined', async () => {
    vi.stubGlobal('WebAssembly', undefined);

    const result = await supportsWasmSimd();
    expect(result).toBe(false);
  });

  test('returns false when WebAssembly.validate returns false', async () => {
    vi.stubGlobal('WebAssembly', {
      validate: vi.fn().mockReturnValue(false)
    });

    const result = await supportsWasmSimd();
    expect(result).toBe(false);
    expect(WebAssembly.validate).toHaveBeenCalled();
  });
});
