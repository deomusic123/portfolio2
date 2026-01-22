"use server"

/**
 * Server Actions para Lead Conversion Engine
 * CRITICAL: Todas las mutaciones pasan por aquí (no desde cliente)
 * SECURITY: RLS enforcement en cada query
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  type ActionResponse, 
  type CreateLeadInput, 
  type UpdateLeadInput,
  type LeadStatus 
} from '@/lib/leads/types';
import { isValidEmail } from '@/lib/leads/utils';

// ============================================
// CREATE LEAD
// ============================================

export async function createLead(
  input: CreateLeadInput
): Promise<ActionResponse<{ leadId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validation
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: 'Name is required' };
    }

    if (!input.email || !isValidEmail(input.email)) {
      return { success: false, error: 'Valid email is required' };
    }

    // Insert lead (RLS enforces client_id = auth.uid())
    // Database trigger will automatically call n8n "Sniper Workflow"
    const { data, error } = await supabase
      .from('leads')
      .insert({
        client_id: user.id,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || null,
        website: input.website?.trim() || null, // NUEVO: crítico para espionaje
        notes: input.notes?.trim() || null,
        source: input.source || 'manual',
        potential_value: input.potential_value || null,
        status: 'new', // Trigger cambiará a 'investigating'
        tech_stack: {},
        email_validation_details: {},
        pain_points: [],
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Error creating lead:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Lead created:', data.id);

    // Revalidate leads page
    revalidatePath('/dashboard/leads');

    return { 
      success: true, 
      data: { leadId: data.id } 
    };
  } catch (error) {
    console.error('❌ Unexpected error in createLead:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// UPDATE LEAD STATUS (Drag & Drop)
// ============================================

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update lead (RLS ensures user owns this lead)
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .eq('client_id', user.id); // RLS double-check

    if (error) {
      console.error('❌ Error updating lead status:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Lead ${leadId} status → ${newStatus}`);

    // Activity log is handled by database trigger
    revalidatePath('/dashboard/leads');

    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error in updateLeadStatus:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// UPDATE LEAD (General)
// ============================================

export async function updateLead(
  leadId: string,
  input: UpdateLeadInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validation
    if (input.email && !isValidEmail(input.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Build update object (solo campos definidos)
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.email !== undefined) updates.email = input.email.trim().toLowerCase();
    if (input.phone !== undefined) updates.phone = input.phone?.trim() || null;
    if (input.website !== undefined) updates.website = input.website?.trim() || null; // NUEVO
    if (input.notes !== undefined) updates.notes = input.notes?.trim() || null;
    if (input.status !== undefined) updates.status = input.status;
    if (input.potential_value !== undefined) updates.potential_value = input.potential_value;
    if (input.expected_close_date !== undefined) updates.expected_close_date = input.expected_close_date;
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.suggested_action !== undefined) updates.suggested_action = input.suggested_action; // NUEVO: IA
    if (input.next_follow_up_at !== undefined) updates.next_follow_up_at = input.next_follow_up_at; // NUEVO

    // Update lead
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .eq('client_id', user.id);

    if (error) {
      console.error('❌ Error updating lead:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Lead ${leadId} updated`);

    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error in updateLead:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// DELETE LEAD
// ============================================

export async function deleteLead(leadId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete (RLS + cascade deletes activities)
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)
      .eq('client_id', user.id);

    if (error) {
      console.error('❌ Error deleting lead:', error);
      return { success: false, error: error.message };
    }

    console.log(`🗑️ Lead ${leadId} deleted`);

    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error in deleteLead:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// ADD NOTE TO LEAD
// ============================================

export async function addLeadNote(
  leadId: string,
  note: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!note || note.trim().length === 0) {
      return { success: false, error: 'Note cannot be empty' };
    }

    // Fetch current notes
    const { data: lead } = await supabase
      .from('leads')
      .select('notes')
      .eq('id', leadId)
      .eq('client_id', user.id)
      .single();

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Append new note with timestamp
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note.trim()}`;
    const updatedNotes = lead.notes 
      ? `${lead.notes}\n\n${newNote}` 
      : newNote;

    // Update lead
    const { error } = await supabase
      .from('leads')
      .update({ notes: updatedNotes })
      .eq('id', leadId)
      .eq('client_id', user.id);

    if (error) {
      console.error('❌ Error adding note:', error);
      return { success: false, error: error.message };
    }

    // Log activity
    await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        activity_type: 'note_added',
        new_value: note.trim(),
      });

    console.log(`📝 Note added to lead ${leadId}`);

    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error in addLeadNote:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// GET LEAD WITH ACTIVITIES (for Sheet)
// ============================================

export async function getLeadWithActivities(leadId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('client_id', user.id)
      .single();

    if (leadError) {
      return { success: false, error: leadError.message };
    }

    // Fetch activities
    const { data: activities, error: activitiesError } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (activitiesError) {
      return { success: false, error: activitiesError.message };
    }

    return { 
      success: true, 
      data: { 
        lead, 
        activities: activities || [] 
      } 
    };
  } catch (error) {
    console.error('❌ Unexpected error in getLeadWithActivities:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// GET LEAD INSIGHTS (Intelligence API)
// ============================================

export async function getLeadInsights(leadId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Call database function (respeta RLS automáticamente)
    const { data, error } = await supabase
      .rpc('get_lead_insights', { lead_uuid: leadId });

    if (error) {
      console.error('❌ Error fetching lead insights:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Unexpected error in getLeadInsights:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
}
