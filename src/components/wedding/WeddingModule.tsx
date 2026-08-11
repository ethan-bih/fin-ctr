'use client';

import React, { useState } from 'react';
import { WeddingOverviewTab } from './tabs/WeddingOverviewTab';
import { WeddingEventsTab } from './tabs/WeddingEventsTab';
import { WeddingTimelineTab } from './tabs/WeddingTimelineTab';
import { WeddingBudgetTab } from './tabs/WeddingBudgetTab';
import { WeddingGuestsTab } from './tabs/WeddingGuestsTab';
import { WeddingVendorsTab } from './tabs/WeddingVendorsTab';
import { WeddingGiftsTab } from './tabs/WeddingGiftsTab';
import {
  EventModal,
  TaskModal,
  BudgetModal,
  GuestModal,
  VendorModal,
  GiftModal,
} from './modals/WeddingModals';
import { WeddingEventDate, WeddingTask, WeddingBudgetItem, WeddingGuest, WeddingVendor, WeddingBetrothalGift } from '@/lib/weddingTypes';
import { LayoutDashboard, CalendarDays, CheckSquare, Wallet, Users, Store, Gift } from 'lucide-react';

type SubTabType = 'overview' | 'events' | 'timeline' | 'budget' | 'guests' | 'vendors' | 'gifts';

export const WeddingModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('overview');

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<WeddingEventDate | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<WeddingTask | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetItemToEdit, setBudgetItemToEdit] = useState<WeddingBudgetItem | null>(null);

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<WeddingGuest | null>(null);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<WeddingVendor | null>(null);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<WeddingBetrothalGift | null>(null);

  // Modal Handlers
  const handleOpenEventModal = (event?: WeddingEventDate) => {
    setEventToEdit(event || null);
    setIsEventModalOpen(true);
  };

  const handleOpenTaskModal = (task?: WeddingTask) => {
    setTaskToEdit(task || null);
    setIsTaskModalOpen(true);
  };

  const handleOpenBudgetModal = (item?: WeddingBudgetItem) => {
    setBudgetItemToEdit(item || null);
    setIsBudgetModalOpen(true);
  };

  const handleOpenGuestModal = (guest?: WeddingGuest) => {
    setGuestToEdit(guest || null);
    setIsGuestModalOpen(true);
  };

  const handleOpenVendorModal = (vendor?: WeddingVendor) => {
    setVendorToEdit(vendor || null);
    setIsVendorModalOpen(true);
  };

  const handleOpenGiftModal = (gift?: WeddingBetrothalGift) => {
    setGiftToEdit(gift || null);
    setIsGiftModalOpen(true);
  };

  const subNavItems: { id: SubTabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'events', label: 'Lịch Ngày Lễ', icon: CalendarDays },
    { id: 'timeline', label: 'Công Việc', icon: CheckSquare },
    { id: 'budget', label: 'Ngân Sách', icon: Wallet },
    { id: 'guests', label: 'Khách Mời', icon: Users },
    { id: 'vendors', label: 'Cung Cấp', icon: Store },
    { id: 'gifts', label: 'Mâm Quả', icon: Gift },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-navigation Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-1 overflow-x-auto scrollbar-none scroll-smooth">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-tab View */}
      {activeSubTab === 'overview' && (
        <WeddingOverviewTab
          onSwitchTab={(tab) => setActiveSubTab(tab)}
          onOpenTaskModal={() => handleOpenTaskModal()}
          onOpenBudgetModal={() => handleOpenBudgetModal()}
          onOpenGuestModal={() => handleOpenGuestModal()}
        />
      )}
      {activeSubTab === 'events' && (
        <WeddingEventsTab onOpenEventModal={(evt) => handleOpenEventModal(evt)} />
      )}
      {activeSubTab === 'timeline' && (
        <WeddingTimelineTab onOpenTaskModal={(task) => handleOpenTaskModal(task)} />
      )}
      {activeSubTab === 'budget' && (
        <WeddingBudgetTab onOpenBudgetModal={(item) => handleOpenBudgetModal(item)} />
      )}
      {activeSubTab === 'guests' && (
        <WeddingGuestsTab onOpenGuestModal={(guest) => handleOpenGuestModal(guest)} />
      )}
      {activeSubTab === 'vendors' && (
        <WeddingVendorsTab onOpenVendorModal={(vendor) => handleOpenVendorModal(vendor)} />
      )}
      {activeSubTab === 'gifts' && (
        <WeddingGiftsTab onOpenGiftModal={(gift) => handleOpenGiftModal(gift)} />
      )}

      {/* Render Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={eventToEdit}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        itemToEdit={budgetItemToEdit}
      />
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        guestToEdit={guestToEdit}
      />
      <VendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        vendorToEdit={vendorToEdit}
      />
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        giftToEdit={giftToEdit}
      />
    </div>
  );
};
