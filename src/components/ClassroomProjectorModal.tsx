import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Award,
  MousePointer2,
  Check,
  Flame,
  Layers,
  ChevronDown,
  ChevronUp,
  Settings,
  Share2
} from 'lucide-react';
import { Lesson } from '../types/fluent';

interface ClassroomProjectorModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

interface SlideData {
  id: string;
  category: string;
  title: string;
  shortLabel: string;
  subtitle?: string;
  content: React.ReactNode;
  teacherNote?: string;
}

export const ClassroomProjectorModal: React.FC<ClassroomProjectorModalProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<number>(105); // 80% to 150%
  const [isStudentView, setIsStudentView] = useState(false); // Student view hides answers and teacher notes
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Top Bar Auto-hide State (Oculta as abas no topo sem ocupar a visão da aula!)
  const [isTopBarHovered, setIsTopBarHovered] = useState(false);
  const [isTopBarPinned, setIsTopBarPinned] = useState(false);

  // Classroom Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // default 3 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(180);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [showFloatingTimer, setShowFloatingTimer] = useState<boolean>(true);

  // Interactive Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  // Vocabulary Flashcard Reveal state
  const [revealedVocab, setRevealedVocab] = useState<Record<number, boolean>>({});

  // Audio Speech state
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Keyboard navigation (ArrowRight, ArrowLeft, Space, F, ESC, T, L, N, S)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 't') {
        setIsTimerRunning((prev) => !prev);
      } else if (e.key.toLowerCase() === 'l') {
        setLaserActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setShowTeacherNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 's') {
        setIsStudentView((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  // Laser pointer mouse follower
  const handleMouseMove = (e: React.MouseEvent) => {
    if (laserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
    // Se o mouse estiver nos 45px do topo, exibe a barra automaticamente
    if (e.clientY < 45) {
      setIsTopBarHovered(true);
    } else if (e.clientY > 90 && !isTopBarPinned) {
      setIsTopBarHovered(false);
    }
  };

  // Web Speech Synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = (sec: number) => {
    setTimerPreset(sec);
    setTimerSeconds(sec);
    setIsTimerRunning(false);
    setTimerFinished(false);
  };

  if (!isOpen) return null;

  // Build high-impact presentation slides dynamically (Tudo 100% Opcional)
  const vm = lesson.visible_modules;
  const rawSlides: SlideData[] = [];

  // Slide 1: Welcome & Goals (Guia / Início)
  if (vm?.teacher_guide !== false) {
    rawSlides.push({
      id: 'slide-cover',
      category: 'APRESENTAÇÃO DA AULA',
      shortLabel: 'Início',
      title: lesson.title,
      subtitle: `${lesson.cefr_level} • ${lesson.department} • ${lesson.duration_minutes} min`,
      teacherNote: `Dica de Acolhimento: Pergunte aos alunos como foi o dia deles em inglês e apresente o objetivo prático que eles alcançarão ao final da sessão.`,
      content: (
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-200 py-6">
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-purple-500/10">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Nível {lesson.cefr_level} • {lesson.department}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {lesson.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-2xl font-medium max-w-3xl leading-relaxed">
            {lesson.summary}
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 text-left">
            <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-2">
                Foco Principal
              </span>
              <p className="text-white font-bold text-lg sm:text-xl">
                {lesson.language_focus || 'Fluência em conversação e estruturas essenciais'}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
                Objetivos de Hoje
              </span>
              <ul className="space-y-2.5 text-base sm:text-lg text-slate-200 font-medium">
                {lesson.learning_objectives.slice(0, 3).map((obj, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide 2: Warm-up & Icebreaker
  if (vm?.warmup !== false && lesson.teacher_version?.warmup) {
    rawSlides.push({
      id: 'slide-warmup',
      category: 'WARM-UP & QUEBRA-GELO',
      shortLabel: 'Warm-up',
      title: 'Warm-up & Quebra-Gelo',
      subtitle: '5 a 10 minutos • Ativação de conhecimento prévio',
      teacherNote: `Instrução: Projete a pergunta na tela, organize os alunos em duplas por 2 minutos para discutirem e peça que 2 voluntários compartilhem a resposta com a turma.`,
      content: (
        <div className="max-w-4xl mx-auto flex flex-col justify-center space-y-8 animate-in fade-in duration-200 py-6">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-950/40 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Flame className="w-40 h-40 text-purple-400" />
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-6 border border-amber-500/30">
              ⚡ Pergunta para Iniciar a Conversa (Icebreaker)
            </span>

            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              "{lesson.teacher_version.warmup}"
            </div>

            <div className="mt-10 flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-sm sm:text-base text-slate-300">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span>Trabalho em Duplas: Converse com seu colega ao lado</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => resetTimer(120)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
                >
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span>Iniciar 2 Min</span>
                </button>

                <button
                  onClick={() => speakText(lesson.teacher_version.warmup)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir Pronúncia</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide 3: Vocabulário & Fonética Nativa (Interactive Flashcards)
  if (vm?.vocabulary !== false && lesson.vocabulary_list && lesson.vocabulary_list.length > 0) {
    rawSlides.push({
      id: 'slide-vocab',
      category: 'VOCABULÁRIO & PRONÚNCIA NATIVA',
      shortLabel: 'Vocabulário',
      title: 'Vocabulário Chave & Fonética',
      subtitle: 'Ouça o áudio, repita a pronúncia e observe os exemplos em contexto',
      teacherNote: `Dica de Fonética: Modele a pronúncia (chorus drill), depois aponte para alunos individuais. Clique no cartão para revelar a tradução.`,
      content: (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {lesson.vocabulary_list.slice(0, 4).map((item, idx) => {
              const isRevealed = revealedVocab[idx];
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 shadow-2xl transition-all space-y-4 group relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 font-black text-sm flex items-center justify-center border border-purple-500/30">
                        0{idx + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{item.term}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.ipa && (
                        <span className="font-mono text-xs px-3 py-1 rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                          {item.ipa}
                        </span>
                      )}
                      <button
                        onClick={() => speakText(item.term)}
                        className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-all shadow-md active:scale-95"
                        title="Ouvir termo nativo"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                    {item.definition}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-sm sm:text-base text-purple-200 italic">
                    <span>"{item.example}"</span>
                    <button
                      onClick={() => speakText(item.example)}
                      className="text-slate-400 hover:text-purple-300 ml-2 shrink-0 p-1"
                      title="Ouvir exemplo"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.translation_pt && (
                    <div className="pt-2 flex items-center justify-between text-xs">
                      {isRevealed ? (
                        <span className="text-emerald-400 font-bold">
                          Tradução: {item.translation_pt}
                        </span>
                      ) : (
                        <button
                          onClick={() => setRevealedVocab({ ...revealedVocab, [idx]: true })}
                          className="text-slate-500 hover:text-purple-400 underline font-semibold"
                        >
                          👁️ Revelar Tradução
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-400 pt-2">
            Pressione a tecla <strong>Espaço</strong> ou clique no botão de som para modelar a pronúncia com a turma.
          </div>
        </div>
      ),
    });
  }

  // Slide 4: Laboratório de Gramática & Fórmulas
  if (vm?.grammar !== false && (lesson.grammar_lab?.topic || lesson.grammar_lab?.rule_explanation || lesson.grammar_lab?.formula)) {
    rawSlides.push({
      id: 'slide-grammar',
      category: 'GRAMMAR LAB & FÓRMULAS',
      shortLabel: 'Gramática',
      title: lesson.grammar_lab?.topic || 'Estrutura Gramatical Alvo',
      subtitle: 'Fórmulas prontas, padrões linguísticos e aplicação imediata',
      teacherNote: `Destaque a fórmula de aplicação no quadro. Chame atenção para a contração e posição dos verbos auxiliares.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">
              Regra Gramatical Explicada
            </span>

            <p className="text-xl sm:text-2xl text-slate-100 font-medium leading-relaxed">
              {lesson.grammar_lab?.rule_explanation ||
                'Construa sentenças afirmativas, negativas e interrogativas mantendo a concordância e a naturalidade.'}
            </p>

            {lesson.grammar_lab?.formula && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
                    Fórmula de Aplicação
                  </span>
                  <div className="text-xl sm:text-3xl font-mono font-bold text-white tracking-wide">
                    {lesson.grammar_lab.formula}
                  </div>
                </div>
                <button
                  onClick={() => speakText(lesson.grammar_lab?.formula || '')}
                  className="p-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Erros Típicos de Brasileiros */}
          {lesson.grammar_lab?.common_mistakes && lesson.grammar_lab.common_mistakes.length > 0 && !isStudentView && (
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 shadow-xl space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <span>⚠️ Cuidado com Erros de Interferência do Português</span>
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-200">
                {lesson.grammar_lab.common_mistakes.map((mistake, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    });
  }

  // Slide 5: Reading Passage (Texto de Leitura para Projeção)
  if (vm?.reading !== false && lesson.student_version?.reading_text) {
    rawSlides.push({
      id: 'slide-reading',
      category: 'LEITURA & COMPREENSÃO',
      shortLabel: 'Leitura',
      title: 'Texto de Leitura em Sala',
      subtitle: 'Projeção imersiva do texto com suporte a áudio completo',
      teacherNote: `Dica de Leitura: Peça que os alunos façam uma leitura silenciosa por 1 minuto. Em seguida, acione a narração em áudio para checagem de entonação.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-purple-400">
                <BookOpen className="w-4 h-4" />
                <span>Reading Passage</span>
              </div>

              <button
                onClick={() => speakText(lesson.student_version.reading_text)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Texto Completo</span>
              </button>
            </div>

            <div className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-serif leading-relaxed sm:leading-loose tracking-wide">
              {lesson.student_version.reading_text}
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide 6: Speaking & Communicative Task (Conversação em Duplas)
  if (vm?.speaking !== false && lesson.student_version?.speaking_prompts && lesson.student_version.speaking_prompts.length > 0) {
    rawSlides.push({
      id: 'slide-speaking',
      category: 'CONVERSAÇÃO & ROLE-PLAY',
      shortLabel: 'Conversação',
      title: 'Conversação & Dinâmica em Duplas',
      subtitle: 'Use o cronômetro para controlar o tempo de fala de cada aluno',
      teacherNote: `Regra de Ouro CELTA: Monitore sem interromper para manter a fluência. Anote erros discretamente para feedback geral ao final.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Perguntas de Discussão (Pairwork)</span>
              </span>
              <button
                onClick={() => resetTimer(180)}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 hover:bg-amber-500/30"
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>⏱️ Cronometrar 3 minutos</span>
              </button>
            </div>

            <div className="space-y-4">
              {lesson.student_version.speaking_prompts.map((prompt, i) => (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-start space-x-4 transition-all"
                >
                  <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    {i + 1}
                  </span>
                  <div className="flex-1 text-lg sm:text-xl font-bold text-slate-100">
                    {prompt}
                  </div>
                  <button
                    onClick={() => speakText(prompt)}
                    className="text-slate-400 hover:text-purple-300 p-1"
                    title="Ouvir pergunta"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {lesson.teacher_version?.communicative_practice && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  Missão de Produção Oral (Role-Play)
                </span>
                <p className="text-base sm:text-lg text-slate-200 font-semibold">
                  {lesson.teacher_version.communicative_practice}
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    });
  }

  // Slide 7: Interactive HTML Sandbox Slide (Se disponível e ativado)
  if (vm?.interactive_html !== false && lesson.custom_html && lesson.custom_html.trim().length > 0) {
    rawSlides.push({
      id: 'slide-interactive',
      category: 'INTERATIVIDADE & SANDBOX HTML',
      shortLabel: 'Interatividade',
      title: 'Atividade Interativa em Sala',
      subtitle: 'Prática imersiva direta pelo projetor',
      teacherNote: 'Atividade interativa HTML: deixe os alunos interagirem ou guie o exercício.',
      content: (
        <div className="max-w-5xl mx-auto h-[65vh] w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-purple-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sandbox Interativo de Sala</span>
            </span>
            <span className="bg-emerald-950/80 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Safe Sandbox
            </span>
          </div>
          <div className="flex-1 w-full bg-white">
            <iframe
              srcDoc={lesson.custom_html}
              title="Interactive Lesson Activity"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>
        </div>
      ),
    });
  }

  // Slide 8: Fixação & Quiz Interativo de Sala
  if (vm?.quizzes !== false && lesson.quizzes && lesson.quizzes.length > 0) {
    rawSlides.push({
      id: 'slide-quiz',
      category: 'DESAFIO DE FIXAÇÃO & QUIZ',
      shortLabel: 'Quiz',
      title: 'Checagem de Entendimento & Quiz',
      subtitle: 'Clique na resposta correta para revelar e celebrar com a turma',
      teacherNote: `Faça a pergunta para a turma inteira. Peça que levantem a mão antes de você clicar na resposta correta.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Desafio Interativo em Sala</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              "{lesson.quizzes[0]?.prompt}"
            </h3>

            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {(lesson.quizzes[0]?.options || []).map((opt, i) => {
                const isSelected = selectedQuizAnswer === i;
                const isCorrect = opt === lesson.quizzes![0]?.correct_answer;
                const showResult = selectedQuizAnswer !== null;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedQuizAnswer(i)}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl border text-lg sm:text-xl font-bold flex items-center justify-between cursor-pointer transition-all ${
                      showResult && isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20'
                        : showResult && isSelected && !isCorrect
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`w-8 h-8 rounded-xl font-mono text-sm flex items-center justify-center font-bold ${
                        showResult && isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-purple-300'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showResult && isCorrect && (
                      <div className="flex items-center space-x-1 text-emerald-400 text-sm font-bold animate-in zoom-in">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span>Correto!</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedQuizAnswer !== null && lesson.quizzes[0]?.explanation && (
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-sm sm:text-base text-purple-200 animate-in fade-in">
                <strong className="text-purple-400">Explicação: </strong>
                <span>{lesson.quizzes[0].explanation}</span>
              </div>
            )}
          </div>
        </div>
      ),
    });
  }

  // Slide 9: Conclusão & Tarefa de Casa
  if (lesson.student_version?.homework || rawSlides.length < 2) {
    rawSlides.push({
      id: 'slide-wrapup',
      category: 'CONCLUSÃO & TAREFA',
      shortLabel: 'Conclusão',
      title: 'Encerramento da Aula',
      subtitle: 'Revisão dos pontos principais e tarefa de casa',
      teacherNote: 'Parabenize a turma pelo progresso e detalhe as instruções da tarefa para a próxima aula.',
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
            <Award className="w-20 h-20 text-amber-400 mx-auto" />
            <h3 className="text-3xl font-black text-white">Parabéns pelo trabalho de hoje!</h3>
            <p className="text-slate-300 text-lg max-w-lg mx-auto">
              {lesson.student_version.homework ||
                'Pratique os novos termos e complete a ficha de exercícios em casa para a próxima aula.'}
            </p>
          </div>

          {lesson.student_version.homework && (
            <div className="p-7 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
                  Tarefa de Casa (Homework)
                </span>
                <p className="text-base sm:text-lg text-slate-200 font-medium">
                  {lesson.student_version.homework}
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    });
  }

  // Numera dinamicamente as abas
  const slides: SlideData[] = (rawSlides.length > 0 ? rawSlides : [
    {
      id: 'slide-fallback',
      category: 'PLANO DE AULA',
      shortLabel: '1. Aula',
      title: lesson.title,
      subtitle: `${lesson.cefr_level} • ${lesson.department}`,
      content: (
        <div className="text-center p-12 text-slate-400">
          <p>{lesson.summary}</p>
        </div>
      )
    }
  ]).map((s, idx) => ({
    ...s,
    shortLabel: `${idx + 1}. ${s.shortLabel.replace(/^\d+\.\s*/, '')}`,
  }));

  const safeSlideIndex = Math.min(currentSlideIndex, Math.max(0, slides.length - 1));
  const currentSlide = slides[safeSlideIndex] || slides[0];

  const handleNextSlide = () => {
    if (safeSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(safeSlideIndex + 1);
      setSelectedQuizAnswer(null);
    }
  };

  const handlePrevSlide = () => {
    if (safeSlideIndex > 0) {
      setCurrentSlideIndex(safeSlideIndex - 1);
      setSelectedQuizAnswer(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 bg-slate-950 text-white flex flex-col select-none overflow-hidden ${
        laserActive ? 'cursor-none' : ''
      }`}
      style={{
        fontSize: `${fontSizeScale}%`,
      }}
    >
      {/* Laser Pointer Dot Follower */}
      {laserActive && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
          style={{
            left: laserPos.x - 12,
            top: laserPos.y - 12,
            width: 24,
            height: 24,
          }}
        >
          <div className="w-full h-full rounded-full bg-rose-500 shadow-[0_0_24px_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-white" />
        </div>
      )}

      {/* 
        TOP BAR OCULTA / DESLIZANTE (As abas ficam escondidas no topo sem ocupar visão da aula!)
        Aparece suavemente ao encostar o mouse no topo da tela ou quando fixada.
      */}
      <header
        onMouseEnter={() => setIsTopBarHovered(true)}
        onMouseLeave={() => !isTopBarPinned && setIsTopBarHovered(false)}
        className={`fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 shadow-2xl ${
          isTopBarHovered || isTopBarPinned ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          
          {/* Navegação Rápida entre Abas / Slides no Topo */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
            {slides.map((s, idx) => {
              const isActive = currentSlideIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setSelectedQuizAnswer(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1 transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>{s.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Controles de Apresentação à Direita */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Alternar Modo Aluno (Oculta Spoilers) */}
            <button
              onClick={() => setIsStudentView(!isStudentView)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                isStudentView
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title="Modo Aluno: Oculta gabaritos e notas de ensino (Tecla S)"
            >
              {isStudentView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isStudentView ? 'Visão Aluno' : 'Visão Teacher'}</span>
            </button>

            {/* Laser Pointer */}
            <button
              onClick={() => setLaserActive(!laserActive)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                laserActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title="Apontador Laser Virtual (Tecla L)"
            >
              <MousePointer2 className="w-4 h-4" />
            </button>

            {/* Ajuste de Escala da Fonte */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFontSizeScale(Math.max(80, fontSizeScale - 10))}
                className="px-2 py-0.5 rounded text-slate-400 hover:text-white"
                title="Diminuir tamanho do texto"
              >
                A-
              </button>
              <span className="text-[10px] font-mono text-slate-300 px-1">{fontSizeScale}%</span>
              <button
                onClick={() => setFontSizeScale(Math.min(150, fontSizeScale + 10))}
                className="px-2 py-0.5 rounded text-slate-400 hover:text-white"
                title="Aumentar tamanho do texto"
              >
                A+
              </button>
            </div>

            {/* Fixar Barra de Topo */}
            <button
              onClick={() => setIsTopBarPinned(!isTopBarPinned)}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                isTopBarPinned
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
              title={isTopBarPinned ? 'Desafixar barra de abas' : 'Fixar barra de abas no topo'}
            >
              {isTopBarPinned ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Tela Cheia Nativa */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              title="Modo Tela Cheia (Tecla F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Fechar Projeção */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Sair do Modo Projeção (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* DISCREET TOP TRIGGER PILL (Visível quando o header está recolhido) */}
      {!isTopBarHovered && !isTopBarPinned && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-30 opacity-70 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsTopBarPinned(true)}
            onMouseEnter={() => setIsTopBarHovered(true)}
            className="px-4 py-1 rounded-full bg-slate-900/90 hover:bg-purple-600 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-800 backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>{currentSlide.shortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 
        CRONÔMETRO FLUTUANTE DE SALA DE AULA (Classroom Timer)
        Compacto, posicionável e com alerta sonoro/visual
      */}
      {showFloatingTimer && (
        <div className="fixed top-4 right-4 z-30 flex items-center space-x-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl animate-in fade-in">
          <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-amber-400 animate-spin' : timerFinished ? 'text-rose-500 animate-bounce' : 'text-slate-400'}`} />
          <span className={`font-mono text-xs sm:text-sm font-black ${timerFinished ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
            {formatTimer(timerSeconds)}
          </span>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white"
            title={isTimerRunning ? 'Pausar (T)' : 'Iniciar (T)'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            onClick={() => resetTimer(timerPreset)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-1 pl-1 border-l border-slate-800 text-[10px] font-bold">
            {[60, 180, 300].map((s) => (
              <button
                key={s}
                onClick={() => resetTimer(s)}
                className={`px-1.5 py-0.5 rounded ${timerPreset === s ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                {s / 60}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 
        MAIN PRESENTATION STAGE (Widescreen 16:9 Cinema Canvas)
        Ocupa 100% da tela sem nenhuma barra roubando visão da aula
      */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        
        {/* Botão Anterior no palco */}
        <button
          onClick={handlePrevSlide}
          disabled={currentSlideIndex === 0}
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-2xl bg-slate-900/80 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md transition-all shadow-2xl active:scale-95 z-20 ${
            currentSlideIndex === 0 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
          }`}
          title="Slide Anterior (Seta Esquerda)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Canvas Central do Conteúdo */}
        <div className="w-full max-w-6xl mx-auto py-2">
          {currentSlide.content}
        </div>

        {/* Botão Próximo no palco */}
        <button
          onClick={handleNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-2xl bg-slate-900/80 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md transition-all shadow-2xl active:scale-95 z-20 ${
            currentSlideIndex === slides.length - 1 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
          }`}
          title="Próximo Slide (Seta Direita / Barra de Espaço)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </main>

      {/* TEACHER CONFIDENTIAL NOTES SLIDING DRAWER */}
      {showTeacherNotes && currentSlide.teacherNote && !isStudentView && (
        <div className="bg-indigo-950/95 border-t border-indigo-500/40 p-4 sm:p-5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 shrink-0">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 block">
                  Notas de Sala do Professor (Confidencial • Não visível aos alunos)
                </span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed mt-1">
                  {currentSlide.teacherNote}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTeacherNotes(false)}
              className="p-1 rounded-lg hover:bg-indigo-900 text-indigo-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MINIMAL BOTTOM NAVIGATION DOCK */}
      <footer className="h-14 sm:h-16 px-4 sm:px-8 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
            {currentSlide.title}
          </span>
        </div>

        {/* Dots de Navegação */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setSelectedQuizAnswer(null);
              }}
              className={`h-2.5 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'w-8 sm:w-10 bg-purple-500 shadow-md shadow-purple-500/50'
                  : 'w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Ir para: ${s.title}`}
            />
          ))}
        </div>

        {/* Contador e Atalhos */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-slate-400">
            {currentSlideIndex + 1} / {slides.length}
          </span>

          <div className="hidden lg:flex items-center space-x-2 text-[10px] text-slate-500">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">→</kbd> ou Espaço</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
