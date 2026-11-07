import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  FolderDown,
  FileDown,
  Printer,
  Copy,
  Check,
  Heart,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink,
  Lock,
  Crown,
  CheckCircle2,
  MessageSquare,
  Edit3,
  Presentation,
  Headphones,
  PenTool,
  Key,
  Clock,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { Lesson, UserProfile } from '../types/fluent';
import { FlashcardPlayer } from './FlashcardPlayer';
import { QuizRunner } from './QuizRunner';
import { InteractiveHtmlViewer } from './InteractiveHtmlViewer';
import { ClassroomProjectorModal } from './ClassroomProjectorModal';
import { generateLessonPDF, PDFExportType } from '../lib/pdfGenerator';
import { KIWIFY_CHECKOUT_URL, trackCheckoutLead } from '../lib/supabase';

interface TeacherLessonViewerPageProps {
  lesson: Lesson;
  currentUser: UserProfile | null;
  isFavorite: boolean;
  onToggleFavorite: (lessonId: string) => void;
  onBackToLibrary: () => void;
  onEditInStudio?: (lesson: Lesson) => void;
  onOpenSubscribe: () => void;
  isSubscribed: boolean;
}

type LessonStepId =
  | 'overview'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'interactive'
  | 'materials'
  | 'answer_key';

interface StepItem {
  id: LessonStepId;
  stepNumber: number;
  title: string;
  category: string;
  durationEst: string;
  icon: React.ReactNode;
}

