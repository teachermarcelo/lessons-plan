import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Baby, 
  Code, 
  FileDown, 
  Layers, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';
import { CEFR_LEVELS } from '../data/initialCatalog';
import { Lesson } from '../types/fluent';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface LandingPageProps {
  onSubscribe: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  sampleLessons: Lesson[];
  onOpenStudio: () => void;
  onOpenAdmin?: () => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSubscribe,
  onSelectLesson,
  sampleLessons,
  onOpenStudio,
  onOpenAdmin,
  onOpenLegal,
}) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student' | 'flashcards' | 'quiz'>('teacher');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const featuredLesson = sampleLessons[0] || null;

  const faqs = [
    {
      q: 'Como funciona a assinatura mensal na Kiwify?',
      a: 'Por apenas R$ 19,90 por mês, você tem acesso ilimitado a todo o acervo de planos de aula do CEFR (A1 ao C2), módulos de Business English, recursos para Crianças (Kids), quizzes interativos, Estúdio HTML e downloads ilimitados de PDFs no padrão A4. A cobrança é mensal e recorrente através da Kiwify, podendo ser cancelada quando quiser com 1 clique, sem multas ou fidelidade.',
    },
    {
      q: 'O que o Visitante pode ver antes de assinar?',
      a: 'Como visitante, você pode navegar livremente pela biblioteca, visualizar os temas, objetivos pedagógicos e abrir as aulas de exemplo para testar a metodologia. Após assinar na Kiwify, sua conta de Teacher Membro é ativada e você desbloqueia o download de todos os PDFs A4, gabaritos confidenciais, cartões de vocabulário e o Estúdio de Criação.',
    },
    {
      q: 'Posso imprimir as atividades para meus alunos particulares e turmas?',
      a: 'Sim, 100%! Todas as lições contam com gerador de PDF A4 em alta resolução em 1 clique: tanto a Versão do Professor (com passo a passo, minutagem e dicas) quanto a Versão do Aluno (folha de atividades limpa, pronta para imprimir ou enviar por WhatsApp/Google Classroom, sem gabaritos).',
    },
    {
      q: 'Os materiais seguem as normas internacionais do CEFR?',
      a: 'Sim. Todo o currículo foi elaborado seguindo rigorosamente o Quadro Europeu Comum de Referência para Línguas (do A1 Iniciante ao C2 Proficiência) e metodologia CELTA/DELTA da Universidade de Cambridge, garantindo que seus alunos desenvolvam fluência comunicativa real e estejam preparados para certificações internacionais.',
    },
    {
      q: 'Como recebo o acesso após pagar na Kiwify?',
      a: 'A aprovação na Kiwify é imediata para cartão de crédito e PIX. Você recebe a confirmação no seu e-mail e seu perfil é liberado automaticamente como Teacher Membro no FLUENT IMMERSION para começar a usar imediatamente em suas próximas aulas.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Barra de Alerta Pulsante de Lançamento */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-b border-purple-500/30 py-2.5 px-4 text-center text-xs font-semibold text-purple-200 flex items-center justify-center flex-wrap gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span>
          <strong>Lançamento Especial para Teachers:</strong> Acesso Ilimitado à Trilha A1–C2 e Materiais Imprimíveis por apenas 
          <span className="text-amber-300 font-extrabold ml-1">R$ 19,90/mês</span> na Kiwify!
        </span>
        <a 
          href={KIWIFY_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold text-amber-300 hover:text-white ml-1 inline-flex items-center space-x-1"
        >
          <span>Garantir Acesso Imediato</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-32 overflow-hidden border-b border-slate-800">
        {/* Luzes de Fundo com Gradiente Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-purple-600/18 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-orange-500/12 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tag de Destaque Superior com Pulse */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold mb-6 shadow-lg shadow-purple-950/40 hover:border-purple-400 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Mais de 120+ Planos de Aula Prontos para Ensinar</span>
            <span className="text-orange-400 font-black ml-1 animate-pulse">R$ 19,90/mês na Kiwify</span>
          </div>

          {/* Headline Principal */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            PARE DE GASTAR HORAS{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              PREPARANDO AULAS DE INGLÊS.
            </span>
          </h1>

          {/* Subtítulo Descritivo */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Tenha acesso a planos de aula completos e prontos para aplicar, atividades interativas,
            fichas de exercícios em PDF A4, cartões de vocabulário, Business English e aulas para Kids — tudo em uma só plataforma profissional.
          </p>

          {/* CTAs de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* Botão Oficial Kiwify com Animação Pulsante */}
            <a
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base tracking-wide shadow-2xl shadow-orange-500/40 ring-2 ring-orange-400/40 hover:ring-orange-300 transition-all transform active:scale-95 flex items-center justify-center space-x-2.5 animate-pulse"
            >
              <Crown className="w-5 h-5 text-amber-200" />
              <span>GARANTIR ACESSO TOTAL — R$ 19,90/MÊS</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
            </a>

            {/* Ver Aula Exemplo */}
            <button
              onClick={() => {
                const sample = sampleLessons.find((l) => l.id === 'les-a1-first-day') || featuredLesson;
                if (sample) onSelectLesson(sample);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-purple-950/30"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>Explorar Aula Gratuita (A1 Greetings)</span>
            </button>
          </div>

          {/* Selos de Confiança */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Metodologia CELTA & DELTA</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Versão do Professor e do Aluno</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PDFs A4 Imprimíveis em 1 Clique</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Checkout Seguro Kiwify (Cancele quando quiser)</span>
            </div>
          </div>
        </div>

        {/* 2. MOCKUP INTERATIVO DA PLATAFORMA */}
        {featuredLesson && (
          <div className="max-w-6xl mx-auto px-4 mt-16 relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/85 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Barra Superior do Mockup */}
              <div className="bg-slate-950/90 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                    fluentimmersion.com/aulas/{featuredLesson.slug}
                  </span>
                </div>

                {/* Alternador de Abas */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTab('teacher')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'teacher' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Versão do Professor
                  </button>
                  <button
                    onClick={() => setActiveTab('student')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'student' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ficha do Aluno
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'flashcards' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'quiz' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quiz Interativo
                  </button>
                </div>
              </div>

              {/* Corpo da Prévia da Aula */}
              <div className="p-6 sm:p-8 bg-slate-950/70 min-h-[360px] text-left">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Nível {featuredLesson.cefr_level} • {featuredLesson.department}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-purple-400" />
                      {featuredLesson.duration_minutes} minutos
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectLesson(featuredLesson)}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                  >
                    <span>Abrir Aula Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{featuredLesson.title}</h3>
                <p className="text-sm text-slate-300 mb-6">{featuredLesson.summary}</p>

                {activeTab === 'teacher' && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20">
                      <h4 className="font-bold text-purple-300 uppercase tracking-wider text-xs mb-1">
                        Etapa 1: Warm-up & Ativação de Esquema (5 minutos)
                      </h4>
                      <p className="text-slate-300">{featuredLesson.teacher_version.warmup}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-purple-300 uppercase tracking-wider text-xs mb-1">
                        Etapa 3: Apresentação da Linguagem & Fórmula (15 minutos)
                      </h4>
                      <p className="text-slate-300">{featuredLesson.teacher_version.presentation}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs mb-1">
                        Dicas Profissionais CELTA / DELTA
                      </h4>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {featuredLesson.teacher_version.teaching_tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'student' && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-purple-300 uppercase tracking-wider text-xs mb-1">
                        Texto de Leitura & Discussão
                      </h4>
                      <p className="text-slate-300 italic">{featuredLesson.student_version.reading_text}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-purple-300 uppercase tracking-wider text-xs mb-1">
                        Exercícios Comunicativos de Fala (Speaking Prompts)
                      </h4>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {featuredLesson.student_version.speaking_prompts.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'flashcards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {featuredLesson.flashcards?.map((fc) => (
                      <div
                        key={fc.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/20 text-center"
                      >
                        <span className="text-xs font-mono text-purple-400">{fc.ipa}</span>
                        <h4 className="text-base font-bold text-white mt-1 mb-2">{fc.front}</h4>
                        <p className="text-xs text-slate-300">{fc.back}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Prévia do Exercício Interativo</span>
                    <p className="text-sm font-semibold text-white mt-1 mb-3">
                      {featuredLesson.quizzes?.[0]?.prompt}
                    </p>
                    <div className="space-y-2">
                      {featuredLesson.quizzes?.[0]?.options?.map((opt, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. BENEFÍCIOS PARA PROFESSORES */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
              FEITO EXCLUSIVAMENTE PARA EDUCADORES DE INGLÊS
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Tudo o que você precisa para dar aulas memoráveis em poucos minutos.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Economize +10 Horas Toda Semana</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nunca mais comece um planejamento do zero. Cada lição já inclui aquecimento, apresentação gramatical,
                exercícios controlados e dinâmicas de conversação livre.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mb-5 text-orange-400">
                <FileDown className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">PDFs A4 em 1 Clique (Prontos para Imprimir)</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Baixe materiais com formatação profissional A4, numeração de páginas e separação limpa entre
                a folha do aluno e o gabarito confidencial do professor.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Estúdio HTML & Assistente com IA</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Personalize qualquer lição ou use nosso Assistente de Inteligência Artificial integrado para gerar
                planos sob medida para os objetivos específicos de seus alunos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUADRO EUROPEU CEFR (A1 AO C2) */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              PADRÃO INTERNACIONAL CEFR
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Do Básico Iniciante (A1) à Fluência Completa (C2)
            </h3>
            <p className="text-sm text-slate-400 mt-3">
              Progressões pedagógicas testadas para que seus alunos adquiram vocabulário e falem com autonomia real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CEFR_LEVELS.map((lvl) => (
              <div
                key={lvl.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-extrabold px-3 py-1 rounded-full border ${lvl.color_badge}`}>
                      Nível {lvl.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{lvl.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{lvl.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-purple-400 font-semibold">Planos de Aula Prontos</span>
                  <span className="text-slate-400">PDFs Professor & Aluno</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEPARTAMENTOS ESPECIALIZADOS */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Card Business English */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 shadow-xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-6">
                <Briefcase className="w-3.5 h-3.5" />
                <span>DEPARTAMENTO BUSINESS ENGLISH</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Inglês Corporativo para Executivos & Profissionais
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Atenda alunos corporativos de alto valor com cenários reais: Negociações Estratégicas, Reuniões Ágeis,
                Apresentações Executivas, Entrevistas de Emprego, Redação de E-mails e Feedback.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  'Negociações Estratégicas',
                  'Apresentações Executivas',
                  'Entrevistas de Emprego',
                  'Vocabulário Corporativo',
                  'E-mails Formais',
                  'Reuniões Internacionais',
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl shadow-lg inline-flex items-center space-x-2 transition-all"
              >
                <span>Desbloquear Aulas de Business English</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Card English for Kids */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 shadow-xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-6">
                <Baby className="w-3.5 h-3.5" />
                <span>DEPARTAMENTO ENGLISH FOR KIDS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Fonética Lúdica, Jogos e Movimento (3 a 14 Anos)
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Encante os alunos mirins com Total Physical Response (TPR), rimas de animais, cartões de fonética ilustrados,
                fichas para colorir e histórias cativantes pensadas para cada faixa etária.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['3 a 5 Anos (TPR Inicial)', '6 a 8 Anos (Fonética & Sons)', '9 a 11 Anos (Vocabulário)', '12 a 14 Anos (Teens)'].map(
                  (tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
              <a
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-5 py-3 rounded-xl shadow-lg inline-flex items-center space-x-2 transition-all"
              >
                <span>Desbloquear Aulas para Crianças</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANO DE ASSINATURA KIWIFY (R$ 19,90) */}
      <section id="pricing" className="py-24 border-b border-slate-800 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            ASSINATURA MENSAL RECORRENTE
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Preço Transparente e Acessível.
          </h2>
          <p className="text-base text-slate-300 mb-12">
            Sem pegadinhas. Uma única assinatura mensal dá acesso completo a toda a plataforma.
          </p>

          <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-purple-500/60 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white font-black text-xs px-6 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              MAIS ESCOLHIDO
            </div>

            <div className="mb-6">
              <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                ACESSO TOTAL FLUENT IMMERSION PRO
              </span>
              <div className="flex items-baseline justify-center mt-3">
                <span className="text-2xl font-bold text-slate-400 mr-2">R$</span>
                <span className="text-6xl font-black text-white">19,90</span>
                <span className="text-slate-400 ml-2 text-base">/ mês</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Cobrança recorrente mensal segura via Kiwify. Cancele com 1 clique a qualquer momento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto mb-10 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Todos os níveis do CEFR (A1, A2, B1, B2, C1, C2)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Currículo Completo de Business English</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Aulas Lúdicas para Crianças (3 a 14 Anos)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Separação entre Ficha do Aluno e do Professor</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Downloads Ilimitados de PDFs A4</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Flashcards Interativos e Quizzes Autocorretivos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Estúdio HTML & Criador de Aulas com IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Novas Lições Liberadas Toda Semana</span>
              </div>
            </div>

            {/* Link Oficial Kiwify */}
            <a
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-80 mx-auto py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base tracking-wide shadow-xl shadow-orange-500/35 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Crown className="w-5 h-5 text-amber-200" />
              <span>ASSINAR NA KIWIFY — R$ 19,90/MÊS</span>
            </a>
            <p className="text-[11px] text-slate-500 mt-4">
              Pagamento 100% criptografado e seguro processado pela Kiwify.
            </p>
          </div>
        </div>
      </section>

      {/* 7. PERGUNTAS FREQUENTES (FAQ) */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">TIRA-DÚVIDAS</span>
            <h3 className="text-3xl font-black text-white mt-2">Perguntas Frequentes</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-purple-300"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. BANNER FINAL */}
      <section className="py-20 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ensine com Mais Inteligência. Ensine Melhor.
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Junte-se aos professores de inglês que economizam horas de planejamento e encantam seus alunos a cada aula.
          </p>
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-2xl shadow-orange-500/40 transform active:scale-95 transition-all inline-flex items-center space-x-2"
          >
            <Crown className="w-5 h-5 text-amber-200" />
            <span>DESBLOQUEAR O ACERVO COMPLETO — R$ 19,90/MÊS</span>
          </a>
        </div>
      </section>

      {/* 9. RODAPÉ INSTITUCIONAL */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">FLUENT IMMERSION</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Seu Hub Completo de Planejamento de Aulas & Recursos de Ensino de Inglês. Feito para professores particulares, escolas e educadores.
            </p>
            <p className="text-slate-500">Plano Oficial: R$ 19,90 / mês na Kiwify</p>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Currículo CEFR</h5>
            <ul className="space-y-2">
              <li>CEFR A1–A2 (Básico & Estrutural)</li>
              <li>CEFR B1–B2 (Intermediário & Fluência)</li>
              <li>CEFR C1–C2 (Avançado & Retórica)</li>
              <li>Departamento de Business English</li>
              <li>Inglês para Crianças (3 a 14 anos)</li>
              <li>Laboratório de Gramática & Pronúncia</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Recursos & Ferramentas</h5>
            <ul className="space-y-2">
              <li>Versões Separadas para Professor e Aluno</li>
              <li>Gerador de PDFs A4 de Alta Resolução</li>
              <li>Estúdio HTML & Construtor com IA</li>
              <li>Flashcards Interativos com Pronúncia</li>
              <li>Quizzes com Correção Automática</li>
              <li>Lançamentos Semanais de Conteúdo</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Legal & Pagamento</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-purple-400 transition-colors">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-purple-400 transition-colors">
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <a href={KIWIFY_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                  <span>Assinatura Mensal Kiwify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button 
                    onClick={onOpenAdmin} 
                    className="text-orange-400 hover:text-orange-300 font-bold transition-colors flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Centro de Comando Admin & Kiwify</span>
                  </button>
                </li>
              )}
              <li className="text-slate-500">Suporte: contato@fluentimmersion.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 FLUENT IMMERSION. Todos os direitos reservados. Ensine com mais inteligência. Ensine melhor.</p>
          <p className="mt-2 sm:mt-0">Em conformidade com a LGPD (Lei Geral de Proteção de Dados).</p>
        </div>
      </footer>
    </div>
  );
};
