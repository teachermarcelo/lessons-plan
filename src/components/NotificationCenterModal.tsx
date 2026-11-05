import React from 'react';
import { Bell, X, Check, BookOpen, Briefcase, Baby, Info, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../types/fluent';

interface NotificationCenterModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[85vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Avisos & Lançamentos</h3>
              <p className="text-[11px] text-slate-400">Novos planos de aula e atualizações da plataforma</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Marcar lidas
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onSelectNotification(notif);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.is_read
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : 'bg-slate-950 border-purple-500/30 text-slate-200 shadow-md shadow-purple-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                    <h4 className="font-bold text-white text-xs sm:text-sm">{notif.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed ml-4">
                  {notif.message}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhuma nova notificação no momento. Você está 100% atualizado(a)!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
