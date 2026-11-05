import React from 'react';
import { Clock, Users, BookOpen, Heart, FileDown, Sparkles } from 'lucide-react';
import { Lesson, CEFRLevelId } from '../types/fluent';

interface LessonCardProps {
  lesson: Lesson;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onQuickDownloadPDF: (lesson: Lesson) => void;
}

const CEFR_BADGES: Record<CEFRLevelId, string> = {
  A1: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  A2: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  B1: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  B2: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  C1: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  C2: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isFavorite,
  onToggleFavorite,
  onOpenLesson,
  onQuickDownloadPDF,
}) => {
  return (
    <div className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 shadow-md hover:shadow-2xl hover:shadow-purple-950/25 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Banner Superior com Imagem & Selos */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={lesson.cover_image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'}
          alt={lesson.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Selos de Nível e Departamento */}
        <div className="absolute top-3.5 left-3.5 flex items-center space-x-1.5">
          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border backdrop-blur-md ${CEFR_BADGES[lesson.cefr_level]}`}>
            Nível {lesson.cefr_level}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/85 text-slate-200 border border-slate-700/80 backdrop-blur-md">
            {lesson.department}
          </span>
        </div>

        {/* Botão Favoritar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(lesson.id);
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-700/60 backdrop-blur-md transition-all active:scale-90"
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Metadados: Duração e Público */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-slate-300 font-semibold">
          <span className="flex items-center space-x-1 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{lesson.duration_minutes} min</span>
          </span>
          <span className="flex items-center space-x-1 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-slate-800">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{lesson.age_group}</span>
          </span>
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={() => onOpenLesson(lesson)}
            className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {lesson.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {lesson.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {lesson.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenLesson(lesson)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Abrir Aula</span>
          </button>

          <button
            onClick={() => onQuickDownloadPDF(lesson)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Baixar PDF A4"
          >
            <FileDown className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
