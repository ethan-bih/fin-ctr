# Wedding Budget Deposits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add partial deposit tracking to Wedding budget items without double-counting deposits as additional spending.

**Architecture:** Extend the existing Wedding budget item model with `deposit_amount`, persist it through localStorage and Supabase using the current generic Wedding persistence helpers, and render derived deposit totals directly in the Budget and Overview tabs. Keep `actual_cost` as the final/current expected total and derive `remaining_payment` in UI code as `Math.max(actual_cost - deposit_amount, 0)`.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript, Supabase, Tailwind CSS, lucide-react, Recharts, Node.js `node:test`.

## Global Constraints

- `actual_cost` is the final or current expected total cost for a budget item.
- `deposit_amount` is the amount already paid upfront.
- `remaining_payment` is derived in the UI as `max(actual_cost - deposit_amount, 0)`.
- Do not add `deposit_amount` on top of `actual_cost` when calculating used budget.
- Existing localStorage and Supabase rows without `deposit_amount` behave as `0`.
- Keep `is_deposited` for compatibility and quick status.
- New saves set `is_deposited` from whether `deposit_amount > 0`.
- Blank or invalid numeric budget inputs are treated as `0`.

---

## File Structure

- `tests/wedding-budget-deposits.test.mjs`: New source-contract test for the model, schema, modal, budget tab, and overview behavior.
- `src/lib/weddingTypes.ts`: Add `deposit_amount` to `WeddingBudgetItem` and summary fields used by overview.
- `src/context/WeddingContext.tsx`: Normalize loaded budget rows so old data gets `deposit_amount: 0`, and add deposit summary values without changing spending math.
- `supabase/wedding_schema.sql`: Add `deposit_amount` to `wedding_budgets` plus compatibility migration.
- `src/components/wedding/modals/WeddingModals.tsx`: Add `Tiền đã cọc (VNĐ)` field and save `deposit_amount`.
- `src/components/wedding/tabs/WeddingBudgetTab.tsx`: Display total deposits and per-item remaining payment.
- `src/components/wedding/tabs/WeddingOverviewTab.tsx`: Surface deposit information in the compact budget card.

---

### Task 1: Deposit Contract Coverage

**Files:**
- Create: `tests/wedding-budget-deposits.test.mjs`

**Interfaces:**
- Consumes: Existing source files as text.
- Produces: A failing contract test that later tasks satisfy.

- [ ] **Step 1: Write the failing test**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wedding-budget-deposits.test.mjs`

Expected: FAIL because `deposit_amount`, deposit summary fields, and UI labels are not present yet.

- [ ] **Step 3: Commit failing test**

```bash
git add tests/wedding-budget-deposits.test.mjs
git commit -m "test: cover wedding budget deposits"
```

---

### Task 2: Data Model, Schema, and Summary

**Files:**
- Modify: `src/lib/weddingTypes.ts`
- Modify: `src/context/WeddingContext.tsx`
- Modify: `supabase/wedding_schema.sql`
- Test: `tests/wedding-budget-deposits.test.mjs`

**Interfaces:**
- Consumes: `WeddingBudgetItem` and `WeddingSummary`.
- Produces: `WeddingBudgetItem.deposit_amount`, `WeddingSummary.totalDepositedBudget`, `WeddingSummary.totalRemainingPayment`, and normalized budget rows.

- [ ] **Step 1: Add type fields**

In `src/lib/weddingTypes.ts`, update:

```typescript
export interface WeddingBudgetItem {
  id: string;
  category: WeddingCategory;
  title: string;
  estimated_cost: number;
  actual_cost: number;
  deposit_amount: number;
  is_deposited: boolean;
  event_id?: string;
  note?: string;
}
```

And update `WeddingSummary`:

```typescript
export interface WeddingSummary {
  targetBudget: number;
  totalEstimatedBudget: number;
  totalActualExpense: number;
  totalDepositedBudget: number;
  totalRemainingPayment: number;
  remainingBudget: number;
  totalTasks: number;
  completedTasks: number;
  totalGuests: number;
  confirmedGuests: number;
  totalAccompanying: number;
  totalVendors: number;
  depositedVendors: number;
}
```

- [ ] **Step 2: Add schema column and compatibility migration**

In `supabase/wedding_schema.sql`, add the column inside `CREATE TABLE IF NOT EXISTS public.wedding_budgets` after `actual_cost`:

```sql
    deposit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
