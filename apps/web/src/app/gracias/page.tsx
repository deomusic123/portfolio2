import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¡Gracias por tu compra! | Setup Sprint',
  description: 'Tu Setup Sprint ha sido confirmado. Te contactaremos en las próximas 24 horas.',
}

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ¡Pago Confirmado!
        </h1>
        
        <p className="text-xl text-neutral-400 mb-8">
          Tu Setup Sprint ha sido reservado exitosamente.
        </p>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            📋 Próximos Pasos
          </h2>
          
          <ol className="text-left space-y-4 text-neutral-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                1
              </span>
              <div>
                <strong className="text-white">Revisa tu email</strong>
                <p className="text-neutral-400 text-sm">
                  Te enviamos un formulario de onboarding para recopilar logos, colores y contenido.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                2
              </span>
              <div>
                <strong className="text-white">Completa el formulario (10 min)</strong>
                <p className="text-neutral-400 text-sm">
                  Cuanto más rápido lo completes, más rápido iniciamos el desarrollo.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                3
              </span>
              <div>
                <strong className="text-white">Desarrollo en 7 días</strong>
                <p className="text-neutral-400 text-sm">
                  Recibirás actualizaciones diarias del progreso.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold">
                ✓
              </span>
              <div>
                <strong className="text-white">Entrega y capacitación</strong>
                <p className="text-neutral-400 text-sm">
                  Tu Growth Engine listo para capturar leads + 30 min de onboarding en vivo.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-neutral-900 border border-neutral-700 text-white font-semibold rounded-lg hover:border-neutral-500 transition"
          >
            ← Volver al inicio
          </Link>
          <a
            href="mailto:hola@tudominio.com"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            📧 Contactar soporte
          </a>
        </div>

        <p className="text-neutral-500 text-sm mt-8">
          Recibo de pago enviado a tu email · Cualquier duda: WhatsApp +54 9 11 XXXX-XXXX
        </p>
      </div>
    </div>
  )
}
