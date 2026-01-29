'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Device, Threat } from '@/lib/data';
import { StatsCard } from '@/components/dashboard/overview/stats-card';
import { ThreatsChart } from '@/components/dashboard/overview/threats-chart';
import { DevicesChart } from '@/components/dashboard/overview/devices-chart';
import { AlertTriangle, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Threat[]>([]);

  useEffect(() => {
    if (user && firestore) {
      const fetchTenantId = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setTenantId(userDocSnap.data().tenantId);
        } else {
          setLoading(false); // No tenant, stop loading
        }
      };
      fetchTenantId();
    } else if (!userLoading) {
      setLoading(false); // No user, stop loading
    }
  }, [user, firestore, userLoading]);

  useEffect(() => {
    if (!tenantId || !firestore) return;

    setLoading(true);

    const devicesQuery = query(collection(firestore, 'tenants', tenantId, 'devices'));
    const devicesUnsub = onSnapshot(devicesQuery, (snapshot) => {
      const devicesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Device[];
      setDevices(devicesData);
    });

    const alertsQuery = query(collection(firestore, 'tenants', tenantId, 'alerts'), orderBy('timestamp', 'desc'));
    const alertsUnsub = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
        } as Threat;
      });
      setAlerts(alertsData);
      setLoading(false);
    });

    return () => {
      devicesUnsub();
      alertsUnsub();
    };
  }, [tenantId, firestore]);

  const dashboardData = useMemo(() => {
    if (loading) return null;

    // Stats Cards
    const activeThreats = alerts.filter((a) => a.status === 'Active').length;
    const resolvedIncidents = alerts.filter((a) => a.status === 'Resolved').length;
    const devicesOnline = devices.filter((d) => d.status === 'Online').length;
    const devicesOffline = devices.filter((d) => d.status !== 'Online' && d.status !== 'Isolated' && d.status !== 'Decommissioned').length;

    // Threats Over Time Chart
    const threatsByDay: { [key: string]: { detected: number; resolved: number } } = {};
    alerts.forEach((alert) => {
      if (alert.timestamp) {
          const dateStr = format(new Date(alert.timestamp), 'MMM d');
          if (!threatsByDay[dateStr]) {
            threatsByDay[dateStr] = { detected: 0, resolved: 0 };
          }
          threatsByDay[dateStr].detected++;
          if (alert.status === 'Resolved') {
            threatsByDay[dateStr].resolved++;
          }
      }
    });

    const threatsOverTime = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = format(d, 'MMM d');
        return {
            date: dateStr,
            detected: threatsByDay[dateStr]?.detected || 0,
            resolved: threatsByDay[dateStr]?.resolved || 0,
        };
    }).reverse();


    // Devices By Policy Chart
    const devicesByPolicy = (['Strict', 'Balanced', 'Lenient'] as const).map(policyName => ({
        policy: policyName,
        total: devices.filter(d => d.policy === policyName).length
    }));

    return {
      stats: { activeThreats, resolvedIncidents, devicesOnline, devicesOffline },
      threatsOverTime,
      devicesByPolicy,
    };
  }, [loading, alerts, devices]);

  if (loading || !dashboardData) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="font-headline text-3xl font-semibold">Security Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-semibold">Security Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Threats"
          value={dashboardData.stats.activeThreats}
          icon={AlertTriangle}
        />
        <StatsCard
          title="Incidents Resolved"
          value={dashboardData.stats.resolvedIncidents}
          icon={ShieldCheck}
        />
        <StatsCard
          title="Devices Online"
          value={dashboardData.stats.devicesOnline}
          icon={Wifi}
        />
        <StatsCard
          title="Devices Offline"
          value={dashboardData.stats.devicesOffline}
          icon={WifiOff}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ThreatsChart data={dashboardData.threatsOverTime} />
        <DevicesChart data={dashboardData.devicesByPolicy} />
      </div>
    </div>
  );
}
