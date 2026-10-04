import React from 'react';
import { Calendar, ChevronRight, Sparkles, Scissors, Clock, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface HeroProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-neutral-900 bg-radial-[at_top_center] from-neutral-900/60 via-neutral-950 to-neutral-950">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Prominent Logo Presentation */}
        <div className="inline-block relative mb-6">
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 mx-auto p-2 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-2xl shadow-amber-500/15 flex items-center justify-center backdrop-blur-sm group transition-transform duration-300 hover:scale-105">
            <img
              src={APP_CONFIG.logoUrl}
              alt="Logo Rodrigo Barbearia"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(234,179,8,0.3)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-950 border border-amber-500/50 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400 whitespace-nowrap shadow-md">
            Espaço Exclusivo
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-100 mb-4 max-w-3xl mx-auto">
          Excelência em Cada Detalhe,{' '}
          <span className="gold-gradient-text">Foco na Sua Autoestima</span>
        </h1>

        <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Especialista em cortes masculinos, degradê (fade) profissional, barba alinhada na navalha e pintura. Atendimento com horário marcado e pontualidade.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold tracking-wide uppercase text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>AGENDAR MEU HORÁRIO</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-6 py-4 text-sm sm:text-base font-semibold text-neutral-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Scissors className="w-4 h-4 text-amber-400" />
            <span>Ver Serviços & Preços</span>
          </button>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-neutral-900">
          <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex flex-col items-center text-center">
            <Clock className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-200">Sem Fila de Espera</span>
            <span className="text-[11px] text-neutral-400">Horário exclusivo</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex flex-col items-center text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-200">Fade & Degradê</span>
            <span className="text-[11px] text-neutral-400">Técnica milimétrica</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex flex-col items-center text-center">
            <Scissors className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-200">Barba Terapia</span>
            <span className="text-[11px] text-neutral-400">Navalha & toalha</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex flex-col items-center text-center">
            <ShieldCheck className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-200">Ambiente Climatizado</span>
            <span className="text-[11px] text-neutral-400">Conforto total</span>
          </div>
        </div>
      </div>
    </section>
  );
};
