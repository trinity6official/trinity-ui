import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  COMPANY_CAMERA_OBJECTS,
  COMPANY_MODEL_URL,
  COMPANY_TARGET_OBJECTS,
  REQUIRED_COMPANY_OBJECTS,
  type CompanySceneTarget,
} from './company-world-contract';

export interface CompanySceneState {
  readonly cardSelected: boolean;
  readonly entering: boolean;
  readonly focusedTarget: CompanySceneTarget | null;
}

export interface CompanyWorldRuntime {
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

interface CameraPose {
  readonly position: THREE.Vector3;
  readonly target: THREE.Vector3;
}

function resolveRequiredObject(root: THREE.Object3D, name: string): THREE.Object3D {
  const object = root.getObjectByName(name);
  if (!object) throw new Error(`Trinity6 company asset is missing required object "${name}".`);
  return object;
}

function readCameraPose(
  root: THREE.Object3D,
  name: string,
  fallbackPosition: THREE.Vector3,
  fallbackTarget: THREE.Vector3,
): CameraPose {
  const object = root.getObjectByName(name);
  if (!(object instanceof THREE.Camera)) {
    return { position: fallbackPosition.clone(), target: fallbackTarget.clone() };
  }
  const position = object.getWorldPosition(new THREE.Vector3());
  const direction = object.getWorldDirection(new THREE.Vector3()).normalize();
  return { position, target: position.clone().add(direction.multiplyScalar(12)) };
}

function setWorldPosition(object: THREE.Object3D, worldPosition: THREE.Vector3) {
  if (!object.parent) {
    object.position.copy(worldPosition);
    return;
  }
  object.position.copy(object.parent.worldToLocal(worldPosition.clone()));
}

function cloneEditableMaterials(object: THREE.Object3D): readonly THREE.MeshStandardMaterial[] {
  const editable: THREE.MeshStandardMaterial[] = [];
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const cloned = materials.map((material) => material.clone());
    child.material = Array.isArray(child.material) ? cloned : cloned[0];
    for (const material of cloned) {
      if (material instanceof THREE.MeshStandardMaterial) editable.push(material);
    }
  });
  return editable;
}

