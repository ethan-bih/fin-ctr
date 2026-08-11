'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingEventDate } from '@/lib/weddingTypes';
import { Plus, Calendar, Clock, MapPin, Trash2, CheckCircle2, Star, Sparkles, Tag } from 'lucide-react';

interface WeddingEventsTabProps {
  onOpenEventModal: (eventToEdit?: WeddingEventDate) => void;
}

export const WeddingEventsTab: React.FC<WeddingEventsTabProps> = ({ onOpenEventModal }) => {
  const { eventDates, setWeddingDate, updateEventDate, deleteEventDate, budgets, tasks } = useWedding();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  const calculateDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const setAsMainEvent = (evt: WeddingEventDate) => {
    eventDates.forEach((e) => {
      updateEventDate(e.id, { is_main_event: e.id === evt.id });
    });
    setWeddingDate(evt.date);
  };

  // Sort events by date ascending
  const sortedEvents = [...eventDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Lịch Lễ & Các Ngày Sự Kiện Cưới</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              {eventDates.length} ngày lễ
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập lịch trình cho từng ngày lễ (Dạm ngõ, Đám hỏi, Tiệc nhà trai, Tiệc nhà gái...) và liên kết với ngân sách &amp; công việc
          </p>
        </div>

        <button
          onClick={() => onOpenEventModal()}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Ngày Lễ Mới</span>
        </button>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-4">
        {sortedEvents.map((evt, idx) => {
          const daysLeft = calculateDaysLeft(evt.date);
          const isPast = daysLeft < 0;

          // Linked data calculations
          const linkedBudgets = budgets.filter((b) => b.event_id === evt.id || (evt.name.includes('Đám hỏi') && b.category === 'Đám hỏi') || (evt.name.includes('Đám cưới') && b.category === 'Đám cưới'));
          const linkedTasks = tasks.filter((t) => t.event_id === evt.id || (evt.name.includes('Đám hỏi') && t.category === 'Đám hỏi') || (evt.name.includes('Đám cưới') && t.category === 'Đám cưới'));
          const totalEstCost = linkedBudgets.reduce((acc, b) => acc + b.estimated_cost, 0);

          return (
            <div
              key={evt.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden ${
                evt.is_main_event
                  ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Left Timeline Indicator */}
              <div className="flex items-start space-x-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/80 shadow-2xs font-extrabold text-sm">
                  #{idx + 1}
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className="font-extrabold text-slate-900 text-lg">{evt.name}</h3>
                    {evt.is_main_event && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                        <Star className="w-3 h-3 fill-white" /> Ngày Cưới Chính
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-rose-500" />
                      {new Date(evt.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {evt.time && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {evt.time}
                      </span>
                    )}
                    {evt.location && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.location}
                      </span>
                    )}
                  </div>

                  {evt.note && <p className="text-xs text-slate-500">{evt.note}</p>}

                  {/* Linked Data Indicators */}
                  <div className="pt-2 flex items-center space-x-4 text-xs font-medium text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200">
                      Ngân sách liên kết: <strong className="text-emerald-600">{formatCurrency(totalEstCost)}</strong> ({linkedBudgets.length} hạng mục)
                    </span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200">
                      Công việc liên kết: <strong className="text-blue-600">{linkedTasks.length} tác vụ</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action & Countdown */}
              <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Thời gian còn lại</div>
                  <div className={`text-xl font-black ${isPast ? 'text-slate-400' : daysLeft <= 30 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {isPast ? 'Đã diễn ra' : `${daysLeft} ngày`}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!evt.is_main_event && (
                    <button
                      onClick={() => setAsMainEvent(evt)}
                      title="Đặt làm lễ cưới chính"
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                    >
                      Đặt làm ngày chính
                    </button>
                  )}
                  <button
                    onClick={() => onOpenEventModal(evt)}
                    className="text-xs text-slate-600 hover:text-rose-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteEventDate(evt.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
