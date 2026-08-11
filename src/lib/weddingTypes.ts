export type WeddingCategory = 'Đám hỏi' | 'Đám cưới' | 'Chung';

export type TaskStatus = 'Chưa bắt đầu' | 'Đang thực hiện' | 'Hoàn thành' | 'Trễ hạn' | 'Huỷ';

export type AssignedTo = 'Chú rể' | 'Cô dâu' | 'Cả hai';

export type GuestSide = 'Nhà trai' | 'Nhà gái';

export type RsvpStatus = 'Đã xác nhận' | 'Từ chối' | 'Chưa phản hồi';

export type VendorStatus = 'Đang liên hệ' | 'Đã báo giá' | 'Đã đặt cọc' | 'Đã thanh toán hết';

export interface WeddingEventDate {
  id: string;
  name: string; // e.g. "Lễ Dạm Ngõ", "Lễ Đám Hỏi", "Tiệc Cưới Nhà Trai", "Tiệc Cưới Nhà Gái"
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "09:00 AM"
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
  due_date: string; // ISO date YYYY-MM-DD
  status: TaskStatus;
  event_id?: string; // Linked ceremony/event
  note?: string;
}

export interface WeddingBudgetItem {
  id: string;
  category: WeddingCategory;
  title: string;
  estimated_cost: number;
  actual_cost: number;
  is_deposited: boolean;
  event_id?: string; // Linked ceremony/event
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
  event_id?: string; // Linked ceremony/event
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

// Initial Mock Data from W Plan QH&YN.xlsx
export const DEFAULT_WEDDING_DATE = '2026-11-20'; // Target wedding date (can be changed by user)
export const DEFAULT_TARGET_BUDGET = 200000000; // 200,000,000 VNĐ default target budget

export const INITIAL_WEDDING_EVENTS: WeddingEventDate[] = [
  {
    id: 'evt-1',
    name: 'Lễ Dạm Ngõ',
    date: '2026-09-01',
    time: '09:00 AM',
    location: 'Tư gia Nhà Gái',
    is_main_event: false,
    color: '#8b5cf6',
    note: 'Hai gia đình gặp mặt chính thức & dạm ngõ',
  },
  {
    id: 'evt-2',
    name: 'Lễ Đám Hỏi (Đính Hôn)',
    date: '2026-10-15',
    time: '08:30 AM',
    location: 'Tư gia Cô Dâu',
    is_main_event: false,
    color: '#ec4899',
    note: 'Trao 5 mâm quả truyền thống & lễ đính hôn',
  },
  {
    id: 'evt-3',
    name: 'Lễ Tiệc Cưới Chính (Nhà Trai)',
    date: '2026-11-20',
    time: '18:00 PM',
    location: 'Trung tâm Tiệc cưới White Palace',
    is_main_event: true,
    color: '#e11d48',
    note: 'Tiệc cưới chính nức lòng hai họ',
  },
  {
    id: 'evt-4',
    name: 'Tiệc Cưới Nhà Gái',
    date: '2026-11-22',
    time: '11:30 AM',
    location: 'Nhà hàng Riverside Palace',
    is_main_event: false,
    color: '#2563eb',
    note: 'Tiệc mừng nhà gái tại quê cô dâu',
  },
  {
    id: 'evt-5',
    name: 'Tiệc Báo Hỷ Đồng Nghiệp',
    date: '2026-12-05',
    time: '19:00 PM',
    location: 'Rooftop Lounge Center',
    is_main_event: false,
    color: '#059669',
    note: 'Tiệc báo hỷ thân mật cùng đồng nghiệp & bạn bè',
  },
];

export const INITIAL_WEDDING_TASKS: WeddingTask[] = [
  {
    id: 'w-task-1',
    category: 'Đám hỏi',
    title: 'Chốt ngày giờ đám hỏi với 2 gia đình',
    assigned_to: 'Chú rể',
    due_date: '2026-09-01',
    status: 'Chưa bắt đầu',
    event_id: 'evt-1',
    note: 'Thống kê ý kiến phụ huynh 2 bên',
  },
  {
    id: 'w-task-2',
    category: 'Đám hỏi',
    title: 'Đặt mâm quả / lễ vật đám hỏi',
    assigned_to: 'Cô dâu',
    due_date: '2026-09-15',
    status: 'Chưa bắt đầu',
    event_id: 'evt-2',
    note: 'Thỏa thuận số mâm quả (5 hoặc 7 mâm)',
  },
  {
    id: 'w-task-3',
    category: 'Đám cưới',
    title: 'Đặt nhà hàng / sảnh tiệc cưới',
    assigned_to: 'Cả hai',
    due_date: '2026-08-30',
    status: 'Đang thực hiện',
    event_id: 'evt-3',
    note: 'Tham khảo 3 nhà hàng trung tâm',
  },
  {
    id: 'w-task-4',
    category: 'Đám cưới',
    title: 'Chụp ảnh cưới Pre-wedding',
    assigned_to: 'Cả hai',
    due_date: '2026-09-20',
    status: 'Chưa bắt đầu',
    event_id: 'evt-3',
    note: 'Chọn studio ngoại cảnh Đà Lạt/Nha Trang',
  },
  {
    id: 'w-task-5',
    category: 'Đám cưới',
    title: 'In thiệp mời & lên danh sách khách',
    assigned_to: 'Cả hai',
    due_date: '2026-10-01',
    status: 'Chưa bắt đầu',
    event_id: 'evt-3',
    note: 'In dự phòng +10% thiệp',
  },
];

export const INITIAL_WEDDING_BUDGETS: WeddingBudgetItem[] = [
  {
    id: 'w-bgt-1',
    category: 'Đám hỏi',
    title: 'Mâm quả / lễ vật đám hỏi',
    estimated_cost: 15000000,
    actual_cost: 0,
    is_deposited: false,
    event_id: 'evt-2',
    note: '5 mâm truyền thống',
  },
  {
    id: 'w-bgt-2',
    category: 'Đám cưới',
    title: 'Nhà hàng / sảnh tiệc chính',
    estimated_cost: 150000000,
    actual_cost: 0,
    is_deposited: false,
    event_id: 'evt-3',
    note: 'Dự kiến 20 bàn tiệc nhà trai',
  },
  {
    id: 'w-bgt-3',
    category: 'Đám cưới',
    title: 'Chụp ảnh cưới (Pre-wedding & Tiệc)',
    estimated_cost: 20000000,
    actual_cost: 5000000,
    is_deposited: true,
    event_id: 'evt-3',
    note: 'Đã cọc Studio ABC 5 triệu',
  },
  {
    id: 'w-bgt-4',
    category: 'Chung',
    title: 'Trang phục cô dâu chú rể',
    estimated_cost: 25000000,
    actual_cost: 0,
    is_deposited: false,
    event_id: 'evt-3',
    note: '2 váy cưới + 2 bộ vest',
  },
  {
    id: 'w-bgt-5',
    category: 'Chung',
    title: 'Nhẫn cưới',
    estimated_cost: 30000000,
    actual_cost: 0,
    is_deposited: false,
    event_id: 'evt-3',
    note: 'Cặp nhẫn vàng bạch kim',
  },
];

export const INITIAL_WEDDING_GUESTS: WeddingGuest[] = [
  {
    id: 'w-gst-1',
    name: 'Nguyễn Văn A',
    side: 'Nhà trai',
    relationship: 'Bạn thân chú rể',
    phone: '0901 234 567',
    invitation_sent: true,
    rsvp_status: 'Đã xác nhận',
    accompany_count: 1,
    table_no: 'Bàn 05',
    event_id: 'evt-3',
    note: 'Dự tiệc buổi tối',
  },
  {
    id: 'w-gst-2',
    name: 'Trần Thị B',
    side: 'Nhà gái',
    relationship: 'Đồng nghiệp cô dâu',
    phone: '0912 345 678',
    invitation_sent: true,
    rsvp_status: 'Chưa phản hồi',
    accompany_count: 0,
    table_no: 'Bàn 12',
    event_id: 'evt-4',
    note: 'Gửi thiệp online',
  },
  {
    id: 'w-gst-3',
    name: 'Lê Văn C',
    side: 'Nhà trai',
    relationship: 'Họ hàng chú rể',
    phone: '0988 777 666',
    invitation_sent: false,
    rsvp_status: 'Chưa phản hồi',
    accompany_count: 2,
    table_no: 'Bàn 01',
    event_id: 'evt-3',
    note: 'Họ hàng xa',
  },
];

export const INITIAL_WEDDING_VENDORS: WeddingVendor[] = [
  {
    id: 'w-vnd-1',
    service_type: 'Chụp ảnh cưới',
    name: 'Studio ABC',
    contact_person: 'Chị Lan',
    phone: '0909 888 777',
    quoted_price: 20000000,
    deposit_amount: 5000000,
    appointment_date: '2026-09-20',
    status: 'Đã đặt cọc',
    event_id: 'evt-3',
    note: 'Gói chụp studio + ngoại cảnh',
  },
  {
    id: 'w-vnd-2',
    service_type: 'Trang trí gia tiên',
    name: 'Wedding Decor XYZ',
    contact_person: 'Anh Tuấn',
    phone: '0933 111 222',
    quoted_price: 15000000,
    deposit_amount: 0,
    appointment_date: '2026-09-10',
    status: 'Đã báo giá',
    event_id: 'evt-2',
    note: 'Tone màu hồng pastel',
  },
];

export const INITIAL_WEDDING_GIFTS: WeddingBetrothalGift[] = [
  {
    id: 'w-gft-1',
    gift_name: 'Trầu cau (105 quả)',
    quantity: 1,
    prepared_by: 'Nhà trai',
    is_prepared: false,
    note: 'Chọn cau tròn đẹp',
  },
  {
    id: 'w-gft-2',
    gift_name: 'Trà, rượu, nến rồng phụng',
    quantity: 1,
    prepared_by: 'Nhà trai',
    is_prepared: false,
    note: 'Rượu Chivas / Hennessy',
  },
  {
    id: 'w-gft-3',
    gift_name: 'Bánh phu thê / Bánh kem',
    quantity: 1,
    prepared_by: 'Nhà trai',
    is_prepared: false,
    note: 'Tháp bánh 105 chiếc',
  },
  {
    id: 'w-gft-4',
    gift_name: 'Trái cây ngũ quả kết rồng phụng',
    quantity: 1,
    prepared_by: 'Nhà trai',
    is_prepared: false,
    note: 'Trái cây tươi xuất khẩu',
  },
  {
    id: 'w-gft-5',
    gift_name: 'Xôi gấc gà luộc',
    quantity: 1,
    prepared_by: 'Nhà trai',
    is_prepared: false,
    note: 'Xôi gấc tim song hỷ',
  },
];
