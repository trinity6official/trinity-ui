import * as THREE from 'three';

export type CompanySceneTarget =
  | 'access-card'
  | 'entrance'
  | 'network'
  | 'people'
  | 'server-room'
  | 'security';

export interface CompanySceneState {
  readonly cardSelected: boolean;
  readonly entering: boolean;
  readonly focusedTarget: CompanySceneTarget | null;
}

export interface CompanyWorldScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly selectableObjects: readonly THREE.Object3D[];
  readonly overviewPosition: THREE.Vector3;
  readonly overviewTarget: THREE.Vector3;
  readonly entrancePosition: THREE.Vector3;
  readonly entranceTarget: THREE.Vector3;
  readonly lobbyPosition: THREE.Vector3;
  readonly lobbyTarget: THREE.Vector3;
  update(elapsed: number, progress: number, state: CompanySceneState): void;
  dispose(): void;
}

interface ZoneVisual {
  readonly marker: THREE.Mesh;
  readonly materials: readonly THREE.MeshStandardMaterial[];
}

function material(
  color: number,
  options: {
    emissive?: number;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    transparent?: boolean;
    opacity?: number;
  } = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    metalness: options.metalness ?? 0.2,
    roughness: options.roughness ?? 0.55,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
  });
}

function box(width: number, height: number, depth: number, meshMaterial: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), meshMaterial);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function makeTree(scale = 1) {
  const tree = new THREE.Group();

  const planter = box(
    1.1 * scale,
    0.45 * scale,
    1.1 * scale,
    material(0x2b3037, {
      metalness: 0.08,
      roughness: 0.82,
    }),
  );
  planter.position.y = 0.23 * scale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09 * scale, 0.13 * scale, 1.45 * scale, 12),
    material(0x574637, {
      roughness: 0.95,
    }),
  );
  trunk.position.y = 1.0 * scale;
  trunk.castShadow = true;

  const crown = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72 * scale, 2),
    material(0x153827, {
      emissive: 0x0b2418,
      emissiveIntensity: 0.12,
      roughness: 0.86,
    }),
  );
  crown.position.y = 1.95 * scale;
  crown.scale.set(1, 1.28, 1);
  crown.castShadow = true;

  tree.add(planter, trunk, crown);
  return tree;
}

function makeDesk(x: number, z: number, rotationY = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;

  const deskTop = box(
    1.4,
    0.08,
    0.65,
    material(0xb7bec7, {
      metalness: 0.08,
      roughness: 0.48,
    }),
  );
  deskTop.position.y = 0.75;

  const legMaterial = material(0x25303d, {
    metalness: 0.55,
    roughness: 0.36,
  });

  for (const legX of [-0.58, 0.58]) {
    for (const legZ of [-0.23, 0.23]) {
      const leg = box(0.07, 0.72, 0.07, legMaterial);
      leg.position.set(legX, 0.36, legZ);
      group.add(leg);
    }
  }

  const monitor = box(
    0.5,
    0.34,
    0.04,
    material(0x0d1724, {
      emissive: 0x2f8bd8,
      emissiveIntensity: 0.35,
      metalness: 0.12,
      roughness: 0.24,
    }),
  );
  monitor.position.set(0, 1.08, -0.12);

  const stem = box(0.05, 0.22, 0.05, legMaterial);
  stem.position.set(0, 0.91, -0.12);

  group.add(deskTop, monitor, stem);
  return group;
}

