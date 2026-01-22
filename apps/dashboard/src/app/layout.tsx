import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./providers";
import { MotionProvider } from "@portfolio2/ui/lib/framer";

export const metadata: Metadata = {
  title: "Portfolio2 - Agencia Digital Moderna",
  description: "Plataforma de gestión de proyectos y leads para agencias digitales",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body className="antialiased" suppressHydrationWarning style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <MotionProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </MotionProvider>
      </body>
    </html>
  );
}
