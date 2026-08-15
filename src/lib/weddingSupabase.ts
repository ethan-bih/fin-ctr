import { SupabaseClient } from '@supabase/supabase-js';
import {
  WeddingBetrothalGift,
  WeddingBudgetItem,
  WeddingEventDate,
  WeddingGuest,
  WeddingTask,
  WeddingVendor,
} from './weddingTypes';

export interface WeddingSettings {
  wedding_date: string | null;
  target_budget: number;
}

export interface WeddingSnapshot {
  settings: WeddingSettings | null;
  eventDates: WeddingEventDate[];
  tasks: WeddingTask[];
  budgets: WeddingBudgetItem[];
  guests: WeddingGuest[];
  vendors: WeddingVendor[];
  gifts: WeddingBetrothalGift[];
}

export type WeddingTableName =
  | 'wedding_events'
  | 'wedding_tasks'
  | 'wedding_budgets'
  | 'wedding_guests'
  | 'wedding_vendors'
  | 'wedding_gifts';

export type WeddingRecordMap = {
  wedding_events: WeddingEventDate;
  wedding_tasks: WeddingTask;
  wedding_budgets: WeddingBudgetItem;
  wedding_guests: WeddingGuest;
  wedding_vendors: WeddingVendor;
  wedding_gifts: WeddingBetrothalGift;
};

type WeddingRecord = WeddingRecordMap[WeddingTableName];
type WeddingPayload = Omit<WeddingRecord, 'id'> & { user_id: string };
type SupabasePayload = Record<string, unknown>;

const asArray = <T>(data: T[] | null): T[] => data ?? [];

const withoutId = <TRecord extends { id: string }>(record: TRecord): Omit<TRecord, 'id'> => {
  const copy: Partial<TRecord> = { ...record };
  delete copy.id;
  return copy as Omit<TRecord, 'id'>;
};

const normalizeWeddingRecordForSupabase = <TRecord extends SupabasePayload>(record: TRecord): SupabasePayload => {
  const copy: SupabasePayload = { ...record };

  if (copy.event_id === '') {
    copy.event_id = null;
  }

  return copy;
};

export async function fetchWeddingSnapshot(
  supabase: SupabaseClient,
  userId: string
): Promise<WeddingSnapshot> {
  const [
    settingsResult,
    eventsResult,
    tasksResult,
    budgetsResult,
    guestsResult,
    vendorsResult,
    giftsResult,
  ] = await Promise.all([
    supabase
      .from('wedding_settings')
      .select('wedding_date,target_budget')
      .eq('user_id', userId)
      .maybeSingle<WeddingSettings>(),
    supabase.from('wedding_events').select('*').eq('user_id', userId).order('date', { ascending: true }),
    supabase.from('wedding_tasks').select('*').eq('user_id', userId).order('due_date', { ascending: true }),
    supabase.from('wedding_budgets').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('wedding_guests').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('wedding_vendors').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('wedding_gifts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
  ]);

  if (settingsResult.error) throw settingsResult.error;
  if (eventsResult.error) throw eventsResult.error;
  if (tasksResult.error) throw tasksResult.error;
  if (budgetsResult.error) throw budgetsResult.error;
  if (guestsResult.error) throw guestsResult.error;
  if (vendorsResult.error) throw vendorsResult.error;
  if (giftsResult.error) throw giftsResult.error;

  return {
    settings: settingsResult.data,
    eventDates: asArray(eventsResult.data as WeddingEventDate[] | null),
    tasks: asArray(tasksResult.data as WeddingTask[] | null),
    budgets: asArray(budgetsResult.data as WeddingBudgetItem[] | null),
    guests: asArray(guestsResult.data as WeddingGuest[] | null),
    vendors: asArray(vendorsResult.data as WeddingVendor[] | null),
    gifts: asArray(giftsResult.data as WeddingBetrothalGift[] | null),
  };
}

export async function upsertWeddingSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: WeddingSettings
): Promise<void> {
  const { error } = await supabase
    .from('wedding_settings')
    .upsert(
      {
        user_id: userId,
        wedding_date: settings.wedding_date || null,
        target_budget: settings.target_budget,
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}

export async function insertWeddingRecord<TTable extends WeddingTableName>(
  supabase: SupabaseClient,
  table: TTable,
  userId: string,
  record: Omit<WeddingRecordMap[TTable], 'id'>
): Promise<WeddingRecordMap[TTable]> {
  const payload = {
    ...normalizeWeddingRecordForSupabase(record as SupabasePayload),
    user_id: userId,
  } as WeddingPayload;
  const { data, error } = await supabase.from(table).insert([payload]).select().single<WeddingRecordMap[TTable]>();

  if (error) throw error;
  return data;
}

export async function updateWeddingRecord<TTable extends WeddingTableName>(
  supabase: SupabaseClient,
  table: TTable,
  id: string,
  updates: Partial<WeddingRecordMap[TTable]>
): Promise<WeddingRecordMap[TTable] | null> {
  const { data, error } = await supabase
    .from(table)
    .update(normalizeWeddingRecordForSupabase(updates as SupabasePayload))
    .eq('id', id)
    .select()
    .maybeSingle<WeddingRecordMap[TTable]>();

  if (error) throw error;
  return data;
}

export async function deleteWeddingRecord(
  supabase: SupabaseClient,
  table: WeddingTableName,
  id: string
): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) throw error;
}

