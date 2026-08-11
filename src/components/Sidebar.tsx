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
  Wallet,
  User,
  LogIn,
  ShieldCheck,
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
  const { activeTab, setActiveTab, user } = useFinance();

  const navItems: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'wedding', label: 'Đám Cưới QH & YN', icon: HeartHandshake },
    { id: 'jars', label: 'Quy Tắc 6 Hũ', icon: Coins },
    { id: 'transactions', label: 'Sổ Giao Dịch', icon: Receipt },
    { id: 'budgets', label: 'Hạn Mức Chi', icon: PieChart },
    { id: 'savings', label: 'Quỹ Tiết Kiệm', icon: Target },
    { id: 'reports', label: 'Báo Cáo Thống Kê', icon: BarChart3 },
    { id: 'user', label: 'Tài Khoản User', icon: User },
    { id: 'settings', label: 'Cấu Hình Supabase', icon: Settings },
  ];

  const handleTabClick = (tabId: ActiveTabType) => {
    setActiveTab(tabId);
    if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
  };

  // Quick 5 items for mobile bottom bar
  const mainBottomTabs: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'wedding', label: 'Đám cưới', icon: HeartHandshake },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'user', label: 'Cá nhân', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 shrink-0 p-4 space-y-6 min-h-screen">
        {/* Sidebar Brand Header */}
        <div
          className="flex items-center space-x-3 px-2 py-1 cursor-pointer"
          onClick={() => handleTabClick('dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">
              Finance &amp; Wedding
            </h1>
            <p className="text-[11px] font-semibold text-rose-600">QH &amp; YN Manager</p>
          </div>
        </div>

        {/* Quick Add Button */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thu / Chi</span>
          </button>
        )}

        {/* Menu Section */}
        <div className="space-y-1">
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
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 p-5 space-y-4 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs">
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

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
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
