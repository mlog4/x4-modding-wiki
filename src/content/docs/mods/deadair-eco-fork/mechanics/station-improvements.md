---
title: Station improvements
description: DA-Eco's per-station cosmetic + functional enhancements. Racial connectors (DAImproveStationLayouts), habitation ordering (DAImproveHabitation), dock coverage (DAImproveSMDocks), defence module rebalance from threat score.
sidebar:
  order: 4
---

Beyond storage sizing, DA-Eco applies four more subsystems at station creation. All live in [`md/finalisestations.xml`](https://github.com/mlog4/deadair_eco) and fire together during `God_DefaultFinaliseFactory` / `NewStation_GenerateFactory`.

## DAImproveStationLayouts — racial connectors

Lines 381-463. For station plans ≥10 modules, inserts racial structural connectors between production blocks. Adds visual variety — vanilla stations of all races end up looking similar because connectors are picked from a shared pool.

### Per-race connector selection

| Owner race | Base connector | Cross connector | Base weight | Cross weight |
|---|---|---|---:|---:|
| Argon | `struct_arg_base_02` | `struct_arg_cross_01` | 50% | 33% |
| Paranid | `struct_par_base_02` | `struct_par_cross_02` | 50% | 33% |
| **Teladi** | `struct_tel_base_02` | `struct_tel_cross_01` | **50%** | **100%** ← always add cross when connector fires |
| Split | `struct_spl_base_03` | `struct_spl_cross_01` | 25% | 40% |
| Terran | `struct_ter_base_03` | `struct_ter_cross_01` | 20% | 33% |
| Boron | `struct_bor_base_04` | `struct_bor_cross_01` | 20% | 33% |

**Xenon are skipped** — `struct_xen_*` connectors don't exist in the vanilla asset set.

### Effect

Argon stations get lots of `struct_arg_base_02` cross-braces between production modules. Terran stations get sparser but taller Terran-specific connectors. Teladi's 100% cross-weight makes their stations distinctively cross-braced.

## DAImproveHabitation — largest-first habitation

Lines 465-496. Sorts habitation modules by `workforce.capacity` **descending** — largest first.

### Vanilla behavior

Round-robin habitation placement: for each habitation slot in the station plan, cycle through habitation module macros in registration order. Result: many small habitation modules spread across the station.

### DA behavior

Take the biggest habitation module and place as many as needed to hit workforce target. Result: **1-2 large habitation modules** instead of 5-6 small ones.

### Why it matters

- **Fewer separate modules** → less pathing overhead for NPCs moving between hab and workstation.
- **Compact housing** → makes station layouts more legible on the map.
- **Aligns with DA-ware production workforce demand** — DA-ware modules have the highest workforce impact in the game (see [DA wares](./da-wares/)). Large habitation is a prerequisite.

## DAImproveSMDocks — dock coverage

Lines 497-556. Same DESC-sort principle as habitation but for **S/M docks**.

### Algorithm

Sort dock modules by `numdocks.{tag.dock_m}` and `numdocks.{tag.dock_s}` descending. For each dock size (M then S), pick the largest module that provides that dock type, add `ceil(target / capacity)` copies.

**Tie handling:** if a module provides both M and S docks, both counters decrement together when that module is added.

### Effect

Trade stations get 2-3 large dock modules with mixed M+S capacity instead of vanilla's 5-6 separate small dock modules. Bigger visual footprint, more docks per module.

### Pier ceiling

Related setting: [`libraries/parameters.xml`](../reference/library-changes/#parametersxml) sets:
- `CapitalTradeRatio 0.55→0.65` — 65% of the trade station's dock capacity is XL/L pier vs S/M dock (was 55%).
- **Pier ceiling 12** — no station can have more than 12 pier modules (vanilla was unbounded and could produce absurd 30-pier stations).

## Defence module rebalance

Lines 53-75. Recomputes defence-module count based on **threat score** of the strongest opposing faction in the nearby cluster.

### Vanilla behavior

Fixed defence module count per station type (typically 3-4 defence modules).

### DA behavior

1. Query `$DAhighestscore` — the highest threat score among opposing (non-friendly) factions with military presence within N clusters.
2. Compute defence-module count in the range **5-6** (up from 3-4) based on `Def_StationScore = highest_opposing_threat ±15%`.
3. Xenon-adjacent sectors get more defence modules than Argon-core sectors.

### Effect

Frontier stations (Xenon border, contested clusters) get 6 defence modules — visibly bristling with turrets. Deep-territory stations still get 5 (still more than vanilla).

**Xenon skipped** — Xenon defence works differently (they don't build defence modules; they just spawn defense fleets).

## Where all this fires

All four subsystems + storage sizing fire in the same event chain:

```
event_god_created_station
  └─ God_DefaultFinaliseFactory (vanilla)
     └─ DA patch: run DA subsystems
        ├─ DAIncreaseStartingStorage (storage-sizing)
        ├─ DAImproveStationLayouts (racial connectors)
        ├─ DAImproveHabitation (largest-first)
        ├─ DAImproveSMDocks (largest-first)
        └─ Defence rebalance (threat-score based)
```

For non-factory stations (shipyards / wharves / equipdocks / tradestations) that bypass `God_DefaultFinaliseFactory`, only **`mlog_DAEco_BoostNonFactoryStorage`** applies retroactively. Habitation and connector improvements don't apply because those station types have fixed pre-built templates from vanilla.

## Bigger factories — the module quota unlock

Not part of `finalisestations.xml` but conceptually adjacent. In [`libraries/parameters.xml`](../reference/library-changes/#parametersxml):

- `production=1→25` (limits) — a station can host 25 identical production modules per type.
- In practice capped at 5 by [`libraries/modules.xml`](../reference/library-changes/#modulesxml) `maxlimits`.

Plus `factionlogic_economy.xml` `Request_Factory ProductionLimit 1→5` — when a faction requests a new factory, it can immediately plan 5 modules per type instead of 1.

**Combined result:** a mature Argon Hull Parts factory has **5 Hull Parts production modules on one station** (vanilla had 1 per station, so needed 5 stations for the same output).

## Related pages

- [Storage sizing](./storage-sizing/) — the primary subsystem in the same event chain
- [DA wares](./da-wares/) — DA-ware modules benefit most from the habitation and workforce mechanic
- [Xenon specifics](./xenon-specifics/) — most improvements skip Xenon; Xenon get separate systems
