---
title: DA Evolution
description: Xenon adaptive equipment upgrades + shipyard/wharf module growth per level + Xenon Fleet jobs. Includes live level status and Fleet Size selector.
sidebar:
  order: 4
---

The Xenon evolution engine. Xenon adaptively upgrade their ships across 10 levels of equipment mods (engines, ship mods, shields, weapons, missiles, eco). Every level unlock spawns extra shipyard/wharf modules — the growth rates below control which module types grow how fast. A separate **Xenon Fleets** job pool spawns dedicated attack fleets at configurable size, tracked live in the same menu.

## In-game view

![DA Evolution — Options section on top + Mlog Xenon Growth Rates section below](/x4-modding-wiki/img/mods/deadair-scripts/menu-evolution.jpg)

Layout:

- **`DA Evolution Options`** — 11 fields covering master toggles, interval, level cap, Fleet Size selector, and live status displays.
- **`Mlog: Xenon Growth Rates (per Evolution level, per xen shipyard/wharf)`** — 5 growth-rate sliders that determine what modules the Xenon add to their shipyards/wharfs each level.

## Mechanic

Level advancement is **pure wall-clock time**, gated only on Xenon shipyard existence. Every `Evolution Interval` minutes, if the Xenon still have at least one operational shipyard or wharf and the current level is below the cap, the level increments by 1. Kills, damage dealt to Xenon fleets, and player military strength are **not** part of the level equation — see [Xenon Evolution is time-based, not combat-based](../../mechanics/#xenon-evolution-is-time-based-not-combat-based) for the verified source snippet.

Each level-up triggers three consequences:

1. **Equipment mods unlock** — newly built Xenon ships from that point forward receive the next tier of mods across all six categories (engine / ship / shield / weapon / missile / eco), one ware id per tier per category.
2. **Shipyard/wharf modules spawn** — the `Xenon Growth Rates` fire on every operational yard, adding N storage / defence / solar / build / miner-related modules per level per yard.
3. **Xenon Fleet pool grows** — if `Enable Evolution Xenon Fleets` is on, up to `Maximum Xenon Fleets Added` extra attack fleets can spawn at the configured Fleet Size.

The menu doubles as a **live status display** — you can see the current level, the pending build queue, and how many fleets are already active without leaving the options screen.

**Practical implication:** to slow evolution, destroy Xenon shipyards/wharfs (freezes the ticker until they rebuild one). To stop it, set `Enable Evolution` to `Disabled`. Grinding kills against Xenon fleets does not slow the level counter.

## DA Evolution Options

### Master toggles

| Setting | Default | Effect |
|---|---|---|
| **Enable Evolution** | `Enabled` | Master toggle for the whole system. |
| **Enable Evolution Xenon Fleets** | `Enabled` | Allow the Xenon Fleet job pool to grow with level. Off = level up equipment/modules but not fleet size. |
| **Evolution Interval** | `240 min` | How often DA re-evaluates the Xenon level. Lower = faster escalation. |

### Level cap and Fleet cap

| Setting | Default | Effect |
|---|---|---|
| **Evolution Max Level Setting** | `10` | Hard cap on Xenon evolution level (1-10). Lower for a milder endgame. |
| **Evolution Current Level / Max Level** | *(live)* | **Read-only display** — shows current achieved level and the cap. In the screenshot: `Current: 10 / Max: 10`. |
| **Maximum Xenon Fleets Added** | `10 fleet(s)` | Cap on how many extra attack fleets DA can add through the evolution pool. Higher = larger endgame threat. |
| **Active / Building** | *(live)* | **Read-only display** — shows currently-active fleets vs those still under construction at shipyards. In the screenshot: `Active: 10 / Building: 0` (pool fully allocated and shipped). |

### Fleet Size selector

| Setting | Default | Effect |
|---|---|---|
| **Xenon Fleet Size** | Medium + Large | Three toggle buttons — **Small / Medium / Large** — controlling which fleet sizes are eligible to spawn. In the screenshot Small is disabled (red-ish) while Medium and Large are enabled (green). Enable Small for early-game harassment threats, keep only Large for boss-tier endgame. |

### Station evolution and ordering

| Setting | Default | Effect |
|---|---|---|
| **Enable Xenon Station Evolution** | `Enabled` | Allow Xenon shipyards/wharfs to expand their module count at level-up events. Off = fixed shipyard size. |
| **Enable Evolution Fast Fleet Ordering** | `Enabled` | Fast-track new Xenon ships from shipyard queue (skip normal build backlog if the equipment/tier already matches). |
| **Enable Evolution Debug** | `Disabled` | Verbose `[EVOLUTION]` log lines. |

## Mlog: Xenon Growth Rates

Per-level growth rates for what the Xenon add to their shipyards/wharfs at each level-up. **Units are important — different rows use different scaling.**

| Setting | Default | What grows | Cadence |
|---|---|---|---|
| **Storage modules per level** | `1` | Storage module count | Every level → +1 module |
| **Defence modules per level** | `1` | Defence turret module count | Every level → +1 module |
| **Solar panels per level** | `2` | Solar panel count (energy production) | Every level → +2 panels |
| **Build modules per 2 levels** | `1` | Ship-under-construction slots | **Every 2 levels** → +1 slot (slower growth than the rest) |
| **Miner subordinates per level** | `2` | **Subordinate mining ships**, not modules | Every level → +2 miners assigned to the yard |

**Miner distinction:** the last row spawns **ships**, not station modules — subordinate M-class miners bound to the yard for gas/mineral supply. All other rows are station modules.

## Total growth across all 10 levels (default rates)

At default rates, by the time Xenon reach level 10 each shipyard/wharf will have gained:

- **Storage modules:** +10
- **Defence modules:** +10
- **Solar panels:** +20
- **Build modules:** +5 (half rate)
- **Miner subordinates:** +20 (as ships, tied to the yard)

## Per-level Xenon ship mods — the deep detail

Every one of the 60 equipment mods (10 levels × 6 categories) applied to newly built Xenon ships is documented in a dedicated reference page: **[Xenon ship mods per Evolution level](./xenon-ship-mods/)**. Includes forward thrust, hull mass, hull HP, shield capacity, weapon damage, radar cloak, and travel charge deltas at every tier, straight from `libraries/equipmentmods.xml`.

## Gameplay effect at recommended defaults

- **10 game-hours:** Evolution level 1-2. Xenon ships slightly tougher than vanilla.
- **50h:** Level 4-6. Border-sector Xenon ships noticeably harder to kill; shipyards visibly grown.
- **200h+:** Level 8-10. Xenon shipyards 30-50% faster ship output (accumulated build+solar), fields of tier-8+ hulls in the border, additional 10-fleet Xenon Fleet pool actively harassing player claims.

## Turn off if

You want the vanilla Xenon difficulty curve. Set **Enable Evolution** to `Disabled`. All sub-toggles keep their values in case you want to re-enable later.

## Related

- [DA Jobs — Expeditions](../jobs/) — the Xenon Fleet pool interacts with the vanilla expedition system.
- [DA God](../god/) — station module additions from Evolution route through the God engine, so `God_MaxModuleSetting` still applies as an outer cap.
- [Xenon Evolution is time-based, not combat-based](../../mechanics/#xenon-evolution-is-time-based-not-combat-based) — verified level-up gate from the source.
