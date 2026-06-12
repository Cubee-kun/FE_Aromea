'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpOnViewProps {
  label: string;
  value: number;
  suffix?: string;
}

export default function CountUpOnView({ label, value, suffix = '' }: CountUpOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 25 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on('change', (latest) => setDisplayValue(Math.round(latest)));
  }, [spring]);

  return (
    <motion.div 
      ref={ref} 
      className="group overflow-hidden rounded-[2rem] border border-pink-200/20 bg-gradient-to-br from-white/60 to-pink-50/40 p-8 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.p 
        className="text-5xl font-light tracking-tight text-pink-600"
        layout
      >
        {displayValue}
        <span className="text-3xl ml-1">{suffix}</span>
      </motion.p>
      <p className="mt-4 font-light uppercase tracking-[0.35em] text-sm text-pink-700/70">
        {label}
      </p>
    </motion.div>
  );
}
