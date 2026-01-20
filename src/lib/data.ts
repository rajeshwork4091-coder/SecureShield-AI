export type Device = {
  id: string;
  name: string;
  ipAddress: string;
  status: 'Online' | 'Offline';
  policy: 'Strict' | 'Balanced' | 'Lenient';
  lastSeen: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  os: 'Windows' | 'macOS' | 'Linux' | 'Tablet' | 'VM';
  lastScan: string;
  alertsCount: number;
};

export const devices: Device[] = [
  { id: 'DEV001', name: 'finance-laptop-01', ipAddress: '192.168.1.10', status: 'Online', policy: 'Strict', lastSeen: new Date().toISOString(), riskLevel: 'High', os: 'Windows', lastScan: new Date(Date.now() - 3600000 * 2).toISOString(), alertsCount: 3 },
  { id: 'DEV002', name: 'hr-desktop-05', ipAddress: '192.168.1.15', status: 'Online', policy: 'Balanced', lastSeen: new Date().toISOString(), riskLevel: 'Medium', os: 'Windows', lastScan: new Date(Date.now() - 3600000 * 5).toISOString(), alertsCount: 1 },
  { id: 'DEV003', name: 'marketing-vm-02', ipAddress: '192.168.2.22', status: 'Offline', policy: 'Lenient', lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), riskLevel: 'Low', os: 'VM', lastScan: new Date(Date.now() - 86400000 * 3).toISOString(), alertsCount: 0 },
  { id: 'DEV004', name: 'ceo-macbook-pro', ipAddress: '192.168.1.5', status: 'Online', policy: 'Strict', lastSeen: new Date().toISOString(), riskLevel: 'Medium', os: 'macOS', lastScan: new Date(Date.now() - 3600000 * 1).toISOString(), alertsCount: 0 },
  { id: 'DEV005', name: 'dev-server-01', ipAddress: '10.0.0.50', status: 'Online', policy: 'Strict', lastSeen: new Date().toISOString(), riskLevel: 'High', os: 'Linux', lastScan: new Date(Date.now() - 3600000 * 8).toISOString(), alertsCount: 5 },
  { id: 'DEV006', name: 'sales-tablet-08', ipAddress: '192.168.3.12', status: 'Offline', policy: 'Lenient', lastSeen: new Date(Date.now() - 86400000 * 5).toISOString(), riskLevel: 'Low', os: 'Tablet', lastScan: new Date(Date.now() - 86400000 * 6).toISOString(), alertsCount: 0 },
  { id: 'DEV007', name: 'support-pc-11', ipAddress: '192.168.1.30', status: 'Online', policy: 'Balanced', lastSeen: new Date().toISOString(), riskLevel: 'Low', os: 'Windows', lastScan: new Date(Date.now() - 3600000 * 4).toISOString(), alertsCount: 0 },
];

export type Threat = {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  device: string;
  timestamp: string;
  status: 'Active' | 'Resolved' | 'Quarantined';
  detectionMethod: string;
  riskScore: number;
  details: {
    file: string;
    process: string;
  };
  rawTelemetry: string;
};

export const threats: Threat[] = [
  { id: 'TH001', type: 'Malware Detected', severity: 'High', device: 'finance-laptop-01', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Active', detectionMethod: 'Signature Matching', riskScore: 95, details: { file: 'C:\\Users\\Finance\\Downloads\\invoice.exe', process: 'invoice.exe' }, rawTelemetry: '{"event":"file_create","path":"C:\\\\Users\\\\Finance\\\\Downloads\\\\invoice.exe","hash":"a1b2c3d4...","signature":"Win.Trojan.Generic/A"}' },
  { id: 'TH002', type: 'Phishing Attempt', severity: 'Medium', device: 'hr-desktop-05', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'Resolved', detectionMethod: 'Behavioral Analysis', riskScore: 65, details: { file: 'N/A', process: 'chrome.exe' }, rawTelemetry: '{"event":"network_outbound","process":"chrome.exe","destination":"phishingsite.com","port":443}' },
  { id: 'TH003', type: 'Unusual Network Traffic', severity: 'Low', device: 'dev-server-01', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'Active', detectionMethod: 'Anomaly Detection', riskScore: 40, details: { file: 'N/A', process: 'sshd' }, rawTelemetry: '{"event":"network_anomaly","bytes_out":50000000,"protocol":"ssh","destination":"123.45.67.89"}' },
  { id: 'TH004', type: 'Ransomware Behavior', severity: 'High', device: 'marketing-vm-02', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'Quarantined', detectionMethod: 'Behavioral Analysis', riskScore: 98, details: { file: 'D:\\Marketing\\Assets\\project.docx.locked', process: 'crypt.exe' }, rawTelemetry: '{"event":"mass_file_rename","pattern":"*.locked","count":582,"process":"crypt.exe"}' },
];

export type SecurityPolicy = {
  id: string;
  name: 'Strict' | 'Balanced' | 'Lenient';
  description: string;
  settings: {
    scanLevel: 'quick' | 'full' | 'deep';
    autoQuarantine: boolean;
    offlineProtection: boolean;
  };
};

export const securityPolicies: SecurityPolicy[] = [
  { id: 'POL001', name: 'Strict', description: 'Maximum security for critical assets. May impact performance.', settings: { scanLevel: 'deep', autoQuarantine: true, offlineProtection: true } },
  { id: 'POL002', name: 'Balanced', description: 'Recommended for most devices. Good balance of security and performance.', settings: { scanLevel: 'full', autoQuarantine: true, offlineProtection: true } },
  { id: 'POL003', name: 'Lenient', description: 'Basic protection for low-risk devices. Minimal performance impact.', settings: { scanLevel: 'quick', autoQuarantine: false, offlineProtection: false } },
];


const onlineDevices = devices.filter(d => d.status === 'Online').length;
const offlineDevices = devices.length - onlineDevices;

export const dashboardData = {
  stats: {
    activeThreats: threats.filter(t => t.status === 'Active').length,
    activeThreatsChange: '5.2%',
    activeThreatsChangeType: 'increase' as 'increase' | 'decrease',
    resolvedIncidents: 125,
    resolvedIncidentsChange: '10.1%',
    resolvedIncidentsChangeType: 'increase' as 'increase' | 'decrease',
    devicesOnline: onlineDevices,
    devicesOnlineChange: '2.0%',
    devicesOnlineChangeType: 'increase' as 'increase' | 'decrease',
    devicesOffline: offlineDevices,
    devicesOfflineChange: '1.5%',
    devicesOfflineChangeType: 'decrease' as 'increase' | 'decrease',
  },
  threatsOverTime: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      detected: Math.floor(Math.random() * 10) + 5,
      resolved: Math.floor(Math.random() * 8) + 3,
    };
  }),
  devicesByPolicy: securityPolicies.map(p => ({
    policy: p.name,
    total: devices.filter(d => d.policy === p.name).length,
  }))
};
