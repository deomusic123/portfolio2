import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../constants";

/**
 * Browser-side Supabase client for use in Client Components.
 * Uses cookies for authentication state (synced via middleware).
 * 
 * IMPORTANT: This is a singleton. Do NOT create multiple instances.
 * 
 * Usage in Client Components:
 *   const supabase = createClient();
 *   const { data } = await supabase.from('table').select();
 * 
 * For Realtime subscriptions:
 *   const channel = supabase.channel('my-channel')
 *     .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
 *       console.log('Change received!', payload);
 *     })
 *     .subscribe();
 * 
 *   // Cleanup on unmount:
 *   return () => { supabase.removeChannel(channel); };
 */
export function createClient() {
  // Validate credentials exist
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_URL.startsWith('http')) {
    throw new Error('Supabase credentials not configured. Check .env.local');
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
