'use client';

import React, { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const ReportsAnalytics: React.FC = () => {
  const { transactions, formatCurrency } = useFinance();

  // Summary Metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const prevMonthDate = new Date(curYear, curMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    let curIncome = 0;
    let curExpense = 0;
    let prevIncome = 0;
    let prevExpense = 0;

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (d.getMonth() === curMonth && d.getFullYear() === curYear) {
        if (tx.type === 'income') curIncome += tx.amount;
        else curExpense += tx.amount;
      } else if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
        if (tx.type === 'income') prevIncome += tx.amount;
        else prevExpense += tx.amount;
      }
    });

    const expenseDiffPercent = prevExpense > 0 ? Math.round(((curExpense - prevExpense) / prevExpense) * 100) : 0;
    const avgDailyExpense = Math.round(curExpense / new Date().getDate());

    return {
      curIncome,
      curExpense,
      prevExpense,
      expenseDiffPercent,
      avgDailyExpense,
    };
  }, [transactions]);

  // Top spending category
  const topCategory = useMemo(() => {
    const map: { [name: string]: { name: string; amount: number; color: string; icon: string } } = {};
    const curMonth = new Date().getMonth();

    transactions
      .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === curMonth)
      .forEach((t) => {
        if (!map[t.category_id]) {
          map[t.category_id] = { name: t.category_name, amount: 0, color: t.category_color, icon: t.category_icon };
        }
        map[t.category_id].amount += t.amount;
      });

    const sorted = Object.values(map).sort((a, b) => b.amount - a.amount);
    return sorted[0] || null;
  }, [transactions]);

  // Bar chart data for top categories
  const barChartData = useMemo(() => {
    const map: { [name: string]: { name: string; amount: number; color: string } } = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!map[t.category_name]) {
          map[t.category_name] = { name: t.category_name, amount: 0, color: t.category_color || '#3b82f6' };
        }
        map[t.category_name].amount += t.amount;
      });

    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Báo Cáo & Phân Tích Tài Chính</h2>
        <p className="text-sm text-slate-400">Phân tích chuyên sâu về thói quen chi tiêu và tăng trưởng số dư</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Chi Tiêu Trung Bình / Ngày</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {formatCurrency(metrics.avgDailyExpense)}
          </div>
          <p className="text-xs text-slate-400">Tính trên số ngày đã qua trong tháng</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>So Với Tháng Trước</span>
            {metrics.expenseDiffPercent > 0 ? (
              <TrendingUp className="w-4 h-4 text-rose-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className={`text-2xl font-black ${metrics.expenseDiffPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {metrics.expenseDiffPercent > 0 ? `+${metrics.expenseDiffPercent}%` : `${metrics.expenseDiffPercent}%`}
          </div>
          <p className="text-xs text-slate-400">
            {metrics.expenseDiffPercent > 0 ? 'Chi tiêu tăng hơn tháng trước' : 'Tiết kiệm hơn so với tháng trước'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Danh Mục Chi Nhiều Nhất</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          {topCategory ? (
            <div>
              <div className="text-xl font-bold text-amber-400 truncate">{topCategory.name}</div>
              <p className="text-xs text-slate-300 font-semibold">{formatCurrency(topCategory.amount)}</p>
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-500">Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-200">Top Danh Mục Chi Tiêu Cao Nhất</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [formatCurrency(Number(val)), 'Số tiền chi']}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
