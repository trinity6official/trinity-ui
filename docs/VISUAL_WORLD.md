# Visual World Direction

## Definition

The Trinity6 visual world is:

> **Premium interactive architectural world + digital twin visualization.**

It is not:

- a dashboard;
- a network graph;
- a conventional WASD game;
- a collection of floating pills;
- a static hero image with invisible links;
- a generic metaverse scene.

## Landing composition

The first page should present the whole company.

The user should immediately understand:

- this is a complete organization;
- multiple floors and rooms exist;
- systems are located in real places;
- the building can be explored;
- the entrance is one interaction inside the larger world.

The building should be zoomed out enough to establish context.

The entrance must not dominate the initial composition.

## Visual language

Target qualities:

- premium multi-floor architecture;
- isometric / elevated cinematic composition;
- cutaway or readable glass interiors;
- dark-night environment;
- restrained cyan digital accents;
- warm interior lighting;
- landscape, pavement, trees, vehicles, and environmental context;
- believable office interiors;
- visible racks and infrastructure;
- clean, minimal overlays.

The architecture should look credible before the digital twin layer is added.

## Initial visible zones

The first company should visually communicate at least:

- people / office workspace;
- network operations;
- server room;
- security;
- secure entrance;
- lobby / reception;
- rooftop / environmental detail.

These are real scene regions, not only labels.

## Interaction

### Desktop

Hover may reveal that a region is interactive.

Click selects or activates it.

### Mobile

Touch is primary.

A good pattern is:

```text
tap object
   ↓
select / highlight
   ↓
tap again or use explicit action
   ↓
activate / navigate
```

Large invisible hit targets may be used around small 3D objects, but the visual object itself remains real geometry.

## Access-card experience

The access card is a real scene object.

The user can:

- touch the card;
- touch the entrance/card reader;
- use an accessible `Present access card` control.

Preferred sequence:

```text
overview
  ↓
card selected
  ↓
reader highlighted
  ↓
card moves to reader
  ↓
verification pulse
  ↓
red → green
  ↓
doors physically open
  ↓
camera enters
```

## Spatial drill-down

Long-term:

```text
Building
  ↓
Floor
  ↓
Room
  ↓
Rack
  ↓
Server
```

For example, the server room should visibly contain:

- racks;
- patch panels;
- switches;
- server units;
- status lights;
- cable trays;
- cabling;
- room architecture.

Selecting a rack should physically move the camera toward that rack.

Selecting a server should expose semantic information from the World Engine / Trinity layer.

## Network representation

Networking should follow believable infrastructure.

Avoid:

```text
Laptop -------- Firewall -------- Server
```

as floating UI lines.

Prefer:

```text
Laptop
  ↓
Wi-Fi AP
  ↓
network switch
  ↓
firewall
  ↓
switch / distribution
  ↓
server rack
  ↓
server
  ↓
database
```

Cables/fiber may travel through ceilings, risers, trays, walls, and equipment rooms.

During a guided scenario, the digital overlay can illuminate the relevant real path.

## Attack visualization

The flagship attack experience should become spatial.

Example:

```text
phishing
  ↓
employee laptop compromised
  ↓
Wi-Fi / network
  ↓
security boundary
  ↓
application server
  ↓
database
```

The camera and overlay should follow the path through the building.

## UI overlays

UI should remain secondary to the world.

Use:

- small status pills;
- focused tooltips;
- contextual inspector panels;
- access/card prompts;
- selected-object information.

Avoid covering the building with permanent labels.

## Production fidelity

The procedural Three.js scene is not the final art target.

Production quality requires authored assets, PBR materials, controlled lighting, environment design, and careful optimization.

See [3D Asset Pipeline](ASSET_PIPELINE.md).
