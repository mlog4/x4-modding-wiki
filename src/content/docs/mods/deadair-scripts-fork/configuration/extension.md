---
title: 'Mlog: Extension'
description: Dynamic faction expansion — factions build new trade stations, wharves, shipyards over time. 8 configurable options + 3 live active-builds tables + clear-all buttons. Author's own subsystem (not from DA original).
sidebar:
  order: 11
---

Dynamic faction expansion — factions autonomously build new trade stations, wharves, and shipyards over the course of a save. Introduced Phase 1 (mlog036) as a fork-original subsystem replacing DA's static-map assumption.

Every ~30 min the observer walks each eligible faction, checks if they qualify for a new trade center / wharf / shipyard, verifies the `MinDist*` cluster distance rule, and queues one build if all checks pass. Concurrency is limited per faction (1 trade center + 1 wharf + 1 shipyard simultaneously).

## In-game view

![Mlog Extension menu — 3 build-target option sections + 3 live active-builds tables](/x4-modding-wiki/img/mods/deadair-scripts/menu-extension.jpg)

Layout (5 sections stacked):

- **Options header** — 2 fields: master + logging.
- **Trade stations** — 2 fields: Allow toggle + Min clusters slider.
- **Faction wharves and shipyards** — 2 fields.
- **Xenon wharves and shipyards** — 2 fields.
- **Active trade-center builds** table (serial per faction).
- **Active faction wharf/shipyard builds** table (with running tally in header `WH=N SY=N`).
- **Active xenon wharf/shipyard builds** table (with tally `N/4`).

## Options

### Master + logging

