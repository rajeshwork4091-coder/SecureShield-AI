export type Device = {
  id: string;
  deviceName: string;
  ipAddress: string;
  status: 'Online' | 'Offline' | 'Isolated';
  policy: 'Strict' | 'Balanced' | 'Lenient';
  lastSeen: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  os: 'Windows' | 'macOS' | 'Linux' | 'Tablet' | 'VM' | 'Other';
  createdAt?: string;
  isolated?: boolean;
  // Kept for static data compatibility on other pages
  alertsCount?: number; 
  lastScan?: string;
};

export const devices: Device[] = [
  { id: 'DEV001', deviceName: 'finance-laptop-01', ipAddress: '192.168.1.10', status: 'Online', policy: 'Strict', lastSeen: '2026-01-18T12:34:56Z', riskLevel: 'High', os: 'Windows', lastScan: '2026-01-18T10:34:56Z', alertsCount: 3, isolated: false },
  { id: 'DEV002', deviceName: 'hr-desktop-05', ipAddress: '192.168.1.15', status: 'Online', policy: 'Balanced', lastSeen: '2026-01-18T11:20:00Z', riskLevel: 'Medium', os: 'Windows', lastScan: '2026-01-18T06:20:00Z', alertsCount: 1, isolated: false },
  { id: 'DEV003', deviceName: 'marketing-vm-02', ipAddress: '192.168.2.22', status: 'Offline', policy: 'Lenient', lastSeen: '2026-01-16T09:00:00Z', riskLevel: 'Low', os: 'VM', lastScan: '2026-01-15T09:00:00Z', alertsCount: 0, isolated: false },
  { id: 'DEV004', deviceName: 'ceo-macbook-pro', ipAddress: '192.168.1.5', status: 'Online', policy: 'Strict', lastSeen: '2026-01-18T12:30:00Z', riskLevel: 'Medium', os: 'macOS', lastScan: '2026-01-18T11:30:00Z', alertsCount: 0, isolated: false },
  { id: 'DEV005', deviceName: 'dev-server-01', ipAddress: '10.0.0.50', status: 'Online', policy: 'Strict', lastSeen: '2026-01-18T12:00:00Z', riskLevel: 'High', os: 'Linux', lastScan: '2026-01-18T04:00:00Z', alertsCount: 5, isolated: false },
  { id: 'DEV006', deviceName: 'sales-tablet-08', ipAddress: '192.168.3.12', status: 'Offline', policy: 'Lenient', lastSeen: '2026-01-13T14:00:00Z', riskLevel: 'Low', os: 'Tablet', lastScan: '2026-01-12T14:00:00Z', alertsCount: 0, isolated: false },
  { id: 'DEV007', deviceName: 'support-pc-11', ipAddress: '192.168.1.30', status: 'Online', policy: 'Balanced', lastSeen: '2026-01-18T11:45:00Z', riskLevel: 'Low', os: 'Windows', lastScan: '2026-01-18T07:45:00Z', alertsCount: 0, isolated: false },
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
  { id: 'TH001', type: 'Malware Detected', severity: 'High', device: 'finance-laptop-01', timestamp: '2026-01-18T11:34:56Z', status: 'Active', detectionMethod: 'Signature Matching', riskScore: 95, details: { file: 'C:\\Users\\Finance\\Downloads\\invoice.exe', process: 'invoice.exe' }, rawTelemetry: '{"event":"file_create","path":"C:\\\\Users\\\\Finance\\\\Downloads\\\\invoice.exe","hash":"a1b2c3d4...","signature":"Win.Trojan.Generic/A"}' },
  { id: 'TH002', type: 'Phishing Attempt', severity: 'Medium', device: 'hr-desktop-05', timestamp: '2026-01-17T12:34:56Z', status: 'Resolved', detectionMethod: 'Behavioral Analysis', riskScore: 65, details: { file: 'N/A', process: 'chrome.exe' }, rawTelemetry: '{"event":"network_outbound","process":"chrome.exe","destination":"phishingsite.com","port":443}' },
  { id: 'TH003', type: 'Unusual Network Traffic', severity: 'Low', device: 'dev-server-01', timestamp: '2026-01-16T12:34:56Z', status: 'Active', detectionMethod: 'Anomaly Detection', riskScore: 40, details: { file: 'N/A', process: 'sshd' }, rawTelemetry: '{"event":"network_anomaly","bytes_out":50000000,"protocol":"ssh","destination":"123.45.67.89"}' },
  { id: 'TH004', type: 'Ransomware Behavior', severity: 'High', device: 'marketing-vm-02', timestamp: '2026-01-15T12:34:56Z', status: 'Quarantined', detectionMethod: 'Behavioral Analysis', riskScore: 98, details: { file: 'D:\\Marketing\\Assets\\project.docx.locked', process: 'crypt.exe' }, rawTelemetry: '{"event":"mass_file_rename","pattern":"*.locked","count":582,"process":"crypt.exe"}' },
];

