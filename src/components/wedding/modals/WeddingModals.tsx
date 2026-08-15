'use client';

/* eslint-disable react-hooks/set-state-in-effect -- These modal forms intentionally hydrate local draft state when the edited record changes. */
import React, { useState, useEffect } from 'react';
import { useWedding } from '@/context/WeddingContext';
import {
  WeddingTask,
  WeddingBudgetItem,
  WeddingGuest,
  WeddingVendor,
  WeddingBetrothalGift,
  WeddingEventDate,
  WeddingCategory,
  AssignedTo,
  TaskStatus,
  GuestSide,
  RsvpStatus,
  VendorStatus,
} from '@/lib/weddingTypes';
import { X } from 'lucide-react';

// ==================== EVENT DATE MODAL ====================
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: WeddingEventDate | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, eventToEdit }) => {
  const { addEventDate, updateEventDate } = useWedding();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [location, setLocation] = useState('');
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time || '09:00 AM');
      setLocation(eventToEdit.location || '');
      setIsMainEvent(!!eventToEdit.is_main_event);
      setNote(eventToEdit.note || '');
    } else {
      setName('');
      setDate('');
      setTime('09:00 AM');
      setLocation('');
      setIsMainEvent(false);
      setNote('');
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    if (eventToEdit) {
      updateEventDate(eventToEdit.id, { name, date, time, location, is_main_event: isMainEvent, note });
    } else {
      addEventDate({ name, date, time, location, is_main_event: isMainEvent, note });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{eventToEdit ? 'Chỉnh Sửa Ngày Lễ / Sự Kiện' : 'Thêm Ngày Lễ Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên ngày lễ / sự kiện (*)</label>
            <input
              type="text"
              required
              placeholder="VD: Lễ Dạm Ngõ, Lễ Đám Hỏi, Tiệc Nhà Trai..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày cử hành (*)</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Giờ bắt đầu</label>
              <input
                type="text"
                placeholder="VD: 09:00 AM hoặc 18:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Địa điểm tổ chức</label>
            <input
              type="text"
              placeholder="Nhập địa điểm..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_main_event"
              checked={isMainEvent}
              onChange={(e) => setIsMainEvent(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 accent-rose-600 bg-slate-100"
            />
            <label htmlFor="is_main_event" className="text-xs text-slate-700 font-medium cursor-pointer">
              Đây là Ngày Tiệc Cưới Chính (Main Wedding Event)?
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Lưu ý quan trọng cho ngày lễ này..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs">
              {eventToEdit ? 'Lưu Thay Đổi' : 'Tạo Ngày Lễ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== TASK MODAL ====================
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: WeddingTask | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask, eventDates } = useWedding();
  const [category, setCategory] = useState<WeddingCategory>('Đám cưới');
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState<AssignedTo>('Cả hai');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Chưa bắt đầu');
  const [eventId, setEventId] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setCategory(taskToEdit.category);
      setTitle(taskToEdit.title);
      setAssignedTo(taskToEdit.assigned_to);
      setDueDate(taskToEdit.due_date);
      setStatus(taskToEdit.status);
      setEventId(taskToEdit.event_id || '');
      setNote(taskToEdit.note || '');
    } else {
      setCategory('Đám cưới');
      setTitle('');
      setAssignedTo('Cả hai');
      setDueDate('');
      setStatus('Chưa bắt đầu');
      setEventId('');
      setNote('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, { category, title, assigned_to: assignedTo, due_date: dueDate, status, event_id: eventId, note });
    } else {
      addTask({ category, title, assigned_to: assignedTo, due_date: dueDate, status, event_id: eventId, note });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{taskToEdit ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên công việc (*)</label>
            <input
              type="text"
              required
              placeholder="VD: Đặt nhà hàng, in thiệp..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Liên kết ngày lễ / sự kiện</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              >
                <option value="">Không liên kết cụ thể</option>
                {eventDates.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({new Date(e.date).toLocaleDateString('vi-VN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hạng mục chung</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WeddingCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              >
                <option value="Đám hỏi">Đám hỏi</option>
                <option value="Đám cưới">Đám cưới</option>
                <option value="Chung">Chung</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Người phụ trách</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value as AssignedTo)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="Chú rể">Chú rể</option>
                <option value="Cô dâu">Cô dâu</option>
                <option value="Cả hai">Cả hai</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hạn hoàn thành</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Trễ hạn">Trễ hạn</option>
              <option value="Huỷ">Huỷ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Chi tiết công việc..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs">
              {taskToEdit ? 'Lưu Thay Đổi' : 'Tạo Công Việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== BUDGET MODAL ====================
interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: WeddingBudgetItem | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, itemToEdit }) => {
  const { addBudgetItem, updateBudgetItem, eventDates } = useWedding();
  const [category, setCategory] = useState<WeddingCategory>('Đám cưới');
  const [title, setTitle] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [eventId, setEventId] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setCategory(itemToEdit.category);
      setTitle(itemToEdit.title);
      setEstimatedCost(itemToEdit.estimated_cost.toString());
      setActualCost(itemToEdit.actual_cost.toString());
      setDepositAmount((itemToEdit.deposit_amount ?? 0).toString());
      setEventId(itemToEdit.event_id || '');
      setNote(itemToEdit.note || '');
    } else {
      setCategory('Đám cưới');
      setTitle('');
      setEstimatedCost('');
      setActualCost('');
      setDepositAmount('');
      setEventId('');
      setNote('');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const est = parseFloat(estimatedCost) || 0;
    const act = parseFloat(actualCost) || 0;
    const deposit = parseFloat(depositAmount) || 0;

    if (itemToEdit) {
      await updateBudgetItem(itemToEdit.id, {
        category,
        title,
        estimated_cost: est,
        actual_cost: act,
        deposit_amount: deposit,
        is_deposited: deposit > 0,
        event_id: eventId,
        note,
      });
    } else {
      await addBudgetItem({
        category,
        title,
        estimated_cost: est,
        actual_cost: act,
        deposit_amount: deposit,
        is_deposited: deposit > 0,
        event_id: eventId,
        note,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{itemToEdit ? 'Chỉnh Sửa Khoản Chi' : 'Thêm Khoản Chi Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên hạng mục chi phí (*)</label>
            <input
              type="text"
              required
              placeholder="VD: Thuê áo cưới, Đặt cọc sảnh tiệc..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Liên kết ngày lễ / sự kiện</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
              >
                <option value="">Chung (Tất cả lễ)</option>
                {eventDates.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({new Date(e.date).toLocaleDateString('vi-VN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nhóm chi phí</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WeddingCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
              >
                <option value="Đám hỏi">Đám hỏi</option>
                <option value="Đám cưới">Đám cưới</option>
                <option value="Chung">Chung</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chi phí dự kiến (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chi thực tế (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tiền đã cọc (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs">
              {itemToEdit ? 'Lưu Thay Đổi' : 'Tạo Hạng Mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== GUEST MODAL ====================
interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestToEdit?: WeddingGuest | null;
}

export const GuestModal: React.FC<GuestModalProps> = ({ isOpen, onClose, guestToEdit }) => {
  const { addGuest, updateGuest, eventDates } = useWedding();
  const [name, setName] = useState('');
  const [side, setSide] = useState<GuestSide>('Nhà trai');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [invitationSent, setInvitationSent] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>('Chưa phản hồi');
  const [accompanyCount, setAccompanyCount] = useState('0');
  const [tableNo, setTableNo] = useState('');
  const [eventId, setEventId] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (guestToEdit) {
      setName(guestToEdit.name);
      setSide(guestToEdit.side);
      setRelationship(guestToEdit.relationship || '');
      setPhone(guestToEdit.phone || '');
      setInvitationSent(guestToEdit.invitation_sent);
      setRsvpStatus(guestToEdit.rsvp_status);
      setAccompanyCount(guestToEdit.accompany_count.toString());
      setTableNo(guestToEdit.table_no || '');
      setEventId(guestToEdit.event_id || '');
      setNote(guestToEdit.note || '');
    } else {
      setName('');
      setSide('Nhà trai');
      setRelationship('');
      setPhone('');
      setInvitationSent(false);
      setRsvpStatus('Chưa phản hồi');
      setAccompanyCount('0');
      setTableNo('');
      setEventId('');
      setNote('');
    }
  }, [guestToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const acc = parseInt(accompanyCount) || 0;

    if (guestToEdit) {
      updateGuest(guestToEdit.id, {
        name,
        side,
        relationship,
        phone,
        invitation_sent: invitationSent,
        rsvp_status: rsvpStatus,
        accompany_count: acc,
        table_no: tableNo,
        event_id: eventId,
        note,
      });
    } else {
      addGuest({
        name,
        side,
        relationship,
        phone,
        invitation_sent: invitationSent,
        rsvp_status: rsvpStatus,
        accompany_count: acc,
        table_no: tableNo,
        event_id: eventId,
        note,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{guestToEdit ? 'Chỉnh Sửa Khách Mời' : 'Thêm Khách Mời Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên khách mời (*)</label>
            <input
              type="text"
              required
              placeholder="Nhập tên khách..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dự tiệc / lễ cưới nào</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white text-xs"
              >
                <option value="">Tất cả / Tiệc chính</option>
                {eventDates.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bên</label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as GuestSide)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white text-xs"
              >
                <option value="Nhà trai">Nhà trai</option>
                <option value="Nhà gái">Nhà gái</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mối quan hệ</label>
              <input
                type="text"
                placeholder="VD: Bạn thân, Họ hàng..."
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                placeholder="0901..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phản hồi (RSVP)</label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value as RsvpStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white text-xs"
              >
                <option value="Chưa phản hồi">Chưa phản hồi</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Từ chối">Từ chối</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đi kèm (+)</label>
              <input
                type="number"
                min="0"
                value={accompanyCount}
                onChange={(e) => setAccompanyCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bàn số</label>
              <input
                type="text"
                placeholder="VD: Bàn 05..."
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="invitation_sent"
              checked={invitationSent}
              onChange={(e) => setInvitationSent(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600 bg-slate-100"
            />
            <label htmlFor="invitation_sent" className="text-xs text-slate-700 font-medium cursor-pointer">
              Đã gửi thiệp mời?
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs">
              {guestToEdit ? 'Lưu Thay Đổi' : 'Thêm Khách Mời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== VENDOR MODAL ====================
interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorToEdit?: WeddingVendor | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, vendorToEdit }) => {
  const { addVendor, updateVendor } = useWedding();
  const [serviceType, setServiceType] = useState('');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [status, setStatus] = useState<VendorStatus>('Đang liên hệ');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (vendorToEdit) {
      setServiceType(vendorToEdit.service_type);
      setName(vendorToEdit.name);
      setContactPerson(vendorToEdit.contact_person || '');
      setPhone(vendorToEdit.phone || '');
      setQuotedPrice(vendorToEdit.quoted_price.toString());
      setDepositAmount(vendorToEdit.deposit_amount.toString());
      setAppointmentDate(vendorToEdit.appointment_date || '');
      setStatus(vendorToEdit.status);
      setNote(vendorToEdit.note || '');
    } else {
      setServiceType('');
      setName('');
      setContactPerson('');
      setPhone('');
      setQuotedPrice('');
      setDepositAmount('');
      setAppointmentDate('');
      setStatus('Đang liên hệ');
      setNote('');
    }
  }, [vendorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !serviceType.trim()) return;

    const q = parseFloat(quotedPrice) || 0;
    const d = parseFloat(depositAmount) || 0;

    if (vendorToEdit) {
      updateVendor(vendorToEdit.id, {
        service_type: serviceType,
        name,
        contact_person: contactPerson,
        phone,
        quoted_price: q,
        deposit_amount: d,
        appointment_date: appointmentDate,
        status,
        note,
      });
    } else {
      addVendor({
        service_type: serviceType,
        name,
        contact_person: contactPerson,
        phone,
        quoted_price: q,
        deposit_amount: d,
        appointment_date: appointmentDate,
        status,
        note,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{vendorToEdit ? 'Chỉnh Sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loại dịch vụ (*)</label>
              <input
                type="text"
                required
                placeholder="VD: Chụp ảnh, Trang trí..."
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tên đơn vị (*)</label>
              <input
                type="text"
                required
                placeholder="Nhập tên nhà cung cấp..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Người liên hệ</label>
              <input
                type="text"
                placeholder="VD: Chị Lan..."
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">SĐT liên hệ</label>
              <input
                type="text"
                placeholder="0909..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Báo giá (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đặt cọc (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày hẹn thực hiện</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              >
                <option value="Đang liên hệ">Đang liên hệ</option>
                <option value="Đã báo giá">Đã báo giá</option>
                <option value="Đã đặt cọc">Đã đặt cọc</option>
                <option value="Đã thanh toán hết">Đã thanh toán hết</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Ghi chú hợp đồng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs">
              {vendorToEdit ? 'Lưu Thay Đổi' : 'Thêm Nhà Cung Cấp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== GIFT MODAL ====================
interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftToEdit?: WeddingBetrothalGift | null;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, giftToEdit }) => {
  const { addGift, updateGift } = useWedding();
  const [giftName, setGiftName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [preparedBy, setPreparedBy] = useState<'Nhà trai' | 'Nhà gái'>('Nhà trai');
  const [isPrepared, setIsPrepared] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (giftToEdit) {
      setGiftName(giftToEdit.gift_name);
      setQuantity(giftToEdit.quantity.toString());
      setPreparedBy(giftToEdit.prepared_by);
      setIsPrepared(giftToEdit.is_prepared);
      setNote(giftToEdit.note || '');
    } else {
      setGiftName('');
      setQuantity('1');
      setPreparedBy('Nhà trai');
      setIsPrepared(false);
      setNote('');
    }
  }, [giftToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName.trim()) return;

    const qty = parseInt(quantity) || 1;

    if (giftToEdit) {
      updateGift(giftToEdit.id, { gift_name: giftName, quantity: qty, prepared_by: preparedBy, is_prepared: isPrepared, note });
    } else {
      addGift({ gift_name: giftName, quantity: qty, prepared_by: preparedBy, is_prepared: isPrepared, note });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">{giftToEdit ? 'Chỉnh Sửa Mâm Quả' : 'Thêm Mâm Quả Mới'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên mâm quả / lễ vật (*)</label>
            <input
              type="text"
              required
              placeholder="Nhập tên hạng mục..."
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số lượng mâm</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bên chuẩn bị</label>
              <select
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value as 'Nhà trai' | 'Nhà gái')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white"
              >
                <option value="Nhà trai">Nhà trai</option>
                <option value="Nhà gái">Nhà gái</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_prepared"
              checked={isPrepared}
              onChange={(e) => setIsPrepared(e.target.checked)}
              className="w-4 h-4 rounded text-pink-600 accent-pink-600 bg-slate-100"
            />
            <label htmlFor="is_prepared" className="text-xs text-slate-700 font-medium cursor-pointer">
              Đã hoàn tất chuẩn bị mâm quả này?
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              placeholder="Yêu cầu chi tiết mâm quả..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-xs">
              {giftToEdit ? 'Lưu Thay Đổi' : 'Thêm Mâm Quả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
