// Top navigation: handles sidebar toggles, theme changes, and logout.
// Top navigation: handles sidebar toggles, theme changes, and logout.
// It shows the workspace title and quick actions at the top.
// Use this file to understand the main dashboard header.
import { Menu, MoonStar, SunMedium, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from './core';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ onMenuClick, collapsed, onToggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="hidden lg:inline-flex" aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
          <div>
            <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">RBAC dashboard</div>
            <h1 className="text-sm font-semibold text-text-primary">{user?.isAdmin ? 'Admin Workspace' : user?.isManager ? 'Manager Workspace' : 'Employee Workspace'}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          <div className="hidden rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-text-muted md:block">
            {user?.name || 'User'}{user?.isAdmin ? ' · Admin' : user?.isManager ? ' · Manager' : ''}
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
