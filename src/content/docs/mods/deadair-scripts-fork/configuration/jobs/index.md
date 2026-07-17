---
title: DA Jobs
description: DA's per-faction job system — Expeditions (long-range flagship attack fleets) + Smart Sector Tags / SST (per-faction, per-sector-role fleet quotas). 6 options + 2 sub-menus (Jobs Quotas, Vanilla Spawned Jobs Menu).
sidebar:
  order: 6
---

DA's overhaul of the vanilla faction-jobs system. Two independent subsystems live under this menu:

- **Expeditions** — long-range XL-flagship attack fleets similar to Terran Interventions. Each `tag.claimspace` faction gets one active expedition at a time.
- **Smart Sector Tags (SST)** — per-faction, per-sector-role fleet quotas. Sectors are classified as Critical / Core / Border / Contested and each faction has quota rows per role × ship class.

## In-game view

![DA Jobs main menu — 6 options + 2 sub-menu links](/x4-modding-wiki/img/mods/deadair-scripts/menu-jobs.jpg)

Layout:

- **Top section (`DA Jobs Options`)** — 6 configurable fields covering subsystem master toggles + 3 debug channels.
- **Bottom section (`DA Jobs Menus`)** — 2 sub-menus for per-faction quota editing and vanilla-job whitelist management.

## DA Jobs Options

| Setting | Default | Effect |
|---|---|---|
| **Enable Expeditions** | `Enabled` | Master toggle for the Expeditions subsystem. `$DAJobsEXPEnable` in source. |
| **Enable Smart Sector Tags** | `Enabled` | Master toggle for the SST subsystem — turns per-faction fleet quotas on/off. `$DAJobsSSTEnable`. |
| **Remove Space Job Exclusivity** | `Enabled` | Allows multiple factions to simultaneously patrol the same "contested" sector. Off = classical DA behavior (single dominant patroller per contested sector). `$DAJobsSSTRemoveExclusivity`. |
| **Enable Jobs Exped Debug** | `Disabled` | Verbose `[JOBSEXP]` log lines. `$DAJobsEXPDetailedDebug`. |
| **Enable Jobs SST Debug** | `Disabled` | Verbose `[JOBSSST]` log lines. `$DAJobsSSTDetailedDebug`. |
| **Enable Jobs SST Extra Debug** | `Disabled` | Very verbose — every ship-order attempt is logged. Diagnostic only, huge spam. `$DAJobsSSTXtremelyDetailedDebug`. |

## DA Jobs Menus

- **[Jobs Quotas](./quotas/)** — per-faction quota tables. Each faction has one entry, expanding it reveals sliders for Critical/Core/Border/Contested Sector Patrol + L/M Trader + L/M Mineral Miner + L/M Gas Miner rows.
- **[Vanilla Spawned Jobs Menu](./vanilla-spawned/)** — whitelist of specific vanilla job IDs that DA leaves alone. Per-job Enable/Disable toggle.

## Expeditions — how the subsystem works

DA maintains a dynamic list of `tag.claimspace` factions eligible for expeditions (populated at gamestart from `get_factions_by_tag`, so modded factions plug in without patching DA). Each eligible faction gets **one** active expedition at a time — an XL flagship + escort tree launched from that faction's shipyard, patrolling distant sectors.

When the expedition flagship dies or the expedition completes, DA queues a replacement from a faction shipyard with a full loadout. Requires `Enable Expeditions` to be on.

**v2.0.0 change (mlog013):** modded factions are enumerated dynamically instead of via the original hardcoded 8-faction list. Companion compat mods ([Apus](/x4-modding-wiki/mods/apus-compat/), [ETW](/x4-modding-wiki/mods/etw-compat/)) add tag.claimspace to their factions and they participate automatically.