| Setting | Default | Effect |
|---|---|---|
| **Enable Extension functionality** | `Disabled` (default from source; user's save has ON) | Master toggle. When off, no expansion planning happens at all. `md.$mlog_da_extension_state.$Enable` in source. |
| **Detailed logging** | `Enabled` (mlog060 default flipped ON) | Emit `[EXT/*]` debug lines to `script.log`. Turn off if the log spam is a problem. `md.$mlog_da_extension_state.$EnableLog`. |

### Trade stations section

| Setting | Default | Effect |
|---|---|---|
| **Allow factions to build trade stations** | `Disabled` (source) / `Enabled` (observed) | Allow expansion of trade stations. Peaceful lawful factions primarily benefit. |
| **Min clusters between trade stations** | `2` | Minimum cluster-hop distance from the faction's existing trade station before a new one is allowed. `2` = at least 2 clusters away. `0` = same cluster OK. |

### Faction wharves and shipyards section

| Setting | Default | Effect |
|---|---|---|
| **Allow factions to build wharves/shipyards** | `Disabled` / `Enabled` | Allow expansion of wharves and shipyards. |
| **Min clusters between wharves/shipyards** | `5` (mlog058 revert — reason: previously reduced to 2, but real bug was decision logic picking shipyard instead of wharf when Terran SY was blocked; not a distance issue) | Higher than trade station distance because wharves/shipyards are heavier assets. |

### Xenon wharves and shipyards section

| Setting | Default | Effect |
|---|---|---|
| **Allow xenon to build additional wharves/shipyards** | `Disabled` / `Enabled` | Xenon expansion opt-in. Off = no new Xenon wharves/shipyards ever. |
| **Min clusters between xenon wharves/shipyards** | `2` | Lower than lawful factions — Xenon are aggressive expanders by design. |

## Active builds tables

Three parallel tables show what's currently being built. All three have a **"Clear all active <type> builds"** red action button at the bottom that flushes the corresponding tracking table (useful if a build gets stuck).

### Active trade-center builds (serial per faction)

| Column | Meaning |
|---|---|
| **Faction** | Which faction is building. |
| **Sector** | Where the trade center is being placed. |
| **Age** | How long ago the build was queued (in minutes). |

**Serial per faction:** each faction can have **at most 1** trade-center build in progress at a time (`$BuildingTradeStations` is keyed by faction — one entry blocks the next observe tick from queueing another).

**Observed sample-save state:**
- Antigone Republic → Second Contact XI (95 min old)
- Zyarth Patriarchy → Tharka's Ravine XXIV (135 min old)

**Read:** these have been building for 1.5-2.5 hours in-game. Vanilla station construction takes 30-120 min depending on hull-parts logistics; if a build is >200 min old and not finishing, something is stalled (usually the ware supply chain hasn't delivered enough Hull Parts).

### Active faction wharf/shipyard builds (WH=N SY=N tally)

| Column | Meaning |
|---|---|
| **Faction** | Which faction is building. |
| **Sector** | Placement sector. |
| **Type** | `wharf` or `shipyard`. |
| **Age** | Minutes since queued. |

**Header tally** shows the totals: e.g. `Faction (WH=3 SY=3)` means 3 wharves + 3 shipyards currently being built across all factions.

**Per-faction concurrency:** since mlog056, wharfs and shipyards live in **separate** tables (`$BuildingFacWharfs` + `$BuildingFacShipyards`), so **each faction can have 1 wharf AND 1 shipyard simultaneously** without one blocking the other.

**Observed sample-save state:**
- Holy Order of the Pontifex → Holy Vision → wharf (74 min)
- Teladi Company → CEO's Doubt → wharf (64 min)
- Zyarth Patriarchy → Tharka's Ravine XXIV → wharf (44 min)
- Teladi Company → CEO's Doubt → shipyard (152 min)
- Zyarth Patriarchy → Tharka's Ravine XXIV → shipyard (42 min)
- Provinces Adrift → Barren Shores → shipyard (378 min — 6+ hours! this one is probably stalled)

**Read the 378 min row:** Provinces Adrift's shipyard in Barren Shores has been building for over 6 hours. Vanilla shipyards should finish in ~180 min max — this one either has no Hull Parts / Refined Metals in the region, or the build cue got stuck. Use "Clear all active wh/sy builds" to reset if a manual sanity check confirms the build has failed.

### Active xenon wharf/shipyard builds (N/4 tally)

| Column | Meaning |
|---|---|
| **Faction** | Always `Xenon`. |
| **Sector** | Placement sector. |
| **Type** | `wharf` or `shipyard`. |
| **Age** | Minutes since queued. |

**Header tally** shows current count / max slots: e.g. `Faction (4/4)` means all 4 Xenon concurrent slots are full.

**Xenon concurrency:** mlog049 stored `$BuildingXenWhSy` as a LIST (not keyed table), and Xenon can have **up to 4 parallel** wh/sy builds regardless of specific sector. Xenon's expansion rate is deliberately faster than lawful factions.

**Observed sample-save state:**
- Xenon → Black Hole Sun IV → shipyard (158 min)
- Xenon → Trinity Sanctum VII → wharf (43 min)
- Xenon → Morning Star IV → wharf (33 min)
- Xenon → Mitsuno's Defiance → shipyard (28 min)

**Read:** Xenon are building **2 new shipyards + 2 new wharves** simultaneously. Black Hole Sun IV is the classic Xenon-front sector — makes sense they'd reinforce there.

## Clear-all buttons — when to press

- **Only when a build is genuinely stuck** — verify by checking the game map: does the station macro exist at the sector but with 0 modules built and no wares en route? Then the build cue died.
- **Pressing Clear** removes the tracking entry, which lets the next observe tick queue a **new** build for that faction (or Xenon slot). It does NOT undo any partial construction that already happened.
- **Do NOT press Clear on healthy fast-progressing builds** — you'll just re-queue them and waste faction credits/wares.

## Related mechanics

- **[6h TTL on Extension Built lists](../../mechanics/#6h-ttl-on-extension-built-lists)** — the mlog087 change that gives Built list entries a 6-hour expiry, so a cluster where a build failed doesn't get permanently blacklisted. Reference the mechanics page for architectural details.
- **Persistent tracking (mlog060+):** `$BuiltTradeCenters` / `$BuiltFacWharfs` / `$BuiltFacShipyards` are tables keyed by faction, each a list of cluster refs where we've built. Used INSTEAD of vanilla `isplannedwharf`/`isplannedshipyard` (which is unreliable for the generic-factory-base macros DA uses).

## Preset scope

All 8 top-level options are in [Configuration Presets](./presets/) scope. The **live-builds tables and Clear buttons are NOT** — those are runtime state.

## Turn off if

- You want a fixed-map, static-economy experience where factions never expand beyond gamestart assets. Set all three `Allow*` toggles to `Disabled`.
- Debug spam is too noisy — set `Detailed logging` to `Disabled` (still keeps the subsystem running, just quieter).

## Notes on defaults

Every settings default in source is `false` — the subsystem ships **OFF by default**. The observed sample-save has everything enabled because the user turned them on. This is by design: Extension is disruptive to a save's economy, so the mod won't touch it unless you opt in.

**Exception:** `EnableLog` defaults to `true` (mlog060) — verbose logging IS on by default so if something goes wrong you have diagnostic data to send back. Turn it off once the subsystem is stable in your save.
