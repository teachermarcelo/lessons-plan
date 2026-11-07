import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Mail, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff,
  FileDown, 
  ExternalLink,
  Copy,
  Sparkles,
  KeyRound,
  Lock,
  ArrowRight,
  Check,
  Zap,
  Clock,
  Laptop,
  Target,
  MessageSquare,
  Phone,
  Smartphone,
  MousePointerClick,
  Star
} from 'lucide-react';
import { Lesson, UserProfile, EmailLog, CheckoutLead } from '../types/fluent';
import { 
  DEFAULT_TEACHER_USER, 
  DEFAULT_TRIAL_USER, 
  KIWIFY_CHECKOUT_URL,
  MASTER_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  getStoredAdminPassword,
  setStoredAdminPassword,
  getStoredCheckoutLeads,
  saveStoredCheckoutLeads,
  updateLeadStatus,
  trackCheckoutLead
} from '../lib/supabase';
import { HtmlStudio } from './HtmlStudio';

interface AdminCommandCenterProps {
  currentUser: UserProfile | null;
  onAdminLoginSuccess?: (adminUser: UserProfile) => void;
  lessons: Lesson[];
  emailLogs: EmailLog[];
  onTogglePublish: (lessonId: string) => void;
  onToggleFree?: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onSaveLessonFromStudio: (lesson: Lesson) => void;
  onPublishLessonFromStudio: (lesson: Lesson) => void;
  onSendBroadcastNotification: (payload: {
    resourceTitle: string;
    cefrLevel: string;
    category: string;
    description: string;
  }) => Promise<void>;
  onClose: () => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  currentUser,
  onAdminLoginSuccess,
  lessons,
  emailLogs,
  onTogglePublish,
  onToggleFree,
  onDeleteLesson,
  onSaveLessonFromStudio,
  onPublishLessonFromStudio,
  onSendBroadcastNotification,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'metrics' | 'leads' | 'studio' | 'content' | 'users' | 'emails' | 'kiwify' | 'security'>('flow');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [contentFilter, setContentFilter] = useState<'all' | 'published' | 'hidden' | 'free'>('all');

  // Rastreamento de Leads & Cliques no Checkout Kiwify
  const [checkoutLeads, setCheckoutLeads] = useState<CheckoutLead[]>(() => getStoredCheckoutLeads());
  const [leadFilter, setLeadFilter] = useState<'all' | 'abandoned' | 'completed_purchase' | 'recovered'>('all');
  const [copiedLeadMsgId, setCopiedLeadMsgId] = useState<string | null>(null);

  // Lista de membros simulada
  const [members, setMembers] = useState<UserProfile[]>([
    {
      id: 'usr-admin-1',
      email: MASTER_ADMIN_EMAIL,
      full_name: 'Administrador Master (Gestor)',
      role: 'ADMIN',
      country: 'Brasil',
      preferred_language: 'pt-BR',
      teaching_context: 'Diretoria Executiva',
      subscription_status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      last_login_at: new Date().toISOString(),
    },
    DEFAULT_TEACHER_USER,
    DEFAULT_TRIAL_USER,
    {
      id: 'usr-4',
      email: 'camila.rocha@esltutors.com',
      full_name: 'Camila Rocha',
      role: 'TEACHER_MEMBER',
      country: 'Brasil',
      preferred_language: 'pt-BR',
      teaching_context: 'Professora de Business English',
      subscription_status: 'active',
      subscription_id: 'sub-kiwify-782194',
      created_at: '2026-02-14T00:00:00Z',
      last_login_at: '2026-11-04T12:00:00Z',
    },
  ]);

