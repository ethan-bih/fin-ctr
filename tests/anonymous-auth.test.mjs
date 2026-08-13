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
