'use client';

import { type ColumnDef } from '@tanstack/react-table';
import type { Device } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Power, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const policyVariantMap = {
  Strict: 'destructive',
  Balanced: 'secondary',
  Lenient: 'outline',
} as const;

const policyIconMap = {
  Strict: <ShieldAlert className="mr-2 h-4 w-4" />,
  Balanced: <ShieldCheck className="mr-2 h-4 w-4" />,
  Lenient: <ShieldQuestion className="mr-2 h-4 w-4" />,
};


export const columns: ColumnDef<Device>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Device Name',
    cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center">
            <Power className={cn('mr-2 h-4 w-4', status === 'Online' ? 'text-green-500' : 'text-muted-foreground')} />
            {status}
        </div>
      );
    },
  },
  {
    accessorKey: 'policy',
    header: 'Policy',
    cell: ({ row }) => {
      const policy = row.getValue('policy') as Device['policy'];
      return (
        <Badge variant={policyVariantMap[policy]} className="capitalize">
            {policyIconMap[policy]}
            {policy}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
  },
  {
    accessorKey: 'lastSeen',
    header: 'Last Seen',
    cell: ({ row }) => new Date(row.getValue('lastSeen')).toLocaleString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const device = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem disabled onClick={() => navigator.clipboard.writeText(device.id)}>
              Copy Device ID
            </DropdownMenuItem>
            <DropdownMenuItem disabled>View Details</DropdownMenuItem>
            <DropdownMenuItem disabled>Isolate Device</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
