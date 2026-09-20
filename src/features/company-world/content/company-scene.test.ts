import { describe, expect, it } from 'vitest';

import { validateWorldScene } from '@/features/world';
import { companyScene } from './company-scene';

describe('companyScene', () => {
  it('is a valid world scene', () => {
    expect(validateWorldScene(companyScene)).toEqual({ valid: true, issues: [] });
  });

  it('models the physical flagship attack path represented by the 3D headquarters', () => {
    expect(companyScene.entities.map((entity) => entity.id)).toEqual(
      expect.arrayContaining([
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
      ]),
    );

    expect(companyScene.relationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceEntityId: 'wifi',
          targetEntityId: 'switch',
          type: 'routes-through',
        }),
        expect.objectContaining({
          sourceEntityId: 'switch',
          targetEntityId: 'firewall',
          type: 'routes-through',
        }),
        expect.objectContaining({
          sourceEntityId: 'firewall',
          targetEntityId: 'server',
          type: 'protects',
        }),
        expect.objectContaining({
          sourceEntityId: 'server',
          targetEntityId: 'database',
          type: 'reads-from',
        }),
      ]),
    );
  });

  it('binds modeled infrastructure entities to stable GLB semantic ids', () => {
    const semanticIds = Object.fromEntries(
      companyScene.entities.map((entity) => [
        entity.id,
        'metadata' in entity ? entity.metadata?.assetSemanticId : undefined,
      ]),
    );

    expect(semanticIds).toMatchObject({
      laptop: 'company.floor_02.office.laptop_01',
      wifi: 'company.floor_03.network_room.wifi_ap_01',
      switch: 'company.floor_03.network_room.switch_01',
      firewall: 'company.floor_03.network_room.firewall_01',
      server: 'company.floor_03.server_room.application_server_01',
      database: 'company.floor_03.server_room.database_01',
    });
  });
});