function makeServerRack(x: number, z: number) {
  const rack = new THREE.Group();
  rack.position.set(x, 0, z);

  const frame = material(0x17212e, {
    metalness: 0.72,
    roughness: 0.32,
  });

  const left = box(0.08, 1.8, 0.7, frame);
  left.position.set(-0.48, 0.9, 0);

  const right = left.clone();
  right.position.x = 0.48;

  const top = box(1.05, 0.08, 0.7, frame);
  top.position.set(0, 1.76, 0);

  const bottom = top.clone();
  bottom.position.y = 0.04;

  rack.add(left, right, top, bottom);

  for (let index = 0; index < 7; index += 1) {
    const server = box(
      0.84,
      0.16,
      0.56,
      material(0x1e2d3f, {
        emissive: index % 2 === 0 ? 0x0b3150 : 0x10243a,
        emissiveIntensity: 0.26,
        metalness: 0.62,
        roughness: 0.3,
      }),
    );

    server.position.set(0, 0.28 + index * 0.21, 0.03);
    rack.add(server);

    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      material(index % 3 === 0 ? 0x5cff9a : 0x4ebdff, {
        emissive: index % 3 === 0 ? 0x5cff9a : 0x4ebdff,
        emissiveIntensity: 1.8,
        roughness: 0.1,
      }),
    );
    led.position.set(0.32, 0.28 + index * 0.21, 0.33);
    rack.add(led);
  }

  return rack;
}

function addRoomHitbox(
  selectableObjects: THREE.Object3D[],
  target: CompanySceneTarget,
  position: THREE.Vector3,
  size: THREE.Vector3,
) {
  const hitbox = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );

  hitbox.position.copy(position);
  hitbox.userData.target = target;
  selectableObjects.push(hitbox);

  return hitbox;
}

function makeZoneMarker(color: number, position: THREE.Vector3, target: CompanySceneTarget) {
  const markerMaterial = material(color, {
    emissive: color,
    emissiveIntensity: 1.6,
    metalness: 0.05,
    roughness: 0.12,
    transparent: true,
    opacity: 0.96,
  });

  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), markerMaterial);

  marker.position.copy(position);
  marker.userData.target = target;

  return marker;
}

