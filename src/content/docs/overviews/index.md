---
title: Architectural overviews
description: How vanilla subsystems work end-to-end.
---

:::caution[Placeholder section]
Architectural overviews will be added after the API reference is in good shape. They link back to API pages for specifics rather than duplicating content.
:::

While the [API reference](/api/) tells you *how* to interact with an abstraction, **architectural overviews** explain *how subsystems work end-to-end*.

Each overview is short (~3–5KB) and **links into the API reference** for specifics rather than repeating content.

## Planned overviews

- **Galaxy seeding** — How the universe is populated at game start. From `god.xml` declarative input → engine `event_god_created_factory` → `FinaliseStations` MD pipeline → station rendered in world.
- **Station construction sequence** — How a station's physical structure is rendered after creation. `<create_construction_sequence>` → `event_object_construction_sequence_created` → `<apply_construction_sequence>` → `<signal_objects 'init station'>`.
- **Faction economy** — How NPC factions decide what to produce, build, or buy. Per-faction `Econ_Manager` reads shortage data, evaluates per-sector, picks one of 7 corrective actions.
- **Faction goals** — How factions pick strategic actions (invade, defend, plunder, patrol). Registry pattern + two-tier evaluation.
- **Mission framework** — How vanilla generates missions. Generic Mission registry + Reusable Mission Library phases.
- **Reward calculation** — How vanilla computes mission credits, notoriety, mod parts, and info rewards.
- **Patrol coordination** — Galaxy combat bus + per-faction priority queue + per-instance engagement.
- **Boarding** — 5-phase state machine for boarding operations.
- **NPC orders** — How NPC ship behavior is structured (state machine in aiscripts).
- **Save migration** — How vanilla migrates older save formats via `<patch sinceversion>`.
- **Assets pipeline** — How macros/components/indices fit together.
- **UI Lua framework** — The vanilla Helper API layers + FFI bridge.
