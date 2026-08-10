'use client';

import React from 'react';
import { useFinance, ActiveTabType } from '@/context/FinanceContext';
import { LayoutDashboard, Receipt, PieChart, Target, BarChart3, Settings, Coins } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();

  const navItems: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'jars', label: 'Quy Tắc 6 Hũ', icon: Coins },
    { id: 'transactions', label: 'Sổ Giao Dịch', icon: Receipt },
    { id: 'budgets', label: 'Hạn Mức Chi', icon: PieChart },
    { id: 'savings', label: 'Quỹ Tiết Kiệm', icon: Target },
    { id: 'reports', label: 'Báo Cáo Thống Kê', icon: BarChart3 },
    { id: 'settings', label: 'Cấu Hình Supabase', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-64 glass-panel border-r border-slate-800 shrink-0 p-4 space-y-2 min-h-[calc(100vh-65px)]">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Danh mục quản lý
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 px-2 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'}`} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
