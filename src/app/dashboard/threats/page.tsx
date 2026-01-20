import { AlertList } from '@/components/dashboard/threats/alert-list';
import { threats } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function ThreatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Threat & Alert Center</h1>
        <p className="text-muted-foreground">Monitor and respond to security threats in real-time.</p>
      </div>
      <Separator />
      <AlertList alerts={threats} />
    </div>
  );
}
