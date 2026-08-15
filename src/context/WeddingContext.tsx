'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { createClient } from '@/lib/supabase/client';
import {
  deleteWeddingRecord,
  fetchWeddingSnapshot,
  hasWeddingSnapshotData,
  insertWeddingRecord,
  seedWeddingSnapshot,
  updateWeddingRecord,
  upsertWeddingSettings,
  WeddingSnapshot,
} from '@/lib/weddingSupabase';
import {
  WeddingTask,
  WeddingBudgetItem,
  WeddingGuest,
  WeddingVendor,
  WeddingBetrothalGift,
  WeddingEventDate,
  WeddingSummary,
  DEFAULT_WEDDING_DATE,
  DEFAULT_TARGET_BUDGET,
  INITIAL_WEDDING_EVENTS,
  INITIAL_WEDDING_TASKS,
  INITIAL_WEDDING_BUDGETS,
  INITIAL_WEDDING_GUESTS,
  INITIAL_WEDDING_VENDORS,
  INITIAL_WEDDING_GIFTS,
} from '@/lib/weddingTypes';

interface WeddingContextType {
  weddingDate: string;
  setWeddingDate: (date: string) => Promise<void>;

  targetBudget: number;
  setTargetBudget: (budget: number) => Promise<void>;

  eventDates: WeddingEventDate[];
  addEventDate: (evt: Omit<WeddingEventDate, 'id'>) => Promise<void>;
  updateEventDate: (id: string, updates: Partial<WeddingEventDate>) => Promise<void>;
  deleteEventDate: (id: string) => Promise<void>;

