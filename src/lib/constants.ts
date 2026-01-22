/**
 * Global constants for the application.
 * NO HARDCODED VALUES in component files - always use these.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export const API_RATE_LIMIT = 100; // requests/min
export const SESSION_TIMEOUT_MS = 1800000; // 30 minutes

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  LEADS: "/dashboard/leads",
  PROJECTS: "/dashboard/projects",
  ACTIVITY: "/dashboard/activity",
  TEAM: "/dashboard/team",
  PROFILE: "/dashboard/profile",
} as const;
