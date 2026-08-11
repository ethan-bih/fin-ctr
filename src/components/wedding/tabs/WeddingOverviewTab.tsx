'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Heart, Calendar, Wallet, CheckSquare, Users, Store, Plus, Sparkles, Clock, Pencil } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WeddingOverviewTabProps {
  onSwitchTab: (tab: 'events' | 'timeline' | 'budget' | 'guests' | 'vendors' | 'gifts') => void;
  onOpenTaskModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenGuestModal: () => void;
}

export const WeddingOverviewTab: React.FC<WeddingOverviewTabProps> = ({
  onSwitchTab,
  onOpenTaskModal,
  onOpenBudgetModal,
  onOpenGuestModal,
}) => {
  const { weddingDate, setWeddingDate, targetBudget, setTargetBudget, eventDates, summary, tasks, budgets, guests, vendors, gifts } = useWedding();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(weddingDate);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(targetBudget);

  // Calculate Days Remaining
  const calculateDaysLeft = () => {
    const target = new Date(weddingDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  const handleSaveDate = () => {
    setWeddingDate(tempDate);
    setIsEditingDate(false);
  };

  // Recharts Data for Budget by Category
  const budgetByCategoryData = [
    {
      name: 'Đám hỏi',
      Dự_kiến: budgets.filter((b) => b.category === 'Đám hỏi').reduce((a, b) => a + b.estimated_cost, 0),
      Thực_tế: budgets.filter((b) => b.category === 'Đám hỏi').reduce((a, b) => a + b.actual_cost, 0),
    },
    {
      name: 'Đám cưới',
      Dự_kiến: budgets.filter((b) => b.category === 'Đám cưới').reduce((a, b) => a + b.estimated_cost, 0),
      Thực_tế: budgets.filter((b) => b.category === 'Đám cưới').reduce((a, b) => a + b.actual_cost, 0),
    },
    {
      name: 'Chung',
      Dự_kiến: budgets.filter((b) => b.category === 'Chung').reduce((a, b) => a + b.estimated_cost, 0),
      Thực_tế: budgets.filter((b) => b.category === 'Chung').reduce((a, b) => a + b.actual_cost, 0),
    },
  ];

  // Recharts Data for Guest RSVP
  const guestRsvpData = [
    { name: 'Đã xác nhận', value: summary.confirmedGuests, color: '#10b981' },
    { name: 'Chưa phản hồi', value: guests.filter((g) => g.rsvp_status === 'Chưa phản hồi').length, color: '#f59e0b' },
    { name: 'Từ chối', value: guests.filter((g) => g.rsvp_status === 'Từ chối').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-5">
      {/* Sleek Compact Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-white border border-rose-200/80 p-3.5 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Couple Title */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-[10px] sm:text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-rose-600" />
              <span>WEDDING PLANNER</span>
            </div>
            <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Kế Hoạch:</span>
              <span className="text-rose-600 flex items-center gap-1">
                Quốc Huy &amp; Yến Nhi
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              </span>
            </h1>
          </div>

          {/* Countdown & Date Picker Widget */}
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-xs border border-rose-200/80 rounded-xl p-2.5 sm:px-4 sm:py-2.5 shadow-2xs shrink-0 justify-between sm:justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Còn lại</div>
                <div className="text-sm sm:text-lg font-black text-slate-900 leading-none">
                  {daysLeft} <span className="text-[10px] font-semibold text-slate-500">ngày</span>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-rose-200" />

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Ngày cưới</div>
              {isEditingDate ? (
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="bg-white text-[11px] border border-slate-300 rounded px-1.5 py-0.5 text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveDate}
                    className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-bold"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDate(true)}
                  className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>{new Date(weddingDate).toLocaleDateString('vi-VN')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Strict Uniform Alignment) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {/* Card 1: Budget */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate flex items-center gap-1">
              <span>Ngân Sách Mục Tiêu</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingBudget(true);
                }}
                className="p-0.5 text-slate-400 hover:text-rose-600"
                title="Sửa ngân sách mục tiêu"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </span>
            <div
              onClick={() => onSwitchTab('budget')}
              className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 cursor-pointer shrink-0"
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1">
            {isEditingBudget ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setTargetBudget(tempBudget);
                    setIsEditingBudget(false);
                  }}
                  className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingBudget(true)}
                className="text-sm sm:text-xl font-black text-slate-900 leading-tight cursor-pointer hover:text-rose-600 truncate"
              >
                {formatCurrency(summary.targetBudget)}
              </div>
            )}
          </div>

          <div className="text-[10px] sm:text-xs text-slate-500 space-y-0.5 my-1">
            <div className="flex items-center justify-between">
              <span>Đã chi:</span>
              <strong className="text-emerald-600 font-bold">{formatCurrency(summary.totalActualExpense)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Hạng mục:</span>
              <span className="font-semibold text-slate-700">{formatCurrency(summary.totalEstimatedBudget)}</span>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
              <span>Tiến độ dùng</span>
              <span>{summary.targetBudget > 0 ? Math.round((summary.totalActualExpense / summary.targetBudget) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${summary.targetBudget > 0 ? Math.min(100, (summary.totalActualExpense / summary.targetBudget) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tasks */}
        <div
          onClick={() => onSwitchTab('timeline')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Công Việc Đám Cưới</span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1">
            <div className="text-sm sm:text-xl font-black text-slate-900 leading-tight">
              {summary.completedTasks} / {summary.totalTasks} <span className="text-[10px] sm:text-xs font-normal text-slate-500">việc</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-500 space-y-0.5 my-1">
            <div className="flex items-center justify-between">
              <span>Đã hoàn thành:</span>
              <strong className="text-blue-600 font-bold">{summary.completedTasks} việc</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Còn lại:</span>
              <span className="font-semibold text-slate-700">{summary.totalTasks - summary.completedTasks} việc</span>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
              <span>Tiến độ tổng</span>
              <span>{summary.totalTasks > 0 ? Math.round((summary.completedTasks / summary.totalTasks) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${summary.totalTasks > 0 ? (summary.completedTasks / summary.totalTasks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Guests */}
        <div
          onClick={() => onSwitchTab('guests')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Khách Mời Tiệc Cưới</span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1">
            <div className="text-sm sm:text-xl font-black text-slate-900 leading-tight">
              {summary.confirmedGuests} / {summary.totalGuests} <span className="text-[10px] sm:text-xs font-normal text-slate-500">khách</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-500 space-y-0.5 my-1">
            <div className="flex items-center justify-between">
              <span>Đã xác nhận:</span>
              <strong className="text-purple-600 font-bold">{summary.confirmedGuests} khách</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Tổng đi dự:</span>
              <span className="font-semibold text-slate-700">{summary.totalAccompanying} người</span>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
              <span>Tỷ lệ RSVP</span>
              <span>{summary.totalGuests > 0 ? Math.round((summary.confirmedGuests / summary.totalGuests) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${summary.totalGuests > 0 ? (summary.confirmedGuests / summary.totalGuests) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Vendors & Gifts */}
        <div
          onClick={() => onSwitchTab('vendors')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Nhà Cung Cấp &amp; Lễ Vật</span>
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <Store className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1">
            <div className="text-sm sm:text-xl font-black text-slate-900 leading-tight">
              {summary.depositedVendors} / {summary.totalVendors} <span className="text-[10px] sm:text-xs font-normal text-slate-500">đơn vị</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-500 space-y-0.5 my-1">
            <div className="flex items-center justify-between">
              <span>Đã đặt cọc:</span>
              <strong className="text-rose-600 font-bold">{summary.depositedVendors} đơn vị</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Mâm quả chuẩn bị:</span>
              <span className="font-semibold text-slate-700">{gifts.filter((g) => g.is_prepared).length}/{gifts.length} mâm</span>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
              <span>Đã đặt cọc</span>
              <span>{summary.totalVendors > 0 ? Math.round((summary.depositedVendors / summary.totalVendors) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${summary.totalVendors > 0 ? (summary.depositedVendors / summary.totalVendors) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Quick Timeline List */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <h2 className="text-sm sm:text-lg font-bold text-slate-900">Lịch Ngày Lễ</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {eventDates.length} sự kiện
            </span>
          </div>
          <button
            onClick={() => onSwitchTab('events')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 shrink-0"
          >
            <span>Quản Lý Lịch</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {eventDates.map((evt) => (
            <div
              key={evt.id}
              className={`p-2.5 sm:p-3.5 rounded-xl border transition-all ${
                evt.is_main_event
                  ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                  : 'bg-slate-50/80 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-[11px] sm:text-xs truncate">{evt.name}</span>
                {evt.is_main_event && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-600 text-white shrink-0">
                    Chính
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 font-semibold">
                <Calendar className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{new Date(evt.date).toLocaleDateString('vi-VN')}</span>
              </div>
              {evt.location && <div className="text-[10px] text-slate-500 mt-1 truncate">{evt.location}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Budget Chart */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">So Sánh Ngân Sách Theo Danh Mục</h3>
            <button
              onClick={() => onSwitchTab('budget')}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              Chi tiết
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Dự_kiến" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Thực_tế" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guest RSVP Chart */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Tỷ Lệ Phản Hỏi Thiệp Mời (RSVP)</h3>
            <button
              onClick={() => onSwitchTab('guests')}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              Chi tiết
            </button>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {guestRsvpData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={guestRsvpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {guestRsvpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} thiệp`, 'Số lượng']} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">Chưa có dữ liệu thiệp mời</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