export function createCompanyWorldScene(width: number, height: number): CompanyWorldScene {
  const scene = new THREE.Scene();
  const aspect = width / Math.max(height, 1);
  const portrait = aspect < 0.82;

  scene.background = new THREE.Color(0x040914);
  scene.fog = new THREE.Fog(0x040914, portrait ? 30 : 26, portrait ? 62 : 54);

  const camera = new THREE.PerspectiveCamera(portrait ? 45 : 40, aspect, 0.1, 120);

  const overviewPosition = portrait
    ? new THREE.Vector3(16, 15.5, 24.5)
    : new THREE.Vector3(17, 13.5, 22);

  const overviewTarget = new THREE.Vector3(0, 4.2, -0.2);

  const entrancePosition = portrait
    ? new THREE.Vector3(7.5, 5.3, 12.5)
    : new THREE.Vector3(7.4, 4.8, 11);

  const entranceTarget = new THREE.Vector3(0, 1.6, 4.1);

  const lobbyPosition = new THREE.Vector3(0.1, 1.65, 2.2);
  const lobbyTarget = new THREE.Vector3(0, 1.65, -4);

  camera.position.copy(overviewPosition);
  camera.lookAt(overviewTarget);

  const ambient = new THREE.HemisphereLight(0xaacbff, 0x05070b, 1.35);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xd4e6ff, 3.1);
  key.position.set(12, 18, 14);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -20;
  key.shadow.camera.right = 20;
  key.shadow.camera.top = 20;
  key.shadow.camera.bottom = -20;
  scene.add(key);

  const warmFill = new THREE.DirectionalLight(0xffc98f, 1.0);
  warmFill.position.set(-10, 10, 6);
  scene.add(warmFill);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 42),
    material(0x07101a, {
      metalness: 0.06,
      roughness: 0.92,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.04;
  ground.receiveShadow = true;
  scene.add(ground);

  const island = box(
    20,
    0.35,
    16,
    material(0x121d2a, {
      metalness: 0.12,
      roughness: 0.72,
    }),
  );
  island.position.y = 0.18;
  island.receiveShadow = true;
  scene.add(island);

  const edgeGlowMaterial = material(0x4ec8ff, {
    emissive: 0x1e9fe8,
    emissiveIntensity: 1.8,
    metalness: 0.05,
    roughness: 0.16,
  });

  const edgeFront = box(20.2, 0.06, 0.06, edgeGlowMaterial);
  edgeFront.position.set(0, 0.4, 8.02);

  const edgeLeft = box(0.06, 0.06, 16.0, edgeGlowMaterial);
  edgeLeft.position.set(-10.02, 0.4, 0);

  const edgeRight = edgeLeft.clone();
  edgeRight.position.x = 10.02;

  scene.add(edgeFront, edgeLeft, edgeRight);

  const building = new THREE.Group();
  building.position.set(0, 0.4, -0.8);
  scene.add(building);

  const slabMaterial = material(0x27313d, {
    metalness: 0.14,
    roughness: 0.66,
  });

  const wallMaterial = material(0x18222e, {
    metalness: 0.16,
    roughness: 0.72,
  });

  const frameMaterial = material(0x0f1925, {
    metalness: 0.62,
    roughness: 0.34,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x74a9cf,
    transparent: true,
    opacity: 0.24,
    transmission: 0.36,
    roughness: 0.12,
    metalness: 0.04,
  });

  const floorWidth = 12.8;
  const floorDepth = 8.8;
  const floorHeight = 2.55;
  const floorCount = 4;

  for (let floor = 0; floor < floorCount; floor += 1) {
    const y = floor * floorHeight;

    const slab = box(floorWidth, 0.22, floorDepth, slabMaterial);
    slab.position.set(0, y, 0);
    building.add(slab);

    const backWall = box(floorWidth, 2.32, 0.18, wallMaterial);
    backWall.position.set(0, y + 1.27, -floorDepth / 2);
    building.add(backWall);

    const leftWall = box(0.18, 2.32, floorDepth, wallMaterial);
    leftWall.position.set(-floorWidth / 2, y + 1.27, 0);
    building.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.x = floorWidth / 2;
    building.add(rightWall);

    const leftGlass = box(2.0, 2.06, 0.07, glassMaterial);
    leftGlass.position.set(-5.05, y + 1.25, floorDepth / 2);
    building.add(leftGlass);

    const rightGlass = leftGlass.clone();
    rightGlass.position.x = 5.05;
    building.add(rightGlass);

    for (const x of [-4.0, 0, 4.0]) {
      const column = box(0.14, 2.35, 0.14, frameMaterial);
      column.position.set(x, y + 1.25, floorDepth / 2);
      building.add(column);
    }
  }

  const roof = box(
    13.2,
    0.24,
    9.2,
    material(0x1b2733, {
      metalness: 0.18,
      roughness: 0.62,
    }),
  );
  roof.position.set(0, floorCount * floorHeight, 0);
  building.add(roof);

  const entryFrame = box(3.4, 2.2, 0.18, frameMaterial);
  entryFrame.position.set(0, 1.2, floorDepth / 2 + 0.06);
  building.add(entryFrame);

  const leftDoor = box(0.78, 1.92, 0.06, glassMaterial);
  leftDoor.position.set(-0.42, 1.15, floorDepth / 2 + 0.18);

  const rightDoor = leftDoor.clone();
  rightDoor.position.x = 0.42;

  leftDoor.userData.target = 'entrance' satisfies CompanySceneTarget;
  rightDoor.userData.target = 'entrance' satisfies CompanySceneTarget;

  building.add(leftDoor, rightDoor);

  const reception = box(
    2.6,
    0.86,
    0.82,
    material(0x1d3044, {
      emissive: 0x0e3459,
      emissiveIntensity: 0.2,
      metalness: 0.28,
      roughness: 0.42,
    }),
  );
  reception.position.set(2.0, 0.87, 1.3);
  building.add(reception);

  const receptionTop = box(
    2.82,
    0.08,
    0.94,
    material(0x78808a, {
      metalness: 0.16,
      roughness: 0.42,
    }),
  );
  receptionTop.position.set(2.0, 1.34, 1.3);
  building.add(receptionTop);

  const lobbyAccent = box(
    3.2,
    1.6,
    0.08,
    material(0x14365f, {
      emissive: 0x0f67bf,
      emissiveIntensity: 0.28,
      metalness: 0.2,
      roughness: 0.38,
    }),
  );
  lobbyAccent.position.set(-1.8, 1.35, -4.28);
  building.add(lobbyAccent);

  const lobbyLight = new THREE.PointLight(0x69c9ff, 14, 12, 2);
  lobbyLight.position.set(0, 2.0, 0.2);
  building.add(lobbyLight);

  const serverMaterials: THREE.MeshStandardMaterial[] = [];
  const serverRoom = new THREE.Group();
  serverRoom.position.set(-3.8, floorHeight + 0.12, -0.3);

  for (const x of [-1.3, 0, 1.3]) {
    const rack = makeServerRack(x, 0);
    serverRoom.add(rack);
  }

  const serverFloor = box(
    4.6,
    0.08,
    3.1,
    material(0x0b1723, {
      emissive: 0x0b2741,
      emissiveIntensity: 0.12,
      metalness: 0.26,
      roughness: 0.52,
    }),
  );
  serverFloor.position.set(0, 0.05, 0);
  serverRoom.add(serverFloor);
  building.add(serverRoom);

  serverRoom.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
      serverMaterials.push(object.material);
    }
  });

  const securityMaterials: THREE.MeshStandardMaterial[] = [];
  const securityGroup = new THREE.Group();
  securityGroup.position.set(3.7, floorHeight + 0.12, -0.2);

  const securityDesk = makeDesk(0, 0.35, Math.PI);
  securityGroup.add(securityDesk);

  for (const x of [-1.0, 0, 1.0]) {
    const screen = box(
      0.78,
      0.48,
      0.05,
      material(0x0c1621, {
        emissive: x === 0 ? 0x287fbd : 0x18456d,
        emissiveIntensity: 0.52,
        metalness: 0.1,
        roughness: 0.22,
      }),
    );
    screen.position.set(x, 1.55, -1.0);
    screen.rotation.x = -0.08;
    securityGroup.add(screen);
  }

  building.add(securityGroup);

  securityGroup.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
      securityMaterials.push(object.material);
    }
  });

  const peopleMaterials: THREE.MeshStandardMaterial[] = [];
  const officeGroup = new THREE.Group();
  officeGroup.position.y = floorHeight * 2 + 0.1;

  for (const [x, z] of [
    [-3.7, -1.7],
    [-1.6, -1.7],
    [1.6, -1.7],
    [3.7, -1.7],
    [-2.7, 1.2],
    [0, 1.2],
    [2.7, 1.2],
  ] as const) {
    const desk = makeDesk(x, z);
    officeGroup.add(desk);
  }

  building.add(officeGroup);

  officeGroup.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
      peopleMaterials.push(object.material);
    }
  });

  const networkMaterials: THREE.MeshStandardMaterial[] = [];
  const networkGroup = new THREE.Group();
  networkGroup.position.set(-3.7, floorHeight * 3 + 0.12, -0.4);

  const networkRack = makeServerRack(-0.8, 0);
  networkGroup.add(networkRack);

  for (let index = 0; index < 4; index += 1) {
    const switchUnit = box(
      1.8,
      0.16,
      0.52,
      material(0x17283b, {
        emissive: 0x0c4a6f,
        emissiveIntensity: 0.38,
        metalness: 0.62,
        roughness: 0.28,
      }),
    );
    switchUnit.position.set(1.25, 0.38 + index * 0.28, 0);
    networkGroup.add(switchUnit);
  }

  building.add(networkGroup);

  networkGroup.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
      networkMaterials.push(object.material);
    }
  });

  const roofGarden = new THREE.Group();
  roofGarden.position.y = floorCount * floorHeight + 0.18;

  for (const [x, z, scale] of [
    [-4.3, -2.4, 0.72],
    [-2.8, 2.7, 0.66],
    [3.8, -2.6, 0.72],
    [4.5, 2.4, 0.62],
  ] as const) {
    const tree = makeTree(scale);
    tree.position.set(x, 0, z);
    roofGarden.add(tree);
  }

  const roofPergola = new THREE.Group();
  const pergolaMaterial = material(0x172334, {
    metalness: 0.58,
    roughness: 0.34,
  });

  for (const x of [-1.6, 1.6]) {
    const post = box(0.1, 1.55, 0.1, pergolaMaterial);
    post.position.set(x, 0.78, -0.5);
    roofPergola.add(post);
  }

  for (const z of [-1.2, 0.2]) {
    const beam = box(3.4, 0.1, 0.1, pergolaMaterial);
    beam.position.set(0, 1.55, z);
    roofPergola.add(beam);
  }

  roofGarden.add(roofPergola);
  building.add(roofGarden);

  const landscaping = [
    [-8.3, 0, 4.9, 0.9],
    [-6.6, 0, 6.1, 0.78],
    [7.7, 0, 5.6, 0.85],
    [8.4, 0, 2.8, 0.72],
    [-8.4, 0, -4.2, 0.72],
    [8.2, 0, -4.5, 0.72],
  ] as const;

  for (const [x, y, z, scale] of landscaping) {
    const tree = makeTree(scale);
    tree.position.set(x, y + 0.4, z);
    scene.add(tree);
  }

  const poolMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x164a6b,
    transparent: true,
    opacity: 0.72,
    roughness: 0.12,
    metalness: 0.08,
  });

  const leftPool = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 2.0), poolMaterial);
  leftPool.position.set(-7.3, 0.47, 6.4);

  const rightPool = leftPool.clone();
  rightPool.position.x = 7.3;

  scene.add(leftPool, rightPool);

  const selectableObjects: THREE.Object3D[] = [leftDoor, rightDoor];

  const entranceHitbox = addRoomHitbox(
    selectableObjects,
    'entrance',
    new THREE.Vector3(0, 1.55, 4.05),
    new THREE.Vector3(3.2, 3.0, 0.8),
  );
  building.add(entranceHitbox);

  const serverHitbox = addRoomHitbox(
    selectableObjects,
    'server-room',
    new THREE.Vector3(-3.8, floorHeight + 1.2, -0.3),
    new THREE.Vector3(4.7, 2.2, 3.2),
  );
  building.add(serverHitbox);

  const securityHitbox = addRoomHitbox(
    selectableObjects,
    'security',
    new THREE.Vector3(3.7, floorHeight + 1.2, -0.3),
    new THREE.Vector3(4.4, 2.2, 3.0),
  );
  building.add(securityHitbox);

  const peopleHitbox = addRoomHitbox(
    selectableObjects,
    'people',
    new THREE.Vector3(0, floorHeight * 2 + 1.2, 0),
    new THREE.Vector3(11.8, 2.2, 7.6),
  );
  building.add(peopleHitbox);

  const networkHitbox = addRoomHitbox(
    selectableObjects,
    'network',
    new THREE.Vector3(-3.4, floorHeight * 3 + 1.2, -0.4),
    new THREE.Vector3(5.0, 2.2, 3.4),
  );
  building.add(networkHitbox);

  const markers: Record<Exclude<CompanySceneTarget, 'access-card' | 'entrance'>, ZoneVisual> = {
    network: {
      marker: makeZoneMarker(
        0x62c8ff,
        new THREE.Vector3(-4.4, floorHeight * 3 + 1.5, 3.2),
        'network',
      ),
      materials: networkMaterials,
    },
    people: {
      marker: makeZoneMarker(
        0x71e2ff,
        new THREE.Vector3(4.1, floorHeight * 2 + 1.5, 3.2),
        'people',
      ),
      materials: peopleMaterials,
    },
    'server-room': {
      marker: makeZoneMarker(
        0x66ffb0,
        new THREE.Vector3(-4.4, floorHeight + 1.35, 3.1),
        'server-room',
      ),
      materials: serverMaterials,
    },
    security: {
      marker: makeZoneMarker(0x68ffb7, new THREE.Vector3(4.1, floorHeight + 1.35, 3.1), 'security'),
      materials: securityMaterials,
    },
  };

  for (const zone of Object.values(markers)) {
    building.add(zone.marker);
    selectableObjects.push(zone.marker);
  }

  const readerPost = box(
    0.34,
    1.25,
    0.34,
    material(0x162332, {
      metalness: 0.66,
      roughness: 0.32,
    }),
  );
  readerPost.position.set(-1.45, 1.02, 4.0);
  building.add(readerPost);

  const readerIndicatorMaterial = material(0xff4c61, {
    emissive: 0xff3047,
    emissiveIntensity: 2.2,
    roughness: 0.12,
  });

  const readerIndicator = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 16),
    readerIndicatorMaterial,
  );
  readerIndicator.position.set(-1.45, 1.32, 4.19);
  building.add(readerIndicator);

  const cardGroup = new THREE.Group();
  const cardMesh = box(
    1.6,
    0.98,
    0.06,
    material(0xf1f6fb, {
      emissive: 0x2e73ba,
      emissiveIntensity: 0.16,
      metalness: 0.08,
      roughness: 0.2,
    }),
  );
  cardMesh.userData.target = 'access-card' satisfies CompanySceneTarget;

  const cardBand = box(
    1.15,
    0.09,
    0.02,
    material(0x17365d, {
      emissive: 0x308ae5,
      emissiveIntensity: 0.7,
      roughness: 0.18,
    }),
  );
  cardBand.position.set(0, 0.18, 0.045);

  const cardChip = box(
    0.28,
    0.21,
    0.02,
    material(0xd1b56b, {
      metalness: 0.72,
      roughness: 0.24,
    }),
  );
  cardChip.position.set(-0.42, -0.16, 0.045);

  cardGroup.add(cardMesh, cardBand, cardChip);
  cardGroup.position.set(5.2, 2.0, 8.1);
  cardGroup.rotation.set(-0.16, -0.55, -0.08);
  cardGroup.lookAt(camera.position);
  scene.add(cardGroup);
  selectableObjects.push(cardMesh);

  const cardStart = cardGroup.position.clone();
  const cardEnd = new THREE.Vector3(-1.45, 1.45, 3.82);

  function update(elapsed: number, progress: number, state: CompanySceneState) {
    const cardProgress = state.cardSelected ? THREE.MathUtils.smoothstep(progress, 0, 0.46) : 0;

    const grantedProgress = state.entering ? THREE.MathUtils.smoothstep(progress, 0.38, 0.58) : 0;

    const doorProgress = state.entering ? THREE.MathUtils.smoothstep(progress, 0.5, 0.75) : 0;

    const idle = Math.sin(elapsed * 1.7) * 0.08 * (1 - cardProgress);

    cardGroup.position.copy(cardStart).lerp(cardEnd, cardProgress);
    cardGroup.position.y += idle;

    const cardScale = THREE.MathUtils.lerp(1, 0.58, cardProgress);
    cardGroup.scale.setScalar(cardScale);

    if (!state.cardSelected) {
      cardGroup.lookAt(camera.position);
    } else {
      cardGroup.rotation.set(0, 0.06, 0);
    }

    leftDoor.position.x = -0.42 - doorProgress * 0.74;
    rightDoor.position.x = 0.42 + doorProgress * 0.74;

    const locked = new THREE.Color(0xff4358);
    const granted = new THREE.Color(0x59f6a0);
    const readerColor = locked.clone().lerp(granted, grantedProgress);

    readerIndicatorMaterial.color.copy(readerColor);
    readerIndicatorMaterial.emissive.copy(readerColor);

    for (const [target, visual] of Object.entries(markers)) {
      const active = state.focusedTarget === target;

      const markerMaterial = visual.marker.material as THREE.MeshStandardMaterial;

      markerMaterial.emissiveIntensity = active ? 3.0 : 1.6;
      visual.marker.scale.setScalar(active ? 1.35 : 1);

      for (const zoneMaterial of visual.materials) {
        zoneMaterial.emissiveIntensity = active
          ? Math.max(zoneMaterial.emissiveIntensity, 0.5)
          : Math.min(zoneMaterial.emissiveIntensity, 0.35);
      }
    }
  }

  return {
    scene,
    camera,
    selectableObjects,
    overviewPosition,
    overviewTarget,
    entrancePosition,
    entranceTarget,
    lobbyPosition,
    lobbyTarget,
    update,

    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          const materials = Array.isArray(object.material) ? object.material : [object.material];

          for (const meshMaterial of materials) {
            meshMaterial.dispose();
          }
        }
      });
    },
  };
}
