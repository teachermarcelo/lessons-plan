import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, Lesson, NotificationItem, Collection, EmailLog, Announcement, CheckoutLead } from '../types/fluent';
import { INITIAL_LESSONS } from '../data/initialCatalog';

// Retrieve credentials from environment or fall back to local mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-fluent-immersion.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-fluent-immersion';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('mock')
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/kUSvFoZ';
export const MASTER_ADMIN_EMAIL = 'gestorpaid@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = '823638';
export const FREE_SAMPLE_LESSON_ID = 'les-a1-first-day';

export const getStoredAdminPassword = (): string => {
  return localStorage.getItem('fluent_admin_password') || DEFAULT_ADMIN_PASSWORD;
};

export const setStoredAdminPassword = (newPass: string) => {
  localStorage.setItem('fluent_admin_password', newPass);
};

// Initial demo users for instant role switching
export const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr-admin-gestor',
  email: 'gestorpaid@gmail.com',
  full_name: 'Administrador Master (Gestor)',
  role: 'ADMIN',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  country: 'Brasil',
  preferred_language: 'pt-BR',
  teaching_context: 'Diretoria Executiva FLUENT IMMERSION',
  subscription_status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  last_login_at: new Date().toISOString(),
};

export const DEFAULT_TEACHER_USER: UserProfile = {
  id: 'usr-teacher-002',
  email: 'teacher@fluentimmersion.com',
  full_name: 'Juliana Mendes (Teacher Membro)',
  role: 'TEACHER_MEMBER',
  avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  country: 'Brasil',
  preferred_language: 'pt-BR',
  teaching_context: 'Professora Particular & Coach Corporativa',
  subscription_status: 'active',
  subscription_id: 'sub-kiwify-kUSvFoZ',
  created_at: '2026-02-10T00:00:00Z',
  last_login_at: new Date().toISOString(),
};

export const DEFAULT_TRIAL_USER: UserProfile = {
  id: 'usr-trial-003',
  email: 'visitante@fluentimmersion.com',
  full_name: 'Visitante (Aulas Exemplo)',
  role: 'TEACHER_MEMBER',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  country: 'Brasil',
  preferred_language: 'pt-BR',
  teaching_context: 'Professor Visitante',
  subscription_status: 'inactive',
  created_at: '2026-11-01T00:00:00Z',
  last_login_at: new Date().toISOString(),
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Novo Currículo de Inglês para Negócios e Crianças Liberado!',
    content: 'Adicionamos novas aulas interativas prontas para aplicar em sala: negociação corporativa B2 e fonética infantil TPR para 3 a 8 anos.',
    badge_label: 'NOVO LANÇAMENTO',
    created_at: '2026-11-04T12:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Gerador Automático de PDFs A4 & Gabaritos Confidenciais',
    content: 'Agora todas as aulas contam com exportação em 1 clique para Versão do Professor, Fichas do Aluno, Cartões de Vocabulário e Gabarito.',
    badge_label: 'ATUALIZAÇÃO',
    created_at: '2026-11-02T09:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Aula Publicada: Strategic Negotiations (B2)',
    message: 'Novo plano de aula B2 Business English com táticas de negociação e concessões pronto para suas turmas executivas.',
    category: 'business',
    link_url: '/lesson/strategic-negotiations-bargaining-concessions',
    is_read: false,
    created_at: '2026-11-04T14:00:00Z',
  },
  {
    id: 'notif-2',
    title: 'Bem-vindo(a) ao Fluent Immersion!',
    message: 'Seu hub completo de planos de aula em inglês está pronto. Explore mais de 120 recursos organizados por níveis do CEFR.',
    category: 'announcement',
    is_read: true,
    created_at: '2026-11-01T08:00:00Z',
  },
];

// Persistent state storage helpers
const STORAGE_KEYS = {
  CURRENT_USER: 'fluent_immersion_current_user',
  LESSONS: 'fluent_immersion_lessons',
  FAVORITES: 'fluent_immersion_favorites',
  COLLECTIONS: 'fluent_immersion_collections',
  NOTIFICATIONS: 'fluent_immersion_notifications',
  EMAIL_LOGS: 'fluent_immersion_email_logs',
  CHECKOUT_LEADS: 'fluent_immersion_checkout_leads',
  THEME: 'fluent_immersion_theme',
};

export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored user', e);
  }
  return DEFAULT_TRIAL_USER;
};

export const setStoredUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getStoredLessons = (): Lesson[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((l: Lesson) => {
          if (l.language_focus && (l.language_focus.includes('useState') || l.language_focus.includes('function(') || l.language_focus.includes('opts:'))) {
            return {
              ...l,
              language_focus: 'Dominar estruturas comunicativas em contextos reais do dia a dia.'
            };
          }
          return l;
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse stored lessons', e);
  }
  return INITIAL_LESSONS;
};

export const saveStoredLessons = (lessons: Lesson[]) => {
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
};

export const getStoredFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return ['les-b2-negotiations', 'les-a1-first-day'];
};

export const saveStoredFavorites = (favs: string[]) => {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
};

