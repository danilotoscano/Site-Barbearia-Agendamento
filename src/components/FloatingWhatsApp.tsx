import React from 'react';
import { MessageSquare } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Atendimento WhatsApp" className="fixed bottom-5 right-5 z-40">
      <a
        href={APP_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com o Rodrigo no WhatsApp"
        className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 border border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />

        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Falar no WhatsApp
        </span>
      </a>
    </aside>
  );
};
