'use client';

import {
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  addDoc,
  collection,
  type Firestore,
  Timestamp,
} from 'firebase/firestore';

export type Policy = 'Strict' | 'Balanced' | 'Lenient';
export type AlertStatus = 'Active' | 'Resolved' | 'Quarantined';

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

export async function generateEnrollmentToken(
  db: Firestore,
  tenantId: string,
  userId: string
): Promise<string> {
  if (!tenantId) throw new Error('Tenant ID is required to generate a token.');

  const tokenValue = crypto.randomUUID();
  const tokenRef = collection(db, 'tenants', tenantId, 'enrollmentTokens');
  
  await addDoc(tokenRef, {
    token: tokenValue,
    used: false,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000)), // Expires in 15 minutes
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  return tokenValue;
}

export async function saveSecurityPolicy(
  db: Firestore,
  tenantId: string,
  policyName: string,
  settings: {
    scanLevel: string;
    autoQuarantine: boolean;
    offlineProtection: boolean;
  },
  userId: string
) {
  if (!tenantId || !policyName || !userId) {
    throw new Error('Missing required parameters to save policy.');
  }

  const policyRef = doc(db, 'tenants', tenantId, 'policies', policyName);

  await updateDoc(policyRef, {
    ...settings,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });

  await writeAuditLog(db, tenantId, userId, 'POLICY_UPDATED', policyName, settings);
}

export async function updateAlertStatus(
  db: Firestore,
  tenantId: string,
  alertId: string,
  status: 'Quarantined' | 'Resolved',
  userId: string
) {
  const alertRef = doc(db, 'tenants', tenantId, 'alerts', alertId);
  const data: { status: AlertStatus, [key: string]: any } = { status };
  let action = '';

  if (status === 'Quarantined') {
    data.quarantinedAt = serverTimestamp();
    action = 'THREAT_QUARANTINED';
  } else if (status === 'Resolved') {
    data.resolvedAt = serverTimestamp();
    action = 'THREAT_RESOLVED';
  }

  await updateDoc(alertRef, data);
  await writeAuditLog(db, tenantId, userId, action, alertId);
}

export async function isolateDeviceFromThreat(
  db: Firestore,
  tenantId: string,
  deviceId: string,
  alertId: string,
  userId: string
) {
  const deviceRef = doc(db, 'tenants', tenantId, 'devices', deviceId);
  await updateDoc(deviceRef, {
    status: 'Isolated',
    isolated: true,
    riskLevel: 'High',
    isolatedAt: serverTimestamp(),
  });
  await writeAuditLog(db, tenantId, userId, 'DEVICE_ISOLATED', deviceId, { fromAlert: alertId });

  await updateAlertStatus(db, tenantId, alertId, 'Quarantined', userId);
}


export async function explainThreatWithAI(
  db: Firestore,
  tenantId: string,
  alertId: string
) {
  // This is a simulation of a Cloud Function call.
  const alertRef = doc(db, 'tenants', tenantId, 'alerts', alertId);
  await updateDoc(alertRef, {
    aiExplanation: "Simulated AI analysis: This threat involves an executable file downloaded from an untrusted source, which exhibits behavior consistent with known credential-stealing trojans. It attempted to modify system files and establish outbound communication to a suspicious IP address.",
    explanationGeneratedAt: serverTimestamp(),
  });
}
