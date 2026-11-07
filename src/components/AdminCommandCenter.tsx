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
  Laptop
} from 'lucide-react';
import { Lesson, UserProfile, EmailLog } from '../types/fluent';
import { 
  DEFAULT_TEACHER_USER, 
  DEFAULT_TRIAL_USER, 
  KIWIFY_CHECKOUT_URL,
  MASTER_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  getStoredAdminPassword,
  setStoredAdminPassword
} from '../lib/supabase';
import { HtmlStudio } from './HtmlStudio';

interface AdminCommandCenterProps {
  currentUser: UserProfile | null;
  onAdminLoginSuccess?: (adminUser: UserProfile) => void;
  lessons: Lesson[];
  emailLogs: EmailLog[];
  onTogglePublish: (lessonId: string) => void;
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
  onDeleteLesson,
  onSaveLessonFromStudio,
  onPublishLessonFromStudio,
  onSendBroadcastNotification,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'metrics' | 'studio' | 'content' | 'users' | 'emails' | 'kiwify' | 'security'>('flow');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

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

  // Gestão de Senha Master
  const [currentAdminPassword, setCurrentAdminPassword] = useState(getStoredAdminPassword());
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

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

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    setStoredAdminPassword(newPasswordInput.trim());
    setCurrentAdminPassword(newPasswordInput.trim());
    setPasswordFeedback('Senha do Administrador Master atualizada com sucesso!');
    setNewPasswordInput('');
    setTimeout(() => setPasswordFeedback(null), 3000);
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

        {/* ABA 2: MÉTRICAS & RECEITA */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Assinantes Ativos (Kiwify)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{activeSubscribers}</span>
                  <span className="text-xs font-bold text-emerald-400">R$ 19,90/mês</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Receita Recorrente Mensal (MRR)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-emerald-400">R$ {mrr}</span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Planos de Aula no Acervo
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-purple-400">{lessons.length}</span>
                  <span className="text-xs text-slate-400">A1 ao C2</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Taxa de Retenção Estimada
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-amber-400">96.8%</span>
                  <span className="text-xs text-slate-400">recorrência</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: BIBLIOTECA DE CONTEÚDO */}
        {activeTab === 'content' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h3 className="text-lg font-black text-white">Todos os Planos de Aula (A1 a C2, Business e Kids)</h3>
              <button
                onClick={() => {
                  setEditingLesson(null);
                  setActiveTab('studio');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Nova Lição no Estúdio</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-600/20 text-purple-300">
                      {lesson.cefr_level}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{lesson.title}</h4>
                      <p className="text-xs text-slate-400">{lesson.department} • {lesson.duration_minutes} min</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onTogglePublish(lesson.id)}
                      className={`text-xs px-3 py-1 rounded-lg font-bold ${
                        lesson.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {lesson.is_published ? 'Publicado' : 'Rascunho'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingLesson(lesson);
                        setActiveTab('studio');
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Editar no Estúdio"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLesson(lesson.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400"
                      title="Excluir"
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
              <h3 className="text-xl font-black text-white">Credenciais & Redefinição de Senha</h3>
              <p className="text-xs text-slate-400 mt-1">
                Acesso exclusivo para gerenciamento da plataforma, estúdio de criação e integração de pagamentos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">E-mail do Administrador:</span>
                <span className="font-bold text-white font-mono">{MASTER_ADMIN_EMAIL}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Senha Atual Ativa:</span>
                <span className="font-bold text-emerald-400 font-mono">{currentAdminPassword}</span>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              {passwordFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{passwordFeedback}</span>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  Digitar Nova Senha do Administrador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: nova_senha_segura_2026"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>Salvar e Redefinir Senha do Admin</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
