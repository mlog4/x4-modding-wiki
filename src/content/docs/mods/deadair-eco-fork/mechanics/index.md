---
title: Mechanics overview
description: DA-Eco design philosophy — 3 core principles + high-level architecture map of what fires where in the mod's MD scripts and libraries.
sidebar:
  order: 1
---

DA-Eco is not a "small tweak" mod. It's a systemic rewrite of vanilla's station-creation pipeline plus a ~700-patch rebalance of every production ware. Understanding **why** each subsystem exists is easier once you know DeadAirRT's design philosophy.

## Three core principles

### 1. Fewer / larger / more interconnected stations

**Vanilla:** places many small stations, each with 1 production module per type. When one goes down, the whole chain stalls.

**DA-Eco:** raises `production=1→5` limits everywhere ([`libraries/parameters.xml`](../reference/library-changes/#parametersxml)) so a single station can host 5 identical Hull Parts modules. Fewer, denser, more resilient hubs.

**Result:** simulation runs on fewer bigger targets. CPU-friendlier, more visually impressive, less "12 half-working outposts" and more "one proper regional factory".

### 2. Symmetrical breathing of production chains

Every vanilla production ware gets normalized:

- `cycle=600` (10-minute production tick standardized across the board).
- `workforce boost` to `product=0.5, cycle=0.5` (50% more output + 50% faster cycle when fully staffed).
- **Every product** gets a `secondaryresource` slot with `product=0.1, cycle=0.25`.

That last one is the hook: any station can be **×2 boosted** by supplying it with the right secondary resource. And the secondary resources are DA's three custom wares → **[DA wares](./da-wares/)** become the economy's meta-currency.

### 3. Cargo-volume shortage matters more than production shortage

DeadAirRT observed a vanilla failure mode: **stations sit with empty cargo silos while production stalls waiting for inputs**. The silos are empty because storage capacity is undersized for the actual production/consumption volume.

DA fixes this by automatically resizing storage at station creation to match projected 12-hour production+consumption volume. See [Storage sizing](./storage-sizing/).

## Architecture map

Where the code lives and what fires when:

### At gamestart

- **`md/mlog_da_eco_init.xml`** — banner log line + DA-wares registration probe (checks `ware.da_adv_schematics` / `da_mil_schematics` / `da_laborunion_contracts` exist). Warns if not.
- **`md/setup_mod_daeco_v2.xml`** — sets `md.$DAEco=true` (companion flag for [DA-Scripts](/x4-modding-wiki/mods/deadair-scripts-fork/) to detect DA-Eco is loaded); `AdjustDiscountMap` overrides `PlayerRelationDiscounts.$DiscountMap` to **1%/10%/100%** at rep ≥5/10/15 (vanilla is milder — DA makes tier-3 rep radical); `ApplyNewChanges` enables Xenon in DA-Ship-Manager.

### On every new station creation

- **`md/finalisestations.xml`** (728 lines — the heart of the mod). Patches `God_DefaultFinaliseFactory` and `NewStation_GenerateFactory`. Fires 5 subsystems in sequence:
  - `DAIncreaseStartingStorage` — see [Storage sizing](./storage-sizing/)
  - `DAImproveStationLayouts` — see [Station improvements → Racial connectors](./station-improvements/#daimprovestationlayouts--racial-connectors)
  - `DAImproveHabitation` — see [Station improvements → Habitation](./station-improvements/#daimprovehabitation--largest-first-habitation)
  - `DAImproveSMDocks` — see [Station improvements → Docks](./station-improvements/#daimprovesmdocks--dock-coverage)
  - Defence rebalance — see [Station improvements → Defence](./station-improvements/#defence-module-rebalance)

### Post-hoc for non-factory stations

- **`mlog_DAEco_BoostNonFactoryStorage`** (`finalisestations.xml:563-727`). Critical addition — `God_DefaultFinaliseFactory` only fires for factory stations. Shipyards / wharves / equipdocks / trade stations bypass DA's original logic. This cue listens for `event_god_created_station isgamestartgodentry=true` and applies the same storage-floor table via `add_build_to_expand_station`.

### On faction economy tick

- **`md/factionlogic_economy.xml`** — patches vanilla `Request_Factory` and `Request_Production_Module`:
  - `OverflowWareThreshold 7200→14400` — factions tolerate ware overflow twice as long before reacting.
  - `Request_Factory ProductionLimit 1→5` — signature "bigger factories" patch.
  - `safepos radius 3km→21km` — stations get elbow room around each other.
  - `Request_Production_Module WantedProductions +1-2` — expansion adds 1-2 modules per tick instead of 1.
  - Hatikvah gets `CheckProductionCompatibility=true` flag.

### Continuous background

- **`md/factionlogic.xml`** — wraps vanilla `Ship_Construction_Manager` in `DAEco_SCM_Handler`. `IntervalChecker` runs every 70-90s, dispatches to:
  - **[Xenon Job Helper](./xenon-specifics/#xenon-ship-construction-manager)** for Xenon (custom SCM because Xenon lacks shiptrader control post).
  - **Vanilla Job Helper** for everyone else.

### Library patches (silent, apply at load)

- **`libraries/wares.xml`** (2084 lines) — ~700 vanilla ware replace-patches + 3 new DA wares. See [DA wares](./da-wares/).
- **`libraries/modules.xml`** — module production limits + workforce chances + 6 new DA-ware modules.
- **`libraries/god.xml`** (1395 lines — the biggest patch file). See [Library changes → god.xml](../reference/library-changes/#godxml).
- **`libraries/jobs.xml`** — trader/miner job adjustments, +3 Xenon jobs, +2 Antigone water traders.
- **`libraries/parameters.xml`** — workforce growth ×10, production limits, threat scoring.
- Plus baskets / modulegroups / constructionplans / loadoutrules / defaults / mapdefaults.

## Xenon exception rule

DA acknowledges Xenon are fundamentally different (no workforce, no DA-wares consumption, no habitation) and **skips them** in most subsystems:

- `DAIncreaseStartingStorage` — skipped (Xenon staged construction).
- `DAImproveStationLayouts` — skipped (no `struct_xen_*` racial connectors exist).
- Defence rebalance — skipped.
- `constructionbias=10.0` (horizontal growth pref) — skipped for Xenon.

Instead Xenon get their **own** systems: custom Ship Construction Manager + 3 dedicated jobs. See [Xenon specifics](./xenon-specifics/).

## Circular economic dependency (design intent)

The DA-wares mechanic + the workforce boost pattern create a **circular** economy:

1. Vanilla ware production is boosted by consuming a DA-schematic secondary.
2. DA-schematic production requires vanilla wares (claytronics / computronic substrate / silicon carbide).
3. DA-schematic production has the highest workforce impact of any recipe → requires habitation.
4. Habitation requires food and medical → back to vanilla production chains.

**Result:** every part of the economy needs every other part. Player can't just build "one super-station" and ignore the rest of the galaxy — DA-wares production drags in everything else.

vs vanilla's laisser-faire (many small independent producers), DA is **closed-loop and stateful**.

## Related pages

- [DA custom wares](./da-wares/) — the three schematic/contract wares in detail
- [Storage sizing](./storage-sizing/) — how the DYN formula computes per-station storage
- [Station improvements](./station-improvements/) — connectors, habitation, docks, defence
- [Xenon specifics](./xenon-specifics/) — why Xenon runs on separate rules
- [Library changes](../reference/library-changes/) — file-by-file patch summary