export const getStoredCollections = (): Collection[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'col-1',
      user_id: 'usr-teacher-002',
      name: 'Corporate Executive Coaching',
      description: 'High-impact lessons for senior tech and finance managers',
      color_hex: '#8B5CF6',
      lesson_ids: ['les-b2-negotiations', 'les-c1-advanced-inversion'],
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'col-2',
      user_id: 'usr-teacher-002',
      name: 'Beginner Intensive Starter Pack',
      description: 'Foundational A1-A2 conversation and grammar blueprints',
      color_hex: '#10B981',
      lesson_ids: ['les-a1-first-day', 'les-b1-present-perfect'],
      created_at: '2026-11-02T00:00:00Z',
    },
  ];
};

export const saveStoredCollections = (cols: Collection[]) => {
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(cols));
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_NOTIFICATIONS;
};

export const saveStoredNotifications = (notifs: NotificationItem[]) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};

export const getStoredEmailLogs = (): EmailLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'em-1',
      recipient_email: 'marcellospropaganda@gmail.com',
      subject: 'NEW LESSON AVAILABLE — FLUENT IMMERSION: Strategic Negotiations (B2)',
      notification_type: 'new_lesson',
      status: 'sent',
      provider_id: 'resend_msg_01jh982',
      sent_at: '2026-11-04T14:02:10Z',
    },
    {
      id: 'em-2',
      recipient_email: 'teacher@fluentimmersion.com',
      subject: 'Welcome to FLUENT IMMERSION Pro — Subscription Confirmed',
      notification_type: 'welcome',
      status: 'sent',
      provider_id: 'resend_msg_01jh711',
      sent_at: '2026-11-01T09:15:00Z',
    },
  ];
};

export const saveStoredEmailLogs = (logs: EmailLog[]) => {
  localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(logs));
};

export const INITIAL_CHECKOUT_LEADS: CheckoutLead[] = [
  {
    id: 'lead-kiw-101',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    source_page: 'Aula B2 • Strategic Negotiations (Card)',
    lesson_title: 'Strategic Negotiations: Bargaining & Concession Anchoring',
    device_type: 'Desktop',
    lead_name: 'Marcos Paulo (Teacher Particular)',
    lead_email: 'marcos.teacher.sp@gmail.com',
    lead_phone: '+55 11 98765-4321',
    status: 'abandoned',
    notes: 'Clicou no botão "Assinar na Kiwify (R$ 19,90)" após ver a aula demonstrativa B2.',
  },
  {
    id: 'lead-kiw-102',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source_page: 'Barra Superior (Navbar)',
    lesson_title: 'Botão de Assinatura R$ 19,90',
    device_type: 'Mobile',
    lead_name: 'Fernanda Silveira',
    lead_email: 'fernanda.english.coach@hotmail.com',
    lead_phone: '+55 21 99123-9876',
    status: 'abandoned',
    notes: 'Acessou pelo iPhone e abriu a página de pagamento da Kiwify.',
  },
  {
    id: 'lead-kiw-103',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    source_page: 'Paywall de Bloqueio • Ficha do Aluno PDF',
    lesson_title: 'First Day in English: Essential Greetings',
    device_type: 'Desktop',
    lead_name: 'Camila Rocha',
    lead_email: 'camila.rocha.esl@gmail.com',
    lead_phone: '+55 31 98888-2233',
    status: 'completed_purchase',
    notes: 'Converteu com sucesso! Compra aprovada via PIX na Kiwify.',
  },
];

export const getStoredCheckoutLeads = (): CheckoutLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKOUT_LEADS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_CHECKOUT_LEADS;
};

export const saveStoredCheckoutLeads = (leads: CheckoutLead[]) => {
  localStorage.setItem(STORAGE_KEYS.CHECKOUT_LEADS, JSON.stringify(leads));
};

export const trackCheckoutLead = (params: {
  source_page: string;
  lesson_title?: string;
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
}): CheckoutLead => {
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = typeof window !== 'undefined' && /iPad|Tablet/i.test(navigator.userAgent);
  const device: 'Desktop' | 'Mobile' | 'Tablet' = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

  const newLead: CheckoutLead = {
    id: `lead-click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    source_page: params.source_page,
    lesson_title: params.lesson_title || 'Navegação Geral',
    device_type: device,
    lead_name: params.lead_name || 'Professor Visitante (Clique Anônimo)',
    lead_email: params.lead_email || 'Aguardando preenchimento no checkout',
    lead_phone: params.lead_phone,
    status: 'clicked_checkout',
    notes: `Clicou para ir ao checkout da Kiwify a partir de: ${params.source_page}`,
  };

  try {
    const existing = getStoredCheckoutLeads();
    const updated = [newLead, ...existing];
    saveStoredCheckoutLeads(updated);

    // Disparar em background para o backend
    fetch('/api/leads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    }).catch(() => {});
  } catch (e) {}

  return newLead;
};

export const updateLeadStatus = (leadId: string, status: CheckoutLead['status']) => {
  const existing = getStoredCheckoutLeads();
  const updated = existing.map((lead) => (lead.id === leadId ? { ...lead, status } : lead));
  saveStoredCheckoutLeads(updated);
  return updated;
};

