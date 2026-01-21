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
import { useFirestore, useUser } from '@/firebase';
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
} from '@/components/ui/alert-dialog';
import { ChangePolicyModal } from './change-policy-modal';
import { isolateDevices, changeDevicePolicy, type Policy } from '@/lib/firebase/firestore';

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
  const [rowSelection, setRowSelection] = useState({});

  // Component State
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Device Detail Sheet State
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Isolation Dialog State
  const [isIsolateDialogOpen, setIsolateDialogOpen] = useState(false);
  const [devicesToIsolate, setDevicesToIsolate] = useState<string[]>([]);

  // Change Policy Modal State
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);
  const [deviceToUpdate, setDeviceToUpdate] = useState<Device | null>(null);


  const handleIsolate = async () => {
    if (!firestore || !tenantId || !user || devicesToIsolate.length === 0) return;

    setIsUpdating(true);
    try {
      await isolateDevices(firestore, tenantId, devicesToIsolate, user.uid);
      toast({
        title: 'Device(s) Isolated',
        description: `${devicesToIsolate.length} device(s) have been put into isolation.`,
      });
      table.clearRowSelection();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Isolation Failed',
        description: error.message || 'Could not isolate the device(s). Check permissions.',
      });
    } finally {
      setIsUpdating(false);
      setIsolateDialogOpen(false);
      setDevicesToIsolate([]);
    }
  };
  
  const handleChangePolicy = async (policy: Policy) => {
    if (!firestore || !tenantId || !user || !deviceToUpdate) return;
    
    setIsUpdating(true);
    try {
      await changeDevicePolicy(firestore, tenantId, deviceToUpdate.id, policy, user.uid);
      toast({
        title: 'Policy Updated',
        description: `Policy for ${deviceToUpdate.deviceName} changed to ${policy}.`,
      });
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Policy Update Failed',
        description: error.message || 'Could not change the policy. Check permissions.',
      });
    } finally {
      setIsUpdating(false);
      setPolicyModalOpen(false);
      setDeviceToUpdate(null);
    }
  };

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
        const devicesToUpdate = data.filter(
          (d) => deviceIds.includes(d.id) && d.status !== 'Isolated'
        );
        if (devicesToUpdate.length > 0) {
          setDevicesToIsolate(devicesToUpdate.map((d) => d.id));
          setIsolateDialogOpen(true);
        }
      },
      openChangePolicyModal: (device: Device) => {
        setDeviceToUpdate(device);
        setPolicyModalOpen(true);
      }
    },
  });

  const selectedDeviceIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

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
        onChangePolicy={() => {
            if (selectedDevice) {
                table.options.meta?.openChangePolicyModal(selectedDevice);
            }
        }}
      />
      <AlertDialog open={isIsolateDialogOpen} onOpenChange={setIsolateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will isolate {devicesToIsolate.length} device(s) from the
              network. This action cannot be easily undone from this UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDevicesToIsolate([]);
                setIsolateDialogOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleIsolate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Isolating...' : 'Isolate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChangePolicyModal 
        isOpen={isPolicyModalOpen}
        onOpenChange={setPolicyModalOpen}
        onSelectPolicy={handleChangePolicy}
        isUpdating={isUpdating}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter by device name..."
              value={
                (table.getColumn('deviceName')?.getFilterValue() as string) ?? ''
              }
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  table.options.meta?.isolateDevices(selectedDeviceIds)
                }
              >
                <ShieldOff /> Isolate Selected
              </Button>
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
