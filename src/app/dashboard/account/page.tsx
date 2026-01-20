import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Account</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
            <div className="space-y-2">
              <Label>Last login</Label>
              <p className="text-sm text-muted-foreground">18 Jan 2026, 16:32 (Web)</p>
            </div>
            <Button disabled>Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Multi-factor authentication helps protect your account against unauthorized access.</p>
            <p className="text-sm text-muted-foreground">MFA is currently disabled.</p>
            <Button disabled>Enable MFA</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
