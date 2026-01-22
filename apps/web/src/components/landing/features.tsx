'use client';

import { BentoGrid, BentoGridItem } from '@portfolio2/ui';
import { DummyChart, DummyList, DummyCode, DummyCollaboration } from '@/components/DummyComponents';

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Todo lo que necesitas para escalar
          </h2>
          <p className="text-zinc-400 text-lg">
            Infraestructura completa lista para usar desde el primer día
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          <BentoGridItem
            title="Gestión de Proyectos"
            description="Tableros Kanban, sub-tareas, asignaciones y fechas límite. Todo sincronizado en tiempo real."
            header={<DummyList />}
            className="md:col-span-2"
          />
          <BentoGridItem
            title="Analytics Embebido"
            description="Métricas de performance por proyecto. Gráficos actualizados cada hora."
            header={<DummyChart />}
          />
          <BentoGridItem
            title="Automatización n8n"
            description="Webhooks listos para conectar con Slack, Gmail, CRMs y +400 servicios más."
            header={<DummyCode />}
          />
          <BentoGridItem
            title="Colaboración en Vivo"
            description="Comentarios, @menciones y notificaciones push. Sin recargar navegador."
            header={<DummyCollaboration />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </div>
    </section>
  );
}
