'use client';

import Link from 'next/link';
import { logout } from '@/actions/auth';
import { useUser } from '@/hooks/useUser';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * DashboardNav - Navigation bar for authenticated pages
 * Shows user menu with logout option
 */
export function DashboardNav() {
  const { user, loading } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href={ROUTES.HOME} className="text-lg font-bold text-white">
            Portfolio2
          </Link>
          {!loading && user && (
            <div className="flex items-center gap-4">
              <Link href={ROUTES.DASHBOARD} className="text-sm text-neutral-400 hover:text-white transition">
                Dashboard
              </Link>
              <Link href={ROUTES.LEADS} className="text-sm text-neutral-400 hover:text-white transition">
                Leads
              </Link>
              <Link href={ROUTES.PROJECTS} className="text-sm text-neutral-400 hover:text-white transition">
                Projects
              </Link>
              <Link href={ROUTES.ACTIVITY} className="text-sm text-neutral-400 hover:text-white transition">
                Activity
              </Link>
              <Link href={ROUTES.TEAM} className="text-sm text-neutral-400 hover:text-white transition">
                Team
              </Link>
            </div>
          )}
        </div>

        {/* User Menu */}
        {!loading && user && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-neutral-400 text-xs">{user.email}</p>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Logout Form */}
            <form action={logout}>
              <button
                type="submit"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                )}
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
