import { StatsCard } from '@/components/dashboard/overview/stats-card';
import { ThreatsChart } from '@/components/dashboard/overview/threats-chart';
import { DevicesChart } from '@/components/dashboard/overview/devices-chart';
import { AlertTriangle, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { dashboardData } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-semibold">Security Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Threats"
          value={dashboardData.stats.activeThreats}
          icon={AlertTriangle}
          change={dashboardData.stats.activeThreatsChange}
          changeType={dashboardData.stats.activeThreatsChangeType}
        />
        <StatsCard
          title="Incidents Resolved"
          value={dashboardData.stats.resolvedIncidents}
          icon={ShieldCheck}
          change={dashboardData.stats.resolvedIncidentsChange}
          changeType={dashboardData.stats.resolvedIncidentsChangeType}
        />
        <StatsCard
          title="Devices Online"
          value={dashboardData.stats.devicesOnline}
          icon={Wifi}
          change={dashboardData.stats.devicesOnlineChange}
          changeType={dashboardData.stats.devicesOnlineChangeType}
        />
        <StatsCard
          title="Devices Offline"
          value={dashboardData.stats.devicesOffline}
          icon={WifiOff}
          change={dashboardData.stats.devicesOfflineChange}
          changeType={dashboardData.stats.devicesOfflineChangeType}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ThreatsChart data={dashboardData.threatsOverTime} />
        <DevicesChart data={dashboardData.devicesByPolicy} />
      </div>
    </div>
  );
}
