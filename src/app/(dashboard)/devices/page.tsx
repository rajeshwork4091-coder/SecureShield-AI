import { devices, type Device } from '@/lib/data';
import { columns } from '@/components/dashboard/devices/columns';
import { DataTable } from '@/components/dashboard/devices/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

async function getDevices(): Promise<Device[]> {
  // In a real app, you would fetch this data from your database.
  return devices;
}

export default async function DevicesPage() {
  const data = await getDevices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Device Management</h1>
          <p className="text-muted-foreground">View, manage, and protect your endpoint devices.</p>
          <p className="pt-2 text-sm text-muted-foreground">Devices are enrolled using a lightweight endpoint agent.</p>
        </div>
        <Button disabled>
          <PlusCircle />
          Enroll New Device
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
