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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Quản Lý Hạn Mức Chi Tiêu</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Đặt hạn mức ngân sách hàng tháng cho từng danh mục để tránh vượt chi</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Hạn Mức Mới</span>
        </button>
      </div>

      {/* Add Budget Form */}
      {isAdding && (
        <form onSubmit={handleAddBudget} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-900 text-base">Thiết Lập Ngân Sách Hàng Tháng</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chọn danh mục chi tiêu</label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hạn mức chi tiêu tháng (VNĐ)</label>
              <input
                type="number"
                placeholder="VD: 5000000"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Lưu Ngân Sách
            </button>
          </div>
        </form>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((bgt) => {
          const spent = categorySpending[bgt.category_id] || 0;
          const percent = Math.min(Math.round((spent / bgt.monthly_limit) * 100), 100);
          const isOver = spent > bgt.monthly_limit;
          const isNear = spent >= bgt.monthly_limit * 0.8 && !isOver;

          return (
            <div
              key={bgt.id}
              className={`bg-white rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xs ${
                isOver ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: bgt.category_color || '#3b82f6' }}
                    >
                      <DynamicIcon name={bgt.category_icon || 'PieChart'} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{bgt.category_name}</h3>
                      <p className="text-xs text-slate-500">Hạn mức tháng này</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBudget(bgt.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amounts */}
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-500">Đã dùng: <strong className={isOver ? 'text-rose-600' : 'text-slate-900'}>{formatCurrency(spent)}</strong></span>
                  <span className="text-xs font-semibold text-slate-600">/ {formatCurrency(bgt.monthly_limit)}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {isOver ? (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Vượt hạn mức {formatCurrency(spent - bgt.monthly_limit)}
                  </span>
                ) : isNear ? (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sắp chạm hạn mức ({percent}%)
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Còn lại {formatCurrency(bgt.monthly_limit - spent)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
