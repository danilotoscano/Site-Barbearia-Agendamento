import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GALLERY_IMAGES } from '../constants';

export const CarouselSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Automatic timer transition every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-12 sm:py-16 bg-neutral-950 border-b border-neutral-900 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galeria de Clientes</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-neutral-100">
            Cortes & Transformações Reais
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mt-2">
            Confira alguns dos trabalhos realizados pelo barbeiro Rodrigo com foco em estilo e acabamento cirúrgico.
          </p>
        </div>

        {/* Carousel Showcase Container */}
        <div
          className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl shadow-neutral-950"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Display Frame */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-h-[520px] overflow-hidden bg-neutral-950 flex items-center justify-center">
            {GALLERY_IMAGES.map((item, idx) => (
              <div
                key={item.url}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-20 flex flex-col justify-end">
                  <div className="max-w-xl">
                    <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-amber-400 uppercase">
                      Trabalho Rodrigo Barbearia
                    </span>
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-white mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-amber-400 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Próxima imagem"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-amber-400 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-30 flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1.5 rounded-full border border-neutral-800 backdrop-blur-sm">
            {GALLERY_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver imagem ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-amber-400'
                    : 'w-1.5 h-1.5 bg-neutral-600 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-4">
          {GALLERY_IMAGES.map((item, idx) => (
            <button
              key={item.url}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-102'
                  : 'border-neutral-800 opacity-60 hover:opacity-90'
              }`}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
