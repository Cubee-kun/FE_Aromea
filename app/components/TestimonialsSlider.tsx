'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    quote: 'Aromea feels like cinema. Every spray is a new scene in a beautifully crafted sensory experience.',
    author: 'Victoria M., fragrance curator',
    initial: 'VM'
  },
  {
    quote: 'The composition and longevity are so refined it feels like the perfume is designed for the soul.',
    author: 'James H., luxury consultant',
    initial: 'JH'
  },
  {
    quote: "I've never experienced a landing page and a fragrance so seamlessly aligned with modern luxury.",
    author: 'Lucia P., brand strategist',
    initial: 'LP'
  }
];

export default function TestimonialsSlider() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [autoplay]);

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-pink-200/20 bg-gradient-to-br from-white/50 via-pink-50/30 to-white/40 p-10 shadow-lg backdrop-blur-md sm:p-14 hover:shadow-xl transition-shadow duration-300">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.08),_transparent_35%)]" />

      <div className="relative grid gap-8">
        {/* Testimonial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            {/* Quote */}
            <div className="space-y-4">
              <svg className="h-8 w-8 text-pink-300/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.156-2.845-4.5-2V2c0-.573.447-1 1-1h2.5A2.5 2.5 0 0 1 12 2v5c0 5-7 13-4 13 4 0 6.5-4.82 6.5-8.3V5c0-1.25-4.417-2.667-4.5-2v2c0 .573.478 1 1 1h2.5a2.5 2.5 0 0 1 2.5 2.5V13c0 4-3 7-7 7-4.923 0-7-3.066-7-7.523V5" />
              </svg>
              <p className="text-2xl leading-relaxed text-gray-900 md:text-3xl font-light">
                "{testimonials[active].quote}"
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 border-t border-pink-200/20 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/40 border border-pink-300/20">
                <span className="text-sm font-light text-pink-700/70">
                  {testimonials[active].initial}
                </span>
              </div>
              <p className="text-sm font-light uppercase tracking-[0.35em] text-pink-700/70">
                {testimonials[active].author}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Indicators */}
        <div className="flex items-center gap-3 pt-4">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setActive(index);
                setAutoplay(false);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === active 
                  ? 'w-8 bg-pink-600' 
                  : 'w-2.5 bg-pink-300/40 hover:bg-pink-300/70'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
