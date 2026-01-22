import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { ROUTES } from '@/lib/constants';

/**
 * Projects Page - Protected route for managing projects
 * Server Component - checks auth, redirects if not authenticated
 */
export default async function ProjectsPage() {
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
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-green-400 mb-2 tracking-tight">
          Projects
        </h1>
        <p className="text-zinc-500 text-lg">Manage your client projects and deliverables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Project Form */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md sticky top-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Create Project
            </h2>
            <CreateProjectForm />
          </div>
        </div>

        {/* Projects Table */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Your Projects
            </h2>
            <ProjectsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
