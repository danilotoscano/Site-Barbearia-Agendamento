import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CarouselSection } from './components/CarouselSection';
import { ServicesSection } from './components/ServicesSection';
import { HighlightsSection } from './components/HighlightsSection';
import { BookingWizard } from './components/BookingWizard';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ServiceItem } from './types';

export default function App() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('servicos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-body selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header onBookClick={scrollToBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onBookClick={scrollToBooking}
          onExploreServices={scrollToServices}
        />

        {/* Real Customer Haircut Carousel */}
        <CarouselSection />

        {/* Services & Prices */}
        <ServicesSection
          selectedService={selectedService}
          onSelectService={handleSelectService}
        />

        {/* Highlights & Guarantees */}
        <HighlightsSection />

        {/* Direct Booking Wizard (Core Feature) */}
        <BookingWizard
          initialService={selectedService}
        />

        {/* Location & Contact Section */}
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
