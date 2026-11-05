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
  DollarSign,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { Lesson, UserProfile, EmailLog } from '../types/fluent';
import { DEFAULT_TEACHER_USER, DEFAULT_TRIAL_USER, KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface AdminCommandCenterProps {
  lessons: Lesson[];
  emailLogs: EmailLog[];
  onTogglePublish: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onEditInStudio: (lesson: Lesson) => void;
  onCreateNewInStudio: () => void;
  onSendBroadcastNotification: (payload: {
    resourceTitle: string;
    cefrLevel: string;
    category: string;
    description: string;
  }) => Promise<void>;
  onClose: () => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  lessons,
  emailLogs,
  onTogglePublish,
  onDeleteLesson,
  onEditInStudio,
  onCreateNewInStudio,
  onSendBroadcastNotification,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'content' | 'users' | 'emails' | 'kiwify'>('metrics');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Lista simulada de membros para gestão
  const [members, setMembers] = useState<UserProfile[]>([
    {
      id: 'usr-1',
      email: 'marcellospropaganda@gmail.com',
      full_name: 'Marcello S. (Super Admin)',
      role: 'ADMIN',
      country: 'Brasil',
      preferred_language: 'pt-BR',
      teaching_context: 'Arquiteto da Plataforma',
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

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/kiwify/webhook` : 'https://seu-dominio.com/api/kiwify/webhook';

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
                <h1 className="text-2xl font-black tracking-tight text-white">PAINEL DO ADMINISTRADOR</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                  ACESSO MASTER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestão de Membros, Publicação de Aulas, Receita Recorrente Kiwify & E-mails Resend
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCreateNewInStudio}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nova Aula</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              Voltar ao Aplicativo
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'metrics'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Métricas & Receita Kiwify</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'content'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca de Conteúdo ({lessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
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
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'emails'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Disparador de E-mails (Resend)</span>
          </button>

          <button
            onClick={() => setActiveTab('kiwify')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'kiwify'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Integração Kiwify (Guia & Webhook)</span>
          </button>
        </div>

        {/* ABA 1: MÉTRICAS E RECEITA */}
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
                  Planos de Aula Publicados
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-purple-400">{lessons.length}</span>
                  <span className="text-xs text-slate-400">Currículos CEFR</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total de PDFs Baixados
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-indigo-400">1.684</span>
                  <span className="text-xs text-slate-400">Fichas em A4</span>
                </div>
              </div>
            </div>

            {/* Link Oficial de Venda Configurado */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">
                  LINK DE CHECKOUT ATIVO NO SISTEMA
                </span>
                <p className="text-base font-bold text-white flex items-center space-x-2">
                  <span className="font-mono text-emerald-400">{KIWIFY_CHECKOUT_URL}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Todos os botões de compra da Landing Page, Dashboard e Modais estão apontando para este link.
                </p>
              </div>

              <a
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg"
              >
                <span>Testar Página de Checkout</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* ABA 2: GESTÃO DE CONTEÚDO */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Planos de Aula Ativos & Rascunhos
              </h3>
              <button
                onClick={onCreateNewInStudio}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Lição no Estúdio</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Título & Nível</th>
                    <th className="p-4">Departamento</th>
                    <th className="p-4">Duração</th>
                    <th className="p-4">Downloads</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{lesson.title}</div>
                        <div className="text-[11px] text-purple-400 font-mono">
                          Nível {lesson.cefr_level} • {lesson.age_group}
                        </div>
                      </td>
                      <td className="p-4">{lesson.department}</td>
                      <td className="p-4">{lesson.duration_minutes} min</td>
                      <td className="p-4 font-bold text-slate-200">{lesson.download_count}</td>
                      <td className="p-4">
                        <button
                          onClick={() => onTogglePublish(lesson.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            lesson.is_published
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {lesson.is_published ? 'PUBLICADO' : 'RASCUNHO'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => onEditInStudio(lesson)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300"
                          title="Editar no Estúdio HTML"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLesson(lesson.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400"
                          title="Excluir Lição"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: GESTÃO DE USUÁRIOS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Professores Cadastrados & Assinantes
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Professor(a)</th>
                    <th className="p-4">Função</th>
                    <th className="p-4">País</th>
                    <th className="p-4">Status de Assinatura</th>
                    <th className="p-4 text-right">Controles de Acesso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{m.full_name}</div>
                        <div className="text-[11px] text-slate-400">{m.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          m.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="p-4">{m.country}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          m.subscription_status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {m.subscription_status === 'active' ? 'TEACHER MEMBRO (ATIVO)' : 'INATIVO / VISITANTE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleSub(m.id)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          {m.subscription_status === 'active' ? 'Suspender Acesso' : 'Ativar Acesso Pro'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 4: DISPARADOR DE E-MAILS */}
        {activeTab === 'emails' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Disparar Aviso de Nova Aula (Resend API)
                </h3>
              </div>

              {emailFeedback && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                  {emailFeedback}
                </div>
              )}

              <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  {isSendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando Aviso por E-mail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Disparar E-mail para Todos os Assinantes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Histórico de Envios */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Histórico de Entregas (Resend Logs)
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
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>ID Resend: {log.provider_id || 'msg_resend_982'}</span>
                      <span>{new Date(log.sent_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: GUIA E WEBHOOK KIWIFY */}
        {activeTab === 'kiwify' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
                CONFIGURAÇÃO KIWIFY PASSO A PASSO
              </span>
              <h3 className="text-xl font-black text-white">Como Funciona a Venda & Registro na Kiwify</h3>
              <p className="text-xs text-slate-400 mt-1">
                Siga este guia simples para sincronizar as compras aprovadas diretamente com a liberação de acesso do professor.
              </p>
            </div>

            {/* Passo 1: Link de Checkout */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold text-xs uppercase block">
                Passo 1: Seu Link de Checkout Recorrente
              </span>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <code className="text-emerald-400 font-mono text-xs flex-1 truncate">
                  {KIWIFY_CHECKOUT_URL}
                </code>
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
              <p className="text-[11px] text-slate-400">
                Este link já está inserido em todos os botões "Assinar Agora" da plataforma.
              </p>
            </div>

            {/* Passo 2: Cadastrar Webhook na Kiwify */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold text-xs uppercase block">
                Passo 2: URL de Webhook para Cadastrar no Painel da Kiwify
              </span>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <code className="text-purple-300 font-mono text-xs flex-1 truncate">
                  {webhookUrl}
                </code>
                <button
                  onClick={handleCopyWebhook}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedWebhook ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                No painel da <strong>Kiwify &gt; Configurações &gt; Webhooks</strong>, crie um webhook colando a URL acima e selecione o evento <strong>"Pedido Aprovado" (order_status: paid)</strong>.
              </p>
            </div>

            {/* Passo 3: Ativação Automática */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold text-xs uppercase block">
                Passo 3: Ativação Automática do Teacher Membro
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Assim que o professor paga os <strong>R$ 19,90</strong> (por PIX ou Cartão), a Kiwify envia o webhook para o backend 
                (<code className="text-purple-300 font-mono">POST /api/kiwify/webhook</code>), que ativa o perfil do professor como <strong>TEACHER_MEMBER</strong> com status <strong>active</strong> imediatamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
