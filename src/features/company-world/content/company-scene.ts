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

  experiences: [
    {
      id: 'company-attack-path',
      title: 'How a company gets hacked — and how to protect it',
      description:
        'Follow a simplified attack path through a company environment and see where defensive controls reduce risk.',
      steps: [
        {
          id: 'attack-entry',
          title: '1. It often starts with a person',
          description:
            'An attacker may target an employee with a convincing phishing message or another form of social engineering.',
          entityIds: ['employee', 'laptop'],
          relationshipIds: ['employee-uses-laptop'],
        },
        {
          id: 'endpoint-compromise',
          title: '2. The endpoint becomes the foothold',
          description:
            'If the employee device is compromised, the attacker may gain an initial position inside the company environment.',
          entityIds: ['laptop', 'wifi'],
          relationshipIds: ['laptop-uses-wifi'],
        },
        {
          id: 'network-movement',
          title: '3. The attacker looks for a path inward',
          description:
            'From the compromised endpoint, the attacker may attempt to reach additional systems through available network paths.',
          entityIds: ['wifi', 'firewall'],
          relationshipIds: ['wifi-routes-firewall'],
        },
        {
          id: 'defensive-boundary',
          title: '4. Security controls can break the path',
          description:
            'Network controls such as firewalls can restrict which systems and services are reachable, reducing opportunities for movement.',
          entityIds: ['firewall', 'server'],
          relationshipIds: ['firewall-protects-server'],
        },
        {
          id: 'application-target',
          title: '5. Applications are valuable targets',
          description:
            'A reachable or vulnerable application server can expose access to business functions and connected services.',
          entityIds: ['server', 'database', 'cloud'],
          relationshipIds: ['server-reads-database', 'server-connects-cloud'],
        },
        {
          id: 'data-impact',
          title: '6. The real objective may be the data',
          description:
            'Access to application data can create confidentiality, integrity, and availability impact. Layered controls help prevent one compromise from becoming a larger incident.',
          entityIds: ['server', 'database'],
          relationshipIds: ['server-reads-database'],
        },
      ],
    },
  ],
} satisfies WorldScene;

assertValidWorldScene(companyScene);
