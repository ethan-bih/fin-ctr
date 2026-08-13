import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Inter font includes Vietnamese glyph subset for consistent UI text rendering', () => {
  const source = readFileSync('src/app/layout.tsx', 'utf8');

  assert.match(source, /Inter\(\{\s*subsets:\s*\[[^\]]*["']vietnamese["'][^\]]*\]/s);
});
