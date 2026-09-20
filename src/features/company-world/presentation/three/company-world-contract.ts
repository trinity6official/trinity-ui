export const COMPANY_MODEL_URL = '/models/company/trinity-company.glb';

export type CompanySceneTarget =
  | 'access-card'
  | 'entrance'
  | 'network'
  | 'workspace'
  | 'server-room'
  | 'security';

export const COMPANY_TARGET_OBJECTS: Readonly<Record<CompanySceneTarget, readonly string[]>> = {
  'access-card': ['AccessCard_01'],
  entrance: ['Entrance', 'EntranceDoor_Left', 'EntranceDoor_Right', 'CardReader'],
  network: ['NetworkRoom'],
  workspace: ['OfficeWorkspace'],
  'server-room': ['ServerRoom'],
  security: ['SecurityRoom'],
};

export const COMPANY_CAMERA_OBJECTS = {
  overview: 'Camera_Overview',
  entrance: 'Camera_Entrance',
  lobby: 'Camera_Lobby',
} as const;

export const REQUIRED_COMPANY_OBJECTS = [
  'TrinityCompany',
  'Entrance',
  'EntranceDoor_Left',
  'EntranceDoor_Right',
  'CardReader',
  'CardReader_Status',
  'AccessCard_01',
  'Lobby',
  'Reception',
  'OfficeWorkspace',
  'Laptop_01',
  'WiFi_AP_01',
  'NetworkRoom',
  'Switch_01',
  'Firewall_01',
  'CoreRouter_01',
  'ServerRoom',
  'Rack_01',
  'Rack_02',
  'Rack_03',
  'ApplicationServer_01',
  'Database_01',
  'SecurityRoom',
  'CCTV_01',
  'Rooftop',
  'Camera_Overview',
  'Camera_Entrance',
  'Camera_Lobby',
] as const;

export const COMPANY_SEMANTIC_IDS = {
  company: 'company.trinity6',
  entrance: 'company.entrance',
  leftEntranceDoor: 'company.entrance.door_left',
  rightEntranceDoor: 'company.entrance.door_right',
  cardReader: 'company.entrance.card_reader',
  accessCard: 'company.entrance.access_card_01',
  lobby: 'company.floor_01.lobby',
  reception: 'company.floor_01.lobby.reception',
  workspace: 'company.floor_02.office',
  laptop: 'company.floor_02.office.laptop_01',
  wifi: 'company.floor_03.network_room.wifi_ap_01',
  networkRoom: 'company.floor_03.network_room',
  switch: 'company.floor_03.network_room.switch_01',
  firewall: 'company.floor_03.network_room.firewall_01',
  router: 'company.floor_03.network_room.router_01',
  serverRoom: 'company.floor_03.server_room',
  rack01: 'company.floor_03.server_room.rack_01',
  rack02: 'company.floor_03.server_room.rack_02',
  rack03: 'company.floor_03.server_room.rack_03',
  applicationServer: 'company.floor_03.server_room.application_server_01',
  database: 'company.floor_03.server_room.database_01',
  securityRoom: 'company.floor_04.security_room',
  cctv01: 'company.physical_security.cctv_01',
  rooftop: 'company.rooftop',
} as const;

export const COMPANY_ATTACK_PATH_OBJECTS = [
  'Laptop_01',
  'WiFi_AP_01',
  'Switch_01',
  'Firewall_01',
  'ApplicationServer_01',
  'Database_01',
] as const;

export const COMPANY_ATTACK_PATH_SEMANTIC_IDS = [
  COMPANY_SEMANTIC_IDS.laptop,
  COMPANY_SEMANTIC_IDS.wifi,
  COMPANY_SEMANTIC_IDS.switch,
  COMPANY_SEMANTIC_IDS.firewall,
  COMPANY_SEMANTIC_IDS.applicationServer,
  COMPANY_SEMANTIC_IDS.database,
] as const;