export type SecurityPolicy = {
  id: string;
  name: 'Strict' | 'Balanced' | 'Lenient';
  description: string;
  recommendedUse: string;
  aiSensitivity: 'High' | 'Medium' | 'Low';
  securityLevel: 'High' | 'Medium' | 'Low';
  performanceImpact: 'High' | 'Medium' | 'Low';
  deviceCount: number;
  settings: {
    scanLevel: 'quick' | 'full' | 'deep';
    autoQuarantine: boolean;
    offlineProtection: boolean;
  };
};

export const securityPolicies: SecurityPolicy[] = [
  { 
    id: 'POL001', 
    name: 'Strict', 
    description: 'Maximum security for critical assets. May impact performance.', 
    recommendedUse: 'Recommended for finance, servers, and executive devices.',
    aiSensitivity: 'High',
    securityLevel: 'High',
    performanceImpact: 'High',
    deviceCount: devices.filter(d => d.policy === 'Strict').length,
    settings: { scanLevel: 'deep', autoQuarantine: true, offlineProtection: true } 
  },
  { 
    id: 'POL002', 
    name: 'Balanced', 
    description: 'Recommended for most devices. Good balance of security and performance.',
    recommendedUse: 'Recommended for general office devices.',
    aiSensitivity: 'Medium',
    securityLevel: 'Medium',
    performanceImpact: 'Medium',
    deviceCount: devices.filter(d => d.policy === 'Balanced').length,
    settings: { scanLevel: 'full', autoQuarantine: true, offlineProtection: true } 
  },
  { 
    id: 'POL003', 
    name: 'Lenient', 
    description: 'Basic protection for low-risk devices. Minimal performance impact.',
    recommendedUse: 'Recommended for low-risk or temporary devices.',
    aiSensitivity: 'Low',
    securityLevel: 'Low',
    performanceImpact: 'Low',
    deviceCount: devices.filter(d => d.policy === 'Lenient').length,
    settings: { scanLevel: 'quick', autoQuarantine: false, offlineProtection: false } 
  },
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
  threatsOverTime: [
    { date: 'Dec 20', detected: 15, resolved: 7 }, { date: 'Dec 21', detected: 5, resolved: 5 }, { date: 'Dec 22', detected: 7, resolved: 9 }, { date: 'Dec 23', detected: 9, resolved: 3 }, { date: 'Dec 24', detected: 11, resolved: 7 }, { date: 'Dec 25', detected: 13, resolved: 5 }, { date: 'Dec 26', detected: 15, resolved: 9 }, { date: 'Dec 27', detected: 5, resolved: 3 }, { date: 'Dec 28', detected: 7, resolved: 7 }, { date: 'Dec 29', detected: 9, resolved: 5 }, { date: 'Dec 30', detected: 11, resolved: 9 }, { date: 'Dec 31', detected: 13, resolved: 3 }, { date: 'Jan 1', detected: 15, resolved: 7 }, { date: 'Jan 2', detected: 5, resolved: 5 }, { date: 'Jan 3', detected: 7, resolved: 9 }, { date: 'Jan 4', detected: 9, resolved: 3 }, { date: 'Jan 5', detected: 11, resolved: 7 }, { date: 'Jan 6', detected: 13, resolved: 5 }, { date: 'Jan 7', detected: 15, resolved: 9 }, { date: 'Jan 8', detected: 5, resolved: 3 }, { date: 'Jan 9', detected: 7, resolved: 7 }, { date: 'Jan 10', detected: 9, resolved: 5 }, { date: 'Jan 11', detected: 11, resolved: 9 }, { date: 'Jan 12', detected: 13, resolved: 3 }, { date: 'Jan 13', detected: 15, resolved: 7 }, { date: 'Jan 14', detected: 5, resolved: 5 }, { date: 'Jan 15', detected: 7, resolved: 9 }, { date: 'Jan 16', detected: 9, resolved: 3 }, { date: 'Jan 17', detected: 11, resolved: 7 }, { date: 'Jan 18', detected: 13, resolved: 5 }
  ],
  devicesByPolicy: securityPolicies.map(p => ({
    policy: p.name,
    total: devices.filter(d => d.policy === p.name).length,
  }))
};
