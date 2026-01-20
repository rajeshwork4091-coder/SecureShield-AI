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
import { Lock, ShieldAlert, Check } from 'lucide-react';

const alerts = [
  {
    time: '10:45 AM',
    device: 'Laptop-01',
    threat: 'Ransomware',
    status: 'Quarantined',
  },
  {
    time: '09:30 AM',
    device: 'PC-02',
    threat: 'Suspicious Script',
    status: 'Under Review',
  },
];

const statusVariantMap = {
  Quarantined: 'destructive',
  'Under Review': 'secondary',
} as const;

export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>A summary of the latest security events.</CardDescription>
      </CardHeader>
      <CardContent>
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
            {alerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell>{alert.time}</TableCell>
                <TableCell className="font-medium">{alert.device}</TableCell>
                <TableCell>{alert.threat}</TableCell>
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
      </CardContent>
    </Card>
  );
}
