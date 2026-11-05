import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, Lesson, NotificationItem, Collection, EmailLog, Announcement } from '../types/fluent';
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
  THEME: 'fluent_immersion_theme',
};

export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored user', e);
  }
  return DEFAULT_TEACHER_USER;
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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
