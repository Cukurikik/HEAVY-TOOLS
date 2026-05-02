import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isFeatureActive, FEATURE_FLAGS } from './feature-flags';

describe('isFeatureActive', () => {
  let originalFlags: typeof FEATURE_FLAGS;

  beforeEach(() => {
    // Save original flags to restore after each test
    originalFlags = { ...FEATURE_FLAGS };
  });

  afterEach(() => {
    // Restore original flags
    for (const key in originalFlags) {
      (FEATURE_FLAGS as any)[key] = (originalFlags as any)[key];
    }
  });

  it('should return true when a feature flag is explicitly true', () => {
    // Set a flag to true
    FEATURE_FLAGS.enableAiUpscaler = true;
    expect(isFeatureActive('enableAiUpscaler')).toBe(true);
  });

  it('should return false when a feature flag is explicitly false', () => {
    // Set a flag to false
    FEATURE_FLAGS.enableAiUpscaler = false;
    expect(isFeatureActive('enableAiUpscaler')).toBe(false);
  });

  it('should return false for an undefined flag (fallback logic)', () => {
    // Force a flag to be undefined to trigger the `?? false` branch
    FEATURE_FLAGS.enableAiUpscaler = undefined as any;
    expect(isFeatureActive('enableAiUpscaler')).toBe(false);
  });

  it('should return false for an unknown feature flag', () => {
    // Bypass TypeScript checks to test an invalid key
    expect(isFeatureActive('unknownFeatureFlag' as any)).toBe(false);
  });
});
