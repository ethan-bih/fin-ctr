'use client';

import React from 'react';
import { useFinance, ActiveTabType } from '@/context/FinanceContext';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  BarChart3,
  Settings,
  Coins,
  HeartHandshake,
  Menu,
  X,
  ChevronRight,
  Plus,
  User,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SidebarProps {
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (open: boolean) => void;
  onOpenAddModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileDrawerOpen = false,
  setIsMobileDrawerOpen,
  onOpenAddModal,
}) => {
  const { activeTab, setActiveTab, user, isLiveMode, logout } = useFinance();

  const navItems: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'wedding', label: 'Đám Cưới', icon: HeartHandshake },
    { id: 'jars', label: 'Quy Tắc 6 Hũ', icon: Coins },
    { id: 'transactions', label: 'Sổ Giao Dịch', icon: Receipt },
    { id: 'budgets', label: 'Hạn Mức Chi', icon: PieChart },
    { id: 'savings', label: 'Quỹ Tiết Kiệm', icon: Target },
    { id: 'reports', label: 'Báo Cáo Thống Kê', icon: BarChart3 },
    { id: 'settings', label: 'Cấu Hình Supabase', icon: Settings },
  ];

  const handleTabClick = (tabId: ActiveTabType) => {
    setActiveTab(tabId);
    if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
  };

  // Quick 4 items for mobile bottom bar
  const mainBottomTabs: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'wedding', label: 'Đám cưới', icon: HeartHandshake },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'user', label: 'Cá nhân', icon: User },
  ];

  return (
    <>
      {/* Mobile Top Minimal Bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileDrawerOpen && setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            title="Mở Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleTabClick('dashboard')}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-rose-500 flex items-center justify-center shadow-2xs shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">
              F&amp;W Manager
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thu/Chi</span>
            </button>
          )}

          {user && (
            <div
              onClick={() => handleTabClick('user')}
              className="w-7 h-7 rounded-full bg-slate-900 text-rose-400 flex items-center justify-center text-xs font-black cursor-pointer"
            >
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 p-4 space-y-5 min-h-screen">
        {/* Unified Compact Brand & Profile Header Card */}
        <div className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/90 transition-all space-y-2">
          {/* Top Line: Brand Logo & User Avatar */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-rose-500 flex items-center justify-center shadow-2xs shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-extrabold text-xs text-slate-900 tracking-tight leading-none">
                  F&amp;W Manager
                </h1>
                <p className="text-[10px] font-semibold text-rose-600 mt-0.5">Personal</p>
              </div>
            </div>

            {user && (
              <div
                onClick={() => handleTabClick('user')}
                className="flex items-center space-x-1 p-1 pl-1.5 pr-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-all shadow-2xs"
                title="Tài khoản cá nhân"
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-rose-400 font-black text-[10px] flex items-center justify-center shrink-0">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {user.role === 'admin' && (
                  <span className="text-[8px] font-black px-1 py-0.2 rounded bg-rose-500 text-white uppercase">
                    ADMIN
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Line: Status Indicator Pill */}
          <div
            onClick={() => handleTabClick('settings')}
            className={`flex items-center justify-between px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
              isLiveMode
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              {isLiveMode ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-600" />
              )}
              <span>{isLiveMode ? 'Cloud Sync Active' : 'Local Mode Active'}</span>
            </div>
            <span className="text-[9px] underline">Cấu hình</span>
          </div>
        </div>

        {/* Quick Add Button */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thu / Chi Mới</span>
          </button>
        )}

        {/* Navigation Section */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Danh mục quản lý
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
                logout();
              }
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất Tài Khoản</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen && setIsMobileDrawerOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Slide-over Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 p-5 space-y-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-rose-500 flex items-center justify-center font-bold text-xs">
                FW
              </div>
              <span className="font-extrabold text-slate-900 text-sm">Danh Mục Menu</span>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen && setIsMobileDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card in Mobile Drawer */}
          {user && (
            <div
              onClick={() => handleTabClick('user')}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-rose-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.full_name || user.username}
                      </p>
                      {user.role === 'admin' && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white uppercase">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">@{user.username || 'admin'}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabClick('settings');
                }}
                className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  isLiveMode
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span>{isLiveMode ? 'Cloud Sync Active' : 'Local Mode Active'}</span>
                <span className="underline text-[9px]">Cấu hình</span>
              </div>
            </div>
          )}

          {onOpenAddModal && (
            <button
              onClick={() => {
                onOpenAddModal();
                if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thu / Chi Mới</span>
            </button>
          )}

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
              logout();
            }
          }}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Đăng Xuất</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {mainBottomTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition-all ${
                isActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-rose-600 scale-110' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileDrawerOpen && setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition-all ${
            isMobileDrawerOpen ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span>Tất cả</span>
        </button>
      </div>
    </>
  );
};
