'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { PieChart, Plus, Trash2, AlertTriangle, CheckCircle, Banknote } from 'lucide-react';

export const BudgetTracker: React.FC = () => {
  const { budgets, categories, transactions, formatCurrency, addBudget, deleteBudget } = useFinance();

  const [selectedCatId, setSelectedCatId] = useState<string>('cat-food');
  const [limitAmount, setLimitAmount] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  // Compute total spending per category for current month
  const categorySpending = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const spendingMap: { [catId: string]: number } = {};

    transactions
      .filter((tx) => {
        const d = new Date(tx.date);
        return tx.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach((tx) => {
        spendingMap[tx.category_id] = (spendingMap[tx.category_id] || 0) + tx.amount;
      });

    return spendingMap;
  }, [transactions]);

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericLimit = parseFloat(limitAmount.replace(/[^0-9]/g, ''));
    if (isNaN(numericLimit) || numericLimit <= 0) {
      alert('Vui lòng nhập hạn mức lớn hơn 0');
      return;
    }

    const selectedCategory = expenseCategories.find((c) => c.id === selectedCatId) || expenseCategories[0];

    await addBudget({
      category_id: selectedCategory.id,
      category_name: selectedCategory.name,
      category_icon: selectedCategory.icon,
      category_color: selectedCategory.color,
      monthly_limit: numericLimit,
    });

    setLimitAmount('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Quản Lý Hạn Mức Chi Tiêu</h2>
          <p className="text-sm text-slate-400">Đặt hạn mức ngân sách hàng tháng cho từng danh mục để tránh vượt chi</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thiết Lập Hạn Mức Mới</span>
        </button>
      </div>

      {/* Add Budget Form */}
      {isAdding && (
        <form onSubmit={handleAddBudget} className="glass-card rounded-2xl p-5 border border-indigo-500/30 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm">Tạo hoặc cập nhật hạn mức danh mục</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chọn Danh Mục Chi Tiêu</label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2.5 outline-none"
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Hạn Mức Tối Đa / Tháng (VNĐ)</label>
              <input
                type="text"
                placeholder="5,000,000"
                value={limitAmount ? Number(limitAmount.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                onChange={(e) => setLimitAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-900/90 text-sm font-bold text-slate-100 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
            >
              Lưu Hạn Mức
            </button>
          </div>
        </form>
      )}

      {/* Budgets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((bgt) => {
          const spent = categorySpending[bgt.category_id] || 0;
          const percent = Math.min(Math.round((spent / bgt.monthly_limit) * 100), 100);
          const isOver = spent > bgt.monthly_limit;
          const isWarning = percent >= 80 && !isOver;

          return (
            <div key={bgt.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${bgt.category_color}20` }}
                  >
                    <DynamicIcon name={bgt.category_icon} color={bgt.category_color} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{bgt.category_name}</h3>
                    <p className="text-xs text-slate-400">Hạn mức tháng</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteBudget(bgt.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Xóa hạn mức"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Đã chi: {formatCurrency(spent)}</span>
                  <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {percent}% / {formatCurrency(bgt.monthly_limit)}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                        : isWarning
                        ? 'bg-amber-500 shadow-lg shadow-amber-500/50'
                        : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Alert status */}
              {isOver ? (
                <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Đã vượt ngân sách {formatCurrency(spent - bgt.monthly_limit)}! Cần hạn chế chi tiêu.</span>
                </div>
              ) : isWarning ? (
                <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Cảnh báo: Đã đạt 80% hạn mức ngân sách tháng này!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Chi tiêu an toàn, còn lại {formatCurrency(bgt.monthly_limit - spent)}.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
