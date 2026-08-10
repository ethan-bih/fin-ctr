'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Wallet, Plus, LogIn, LogOut, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { user, isLiveMode, loginWithGoogle, logout, setActiveTab } = useFinance();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100 leading-tight flex items-center gap-2">
            Sổ Thu Chi <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pro</span>
          </h1>
          <p className="text-xs text-slate-400">Quản lý tài chính cá nhân an toàn</p>
        </div>
      </div>

      {/* Mode Indicator & User Actions */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Status Badge */}
        <div
          onClick={() => setActiveTab('settings')}
          className={`hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
            isLiveMode
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/50'
              : 'bg-amber-950/40 text-amber-400 border-amber-500/30 hover:bg-amber-900/50'
          }`}
        >
          {isLiveMode ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Cloud Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Chế độ Demo (Offline)</span>
            </>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs lg:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm Thu/Chi</span>
          <span className="sm:hidden">Thêm</span>
        </button>

        {/* User Auth Section */}
        {isLiveMode ? (
          <div className="flex items-center space-x-3 bg-slate-800/60 p-1.5 pl-3 rounded-full border border-slate-700/60">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt={user.full_name} className="w-7 h-7 rounded-full border border-emerald-500/40" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate hidden md:inline">{user?.full_name}</span>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đăng nhập Gmail</span>
          </button>
        )}
      </div>
    </header>
  );
};
