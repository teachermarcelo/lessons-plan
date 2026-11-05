// ====================================================================
// Supabase Edge Function: kiwify-webhook
// Description: Recebe e processa webhooks oficiais da Kiwify para FLUENT IMMERSION
// Endpoint: https://<SEU_PROJECT_REF>.supabase.co/functions/v1/kiwify-webhook
// ====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Headers de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-token',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req: Request) => {
  // Trata preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Permite GET para verificação de status e saúde
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        service: 'FLUENT IMMERSION - Kiwify Webhook Edge Function',
        status: 'online',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Only POST is accepted.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(req.url);
    const tokenFromQuery = url.searchParams.get('token');
    const tokenFromHeader = req.headers.get('x-kiwify-token');

    // Recupera corpo da requisição da Kiwify
    const rawBodyText = await req.text();
    let payload: any = {};

    try {
      payload = JSON.parse(rawBodyText || '{}');
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload received from Kiwify' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. VALIDAÇÃO DO TOKEN SECRETO DA KIWIFY
    // A Kiwify envia o token como query param (?token=...), no body ({ token: ... }) ou no header
    const receivedToken = tokenFromQuery || tokenFromHeader || payload.token || payload.signature;
    const expectedSecretToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN') || 'x3yjgazyjqu';

    if (expectedSecretToken && receivedToken !== expectedSecretToken) {
      console.warn('[Kiwify Webhook Rejected] Token inválido:', receivedToken);
      return new Response(
        JSON.stringify({
          error: 'Unauthorized. The provided webhook token does not match the configured secret.',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. EXTRAÇÃO DOS CAMPOS OFICIAIS DO SCHEMA DA KIWIFY
    const orderId = payload.order_id || payload.order_ref || payload.id || `order_${Date.now()}`;
    const orderStatus = (payload.order_status || payload.status || 'unknown').toLowerCase();
    const webhookEvent = payload.webhook_event_type || `order_${orderStatus}`;
    
    const customer = payload.Customer || {};
    const customerEmail = (customer.email || payload.email || '').trim().toLowerCase();
    const customerName = customer.full_name || customer.first_name || payload.name || 'Professor(a)';

    const product = payload.Product || {};
    const productId = product.product_id || payload.product_id || 'fluent-immersion-pro';
    const productName = product.product_name || payload.product_name || 'FLUENT IMMERSION Pro (Mensal)';

    const subscription = payload.Subscription || {};
    const subscriptionId = subscription.id || payload.subscription_id;
    const nextPayment = subscription.next_payment;

    const commissions = payload.Commissions || {};
    const chargeAmount = commissions.charge_amount ? commissions.charge_amount / 100 : 19.90;

    if (!customerEmail) {
      console.error('[Kiwify Webhook Error] Nenhum e-mail de cliente identificado no payload');
      return new Response(
        JSON.stringify({ error: 'Customer email missing in Kiwify payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Kiwify Webhook] Evento: ${webhookEvent} | Status: ${orderStatus} | E-mail: ${customerEmail} | Pedido: ${orderId}`);

    // 3. INICIALIZAÇÃO DO CLIENTE SUPABASE (USANDO SERVICE_ROLE_KEY PARA OPERAÇÕES SEGURAS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    let supabase: any = null;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    // 4. VERIFICAÇÃO DE IDEMPOTÊNCIA (EVITAR DUPLICAÇÃO DE EVENTOS REPETIDOS)
    if (supabase) {
      const { data: existingLog } = await supabase
        .from('kiwify_webhook_logs')
        .select('id, processed_successfully')
        .eq('order_id', orderId)
        .eq('webhook_event', webhookEvent)
        .eq('order_status', orderStatus)
        .maybeSingle();

      if (existingLog && existingLog.processed_successfully) {
        console.log(`[Kiwify Webhook] Evento já processado anteriormente para ${orderId}. Ignorando duplicação.`);
        return new Response(
          JSON.stringify({
            received: true,
            already_processed: true,
            message: 'Duplicate event ignored for idempotency',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 5. PROCESSAMENTO DE ACORDO COM O EVENTO E STATUS DA KIWIFY
    let targetSubscriptionStatus = 'active';
    let periodEnd = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(); // 1 mês

    if (orderStatus === 'paid' || orderStatus === 'approved' || webhookEvent === 'order_approved' || webhookEvent === 'subscription_renewed') {
      targetSubscriptionStatus = 'active';
      if (nextPayment) {
        periodEnd = new Date(nextPayment).toISOString();
      }
    } else if (orderStatus === 'refunded' || orderStatus === 'chargedback' || webhookEvent === 'order_refunded' || webhookEvent === 'order_chargedback') {
      // Reembolso ou chargeback: suspende o acesso imediatamente
      targetSubscriptionStatus = 'inactive';
      periodEnd = new Date().toISOString();
    } else if (orderStatus === 'canceled' || webhookEvent === 'subscription_canceled') {
      // Cancelamento: respeita o período já pago até a data de expiração
      targetSubscriptionStatus = 'active';
      if (nextPayment && new Date(nextPayment).getTime() > Date.now()) {
        periodEnd = new Date(nextPayment).toISOString();
      }
    } else if (orderStatus === 'late' || webhookEvent === 'subscription_late') {
      // Atraso de pagamento temporário: não derruba imediatamente se ainda estiver dentro do ciclo de tolerância
      targetSubscriptionStatus = 'active';
    }

    // 6. ATUALIZAÇÃO NO BANCO DE DADOS
    if (supabase) {
      // Executa a função transacional de banco ou atualiza diretamente
      const { error: rpcError } = await supabase.rpc('process_kiwify_event', {
        p_order_id: orderId,
        p_subscription_id: subscriptionId || null,
        p_event: webhookEvent,
        p_status: orderStatus,
        p_customer_email: customerEmail,
        p_customer_name: customerName,
        p_product_id: productId,
        p_product_name: productName,
        p_amount: chargeAmount,
        p_raw_payload: payload,
      });

      if (rpcError) {
        console.warn('[Kiwify RPC Fallback] Erro na função process_kiwify_event, executando update direto:', rpcError.message);
        
        // Fallback: Atualiza ou insere fluent_profiles
        const { data: profile } = await supabase
          .from('fluent_profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle();

        if (profile) {
          await supabase
            .from('fluent_profiles')
            .update({
              subscription_status: targetSubscriptionStatus,
              subscription_id: subscriptionId || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        } else {
          await supabase
            .from('fluent_profiles')
            .insert({
              email: customerEmail,
              full_name: customerName,
              role: 'TEACHER_MEMBER',
              subscription_status: targetSubscriptionStatus,
              subscription_id: subscriptionId || null,
              country: 'Brasil',
              preferred_language: 'pt-BR',
            });
        }
      }

      // 7. REGISTRO NO LOG DE AUDITORIA (kiwify_webhook_logs)
      await supabase.from('kiwify_webhook_logs').insert({
        order_id: orderId,
        subscription_id: subscriptionId || null,
        webhook_event: webhookEvent,
        order_status: orderStatus,
        customer_email: customerEmail,
        customer_name: customerName,
        product_id: productId,
        product_name: productName,
        charge_amount: chargeAmount,
        currency: 'BRL',
        raw_payload: payload,
        processed_successfully: true,
        ip_address: req.headers.get('x-forwarded-for') || 'edge-runtime',
      });
    }

    // 8. RESPOSTA DE SUCESSO HTTP 200 PARA A KIWIFY
    return new Response(
      JSON.stringify({
        received: true,
        order_id: orderId,
        customer_email: customerEmail,
        status: targetSubscriptionStatus,
        period_end: periodEnd,
        message: 'Kiwify notification processed and access updated successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Kiwify Webhook Fatal Error]:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal error processing Kiwify webhook',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
