'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { type Device } from '@/lib/data';
import { DeviceDetailSheet } from './device-detail-sheet';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tenantId: string | null;
}

export function DataTable<TData extends Device, TValue>({
  columns,
  data,
  tenantId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({})
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();


  const handleIsolateDevices = async (deviceIds: string[]) => {
    if (!firestore || !tenantId || deviceIds.length === 0) return;

    try {
      const batch = writeBatch(firestore);
      deviceIds.forEach(id => {
        const deviceRef = doc(firestore, 'tenants', tenantId, 'devices', id);
        batch.update(deviceRef, {
          isolated: true,
          status: 'Isolated',
          riskLevel: 'High',
        });
      });
      await batch.commit();

      toast({
        title: 'Device(s) Isolated',
        description: `${deviceIds.length} device(s) have been isolated from the network.`,
      });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || 'Could not isolate the device(s).',
        })
    }
  }


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    meta: {
      setSelectedDevice: (device: Device) => setSelectedDevice(device),
      isolateDevices: (deviceIds: string[]) => {
        const selectedDevice = data.find(d => deviceIds.includes(d.id));
        if (selectedDevice?.status === 'Isolated') return;
        
        // This is a simple confirmation, for a real app, use a custom modal
        if (window.confirm(`Are you sure you want to isolate ${deviceIds.length} device(s)? This action cannot be undone from the UI.`)) {
          handleIsolateDevices(deviceIds);
        }
      },
    },
  });

  const selectedDeviceIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);

  return (
    <>
      <DeviceDetailSheet
        device={selectedDevice}
        isOpen={!!selectedDevice}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedDevice(null);
          }
        }}
        onIsolateDevice={() => {
            if (selectedDevice) {
                table.options.meta?.isolateDevices([selectedDevice.id]);
            }
        }}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter by device name..."
              value={(table.getColumn('deviceName')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('deviceName')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                        <ShieldCheck /> Apply Policy to Selected
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <ShieldOff /> Isolate Selected
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will isolate {selectedDeviceIds.length} device(s) from the network. This action
                            cannot be easily undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleIsolateDevices(selectedDeviceIds)}>
                            Isolate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                </div>
            )}
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No devices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
