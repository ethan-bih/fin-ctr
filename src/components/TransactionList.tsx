'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { Search, Download, Trash2, Plus, Calendar } from 'lucide-react';

interface TransactionListProps {
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onOpenAddModal }) => {
  const { transactions, categories, formatCurrency, deleteTransaction } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'all' || tx.type === selectedType;
      const matchCat = selectedCategory === 'all' || tx.category_id === selectedCategory;

      return matchSearch && matchType && matchCat;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, selectedType, selectedCategory]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('Không có dữ liệu giao dịch để xuất file!');
      return;
    }

    const headers = ['ID', 'Loại', 'Danh Mục', 'Số Tiền (VND)', 'Ghi Chú', 'Ngày'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type === 'income' ? 'Thu Nhập' : 'Chi Tiêu',
      `"${tx.category_name}"`,
      tx.amount,
      `"${tx.note.replace(/"/g, '""')}"`,
      tx.date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `So_Thu_Chi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900">Sổ Giao Dịch Thu Chi</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Danh sách toàn bộ lịch sử thu chi tài chính của bạn</p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm ghi chú, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
        >
          <option value="all">Tất cả loại (Thu & Chi)</option>
          <option value="income">Chỉ Thu Nhập (+)</option>
          <option value="expense">Chỉ Chi Tiêu (-)</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type === 'income' ? 'Thu' : 'Chi'})
            </option>
          ))}
        </select>
      </div>

      {/* MOBILE CARD VIEW (<640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: tx.category_color || '#10b981' }}
                  >
                    <DynamicIcon name={tx.category_icon || 'Wallet'} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{tx.category_name}</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-block mt-0.5 ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {tx.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-extrabold text-base ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(tx.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {tx.note && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                  {tx.note}
                </div>
              )}

              <div className="flex justify-end pt-1 border-t border-slate-100">
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
            Không tìm thấy giao dịch nào.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>=640px) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                <th className="py-3.5 px-4 font-semibold">Ghi chú</th>
                <th className="py-3.5 px-4 font-semibold">Ngày</th>
                <th className="py-3.5 px-4 font-semibold text-right">Số tiền (VNĐ)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: tx.category_color || '#10b981' }}
                        >
                          <DynamicIcon name={tx.category_icon || 'Wallet'} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{tx.category_name}</div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              tx.type === 'income'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {tx.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">
                      {tx.note || <span className="text-slate-400 italic">Không có ghi chú</span>}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </td>

                    <td
                      className={`py-4 px-4 text-right font-extrabold whitespace-nowrap text-base ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy giao dịch nào phù hợp.
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
