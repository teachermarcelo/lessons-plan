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
  ListOrdered,
  Type,
  Presentation,
  Flame,
  Award,
  MousePointer2
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
  const [fontSizeScale, setFontSizeScale] = useState<number>(100); // 80%, 100%, 120%, 140%
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Classroom Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // default 3 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(180);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Audio Speech state
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer countdown effect
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

  // Keyboard navigation (ArrowRight, ArrowLeft, Space, F, ESC, T, N)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent key handling if typing in an input
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
      } else if (e.key.toLowerCase() === 'n') {
        setShowTeacherNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 'l') {
        setLaserActive((prev) => !prev);
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

  if (!isOpen) return null;

  // Build high-impact presentation slides
  const slides: SlideData[] = [
    // Slide 1: Welcome & Overview
    {
      id: 'slide-cover',
      category: 'WELCOME & OBJECTIVES',
      title: lesson.title,
      subtitle: `${lesson.cefr_level} • ${lesson.department} • ${lesson.duration_minutes} min`,
      teacherNote: `Dica CELTA: Estabeleça o contexto da aula imediatamente e alinhe as expectativas dos alunos. Apresente os objetivos em linguagem simples.`,
      content: (
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-200">
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-sm sm:text-base tracking-wider uppercase">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Nível {lesson.cefr_level} • {lesson.department}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {lesson.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-3xl leading-relaxed">
            {lesson.summary}
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-2">
                Foco da Aula
              </span>
              <p className="text-white font-bold text-base sm:text-lg">
                {lesson.language_focus || 'Fluência em conversação e estruturas essenciais'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
                O que você será capaz de fazer
              </span>
              <ul className="space-y-2 text-sm sm:text-base text-slate-200 font-medium">
                {lesson.learning_objectives.slice(0, 3).map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: Warm-up & Icebreaker
    {
      id: 'slide-warmup',
      category: 'STAGE 1: WARM-UP & ICEBREAKER',
      title: 'Warm-up & Quebra-Gelo',
      subtitle: '5 a 10 minutos • Ativação de conhecimento prévio',
      teacherNote: `Instrução: Projete a pergunta na tela, organize os alunos em duplas por 2 minutos para discutirem e peça que 2 voluntários compartilhem a resposta com a turma.`,
      content: (
        <div className="max-w-4xl mx-auto flex flex-col justify-center space-y-8 animate-in fade-in duration-200">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-950/40 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Flame className="w-32 h-32 text-purple-400" />
            </div>

            <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-4 border border-amber-500/30">
              ⚡ Pergunta para Iniciar a Conversa
            </span>

            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight">
              "{lesson.teacher_version.warmup}"
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Trabalho em Duplas: Compartilhe com seu colega ao lado</span>
              </div>

              <button
                onClick={() => speakText(lesson.teacher_version.warmup)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Pronúncia Nativa</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: Vocabulário Alvo (Target Vocabulary Cards)
    {
      id: 'slide-vocab',
      category: 'STAGE 2: TARGET VOCABULARY & PRONUNCIATION',
      title: 'Vocabulário Chave & Pronúncia Nativa',
      subtitle: 'Ouça o áudio, repita a pronúncia e observe os exemplos em contexto',
      teacherNote: `Dica de Pronúncia: Modele o som primeiro (chorus drill), depois aponte para alunos individuais. Verifique as sílabas tônicas no IPA.`,
      content: (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {lesson.vocabulary_list.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 shadow-xl transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 font-black text-sm flex items-center justify-center border border-purple-500/30">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">{item.term}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.ipa && (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                        {item.ipa}
                      </span>
                    )}
                    <button
                      onClick={() => speakText(item.term)}
                      className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-all shadow-md active:scale-95"
                      title="Ouvir termo"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  {item.definition}
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-purple-200 italic">
                  <span>"{item.example}"</span>
                  <button
                    onClick={() => speakText(item.example)}
                    className="text-slate-400 hover:text-purple-300 ml-2 shrink-0 p-1"
                    title="Ouvir exemplo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {lesson.vocabulary_list.length > 4 && (
            <div className="text-center text-xs text-slate-400">
              Mostrando os 4 termos essenciais para projeção em sala de aula.
            </div>
          )}
        </div>
      ),
    },

    // Slide 4: Laboratório de Gramática (Grammar Lab)
    {
      id: 'slide-grammar',
      category: 'STAGE 3: GRAMMAR LAB & PATTERNS',
      title: lesson.grammar_lab?.topic || 'Estrutura Gramatical Alvo',
      subtitle: 'Fórmulas prontas, padrões linguísticos e aplicação imediata',
      teacherNote: `Destaque a fórmula de aplicação no quadro. Chame atenção para a contração e posição dos verbos auxiliares.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 block">
              Regra Gramatical Explicada
            </span>

            <p className="text-lg sm:text-xl text-slate-100 font-medium leading-relaxed">
              {lesson.grammar_lab?.rule_explanation ||
                'Construa sentenças afirmativas, negativas e interrogativas mantendo a concordância e a naturalidade.'}
            </p>

            {lesson.grammar_lab?.formula && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
                    Fórmula de Aplicação
                  </span>
                  <div className="text-lg sm:text-2xl font-mono font-bold text-white tracking-wide">
                    {lesson.grammar_lab.formula}
                  </div>
                </div>
                <button
                  onClick={() => speakText(lesson.grammar_lab?.formula || '')}
                  className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Erros Típicos de Brasileiros */}
          {lesson.grammar_lab?.common_mistakes && lesson.grammar_lab.common_mistakes.length > 0 && (
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 shadow-xl space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <span>⚠️ Cuidado com Erros de Interferência do Português</span>
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
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
    },

    // Slide 5: Reading Passage (Texto de Leitura para Projeção)
    {
      id: 'slide-reading',
      category: 'STAGE 4: READING PASSAGE & COMPREHENSION',
      title: 'Texto de Leitura em Sala',
      subtitle: 'Projeção imersiva do texto com suporte a áudio completo',
      teacherNote: `Dica de Leitura: Peça que os alunos façam uma leitura rápida (skimming) por 1 minuto para captar a ideia geral. Depois dê o play no áudio para checagem de pronúncia.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-purple-400">
                <BookOpen className="w-4 h-4" />
                <span>Reading Passage</span>
              </div>

              <button
                onClick={() => speakText(lesson.student_version.reading_text)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Texto Completo</span>
              </button>
            </div>

            <div className="text-lg sm:text-xl md:text-2xl text-slate-100 font-serif leading-relaxed sm:leading-loose tracking-wide">
              {lesson.student_version.reading_text}
            </div>
          </div>
        </div>
      ),
    },

    // Slide 6: Speaking & Communicative Task (Conversação em Sala)
    {
      id: 'slide-speaking',
      category: 'STAGE 5: SPEAKING DRILLS & COMMUNICATIVE PAIRWORK',
      title: 'Conversação & Dinâmica em Duplas',
      subtitle: 'Use o cronômetro para controlar o tempo de fala de cada aluno',
      teacherNote: `Regra de Ouro CELTA: Monitore sem interromper para manter a fluência. Anote erros comuns discretamente para feedback geral ao final.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Perguntas de Discussão (Pairwork)</span>
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⏱️ Sugestão: 2 minutos por pergunta
              </span>
            </div>

            <div className="space-y-4">
              {lesson.student_version.speaking_prompts.map((prompt, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-start space-x-4 transition-all"
                >
                  <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    {i + 1}
                  </span>
                  <div className="flex-1 text-base sm:text-lg font-bold text-slate-100">
                    {prompt}
                  </div>
                  <button
                    onClick={() => speakText(prompt)}
                    className="text-slate-400 hover:text-purple-300 p-1"
                    title="Ouvir pergunta"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
                Missão Comunicativa (Role-Play)
              </span>
              <p className="text-sm sm:text-base text-slate-200 font-semibold">
                {lesson.teacher_version.communicative_practice}
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Fixação & Quiz em Grupo
    {
      id: 'slide-quiz',
      category: 'STAGE 6: WRAP-UP & CHECK FOR UNDERSTANDING',
      title: 'Checagem de Entendimento & Quiz',
      subtitle: 'Responda com a turma e consolide os aprendizados da aula',
      teacherNote: `Faça a pergunta para a turma inteira. Peça que levantem a mão ou usem cartões de resposta antes de revelar o gabarito.`,
      content: (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          {lesson.quizzes && lesson.quizzes.length > 0 ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Desafio Interativo em Sala</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                "{lesson.quizzes[0]?.prompt}"
              </h3>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {(lesson.quizzes[0]?.options || []).map((opt, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-base sm:text-lg font-bold text-slate-200 flex items-center space-x-3 cursor-pointer transition-all hover:bg-slate-900"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-purple-300 font-mono text-sm flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <Award className="w-16 h-16 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Parabéns pelo trabalho de hoje!</h3>
              <p className="text-slate-300 text-base max-w-lg mx-auto">
                {lesson.student_version.homework ||
                  'Pratique os novos termos e complete a ficha de exercícios em casa para a próxima aula.'}
              </p>
            </div>
          )}

          {/* Tarefa de Casa */}
          {lesson.student_version.homework && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
                  Tarefa de Casa (Homework)
                </span>
                <p className="text-sm sm:text-base text-slate-200 font-medium">
                  {lesson.student_version.homework}
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
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
          <div className="w-full h-full rounded-full bg-rose-500 shadow-[0_0_20px_6px_rgba(244,63,94,0.8)] animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-white" />
        </div>
      )}

      {/* TOP CONTROL BAR (Projetor Clean Header) */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0">
        {/* Informações do Slide & Unidade */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-black text-purple-400 uppercase tracking-widest px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30">
              MODO PROJEÇÃO
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 font-medium hidden sm:inline">
              {currentSlide.category}
            </span>
          </div>
        </div>

        {/* Ferramentas Rápidas de Sala de Aula */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Cronômetro de Atividades em Sala (Classroom Timer) */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-amber-400 animate-spin' : timerFinished ? 'text-rose-500 animate-bounce' : 'text-slate-400'}`} />
            <span className={`font-mono text-xs sm:text-sm font-black ${timerFinished ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              {formatTimer(timerSeconds)}
            </span>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white"
              title={isTimerRunning ? 'Pausar Cronômetro (T)' : 'Iniciar Cronômetro (T)'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={() => resetTimer(timerPreset)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Reiniciar Cronômetro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Presets de Tempo */}
            <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-slate-800 text-[10px] font-bold">
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

          {/* Laser Pointer Toggle */}
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
              laserActive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
            title="Apontador Laser Virtual (Tecla L)"
          >
            <MousePointer2 className="w-4 h-4" />
            <span className="hidden md:inline">Laser</span>
          </button>

          {/* Ajuste de Escala de Fonte (Tamanho de Letra na TV / Projetor) */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFontSizeScale(Math.max(80, fontSizeScale - 10))}
              className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Diminuir tamanho da fonte"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">{fontSizeScale}%</span>
            <button
              onClick={() => setFontSizeScale(Math.min(150, fontSizeScale + 10))}
              className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Aumentar tamanho da fonte para leitura distante"
            >
              A+
            </button>
          </div>

          {/* Notas do Professor Drawer Toggle */}
          <button
            onClick={() => setShowTeacherNotes(!showTeacherNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              showTeacherNotes
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
            title="Notas de Ensino Confidenciais do Professor (Tecla N)"
          >
            {showTeacherNotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">Notas Teacher</span>
          </button>

          {/* Tela Cheia Nativa */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
            title="Modo Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Fechar Modo Projeção */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Sair do Modo Projeção (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN PRESENTATION STAGE (Widescreen 16:9 Canvas) */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-6 sm:p-10 lg:p-14 relative">
        
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

        {/* Canvas do Conteúdo do Slide */}
        <div className="w-full max-w-6xl mx-auto py-4">
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
      {showTeacherNotes && currentSlide.teacherNote && (
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

      {/* BOTTOM SLIDE STRIP & CONTROLS (Canva / Keynote Style) */}
      <footer className="h-16 sm:h-18 px-4 sm:px-8 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between shrink-0">
        
        {/* Título do Slide Atual */}
        <div className="flex items-center space-x-3">
          <span className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
            {currentSlide.title}
          </span>
        </div>

        {/* Thumbnail Dots de Navegação */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
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
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">→</kbd> para navegar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
