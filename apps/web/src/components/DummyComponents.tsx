'use client';

export function DummyChart() {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 overflow-hidden relative group">
      {/* El Fondo de Grilla sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] [background-size:16px_16px]" />

      {/* El Gráfico SVG (Fake Chart) */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3">
        <svg viewBox="0 0 100 40" className="w-full h-full transform translate-y-1" preserveAspectRatio="none">
          {/* Gradiente de relleno */}
          <path d="M0 40 L0 25 Q10 15 20 28 T40 20 T60 25 T80 10 L100 15 L100 40 Z" fill="url(#gradientChart)" opacity="0.4" />
          {/* Línea Principal Brillante */}
          <path d="M0 25 Q10 15 20 28 T40 20 T60 25 T80 10 L100 15" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" className="drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          
          <defs>
            <linearGradient id="gradientChart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" /> {/* Verde éxito */}
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Tooltip Falso Flotante (El detalle de calidad) */}
      <div className="absolute top-1/4 right-1/4 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 shadow-xl flex flex-col items-center z-10">
        <span className="text-[10px] text-zinc-400">Revenue</span>
        <span className="text-xs font-bold text-white">+$12.4k</span>
        {/* Triangulito abajo */}
        <div className="absolute -bottom-1 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 transform rotate-45"></div>
      </div>
    </div>
  );
}

export function DummyList() {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] gap-3 p-3">
      {/* Columna TO DO */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          To Do
        </div>
        <div className="flex flex-col gap-2">
          {/* Kanban Card 1 */}
          <div className="rounded-lg border border-yellow-500/20 bg-zinc-900/80 p-2.5 shadow-sm transition-all hover:bg-zinc-800/80 hover:border-yellow-500/40 group cursor-pointer">
            <div className="text-xs font-medium text-zinc-300 mb-1">Landing Page</div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-500">Diseño</span>
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border border-zinc-900"></div>
            </div>
          </div>
          {/* Kanban Card 2 */}
          <div className="rounded-lg border border-yellow-500/10 bg-zinc-900/40 p-2.5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <div className="text-xs font-medium text-zinc-400 mb-1">SEO Audit</div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-500">Marketing</span>
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border border-zinc-900"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna DONE */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Done
        </div>
        <div className="flex flex-col gap-2">
          {/* Kanban Card Done */}
          <div className="rounded-lg border border-green-500/20 bg-zinc-900/80 p-2.5 shadow-sm">
            <div className="text-xs font-medium text-zinc-300 mb-1">Web Rediseño</div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-[9px] text-green-400 font-medium">Completado</span>
              <div className="flex -space-x-1">
                <div className="h-4 w-4 rounded-full border border-zinc-900 bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                <div className="h-4 w-4 rounded-full border border-zinc-900 bg-gradient-to-br from-purple-400 to-pink-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DummyCode() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative overflow-hidden">
      {/* Fondo de rejilla sutil para que parezca un canvas de n8n */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="flex items-center justify-center gap-4 relative z-10 w-full">
        
        {/* Nodo 1: Webhook (Lead) */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">New Lead</span>
        </div>

        {/* Línea conectora animada 1 */}
        <div className="h-px w-12 bg-zinc-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent w-1/2 h-full animate-pulse" />
        </div>

        {/* Nodo 2: IA (Procesamiento) */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg relative group hover:scale-110 transition-transform">
            {/* Badge de "AI" */}
            <div className="absolute -top-2 -right-2 bg-purple-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white">AI</div>
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Enrich</span>
        </div>

        {/* Línea conectora animada 2 */}
        <div className="h-px w-12 bg-zinc-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-1/2 h-full animate-pulse" style={{animationDelay: '0.5s'}} />
        </div>

        {/* Nodo 3: CRM (Database) */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Won</span>
        </div>

      </div>
      
      {/* Etiqueta flotante abajo */}
      <div className="mt-6 bg-zinc-900/50 border border-white/5 rounded-full px-3 py-1 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs text-zinc-400">Workflow Active</span>
      </div>
    </div>
  );
}

export function DummyCollaboration() {
  return (
    <div className="flex flex-col w-full h-full bg-zinc-900/30 p-4 gap-3 relative overflow-hidden">
      {/* Mensaje Recibido (Avatar + Burbuja) */}
      <div className="flex gap-3 items-start">
        {/* Avatar con gradiente */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden border-2 border-zinc-700 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          AM
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 font-medium">Ana M.</span>
          <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-3 py-2 border border-zinc-700 max-w-[180px]">
            <p className="text-xs text-zinc-300">¿Ya aprobaste el presupuesto?</p>
          </div>
        </div>
      </div>

      {/* Mensaje Enviado (Yo) */}
      <div className="flex gap-3 items-start flex-row-reverse ml-auto">
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white border-2 border-blue-500 shadow-lg">
          YO
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-blue-600/20 rounded-2xl rounded-tr-none px-3 py-2 border border-blue-500/30 max-w-[180px]">
            <p className="text-xs text-blue-100">Sí, enviado al cliente 🚀</p>
          </div>
          <span className="text-[10px] text-blue-400/60">Visto 10:42 AM</span>
        </div>
      </div>

      {/* Input Fake al fondo */}
      <div className="mt-auto relative w-full">
        <div className="h-8 w-full bg-zinc-950 rounded-lg border border-zinc-800 px-3 flex items-center">
          <span className="text-xs text-zinc-600">Escribir comentario...</span>
        </div>
      </div>
    </div>
  );
}