export function hasWeddingSnapshotData(snapshot: WeddingSnapshot): boolean {
  return (
    Boolean(snapshot.settings) ||
    snapshot.eventDates.length > 0 ||
    snapshot.tasks.length > 0 ||
    snapshot.budgets.length > 0 ||
    snapshot.guests.length > 0 ||
    snapshot.vendors.length > 0 ||
    snapshot.gifts.length > 0
  );
}

export async function seedWeddingSnapshot(
  supabase: SupabaseClient,
  userId: string,
  snapshot: WeddingSnapshot
): Promise<WeddingSnapshot> {
  await Promise.all([
    supabase.from('wedding_gifts').delete().eq('user_id', userId),
    supabase.from('wedding_vendors').delete().eq('user_id', userId),
    supabase.from('wedding_guests').delete().eq('user_id', userId),
    supabase.from('wedding_budgets').delete().eq('user_id', userId),
    supabase.from('wedding_tasks').delete().eq('user_id', userId),
  ]);

  await supabase.from('wedding_events').delete().eq('user_id', userId);

  await upsertWeddingSettings(supabase, userId, {
    wedding_date: snapshot.settings?.wedding_date || null,
    target_budget: snapshot.settings?.target_budget ?? 0,
  });

  const insertMany = async <TTable extends WeddingTableName>(
    table: TTable,
    records: Omit<WeddingRecordMap[TTable], 'id'>[]
  ): Promise<WeddingRecordMap[TTable][]> => {
    if (records.length === 0) return [];

    const payload = records.map((record) => ({
      ...normalizeWeddingRecordForSupabase(record as SupabasePayload),
      user_id: userId,
    })) as WeddingPayload[];
    const { data, error } = await supabase.from(table).insert(payload).select();

    if (error) throw error;
    return (data ?? []) as WeddingRecordMap[TTable][];
  };

  const eventInputs = snapshot.eventDates.map(withoutId);
  const savedEvents = await insertMany('wedding_events', eventInputs);
  const eventIdMap = new Map(snapshot.eventDates.map((event, index) => [event.id, savedEvents[index]?.id]));

  const remapEventId = <T extends { event_id?: string }>(record: T): T => ({
    ...record,
    event_id: record.event_id ? eventIdMap.get(record.event_id) || record.event_id : record.event_id,
  });

  const savedTasks = await insertMany(
    'wedding_tasks',
    snapshot.tasks.map((task) => remapEventId(withoutId(task)))
  );
  const savedBudgets = await insertMany(
    'wedding_budgets',
    snapshot.budgets.map((budget) => remapEventId(withoutId(budget)))
  );
  const savedGuests = await insertMany(
    'wedding_guests',
    snapshot.guests.map((guest) => remapEventId(withoutId(guest)))
  );
  const savedVendors = await insertMany(
    'wedding_vendors',
    snapshot.vendors.map((vendor) => remapEventId(withoutId(vendor)))
  );
  const savedGifts = await insertMany(
    'wedding_gifts',
    snapshot.gifts.map(withoutId)
  );

  return {
    settings: snapshot.settings,
    eventDates: savedEvents,
    tasks: savedTasks,
    budgets: savedBudgets,
    guests: savedGuests,
    vendors: savedVendors,
    gifts: savedGifts,
  };
}
