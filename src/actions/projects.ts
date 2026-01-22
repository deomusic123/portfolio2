'use server';

import { createClient } from '@/lib/supabase/server';
import { projectSchema } from '@/types/database';
import type { ActionResponse } from '@/types/api';
import { logActivity } from './activity';

/**
 * Get all projects for current user
 * Server-only function (no direct client calls)
 */
export async function getProjects() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[getProjects]', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch projects' };
  }
}

/**
 * Create a new project
 * Triggers n8n webhook via pg_net (automatic)
 */
export async function createProject(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Parse budget as number
    const budgetStr = formData.get('budget');
    const budget = budgetStr && budgetStr !== '' ? parseFloat(budgetStr as string) : undefined;

    // Validate input
    const input = projectSchema.parse({
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      status: formData.get('status') || 'planning',
      budget,
      start_date: formData.get('start_date') || undefined,
      end_date: formData.get('end_date') || undefined,
    });

    // Insert project (RLS will enforce client_id = auth.uid())
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          client_id: user.id,
          ...input,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'create',
      entityType: 'project',
      entityId: data.id,
      entityName: data.name,
      details: { status: data.status, budget: data.budget },
    });

    return {
      success: true,
      data,
      message: 'Project created successfully',
    };
  } catch (error) {
    console.error('[createProject]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create project',
    };
  }
}

/**
 * Update project details
 */
export async function updateProject(
  projectId: string,
  updates: Partial<{
    name: string;
    description: string;
    status: string;
    budget: number;
    start_date: string;
    end_date: string;
  }>
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify project belongs to current user (RLS enforces this)
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('client_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Project not found or unauthorized' };
    }

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'project',
      entityId: data.id,
      entityName: data.name,
      details: updates,
    });

    return {
      success: true,
      data,
      message: 'Project updated successfully',
    };
  } catch (error) {
    console.error('[updateProject]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project',
    };
  }
}

/**
 * Update project with full form data (for edit modal)
 */
export async function updateProjectFull(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const projectId = formData.get('projectId') as string;

    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      status: formData.get('status') as string,
      budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : null,
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
    };

    // Validate with Zod
    const validation = projectSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid data',
      };
    }

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(validation.data)
      .eq('id', projectId)
      .eq('client_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Project not found or unauthorized' };
    }

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'project',
      entityId: data.id,
      entityName: data.name,
      details: { updated_fields: Object.keys(validation.data) },
    });

    return {
      success: true,
      data,
      message: 'Project updated successfully',
    };
  } catch (error) {
    console.error('[updateProjectFull]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project',
    };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get project data before deletion for logging
    const { data: project } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .eq('client_id', user.id)
      .single();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('client_id', user.id);

    if (error) throw error;

    // Log activity
    if (project) {
      await logActivity({
        action: 'delete',
        entityType: 'project',
        entityId: project.id,
        entityName: project.name,
      });
    }

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  } catch (error) {
    console.error('[deleteProject]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete project',
    };
  }
}

/**
 * Update project status
 */
export async function updateProjectStatus(
  projectId: string,
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
): Promise<ActionResponse> {
  return updateProject(projectId, { status });
}
