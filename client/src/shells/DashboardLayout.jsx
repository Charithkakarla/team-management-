// Dashboard layout: keeps sidebar, navbar, and assistant together.
// It wraps every protected page in the main app shell.
// Use this file to understand the dashboard frame.
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
import { Navbar } from '../ui/Navbar';
import { useState } from 'react';
import { FloatingAssistant } from '../ui/FloatingAssistant';

// Dashboard shell: keeps the sidebar, top bar, and assistant together.
export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <Navbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((current) => !current)}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <Outlet />
          </div>
        </main>
        <FloatingAssistant />
      </div>
    </div>
  );
};
