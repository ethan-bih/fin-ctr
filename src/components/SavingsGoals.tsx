'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { Target, Plus, Trash2, Calendar, Sparkles, PlusCircle, MinusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, formatCurrency, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#10b981');
  const [icon, setIcon] = useState('Target');

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

    setDepositAmount('');
    setDepositGoalId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Quỹ Tiết Kiệm & Mục Tiêu</h2>
          <p className="text-sm text-slate-400">Tích lũy tài chính cho các dự định lớn trong tương lai</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mục Tiêu Mới</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddGoal} className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm">Tạo mục tiêu tiết kiệm mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tên mục tiêu (VD: Mua Macbook, Du lịch)</label>
              <input
                type="text"
                required
                placeholder="VD: Quỹ dự phòng 6 tháng"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Số tiền mục tiêu (VNĐ)</label>
              <input
                type="text"
                required
                placeholder="50,000,000"
                value={targetAmount ? Number(targetAmount.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-900/90 text-sm font-bold text-slate-100 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ngày dự kiến hoàn thành</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Màu đại diện</label>
              <div className="flex items-center space-x-2">
                {['#10b981', '#6366f1', '#ec4899', '#f59e0b', '#06b6d4'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      color === c ? 'scale-110 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              Lưu Mục Tiêu
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {savingsGoals.map((goal) => {
          const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
          const isCompleted = goal.current_amount >= goal.target_amount;

          return (
            <div
              key={goal.id}
              className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isCompleted ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-slate-800'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Hoàn thành!
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${goal.category_color}20` }}
                  >
                    <DynamicIcon name={goal.icon || 'ShieldCheck'} color={goal.category_color} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm leading-snug">{goal.title}</h3>
                    {goal.target_date && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Hạn: {goal.target_date}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-400 font-medium">Hiện có:</span>
                    <span className="font-bold text-slate-100">{formatCurrency(goal.current_amount)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.category_color || '#10b981',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{percent}%</span>
                    <span>Mục tiêu: {formatCurrency(goal.target_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Deposit & Delete Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDepositGoalId(goal.id)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nạp thêm tiền</span>
                </button>

                <button
                  onClick={() => deleteSavingsGoal(goal.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Xóa mục tiêu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Quick Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-card rounded-2xl p-5 border border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm">Nạp Tiền Vào Quỹ Tiết Kiệm</h3>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Số tiền nạp thêm (VNĐ)</label>
                <input
                  type="text"
                  required
                  placeholder="1,000,000"
                  value={depositAmount ? Number(depositAmount.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                  onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-900 text-sm font-bold text-slate-100 border border-slate-700 rounded-xl px-3 py-2.5 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl"
                >
                  Cập Nhật Số Dư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
