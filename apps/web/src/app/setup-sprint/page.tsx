import { Metadata } from 'next'
import Link from 'next/link'
import { BentoGrid, BentoGridItem } from '@portfolio2/ui'

export const metadata: Metadata = {
  title: 'Setup Sprint de 7 Días - $1,000 | Growth Engine Completo',
  description: 'Despliega tu infraestructura digital en 7 días. Landing ultrarrápida + Base de datos + Automatización. Precio fijo: $1,000 USD.',
}

export default function SetupSprintPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Hero con Pricing Anclado */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-neutral-950 to-purple-900/20" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge de urgencia */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              🚀 Entrega Garantizada en 7 Días
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400">
            Growth Engine Setup Sprint
          </h1>
          
          <p className="text-xl text-neutral-400 text-center mb-8 max-w-3xl mx-auto">
            Infraestructura digital completa para capturar, gestionar y convertir leads automáticamente.
            Sin proyectos interminables. Sin costos ocultos.
          </p>

          {/* Price Anchoring Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-neutral-500 text-sm line-through">Desarrollo a Medida</p>
                  <p className="text-3xl font-bold text-neutral-300">$3,500 - $5,000</p>
                  <p className="text-neutral-500 text-sm mt-1">4-6 semanas de desarrollo</p>
                </div>
                <div className="text-6xl">→</div>
                <div>
                  <p className="text-green-400 text-sm font-semibold">Setup Sprint Productizado</p>
                  <p className="text-5xl font-bold text-white">$1,000</p>
                  <p className="text-green-400 text-sm mt-1">7 días garantizados</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-neutral-400 text-sm">
                  <strong className="text-neutral-200">Ahorra $2,500+</strong> usando mi arquitectura modular pre-validada.
                  La misma potencia tecnológica, sin reinventar la rueda.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://buy.stripe.com/test_placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition text-center text-lg"
            >
              Comprar Ahora - $1,000
            </a>
            <Link
              href="/contacto"
              className="px-8 py-4 bg-neutral-900 border border-neutral-700 text-white font-semibold rounded-lg hover:border-neutral-500 transition text-center text-lg"
            >
              Consultar Primero
            </Link>
          </div>

          <p className="text-center text-neutral-500 text-sm mt-4">
            💳 Pago seguro con Stripe · 🔒 Garantía de devolución si no entrego en 7 días
          </p>
        </div>
      </section>

      {/* Qué Incluye */}
      <section className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            ¿Qué incluye el Sprint?
          </h2>
          <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
            Un sistema completo de generación de leads. No solo una "página web".
          </p>

          <BentoGrid>
            <BentoGridItem
              title="Landing Page de Alto Rendimiento"
              description="Next.js 15 con Core Web Vitals perfectos. Carga en <1 segundo. SEO técnico optimizado. Aceternity UI premium."
              header={
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <span className="text-6xl">⚡</span>
                </div>
              }
              className="md:col-span-2"
            />
            
            <BentoGridItem
              title="Base de Datos PostgreSQL"
              description="Supabase con tablas de Leads, Row Level Security y backups automáticos. Propiedad total de tus datos."
              header={
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg">
                  <span className="text-6xl">🗄️</span>
                </div>
              }
            />

            <BentoGridItem
              title="Automatización Instantánea"
              description="2 workflows n8n: Respuesta automática + Notificación a tu equipo. Nunca pierdas un lead."
              header={
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <span className="text-6xl">🤖</span>
                </div>
              }
              className="md:col-span-1"
            />

            <BentoGridItem
              title="Deploy Completo en Vercel"
              description="SSL automático, dominio custom, CDN global. Variables de entorno configuradas. Listo para producción."
              header={
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
                  <span className="text-6xl">🚀</span>
                </div>
              }
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Comparativa: Tú vs Agencia */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Setup Sprint vs Agencia Tradicional
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Agencia Tradicional */}
            <div className="bg-neutral-900 border border-red-900/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-2xl">
                  😰
                </div>
                <h3 className="text-xl font-bold text-neutral-300">Agencia Tradicional</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">❌</span>
                  <div>
                    <strong className="text-neutral-200">$3,500 - $8,000</strong>
                    <p className="text-neutral-500 text-sm">Presupuesto inicial alto</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">❌</span>
                  <div>
                    <strong className="text-neutral-200">4-8 semanas</strong>
                    <p className="text-neutral-500 text-sm">Desarrollo lento</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">❌</span>
                  <div>
                    <strong className="text-neutral-200">Propuestas personalizadas</strong>
                    <p className="text-neutral-500 text-sm">Negociación interminable</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">❌</span>
                  <div>
                    <strong className="text-neutral-200">Scope creep</strong>
                    <p className="text-neutral-500 text-sm">Costos ocultos y cambios constantes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">❌</span>
                  <div>
                    <strong className="text-neutral-200">Mantenimiento caro</strong>
                    <p className="text-neutral-500 text-sm">Dependencia del proveedor</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Setup Sprint */}
            <div className="bg-neutral-900 border border-green-900/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-white">Setup Sprint</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <strong className="text-white">$1,000 fijo</strong>
                    <p className="text-neutral-400 text-sm">Sin sorpresas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <strong className="text-white">7 días garantizados</strong>
                    <p className="text-neutral-400 text-sm">O te devuelvo el dinero</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <strong className="text-white">Alcance pre-definido</strong>
                    <p className="text-neutral-400 text-sm">Sabes exactamente qué recibes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <strong className="text-white">Arquitectura productizada</strong>
                    <p className="text-neutral-400 text-sm">Probada en producción</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <strong className="text-white">Stack moderno</strong>
                    <p className="text-neutral-400 text-sm">Next.js 15 + Supabase + n8n</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">
            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <summary className="font-semibold text-white cursor-pointer">
                ¿Qué pasa si necesito cambios después de los 7 días?
              </summary>
              <p className="text-neutral-400 mt-4">
                El Setup Sprint entrega la infraestructura base funcional. Cambios menores de contenido son gratis durante los primeros 14 días.
                Nuevas features (integraciones adicionales, más workflows) se cotizan por separado.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <summary className="font-semibold text-white cursor-pointer">
                ¿Los datos son míos o están en tu servidor?
              </summary>
              <p className="text-neutral-400 mt-4">
                100% tuyos. Configuro tu propia instancia de Supabase bajo tu cuenta. Tienes control total.
                Yo solo tengo acceso temporal durante el sprint.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <summary className="font-semibold text-white cursor-pointer">
                ¿Qué necesito proporcionar?
              </summary>
              <p className="text-neutral-400 mt-4">
                Logo, colores de marca, textos del sitio y acceso a tu dominio (si ya tienes uno).
                Si no tienes dominio, te ayudo a configurar uno nuevo.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <summary className="font-semibold text-white cursor-pointer">
                ¿Puedo cancelar el Sprint una vez iniciado?
              </summary>
              <p className="text-neutral-400 mt-4">
                Sí. Si no estás satisfecho en las primeras 48 horas, devuelvo el 100% del pago.
                Después de 48h, se aplica una política de reembolso proporcional.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <summary className="font-semibold text-white cursor-pointer">
                ¿Qué costos mensuales tendré después?
              </summary>
              <p className="text-neutral-400 mt-4">
                Supabase Free Tier (hasta 500MB): $0<br />
                Vercel Hobby: $0<br />
                n8n Cloud Starter: $0 (5 workflows)<br />
                Dominio: ~$12/año<br />
                <strong className="text-white">Total: ~$1/mes en fase inicial.</strong> Escala cuando crezcas.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para tu Growth Engine?
          </h2>
          <p className="text-xl text-neutral-400 mb-8">
            Paga hoy, recibe tu infraestructura completa en 7 días. Sin riesgos.
          </p>
          
          <a
            href="https://buy.stripe.com/test_placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition text-xl"
          >
            Iniciar Setup Sprint - $1,000
          </a>

          <p className="text-neutral-500 text-sm mt-6">
            Prefieres hablar primero? <Link href="/contacto" className="text-blue-400 hover:underline">Agenda una llamada</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
