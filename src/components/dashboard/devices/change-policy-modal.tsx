'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Policy } from '@/lib/firebase/firestore';
import { Shield, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface ChangePolicyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectPolicy: (policy: Policy) => void;
  isUpdating: boolean;
}

const policies: { name: Policy; icon: React.ReactNode; description: string }[] = [
  { name: 'Strict', icon: <ShieldAlert />, description: 'Maximum security for critical assets.' },
  { name: 'Balanced', icon: <Shield />, description: 'Recommended for most devices.' },
  { name: 'Lenient', icon: <ShieldQuestion />, description: 'Basic protection for low-risk devices.' },
];

export function ChangePolicyModal({
  isOpen,
  onOpenChange,
  onSelectPolicy,
  isUpdating,
}: ChangePolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Security Policy</DialogTitle>
          <DialogDescription>
            Select a new policy to apply to the device. The change will be effective immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          {policies.map(({ name, icon, description }) => (
            <Button
              key={name}
              variant="outline"
              onClick={() => onSelectPolicy(name)}
              className="h-auto w-full justify-start text-left"
              disabled={isUpdating}
            >
              {icon}
              <div className="ml-3">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
