-- ====================================================================
-- FLUENT IMMERSION — Migração Kiwify Webhook & Master Admin
-- Arquivo: supabase/migrations/20261105000001_kiwify_webhook_and_admin.sql
-- ====================================================================

-- 1. TABELA DE LOGS DE WEBHOOKS DA KIWIFY COM IDEMPOTÊNCIA
CREATE TABLE IF NOT EXISTS public.kiwify_webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(150),
    subscription_id VARCHAR(150),
    webhook_event VARCHAR(100) NOT NULL, -- order_approved, subscription_renewed, subscription_canceled, etc.
    order_status VARCHAR(50) NOT NULL,  -- paid, approved, refunded, chargedback, canceled, late
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    product_id VARCHAR(150),
    product_name VARCHAR(255),
    charge_amount NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'BRL',
    raw_payload JSONB NOT NULL,
    processed_successfully BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Impede processamento duplicado acidental do mesmo evento para o mesmo pedido
    CONSTRAINT kiwify_unique_event UNIQUE (order_id, webhook_event, order_status)
);

CREATE INDEX IF NOT EXISTS idx_kiwify_logs_order ON public.kiwify_webhook_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_kiwify_logs_email ON public.kiwify_webhook_logs(customer_email);
CREATE INDEX IF NOT EXISTS idx_kiwify_logs_status ON public.kiwify_webhook_logs(order_status);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.kiwify_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Somente ADMINs podem ler os logs de webhooks
CREATE POLICY "Admins podem visualizar logs da Kiwify" ON public.kiwify_webhook_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.fluent_profiles
            WHERE fluent_profiles.id = auth.uid() AND (fluent_profiles.role = 'ADMIN' OR fluent_profiles.email = 'gestorpaid@gmail.com')
        )
    );

-- Serviço de Edge Function / Service Role pode inserir logs
CREATE POLICY "Service Role pode inserir logs da Kiwify" ON public.kiwify_webhook_logs
    FOR INSERT WITH CHECK (true);

-- 3. GARANTIR PERFIL MASTER ADMIN: gestorpaid@gmail.com
INSERT INTO public.fluent_profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    country,
    preferred_language,
    teaching_context,
    subscription_status,
    created_at,
    last_login_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'gestorpaid@gmail.com',
    'Administrador Master (Gestor Paid)',
    'ADMIN',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Brasil',
    'pt-BR',
    'Diretoria Executiva FLUENT IMMERSION',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN',
    subscription_status = 'active';

-- 4. FUNÇÃO PL/PGSQL PARA PROCESSAR EVENTOS DA KIWIFY DE FORMA TRANSACIONAL
CREATE OR REPLACE FUNCTION public.process_kiwify_event(
    p_order_id VARCHAR,
    p_subscription_id VARCHAR,
    p_event VARCHAR,
    p_status VARCHAR,
    p_customer_email VARCHAR,
    p_customer_name VARCHAR,
    p_product_id VARCHAR,
    p_product_name VARCHAR,
    p_amount NUMERIC,
    p_raw_payload JSONB
) RETURNS JSONB AS $$
DECLARE
    v_profile_id UUID;
    v_new_sub_status VARCHAR(50);
    v_period_end TIMESTAMPTZ;
BEGIN
    -- Determina o status com base no evento Kiwify
    IF p_status IN ('paid', 'approved') OR p_event IN ('order_approved', 'subscription_renewed') THEN
        v_new_sub_status := 'active';
        v_period_end := NOW() + INTERVAL '1 month';
    ELSIF p_status IN ('refunded', 'chargedback') OR p_event IN ('order_refunded', 'order_chargedback') THEN
        v_new_sub_status := 'inactive';
        v_period_end := NOW();
    ELSIF p_status IN ('canceled') OR p_event IN ('subscription_canceled') THEN
        -- Respeita o período já pago: mantém o status como 'active' até a data de expiração,
        -- porém desativa auto_recurring
        v_new_sub_status := 'active';
        v_period_end := COALESCE(
            (p_raw_payload->'Subscription'->>'next_payment')::TIMESTAMPTZ,
            NOW() + INTERVAL '1 month'
        );
    ELSE
        v_new_sub_status := 'active';
        v_period_end := NOW() + INTERVAL '1 month';
    END IF;

    -- 1. Localiza ou cria perfil
    SELECT id INTO v_profile_id FROM public.fluent_profiles WHERE email = p_customer_email;

    IF v_profile_id IS NULL THEN
        v_profile_id := uuid_generate_v4();
        INSERT INTO public.fluent_profiles (
            id, email, full_name, role, country, preferred_language, subscription_status, subscription_id, created_at
        ) VALUES (
            v_profile_id, p_customer_email, COALESCE(p_customer_name, 'Teacher Membro'), 'TEACHER_MEMBER', 'Brasil', 'pt-BR', v_new_sub_status, p_subscription_id, NOW()
        );
    ELSE
        UPDATE public.fluent_profiles 
        SET subscription_status = v_new_sub_status,
            subscription_id = COALESCE(p_subscription_id, subscription_id),
            updated_at = NOW()
        WHERE id = v_profile_id;
    END IF;

    -- 2. Atualiza ou insere assinatura
    INSERT INTO public.fluent_subscriptions (
        user_id, payer_email, status, plan_name, amount, current_period_start, current_period_end, auto_recurring
    ) VALUES (
        v_profile_id,
        p_customer_email,
        v_new_sub_status,
        COALESCE(p_product_name, 'FLUENT IMMERSION Pro (Mensal Kiwify)'),
        COALESCE(p_amount, 19.90),
        NOW(),
        v_period_end,
        (p_status NOT IN ('canceled', 'refunded', 'chargedback'))
    )
    ON CONFLICT (id) DO UPDATE SET
        status = v_new_sub_status,
        current_period_end = v_period_end,
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'profile_id', v_profile_id,
        'status', v_new_sub_status,
        'period_end', v_period_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
