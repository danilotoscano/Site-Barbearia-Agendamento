import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { ServiceItem, AppointmentData } from '../types';
import { APP_CONFIG, SERVICES } from '../constants';

// Helper to normalize phone numbers
export function normalizeWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }
  if (digits.length >= 10) {
    return `55${digits}`;
  }
  return digits;
}

export function formatWhatsAppDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

export function buildSlotKey(date: string, time: string): string {
  return `${date}_${time.replace(':', '-')}`;
}

export async function getBookedSlotsForDate(date: string): Promise<Set<string>> {
  const path = 'slots';
  try {
    const q = query(collection(db, path), where('date', '==', date), where('isBooked', '==', true));
    const snapshot = await getDocs(q);
    const booked = new Set<string>();
    snapshot.forEach((d) => {
      const data = d.data();
      if (data.time) {
        booked.add(data.time);
      }
    });
    return booked;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export interface BookingSubmission {
  service: ServiceItem;
  name: string;
  whatsapp: string;
  marketingConsent: boolean;
  date: string;
  time: string;
}

export interface BookingResult {
  success: boolean;
  appointmentId: string;
  slotKey: string;
  whatsappUrl: string;
  messageText: string;
  appointment: AppointmentData;
}

export async function createBooking(payload: BookingSubmission): Promise<BookingResult> {
  // Defensive validation against the blueprint schema
  const officialService = SERVICES.find((s) => s.id === payload.service.id);
  if (!officialService || officialService.price !== payload.service.price) {
    throw new Error('Serviço inválido ou preço adulterado. Por favor, tente novamente.');
  }

  const trimmedName = payload.name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    throw new Error('Por favor, informe seu nome completo (mínimo 2 letras).');
  }

  const normalizedPhone = normalizeWhatsApp(payload.whatsapp);
  if (normalizedPhone.length < 10 || normalizedPhone.length > 20) {
    throw new Error('Por favor, informe um número de WhatsApp válido com DDD.');
  }

  const timeRegex = /^(09|10|11|12|13|14|15|16|17|18):(00|30)$/;
  if (!timeRegex.test(payload.time)) {
    throw new Error('Horário fora do funcionamento da barbearia (09:00 às 18:30).');
  }

  const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  if (!dateRegex.test(payload.date)) {
    throw new Error('Data em formato inválido.');
  }

  const slotKey = buildSlotKey(payload.date, payload.time);
  const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const slotDocRef = doc(db, 'slots', slotKey);
  const appointmentDocRef = doc(db, 'appointments', appointmentId);
  const clientDocRef = doc(db, 'clients', normalizedPhone);

  try {
    // Atomic transaction ensuring zero double-bookings
    await runTransaction(db, async (transaction) => {
      // 1. Check if slot is already reserved
      const slotSnapshot = await transaction.get(slotDocRef);
      if (slotSnapshot.exists()) {
        const slotData = slotSnapshot.data();
        if (slotData && slotData.isBooked) {
          throw new Error(`O horário ${payload.time} já foi reservado por outro cliente. Por favor, selecione outro horário.`);
        }
      }

      // 2. Fetch existing client data if present
      const clientSnapshot = await transaction.get(clientDocRef);
      const clientExists = clientSnapshot.exists();
      const existingClientData = clientExists ? clientSnapshot.data() : null;

      // 3. Atomically reserve slot
      transaction.set(slotDocRef, {
        slotKey,
        date: payload.date,
        time: payload.time,
        isBooked: true,
        appointmentId,
        createdAt: nowIso,
      });

      // 4. Save confirmed appointment
      transaction.set(appointmentDocRef, {
        id: appointmentId,
        clientId: normalizedPhone,
        clientName: trimmedName,
        whatsapp: payload.whatsapp.trim(),
        serviceId: officialService.id,
        serviceName: officialService.name,
        servicePrice: officialService.price,
        date: payload.date,
        time: payload.time,
        slotKey,
        status: 'confirmed',
        marketingConsent: Boolean(payload.marketingConsent),
        createdAt: nowIso,
      });

      // 5. Upsert client profile (maintains customer base for recurring visits)
      if (clientExists && existingClientData) {
        transaction.update(clientDocRef, {
          name: trimmedName,
          whatsapp: payload.whatsapp.trim(),
          marketingConsent: Boolean(payload.marketingConsent),
          consentTimestamp: payload.marketingConsent ? nowIso : existingClientData.consentTimestamp || null,
          bookingCount: (existingClientData.bookingCount || 1) + 1,
          lastBookingAt: nowIso,
          updatedAt: nowIso,
        });
      } else {
        transaction.set(clientDocRef, {
          id: normalizedPhone,
          name: trimmedName,
          whatsapp: payload.whatsapp.trim(),
          marketingConsent: Boolean(payload.marketingConsent),
          consentTimestamp: payload.marketingConsent ? nowIso : null,
          bookingCount: 1,
          lastBookingAt: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
    });

    // Generate WhatsApp text as requested:
    // "Olá Rodrigo, eu agendei às [horário agendado], para fazer [nome do serviço]."
    const messageText = `Olá Rodrigo, eu agendei às ${payload.time}, para fazer ${officialService.name}.`;
    
    // Wa.link URL with encoded text parameter
    // If wa.link supports ?text= query param, or fallback to wa.me with message
    const baseWaLink = APP_CONFIG.whatsappUrl;
    const whatsappUrl = `${baseWaLink}?text=${encodeURIComponent(messageText)}`;

    const appointment: AppointmentData = {
      id: appointmentId,
      clientId: normalizedPhone,
      clientName: trimmedName,
      whatsapp: payload.whatsapp.trim(),
      serviceId: officialService.id,
      serviceName: officialService.name,
      servicePrice: officialService.price,
      date: payload.date,
      time: payload.time,
      slotKey,
      status: 'confirmed',
      marketingConsent: payload.marketingConsent,
      createdAt: nowIso,
    };

    return {
      success: true,
      appointmentId,
      slotKey,
      whatsappUrl,
      messageText,
      appointment,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('já foi reservado')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'appointments');
  }
}
