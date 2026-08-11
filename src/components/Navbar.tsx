'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Wallet, Plus, LogOut, CheckCircle2, AlertCircle, ShieldCheck, Menu, HeartHandshake, User, Shield, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onToggleMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onToggleMobileDrawer }) => {
  const { user, isLiveMode, logout, setActiveTab } = useFinance();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between shadow-2xs">
      {/* Brand & Mobile Menu Toggle */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onToggleMobileDrawer}
          className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          title="Mở Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-rose-500 flex items-center justify-center shadow-2xs shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight whitespace-nowrap">
              Finance &amp; Wedding
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              QH &amp; YN
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* Status Badge */}
        <div
          onClick={() => setActiveTab('settings')}
          className={`hidden md:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border cursor-pointer font-semibold transition-all ${
            isLiveMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {isLiveMode ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cloud Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Mode</span>
            </>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thêm Thu/Chi</span>
          <span className="sm:hidden">Thu/Chi</span>
        </button>

        {/* User Profile Pill / Auth Button */}
        {user ? (
          <div
            onClick={() => setActiveTab('user')}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 p-1 pl-2.5 pr-2 rounded-full border border-slate-200 cursor-pointer transition-all"
            title="Xem hồ sơ người dùng"
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-800 max-w-[90px] sm:max-w-[120px] truncate">
                {user.full_name || user.username}
              </span>
              {user.role === 'admin' && (
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-rose-500 text-white uppercase">
                  ADMIN
                </span>
              )}
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-900 text-rose-400 flex items-center justify-center text-xs font-black">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
