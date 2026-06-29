'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FRAME_COUNT = 192;
const CONTAINER_HEIGHT = '500vh';

const pad = (value: number) => String(value).padStart(3, '0');

const buildSources = () =>
  Array.from({ length: FRAME_COUNT }, (_, index) => `/sequence/ezgif-frame-${pad(index + 1)}.jpg`);

// Ganti fungsi scaleCover lama dengan ini
const scaleCover = (
  canvasW: number,
  canvasH: number,
  imageW: number,
  imageH: number
) => {
  const canvasAspect = canvasW / canvasH;
  const imageAspect = imageW / imageH;

  let scale: number;
  let sx = 0, sy = 0, sw = imageW, sh = imageH;

  if (canvasAspect < imageAspect) {
    // Canvas lebih portrait dari image (kasus mobile)
    // → crop kiri-kanan image, ambil bagian tengah
    scale = canvasH / imageH;
    // Hitung berapa lebar image yang kita butuhkan
    const neededW = canvasW / scale;
    sx = (imageW - neededW) / 2; // crop dari tengah
    sw = neededW;
    sy = 0;
    sh = imageH;
  } else {
    // Canvas lebih landscape — scale normal cover
    scale = canvasW / imageW;
    const neededH = canvasH / scale;
    sy = (imageH - neededH) / 2;
    sh = neededH;
    sx = 0;
    sw = imageW;
  }

  return { sx, sy, sw, sh };
};

interface TextOverlayProps {
  opacity: any;
  alignment: 'center' | 'left' | 'right';
  subtitle: string;
  title: string;
  description: string;
  isCTA?: boolean;
}

