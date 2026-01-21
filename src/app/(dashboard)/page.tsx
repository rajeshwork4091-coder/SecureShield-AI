'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Device, Threat } from '@/lib/data';
import { StatsCard } from '@/components/dashboard/overview/stats-card';
import { ThreatsChart } from '@/components/dashboard/overview/threats-chart';
import { DevicesChart } from '@/components/dashboard/overview/devices-chart';
import { AlertTriangle, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecentAlerts } from '@/components/dashboard/overview/recent-alerts';
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
      const dateStr = format(new Date(alert.timestamp), 'MMM d');
      if (!threatsByDay[dateStr]) {
        threatsByDay[dateStr] = { detected: 0, resolved: 0 };
      }
      threatsByDay[dateStr].detected++;
      if (alert.status === 'Resolved') {
        threatsByDay[dateStr].resolved++;
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
    
    const recentAlerts = alerts.slice(0, 5);

    const overallRisk = (() => {
        const highRiskDevices = devices.filter(d => d.riskLevel === 'High').length;
        const highSeverityAlerts = alerts.filter(a => a.severity === 'High' && a.status === 'Active').length;

        if (highRiskDevices > 0 || highSeverityAlerts > 0) {
            return { label: 'High Risk', icon: '🔴' };
        }
        const mediumRiskDevices = devices.filter(d => d.riskLevel === 'Medium').length;
        const mediumSeverityAlerts = alerts.filter(a => a.severity === 'Medium' && a.status === 'Active').length;

        if (mediumRiskDevices > 0 || mediumSeverityAlerts > 0) {
            return { label: 'Medium Risk', icon: '🟡' };
        }
        return { label: 'Low Risk', icon: '🟢' };
    })();


    return {
      stats: { activeThreats, resolvedIncidents, devicesOnline, devicesOffline },
      threatsOverTime,
      devicesByPolicy,
      recentAlerts,
      overallRisk
    };
  }, [loading, alerts, devices]);

  if (loading || !dashboardData) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
        </div>
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
         <Skeleton className="h-96" />
      </div>
    );
  }
  
  const riskBadgeClass = {
      'High Risk': 'border-red-200 bg-red-100 text-red-800',
      'Medium Risk': 'border-yellow-200 bg-yellow-100 text-yellow-800',
      'Low Risk': 'border-green-200 bg-green-100 text-green-800',
  }
  const riskPingClass = {
      'High Risk': 'bg-red-400',
      'Medium Risk': 'bg-yellow-400',
      'Low Risk': 'bg-green-400',
  }
   const riskDotClass = {
      'High Risk': 'bg-red-500',
      'Medium Risk': 'bg-yellow-500',
      'Low Risk': 'bg-green-500',
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <h1 className="font-headline text-3xl font-semibold">Security Overview</h1>
            <Badge variant="secondary" className={riskBadgeClass[dashboardData.overallRisk.label]}>
              <div className="relative mr-2 flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${riskPingClass[dashboardData.overallRisk.label]}`} />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${riskDotClass[dashboardData.overallRisk.label]}`} />
              </div>
              Overall Risk Status: {dashboardData.overallRisk.icon} {dashboardData.overallRisk.label}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">Manage devices, monitor threats, and apply security policies.</p>
      </div>

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
        <div>
          <DevicesChart data={dashboardData.devicesByPolicy} />
          <p className="mt-2 px-2 text-sm text-muted-foreground">
            Strict policy devices receive real-time scanning and automatic isolation.
          </p>
        </div>
      </div>
      <RecentAlerts alerts={dashboardData.recentAlerts} />
    </div>
  );
}
