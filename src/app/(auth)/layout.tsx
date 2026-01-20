import type { ReactNode } from 'react';
import { AppLogo } from '@/components/icons';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <AppLogo />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
