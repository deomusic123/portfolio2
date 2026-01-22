import type { Metadata } from 'next';
import './globals.css';
import { MotionProvider } from '@portfolio2/ui/lib/framer';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Portfolio2 - Agencia Digital del Futuro',
  description: 'Gestiona proyectos, automatiza flujos y escala sin límites. La plataforma definitiva para agencias digitales modernas.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Overlay de ruido global */}
        <div className="bg-noise" />
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
