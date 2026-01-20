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
import { AlertTriangle, Bot, Cpu, File, ShieldQuestion } from 'lucide-react';
import { format } from 'date-fns';

interface AlertListProps {
  alerts: Threat[];
}

const severityVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

const detectionMethodIconMap = {
  'Anomaly Detection': <Bot className="h-4 w-4" />,
  'Signature Matching': <File className="h-4 w-4" />,
  'Behavioral Analysis': <Cpu className="h-4 w-4" />,
};

export function AlertList({ alerts }: AlertListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {alerts.map((alert) => (
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
              <p className="hidden text-sm text-muted-foreground lg:block">{format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="font-medium">Device</p>
                  <p className="text-muted-foreground">{alert.device}</p>
                </div>
                <div>
                  <p className="font-medium">Risk Score</p>
                  <p className="text-muted-foreground">{alert.riskScore}/100</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground">{alert.status}</p>
                </div>
                 <div>
                  <p className="font-medium">Timestamp</p>
                  <p className="text-muted-foreground">{format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}</p>
                </div>
              </div>
              <div>
                <p className="font-medium">Affected File</p>
                <p className="font-code text-sm text-muted-foreground">{alert.details.file}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button
                size="sm"
                disabled
              >
                <Bot className="mr-2 h-4 w-4" />
                Explain with AI
              </Button>
              <Button size="sm" variant="outline" disabled>
                Isolate Device
              </Button>
              <Button size="sm" variant="outline" disabled>
                Mark as Resolved
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
