Manual de Implementación Técnica Fase 1: Arquitectura de Agencia Digital Moderna
Next.js 15, Tailwind CSS v4, Aceternity UI, Supabase y n8n
1. Visión General Ejecutiva y Estrategia Tecnológica
Este documento constituye el manual definitivo para la implementación técnica de la Fase 1 de la infraestructura digital de la agencia. El objetivo primordial es establecer una base tecnológica robusta, escalable y de alto rendimiento, utilizando un stack de "borde tecnológico" (bleeding-edge) que combina Next.js 15, Tailwind CSS v4, Aceternity UI, Supabase y n8n.
La selección de esta arquitectura no es arbitraria; responde a una necesidad estratégica de desacoplar la lógica de negocio compleja de la capa de presentación, permitiendo una iteración visual rápida sin comprometer la integridad de los datos. La adopción de Next.js 15 (con el Release Candidate de React 19) y Tailwind CSS v4 posiciona a la agencia en la vanguardia del desarrollo web, garantizando longevidad y rendimiento, aunque introduce desafíos de compatibilidad específicos que este manual resolverá detalladamente. Supabase actúa como la columna vertebral de datos e identidad, eliminando la necesidad de mantener servidores de autenticación dedicados, mientras que n8n democratiza la lógica backend, permitiendo que los flujos de trabajo se adapten a la velocidad del negocio.
Este manual aborda exhaustivamente la configuración del entorno, la arquitectura de componentes, los patrones de autenticación asíncrona (críticos en Next.js 15) y la integración de sistemas de automatización, proporcionando una hoja de ruta técnica para el equipo de ingeniería.
2. Arquitectura del Sistema y Flujo de Datos
La arquitectura propuesta sigue un modelo Centrado en el Servidor y Orientado a Eventos. A diferencia de las SPAs (Single Page Applications) tradicionales, donde el cliente carga con el peso del procesamiento, este modelo aprovecha los Server Components (RSC) de React para renderizar HTML estático y dinámico en el borde, reduciendo drásticamente el Tiempo de Primera Interacción (TTI).
2.1 Diagrama de Flujo de Datos
El flujo de información se ha diseñado para maximizar la seguridad y minimizar la latencia.
Capa de Cliente (Navegador): El usuario interactúa con la interfaz rica en animaciones proporcionada por Aceternity UI. Las interacciones no son simples llamadas API RESTful, sino invocaciones a Server Actions, que ofrecen una seguridad de tipos de extremo a extremo y eliminan la necesidad de gestionar manualmente estados de carga y errores de red básicos.
Capa de Aplicación (Next.js 15):
Middleware: Intercepta cada solicitud entrante para validar la sesión JWT contra Supabase Auth antes de que se renderice cualquier componente o se ejecute cualquier lógica.1
Server Components: Recuperan datos directamente de la base de datos de Supabase utilizando conexiones directas o clientes RPC, sin exponer secretos de API al cliente.
Server Actions: Actúan como controladores de mutación. Al recibir datos de un formulario (ej. "Nuevo Lead"), validan la entrada con Zod y proceden a insertar datos en Supabase o invocar webhooks de n8n.
Capa de Datos (Supabase):
PostgreSQL: No es solo un almacén de datos; actúa como un bus de eventos. Mediante la extensión pg_net y Triggers de base de datos, Supabase puede invocar flujos de trabajo externos automáticamente cuando los datos cambian, desacoplando la respuesta al usuario del procesamiento backend.2
Autenticación: Gestiona el ciclo de vida de los tokens (Access/Refresh) y las políticas de seguridad a nivel de fila (RLS).
Capa de Automatización (n8n):
Orquestación: Recibe cargas útiles (payloads) de Supabase o Next.js. Ejecuta lógica de negocio compleja (enriquecimiento de leads, sincronización con CRM, notificaciones Slack).
Escritura Diferida: Una vez completado el proceso, n8n utiliza la API de Supabase (Service Role) para actualizar el estado de los registros, cerrando el bucle de información.
2.2 Comparativa de Responsabilidades de Componentes
Componente
Tecnología Base
Responsabilidad Principal
Interacción Crítica
Frontend
Next.js 15 (App Router)
Renderizado, Enrutamiento, Estado UI
React 19 RC, Framer Motion v12
Estilizado
Tailwind CSS v4
Sistema de Diseño, Tokens Visuales
Motor Rust, Variables CSS Nativas
Componentes
Aceternity UI
Identidad Visual, Micro-interacciones
framer-motion, clsx
Persistencia
Supabase (Postgres)
Integridad de Datos, Seguridad (RLS)
pg_net, Webhooks
Lógica Negocio
n8n (Self-Hosted)
Integraciones, Procesos Asíncronos
Docker, Webhooks

