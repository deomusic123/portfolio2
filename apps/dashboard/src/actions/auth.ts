'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { autoConfirmEmail } from '@/lib/supabase/admin';
import { loginSchema, registerSchema } from '@/types/database';
import { ROUTES } from '@/lib/constants';
import type { ActionResponse } from '@/types/api';
import { logActivity } from './activity';

/**
 * Login action - Email/password authentication
 * Validates input with Zod, authenticates with Supabase
 */
export async function login(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate input
    const parsed = loginSchema.parse({ email, password });

    const supabase = await createClient();

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error?.message || 'Authentication failed',
        },
      };
    }

    // Log login activity
    await logActivity({
      action: 'login',
      entityType: 'auth',
      entityName: data.user.email || undefined,
    });

    // Return success - client will redirect
    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error?.message || 'Invalid input',
      },
    };
  }
}

/**
 * Register action - Create new account + profile
 * Validates input, creates user in Supabase Auth, then creates profile
 */
export async function register(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // Validate input
    const parsed = registerSchema.parse({ email, password, name });

    const supabase = await createClient();

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          name: parsed.name,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: authError?.message || 'Failed to create account',
        },
      };
    }

    // TODO: REMOVE IN PRODUCTION - Auto-confirm email for development
    // In production, use actual email verification flow
    try {
      await autoConfirmEmail(authData.user.id);
    } catch (confirmError) {
      console.warn('Email auto-confirmation failed (non-critical):', confirmError);
      // Don't fail registration if confirmation fails
    }

    // Profile is auto-created by trigger on auth.users insert
    // Return success - client will redirect
    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error: any) {
    console.error('[REGISTER ERROR]', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      raw: error,
    });
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error?.message || 'Invalid input',
      },
    };
  }
}

/**
 * Logout action - Sign out user
 */
export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log logout before signing out
    if (user) {
      await logActivity({
        action: 'logout',
        entityType: 'auth',
        entityName: user.email || undefined,
      });
    }
    
    await supabase.auth.signOut();
    redirect(ROUTES.HOME);
  } catch (error: any) {
    // If logout fails, still try to redirect
    redirect(ROUTES.HOME);
  }
}

/**
 * Get current user - Server-only function
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch full profile with role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return profile;
  } catch (error) {
    return null;
  }
}
