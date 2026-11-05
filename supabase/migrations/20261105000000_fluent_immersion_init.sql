-- FLUENT IMMERSION — PostgreSQL / Supabase Migration
-- File: 20261105000000_fluent_immersion_init.sql
-- Description: Complete schema for Fluent Immersion SaaS Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FLUENT ROLES
CREATE TABLE IF NOT EXISTS public.fluent_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.fluent_roles (role_name, description)
VALUES 
    ('ADMIN', 'Full system access, content creation, subscriber management, billing controls'),
    ('TEACHER_MEMBER', 'Standard subscribed English educator with access to all teaching resources')
ON CONFLICT (role_name) DO NOTHING;

-- 2. FLUENT PROFILES
CREATE TABLE IF NOT EXISTS public.fluent_profiles (
    id UUID PRIMARY KEY, -- references auth.users(id) in Supabase
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'TEACHER_MEMBER',
    avatar_url TEXT,
    country VARCHAR(100) DEFAULT 'Brazil',
    preferred_language VARCHAR(10) DEFAULT 'pt-BR',
    teaching_context VARCHAR(100) DEFAULT 'Private Tutor',
    subscription_status VARCHAR(50) DEFAULT 'inactive', -- active, trial, expired, cancelled, past_due
    subscription_id VARCHAR(100),
    mercado_pago_customer_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FLUENT SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.fluent_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    mp_preapproval_id VARCHAR(100) UNIQUE,
    payer_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, authorized, paused, cancelled
    plan_name VARCHAR(100) DEFAULT 'FLUENT IMMERSION Pro (Monthly)',
    amount NUMERIC(10,2) DEFAULT 19.90,
    currency VARCHAR(10) DEFAULT 'BRL',
    billing_day_of_month INT DEFAULT 1,
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
    auto_recurring BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FLUENT PAYMENTS
CREATE TABLE IF NOT EXISTS public.fluent_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES public.fluent_subscriptions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    mp_payment_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL, -- approved, rejected, pending, refunded
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    payment_method VARCHAR(50),
    raw_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FLUENT CEFR LEVELS
CREATE TABLE IF NOT EXISTS public.fluent_cefr_levels (
    id VARCHAR(10) PRIMARY KEY, -- A1, A2, B1, B2, C1, C2
    name VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    color_badge VARCHAR(50)
);

INSERT INTO public.fluent_cefr_levels (id, name, description, order_index, color_badge) VALUES
('A1', 'Beginner', 'Basic phrases, everyday expressions, introducing oneself and asking simple questions.', 1, '#10B981'),
('A2', 'Elementary', 'Direct exchange of information on familiar and routine matters.', 2, '#06B6D4'),
('B1', 'Intermediate', 'Understand main points of clear standard input on familiar matters like work, school, leisure.', 3, '#3B82F6'),
('B2', 'Upper Intermediate', 'Complex text on both concrete and abstract topics, fluent interaction with native speakers.', 4, '#8B5CF6'),
('C1', 'Advanced', 'Wide range of demanding, longer clauses, flexible language use for social, academic and professional goals.', 5, '#EC4899'),
('C2', 'Proficiency', 'Effortless understanding of virtually everything heard or read, subtle shades of meaning.', 6, '#F59E0B')
ON CONFLICT (id) DO NOTHING;

-- 6. FLUENT CATEGORIES
CREATE TABLE IF NOT EXISTS public.fluent_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- cefr, business, kids, grammar, skills
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FLUENT LESSONS
CREATE TABLE IF NOT EXISTS public.fluent_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cefr_level VARCHAR(10) REFERENCES public.fluent_cefr_levels(id),
    category_slug VARCHAR(100),
    department VARCHAR(50) NOT NULL DEFAULT 'CEFR', -- CEFR, Business English, English for Kids, Grammar Lab
    age_group VARCHAR(50) DEFAULT 'Adults & Teens', -- Ages 3-5, Ages 6-8, Ages 9-11, Ages 12-14, Teens, Adults
    duration_minutes INT DEFAULT 60,
    difficulty VARCHAR(50) DEFAULT 'Standard',
    learning_objectives TEXT[] NOT NULL DEFAULT '{}',
    language_focus TEXT,
    skills_covered TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    summary TEXT,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    author_id UUID REFERENCES public.fluent_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FLUENT LESSON VERSIONS (Teacher, Student, HTML Studio markup)
CREATE TABLE IF NOT EXISTS public.fluent_lesson_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    version_type VARCHAR(50) NOT NULL, -- 'TEACHER', 'STUDENT'
    content_json JSONB NOT NULL,
    custom_html TEXT,
    custom_css TEXT,
    teacher_notes TEXT,
    answer_keys JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lesson_id, version_type)
);

