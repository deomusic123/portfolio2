'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';
import {
  createProjectSchema,
  createTaskSchema,
  updateProjectStatusSchema,
  updateTaskPrioritySchema,
  updateTaskStatusSchema,
  type CreateProjectDTO,
  type CreateTaskDTO,
  type Project,
  type Task,
  type ProjectStatus,
  type TaskStatus,
  type TaskPriority,
} from '@/types/projects';

// Helpers
async function getUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

function scopedFilter(userId: string) {
  return `user_id.eq.${userId},client_id.eq.${userId}`;
}

export async function getProjects(): Promise<Project[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or(scopedFilter(userId))
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[getProjects]', error.message);
    return [];
  }
  return (data || []) as Project[];
}

export async function getProjectById(id: string): Promise<(Project & { tasks: Task[] }) | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .eq('id', id)
    .or(scopedFilter(userId))
    .maybeSingle();
  if (error) {
    console.error('[getProjectById]', error.message);
    return null;
  }
  if (!data) return null;
  return {
    ...(data as Project),
    tasks: (data.tasks || []) as Task[],
  };
}

export async function createProject(input: CreateProjectDTO) {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase.from('projects').insert({
    ...parsed.data,
    client_id: userId,
    user_id: userId,
  });

  if (error) {
    console.error('[createProject]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(`${ROUTES.DASHBOARD}/projects`);
  return { success: true };
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const parsed = updateProjectStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: parsed.error.message };
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .or(scopedFilter(userId));

  if (error) {
    console.error('[updateProjectStatus]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(`${ROUTES.DASHBOARD}/projects`);
  revalidatePath(`${ROUTES.DASHBOARD}/projects/${id}`);
  return { success: true };
}

export async function createTask(input: CreateTaskDTO) {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase.from('tasks').insert({
    ...parsed.data,
    user_id: userId,
  });

  if (error) {
    console.error('[createTask]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(`${ROUTES.DASHBOARD}/projects/${parsed.data.project_id}`);
  return { success: true };
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const parsed = updateTaskStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: parsed.error.message };
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();
  const { error, data } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .eq('user_id', userId)
    .select('project_id')
    .single();

  if (error) {
    console.error('[updateTaskStatus]', error.message);
    return { success: false, error: error.message };
  }

  if (data?.project_id) {
    revalidatePath(`${ROUTES.DASHBOARD}/projects/${data.project_id}`);
  }
  return { success: true };
}

export async function updateTaskPriority(id: string, priority: TaskPriority) {
  const parsed = updateTaskPrioritySchema.safeParse({ id, priority });
  if (!parsed.success) return { success: false, error: parsed.error.message };
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();
  const { error, data } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id)
    .eq('user_id', userId)
    .select('project_id')
    .single();

  if (error) {
    console.error('[updateTaskPriority]', error.message);
    return { success: false, error: error.message };
  }

  if (data?.project_id) {
    revalidatePath(`${ROUTES.DASHBOARD}/projects/${data.project_id}`);
  }
  return { success: true };
}

export async function convertLeadToProject(leadId: string) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const supabase = await createClient();

  // Avoid duplicates if project already exists for this lead
  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('lead_id', leadId)
    .or(scopedFilter(userId))
    .maybeSingle();

  if (existingProject?.id) {
    revalidatePath(ROUTES.LEADS);
    revalidatePath(`${ROUTES.DASHBOARD}/projects`);
    revalidatePath(`${ROUTES.DASHBOARD}/projects/${existingProject.id}`);
    return { success: true, projectId: existingProject.id };
  }

  // Fetch lead (scoped by client_id/user_id depending on schema)
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, name, company_name, status')
    .eq('id', leadId)
    .eq('client_id', userId)
    .single();

  if (leadError || !lead) {
    return { success: false, error: leadError?.message || 'Lead not found' };
  }

  // Create project from lead
  const { error: projectError, data: projectData } = await supabase
    .from('projects')
    .insert({
      name: lead.name,
      client_name: lead.company_name || lead.name,
      lead_id: lead.id,
      client_id: userId,
      user_id: userId,
      status: 'planning',
    })
    .select('id')
    .single();

  if (projectError || !projectData) {
    return { success: false, error: projectError?.message || 'Failed to create project' };
  }

  // Update lead status to closed_won
  const { error: leadUpdateError } = await supabase
    .from('leads')
    .update({ status: 'closed_won' })
    .eq('id', lead.id)
    .eq('client_id', userId);

  if (leadUpdateError) {
    console.warn('[convertLeadToProject] project created but lead not updated:', leadUpdateError.message);
  }

  revalidatePath(ROUTES.LEADS);
  revalidatePath(`${ROUTES.DASHBOARD}/projects`);
  revalidatePath(`${ROUTES.DASHBOARD}/projects/${projectData.id}`);
  return { success: true, projectId: projectData.id };
}
