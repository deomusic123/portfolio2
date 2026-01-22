# 🚀 Despliegue de n8n para Setup Sprint

## Opción 1: Railway (Recomendado - 5 minutos)

### Paso 1: Crear cuenta en Railway
```bash
# Visitar: https://railway.app
# Conectar con GitHub
```

### Paso 2: Deploy con Template
```bash
# 1. Ir a: https://railway.app/template/n8n
# 2. Click "Deploy Now"
# 3. Configurar variables:
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://tu-app-n8n.up.railway.app/
```

### Paso 3: Obtener URL
```bash
# Railway genera automáticamente:
# https://tu-app-n8n.up.railway.app

# Guardar esta URL en .env.local:
N8N_WEBHOOK_BASE_URL=https://tu-app-n8n.up.railway.app
```

---

## Opción 2: Docker Local (Desarrollo)

### Paso 1: Crear docker-compose.yml
```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=seguro123
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Argentina/Buenos_Aires
    volumes:
      - ./n8n_data:/home/node/.n8n
```

### Paso 2: Iniciar n8n
```powershell
# En la raíz del proyecto
docker-compose up -d

# Verificar que está corriendo
docker ps

# Ver logs
docker logs n8n -f
```

### Paso 3: Acceder
```
URL: http://localhost:5678
Usuario: admin
Password: seguro123
```

---

## Workflows Pre-configurados

### Workflow 1: Nuevo Lead → Email + Slack

**Importar JSON:**
```json
{
  "name": "Nuevo Lead - Notificación",
  "nodes": [
    {
      "parameters": {
        "path": "nuevo-lead",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "nombre",
              "value": "={{$json.record.name}}"
            },
            {
              "name": "email",
              "value": "={{$json.record.email}}"
            },
            {
              "name": "mensaje",
              "value": "={{$json.record.notes}}"
            }
          ]
        }
      },
      "name": "Set",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "fromEmail": "noreply@tudominio.com",
        "toEmail": "admin@tudominio.com",
        "subject": "🚨 Nuevo Lead: {{$json.nombre}}",
        "text": "Nombre: {{$json.nombre}}\nEmail: {{$json.email}}\n\nMensaje:\n{{$json.mensaje}}"
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [650, 200]
    },
    {
      "parameters": {
        "channel": "#leads",
        "text": "Nuevo lead: *{{$json.nombre}}* ({{$json.email}})"
      },
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [650, 400]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Set", "type": "main", "index": 0}]]
    },
    "Set": {
      "main": [
        [
          {"node": "Send Email", "type": "main", "index": 0},
          {"node": "Slack", "type": "main", "index": 0}
        ]
      ]
    }
  }
}
```

**Pasos:**
1. En n8n, ir a "Workflows" → "Import from File"
2. Pegar el JSON
3. Configurar credenciales SMTP y Slack
4. Activar workflow
5. Copiar URL del webhook

---

## Actualizar Trigger en Supabase

```sql
-- Reemplazar URL placeholder con tu URL real de n8n
CREATE OR REPLACE FUNCTION trigger_n8n_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://tu-app-n8n.up.railway.app/webhook/nuevo-lead',
    body := jsonb_build_object('record', new),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;
```

---

## Testing del Flujo Completo

```bash
# 1. Insertar lead de prueba en Supabase
INSERT INTO leads (name, email, notes, source, status)
VALUES ('Test User', 'test@example.com', 'Mensaje de prueba', 'contact_form', 'new');

# 2. Verificar en n8n → Executions
# Debe aparecer una ejecución exitosa

# 3. Revisar email y Slack
# Debe llegar notificación
```

---

## Configurar Stripe Payment Link

### Paso 1: Crear cuenta Stripe
```
https://dashboard.stripe.com/register
```

### Paso 2: Crear Payment Link
```
1. Dashboard → Payment Links → Create
2. Producto: "Setup Sprint de 7 Días"
3. Precio: $1,000 USD
4. Tipo: One-time payment
5. Success URL: https://tudominio.com/gracias
6. Cancel URL: https://tudominio.com/setup-sprint
```

### Paso 3: Obtener URL
```
# Ejemplo:
https://buy.stripe.com/test_xxxxxxxxxxxxx

# Reemplazar en setup-sprint/page.tsx:
href="https://buy.stripe.com/test_xxxxxxxxxxxxx"
```

### Paso 4: Webhook para Auto-Onboarding (Opcional)
```typescript
// apps/web/src/app/api/webhooks/stripe/route.ts
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // TODO: Enviar email con Typeform de onboarding
      // TODO: Crear proyecto en Supabase
      // TODO: Notificar en Slack
    }
    
    return Response.json({ received: true })
  } catch (err) {
    return Response.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

---

## Checklist Final

- [ ] n8n desplegado y accesible
- [ ] Workflow "Nuevo Lead" importado y activado
- [ ] Trigger SQL actualizado con URL real
- [ ] Lead de prueba insertado y notificación recibida
- [ ] Stripe Payment Link creado
- [ ] URL de Stripe actualizada en /setup-sprint
- [ ] Página de "gracias" creada en /gracias

---

## Costos Mensuales

| Servicio | Plan | Costo |
|----------|------|-------|
| Railway (n8n) | Hobby | $5/mes |
| Supabase | Free | $0 |
| Vercel | Hobby | $0 |
| Stripe | Pay-as-you-go | 2.9% + $0.30 por transacción |
| **Total** | | **~$5-10/mes** |

---

## Soporte

Si tienes problemas:
1. Revisar logs: `docker logs n8n -f`
2. Verificar conectividad: `curl https://tu-n8n.railway.app`
3. Testear webhook: Usar Postman o curl
4. Consultar docs: https://docs.n8n.io
