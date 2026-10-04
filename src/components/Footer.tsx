import React from 'react';
import { MapPin, MessageSquare, Clock, Shield } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-10 sm:py-14 text-neutral-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-neutral-900">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-neutral-900 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={APP_CONFIG.logoUrl}
                  alt="Rodrigo Barbearia"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-neutral-100 block">
                  RODRIGO BARBEARIA
                </span>
                <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
                  Excelência & Precisão
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
              Especialista em cortes masculinos, degradê, barba na toalha quente e estética masculina de alto nível.
            </p>
          </div>

          {/* Col 2: Info & Horários */}
          <div className="space-y-2.5">
            <h5 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-200">
              Atendimento & Horários
            </h5>
            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Segunda a Sábado: 09:00 às 19:00</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <a
                href={APP_CONFIG.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 underline underline-offset-2 transition-colors"
              >
                Abrir no Google Maps
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
              <a
                href={APP_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 underline underline-offset-2 transition-colors"
              >
                Conversar pelo WhatsApp
              </a>
            </div>
          </div>

          {/* Col 3: Privacy & Security */}
          <div className="space-y-2.5">
            <h5 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Privacidade & Dados</span>
            </h5>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Seus dados de agendamento (nome e WhatsApp) são armazenados com segurança no banco de dados e usados exclusivamente para confirmação do seu horário e histórico. Zero spam.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-[11px]">
          <p>© {new Date().getFullYear()} Rodrigo Barbearia. Todos os direitos reservados.</p>
          <p className="text-neutral-400">Atendimento com pontualidade e estilo.</p>
        </div>
      </div>
    </footer>
  );
};
