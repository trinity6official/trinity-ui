import { describe, expect, it } from 'vitest';

import { validateWorldScene } from '@/features/world';

import { companyScene } from './company-scene';

describe('companyScene', () => {
  it('is a valid world scene', () => {
    expect(validateWorldScene(companyScene)).toEqual({
      valid: true,
      issues: [],
    });
  });

  it('models the initial company environment as structured content', () => {
    expect(companyScene.entities.map((entity) => entity.id)).toEqual(
      expect.arrayContaining([
        'employee',
        'laptop',
        'wifi',
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
});
