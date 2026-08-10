export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // Lucide icon name
  color: string;
  user_id?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  note: string;
  date: string; // ISO String (YYYY-MM-DD)
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  monthly_limit: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category_color: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  currency: 'VND' | 'USD';
}

export interface FinanceSummary {
  totalBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  netSavingsMonth: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}
