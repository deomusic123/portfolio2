import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type { ActivityLog } from '@/types/database';

/**
 * ActivityLogsList - Server Component
 * Displays paginated activity logs with icons and details
 */
export async function ActivityLogsList({ limit = 50 }: { limit?: number }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    const getActionIcon = (action: ActivityLog['action']) => {
      switch (action) {
        case 'create':
          return '➕';
        case 'update':
          return '✏️';
        case 'delete':
          return '🗑️';
        case 'login':
          return '🔓';
        case 'logout':
          return '🔒';
        default:
          return '📝';
      }
    };

    const getActionColor = (action: ActivityLog['action']) => {
      switch (action) {
        case 'create':
          return 'text-green-400';
        case 'update':
          return 'text-blue-400';
        case 'delete':
          return 'text-red-400';
        case 'login':
          return 'text-purple-400';
        case 'logout':
          return 'text-neutral-400';
        default:
          return 'text-neutral-400';
      }
    };

    const getEntityIcon = (entityType: ActivityLog['entity_type']) => {
      switch (entityType) {
        case 'lead':
          return '👤';
        case 'project':
          return '📁';
        case 'profile':
          return '👨‍💼';
        case 'auth':
          return '🔐';
        default:
          return '📄';
      }
    };

    return (
      <div className="space-y-3">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition"
            >
              <div className="flex items-start gap-4">
                {/* Icons */}
                <div className="flex gap-2 text-2xl">
                  <span>{getActionIcon(log.action)}</span>
                  <span>{getEntityIcon(log.entity_type)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('font-medium capitalize', getActionColor(log.action))}>
                      {log.action}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400 capitalize">{log.entity_type}</span>
                  </div>

                  {log.entity_name && (
                    <p className="text-sm text-neutral-300 mb-2">{log.entity_name}</p>
                  )}

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="text-xs text-neutral-500 font-mono bg-neutral-950 p-2 rounded">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}

                  <p className="text-xs text-neutral-500 mt-2">
                    {new Date(log.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl bg-neutral-900/50 border border-neutral-800">
            <p className="text-neutral-400">No activity logs yet</p>
            <p className="text-sm text-neutral-500 mt-2">Actions like creating leads or projects will appear here</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load activity logs'}
        </p>
      </div>
    );
  }
}
