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
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <MotionProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </MotionProvider>
      </body>
    </html>
  );
}
