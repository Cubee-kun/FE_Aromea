# Aroméa Scrollytelling - Production Code Reference

## ✨ COMPLETE BUILD DELIVERED

Your **world-class luxury scrollytelling landing page** is production-ready with all Awwwards-level features implemented.

---

## 📦 Component Architecture

```
FE_Aromea/
├── app/
│   ├── globals.css              ← Luxury styling foundation
│   ├── layout.tsx               ← (existing)
│   ├── page.tsx                 ← Main landing page with Lenis
│   └── components/
│       ├── SequenceScroll.tsx   ← 240-frame scroll animation
│       ├── Navbar.tsx           ← Magnetic menu button
│       ├── TextReveal.tsx       ← Split-character animations
│       ├── CountUpOnView.tsx    ← Auto-counting stats
│       └── TestimonialsSlider.tsx ← Luxury testimonial carousel
├── public/sequence/             ← Place 240 JPG frames here
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── IMPLEMENTATION_GUIDE.md      ← Full guide
```

---

## 🎬 Hero Section: Scroll-Linked Animation

### **SequenceScroll Component**

```typescript
const FRAME_COUNT = 240;
const CONTAINER_HEIGHT = '400vh';  // 4x viewport height for cinematic feel

// Scroll-linked frame mapping
const frameIndex = Math.min(
  FRAME_COUNT - 1,
  Math.max(0, Math.floor(scrollProgress * FRAME_COUNT))
);

// Spring-based smooth frame interpolation
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 150,
  damping: 40,
  mass: 1
});
```

### **Text Overlays with Precision Timing**

```typescript
// 0% - 20%: Welcome Section
const welcomeOpacity = useTransform(
  scrollYProgress,
  [0, 0.06, 0.2, 0.28],
  [1, 1, 0.9, 0]
);

// 30% - 55%: Floral Essence (left-aligned)
const petalsOpacity = useTransform(
  scrollYProgress,
  [0.25, 0.32, 0.55, 0.62],
  [0, 1, 1, 0]
);

// 60% - 80%: Amber & Cedar (right-aligned)
const amberOpacity = useTransform(
  scrollYProgress,
  [0.57, 0.65, 0.8, 0.87],
  [0, 1, 1, 0]
);

// 85% - 100%: CTA Section (center with button)
const ctaOpacity = useTransform(
  scrollYProgress,
  [0.82, 0.9, 1],
  [0, 1, 1]
);
```

### **Canvas Rendering Optimization**

```typescript
// High-performance canvas setup
const ctx = canvas.getContext('2d', { alpha: false });
const dpr = window.devicePixelRatio || 1;

canvas.width = Math.floor(rect.width * dpr);
canvas.height = Math.floor(rect.height * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// Render with requestAnimationFrame
animationFrameRef.current = requestAnimationFrame(() => {
  const { width, height, x, y } = scaleCover(canvas, image);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, x, y, width, height);
});
```

---

## 🧭 Page Structure

### **Lenis Smooth Scroll Integration**

```typescript
// In page.tsx - Applied globally
const lenis = new Lenis({
  duration: 1.2,  // Scroll duration (seconds)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

let frameId: number;
const raf = (time: number) => {
  lenis.raf(time);
  frameId = requestAnimationFrame(raf);
};
```

### **Sections Layout**

```
┌─────────────────────────────────┐
│   Navbar (fixed, z-50)          │
├─────────────────────────────────┤
│   SequenceScroll (400vh)        │
│   - Canvas sticky top-0         │
│   - Text overlays               │
│   - Preloader on mount          │
├─────────────────────────────────┤
│   About Section                 │
│   (-mt-[100vh] z-10)            │
├─────────────────────────────────┤
│   Bento Grid                    │
│   (ingredient showcase)         │
├─────────────────────────────────┤
│   Stats Section                 │
│   (auto-counting)               │
├─────────────────────────────────┤
│   Testimonials                  │
│   (auto-rotating slider)        │
├─────────────────────────────────┤
│   CTA Section                   │
│   (gradient buttons)            │
├─────────────────────────────────┤
│   Footer                        │
└─────────────────────────────────┘
```

---

## 🎨 Color System

### **Primary Gradient (matches canvas)**

```css
--primary-gradient: linear-gradient(
  135deg,
  #f5e6e8 0%,    /* Soft pink */
  #e8d4db 50%,   /* Dusty rose */
  #dcc5d0 100%   /* Mauve */
);
```

### **Text Hierarchy**

| Element | Color | Weight | Tracking |
|---------|-------|--------|----------|
| Headings | `#3d2e33` (gray-900) | 300 | -0.02em |
| Body | `#5a4a4f` (gray-700) | 300/400 | normal |
| Accent | `#ec4899` (pink-600) | 300 | 0.3em-0.5em |
| Labels | `#9f7f8c` (pink-700/70) | 300 | 0.35em |

---

## 🧩 Component Examples

### **TextReveal Component**

```typescript
// Split-character animation on scroll
<TextReveal 
  text="The brand philosophy flows through every note..."
/>

// Animates each character individually with staggered timing
// offset: Math.max(0, globalCharIndex * 0.015)
```

