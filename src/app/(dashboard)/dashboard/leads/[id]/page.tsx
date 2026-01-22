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
 * Lead Detail Page - View and comment on a specific lead
 */
export default async function LeadDetailPage({
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

  // Fetch lead details
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single();

  if (error || !lead) {
    redirect(ROUTES.LEADS);
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    contacted: 'bg-purple-500/20 text-purple-400',
    qualified: 'bg-yellow-500/20 text-yellow-400',
    converted: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <DashboardLayout>
      <DashboardNav />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={ROUTES.LEADS}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition mb-6"
        >
          ← Back to Leads
        </Link>

        {/* Lead Header */}
        <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lead.name}</h1>
              <p className="text-neutral-400">{lead.email}</p>
              {lead.phone && <p className="text-neutral-400">{lead.phone}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
              {lead.status}
            </span>
          </div>

          {lead.notes && (
            <div className="mt-4 p-4 rounded-lg bg-neutral-900/50">
              <p className="text-sm text-neutral-300">{lead.notes}</p>
            </div>
          )}

          <div className="flex gap-4 mt-4 text-xs text-neutral-500">
            <span>Source: {lead.source}</span>
            <span>Created: {new Date(lead.created_at).toLocaleDateString('es-ES')}</span>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Attachments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <FileUpload entityType="lead" entityId={lead.id} />
            </div>
            {/* Attachments List */}
            <div className="lg:col-span-2">
              <AttachmentsList entityType="lead" entityId={lead.id} />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Comment Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Add Comment</h2>
              <AddCommentForm entityType="lead" entityId={lead.id} />
            </div>
          </div>

          {/* Comments List */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
              <CommentsList entityType="lead" entityId={lead.id} />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
