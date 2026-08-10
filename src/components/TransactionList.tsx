'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DynamicIcon } from './DynamicIcon';
import { Search, Filter, Download, Trash2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Sổ Giao Dịch Thu Chi</h2>
          <p className="text-sm text-slate-400">Danh sách toàn bộ lịch sử thu chi tài chính của bạn</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ghi chú, danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 outline-none placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'Tất cả' : type === 'income' ? 'Tiền Thu' : 'Tiền Chi'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900/90 text-sm text-slate-200 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type === 'income' ? '🟢' : '🔴'} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / Cards */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${tx.category_color}20` }}
                  >
                    <DynamicIcon name={tx.category_icon} color={tx.category_color} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-200 text-sm">{tx.category_name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'income' ? 'Thu Nhập' : 'Chi Tiêu'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{tx.note || 'Không có ghi chú'}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span
                      className={`font-bold text-base block ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    title="Xóa giao dịch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            Không tìm thấy giao dịch nào phù hợp với bộ lọc.
          </div>
        )}
      </div>
    </div>
  );
};
