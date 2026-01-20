'use client';

import { type ColumnDef, RowData } from '@tanstack/react-table';
import type { Device } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Power, ShieldAlert, ShieldCheck, ShieldQuestion, Laptop, Server, Tablet, Apple, ShieldOff, Eye, Trash2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    setSelectedDevice: (device: Device) => void;
  }
}

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

const riskVariantMap = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
} as const;

const osIconMap: Record<Device['os'], React.ReactNode> = {
  Windows: <Laptop className="h-4 w-4 text-muted-foreground" />,
  macOS: <Apple className="h-4 w-4 text-muted-foreground" />,
  Linux: <Server className="h-4 w-4 text-muted-foreground" />,
  VM: <Server className="h-4 w-4 text-muted-foreground" />,
  Tablet: <Tablet className="h-4 w-4 text-muted-foreground" />,
}


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
    cell: ({ row, table }) => (
        <div 
            className="font-medium hover:underline cursor-pointer"
            onClick={() => table.options.meta?.setSelectedDevice(row.original)}
        >
            {row.original.name}
        </div>
    )
  },
  {
    accessorKey: 'os',
    header: 'OS',
    cell: ({ row }) => {
        const os = row.original.os;
        return (
            <div className="flex items-center gap-2">
                {osIconMap[os]}
                <span>{os}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'riskLevel',
    header: 'Risk Level',
    cell: ({row}) => {
        const riskLevel = row.original.riskLevel;
        return (
            <Badge variant={riskVariantMap[riskLevel]} className="capitalize">
                <span className="mr-2">
                    {riskLevel === 'High' && '🔴'}
                    {riskLevel === 'Medium' && '🟡'}
                    {riskLevel === 'Low' && '🟢'}
                </span>
                {riskLevel}
            </Badge>
        )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const isOffline = status === 'Offline';
      const statusCell = (
        <div className="flex items-center">
            <Power className={cn('mr-2 h-4 w-4', status === 'Online' ? 'text-green-500' : 'text-muted-foreground')} />
            {status}
        </div>
      );

      if(isOffline) {
          return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>{statusCell}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Offline (No heartbeat in last 48 hrs)</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )
      }

      return statusCell;
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
    cell: ({ row }) => {
      const dateString = row.getValue('lastSeen') as string;
      return dateString.substring(0, 19).replace('T', ' ');
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
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
            <DropdownMenuItem disabled>
                <Eye /> View Details
            </DropdownMenuItem>
             <DropdownMenuItem disabled>
                <ShieldOff /> Isolate Device
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Shield /> Change Policy
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" disabled>
                <Trash2 /> Remove Device
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
