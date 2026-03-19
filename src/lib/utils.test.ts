import test from 'node:test';
import assert from 'node:assert';
import { cn } from './utils';

test('cn function merges classes correctly', (t) => {
  // Basic concatenation
  assert.strictEqual(cn('px-2', 'py-2'), 'px-2 py-2');
});

test('cn function handles conditional classes', (t) => {
  // Truthy condition
  assert.strictEqual(cn('px-2', true && 'py-2'), 'px-2 py-2');
  // Falsy condition
  assert.strictEqual(cn('px-2', false && 'm-2'), 'px-2');
});

test('cn function handles objects', (t) => {
  // Object with true/false values
  assert.strictEqual(cn('px-2', { 'py-2': true, 'm-2': false }), 'px-2 py-2');
});

test('cn function handles arrays', (t) => {
  // Array of strings
  assert.strictEqual(cn(['px-2', 'py-2']), 'px-2 py-2');
});

test('cn function merges tailwind classes', (t) => {
  // This test expects the behavior of tailwind-merge
  // 'p-2' and 'p-4' conflict, and the last one should win
  assert.strictEqual(cn('p-2', 'p-4'), 'p-4');
});

test('cn function handles empty inputs', (t) => {
  // Various empty/falsy inputs
  assert.strictEqual(cn(), '');
  assert.strictEqual(cn(null, undefined, false, ''), '');
});
