'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal, Category, UserProfile, JarType } from '@/lib/types';
import { DEFAULT_CATEGORIES, INITIAL_MOCK_TRANSACTIONS, INITIAL_MOCK_BUDGETS, INITIAL_MOCK_SAVINGS, DEFAULT_JARS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export type ActiveTabType = 'dashboard' | 'transactions' | 'budgets' | 'savings' | 'reports' | 'settings' | 'jars';

interface FinanceContextType {
  user: UserProfile | null;
  isLiveMode: boolean;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  jarRatios: Record<JarType, number>;
  updateJarRatios: (newRatios: Record<JarType, number>) => void;
  
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  addBudget: (bgt: Omit<Budget, 'id' | 'user_id'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'current_amount'>) => Promise<void>;
  updateSavingsGoal: (id: string, amount: number) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetDemoData: () => void;
  formatCurrency: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const LOCAL_STORAGE_TX_KEY = 'pf_transactions_v1';
const LOCAL_STORAGE_BGT_KEY = 'pf_budgets_v1';
const LOCAL_STORAGE_SAVING_KEY = 'pf_savings_v1';
const LOCAL_STORAGE_JAR_RATIOS_KEY = 'pf_jar_ratios_v1';

const DEFAULT_RATIOS: Record<JarType, number> = {
  NEC: 55,
  FFA: 10,
  LTSS: 10,
  EDU: 10,
  PLAY: 10,
  GIVE: 5,
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [user, setUser] = useState<UserProfile | null>({
    id: 'demo-user',
    email: 'banbe@demo.vn',
    full_name: 'Dùng thử (Demo)',
    currency: 'VND',
  });
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [jarRatios, setJarRatios] = useState<Record<JarType, number>>(DEFAULT_RATIOS);

  // Format currency helper
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Update Jar Ratios
  const updateJarRatios = (newRatios: Record<JarType, number>) => {
    setJarRatios(newRatios);
    localStorage.setItem(LOCAL_STORAGE_JAR_RATIOS_KEY, JSON.stringify(newRatios));
  };

  // Initialize Data
  useEffect(() => {
    const supabase = createClient();

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user: authUser } }) => {
        if (authUser) {
          setIsLiveMode(true);
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email || 'Người dùng',
            avatar_url: authUser.user_metadata?.avatar_url,
            currency: 'VND',
          });
          fetchSupabaseData(authUser.id);
        } else {
          loadLocalStorageData();
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setIsLiveMode(true);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || 'Người dùng',
            avatar_url: session.user.user_metadata?.avatar_url,
            currency: 'VND',
          });
          fetchSupabaseData(session.user.id);
        } else {
          setIsLiveMode(false);
          setUser({
            id: 'demo-user',
            email: 'banbe@demo.vn',
            full_name: 'Dùng thử (Demo)',
            currency: 'VND',
          });
          loadLocalStorageData();
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      loadLocalStorageData();
    }
  }, []);

  const loadLocalStorageData = () => {
    try {
      const savedTx = localStorage.getItem(LOCAL_STORAGE_TX_KEY);
      const savedBgt = localStorage.getItem(LOCAL_STORAGE_BGT_KEY);
      const savedSvg = localStorage.getItem(LOCAL_STORAGE_SAVING_KEY);
      const savedRatios = localStorage.getItem(LOCAL_STORAGE_JAR_RATIOS_KEY);

      setTransactions(savedTx ? JSON.parse(savedTx) : INITIAL_MOCK_TRANSACTIONS);
      setBudgets(savedBgt ? JSON.parse(savedBgt) : INITIAL_MOCK_BUDGETS);
      setSavingsGoals(savedSvg ? JSON.parse(savedSvg) : INITIAL_MOCK_SAVINGS);
      if (savedRatios) setJarRatios(JSON.parse(savedRatios));
    } catch {
      setTransactions(INITIAL_MOCK_TRANSACTIONS);
      setBudgets(INITIAL_MOCK_BUDGETS);
      setSavingsGoals(INITIAL_MOCK_SAVINGS);
      setJarRatios(DEFAULT_RATIOS);
    }
  };

  const fetchSupabaseData = async (userId: string) => {
    const supabase = createClient();
    if (!supabase) return;

    const { data: txData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (txData) setTransactions(txData);

    const { data: bgtData } = await supabase.from('budgets').select('*').eq('user_id', userId);
    if (bgtData) setBudgets(bgtData);

    const { data: svgData } = await supabase.from('savings_goals').select('*').eq('user_id', userId);
    if (svgData) setSavingsGoals(svgData);
  };

  // Add Transaction
  const addTransaction = async (txInput: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    const supabase = createClient();

    // Map category to jar if missing
    const category = categories.find((c) => c.id === txInput.category_id);
    const jarId = txInput.jar_id || category?.jar_id;

    const newTx: Transaction = {
      ...txInput,
      jar_id: jarId,
      id: isLiveMode ? undefined! : 'tx-' + Date.now(),
      user_id: user?.id || 'demo-user',
      created_at: new Date().toISOString(),
    };

    if (isLiveMode && supabase && user) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: txInput.type,
          amount: txInput.amount,
          category_id: txInput.category_id,
          category_name: txInput.category_name,
          category_icon: txInput.category_icon,
          category_color: txInput.category_color,
          jar_id: jarId,
          note: txInput.note,
          date: txInput.date,
        }])
        .select();

      if (error) console.error('Error adding transaction:', error);
      else if (data && data[0]) {
        setTransactions((prev) => [data[0], ...prev]);
      }
    } else {
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(updated));
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id: string) => {
    const supabase = createClient();
    if (isLiveMode && supabase) {
      await supabase.from('transactions').delete().eq('id', id);
    }
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    if (!isLiveMode) localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(updated));
  };

  // Add Budget
  const addBudget = async (bgtInput: Omit<Budget, 'id' | 'user_id'>) => {
    const supabase = createClient();
    const newBgt: Budget = {
      ...bgtInput,
      id: isLiveMode ? undefined! : 'bgt-' + Date.now(),
      user_id: user?.id || 'demo-user',
    };

    if (isLiveMode && supabase && user) {
      const { data } = await supabase.from('budgets').upsert([{
        user_id: user.id,
        category_id: bgtInput.category_id,
        category_name: bgtInput.category_name,
        category_icon: bgtInput.category_icon,
        category_color: bgtInput.category_color,
        monthly_limit: bgtInput.monthly_limit,
      }]).select();

      if (data && data[0]) {
        setBudgets((prev) => [...prev.filter(b => b.category_id !== bgtInput.category_id), data[0]]);
      }
    } else {
      const filtered = budgets.filter((b) => b.category_id !== bgtInput.category_id);
      const updated = [...filtered, newBgt];
      setBudgets(updated);
      localStorage.setItem(LOCAL_STORAGE_BGT_KEY, JSON.stringify(updated));
    }
  };

  const deleteBudget = async (id: string) => {
    const supabase = createClient();
    if (isLiveMode && supabase) {
      await supabase.from('budgets').delete().eq('id', id);
    }
    const updated = budgets.filter((b) => b.id !== id);
    setBudgets(updated);
    if (!isLiveMode) localStorage.setItem(LOCAL_STORAGE_BGT_KEY, JSON.stringify(updated));
  };

  // Add Savings Goal
  const addSavingsGoal = async (goalInput: Omit<SavingsGoal, 'id' | 'user_id' | 'current_amount'>) => {
    const supabase = createClient();
    const newGoal: SavingsGoal = {
      ...goalInput,
      id: isLiveMode ? undefined! : 'svg-' + Date.now(),
      user_id: user?.id || 'demo-user',
      current_amount: 0,
    };

    if (isLiveMode && supabase && user) {
      const { data } = await supabase.from('savings_goals').insert([{
        user_id: user.id,
        title: goalInput.title,
        target_amount: goalInput.target_amount,
        current_amount: 0,
        target_date: goalInput.target_date,
        category_color: goalInput.category_color,
        icon: goalInput.icon,
      }]).select();

      if (data && data[0]) setSavingsGoals((prev) => [data[0], ...prev]);
    } else {
      const updated = [newGoal, ...savingsGoals];
      setSavingsGoals(updated);
      localStorage.setItem(LOCAL_STORAGE_SAVING_KEY, JSON.stringify(updated));
    }
  };

  const updateSavingsGoal = async (id: string, newAmount: number) => {
    const supabase = createClient();
    if (isLiveMode && supabase) {
      await supabase.from('savings_goals').update({ current_amount: newAmount }).eq('id', id);
    }
    const updated = savingsGoals.map((g) => (g.id === id ? { ...g, current_amount: newAmount } : g));
    setSavingsGoals(updated);
    if (!isLiveMode) localStorage.setItem(LOCAL_STORAGE_SAVING_KEY, JSON.stringify(updated));
  };

  const deleteSavingsGoal = async (id: string) => {
    const supabase = createClient();
    if (isLiveMode && supabase) {
      await supabase.from('savings_goals').delete().eq('id', id);
    }
    const updated = savingsGoals.filter((g) => g.id !== id);
    setSavingsGoals(updated);
    if (!isLiveMode) localStorage.setItem(LOCAL_STORAGE_SAVING_KEY, JSON.stringify(updated));
  };

  const loginWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) {
      alert('Vui lòng cấu hình NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong môi trường Vercel / .env.local để đăng nhập Google OAuth!');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) alert('Lỗi đăng nhập Google: ' + error.message);
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLiveMode(false);
    setUser({
      id: 'demo-user',
      email: 'banbe@demo.vn',
      full_name: 'Dùng thử (Demo)',
      currency: 'VND',
    });
    loadLocalStorageData();
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_TX_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BGT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SAVING_KEY);
    localStorage.removeItem(LOCAL_STORAGE_JAR_RATIOS_KEY);
    setTransactions(INITIAL_MOCK_TRANSACTIONS);
    setBudgets(INITIAL_MOCK_BUDGETS);
    setSavingsGoals(INITIAL_MOCK_SAVINGS);
    setJarRatios(DEFAULT_RATIOS);
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        isLiveMode,
        activeTab,
        setActiveTab,
        transactions,
        categories,
        budgets,
        savingsGoals,
        jarRatios,
        updateJarRatios,
        addTransaction,
        deleteTransaction,
        addBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        loginWithGoogle,
        logout,
        resetDemoData,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
