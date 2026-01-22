'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { logout } from '@/actions/auth';
import { useUser } from '@/hooks/useUser';

const navigation = [
  { 
    name: 'Dashboard', 
    href: ROUTES.DASHBOARD, 
    icon: '📊',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Leads', 
    href: ROUTES.LEADS, 
    icon: '🎯',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Projects', 
    href: ROUTES.PROJECTS, 
    icon: '🚀',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    name: 'Activity', 
    href: ROUTES.ACTIVITY, 
    icon: '📝',
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    name: 'Team', 
    href: ROUTES.TEAM, 
    icon: '👥',
    gradient: 'from-red-500 to-pink-500'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href={ROUTES.DASHBOARD} className="block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Portfolio2
                </h1>
                <p className="text-xs text-zinc-500">Agency Dashboard</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                )}
              >
                {/* Icon con gradiente en hover */}
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                  isActive 
                    ? `bg-gradient-to-br ${item.gradient}` 
                    : 'bg-white/5 group-hover:bg-white/10'
                )}>
                  <span className={cn(
                    'text-xl transition-transform duration-200',
                    isActive ? '' : 'group-hover:scale-110 group-hover:rotate-6'
                  )}>
                    {item.icon}
                  </span>
                </div>

                {/* Text */}
                <span className={cn(
                  'font-medium transition-colors',
                  isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                )}>
                  {item.name}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all text-sm font-medium"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
