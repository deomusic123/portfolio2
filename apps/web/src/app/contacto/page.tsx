import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/contact-form'

export const metadata: Metadata = {
  title: 'Contacto | Agencia Digital',
  description: 'Cuéntanos tu proyecto. Respuesta en menos de 24 horas.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
          Hablemos de tu proyecto
        </h1>
        <p className="text-neutral-400 text-center mb-12 text-lg">
          Completa el formulario y te responderemos en menos de 24 horas
        </p>

        <ContactForm />

        {/* Info adicional */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Email</h3>
            <p className="text-neutral-400">hola@agencia.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Teléfono</h3>
            <p className="text-neutral-400">+54 9 11 1234-5678</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Horario</h3>
            <p className="text-neutral-400">Lun-Vie 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
