import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-4">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="font-extrabold text-base text-white">
            {type === 'terms' ? 'Terms of Service (Termos de Uso)' : 'Privacy Policy (LGPD Compliance)'}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2">
          {type === 'terms' ? (
            <>
              <p>
                <strong>1. Acceptance of Terms:</strong> By subscribing to FLUENT IMMERSION ("the Platform"),
                you agree to abide by these Terms of Service.
              </p>
              <p>
                <strong>2. Subscription & Recurring Billing:</strong> The subscription fee is R$ 19,90 per month,
                billed in Brazilian Reais (BRL) through Mercado Pago. Your subscription renews automatically each month
                until cancelled. You may cancel at any time from your member dashboard with no cancellation penalties.
              </p>
              <p>
                <strong>3. Educational Licensing & Usage Rights:</strong> Subscribed educators are granted a non-exclusive,
                revocable license to download, print, adapt, and distribute lesson materials and worksheets to their direct
                students in classroom or private tutoring settings. Reselling or mass redistributing raw source files on
                public repositories is strictly prohibited.
              </p>
              <p>
                <strong>4. Account Security:</strong> You are responsible for safeguarding your credentials. Sharing a single
                account across multiple institutions without an enterprise license violates these terms.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. LGPD Commitment:</strong> In compliance with the Brazilian General Data Protection Law (Lei Geral
                de Proteção de Dados - Lei nº 13.709/2018), FLUENT IMMERSION protects the personal information of all users.
              </p>
              <p>
                <strong>2. Data Collected:</strong> We collect only necessary identifying data (name, email address, country,
                preferred teaching context) to manage your account and subscription. Payment information (credit card numbers,
                CVV) is processed exclusively by Mercado Pago; we never store sensitive payment card details on our servers.
              </p>
              <p>
                <strong>3. Email Communications:</strong> We use your email to dispatch essential subscription notices and
                opt-in weekly alerts for new lesson materials. You can unsubscribe from non-essential emails at any time.
              </p>
              <p>
                <strong>4. User Rights:</strong> You may request access to, correction of, or permanent deletion of your
                personal data by contacting privacy@fluentimmersion.com.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