3. Configuración del Entorno y Resolución de Conflictos Iniciales
El uso de versiones "Alpha" y "Release Candidate" (React 19, Tailwind v4) requiere una configuración meticulosa para evitar conflictos de dependencias y errores de compilación.
3.1 Inicialización del Proyecto Next.js 15
Iniciamos el proyecto asegurando la estructura de carpetas moderna y el soporte estricto de TypeScript.

Bash


npx create-next-app@latest agencia-platform \
  --typescript \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"


Nota Crítica sobre Instalación: Durante el asistente de instalación, se recomienda seleccionar NO a la instalación automática de Tailwind CSS si se planea usar la versión 4, ya que el instalador predeterminado configura la versión 3.4. La instalación manual descrita a continuación garantiza la configuración correcta del motor Oxide de Tailwind v4.3
3.2 Implementación de Tailwind CSS v4 (Híbrido)
Tailwind v4 representa un cambio de paradigma, moviendo la configuración de JavaScript a CSS nativo. Sin embargo, Aceternity UI depende de utilidades heredadas como flattenColorPalette que requieren acceso a la configuración de tema en JavaScript. Por lo tanto, implementaremos una arquitectura de configuración híbrida.4
Paso 1: Instalación de Dependencias v4
Instalamos el paquete principal y el plugin de PostCSS específico para v4.

Bash


npm install tailwindcss @tailwindcss/postcss postcss


Paso 2: Configuración de PostCSS (postcss.config.mjs)
Es vital usar la extensión .mjs para compatibilidad con el sistema de módulos de Next.js 15.

JavaScript


const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;


Paso 3: Configuración CSS Global (src/app/globals.css)
En v4, la directiva @import "tailwindcss"; reemplaza a las antiguas directivas @tailwind. Configuramos las variables de tema aquí.

CSS


@import "tailwindcss";

@theme {
  --font-sans: "Inter", "sans-serif";
  --color-primary: oklch(0.5 0.2 240); /* Uso de espacio de color moderno */
  
  /* Animaciones personalizadas requeridas por Aceternity (ej. Infinite Cards) */
  --animate-scroll: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
  
  @keyframes scroll {
    to {
      transform: translate(calc(-50% - 0.5rem));
    }
  }
}

/* Forzar escaneo de archivos para compatibilidad con librerías externas */
@source "../**/*.{js,ts,jsx,tsx}";


6
Paso 4: Puente de Compatibilidad (Legacy Config)
Para que los componentes de Aceternity como "Background Beams" funcionen, necesitamos inyectar las variables de color de Tailwind en el :root de CSS. Esto requiere mantener un tailwind.config.ts minimalista que utilice los plugins de utilidad antiguos, aunque el motor principal sea v4.8

TypeScript


// tailwind.config.ts
import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  plugins: [
    addVariablesForColors, // Plugin personalizado para Aceternity
  ],
};

// Plugin crítico para Aceternity UI
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;


3.3 Resolución del Conflicto React 19 / Framer Motion
Este es el punto de fricción más común en el stack actual. Next.js 15 utiliza React 19 RC. La versión estable actual de framer-motion (v11) está construida para React 18 y genera errores de "Invalid hook call" o fallos de hidratación debido a cambios internos en React (como la gestión de useRef y forwardRef).9
Solución Obligatoria:
Se debe instalar la versión Alpha de Framer Motion v12, que ha sido reescrita para soportar React 19 y reducir el tamaño del bundle.

Bash


npm install framer-motion@12.0.0-alpha.1


Si se presentan errores de dependencias entre pares (peer dependencies) al instalar otros paquetes, se debe añadir una anulación (override) en el package.json para forzar la resolución de React:

JSON


"overrides": {
  "framer-motion": {
    "react": "19.0.0-rc-66855b96-20241106", 
    "react-dom": "19.0.0-rc-66855b96-20241106"
  }
}