-- 9. FLUENT WORKSHEETS
CREATE TABLE IF NOT EXISTS public.fluent_worksheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    content_sections JSONB NOT NULL,
    is_printable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FLUENT FLASHCARDS
CREATE TABLE IF NOT EXISTS public.fluent_flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    front_term VARCHAR(255) NOT NULL,
    back_definition TEXT NOT NULL,
    example_sentence TEXT,
    ipa_phonetics VARCHAR(100),
    part_of_speech VARCHAR(50),
    audio_url TEXT,
    image_url TEXT,
    cefr_level VARCHAR(10),
    topic VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FLUENT QUIZZES
CREATE TABLE IF NOT EXISTS public.fluent_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score_percentage INT DEFAULT 70,
    time_limit_minutes INT DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FLUENT QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.fluent_quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.fluent_quizzes(id) ON DELETE CASCADE,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, fill_blank, matching
    prompt TEXT NOT NULL,
    options JSONB, -- Array of strings or objects
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    order_index INT DEFAULT 0
);

-- 13. FLUENT FAVORITES
CREATE TABLE IF NOT EXISTS public.fluent_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 14. FLUENT COLLECTIONS
CREATE TABLE IF NOT EXISTS public.fluent_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    color_hex VARCHAR(20) DEFAULT '#8B5CF6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. FLUENT COLLECTION ITEMS
CREATE TABLE IF NOT EXISTS public.fluent_collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES public.fluent_collections(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, lesson_id)
);

-- 16. FLUENT NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.fluent_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'new_lesson', -- new_lesson, worksheet, business, kids, announcement
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. FLUENT NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.fluent_notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    email_new_lessons BOOLEAN DEFAULT TRUE,
    email_business_english BOOLEAN DEFAULT TRUE,
    email_kids_resources BOOLEAN DEFAULT TRUE,
    email_platform_updates BOOLEAN DEFAULT TRUE,
    in_app_alerts BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. FLUENT EMAIL LOGS
CREATE TABLE IF NOT EXISTS public.fluent_email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    status VARCHAR(50) NOT NULL, -- sent, failed, queued
    provider_id VARCHAR(100),
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. FLUENT DOWNLOAD LOGS
CREATE TABLE IF NOT EXISTS public.fluent_download_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.fluent_lessons(id) ON DELETE SET NULL,
    resource_type VARCHAR(50) NOT NULL, -- pdf_teacher, pdf_student, worksheet, flashcards
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. FLUENT ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.fluent_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.fluent_profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- view_lesson, complete_quiz, create_collection, download_pdf
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. FLUENT ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.fluent_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    badge_label VARCHAR(50) DEFAULT 'NEW',
    is_active BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES public.fluent_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.fluent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_lesson_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluent_email_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile, Admins can read all
CREATE POLICY "Users can read own profile" ON public.fluent_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.fluent_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Lessons: Published lessons are readable by active subscribers or admins
CREATE POLICY "Active members can view lessons" ON public.fluent_lessons
    FOR SELECT USING (
        is_published = true AND (
            EXISTS (
                SELECT 1 FROM public.fluent_profiles
                WHERE fluent_profiles.id = auth.uid() 
                AND (fluent_profiles.subscription_status = 'active' OR fluent_profiles.role = 'ADMIN')
            )
        )
    );

-- Admin has full CRUD on lessons
CREATE POLICY "Admin full access to lessons" ON public.fluent_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.fluent_profiles
            WHERE fluent_profiles.id = auth.uid() AND fluent_profiles.role = 'ADMIN'
        )
    );

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users manage own favorites" ON public.fluent_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Collections: Users manage own collections
CREATE POLICY "Users manage own collections" ON public.fluent_collections
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users read own notifications
CREATE POLICY "Users read own notifications" ON public.fluent_notifications
    FOR SELECT USING (auth.uid() = user_id);