export const TeacherLessonViewerPage: React.FC<TeacherLessonViewerPageProps> = ({
  lesson,
  currentUser,
  isFavorite,
  onToggleFavorite,
  onBackToLibrary,
  onEditInStudio,
  onOpenSubscribe,
  isSubscribed,
}) => {
  const [activeStep, setActiveStep] = useState<LessonStepId>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // default false: amplia a visão da aula com abas no topo
  const [topTabsCollapsed, setTopTabsCollapsed] = useState(false);

  // Audio / Speech Synthesis Player State (Estilo Ellii / 7ESL)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [audioTrack, setAudioTrack] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechActiveText, setSpeechActiveText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 7ESL / Ellii Curricular Steps definition (Dinâmico e 100% opcional)
  const allSteps: StepItem[] = [
    {
      id: 'overview',
      stepNumber: 1,
      title: 'Guia do Professor & Metodologia',
      category: 'Teacher Guide',
      durationEst: '10 min',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'vocabulary',
      stepNumber: 2,
      title: 'Vocabulário & Pronúncia',
      category: 'Vocabulary',
      durationEst: '12 min',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'grammar',
      stepNumber: 3,
      title: 'Laboratório de Gramática',
      category: 'Grammar',
      durationEst: '15 min',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'reading',
      stepNumber: 4,
      title: 'Texto de Leitura & Compreensão',
      category: 'Reading',
      durationEst: '10 min',
      icon: <FileDown className="w-4 h-4" />,
    },
    {
      id: 'listening',
      stepNumber: 5,
      title: 'Listening & Áudio Nativo',
      category: 'Listening',
      durationEst: '8 min',
      icon: <Headphones className="w-4 h-4" />,
    },
    {
      id: 'speaking',
      stepNumber: 6,
      title: 'Conversação & Role-Play',
      category: 'Speaking',
      durationEst: '15 min',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'writing',
      stepNumber: 7,
      title: 'Ficha do Aluno & Tarefa Escrita',
      category: 'Writing',
      durationEst: '10 min',
      icon: <PenTool className="w-4 h-4" />,
    },
    {
      id: 'interactive',
      stepNumber: 8,
      title: 'Aula Interativa & Sandbox HTML',
      category: 'Interactive',
      durationEst: 'Live',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'materials',
      stepNumber: 9,
      title: 'Google Drive, Slides & Vídeo',
      category: 'Resources',
      durationEst: 'Online',
      icon: <FolderDown className="w-4 h-4" />,
    },
    {
      id: 'answer_key',
      stepNumber: 10,
      title: 'Gabarito Oficial do Professor',
      category: 'Answer Key',
      durationEst: 'Confidencial',
      icon: <Key className="w-4 h-4" />,
    },
  ];

  // Filtra passos com base nas opções da aula e na presença real de conteúdo
  const steps: StepItem[] = allSteps.filter((step) => {
    const vm = lesson.visible_modules;
    if (step.id === 'interactive') {
      if (vm?.interactive_html === false) return false;
      return !!lesson.custom_html && lesson.custom_html.trim().length > 0;
    }
    if (step.id === 'materials') {
      if (vm?.materials === false) return false;
      return !!(lesson.slides_url || lesson.drive_url || lesson.youtube_url);
    }
    if (step.id === 'grammar') {
      if (vm?.grammar === false) return false;
      return !!lesson.grammar_lab?.topic || !!lesson.grammar_lab?.formula;
    }
    if (step.id === 'vocabulary' && vm?.vocabulary === false) return false;
    if (step.id === 'reading' && vm?.reading === false) return false;
    if (step.id === 'listening' && vm?.listening === false) return false;
    if (step.id === 'speaking' && vm?.speaking === false) return false;
    if (step.id === 'writing' && vm?.writing === false) return false;
    if (step.id === 'answer_key' && vm?.answer_key === false) return false;
    return true;
  }).map((s, index) => ({ ...s, stepNumber: index + 1 }));

  const currentStepIndex = Math.max(0, steps.findIndex((s) => s.id === activeStep));

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveStep(steps[currentStepIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(steps[currentStepIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPDF = (type: PDFExportType) => {
    if (!isSubscribed) {
      onOpenSubscribe();
      return;
    }
    const doc = generateLessonPDF(lesson, type);
    doc.save(`${lesson.slug}-${type.toLowerCase()}.pdf`);
    setPdfMenuOpen(false);
  };

  const handlePrint = () => {
    if (!isSubscribed) {
      onOpenSubscribe();
      return;
    }
    window.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Audio Playback via Web Speech Synthesis (Nativo e instantâneo)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio && speechActiveText === text) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setSpeechActiveText(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = audioSpeed;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setSpeechActiveText(text);
      setAudioProgress(10);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeechActiveText(null);
      setAudioProgress(100);
      setTimeout(() => setAudioProgress(0), 1000);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSpeechActiveText(null);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col antialiased transition-colors duration-200">
      {/* 1. TOP BREADCRUMB & CONTROL BAR (Estilo Ellii / 7ESL) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          
          {/* Navegação e Título */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToLibrary}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Voltar para a Biblioteca de Aulas"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>

            {/* Breadcrumb da Unidade */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                {lesson.cefr_level} English
              </span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs sm:max-w-md">
                {lesson.title}
              </span>
            </div>

            {/* Botão de Alternar Layout: Menu Lateral vs Abas no Topo */}
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center space-x-1 transition-all"
              title={sidebarVisible ? "Ocultar Menu Lateral (Expandir 100% da tela)" : "Exibir Menu Lateral com Lista de Passos"}
            >
              {sidebarVisible ? <span>👁️ Ocultar Menu</span> : <span>📋 Menu Lateral</span>}
            </button>
          </div>

          {/* Botões de Ação na Direita */}
          <div className="flex items-center space-x-2">
            {/* Copiar Link */}
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Copiar link direto para esta aula"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar link'}</span>
            </button>

            {/* Modo Apresentação / Projetar Aula em Sala */}
            <button
              onClick={() => setIsProjectorOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/30 active:scale-95"
              title="Abrir Modo Projeção de Sala de Aula (Slides 16:9, Cronômetro, Laser e Áudio Nativo)"
            >
              <Presentation className="w-3.5 h-3.5 text-purple-200" />
              <span>Projetar Aula</span>
            </button>

            {/* Exportar PDF Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPdfMenuOpen(!pdfMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Baixar PDF A4</span>
                <span className="text-[10px]">▼</span>
              </button>

              {pdfMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs text-left">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Exportação em PDF
                  </div>
                  {!isSubscribed && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] mb-2">
                      <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                      Assine por R$ 19,90 na Kiwify para baixar.
                    </div>
                  )}
                  <button
                    onClick={() => handleDownloadPDF('TEACHER_VERSION')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200"
                  >
                    Plano do Professor PDF
                  </button>
                  <button
                    onClick={() => handleDownloadPDF('STUDENT_VERSION')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200"
                  >
                    Ficha do Aluno PDF
                  </button>
                  <button
                    onClick={() => handleDownloadPDF('COMPLETE_PACK')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-600 text-purple-200 hover:text-white font-bold"
                  >
                    Pacote Completo A4 + Gabarito
                  </button>
                </div>
              )}
            </div>

            {/* Imprimir */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Imprimir Material"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Favoritar */}
            <button
              onClick={() => onToggleFavorite(lesson.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-all"
              title="Favoritar aula"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Editar no Estúdio (Admin) */}
            {currentUser?.role === 'ADMIN' && onEditInStudio && (
              <button
                onClick={() => onEditInStudio(lesson)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1"
                title="Editar no Estúdio HTML & IA"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Banner de Demonstração para Visitantes */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Você está navegando como <strong>Visitante</strong>. Assine por <strong>R$ 19,90/mês</strong> na Kiwify para ter acesso irrestrito a todos os PDFs, gabaritos e aulas A1-C2.
            </span>
          </div>
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCheckoutLead({
                source_page: `Visualizador Página Cheia • ${lesson.title}`,
                lesson_title: lesson.title,
                lead_name: currentUser?.full_name,
                lead_email: currentUser?.email,
              });
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>Desbloquear Acesso Completo (R$ 19,90)</span>
          </a>
        </div>
      )}

      {/* 2. MAIN TEACHING WORKSPACE (Layout Flexível: Abas no Topo ou Menu Lateral) */}
      <div className={`flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 flex ${sidebarVisible ? 'max-w-7xl flex-col lg:flex-row gap-6' : 'flex-col max-w-full'}`}>
        
        {/* TOP TABS STEPPER (Quando o menu lateral está recolhido, as abas ficam no topo sem ocupar a visão da aula!) */}
        {!sidebarVisible && (
          <div className="w-full mb-6">
            <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-3 backdrop-blur-md">
              
              {/* Pills dos Passos no Topo */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-1 scrollbar-none flex-1">
                {steps.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveStep(step.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-lg text-[10px] flex items-center justify-center font-mono font-black ${
                        isActive ? 'bg-white text-purple-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {step.stepNumber}
                      </span>
                      <span>{step.category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Ações Rápidas no Topo */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setIsProjectorOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                  title="Abrir Modo Projeção de Sala de Aula"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Projetar</span>
                </button>

                <button
                  onClick={() => setSidebarVisible(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1"
                  title="Exibir menu lateral completo"
                >
                  <span>📋 Menu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COLUNA ESQUERDA: Sidebar de Passos do Curso (Exibida somente se sidebarVisible === true) */}
        {sidebarVisible && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
              
              {/* Cabeçalho da Unidade com Botão Fechar Sidebar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {lesson.department}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {currentStepIndex + 1} de {steps.length}
                    </span>
                    <button
                      onClick={() => setSidebarVisible(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
                      title="Ocultar menu lateral e usar abas no topo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {lesson.title}
                </h2>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Lista Vertical de Passos (7ESL / Ellii Architecture) */}
              <nav className="space-y-1.5 pt-2">
                {steps.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveStep(step.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-6 h-6 rounded-xl flex items-center justify-center text-[11px] font-mono font-black ${
                            isActive
                              ? 'bg-white text-purple-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <div>
                          <div className="font-extrabold leading-tight">{step.title}</div>
                          <div className={`text-[10px] font-medium ${isActive ? 'text-purple-200' : 'text-slate-500'}`}>
                            {step.category} • {step.durationEst}
                          </div>
                        </div>
                      </div>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Card de Recursos Complementares Rápidos */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Materiais Prontos</span>
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setIsProjectorOpen(true)}
                  className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between font-bold transition-all text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Presentation className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Projetar em Sala (TV / Zoom)</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>

                <a
                  href={lesson.slides_url || 'https://docs.google.com/presentation'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <Presentation className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>Google Slides</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </a>

                <a
                  href={lesson.drive_url || 'https://drive.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <FolderDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Google Drive (PDFs)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </a>
              </div>
            </div>
          </aside>
        )}

        {/* COLUNA DIREITA OU CANVAS EXPANDIDO 100%: Teaching Canvas */}
        <main className={`flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-8 min-h-[750px] ${!sidebarVisible ? 'w-full' : ''}`}>
          
          {/* PASSO 1: GUIA DO PROFESSOR (TEACHER GUIDE) */}
          {activeStep === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-800 pb-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-3">
                  <GraduationCap className="w-4 h-4" />
                  <span>Passo 1 de 10 • Metodologia Pedagógica CELTA / DELTA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {lesson.title}
                </h1>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              {/* Foco Linguístico & Objetivos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-purple-400">
                    Foco Linguístico Principal
                  </h3>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {lesson.language_focus && !lesson.language_focus.includes('useState')
                      ? lesson.language_focus
                      : 'Dominar estruturas comunicativas em contextos reais do dia a dia.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Duração & Nível CEFR
                  </h3>
                  <p className="text-sm font-semibold text-white">
                    {lesson.duration_minutes} minutos • Nível {lesson.cefr_level} ({lesson.difficulty})
                  </p>
                </div>
              </div>

              {/* Objetivos de Aprendizagem */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Objetivos Pedagógicos da Aula
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {lesson.learning_objectives.map((obj, i) => (
                    <li key={i} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Passo a Passo de Execução (Warm-up, Presentation, Practice) */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
                  Roteiro de Sala de Aula (Timing & Etapas)
                </h3>

                <div className="p-5 rounded-2xl bg-slate-900 border-l-4 border-l-purple-500 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Etapa 1: Warm-up & Quebra-Gelo (5 a 10 min)
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {lesson.teacher_version.warmup}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Etapa 2: Contextual Lead-in & Apresentação (15 min)
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {lesson.teacher_version.lead_in}
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed mt-2 pt-2 border-t border-slate-800">
                    {lesson.teacher_version.presentation}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Etapa 3: Prática Controlada & Produção Livre (20 min)
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {lesson.teacher_version.controlled_practice}
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed mt-2 pt-2 border-t border-slate-800">
                    {lesson.teacher_version.communicative_practice}
                  </p>
                </div>
              </div>

              {/* Dicas do Professor */}
              {lesson.teacher_version.teaching_tips && lesson.teacher_version.teaching_tips.length > 0 && (
                <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Dicas Metodológicas do Professor</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {lesson.teacher_version.teaching_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: VOCABULÁRIO & PRONÚNCIA (WORDS TO LEARN) */}
          {activeStep === 'vocabulary' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 2 de 10 • Words to Learn
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Vocabulário Chave & Fonética Nativa
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Clique no ícone de som 🔊 para ouvir a pronúncia em inglês nativo americano.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.vocabulary_list.map((vocab, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-white">{vocab.term}</h4>
                      <div className="flex items-center space-x-2">
                        {vocab.ipa && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/30">
                            {vocab.ipa}
                          </span>
                        )}
                        <button
                          onClick={() => speakText(vocab.term)}
                          className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-colors"
                          title="Ouvir pronúncia nativa"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {vocab.definition}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 italic flex items-center justify-between">
                      <span>"{vocab.example}"</span>
                      <button
                        onClick={() => speakText(vocab.example)}
                        className="text-slate-400 hover:text-purple-300 ml-2"
                        title="Ouvir frase de exemplo"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {vocab.translation_pt && (
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Tradução:</strong> {vocab.translation_pt}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Flashcards Interativos de Memorização */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Flashcards Interativos para Prática em Sala</span>
                </h3>
                <FlashcardPlayer cards={lesson.flashcards || []} lessonTitle={lesson.title} />
              </div>
            </div>
          )}

          {/* PASSO 3: LABORATÓRIO DE GRAMÁTICA (GRAMMAR LAB) */}
          {activeStep === 'grammar' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 3 de 10 • Grammar Lab
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {lesson.grammar_lab?.topic || 'Estrutura Gramatical Alvo'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Regras simplificadas, fórmulas prontas e erros comuns de interferência do português brasileiro.
                </p>
              </div>

              {/* Regra & Explicação */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Regra Gramatical & Explicação
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {lesson.grammar_lab?.rule_explanation || 'Utilize estruturas com verbos auxiliares e formas corretas para expressar intenção e tempo com precisão.'}
                </p>

                {lesson.grammar_lab?.formula && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs sm:text-sm font-mono text-purple-200 flex items-center justify-between">
                    <div>
                      <strong className="text-purple-400">Fórmula de Aplicação: </strong>
                      <span>{lesson.grammar_lab.formula}</span>
                    </div>
                    <button
                      onClick={() => speakText(lesson.grammar_lab?.formula || '')}
                      className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-white"
                      title="Ouvir fórmula"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Erros Típicos de Brasileiros */}
              {lesson.grammar_lab?.common_mistakes && lesson.grammar_lab.common_mistakes.length > 0 && (
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                    <span>⚠️ Erros Típicos de Falantes de Português (Interferência)</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {lesson.grammar_lab.common_mistakes.map((mistake, i) => (
                      <li key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PASSO 4: TEXTO DE LEITURA (READING & COMPREHENSION) */}
          {activeStep === 'reading' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Passo 4 de 10 • Reading & Comprehension
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Texto de Leitura para Sala de Aula
                  </h2>
                </div>
                <button
                  onClick={() => speakText(lesson.student_version.reading_text)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Parar Leitura' : 'Ouvir Texto Completo'}</span>
                </button>
              </div>

              {/* Canvas do Livro Didático de Leitura */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Reading Passage</span>
                </div>
                <div className="text-base sm:text-lg text-slate-100 font-serif leading-loose tracking-wide">
                  {lesson.student_version.reading_text}
                </div>
              </div>

              {/* Atividades de Vocabulário & Leitura */}
              {lesson.student_version.vocab_activities && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Exercício de Fixação do Texto
                  </h3>
                  <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {lesson.student_version.vocab_activities}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 5: LISTENING & ÁUDIO */}
          {activeStep === 'listening' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 5 de 10 • Listening & Pronunciation
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Treino Auditivo & Vídeo em Sala
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Projete o áudio ou vídeo para treinar compreensão nativa e entonação.
                </p>
              </div>

              {/* Player de YouTube Embutido se disponível */}
              {lesson.youtube_url && (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Headphones className="w-4 h-4 text-purple-400" />
                      <span>Vídeo / Áudio de Apoio</span>
                    </h3>
                    <a
                      href={lesson.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                    >
                      <span>Abrir no YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-black">
                    <iframe
                      src={
                        lesson.youtube_url.includes('embed')
                          ? lesson.youtube_url
                          : lesson.youtube_url.replace('watch?v=', 'embed/')
                      }
                      title="Vídeo de Listening"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Treino de Frases com Pronúncia */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Prática de Chunks e Frases Nativas</h3>
                <div className="space-y-3">
                  {lesson.vocabulary_list.slice(0, 4).map((v, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">"{v.example}"</div>
                        <div className="text-xs text-slate-400 mt-0.5">{v.term} • {v.ipa}</div>
                      </div>
                      <button
                        onClick={() => speakText(v.example)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs flex items-center space-x-1 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 6: CONVERSAÇÃO & ROLE-PLAY (SPEAKING) */}
          {activeStep === 'speaking' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 6 de 10 • Speaking & Communicative Task
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Atividades de Fala & Role-Play
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Dinâmicas em pares e grupos para que os alunos usem a linguagem espontaneamente.
                </p>
              </div>

              {/* Prompts de Fala */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Prompts de Discussão em Pares
                </h3>
                <div className="space-y-3">
                  {lesson.student_version.speaking_prompts.map((prompt, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulação em Duplas */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Dinâmica de Produção Livre (Communicative Practice)
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {lesson.teacher_version.communicative_practice}
                </p>
              </div>
            </div>
          )}

          {/* PASSO 7: FICHA DO ALUNO & WRITING */}
          {activeStep === 'writing' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 7 de 10 • Writing & Student Worksheet
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Exercícios Escritos & Tarefa de Casa
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Exercícios de Gramática para Preenchimento
                </h3>
                <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                  {lesson.student_version.grammar_exercises}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Homework (Tarefa de Casa)
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {lesson.student_version.homework}
                </p>
              </div>
            </div>
          )}

          {/* PASSO 8: AULA INTERATIVA & SANDBOX HTML UNIVERSAL */}
          {activeStep === 'interactive' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Passo 8 de 10 • Interactive Sandbox
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Visualizador Interativo & Execução em Sandbox
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Executa qualquer código HTML, CSS ou JavaScript sem quebrar ou vazar estilos para a plataforma.
                  </p>
                </div>

                {currentUser?.role === 'ADMIN' && onEditInStudio && (
                  <button
                    onClick={() => onEditInStudio(lesson)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Código</span>
                  </button>
                )}
              </div>

              <InteractiveHtmlViewer
                htmlCode={
                  lesson.custom_html ||
                  `<div style="font-family: system-ui, sans-serif; background: #0f172a; color: white; padding: 30px; border-radius: 16px; text-align: center;"><h2>${lesson.title}</h2><p style="color:#94a3b8;">${lesson.summary}</p><div style="margin-top:20px; padding:16px; background:#1e293b; border-radius:12px; text-align:left;"><strong>Foco:</strong> ${lesson.language_focus}</div></div>`
                }
                title={`Aula Interativa: ${lesson.title}`}
                heightClass="h-[620px]"
              />
            </div>
          )}

          {/* PASSO 9: GOOGLE DRIVE, SLIDES & RECURSOS EXTERNOS */}
          {activeStep === 'materials' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Passo 9 de 10 • Resources & External Hub
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Materiais em Nuvem, Apresentações e PDFs
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Drive */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <FolderDown className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Google Drive</h4>
                      <p className="text-xs text-slate-400">Pastas de PDFs e materiais de apoio</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Acesse todos os anexos, arquivos editáveis e worksheets diretamente na nuvem.
                  </p>
                  <a
                    href={lesson.drive_url || 'https://drive.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <span>Abrir Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Google Slides */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                      <Presentation className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Google Slides</h4>
                      <p className="text-xs text-slate-400">Apresentação para projetor ou Zoom</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Slides formatados e prontos para apresentação direta na aula com seus alunos.
                  </p>
                  <a
                    href={lesson.slides_url || 'https://docs.google.com/presentation'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <span>Abrir Slides</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 10: GABARITO OFICIAL (ANSWER KEY) */}
          {activeStep === 'answer_key' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Passo 10 de 10 • Teacher Answer Key
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Gabarito Confidencial do Professor
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Respostas prontas para correção instantânea em sala.
                </p>
              </div>

              {!isSubscribed ? (
                <div className="p-8 rounded-3xl bg-amber-950/40 border border-amber-500/30 text-center space-y-3">
                  <Lock className="w-8 h-8 text-amber-400 mx-auto" />
                  <h3 className="font-bold text-white text-base">Gabarito Restrito a Assinantes</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Os gabaritos completos das fichas e testes são exclusivos para Teacher Membros assinantes na Kiwify.
                  </p>
                  <button
                    onClick={onOpenSubscribe}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs"
                  >
                    Assinar Agora (R$ 19,90)
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    Gabarito das Questões & Modelos de Resposta
                  </h3>
                  <div className="space-y-3">
                    {lesson.teacher_version.answer_keys ? (
                      Object.entries(lesson.teacher_version.answer_keys).map(([task, ans], i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <span className="font-bold text-purple-400 uppercase block mb-1">{task}:</span>
                          <span className="text-slate-200">{ans}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">
                        Gabarito disponível para consulta do professor durante a aula.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 3. BOTTOM AUDIO & STEP NAVIGATION PLAYER (Estilo Ellii / ESL Library) */}
      <footer className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          
          {/* Player de Áudio Nativo (Ellii Audio Bar) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  stopAudio();
                } else {
                  speakText(
                    activeStep === 'reading'
                      ? lesson.student_version.reading_text
                      : activeStep === 'vocabulary'
                      ? lesson.vocabulary_list.map((v) => `${v.term}: ${v.definition}`).join('. ')
                      : lesson.title + '. ' + lesson.summary
                  );
                }
              }}
              className="p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
              title={isPlayingAudio ? 'Pausar áudio' : 'Ouvir áudio deste passo'}
            >
              {isPlayingAudio ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Áudio Nativo: Track {audioTrack} de 2</span>
                {isPlayingAudio && <span className="text-[10px] text-amber-500 font-bold animate-pulse">● Reproduzindo</span>}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {speechActiveText ? 'Narrando conteúdo em inglês americano...' : 'Clique para ouvir a pronúncia e listening'}
              </div>
            </div>

            {/* Seletor de Velocidade */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAudioSpeed(speed)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    audioSpeed === speed ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Navegador de Passos (Step Navigation: 1 of 10) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-1 text-xs font-bold transition-all ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white cursor-pointer active:scale-95'
              }`}
              title="Passo Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {currentStepIndex + 1} de {steps.length}
            </span>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === steps.length - 1}
              className={`px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1 transition-all active:scale-95 shadow-md shadow-amber-500/25 ${
                currentStepIndex === steps.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              title="Próximo Passo"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
      {/* 4. MODAL / DECK DE PROJEÇÃO DE SALA DE AULA EM TELA CHEIA */}
      <ClassroomProjectorModal
        lesson={lesson}
        isOpen={isProjectorOpen}
        onClose={() => setIsProjectorOpen(false)}
      />
    </div>
  );
};
