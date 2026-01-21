'use client';

import {
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  addDoc,
  collection,
  type Firestore,
} from 'firebase/firestore';

export type Policy = 'Strict' | 'Balanced' | 'Lenient';

export async function writeAuditLog(
  db: Firestore,
  tenantId: string,
  userId: string,
  action: string,
  targetId: string,
  metadata: object = {}
) {
  try {
    const auditLogsRef = collection(db, 'tenants', tenantId, 'auditLogs');
    await addDoc(auditLogsRef, {
      action,
      targetId,
      userId,
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Non-critical, so we don't re-throw or show a toast
  }
}

export async function isolateDevices(
  db: Firestore,
  tenantId: string,
  deviceIds: string[],
  userId: string
) {
  if (!tenantId || deviceIds.length === 0) return;

  const batch = writeBatch(db);
  const auditLogPromises: Promise<void>[] = [];

  deviceIds.forEach((deviceId) => {
    const deviceRef = doc(db, 'tenants', tenantId, 'devices', deviceId);
    batch.update(deviceRef, {
      status: 'Isolated',
      isolated: true,
      riskLevel: 'High',
      isolatedAt: serverTimestamp(),
    });
    auditLogPromises.push(
      writeAuditLog(db, tenantId, userId, 'DEVICE_ISOLATED', deviceId)
    );
  });

  await batch.commit();
  await Promise.all(auditLogPromises);
}

export async function changeDevicePolicy(
  db: Firestore,
  tenantId: string,
  deviceId: string,
  policy: Policy,
  userId: string
) {
  if (!tenantId) return;

  const deviceRef = doc(db, 'tenants', tenantId, 'devices', deviceId);
  await updateDoc(deviceRef, {
    policy,
    policyUpdatedAt: serverTimestamp(),
  });

  await writeAuditLog(db, tenantId, userId, 'POLICY_CHANGED', deviceId, {
    newPolicy: policy,
  });
}
