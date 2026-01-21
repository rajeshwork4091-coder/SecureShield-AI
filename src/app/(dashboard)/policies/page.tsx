'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, query, doc, getDoc } from 'firebase/firestore';
import type { SecurityPolicy, Device } from '@/lib/data';
import { PolicyCard } from '@/components/dashboard/policies/policy-card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function PoliciesPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !firestore) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTenantId = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setTenantId(userDocSnap.data().tenantId);
      } else {
        setLoading(false);
      }
    };

    fetchTenantId();
  }, [user, firestore, userLoading]);

  useEffect(() => {
    if (!tenantId || !firestore) return;

    const policiesQuery = query(collection(firestore, 'tenants', tenantId, 'policies'));
    const policiesUnsubscribe = onSnapshot(policiesQuery, (snapshot) => {
      const policiesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SecurityPolicy[];
      setPolicies(policiesData.sort((a, b) => {
        const order = { 'Strict': 1, 'Balanced': 2, 'Lenient': 3 };
        return order[a.name] - order[b.name];
      }));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching policies:", error);
      setLoading(false);
    });

    const devicesQuery = query(collection(firestore, 'tenants', tenantId, 'devices'));
    const devicesUnsubscribe = onSnapshot(devicesQuery, (snapshot) => {
      const devicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Device[];
      setDevices(devicesData);
    });

    return () => {
      policiesUnsubscribe();
      devicesUnsubscribe();
    };
  }, [tenantId, firestore]);

  const policiesWithDeviceCount = policies.map(policy => ({
    ...policy,
    deviceCount: devices.filter(device => device.policy === policy.name).length
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Security Policies</h1>
        <p className="text-muted-foreground">Define and assign security policies to your devices.</p>
      </div>
      <Separator />

      {loading ? (
         <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
         </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {policiesWithDeviceCount.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} tenantId={tenantId} userId={user?.uid} />
          ))}
        </div>
      )}
       <div className="pt-6 text-center text-sm text-muted-foreground">
        <p>Policy changes are logged for audit and compliance.</p>
      </div>
    </div>
  );
}
