---
title: Characters
description: People in the universe — pilots, marines, crew, mission actors, station staff, NPC factionists.
---

The **Characters** section covers people in the universe — anything with a head, a name, skills, and a control post. Crew, mission actors, station staff, pilots, marines, the player avatar.

## Categories

- **[NPC](/game/characters/npc/)** — non-player characters. Crew, mission actors, station staff, conversation partners.
- **Entity** (abstract base — most accessors live here; not a separate page; rolled into [NPC](/game/characters/npc/)).
- **Player** (planned) — `player.entity` accessor, special handling.

Characters are tightly coupled with [Faction](/game/factions/faction/) (ownership), [Ship](/game/objects/ship/) and [Station](/game/objects/station/) (where they live and work), and [Ware → Inventory](/game/economy/ware/) (what they carry).
