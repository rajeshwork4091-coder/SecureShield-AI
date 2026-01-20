'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen transition-all duration-300',
          isSidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {isClient ? <DashboardSidebar isCollapsed={isSidebarCollapsed} /> : null}
      </aside>
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        {isClient ? (
          <DashboardHeader
            onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          />
        ) : (
           <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6" />
        )}
        <main className="flex-1 overflow-y-auto bg-background p-4 pt-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