Reemplace el hash del RC con la versión exacta instalada en su package.json.10
4. Integración Profunda de Aceternity UI
Aceternity UI no es una biblioteca de componentes tradicional; es una colección de patrones de diseño copiar-pegar. Esto ofrece flexibilidad pero requiere una integración manual cuidadosa, especialmente con TypeScript y las utilidades de clase.
4.1 Infraestructura de Utilidades
Todos los componentes de Aceternity dependen de una utilidad cn (classname) para fusionar clases de Tailwind de manera inteligente (evitando conflictos de especificidad).12
Archivo: src/lib/utils.ts

TypeScript


import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue) {
  return twMerge(clsx(inputs));
}


Dependencias: npm install clsx tailwind-merge
4.2 Componente: Bento Grid (Implementación Detallada)
El Bento Grid es esencial para mostrar servicios o portafolios de manera moderna. La implementación requiere dos subcomponentes: el contenedor de la grilla y el ítem individual.
Archivo: src/components/ui/bento-grid.tsx

13

TypeScript


import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};


4.3 Componente: Background Beams (Gestión de Hidratación)
El componente "Background Beams" utiliza cálculos complejos de SVG y Framer Motion. Un problema común es el Error de Hidratación ("Hydration failed because the initial UI does not match what was rendered on the server"). Esto ocurre porque las posiciones aleatorias o los cálculos de ventana (window) difieren entre el servidor (SSR) y el cliente.15
Estrategia de Mitigación:
Carga Diferida (Lazy Loading): Usar next/dynamic para cargar el componente solo en el cliente.
Supresión de Advertencias: Si el desajuste es benigno (ej. atributos de fecha o IDs aleatorios), se puede usar suppressHydrationWarning.

TypeScript


// Ejemplo de uso seguro en src/app/page.tsx
'use client';
import dynamic from 'next/dynamic';

// Deshabilitar SSR para este componente visual pesado
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams').then(mod => mod.BackgroundBeams),
  { ssr: false }
);

export default function Hero() {
  return (
    <div className="h-[40rem] w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Agencia Digital Fase 1
        </h1>
      </div>
      <BackgroundBeams /> 
    </div>
  );
}


5. Backend Supabase: Autenticación SSR y Middleware
La integración de Supabase en Next.js 15 presenta desafíos únicos debido a la naturaleza asíncrona de las cookies en los Server Components. El paquete @supabase/auth-helpers-nextjs está obsoleto y debe usarse @supabase/ssr.17
5.1 Configuración de Clientes
Se requieren tres clientes distintos para manejar los diferentes contextos de ejecución de Next.js: Cliente (Navegador), Servidor (RSC/Actions) y Middleware.
1. Cliente de Servidor (src/lib/supabase/server.ts)
Este archivo es crítico. En Next.js 15, la función cookies() devuelve una Promesa y debe ser esperada (await). No hacerlo provocará errores en tiempo de ejecución.

TypeScript


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // AWAIT OBLIGATORIO EN NEXT 15

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El método setAll fue llamado desde un Server Component.
            // Esto se ignora porque el Middleware maneja el refresco de sesión.
          }
        },
      },
    }
  )
}


18
2. Cliente de Middleware (src/lib/supabase/middleware.ts)
El middleware actúa como guardián de la sesión. Su función principal no es solo proteger rutas, sino refrescar el token de autenticación antes de que la solicitud llegue a los Server Components. Si el token expira y no se refresca aquí, los Server Components fallarán al intentar acceder a datos protegidos.1

TypeScript


import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Crear respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Cliente Supabase para Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Sincronizar cookies entre Request y Response
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 3. Verificación de Usuario
  // IMPORTANTE: getUser() valida el token contra el servidor de Supabase.
  // getSession() NO es seguro para validación de servidor.
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Lógica de Protección de Rutas
  if (
   !user &&
   !request.nextUrl.pathname.startsWith('/login') &&
   !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}


3. Archivo Middleware Principal (src/middleware.ts)
Conecta la lógica de actualización de sesión con el ciclo de vida de Next.js.

TypeScript


import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Excluir archivos estáticos e imágenes para no sobrecargar el middleware
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


