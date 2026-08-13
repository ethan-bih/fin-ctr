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

test('finance Supabase schema can be rerun and supports anonymous auth profiles', () => {
  const sql = readFileSync('supabase/schema.sql', 'utf8');

  for (const policy of [
    'Users can view own profile',
    'Users can update own profile',
    'Users can view categories',
    'Users can create own categories',
    'Users can update own categories',
    'Users can delete own categories',
    'Users can view own transactions',
    'Users can insert own transactions',
    'Users can update own transactions',
    'Users can delete own transactions',
    'Users can view own budgets',
    'Users can insert own budgets',
    'Users can update own budgets',
    'Users can delete own budgets',
    'Users can view own savings goals',
    'Users can insert own savings goals',
    'Users can update own savings goals',
    'Users can delete own savings goals',
  ]) {
    assert.match(sql, new RegExp(`DROP POLICY IF EXISTS "${policy}"`));
  }

  assert.match(sql, /email TEXT UNIQUE/);
  assert.doesNotMatch(sql, /email TEXT UNIQUE NOT NULL/);
  assert.match(sql, /COALESCE\(NEW\.email, NEW\.id::text \|\| '@anonymous\.local'\)/);
});