### **CountUpOnView Component**

```typescript
// Auto-animating statistics
<CountUpOnView 
  label="Perfumes"
  value={24}
  suffix="+"
/>

// Springs to value when in viewport
// Triggers once, smooth spring easing
```

### **TestimonialsSlider Component**

```typescript
// Auto-rotating testimonial carousel
<TestimonialsSlider />

// Features:
// - 6000ms rotation interval
// - Pause on hover
// - Manual navigation dots
// - Smooth fade transitions
```

### **Navbar Component**

```typescript
// Magnetic menu button with full-screen overlay
<Navbar />

// Menu button follows mouse on hover
// Full-screen nav with staggered link animations
// Social links + contact info in footer
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind defaults applied throughout */
sm: 640px   /* Tablets */
md: 768px   /* Small desktops */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
2xl: 1536px /* Extra large */

/* Canvas responsive scaling */
- DPR (device pixel ratio) aware
- Maintains aspect ratio
- Mobile-first approach
```

---

## 🚀 Quick Start Checklist

```bash
# 1. Prepare assets
mkdir -p public/sequence/
# Copy 240 JPG images named: ezgif-frame-001.jpg through ezgif-frame-240.jpg

# 2. Dependencies (already in package.json)
npm install
# Installs: framer-motion, lenis, next, tailwindcss, etc.

# 3. Run development
npm run dev
# Visit http://localhost:3000

# 4. Customize (if needed)
# - Edit page.tsx for section content
# - Update globals.css for colors
# - Modify scroll duration in page.tsx (Lenis config)

# 5. Build for production
npm run build
npm start
```

---

## ⚡ Performance Tips

### **Image Optimization**
```bash
# Optimize JPG files before deployment
# Target: 50-100KB per frame
# Tool: ImageOptim, TinyJPG, or similar
```

### **Frame Preloading**
```typescript
// Currently: 240 frames preload before page renders
// For faster initial load, consider:
// - Progressive loading (load frames 1-60 initially)
// - WebP format with fallback
// - CDN distribution
```

### **Browser DevTools Tips**
```javascript
// Monitor in Chrome DevTools Performance tab:
// - Canvas rendering < 16ms per frame
// - Smooth 60fps scrolling
// - Memory: ~40-60MB for 240 images
```

---

## 🎯 Customization Examples

### **Change Scroll Speed**
```typescript
// page.tsx, Lenis config
duration: 1.2  // ← Change to 0.8 (faster) or 1.5 (slower)
```

### **Adjust Text Overlay Timing**
```typescript
// SequenceScroll.tsx
const welcomeOpacity = useTransform(
  scrollYProgress,
  [0, 0.06, 0.2, 0.28],  // ← Modify start/end points
  [1, 1, 0.9, 0]
);
```

### **Change Button Colors**
```jsx
// page.tsx
<button className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-300">
  {/* Change gradient colors */}
</button>
```

### **Modify Testimonial Rotation**
```typescript
// TestimonialsSlider.tsx
}, 6000);  // ← Change to 5000 (faster) or 8000 (slower)
```

---

## 🔍 Key File Locations

| File | Purpose | Key Exports |
|------|---------|-------------|
| `app/page.tsx` | Main page | HomePage (default export) |
| `app/globals.css` | Global styles | CSS variables, animations |
| `components/SequenceScroll.tsx` | Hero animation | SequenceScroll (default export) |
| `components/Navbar.tsx` | Navigation | Navbar (default export) |
| `components/TextReveal.tsx` | Text animation | TextReveal (default export) |
| `components/CountUpOnView.tsx` | Stats | CountUpOnView (default export) |
| `components/TestimonialsSlider.tsx` | Testimonials | TestimonialsSlider (default export) |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Canvas blank on load | Check `/public/sequence/` folder has 240 JPGs |
| Preloader stuck | Verify image naming: `ezgif-frame-001.jpg` format |
| Text overlays not visible | Check `scrollYProgress` ranges in SequenceScroll.tsx |
| Stuttering scroll | Reduce frame rate, increase Spring damping |
| Menu button not magnetic | Verify mouse event handlers in Navbar.tsx |
| Stats not animating | Ensure component enters viewport (scroll into view) |

---

## 📊 Browser Compatibility

```
✅ Chrome/Chromium (v90+)
✅ Firefox (v88+)
✅ Safari (v14+)
✅ Edge (v90+)
✅ Mobile Chrome/Safari (latest)

⚠️ Requires:
- WebGL support
- ES6+ JavaScript
- CSS Grid/Flexbox
```

---

## 📚 Resources

- **Next.js**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Lenis**: https://lenis.darkroom.engineering/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🎉 You're All Set!

Your **luxury Aroméa scrollytelling landing page** is production-ready with:

✅ **Cinematic 240-frame animation**  
✅ **Seamless gradient blending**  
✅ **Smooth Lenis scrolling**  
✅ **Luxury typography & interactions**  
✅ **Mobile-responsive design**  
✅ **Performance optimized**  
✅ **Awwwards-level polish**  

**Deploy and wow your users! 🚀**
