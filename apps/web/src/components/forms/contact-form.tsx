'use client'

import { useActionState } from 'react'
import { submitLead } from '@/actions/submit-lead'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitLead, null)

  return (
    <form action={formAction} className="space-y-6 max-w-lg mx-auto">
      {/* Mensaje de éxito */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>{state.message}</p>
          </div>
        </div>
      )}

      {/* Errores generales */}
      {state?.errors && '_form' in state.errors && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{state.errors._form.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Campo: Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
          Nombre completo *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Juan Pérez"
        />
        {state?.errors && 'name' in state.errors && state.errors.name && (
          <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Campo: Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="juan@empresa.com"
        />
        {state?.errors && 'email' in state.errors && state.errors.email && (
          <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Campo: Teléfono (Opcional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-200 mb-2">
          Teléfono (opcional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="+54 9 11 1234-5678"
        />
      </div>

      {/* Campo: Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-200 mb-2">
          ¿En qué podemos ayudarte? *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          placeholder="Cuéntanos sobre tu proyecto..."
        />
        {state?.errors && 'message' in state.errors && state.errors.message && (
          <p className="mt-1 text-sm text-red-400">{state.errors.message[0]}</p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Enviar mensaje</span>
          </>
        )}
      </button>

      <p className="text-neutral-500 text-xs text-center">
        Al enviar este formulario, aceptas nuestra política de privacidad.
        Respuesta típica en menos de 24 horas.
      </p>
    </form>
  )
}
