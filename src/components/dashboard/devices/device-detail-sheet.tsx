'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Device } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AlertCircle, ShieldCheck, ShieldOff } from 'lucide-react';

interface DeviceDetailSheetProps {
  device: Device | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const riskVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

export function DeviceDetailSheet({ device, isOpen, onOpenChange }: DeviceDetailSheetProps) {
  if (!device) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">{device.deviceName}</SheetTitle>
          <SheetDescription>
            {device.os} &middot; {device.ipAddress}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center">
                 <span className={cn('h-2 w-2 rounded-full mr-2', device.status === 'Online' ? 'bg-green-500' : 'bg-muted-foreground')} />
                {device.status}
              </div>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <Badge variant={riskVariantMap[device.riskLevel]}>{device.riskLevel}</Badge>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Policy</p>
              <p>{device.policy}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Seen</p>
              <p>{device.lastSeen.substring(0, 19).replace('T', ' ')}</p>
            </div>
          </div>
          <Separator />
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p>{device.createdAt ? device.createdAt.substring(0, 19).replace('T', ' ') : 'N/A'}</p>
            </div>
          </div>
        </div>
        <SheetFooter className="gap-2 sm:justify-start">
            <Button disabled>
                <ShieldOff className="mr-2 h-4 w-4" /> Isolate Device
            </Button>
            <Button variant="outline" disabled>
                <AlertCircle className="mr-2 h-4 w-4" /> View Alerts
            </Button>
            <Button variant="outline" disabled>
                <ShieldCheck className="mr-2 h-4 w-4" /> Change Policy
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
