import React from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export const LocationSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Localização & Atendimento</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-neutral-100">
            Onde Estamos
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2">
            Ambiente pensado para o seu conforto com estacionamento e acesso rápido.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-100">Horário de Funcionamento</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Segunda a Sábado: <strong>09:00 às 19:00</strong>
                  </p>
                  <p className="text-[11px] text-neutral-500">Atendimento estritamente pontual com hora agendada.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-100">Dúvidas & WhatsApp</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Fale direto com o Rodrigo para dúvidas ou orientações.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={APP_CONFIG.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Traçar Rota no Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Visual Map / Location Badge */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="font-display text-base font-bold text-neutral-100">
                Rodrigo Barbearia
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Toque no botão abaixo para abrir diretamente a rota no aplicativo do Google Maps no seu celular.
              </p>
              <a
                href={APP_CONFIG.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Ver localização exata</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
