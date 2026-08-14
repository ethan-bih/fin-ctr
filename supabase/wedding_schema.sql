-- =========================================================
-- SUPABASE DATABASE SCHEMA & RLS POLICIES FOR WEDDING PLAN
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Per-user wedding settings
CREATE TABLE IF NOT EXISTS public.wedding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    wedding_date DATE,
    target_budget NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (target_budget >= 0),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Wedding ceremony / event dates
CREATE TABLE IF NOT EXISTS public.wedding_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT,
    location TEXT,
    is_main_event BOOLEAN DEFAULT false,
    color TEXT DEFAULT '#e11d48',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Wedding tasks
CREATE TABLE IF NOT EXISTS public.wedding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('Đám hỏi', 'Đám cưới', 'Chung')),
    title TEXT NOT NULL,
    assigned_to TEXT NOT NULL CHECK (assigned_to IN ('Chú rể', 'Cô dâu', 'Cả hai')),
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Chưa bắt đầu' CHECK (status IN ('Chưa bắt đầu', 'Đang thực hiện', 'Hoàn thành', 'Trễ hạn', 'Huỷ')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Wedding budget items
CREATE TABLE IF NOT EXISTS public.wedding_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('Đám hỏi', 'Đám cưới', 'Chung')),
    title TEXT NOT NULL,
    estimated_cost NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
    actual_cost NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (actual_cost >= 0),
    deposit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    is_deposited BOOLEAN DEFAULT false,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Wedding guests
CREATE TABLE IF NOT EXISTS public.wedding_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('Nhà trai', 'Nhà gái')),
    relationship TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    invitation_sent BOOLEAN DEFAULT false,
    rsvp_status TEXT NOT NULL DEFAULT 'Chưa phản hồi' CHECK (rsvp_status IN ('Đã xác nhận', 'Từ chối', 'Chưa phản hồi')),
    accompany_count INT DEFAULT 0 CHECK (accompany_count >= 0),
    table_no TEXT DEFAULT '',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Wedding vendors
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL,
    service_type TEXT NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    quoted_price NUMERIC(15, 2) DEFAULT 0 CHECK (quoted_price >= 0),
    deposit_amount NUMERIC(15, 2) DEFAULT 0 CHECK (deposit_amount >= 0),
    appointment_date DATE,
    status TEXT NOT NULL DEFAULT 'Đang liên hệ' CHECK (status IN ('Đang liên hệ', 'Đã báo giá', 'Đã đặt cọc', 'Đã thanh toán hết')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. Betrothal gifts / mâm quả
CREATE TABLE IF NOT EXISTS public.wedding_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    gift_name TEXT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    prepared_by TEXT NOT NULL CHECK (prepared_by IN ('Nhà trai', 'Nhà gái')),
    is_prepared BOOLEAN DEFAULT false,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Compatibility for projects that previously ran the older wedding_schema.sql.
ALTER TABLE public.wedding_settings ALTER COLUMN wedding_date DROP NOT NULL;
ALTER TABLE public.wedding_settings ALTER COLUMN wedding_date DROP DEFAULT;
ALTER TABLE public.wedding_settings ALTER COLUMN target_budget SET DEFAULT 0;
ALTER TABLE public.wedding_tasks ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL;
ALTER TABLE public.wedding_budgets ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL;
ALTER TABLE public.wedding_budgets ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0);
ALTER TABLE public.wedding_guests ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL;
ALTER TABLE public.wedding_vendors ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.wedding_events(id) ON DELETE SET NULL;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own wedding settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Users can manage their own wedding events" ON public.wedding_events;
DROP POLICY IF EXISTS "Users can manage their own wedding tasks" ON public.wedding_tasks;
DROP POLICY IF EXISTS "Users can manage their own wedding budgets" ON public.wedding_budgets;
DROP POLICY IF EXISTS "Users can manage their own wedding guests" ON public.wedding_guests;
DROP POLICY IF EXISTS "Users can manage their own wedding vendors" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Users can manage their own wedding gifts" ON public.wedding_gifts;

CREATE POLICY "Users can manage their own wedding settings"
ON public.wedding_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding events"
ON public.wedding_events
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding tasks"
ON public.wedding_tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding budgets"
ON public.wedding_budgets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding guests"
ON public.wedding_guests
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding vendors"
ON public.wedding_vendors
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wedding gifts"
ON public.wedding_gifts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
