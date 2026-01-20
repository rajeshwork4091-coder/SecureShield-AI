'use client';

import { UserNav } from '@/components/dashboard/user-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from './sidebar';

export function DashboardHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <DashboardSidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSidebar}
        className="hidden h-9 w-9 md:inline-flex"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Can add a search bar here if needed */}
      </div>
      <div className="text-sm text-muted-foreground">
        Last updated: 18 Jan 2026 (Simulated Data)
      </div>
      <UserNav />
    </header>
  );
}
