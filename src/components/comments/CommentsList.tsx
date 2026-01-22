import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { DeleteCommentButton } from './DeleteCommentButton';
import type { Comment } from '@/types/database';

type CommentWithUser = Comment & {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

/**
 * CommentsList - Server Component
 * Displays comments with user avatars and timestamps
 */
export async function CommentsList({
  entityType,
  entityId,
}: {
  entityType: 'lead' | 'project';
  entityId: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Fetch comments with user profile data
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, name, email, avatar_url)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const typedComments = comments as unknown as CommentWithUser[];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Comments ({typedComments?.length || 0})
        </h3>

        {typedComments && typedComments.length > 0 ? (
          <div className="space-y-3">
            {typedComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800"
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || 
                     comment.user?.email?.charAt(0).toUpperCase() || 
                     'U'}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {comment.user?.name || comment.user?.email || 'Unknown User'}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(comment.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {comment.created_at !== comment.updated_at && (
                        <span className="text-xs text-neutral-600">(edited)</span>
                      )}
                    </div>

                    <p className="text-sm text-neutral-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Actions (only for comment owner) */}
                    {comment.user_id === user.id && (
                      <div className="flex gap-2 mt-3">
                        <DeleteCommentButton commentId={comment.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-neutral-900/30 border border-neutral-800 border-dashed">
            <p className="text-sm text-neutral-400">No comments yet</p>
            <p className="text-xs text-neutral-500 mt-1">Be the first to comment!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load comments'}
        </p>
      </div>
    );
  }
}
