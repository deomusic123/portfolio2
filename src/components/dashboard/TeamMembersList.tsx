import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { RemoveUserButton } from '@/components/team/RemoveUserButton';

/**
 * TeamMembersList - Server Component
 * Displays all team members with roles (admin only)
 */
export async function TeamMembersList() {
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
      return (
        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">Admin access required</p>
        </div>
      );
    }

    // Fetch all team members
    const { data: members, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const roleColors = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      agent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      client: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    const roleLabels = {
      admin: 'Admin',
      agent: 'Agent',
      client: 'Client',
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Team Members ({members?.length || 0})
        </h3>

        {members && members.length > 0 ? (
          <div className="grid gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {member.name?.charAt(0).toUpperCase() || 
                       member.email?.charAt(0).toUpperCase() || 
                       'U'}
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="text-white font-medium">
                        {member.name || 'No name'}
                        {member.id === user.id && (
                          <span className="ml-2 text-xs text-neutral-500">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-neutral-400">{member.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium border',
                        roleColors[member.role as keyof typeof roleColors]
                      )}
                    >
                      {roleLabels[member.role as keyof typeof roleLabels] || member.role}
                    </span>

                    {/* Actions (only for non-self users) */}
                    {member.id !== user.id && (
                      <RemoveUserButton 
                        userId={member.id} 
                        userName={member.name || member.email || 'User'} 
                      />
                    )}
                  </div>
                </div>

                {/* Joined Date */}
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500">
                    Joined: {new Date(member.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-neutral-900/30 border border-neutral-800 border-dashed">
            <p className="text-sm text-neutral-400">No team members found</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load team members'}
        </p>
      </div>
    );
  }
}
