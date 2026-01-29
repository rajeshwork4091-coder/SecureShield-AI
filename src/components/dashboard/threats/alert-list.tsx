'use client';

import { useState } from 'react';
import type { Threat, Device } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bot, Cpu, File, ShieldQuestion, Lock, ShieldAlert, Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { isolateDeviceFromThreat, updateAlertStatus, explainThreatWithAI } from '@/lib/firebase/firestore';

interface AlertListProps {
  alerts: Threat[];
  devices: Device[];
  tenantId: string | null;
  userId: string | undefined;
}

const severityVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

const statusVariantMap = {
  Active: 'destructive',
  Resolved: 'outline',
  Quarantined: 'secondary',
} as const;

const detectionMethodIconMap = {
  'Anomaly Detection': <Bot className="h-4 w-4" />,
  'Signature Matching': <File className="h-4 w-4" />,
  'Behavioral Analysis': <Cpu className="h-4 w-4" />,
};

export function AlertList({ alerts, devices, tenantId, userId }: AlertListProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingAlerts, setUpdatingAlerts] = useState<Record<string, boolean>>({});

  const safeDevices = devices ?? [];

  const handleAction = async (alertId: string, action: () => Promise<any>) => {
    setUpdatingAlerts((prev) => ({ ...prev, [alertId]: true }));
    try {
      await action();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setUpdatingAlerts((prev) => ({ ...prev, [alertId]: false }));
    }
  };
  
  const handleIsolate = (alert: Threat) => {
    const device = safeDevices.find(d => d.deviceName === alert.device);
    if (!firestore || !tenantId || !userId || !device) return;
    handleAction(alert.id, async () => {
      await isolateDeviceFromThreat(firestore, tenantId, device.id, alert.id, userId);
      toast({ title: 'Device Isolated', description: `${device.deviceName} has been isolated.` });
    });
  };
  
  const handleQuarantine = (alertId: string) => {
    if (!firestore || !tenantId || !userId) return;
    handleAction(alertId, async () => {
      await updateAlertStatus(firestore, tenantId, alertId, 'Quarantined', userId);
      toast({ title: 'Threat Quarantined' });
    });
  };
  
  const handleResolve = (alertId: string) => {
    if (!firestore || !tenantId || !userId) return;
    handleAction(alertId, async () => {
      await updateAlertStatus(firestore, tenantId, alertId, 'Resolved', userId);
      toast({ title: 'Threat Resolved' });
    });
  };

  const handleExplain = (alertId: string) => {
    if (!firestore || !tenantId) return;
     handleAction(alertId, async () => {
       await explainThreatWithAI(firestore, tenantId, alertId);
       toast({ title: 'Explanation Generated' });
     });
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <ShieldQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Alerts Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your environment is currently clear of any detected threats.
        </p>
      </div>
    );
  }
  
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {alerts.map((alert) => {
        const device = safeDevices.find(d => d.deviceName === alert.device);
        const devicePolicy = device?.policy || alert.policyAtDetection || 'N/A';
        const isUpdating = updatingAlerts[alert.id];

        return (
        <AccordionItem value={alert.id} key={alert.id} className="rounded-lg border bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex w-full items-center gap-4 text-left">
              <AlertTriangle className={cn('h-6 w-6', {
                'text-destructive': alert.severity === 'High',
                'text-yellow-500': alert.severity === 'Medium',
                'text-muted-foreground': alert.severity === 'Low',
              })} />
              <div className="flex-1">
                <p className="font-semibold">{alert.type}</p>
                <p className="text-sm text-muted-foreground">Detected on {alert.device}</p>
              </div>
              <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                {detectionMethodIconMap[alert.detectionMethod as keyof typeof detectionMethodIconMap] || <ShieldQuestion className="h-4 w-4" />}
                <span>{alert.detectionMethod}</span>
              </div>
              <Badge variant={severityVariantMap[alert.severity]}>{alert.severity}</Badge>
              <Badge variant={statusVariantMap[alert.status]}>{alert.status}</Badge>
              <p suppressHydrationWarning className="hidden text-sm text-muted-foreground lg:block">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
             <div className="space-y-6 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm md:grid-cols-4">
                    <div>
                        <p className="font-medium">Device</p>
                        <p className="text-muted-foreground">{alert.device}</p>
                    </div>
                     <div>
                        <p className="font-medium">Device Policy</p>
                        <p className="text-muted-foreground">{devicePolicy}</p>
                    </div>
                    <div>
                        <p className="font-medium">Status</p>
                        <p className="text-muted-foreground">{alert.status}</p>
                    </div>
                    <div>
                        <p className="font-medium">Timestamp</p>
                        <p suppressHydrationWarning className="text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 md:col-span-4">
                        <p className="font-medium">Risk Score: {alert.riskScore}/100</p>
                        <Progress value={alert.riskScore} className="mt-1 h-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="font-medium">AI-Generated Explanation</p>
                        <p className="text-sm text-muted-foreground">{alert.aiExplanation || 'No explanation generated yet.'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Affected File / Process</p>
                        <code className="text-sm text-muted-foreground">{alert.details?.file && alert.details.file !== 'N/A' ? alert.details.file : alert.details?.process}</code>
                    </div>
                </div>

            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              <Button
                size="sm"
                onClick={() => handleExplain(alert.id)}
                disabled={isUpdating || !!alert.aiExplanation}
              >
                {isUpdating && updatingAlerts[alert.id] ? <Loader2 className="animate-spin" /> : <Bot />}
                Explain with AI
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleIsolate(alert)}
                disabled={isUpdating || alert.status !== 'Active' || device?.status === 'Isolated'}
              >
                 {isUpdating && updatingAlerts[alert.id] ? <Loader2 className="animate-spin" /> : <Lock />}
                Isolate Device
              </Button>
               <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuarantine(alert.id)}
                disabled={isUpdating || alert.status !== 'Active'}
               >
                {isUpdating && updatingAlerts[alert.id] ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
                Quarantine Threat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResolve(alert.id)}
                disabled={isUpdating || alert.status === 'Resolved'}
              >
                {isUpdating && updatingAlerts[alert.id] ? <Loader2 className="animate-spin" /> : <Check />}
                Mark as Resolved
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        )
      })}
    </Accordion>
  );
}
