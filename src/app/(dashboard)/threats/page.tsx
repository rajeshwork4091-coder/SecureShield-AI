'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Threat, Device } from '@/lib/data';
import { AlertList } from '@/components/dashboard/threats/alert-list';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function ThreatsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Threat[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !firestore) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let unsub: (() => void) | undefined;
    const fetchTenantId = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setTenantId(userDocSnap.data().tenantId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user tenant:", error);
        setLoading(false);
      }
    };
    fetchTenantId();
    
    return () => {
      if (unsub) unsub();
    };
  }, [user, firestore, userLoading]);

  useEffect(() => {
    if (!tenantId || !firestore) return;

    setLoading(true);
    
    const alertsQuery = query(
      collection(firestore, 'tenants', tenantId, 'alerts'),
      orderBy('timestamp', 'desc')
    );
    const alertsUnsub = onSnapshot(alertsQuery, (querySnapshot) => {
      const alertsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.().toISOString() || '',
        } as Threat;
      });
      setAlerts(alertsData);
      if(devices.length > 0) setLoading(false);
    }, (error) => {
      console.error("Error fetching alerts:", error);
      setLoading(false);
    });

    const devicesQuery = query(collection(firestore, 'tenants', tenantId, 'devices'));
    const devicesUnsub = onSnapshot(devicesQuery, (snapshot) => {
      const devicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Device[];
      setDevices(devicesData);
      if(alerts.length > 0 || snapshot.empty) setLoading(false);
    }, (error) => {
       console.error("Error fetching devices:", error);
       setLoading(false);
    });

    return () => {
      alertsUnsub();
      devicesUnsub();
    };
  }, [tenantId, firestore]);

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
      {loading ? (
         <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
      ) : (
        <AlertList alerts={alerts} devices={devices} tenantId={tenantId} userId={user?.uid} />
      )}
    </div>
  );
}
