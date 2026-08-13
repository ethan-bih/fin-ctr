'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Database, RefreshCw } from 'lucide-react';

export const SettingsConfig: React.FC = () => {
  const { isLiveMode, cloudUserId, clearLocalData } = useFinance();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base sm:text-xl font-bold text-slate-900">Cấu Hình Kết Nối Cloud</h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Đồng bộ Supabase tự động</p>
      </div>

      {/* Connection Status Box */}
      <div
        className={`bg-white rounded-2xl p-6 border shadow-xs ${
          isLiveMode ? 'border-emerald-300 bg-emerald-50/20' : 'border-amber-300 bg-amber-50/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isLiveMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Trạng thái: {isLiveMode ? 'Đã Kết Nối Supabase Live Cloud' : 'Chế Độ Cục Bộ (LocalStorage)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isLiveMode
                  ? `Cloud session tự động: ${cloudUserId?.slice(0, 8)}...`
                  : 'Dữ liệu được lưu tạm trên trình duyệt. Hãy cấu hình Supabase để lưu dữ liệu thực tế.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Local Data */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Làm Sạch Dữ Liệu Cục Bộ</h4>
          <p className="text-xs text-slate-500">Xóa dữ liệu đang lưu trong trình duyệt và đưa app về trạng thái trống</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn xóa dữ liệu cục bộ hiện tại không?')) {
              clearLocalData();
            }
          }}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Xóa dữ liệu</span>
        </button>
      </div>
    </div>
  );
};
