'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ShieldCheck, Database, Key, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';

export const SettingsConfig: React.FC = () => {
  const { isLiveMode, user, loginWithGoogle, logout, resetDemoData } = useFinance();
  const [copiedSQL, setCopiedSQL] = React.useState(false);

  const handleCopySQLPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base sm:text-xl font-bold text-slate-900">Cấu Hình Kết Nối Cloud</h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">Đồng bộ Supabase &amp; Google OAuth</p>
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
                Trạng thái: {isLiveMode ? 'Đã Kết Nối Supabase Live Cloud' : 'Chế Độ Dùng Thử (Demo / LocalStorage)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isLiveMode
                  ? `Đang đăng nhập bằng tài khoản: ${user?.email}`
                  : 'Dữ liệu được lưu tạm trên trình duyệt. Hãy cấu hình Supabase để lưu dữ liệu thực tế.'}
              </p>
            </div>
          </div>

          <div>
            {isLiveMode ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 font-semibold text-xs rounded-xl shadow-xs transition-all"
              >
                Đăng Xuất
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng Nhập Google Auth</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Đặt Lại Dữ Liệu Thử Nghiệm (Reset Demo Data)</h4>
          <p className="text-xs text-slate-500">Xóa dữ liệu cũ và nạp lại danh mục thu chi & 6 hũ mặc định ban đầu</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu mẫu thử nghiệm không?')) {
              resetDemoData();
            }
          }}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
