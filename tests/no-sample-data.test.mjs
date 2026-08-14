import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('finance seed data arrays are empty', () => {
  const source = readFileSync('src/lib/constants.ts', 'utf8');

  assert.match(source, /export const INITIAL_MOCK_TRANSACTIONS: Transaction\[\] = \[\];/);
  assert.match(source, /export const INITIAL_MOCK_BUDGETS: Budget\[\] = \[\];/);
  assert.match(source, /export const INITIAL_MOCK_SAVINGS: SavingsGoal\[\] = \[\];/);
  assert.doesNotMatch(source, /Nhận lương|Tiền thuê|MacBook|demo-user/);
});

test('wedding seed data arrays and defaults are empty', () => {
  const source = readFileSync('src/lib/weddingTypes.ts', 'utf8');

  assert.match(source, /export const DEFAULT_WEDDING_DATE = '';/);
  assert.match(source, /export const DEFAULT_TARGET_BUDGET = 0;/);

  for (const name of [
    'INITIAL_WEDDING_EVENTS',
    'INITIAL_WEDDING_TASKS',
    'INITIAL_WEDDING_BUDGETS',
    'INITIAL_WEDDING_GUESTS',
    'INITIAL_WEDDING_VENDORS',
    'INITIAL_WEDDING_GIFTS',
  ]) {
    assert.match(source, new RegExp(`export const ${name}: [^=]+ = \\[\\];`));
  }

  assert.doesNotMatch(source, /White Palace|Riverside|Studio ABC|Nguyễn Văn A|Trầu cau|QH&YN/);
});

test('UI copy does not include sample names or demo wording', () => {
  const files = [
    'src/components/auth/LoginPage.tsx',
    'src/components/user/UserProfilePage.tsx',
    'src/components/wedding/modals/WeddingModals.tsx',
    'src/components/wedding/tabs/WeddingGiftsTab.tsx',
    'src/context/FinanceContext.tsx',
  ];
  const combinedSource = files.map((file) => readFileSync(file, 'utf8')).join('\n');

  assert.doesNotMatch(combinedSource, /Demo|demo-user|Nguyễn Văn A|Studio ABC|White Palace|Trầu cau/);
});

test('local data clear removes wedding browser storage keys too', () => {
  const source = readFileSync('src/context/FinanceContext.tsx', 'utf8');

  for (const [constantName, key] of [
    ['LOCAL_STORAGE_WEDDING_DATE_KEY', 'pf_wedding_date_v1'],
    ['LOCAL_STORAGE_WEDDING_TARGET_BUDGET_KEY', 'pf_wedding_target_budget_v1'],
    ['LOCAL_STORAGE_WEDDING_EVENTS_KEY', 'pf_wedding_event_dates_v1'],
    ['LOCAL_STORAGE_WEDDING_TASKS_KEY', 'pf_wedding_tasks_v1'],
    ['LOCAL_STORAGE_WEDDING_BUDGETS_KEY', 'pf_wedding_budgets_v1'],
    ['LOCAL_STORAGE_WEDDING_GUESTS_KEY', 'pf_wedding_guests_v1'],
    ['LOCAL_STORAGE_WEDDING_VENDORS_KEY', 'pf_wedding_vendors_v1'],
    ['LOCAL_STORAGE_WEDDING_GIFTS_KEY', 'pf_wedding_gifts_v1'],
  ]) {
    assert.match(source, new RegExp(`const ${constantName} = '${key}';`));
    assert.match(source, new RegExp(`localStorage\\.removeItem\\(${constantName}\\)`));
  }
});
