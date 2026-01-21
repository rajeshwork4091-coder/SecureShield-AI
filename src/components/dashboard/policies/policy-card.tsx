'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { SecurityPolicy } from '@/lib/data';
import { ShieldAlert, ShieldCheck, ShieldQuestion, BrainCircuit, Zap, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { saveSecurityPolicy } from '@/lib/firebase/firestore';

interface PolicyCardProps {
  policy: SecurityPolicy;
  tenantId: string | null;
  userId: string | undefined;
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

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, tenantId, userId }) => {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [scanLevel, setScanLevel] = useState(policy.scanLevel);
  const [autoQuarantine, setAutoQuarantine] = useState(policy.autoQuarantine);
  const [offlineProtection, setOfflineProtection] = useState(policy.offlineProtection);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setScanLevel(policy.scanLevel);
    setAutoQuarantine(policy.autoQuarantine);
    setOfflineProtection(policy.offlineProtection);
    setIsDirty(false);
  }, [policy]);

  useEffect(() => {
    const isChanged =
      scanLevel !== policy.scanLevel ||
      autoQuarantine !== policy.autoQuarantine ||
      offlineProtection !== policy.offlineProtection;
    setIsDirty(isChanged);
  }, [scanLevel, autoQuarantine, offlineProtection, policy]);

  const handleSave = async () => {
    if (!firestore || !tenantId || !userId) {
       toast({ variant: 'destructive', title: 'Error', description: 'Cannot save policy. Missing required information.' });
       return;
    }

    setIsSaving(true);
    try {
      const settings = { scanLevel, autoQuarantine, offlineProtection };
      await saveSecurityPolicy(firestore, tenantId, policy.name, settings, userId);
      toast({ title: 'Policy Saved', description: `The "${policy.name}" policy has been updated.` });
    } catch (error: any) {
       toast({ variant: 'destructive', title: 'Save Failed', description: error.message || 'Could not save the policy.' });
    } finally {
      setIsSaving(false);
    }
  };


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
          <Select value={scanLevel} onValueChange={(value) => setScanLevel(value as any)}>
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
          <Switch checked={autoQuarantine} onCheckedChange={setAutoQuarantine} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div>
            <Label>Offline Protection</Label>
            <p className="text-xs text-muted-foreground">Use cached definitions when offline.</p>
          </div>
          <Switch checked={offlineProtection} onCheckedChange={setOfflineProtection} />
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
        <Button onClick={handleSave} disabled={!isDirty || isSaving} className="w-full">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Policy'}
        </Button>
      </CardFooter>
    </Card>
  );
};
