-- SQL Migration for Wedding Planner Module (W Plan QH&YN)

-- 1. Create wedding_tasks Table
CREATE TABLE IF NOT EXISTS public.wedding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Đám hỏi', 'Đám cưới', 'Chung')),
    title TEXT NOT NULL,
    assigned_to TEXT NOT NULL CHECK (assigned_to IN ('Chú rể', 'Cô dâu', 'Cả hai')),
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Chưa bắt đầu' CHECK (status IN ('Chưa bắt đầu', 'Đang thực hiện', 'Hoàn thành', 'Trễ hạn', 'Huỷ')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create wedding_budgets Table
CREATE TABLE IF NOT EXISTS public.wedding_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Đám hỏi', 'Đám cưới', 'Chung')),
    title TEXT NOT NULL,
    estimated_cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    actual_cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    is_deposited BOOLEAN DEFAULT false,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create wedding_guests Table
CREATE TABLE IF NOT EXISTS public.wedding_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('Nhà trai', 'Nhà gái')),
    relationship TEXT,
    phone TEXT,
    invitation_sent BOOLEAN DEFAULT false,
    rsvp_status TEXT NOT NULL DEFAULT 'Chưa phản hồi' CHECK (rsvp_status IN ('Đã xác nhận', 'Từ chối', 'Chưa phản hồi')),
    accompany_count INT DEFAULT 0,
    table_no TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create wedding_vendors Table
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    quoted_price NUMERIC(15, 2) DEFAULT 0,
    deposit_amount NUMERIC(15, 2) DEFAULT 0,
    appointment_date DATE,
    status TEXT NOT NULL DEFAULT 'Đang liên hệ' CHECK (status IN ('Đang liên hệ', 'Đã báo giá', 'Đã đặt cọc', 'Đã thanh toán hết')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create wedding_gifts Table (Mâm quả đám hỏi)
CREATE TABLE IF NOT EXISTS public.wedding_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gift_name TEXT NOT NULL,
    quantity INT DEFAULT 1,
    prepared_by TEXT NOT NULL CHECK (prepared_by IN ('Nhà trai', 'Nhà gái')),
    is_prepared BOOLEAN DEFAULT false,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.wedding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wedding tasks" ON public.wedding_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wedding budgets" ON public.wedding_budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wedding guests" ON public.wedding_guests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wedding vendors" ON public.wedding_vendors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wedding gifts" ON public.wedding_gifts FOR ALL USING (auth.uid() = user_id);
