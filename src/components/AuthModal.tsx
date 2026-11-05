import React, { useState } from 'react';
import { Sparkles, X, Lock, Mail, User, Globe, ArrowRight, ShieldCheck, Crown } from 'lucide-react';
import { UserProfile } from '../types/fluent';
import { DEFAULT_ADMIN_USER, DEFAULT_TEACHER_USER, DEFAULT_TRIAL_USER } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [teachingContext, setTeachingContext] = useState('Professor(a) Particular');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      if (email.toLowerCase().includes('admin')) {
        onLoginSuccess({
          ...DEFAULT_ADMIN_USER,
          email,
          full_name: fullName || 'Administrador',
        });
      } else {
        onLoginSuccess({
          ...DEFAULT_TEACHER_USER,
          email,
          full_name: fullName || 'Juliana Mendes',
          country,
          teaching_context: teachingContext,
        });
      }
      onClose();
    } else if (mode === 'signup') {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        role: 'TEACHER_MEMBER',
        country,
        preferred_language: 'pt-BR',
        teaching_context: teachingContext,
        subscription_status: 'inactive', // Requer ativação/compra Kiwify
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };
      onLoginSuccess(newUser);
      onClose();
    } else {
      setFeedback('Enviamos um link seguro de recuperação para o seu e-mail.');
    }
  };

  const handleQuickDemo = (role: 'ADMIN' | 'TEACHER' | 'TRIAL') => {
    if (role === 'ADMIN') {
      onLoginSuccess(DEFAULT_ADMIN_USER);
    } else if (role === 'TEACHER') {
      onLoginSuccess(DEFAULT_TEACHER_USER);
    } else {
      onLoginSuccess(DEFAULT_TRIAL_USER);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-3 shadow-lg shadow-purple-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Acessar Conta de Professor' : mode === 'signup' ? 'Cadastrar Novo Educador' : 'Redefinir Senha'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Seu acervo de planos de aula e recursos pedagógicos em inglês
          </p>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 mb-4 text-center">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="text-slate-400 block mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prof. Maria Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 block mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professor@escola.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-slate-400 block mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Contexto</label>
                <select
                  value={teachingContext}
                  onChange={(e) => setTeachingContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none"
                >
                  <option value="Professor(a) Particular">Professor Particular</option>
                  <option value="Escola de Idiomas">Escola de Idiomas</option>
                  <option value="Coach Corporativo">Coach Corporativo</option>
                  <option value="Colégio Regular">Colégio Regular</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <span>{mode === 'login' ? 'Entrar no Painel' : mode === 'signup' ? 'Concluir Cadastro' : 'Enviar Link de Redefinição'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demonstrações Rápidas em 1 Clique */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">
            Acesso Imediato para Demonstração & Teste
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => handleQuickDemo('TEACHER')}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300 font-bold"
            >
              Teacher Membro
            </button>
            <button
              onClick={() => handleQuickDemo('TRIAL')}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-bold"
            >
              Visitante
            </button>
            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-orange-400 font-bold"
            >
              Administrador
            </button>
          </div>
        </div>

        {/* Alternância de Modo */}
        <div className="mt-4 text-center text-xs text-slate-400 space-x-3">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('signup')} className="hover:text-purple-300">
                Ainda não tem conta? Cadastre-se
              </button>
              <span>•</span>
              <button onClick={() => setMode('forgot')} className="hover:text-purple-300">
                Esqueceu a senha?
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="hover:text-purple-300">
              Já possui conta? Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
