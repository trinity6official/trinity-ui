import { describe, expect, it } from 'vitest';

import {
  COMPANY_ATTACK_PATH_OBJECTS,
  COMPANY_ATTACK_PATH_SEMANTIC_IDS,
  COMPANY_MODEL_URL,
  COMPANY_SEMANTIC_IDS,
  REQUIRED_COMPANY_OBJECTS,
} from './company-world-contract';

describe('company world asset contract', () => {
  it('loads the repository-owned production model', () => {
    expect(COMPANY_MODEL_URL).toBe('/models/company/trinity-company.glb');
  });

  it('keeps required runtime object names unique', () => {
    expect(new Set(REQUIRED_COMPANY_OBJECTS).size).toBe(REQUIRED_COMPANY_OBJECTS.length);
  });

  it('matches the physical cybersecurity path embedded in revision 19', () => {
    expect(COMPANY_ATTACK_PATH_OBJECTS).toEqual([
      'Laptop_01',
      'WiFi_AP_01',
      'Switch_01',
      'Firewall_01',
      'ApplicationServer_01',
      'Database_01',
    ]);

    expect(COMPANY_ATTACK_PATH_SEMANTIC_IDS).toEqual([
      COMPANY_SEMANTIC_IDS.laptop,
      COMPANY_SEMANTIC_IDS.wifi,
      COMPANY_SEMANTIC_IDS.switch,
      COMPANY_SEMANTIC_IDS.firewall,
      COMPANY_SEMANTIC_IDS.applicationServer,
      COMPANY_SEMANTIC_IDS.database,
    ]);
  });
});
