import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'Aromea | Perfume Experience',
  description: 'Aromea luxury perfume brand landing page with immersive scroll-driven sensory storytelling.',
  metadataBase: new URL('https://example.com')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
