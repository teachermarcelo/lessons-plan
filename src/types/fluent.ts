export type CEFRLevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type UserRole = 'ADMIN' | 'TEACHER_MEMBER';

export type SubscriptionStatus = 'active' | 'trial' | 'inactive' | 'cancelled' | 'past_due';

export type DepartmentType = 'CEFR' | 'Business English' | 'English for Kids' | 'Grammar Lab';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  country: string;
  preferred_language: string;
  teaching_context: string;
  subscription_status: SubscriptionStatus;
  subscription_id?: string;
  created_at: string;
  last_login_at: string;
}

export interface CEFRLevelInfo {
  id: CEFRLevelId;
  name: string;
  description: string;
  order_index: number;
  color_badge: string;
  accent_gradient: string;
}

export interface TeacherVersion {
  warmup: string;
  lead_in: string;
  presentation: string;
  controlled_practice: string;
  communicative_practice: string;
  wrap_up: string;
  homework: string;
  teaching_tips: string[];
  materials_needed: string[];
  timing_breakdown?: { stage: string; minutes: number }[];
  answer_keys?: Record<string, string>;
}

export interface StudentVersion {
  reading_text: string;
  vocab_activities: string;
  grammar_exercises: string;
  speaking_prompts: string[];
  homework: string;
  comprehension_questions?: { question: string; hints?: string }[];
}

export interface VocabItem {
  term: string;
  ipa?: string;
  definition: string;
  example: string;
  translation_pt?: string;
}

export interface GrammarLab {
  topic: string;
  rule_explanation: string;
  formula?: string;
  common_mistakes: string[];
  examples: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correct_answer: string;
  explanation: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  ipa?: string;
  back: string;
  example?: string;
  category?: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  cefr_level: CEFRLevelId;
  department: DepartmentType;
  category: string;
  age_group: string;
  duration_minutes: number;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced' | 'Proficiency';
  learning_objectives: string[];
  language_focus: string;
  skills_covered: string[];
  tags: string[];
  summary: string;
  cover_image_url?: string;
  is_published: boolean;
  published_at: string;
  view_count: number;
  download_count: number;
  
  teacher_version: TeacherVersion;
  student_version: StudentVersion;
  vocabulary_list: VocabItem[];
  grammar_lab?: GrammarLab;
  quizzes?: QuizQuestion[];
  flashcards?: FlashcardItem[];
  discussion_questions?: string[];
  custom_html?: string;
  custom_css?: string;
  drive_url?: string;
  slides_url?: string;
  youtube_url?: string;
  external_links?: { title: string; url: string; type: 'drive' | 'slides' | 'youtube' | 'quiz' | 'external' }[];
  visible_modules?: {
    teacher_guide?: boolean;
    student_worksheet?: boolean;
    warmup?: boolean;
    vocabulary?: boolean;
    grammar?: boolean;
    reading?: boolean;
    listening?: boolean;
    speaking?: boolean;
    writing?: boolean;
    interactive_html?: boolean;
    materials?: boolean;
    quizzes?: boolean;
    answer_key?: boolean;
  };
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color_hex: string;
  lesson_ids: string[];
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'new_lesson' | 'worksheet' | 'business' | 'kids' | 'announcement';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  subject: string;
  notification_type: string;
  status: 'sent' | 'queued' | 'failed';
  provider_id?: string;
  sent_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  badge_label: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_brl: number;
  frequency: string;
  description: string;
  features: string[];
}

export interface CheckoutLead {
  id: string;
  created_at: string;
  source_page: string;
  lesson_title?: string;
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  status: 'clicked_checkout' | 'completed_purchase' | 'abandoned' | 'recovered';
  notes?: string;
}

export type PDFExportType =
  | 'TEACHER_VERSION'
  | 'STUDENT_VERSION'
  | 'WORKSHEET'
  | 'FLASHCARDS'
  | 'ANSWER_KEY'
  | 'COMPLETE_PACK';

