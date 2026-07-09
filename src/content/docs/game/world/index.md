---
title: World
description: Spatial hierarchy of the X4 universe.
---

The X4 world is organized as a tree:

```
Universe
└── Cluster
    └── Sector
        └── Zone
```

Plus traversal infrastructure: [Highway](./highway/) and [Gate](./gate/).

## Spatial containers

- [**Universe**](./universe/) — root. Vanilla has one main galaxy (`xu_ep2_universe_macro`) plus DLC-specific universes for Timelines maps.
- [**Cluster**](./cluster/) — group of sectors with shared encyclopedia info (planets, music, ambient).
- [**Sector**](./sector/) — main spatial unit. Contains objects, has economy/security values, owned by a faction.
- [**Zone**](./zone/) — sub-sector area for region-specific positioning.

## Traversal infrastructure

- [**Highway**](./highway/) — fast-travel within a sector (local highway loop).
- [**Gate**](./gate/) — connects sectors.
- [**Superhighway**](./superhighway/) — fast-travel between sectors in the same cluster.

## Common questions

- *"How do I find sector economy/security value?"* → [Sector](./sector/) properties.
- *"How do I get all stations in a sector?"* → [Sector](./sector/) → `.stations`.
- *"How do I detect sector ownership change?"* → [Sector](./sector/) → Events → `event_contained_sector_changed_true_owner`.

:::caution[Placeholder section]
Prototype: only the structure is shown. Pages will be filled after approval.
:::
