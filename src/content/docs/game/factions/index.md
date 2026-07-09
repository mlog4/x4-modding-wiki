---
title: Factions
description: Who owns and controls things in X4.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Faction (parent)

- **Faction** — abstraction representing a controlling entity (vanilla NPC factions, player, special factions).

## Subtypes

- **Player** — special faction representing the player.
- **NPC factions** — Argon, Paranid, Teladi, Split, Terran, Boron, Xenon, Khaak, plus DLC factions.

## People (within a faction)

- **Crew** — generic NPCs on ships/stations.
- **Pilot** — flies a ship.
- **Captain** — commands a ship.
- **Marine** — boarding combat.
- **Service crew** — defends station/ship.

## Common questions (planned)

- *"How do I read faction relation to another faction?"* → Faction → Properties → `.relationto.{X}`.
- *"How do I change faction relations?"* → Faction → Actions → `<set_relation>` / `<change_relation>`.
- *"How do I find faction's primary enemy?"* → Faction → Libraries → `md.LIB_Generic.DetermineEnemyFaction`.
- *"How do I detect relation change?"* → Faction → Events → `event_relation_changed`.
