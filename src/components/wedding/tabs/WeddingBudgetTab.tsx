'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingBudgetItem } from '@/lib/weddingTypes';
import { Plus, Search, Wallet, CheckSquare, Square, Trash2, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface WeddingBudgetTabProps {
  onOpenBudgetModal: (itemToEdit?: WeddingBudgetItem) => void;
}

export const WeddingBudgetTab: React.FC<WeddingBudgetTabProps> = ({ onOpenBudgetModal }) => {
  const { budgets, eventDates, updateBudgetItem, deleteBudgetItem } = useWedding();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.note && b.note.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesEvent = selectedEventId === 'ALL' || b.event_id === selectedEventId;

    return matchesSearch && matchesCat && matchesEvent;
  });

  const activeFilterCount = (selectedEventId !== 'ALL' ? 1 : 0) + (selectedCategory !== 'ALL' ? 1 : 0);

  const resetFilters = () => {
    setSelectedEventId('ALL');
    setSelectedCategory('ALL');
    setSearch('');
  };

  // Calculations
  const totalEst = filteredBudgets.reduce((acc, b) => acc + b.estimated_cost, 0);
  const totalAct = filteredBudgets.reduce((acc, b) => acc + b.actual_cost, 0);
  const totalDiff = totalEst - totalAct;

  const toggleDeposit = (item: WeddingBudgetItem) => {
    updateBudgetItem(item.id, { is_deposited: !item.is_deposited });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Ngân Sách &amp; Chi Phí</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              {filteredBudgets.length} mục
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            Theo dõi ngân sách dự kiến, chi phí thực tế và tiền đặt cọc
          </p>
        </div>

        <button
          onClick={() => onOpenBudgetModal()}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Chi Phí</span>
        </button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tổng Ngân Sách Dự Kiến</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalEst)}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tổng Đã Chi Thực Tế</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalAct)}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Dư Hạn Mức Ngân Sách</div>
          <div className={`text-lg sm:text-xl font-bold mt-1 ${totalDiff >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatCurrency(totalDiff)}
          </div>
        </div>
      </div>

      {/* Sleek Compact Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm khoản chi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white p-5 rounded-2xl border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Lọc Ngân Sách & Chi Phí</span>
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1">Ngày lễ / Sự kiện</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Tất cả ngày lễ / sự kiện</option>
                  {eventDates.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nhóm danh mục</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Tất cả nhóm</option>
                  <option value="Đám hỏi">Đám hỏi</option>
                  <option value="Đám cưới">Đám cưới</option>
                  <option value="Chung">Chung</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-2xs"
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CARD VIEW (<640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredBudgets.length > 0 ? (
          filteredBudgets.map((item) => {
            const linkedEvent = eventDates.find((e) => e.id === item.event_id);
            const diff = item.estimated_cost - item.actual_cost;

            return (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
                        {item.category}
                      </span>
                      {linkedEvent && (
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                          {linkedEvent.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDeposit(item)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      item.is_deposited
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {item.is_deposited ? 'Đã cọc' : 'Chưa cọc'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">Dự kiến:</span>
                    <div className="font-bold text-slate-900">{formatCurrency(item.estimated_cost)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Thực tế:</span>
                    <div className="font-bold text-emerald-600">{formatCurrency(item.actual_cost)}</div>
                  </div>
                </div>

                {item.note && <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">{item.note}</p>}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className={`font-semibold ${diff >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {diff >= 0 ? `Dư: ${formatCurrency(diff)}` : `Vượt: ${formatCurrency(Math.abs(diff))}`}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenBudgetModal(item)}
                      className="text-xs font-semibold text-slate-600 hover:text-emerald-600 px-2.5 py-1 rounded-lg hover:bg-slate-100"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteBudgetItem(item.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
            Không tìm thấy khoản chi nào.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>=640px) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Hạng mục chi phí</th>
                <th className="py-3.5 px-4 font-semibold">Nhóm & Sự kiện</th>
                <th className="py-3.5 px-4 font-semibold text-right">Dự kiến (VNĐ)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thực tế (VNĐ)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Đặt cọc</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((item) => {
                  const linkedEvent = eventDates.find((e) => e.id === item.event_id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </div>
                        {item.note && <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.note}</div>}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                            {item.category}
                          </span>
                          {linkedEvent && (
                            <span className="text-[11px] font-medium text-slate-500">
                              {linkedEvent.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right font-medium text-slate-800 whitespace-nowrap">
                        {formatCurrency(item.estimated_cost)}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {formatCurrency(item.actual_cost)}
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleDeposit(item)}
                          className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all mx-auto ${
                            item.is_deposited
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {item.is_deposited ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{item.is_deposited ? 'Đã cọc' : 'Chưa cọc'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => onOpenBudgetModal(item)}
                          className="text-xs text-slate-600 hover:text-emerald-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteBudgetItem(item.id)}
                          className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy khoản chi nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
