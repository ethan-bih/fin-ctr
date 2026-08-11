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

    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        if (!map[tx.category_name]) {
          map[tx.category_name] = {
            name: tx.category_name,
            amount: 0,
            color: tx.category_color || '#3b82f6',
            icon: tx.category_icon || 'PieChart',
          };
        }
        map[tx.category_name].amount += tx.amount;
      });

    const sorted = Object.values(map).sort((a, b) => b.amount - a.amount);
    return sorted.length > 0 ? sorted[0] : null;
  }, [transactions]);

  // Monthly Comparison Chart Data
  const chartData = useMemo(() => {
    const monthsMap: { [key: string]: { month: string; Chi_tiêu: number } } = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `Thg ${d.getMonth() + 1}`;
      monthsMap[key] = { month: label, Chi_tiêu: 0 };
    }

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const key = tx.date.substring(0, 7);
        if (monthsMap[key]) {
          monthsMap[key].Chi_tiêu += tx.amount;
        }
      }
    });

    return Object.values(monthsMap);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base sm:text-xl font-bold text-slate-900">Báo Cáo &amp; Phân Tích</h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Tổng hợp xu hướng chi tiêu và so sánh giữa các tháng</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Trung Bình Chi Tiêu Hàng Ngày</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(metrics.avgDailyExpense)}</div>
          <p className="text-xs text-slate-500 mt-1">Dựa trên số ngày thực tế tháng này</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">So Với Tháng Trước</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-2xl font-bold ${metrics.expenseDiffPercent > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {metrics.expenseDiffPercent > 0 ? `+${metrics.expenseDiffPercent}%` : `${metrics.expenseDiffPercent}%`}
            </span>
            {metrics.expenseDiffPercent > 0 ? (
              <TrendingUp className="w-5 h-5 text-rose-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Biến động chi tiêu so tháng cũ</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Danh Mục Chi Nhiều Nhất</div>
          {topCategory ? (
            <div className="flex items-center space-x-2 mt-1">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: topCategory.color }}
              >
                <DynamicIcon name={topCategory.icon} className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-900 text-sm truncate">{topCategory.name}</div>
                <div className="text-xs text-slate-500">{formatCurrency(topCategory.amount)}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-400 mt-1">Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">So Sánh Chi Tiêu 6 Tháng Gần Đây</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '8px' }}
                formatter={(val: any) => [formatCurrency(Number(val || 0)), 'Chi tiêu']}
              />
              <Bar dataKey="Chi_tiêu" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
