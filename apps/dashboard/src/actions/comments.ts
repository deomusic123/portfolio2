'use server';

import { createClient } from '@/lib/supabase/server';
import { commentSchema, type CommentInput } from '@/types/database';
import type { ActionResponse } from '@/types/api';
import { logActivity } from './activity';

/**
 * Get comments for a specific entity (lead or project)
 */
export async function getComments(entityType: 'lead' | 'project', entityId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Fetch comments with user profile data (for avatar/name)
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, name, email, avatar_url)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[getComments]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch comments' 
    };
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate input
    const input = commentSchema.parse({
      content: formData.get('content'),
      entity_type: formData.get('entity_type'),
      entity_id: formData.get('entity_id'),
    });

    // Verify user owns the entity (lead or project)
    if (input.entity_type === 'lead') {
      const { data: lead } = await supabase
        .from('leads')
        .select('id, name')
        .eq('id', input.entity_id)
        .eq('client_id', user.id)
        .single();

      if (!lead) {
        return { success: false, error: 'Lead not found or unauthorized' };
      }
    } else if (input.entity_type === 'project') {
      const { data: project } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', input.entity_id)
        .eq('client_id', user.id)
        .single();

      if (!project) {
        return { success: false, error: 'Project not found or unauthorized' };
      }
    }

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          user_id: user.id,
          entity_type: input.entity_type,
          entity_id: input.entity_id,
          content: input.content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'create',
      entityType: input.entity_type,
      entityId: input.entity_id,
      entityName: 'Comment',
      details: { content_preview: input.content.substring(0, 50) },
    });

    return {
      success: true,
      data,
      message: 'Comment added successfully',
    };
  } catch (error) {
    console.error('[createComment]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create comment',
    };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify comment belongs to current user
    const { data, error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Comment not found or unauthorized' };
    }

    // Log activity
    await logActivity({
      action: 'update',
      entityType: data.entity_type,
      entityId: data.entity_id,
      entityName: 'Comment',
      details: { content_preview: content.substring(0, 50) },
    });

    return {
      success: true,
      data,
      message: 'Comment updated successfully',
    };
  } catch (error) {
    console.error('[updateComment]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update comment',
    };
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get comment data before deletion for logging
    const { data: comment } = await supabase
      .from('comments')
      .select('id, entity_type, entity_id')
      .eq('id', commentId)
      .eq('user_id', user.id)
      .single();

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Log activity
    if (comment) {
      await logActivity({
        action: 'delete',
        entityType: comment.entity_type,
        entityId: comment.entity_id,
        entityName: 'Comment',
      });
    }

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  } catch (error) {
    console.error('[deleteComment]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete comment',
    };
  }
}

/**
 * Get comment count for an entity
 */
export async function getCommentCount(entityType: 'lead' | 'project', entityId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { count, error } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) throw error;

    return { success: true, data: count || 0 };
  } catch (error) {
    console.error('[getCommentCount]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch comment count' 
    };
  }
}