function disposeSceneResources(scene: THREE.Scene) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of meshMaterials) {
      materials.add(material);
      const record = material as unknown as Record<string, unknown>;
      for (const value of Object.values(record)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
    }
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

export async function loadCompanyWorldScene(
  width: number,
  height: number,
): Promise<CompanyWorldRuntime> {
  const aspect = width / Math.max(height, 1);
  const portrait = aspect < 0.82;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030814);
  scene.fog = new THREE.Fog(0x030814, portrait ? 42 : 36, portrait ? 82 : 72);

  const camera = new THREE.PerspectiveCamera(portrait ? 48 : 44, aspect, 0.1, 180);

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(COMPANY_MODEL_URL);
  const assetRoot = gltf.scene;
  assetRoot.name = 'TrinityCompanyAsset';
  scene.add(assetRoot);
  assetRoot.updateMatrixWorld(true);

  for (const objectName of REQUIRED_COMPANY_OBJECTS) resolveRequiredObject(assetRoot, objectName);

  assetRoot.traverse((object) => {
    if (object instanceof THREE.Light) object.castShadow = false;
  });

  const runtimeAmbient = new THREE.HemisphereLight(0x6888ba, 0x090b10, 0.5);
  runtimeAmbient.name = 'Runtime_Ambient';
  scene.add(runtimeAmbient);

  const overviewPose = readCameraPose(
    assetRoot,
    COMPANY_CAMERA_OBJECTS.overview,
    portrait ? new THREE.Vector3(16, 15.5, 24.5) : new THREE.Vector3(17, 13.5, 22),
    new THREE.Vector3(0, 4.2, -0.2),
  );
  const entrancePose = readCameraPose(
    assetRoot,
    COMPANY_CAMERA_OBJECTS.entrance,
    portrait ? new THREE.Vector3(7.5, 5.3, 12.5) : new THREE.Vector3(7.4, 4.8, 11),
    new THREE.Vector3(0, 1.6, 4.1),
  );
  const lobbyPose = readCameraPose(
    assetRoot,
    COMPANY_CAMERA_OBJECTS.lobby,
    new THREE.Vector3(0.1, 1.65, 2.2),
    new THREE.Vector3(0, 1.65, -4),
  );

  camera.position.copy(overviewPose.position);
  camera.lookAt(overviewPose.target);

  const selectable = new Set<THREE.Object3D>();
  const focusRoots = new Map<CompanySceneTarget, THREE.Object3D>();

  for (const [target, objectNames] of Object.entries(COMPANY_TARGET_OBJECTS) as [
    CompanySceneTarget,
    readonly string[],
  ][]) {
    for (const objectName of objectNames) {
      const object = resolveRequiredObject(assetRoot, objectName);
      object.userData.companyTarget = target;
      selectable.add(object);
      if (!focusRoots.has(target)) focusRoots.set(target, object);
    }
  }

  const accessCard = resolveRequiredObject(assetRoot, 'AccessCard_01');
  const cardReader = resolveRequiredObject(assetRoot, 'CardReader');
  const readerStatus = resolveRequiredObject(assetRoot, 'CardReader_Status');
  const leftDoor = resolveRequiredObject(assetRoot, 'EntranceDoor_Left');
  const rightDoor = resolveRequiredObject(assetRoot, 'EntranceDoor_Right');

  const readerMaterials = cloneEditableMaterials(readerStatus);
  const cardStartWorld = accessCard.getWorldPosition(new THREE.Vector3());
  const cardEndWorld = cardReader
    .getWorldPosition(new THREE.Vector3())
    .add(new THREE.Vector3(0, 0.3, 0.26));
  const cardStartScale = accessCard.scale.clone();
  const cardStartQuaternion = accessCard.quaternion.clone();

  const leftDoorClosed = leftDoor.position.clone();
  const rightDoorClosed = rightDoor.position.clone();
  const leftOpenDistance = Number(leftDoor.userData.open_distance ?? 0.78);
  const rightOpenDistance = Number(rightDoor.userData.open_distance ?? 0.78);
  const leftOpenDirection = Number(leftDoor.userData.open_direction ?? -1);
  const rightOpenDirection = Number(rightDoor.userData.open_direction ?? 1);

  const focusBounds = new THREE.Box3();
  const focusHelper = new THREE.Box3Helper(focusBounds, 0x65d5ff);
  focusHelper.name = 'Runtime_FocusOutline';
  focusHelper.visible = false;
  scene.add(focusHelper);

  let lastFocusedTarget: CompanySceneTarget | null = null;

  function update(elapsed: number, progress: number, state: CompanySceneState) {
    const cardProgress = state.cardSelected ? THREE.MathUtils.smoothstep(progress, 0, 0.48) : 0;
    const grantedProgress = state.entering ? THREE.MathUtils.smoothstep(progress, 0.36, 0.58) : 0;
    const doorProgress = state.entering ? THREE.MathUtils.smoothstep(progress, 0.5, 0.76) : 0;

    const cardWorld = cardStartWorld.clone().lerp(cardEndWorld, cardProgress);
    cardWorld.y += Math.sin(elapsed * 1.7) * 0.06 * (1 - cardProgress);
    setWorldPosition(accessCard, cardWorld);

    accessCard.scale
      .copy(cardStartScale)
      .multiplyScalar(THREE.MathUtils.lerp(1, 0.66, cardProgress));
    accessCard.quaternion.copy(cardStartQuaternion);

    leftDoor.position.copy(leftDoorClosed);
    leftDoor.position.x += leftOpenDistance * leftOpenDirection * doorProgress;
    rightDoor.position.copy(rightDoorClosed);
    rightDoor.position.x += rightOpenDistance * rightOpenDirection * doorProgress;

    const readerColor = new THREE.Color(0xff4058).lerp(new THREE.Color(0x58f39d), grantedProgress);

    for (const material of readerMaterials) {
      material.color.copy(readerColor);
      material.emissive.copy(readerColor);
      material.emissiveIntensity = state.entering ? 2.8 : 2.1;
    }

    if (state.focusedTarget !== lastFocusedTarget) {
      lastFocusedTarget = state.focusedTarget;
      if (!state.focusedTarget) {
        focusHelper.visible = false;
      } else {
        const focusRoot = focusRoots.get(state.focusedTarget);
        if (focusRoot) {
          focusBounds.setFromObject(focusRoot);
          focusBounds.expandByScalar(0.12);
          focusHelper.visible = !focusBounds.isEmpty();
        }
      }
    }
  }

  return {
    scene,
    camera,
    selectableObjects: [...selectable],
    overviewPosition: overviewPose.position,
    overviewTarget: overviewPose.target,
    entrancePosition: entrancePose.position,
    entranceTarget: entrancePose.target,
    lobbyPosition: lobbyPose.position,
    lobbyTarget: lobbyPose.target,
    update,
    dispose() {
      disposeSceneResources(scene);
      focusHelper.geometry.dispose();
      const focusMaterials = Array.isArray(focusHelper.material)
        ? focusHelper.material
        : [focusHelper.material];
      for (const material of focusMaterials) material.dispose();
      scene.clear();
    },
  };
}

export type { CompanySceneTarget } from './company-world-contract';
