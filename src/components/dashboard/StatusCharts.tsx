'use client';

import { cn } from '@/lib/utils';

type ChartData = {
  label: string;
  count: number;
  color: string;
};

type StatusChartsProps = {
  leadsData: ChartData[];
  projectsData: ChartData[];
};

/**
 * StatusCharts - Client Component
 * Displays simple bar charts for status distribution
 */
export function StatusCharts({ leadsData, projectsData }: StatusChartsProps) {
  const maxLeads = Math.max(...leadsData.map(d => d.count), 1);
  const maxProjects = Math.max(...projectsData.map(d => d.count), 1);

  const renderChart = (data: ChartData[], max: number, title: string) => (
    <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-400 capitalize">{item.label.replace('_', ' ')}</span>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', item.color)}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChart(leadsData, maxLeads, 'Leads by Status')}
      {renderChart(projectsData, maxProjects, 'Projects by Status')}
    </div>
  );
}
