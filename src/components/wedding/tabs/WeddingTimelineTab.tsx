'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingTask, TaskStatus, AssignedTo } from '@/lib/weddingTypes';
import { Plus, Search, Calendar, User, CheckSquare, Clock, Trash2, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface WeddingTimelineTabProps {
  onOpenTaskModal: (taskToEdit?: WeddingTask) => void;
}

export const WeddingTimelineTab: React.FC<WeddingTimelineTabProps> = ({ onOpenTaskModal }) => {
  const { tasks, eventDates, updateTask, deleteTask } = useWedding();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesAssignee = selectedAssignee === 'ALL' || t.assigned_to === selectedAssignee;
    const matchesEvent = selectedEventId === 'ALL' || t.event_id === selectedEventId;

    return matchesSearch && matchesCat && matchesStatus && matchesAssignee && matchesEvent;
  });

  const activeFilterCount =
    (selectedEventId !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedAssignee !== 'ALL' ? 1 : 0) +
    (selectedStatus !== 'ALL' ? 1 : 0);

  const resetFilters = () => {
    setSelectedEventId('ALL');
    setSelectedCategory('ALL');
    setSelectedAssignee('ALL');
    setSelectedStatus('ALL');
    setSearch('');
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Tiến Độ Công Việc</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              {filteredTasks.length}/{tasks.length}
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            Phân công công việc giữa Chú rể, Cô dâu và theo dõi tiến độ
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Việc</span>
        </button>
      </div>

      {/* Sleek Compact Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm công việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-rose-600" />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center">
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
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <span>Lọc Công Việc Đám Cưới</span>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Tất cả ngày lễ</option>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Tất cả nhóm</option>
                  <option value="Đám hỏi">Đám hỏi</option>
                  <option value="Đám cưới">Đám cưới</option>
                  <option value="Chung">Chung</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Người phụ trách</label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Tất cả người làm</option>
                  <option value="Chú rể">Chú rể</option>
                  <option value="Cô dâu">Cô dâu</option>
                  <option value="Cả hai">Cả hai</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Trạng thái tiến độ</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Trễ hạn">Trễ hạn</option>
                  <option value="Huỷ">Huỷ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-rose-600"
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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const linkedEvent = eventDates.find((e) => e.id === task.event_id);

            return (
              <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 pr-2">
                    <h3 className="font-bold text-slate-900 text-sm">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
                        {task.category}
                      </span>
                      {linkedEvent && (
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                          {linkedEvent.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none bg-slate-50 text-slate-700 border-slate-200"
                  >
                    <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Trễ hạn">Trễ hạn</option>
                    <option value="Huỷ">Huỷ</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                  <span>Phụ trách: <strong className="text-slate-800">{task.assigned_to}</strong></span>
                  {task.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(task.due_date).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>

                {task.note && <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">{task.note}</p>}

                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenTaskModal(task)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1 rounded-lg hover:bg-slate-100"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
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
                <th className="py-3.5 px-4 font-semibold">Nhóm & Sự kiện</th>
                <th className="py-3.5 px-4 font-semibold">Phụ trách</th>
                <th className="py-3.5 px-4 font-semibold">Hạn hoàn thành</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const linkedEvent = eventDates.find((e) => e.id === task.event_id);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </div>
                        {task.note && <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.note}</div>}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                            {task.category}
                          </span>
                          {linkedEvent && (
                            <span className="text-[11px] font-medium text-slate-500">
                              {linkedEvent.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-800">
                        {task.assigned_to}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '-'}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none bg-slate-50 text-slate-700 border-slate-200"
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
                          onClick={() => onOpenTaskModal(task)}
                          className="text-xs text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
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
