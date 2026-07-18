---
title: mlog6 fork fixes
description: What the mlog4 fork restored. 7 major XPath patches that were dead code through X4 8.x and 9.x, plus ~200 error/session cleanup and the version bump to 9.0 (dependency 700→900).
sidebar:
  order: 2
---

The mlog4 fork of DA-Eco is primarily a **compatibility fix release**. The mod's gameplay logic is preserved unchanged from DeadAirRT's v1.13HF1 — what mlog4 restores is 7 major library patches that had gone silent through the 8.x → 9.x upgrade cycle, plus cleanup of ~140 dead patches.

## The 7 restored XPath patches

Vanilla 8.x wrapped several code paths in `do_else` blocks due to the introduction of `hasstagedconstruction`. DA-Eco's original XPaths targeted the top-level `if` clause, which no longer received the actual production logic (that had moved into the `do_else`).

Result: **7 major mod patches were silently no-op through 8.x and 9.x** until mlog6 fixed the XPaths to target the actual code location.

### 1. Request_Factory ProductionLimit 1→5

The signature "bigger factories" patch. Vanilla `Request_Factory` cue in `factionlogic_economy.xml` decides how many production modules to plan for a new NPC factory.

- **Vanilla:** `ProductionLimit=1` — one module per type.
- **DA intended:** `ProductionLimit=5` — up to 5 identical modules per type.
- **Actually applied 8.x/9.x pre-mlog6:** unchanged (patch aimed at wrong branch after `do_else` wrap).
- **mlog6 fix:** re-target XPath to include both branches. Now actually 5.

**Impact:** the "bigger factories" gameplay that DA is famous for was NOT actually happening in vanilla playthroughs of 8.x/9.x. Post-mlog6, NPC factories grow properly.

### 2. safepos radius 3km→21km

`Request_Factory` also sets a safe-position radius for new station placement — how much clearance around other stations/objects is required.

- **Vanilla:** 3km — very tight, stations crowd.
- **DA intended:** 21km — real breathing room.
- **Pre-mlog6:** unchanged.
- **mlog6:** 21km applied.

**Two occurrences** — one in `Request_Factory`, one in `Request_Wharf`. Both restored.

### 3. Request_Production_Module WantedProductions 1-2 per tick

When a faction wants to expand an existing factory, the vanilla logic adds 1 module per tick. DA wanted:

`$DALocCount min=1 max=2` — expansion adds 1-2 modules per tick.

