import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, ShieldCheck, KeyRound, X } from 'lucide-react';
import { cn } from '../utils/cn';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/teams', label: 'Teams', icon: FolderKanban },
  { to: '/roles', label: 'Roles', icon: ShieldCheck },
  { to: '/permissions', label: 'Permissions', icon: KeyRound }
];

export const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }) => (
  <>
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface px-4 py-5 shadow-soft transition-transform duration-300 lg:static lg:translate-x-0',
        collapsed ? 'lg:w-24' : 'lg:w-72',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className={cn('mb-6 flex items-center justify-between', collapsed && 'lg:justify-center')}>
        <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className={cn('transition-all', collapsed && 'lg:hidden')}>
            <div className="text-[13px] font-semibold uppercase tracking-[0.24em] text-text-muted">Team RBAC</div>
            <div className="text-sm font-semibold text-text-primary">Management</div>
          </div>
        </div>
        <button onClick={onCloseMobile} className="rounded-xl p-2 text-text-muted transition hover:bg-black/5 lg:hidden dark:hover:bg-white/5" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="grid gap-2">
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
      </nav>

      <div className={cn('mt-auto rounded-2xl border border-border bg-gray-50 p-4 text-sm text-text-muted dark:bg-white/5', collapsed && 'lg:hidden')}>
        <div className="text-[13px] font-semibold text-text-primary">Dynamic RBAC</div>
        <p className="mt-1 text-sm leading-6">Permissions resolve per user and team through role mappings.</p>
      </div>
    </aside>

    {mobileOpen ? <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onCloseMobile} /> : null}
  </>
);
