'use server';

import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { inviteUserSchema } from '@/types/database';
import type { ActionResponse } from '@/types/api';
import { logActivity } from './activity';
import { randomBytes } from 'crypto';

/**
 * Get all team members (requires admin role)
 */
export async function getTeamMembers() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Fetch all profiles
    const { data: members, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: members || [] };
  } catch (error) {
    console.error('[getTeamMembers]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch team members' 
    };
  }
}

/**
 * Invite a new user to the team (requires admin role)
 */
export async function inviteUser(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Validate input
    const input = inviteUserSchema.parse({
      email: formData.get('email'),
      role: formData.get('role'),
    });

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', input.email)
      .single();

    if (existingProfile) {
      return { success: false, error: 'User already exists in the team' };
    }

    // Check if invitation already exists
    const { data: existingInvitation } = await supabase
      .from('team_invitations')
      .select('id')
      .eq('email', input.email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return { success: false, error: 'Invitation already sent to this email' };
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Create invitation
    const { data: invitation, error } = await supabase
      .from('team_invitations')
      .insert([
        {
          inviter_id: user.id,
          email: input.email,
          role: input.role,
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'create',
      entityType: 'profile',
      entityName: `Invitation sent to ${input.email}`,
      details: { email: input.email, role: input.role },
    });

    // TODO: Send invitation email via n8n webhook
    // For now, return invitation link
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

    return {
      success: true,
      data: { invitation, link: invitationLink },
      message: `Invitation sent to ${input.email}`,
    };
  } catch (error) {
    console.error('[inviteUser]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to invite user',
    };
  }
}

/**
 * Get pending invitations (requires admin role)
 */
export async function getPendingInvitations() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Fetch pending invitations
    const { data: invitations, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: invitations || [] };
  } catch (error) {
    console.error('[getPendingInvitations]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch invitations' 
    };
  }
}

/**
 * Cancel/revoke an invitation (requires admin role)
 */
export async function revokeInvitation(invitationId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Update invitation status
    const { error } = await supabase
      .from('team_invitations')
      .update({ status: 'expired' })
      .eq('id', invitationId);

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'delete',
      entityType: 'profile',
      entityName: 'Invitation revoked',
      details: { invitation_id: invitationId },
    });

    return {
      success: true,
      message: 'Invitation revoked successfully',
    };
  } catch (error) {
    console.error('[revokeInvitation]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke invitation',
    };
  }
}

/**
 * Update user role (requires admin role)
 */
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'agent' | 'client'
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if current user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Prevent user from changing their own role
    if (userId === user.id) {
      return { success: false, error: 'Cannot change your own role' };
    }

    // Update user role
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      action: 'update',
      entityType: 'profile',
      entityName: updatedProfile.email || 'User',
      details: { new_role: newRole },
    });

    return {
      success: true,
      data: updatedProfile,
      message: 'User role updated successfully',
    };
  } catch (error) {
    console.error('[updateUserRole]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role',
    };
  }
}

/**
 * Remove user from team (requires admin role)
 */
export async function removeTeamMember(userId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const adminSupabase = await getAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if current user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Prevent user from removing themselves
    if (userId === user.id) {
      return { success: false, error: 'Cannot remove yourself from the team' };
    }

    // Get user email for logging
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    // Delete user from auth (will cascade to profiles via foreign key)
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) throw deleteError;

    // Log activity
    await logActivity({
      action: 'delete',
      entityType: 'profile',
      entityName: targetProfile?.email || 'User',
      details: { removed_user_id: userId },
    });

    return {
      success: true,
      message: 'User removed from team successfully',
    };
  } catch (error) {
    console.error('[removeTeamMember]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove team member',
    };
  }
}
