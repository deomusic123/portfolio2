'use server';

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../constants';

/**
 * Admin Supabase client - Uses service role key (server-side only)
 * ⚠️ SECURITY: This key has full access to the database - NEVER expose to client
 * Only use for admin operations like auto-confirming emails in development
 * 
 * TODO: Remove email auto-confirmation in production - use actual email verification flow
 */
export async function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
    throw new Error('SUPABASE_URL is not configured. Check .env.local');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey || serviceRoleKey.includes('your_supabase')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Auto-confirm user email (development only)
 * TODO: REMOVE THIS IN PRODUCTION - implement real email verification
 */
export async function autoConfirmEmail(userId: string) {
  const admin = await getAdminClient();
  
  return admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
}
