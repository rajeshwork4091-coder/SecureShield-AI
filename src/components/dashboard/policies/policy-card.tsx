'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { SecurityPolicy } from '@/lib/data';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { FC } from 'react';

interface PolicyCardProps {
  policy: SecurityPolicy;
}

const policyIcons = {
  Strict: <ShieldAlert className="h-6 w-6 text-destructive" />,
  Balanced: <ShieldCheck className="h-6 w-6 text-primary" />,
  Lenient: <ShieldQuestion className="h-6 w-6 text-muted-foreground" />,
};

export const PolicyCard: FC<PolicyCardProps> = ({ policy }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl">{policy.name}</CardTitle>
          {policyIcons[policy.name as keyof typeof policyIcons]}
        </div>
        <CardDescription>{policy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
      </CardContent>
      <CardFooter>
        <Button disabled className="w-full">
          Save Policy
        </Button>
      </CardFooter>
    </Card>
  );
};
