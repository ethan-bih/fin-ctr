import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('wedding schema includes events, settings, event links, and RLS checks', () => {
  const sql = readFileSync('supabase/wedding_schema.sql', 'utf8');

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.wedding_events/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.wedding_settings/);

  for (const table of ['wedding_tasks', 'wedding_budgets', 'wedding_guests', 'wedding_vendors']) {
    const tableBlock =
      sql.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table} \\([\\s\\S]*?\\);`))?.[0] ?? '';

    assert.match(tableBlock, /event_id UUID/);
  }

  assert.match(sql, /WITH CHECK \(auth\.uid\(\) = user_id\)/);
});

test('wedding Supabase persistence supports an unset wedding date', () => {
  const sql = readFileSync('supabase/wedding_schema.sql', 'utf8');
  const helperSource = readFileSync('src/lib/weddingSupabase.ts', 'utf8');

  assert.match(sql, /ALTER TABLE public\.wedding_settings ALTER COLUMN wedding_date DROP NOT NULL/);
  assert.match(sql, /ALTER TABLE public\.wedding_settings ALTER COLUMN wedding_date DROP DEFAULT/);
  assert.match(helperSource, /wedding_date: settings\.wedding_date \|\| null/);
  assert.match(helperSource, /wedding_date: snapshot\.settings\?\.wedding_date \|\| null/);
});

test('WeddingContext uses Supabase for live-mode wedding persistence', () => {
  const source = readFileSync('src/context/WeddingContext.tsx', 'utf8');
  const helperSource = readFileSync('src/lib/weddingSupabase.ts', 'utf8');
  const combinedSource = `${source}\n${helperSource}`;

  assert.match(source, /createClient/);
  assert.match(source, /useFinance/);

  for (const table of [
    'wedding_events',
    'wedding_tasks',
    'wedding_budgets',
    'wedding_guests',
    'wedding_vendors',
    'wedding_gifts',
    'wedding_settings',
  ]) {
    assert.match(combinedSource, new RegExp(table));
  }
});
