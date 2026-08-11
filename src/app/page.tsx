'use client';

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { WeddingProvider } from '@/context/WeddingContext';
import { Sidebar } from '@/components/Sidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { SixJarsTracker } from '@/components/SixJarsTracker';
import { TransactionList } from '@/components/TransactionList';
import { BudgetTracker } from '@/components/BudgetTracker';
import { SavingsGoals } from '@/components/SavingsGoals';
import { ReportsAnalytics } from '@/components/ReportsAnalytics';
import { SettingsConfig } from '@/components/SettingsConfig';
import { WeddingModule } from '@/components/wedding/WeddingModule';
import { TransactionModal } from '@/components/TransactionModal';
import { LoginPage } from '@/components/auth/LoginPage';
import { UserProfilePage } from '@/components/user/UserProfilePage';

function MainAppContent() {
  const { user, activeTab } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  // If user is not logged in or active tab is login, show Full-Screen Login Page cleanly!
  if (!user || activeTab === 'login') {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar Pane (Handles all navigation & user profile actions) */}
        <Sidebar
          isMobileDrawerOpen={isMobileDrawerOpen}
          setIsMobileDrawerOpen={setIsMobileDrawerOpen}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Dynamic Content View */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 pb-24 lg:pb-8">
          {activeTab === 'user' && <UserProfilePage />}
          {activeTab === 'dashboard' && <DashboardOverview onOpenAddModal={handleOpenAddModal} />}
          {activeTab === 'wedding' && <WeddingModule />}
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
      <WeddingProvider>
        <MainAppContent />
      </WeddingProvider>
    </FinanceProvider>
  );
}
