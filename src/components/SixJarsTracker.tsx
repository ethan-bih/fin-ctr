'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DEFAULT_JARS } from '@/lib/constants';
import { JarType } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import { Settings2, AlertCircle, CheckCircle2, Sliders, Info, RefreshCw } from 'lucide-react';

export const SixJarsTracker: React.FC = () => {
  const { transactions, categories, jarRatios, updateJarRatios, formatCurrency } = useFinance();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tempRatios, setTempRatios] = useState<Record<JarType, number>>(jarRatios);

  // Total Income & Expense calculations for current month
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    let totalIncome = 0;

    // Jar spent map
    const jarSpentMap: Record<JarType, number> = {
      NEC: 0,
      FFA: 0,
      LTSS: 0,
      EDU: 0,
      PLAY: 0,
      GIVE: 0,
    };

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (d.getMonth() === curMonth && d.getFullYear() === curYear) {
        if (tx.type === 'income') {
          totalIncome += tx.amount;
        } else if (tx.type === 'expense') {
          // Find jar for this transaction
          let jarId = tx.jar_id;
          if (!jarId) {
            const cat = categories.find((c) => c.id === tx.category_id);
            jarId = cat?.jar_id || 'NEC';
          }
          if (jarSpentMap[jarId]) {
            jarSpentMap[jarId] += tx.amount;
          } else {
            jarSpentMap['NEC'] += tx.amount;
          }
        }
      }
    });

    return {
      totalIncome,
      jarSpentMap,
    };
  }, [transactions, categories]);

  // Handle ratio slider changes
  const handleRatioChange = (id: JarType, val: number) => {
    setTempRatios((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  // Calculate sum of ratios
  const totalRatioPercent = Object.values(tempRatios).reduce((acc, curr) => acc + curr, 0);

  const handleSaveRatios = () => {
    if (totalRatioPercent !== 100) {
      alert(`Tổng phần trăm của 6 Hũ phải bằng đúng 100%! (Hiện tại là ${totalRatioPercent}%)`);
      return;
    }
    updateJarRatios(tempRatios);
    setIsConfiguring(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Mô Hình Quản Lý Tài Chính 6 Hũ (6 Jars)
          </h2>
          <p className="text-sm text-slate-400">
            Tự động phân bổ thu nhập tháng này ({formatCurrency(currentMonthData.totalIncome)}) vào 6 quỹ tài chính chuẩn
          </p>
        </div>
        <button
          onClick={() => {
            setTempRatios(jarRatios);
            setIsConfiguring(!isConfiguring);
          }}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all self-start sm:self-auto"
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Tùy Chỉnh Tỷ Lệ % Hũ</span>
        </button>
      </div>

      {/* Ratios Configuration Modal */}
      {isConfiguring && (
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-emerald-400" />
                Cấu Hình Tỷ Lệ % Phân Bổ 6 Hũ
              </h3>
              <p className="text-xs text-slate-400">Điều chỉnh tỷ lệ % phù hợp với chiến lược tài chính của bạn</p>
            </div>
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                totalRatioPercent === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              Tổng = {totalRatioPercent}% {totalRatioPercent !== 100 && '(Cần bằng 100%)'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DEFAULT_JARS.map((jar) => {
              const currentPercent = tempRatios[jar.id];

              return (
                <div key={jar.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                    <span className="flex items-center gap-1.5" style={{ color: jar.color }}>
                      <DynamicIcon name={jar.icon} size={16} />
                      {jar.name} ({jar.code})
                    </span>
                    <span className="text-emerald-400">{currentPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={currentPercent}
                    onChange={(e) => handleRatioChange(jar.id, parseInt(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setTempRatios({ NEC: 55, FFA: 10, LTSS: 10, EDU: 10, PLAY: 10, GIVE: 5 })}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đặt lại tỷ lệ 55-10-10-10-10-5 chuẩn</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRatios}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Lưu Tỷ Lệ %
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 Jars Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEFAULT_JARS.map((jar) => {
          const jarRatio = jarRatios[jar.id] || jar.percent;
          const allocatedAmount = (currentMonthData.totalIncome * jarRatio) / 100;
          const spentAmount = currentMonthData.jarSpentMap[jar.id] || 0;
          const remainingAmount = allocatedAmount - spentAmount;
          const usagePercent = allocatedAmount > 0 ? Math.min(Math.round((spentAmount / allocatedAmount) * 100), 100) : 0;
          const isOverBudget = spentAmount > allocatedAmount && allocatedAmount > 0;

          return (
            <div
              key={jar.id}
              className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isOverBudget ? 'border-rose-500/50 shadow-rose-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Background Glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: jar.color }}
              />

              <div>
                {/* Jar Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                      style={{ backgroundColor: `${jar.color}20`, border: `1px solid ${jar.color}40` }}
                    >
                      <DynamicIcon name={jar.icon} color={jar.color} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-100 text-sm">{jar.name}</h3>
                        <span
                          className="text-[11px] font-black px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${jar.color}20`, color: jar.color }}
                        >
                          {jar.code} ({jarRatio}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{jar.description}</p>
                    </div>
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 my-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Hạn mức được chia:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(allocatedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Đã chi tháng này:</span>
                    <span className="font-bold text-rose-400">-{formatCurrency(spentAmount)}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Còn lại trong hũ:</span>
                    <span className={remainingAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tiến độ tiêu hũ</span>
                    <span className={isOverBudget ? 'text-rose-400 font-bold' : ''}>{usagePercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usagePercent}%`,
                        backgroundColor: isOverBudget ? '#ef4444' : jar.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Alert */}
              {isOverBudget ? (
                <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Đã chi vượt hạn mức hũ {formatCurrency(spentAmount - allocatedAmount)}!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Tình trạng ngân sách an toàn</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Guide */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-200 text-sm">Cách quy tắc 6 Hũ hoạt động:</h4>
          <p>
            Mỗi khi bạn có Thu Nhập mới (Lương, Freelance, Thưởng), hệ thống tự động nhân số tiền đó với % của từng Hũ để tính ra số tiền bạn được phép chi tiêu cho từng nhu cầu. Khi bạn ghi nhận khoản chi thuộc danh mục nào, số tiền đó sẽ tự động trừ bớt vào Hũ tương ứng.
          </p>
        </div>
      </div>
    </div>
  );
};
