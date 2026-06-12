'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const FRAME_COUNT = 192;
const CONTAINER_HEIGHT = '200vh';

const pad = (value: number) => String(value).padStart(3, '0');

const buildSources = () => 
  Array.from({ length: FRAME_COUNT }, (_, index) => `/sequence/ezgif-frame-${pad(index + 1)}.jpg`);

const scaleCover = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const { width: cw, height: ch } = canvas;
  const { width: iw, height: ih } = image;
  const scale = Math.max(cw / iw, ch / ih);
  const dx = (cw - iw * scale) / 2;
  const dy = (ch - ih * scale) / 2;
  return { width: iw * scale, height: ih * scale, x: dx, y: dy };
};

interface TextOverlayProps {
  opacity: any;
  alignment: 'center' | 'left' | 'right';
  subtitle: string;
  title: string;
  description: string;
  isCTA?: boolean;
}

const TextOverlay = ({ 
  opacity, 
  alignment, 
  subtitle, 
  title, 
  description, 
  isCTA 
}: TextOverlayProps) => {
  const alignmentClass = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right'
  };

  return (
    <motion.div 
      style={{ opacity }} 
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 ${alignmentClass[alignment]}`}
    >
      <div className={`max-w-2xl ${alignment === 'right' ? 'ml-auto' : alignment === 'left' ? 'ml-0' : ''}`}>
        {/* Luxury Pill Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-white/20 px-5 py-3 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-pink-600/70" />
          <span className="text-xs font-light uppercase tracking-[0.3em] text-pink-700/80">
            {subtitle}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="mt-6 font-light leading-tight tracking-tight text-gray-900 md:leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="mt-4 font-light leading-relaxed text-gray-700/80 md:text-lg"
          style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        {isCTA && (
          <motion.div 
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300 px-10 py-4 text-base font-medium uppercase tracking-[0.2em] text-gray-900 shadow-[0_20px_60px_rgba(244,114,182,0.3)] transition duration-300 hover:shadow-[0_30px_80px_rgba(244,114,182,0.4)] hover:-translate-y-1">
              Discover Your Scent
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-gray-400/40 bg-white/10 px-10 py-4 text-base font-medium uppercase tracking-[0.2em] text-gray-900 backdrop-blur-sm transition duration-300 hover:border-pink-300/40 hover:bg-white/20">
              Learn More
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const sources = useMemo(buildSources, []);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ['start start', 'end end'],
    layoutEffect: false
  });
  
  // Smooth spring animation for fluid frame interpolation
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 150, 
    damping: 40,
    mass: 1
  });

  // Luxury text overlay animations with precise scroll markers
  const welcomeOpacity = useTransform(scrollYProgress, [0, 0.06, 0.2, 0.28], [1, 1, 0.9, 0]);
  const welcomeScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);
  
  const petalsOpacity = useTransform(scrollYProgress, [0.25, 0.32, 0.55, 0.62], [0, 1, 1, 0]);
  const petalsX = useTransform(scrollYProgress, [0.32, 0.55], ['-100%', '0%']);
  
  const amberOpacity = useTransform(scrollYProgress, [0.57, 0.65, 0.8, 0.87], [0, 1, 1, 0]);
  const amberX = useTransform(scrollYProgress, [0.65, 0.8], ['100%', '0%']);
  
  const ctaOpacity = useTransform(scrollYProgress, [0.82, 0.9, 1], [0, 1, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.82, 0.95], [0.95, 1]);

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const failedFrames: Array<{ src: string; error: string }> = [];
    const successFrames: string[] = [];

    console.log(`🎬 Starting to preload ${FRAME_COUNT} frames...`);

    const imagePromises = sources.map((src, index) =>
      new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.src = src;
        image.crossOrigin = 'anonymous';
        
        let resolved = false;
        
        const finishLoading = (success: boolean, error?: string) => {
          if (resolved) return;
          resolved = true;
          
          loadedCount += 1;
          if (success) {
            successFrames.push(src);
          } else {
            failedFrames.push({ src, error: error || 'unknown' });
          }
          setPreloadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
          resolve(image);
        };

        image.onload = () => {
          finishLoading(true);
          if (loadedCount % 50 === 0 || loadedCount === FRAME_COUNT) {
            console.log(`✅ Loaded ${loadedCount}/${FRAME_COUNT} frames`);
          }
        };
        
        image.onerror = (error) => {
          finishLoading(false, 'error');
          console.error(`❌ Failed to load frame ${index + 1}: ${src}`);
        };

        // Set timeout for slow connections (8 seconds)
        setTimeout(() => {
          if (!resolved) {
            finishLoading(false, 'timeout');
            console.warn(`⏱️ Timeout loading frame ${index + 1}: ${src}`);
          }
        }, 8000);
      })
    );

    Promise.all(imagePromises).then((allImages) => {
      imagesRef.current = allImages;
      setLoaded(true);
      console.log(`🎬 Preload complete: ${successFrames.length}/${FRAME_COUNT} frames loaded`);
      if (failedFrames.length > 0) {
        console.error(`❌ ${failedFrames.length} frames failed:`, failedFrames);
      }
    });
  }, [sources]);

  // Canvas rendering with high performance
  useEffect(() => {
    if (!loaded) {
      console.log('⏳ Waiting for images to load...');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('❌ Canvas ref not found');
      return;
    }
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      console.error('❌ Canvas context not found');
      return;
    }

    console.log('✅ Canvas setup complete', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      imageCount: imagesRef.current.length
    });

    const drawFrame = (frameIndex: number) => {
      const image = imagesRef.current[frameIndex];
      // Fallback ke frame sebelumnya jika gagal load
      if (!image || !image.complete || image.naturalWidth === 0) {
        if (frameIndex > 0) {
          const fallbackImage = imagesRef.current[frameIndex - 1];
          if (fallbackImage && fallbackImage.complete && fallbackImage.naturalWidth > 0) {
            try {
              const { width, height, x, y } = scaleCover(canvas, fallbackImage);
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(fallbackImage, x, y, width, height);
              return;
            } catch (e) {
              console.error('Fallback draw error:', e);
            }
          }
        }
        return;
      }

      try {
        const { width, height, x, y } = scaleCover(canvas, image);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, x, y, width, height);
      } catch (e) {
        console.error(`Canvas draw error at frame ${frameIndex}:`, e);
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      if (imagesRef.current.length) {
        drawFrame(currentFrame);
      }
      
      console.log('✅ Canvas resized:', { width: canvas.width, height: canvas.height, dpr });
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Subscribe to scroll progress changes
    const unsubscribe = smoothProgress.on('change', (latest: number) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1, 
        Math.max(0, Math.floor(latest * FRAME_COUNT))
      );
      
      if (frameIndex !== currentFrame) {
        setCurrentFrame(frameIndex);
        
        // Use requestAnimationFrame for optimal rendering
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          drawFrame(frameIndex);
        });
      }
    });

    console.log('✅ Scroll subscription started');

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      unsubscribe();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [smoothProgress, currentFrame, loaded]);

  // Preloader UI
  if (!loaded && preloadProgress < 100) {
    return (
      <div className="loader-overlay">
        <div className="loader-content">
          <motion.div 
            className="loader-percentage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {preloadProgress}%
          </motion.div>
          <div className="loader-bar">
            <motion.div 
              className="loader-bar-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${preloadProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600/70 font-light">
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
        height: CONTAINER_HEIGHT, 
        background: 'linear-gradient(135deg, #f5e6e8 0%, #e8d4db 50%, #dcc5d0 100%)',
        position: 'relative'
      }}
    >
      {/* Sticky Canvas Container */}
      <div className="canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 h-full w-full z-10"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Text Overlays */}
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
      </div>
    </div>
  );
}
