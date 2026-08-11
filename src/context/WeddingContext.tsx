'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WeddingTask,
  WeddingBudgetItem,
  WeddingGuest,
  WeddingVendor,
  WeddingBetrothalGift,
  WeddingEventDate,
  WeddingSummary,
  DEFAULT_WEDDING_DATE,
  INITIAL_WEDDING_EVENTS,
  INITIAL_WEDDING_TASKS,
  INITIAL_WEDDING_BUDGETS,
  INITIAL_WEDDING_GUESTS,
  INITIAL_WEDDING_VENDORS,
  INITIAL_WEDDING_GIFTS,
} from '@/lib/weddingTypes';

interface WeddingContextType {
  weddingDate: string;
  setWeddingDate: (date: string) => void;

  eventDates: WeddingEventDate[];
  addEventDate: (evt: Omit<WeddingEventDate, 'id'>) => void;
  updateEventDate: (id: string, updates: Partial<WeddingEventDate>) => void;
  deleteEventDate: (id: string) => void;

  tasks: WeddingTask[];
  addTask: (task: Omit<WeddingTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<WeddingTask>) => void;
  deleteTask: (id: string) => void;

  budgets: WeddingBudgetItem[];
  addBudgetItem: (item: Omit<WeddingBudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<WeddingBudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  guests: WeddingGuest[];
  addGuest: (guest: Omit<WeddingGuest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<WeddingGuest>) => void;
  deleteGuest: (id: string) => void;

  vendors: WeddingVendor[];
  addVendor: (vendor: Omit<WeddingVendor, 'id'>) => void;
  updateVendor: (id: string, updates: Partial<WeddingVendor>) => void;
  deleteVendor: (id: string) => void;

  gifts: WeddingBetrothalGift[];
  addGift: (gift: Omit<WeddingBetrothalGift, 'id'>) => void;
  updateGift: (id: string, updates: Partial<WeddingBetrothalGift>) => void;
  deleteGift: (id: string) => void;

  summary: WeddingSummary;
  resetWeddingData: () => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const LOCAL_STORAGE_DATE_KEY = 'pf_wedding_date_v1';
const LOCAL_STORAGE_EVENTS_KEY = 'pf_wedding_event_dates_v1';
const LOCAL_STORAGE_TASKS_KEY = 'pf_wedding_tasks_v1';
const LOCAL_STORAGE_BUDGETS_KEY = 'pf_wedding_budgets_v1';
const LOCAL_STORAGE_GUESTS_KEY = 'pf_wedding_guests_v1';
const LOCAL_STORAGE_VENDORS_KEY = 'pf_wedding_vendors_v1';
const LOCAL_STORAGE_GIFTS_KEY = 'pf_wedding_gifts_v1';

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingDate, setWeddingDateState] = useState<string>(DEFAULT_WEDDING_DATE);
  const [eventDates, setEventDates] = useState<WeddingEventDate[]>([]);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [budgets, setBudgets] = useState<WeddingBudgetItem[]>([]);
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [vendors, setVendors] = useState<WeddingVendor[]>([]);
  const [gifts, setGifts] = useState<WeddingBetrothalGift[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const sDate = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
      const sEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      const sTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      const sBudgets = localStorage.getItem(LOCAL_STORAGE_BUDGETS_KEY);
      const sGuests = localStorage.getItem(LOCAL_STORAGE_GUESTS_KEY);
      const sVendors = localStorage.getItem(LOCAL_STORAGE_VENDORS_KEY);
      const sGifts = localStorage.getItem(LOCAL_STORAGE_GIFTS_KEY);

      if (sDate) setWeddingDateState(sDate);
      setEventDates(sEvents ? JSON.parse(sEvents) : INITIAL_WEDDING_EVENTS);
      setTasks(sTasks ? JSON.parse(sTasks) : INITIAL_WEDDING_TASKS);
      setBudgets(sBudgets ? JSON.parse(sBudgets) : INITIAL_WEDDING_BUDGETS);
      setGuests(sGuests ? JSON.parse(sGuests) : INITIAL_WEDDING_GUESTS);
      setVendors(sVendors ? JSON.parse(sVendors) : INITIAL_WEDDING_VENDORS);
      setGifts(sGifts ? JSON.parse(sGifts) : INITIAL_WEDDING_GIFTS);
    } catch (e) {
      console.error('Failed to parse wedding data from localStorage:', e);
      setEventDates(INITIAL_WEDDING_EVENTS);
      setTasks(INITIAL_WEDDING_TASKS);
      setBudgets(INITIAL_WEDDING_BUDGETS);
      setGuests(INITIAL_WEDDING_GUESTS);
      setVendors(INITIAL_WEDDING_VENDORS);
      setGifts(INITIAL_WEDDING_GIFTS);
    }
  }, []);

  // Sync state helpers
  const setWeddingDate = (date: string) => {
    setWeddingDateState(date);
    localStorage.setItem(LOCAL_STORAGE_DATE_KEY, date);
  };

  const saveEvents = (newEvents: WeddingEventDate[]) => {
    setEventDates(newEvents);
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(newEvents));
  };

  const saveTasks = (newTasks: WeddingTask[]) => {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(newTasks));
  };

  const saveBudgets = (newBudgets: WeddingBudgetItem[]) => {
    setBudgets(newBudgets);
    localStorage.setItem(LOCAL_STORAGE_BUDGETS_KEY, JSON.stringify(newBudgets));
  };

  const saveGuests = (newGuests: WeddingGuest[]) => {
    setGuests(newGuests);
    localStorage.setItem(LOCAL_STORAGE_GUESTS_KEY, JSON.stringify(newGuests));
  };

  const saveVendors = (newVendors: WeddingVendor[]) => {
    setVendors(newVendors);
    localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(newVendors));
  };

  const saveGifts = (newGifts: WeddingBetrothalGift[]) => {
    setGifts(newGifts);
    localStorage.setItem(LOCAL_STORAGE_GIFTS_KEY, JSON.stringify(newGifts));
  };

  // CRUD Events
  const addEventDate = (evt: Omit<WeddingEventDate, 'id'>) => {
    const newEvt: WeddingEventDate = { ...evt, id: `evt-${Date.now()}` };
    saveEvents([...eventDates, newEvt]);
  };

  const updateEventDate = (id: string, updates: Partial<WeddingEventDate>) => {
    saveEvents(eventDates.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEventDate = (id: string) => {
    saveEvents(eventDates.filter((e) => e.id !== id));
  };

  // CRUD Tasks
  const addTask = (task: Omit<WeddingTask, 'id'>) => {
    const newTask: WeddingTask = { ...task, id: `w-task-${Date.now()}` };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<WeddingTask>) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  // CRUD Budgets
  const addBudgetItem = (item: Omit<WeddingBudgetItem, 'id'>) => {
    const newItem: WeddingBudgetItem = { ...item, id: `w-bgt-${Date.now()}` };
    saveBudgets([...budgets, newItem]);
  };

  const updateBudgetItem = (id: string, updates: Partial<WeddingBudgetItem>) => {
    saveBudgets(budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBudgetItem = (id: string) => {
    saveBudgets(budgets.filter((b) => b.id !== id));
  };

  // CRUD Guests
  const addGuest = (guest: Omit<WeddingGuest, 'id'>) => {
    const newGuest: WeddingGuest = { ...guest, id: `w-gst-${Date.now()}` };
    saveGuests([...guests, newGuest]);
  };

  const updateGuest = (id: string, updates: Partial<WeddingGuest>) => {
    saveGuests(guests.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGuest = (id: string) => {
    saveGuests(guests.filter((g) => g.id !== id));
  };

  // CRUD Vendors
  const addVendor = (vendor: Omit<WeddingVendor, 'id'>) => {
    const newVendor: WeddingVendor = { ...vendor, id: `w-vnd-${Date.now()}` };
    saveVendors([...vendors, newVendor]);
  };

  const updateVendor = (id: string, updates: Partial<WeddingVendor>) => {
    saveVendors(vendors.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVendor = (id: string) => {
    saveVendors(vendors.filter((v) => v.id !== id));
  };

  // CRUD Gifts
  const addGift = (gift: Omit<WeddingBetrothalGift, 'id'>) => {
    const newGift: WeddingBetrothalGift = { ...gift, id: `w-gft-${Date.now()}` };
    saveGifts([...gifts, newGift]);
  };

  const updateGift = (id: string, updates: Partial<WeddingBetrothalGift>) => {
    saveGifts(gifts.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGift = (id: string) => {
    saveGifts(gifts.filter((g) => g.id !== id));
  };

  // Summary Metrics
  const summary: WeddingSummary = {
    totalEstimatedBudget: budgets.reduce((acc, b) => acc + b.estimated_cost, 0),
    totalActualExpense: budgets.reduce((acc, b) => acc + b.actual_cost, 0),
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'Hoàn thành').length,
    totalGuests: guests.length,
    confirmedGuests: guests.filter((g) => g.rsvp_status === 'Đã xác nhận').length,
    totalAccompanying: guests.reduce((acc, g) => acc + (g.rsvp_status === 'Đã xác nhận' ? 1 + g.accompany_count : 0), 0),
    totalVendors: vendors.length,
    depositedVendors: vendors.filter((v) => v.status === 'Đã đặt cọc' || v.status === 'Đã thanh toán hết').length,
  };

  const resetWeddingData = useCallback(() => {
    setWeddingDateState(DEFAULT_WEDDING_DATE);
    saveEvents(INITIAL_WEDDING_EVENTS);
    saveTasks(INITIAL_WEDDING_TASKS);
    saveBudgets(INITIAL_WEDDING_BUDGETS);
    saveGuests(INITIAL_WEDDING_GUESTS);
    saveVendors(INITIAL_WEDDING_VENDORS);
    saveGifts(INITIAL_WEDDING_GIFTS);
  }, []);

  return (
    <WeddingContext.Provider
      value={{
        weddingDate,
        setWeddingDate,
        eventDates,
        addEventDate,
        updateEventDate,
        deleteEventDate,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        budgets,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        guests,
        addGuest,
        updateGuest,
        deleteGuest,
        vendors,
        addVendor,
        updateVendor,
        deleteVendor,
        gifts,
        addGift,
        updateGift,
        deleteGift,
        summary,
        resetWeddingData,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
