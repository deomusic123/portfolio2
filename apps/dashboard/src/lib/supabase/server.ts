import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../constants";

/**
 * Server-side Supabase client for use in Server Components and Server Actions.
 * CRITICAL: cookies() is async in Next.js 15 - must be awaited.
 * 
 * Usage:
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select();
 */
export async function createClient() {
  // Validate credentials exist
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_URL.startsWith('http')) {
    throw new Error('Supabase credentials not configured. Check .env.local');
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method called from Server Component.
          // Cookie jar updates are ignored (Middleware handles token refresh).
        }
      },
    },
  });
}
