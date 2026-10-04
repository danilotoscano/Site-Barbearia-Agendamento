import React from 'react';
import { Crown, Scissors, Sparkles, Paintbrush, Eye, Check, Clock, ArrowRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  selectedService: ServiceItem | null;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedService,
  onSelectService,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Paintbrush':
        return <Paintbrush className="w-6 h-6 text-amber-400" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-amber-400" />;
      default:
        return <Scissors className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="servicos" className="py-14 sm:py-20 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Tabela Oficial</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-neutral-100">
            Nossos Serviços & Preços
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mt-2">
            Escolha o serviço desejado para iniciar seu agendamento em poucos cliques. Sem login ou burocracia.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {SERVICES.map((service) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-neutral-900/90 border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-400/30'
                    : 'bg-neutral-900/40 hover:bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 shadow-lg'
                } group`}
              >
                {/* Popular or Recommended Tag */}
                {service.popular && (
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    Mais Pedido
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        {getIcon(service.iconName)}
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>~{service.durationMinutes} minutos</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-numbers text-xl sm:text-2xl font-black text-amber-400 block">
                        {service.formattedPrice}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-400">
                    {isSelected ? 'Serviço Selecionado' : 'Clique para agendar'}
                  </span>

                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 group-hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selecionado</span>
                      </>
                    ) : (
                      <>
                        <span>Escolher</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
