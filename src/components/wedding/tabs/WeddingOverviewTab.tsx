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
    { name: 'Đã xác nhận', value: guests.filter((g) => g.rsvp_status === 'Đã xác nhận').length },
    { name: 'Từ chối', value: guests.filter((g) => g.rsvp_status === 'Từ chối').length },
    { name: 'Chưa phản hồi', value: guests.filter((g) => g.rsvp_status === 'Chưa phản hồi').length },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  const handleSaveDate = () => {
    setWeddingDate(tempDate);
    setIsEditingDate(false);
  };

  return (
    <div className="space-y-6">
      {/* Romantic Banner & Countdown Timer */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-rose-200/80 p-3.5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-200/80">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>WEDDING PLANNER</span>
            </div>
            
            <div>
              <h1 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1 leading-snug">
                <span>Kế Hoạch Đám Cưới:</span>
                <span className="text-rose-600 flex items-center gap-1 font-black whitespace-nowrap">
                  Quốc Huy &amp; Yến Nhi
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 shrink-0 inline-block" />
                </span>
              </h1>
            </div>
          </div>

          {/* Countdown Clock Widget */}
          <div className="w-full lg:w-auto bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-start gap-4 sm:gap-6 shadow-2xs shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Đếm ngược ngày cưới</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mt-0.5">
                  {daysLeft} <span className="text-xs font-medium text-slate-500">ngày nữa</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 sm:border-l border-rose-200/80 pt-3 sm:pt-0 pl-0 sm:pl-5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ngày cưới dự kiến</div>
              {isEditingDate ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="bg-white text-xs border border-slate-300 rounded-lg px-2 py-1 text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveDate}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDate(true)}
                  className="text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 flex items-center sm:justify-end gap-1.5 transition-colors mt-1"
                >
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>{new Date(weddingDate).toLocaleDateString('vi-VN')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs group relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span>Ngân Sách Mục Tiêu</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingBudget(true);
                }}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                title="Chỉnh sửa ngân sách tổng ban đầu"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </span>
            <div
              onClick={() => onSwitchTab('budget')}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {isEditingBudget ? (
            <div className="flex items-center gap-1.5 my-1">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                placeholder="Nhập số tiền..."
              />
              <button
                onClick={() => {
                  setTargetBudget(tempBudget);
                  setIsEditingBudget(false);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold shadow-2xs shrink-0"
              >
                Lưu
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingBudget(true)}
              className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 cursor-pointer hover:text-rose-600 transition-colors"
            >
              {formatCurrency(summary.targetBudget)}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Đã chi: <strong className="text-emerald-600">{formatCurrency(summary.totalActualExpense)}</strong></span>
            <span>{summary.targetBudget > 0 ? Math.round((summary.totalActualExpense / summary.targetBudget) * 100) : 0}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${summary.targetBudget > 0 ? Math.min(100, (summary.totalActualExpense / summary.targetBudget) * 100) : 0}%`,
              }}
            />
          </div>

          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Hạng mục dự kiến:</span>
            <span className="font-semibold text-slate-600">{formatCurrency(summary.totalEstimatedBudget)}</span>
          </div>
        </div>

        {/* Card 2: Tasks */}
        <div
          onClick={() => onSwitchTab('timeline')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Công Việc Đám Cưới</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            {summary.completedTasks} / {summary.totalTasks} <span className="text-xs font-normal text-slate-500">hoàn thành</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tiến độ tổng thể</span>
            <span className="text-blue-600 font-semibold">
              {summary.totalTasks > 0 ? Math.round((summary.completedTasks / summary.totalTasks) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${summary.totalTasks > 0 ? (summary.completedTasks / summary.totalTasks) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Guests */}
        <div
          onClick={() => onSwitchTab('guests')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Khách Mời Tiệc Cưới</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            {summary.confirmedGuests} / {summary.totalGuests} <span className="text-xs font-normal text-slate-500">đã xác nhận</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tổng người dự tiệc</span>
            <span className="text-purple-600 font-semibold">{summary.totalAccompanying} người</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${summary.totalGuests > 0 ? (summary.confirmedGuests / summary.totalGuests) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Vendors & Gifts */}
        <div
          onClick={() => onSwitchTab('vendors')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Nhà Cung Cấp & Lễ Vật</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            {summary.depositedVendors} / {summary.totalVendors} <span className="text-xs font-normal text-slate-500">đã đặt cọc</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Mâm quả chuẩn bị</span>
            <span className="text-rose-600 font-semibold">
              {gifts.filter((g) => g.is_prepared).length} / {gifts.length} mâm
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-rose-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${summary.totalVendors > 0 ? (summary.depositedVendors / summary.totalVendors) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Ceremonies Schedule Preview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Chuỗi Các Ngày Lễ &amp; Sự Kiện</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {eventDates.length} sự kiện
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tiến trình cử hành theo mốc thời gian thực tế</p>
          </div>
          <button
            onClick={() => onSwitchTab('events')}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            <span>Cài đặt &amp; Quản lý</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {eventDates.map((evt) => {
            const target = new Date(evt.date);
            const today = new Date();
            const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={evt.id}
                onClick={() => onSwitchTab('events')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  evt.is_main_event
                    ? 'border-rose-300 bg-rose-50/30 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 truncate">{evt.name}</span>
                  {evt.is_main_event && <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded">Chính</span>}
                </div>
                <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(evt.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {diffDays < 0 ? 'Đã diễn ra' : `Còn ${diffDays} ngày`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts & Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Budget Comparison */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">So Sánh Ngân Sách Dự Kiến & Chi Thực Tế</h3>
              <p className="text-xs text-slate-500">Phân bổ chi phí theo nhóm Đám hỏi, Đám cưới và Chi phí chung</p>
            </div>
            <button
              onClick={() => onSwitchTab('budget')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Chi tiết &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByCategoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="Dự_kiến" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Thực_tế" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Guest RSVP Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Phản Hồi Khách Mời</h3>
              <p className="text-xs text-slate-500">Tỷ lệ xác nhận tham dự (RSVP)</p>
            </div>
            <button
              onClick={() => onSwitchTab('guests')}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Chi tiết &rarr;
            </button>
          </div>

          {guests.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={guestRsvpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {guestRsvpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu khách mời
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100">
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" />
              <span className="text-slate-500">Xác nhận</span>
              <div className="font-bold text-slate-900">{guests.filter((g) => g.rsvp_status === 'Đã xác nhận').length}</div>
            </div>
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1" />
              <span className="text-slate-500">Từ chối</span>
              <div className="font-bold text-slate-900">{guests.filter((g) => g.rsvp_status === 'Từ chối').length}</div>
            </div>
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" />
              <span className="text-slate-500">Chờ trả lời</span>
              <div className="font-bold text-slate-900">{guests.filter((g) => g.rsvp_status === 'Chưa phản hồi').length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Shortcuts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 mb-2">Thao Tác Nhanh</h3>
          <button
            onClick={onOpenTaskModal}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 transition-all"
          >
            <span className="flex items-center space-x-3">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span>Thêm công việc mới</span>
            </span>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={onOpenBudgetModal}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 transition-all"
          >
            <span className="flex items-center space-x-3">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Thêm khoản ngân sách</span>
            </span>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={onOpenGuestModal}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 transition-all"
          >
            <span className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Thêm khách mời</span>
            </span>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Priority Tasks List Preview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Công Việc Cần Thực Hiện Gần Nhất</h3>
            <button
              onClick={() => onSwitchTab('timeline')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Xem tất cả ({tasks.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-sm transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      task.status === 'Hoàn thành'
                        ? 'bg-emerald-500'
                        : task.status === 'Đang thực hiện'
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 truncate">{task.title}</div>
                    <div className="text-xs text-slate-500 flex items-center space-x-2">
                      <span className="text-rose-600 font-medium">{task.category}</span>
                      <span>•</span>
                      <span>Phụ trách: {task.assigned_to}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                      task.status === 'Hoàn thành'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'Đang thực hiện'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
