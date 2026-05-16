import { test, expect } from 'vitest';
import { cn } from './utils';

test('cn function merges classes correctly', () => {
  // Basic concatenation
  expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
});

test('cn function handles conditional classes', () => {
  // Truthy condition
  expect(cn('px-2', true && 'py-2')).toBe('px-2 py-2');
  // Falsy condition
  expect(cn('px-2', false && 'm-2')).toBe('px-2');
});

test('cn function handles objects', () => {
  // Object with true/false values
  expect(cn('px-2', { 'py-2': true, 'm-2': false })).toBe('px-2 py-2');
});

test('cn function handles arrays', () => {
  // Array of strings
  expect(cn(['px-2', 'py-2'])).toBe('px-2 py-2');
});

test('cn function merges tailwind classes', () => {
  // This test expects the behavior of tailwind-merge
  // 'p-2' and 'p-4' conflict, and the last one should win
  expect(cn('p-2', 'p-4')).toBe('p-4');
});

test('cn function handles empty inputs', () => {
  // Various empty/falsy inputs
  expect(cn()).toBe('');
  expect(cn(null, undefined, false, '')).toBe('');
});

test('cn function handles complex nested edge cases', (t) => {
  // Nested arrays with mixed falsy values
  assert.strictEqual(cn(['p-2', ['m-2', null, ['bg-red-500', false]]]), 'p-2 m-2 bg-red-500');

  // Array with objects and strings
  assert.strictEqual(cn(['p-2', { 'm-2': true, 'm-4': false }, 'bg-red-500']), 'p-2 m-2 bg-red-500');

  // Tailwind pseudo-classes and responsive variants
  assert.strictEqual(cn('hover:p-2', 'hover:p-4'), 'hover:p-4');
  assert.strictEqual(cn('md:p-2', 'md:p-4'), 'md:p-4');

  // Custom class mixed with tailwind classes
  assert.strictEqual(cn('custom-class', 'p-2', 'p-4'), 'custom-class p-4');

  // String with multiple spaces and tabs
  assert.strictEqual(cn('  p-2   m-2\t\n', 'bg-red-500 '), 'p-2 m-2 bg-red-500');
});
