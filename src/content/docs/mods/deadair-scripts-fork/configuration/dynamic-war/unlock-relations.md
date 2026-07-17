---
title: Unlock Relations
description: Per-faction hard lock — locked factions are excluded from Dynamic War events and from Increase/Decrease Relations purchases entirely.
sidebar:
  order: 3
---

Per-faction hard lock. Locked factions are entirely excluded from:

- Dynamic War auto-event picks
- [Increase Relations](../increase-relations/) purchases
- [Decrease Relations](../decrease-relations/) purchases

The relation with a locked faction is frozen at whatever value it had when the lock was applied.

## In-game view

![Unlock Relations submenu — faction list with Locked/Unlocked column](/x4-modding-wiki/img/mods/deadair-scripts/dw-unlock-relations.jpg)

## Layout

Single table:

| Column | Meaning |
|---|---|
| **Faction** | Every enumerated faction (vanilla + modded that DA discovers). |
| **Locked / Unlocked** | Current lock state. Click to toggle. |

## Default locks

By default (fresh save with recommended preset) these are **Locked** at gamestart:

- **Duke's Buccaneers** — plot-critical faction, changing relation would break story arcs.
- **Kha'ak** — always-hostile alien faction, no diplomacy expected.
- **Scale Plate Pact** — narrative-locked pirate faction.
- **Xenon** — always-hostile machine faction.

Everything else is **Unlocked** and free to fluctuate.

## When to lock a faction

- You want to freeze relations after reaching a specific state (e.g. Val Selton at exactly +30 forever).
- A DA-mod-installed faction is triggering broken behavior — lock and let vanilla handle it.
- Role-play — you want a specific rival to stay a rival regardless of what the war engine rolls.

## When to unlock

- You disagree with a default plot lock (Duke's Buccaneers usually kept locked, but a save-scummer might want to fight them).
- You installed a compat mod that expects a normally-locked faction to be diplomatically active.
