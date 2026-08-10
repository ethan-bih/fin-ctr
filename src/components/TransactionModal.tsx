'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import { X, ArrowDownRight, ArrowUpRight, Calendar, FileText, Tag, Banknote } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const { categories, addTransaction, formatCurrency } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('cat-food');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);
  const selectedCategory = categories.find((c) => c.id === categoryId) || filteredCategories[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        type,
        amount: numericAmount,
        category_id: selectedCategory?.id || 'cat-other-exp',
        category_name: selectedCategory?.name || 'Khác',
        category_icon: selectedCategory?.icon || 'MoreHorizontal',
        category_color: selectedCategory?.color || '#64748b',
        note,
        date,
      });

      // Reset form
      setAmount('');
      setNote('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-2xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          Ghi Nhận Giao Dịch Mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const firstExp = categories.find((c) => c.type === 'expense');
                if (firstExp) setCategoryId(firstExp.id);
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              <span>Tiền Chi (Khoản chi)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('income');
                const firstInc = categories.find((c) => c.type === 'income');
                if (firstInc) setCategoryId(firstInc.id);
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>Tiền Thu (Thu nhập)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              Số tiền (VNĐ)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="0"
                value={amount ? Number(amount.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(raw);
                }}
                className="w-full bg-slate-900/90 text-2xl font-bold text-slate-100 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                đ
              </span>
            </div>
            {amount && !isNaN(Number(amount)) && (
              <p className="text-xs text-emerald-400 font-medium mt-1">
                = {formatCurrency(Number(amount))}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Danh mục
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-slate-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <DynamicIcon name={cat.icon} color={cat.color} className="w-5 h-5 mb-1" />
                    <span className="truncate w-full text-center text-[11px] font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Ngày giao dịch
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Ghi chú
              </label>
              <input
                type="text"
                placeholder="Vd: Đi ăn tối, Mua đồ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
              type === 'expense'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 shadow-rose-500/25'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25'
            }`}
          >
            {isSubmitting ? 'Đang lưu...' : type === 'expense' ? 'Xác Nhận Chi Tiêu' : 'Xác Nhận Thu Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};
