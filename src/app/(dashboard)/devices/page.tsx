
'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import type { Device } from '@/lib/data';
import { columns } from '@/components/dashboard/devices/columns';
import { DataTable } from '@/components/dashboard/devices/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EnrollDeviceDialog } from '@/components/dashboard/devices/enroll-device-dialog';

export default function DevicesPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isEnrollDialogOpen, setEnrollDialogOpen] = useState(false);

  useEffect(() => {
    if (userLoading || !firestore) {
        return;
    }

    if (!user) {
        setLoading(false);
        return;
    }

    let unsubscribe: (() => void) | undefined;

    const fetchTenantAndDevices = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userTenantId = userDocSnap.data().tenantId;
          setTenantId(userTenantId);
          if (userTenantId) {
            const devicesQuery = query(collection(firestore, 'tenants', userTenantId, 'devices'));
            unsubscribe = onSnapshot(devicesQuery, (querySnapshot) => {
              const devicesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Device[];
              setDevices(devicesData);
              setLoading(false);
            }, (error) => {
              console.error("Error fetching devices:", error);
              setLoading(false);
            });
          } else {
             setLoading(false);
          }
        } else {
           setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user tenant:", error);
        setLoading(false);
      }
    };

    fetchTenantAndDevices();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, firestore, userLoading]);

  return (
    <>
      <EnrollDeviceDialog
        isOpen={isEnrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        tenantId={tenantId}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-semibold">Device Management</h1>
            <p className="text-muted-foreground">View, manage, and protect your endpoint devices.</p>
            <p className="pt-2 text-sm text-muted-foreground">Devices are enrolled using a lightweight endpoint agent.</p>
          </div>
          <Button onClick={() => setEnrollDialogOpen(true)}>
            <PlusCircle />
            Enroll New Device
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={devices} tenantId={tenantId} />
        )}
      </div>
    </>
  );
}
