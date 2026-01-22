import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ActivityLogsList } from '@/components/dashboard/ActivityLogsList';

export const metadata = {
  title: 'Activity Logs - Portfolio2',
  description: 'View your activity history',
};

export default async function ActivityLogsPage() {
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
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Activity Logs</h1>
            <p className="text-neutral-400">View your complete activity history and audit trail</p>
          </div>

          {/* Activity Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-xs text-neutral-400">Creates</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl mb-2">✏️</div>
              <p className="text-xs text-neutral-400">Updates</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-2xl mb-2">🗑️</div>
              <p className="text-xs text-neutral-400">Deletes</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-2xl mb-2">🔓</div>
              <p className="text-xs text-neutral-400">Logins</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-500/10 border border-neutral-500/20">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-xs text-neutral-400">Logouts</p>
            </div>
          </div>

          {/* Logs List */}
          <ActivityLogsList limit={100} />
        </div>
      </DashboardLayout>
    </>
  );
}
