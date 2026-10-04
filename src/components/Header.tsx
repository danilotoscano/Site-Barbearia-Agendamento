import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface HeaderProps {
  onBookClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Zone */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-500/40 bg-neutral-900 p-1 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md shadow-amber-500/10">
            <img
              src={APP_CONFIG.logoUrl}
              alt="Logo Rodrigo Barbearia"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-bold tracking-wider text-neutral-100 group-hover:text-amber-400 transition-colors">
              RODRIGO
            </span>
            <span className="text-[10px] sm:text-xs font-medium tracking-widest text-amber-500 uppercase">
              Barbearia & Barber Shop
            </span>
          </div>
        </a>

        {/* Operating hours indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Aberto hoje das 09h às 19h</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={APP_CONFIG.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-amber-400 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Localização</span>
          </a>

          <button
            onClick={onBookClick}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-lg hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Agendar Horário</span>
          </button>
        </div>
      </div>
    </header>
  );
};
