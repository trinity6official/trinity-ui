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
      metadata: { assetSemanticId: 'company.floor_02.office.laptop_01' },
    },
    {
      id: 'wifi',
      type: 'network',
      label: 'Wi-Fi Access Point',
      description: 'Provides wireless connectivity for devices inside the office.',
      metadata: { assetSemanticId: 'company.floor_03.network_room.wifi_ap_01' },
    },
    {
      id: 'switch',
      type: 'network',
      label: 'Network Switch',
      description: 'Carries internal network traffic between connected company systems.',
      metadata: { assetSemanticId: 'company.floor_03.network_room.switch_01' },
    },
    {
      id: 'firewall',
      type: 'security',
      label: 'Firewall',
      description: 'Controls network traffic between company systems and protected services.',
      metadata: { assetSemanticId: 'company.floor_03.network_room.firewall_01' },
    },
    {
      id: 'server',
      type: 'compute',
      label: 'Application Server',
      description: 'Runs business applications and communicates with protected internal services.',
      metadata: { assetSemanticId: 'company.floor_03.server_room.application_server_01' },
    },
    {
      id: 'database',
      type: 'data',
      label: 'Database',
      description: 'Stores information used by company applications.',
      metadata: { assetSemanticId: 'company.floor_03.server_room.database_01' },
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
      metadata: { assetSemanticId: 'company.physical_security.cctv_01' },
    },
    {
      id: 'access',
      type: 'physical-security',
      label: 'Physical Access',
      description: 'Controls entry into protected company areas.',
      metadata: { assetSemanticId: 'company.entrance.card_reader' },
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
      id: 'wifi-routes-switch',
      type: 'routes-through',
      sourceEntityId: 'wifi',
      targetEntityId: 'switch',
      label: 'routes through',
    },
    {
      id: 'switch-routes-firewall',
      type: 'routes-through',
      sourceEntityId: 'switch',
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
    { id: 'hotspot-switch', entityId: 'switch', label: 'Inspect network switch' },
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
        'switch',
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
      entityIds: ['employee', 'laptop', 'wifi', 'switch', 'firewall', 'server', 'database'],
    },
  ],
  experiences: [
    {
      id: 'company-attack-path',
      title: 'How a company gets hacked — and how to protect it',
      description:
        'Follow a simplified attack path through the Trinity6 headquarters and see where defensive controls reduce risk.',
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
          title: '3. Traffic moves through the internal network',
          description:
            'The path from the endpoint crosses the wireless access point and network switch before it reaches the protected boundary.',
          entityIds: ['wifi', 'switch', 'firewall'],
          relationshipIds: ['wifi-routes-switch', 'switch-routes-firewall'],
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
            'A reachable or vulnerable application server can expose access to business functions, connected services, and application data.',
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
