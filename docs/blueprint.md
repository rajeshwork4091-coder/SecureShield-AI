# **App Name**: SecureShield AI

## Core Features:

- Authentication: Secure user authentication using Firebase Authentication, with email/password and MFA support. Tenant-based login ensures SME isolation.
- Security Overview Dashboard: Real-time dashboard displaying threat counts, active devices, and security health indicators, powered by Firestore real-time listeners.
- Device Management: Manage endpoint devices with auto-enrollment, online/offline status, and remote isolation capabilities. Isolation commands are read and enforced by the endpoint agent.
- Threat and Alert Center: Real-time alerts with explainable AI output, providing threat type, detection method, risk score, and quarantine/resolve actions.
- AI-Driven Threat Detection: Cloud function triggered on telemetry write. Uses rule-based detection methods. Uses anomaly scoring as a tool.
- Security Policies: Define and assign security policies (Strict, Balanced, Lenient) to devices, with instant synchronization of changes. Policies include scan level, auto-quarantine, and offline protection settings.
- Telemetry Upload: Lightweight endpoint agent monitors file changes, processes, and network activity. Sends telemetry data (metadata only, no raw files) to Firebase.

## Style Guidelines:

- Primary color: Saturated teal (#4db6ac) to communicate both technology and trust. Choosing a slightly saturated hue keeps it contemporary.
- Background color: Light teal (#e0f2f1) background to complement the primary color, giving a light feel.
- Accent color: Blue-green (#4dd0e1) to provide contrast with the primary color and draw attention to important elements.
- Headline font: 'Space Grotesk', a modern sans-serif, to give a technological feel.
- Body font: 'Inter', a grotesque-style sans-serif, to ensure readability and a clean aesthetic.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalist, geometric icons to represent different security concepts and actions. Icons should be consistent with the overall design language.
- Subtle transitions and animations to enhance user experience, such as loading indicators, alerts, and feedback on actions.