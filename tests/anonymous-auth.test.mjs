import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('FinanceContext uses anonymous Supabase auth instead of Google OAuth', () => {
  const source = readFileSync('src/context/FinanceContext.tsx', 'utf8');

  assert.match(source, /signInAnonymously/);
  assert.doesNotMatch(source, /signInWithOAuth/);
  assert.doesNotMatch(source, /loginWithGoogle/);
});

test('auth UI no longer shows Google OAuth controls', () => {
  const login = readFileSync('src/components/auth/LoginPage.tsx', 'utf8');

  assert.doesNotMatch(login, /Google OAuth|Đăng Nhập Google Auth|loginWithGoogle/);
});

test('Supabase configuration and sync status are hidden from the app UI', () => {
  const uiSource = [
    'src/app/page.tsx',
    'src/components/Sidebar.tsx',
    'src/context/FinanceContext.tsx',
  ].map((file) => readFileSync(file, 'utf8')).join('\n');

  assert.doesNotMatch(uiSource, /SettingsConfig|Cấu Hình Supabase|Cấu hình/);
  assert.doesNotMatch(uiSource, /Cloud Sync Active|Local Mode Active/);
});

test('Supabase client normalizes a Vercel REST endpoint env var to the project URL', () => {
  const source = readFileSync('src/lib/supabase/client.ts', 'utf8');

  assert.match(source, /replace\(\s*\/\\\/rest\\\/v1\\\/\?\$\/\s*,\s*''\s*\)/);
  assert.match(source, /createBrowserClient\(normalizedSupabaseUrl, supabaseAnonKey\)/);
});

test('live Supabase activation does not overwrite cloud finance data with browser storage', () => {
  const source = readFileSync('src/context/FinanceContext.tsx', 'utf8');
  const activationMatch = source.match(/const activateCloudSession = async \(userId: string\) => \{([\s\S]*?)\n      \};/);

  assert.ok(activationMatch, 'activateCloudSession should be an async initializer');
  assert.match(activationMatch[1], /loadLocalAccountData\(\)/);
  assert.match(activationMatch[1], /initializeCloudFinanceData\(userId\)/);
  assert.doesNotMatch(activationMatch[1], /loadLocalStorageData\(\)/);
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
