import { PolicyCard } from '@/components/dashboard/policies/policy-card';
import { securityPolicies } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Security Policies</h1>
        <p className="text-muted-foreground">Define and assign security policies to your devices.</p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {securityPolicies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    </div>
  );
}
