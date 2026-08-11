'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Sparkles, Plus, LogOut, CheckCircle2, AlertCircle, ShieldCheck, Menu, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onToggleMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onToggleMobileDrawer }) => {
  const { user, isLiveMode, loginWithGoogle, logout, setActiveTab, activeTab } = useFinance();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileDrawer}
          className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-rose-500 flex items-center justify-center shadow-2xs shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
              <span>Finance &amp; Wedding Hub</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                QH &amp; YN
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Quản lý tài chính cá nhân &amp; Kế hoạch đám cưới
            </p>
          </div>
        </div>
      </div>

      {/* Mode Indicator & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Status Badge */}
        <div
          onClick={() => setActiveTab('settings')}
          className={`hidden md:flex items-center space-x-1.5 text-xs px-3 py-1 rounded-full border cursor-pointer font-semibold transition-all ${
            isLiveMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {isLiveMode ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Cloud Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Chế độ Offline (Demo)</span>
            </>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Ghi Chép Thu/Chi</span>
        </button>

        {/* User Auth Section */}
        {isLiveMode ? (
          <div className="flex items-center space-x-2 bg-slate-100 p-1 pl-2.5 rounded-full border border-slate-200">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt={user.full_name} className="w-7 h-7 rounded-full border border-emerald-500/40" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đăng nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
