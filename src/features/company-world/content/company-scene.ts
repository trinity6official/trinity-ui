import { assertValidWorldScene, type WorldScene } from '@/features/world';

export const companyScene = {
  id: 'company-building',
  label: 'Trinity6 Company',

  entities: [
    {
      id: 'employee',
      type: 'person',
      label: 'Employee',
      description: 'A person working inside the company environment.',
    },
    {
      id: 'laptop',
      type: 'device',
      label: 'Employee Laptop',
      description: 'The employee workstation used to access company applications and services.',
    },
    {
      id: 'wifi',
      type: 'network',
      label: 'Wi-Fi',
      description: 'Provides wireless connectivity for devices inside the office.',
    },
    {
      id: 'firewall',
      type: 'security',
      label: 'Firewall',
      description: 'Controls network traffic between company systems and external networks.',
    },
    {
      id: 'server',
      type: 'compute',
      label: 'Application Server',
      description: 'Runs business applications and communicates with protected internal services.',
    },
    {
      id: 'database',
      type: 'data',
      label: 'Database',
      description: 'Stores information used by company applications.',
    },
    {
      id: 'cloud',
      type: 'cloud',
      label: 'Cloud Service',
      description: 'Represents external cloud services connected to company systems.',
    },
    {
      id: 'cctv',
      type: 'physical-security',
      label: 'CCTV',
      description: 'Monitors physical areas around the company environment.',
    },
    {
      id: 'access',
      type: 'physical-security',
      label: 'Physical Access',
      description: 'Controls entry into protected company areas.',
    },
  ],

  relationships: [
    {
      id: 'employee-uses-laptop',
      type: 'uses',
      sourceEntityId: 'employee',
      targetEntityId: 'laptop',
      label: 'uses',
    },
    {
      id: 'laptop-uses-wifi',
      type: 'uses',
      sourceEntityId: 'laptop',
      targetEntityId: 'wifi',
      label: 'uses',
    },
    {
      id: 'wifi-routes-firewall',
      type: 'routes-through',
      sourceEntityId: 'wifi',
      targetEntityId: 'firewall',
      label: 'routes through',
    },
    {
      id: 'firewall-protects-server',
      type: 'protects',
      sourceEntityId: 'firewall',
      targetEntityId: 'server',
      label: 'protects',
    },
    {
      id: 'server-reads-database',
      type: 'reads-from',
      sourceEntityId: 'server',
      targetEntityId: 'database',
      label: 'reads from',
    },
    {
      id: 'server-connects-cloud',
      type: 'connects-to',
      sourceEntityId: 'server',
      targetEntityId: 'cloud',
      label: 'connects to',
    },
    {
      id: 'cctv-monitors-access',
      type: 'monitors',
      sourceEntityId: 'cctv',
      targetEntityId: 'access',
      label: 'monitors',
    },
  ],

  hotspots: [
    { id: 'hotspot-laptop', entityId: 'laptop', label: 'Inspect employee laptop' },
    { id: 'hotspot-firewall', entityId: 'firewall', label: 'Inspect firewall' },
    { id: 'hotspot-server', entityId: 'server', label: 'Inspect application server' },
    { id: 'hotspot-database', entityId: 'database', label: 'Inspect database' },
  ],

  views: [
    {
      id: 'company-overview',
      label: 'Company overview',
      entityIds: [
        'employee',
        'laptop',
        'wifi',
        'firewall',
        'server',
        'database',
        'cloud',
        'cctv',
        'access',
      ],
    },
    {
      id: 'digital-path',
      label: 'Digital path',
      entityIds: ['employee', 'laptop', 'wifi', 'firewall', 'server', 'database', 'cloud'],
    },
  ],

  experiences: [],
} satisfies WorldScene;

assertValidWorldScene(companyScene);
