export type WeddingCategory = 'Đám hỏi' | 'Đám cưới' | 'Chung';

export type TaskStatus = 'Chưa bắt đầu' | 'Đang thực hiện' | 'Hoàn thành' | 'Trễ hạn' | 'Huỷ';

export type AssignedTo = 'Chú rể' | 'Cô dâu' | 'Cả hai';

export type GuestSide = 'Nhà trai' | 'Nhà gái';

export type RsvpStatus = 'Đã xác nhận' | 'Từ chối' | 'Chưa phản hồi';

export type VendorStatus = 'Đang liên hệ' | 'Đã báo giá' | 'Đã đặt cọc' | 'Đã thanh toán hết';

export interface WeddingEventDate {
  id: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  is_main_event?: boolean;
  color?: string;
  note?: string;
}

export interface WeddingTask {
  id: string;
  category: WeddingCategory;
  title: string;
  assigned_to: AssignedTo;
  due_date: string;
  status: TaskStatus;
  event_id?: string;
  note?: string;
}

export interface WeddingBudgetItem {
  id: string;
  category: WeddingCategory;
  title: string;
  estimated_cost: number;
  actual_cost: number;
  is_deposited: boolean;
  event_id?: string;
  note?: string;
}

export interface WeddingGuest {
  id: string;
  name: string;
  side: GuestSide;
  relationship: string;
  phone: string;
  invitation_sent: boolean;
  rsvp_status: RsvpStatus;
  accompany_count: number;
  table_no: string;
  event_id?: string;
  note?: string;
}

export interface WeddingVendor {
  id: string;
  service_type: string;
  name: string;
  contact_person: string;
  phone: string;
  quoted_price: number;
  deposit_amount: number;
  appointment_date?: string;
  status: VendorStatus;
  event_id?: string;
  note?: string;
}

export interface WeddingBetrothalGift {
  id: string;
  gift_name: string;
  quantity: number;
  prepared_by: 'Nhà trai' | 'Nhà gái';
  is_prepared: boolean;
  note?: string;
}

export interface WeddingSummary {
  targetBudget: number;
  totalEstimatedBudget: number;
  totalActualExpense: number;
  remainingBudget: number;
  totalTasks: number;
  completedTasks: number;
  totalGuests: number;
  confirmedGuests: number;
  totalAccompanying: number;
  totalVendors: number;
  depositedVendors: number;
}

export const DEFAULT_WEDDING_DATE = '';
export const DEFAULT_TARGET_BUDGET = 0;

export const INITIAL_WEDDING_EVENTS: WeddingEventDate[] = [];
export const INITIAL_WEDDING_TASKS: WeddingTask[] = [];
export const INITIAL_WEDDING_BUDGETS: WeddingBudgetItem[] = [];
export const INITIAL_WEDDING_GUESTS: WeddingGuest[] = [];
export const INITIAL_WEDDING_VENDORS: WeddingVendor[] = [];
export const INITIAL_WEDDING_GIFTS: WeddingBetrothalGift[] = [];
