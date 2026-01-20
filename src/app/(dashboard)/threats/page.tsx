'use client';

import { AlertList } from '@/components/dashboard/threats/alert-list';
import { threats } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ThreatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Threat & Alert Center</h1>
        <p className="text-muted-foreground">Monitor and respond to security threats in real-time.</p>
      </div>
      <Separator />
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
          <div className="flex-1 space-y-2">
            <Label>Filter by severity</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Filter by detection method</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Anomaly Detection">Anomaly Detection</SelectItem>
                <SelectItem value="Signature Matching">Signature Matching</SelectItem>
                <SelectItem value="Behavioral Analysis">Behavioral Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Filter by status</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Quarantined">Quarantined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <AlertList alerts={threats} />
    </div>
  );
}
