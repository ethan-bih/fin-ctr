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
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Tổng Quan Tài Chính</h2>
          <p className="text-sm text-slate-400">Theo dõi thu chi và tình hình tài chính tháng này</p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhận Giao Dịch</span>
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-l-4 border-l-indigo-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng Số Dư Tích Lũy</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 mb-1">
            {formatCurrency(stats.allTimeBalance)}
          </div>
          <p className="text-xs text-slate-400">Tất cả tài sản hiện có</p>
        </div>

        {/* Monthly Income */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-l-4 border-l-emerald-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Thu Nhập Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mb-1">
            +{formatCurrency(stats.totalIncomeMonth)}
          </div>
          <p className="text-xs text-emerald-500/80 font-medium">Tổng thu nhập phát sinh</p>
        </div>

        {/* Monthly Expense */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-l-4 border-l-rose-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chi Tiêu Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mb-1">
            -{formatCurrency(stats.totalExpenseMonth)}
          </div>
          <p className="text-xs text-rose-500/80 font-medium">Tổng khoản đã chi tiêu</p>
        </div>

        {/* Net Savings */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-l-4 border-l-teal-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tiết Kiệm Tháng Này</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-black mb-1 ${stats.netSavingsMonth >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
            {formatCurrency(stats.netSavingsMonth)}
          </div>
          <p className="text-xs text-slate-400">Thu nhập dư ra sau chi tiêu</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Cash Flow */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-200">Xu Hướng Dòng Tiền (6 Tháng)</h3>
              <p className="text-xs text-slate-400">So sánh Thu nhập vs Chi tiêu theo thời gian</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Thu nhập
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Chi tiêu
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [formatCurrency(Number(val)), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Expense Breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 mb-1">Tỷ Trọng Chi Tiêu</h3>
            <p className="text-xs text-slate-400 mb-4">Phân bổ khoản chi theo danh mục</p>

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
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val) => [formatCurrency(Number(val)), 'Số tiền']}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                Chưa có dữ liệu chi tiêu
              </div>
            )}
          </div>

          {/* Top 3 list */}
          <div className="space-y-2 mt-2 pt-3 border-t border-slate-800">
            {categoryPieData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-200">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-200">Giao Dịch Gần Đây</h3>
            <p className="text-xs text-slate-400">Các khoản thu chi vừa được cập nhật</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Xem tất cả ({transactions.length}) →
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tx.category_color}20` }}
                  >
                    <DynamicIcon name={tx.category_icon} color={tx.category_color} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{tx.category_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{tx.note || 'Không có ghi chú'}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`font-bold text-sm ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-all"
                    title="Xóa giao dịch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm">
            Chưa có giao dịch nào được ghi nhận. Hãy bấm &quot;Ghi Nhận Giao Dịch&quot; để bắt đầu!
          </div>
        )}
      </div>
    </div>
  );
};
