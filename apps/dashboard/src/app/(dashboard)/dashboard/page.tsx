import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ChartsContainer } from '@/components/dashboard/ChartsContainer';
import { Skeleton, StatsSkeleton } from '@portfolio2/ui';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard - Portfolio2',
  description: 'Your agency dashboard',
};

// PPR solo disponible en Next.js canary - comentado por ahora
// export const experimental_ppr = true;

export default async function DashboardPage() {
  // Server Component - Direct Supabase access with RLS
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Quick Actions - Estático, se prerrenderiza */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400 mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-zinc-500 text-lg">Manage your agency leads and projects</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={ROUTES.LEADS}
              className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-blue-500/30 transition-all backdrop-blur-sm font-medium"
            >
              <span className="inline-block group-hover:scale-110 transition-transform">🎯</span> New Lead
            </Link>
            <Link
              href={ROUTES.PROJECTS}
              className="group px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all font-medium shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              <span className="inline-block group-hover:scale-110 transition-transform">🚀</span> New Project
            </Link>
          </div>
        </div>

          {/* Stats Cards - Dinámico con Suspense */}
          <Suspense fallback={<StatsSkeleton />}>
            <StatsCards />
          </Suspense>

          {/* Charts and Recent Activity Grid - Dinámico con Suspense */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<ChartsSkeleton />}>
                <ChartsContainer />
              </Suspense>
            </div>
            <div className="lg:col-span-1">
              <Suspense fallback={<ActivitySkeleton />}>
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}

// Skeletons para loading states
function ChartsSkeleton() {
  return <Skeleton className="h-96 rounded-xl" />;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
}
