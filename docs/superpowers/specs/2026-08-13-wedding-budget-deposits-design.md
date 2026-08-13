# Wedding Budget Deposits Design

## Goal

Wedding budget items need to track partial deposits. Today each item has planned cost, actual cost, and a boolean deposit flag, so the app can show whether a deposit happened but cannot calculate how much has already been paid or how much remains.

## Approved Behavior

Use `actual_cost` as the final or current expected total cost for the item. Add `deposit_amount` as the amount already paid as a deposit.

For each budget item:

- `estimated_cost`: planned amount.
- `actual_cost`: final or current expected total amount.
- `deposit_amount`: amount already paid upfront.
- `remaining_payment`: derived in the UI as `max(actual_cost - deposit_amount, 0)`.
- `is_deposited`: remains for compatibility and quick status. New saves should set it from whether `deposit_amount > 0`.

The app must not add `deposit_amount` on top of `actual_cost` when calculating used budget. Budget usage and remaining target budget continue to use `actual_cost`.

## Data Model

Add `deposit_amount: number` to `WeddingBudgetItem`.

Add `deposit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0)` to `public.wedding_budgets`, plus an `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` compatibility statement for existing databases.

Existing localStorage and Supabase rows without `deposit_amount` should behave as `0`. Rows with `is_deposited = true` should keep that boolean, but the app should not invent a deposit amount.

## UI Changes

In the budget item modal:

- Add a numeric field labeled `Tiền đã cọc (VNĐ)`.
- When creating or editing, save `deposit_amount`.
- If `deposit_amount > 0`, save `is_deposited: true`; otherwise save `is_deposited: false`.

In the budget tab:

- Add a summary value for total deposits across the current filtered list.
- Show `Đã cọc` with the deposit amount.
- Show `Còn phải trả` as `max(actual_cost - deposit_amount, 0)`.
- Keep `Còn Lại Chi Được` based on `targetBudget - totalActualCost`.

In the overview tab:

- Add deposit data to the budget overview card or chart only where it fits without crowding.
- The main progress bar remains based on `actual_cost / targetBudget`.

## Error Handling

Treat invalid or blank numeric input as `0`, matching the current budget form behavior. Clamp derived remaining payment at `0` so overpaid deposits do not show negative amounts.

## Testing

Add focused tests that verify:

- `WeddingBudgetItem` includes `deposit_amount`.
- `wedding_budgets` schema includes `deposit_amount` and compatibility migration.
- Budget UI references `deposit_amount`, total deposits, and remaining payment.
- Context summary or helper logic does not count deposits twice as spending.
