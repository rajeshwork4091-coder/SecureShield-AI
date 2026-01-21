'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { generateEnrollmentToken } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';

interface EnrollDeviceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tenantId: string | null;
}

export function EnrollDeviceDialog({ isOpen, onOpenChange, tenantId }: EnrollDeviceDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleGenerateToken = async () => {
    if (!firestore || !tenantId || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot generate token. User or tenant not found.',
      });
      return;
    }

    setIsLoading(true);
    setToken(null);
    try {
      const generatedToken = await generateEnrollmentToken(firestore, tenantId, user.uid);
      setToken(generatedToken);
      toast({
        title: 'Token Generated',
        description: 'This token is valid for 15 minutes.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not generate the enrollment token.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setToken(null);
    onOpenChange(false);
  };
  
  const handleCopyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    toast({
        title: "Copied!",
        description: "Enrollment token copied to clipboard."
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll New Device</DialogTitle>
          <DialogDescription>
            Generate a secure, one-time enrollment token for installing the SecureShield agent on a new device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
                This token is single-use and expires in 15 minutes. Provide it to the endpoint agent during installation.
            </p>

            <Button onClick={handleGenerateToken} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Enrollment Token'}
            </Button>

            {token && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Generated Token:</p>
                <div className="flex gap-2">
                    <code className="block flex-1 rounded bg-muted p-2 text-sm font-mono break-all">
                        {token}
                    </code>
                    <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>Copy</Button>
                </div>
                <p className="text-xs text-muted-foreground">The endpoint agent will use this token to securely register itself with your tenant.</p>
              </div>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
