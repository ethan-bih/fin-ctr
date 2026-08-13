# Anonymous Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Google OAuth from the personal app and create a Supabase session automatically through anonymous auth.

**Architecture:** Keep the existing local username/password screen for app access. When Supabase is configured, `FinanceContext` creates or restores an anonymous Supabase auth session so existing RLS policies continue to work for finance and wedding tables.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Supabase browser client.

## Global Constraints

- Do not add new dependencies.
- Keep localStorage fallback when Supabase is not configured.
- Remove user-facing Google OAuth copy and controls.
- Preserve existing context consumers as much as possible.

---

### Task 1: Failing Coverage

**Files:**
- Create: `tests/anonymous-auth.test.mjs`

**Interfaces:**
- Consumes: `src/context/FinanceContext.tsx`, `src/components/auth/LoginPage.tsx`, `src/components/SettingsConfig.tsx`
- Produces: static regression checks for anonymous auth and no Google OAuth UI

- [ ] **Step 1: Write the failing test**

```javascript
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('FinanceContext uses anonymous Supabase auth instead of Google OAuth', () => {
  const source = readFileSync('src/context/FinanceContext.tsx', 'utf8');
  assert.match(source, /signInAnonymously/);
  assert.doesNotMatch(source, /signInWithOAuth/);
  assert.doesNotMatch(source, /loginWithGoogle/);
});

test('auth and settings UI no longer show Google OAuth controls', () => {
  const login = readFileSync('src/components/auth/LoginPage.tsx', 'utf8');
  const settings = readFileSync('src/components/SettingsConfig.tsx', 'utf8');
  assert.doesNotMatch(`${login}\n${settings}`, /Google OAuth|Đăng Nhập Google Auth|loginWithGoogle/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/anonymous-auth.test.mjs`
Expected: FAIL because Google OAuth still exists and anonymous auth is absent.

### Task 2: Finance Context Anonymous Auth

**Files:**
- Modify: `src/context/FinanceContext.tsx`

**Interfaces:**
- Produces: automatic anonymous Supabase session initialization and no `loginWithGoogle` API.

- [ ] **Step 1: Remove `loginWithGoogle` from the context interface and provider value**
- [ ] **Step 2: In initialization, call `supabase.auth.signInAnonymously()` when configured but no session user exists**
- [ ] **Step 3: Keep localStorage fallback if anonymous sign-in fails or Supabase is not configured**

### Task 3: UI Cleanup

**Files:**
- Modify: `src/components/auth/LoginPage.tsx`
- Modify: `src/components/SettingsConfig.tsx`

**Interfaces:**
- Consumes: `useFinance()` without `loginWithGoogle`
- Produces: login/settings pages with no Google OAuth button or wording.

- [ ] **Step 1: Remove Google OAuth button from login page**
- [ ] **Step 2: Replace settings copy with automatic cloud sync status**

### Task 4: Verification

**Files:**
- Test: `tests/anonymous-auth.test.mjs`

- [ ] **Step 1: Run focused test**

Run: `node --test tests/anonymous-auth.test.mjs`
Expected: PASS

- [ ] **Step 2: Run type/build checks**

Run: `npx tsc --noEmit` and `npm run build`
Expected: PASS
