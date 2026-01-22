import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { CreateLeadForm } from '@/components/leads/CreateLeadForm';
import { ROUTES } from '@/lib/constants';

/**
 * Leads Page - Protected route for managing leads
 * Server Component - checks auth, redirects if not authenticated
 */
export default async function LeadsPage() {
  // Verify authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400 mb-2 tracking-tight">
          Leads
        </h1>
        <p className="text-zinc-500 text-lg">Track and convert your sales leads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Lead Form */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md sticky top-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Create Lead
            </h2>
            <CreateLeadForm />
          </div>
        </div>

        {/* Leads Table */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> Your Leads
            </h2>
            <LeadsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
