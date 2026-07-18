---
title: Storage sizing (DYN formula)
description: How DA-Eco auto-sizes station storage at creation time. DAIncreaseStartingStorage subsystem — DYN per-class weighted formula + station-type absolute floors + L-ONLY preference. Plus post-hoc BoostNonFactoryStorage for shipyards/wharves/tradestations.
sidebar:
  order: 3
---

Vanilla X4 stations frequently sit with empty cargo silos while production stalls waiting for inputs. Root cause: **storage capacity is undersized relative to production/consumption volume**. DA-Eco fixes this by computing per-station storage automatically at creation time.

The logic lives in **[`md/finalisestations.xml`](https://github.com/mlog4/deadair_eco)** across three cues:

- **`DAIncreaseStartingStorage`** (lines 77-379) — for factory stations
- **Station-type absolute m³ floor** (lines 193-231) — hard minimums per station type
- **`mlog_DAEco_BoostNonFactoryStorage`** (lines 563-727) — post-hoc for non-factory stations

## The DYN formula (per-class weighted)

For factory stations, DA computes storage need per class (container / liquid / solid) based on actual production and consumption volumes over a **12-hour window**.

### Step 1 — enumerate module products

For each production module in the station plan, read:
- `products.list` — what wares this module produces
- `resources.table` — what wares it consumes per cycle

### Step 2 — sum production volume per class

For each product, look up `ware.transport` (`container` / `liquid` / `solid`) and `ware.volume`. Sum `amount × volume` per class over all production modules.

### Step 3 — weighted consumption volume per class

For each input ware, look up its class and volume. Weight the total consumption by `amount × volume` and distribute across C/L/S proportional to actual input mix.

### Step 4 — multiply by 12h

Final per-class need: `(productionVolume + consumptionVolume) × 12 hours` in m³.

**Rationale for 12h:** long enough to absorb NPC-trader delays and cyclical demand spikes, short enough not to over-allocate.

## Station-type absolute floors

For non-factory stations, DA has hardcoded m³ floors that override the DYN computation:

| Station type | Container | Liquid | Solid |
|---|---:|---:|---:|
| **Shipyard** | 10,000,000 | 0 | 0 |
| **Wharf** | 5,000,000 | 0 | 0 |
| **Equipment Dock** | 5,000,000 | 0 | 0 |
| **Trade Station** | 2,000,000 | 2,000,000 | 2,000,000 |
| **Factory** | (DYN formula) | (DYN) | (DYN) |

### Trade Station detection fallback

A station is classified as Trade Station when it has:
- No production modules AND
- No build modules AND
- Has a pier module

Wharves and shipyards are detected by their macro classification (they have build modules).

## Precedence rule

When both a type-floor and a DYN result exist:

**type-floor > DYN 12h > legacy DA AUDIT formula**

The legacy AUDIT formula (`desired = if mixed then prodVol×12 + consVol×2×0.33 else prodVol×12 + consVol×2`) survives as fallback for edge cases where DYN can't compute (missing ware metadata, etc.).

## L-ONLY preference

Once desired capacity per class is known, DA picks storage modules to satisfy it. The rule: **use the single largest storage module for that class, then `ceil(wanted / capacity)` of them**.

**Example:** Terran Factory needs 15M m³ container storage. Largest available Terran container storage module has 3M m³ capacity → build `ceil(15M / 3M) = 5` of that module.

DA-legacy did redundant re-add of storage across sizes (add small, then add medium, then add large). L-ONLY is cleaner and produces more visually consistent stations.

## Xenon skipped

`DAIncreaseStartingStorage` is **skipped for Xenon** because:
1. Xenon use staged construction (Xenon stations grow module-by-module without a pre-computed plan).
2. Xenon lack workforce, so the 12h consumption estimate doesn't apply — Xenon consumption is autonomous.
3. Xenon-specific stations (shipyards, wharves) use custom Xenon module macros — DA doesn't have per-Xenon-station-type floors.

## Post-hoc: mlog_DAEco_BoostNonFactoryStorage

Critical addition in the mlog4 fork ([`finalisestations.xml:563-727`](https://github.com/mlog4/deadair_eco)):

### Why it exists

`God_DefaultFinaliseFactory` (the vanilla hook DA patches) fires **only for factory stations**. Shipyards, wharves, equipment docks, and trade stations go through **pre-built templates** and bypass DA's original storage logic.

Pre-mlog6, this meant shipyards/wharves/etc. shipped with vanilla-default storage sizes — often 10× too small for their actual throughput.

### How it fixes

The cue listens for `event_god_created_station` with `isgamestartgodentry=true`. When it fires:

1. Detect the station type (shipyard / wharf / equipdock / tradestation).
2. Look up the type-floor from the same table.
3. Compute delta between current capacity and target.
4. Call `add_build_to_expand_station` to add the necessary storage modules to the plan.

### TER/PIO/VIG trade station edge case

The critical bug this fixes: **Terran / Pioneers / Vigor trade stations use a narrow moduleset that excludes L-storage**, even though those factions own L-storage modules in other module sets.

Vanilla `get_module_definition` filters by `set=$ModuleSet` — so DA's logic couldn't find L-storage for Terran trade stations even though it exists faction-wide.

mlog4 fix: **drop the `set=$ModuleSet` filter** in `BoostNonFactoryStorage`. Take all faction-owned storage modules regardless of module set. Terran trade stations now get proper L-storage assignment.

## Observed effect on a real save

Compare a fresh save with vs without DA-Eco:

| Station type | Vanilla storage | DA-Eco storage |
|---|---:|---:|
| Terran shipyard | ~2M m³ container | 10M m³ container |
| Argon wharf | ~1M m³ container | 5M m³ container |
| Paranid Equipment Dock | ~1.5M m³ container | 5M m³ container |
| Argon Trade Station | ~500k / 500k / 500k C/L/S | 2M / 2M / 2M |
| Terran generic factory | undersized 40-60% | matches 12h production+consumption exactly |

## `constructionbias=10.0` — horizontal growth

Separate from storage sizing but adjacent: `finalisestations.xml` sets `set_build_plot allowreduction=false` and passes `constructionbias=10.0` to `create_construction_sequence`. This heavily biases new stations toward **horizontal** module placement over vertical.

Rationale: DA wants stations that look like real industrial complexes (wide footprint, many connected modules) rather than vertical towers.

**Skipped for Xenon** — no racial structural connectors exist for Xenon, so horizontal bias would fail to find valid module placements.

## Related pages

- [Station improvements](./station-improvements/) — connector selection + habitation + docks (fire alongside storage in the same station-creation pipeline)
- [Xenon specifics](./xenon-specifics/) — why storage sizing is skipped for Xenon
- [mlog6 fork fixes](../reference/mlog6-fork-fixes/) — the XPath restoration that made DAIncreaseStartingStorage actually fire again
