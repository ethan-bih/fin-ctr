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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Cấu Hình Kết Nối Supabase & Google OAuth</h2>
        <p className="text-sm text-slate-400">Hướng dẫn từng bước để đồng bộ dữ liệu thực tế và deploy trên Vercel</p>
      </div>

      {/* Connection Status Box */}
      <div
        className={`glass-card rounded-2xl p-6 border ${
          isLiveMode ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-amber-500/40 shadow-amber-500/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isLiveMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Trạng thái: {isLiveMode ? 'Đã Kết Nối Supabase Live Cloud' : 'Chế Độ Dùng Thử (Demo / LocalStorage)'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
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
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 font-semibold text-xs rounded-xl transition-all"
              >
                Đăng Xuất
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Thử Đăng Nhập Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step by Step Setup Guide */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          Hướng Dẫn Cấu Hình 3 Bước Cho Vercel & Supabase
        </h3>

        <div className="space-y-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-extrabold text-[11px] flex items-center justify-center">1</span>
              Tạo Project & Khởi Tạo Database SQL trên Supabase
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Truy cập <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>, tạo 1 project mới. Sau đó mở menu <strong>SQL Editor</strong> và dán toàn bộ nội dung file <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300">supabase/schema.sql</code> rồi nhấn <strong>Run</strong>.
            </p>
            <button
              onClick={handleCopySQLPath}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'Đã sao chép đường dẫn!' : 'File SQL: supabase/schema.sql'}</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-extrabold text-[11px] flex items-center justify-center">2</span>
              Bật Google OAuth Provider trong Supabase
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Trong Supabase Console: Vào <strong>Authentication → Providers → Google</strong>. Bật Enable Google Provider. Nhập Client ID và Client Secret từ Google Cloud Console (hoặc chọn Supabase Shared Auth).
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-extrabold text-[11px] flex items-center justify-center">3</span>
              Thêm Biến Môi Trường (Environment Variables) trên Vercel
            </h4>
            <p className="text-slate-400">Thêm 2 biến sau trong phần Project Settings → Environment Variables trên Vercel:</p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-200 space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Button */}
      {!isLiveMode && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-200 text-sm">Đặt Lại Dữ Liệu Dùng Thử (Reset Demo)</h4>
            <p className="text-xs text-slate-400">Khôi phục lại dữ liệu giao dịch mẫu ban đầu trên trình duyệt</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn khôi phục lại dữ liệu giao dịch mẫu?')) {
                resetDemoData();
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mẫu</span>
          </button>
        </div>
      )}
    </div>
  );
};
