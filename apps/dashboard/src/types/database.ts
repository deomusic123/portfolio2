/**
 * Database types - synced from Supabase schema
 * Generate with: supabase gen types typescript --project-id <PROJECT_ID>
 */

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: "admin" | "agent" | "client";
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone: string | null;
  source: "contact_form" | "email" | "referral" | "other";
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: "planning" | "in_progress" | "completed" | "on_hold";
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  action: "create" | "update" | "delete" | "login" | "logout";
  entity_type: "lead" | "project" | "profile" | "auth";
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  entity_type: "lead" | "project";
  entity_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type TeamInvitation = {
  id: string;
  inviter_id: string;
  email: string;
  role: "admin" | "agent" | "client";
  status: "pending" | "accepted" | "rejected" | "expired";
  token: string;
  expires_at: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  user_id: string;
  entity_type: "lead" | "project";
  entity_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
};

// Form validation schemas (Zod)
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  source: z.enum(["contact_form", "email", "referral", "other"]),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"]).default("planning"),
  budget: z.number().positive("Budget must be positive").optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
  entity_type: z.enum(["lead", "project"]),
  entity_id: z.string().uuid("Invalid entity ID"),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "agent", "client"]),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const attachmentUploadSchema = z.object({
  entity_type: z.enum(["lead", "project"]),
  entity_id: z.string().uuid("Invalid entity ID"),
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File must be less than 10MB")
    .refine(
      (file) => {
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        return allowedTypes.includes(file.type);
      },
      "Invalid file type. Allowed: PDF, images (JPEG, PNG, WebP), Word, Excel"
    ),
});

export type AttachmentUploadInput = z.infer<typeof attachmentUploadSchema>;
