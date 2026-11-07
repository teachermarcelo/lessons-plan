import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  HelpCircle, 
  FileDown, 
  Printer, 
  Copy, 
  Edit3, 
  Heart, 
  Clock, 
  Users, 
  Lock, 
  Check, 
  ExternalLink, 
  Crown,
  ArrowLeft
} from 'lucide-react';
import { Lesson } from '../types/fluent';
import { FlashcardPlayer } from './FlashcardPlayer';
import { QuizRunner } from './QuizRunner';
import { generateLessonPDF, PDFExportType } from '../lib/pdfGenerator';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onEditInStudio: (lesson: Lesson) => void;
  onDuplicateLesson: (lesson: Lesson) => void;
  isSubscribed: boolean;
  onOpenSubscribe: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  onClose,
  isFavorite,
  onToggleFavorite,
  onEditInStudio,
  onDuplicateLesson,
  isSubscribed,
  onOpenSubscribe,
}) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student' | 'vocab' | 'grammar' | 'flashcards' | 'quiz'>('teacher');
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownload = (type: PDFExportType) => {
    if (!isSubscribed) {
      onOpenSubscribe();
      return;
    }
    const doc = generateLessonPDF(lesson, type);
    const filename = `${lesson.slug}-${type.toLowerCase()}.pdf`;
    doc.save(filename);
    setPdfMenuOpen(false);
  };

  const handlePrint = () => {
    if (!isSubscribed) {
      onOpenSubscribe();
      return;
    }
    window.print();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Top Header Bar */}
        <div className="bg-slate-100 dark:bg-slate-950 px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-600/25 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
              Nível {lesson.cefr_level}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
              {lesson.department}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline-flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
              {lesson.duration_minutes} minutos
            </span>
          </div>

          {/* Botões de Ação Superior */}
          <div className="flex items-center space-x-2">
            {/* Favoritar */}
            <button
              onClick={() => onToggleFavorite(lesson.id)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
              title="Favoritar aula"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Duplicar */}
            <button
              onClick={() => onDuplicateLesson(lesson)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
              title="Criar uma cópia"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Menu de Download PDF */}
            <div className="relative">
              <button
                onClick={() => setPdfMenuOpen(!pdfMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/30"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Baixar PDF A4</span>
                <span className="text-[10px]">▼</span>
              </button>

              {pdfMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-2.5 z-50 text-xs text-left">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Exportação em PDF A4
                  </div>

                  {!isSubscribed && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-[11px] mb-2">
                      <Lock className="w-3.5 h-3.5 inline mr-1" />
                      Assine por R$ 19,90/mês na Kiwify para baixar.
                    </div>
                  )}

                  <button
                    onClick={() => handleDownload('TEACHER_VERSION')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Plano de Aula do Professor PDF</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">PRO</span>
                  </button>
                  <button
                    onClick={() => handleDownload('STUDENT_VERSION')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Ficha de Atividades do Aluno PDF</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">PRO</span>
                  </button>
                  <button
                    onClick={() => handleDownload('FLASHCARDS')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Cartões de Vocabulário para Recortar</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">PRO</span>
                  </button>
                  <button
                    onClick={() => handleDownload('ANSWER_KEY')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-between"
                  >
                    <span>Gabarito Confidencial dos Exercícios</span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">GABARITO</span>
                  </button>
                  <button
                    onClick={() => handleDownload('COMPLETE_PACK')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-1"
                  >
                    <span>Baixar Pacote Completo (All-In-One)</span>
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Imprimir */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* BOTÃO FECHAR PRINCIPAL (VISÍVEL E GRANDE) */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-500 dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-sm active:scale-95"
              title="Fechar aula e voltar à biblioteca (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>
        </div>

        {/* Banner para Visitantes */}
        {!isSubscribed && (
          <div className="bg-amber-100 dark:bg-amber-950/40 border-b border-amber-300 dark:border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 flex-wrap gap-2">
            <span className="flex items-center space-x-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Você está na <strong>Aula Gratuita Demonstrativa</strong>. Torne-se Teacher Membro para baixar PDFs e gabaritos.</span>
            </span>
            <a
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold flex items-center space-x-1 shadow-sm"
            >
              <Crown className="w-3 h-3 text-amber-100" />
              <span>Assinar na Kiwify (R$ 19,90)</span>
            </a>
          </div>
        )}

        {/* Abas de Navegação Interna com Cores Nítidas */}
        <div className="bg-slate-100 dark:bg-slate-950/70 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'teacher'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>VERSÃO DO PROFESSOR</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'student'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>FICHA DO ALUNO</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'vocab'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>VOCABULÁRIO & PRONÚNCIA</span>
          </button>

          {lesson.grammar_lab && (
            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                activeTab === 'grammar'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>LABORATÓRIO DE GRAMÁTICA</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>FLASHCARDS INTERATIVOS</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>QUIZ DE FIXAÇÃO</span>
          </button>
        </div>

        {/* Conteúdo Rolável da Lição com Alto Contraste */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
              {lesson.title}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {lesson.summary}
            </p>
          </div>

          {/* ABA 1: VERSÃO DO PROFESSOR */}
          {activeTab === 'teacher' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">
                  Objetivos Pedagógicos & Foco Linguístico
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1 mb-3 font-medium">
                  {lesson.learning_objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-700 dark:text-slate-400">
                  <strong className="text-purple-700 dark:text-purple-300">Foco Linguístico: </strong>
                  {lesson.language_focus}
                </p>
              </div>

              {/* Tabela de Minutagem */}
              {lesson.teacher_version.timing_breakdown && (
                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Sugestão de Minutagem por Etapa da Aula
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {lesson.teacher_version.timing_breakdown.map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-purple-600 dark:text-purple-400 font-bold block">{t.minutes} min</span>
                        <span className="text-slate-800 dark:text-slate-300">{t.stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapas Passo a Passo */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 1: Warm-up & Quebra-gelo (5 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.warmup}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 2: Contextualização / Lead-in (10 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.lead_in}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 3: Apresentação da Estrutura Linguística (15 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.presentation}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 4: Prática Controlada (10 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.controlled_practice}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 5: Prática Comunicativa Livre (15 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.communicative_practice}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Etapa 6: Encerramento & Correção em Grupo (5 minutos)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.teacher_version.wrap_up}</p>
                </div>
              </div>

              {/* Dicas e Gabaritos */}
              {lesson.teacher_version.answer_keys && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30">
                  <h4 className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-2">
                    Chaves de Respostas Confidenciais (Answer Keys)
                  </h4>
                  {isSubscribed ? (
                    <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                      {Object.entries(lesson.teacher_version.answer_keys).map(([task, ans]) => (
                        <div key={task} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-800">
                          <strong className="text-rose-600 dark:text-rose-400 uppercase">{task}: </strong>
                          <span>{ans}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-rose-800 dark:text-rose-300">
                      🔒 O gabarito confidencial é reservado para <strong>Teacher Membros</strong>. Assine para desbloquear.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ABA 2: FICHA DO ALUNO */}
          {activeTab === 'student' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 flex items-center justify-between text-xs text-purple-800 dark:text-purple-300 flex-wrap gap-2">
                <span>Folha do Aluno Limpa (Sem notas pedagógicas ou respostas expostas)</span>
                <button
                  onClick={() => handleDownload('STUDENT_VERSION')}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center space-x-1"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Baixar Ficha do Aluno em PDF</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
                  Texto de Leitura & Discussão
                </h4>
                <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-serif">
                  {lesson.student_version.reading_text}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
                  Atividades de Vocabulário & Colocações
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                  {lesson.student_version.vocab_activities}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
                  Exercícios de Gramática
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                  {lesson.student_version.grammar_exercises}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
                  Dinâmicas de Fala em Duplas (Speaking Prompts)
                </h4>
                <div className="space-y-3">
                  {lesson.student_version.speaking_prompts.map((prompt, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                      <span className="font-bold text-purple-600 dark:text-purple-400">Tarefa {i + 1}:</span>
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: VOCABULÁRIO & PRONÚNCIA */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.vocabulary_list.map((v, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{v.term}</h4>
                      {v.ipa && (
                        <span className="text-xs font-mono text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/30">
                          {v.ipa}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed font-medium">{v.definition}</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 italic mb-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      "{v.example}"
                    </p>
                    {v.translation_pt && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-800 dark:text-slate-300">Português: </strong>
                        {v.translation_pt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: GRAMÁTICA */}
          {activeTab === 'grammar' && lesson.grammar_lab && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                  Regra Gramatical & Explicação
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{lesson.grammar_lab.topic}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed mb-4">
                  {lesson.grammar_lab.rule_explanation}
                </p>

                {lesson.grammar_lab.formula && (
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-xs sm:text-sm font-mono text-purple-800 dark:text-purple-200">
                    <strong>Fórmula: </strong>
                    {lesson.grammar_lab.formula}
                  </div>
                )}
              </div>

              {lesson.grammar_lab.common_mistakes && lesson.grammar_lab.common_mistakes.length > 0 && (
                <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30">
                  <h4 className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-3">
                    Erros Comuns & Interferências do Português Brasileiro
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {lesson.grammar_lab.common_mistakes.map((m, i) => (
                      <li key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ABA 5: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div>
              <FlashcardPlayer cards={lesson.flashcards || []} lessonTitle={lesson.title} />
            </div>
          )}

          {/* ABA 6: QUIZ */}
          {activeTab === 'quiz' && (
            <div>
              <QuizRunner questions={lesson.quizzes || []} lessonTitle={lesson.title} />
            </div>
          )}
        </div>

        {/* Barra Inferior com Botão Fechar Garantido */}
        <div className="bg-slate-100 dark:bg-slate-950 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Dica: Pressione <strong>ESC</strong> ou clique fora do card para sair
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-200 dark:hover:bg-white dark:text-slate-900 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Biblioteca de Aulas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
