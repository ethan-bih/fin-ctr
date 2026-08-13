import { Category, Transaction, Budget, SavingsGoal, JarConfig } from './types';

export const DEFAULT_JARS: JarConfig[] = [
  {
    id: 'NEC',
    code: 'NEC',
    name: 'Nhu Cầu Thiết Yếu',
    percent: 55,
    description: 'Ăn uống, thuê nhà, điện nước, di chuyển, y tế sinh hoạt hàng ngày',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    icon: 'Home',
  },
  {
    id: 'FFA',
    code: 'FFA',
    name: 'Tự Do Tài Chính',
    percent: 10,
    description: 'Đầu tư chứng khoán, bất động sản, gửi tiết kiệm sinh lời tạo thu nhập thụ động',
    color: '#10b981',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    icon: 'TrendingUp',
  },
  {
    id: 'LTSS',
    code: 'LTSS',
    name: 'Tiết Kiệm Dài Hạn',
    percent: 10,
    description: 'Quỹ dự phòng khẩn cấp, mua xe, mua laptop, đi du lịch lớn',
    color: '#3b82f6',
    bgGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    icon: 'ShieldCheck',
  },
  {
    id: 'EDU',
    code: 'EDU',
    name: 'Giáo Dục & Phát Triển',
    percent: 10,
    description: 'Mua sách, học khóa học mới, tham gia hội thảo nâng cao kỹ năng bản thân',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    icon: 'GraduationCap',
  },
  {
    id: 'PLAY',
    code: 'PLAY',
    name: 'Hưởng Thụ & Giải Trí',
    percent: 10,
    description: 'Xem phim, ăn uống tự thưởng, mua sắm cá nhân, du lịch ngắn ngày',
    color: '#ec4899',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    icon: 'Film',
  },
  {
    id: 'GIVE',
    code: 'GIVE',
    name: 'Cho Đi & Quà Tặng',
    percent: 5,
    description: 'Biếu bố mẹ, từ thiện, quà sinh nhật bạn bè, giúp đỡ người thân',
    color: '#8b5cf6',
    bgGradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    icon: 'Heart',
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses (mapped to Jars)
  { id: 'cat-food', name: 'Ăn uống', type: 'expense', icon: 'Utensils', color: '#f59e0b', jar_id: 'NEC' },
  { id: 'cat-bills', name: 'Hóa đơn & Nhà ở', type: 'expense', icon: 'Home', color: '#ef4444', jar_id: 'NEC' },
  { id: 'cat-transport', name: 'Di chuyển', type: 'expense', icon: 'Car', color: '#3b82f6', jar_id: 'NEC' },
  { id: 'cat-health', name: 'Sức khỏe & Y tế', type: 'expense', icon: 'HeartPulse', color: '#10b981', jar_id: 'NEC' },

  { id: 'cat-invest-exp', name: 'Đầu tư & Vốn', type: 'expense', icon: 'TrendingUp', color: '#10b981', jar_id: 'FFA' },
  { id: 'cat-savings-exp', name: 'Gửi tiết kiệm', type: 'expense', icon: 'ShieldCheck', color: '#3b82f6', jar_id: 'LTSS' },

  { id: 'cat-education', name: 'Học tập & Sách', type: 'expense', icon: 'GraduationCap', color: '#06b6d4', jar_id: 'EDU' },
  { id: 'cat-shopping', name: 'Mua sắm', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', jar_id: 'PLAY' },
  { id: 'cat-entertainment', name: 'Giải trí & Phim', type: 'expense', icon: 'Film', color: '#8b5cf6', jar_id: 'PLAY' },
  { id: 'cat-give', name: 'Từ thiện & Quà biếu', type: 'expense', icon: 'Heart', color: '#a855f7', jar_id: 'GIVE' },
  { id: 'cat-other-exp', name: 'Chi phí khác', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', jar_id: 'NEC' },

  // Income
  { id: 'cat-salary', name: 'Lương hàng tháng', type: 'income', icon: 'Wallet', color: '#10b981' },
  { id: 'cat-freelance', name: 'Thưởng & Freelance', type: 'income', icon: 'Briefcase', color: '#6366f1' },
  { id: 'cat-investment', name: 'Lợi nhuận đầu tư', type: 'income', icon: 'TrendingUp', color: '#f59e0b' },
  { id: 'cat-other-inc', name: 'Thu nhập khác', type: 'income', icon: 'PlusCircle', color: '#14b8a6' },
];

export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [];

export const INITIAL_MOCK_BUDGETS: Budget[] = [];

export const INITIAL_MOCK_SAVINGS: SavingsGoal[] = [];