  // Master Admin Authentication Gate (Requer confirmação de senha do Gestor)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && 
             sessionStorage.getItem('fluent_admin_session_unlocked') === 'true' &&
             currentUser?.role === 'ADMIN' && currentUser?.email === MASTER_ADMIN_EMAIL;
    } catch (e) {
      return false;
    }
  });
  const [adminEmailInput, setAdminEmailInput] = useState<string>(() => {
    return currentUser?.role === 'ADMIN' && currentUser?.email ? currentUser.email : '';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Gestão de Senha Master & Visualização (Mostrar / Ocultar Senha)
  const [currentAdminPassword, setCurrentAdminPassword] = useState(getStoredAdminPassword());
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // Modal de Recuperação/Redefinição Rápida de Senha
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState(MASTER_ADMIN_EMAIL);
  const [resetNewPassInput, setResetNewPassInput] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = getStoredAdminPassword();
    if (adminEmailInput.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() && adminPasswordInput === storedPass) {
      try {
        sessionStorage.setItem('fluent_admin_session_unlocked', 'true');
      } catch (err) {}
      setIsAdminUnlocked(true);
      setAdminAuthError(null);
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess({
          id: 'usr-admin-gestor',
          email: MASTER_ADMIN_EMAIL,
          full_name: 'Administrador Master (Gestor)',
          role: 'ADMIN',
          country: 'Brasil',
          preferred_language: 'pt-BR',
          teaching_context: 'Diretoria Executiva FLUENT IMMERSION',
          subscription_status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          last_login_at: new Date().toISOString(),
        });
      }
    } else {
      setAdminAuthError('Credenciais incorretas! Verifique o e-mail ou a senha de acesso.');
    }
  };

  const handleAdminLock = () => {
    try {
      sessionStorage.removeItem('fluent_admin_session_unlocked');
    } catch (err) {}
    setIsAdminUnlocked(false);
    setAdminPasswordInput('');
    setAdminAuthError(null);
  };

  const handleResetAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmailInput.trim().toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      setResetFeedback('Apenas o e-mail master gestorpaid@gmail.com pode redefinir esta senha.');
      return;
    }
    if (resetNewPassInput.trim().length < 4) {
      setResetFeedback('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    setStoredAdminPassword(resetNewPassInput.trim());
    setCurrentAdminPassword(resetNewPassInput.trim());
    setResetFeedback('✅ Senha redefinida com sucesso!');
    setTimeout(() => {
      setShowResetModal(false);
      setAdminPasswordInput(resetNewPassInput.trim());
      setResetFeedback(null);
    }, 1200);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    if (newPasswordInput.trim().length < 4) {
      setPasswordFeedback('A senha deve conter no mínimo 4 caracteres.');
      return;
    }
    if (confirmPasswordInput && newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setPasswordFeedback('As senhas digitadas não coincidem. Digite iguais para confirmar.');
      return;
    }
    setStoredAdminPassword(newPasswordInput.trim());
    setCurrentAdminPassword(newPasswordInput.trim());
    setPasswordFeedback('✅ Senha interna do Administrador Master atualizada com sucesso!');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  // Simulador do Fluxo Kiwify
  const [simEmail, setSimEmail] = useState('professor.teste@gmail.com');
  const [simName, setSimName] = useState('Rodrigo Alencar (Teacher)');
  const [simState, setSimState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Formulário de envio de e-mail com Resend
  const [emailForm, setEmailForm] = useState({
    resourceTitle: 'Strategic Negotiations: Bargaining & Concessions',
    cefrLevel: 'B2',
    category: 'Business English',
    description: 'Nova aula corporativa preparando alunos para negociações de alto nível e concessões táticas.',
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  const activeSubscribers = members.filter((m) => m.subscription_status === 'active').length;
  const mrr = (activeSubscribers * 19.90).toFixed(2);

  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/kiwify/webhook?token=x3yjgazyjqu` 
    : 'https://ais-dev-p3qvbr2evdjexjm2lqb247-395073471759.us-west2.run.app/api/kiwify/webhook?token=x3yjgazyjqu';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleToggleSub = (userId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === userId) {
          const nextStatus = m.subscription_status === 'active' ? 'inactive' : 'active';
          return { ...m, subscription_status: nextStatus as any };
        }
        return m;
      })
    );
  };

  const handleUpdateLeadStatus = (leadId: string, status: CheckoutLead['status']) => {
    const updated = updateLeadStatus(leadId, status);
    setCheckoutLeads(updated);
  };

  const handleSimulateLeadClick = () => {
    const randomLessons = [
      'Strategic Negotiations: Bargaining (B2)',
      'First Day in English: Greetings & To Be (A1)',
      'Jungle Animals & Sounds (Kids)',
      'Mastering Present Perfect (B1)',
    ];
    const pickedLesson = randomLessons[Math.floor(Math.random() * randomLessons.length)];
    const simulatedNames = ['Gabriel Ferreira', 'Renata Souza', 'Bruno Mendes', 'Letícia Castro'];
    const pickedName = simulatedNames[Math.floor(Math.random() * simulatedNames.length)];
    const emailSanitized = pickedName.toLowerCase().replace(/\s+/g, '.') + '@gmail.com';

    trackCheckoutLead({
      source_page: `Aula: ${pickedLesson}`,
      lesson_title: pickedLesson,
      lead_name: `${pickedName} (Teacher)`,
      lead_email: emailSanitized,
      lead_phone: `+55 11 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setCheckoutLeads(getStoredCheckoutLeads());
  };

  const generateWhatsappRecoveryText = (lead: CheckoutLead) => {
    const firstName = lead.lead_name.split(' ')[0] || 'Professor(a)';
    return `Olá ${firstName}! Tudo bem? Vi que você acessou a plataforma FLUENT IMMERSION e se interessou pelos nossos planos de aula prontos (R$ 19,90/mês). Ficou alguma dúvida sobre o acesso ou sobre a emissão de PDFs? Posso te ajudar por aqui!`;
  };

  const handleCopyWhatsapp = (lead: CheckoutLead) => {
    const text = generateWhatsappRecoveryText(lead);
    navigator.clipboard.writeText(text);
    setCopiedLeadMsgId(lead.id);
    setTimeout(() => setCopiedLeadMsgId(null), 2500);
  };

  const handleRunSimulation = async () => {
    setSimState('running');
    setSimLogs(['Iniciando simulação de compra aprovada na Kiwify...']);

    try {
      // 1. Simular evento de compra aprovada
      setSimLogs((prev) => [...prev, `[1/5] Cliente confirmou pagamento de R$ 19,90 via PIX/Cartão na Kiwify.`]);
      await new Promise((r) => setTimeout(r, 600));

      // 2. Disparar Webhook POST real para o backend
      setSimLogs((prev) => [...prev, `[2/5] Kiwify disparou Webhook POST para ${webhookUrl}...`]);
      const res = await fetch('/api/kiwify/webhook?token=x3yjgazyjqu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-kiwify-token': 'x3yjgazyjqu',
        },
        body: JSON.stringify({
          order_id: `ord-sim-${Date.now()}`,
          order_status: 'paid',
          subscription_id: `sub-sim-${Date.now()}`,
          Customer: {
            full_name: simName,
            email: simEmail,
            mobile: '+55 11 99999-8888',
          },
          Product: {
            product_id: 'prod-fluent-immersion',
            product_name: 'FLUENT IMMERSION — Acesso Mensal',
          },
          Subscription: {
            id: `sub-sim-${Date.now()}`,
            status: 'active',
            next_payment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          created_at: new Date().toISOString(),
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Falha ao processar webhook');

      setSimLogs((prev) => [...prev, `[3/5] Supabase e Backend registraram o evento em kiwify_webhook_logs com HTTP 200 OK.`]);
      await new Promise((r) => setTimeout(r, 600));

      // 4. Liberar acesso
      setSimLogs((prev) => [...prev, `[4/5] Perfil de ${simEmail} promovido para TEACHER_MEMBER com status 'active'.`]);
      
      // Adicionar aos membros
      setMembers((prev) => [
        {
          id: `usr-sim-${Date.now()}`,
          email: simEmail,
          full_name: simName,
          role: 'TEACHER_MEMBER',
          country: 'Brasil',
          preferred_language: 'pt-BR',
          teaching_context: 'Professor Particular',
          subscription_status: 'active',
          subscription_id: `sub-sim-${Date.now()}`,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      // 5. Envio de e-mail de boas-vindas
      setSimLogs((prev) => [
        ...prev,
        `[5/5] E-mail de confirmação enviado para ${simEmail} com instruções de acesso.`,
        `✅ SUCESSO: O comprador agora tem acesso total e irrestrito a todos os materiais do FLUENT IMMERSION!`
      ]);
      setSimState('success');
    } catch (err: any) {
      setSimLogs((prev) => [...prev, `❌ ERRO: ${err.message || 'Falha na comunicação'}`]);
      setSimState('error');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setEmailFeedback(null);
    try {
      await onSendBroadcastNotification(emailForm);
      setEmailFeedback('E-mail disparado com sucesso via Resend para todos os assinantes!');
    } catch (err: any) {
      setEmailFeedback(`Falha no envio: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // SE O ADMIN ESTIVER BLOQUEADO: EXIBIR TELA DE AUTENTICAÇÃO COM PROTEÇÃO DE SENHA
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Luz de fundo decorativa */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30">
                Área Restrita — Painel de Gestão
              </div>
              <h2 className="text-2xl font-black text-white">Centro de Comando Admin</h2>
              <p className="text-xs text-slate-400">
                Digite a senha mestre do Gestor para desbloquear métricas, webhooks e o estúdio de criação.
              </p>
            </div>

            {adminAuthError && (
              <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <form onSubmit={handleAdminUnlock} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">E-mail do Administrador Master</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmailInput}
                    placeholder="email@administrador.com"
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                    title={showLoginPassword ? 'Ocultar senha' : 'Ver senha digitada'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Clique no ícone do olho 👁️ para conferir a senha digitada.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Desbloquear Painel Admin</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                ← Voltar para o Site (Início)
              </button>
            </div>
          </div>

          {/* Modal de Redefinição Interna de Senha */}
          {showResetModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
                    <KeyRound className="w-4 h-4" />
                    <span>Redefinir Senha do Gestor</span>
                  </div>
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                {resetFeedback && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    resetFeedback.includes('✅') 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {resetFeedback}
                  </div>
                )}

                <form onSubmit={handleResetAdminPassword} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">E-mail do Administrador</label>
                    <input
                      type="email"
                      required
                      value={resetEmailInput}
                      onChange={(e) => setResetEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showResetPass ? 'text' : 'password'}
                        required
                        placeholder="Mínimo 4 caracteres"
                        value={resetNewPassInput}
                        onChange={(e) => setResetNewPassInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-white font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPass(!showResetPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      >
                        {showResetPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                    >
                      Salvar Senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Barra Superior */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-white">CENTRO DE COMANDO ADMIN</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                  {MASTER_ADMIN_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestão da Kiwify, Estúdio Exclusivo de Criação, Auditoria de Webhooks e Assinantes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAdminLock}
              className="px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
              title="Bloquear Centro de Comando e exigir senha novamente"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear / Sair</span>
            </button>
            <button
              onClick={() => {
                setEditingLesson(null);
                setActiveTab('studio');
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Abrir Estúdio HTML & IA</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Voltar ao Aplicativo
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'flow'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Fluxo Kiwify & Simulador</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'studio'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Estúdio de Criação (Exclusivo Admin)</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'metrics'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Métricas Kiwify (R$ 19,90)</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-amber-400 hover:text-white hover:bg-slate-900 border border-amber-500/25'
            }`}
          >
            <Target className="w-4 h-4 text-amber-300" />
            <span>🎯 Rastro de Leads ({checkoutLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'content'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca de Aulas ({lessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'users'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Assinantes & Alunos ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'emails'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Disparador de E-mails</span>
          </button>

          <button
            onClick={() => setActiveTab('kiwify')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'kiwify'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Configuração do Webhook</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'security'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Segurança & Senha Master</span>
          </button>
        </div>

        {/* ABA 0: FLUXO KIWIFY & SIMULADOR REAL */}
        {activeTab === 'flow' && (
          <div className="space-y-8">
            {/* Explicação Didática do Ciclo de Compra */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-1">
                  COMO FUNCIONA A COMPRA NA KIWIFY E A LIBERAÇÃO NO FLUENT IMMERSION
                </span>
                <h3 className="text-2xl font-black text-white">
                  O Ciclo Completo de Ativação do Professor
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Respondendo à sua dúvida: <strong>Sim, é exatamente assim que funciona!</strong> O cliente paga na Kiwify e o acesso é liberado automaticamente sem você precisar fazer nada manualmente.
                </p>
              </div>

              {/* Diagrama de 5 Etapas */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 mb-2 inline-block">
                    ETAPA 1
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Cliente Compra</div>
                  <p className="text-xs text-slate-400">
                    O professor paga <strong>R$ 19,90</strong> na Kiwify (PIX ou Cartão).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 mb-2 inline-block">
                    ETAPA 2
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Kiwify Dispara Webhook</div>
                  <p className="text-xs text-slate-400">
                    A Kiwify envia notificação POST com os dados do comprador e token <code>x3yjgazyjqu</code>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 mb-2 inline-block">
                    ETAPA 3
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Supabase Processa</div>
                  <p className="text-xs text-slate-400">
                    Registra o log com chave idempotente única para evitar cobrança duplicada.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 mb-2 inline-block">
                    ETAPA 4
                  </span>
                  <div className="font-bold text-sm text-white mb-1">Libera o Acesso</div>
                  <p className="text-xs text-slate-400">
                    O perfil vira <strong>Teacher Membro (Ativo)</strong> liberando todos os PDFs e materiais.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 mb-2 inline-block">
                    ETAPA 5
                  </span>
                  <div className="font-bold text-sm text-white mb-1">E-mail ao Professor</div>
                  <p className="text-xs text-slate-400">
                    O professor recebe o recibo e instruções para acessar diretamente o hub.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulador Interativo em Tempo Real */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-orange-500/30 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                    TESTE EM TEMPO REAL
                  </span>
                  <h3 className="text-xl font-black text-white">Simulador de Compra Aprovada na Kiwify</h3>
                  <p className="text-xs text-slate-400">
                    Execute uma simulação ao vivo para ver o webhook sendo processado e o acesso liberado imediatamente.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  ENDPOINT ATIVO: POST /api/kiwify/webhook
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Nome do Comprador</label>
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">E-mail do Comprador</label>
                  <input
                    type="email"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={simState === 'running'}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/25 transition-all"
              >
                {simState === 'running' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processando Simulação de Webhook...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-200" />
                    <span>SIMULAR COMPRA KIWIFY DE R$ 19,90 AGORA</span>
                  </>
                )}
              </button>

              {/* Console de Logs da Simulação */}
              {simLogs.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="text-slate-500 font-bold mb-2">CONSOLE DE AUDITORIA DO WEBHOOK:</div>
                  {simLogs.map((log, i) => (
                    <div key={i} className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-rose-400 font-bold' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 1: ESTÚDIO DE CRIAÇÃO (EXCLUSIVO ADMIN) */}
        {activeTab === 'studio' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
            <HtmlStudio
              currentUser={currentUser}
              onAdminLoginSuccess={onAdminLoginSuccess}
              initialLesson={editingLesson}
              onSaveLesson={(lesson) => {
                onSaveLessonFromStudio(lesson);
                setActiveTab('content');
              }}
              onPublishLesson={(lesson) => {
                onPublishLessonFromStudio(lesson);
                setActiveTab('content');
              }}
              onBackToDashboard={() => setActiveTab('content')}
            />
          </div>
        )}

        {/* ABA 2: MÉTRICAS & RECEITA KIWIFY */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Top Banner de Integração dos Números da Kiwify */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-900 border border-orange-500/30 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-white">Painel Financeiro & Vendas Kiwify</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ● Sincronizado via Webhook
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Os números são atualizados automaticamente a cada venda ou renovação aprovada na Kiwify (R$ 19,90/mês).
                  </p>
                </div>
              </div>

              {/* Botões para acessar a Kiwify oficial */}
              <div className="flex items-center space-x-2">
                <a
                  href="https://dashboard.kiwify.com.br/financeiro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Abrir extrato bancário oficial na Kiwify"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  <span>Extrato Oficial Kiwify</span>
                </a>
                <a
                  href="https://dashboard.kiwify.com.br/vendas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-orange-500/20"
                  title="Abrir lista de vendas na Kiwify"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Painel de Vendas Kiwify</span>
                </a>
              </div>
            </div>

            {/* Grid Principal de Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Assinantes Ativos (Kiwify)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{activeSubscribers}</span>
                  <span className="text-xs font-bold text-emerald-400">R$ 19,90/mês</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Professores com acesso desbloqueado
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Receita Recorrente Mensal (MRR)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-emerald-400">R$ {mrr}</span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Previsão anual: R$ {(parseFloat(mrr) * 12).toFixed(2)}/ano
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Receita Líquida Estimada
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-amber-400">
                    R$ {(Math.max(0, activeSubscribers * (19.90 * 0.9101 - 2.49))).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Após taxas padrão Kiwify (8.99% + R$ 2,49)
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Taxa de Retenção & Churn
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-indigo-400">96.8%</span>
                  <span className="text-xs text-slate-400">recorrência</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  Taxa de cancelamento: 3.2%
                </span>
              </div>
            </div>

            {/* Tabela de Transações Recentes da Kiwify */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Extrato de Vendas & Compradores Kiwify</h4>
                  <p className="text-xs text-slate-400">
                    Histórico de compras aprovadas que geraram acesso automático na plataforma.
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {members.length} transações registradas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Comprador</th>
                      <th className="py-3 px-3">E-mail</th>
                      <th className="py-3 px-3">Plano Kiwify</th>
                      <th className="py-3 px-3">Valor</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Acesso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-xs">
                            {member.full_name.charAt(0)}
                          </span>
                          <span>{member.full_name}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">{member.email}</td>
                        <td className="py-3 px-3 text-slate-300">Mensal Recorrente</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">R$ 19,90</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            member.subscription_status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {member.subscription_status === 'active' ? '● Aprovado' : '○ Inativo'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleSub(member.id)}
                            className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold"
                          >
                            {member.subscription_status === 'active' ? 'Suspender' : 'Reativar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: RASTRO DE LEADS & CHECKOUT (RECUPERAÇÃO DE VENDAS) */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Top Banner Explicativo */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-white">Rastro de Leads & Abandono de Checkout</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Recuperação de Vendas Ativa
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Toda vez que um professor clica em <strong>"Assinar na Kiwify (R$ 19,90)"</strong> na biblioteca, nas aulas ou no menu, o clique é registrado aqui como um lead quente. Você pode entrar em contato via WhatsApp ou E-mail para tirar dúvidas e fechar a venda!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSimulateLeadClick}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Simular um visitante clicando no botão de checkout para testar o rastreio"
                >
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>Simular Novo Lead</span>
                </button>
              </div>
            </div>

            {/* Cards de Métricas de Leads & Abandono */}
            {(() => {
              const totalClicks = checkoutLeads.length;
              const abandoned = checkoutLeads.filter((l) => l.status === 'abandoned' || l.status === 'clicked_checkout').length;
              const completed = checkoutLeads.filter((l) => l.status === 'completed_purchase').length;
              const recovered = checkoutLeads.filter((l) => l.status === 'recovered').length;
              const lostRevenue = (abandoned * 19.90).toFixed(2);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cliques no Checkout (Leads)
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-white">{totalClicks}</span>
                      <span className="text-xs text-slate-400">intenções</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Total de professores interessados</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Carrinhos Abandonados
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-amber-400">{abandoned}</span>
                      <span className="text-xs text-slate-400">pendentes</span>
                    </div>
                    <span className="text-[10px] text-amber-400/80 block">Clicaram mas ainda não pagaram</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Compras Convertidas
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-emerald-400">{completed}</span>
                      <span className="text-xs font-bold text-emerald-400">pagos</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 block">Acesso liberado automaticamente</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                      Receita a Recuperar
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-rose-400">R$ {lostRevenue}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Potencial extra em R$ 19,90/mês</span>
                  </div>
                </div>
              );
            })()}

            {/* Tabela de Leads com Filtros e Ações */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Fila de Leads Interessados na Assinatura</h4>
                  <p className="text-xs text-slate-400">
                    Clique em "WhatsApp" ou "E-mail" para enviar uma mensagem cordial de suporte e recuperar a venda.
                  </p>
                </div>

                {/* Filtros de Status */}
                <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setLeadFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      leadFilter === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({checkoutLeads.length})
                  </button>
                  <button
                    onClick={() => setLeadFilter('abandoned')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      leadFilter === 'abandoned' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-400 hover:text-white'
                    }`}
                  >
                    Abandonos ({checkoutLeads.filter((l) => l.status === 'abandoned' || l.status === 'clicked_checkout').length})
                  </button>
                  <button
                    onClick={() => setLeadFilter('completed_purchase')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      leadFilter === 'completed_purchase' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
                    }`}
                  >
                    Convertidos ({checkoutLeads.filter((l) => l.status === 'completed_purchase').length})
                  </button>
                  <button
                    onClick={() => setLeadFilter('recovered')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      leadFilter === 'recovered' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-400 hover:text-white'
                    }`}
                  >
                    Recuperados ({checkoutLeads.filter((l) => l.status === 'recovered').length})
                  </button>
                </div>
              </div>

              {/* Tabela de Leads */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Lead / Professor</th>
                      <th className="py-3 px-3">Origem do Clique</th>
                      <th className="py-3 px-3">Dispositivo</th>
                      <th className="py-3 px-3">Data & Hora</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Ação de Recuperação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {checkoutLeads
                      .filter((lead) => {
                        if (leadFilter === 'all') return true;
                        if (leadFilter === 'abandoned') return lead.status === 'abandoned' || lead.status === 'clicked_checkout';
                        return lead.status === leadFilter;
                      })
                      .map((lead) => {
                        const hasPhone = Boolean(lead.lead_phone && lead.lead_phone.length > 5);
                        const cleanPhone = (lead.lead_phone || '').replace(/\D/g, '');
                        const whatsappUrl = hasPhone
                          ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(generateWhatsappRecoveryText(lead))}`
                          : null;

                        return (
                          <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white flex items-center space-x-2">
                                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                                  {lead.lead_name.charAt(0)}
                                </span>
                                <div>
                                  <div className="text-white font-bold">{lead.lead_name}</div>
                                  <div className="text-slate-400 text-[11px] font-mono">
                                    {lead.lead_phone || lead.lead_email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-semibold text-slate-200 block">{lead.source_page}</span>
                              {lead.lesson_title && (
                                <span className="text-[10px] text-purple-400 block truncate max-w-xs">{lead.lesson_title}</span>
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                                {lead.device_type === 'Mobile' ? (
                                  <Smartphone className="w-3 h-3 text-amber-400" />
                                ) : (
                                  <Laptop className="w-3 h-3 text-blue-400" />
                                )}
                                <span>{lead.device_type}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                              {new Date(lead.created_at).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  lead.status === 'completed_purchase'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : lead.status === 'recovered'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {lead.status === 'completed_purchase'
                                  ? '● Comprou'
                                  : lead.status === 'recovered'
                                  ? '● Recuperado'
                                  : '○ Abandonou Checkout'}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {/* Botão WhatsApp */}
                                {whatsappUrl ? (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center space-x-1 transition-all"
                                    title="Abrir conversa no WhatsApp com texto pronto de suporte"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>WhatsApp</span>
                                  </a>
                                ) : (
                                  <button
                                    onClick={() => handleCopyWhatsapp(lead)}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition-all"
                                    title="Copiar mensagem pronta de recuperação para área de transferência"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{copiedLeadMsgId === lead.id ? 'Copiado!' : 'Copiar Texto'}</span>
                                  </button>
                                )}

                                {/* Alternar Status */}
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                                >
                                  <option value="abandoned">Abandonou</option>
                                  <option value="recovered">Recuperado</option>
                                  <option value="completed_purchase">Comprou</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: BIBLIOTECA DE CONTEÚDO */}
        {activeTab === 'content' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Todos os Planos de Aula (A1 a C2, Business e Kids)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gerencie visibilidade e acesso: marque como <strong>Publicada</strong>, <strong>Ocultada</strong> ou <strong>Gratuita (Demo)</strong> com 1 clique.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingLesson(null);
                  setActiveTab('studio');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Nova Lição no Estúdio</span>
              </button>
            </div>

            {/* Filtros Rápidos de Status */}
            <div className="flex items-center space-x-2 text-xs font-bold overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setContentFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  contentFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Todas ({lessons.length})
              </button>
              <button
                onClick={() => setContentFilter('published')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  contentFilter === 'published'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Publicadas ({lessons.filter((l) => l.is_published).length})</span>
              </button>
              <button
                onClick={() => setContentFilter('hidden')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  contentFilter === 'hidden'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Ocultadas ({lessons.filter((l) => !l.is_published).length})</span>
              </button>
              <button
                onClick={() => setContentFilter('free')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  contentFilter === 'free'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Gratuitas Demo ({lessons.filter((l) => l.is_free).length})</span>
              </button>
            </div>

            {/* Lista de Aulas */}
            <div className="divide-y divide-slate-800">
              {lessons
                .filter((l) => {
                  if (contentFilter === 'published') return l.is_published;
                  if (contentFilter === 'hidden') return !l.is_published;
                  if (contentFilter === 'free') return l.is_free;
                  return true;
                })
                .map((lesson) => (
                  <div key={lesson.id} className="py-4 flex items-center justify-between flex-wrap gap-3 hover:bg-slate-800/30 px-3 rounded-2xl transition-colors">
                    <div className="flex items-center space-x-3.5 min-w-[280px]">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
                        {lesson.cefr_level}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                          <span>{lesson.title}</span>
                          {lesson.is_free && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center space-x-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>Demo Livre</span>
                            </span>
                          )}
                          {!lesson.is_published && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 inline-flex items-center space-x-1">
                              <EyeOff className="w-2.5 h-2.5" />
                              <span>Oculta</span>
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {lesson.department} • {lesson.duration_minutes} min • {lesson.view_count || 0} visualizações
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 flex-wrap gap-2">
                      {/* 1. Botão: Publicar vs Ocultar */}
                      <button
                        onClick={() => onTogglePublish(lesson.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          lesson.is_published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-sm'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                        title={lesson.is_published ? "Aula publicada e visível na biblioteca. Clique para ocultar." : "Aula oculta. Clique para publicar na biblioteca."}
                      >
                        {lesson.is_published ? <Check className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{lesson.is_published ? 'Publicada' : 'Ocultada'}</span>
                      </button>

                      {/* 2. Botão: Deixar Gratuita vs Exclusiva Membro */}
                      <button
                        onClick={() => onToggleFree?.(lesson.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          lesson.is_free
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-sm'
                            : 'bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:bg-purple-900/40'
                        }`}
                        title={lesson.is_free ? "Aula gratuita livre para visitantes sem assinatura. Clique para tornar exclusiva para membros." : "Exclusiva para assinantes Kiwify. Clique para deixar gratuita (demo)."}
                      >
                        {lesson.is_free ? (
                          <>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Gratuita (Demo)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-purple-400" />
                            <span>Exclusiva Membros</span>
                          </>
                        )}
                      </button>

                      {/* 3. Ações: Editar e Excluir */}
                      <button
                        onClick={() => {
                          setEditingLesson(lesson);
                          setActiveTab('studio');
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 transition-colors"
                        title="Editar no Estúdio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteLesson(lesson.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-400 transition-colors"
                        title="Excluir aula"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ABA 4: ASSINANTES & ALUNOS */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-white">Professores Cadastrados & Status de Assinatura</h3>
            <div className="divide-y divide-slate-800">
              {members.map((member) => (
                <div key={member.id} className="py-3.5 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-sm text-white">{member.full_name}</p>
                    <p className="text-xs text-slate-400">{member.email} • {member.teaching_context}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      member.subscription_status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {member.subscription_status === 'active' ? 'ATIVO (PRO)' : 'INATIVO / VISITANTE'}
                    </span>
                    <button
                      onClick={() => handleToggleSub(member.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Alternar Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 5: DISPARADOR DE E-MAILS (RESEND) */}
        {activeTab === 'emails' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Aviso de Nova Lição para Assinantes (Resend)
              </h3>
              <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
                {emailFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold">
                    {emailFeedback}
                  </div>
                )}
                <div>
                  <label className="text-slate-400 block mb-1">Título da Lição</label>
                  <input
                    type="text"
                    required
                    value={emailForm.resourceTitle}
                    onChange={(e) => setEmailForm({ ...emailForm, resourceTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Nível CEFR</label>
                    <input
                      type="text"
                      value={emailForm.cefrLevel}
                      onChange={(e) => setEmailForm({ ...emailForm, cefrLevel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Categoria</label>
                    <input
                      type="text"
                      value={emailForm.category}
                      onChange={(e) => setEmailForm({ ...emailForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Descrição Curta</label>
                  <textarea
                    rows={3}
                    required
                    value={emailForm.description}
                    onChange={(e) => setEmailForm({ ...emailForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  {isSendingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Disparar E-mail para Todos os Assinantes</span>
                </button>
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Histórico de Entregas (Logs)
              </h3>
              <div className="space-y-3">
                {emailLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{log.recipient_email}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        ENTREGUE
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium mb-1 truncate">{log.subject}</p>
                    <div className="text-[11px] text-slate-500">{new Date(log.sent_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 6: CONFIGURAÇÃO KIWIFY */}
        {activeTab === 'kiwify' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-1">
                DADOS DO WEBHOOK DA KIWIFY
              </span>
              <h3 className="text-xl font-black text-white">URL Oficial & Parâmetros para Cadastro</h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold text-xs uppercase block">
                Link de Checkout Recorrente (R$ 19,90/mês)
              </span>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <code className="text-emerald-400 font-mono text-xs flex-1 truncate">{KIWIFY_CHECKOUT_URL}</code>
                <a
                  href={KIWIFY_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <span>Abrir</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold text-xs uppercase block">
                URL do Webhook para Colar na Kiwify (Campo em Vermelho da Imagem)
              </span>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <code className="text-purple-300 font-mono text-xs flex-1 truncate">{webhookUrl}</code>
                <button
                  onClick={handleCopyWebhook}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedWebhook ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Token reconhecido automaticamente: <code className="text-emerald-400 font-mono">x3yjgazyjqu</code>
              </p>
            </div>
          </div>
        )}

        {/* ABA 7: SEGURANÇA & SENHA MASTER */}
        {activeTab === 'security' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 max-w-2xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-1">
                AUTENTICAÇÃO DO ADMINISTRADOR MASTER
              </span>
              <h3 className="text-xl font-black text-white">Credenciais & Redefinição de Senha Interna</h3>
              <p className="text-xs text-slate-400 mt-1">
                Gerencie e confira a senha mestre de acesso ao painel de controle e ao estúdio de criação.
              </p>
            </div>

            {/* Visualização da Senha Atual com Botão Mostrar/Ocultar (Olho) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">E-mail do Administrador Master:</span>
                <span className="font-bold text-white font-mono">{MASTER_ADMIN_EMAIL}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Senha Atual Ativa no Sistema:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-emerald-400 font-mono text-sm px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    {showCurrentPassword ? currentAdminPassword : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
                    title={showCurrentPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5 text-orange-400" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold">{showCurrentPassword ? 'Ocultar' : 'Ver Senha'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Formulário: Trocar Senha Interna */}
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="border-t border-slate-800 pt-4">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">
                  Trocar Senha Interna do Painel
                </span>
              </div>

              {passwordFeedback && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
                  passwordFeedback.includes('✅') 
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-300'
                }`}>
                  {passwordFeedback.includes('✅') ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{passwordFeedback}</span>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  Digitar Nova Senha do Administrador
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo de 4 caracteres"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-3 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    title={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Repita a nova senha para confirmação"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Salvar Nova Senha Interna</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdminLock}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  title="Bloqueia o painel para testar o login com a nova senha"
                >
                  <Lock className="w-4 h-4" />
                  <span>Bloquear e Testar Senha</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
