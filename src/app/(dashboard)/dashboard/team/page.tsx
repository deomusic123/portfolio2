import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { TeamMembersList } from '@/components/dashboard/TeamMembersList';
import { PendingInvitations } from '@/components/dashboard/PendingInvitations';
import { InviteUserForm } from '@/components/team/InviteUserForm';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'Team Management - Portfolio2',
  description: 'Manage your team members and invitations',
};

/**
 * Team Management Page - Protected route (Admin only)
 * Allows admins to invite users, manage roles, and view team members
 */
export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect(ROUTES.DASHBOARD);
  }

  return (
    <>
      <DashboardNav />
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Team Management</h1>
            <p className="text-neutral-400">Invite users and manage team member roles</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">👥</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">—</p>
                  <p className="text-xs text-neutral-400">Total Members</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📨</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">—</p>
                  <p className="text-xs text-neutral-400">Pending Invites</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🔑</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">—</p>
                  <p className="text-xs text-neutral-400">Admins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Invite Form */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Invite User</h2>
                <InviteUserForm />
              </div>
            </div>

            {/* Team Members & Invitations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Invitations */}
              <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
                <PendingInvitations />
              </div>

              {/* Team Members List */}
              <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
                <TeamMembersList />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">💡 Team Management Tips</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>• <strong>Admins</strong> have full access to all features including team management</li>
              <li>• <strong>Agents</strong> can create and manage leads and projects</li>
              <li>• <strong>Clients</strong> have read-only access to view their assigned data</li>
              <li>• Invitations expire after 7 days and can be revoked anytime</li>
              <li>• You cannot change your own role or remove yourself from the team</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
