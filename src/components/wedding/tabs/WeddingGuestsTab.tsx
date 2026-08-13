'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingGuest, RsvpStatus } from '@/lib/weddingTypes';
import { Plus, Search, Phone, CheckSquare, Square, Trash2, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface WeddingGuestsTabProps {
  onOpenGuestModal: (guestToEdit?: WeddingGuest) => void;
}

export const WeddingGuestsTab: React.FC<WeddingGuestsTabProps> = ({ onOpenGuestModal }) => {
  const { guests, updateGuest, deleteGuest } = useWedding();
  const [search, setSearch] = useState('');
  const [selectedSide, setSelectedSide] = useState<string>('ALL');
  const [selectedRsvp, setSelectedRsvp] = useState<string>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      (g.relationship && g.relationship.toLowerCase().includes(search.toLowerCase())) ||
      (g.table_no && g.table_no.toLowerCase().includes(search.toLowerCase()));

    const matchesSide = selectedSide === 'ALL' || g.side === selectedSide;
    const matchesRsvp = selectedRsvp === 'ALL' || g.rsvp_status === selectedRsvp;

    return matchesSearch && matchesSide && matchesRsvp;
  });

  const activeFilterCount = (selectedSide !== 'ALL' ? 1 : 0) + (selectedRsvp !== 'ALL' ? 1 : 0);

  const resetFilters = () => {
    setSelectedSide('ALL');
    setSelectedRsvp('ALL');
    setSearch('');
  };

  // Counters
  const totalGuests = guests.length;
  const groomGuests = guests.filter((g) => g.side === 'Nhà trai').length;
  const brideGuests = guests.filter((g) => g.side === 'Nhà gái').length;
  const confirmedCount = guests.filter((g) => g.rsvp_status === 'Đã xác nhận').length;

  const toggleInvitation = (guest: WeddingGuest) => {
    updateGuest(guest.id, { invitation_sent: !guest.invitation_sent });
  };

  const handleRsvpChange = (guestId: string, status: RsvpStatus) => {
    updateGuest(guestId, { rsvp_status: status });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Danh Sách Khách Mời</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
              {filteredGuests.length}/{totalGuests}
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            Quản lý lời mời, phân loại Nhà trai / Nhà gái, theo dõi RSVP &amp; xếp bàn tiệc
          </p>
        </div>

        <button
          onClick={() => onOpenGuestModal()}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Khách</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Khách Nhà Trai</div>
          <div className="text-lg sm:text-xl font-bold text-blue-600 mt-1">{groomGuests} <span className="text-xs font-normal text-slate-500">thiệp</span></div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Khách Nhà Gái</div>
          <div className="text-lg sm:text-xl font-bold text-pink-600 mt-1">{brideGuests} <span className="text-xs font-normal text-slate-500">thiệp</span></div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Đã Xác Nhận</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">{confirmedCount} <span className="text-xs font-normal text-slate-500">khách</span></div>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Số Lượng Dự Tiệc</div>
          <div className="text-lg sm:text-xl font-bold text-purple-600 mt-1">
            {guests.reduce((acc, g) => acc + (g.rsvp_status === 'Đã xác nhận' ? 1 + g.accompany_count : 0), 0)} <span className="text-xs font-normal text-slate-500">người</span>
          </div>
        </div>
      </div>

      {/* Sleek Compact Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, bàn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center">
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
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                <span>Lọc Danh Sách Khách Mời</span>
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
                <label className="block font-semibold mb-1">Phân loại theo bên</label>
                <select
                  value={selectedSide}
                  onChange={(e) => setSelectedSide(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">Tất cả bên (Nhà trai & Nhà gái)</option>
                  <option value="Nhà trai">Chỉ Nhà trai</option>
                  <option value="Nhà gái">Chỉ Nhà gái</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Trạng thái phản hồi RSVP</label>
                <select
                  value={selectedRsvp}
                  onChange={(e) => setSelectedRsvp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">Tất cả trạng thái RSVP</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Chưa phản hồi">Chưa phản hồi</option>
                  <option value="Từ chối">Từ chối</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-purple-600"
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
        {filteredGuests.length > 0 ? (
          filteredGuests.map((g) => {
            return (
              <div key={g.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{g.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                          g.side === 'Nhà trai'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-pink-50 text-pink-700 border border-pink-200'
                        }`}
                      >
                        {g.side}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{g.relationship || 'Khách mời'}</p>
                  </div>

                  <select
                    value={g.rsvp_status}
                    onChange={(e) => handleRsvpChange(g.id, e.target.value as RsvpStatus)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                      g.rsvp_status === 'Đã xác nhận'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : g.rsvp_status === 'Từ chối'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <option value="Chưa phản hồi">Chưa phản hồi</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Từ chối">Từ chối</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  <span>Bàn tiệc: <strong className="text-slate-900">{g.table_no || 'Chưa xếp'}</strong></span>
                  <span>Đi kèm: <strong className="text-purple-600">+{g.accompany_count} người</strong></span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <button
                    onClick={() => toggleInvitation(g)}
                    className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      g.invitation_sent
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {g.invitation_sent ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    <span>{g.invitation_sent ? 'Đã gửi thiệp' : 'Chưa gửi'}</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenGuestModal(g)}
                      className="text-xs font-semibold text-slate-600 hover:text-purple-600 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteGuest(g.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-slate-100"
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
            Không tìm thấy khách mời nào.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>=640px) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Tên khách mời</th>
                <th className="py-3.5 px-4 font-semibold">Bên</th>
                <th className="py-3.5 px-4 font-semibold">Gửi thiệp</th>
                <th className="py-3.5 px-4 font-semibold">RSVP</th>
                <th className="py-3.5 px-4 font-semibold text-center">Đi kèm</th>
                <th className="py-3.5 px-4 font-semibold">Bàn số</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4 min-w-[180px]">
                      <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {g.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>{g.relationship}</span>
                        {g.phone && (
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <Phone className="w-3 h-3" />
                            {g.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          g.side === 'Nhà trai'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-pink-50 text-pink-700 border border-pink-200'
                        }`}
                      >
                        {g.side}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleInvitation(g)}
                        className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                          g.invitation_sent
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {g.invitation_sent ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{g.invitation_sent ? 'Đã gửi' : 'Chưa gửi'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={g.rsvp_status}
                        onChange={(e) => handleRsvpChange(g.id, e.target.value as RsvpStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          g.rsvp_status === 'Đã xác nhận'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : g.rsvp_status === 'Từ chối'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Chưa phản hồi">Chưa phản hồi</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Từ chối">Từ chối</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                      +{g.accompany_count}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                      {g.table_no || <span className="text-slate-400 italic">Chưa xếp</span>}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => onOpenGuestModal(g)}
                        className="text-xs text-slate-600 hover:text-purple-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteGuest(g.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy khách mời nào phù hợp.
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