6. Automatización con n8n y Patrones de Integración
n8n permite a la agencia implementar lógica de negocio compleja sin necesidad de desplegar nuevo código en Next.js. Para una agencia digital, esto significa poder cambiar flujos de leads, notificaciones y reportes en tiempo real.
6.1 Estrategia de Despliegue: Self-Hosted
Para mantener la soberanía de los datos y evitar límites de ejecución, se recomienda desplegar n8n mediante Docker en un VPS independiente (ej. Railway, DigitalOcean, Hetzner).
Comando de Despliegue Docker:

Bash


docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=seguro_password \
  n8nio/n8n


6.2 Patrón de Integración: Disparador de Base de Datos (Database Trigger)
El patrón más robusto para integrar Supabase con n8n no es llamar al webhook desde el cliente (inseguro y dependiente de la red del usuario), sino desde la base de datos. Usaremos la extensión pg_net de Supabase para disparar webhooks de n8n automáticamente cuando se insertan datos.2
Ventajas:
Atomicidad: La automatización solo se dispara si los datos se guardan correctamente.
Rendimiento: El usuario recibe respuesta inmediata de la UI; el proceso de n8n corre en segundo plano.
Implementación SQL en Supabase:

SQL


-- 1. Habilitar extensión para peticiones HTTP
create extension if not exists pg_net;

-- 2. Función Trigger
create or replace function trigger_n8n_lead()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://n8n.agencia.com/webhook/nuevo-lead',
    body := jsonb_build_object('record', new),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  return new;
end;
$$ language plpgsql;

-- 3. Asociar Trigger a la tabla 'leads'
create trigger on_lead_created
  after insert on leads
  for each row
  execute function trigger_n8n_lead();


Este patrón asegura que cada vez que un Server Action en Next.js inserte un lead, n8n recibirá instantáneamente los datos para procesarlos (enviarlos a Slack, CRM, Email Marketing).
7. Seguridad, RLS y Políticas de Acceso
En esta arquitectura, la seguridad se gestiona a nivel de base de datos mediante Row Level Security (RLS). Next.js simplemente pasa el token del usuario a Supabase, y Postgres decide qué datos retornar.
7.1 Políticas RLS Ejemplo
Para una tabla de projects donde los clientes solo ven sus propios proyectos y los administradores ven todos:

SQL


-- Habilitar RLS
alter table projects enable row level security;

-- Política de lectura para clientes
create policy "Clientes ven sus propios proyectos"
on projects for select
using ( auth.uid() = client_id );

-- Política para administradores (usando Custom Claims o tabla de roles)
create policy "Admins ven todo"
on projects for all
using ( 
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);


8. Protocolo de Resolución de Problemas Comunes
Bucle Infinito en Autenticación:
Síntoma: El navegador parpadea entre /dashboard y /login.
Causa: El middleware redirige a login porque no encuentra cookie, pero la página de login redirige a dashboard porque encuentra sesión local.
Solución: Verificar que matcher en middleware.ts excluye archivos estáticos y que la lógica !user maneja correctamente las rutas públicas. Asegurarse de usar request.cookies.set Y response.cookies.set en updateSession.
Estilos de Aceternity Rotos:
Síntoma: Componentes sin estilo o colores por defecto.
Causa: La configuración híbrida de Tailwind v4 no está inyectando las variables CSS.
Solución: Verificar que addVariablesForColors en tailwind.config.ts se está ejecutando y que el archivo está referenciado en el build. Confirmar que flattenColorPalette está importado correctamente (requiere compatibilidad Node).
Errores de Despliegue en Vercel (Next 15):
Síntoma: "Error: cookies was called outside a request scope".
Causa: Componentes asíncronos no esperados o uso de APIs de cookies en layout sin await.
Solución: Revisar todos los await cookies() y asegurarse de que el componente padre es async.
9. Conclusión y Siguientes Pasos
Esta Fase 1 establece una infraestructura que rivaliza con las grandes plataformas SaaS en términos de modernidad y eficiencia. Al resolver proactivamente los conflictos entre React 19, Framer Motion y Next.js 15, y al implementar un patrón de autenticación robusto con Supabase, la agencia está preparada para escalar.
Próximos pasos inmediatos:
Desplegar la instancia de n8n y configurar el túnel seguro.
Implementar el esquema de base de datos inicial en Supabase.
Poblar el catálogo de componentes Aceternity adaptados a la marca.
