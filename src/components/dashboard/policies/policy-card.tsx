'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { SecurityPolicy } from '@/lib/data';
import { ShieldAlert, ShieldCheck, ShieldQuestion, BrainCircuit, Zap, AlertTriangle } from 'lucide-react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PolicyCardProps {
  policy: SecurityPolicy;
}

const policyIcons = {
  Strict: <ShieldAlert className="h-6 w-6 text-destructive" />,
  Balanced: <ShieldCheck className="h-6 w-6 text-primary" />,
  Lenient: <ShieldQuestion className="h-6 w-6 text-muted-foreground" />,
};

const levelVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

export const PolicyCard: FC<PolicyCardProps> = ({ policy }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl">{policy.name}</CardTitle>
          {policyIcons[policy.name as keyof typeof policyIcons]}
        </div>
        <CardDescription>{policy.description}</CardDescription>
        <p className="pt-1 text-xs text-muted-foreground">{policy.recommendedUse}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <BrainCircuit className="h-5 w-5 text-muted-foreground" />
            <p className="text-xs font-medium">AI Sensitivity</p>
            <Badge variant={levelVariantMap[policy.aiSensitivity]} className="capitalize">
              {policy.aiSensitivity}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <p className="text-xs font-medium">Security</p>
            <Badge variant={levelVariantMap[policy.securityLevel]} className="capitalize">
              {policy.securityLevel}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <p className="text-xs font-medium">Performance</p>
            <Badge variant={levelVariantMap[policy.performanceImpact]} className="capitalize">
              {policy.performanceImpact}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Scan Level</Label>
          <Select defaultValue={policy.settings.scanLevel} disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select scan level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quick">Quick Scan</SelectItem>
              <SelectItem value="full">Full Scan</SelectItem>
              <SelectItem value="deep">Deep Scan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div>
            <Label>Auto-Quarantine</Label>
            <p className="text-xs text-muted-foreground">Automatically quarantine high-risk threats.</p>
          </div>
          <Switch defaultChecked={policy.settings.autoQuarantine} disabled />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div>
            <Label>Offline Protection</Label>
            <p className="text-xs text-muted-foreground">Use cached definitions when offline.</p>
          </div>
          <Switch defaultChecked={policy.settings.offlineProtection} disabled />
        </div>
         {policy.name === 'Strict' && (
          <Alert variant="destructive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Changing this policy may affect device performance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <div className="text-center text-sm text-muted-foreground">
          Applied to <span className="font-semibold">{policy.deviceCount}</span> devices
        </div>
         <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-full" tabIndex={0}>
                <Button disabled className="w-full">
                  Save Policy
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Saving policies will be enabled in future versions.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
