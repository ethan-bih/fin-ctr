import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');

test('wedding budget item model and schema support deposit amounts', () => {
  const types = read('src/lib/weddingTypes.ts');
  const sql = read('supabase/wedding_schema.sql');
  const budgetTable =
    sql.match(/CREATE TABLE IF NOT EXISTS public\.wedding_budgets \([\s\S]*?\);/)?.[0] ?? '';

  assert.match(types, /deposit_amount: number;/);
  assert.match(types, /totalDepositedBudget: number;/);
  assert.match(types, /totalRemainingPayment: number;/);
  assert.match(budgetTable, /deposit_amount NUMERIC\(15, 2\) NOT NULL DEFAULT 0 CHECK \(deposit_amount >= 0\)/);
  assert.match(sql, /ALTER TABLE public\.wedding_budgets ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC\(15, 2\) NOT NULL DEFAULT 0 CHECK \(deposit_amount >= 0\);/);
});

test('wedding budget context normalizes deposits and keeps actual cost as spending', () => {
  const source = read('src/context/WeddingContext.tsx');

  assert.match(source, /normalizeBudgetItem/);
  assert.match(source, /deposit_amount: budget\.deposit_amount \?\? 0/);
  assert.match(source, /const totalDepositedBudget = budgets\.reduce\(\(acc, budget\) => acc \+ budget\.deposit_amount, 0\);/);
  assert.match(source, /const totalRemainingPayment = budgets\.reduce\(\(acc, budget\) => acc \+ Math\.max\(budget\.actual_cost - budget\.deposit_amount, 0\), 0\);/);
  assert.match(source, /remainingBudget: targetBudget - totalAct/);
  assert.doesNotMatch(source, /remainingBudget: targetBudget - \(totalAct \+ totalDepositedBudget\)/);
});

test('wedding budget modal saves deposit amounts from a numeric input', () => {
  const source = read('src/components/wedding/modals/WeddingModals.tsx');

  assert.match(source, /const \[depositAmount, setDepositAmount\] = useState\(''\);/);
  assert.match(source, /setDepositAmount\(\(itemToEdit\.deposit_amount \?\? 0\)\.toString\(\)\);/);
  assert.match(source, /const deposit = parseFloat\(depositAmount\) \|\| 0;/);
  assert.match(source, /deposit_amount: deposit/);
  assert.match(source, /is_deposited: deposit > 0/);
  assert.match(source, /Tiền đã cọc \(VNĐ\)/);
});

test('wedding budget views show deposited and remaining payment amounts', () => {
  const budgetTab = read('src/components/wedding/tabs/WeddingBudgetTab.tsx');
  const overviewTab = read('src/components/wedding/tabs/WeddingOverviewTab.tsx');

  assert.match(budgetTab, /totalDeposits/);
  assert.match(budgetTab, /remainingPayment/);
  assert.match(budgetTab, /Math\.max\(item\.actual_cost - item\.deposit_amount, 0\)/);
  assert.match(budgetTab, /Tổng Đã Cọc/);
  assert.match(budgetTab, /Còn phải trả/);
  assert.match(overviewTab, /summary\.totalDepositedBudget/);
  assert.match(overviewTab, /summary\.totalRemainingPayment/);
});