Combined with `ProductionLimit=5`, a fresh factory grows from 1 module to 5 in about 3-4 ticks (instead of vanilla's 5 ticks).

**Pre-mlog6:** patch not applied → factions expanded at vanilla speed.
**Mlog6:** patch applied → factions grow faster to full capacity.

### 4. DAIncreaseStartingStorage actually called

The [storage-sizing subsystem](../mechanics/storage-sizing/) was DA's centerpiece. Vanilla 8.x wrapped `God_DefaultFinaliseFactory` in a `do_else` guarded by staged-construction detection. DA's XPath targeted the outer `if`.

Result: **DA storage sizing wasn't happening**. Every new factory shipped with vanilla-default storage, matching pre-DA behavior.

**Mlog6 fix:** XPath re-targeted to include the `do_else` path. `DAIncreaseStartingStorage` now runs on every new factory creation.

**Effect on a save:** new factories going forward get 12h-appropriate storage. Existing pre-mlog6 factories keep their undersized storage until they're destroyed or re-built.

### 5. DAImproveStationLayouts actually called

Same problem, same fix as #4. [DAImproveStationLayouts](../mechanics/station-improvements/#daimprovestationlayouts--racial-connectors) was the racial-connector subsystem.

**Pre-mlog6:** all races got vanilla-default connector pool → stations looked homogeneous.
**Mlog6:** racial connectors actually applied → Argon looks like Argon, Split looks like Split, etc.

### 6. Mining efficiency 90% (silently no-op)

DA-Eco's design intent: NPC mining should be **~10% slower than vanilla** to prevent NPCs from over-mining and crashing resource prices. Implemented as a `miningefficiency=0.9` XPath patch.

**Pre-mlog6:** patch silently no-op. NPC miners ran at 100% vanilla efficiency.
**Mlog6:** patch restored. NPC mining now 10% slower — resource prices stabilize.

### 7. 16 god-quota patches (food/graphene/hullparts/refinedmetals/claytronics/silicon/microlattice)

Individual per-ware quota-scaling patches. DA-Eco wanted higher station density for key intermediate wares (graphene, refined metals, etc.) so trade chains had more nodes.

**Pre-mlog6:** all 16 patches dead. Vanilla quotas ruled.
**Mlog6:** all 16 restored. Wharves and shipyards spawn with proper module counts.

## Cleanup: ~200 error/session → 0

Beyond restoring dead patches, mlog6 also removed patches that had been superseded or made obsolete by vanilla changes:

### 69 jobs.xml patches removed

Vanilla 9.x natively adopted the `traderoutine` aiscript that DA had been patching around. The DA `Middleman → TradeRoutine` transformation patches were superseded — removing them lets vanilla's own implementation work.

### 62 region-yield patches removed

Vanilla 8.x completely rewrote the resource-yield system. DA's yield-scaling patches were targeting a schema that no longer existed → errors on every load.

### 6 dead constructionplans / baskets patches removed

Individual patches that no longer matched the new plan structures.

### 1 dead Boron cross-faction patch removed

Small cleanup.

**Total impact:** DA-Eco went from **~200 `=ERROR=` lines per session** to **0 errors** in 5+ hour multi-mod soak tests on 9.0 release.

## The version bump

`content.xml`: `dependency version="700"→"900"` (mlog006rel, 2026-07-04). Bumps mod's declared X4 version target from 7.0 to 9.0. Metadata / publication release.

## Verification protocol for the fixes

To verify the fixes are actually applied in your save, you can:

1. **Check for `ProductionLimit=5`** — look for NPC stations with 5 identical production modules of the same type. In the [DA Scripts fork's Production Module Count report](/x4-modding-wiki/mods/deadair-scripts-fork/reports/production-module-count/), a mature Argon Hull Parts should show 5+ Operational Hull Parts modules on their oldest factory.
2. **Check for `21km` safepos** — new NPC stations should have visible clearance from each other on the map.
3. **Check racial connectors** — visit a large Terran/Split station in-game. Should see `struct_ter_*` / `struct_spl_*` racial cross-braces, not homogeneous connectors.
4. **Check `script.log`** — no lines starting with `=ERROR=` referencing `libraries/god.xml`, `libraries/jobs.xml`, etc.
5. **Look for `DAIncreaseStartingStorage` debug lines** — DA-Eco emits `[DAECO/STORAGE]` log messages when it fires.

## Testing baseline

**5+ hour multi-mod soak** on X4 9.0 release with:
- DA-Eco (mlog4 fork)
- DA-Scripts (mlog4 fork)
- [Apus](/x4-modding-wiki/mods/apus-compat/)
- [ETW](/x4-modding-wiki/mods/etw-compat/)
- Galactic Heroes
- Zero-Transporter

Result: **zero `=ERROR=` from DA-Eco**. This is the mlog6 baseline that lets the fork be considered stable for 9.0.

## Why these fixes matter

Pre-mlog6, someone running DA-Eco on 9.0 would experience:
- Vanilla-sized factions (small stations, no "bigger factories" effect).
- Vanilla-sized station storage (empty silos problem persists).
- Homogeneous station visuals (no racial connectors).
- Full-speed NPC mining (resource prices crash).
- ~200 errors per session cluttering the log.

They would technically be "running DA-Eco" but getting almost none of DeadAirRT's design. Mlog6 restores the actual gameplay experience the mod was supposed to deliver.

## Related pages

- [Mechanics overview](../mechanics/) — the gameplay effect of the restored patches
- [Storage sizing](../mechanics/storage-sizing/) — the subsystem fixed by patch #4
- [Station improvements](../mechanics/station-improvements/) — the subsystems fixed by patch #5
- [Library changes](./library-changes/) — file-by-file summary of what changed