  tasks: WeddingTask[];
  addTask: (task: Omit<WeddingTask, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<WeddingTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  budgets: WeddingBudgetItem[];
  addBudgetItem: (item: Omit<WeddingBudgetItem, 'id'>) => Promise<void>;
  updateBudgetItem: (id: string, updates: Partial<WeddingBudgetItem>) => Promise<void>;
  deleteBudgetItem: (id: string) => Promise<void>;

  guests: WeddingGuest[];
  addGuest: (guest: Omit<WeddingGuest, 'id'>) => Promise<void>;
  updateGuest: (id: string, updates: Partial<WeddingGuest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;

  vendors: WeddingVendor[];
  addVendor: (vendor: Omit<WeddingVendor, 'id'>) => Promise<void>;
  updateVendor: (id: string, updates: Partial<WeddingVendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;

  gifts: WeddingBetrothalGift[];
  addGift: (gift: Omit<WeddingBetrothalGift, 'id'>) => Promise<void>;
  updateGift: (id: string, updates: Partial<WeddingBetrothalGift>) => Promise<void>;
  deleteGift: (id: string) => Promise<void>;

  summary: WeddingSummary;
  resetWeddingData: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const LOCAL_STORAGE_DATE_KEY = 'pf_wedding_date_v1';
const LOCAL_STORAGE_TARGET_BUDGET_KEY = 'pf_wedding_target_budget_v1';
const LOCAL_STORAGE_EVENTS_KEY = 'pf_wedding_event_dates_v1';
const LOCAL_STORAGE_TASKS_KEY = 'pf_wedding_tasks_v1';
const LOCAL_STORAGE_BUDGETS_KEY = 'pf_wedding_budgets_v1';
const LOCAL_STORAGE_GUESTS_KEY = 'pf_wedding_guests_v1';
const LOCAL_STORAGE_VENDORS_KEY = 'pf_wedding_vendors_v1';
const LOCAL_STORAGE_GIFTS_KEY = 'pf_wedding_gifts_v1';

const createLocalId = (prefix: string) => `${prefix}-${Date.now()}`;

const defaultSnapshot = (): WeddingSnapshot => ({
  settings: {
    wedding_date: DEFAULT_WEDDING_DATE,
    target_budget: DEFAULT_TARGET_BUDGET,
  },
  eventDates: INITIAL_WEDDING_EVENTS,
  tasks: INITIAL_WEDDING_TASKS,
  budgets: INITIAL_WEDDING_BUDGETS,
  guests: INITIAL_WEDDING_GUESTS,
  vendors: INITIAL_WEDDING_VENDORS,
  gifts: INITIAL_WEDDING_GIFTS,
});

const normalizeBudgetItem = (budget: WeddingBudgetItem): WeddingBudgetItem => ({
  ...budget,
  deposit_amount: budget.deposit_amount ?? 0,
});

const readLocalSnapshot = (): WeddingSnapshot => {
  const fallback = defaultSnapshot();

  try {
    const savedDate = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
    const savedTargetBudget = localStorage.getItem(LOCAL_STORAGE_TARGET_BUDGET_KEY);
    const savedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    const savedBudgets = localStorage.getItem(LOCAL_STORAGE_BUDGETS_KEY);
    const savedGuests = localStorage.getItem(LOCAL_STORAGE_GUESTS_KEY);
    const savedVendors = localStorage.getItem(LOCAL_STORAGE_VENDORS_KEY);
    const savedGifts = localStorage.getItem(LOCAL_STORAGE_GIFTS_KEY);

    return {
      settings: {
        wedding_date: savedDate || fallback.settings?.wedding_date || DEFAULT_WEDDING_DATE,
        target_budget: savedTargetBudget
          ? Number(savedTargetBudget) || DEFAULT_TARGET_BUDGET
          : fallback.settings?.target_budget || DEFAULT_TARGET_BUDGET,
      },
      eventDates: savedEvents ? JSON.parse(savedEvents) : fallback.eventDates,
      tasks: savedTasks ? JSON.parse(savedTasks) : fallback.tasks,
      budgets: savedBudgets ? JSON.parse(savedBudgets) : fallback.budgets,
      guests: savedGuests ? JSON.parse(savedGuests) : fallback.guests,
      vendors: savedVendors ? JSON.parse(savedVendors) : fallback.vendors,
      gifts: savedGifts ? JSON.parse(savedGifts) : fallback.gifts,
    };
  } catch (error) {
    console.error('Failed to parse wedding data from localStorage:', error);
    return fallback;
  }
};

const writeLocalSnapshot = (snapshot: WeddingSnapshot) => {
  if (snapshot.settings) {
    localStorage.setItem(LOCAL_STORAGE_DATE_KEY, snapshot.settings.wedding_date || '');
    localStorage.setItem(LOCAL_STORAGE_TARGET_BUDGET_KEY, snapshot.settings.target_budget.toString());
  }
  localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(snapshot.eventDates));
  localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(snapshot.tasks));
  localStorage.setItem(LOCAL_STORAGE_BUDGETS_KEY, JSON.stringify(snapshot.budgets));
  localStorage.setItem(LOCAL_STORAGE_GUESTS_KEY, JSON.stringify(snapshot.guests));
  localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(snapshot.vendors));
  localStorage.setItem(LOCAL_STORAGE_GIFTS_KEY, JSON.stringify(snapshot.gifts));
};

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLiveMode, cloudUserId } = useFinance();
  const [weddingDate, setWeddingDateState] = useState<string>(DEFAULT_WEDDING_DATE);
  const [targetBudget, setTargetBudgetState] = useState<number>(DEFAULT_TARGET_BUDGET);
  const [eventDates, setEventDates] = useState<WeddingEventDate[]>([]);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [budgets, setBudgets] = useState<WeddingBudgetItem[]>([]);
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [vendors, setVendors] = useState<WeddingVendor[]>([]);
  const [gifts, setGifts] = useState<WeddingBetrothalGift[]>([]);

  const isCloudMode = isLiveMode && Boolean(cloudUserId);

  const applySnapshot = useCallback((snapshot: WeddingSnapshot) => {
    setWeddingDateState(snapshot.settings?.wedding_date || DEFAULT_WEDDING_DATE);
    setTargetBudgetState(snapshot.settings?.target_budget || DEFAULT_TARGET_BUDGET);
    setEventDates(snapshot.eventDates);
    setTasks(snapshot.tasks);
    setBudgets(snapshot.budgets.map(normalizeBudgetItem));
    setGuests(snapshot.guests);
    setVendors(snapshot.vendors);
    setGifts(snapshot.gifts);
  }, []);

  const currentSnapshot = useCallback(
    (settings = { wedding_date: weddingDate, target_budget: targetBudget }): WeddingSnapshot => ({
      settings,
      eventDates,
      tasks,
      budgets,
      guests,
      vendors,
      gifts,
    }),
    [budgets, eventDates, gifts, guests, targetBudget, tasks, vendors, weddingDate]
  );

  const getCloudClient = useCallback(() => {
    const supabase = createClient();
    return isCloudMode && cloudUserId && supabase ? { supabase, userId: cloudUserId } : null;
  }, [cloudUserId, isCloudMode]);

  useEffect(() => {
    let cancelled = false;

    const loadWeddingData = async () => {
      const cloud = getCloudClient();

      if (!cloud) {
        applySnapshot(readLocalSnapshot());
        return;
      }

      try {
        const cloudSnapshot = await fetchWeddingSnapshot(cloud.supabase, cloud.userId);

        if (hasWeddingSnapshotData(cloudSnapshot)) {
          if (!cancelled) applySnapshot(cloudSnapshot);
          return;
        }

        if (!cancelled) applySnapshot(cloudSnapshot);
      } catch (error) {
        console.error('Failed to load wedding data from Supabase:', error);
        if (!cancelled) applySnapshot(defaultSnapshot());
      }
    };

    void loadWeddingData();

    return () => {
      cancelled = true;
    };
  }, [applySnapshot, getCloudClient]);

  const persistSettings = async (settings: { wedding_date: string; target_budget: number }) => {
    const cloud = getCloudClient();
    if (cloud) {
      try {
        await upsertWeddingSettings(cloud.supabase, cloud.userId, settings);
      } catch (error) {
        console.error('Failed to save wedding settings to Supabase:', error);
      }
    } else {
      writeLocalSnapshot(currentSnapshot(settings));
    }
  };

  const setWeddingDate = async (date: string) => {
    setWeddingDateState(date);
    await persistSettings({ wedding_date: date, target_budget: targetBudget });
  };

  const setTargetBudget = async (amount: number) => {
    setTargetBudgetState(amount);
    await persistSettings({ wedding_date: weddingDate, target_budget: amount });
  };

  const addEventDate = async (evt: Omit<WeddingEventDate, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_events', cloud.userId, evt);
        setEventDates((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding event to Supabase:', error);
        return;
      }
    }

    const newEvt: WeddingEventDate = { ...evt, id: createLocalId('w-evt') };
    const updated = [...eventDates, newEvt];
    setEventDates(updated);
    if (!cloud) writeLocalSnapshot({ ...currentSnapshot(), eventDates: updated });
  };

  const updateEventDate = async (id: string, updates: Partial<WeddingEventDate>) => {
    const updated = eventDates.map((event) => (event.id === id ? { ...event, ...updates } : event));
    setEventDates(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_events', id, updates);
        if (saved) setEventDates((prev) => prev.map((event) => (event.id === id ? saved : event)));
      } catch (error) {
        console.error('Failed to update wedding event in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), eventDates: updated });
    }
  };

  const deleteEventDate = async (id: string) => {
    const updated = eventDates.filter((event) => event.id !== id);
    setEventDates(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_events', id);
      } catch (error) {
        console.error('Failed to delete wedding event from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), eventDates: updated });
    }
  };

  const addTask = async (task: Omit<WeddingTask, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_tasks', cloud.userId, task);
        setTasks((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding task to Supabase:', error);
        return;
      }
    }

    const newTask: WeddingTask = { ...task, id: createLocalId('w-tsk') };
    const updated = [...tasks, newTask];
    setTasks(updated);
    if (!cloud) writeLocalSnapshot({ ...currentSnapshot(), tasks: updated });
  };

  const updateTask = async (id: string, updates: Partial<WeddingTask>) => {
    const updated = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task));
    setTasks(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_tasks', id, updates);
        if (saved) setTasks((prev) => prev.map((task) => (task.id === id ? saved : task)));
      } catch (error) {
        console.error('Failed to update wedding task in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), tasks: updated });
    }
  };

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_tasks', id);
      } catch (error) {
        console.error('Failed to delete wedding task from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), tasks: updated });
    }
  };

  const addBudgetItem = async (item: Omit<WeddingBudgetItem, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_budgets', cloud.userId, item);
        setBudgets((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding budget item to Supabase:', error);
        return;
      }
    }

    const newItem: WeddingBudgetItem = { ...item, id: createLocalId('w-bdg') };
    const updated = [...budgets, newItem];
    setBudgets(updated);
    writeLocalSnapshot({ ...currentSnapshot(), budgets: updated });
  };

  const updateBudgetItem = async (id: string, updates: Partial<WeddingBudgetItem>) => {
    const updated = budgets.map((budget) => (budget.id === id ? { ...budget, ...updates } : budget));
    setBudgets(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_budgets', id, updates);
        if (saved) setBudgets((prev) => prev.map((budget) => (budget.id === id ? saved : budget)));
      } catch (error) {
        console.error('Failed to update wedding budget item in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), budgets: updated });
    }
  };

  const deleteBudgetItem = async (id: string) => {
    const updated = budgets.filter((budget) => budget.id !== id);
    setBudgets(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_budgets', id);
      } catch (error) {
        console.error('Failed to delete wedding budget item from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), budgets: updated });
    }
  };

  const addGuest = async (guest: Omit<WeddingGuest, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_guests', cloud.userId, guest);
        setGuests((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding guest to Supabase:', error);
        return;
      }
    }

    const newGuest: WeddingGuest = { ...guest, id: createLocalId('w-gst') };
    const updated = [...guests, newGuest];
    setGuests(updated);
    if (!cloud) writeLocalSnapshot({ ...currentSnapshot(), guests: updated });
  };

  const updateGuest = async (id: string, updates: Partial<WeddingGuest>) => {
    const updated = guests.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest));
    setGuests(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_guests', id, updates);
        if (saved) setGuests((prev) => prev.map((guest) => (guest.id === id ? saved : guest)));
      } catch (error) {
        console.error('Failed to update wedding guest in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), guests: updated });
    }
  };

  const deleteGuest = async (id: string) => {
    const updated = guests.filter((guest) => guest.id !== id);
    setGuests(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_guests', id);
      } catch (error) {
        console.error('Failed to delete wedding guest from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), guests: updated });
    }
  };

  const addVendor = async (vendor: Omit<WeddingVendor, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_vendors', cloud.userId, vendor);
        setVendors((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding vendor to Supabase:', error);
        return;
      }
    }

    const newVendor: WeddingVendor = { ...vendor, id: createLocalId('w-vnd') };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    if (!cloud) writeLocalSnapshot({ ...currentSnapshot(), vendors: updated });
  };

  const updateVendor = async (id: string, updates: Partial<WeddingVendor>) => {
    const updated = vendors.map((vendor) => (vendor.id === id ? { ...vendor, ...updates } : vendor));
    setVendors(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_vendors', id, updates);
        if (saved) setVendors((prev) => prev.map((vendor) => (vendor.id === id ? saved : vendor)));
      } catch (error) {
        console.error('Failed to update wedding vendor in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), vendors: updated });
    }
  };

  const deleteVendor = async (id: string) => {
    const updated = vendors.filter((vendor) => vendor.id !== id);
    setVendors(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_vendors', id);
      } catch (error) {
        console.error('Failed to delete wedding vendor from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), vendors: updated });
    }
  };

  const addGift = async (gift: Omit<WeddingBetrothalGift, 'id'>) => {
    const cloud = getCloudClient();

    if (cloud) {
      try {
        const saved = await insertWeddingRecord(cloud.supabase, 'wedding_gifts', cloud.userId, gift);
        setGifts((prev) => [...prev, saved]);
        return;
      } catch (error) {
        console.error('Failed to add wedding gift to Supabase:', error);
        return;
      }
    }

    const newGift: WeddingBetrothalGift = { ...gift, id: createLocalId('w-gft') };
    const updated = [...gifts, newGift];
    setGifts(updated);
    if (!cloud) writeLocalSnapshot({ ...currentSnapshot(), gifts: updated });
  };

  const updateGift = async (id: string, updates: Partial<WeddingBetrothalGift>) => {
    const updated = gifts.map((gift) => (gift.id === id ? { ...gift, ...updates } : gift));
    setGifts(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const saved = await updateWeddingRecord(cloud.supabase, 'wedding_gifts', id, updates);
        if (saved) setGifts((prev) => prev.map((gift) => (gift.id === id ? saved : gift)));
      } catch (error) {
        console.error('Failed to update wedding gift in Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), gifts: updated });
    }
  };

  const deleteGift = async (id: string) => {
    const updated = gifts.filter((gift) => gift.id !== id);
    setGifts(updated);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        await deleteWeddingRecord(cloud.supabase, 'wedding_gifts', id);
      } catch (error) {
        console.error('Failed to delete wedding gift from Supabase:', error);
      }
    } else {
      writeLocalSnapshot({ ...currentSnapshot(), gifts: updated });
    }
  };

  const totalEst = budgets.reduce((acc, budget) => acc + budget.estimated_cost, 0);
  const totalAct = budgets.reduce((acc, budget) => acc + budget.actual_cost, 0);
  const totalDepositedBudget = budgets.reduce((acc, budget) => acc + budget.deposit_amount, 0);
  const totalRemainingPayment = budgets.reduce((acc, budget) => acc + Math.max(budget.actual_cost - budget.deposit_amount, 0), 0);

  const summary: WeddingSummary = {
    targetBudget,
    totalEstimatedBudget: totalEst,
    totalActualExpense: totalAct,
    totalDepositedBudget,
    totalRemainingPayment,
    remainingBudget: targetBudget - totalAct,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === 'Hoàn thành').length,
    totalGuests: guests.length,
    confirmedGuests: guests.filter((guest) => guest.rsvp_status === 'Đã xác nhận').length,
    totalAccompanying: guests.reduce(
      (acc, guest) => acc + (guest.rsvp_status === 'Đã xác nhận' ? 1 + guest.accompany_count : 0),
      0
    ),
    totalVendors: vendors.length,
    depositedVendors: vendors.filter(
      (vendor) => vendor.status === 'Đã đặt cọc' || vendor.status === 'Đã thanh toán hết'
    ).length,
  };

  const resetWeddingData = async () => {
    const snapshot = defaultSnapshot();
    applySnapshot(snapshot);

    const cloud = getCloudClient();
    if (cloud) {
      try {
        const seededSnapshot = await seedWeddingSnapshot(cloud.supabase, cloud.userId, snapshot);
        applySnapshot(seededSnapshot);
      } catch (error) {
        console.error('Failed to reset wedding data in Supabase:', error);
      }
    } else {
      writeLocalSnapshot(snapshot);
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        weddingDate,
        setWeddingDate,
        targetBudget,
        setTargetBudget,
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
