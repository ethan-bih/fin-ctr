'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingCategory, AssignedTo, TaskStatus, WeddingTask } from '@/lib/weddingTypes';
import { Plus, Search, Filter, Trash2, Calendar, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface WeddingTimelineTabProps {
  onOpenTaskModal: (taskToEdit?: WeddingTask) => void;
}

export const WeddingTimelineTab: React.FC<WeddingTimelineTabProps> = ({ onOpenTaskModal }) => {
  const { tasks, eventDates, updateTask, deleteTask } = useWedding();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.note && t.note.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesEvent = selectedEventId === 'ALL' || t.event_id === selectedEventId;
    const matchesAssignee = selectedAssignee === 'ALL' || t.assigned_to === selectedAssignee;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesCat && matchesEvent && matchesAssignee && matchesStatus;
  });

  const statusColors: Record<TaskStatus, { bg: string; text: string; border: string }> = {
    'Chưa bắt đầu': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    'Đang thực hiện': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Hoàn thành': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Trễ hạn': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Huỷ': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Kế Hoạch &amp; Timeline Công Việc</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {filteredTasks.length} / {tasks.length} công việc
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân công công việc giữa Chú rể, Cô dâu và theo dõi tiến độ
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Công Việc Mới</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {/* Search */}
        <div className="relative col-span-2 sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Filter Event */}
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
        >
          <option value="ALL">Tất cả ngày lễ</option>
          {eventDates.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Filter Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
        >
          <option value="ALL">Tất cả nhóm</option>
          <option value="Đám hỏi">Đám hỏi</option>
          <option value="Đám cưới">Đám cưới</option>
          <option value="Chung">Chung</option>
        </select>

        {/* Filter Assignee */}
        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
        >
          <option value="ALL">Tất cả người làm</option>
          <option value="Chú rể">Chú rể</option>
          <option value="Cô dâu">Cô dâu</option>
          <option value="Cả hai">Cả hai</option>
        </select>

        {/* Filter Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="Chưa bắt đầu">Chưa bắt đầu</option>
          <option value="Đang thực hiện">Đang thực hiện</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Trễ hạn">Trễ hạn</option>
        </select>
      </div>

      {/* MOBILE CARD VIEW (<640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => {
            const sColor = statusColors[t.status] || statusColors['Chưa bắt đầu'];
            const linkedEvent = eventDates.find((e) => e.id === t.event_id);

            return (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">{t.title}</h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {t.category}
                      </span>
                      {linkedEvent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {linkedEvent.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value as TaskStatus)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none shrink-0 ${sColor.bg} ${sColor.text} ${sColor.border}`}
                  >
                    <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Trễ hạn">Trễ hạn</option>
                    <option value="Huỷ">Huỷ</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.assigned_to}</span>
                  </span>
                  {t.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(t.due_date).toLocaleDateString('vi-VN')}</span>
                    </span>
                  )}
                </div>

                {t.note && <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">{t.note}</div>}

                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenTaskModal(t)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1 rounded-lg hover:bg-slate-100"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
            Không tìm thấy công việc nào.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>=640px) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Tên công việc</th>
                <th className="py-3.5 px-4 font-semibold">Liên kết lễ / Nhóm</th>
                <th className="py-3.5 px-4 font-semibold">Phụ trách</th>
                <th className="py-3.5 px-4 font-semibold">Hạn làm</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => {
                  const sColor = statusColors[t.status] || statusColors['Chưa bắt đầu'];
                  const linkedEvent = eventDates.find((e) => e.id === t.event_id);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-4 min-w-[220px]">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {t.title}
                        </div>
                        {t.note && <div className="text-xs text-slate-500 mt-0.5">{t.note}</div>}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap space-x-1.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                          {t.category}
                        </span>
                        {linkedEvent && (
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {linkedEvent.name}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 text-xs font-medium text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.assigned_to}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {t.due_date ? new Date(t.due_date).toLocaleDateString('vi-VN') : '-'}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value as TaskStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${sColor.bg} ${sColor.text} ${sColor.border}`}
                        >
                          <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                          <option value="Đang thực hiện">Đang thực hiện</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Trễ hạn">Trễ hạn</option>
                          <option value="Huỷ">Huỷ</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => onOpenTaskModal(t)}
                          className="text-xs text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
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
                    Không tìm thấy công việc nào phù hợp.
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