const TextOverlay = ({ opacity, alignment, subtitle, title, description, isCTA }: TextOverlayProps) => {
  const alignmentClass = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right',
  };

  return (
    <motion.div
      style={{ opacity }}
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 ${alignmentClass[alignment]}`}
    >
      <div className={`max-w-2xl ${alignment === 'right' ? 'ml-auto' : ''}`}>

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-white/20 px-5 py-3 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-pink-600/70" />
          <span
            style={{ fontFamily: 'Agrandir, sans-serif', fontWeight: 400 }}
            className="text-xs uppercase tracking-[0.3em] text-pink-700/80"
          >
            {subtitle}
          </span>
        </div>

        {/* Heading — Agrandir Regular */}
        <h1
          style={{
            fontFamily: 'Agrandir, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
          className="mt-6 text-gray-900"
        >
          {title}
        </h1>

        {/* Description — Agrandir Light */}
        <p
          style={{
            fontFamily: 'Agrandir, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            lineHeight: 1.7,
          }}
          className="mt-4 text-gray-700/80"
        >
          {description}
        </p>

        {isCTA && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              style={{ fontFamily: 'Agrandir, sans-serif', fontWeight: 400 }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 px-10 py-4 text-base uppercase tracking-[0.2em] text-gray-900 shadow-[0_20px_60px_rgba(244,114,182,0.3)] transition duration-300 hover:shadow-[0_30px_80px_rgba(244,114,182,0.4)] hover:-translate-y-1"
            >
              Discover Your Scent
            </button>
            <button
              style={{ fontFamily: 'Agrandir, sans-serif', fontWeight: 300 }}
              className="inline-flex items-center justify-center rounded-full border border-gray-400/40 bg-white/10 px-10 py-4 text-base uppercase tracking-[0.2em] text-gray-900 backdrop-blur-sm transition duration-300 hover:border-pink-300/40 hover:bg-white/20"
            >
              Learn More
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ScrollProgressIndicator = ({ progress }: { progress: any }) => {
  const width = useTransform(progress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(progress, [0.95, 1], [1, 0]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <div className="h-px w-32 bg-gray-400/30 overflow-hidden rounded-full">
        <motion.div style={{ width }} className="h-full bg-pink-400/70 rounded-full" />
      </div>
      <motion.div style={{ opacity: hintOpacity }} className="flex flex-col items-center gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-600/60 font-light">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3L8 13M8 13L4 9M8 13L12 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500/60"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentFrameRef = useRef(0);

  // ✅ Track viewport height secara akurat via visualViewport
  const [viewportH, setViewportH] = useState('100vh');

  useEffect(() => {
    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      setViewportH(`${h}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('resize', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('resize', setVh);
    };
  }, []);

  const sources = useMemo(buildSources, []);

  // ✅ Manual scroll progress — tidak pakai useScroll
  const scrollYProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 40,
    mass: 1,
  });

  const welcomeOpacity = useTransform(scrollYProgress, [0, 0.04, 0.14, 0.20], [1, 1, 0.9, 0]);
  const petalsOpacity  = useTransform(scrollYProgress, [0.18, 0.24, 0.48, 0.55], [0, 1, 1, 0]);
  const amberOpacity   = useTransform(scrollYProgress, [0.53, 0.60, 0.78, 0.85], [0, 1, 1, 0]);
  const ctaOpacity     = useTransform(scrollYProgress, [0.83, 0.90, 1.0], [0, 1, 1]);

  // ✅ Hitung progress manual, support Lenis dan native scroll
  useEffect(() => {
    const updateProgress = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrolled = -rect.top;
      const total = containerHeight - viewportHeight;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      scrollYProgress.set(progress);
    };

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.on('scroll', updateProgress);
      updateProgress();
      return () => lenis.off('scroll', updateProgress);
    } else {
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
      return () => window.removeEventListener('scroll', updateProgress);
    }
  }, [scrollYProgress]);

  // Ganti drawFrame
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let image = imagesRef.current[frameIndex];
    if (!image?.complete || image.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        const fallback = imagesRef.current[i];
        if (fallback?.complete && fallback.naturalWidth > 0) {
          image = fallback;
          break;
        }
      }
    }
    if (!image?.complete || image.naturalWidth === 0) return;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.width / dpr;
      const displayH = canvas.height / dpr;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // ✅ Gunakan drawImage 9-param: crop source dulu, baru render ke canvas
      const { sx, sy, sw, sh } = scaleCover(
        displayW, displayH,
        image.naturalWidth, image.naturalHeight
      );

      ctx.clearRect(0, 0, displayW, displayH);
      // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      // src: crop dari image | dst: full canvas
      ctx.drawImage(
        image,
        sx, sy, sw, sh,   // source: bagian image yang diambil
        0, 0, displayW, displayH  // destination: full canvas
      );
    } catch (e) {
      console.error(`Canvas draw error at frame ${frameIndex}:`, e);
    }
  }, []);

  // Preload
  useEffect(() => {
    let loadedCount = 0;
    const imagePromises = sources.map((src) =>
      new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.src = src;
        image.crossOrigin = 'anonymous';
        let resolved = false;
        const finish = () => {
          if (resolved) return;
          resolved = true;
          loadedCount += 1;
          setPreloadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
          resolve(image);
        };
        image.onload = finish;
        image.onerror = finish;
        setTimeout(finish, 8000);
      })
    );
    Promise.all(imagePromises).then((allImages) => {
      imagesRef.current = allImages;
      setLoaded(true);
    });
  }, [sources]);

  useEffect(() => {
  if (!loaded) return;
  const canvas = canvasRef.current;
  const wrapper = canvas?.parentElement;
  const container = containerRef.current;
  console.log('=== DEBUG ===');
  console.log('wrapper offsetHeight:', wrapper?.offsetHeight);
  console.log('wrapper offsetWidth:', wrapper?.offsetWidth);
  console.log('container offsetHeight:', container?.offsetHeight);
  console.log('window.innerHeight:', window.innerHeight);
  console.log('visualViewport height:', window.visualViewport?.height);
  console.log('canvas style:', canvas?.style.cssText);
}, [loaded]);

  // ✅ Canvas setup — pakai offsetWidth/Height dari parent wrapper
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ganti resizeCanvas di dalam useEffect
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      drawFrame(currentFrameRef.current);
    };

    // ✅ Delay sedikit agar DOM sudah settle sebelum resize
    const timer = setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);

    const unsubscribe = smoothProgress.on('change', (latest: number) => {
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(latest * FRAME_COUNT)));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
      unsubscribe();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [loaded, smoothProgress, drawFrame]);

  if (!loaded && preloadProgress < 100) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
        <div className="flex flex-col items-center gap-6">
          <motion.p
            className="text-4xl font-light tracking-tight text-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {preloadProgress}%
          </motion.p>
          <div className="h-px w-48 bg-pink-200 overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${preloadProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500/70 font-light">
            Loading Aromea...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        position: 'relative',
        width: '100%',
        height: CONTAINER_HEIGHT,
        background: 'linear-gradient(135deg, #f5e6e8 0%, #e8d4db 50%, #dcc5d0 100%)',
      }}
    >
      {/* ✅ Sticky wrapper dengan tinggi viewport yang akurat */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',        // ✅ full lebar viewport
          height: '100vh',       // ✅ full tinggi viewport
          marginLeft: 'calc(-50vw + 50%)', // ✅ escape dari parent container jika ada padding
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        <TextOverlay
          opacity={welcomeOpacity}
          alignment="center"
          subtitle="Aroméa"
          title="Welcome to Aroméa"
          description="Express Yourself because Your Scent, Your Identity"
        />
        <TextOverlay
          opacity={petalsOpacity}
          alignment="left"
          subtitle="Floral Essence"
          title="A Symphony of Petals"
          description="Pink roses and white jasmine dance in suspension, creating the heart of Aroméa."
        />
        <TextOverlay
          opacity={amberOpacity}
          alignment="right"
          subtitle="Woody Base"
          title="Grounded in Amber & Cedar"
          description="Warm woody notes settle, anchoring your presence with timeless elegance."
        />
        <TextOverlay
          opacity={ctaOpacity}
          alignment="center"
          subtitle="Your Journey Awaits"
          title="Your Core Identity, Bottled"
          description="Every spray is a moment of self-expression. Experience Aroméa."
          isCTA={true}
        />

        <ScrollProgressIndicator progress={scrollYProgress} />
      </div>
    </div>
  );
}