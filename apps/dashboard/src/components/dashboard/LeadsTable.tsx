import { createClient } from '@/lib/supabase/server';
import { LeadsTableClient } from './LeadsTableClient';

/**
 * LeadsTable - Server Component
 * Fetches leads data and passes to Client Component
 */
export async function LeadsTable() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">Not authenticated</p>
        </div>
      );
    }

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error.message}</p>
        </div>
      );
    }

    return <LeadsTableClient leads={leads || []} />;
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load leads'}
        </p>
      </div>
    );
  }
}
