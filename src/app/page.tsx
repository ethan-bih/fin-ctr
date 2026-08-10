'use client';

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { SixJarsTracker } from '@/components/SixJarsTracker';
import { TransactionList } from '@/components/TransactionList';
import { BudgetTracker } from '@/components/BudgetTracker';
import { SavingsGoals } from '@/components/SavingsGoals';
import { ReportsAnalytics } from '@/components/ReportsAnalytics';
import { SettingsConfig } from '@/components/SettingsConfig';
import { TransactionModal } from '@/components/TransactionModal';

function MainAppContent() {
  const { activeTab } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar onOpenAddModal={handleOpenAddModal} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && <DashboardOverview onOpenAddModal={handleOpenAddModal} />}
          {activeTab === 'jars' && <SixJarsTracker />}
          {activeTab === 'transactions' && <TransactionList onOpenAddModal={handleOpenAddModal} />}
          {activeTab === 'budgets' && <BudgetTracker />}
          {activeTab === 'savings' && <SavingsGoals />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'settings' && <SettingsConfig />}
        </main>
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
