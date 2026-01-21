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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeviceDetailSheetProps {
  device: Device | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onIsolateDevice: () => void;
}

const riskVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

export function DeviceDetailSheet({ device, isOpen, onOpenChange, onIsolateDevice }: DeviceDetailSheetProps) {
  if (!device) return null;

  const lastSeenDate = (device.lastSeen as any)?.toDate?.();
  const createdAtDate = (device.createdAt as any)?.toDate?.();

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };


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
                 <span className={cn('h-2 w-2 rounded-full mr-2', 
                    device.status === 'Online' ? 'bg-green-500' : 
                    device.status === 'Isolated' ? 'bg-destructive' : 'bg-muted-foreground'
                  )} />
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
              <p>{formatDate(lastSeenDate)}</p>
            </div>
          </div>
          <Separator />
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p>{formatDate(createdAtDate)}</p>
            </div>
          </div>
        </div>
        <SheetFooter className="gap-2 sm:justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button disabled={device.status === 'Isolated'}>
                    <ShieldOff className="mr-2 h-4 w-4" /> Isolate Device
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will isolate {device.deviceName} from the network. This action cannot be easily undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onIsolateDevice}>Isolate</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
