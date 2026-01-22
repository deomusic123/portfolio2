import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ChartsContainer } from '@/components/dashboard/ChartsContainer';
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
    <>
      <DashboardNav />
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header with Quick Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-neutral-400">Manage your agency leads and projects</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={ROUTES.LEADS}
                className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition"
              >
                + New Lead
              </Link>
              <Link
                href={ROUTES.PROJECTS}
                className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition"
              >
                + New Project
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Charts and Recent Activity Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartsContainer />
            </div>
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
