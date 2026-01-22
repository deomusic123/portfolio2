'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import type { ActivityLog } from '@/types/database';

/**
 * Log activity to audit trail
 * Called internally by Server Actions to track changes
 */
export async function logActivity(params: {
  action: ActivityLog['action'];
  entityType: ActivityLog['entity_type'];
  entityId?: string;
  entityName?: string;
  details?: Record<string, any>;
}): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Extract IP address and user agent from request headers
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ipAddress = forwarded?.split(',')[0]?.trim() ?? headersList.get('x-real-ip') ?? null;
    const userAgent = headersList.get('user-agent') ?? null;

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      entity_name: params.entityName,
      details: params.details || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    // Silent fail - don't break main action if logging fails
    console.error('Failed to log activity:', error);
  }
}

/**
 * Get activity logs for current user
 * Paginated with limit/offset
 */
export async function getActivityLogs(limit = 50, offset = 0) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return { success: true, data: logs };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity logs',
    };
  }
}

/**
 * Get activity logs filtered by entity type
 */
export async function getActivityLogsByEntity(
  entityType: ActivityLog['entity_type'],
  limit = 20
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { success: true, data: logs };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity logs',
    };
  }
}

/**
 * Get activity stats (counts by action type)
 */
export async function getActivityStats() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: logs } = await supabase
      .from('activity_logs')
      .select('action')
      .eq('user_id', user.id);

    if (!logs) {
      return { success: true, data: { create: 0, update: 0, delete: 0, login: 0, logout: 0 } };
    }

    const stats = logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      { create: 0, update: 0, delete: 0, login: 0, logout: 0 } as Record<string, number>
    );

    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity stats',
    };
  }
}
