import { ServiceItem } from '../types';

export const APP_CONFIG = {
  barberName: 'Rodrigo Barbearia',
  tagline: 'Cortes exclusivos, degradê impecável e atendimento de alta precisão.',
  logoUrl: 'https://i.postimg.cc/SNHdgM96/logomarca-nova-comprimida.png',
  whatsappUrl: 'https://wa.link/yc9uxu',
  locationUrl: 'https://share.google/U3N5Myrp7S5hGsAKX',
  operatingHours: {
    start: '09:00',
    end: '19:00',
    intervalMinutes: 30,
    daysDescription: 'Segunda a Sábado das 09h às 19h',
  },
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'cabelo-barba',
    name: 'Cabelo e Barba',
    price: 60,
    formattedPrice: 'R$ 60,00',
    durationMinutes: 60,
    description: 'Combo completo com corte moderno ou clássico, barba desenhada na navalha e toalha quente.',
    iconName: 'Crown',
    popular: true,
  },
  {
    id: 'cabelo',
    name: 'Cabelo',
    price: 35,
    formattedPrice: 'R$ 35,00',
    durationMinutes: 35,
    description: 'Degradê (Fade) milimétrico, tesoura técnica, acabamento refinado e lavagem.',
    iconName: 'Scissors',
    popular: true,
  },
  {
    id: 'barba',
    name: 'Barba',
    price: 25,
    formattedPrice: 'R$ 25,00',
    durationMinutes: 25,
    description: 'Modelagem, alinhamento simétrico, hidratação de fios e navalhete descartável.',
    iconName: 'Sparkles',
  },
  {
    id: 'pintar-cabelo',
    name: 'Pintar Cabelo',
    price: 20,
    formattedPrice: 'R$ 20,00',
    durationMinutes: 40,
    description: 'Pigmentação para realce do corte, camuflagem de grisalhos ou tonalização.',
    iconName: 'Paintbrush',
  },
  {
    id: 'sobrancelha',
    name: 'Sobrancelha',
    price: 10,
    formattedPrice: 'R$ 10,00',
    durationMinutes: 15,
    description: 'Alinhamento e limpeza dos fios na navalha para um olhar marcante e simétrico.',
    iconName: 'Eye',
  },
];

export const GALLERY_IMAGES = [
  {
    url: 'https://i.postimg.cc/7hFHW9DF/rodrigo-cliente-1.jpg',
    title: 'Degradê Navalhado Perfeito',
    description: 'Fade limpo com transição suave e acabamento impecável.',
  },
  {
    url: 'https://i.postimg.cc/yxM1bjB2/rodrigo-cliente-2.jpg',
    title: 'Corte Moderno Masculino',
    description: 'Estilo versátil, alinhado à textura natural dos fios.',
  },
  {
    url: 'https://i.postimg.cc/j2pxFcKG/rodrigo-cliente-3.jpg',
    title: 'Barboterapia & Alinhamento',
    description: 'Desenho preciso e finalização para máxima elegância.',
  },
  {
    url: 'https://i.postimg.cc/gjCzTsdQ/rodrigo-cliente-4.jpg',
    title: 'Acabamento & Linhas Claras',
    description: 'Detalhes nítidos que valorizam o contorno facial.',
  },
  {
    url: 'https://i.postimg.cc/cCpxbhZ5/rodrigo-cliente-5.jpg',
    title: 'Transformação Completa',
    description: 'Cabelo e barba harmonizados com sofisticação.',
  },
];

export const HIGHLIGHTS = [
  {
    icon: 'Flame',
    title: 'Degradê (Fade) Profissional',
    desc: 'Transições sem marcas, do zero ao topo com técnica afiada.',
  },
  {
    icon: 'Sparkles',
    title: 'Barba Modelada & Alinhada',
    desc: 'Desenho sob medida para seu formato de rosto com navalha higienizada.',
  },
  {
    icon: 'Clock',
    title: 'Horário Agendado Sem Espera',
    desc: 'Seu tempo é sagrado. Você chega e é prontamente atendido na sua hora.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Higiene, Conforto & Excelência',
    desc: 'Ambiente climatizado, materiais 100% esterilizados e café cortesia.',
  },
];

// Generates time slots based on interval (09:00 to 18:30)
export function getStandardTimeSlots(): string[] {
  const slots: string[] = [];
  const startHour = 9;
  const endHour = 19; // Up to 18:30
  const interval = 30;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      if (h === endHour - 1 && m > 30) continue; // Ends at 18:30 so session finishes by 19:00
      const hourStr = h.toString().padStart(2, '0');
      const minStr = m.toString().padStart(2, '0');
      slots.push(`${hourStr}:${minStr}`);
    }
  }
  return slots;
}
