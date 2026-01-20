import { StatsCard } from '@/components/dashboard/overview/stats-card';
import { ThreatsChart } from '@/components/dashboard/overview/threats-chart';
import { DevicesChart } from '@/components/dashboard/overview/devices-chart';
import { AlertTriangle, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { dashboardData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RecentAlerts } from '@/components/dashboard/overview/recent-alerts';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <h1 className="font-headline text-3xl font-semibold">Security Overview</h1>
                <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 text-yellow-800">
                    <div className="relative mr-2 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500" />
                    </div>
                    Overall Risk Status: 🟡 Medium Risk
                </Badge>
            </div>
        </div>
        <p className="text-muted-foreground">Manage devices, monitor threats, and apply security policies.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <StatsCard
                  title="Active Threats"
                  value={dashboardData.stats.activeThreats}
                  icon={AlertTriangle}
                  change={dashboardData.stats.activeThreatsChange}
                  changeType={dashboardData.stats.activeThreatsChangeType}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Threats identified based on unusual process and network behaviour.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
        <div>
          <DevicesChart data={dashboardData.devicesByPolicy} />
           <p className="mt-2 px-2 text-sm text-muted-foreground">
            Strict policy devices receive real-time scanning and automatic isolation.
          </p>
        </div>
      </div>
      <RecentAlerts />
    </div>
  );
}
