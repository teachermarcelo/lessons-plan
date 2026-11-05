import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Crown, 
  Briefcase, 
  Baby, 
  Layers, 
  Heart, 
  FileDown, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  Clock, 
  TrendingUp,
  FolderPlus,
  HelpCircle,
  Plus,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';
import { Lesson, UserProfile, CEFRLevelId, DepartmentType, Collection } from '../types/fluent';
import { LessonCard } from './LessonCard';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface DashboardViewProps {
  currentUser: UserProfile;
  lessons: Lesson[];
  favorites: string[];
  collections: Collection[];
  onToggleFavorite: (id: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onQuickDownloadPDF: (lesson: Lesson) => void;
  onOpenStudio: (lesson?: Lesson) => void;
  onOpenSubscribe: () => void;
  onOpenAdmin: () => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  lessons,
  favorites,
  collections,
  onToggleFavorite,
  onOpenLesson,
  onQuickDownloadPDF,
  onOpenStudio,
  onOpenSubscribe,
  onOpenAdmin,
  onOpenLegal,
}) => {
  const [activeSidebar, setActiveSidebar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'level'>('newest');

  const isSubscribed = currentUser.subscription_status === 'active' || currentUser.role === 'ADMIN';

  // Filter lessons based on search, department, level, and sidebar tab
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Sidebar filter
      if (activeSidebar === 'favorites') {
        if (!favorites.includes(lesson.id)) return false;
      } else if (activeSidebar === 'business') {
        if (lesson.department !== 'Business English') return false;
      } else if (activeSidebar === 'kids') {
        if (lesson.department !== 'English for Kids') return false;
      } else if (activeSidebar === 'grammar') {
        if (lesson.department !== 'Grammar Lab' && lesson.category !== 'Grammar Lab') return false;
      } else if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(activeSidebar)) {
        if (lesson.cefr_level !== activeSidebar) return false;
      }

      // Department dropdown
      if (selectedDept !== 'ALL' && lesson.department !== selectedDept) {
        return false;
      }

      // CEFR level dropdown
      if (selectedCefr !== 'ALL' && lesson.cefr_level !== selectedCefr) {
        return false;
      }

      // Search query (title, summary, tags, grammar, vocabulary)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = lesson.title.toLowerCase().includes(q);
        const matchSummary = lesson.summary.toLowerCase().includes(q);
        const matchGrammar = lesson.language_focus.toLowerCase().includes(q);
        const matchTags = lesson.tags.some((t) => t.toLowerCase().includes(q));
        const matchVocab = lesson.vocabulary_list.some((v) => v.term.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchGrammar && !matchTags && !matchVocab) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.download_count - a.download_count;
      if (sortBy === 'level') return a.cefr_level.localeCompare(b.cefr_level);
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  }, [lessons, activeSidebar, selectedDept, selectedCefr, searchQuery, sortBy, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* Card do Perfil do Usuário */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.full_name}
              className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentUser.full_name}</h4>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSubscribed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isSubscribed ? 'MEMBRO PRO' : 'VISITANTE'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {currentUser.role === 'ADMIN' ? 'Admin' : isSubscribed ? 'Ativo' : 'Exemplos'}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Principal de Navegação */}
          <nav className="space-y-1 text-xs font-medium">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Hub Pedagógico
            </div>

            <button
              onClick={() => setActiveSidebar('all')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${
                activeSidebar === 'all'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Todos os Planos ({lessons.length})</span>
            </button>

            <button
              onClick={() => setActiveSidebar('favorites')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${
                activeSidebar === 'favorites'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Meus Favoritos ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveSidebar('business')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${
                activeSidebar === 'business'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-violet-400" />
              <span>Business English</span>
            </button>

            <button
              onClick={() => setActiveSidebar('kids')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${
                activeSidebar === 'kids'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Baby className="w-4 h-4 text-amber-400" />
              <span>Inglês para Crianças (Kids)</span>
            </button>

            <button
              onClick={() => setActiveSidebar('grammar')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${
                activeSidebar === 'grammar'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Laboratório de Gramática</span>
            </button>

            {/* Filtros de Níveis CEFR */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Níveis do Quadro Europeu (CEFR)
            </div>

            <div className="grid grid-cols-3 gap-1.5 px-2">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveSidebar(lvl)}
                  className={`py-1.5 rounded-lg text-center font-bold text-xs transition-all border ${
                    activeSidebar === lvl
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Ferramentas de Criação */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ferramentas do Professor
            </div>

            <button
              onClick={() => onOpenStudio()}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-purple-300 bg-purple-950/30 border border-purple-500/20 hover:bg-purple-900/40 transition-all font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Estúdio HTML & IA</span>
              </div>
              <Plus className="w-3.5 h-3.5" />
            </button>

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={onOpenAdmin}
                className="w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 text-orange-300 bg-orange-950/30 border border-orange-500/20 hover:bg-orange-900/40 transition-all font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Painel do Administrador</span>
              </button>
            )}
          </nav>
        </div>

        {/* Rodapé da Barra Lateral */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Assinatura Mensal</span>
              <span className="text-xs font-bold text-white">R$ 19,90/mês</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              {isSubscribed ? 'Acesso Pro ativo na Kiwify.' : 'Você está no modo Visitante.'}
            </p>
            {!isSubscribed ? (
              <a
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20"
              >
                <Crown className="w-3.5 h-3.5 text-amber-200" />
                <span>Assinar na Kiwify</span>
              </a>
            ) : (
              <button
                onClick={onOpenSubscribe}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <CreditCard className="w-3 h-3 text-emerald-400" />
                <span>Gerenciar Assinatura</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL DO DASHBOARD */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Banner para Visitantes */}
        {!isSubscribed && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <span>Modo Visitante: Aulas de Exemplo Liberadas</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    PRÉVIA
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Você pode abrir as aulas para avaliar a metodologia. Para baixar os PDFs em A4 de alta resolução,
                  acessar o gabarito confidencial e usar o Estúdio com IA, torne-se um <strong>Teacher Membro</strong> por apenas R$ 19,90/mês.
                </p>
              </div>
            </div>

            <a
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-orange-500/25 flex-shrink-0 active:scale-95 transition-all"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>DESBLOQUEAR TUDO — R$ 19,90/MÊS</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        )}

        {/* Cabeçalho de Boas-Vindas & Cards de Métricas */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Olá, {currentUser.full_name.split(' ')[0]}!
              </h2>
              <p className="text-sm text-slate-400">
                Explore seus planos de aula do CEFR, Business English e Kids ou crie novas lições personalizadas.
              </p>
            </div>

            {/* Ação Rápida */}
            <button
              onClick={() => onOpenStudio()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Criar Nova Aula no Estúdio</span>
            </button>
          </div>

          {/* Barra de Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total de Planos
              </span>
              <span className="text-2xl font-black text-white">{lessons.length} Aulas</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Aulas Favoritas
              </span>
              <span className="text-2xl font-black text-rose-400">{favorites.length} Salvas</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Novos Lançamentos
              </span>
              <span className="text-2xl font-black text-purple-400">12 Este Mês</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Status da Assinatura
              </span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${isSubscribed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={`text-sm font-bold ${isSubscribed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSubscribed ? 'Teacher Membro (Ativo)' : 'Visitante'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Busca e Filtros Globais */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Input de Busca */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por tema da aula, gramática, vocabulário ou habilidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filtro de Departamento */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
            >
              <option value="ALL">Todos os Departamentos</option>
              <option value="CEFR">CEFR Padrão</option>
              <option value="Business English">Business English</option>
              <option value="English for Kids">Inglês para Crianças (Kids)</option>
              <option value="Grammar Lab">Laboratório de Gramática</option>
            </select>

            {/* Filtro de Nível CEFR */}
            <select
              value={selectedCefr}
              onChange={(e) => setSelectedCefr(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
            >
              <option value="ALL">Todos os Níveis</option>
              <option value="A1">A1 (Iniciante)</option>
              <option value="A2">A2 (Básico)</option>
              <option value="B1">B1 (Intermediário)</option>
              <option value="B2">B2 (Intermediário Superior)</option>
              <option value="C1">C1 (Avançado)</option>
              <option value="C2">C2 (Proficiência)</option>
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
            >
              <option value="newest">Ordenar: Mais Recentes</option>
              <option value="popular">Ordenar: Mais Baixadas</option>
              <option value="level">Ordenar: Nível do CEFR</option>
            </select>
          </div>
        </div>

        {/* Título da Grade de Aulas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-white">
              {activeSidebar === 'all'
                ? 'Todos os Planos de Aula'
                : activeSidebar === 'favorites'
                ? 'Aulas Favoritadas'
                : `Biblioteca Filtrada: ${activeSidebar}`}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-bold border border-slate-700">
              {filteredLessons.length} planos
            </span>
          </div>
        </div>

        {/* Grade de Lições */}
        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isFavorite={favorites.includes(lesson.id)}
                onToggleFavorite={onToggleFavorite}
                onOpenLesson={onOpenLesson}
                onQuickDownloadPDF={onQuickDownloadPDF}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Nenhuma aula encontrada para esses filtros</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Tente redefinir os filtros de busca ou crie uma lição personalizada usando o Estúdio com Inteligência Artificial.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCefr('ALL');
                setSelectedDept('ALL');
                setActiveSidebar('all');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
