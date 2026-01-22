import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

/**
 * ProfileCard - Server Component
 * Displays user profile information
 * Uses Server Component to access JWT in httpOnly cookies
 */
export async function ProfileCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">Not authenticated</div>;
  }

  // Fetch full profile with RLS (auth.uid() now works correctly in Server Component)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">Profile not found</div>;
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const roleColors = {
    admin: 'bg-red-500/10 border-red-500/20 text-red-400',
    agent: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    client: 'bg-green-500/10 border-green-500/20 text-green-400',
  };

  return (
    <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
          <p className="text-neutral-400 text-sm mt-1">{profile.email}</p>
        </div>

        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
          {profile.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex gap-2">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border',
            roleColors[profile.role as keyof typeof roleColors] || roleColors.agent
          )}
        >
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-700">
        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Status</p>
          <p className="text-sm text-white mt-1">Active</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Joined</p>
          <p className="text-sm text-white mt-1">{joinDate}</p>
        </div>
      </div>
    </div>
  );
}
