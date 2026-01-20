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
import { useState } from 'react';
import { generateExplainableAlert, type ExplainableAlertOutput } from '@/ai/flows/explainable-ai-alerts';
import { Skeleton } from '@/components/ui/skeleton';

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

function AIExplanation({ explanation }: { explanation: ExplainableAlertOutput }) {
  const severityBadgeMap = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
  } as const;

  return (
    <div className="mt-4 space-y-4 rounded-md border bg-muted/50 p-4">
      <h4 className="font-semibold flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        AI-Powered Explanation
      </h4>
      <p className="text-sm">{explanation.explanation}</p>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Severity:</span>
          <Badge variant={severityBadgeMap[explanation.severity]}>{explanation.severity}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Quarantine Recommended:</span>
          <Badge variant={explanation.quarantineRecommended ? 'destructive' : 'default'}>
            {explanation.quarantineRecommended ? 'Yes' : 'No'}
          </Badge>
        </div>
      </div>
      <div>
        <h5 className="font-medium">Recommended Actions:</h5>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {explanation.resolveActions.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AlertList({ alerts }: AlertListProps) {
  const [explanations, setExplanations] = useState<Record<string, ExplainableAlertOutput | 'loading'>>({});

  const handleExplain = async (alert: Threat) => {
    if (explanations[alert.id]) return;

    setExplanations((prev) => ({ ...prev, [alert.id]: 'loading' }));

    try {
      const result = await generateExplainableAlert({
        threatType: alert.type,
        detectionMethod: alert.detectionMethod,
        rawTelemetry: alert.rawTelemetry,
        riskScore: alert.riskScore,
      });
      setExplanations((prev) => ({ ...prev, [alert.id]: result }));
    } catch (error) {
      console.error('Failed to get AI explanation', error);
      // remove loading state on error
      setExplanations((prev) => {
        const newState = { ...prev };
        delete newState[alert.id];
        return newState;
      });
    }
  };
  
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
              <p className="hidden text-sm text-muted-foreground lg:block">{new Date(alert.timestamp).toLocaleString()}</p>
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
                  <p className="text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="font-medium">Affected File</p>
                <p className="font-code text-sm text-muted-foreground">{alert.details.file}</p>
              </div>

              {explanations[alert.id] === 'loading' && <Skeleton className="h-48 w-full" />}
              {explanations[alert.id] && explanations[alert.id] !== 'loading' && (
                <AIExplanation explanation={explanations[alert.id] as ExplainableAlertOutput} />
              )}
            </div>
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button
                size="sm"
                onClick={() => handleExplain(alert)}
                disabled={!!explanations[alert.id]}
              >
                <Bot className="mr-2 h-4 w-4" />
                {explanations[alert.id] ? 'Explanation Generated' : 'Explain with AI'}
              </Button>
              <Button size="sm" variant="outline">
                Isolate Device
              </Button>
              <Button size="sm" variant="outline">
                Mark as Resolved
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
