import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 120px rgba(255, 236, 202, 0.12)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(255, 209, 147, 0.14), transparent 30%), radial-gradient(circle at 30% 120%, rgba(175, 118, 79, 0.08), transparent 25%)'
      }
    }
  },
  plugins: []
};

export default config;