See [Modded-faction dynamic support](../../mechanics/#modded-faction-dynamic-support) for the architecture.

## Smart Sector Tags (SST) — how the subsystem works

Each sector is classified into one of four roles per faction:

- **Critical** — main-arterial defensive sectors (usually where the faction's headquarters or highest-value shipyard sits).
- **Core** — inner-territory sectors well inside the faction's borders.
- **Border** — sectors touching hostile-neighbor faction borders.
- **Contested** — sectors bordering Xenon fronts or heavily-disputed frontiers.

Each faction × role × ship-class combination has a Galaxy Quota (total ships in that pool across the entire galaxy) and a Sector Quota (max ships of that role in any one sector) plus a Fleet Size selector (Small = 1 escort per flagship, Medium = 2, Large = 3).

DA's runtime scheduler continuously monitors these pools. When a patrol is destroyed and the pool drops below the Galaxy Quota, DA queues a replacement order at a faction shipyard. Requires `Enable Smart Sector Tags` to be on.

Fully-editable per-faction values live in the [Jobs Quotas](./quotas/) sub-menu. Roles per faction:

- Critical / Core / Border / Contested Sector Patrol (fleet-based, units = Fleets)
- L Trader / M Trader (ship-based, units = Ships)
- L Mineral Miner / M Mineral Miner (ship-based, units = Ships)
- L Gas Miner / M Gas Miner (ship-based, units = Ships)

**Modded factions:** SST automatically enumerates factions with the required job tags. Without a companion compat mod, a modded faction row will show "No suitable ships available!" — the compat mod is what registers the modded ship classes into DA's job pool.

## Related MD-only subsystems (no UI in this menu)

DA has two additional job subsystems that don't have configuration menus — they're MD-driven and their behavior is fixed. They're mentioned here because they're conceptually adjacent to the Jobs system.

### Station Traders (ST)

Introduced in v3.0-beta1 Phase 2+3+5v2. Each player-friendly trade station (owned by a faction the player is `>= friend` with) gets a set of subordinate M-class traders that shuttle wares in/out on the player's behalf. Reduces micromanagement of a sprawling logistics network.

| Setting | Value | Effect |
|---|---|---|
| `ST_Enabled` | `true` (fixed) | Master toggle — hardcoded on. |
| `ST_QuotaPerStation` | `20` | M-traders per trade station. |
| `ST_ReconcileIntervalMin` | `30 min` | How often the reconcile pass runs (rebuild roster, cleanup dead entries). |

A **5-sector blacklist** excludes trade stations that sit too close to another trade station (added mlog094 via sector.macro references for save-stability): Earth, Reflected Stars, Towering Wave, Atreus' Clouds, Rolk's Demise. The blacklist is hardcoded in [`md/mlog_da_station_traders.xml`](https://github.com/mlog4/deadair_scripts) — you can inspect the runtime state via mlog_dev_bridge (developer tool).

### Prod Station Traders (PST)

Introduced in v3.0-beta1 Phase 4. Analog of ST for **production factories** (not trade stations). Each factory gets subordinate M-traders that specifically shuttle inputs/outputs for that recipe.

| Setting | Value | Effect |
|---|---|---|
| `PST_Enabled` | `true` (fixed) | Master toggle. |
| `PST_QuotaPerStation` | `2` | M-traders per factory (lower than ST because factories usually have fewer wares in play). |
| `PST_ReconcileIntervalMin` | `60 min` | Reconcile pass interval. |

Both subsystems are documented in the source at [`md/mlog_da_station_traders.xml`](https://github.com/mlog4/deadair_scripts) and [`md/mlog_da_prod_station_traders.xml`](https://github.com/mlog4/deadair_scripts).

## Gameplay effect at recommended defaults

- Any given sector inside a lawful faction's Core zone has 2-4 patrol groups active at any time.
- A Critical sector (with an important shipyard) has 4-8 patrol groups.
- Xenon incursions get repelled unless heavily outnumbered.
- Each faction has one XL-flagship expedition running somewhere in the galaxy, hunting distant targets.
- Player-friendly trade stations get their own 20-M-trader logistics net automatically.
