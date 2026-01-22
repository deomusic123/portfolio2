'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const leadSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensaje muy corto').max(1000),
  source: z.literal('contact_form'),
})

type LeadInput = z.infer<typeof leadSchema>

export async function submitLead(prevState: any, formData: FormData) {
  // 1. Validación de entrada
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    message: formData.get('message'),
    source: 'contact_form' as const,
  }

  const validation = leadSchema.safeParse(rawData)
  
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    // 2. Conexión a Supabase (sin autenticación requerida)
    const supabase = await createClient()

    // 3. Inserción en base de datos
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        notes: validation.data.message,
        source: validation.data.source,
        status: 'new',
        client_id: null, // Leads públicos sin usuario autenticado
      })
      .select()
      .single()

    if (error) {
      console.error('Error insertando lead:', error)
      return {
        success: false,
        errors: { _form: ['Error al enviar. Intenta de nuevo.'] },
      }
    }

    // 4. MOCK: Simular notificación n8n (hasta tener servidor)
    // TODO: Reemplazar con trigger pg_net cuando n8n esté desplegado
    await mockN8nNotification(lead)

    // 5. Revalidar para mostrar agradecimiento
    revalidatePath('/contacto')

    return {
      success: true,
      message: '¡Mensaje enviado! Te contactaremos pronto.',
      leadId: lead.id,
    }
  } catch (error) {
    console.error('Error inesperado:', error)
    return {
      success: false,
      errors: { _form: ['Error del servidor. Intenta más tarde.'] },
    }
  }
}

/**
 * Mock temporal: simula webhook n8n
 * En producción con n8n, el trigger pg_net manejará esto automáticamente
 */
async function mockN8nNotification(lead: any) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔔 [MOCK n8n] Nuevo Lead Recibido')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Detalles:')
  console.log('  • ID:', lead.id)
  console.log('  • Nombre:', lead.name)
  console.log('  • Email:', lead.email)
  console.log('  • Teléfono:', lead.phone || 'No proporcionado')
  console.log('  • Mensaje:', lead.notes)
  console.log('  • Fuente:', lead.source)
  console.log('  • Timestamp:', new Date().toISOString())
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Acciones simuladas (en producción con n8n real):')
  console.log('  ✓ Email enviado a admin@tudominio.com')
  console.log('  ✓ Notificación enviada a Slack #leads')
  console.log('  ✓ Email de bienvenida enviado a', lead.email)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // En producción con n8n desplegado, esto sería:
  /*
  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record: lead }),
  })
  */
}
