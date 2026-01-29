'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  companyName: string;
  email: string;
}

export default function AccountPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      setProfileLoading(true);
      const docRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          console.log('No such document!');
          setProfile(null);
        }
        setProfileLoading(false);
      }, (error) => {
        console.error("Error fetching profile:", error);
        setProfileLoading(false);
      });

      return () => unsubscribe();
    } else if (!userLoading) {
      setProfileLoading(false);
    }
  }, [user, firestore, userLoading]);

  const isLoading = userLoading || profileLoading;

  const formatLastLogin = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'N/A';
    }
  };


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
            {isLoading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" value={profile?.companyName || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
                <div className="space-y-2">
                  <Label>Last login</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatLastLogin(user?.metadata.lastSignInTime)}
                  </p>
                </div>
              </>
            )}
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
