'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import SequenceScroll from './components/SequenceScroll';
import TextReveal from './components/TextReveal';
import CountUpOnView from './components/CountUpOnView';
import TestimonialsSlider from './components/TestimonialsSlider';
import Navbar from './components/Navbar';

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // ✅ Expose ke window agar SequenceScroll bisa pakai lenis.on('scroll')
    (window as any).__lenis = lenis;

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

return (
  // ✅ Hapus overflow-x-hidden dari main
  <main className="min-h-screen w-full bg-gradient-luxury text-gray-900">
    <Navbar />
    <SequenceScroll />

      {/* About Section — muncul natural setelah 500vh sequence selesai */}
      <section className="bg-gradient-to-b from-pink-50/80 to-white py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_minmax(280px,0.9fr)]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.36em] text-pink-600/70 font-light">
                About Aromea
              </p>
              <h2
                className="text-5xl font-light tracking-tight text-gray-900 md:text-6xl"
                style={{ letterSpacing: '-0.02em' }}
              >
                A luxury fragrance brand narrative built around scent, motion and refined artistry.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-gray-700/90">
                Aromea is designed to feel like cinema. Every scroll reveals a new chapter of fragrance
                craftsmanship, essence extraction, and sensory moments designed for the modern perfume connoisseur.
              </p>
            </div>
            <div className="rounded-[2rem] border border-pink-200/30 bg-white/40 p-8 backdrop-blur-lg shadow-lg">
              <TextReveal text="The brand philosophy flows through every note. Each scent is a composition of rare materials, artisanal blending, and emotional resonance. Aromea is luxury in motion." />
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Rose Petals',
                description:
                  'Hand-selected damask roses from Grasse, France. Each petal contributes a velvet richness to the heart.',
              },
              {
                title: 'Jasmine Bloom',
                description:
                  'Delicate white jasmine sambac captures the essence of night-blooming florals, adding ethereal softness.',
              },
              {
                title: 'Amber & Cedar',
                description:
                  'Aged amber resin and cedarwood create a warm, grounding base that lingers on skin for hours.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[2rem] border border-pink-200/20 bg-gradient-to-br from-white/60 to-pink-50/40 p-8 transition-all duration-300 hover:border-pink-300/40 hover:bg-white/70 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-64 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-pink-100/50 to-rose-100/50 flex items-center justify-center">
                  <p className="text-sm font-light text-pink-600/50 uppercase tracking-[0.2em]">
                    {item.title}
                  </p>
                </div>
                <h3 className="mt-7 text-2xl font-light text-gray-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-700/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-white to-pink-50 py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.36em] text-pink-600/70 font-light">
                Numbers that matter
              </p>
              <h2
                className="text-4xl font-light tracking-tight text-gray-900 md:text-5xl"
                style={{ letterSpacing: '-0.02em' }}
              >
                Real fragrances, real passion.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-gray-700/85">
                Each metric is a story point — from precious essences sourced globally to fragrance
                enthusiasts inspired by Aromea's artistry.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <CountUpOnView value={24} suffix="+" label="Perfume Collections" />
              <CountUpOnView value={18} label="Rare Ingredients" />
              <CountUpOnView value={12} label="Awards & Recognition" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 text-center">
            <p className="text-sm uppercase tracking-[0.36em] text-pink-600/70 font-light">
              Praise from the collection
            </p>
            <h2
              className="mt-6 text-5xl font-light tracking-tight text-gray-900 md:text-6xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              Testimonials that capture elegance.
            </h2>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-white py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.08),_transparent_25%)]" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-pink-100/30 to-transparent" />
        <div className="mx-auto relative max-w-6xl px-6 md:px-10 text-center">
          <p className="text-sm uppercase tracking-[0.36em] text-pink-600/70 font-light">
            Aromea Collective
          </p>
          <h2
            className="mt-6 text-5xl font-light tracking-tight text-gray-900 md:text-6xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            Join us for a fragrance journey that moves with every scroll.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-700/85">
            From exclusive releases to limited-edition blends, Aromea is where luxury perfumery
            intersects with a modern interactive brand experience.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 px-10 py-4 text-base font-light uppercase tracking-[0.2em] text-gray-900 shadow-[0_20px_60px_rgba(244,114,182,0.25)] transition duration-300 hover:shadow-[0_30px_80px_rgba(244,114,182,0.35)] hover:-translate-y-1">
              Discover Your Scent
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-gray-300/40 bg-white/50 px-10 py-4 text-base font-light uppercase tracking-[0.2em] text-gray-900 backdrop-blur-sm transition duration-300 hover:border-pink-400/40 hover:bg-pink-50/60 hover:shadow-md">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-200/20 bg-white py-16 text-gray-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-lg font-light text-gray-900">Aromea</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-700/90">
              A luxury fragrance brand crafted through motion, artistry, and sensory storytelling
              for the modern connoisseur.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm uppercase tracking-[0.3em] text-gray-600/70">
            <a href="#contact" className="transition hover:text-pink-600">Contact</a>
            <a href="#instagram" className="transition hover:text-pink-600">Instagram</a>
            <a href="#press" className="transition hover:text-pink-600">Press</a>
            <a href="#privacy" className="transition hover:text-pink-600">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}