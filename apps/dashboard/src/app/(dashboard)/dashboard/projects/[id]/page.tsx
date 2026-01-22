import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { CommentsList } from '@/components/comments/CommentsList';
import { AddCommentForm } from '@/components/comments/AddCommentForm';
import { AttachmentsList } from '@/components/attachments/AttachmentsList';
import { FileUpload } from '@/components/attachments/FileUpload';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

/**
 * Project Detail Page - View and comment on a specific project
 */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch project details
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single();

  if (error || !project) {
    redirect(ROUTES.PROJECTS);
  }

  const statusColors: Record<string, string> = {
    planning: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-purple-500/20 text-purple-400',
    completed: 'bg-green-500/20 text-green-400',
    on_hold: 'bg-red-500/20 text-red-400',
  };

  return (
    <DashboardLayout>
      <DashboardNav />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={ROUTES.PROJECTS}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition mb-6"
        >
          ← Back to Projects
        </Link>

        {/* Project Header */}
        <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-neutral-400 mt-2">{project.description}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {project.budget && (
              <div className="p-3 rounded-lg bg-neutral-900/50">
                <p className="text-xs text-neutral-500 mb-1">Budget</p>
                <p className="text-lg font-semibold text-white">
                  ${project.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            {project.start_date && (
              <div className="p-3 rounded-lg bg-neutral-900/50">
                <p className="text-xs text-neutral-500 mb-1">Start Date</p>
                <p className="text-sm font-medium text-white">
                  {new Date(project.start_date).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
            {project.end_date && (
              <div className="p-3 rounded-lg bg-neutral-900/50">
                <p className="text-xs text-neutral-500 mb-1">End Date</p>
                <p className="text-sm font-medium text-white">
                  {new Date(project.end_date).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
            <div className="p-3 rounded-lg bg-neutral-900/50">
              <p className="text-xs text-neutral-500 mb-1">Created</p>
              <p className="text-sm font-medium text-white">
                {new Date(project.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Attachments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <FileUpload entityType="project" entityId={project.id} />
            </div>
            {/* Attachments List */}
            <div className="lg:col-span-2">
              <AttachmentsList entityType="project" entityId={project.id} />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Comment Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Add Comment</h2>
              <AddCommentForm entityType="project" entityId={project.id} />
            </div>
          </div>

          {/* Comments List */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
              <CommentsList entityType="project" entityId={project.id} />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
