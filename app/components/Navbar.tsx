'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const navLinks = ['Home', 'Origins', 'Craft', 'Stories', 'Contact'];
const socialLinks = ['Instagram', 'Dribbble', 'Behance'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!menuButtonRef.current || !isHovering) return;
      
      const rect = menuButtonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      {/* Logo Section */}
      <div className="relative z-20 flex items-center gap-4">
        <motion.div 
          className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/40 bg-white/30 text-lg font-light text-pink-700 shadow-sm backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          A
        </motion.div>
        <div className="hidden sm:block">
          <p className="text-xs font-light uppercase tracking-[0.5em] text-pink-700/80">Aromea</p>
          <p className="text-sm font-light text-gray-700/70">Fragrance studio</p>
        </div>
      </div>

      {/* Magnetic Menu Button */}
      <button
        ref={menuButtonRef}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        className="relative z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/30 bg-white/20 backdrop-blur-md transition group"
        aria-label="Open navigation menu"
      >
        <motion.div
          animate={{
            x: isHovering ? mousePosition.x * 0.3 : 0,
            y: isHovering ? mousePosition.y * 0.3 : 0,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="absolute h-0.5 w-6 rounded-full bg-gray-900 transition duration-300"
          style={{ 
            transform: open ? 'rotate(45deg) translateY(0)' : 'translateY(-6px)',
          }}
        />
        <motion.div
          animate={{
            opacity: open ? 0 : 1,
            x: isHovering ? mousePosition.x * 0.3 : 0,
            y: isHovering ? mousePosition.y * 0.3 : 0,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="absolute h-0.5 w-6 rounded-full bg-gray-900"
        />
        <motion.div
          animate={{
            x: isHovering ? mousePosition.x * 0.3 : 0,
            y: isHovering ? mousePosition.y * 0.3 : 0,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="absolute h-0.5 w-6 rounded-full bg-gray-900 transition duration-300"
          style={{ 
            transform: open ? 'rotate(-45deg) translateY(0)' : 'translateY(6px)',
          }}
        />
      </button>

      {/* Full-Screen Navigation Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 overflow-hidden bg-gradient-to-br from-pink-50/95 via-white/95 to-pink-50/95 backdrop-blur-xl"
          >
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,114,182,0.08),_transparent_35%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.06),_transparent_30%)]" />

            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-8 py-12 md:px-14">
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="self-end rounded-full border border-gray-300/30 bg-white/40 px-4 py-3 text-sm font-light uppercase tracking-[0.25em] text-gray-900 transition hover:bg-white/60 backdrop-blur-md"
              >
                Close
              </button>

              {/* Navigation Links */}
              <nav className="grid gap-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    whileHover={{ x: 20, color: '#ec4899' }}
                    className="text-[clamp(2.5rem,5vw,4.5rem)] font-light uppercase tracking-tight text-gray-900 transition"
                  >
                    {link}
                  </motion.a>
                ))}
              </nav>

              {/* Footer Info */}
              <div className="grid gap-8 border-t border-gray-300/20 pt-12 text-sm text-gray-700">
                <div className="grid gap-3">
                  <span className="font-light uppercase tracking-[0.35em] text-pink-700/80">Social</span>
                  <div className="flex flex-wrap gap-6">
                    {socialLinks.map((social) => (
                      <motion.a 
                        key={social} 
                        href="#"
                        whileHover={{ color: '#ec4899' }}
                        className="font-light transition"
                      >
                        {social}
                      </motion.a>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <span className="font-light uppercase tracking-[0.35em] text-pink-700/80">Contact</span>
                  <p className="font-light text-gray-700/80">hello@aromea.studio</p>
                  <p className="font-light text-gray-700/80">+1 (555) 018-974</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
