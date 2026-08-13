# Wedding Supabase Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist wedding planner data to Supabase when the app is in live mode, while keeping localStorage as the demo/offline fallback.

**Architecture:** Keep UI components unchanged and move persistence into `WeddingContext`. Add focused Supabase helper functions for table names, payload shaping, and snapshot reads/writes so the context remains readable.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Supabase browser client, localStorage fallback.

## Global Constraints

- Preserve localStorage behavior when Supabase is not configured or the user is not logged in.
- Do not add new runtime dependencies.
- Keep wedding UI props and existing type names stable.
- Align SQL tables with fields already used by `src/lib/weddingTypes.ts`.

---

### Task 1: Coverage for Wedding Supabase Linkage

**Files:**
- Create: `tests/wedding-supabase-linkage.test.mjs`

**Interfaces:**
- Consumes: `supabase/wedding_schema.sql`, `src/context/WeddingContext.tsx`
- Produces: failing checks for missing cloud persistence

- [ ] **Step 1: Write the failing test**

```javascript
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('wedding schema includes events, settings, event links, and RLS checks', () => {
  const sql = readFileSync('supabase/wedding_schema.sql', 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.wedding_events/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.wedding_settings/);
  for (const table of ['wedding_tasks', 'wedding_budgets', 'wedding_guests', 'wedding_vendors']) {
    const tableBlock = sql.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table} \\([\\s\\S]*?\\);`))?.[0] ?? '';
    assert.match(tableBlock, /event_id UUID/);
  }
  assert.match(sql, /WITH CHECK \(auth\.uid\(\) = user_id\)/);
});

test('WeddingContext uses Supabase for live-mode wedding persistence', () => {
  const source = readFileSync('src/context/WeddingContext.tsx', 'utf8');
  assert.match(source, /createClient/);
  assert.match(source, /useFinance/);
  for (const table of ['wedding_events', 'wedding_tasks', 'wedding_budgets', 'wedding_guests', 'wedding_vendors', 'wedding_gifts', 'wedding_settings']) {
    assert.match(source, new RegExp(table));
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wedding-supabase-linkage.test.mjs`
Expected: FAIL because schema/context are not linked to Supabase yet.

### Task 2: Implement Supabase Wedding Persistence

**Files:**
- Create: `src/lib/weddingSupabase.ts`
- Modify: `src/context/WeddingContext.tsx`

**Interfaces:**
- Consumes: `createClient()`, `useFinance().isLiveMode`, `useFinance().user`
- Produces: `fetchWeddingSnapshot`, `insertWeddingRecord`, `updateWeddingRecord`, `deleteWeddingRecord`, `upsertWeddingSettings`

- [ ] **Step 1: Add helper functions for Supabase CRUD and shape payloads**
- [ ] **Step 2: Wire `WeddingContext` load, create, update, delete, and settings writes through Supabase in live mode**
- [ ] **Step 3: Keep localStorage writes in fallback mode**

### Task 3: Align Wedding SQL Schema

**Files:**
- Modify: `supabase/wedding_schema.sql`

**Interfaces:**
- Consumes: fields in `src/lib/weddingTypes.ts`
- Produces: tables `wedding_settings`, `wedding_events`, existing wedding tables with `event_id`, and RLS policies with `WITH CHECK`

- [ ] **Step 1: Add settings/events tables**
- [ ] **Step 2: Add `event_id` foreign keys to linked tables**
- [ ] **Step 3: Strengthen RLS policies for insert/update checks**

### Task 4: Verification

**Files:**
- Test: `tests/wedding-supabase-linkage.test.mjs`

**Interfaces:**
- Consumes: completed code and schema
- Produces: verification output

- [ ] **Step 1: Run focused test**

Run: `node --test tests/wedding-supabase-linkage.test.mjs`
Expected: PASS

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: Existing lint may still fail on unrelated pre-existing warnings/errors; report exact status.
