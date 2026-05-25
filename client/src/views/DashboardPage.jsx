// Dashboard page: shows summary stats and recent activity.
// It is the main overview screen after login.
// Use this file to understand the home dashboard.
import { Users, FolderKanban, ShieldCheck, KeyRound, CheckSquare } from 'lucide-react';
import { Card, Badge, Table, StatCard, Skeleton } from '../ui/core';
import { useData } from '../state/DataContext';
import { useAuth } from '../hooks/useAuth';

const recentColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Created' }
];

export const DashboardPage = () => {
  const { users, teams, roles, tasks, loading } = useData();
  const { user } = useAuth();
  const isCEO = Boolean(user?.isAdmin);

  const stats = [
    { label: 'Users', value: users.length, helper: 'Registered accounts', icon: <Users className="h-5 w-5" /> },
    { label: 'Teams', value: teams.length, helper: 'Active collaboration spaces', icon: <FolderKanban className="h-5 w-5" /> },
    { label: 'Tasks', value: tasks.length, helper: 'Tracked work items', icon: <CheckSquare className="h-5 w-5" /> },
  ];

  if (isCEO) {
    stats.splice(2, 0, { label: 'Roles', value: roles.length, helper: 'Role templates with permissions', icon: <ShieldCheck className="h-5 w-5" /> });
    stats.push({ label: 'Permission rules', value: '5', helper: 'Dynamic access controls', icon: <KeyRound className="h-5 w-5" /> });
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Directory</div>
              <h2 className="mt-2 text-lg font-semibold text-text-primary">Latest users</h2>
            </div>
            <Badge tone="primary">Live</Badge>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="grid gap-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <Table
                columns={recentColumns}
                data={users.slice(0, 4)}
                emptyState="No users yet. Create the first account from the Users page."
                renderRow={(user) => (
                  <tr key={user._id} className="transition hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="px-4 py-4 text-sm font-medium text-text-primary">{user.name}</td>
                    <td className="px-4 py-4 text-sm text-text-muted">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                )}
              />
            )}
          </div>
        </Card>

        <Card>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">RBAC model</div>
          <h2 className="mt-2 text-lg font-semibold text-text-primary">Access path</h2>
          <div className="mt-5 grid gap-4">
            {[
              ['User', 'Identify the selected person'],
              ['Team', 'Scope permissions to one team'],
              ['Role', 'Map the membership to a role'],
              ['Permissions', 'Resolve the final access set']
            ].map(([title, text], index) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-black/5 p-4 dark:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{title}</div>
                  <div className="mt-1 text-sm text-text-muted">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Work stream</div>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">Recent tasks</h2>
          </div>
          <Badge tone="primary">{tasks.length} total</Badge>
        </div>

        <div className="mt-5 grid gap-3">
          {tasks.slice(0, 4).map((task) => (
            <div key={task._id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-gray-50 p-4 dark:bg-white/5">
              <div>
                <div className="text-sm font-semibold text-text-primary">{task.title}</div>
                <div className="mt-1 text-sm text-text-muted">{task.teamId?.name || 'No team'} · {task.assigneeId?.name || 'Unassigned'}</div>
              </div>
              <Badge tone={task.status === 'done' ? 'success' : 'primary'}>{task.status}</Badge>
            </div>
          ))}
          {!tasks.length ? <div className="text-sm text-text-muted">No tasks yet. Create one from the Tasks page.</div> : null}
        </div>
      </Card>

      {isCEO ? (
        <Card>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Roles</div>
          <h2 className="mt-2 text-lg font-semibold text-text-primary">Permission presets</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.length ? roles.map((role) => <Badge key={role._id} tone="primary">{role.name}</Badge>) : <div className="text-sm text-text-muted">Create roles to see permission sets here.</div>}
          </div>
        </Card>
      ) : null}
    </div>
  );
};
