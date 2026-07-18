---
title: Xenon specifics
description: Why Xenon are handled separately in DA-Eco. Custom Xenon Ship Construction Manager (vanilla failed on Xenon due to missing shiptrader control post), 3 dedicated Xenon jobs, exemption from most improvement subsystems.
sidebar:
  order: 5
---

DA-Eco makes a deliberate design choice: **Xenon are fundamentally different from other factions**, so most DA improvements skip them. In exchange, Xenon get **their own dedicated systems**.

## Why Xenon are different

Three engine-level facts about Xenon:

1. **No workforce.** Xenon habitation modules don't exist. All DA-Eco improvements that boost production via workforce (`product=0.5, cycle=0.5`) don't apply to Xenon.
2. **No DA-ware consumption.** DA schematics require workforce → Xenon can't produce them → not part of their supply chain.
3. **No racial structural connectors.** `struct_xen_*` macros don't exist in the vanilla asset set, so [DAImproveStationLayouts](./station-improvements/#daimprovestationlayouts--racial-connectors) has nothing to place.

If DA applied its normal improvements to Xenon stations, most of them would silently fail or produce broken layouts. The clean solution: **skip Xenon** in the general subsystems and give them dedicated Xenon-only logic.

## What Xenon skip

DA-Eco's exemption list:

| Subsystem | Xenon action |
|---|---|
| [DAIncreaseStartingStorage](./storage-sizing/) | Skipped — Xenon use staged construction (module-by-module growth) |
| [DAImproveStationLayouts](./station-improvements/#daimprovestationlayouts--racial-connectors) | Skipped — no `struct_xen_*` connectors exist |
| [Defence module rebalance](./station-improvements/#defence-module-rebalance) | Skipped — Xenon defence works via spawned fleets, not station modules |
| `constructionbias=10.0` | Skipped — horizontal-growth bias would fail with Xenon's limited connector set |

## What Xenon get instead

### Xenon Ship Construction Manager

Custom Ship Construction Manager (SCM) implemented in [`md/xenon_job_helper_da.xml`](https://github.com/mlog4/deadair_eco) (176 lines).

#### Why vanilla failed

Vanilla's Ship Construction Manager expects the shipyard to have a **`controlpost.shiptrader`** entity — the NPC ship-trader who handles orders. Xenon factions have no shiptrader control post because Xenon aren't shopping — they build for themselves.

Result: vanilla SCM refused to place build orders at Xenon shipyards, so Xenon-owned shipyards produced nothing.

#### Custom SCM approach

The DA Xenon SCM:

1. `find_waiting_subordinate/job_ship` for jobs marked as needing ship construction. Capped at 20 outstanding orders.
2. `find_station canbuildships=true canbuildfor=$Faction hascontrolentity=controlpost.shiptrader` — but for Xenon this returns 0 stations, so drop to:
3. `find_station canbuildships=true canbuildfor=$Faction` — Xenon shipyard directly.
4. For each ship: pick the closest shipyard by `gatedistance`, verify the ship class is in `BuildableShipWares`, check dock size, call `add_build_to_construct_ship`.

Result: Xenon shipyards actually build Xenon fleets. Without this, DA-Eco stations sit idle waiting for orders that never come.

#### Dispatch mechanism

`md/factionlogic.xml` wraps vanilla `Ship_Construction_Manager` in `DAEco_SCM_Handler`. `IntervalChecker` runs every 70-90 seconds:

- For Xenon → signal `DAEco Xenon Job Helper`.
- For everyone else → signal vanilla Job Helper.

The Xenon flag is set in `setup_mod_daeco_v2.xml:101` at gamestart.

### 3 dedicated Xenon jobs

Added in [`libraries/jobs.xml`](../reference/library-changes/#jobsxml):

| Job id | Ship class | Galaxy count | Purpose |
|---|---|---:|---|
| `xenon_free_miner_m_ore_da` | M miner | 72 | Xenon ore mining |
| `xenon_free_miner_m_silicon_da` | M miner | 72 | Xenon silicon mining |
| `xenon_stationtrader_m_da` | M trader | 60 | Xenon inter-station trader |

Vanilla Xenon had no mining/trader jobs at all — they consumed resources by generation without moving them. DA-Eco fills this gap with dedicated Xenon economy ships.

## Xenon energy cells — separate recipe

From [`libraries/wares.xml`](../reference/library-changes/#waresxml-2084-lines):

> Adds a separate production method of energy cells for Xenon with values balanced for lack of workforce.

Vanilla's shared `energycells` recipe assumes workforce boost. Xenon can't take it, so their energy cell production suffers. DA adds a **Xenon-specific energy cell production path** with tuned amounts and costs that assume 0 workforce. Xenon energy cell production is slower per module but doesn't require habitation.

## Xenon storage sizing

Xenon are skipped in [DAIncreaseStartingStorage](./storage-sizing/), but Xenon stations do get storage — just via the vanilla path (staged construction adds storage modules as production ramps up).

**Consequence:** Xenon storage may be smaller than DA-boosted lawful stations. This is intentional — Xenon expand differently, and imposing 12h-projection storage on staged-construction stations would produce oddly sized initial builds.

## What Xenon SHARE with other factions

Not everything is Xenon-different. Xenon still benefit from:

- **[Bigger factories mechanic](./da-wares/#bigger-factories-mechanic)** — Xenon production modules can grow up to 5 per station (via `libraries/parameters.xml` production limits).
- **[Baskets](../reference/library-changes/#basketsxml)** — Xenon appear in some baskets and can trade with Xenon-owned trade stations (though this is rare — no Xenon trade stations in vanilla).
- **`libraries/loadoutrules.xml`** — Xenon ships get transport-drone weight adjustments same as everyone else.

## Debug / verification

To verify Xenon SCM is active:

1. Check `md.$DAEcoVarTable.$ShipManagerDA.{faction.xenon}` — should be `true` after gamestart.
2. Look for `[DAEco/XenSCM]` debug log lines in `script.log` when the interval fires (every 70-90s).
3. Observe Xenon shipyards actively producing ships in [DA Information Menus → Sector Details](/x4-modding-wiki/mods/deadair-scripts-fork/reports/sector-details-menu/) — if Xenon-owned shipyards show 0 ship production over time, the SCM dispatch has failed.

## Related pages

- [Mechanics overview](./) — where Xenon skipping fits in the overall architecture
- [Storage sizing](./storage-sizing/) — DYN formula that Xenon are exempt from
- [Station improvements](./station-improvements/) — the subsystems Xenon skip
- [Library changes → jobs.xml](../reference/library-changes/#jobsxml) — where the 3 Xenon jobs are defined
