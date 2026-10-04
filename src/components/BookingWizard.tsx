import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { SERVICES, getStandardTimeSlots } from '../constants';
import { ServiceItem, BookingStep } from '../types';
import {
  getBookedSlotsForDate,
  createBooking,
  BookingResult,
  formatWhatsAppDisplay,
} from '../services/bookingService';

interface BookingWizardProps {
  initialService: ServiceItem | null;
  onClearInitialService?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService,
}) => {
  // Step State
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // Form Fields
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(initialService);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Firestore availability state
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<BookingResult | null>(null);

  // Sync initialService if updated from outside
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      // Auto move to step 2 if on step 1
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  }, [initialService]);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(todayStr);
  }, []);

  // Fetch slot availability whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    let isCancelled = false;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setErrorMessage(null);
      try {
        const booked = await getBookedSlotsForDate(selectedDate);
        if (!isCancelled) {
          setBookedSlots(booked);
          // If the currently selected time is booked, reset it
          if (selectedTime && booked.has(selectedTime)) {
            setSelectedTime('');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar horários:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadSlots();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  // WhatsApp input masking
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setWhatsapp(raw);
  };

  // Generate 21 upcoming days for easy thumb-scrolling
  const upcomingDates = React.useMemo(() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;

      const weekDay = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const dayNum = dd;
      const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      const isToday = i === 0;

      dates.push({
        iso,
        label: isToday ? 'Hoje' : weekDay.toUpperCase(),
        dayNum,
        monthShort,
      });
    }
    return dates;
  }, []);

  // Check if slot has already passed for today
  const isTimeInPast = (timeStr: string) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayIso = `${yyyy}-${mm}-${dd}`;

    if (selectedDate !== todayIso) return false;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate.getTime() <= today.getTime() + 10 * 60 * 1000; // 10 min buffer
  };

  // Navigation validations
  const canGoToStep2 = Boolean(selectedService);
  const canGoToStep3 =
    Boolean(selectedService) && name.trim().length >= 2 && whatsapp.length >= 10;
  const canGoToStep4 = canGoToStep3 && Boolean(selectedDate);
  const canGoToStep5 = canGoToStep4 && Boolean(selectedTime);

  // Submission handler
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !name || !whatsapp) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios antes de confirmar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await createBooking({
        service: selectedService,
        name: name.trim(),
        whatsapp,
        marketingConsent,
        date: selectedDate,
        time: selectedTime,
      });

      setBookingSuccess(result);

      // Open WhatsApp automatically after registration
      setTimeout(() => {
        try {
          window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // If popup is blocked, the user can click the button in modal
        }
      }, 800);
    } catch (err: unknown) {
      console.error('Falha ao registrar agendamento:', err);
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro ao gravar o agendamento. Tente novamente.';
      setErrorMessage(msg);
      // If error is about already booked slot, return to time selection
      if (msg.includes('já foi reservado') || msg.includes('já reservado')) {
        setCurrentStep(4);
        // Refresh slots for that date
        getBookedSlotsForDate(selectedDate).then(setBookedSlots).catch(() => {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date display for Brazilian Portuguese
  const formatDateBR = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <section id="agendamento" className="py-14 sm:py-20 bg-neutral-950 border-b border-neutral-900 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Agendamento Direto</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-neutral-100">
            Reserve Seu Horário
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2">
            Sem cadastro e sem senha. Basta escolher o serviço, data e horário para garantir sua vaga.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-400">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentStep === 1 ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800'}`}>1</span>
              <span className="hidden sm:inline">Serviço</span>
            </button>

            <span className="text-neutral-700">·</span>

            <button
              onClick={() => canGoToStep2 && setCurrentStep(2)}
              disabled={!canGoToStep2}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 2 ? 'text-amber-400 font-bold' : !canGoToStep2 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800'}`}>2</span>
              <span className="hidden sm:inline">Seus Dados</span>
            </button>

            <span className="text-neutral-700">·</span>

            <button
              onClick={() => canGoToStep3 && setCurrentStep(3)}
              disabled={!canGoToStep3}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 3 ? 'text-amber-400 font-bold' : !canGoToStep3 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800'}`}>3</span>
              <span className="hidden sm:inline">Data</span>
            </button>

            <span className="text-neutral-700">·</span>

            <button
              onClick={() => canGoToStep4 && setCurrentStep(4)}
              disabled={!canGoToStep4}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 4 ? 'text-amber-400 font-bold' : !canGoToStep4 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800'}`}>4</span>
              <span className="hidden sm:inline">Horário</span>
            </button>

            <span className="text-neutral-700">·</span>

            <button
              onClick={() => canGoToStep5 && setCurrentStep(5)}
              disabled={!canGoToStep5}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 5 ? 'text-amber-400 font-bold' : !canGoToStep5 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 5 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800'}`}>5</span>
              <span className="hidden sm:inline">Resumo</span>
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300">Aviso importante</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Wizard Main Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* STEP 1: Escolha do Serviço */}
          {currentStep === 1 && (
            <div>
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100">
                  Etapa 1 de 5: Selecione o Serviço
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Qual procedimento você deseja realizar hoje na barbearia?
                </p>
              </div>

              <div className="space-y-3">
                {SERVICES.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40 text-neutral-100 shadow-md'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400 text-neutral-950'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-neutral-950" />}
                        </div>
                        <div>
                          <span className="font-semibold text-sm sm:text-base text-neutral-100 block">
                            {service.name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            ~{service.durationMinutes} min · {service.description.slice(0, 50)}...
                          </span>
                        </div>
                      </div>

                      <span className="font-mono-numbers font-bold text-base sm:text-lg text-amber-400">
                        {service.formattedPrice}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setCurrentStep(2)}
                  className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    selectedService
                      ? 'bg-amber-400 hover:bg-yellow-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continuar para Seus Dados</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dados do Cliente */}
          {currentStep === 2 && (
            <div>
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100">
                  Etapa 2 de 5: Seus Dados de Contato
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Não é necessário senha. Apenas seu nome e WhatsApp para confirmação do horário.
                </p>
              </div>

              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Nome Completo <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Carlos Eduardo Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 text-neutral-100 text-sm placeholder:text-neutral-600 outline-none transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Como o barbeiro Rodrigo deve lhe chamar.
                  </span>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    WhatsApp com DDD <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="(99) 99999-9999"
                      value={formatWhatsAppDisplay(whatsapp)}
                      onChange={handlePhoneChange}
                      maxLength={15}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 text-neutral-100 text-sm font-mono-numbers placeholder:text-neutral-600 outline-none transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Utilizado para envio do lembrete e confirmação imediata.
                  </span>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-400 bg-neutral-900"
                    />
                    <span className="text-xs text-neutral-300 leading-relaxed">
                      Aceito receber informações, lembretes de agendamento e novidades da barbearia pelo WhatsApp. <span className="text-neutral-500">(Opcional)</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={name.trim().length < 2 || whatsapp.length < 10}
                  onClick={() => setCurrentStep(3)}
                  className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    name.trim().length >= 2 && whatsapp.length >= 10
                      ? 'bg-amber-400 hover:bg-yellow-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continuar para a Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Escolha da Data */}
          {currentStep === 3 && (
            <div>
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100">
                  Etapa 3 de 5: Escolha o Dia
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Selecione uma data disponível nos próximos dias.
                </p>
              </div>

              {/* Horizontal Date Picker Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 scale-102'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-neutral-950' : 'text-neutral-400'}`}>
                        {item.label}
                      </span>
                      <span className="font-mono-numbers text-xl font-black my-0.5">
                        {item.dayNum}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {item.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setCurrentStep(4)}
                  className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    selectedDate
                      ? 'bg-amber-400 hover:bg-yellow-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continuar para Horários</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Escolha do Horário */}
          {currentStep === 4 && (
            <div>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100">
                    Etapa 4 de 5: Escolha o Horário
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Horários para <strong className="text-amber-400">{formatDateBR(selectedDate)}</strong> (intervalos de 30 min das 09h às 18h30).
                  </p>
                </div>
                {isLoadingSlots && (
                  <div className="flex items-center gap-1 text-xs text-amber-400 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                )}
              </div>

              {/* Status legend */}
              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Reservado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
                  <span>Passado</span>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {getStandardTimeSlots().map((timeSlot) => {
                  const isBooked = bookedSlots.has(timeSlot);
                  const isPast = isTimeInPast(timeSlot);
                  const isUnavailable = isBooked || isPast;
                  const isSelected = selectedTime === timeSlot;

                  return (
                    <button
                      key={timeSlot}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setSelectedTime(timeSlot)}
                      className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isUnavailable
                          ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-amber-400 border-amber-300 text-neutral-950 font-bold shadow-lg shadow-amber-500/25 scale-105 cursor-pointer'
                          : 'bg-neutral-950 border-neutral-800 hover:border-amber-500/40 text-neutral-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-950' : isUnavailable ? 'text-neutral-600' : 'text-amber-400'}`} />
                        <span className="font-mono-numbers text-sm font-semibold">
                          {timeSlot}
                        </span>
                      </div>
                      <span className={`text-[10px] mt-1 ${isBooked ? 'text-red-400' : isPast ? 'text-neutral-600' : isSelected ? 'text-neutral-900 font-semibold' : 'text-emerald-400'}`}>
                        {isBooked ? 'Reservado' : isPast ? 'Passado' : 'Livre'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setCurrentStep(5)}
                  className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTime
                      ? 'bg-amber-400 hover:bg-yellow-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Revisar Agendamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Resumo e Confirmação */}
          {currentStep === 5 && selectedService && (
            <div>
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-100">
                  Etapa 5 de 5: Revisão do Agendamento
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Confira todos os dados antes de confirmar. Ao concluir, você será direcionado ao WhatsApp do Rodrigo.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3.5 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">Cliente</span>
                  <span className="text-sm font-bold text-neutral-100">{name}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">WhatsApp</span>
                  <span className="text-sm font-mono-numbers font-medium text-neutral-200">
                    {formatWhatsAppDisplay(whatsapp)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">Serviço Escolhido</span>
                  <span className="text-sm font-semibold text-amber-400">
                    {selectedService.name}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">Data Agendada</span>
                  <span className="text-sm font-bold text-neutral-100">
                    {formatDateBR(selectedDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">Horário Marcado</span>
                  <span className="text-sm font-mono-numbers font-bold text-neutral-100 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
                    {selectedTime}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-neutral-300">Valor Total</span>
                  <span className="font-mono-numbers text-xl font-black text-amber-400">
                    {selectedService.formattedPrice}
                  </span>
                </div>
              </div>

              {/* Anti-collision and validation notice */}
              <div className="p-3 rounded-lg bg-neutral-950/60 border border-amber-500/20 text-xs text-neutral-400 mb-6 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  O horário será bloqueado no sistema em tempo real contra reservas duplicadas e registrado com segurança no banco de dados.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Alterar Horário</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gravando no Firebase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>CONFIRMAR AGENDAMENTO</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL & WHATSAPP REDIRECTION */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full rounded-2xl border border-amber-500/40 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
              Agendamento Confirmado!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mb-6">
              Os dados foram registrados no Firebase com sucesso. Abrindo o WhatsApp do Rodrigo...
            </p>

            <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-400">Serviço:</span>
                <span className="font-semibold text-neutral-200">{bookingSuccess.appointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Horário:</span>
                <span className="font-bold text-amber-400 font-mono-numbers">{bookingSuccess.appointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Data:</span>
                <span className="font-medium text-neutral-200">{formatDateBR(bookingSuccess.appointment.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Valor:</span>
                <span className="font-bold text-amber-400">R$ {bookingSuccess.appointment.servicePrice},00</span>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={bookingSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mb-3"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir WhatsApp Agora</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              type="button"
              onClick={() => {
                setBookingSuccess(null);
                setCurrentStep(1);
                setSelectedTime('');
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors py-2 cursor-pointer"
            >
              Fazer outro agendamento
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
