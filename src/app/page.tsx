"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ROUTES } from "@/lib/constants";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/moving-border";

// Dynamic import to avoid hydration mismatch with random values
const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then((mod) => mod.BackgroundBeams),
  { ssr: false }
);

const InfiniteMovingCards = dynamic(
  () => import("@/components/ui/infinite-moving-cards").then((mod) => mod.InfiniteMovingCards),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section with Background Beams */}
      <section className="relative min-h-screen flex items-center justify-center">
        <BackgroundBeams className="opacity-40" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Portfolio2
            </h1>
            <div className="flex gap-4">
              <Link
                href={ROUTES.LOGIN}
                className="px-6 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:border-neutral-600 transition"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Agencia Digital
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                del Futuro
              </span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Gestiona proyectos, leads y automatiza flujos con la plataforma más moderna.
              Next.js 15, Supabase, n8n y AI integrada.
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <Button
                as={Link}
                href={ROUTES.REGISTER}
                className="px-8 py-3 font-semibold"
                borderRadius="1rem"
                duration={3}
              >
                Comenzar Ahora →
              </Button>
              <Link
                href="#features"
                className="px-8 py-3 rounded-xl border border-neutral-700 text-white hover:border-neutral-500 hover:bg-neutral-900/50 transition flex items-center gap-2"
              >
                Ver Demo
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-neutral-500">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-neutral-500">Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-neutral-500">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section id="features" className="relative py-32 px-4 bg-gradient-to-b from-black to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-neutral-400">
              Herramientas potentes para agencias modernas
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoGridItem
              title="Gestión de Leads"
              description="CRM completo con captura, calificación y conversión automatizada de leads."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20"></div>
              }
              icon={<span className="text-3xl">🎯</span>}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Dashboard Analytics"
              description="Métricas en tiempo real para tomar decisiones basadas en datos."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20"></div>
              }
              icon={<span className="text-3xl">📊</span>}
            />
            <BentoGridItem
              title="Automatización n8n"
              description="Workflows automatizados para notificaciones, emails y reportes."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20"></div>
              }
              icon={<span className="text-3xl">⚡</span>}
            />
            <BentoGridItem
              title="Gestión de Proyectos"
              description="Trackeo completo: presupuesto, fechas, comentarios y adjuntos."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20"></div>
              }
              icon={<span className="text-3xl">🚀</span>}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Team Management"
              description="Invitaciones, roles (admin/agent/client) y permisos granulares."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20"></div>
              }
              icon={<span className="text-3xl">👥</span>}
            />
            <BentoGridItem
              title="File Attachments"
              description="Supabase Storage para subir y gestionar archivos de forma segura."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20"></div>
              }
              icon={<span className="text-3xl">📎</span>}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-neutral-400">
              +500 agencias confían en nosotros
            </p>
          </div>

          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-neutral-400">
            Únete a cientos de agencias que ya están usando Portfolio2
          </p>
          <Button
            as={Link}
            href={ROUTES.REGISTER}
            className="px-12 py-4 font-bold text-lg"
            borderRadius="1.5rem"
            duration={4}
          >
            Crear Cuenta Gratis →
          </Button>
        </div>
      </section>
    </main>
  );
}

const testimonials = [
  {
    quote: "Portfolio2 transformó completamente nuestro workflow. La automatización con n8n es increíble.",
    name: "María González",
    title: "CEO, Digital Studios",
  },
  {
    quote: "La gestión de leads nunca fue tan fácil. Aumentamos nuestra conversión en 40% en 3 meses.",
    name: "Carlos Ruiz",
    title: "Director, Marketing Agency",
  },
  {
    quote: "El dashboard en tiempo real nos permite tomar decisiones rápidas basadas en datos reales.",
    name: "Ana Martínez",
    title: "COO, Creative Lab",
  },
  {
    quote: "Excelente integración con Supabase. La seguridad y velocidad son impresionantes.",
    name: "Jorge López",
    title: "CTO, Tech Solutions",
  },
  {
    quote: "El sistema de team management con roles es perfecto para nuestra estructura organizacional.",
    name: "Laura Fernández",
    title: "PM, Design Studio",
  },
];
