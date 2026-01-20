'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen transition-all duration-300 hidden md:block',
          isSidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <DashboardSidebar isCollapsed={isSidebarCollapsed} />
      </aside>
      <div
        className={cn(
          'flex h-screen flex-col transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        <DashboardHeader
          onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto bg-background p-4 pt-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
