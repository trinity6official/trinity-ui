# 3D Asset Pipeline

## Goal

Reach production architectural quality without coupling Trinity6 to a proprietary editor or turning Three.js into a modeling tool.

The repository owns the exported runtime assets.

Authoring tools remain replaceable.

## Pipeline

```text
Visual reference / art direction
          ↓
Blender source scene
          ↓
modeling / materials / lighting / naming
          ↓
validation + optimization
          ↓
GLB / GLTF export
          ↓
trinity-ui/public/models/
          ↓
Three.js GLTFLoader
          ↓
semantic object mapping
          ↓
World Engine / Trinity commands
```

## Why GLB / GLTF

GLB/GLTF provides a portable web-oriented format for:

- meshes;
- hierarchy;
- materials;
- textures;
- animations;
- named objects.

The runtime should not depend on access to the original authoring service.

## Proposed repository structure

```text
assets/
  source/
    blender/
      trinity-company.blend
  textures/
    company/
  references/
    company/

public/
  models/
    company/
      trinity-company.glb

scripts/
  blender/
    build_company_world.py
    validate_company_world.py
    export_company_world.py
```

Large binary/source assets may require an artifact storage or Git LFS decision later. Do not introduce that until repository size justifies it.

## Blender role

Blender is the preferred production authoring tool because:

- it is locally controllable;
- it supports professional modeling/material/lighting workflows;
- it has a Python API;
- it exports GLB/GLTF;
- source assets are not locked behind a hosted SaaS account.

Blender is an authoring tool, not an application runtime dependency.

## Automation

The goal is to automate repetitive scene setup.

Example future command:

```bash
blender --background \
  --python scripts/blender/build_company_world.py
```

Possible automated tasks:

- floor generation;
- room shells;
- rack placement;
- equipment naming;
- material assignment;
- lighting rig setup;
- validation;
- export.

Human/art-direction refinement remains expected for production visual quality.

## Scene hierarchy

Use stable semantic names.

Recommended structure:

```text
TrinityCompany
  Exterior
  Landscape
  Roof
  Floor_04
    NetworkRoom
      Switch_01
      Firewall_01
  Floor_03
    Office
      Desk_001
      Workstation_001
  Floor_02
    ServerRoom
      Rack_01
        Server_01
        Server_02
      CableTray_01
  Floor_01
    Lobby
    Reception
    EntranceDoor_Left
    EntranceDoor_Right
    CardReader
```

## Naming contract

Names used by application code must be deliberate and stable.

Bad:

```text
Cube.019
Cube.020
Object_443
```

Good:

```text
EntranceDoor_Left
Rack_01
Server_01
Firewall_01
CardReader
```

Do not use display text as the only stable identifier when a separate semantic ID is required.

## Semantic mapping

The renderer should map GLB objects to World Engine entities.

Example:

```text
GLB object:
  Rack_01

Renderer mapping:
  worldEntityId = rack-01

World Engine:
  Rack 01
    → contains Server 01
    → connected to Switch 02
```

The asset can be visually replaced without changing semantic IDs.

## Materials

Production materials should use PBR conventions where appropriate:

- base color;
- roughness;
- metallic;
- normal;
- ambient occlusion;
- emissive maps.

Important material classes:

- architectural glass;
- concrete/stone;
- brushed/dark metal;
- painted interior walls;
- desks/wood/composite;
- server/rack metal;
- displays/LEDs;
- pavement;
- vegetation;
- water.

Avoid excessive unique materials.

## Lighting

Visual target uses layered lighting:

- cool exterior/environment light;
- warm interior lighting;
- restrained cyan brand/digital lighting;
- localized server/network LEDs;
- entry/security lighting;
- soft shadows.

Lighting must remain performant on mobile.

## Post-processing

Potential production enhancements:

- restrained bloom;
- ambient occlusion;
- tone mapping;
- subtle reflections;
- optional depth-of-field for controlled cinematic moments.

Do not make critical information depend on effects.

Do not overuse bloom.

## Performance budgets

Asset work must consider:

- triangle count;
- material count;
- draw calls;
- texture resolution;
- texture memory;
- animation cost;
- shadow-casting light count;
- mobile GPU behavior.

Use:

- mesh merging where appropriate;
- instancing for repeated objects;
- compressed textures;
- LOD for complex assets where useful;
- progressive loading;
- capped renderer pixel ratio.

Exact budgets should be established through measurements on representative phones and desktops.

## Loading strategy

The initial company overview should load first.

Detailed interiors may load progressively.

Example:

```text
shell / exterior
      ↓
visible floor assets
      ↓
nearby room details
      ↓
high-detail device assets on drill-down
```

Avoid loading every future device at maximum detail on first paint.

## Fallback

If WebGL is unavailable:

- preserve the page's semantic navigation;
- expose core rooms/entities in DOM;
- allow guided learning without a blank page.

## Asset review criteria

A production asset is accepted when it:

- matches the Trinity6 visual direction;
- has stable object naming;
- supports required interactions;
- fits performance budgets;
- renders correctly on mobile;
- does not rely on inaccessible external accounts;
- can be reproduced/exported from repository-controlled source assets.

## Current production company asset

The production Trinity6 headquarters is repository-owned at:

```text
public/models/company/trinity-company.glb
```

Asset provenance and acceptance data:

- 3D Jutsu project: `4e821ba3-60f3-479d-acee-5eb3f8e8a598`
- accepted revision: `19`
- world version: `2.0`
- asset stage: `final`
- exported GLB size: `1,190,200 bytes`
- SHA-256: `1fc7f3b0f229ebf3c6324054fd590e2ed094693971b30f169d8d61fed1ba6b54`
- approximate triangles: `15,080`
- semantic IDs: `109`
- interactive objects: `73`
- camera presets: `9`

The final asset intentionally contains no ambient people, cars, front terraces, or city-backdrop geometry. The city is a separate runtime environment concern.

The accepted exterior direction is a premium night headquarters with warm interior illumination, hero facade/entrance focus lighting, restrained cyan Trinity6 accents, landscaping, reflecting pools, and a clean front facade.

### Runtime contract

The Three.js runtime binds to stable names and semantic IDs exported in GLB extras. The flagship physical cybersecurity path is:

```text
Laptop_01
  → WiFi_AP_01
  → Switch_01
  → Firewall_01
  → ApplicationServer_01
  → Database_01
```

Corresponding semantic IDs are kept in `company-world-contract.ts`.

The GLB includes the accepted authored lighting cues. Trinity UI remains responsible for renderer exposure, environment lighting, device-specific quality, selection/highlight effects, and future simulation overlays.
