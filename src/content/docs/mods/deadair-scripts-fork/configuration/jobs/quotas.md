---
title: Jobs Quotas
description: Per-faction, per-role fleet quotas for DA's Smart Sector Tags (SST) subsystem. 10 rows per faction — 4 patrol roles + 6 economic roles. Each row has Fleet Size + Galaxy Quota + Sector Quota.
sidebar:
  order: 1
---

Per-faction, per-role quota tables driving DA's [Smart Sector Tags (SST)](../#smart-sector-tags-sst--how-the-subsystem-works) subsystem. Each participating faction has one collapsible entry; expanded, the entry shows 10 configurable rows.

## In-game view

![Jobs Quotas — Antigone Republic panel with all 10 roles visible](/x4-modding-wiki/img/mods/deadair-scripts/jobs-quotas.jpg)

The menu is a **vertical list of factions** (Antigone Republic, Argon Federation, etc.), each faction acting as its own visual sub-section with a title bar. Every faction has the same row shape.

## Per-role row structure

Every row has three configurable elements:

| Element | Values | Effect |
|---|---|---|
| **Fleet Size** | `Small Fleet` / `Medium Fleet` / `Large Fleet` (radio-select — one active at a time) | Sets how many escort ships accompany each flagship. Small=1, Medium=2, Large=3. Only applies to patrol roles; economic roles use a single-ship model. |
| **Galaxy Quota** | Integer (slider, unit = Fleets or Ships depending on role) | Max total pool size across the entire galaxy. When actual count < quota, DA queues replacement orders. |
| **Sector Quota** | Integer (slider) | Max pool size in any one sector. Prevents all patrols piling up in a single high-value sector. |

### Row 1-4: Patrol roles (fleet-based, unit = "Fleets")

| Row | What it patrols | Typical role |
|---|---|---|
| **Critical Sector Patrol** | Sectors with the faction's main shipyard / HQ / highest-value assets | Heaviest patrols. Faction can't afford these to fall. |
| **Core Sector Patrol** | Inner-territory sectors, well inside the faction's borders | Baseline security. High Galaxy Quota, low Sector Quota (spread out). |
| **Border Sector Patrol** | Sectors touching hostile-neighbor faction territory | Deters cross-border raids. |
| **Contested Sector Patrol** | Sectors bordering Xenon fronts or heavily-disputed frontiers | Attritional combat — highest sustained-loss quotas. |

### Row 5-6: Trade roles (ship-based, unit = "Ships")

| Row | Ship class | Purpose |
|---|---|---|
| **L Trader** | Large-class freighters | Long-range inter-faction trade lanes. |
| **M Trader** | Medium-class freighters | Local intra-faction trade. |

### Row 7-10: Mining roles (ship-based, unit = "Ships")

| Row | Ship class | Resource |
|---|---|---|
| **L Mineral Miner** | Large mining ships | Solid resources (ore, silicon) |
| **M Mineral Miner** | Medium mining ships | Same, smaller scale |
| **L Gas Miner** | Large gas collectors | Liquid resources (methane, hydrogen, helium) |
| **M Gas Miner** | Medium gas collectors | Same, smaller scale |

## Observed defaults (from source)

DA's initial per-role quotas at gamestart (via [`md/deadairdynamicuniverse.xml:5457-5493`](https://github.com/mlog4/deadair_scripts)):

| Role | Fleet Size | Galaxy Quota | Sector Quota |
|---|---|---|---|
| Critical Sector Patrol (has-jobs) | Medium (2) | 14 Fleets | 2 Fleets |
| Critical Sector Patrol (no-jobs faction) | Medium (2) | 1 | 1 |
| Core Sector Patrol | Medium (2) | 20 Fleets | 1 Fleets |

The "no-jobs" pattern applies when a faction was flagged as SST-eligible but doesn't have suitable ship class definitions available — DA falls back to 1/1 to keep the row visible without spawning invalid ships. This is what you see for factions like Antigone Republic in the observed screenshot (Critical=1/1 because they don't have a "critical" sector by their initial classification).

## Real observed values from the sample save

**Antigone Republic (ANT):**

| Role | Fleet Size | Galaxy Q | Sector Q |
|---|---|---|---|
| Critical Sector Patrol | Medium | 1 | 1 |
| Core Sector Patrol | Medium | 20 | 1 |
| Border Sector Patrol | Medium | 20 | 2 |
| Contested Sector Patrol | Medium | 8 | 2 |
| L Trader | — | 20 Ships | 2 Ships |
| M Trader | — | 20 | 2 |
| L Mineral Miner | — | 4 | 2 |
| M Mineral Miner | — | 10 | 5 |
| L Gas Miner | — | 4 | 2 |
| M Gas Miner | — | 10 | 5 |

## Preset scope note

Per-faction quotas are **not** in [Configuration Presets](../../presets/) scope — they live in per-faction nested tables and are edited directly here. Switching between presets keeps all quota values unchanged.

## When to edit

- **Boost a struggling faction:** raise Galaxy Quota on Border/Contested Patrol for a faction losing frontier sectors. They'll queue more replacements.
- **Reduce CPU cost:** lower L/M Trader and Miner quotas across all factions if your save is heavy — economy still works but fewer ships in the pool.
- **Faction weakness on Xenon fronts:** raise Contested Sector Patrol Galaxy Quota to 15-20 for Argon/Terran/Split (whichever is currently border-adjacent to Xenon).
- **Reduce hyperactivity:** lower Sector Quota to 1 across the board for calmer sector density (fewer patrols crowding the same sector).

## Modded-faction rows

If a companion compat mod ([Apus](/x4-modding-wiki/mods/apus-compat/), [ETW](/x4-modding-wiki/mods/etw-compat/)) is installed, its modded faction gets its own entry here with the same 10 rows. Without a compat mod, a modded faction's row will show "No suitable ships available!" — DA can't identify the modded ship classes to spawn.

## Modifying via presets vs directly

Because these values are per-faction nested tables, the recommended workflow is:

1. Load the [preset](../../presets/) matching your intended aggression level (`Aggressive` boosts base multipliers, `Peaceful` cuts them).
2. Then hand-tune this menu for specific factions you want reinforced or reduced.