```

Then add the compatibility line near the existing `ALTER TABLE public.wedding_budgets` statements:

```sql
ALTER TABLE public.wedding_budgets ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0);
```

- [ ] **Step 3: Normalize loaded budget rows**

In `src/context/WeddingContext.tsx`, add this helper near `defaultSnapshot`:

```typescript
const normalizeBudgetItem = (budget: WeddingBudgetItem): WeddingBudgetItem => ({
  ...budget,
  deposit_amount: budget.deposit_amount ?? 0,
});
```

Then update `applySnapshot`:

```typescript
setBudgets(snapshot.budgets.map(normalizeBudgetItem));
```

- [ ] **Step 4: Add summary totals without changing spending math**

In `src/context/WeddingContext.tsx`, after `totalAct`:

```typescript
const totalDepositedBudget = budgets.reduce((acc, budget) => acc + budget.deposit_amount, 0);
const totalRemainingPayment = budgets.reduce(
  (acc, budget) => acc + Math.max(budget.actual_cost - budget.deposit_amount, 0),
  0
);
```

Then add both fields to `summary`:

```typescript
totalDepositedBudget,
totalRemainingPayment,
remainingBudget: targetBudget - totalAct,
```

- [ ] **Step 5: Run the contract test**

Run: `node --test tests/wedding-budget-deposits.test.mjs`

Expected: still FAIL because modal and UI views are not updated yet.

- [ ] **Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: FAIL until UI create/update calls include `deposit_amount`.

- [ ] **Step 7: Commit data model changes**

```bash
git add src/lib/weddingTypes.ts src/context/WeddingContext.tsx supabase/wedding_schema.sql
git commit -m "feat: add wedding budget deposit data model"
```

---

### Task 3: Budget Modal Deposit Input

**Files:**
- Modify: `src/components/wedding/modals/WeddingModals.tsx`
- Test: `tests/wedding-budget-deposits.test.mjs`

**Interfaces:**
- Consumes: `WeddingBudgetItem.deposit_amount`.
- Produces: Budget create/update payloads containing `deposit_amount` and `is_deposited: deposit > 0`.

- [ ] **Step 1: Add modal state**

Inside `BudgetModal`, after `actualCost` state:

```typescript
const [depositAmount, setDepositAmount] = useState('');
```

- [ ] **Step 2: Populate modal state on edit/reset**

In the edit branch:

```typescript
setDepositAmount((itemToEdit.deposit_amount ?? 0).toString());
```

In the reset branch:

```typescript
setDepositAmount('');
```

- [ ] **Step 3: Save deposit amount**

In `handleSubmit`, after parsing `act`:

```typescript
const deposit = parseFloat(depositAmount) || 0;
```

Update the edit payload:

```typescript
updateBudgetItem(itemToEdit.id, {
  category,
  title,
  estimated_cost: est,
  actual_cost: act,
  deposit_amount: deposit,
  is_deposited: deposit > 0,
  event_id: eventId,
  note,
});
```

Update the create payload:

```typescript
addBudgetItem({
  category,
  title,
  estimated_cost: est,
  actual_cost: act,
  deposit_amount: deposit,
  is_deposited: deposit > 0,
  event_id: eventId,
  note,
});
```

- [ ] **Step 4: Add the input**

Replace the two-column cost grid with a three-column responsive grid:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
```

Add this field after `Chi thực tế (VNĐ)`:

```tsx
<div>
  <label className="block text-xs font-semibold text-slate-600 mb-1">Tiền đã cọc (VNĐ)</label>
  <input
    type="number"
    aria-label="Nhập tiền đã cọc"
    value={depositAmount}
    onChange={(e) => setDepositAmount(e.target.value)}
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
  />
</div>
```

- [ ] **Step 5: Remove manual deposit checkbox**

Delete the `isDeposited` state, its edit/reset assignments, and the checkbox block labeled `Đã thanh toán tiền đặt cọc khoản này?`. Deposit status is now derived from `deposit_amount > 0`.

- [ ] **Step 6: Run tests**

Run: `node --test tests/wedding-budget-deposits.test.mjs`

Expected: still FAIL until budget and overview views are updated.

- [ ] **Step 7: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: PASS or fail only on view fields not yet added.

- [ ] **Step 8: Commit modal changes**

```bash
git add src/components/wedding/modals/WeddingModals.tsx
git commit -m "feat: capture wedding budget deposits"
```

---

### Task 4: Budget and Overview Deposit Display

**Files:**
- Modify: `src/components/wedding/tabs/WeddingBudgetTab.tsx`
- Modify: `src/components/wedding/tabs/WeddingOverviewTab.tsx`
- Test: `tests/wedding-budget-deposits.test.mjs`

