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
          if (jarSpentMap[jarId] !== undefined) {
            jarSpentMap[jarId] += tx.amount;
          } else {
            jarSpentMap['NEC'] += tx.amount;
          }
        }
      }
    });

    return { totalIncome, jarSpentMap };
  }, [transactions, categories]);

  const handleRatioChange = (jarId: JarType, val: number) => {
    setTempRatios((prev) => ({
      ...prev,
      [jarId]: val,
    }));
  };

  const totalRatioPercent = useMemo(() => {
    return Object.values(tempRatios).reduce((acc, curr) => acc + curr, 0);
  }, [tempRatios]);

  const handleSaveRatios = () => {
    if (totalRatioPercent !== 100) {
      alert('Tổng tỷ lệ 6 hũ phải đúng bằng 100%. Vui lòng điều chỉnh lại!');
      return;
    }
    updateJarRatios(tempRatios);
    setIsConfiguring(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Quy Tắc 6 Hũ Tài Chính (JARS System)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phương pháp phân bổ thu nhập thông minh theo tỷ lệ chuẩn 55-10-10-10-10-5
          </p>
        </div>

        <button
          onClick={() => {
            setTempRatios(jarRatios);
            setIsConfiguring(!isConfiguring);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Tùy Chỉnh Tỷ Lệ % Hũ</span>
        </button>
      </div>

      {/* Ratios Configuration Modal */}
      {isConfiguring && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-600" />
                Cấu Hình Tỷ Lệ % Phân Bổ 6 Hũ
              </h3>
              <p className="text-xs text-slate-500">Điều chỉnh tỷ lệ % phù hợp với chiến lược tài chính của bạn</p>
            </div>
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                totalRatioPercent === 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              Tổng = {totalRatioPercent}% {totalRatioPercent !== 100 && '(Cần bằng 100%)'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DEFAULT_JARS.map((jar) => {
              const currentPercent = tempRatios[jar.id];

              return (
                <div key={jar.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5" style={{ color: jar.color }}>
                      <DynamicIcon name={jar.icon} size={16} />
                      {jar.name} ({jar.code})
                    </span>
                    <span className="text-emerald-700 font-extrabold">{currentPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={currentPercent}
                    onChange={(e) => handleRatioChange(jar.id, parseInt(e.target.value))}
                    className="w-full accent-indigo-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setTempRatios({ NEC: 55, FFA: 10, LTSS: 10, EDU: 10, PLAY: 10, GIVE: 5 })}
              className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đặt lại tỷ lệ 55-10-10-10-10-5 chuẩn</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRatios}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
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
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between space-y-4 shadow-xs ${
                isOverBudget ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: jar.color }}
                    >
                      <DynamicIcon name={jar.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{jar.name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {jar.code}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">{jar.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {jarRatio}%
                  </span>
                </div>

                {/* Amount Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500">Được phân bổ:</span>
                    <div className="font-bold text-slate-900 text-sm">{formatCurrency(allocatedAmount)}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Đã chi tiêu:</span>
                    <div className={`font-bold text-sm ${isOverBudget ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatCurrency(spentAmount)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Còn lại:</span>
                    <span className={`font-bold ${remainingAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
