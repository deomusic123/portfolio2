import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { CommentsList } from '@/components/comments/CommentsList';
import { AddCommentForm } from '@/components/comments/AddCommentForm';
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
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Projects Management</h1>
          <p className="text-neutral-400 mt-2">Manage your client projects and timelines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Project Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Create Project</h2>
              <CreateProjectForm />
            </div>
          </div>

          {/* Projects Table */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-4">Your Projects</h2>
              <ProjectsTable />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
