'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';
import type { User } from '@/types/database';

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

// Singleton instance to avoid multiple GoTrueClient instances
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

function getBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/**
 * UserProvider - Manages user authentication state
 * Wraps the entire app (placed in root layout or specific section)
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserContextType>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Fetch initial user state from browser
    // Note: This is CLIENT-SIDE ONLY. For SSR use, fetch in Server Component instead.
    const fetchUser = async () => {
      try {
        // Browser-only Supabase client (uses localStorage)
        const supabase = getBrowserClient();

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch full profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          setState({
            user: profile || null,
            loading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch user'),
        });
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUser hook - Access user context in Client Components
 * Usage: const { user, loading, error } = useUser();
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
