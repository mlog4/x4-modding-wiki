---
title: DA Evolution
description: Xenon adaptive equipment upgrades and shipyard expansion. 10 levels × 6 equipment categories driven by player military strength vs Xenon losses.
---

The Xenon evolution engine. Xenon adaptively upgrade their ships across 10 levels × 6 equipment categories (engines, ship mods, shields, weapons, missiles, eco). At certain levels the Xenon also expand their production capacity through shipyard extensions.

## Mechanic

Every `EvoMain_Interval` minutes DA evaluates player military strength and Xenon losses. Losses accrue "evo points". When accumulated points cross a level threshold, Xenon unlock the next tier of equipment mods across all six categories. Newly-built Xenon ships from that point forward receive the new mods automatically via `apply_equipment_mods`.

At levels **1, 3, and 5** the Xenon get additional wharf/shipyard modules for storage / defence / solar / build / miner. Which slots grow depends on the `Evo_*Rate` sliders.

**Note on XP:** Xenon evolution points accrue on **kills only**, not damage. Ship-mode damage without a kill = no XP. See [Kill-based Xenon Evolution XP](../../mechanics/#kill-based-xenon-evolution-xp).

> **📷 Screenshot needed:** DA Evolution submenu (main toggles + level cap).
> _File: `menu-evolution.jpg`_

> **📷 Screenshot needed:** DA Evolution → Job Rate sliders (Storage / Defence / Solar / Build / Miner).
> _File: `menu-evolution-rates.jpg`_

## Main toggles

| Setting | Default | Effect |
|---|---|---|
| `EvoMain_Enable` | `true` | Master toggle. |
| `EvoMain_Interval` | `240` (min = 4h game time) | How often DA re-evaluates the Xenon level. Lower = faster escalation. |
| `EvoMain_PlayerMaxLevel` | `10` | Hard cap on Xenon evolution level (1-10). Lower for a milder endgame. |
| `EvoMain_EnableJobs` | `true` | Allow the Xenon **job pool size** to grow with level. Off = level up equipment but not fleet size. |
| `EvoMain_MaxXenonJobs` | `10` | Multiplier for the Xenon galaxy quota. Each Xenon level adds this many to the pool. |
| `EvoMain_EnableUpgradeStations` | `true` | Allow Xenon shipyards to expand modules at levels 1/3/5. Off = fixed shipyard size. |
| `EvoMain_EnableFastOrder` | `true` | Fast-track new Xenon ships from shipyard queue (skip normal build backlog if already-tier-appropriate). |
| `EvoMain_DetailedDebug` | `false` | Verbose `[EVOLUTION]` log lines. |

## Job rate multipliers (`Evo_*Rate`)

Controls which shipyard modules the Xenon build during level-1/3/5 expansions. These are weight ratios — the higher a rate, the more of that module category the Xenon add.

| Setting | Default | Effect |
|---|---|---|
| `Evo_StorageRate` | `1` | Storage modules (holds unfinished ship parts). |
| `Evo_DefenceRate` | `1` | Defence modules (turret platforms on the shipyard). |
| `Evo_SolarRate` | `2` | Solar panels (energy production for the yard). |
| `Evo_BuildRate` | `1` | Build modules (ships-under-construction slots). |
| `Evo_MinerRate` | `2` | Miner-support facilities. |

## Gameplay effect at recommended defaults

At 10 game-hours a fresh save typically sits at Evolution level 1-2. By 50h you'll see level 4-6 Xenon ships in border sectors — noticeably harder hulls, better weapon range, more armour piercing. By endgame (200h+) level 8-10 Xenon fields significantly tougher hulls than vanilla, and their shipyards produce ships 30-50% faster due to accumulated build/solar expansions.

## Turn off if

You want vanilla Xenon difficulty curve. Set `EvoMain_Enable = false`.
