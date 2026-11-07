import React from 'react';
import { 
  X, 
  Crown, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  FileDown, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Play
} from 'lucide-react';
import { Lesson } from '../types/fluent';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface PaywallModalProps {
  lesson: Lesson;
  onClose: () => void;
  onOpenFreeSample: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  lesson,
  onClose,
  onOpenFreeSample,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-500/15 dark:bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone e Cabeçalho */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
              CONTEÚDO EXCLUSIVO PARA TEACHERS
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              Desbloqueie Esta Aula & Todos os Materiais
            </h3>
          </div>
        </div>

        {/* Card da Aula Bloqueada */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Nível {lesson.cefr_level}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {lesson.department} • {lesson.duration_minutes} min
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {lesson.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {lesson.summary}
          </p>
        </div>

        {/* O que o Teacher recebe */}
        <div className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <p className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
            O que você desbloqueia por R$ 19,90/mês:
          </p>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span><strong>Trilha Completa A1 ao C2:</strong> Mais de 120+ planos de aula prontos para sala</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span><strong>Materiais em PDF A4:</strong> Fichas do Aluno e Guias do Professor imprimíveis</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span><strong>Chaves de Respostas Confidenciais:</strong> Gabaritos completos para todas as tarefas</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span><strong>Recursos Interativos:</strong> Flashcards com pronúncia nativa e Quizzes com auto-correção</span>
          </div>
        </div>

        {/* Botão de Compra Kiwify */}
        <div className="space-y-3">
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm tracking-wide shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-2 active:scale-98 transition-all group"
          >
            <Crown className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>ASSINAR NA KIWIFY — R$ 19,90/MÊS</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenFreeSample();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Ver Aula Gratuita (A1 Greetings)</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-medium transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
