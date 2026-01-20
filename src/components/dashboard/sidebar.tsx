'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppLogo,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  Gauge,
  Laptop,
  Shield,
  AlertTriangle,
  Settings,
  LifeBuoy,
} from 'lucide-react';

interface DashboardSidebarProps {
  isMobile?: boolean;
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

export function DashboardSidebar({ isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navLinkClasses = (href: string) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      {
        'bg-muted text-primary': (href === '/dashboard' && pathname === '/dashboard') || (href !== '/dashboard' && pathname.startsWith(href)),
        'justify-center': isMobile,
      }
    );

  return (
    <div className={cn('hidden border-r bg-card md:block', { 'block md:hidden': isMobile })}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <AppLogo />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClasses(item.href)}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
             {secondaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClasses(item.href)}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
