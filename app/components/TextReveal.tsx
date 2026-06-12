'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Fragment, useMemo, useRef } from 'react';

interface TextRevealProps {
  text: string;
}

export default function TextReveal({ text }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ['start end', 'end start'] 
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35], [40, 0]);
  
  // Split text into words and characters
  const words = useMemo(() => text.split(' '), [text]);
  const totalChars = useMemo(() => text.split(''), [text]);

  return (
    <motion.div 
      ref={ref} 
      style={{ opacity, y }} 
      className="overflow-hidden text-lg leading-relaxed text-gray-800/90 md:text-xl font-light"
    >
      <div className="inline-flex flex-wrap gap-[0.15em]">
        {words.map((word, wordIndex) => (
          <span key={`word-${wordIndex}`} className="inline-flex">
            {word.split('').map((char, charIndex) => {
              const globalCharIndex = text.substring(0, text.indexOf(word) + charIndex).length;
              
              return (
                <motion.span
                  key={`char-${wordIndex}-${charIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: (globalCharIndex * 0.015),
                    duration: 0.4, 
                    ease: 'easeOut' 
                  }}
                  viewport={{ once: false, margin: '-100px' }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="w-[0.25em]" />
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
