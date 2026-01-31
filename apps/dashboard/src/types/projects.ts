import { z } from 'zod';

// Enums
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  REVIEW: 'review',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;
export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;
export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
} as const;
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

// Database row types
export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  name: string;
  client_name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  deadline: string | null;
  completed_at: string | null;
  budget: number | null;
  currency: string | null;
  user_id: string;
}

export interface Task {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  user_id: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

// DTO Schemas
export const createProjectSchema = z.object({
  name: z.string().min(3),
  client_name: z.string().min(2),
  description: z.string().optional(),
  start_date: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  lead_id: z.string().uuid().nullable().optional(),
});
export type CreateProjectDTO = z.infer<typeof createProjectSchema>;

export const updateProjectStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(PROJECT_STATUS),
});
export type UpdateProjectStatusDTO = z.infer<typeof updateProjectStatusSchema>;

export const createTaskSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.nativeEnum(TASK_STATUS).default(TASK_STATUS.TODO),
  priority: z.nativeEnum(TASK_PRIORITY).default(TASK_PRIORITY.MEDIUM),
  due_date: z.string().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(TASK_STATUS),
});
export type UpdateTaskStatusDTO = z.infer<typeof updateTaskStatusSchema>;

export const updateTaskPrioritySchema = z.object({
  id: z.string().uuid(),
  priority: z.nativeEnum(TASK_PRIORITY),
});
export type UpdateTaskPriorityDTO = z.infer<typeof updateTaskPrioritySchema>;
