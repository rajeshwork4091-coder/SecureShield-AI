'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  Gauge,
  Laptop,
  Shield,
  AlertTriangle,
  Settings,
  LifeBuoy,
  ShieldHalf,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardSidebarProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Gauge },
  { href: '/dashboard/devices', label: 'Devices', icon: Laptop },
  { href: '/dashboard/threats', label: 'Threats', icon: AlertTriangle },
  { href: '/dashboard/policies', label: 'Policies', icon: Shield },
];

const secondaryNavItems = [
  { href: '/dashboard/account', label: 'Account', icon: Settings },
  { href: '#', label: 'Support', icon: LifeBuoy },
];

export function DashboardSidebar({
  isMobile = false,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const renderNavLink = (item: typeof navItems[0]) => {
    const isActive =
      (item.href === '/dashboard' && pathname === '/dashboard') ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href));

    if (isCollapsed) {
      return (
        <TooltipProvider key={item.href}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary',
                  { 'bg-muted text-primary': isActive }
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          { 'bg-muted text-primary': isActive }
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'flex h-full max-h-screen flex-col gap-2 border-r bg-card',
        isMobile ? 'w-full' : ''
      )}
    >
      <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          {isCollapsed ? (
            <ShieldHalf className="h-6 w-6 text-primary" />
          ) : (
            <AppLogo />
          )}
          <span className="sr-only">SecureShield AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav
          className={cn(
            'grid items-start gap-1 text-sm font-medium',
            isCollapsed ? 'justify-center px-2' : 'px-4'
          )}
        >
          {navItems.map(renderNavLink)}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav
          className={cn(
            'grid items-start gap-1 text-sm font-medium',
            isCollapsed ? 'justify-center px-2' : 'px-4'
          )}
        >
          {secondaryNavItems.map(renderNavLink)}
        </nav>
      </div>
    </div>
  );
}
