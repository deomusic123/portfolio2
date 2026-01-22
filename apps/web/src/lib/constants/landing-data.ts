import { ReactNode } from 'react';

// Use Cases Data
export interface UseCase {
  quote: ReactNode;
  name: string;
  title: string;
}

export const USE_CASES: UseCase[] = [
  {
    quote: (
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Velocidad Extrema</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            De formulario a CRM en <span className="text-pink-400 font-bold">60 segundos</span>. Enriquecimiento de datos automático sin intervención humana.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">TECH STACK</span>
          <span className="px-3 py-1.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300">n8n + Supabase</span>
        </div>
      </div>
    ),
    name: "Lead Management",
    title: "Workflow Automation",
  },
  {
    quote: (
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Escalado Infinito</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Arquitectura Multi-Tenant. Añade <span className="text-emerald-400 font-bold">+100 clientes</span> sin duplicar bases de datos ni aumentar costos.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">TECH STACK</span>
          <span className="px-3 py-1.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300">RLS + Postgres</span>
        </div>
      </div>
    ),
    name: "Infrastructure",
    title: "Scalability",
  },
  {
    quote: (
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Reportes Instantáneos</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Dashboards de cliente generados <span className="text-blue-400 font-bold">cada semana</span> automáticamente. Métricas de rendimiento exportadas a PDF sin trabajo manual.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">TECH STACK</span>
          <span className="px-3 py-1.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300">Analytics + Email</span>
        </div>
      </div>
    ),
    name: "Client Reporting",
    title: "Automation",
  },
  {
    quote: (
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Sincronización Real-Time</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Comentarios, @menciones y actualizaciones en <span className="text-cyan-400 font-bold">&lt;100ms</span>. Colaboración sin recargar navegador.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">TECH STACK</span>
          <span className="px-3 py-1.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300">WebSockets + DB</span>
        </div>
      </div>
    ),
    name: "Team Communication",
    title: "Real-time Sync",
  },
  {
    quote: (
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Crecimiento Sin Fricción</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Onboarding de nuevo cliente en <span className="text-purple-400 font-bold">15 minutos</span>. Template optimizado que escala sin overhead adicional.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">TECH STACK</span>
          <span className="px-3 py-1.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300">Turborepo + Next</span>
        </div>
      </div>
    ),
    name: "Growth Operations",
    title: "Architecture",
  },
];

// Tech Stack Data
export interface TechCard {
  name: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}

export const TECH_STACK: TechCard[] = [
  {
    name: "Next.js 15",
    subtitle: "Hyper-Performance UI",
    color: "white",
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.213c-.075.038-.14.045-.495.045H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z"/>
      </svg>
    ),
  },
  {
    name: "Supabase",
    subtitle: "Real-time Database",
    color: "emerald",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.223 15.215c-.245.22-.26.596-.042.839l6.717 7.508c.547.61 1.531.15 1.423-.664l-2.03-15.387c-.068-.514-.692-.733-1.063-.373l-5.005 5.077zm-2.446 0c.245.22.26.596.042.839l-6.717 7.508c-.547.61-1.531.15-1.423-.664l2.03-15.387c.068-.514.692-.733 1.063-.373l5.005 5.077z"/>
      </svg>
    ),
  },
  {
    name: "n8n",
    subtitle: "Workflow Automation",
    color: "pink",
    icon: (
      <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.364 5.636L13.636 10.364 18.364 5.636zM16.95 4.222L12.222 8.95 16.95 4.222zM8.111 5.889L3.384 10.616 8.111 5.889zM9.525 4.475L4.798 9.202 9.525 4.475zM5.636 18.364L10.364 13.636 5.636 18.364zM4.222 16.95L8.95 12.222 4.222 16.95zM18.111 15.889L13.384 20.616 18.111 15.889zM19.525 14.475L14.798 19.202 19.525 14.475z"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    subtitle: "Type Safety",
    color: "blue",
    icon: (
      <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 12v12h24V0H0zm19.341-.956c.61.152 1.074.423 1.501.865.221.236.549.666.575.77.008.03-1.036.73-1.668 1.123-.023.015-.115-.084-.217-.236-.31-.45-.633-.644-1.128-.678-.728-.05-1.196.331-1.192.967a.88.88 0 00.102.45c.16.331.458.53 1.39.934 1.719.74 2.454 1.227 2.911 1.92.51.773.625 2.008.278 2.926-.38.998-1.325 1.676-2.655 1.9-.411.073-1.386.062-1.828-.018-.964-.172-1.878-.648-2.442-1.273-.221-.244-.651-.88-.625-.925.011-.016.11-.077.22-.141.108-.061.511-.294.892-.515l.69-.4.145.214c.202.308.643.731.91.872.766.404 1.817.347 2.335-.118a.883.883 0 00.313-.72c0-.278-.035-.4-.18-.61-.186-.266-.567-.49-1.649-.96-1.238-.533-1.771-.864-2.259-1.39a3.165 3.165 0 01-.659-1.2c-.091-.339-.114-1.189-.042-1.531.255-1.197 1.158-2.03 2.461-2.278.423-.08 1.406-.05 1.821.053zm-5.634 1.002l.008.983H10.59v8.876H8.381v-8.876H5.258v-.964c0-.534.011-.98.026-.99.012-.016 1.913-.024 4.217-.02l4.195.012z"/>
      </svg>
    ),
  },
  {
    name: "React 19",
    subtitle: "Server Components",
    color: "cyan",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    ),
  },
  {
    name: "Tailwind v4",
    subtitle: "Oxide Engine",
    color: "sky",
    icon: (
      <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
      </svg>
    ),
  },
];

