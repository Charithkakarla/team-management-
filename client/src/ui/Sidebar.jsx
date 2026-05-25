// Sidebar: primary dashboard navigation for each role.
// It changes links based on CEO, manager, or employee access.
// Use this file to understand the left navigation panel.
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, ShieldCheck, KeyRound, CheckSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '../shared/cn';
import { useAuth } from '../hooks/useAuth';

const adminItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/teams', label: 'Teams', icon: FolderKanban },
  { to: '/roles', label: 'Roles', icon: ShieldCheck },
  { to: '/permissions', label: 'Permissions', icon: KeyRound }
];

const managerItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/teams', label: 'Teams', icon: FolderKanban }
];

const employeeItems = [
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
];

export const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const items = user?.isAdmin ? adminItems : user?.isManager ? managerItems : employeeItems;

  return (
  <>
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-border bg-surface px-4 py-5 shadow-soft transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0',
        collapsed ? 'lg:w-24' : 'lg:w-72',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className={cn('mb-4 flex items-center justify-between', collapsed && 'lg:justify-center')}>
        <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className={cn('transition-all', collapsed && 'lg:hidden')}>
            <div className="text-[13px] font-semibold uppercase tracking-[0.24em] text-text-muted">Team Management</div>
            <div className="text-sm font-semibold text-text-primary">RBAC System</div>
          </div>
        </div>
        <button onClick={onCloseMobile} className="rounded-xl p-2 text-text-muted transition hover:bg-black/5 lg:hidden dark:hover:bg-white/5" aria-label="Close navigation">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className={cn('grid gap-2', collapsed && 'lg:justify-center')}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                'border border-transparent hover:bg-blue-50 dark:hover:bg-white/5',
                isActive ? 'border-primary/20 bg-blue-50 text-primary' : 'text-text-muted',
                collapsed && 'lg:justify-center lg:px-3'
              )}
            >
              <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className={cn('transition-opacity', collapsed && 'lg:hidden')}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className={cn('mt-auto flex items-end justify-between gap-3 pt-4', collapsed && 'lg:justify-center')}>
        <div className={cn('text-xs text-text-muted', collapsed && 'lg:hidden')}>
          {user?.name || 'User'}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-border bg-surface p-2 text-text-muted transition hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => window.location.assign('/dashboard')}
            className="rounded-xl border border-border bg-surface p-2 text-text-muted transition hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

    </aside>

    {mobileOpen ? <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onCloseMobile} /> : null}
  </>
  );
};
