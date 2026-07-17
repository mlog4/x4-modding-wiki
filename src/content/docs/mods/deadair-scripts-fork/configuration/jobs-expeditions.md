---
title: Jobs Expeditions
description: Long-range XL-flagship attack fleets similar to Terran Interventions. One active expedition per faction, dynamically populated for tag.claimspace factions in v2.0.0.
sidebar:
  order: 7
---

Long-range attack fleets similar to Terran Interventions. An XL flagship + escort tree launches from a faction's shipyard and patrols distant sectors. Each faction gets one active expedition at a time.

## Mechanic

DA maintains a whitelist of `tag.claimspace` factions eligible for expeditions. Each faction can have 1 galaxy-wide expedition at a time (`galaxy` quota). When a faction's assigned expedition ship dies or completes, DA queues a replacement from a faction shipyard with a full loadout. Vanilla + modded factions with a companion compat mod ([Apus](/x4-modding-wiki/mods/apus-compat/), [ETW](/x4-modding-wiki/mods/etw-compat/)) participate.

> **📷 Screenshot needed:** DA Jobs → Expeditions submenu.
> _File: `menu-jobs-expeditions.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `JobsEXP_Enable` | `true` | Master toggle. |
| `JobsEXP_DetailedDebug` | `false` | Verbose `[JOBSEXP]` log lines. |

## v2.0.0 change: dynamic modded-faction enumeration

The initial expedition-eligible faction list is now populated **dynamically** from all `tag.claimspace` factions instead of a hardcoded 8-vanilla list. Modded factions plug in without patching the mod.

See [Modded-faction dynamic support](../../mechanics/#modded-faction-dynamic-support) for the architecture.
