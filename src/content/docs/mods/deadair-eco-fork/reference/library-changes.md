---
title: Library changes
description: File-by-file summary of what DA-Eco patches in each vanilla library. wares.xml (2084 lines, ~700 patches), modules.xml, god.xml (1395 lines), jobs.xml, parameters.xml, baskets.xml, plus supporting files.
sidebar:
  order: 1
---

DA-Eco is primarily a **library-patch mod**. Every vanilla-XML file that ships in `libraries/` gets patched. This page is a per-file summary of what changes; for gameplay-level explanation of these changes see the [Mechanics](../mechanics/) pages.

## wares.xml (2084 lines)

The largest patch file. Contains **~700 replace-patches** on vanilla wares plus **3 new DA wares** at lines 1887-2083.

### Vanilla ware rebalance pattern

Every production ware gets normalized. Standard patch template:

1. **`cycle=600s`** — 10-minute production cycle across all wares (was 60-1200s inconsistently).
2. **Amount ×2, resources ×2** — doubled output + doubled input, preserving ratios.
3. **Workforce effect: `product 0.34→0.5, +cycle=0.5`** — 50% more output + 50% faster cycle with full workforce.
4. **New effect: `type=secondaryresource product=0.1 cycle=0.25`** — 10% more output + 25% faster cycle with secondary resource stocked.
5. **New `<secondary>` block** attaching one of the 3 DA wares as secondary resource.

### Price amplitude expansion

Example — Advanced Composites:
- vanilla `min=432 avg=540 max=648` (1.5× spread)
- DA `min=516 avg=688 max=1168` (2.3× spread)

Wider amplitude = stronger route-profitability signal for NPC traders.

### Recipe simplification: hullparts removal from station construction

**Removed** `hullparts` from ship construction resources for several vanilla station-build modules. Replaced with more `claytronics` + `energycells`.

**Why:** hullparts shortage was a common vanilla failure mode — when Hull Parts production ran out, ALL station construction (of every faction) blocked. Removing hullparts from station-build recipes decouples this dependency.

### 3 DA wares (lines 1887-2083)

- `da_adv_schematics` — 100 m³, price 210/280/540
- `da_mil_schematics` — 50 m³, price 90/120/250
- `da_laborunion_contracts` — 25 m³, price 38/50/115

Each with 2 production modules (`_01` claytronics+energycells recipe, `_02` Terran computronic+silcarbide recipe). All rated `cycle=0.5, product=5.0` for extreme workforce boost.

See [DA wares](../mechanics/da-wares/) for full detail.

### Xenon-specific energy cell recipe

