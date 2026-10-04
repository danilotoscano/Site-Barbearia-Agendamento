import React from 'react';
import { Flame, ShieldCheck, Clock, Scissors, Award, Sparkles } from 'lucide-react';

export const HighlightsSection: React.FC = () => {
  const points = [
    {
      icon: <Scissors className="w-6 h-6 text-amber-400" />,
      title: 'Cortes Modernos & Tradicionais',
      desc: 'Do social clássico e militar ao navalhado mais ousado e atual.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: 'Degradê (Fade) Profissional',
      desc: 'Transições suaves e sem marcas, executadas com máquinas e lâminas de precisão.',
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      title: 'Barba Modelada & Alinhada',
      desc: 'Design que valoriza o contorno facial, toalha quente e pós-barba hidratante.',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: 'Acabamentos Personalizados',
      desc: 'Sobrancelha alinhada, pigmentação natural e atenção aos mínimos detalhes.',
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: 'Atendimento com Horário Agendado',
      desc: 'Zero perda de tempo em filas. Sua cadeira fica pronta no momento marcado.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: 'Higiene, Conforto & Excelência',
      desc: 'Lâminas 100% descartáveis, ambiente climatizado e café especial para você.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-neutral-900/30 border-b border-neutral-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Padrão Rodrigo Barbearia</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-neutral-100">
            Focado na Autoestima Masculina
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-2">
            Não é só cortar cabelo ou fazer a barba. É viver uma experiência de cuidado, confiança e estilo impecável.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((point, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 hover:border-amber-500/30 transition-all hover:-translate-y-1 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4 group-hover:border-amber-500/40 transition-colors">
                {point.icon}
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors mb-1.5">
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