// Features Bento Grid Data
export interface Feature {
  title: string;
  description: string;
  header: ReactNode;
  className?: string;
}

export const FEATURES: Feature[] = [
  {
    title: "Gestión de Proyectos",
    description: "Tableros Kanban, sub-tareas, asignaciones y fechas límite. Todo sincronizado en tiempo real.",
    header: null, // Will be populated with DummyList
    className: "md:col-span-2",
  },
  {
    title: "Analytics Embebido",
    description: "Métricas de performance por proyecto. Gráficos actualizados cada hora.",
    header: null, // Will be populated with DummyChart
  },
  {
    title: "Automatización n8n",
    description: "Webhooks listos para conectar con Slack, Gmail, CRMs y +400 servicios más.",
    header: null, // Will be populated with DummyCode
  },
  {
    title: "Colaboración en Vivo",
    description: "Comentarios, @menciones y notificaciones push. Sin recargar navegador.",
    header: null, // Will be populated with DummyCollaboration
    className: "md:col-span-2",
  },
];

// Hero Section Data
export const HERO = {
  badge: {
    emoji: "🚀",
    text: "Setup Sprint: De 0 a Producción en 7 Días - Solo $1,000",
  },
  title: {
    line1: "Tu Agencia,",
    line2: "Operando en Piloto",
    line3: "Automático",
  },
  subtitle: {
    text: "Sistema completo de gestión de leads y proyectos.",
    highlight: "Conectado a tu infraestructura en 7 días.",
  },
  cta: {
    primary: {
      text: "Comenzar Ahora",
      arrow: "→",
    },
    secondary: {
      text: "Ver Demo",
    },
  },
  socialProof: {
    avatars: 3,
    text: "USADO POR +50 AGENCIAS MODERNAS",
  },
};

// CTA Section Data
export const CTA = {
  title: "¿Listo para dejar de perder leads?",
  description: "Setup completo en 7 días. Soporte técnico incluido. Sin pagos recurrentes ocultos.",
  primaryButton: {
    text: "Comenzar Setup Sprint",
    price: "$1,000",
  },
  secondaryButton: {
    text: "Agendar Auditoría Gratis",
  },
  guarantee: "GARANTÍA DE ENTREGA O TE DEVOLVEMOS TU DINERO",
};

// Footer Data
export const FOOTER = {
  brand: {
    name: "Portfolio2 Agency",
    description: "Infraestructura operativa completa para agencias digitales que quieren escalar sin perder leads.",
  },
  links: {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonios", href: "#testimonios" },
      { label: "Docs", href: "/docs" },
    ],
    legal: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  social: [
    {
      name: "X (Twitter)",
      href: "https://x.com/portfolio2",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/portfolio2",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ],
  copyright: "© 2026 Portfolio2 Agency. Todos los derechos reservados.",
};
