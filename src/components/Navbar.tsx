import React from 'react';
import { 
  Sparkles, 
  Crown, 
  BookOpen, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  CreditCard,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types/fluent';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onOpenSubscribe: () => void;
  onLogout: () => void;
  onSwitchUser: (role: 'ADMIN' | 'TEACHER_MEMBER' | 'TRIAL') => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSubscribe,
  onLogout,
  onSwitchUser,
  notifications,
  onOpenNotifications,
  isDarkMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const isSubscribed = currentUser?.subscription_status === 'active' || currentUser?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              FLUENT IMMERSION
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
              Plataforma para Professores de Inglês
            </span>
          </div>
        </div>

        {/* Center Navigation Links (Português) */}
        <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2 text-sm font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentView === 'landing'
                ? 'bg-purple-100 dark:bg-purple-600/25 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-500/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Início
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentView === 'dashboard'
                ? 'bg-purple-100 dark:bg-purple-600/25 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-500/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Biblioteca de Aulas</span>
          </button>

          <button
            onClick={() => onNavigate('pricing')}
            className="px-3 py-1.5 rounded-xl transition-all text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center space-x-1.5"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Assinatura (R$ 19,90)</span>
          </button>

          {/* Painel do Admin */}
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 font-bold text-xs sm:text-sm ${
              currentView === 'admin'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:text-white hover:bg-orange-500 border border-orange-200 dark:border-orange-500/30'
            }`}
            title="Centro de Comando Admin & Kiwify"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Painel Admin</span>
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Seletor Rápido de Perfil para Teste (Admin, Teacher Membro, Visitante) */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500/50 transition-all"
              title="Alternar entre Visitante, Teacher Membro ou Administrador"
            >
              <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>
                {currentUser?.role === 'ADMIN'
                  ? 'Admin'
                  : currentUser?.subscription_status === 'active'
                  ? 'Teacher Membro'
                  : 'Visitante (Demo)'}
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 ml-0.5">▼</span>
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-2.5 z-50 text-xs">
                <div className="px-2.5 py-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Simular Perfil no Sistema
                </div>

                <button
                  onClick={() => {
                    onSwitchUser('TEACHER_MEMBER');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center space-x-2.5"
                >
                  <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-bold text-purple-600 dark:text-purple-300">Teacher Membro (Pós-compra)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Acesso total às aulas e materiais</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('TRIAL');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center space-x-2.5"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-bold text-amber-600 dark:text-amber-300">Visitante (Ver Aula Gratuita)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">1 aula livre; demais pedem assinatura</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('ADMIN');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center space-x-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="font-bold text-orange-600 dark:text-orange-300">Administrador Master</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Estúdio HTML & IA e Gestão Kiwify</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notificações */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Avisos e Lançamentos"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Alternador de Tema Escuro / Claro */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* CTA Principal de Assinatura via Kiwify */}
          {currentUser?.role === 'ADMIN' ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN GESTOR</span>
            </div>
          ) : !isSubscribed ? (
            <a
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-orange-500/25 flex items-center space-x-1.5 transition-all transform active:scale-95 animate-pulse"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>ASSINAR — R$ 19,90/MÊS</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          ) : (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Crown className="w-3.5 h-3.5" />
              <span>MEMBRO PRO</span>
            </div>
          )}

          {/* Menu do Usuário */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full border border-slate-300 dark:border-slate-700 hover:border-purple-500 transition-all"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 text-sm">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center space-x-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                        {currentUser.role === 'ADMIN' ? 'ADMIN' : 'TEACHER'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSubscribed 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isSubscribed ? 'ATIVO (PRO)' : 'VISITANTE'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs flex items-center space-x-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Minhas Aulas & Coleções</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenSubscribe();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs flex items-center space-x-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                      <span>Detalhes da Assinatura Kiwify</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Painel do Administrador & Kiwify</span>
                    </button>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              Entrar
            </button>
          )}

          {/* Menu Celular */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Início / Apresentação
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Biblioteca de Planos de Aula</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold hover:bg-orange-100 dark:hover:bg-orange-500/30 flex items-center space-x-2 border border-orange-200 dark:border-orange-500/30"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Painel do Administrador & Kiwify</span>
          </button>
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center mt-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-3 rounded-xl shadow-lg"
          >
            ASSINAR NA KIWIFY — R$ 19,90/MÊS →
          </a>
        </div>
      )}
    </header>
  );
};
