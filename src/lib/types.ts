export type TransactionType = 'income' | 'expense';

export type JarType = 'NEC' | 'FFA' | 'LTSS' | 'EDU' | 'PLAY' | 'GIVE';

export interface JarConfig {
  id: JarType;
  name: string;
  code: string;
  percent: number;
  description: string;
  color: string;
  bgGradient: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  jar_id?: JarType;
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
  jar_id?: JarType;
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

export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  currency: 'VND' | 'USD';
  role?: UserRole;
  couple_partner_name?: string;
}

export interface FinanceSummary {
  totalBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  netSavingsMonth: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}
