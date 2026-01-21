'use client';

import type { Threat } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bot, Cpu, File, ShieldQuestion, Lock, ShieldAlert, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AlertListProps {
  alerts: Threat[];
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

const getExplanation = (alert: Threat) => {
    switch(alert.type) {
        case 'Ransomware Behavior': return 'Detected due to unusual mass file encryption activity.';
        case 'Malware Detected': return 'Detected a known malware signature matching a file on the device.';
        case 'Phishing Attempt': return 'Outbound network traffic to a known malicious domain was blocked.';
        case 'Unusual Network Traffic': return 'Anomalous outbound data transfer detected, exceeding normal benchmarks.';
        default: return 'Threat detected based on system analysis.';
    }
}


export function AlertList({ alerts }: AlertListProps) {
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
        // The device policy can be added back here later by fetching device data
        const devicePolicy = 'N/A';
        
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
              <p className="hidden text-sm text-muted-foreground lg:block">{alert.timestamp.substring(0, 19).replace('T', ' ')}</p>
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
                        <p className="text-muted-foreground">{alert.timestamp.substring(0, 19).replace('T', ' ')}</p>
                    </div>
                    <div className="col-span-2 md:col-span-4">
                        <p className="font-medium">Risk Score: {alert.riskScore}/100</p>
                        <Progress value={alert.riskScore} className="mt-1 h-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="font-medium">AI-Generated Explanation</p>
                        <p className="text-sm text-muted-foreground">{getExplanation(alert)}</p>
                    </div>
                    <div>
                        <p className="font-medium">Affected File / Process</p>
                        <p className="font-code text-sm text-muted-foreground">{alert.details.file !== 'N/A' ? alert.details.file : alert.details.process}</p>
                    </div>
                </div>

                </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              <Button
                size="sm"
                disabled
              >
                <Bot className="mr-2 h-4 w-4" />
                Explain with AI
              </Button>
              <Button size="sm" variant="outline" disabled>
                 <Lock className="mr-2 h-4 w-4" />
                Isolate Device
              </Button>
               <Button size="sm" variant="outline" disabled>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Quarantine Threat
              </Button>
              <Button size="sm" variant="outline" disabled>
                <Check className="mr-2 h-4 w-4" />
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
