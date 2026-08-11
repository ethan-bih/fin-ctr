'use client';

import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingVendor, VendorStatus } from '@/lib/weddingTypes';
import { Plus, Search, Store, Phone, Calendar, Trash2 } from 'lucide-react';

interface WeddingVendorsTabProps {
  onOpenVendorModal: (vendorToEdit?: WeddingVendor) => void;
}

export const WeddingVendorsTab: React.FC<WeddingVendorsTabProps> = ({ onOpenVendorModal }) => {
  const { vendors, updateVendor, deleteVendor } = useWedding();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.service_type.toLowerCase().includes(search.toLowerCase()) ||
      (v.contact_person && v.contact_person.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalQuoted = filteredVendors.reduce((acc, v) => acc + v.quoted_price, 0);
  const totalDeposited = filteredVendors.reduce((acc, v) => acc + v.deposit_amount, 0);

  const handleStatusChange = (vendorId: string, status: VendorStatus) => {
    updateVendor(vendorId, { status });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Nhà Cung Cấp Dịch Vụ</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
              {filteredVendors.length} đơn vị
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            Quản lý báo giá, tiền đặt cọc và hợp đồng dịch vụ (Studio, Trang trí, Quay phim, Make-up...)
          </p>
        </div>

        <button
          onClick={() => onOpenVendorModal()}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Đơn Vị</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tổng Báo Giá Dịch Vụ</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalQuoted)}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tổng Đã Đặt Cọc</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalDeposited)}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên đơn vị, loại dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
        >
          <option value="ALL">Tất cả trạng thái hợp đồng</option>
          <option value="Đang liên hệ">Đang liên hệ</option>
          <option value="Đã báo giá">Đã báo giá</option>
          <option value="Đã đặt cọc">Đã đặt cọc</option>
          <option value="Đã thanh toán hết">Đã thanh toán hết</option>
        </select>
      </div>

      {/* MOBILE CARD VIEW (<640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{v.name}</h3>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                    {v.service_type}
                  </span>
                </div>

                <select
                  value={v.status}
                  onChange={(e) => handleStatusChange(v.id, e.target.value as VendorStatus)}
                  className="text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none bg-slate-50 text-slate-700 border-slate-200"
                >
                  <option value="Đang liên hệ">Đang liên hệ</option>
                  <option value="Đã báo giá">Đã báo giá</option>
                  <option value="Đã đặt cọc">Đã đặt cọc</option>
                  <option value="Đã thanh toán hết">Đã thanh toán hết</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500">Báo giá:</span>
                  <div className="font-bold text-slate-900">{formatCurrency(v.quoted_price)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Đã cọc:</span>
                  <div className="font-bold text-rose-600">{formatCurrency(v.deposit_amount)}</div>
                </div>
              </div>

              {v.contact_person && (
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Liên hệ: {v.contact_person}</span>
                  {v.phone && <span>SĐT: {v.phone}</span>}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => onOpenVendorModal(v)}
                  className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-slate-100"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteVendor(v.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
            Không tìm thấy nhà cung cấp nào.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>=640px) */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Đơn vị & Dịch vụ</th>
                <th className="py-3.5 px-4 font-semibold">Liên hệ</th>
                <th className="py-3.5 px-4 font-semibold text-right">Báo giá (VNĐ)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Đặt cọc (VNĐ)</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                        {v.name}
                      </div>
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                        {v.service_type}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                      <div>{v.contact_person || '-'}</div>
                      {v.phone && <div className="text-slate-400 font-medium">{v.phone}</div>}
                    </td>

                    <td className="py-4 px-4 text-right font-medium text-slate-800 whitespace-nowrap">
                      {formatCurrency(v.quoted_price)}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-rose-600 whitespace-nowrap">
                      {formatCurrency(v.deposit_amount)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as VendorStatus)}
                        className="text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none bg-slate-50 text-slate-700 border-slate-200"
                      >
                        <option value="Đang liên hệ">Đang liên hệ</option>
                        <option value="Đã báo giá">Đã báo giá</option>
                        <option value="Đã đặt cọc">Đã đặt cọc</option>
                        <option value="Đã thanh toán hết">Đã thanh toán hết</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => onOpenVendorModal(v)}
                        className="text-xs text-slate-600 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteVendor(v.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy nhà cung cấp nào.
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
