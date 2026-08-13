'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { Plus, Trash2, Calendar, Sparkles, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, formatCurrency, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color] = useState('#10b981');
  const [icon] = useState('Target');

  // Quick Deposit modal state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount.replace(/[^0-9]/g, ''));
    if (isNaN(numTarget) || numTarget <= 0) {
      alert('Vui lòng nhập mục tiêu lớn hơn 0');
      return;
    }

    await addSavingsGoal({
      title,
      target_amount: numTarget,
      target_date: targetDate,
      category_color: color,
      icon,
    });

    setTitle('');
    setTargetAmount('');
    setTargetDate('');
    setIsAdding(false);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;

    const goal = savingsGoals.find((g) => g.id === depositGoalId);
    if (!goal) return;

    const numAmt = parseFloat(depositAmount.replace(/[^0-9]/g, ''));
    if (isNaN(numAmt) || numAmt <= 0) return;

    const newTotal = goal.current_amount + numAmt;
    await updateSavingsGoal(goal.id, newTotal);

    // Trigger confetti if goal reached!
    if (newTotal >= goal.target_amount && goal.current_amount < goal.target_amount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setDepositGoalId(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900">Quỹ Tiết Kiệm</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Thiết lập các mục tiêu tài chính tích lũy dài hạn</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Mục Tiêu</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {isAdding && (
        <form onSubmit={handleAddGoal} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-900 text-base">Thêm Mục Tiêu Tiết Kiệm Mới</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tên mục tiêu (*)</label>
              <input
                type="text"
                required
                placeholder="VD: Mua xe máy mới..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số tiền mục tiêu (VNĐ)</label>
              <input
                type="number"
                required
                placeholder="VD: 50000000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Thời hạn mong muốn</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Lưu Mục Tiêu
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsGoals.map((goal) => {
          const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
          const isDone = goal.current_amount >= goal.target_amount;

          return (
            <div
              key={goal.id}
              className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between space-y-4 shadow-xs ${
                isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: goal.category_color || '#10b981' }}
                    >
                      <DynamicIcon name={goal.icon || 'Target'} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        <span>{goal.title}</span>
                        {isDone && <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Hạn: {new Date(goal.target_date).toLocaleDateString('vi-VN')}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-500">Đã tích lũy: <strong className="text-emerald-600">{formatCurrency(goal.current_amount)}</strong></span>
                  <span className="text-xs font-semibold text-slate-600">Mục tiêu: {formatCurrency(goal.target_amount)}</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">{percent}% hoàn thành</span>
                <button
                  onClick={() => {
                    setDepositGoalId(goal.id);
                    setDepositAmount('');
                  }}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nạp tiền</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Nạp Tiền Vào Mục Tiêu Tiết Kiệm</h3>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số tiền nạp thêm (VNĐ)</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 1000000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Nạp Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
