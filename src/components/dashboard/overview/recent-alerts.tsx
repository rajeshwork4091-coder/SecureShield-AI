import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert, Check, ShieldQuestion } from 'lucide-react';
import type { Threat } from '@/lib/data';
import { format } from 'date-fns';

const statusVariantMap = {
  Quarantined: 'secondary',
  'Under Review': 'secondary',
  Resolved: 'outline',
  Active: 'destructive'
} as const;

interface RecentAlertsProps {
    alerts: Threat[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>A summary of the latest security events.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <ShieldQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Recent Alerts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                Your environment is currently clear of any detected threats.
                </p>
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Threat Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {alerts.map((alert) => (
                <TableRow key={alert.id}>
                    <TableCell>{format(new Date(alert.timestamp), 'p')}</TableCell>
                    <TableCell className="font-medium">{alert.device}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>
                    <Badge variant={statusVariantMap[alert.status as keyof typeof statusVariantMap]}>
                        {alert.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" disabled>
                        <Lock /> Isolate Device
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                        <ShieldAlert /> Quarantine Threat
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                        <Check /> Mark as Resolved
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
}
