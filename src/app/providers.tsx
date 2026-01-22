'use client';

import { UserProvider } from '@/hooks/useUser';

/**
 * ClientProviders - Wraps all client-side providers
 * Used to avoid mixing Server/Client components at root level
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
