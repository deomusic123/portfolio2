import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { StatsCardsRealtime } from '@/components/dashboard/StatsCardsRealtime';
import { RecentActivityRealtime } from '@/components/dashboard/RecentActivityRealtime';
import { ChartsContainer } from '@/components/dashboard/ChartsContainer';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - Portfolio2',
  description: 'Your agency dashboard',
};

export default async function DashboardPage() {
  // Server Component - Direct Supabase access with RLS
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header with Quick Actions */}
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
            href="/dashboard/projects"
            className="group px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all font-medium shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          >
            <span className="inline-block group-hover:scale-110 transition-transform">🚀</span> New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards - Ahora con Realtime */}
      <StatsCardsRealtime />

      {/* Main Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-96 rounded-2xl bg-white/5 animate-pulse" />}>
            <ChartsContainer />
          </Suspense>
        </div>

        {/* Right Column (1/3 width) - Recent Activity con Realtime */}
        <div className="space-y-6">
          <RecentActivityRealtime />
        </div>
      </div>
    </div>
  );
}
