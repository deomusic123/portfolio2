'use server';

import { createClient } from '@/lib/supabase/server';
import { leadSchema, type LeadInput } from '@/types/database';
import type { ActionResponse } from '@/types/api';
import { logActivity } from './activity';

/**
 * Get all leads for current user
 * Server-only function (no direct client calls)
 */
export async function getLeads() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[getLeads]', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch leads' };
  }
}

/**
 * Create a new lead
 * Triggers n8n webhook via pg_net (automatic)
 */
export async function createLead(
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
    const input = leadSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      source: formData.get('source') || 'contact_form',
      notes: formData.get('notes') || undefined,
    });

    // Insert lead (RLS will enforce client_id = auth.uid())
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          client_id: user.id,
          ...input,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'create',
      entityType: 'lead',
      entityId: data.id,
      entityName: data.name,
      details: { email: data.email, source: data.source },
    });

    return {
      success: true,
      data,
      message: 'Lead created successfully',
    };
  } catch (error) {
    console.error('[createLead]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}

/**
 * Update lead status or notes
 */
export async function updateLead(
  leadId: string,
  updates: Partial<{ status: string; notes: string }>
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify lead belongs to current user (RLS enforces this)
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .eq('client_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Lead not found or unauthorized' };
    }

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'lead',
      entityId: data.id,
      entityName: data.name,
      details: updates,
    });

    return {
      success: true,
      data,
      message: 'Lead updated successfully',
    };
  } catch (error) {
    console.error('[updateLead]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

/**
 * Update lead with full form data (for edit modal)
 */
export async function updateLeadFull(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const leadId = formData.get('leadId') as string;
    
    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      source: formData.get('source') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string || null,
    };

    // Validate with Zod (reuse leadSchema but make it partial for updates)
    const validation = leadSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid data',
      };
    }

    // Update lead
    const { data, error } = await supabase
      .from('leads')
      .update(validation.data)
      .eq('id', leadId)
      .eq('client_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Lead not found or unauthorized' };
    }

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'lead',
      entityId: data.id,
      entityName: data.name,
      details: { updated_fields: Object.keys(validation.data) },
    });

    return {
      success: true,
      data,
      message: 'Lead updated successfully',
    };
  } catch (error) {
    console.error('[updateLeadFull]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get lead data before deletion for logging
    const { data: lead } = await supabase
      .from('leads')
      .select('id, name')
      .eq('id', leadId)
      .eq('client_id', user.id)
      .single();

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)
      .eq('client_id', user.id);

    if (error) throw error;

    // Log activity
    if (lead) {
      await logActivity({
        action: 'delete',
        entityType: 'lead',
        entityId: lead.id,
        entityName: lead.name,
      });
    }

    return {
      success: true,
      message: 'Lead deleted successfully',
    };
  } catch (error) {
    console.error('[deleteLead]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead',
    };
  }
}

/**
 * Convert lead to client (update profile from lead data)
 */
export async function convertLeadToClient(leadId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get lead data
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('client_id', user.id)
      .single();

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Update lead status
    const { error } = await supabase
      .from('leads')
      .update({ status: 'converted' })
      .eq('id', leadId);

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'lead',
      entityId: lead.id,
      entityName: lead.name,
      details: { status: 'converted', previous_status: lead.status },
    });

    return {
      success: true,
      message: 'Lead converted successfully',
    };
  } catch (error) {
    console.error('[convertLeadToClient]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert lead',
    };
  }
}
