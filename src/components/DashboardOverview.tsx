'use client';

import React, { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Trash2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardOverviewProps {
  onOpenAddModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onOpenAddModal }) => {
  const { transactions, formatCurrency, deleteTransaction, setActiveTab } = useFinance();

  // Calculations
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalIncomeMonth = 0;
    let totalExpenseMonth = 0;
    let allTimeBalance = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const isThisMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;

      if (tx.type === 'income') {
        allTimeBalance += tx.amount;
        if (isThisMonth) totalIncomeMonth += tx.amount;
      } else {
        allTimeBalance -= tx.amount;
        if (isThisMonth) totalExpenseMonth += tx.amount;
      }
    });

    const netSavingsMonth = totalIncomeMonth - totalExpenseMonth;

    return {
      allTimeBalance,
      totalIncomeMonth,
      totalExpenseMonth,
      netSavingsMonth,
    };
  }, [transactions]);

  // Chart 1 Data: Cash Flow over last 6 months
  const monthlyChartData = useMemo(() => {
    const monthsMap: { [key: string]: { month: string; income: number; expense: number } } = {};

    // Generate last 6 months keys
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `Thg ${d.getMonth() + 1}`;
      monthsMap[key] = { month: label, income: 0, expense: 0 };
    }

    transactions.forEach((tx) => {
      const key = tx.date.substring(0, 7);
      if (monthsMap[key]) {
        if (tx.type === 'income') monthsMap[key].income += tx.amount;
        else monthsMap[key].expense += tx.amount;
      }
    });

    return Object.values(monthsMap);
  }, [transactions]);

  // Chart 2 Data: Expense by Category
  const categoryPieData = useMemo(() => {
    const catMap: { [key: string]: { name: string; value: number; color: string } } = {};

    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        if (!catMap[tx.category_id]) {
          catMap[tx.category_id] = {
            name: tx.category_name,
            value: 0,
            color: tx.category_color || '#3b82f6',
          };
        }
        catMap[tx.category_id].value += tx.amount;
      });

    return Object.values(catMap).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900">Tổng Quan Tài Chính</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Theo dõi thu chi và tình hình tài chính cá nhân</p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ghi Thu/Chi</span>
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tổng Số Dư Tích Lũy</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {formatCurrency(stats.allTimeBalance)}
          </div>
          <p className="text-xs text-slate-500">Tất cả tài sản hiện có</p>
        </div>

        {/* Monthly Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thu Nhập Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mb-1">
            +{formatCurrency(stats.totalIncomeMonth)}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Tổng thu nhập phát sinh</p>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chi Tiêu Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mb-1">
            -{formatCurrency(stats.totalExpenseMonth)}
          </div>
          <p className="text-xs text-rose-700 font-medium">Tổng khoản đã chi tiêu</p>
        </div>

        {/* Net Savings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tiết Kiệm Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1 ${stats.netSavingsMonth >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
            {formatCurrency(stats.netSavingsMonth)}
          </div>
          <p className="text-xs text-slate-500">Thu nhập dư ra sau chi tiêu</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Cash Flow */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Xu Hướng Dòng Tiền (6 Tháng)</h3>
              <p className="text-xs text-slate-500">So sánh Thu nhập vs Chi tiêu theo thời gian</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Thu nhập
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Chi tiêu
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0)), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Expense Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Tỷ Trọng Chi Tiêu</h3>
            <p className="text-xs text-slate-500 mb-4">Phân bổ khoản chi theo danh mục</p>

            {categoryPieData.length > 0 ? (
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }}
                      formatter={(val: any) => [formatCurrency(Number(val || 0)), '']}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu chi tiêu
              </div>
            )}
          </div>

          {/* Top 3 categories summary */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {categoryPieData.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 shrink-0">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Giao Dịch Gần Đây</h3>
            <p className="text-xs text-slate-500">Các khoản thu chi mới nhất</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả sổ giao dịch &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: tx.category_color || '#10b981' }}
                >
                  <DynamicIcon name={tx.category_icon || 'Wallet'} className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-900 text-sm truncate">{tx.category_name}</div>
                  <div className="text-xs text-slate-500 truncate">{tx.note || tx.date}</div>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center space-x-3">
                <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
