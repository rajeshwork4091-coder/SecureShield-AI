'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <DashboardSidebar isCollapsed={isSidebarCollapsed} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
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
