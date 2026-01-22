'use client';

import { StickyScrollReveal } from '@/components/ui/sticky-scroll-reveal';
import { MockDashboard } from './mock-dashboard';
import { TechStackGrid } from './tech-stack';

export function DashboardShowcase() {
  return (
    <div className="-mt-32">
      <StickyScrollReveal
        children={<MockDashboard />}
        content={<TechStackGrid />}
      />
    </div>
  );
}