New `energycells` production method with Xenon-tuned values (no workforce assumption). Xenon shipyards get a functional energy cell chain even without habitation. See [Xenon specifics → Xenon energy cells](../mechanics/xenon-specifics/#xenon-energy-cells--separate-recipe).

## modules.xml (441 lines)

Module-level patches.

### Production limits

For **all** vanilla `prod_gen_*`, `prod_arg_*`, `prod_par_*`, `prod_tel_*`, `prod_spl_*`, `prod_ter_*`, `prod_bor_*`:
- `<limits production="1→25">` — soft cap per station raised from 1 to 25
- `<maxlimits production="3→25">` — hard cap raised from 3 to 25

In practice the [`factionlogic_economy.xml`](#factionlogic_economyxml) `ProductionLimit=5` value caps this at 5 per station.

### Workforce chance

`production chance` on any gen-module raised to **100%** (was 15-65%). Every attempted gen-module generation succeeds.

### Cross-recipe removal

Vanilla modules could produce multiple wares (e.g. `prod_gen_antimattercells` also produced trace energy/graphene/coolant as side-products). DA removes these cross-recipes — each module produces exactly one primary ware.

**Rationale:** cleaner economic accounting, easier to model per-module supply/demand.

### 6 new DA-ware modules

Per DA ware, 2 module variants (`_01` and `_02` Terran). All defined here with production/consumption tables. Placeholder assets — reuse vanilla generic-production module models visually.

## god.xml (1395 lines — biggest patch file)

Station generation & placement rules.

### Global module limits

`stations/defaults modules production=5→25` (was 3-5), `storage=15`, `coreboundaryzoneheight=30000`.

### "_new" router pattern

For each production chain (energycells, hullparts, claytronics, etc.), DA adds `_new` route-entries: `arg_energycells_new`, `tel_hullparts_new`, etc. These override vanilla's product-entries by:

- Switching `filter="economy"` → `filter="security"` (route to secure sectors first).
- Restricting `faction=argon` (vs vanilla `faction=[argon, hatikvah]` — Hatikvah gets its own routes rather than doubling up in Argon's).

DLC factions (Boron, Terran, Split) get their own `_new` blocks parallel to the base races.

### Removed unnecessary Argon+Paranid presence in Split DLC

Argon and Paranid stations are removed from Split DLC sectors — they were "wasting resources and CPU cycles" per DeadAirRT.

### Hatikvah extracted from Argon-shared locations

Hatikvah stations no longer share `arg_*_new` route entries. They get their own `hatikvah_*` entries so their modules don't fight Argon for slots.

### 16 god-quota patches (mlog6 restored)

7 major quota-scaling patches for food/graphene/hullparts/refinedmetals/claytronics/silicon/microlattice were dead through 8.x/9.x. Restored in mlog6 — see [mlog6 fork fixes](./mlog6-fork-fixes/).

## jobs.xml (194 lines)

Trader / miner / patrol job definitions.

### Trader galaxy caps

- `stationtrader_m maxgalaxy 10→24` (2.4× more medium station-traders)
- `stationtrader_l maxgalaxy 3→12` (4× more large station-traders)

Cargo flow becomes non-bottleneck.

### Basket rebranding

- `bio` basket split into `bio_argon` / `bio_paranid` / `bio_teladi` / `da_bio_split` / `da_bio_boron` — traders don't ship food across the whole galaxy anymore.
- `food` basket split into `foodrations` / `sojahusk` / `nostropoil` / `bofu` / `terranmre` / `da_food_split`.

### Traderoutine switch

Trade ships switch from `distributewares` aiscript to `traderoutine`. Effect: NPC traders now respond to **demand-side** imbalances (someone needs it), not just **supply-side** (someone has it). Vanilla frequently had "trader knows I have 1000 units to sell but nobody buying" scenarios. DA-Eco fixes this.

### +2 Antigone water traders

Vanilla had no Antigone water traders — chronic water shortage in Antigone Republic sectors. DA adds L and M water traders.

### +3 Xenon jobs

- `xenon_free_miner_m_ore_da` — 72 galaxy
- `xenon_free_miner_m_silicon_da` — 72 galaxy
- `xenon_stationtrader_m_da` — 60 galaxy

See [Xenon specifics](../mechanics/xenon-specifics/#3-dedicated-xenon-jobs).

### masstraffic_paranid_criminal + alliance

Adds Alliance of the Word to paranid criminal masstraffic — small mod update.

### construction_vessel_xl playeronly=true removed

NPC constructors of DLC factions can now work on player-owned build projects. Vanilla restricted them to player-only.

## parameters.xml

Global engine-level settings.

### Build pricing

- `prices/build min 0.25→0.33` — build materials cost floor raised.
- `shipsalefactor 0.7` — used-ship price factor.

### Ware pricing window

- `resource min 3600→7200` — ware price recalculation window doubled. Prices move more smoothly instead of jumping every hour.

### Production intermediates reporting

- `productioncheck reportintermediates false→true` — economy reports intermediate-ware shortages, not just final-ware. Improves DA-Fill and vanilla trader targeting.

### Workforce growth

- `capacity limit 1000→10000` (×10 max habitation capacity)
- `population step 100000, min 500, max 2000` — population grows ×10 faster than vanilla

Makes DA's `product=5.0` for DA-ware modules actually reachable.

### Exclusion zones

- `ship_l 1100 / ship_xl 2000` — larger ships get more spatial exclusion around stations.

## defaults.xml

Ship/station threat scoring.

- XL trade/mine threat 14→10 (traders/miners de-rated as threats).
- Station default threat 20.
- Defence-purpose ships/modules 3→18 threat.
- `station/build plotsize=10000` (vanilla ~7000).

Threat scoring feeds into DA's [defence module rebalance](../mechanics/station-improvements/#defence-module-rebalance) — higher threat scores mean more defence modules.

## baskets.xml (292 lines)

Ware baskets NPC traders route.

### Bio-basket expansion

3 DA wares added to bio baskets of all factions. Vanilla-food + DA-schematics travel together.

### construction_ships expanded

Now includes all ship-component wares — construction ships carry more variety.

### construction_stations recipe swap

**Removed**: plasmaconductors, advancedcomposites, claytronics.
**Added**: energycells.

Rationale: same hullparts-shortage decoupling as [wares.xml](#waresxml-2084-lines).

### equipment basket

- Added: `computronicsubstrate` → `advancedcomposites` and `metallicmicrolattice` → `engineparts`.
- Removed: claytronics.

## modulegroups.xml (63 lines)

Reorganizes module groups (which modules can co-exist in a station design).

- Pier groups: removes `pier_*_harbor_01` from base groups. Moves `_03` / `_04` variants to add-groups. Effect: "base is minimal, expansions can be larger".
- Registers 6 module groups for DA-ware modules (`_01` and `_02` variants of each of the 3 DA wares).

## constructionplans.xml (16 lines)

Individual station construction plan overrides.

- Argon `dockarea_arg_m_station_01→02` — upgrades trading stations from 1M6S dock to 3M6S dock (more dock capacity per module).
- Buccaneer `storage_l/m` similar upgrade.
- 4 par_tradestation lowtech patches removed in mlog004→005 (dead XPath — vanilla 8.x restructured the plan, patches no longer matched).

## loadoutrules.xml (25 lines)

Ship loadout weighting.

- **Transport drone weight 60** for L/XL trade ships — L-traders get full complement of transport drones.
- Deployables (laser/mine/satellite/navbeacon) weights 5-10 — NPCs don't hoard useless deployables.
- Buildmodule build-weight **100**, transport-weight 5.

## region_definitions.xml

- Increased resource yields for factions' economic-vital sectors.
- (Regionyields patches were removed in mlog6 — vanilla 8.x rewrote the yield system entirely.)

## mapdefaults.xml

- All sectors set `economy=1.0` — normalizes the hidden vanilla `sector.economy` multiplier that skewed station-size generation.

## ships.xml

- Crew composition adjustments per ship class.

## people.xml

- NPC crew fill percentages: Regular 50%+, Veteran 75%+, Elite 90%+ of ship capacity. Higher-importance ships get better crews.

## icons.xml

- Icon registrations for DA-ware wares in the UI.

## Related pages

- [Mechanics overview](../mechanics/) — the gameplay effect of these library changes
- [DA wares](../mechanics/da-wares/) — deep dive on the 3 new wares and their secondary-resource mechanic
- [Xenon specifics](../mechanics/xenon-specifics/) — Xenon-only patches
- [mlog6 fork fixes](./mlog6-fork-fixes/) — XPath fixes restored in the mlog4 fork
