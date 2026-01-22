import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { RevokeInvitationButton } from '@/components/team/RevokeInvitationButton';

/**
 * PendingInvitations - Server Component
 * Displays pending team invitations (admin only)
 */
export async function PendingInvitations() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Check if user is admin
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentProfile || currentProfile.role !== 'admin') {
      return null;
    }

    // Fetch pending invitations
    const { data: invitations, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const roleColors = {
      admin: 'text-red-400',
      agent: 'text-blue-400',
      client: 'text-green-400',
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Pending Invitations ({invitations?.length || 0})
        </h3>

        {invitations && invitations.length > 0 ? (
          <div className="grid gap-3">
            {invitations.map((invitation) => {
              const isExpired = new Date(invitation.expires_at) < new Date();
              
              return (
                <div
                  key={invitation.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    isExpired 
                      ? 'bg-red-500/5 border-red-500/20' 
                      : 'bg-neutral-900/50 border-neutral-800'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{invitation.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn('text-xs', roleColors[invitation.role as keyof typeof roleColors])}>
                          Role: {invitation.role}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {isExpired ? 'Expired' : `Expires: ${new Date(invitation.expires_at).toLocaleDateString('es-ES')}`}
                        </span>
                      </div>
                    </div>

                    {!isExpired && (
                      <RevokeInvitationButton invitationId={invitation.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-neutral-900/30 border border-neutral-800 border-dashed">
            <p className="text-sm text-neutral-400">No pending invitations</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load invitations'}
        </p>
      </div>
    );
  }
}