**Interfaces:**
- Consumes: `WeddingBudgetItem.deposit_amount`, `WeddingSummary.totalDepositedBudget`, `WeddingSummary.totalRemainingPayment`.
- Produces: UI showing total deposits and remaining payment.

- [ ] **Step 1: Add filtered deposit totals**

In `WeddingBudgetTab.tsx`, after `totalAct`:

```typescript
const totalDeposits = filteredBudgets.reduce((acc, b) => acc + b.deposit_amount, 0);
const totalRemainingPayment = filteredBudgets.reduce(
  (acc, b) => acc + Math.max(b.actual_cost - b.deposit_amount, 0),
  0
);
```

- [ ] **Step 2: Update summary cards**

Change the summary grid to five cards on desktop:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4">
```

Add a card after `Tổng Đã Chi Thực Tế`:

```tsx
<div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Tổng Đã Cọc</div>
  <div className="text-base sm:text-xl font-bold text-amber-600 mt-1">{formatCurrency(totalDeposits)}</div>
</div>
```

Change the remaining card label to:

```tsx
<div className="text-[11px] sm:text-xs text-slate-500 font-medium">Còn Phải Trả</div>
<div className="text-base sm:text-xl font-bold text-blue-600 mt-1">
  {formatCurrency(totalRemainingPayment)}
</div>
```

Keep target budget remaining visible by adding a small line inside the target budget card:

```tsx
<div className="text-[10px] text-slate-500 mt-1">
  Còn lại chi được: <span className={targetBudget - totalAct >= 0 ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}>{formatCurrency(targetBudget - totalAct)}</span>
</div>
```

- [ ] **Step 3: Update mobile card amounts**

Inside each mobile item map, add:

```typescript
const remainingPayment = Math.max(item.actual_cost - item.deposit_amount, 0);
```

Change the amount grid to three columns and include:

```tsx
<div>
  <span className="text-slate-500">Đã cọc:</span>
  <div className="font-bold text-amber-600">{formatCurrency(item.deposit_amount)}</div>
</div>
```

Add a line in the footer:

```tsx
<span className="font-semibold text-blue-600">Còn phải trả: {formatCurrency(remainingPayment)}</span>
```

- [ ] **Step 4: Update desktop table**

Add `Đã cọc (VNĐ)` and `Còn phải trả` columns after `Thực tế (VNĐ)`.

Inside each desktop row map, add:

```typescript
const remainingPayment = Math.max(item.actual_cost - item.deposit_amount, 0);
```

Render:

```tsx
<td className="py-4 px-4 text-right font-bold text-amber-600 whitespace-nowrap">
  {formatCurrency(item.deposit_amount)}
</td>

<td className="py-4 px-4 text-right font-bold text-blue-600 whitespace-nowrap">
  {formatCurrency(remainingPayment)}
</td>
```

Change the deposit status button text to include the amount:

```tsx
<span>{item.deposit_amount > 0 ? 'Đã cọc' : 'Chưa cọc'}</span>
```

Set the empty row colspan to match the new column count.

- [ ] **Step 5: Update overview budget card**

In `WeddingOverviewTab.tsx`, inside the budget KPI card details, add:

```tsx
<div className="flex items-center justify-between">
  <span>Đã cọc:</span>
  <strong className="text-amber-600 font-bold">{formatCurrency(summary.totalDepositedBudget)}</strong>
</div>
<div className="flex items-center justify-between">
  <span>Còn phải trả:</span>
  <span className="font-semibold text-blue-600">{formatCurrency(summary.totalRemainingPayment)}</span>
</div>
```

Keep the progress calculation as:

```typescript
summary.totalActualExpense / summary.targetBudget
```

- [ ] **Step 6: Run focused test**

Run: `node --test tests/wedding-budget-deposits.test.mjs`

Expected: PASS.

- [ ] **Step 7: Run existing wedding tests**

Run: `node --test tests/wedding-supabase-linkage.test.mjs tests/no-sample-data.test.mjs`

Expected: PASS.

- [ ] **Step 8: Run full verification**

Run: `npm run lint`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 9: Commit view changes**

```bash
git add src/components/wedding/tabs/WeddingBudgetTab.tsx src/components/wedding/tabs/WeddingOverviewTab.tsx tests/wedding-budget-deposits.test.mjs
git commit -m "feat: show wedding budget deposit balances"
```

---

## Self-Review

- Spec coverage: Data model, Supabase schema, local legacy normalization, modal input, Budget tab totals, Overview display, no double-counting, and tests are all covered.
- Red-flag scan: No incomplete markers or vague implementation steps remain.
- Type consistency: The plan consistently uses `deposit_amount`, `totalDepositedBudget`, and `totalRemainingPayment`.
