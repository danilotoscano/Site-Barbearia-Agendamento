export interface ServiceItem {
  id: 'cabelo-barba' | 'cabelo' | 'barba' | 'pintar-cabelo' | 'sobrancelha';
  name: 'Cabelo e Barba' | 'Cabelo' | 'Barba' | 'Pintar Cabelo' | 'Sobrancelha';
  price: 60 | 35 | 25 | 20 | 10;
  formattedPrice: string;
  durationMinutes: number;
  description: string;
  iconName: string;
  popular?: boolean;
}

export interface ClientData {
  id: string; // Normalized phone
  name: string;
  whatsapp: string;
  marketingConsent: boolean;
  consentTimestamp?: string | null;
  bookingCount?: number;
  lastBookingAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentData {
  id: string;
  clientId: string;
  clientName: string;
  whatsapp: string;
  serviceId: ServiceItem['id'];
  serviceName: ServiceItem['name'];
  servicePrice: ServiceItem['price'];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slotKey: string; // YYYY-MM-DD_HH-mm
  status: 'confirmed' | 'cancelled' | 'completed';
  marketingConsent?: boolean;
  createdAt: string;
}

export interface SlotData {
  slotKey: string;
  date: string;
  time: string;
  isBooked: boolean;
  appointmentId: string;
  createdAt: string;
}

export interface BookingFormState {
  service: ServiceItem | null;
  name: string;
  whatsapp: string;
  marketingConsent: boolean;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;
