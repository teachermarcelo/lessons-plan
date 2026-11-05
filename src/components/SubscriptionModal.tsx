import React, { useState } from 'react';
import { Crown, CheckCircle2, ShieldCheck, X, ArrowRight, RefreshCw, CreditCard, ExternalLink, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/fluent';
import { KIWIFY_CHECKOUT_URL } from '../lib/supabase';

interface SubscriptionModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onActivateSuccess: (subscriptionId: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  currentUser,
  onClose,
  onActivateSuccess,
}) => {
  const [payerEmail, setPayerEmail] = useState(currentUser?.email || '');

  const handleSimulateSandboxConfirmation = () => {
    const fakeSubId = `sub-kiwify-${Math.floor(100000 + Math.random() * 900000)}`;
    onActivateSuccess(fakeSubId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3 shadow-lg shadow-orange-500/20">
            <Crown className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
            ASSINATURA MENSAL KIWIFY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Torne-se Teacher Membro</h2>
          <div className="flex items-baseline justify-center mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">R$</span>
            <span className="text-4xl font-black text-white">19,90</span>
            <span className="text-slate-400 ml-1 text-xs">/ mês</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cobrança mensal automática na Kiwify. Cancele com 1 clique quando quiser.
          </p>
        </div>

        {/* Resumo de Benefícios */}
        <div className="space-y-2.5 mb-6 text-xs text-slate-300 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Biblioteca Completa CEFR A1 ao C2 (Mais de 120+ aulas)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Módulos de Business English e Aulas para Crianças (Kids)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Download Ilimitado de PDFs A4 de Alta Resolução</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Gabaritos Confidenciais e Dicas Metodológicas CELTA/DELTA</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Estúdio HTML & Criação de Aulas Personalizadas com IA</span>
          </div>
        </div>

        {/* Botão Oficial de Compra Kiwify */}
        <div className="space-y-3">
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/35 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <Crown className="w-4 h-4 text-amber-200" />
            <span>IR PARA O PAGAMENTO NA KIWIFY (R$ 19,90)</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>

          {/* Guia de Integração para o Usuário */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200 text-left space-y-1">
            <p className="font-bold text-white flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Como funciona o registro e a compra:</span>
            </p>
            <p>1. O botão acima abre seu link seguro da Kiwify (<span className="text-purple-300 font-mono">pay.kiwify.com.br/kUSvFoZ</span>).</p>
            <p>2. Ao concluir o pagamento com PIX ou Cartão, a Kiwify confirma o pedido.</p>
            <p>3. O webhook automático ativa o status de Teacher Membro no sistema.</p>
          </div>

          {/* Botão de Teste Rápido (Sandbox) */}
          <button
            onClick={handleSimulateSandboxConfirmation}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Já paguei / Ativar Modo de Teste Agora</span>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Checkout Oficial Kiwify • Cancele quando quiser</span>
        </div>
      </div>
    </div>
  );
};
