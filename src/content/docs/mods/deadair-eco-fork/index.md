---
title: DeadAir Economy Overhaul (mlog4 fork)
description: 9.0-compatible fork of DeadAir Economy Overhaul. A library-level economy rewrite — bigger factories, 3 custom secondary-resource wares, per-race station layouts, Xenon-specific job manager. No in-game menu; effects apply silently at station creation.
---

The mlog4 fork of the classic **DeadAir Economy Overhaul** by DeadAirRT (retired 2025-09-23, GPL-3.0 continuation grant). Updated for X4 9.0 with 7 major XPath fixes restored (see [mlog6 fork fixes](./reference/mlog6-fork-fixes/) — patches that lay dead through 8.x/9.x are back working).

## What this mod does (in one sentence)

Rewrites vanilla's economy toward **fewer / larger / more interconnected** faction stations, using 3 custom "schematic" wares as secondary-resource multipliers to bind the whole economy in a circular dependency chain.

## Key features

| Feature | Effect |
|---|---|
| **[3 custom DA wares](./mechanics/da-wares/)** | Advanced Schematics / Military Schematics / Labor Union Contracts. Act as secondary resources that DOUBLE production output at any station that has them. Own production modules with highest workforce impact in the game. |
| **[Bigger factories](./mechanics/da-wares/#bigger-factories-mechanic)** | `ProductionLimit 1→5` per module type. NPC stations grow to real hubs (5 identical Hull Parts modules) instead of 5 tiny stations. CPU-friendlier + more visually impressive. |
| **[Automatic storage sizing](./mechanics/storage-sizing/)** | New stations get storage that actually matches production/consumption. Fixes vanilla's "empty silos, production stalled" failure mode. |
| **[Race-aware station layouts](./mechanics/station-improvements/#daimprovestationlayouts--racial-connectors)** | Argon/Paranid/Teladi/Split/Terran/Boron stations get racial structural connectors. Visual variety. |
| **[Xenon-specific systems](./mechanics/xenon-specifics/)** | Custom Ship Construction Manager (vanilla failed because Xenon lacks shiptrader control post) + Xenon-only mining/trader jobs. |
| **[~700 ware rebalance patches](./reference/library-changes/#waresxml-2084-lines)** | Cycle=600s, workforce boost to product=0.5/cycle=0.5, secondaryresource +25% cycle, expanded price amplitude. |

## Requirements

- **X4 Foundations 9.0** or newer (fork bumped `dependency version="900"` in mlog006rel)
- **Split Vendetta DLC** — hard dependency (economy tuning uses Split race data extensively)
- **Terran DLC** — hard dependency
- **Boron DLC** — hard dependency
- **Pirate DLC (Kingdom End)** — hard dependency
- **[DeadAir Scripts (mlog4 fork)](/x4-modding-wiki/mods/deadair-scripts-fork/)** — **required companion** (the two mods share `md.$DAEco` flag and DA-wares registration probes)
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — for DA menu integration when running with DA-Scripts

## Install

- **Nexus (manual):** Download the DA Eco zip from [mods/2206](https://www.nexusmods.com/x4foundations/mods/2206). Extract into `X4 Foundations/extensions/`. Folder must be named **`deadair_eco`** (case-sensitive — asset paths break with any variation).
- **Steam Workshop:** Subscribe to [ws_3757967448](https://steamcommunity.com/sharedfiles/filedetails/?id=3757967448).

## Configuration

**There is no in-game DA-Eco menu.** All economy tuning is baked in; effects apply automatically at station creation via [`md/finalisestations.xml`](./mechanics/storage-sizing/). Optional configuration lives in the [DA Scripts fork menus](/x4-modding-wiki/mods/deadair-scripts-fork/) — for example [DA Fill](/x4-modding-wiki/mods/deadair-scripts-fork/configuration/fill/) uses DA-Eco's ware definitions when running.

**Save-safe:** installing / uninstalling mid-save is technically possible but not recommended — DA-Eco changes ware pricing curves and recipe amounts. Rolling those changes back mid-save leaves station stockpiles inconsistent with new demand.

## Deep dives

### Mechanics

- **[Mechanics overview](./mechanics/)** — design philosophy + architecture map
- **[DA custom wares](./mechanics/da-wares/)** — 3 secondary-resource wares that bind the economy
- **[Storage sizing (DYN formula)](./mechanics/storage-sizing/)** — how stations get real-scale storage
- **[Station improvements](./mechanics/station-improvements/)** — connectors / habitation / docks / defence
- **[Xenon specifics](./mechanics/xenon-specifics/)** — why Xenon runs on different rules

### Reference

- **[Library changes](./reference/library-changes/)** — per-file patch summary (wares.xml / god.xml / jobs.xml / etc.)
- **[mlog6 fork fixes](./reference/mlog6-fork-fixes/)** — 7 major XPath patches that were dead code through 8.x/9.x, now restored

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Original DeadAir Economy Overhaul by DeadAirRT** | ❌ Conflict | This IS the fork. Uninstall upstream before adding this. |
| **DeadAir Economy Overhaul (No DA Wares fork)** | ❌ Pick one | Same fork family, different variant. Choose which. |
| **DeadAir Economy Overhaul adopted by Chem ODun** | ❌ Pick one | Alternative community fork of the same base. |
| **Variety and Rebalance Overhaul (VRO)** | ⚠️ Overlaps | VRO has its own economy tuning. Running both stacks DA wares on top of VRO's balance — might work but untested. Consider [No DA Wares Eco fork](/x4-modding-wiki/mods/deadair-eco-no-wares-fork/) for cleaner VRO experience. |
| **X4-Reemergence** | ❌ Not yet | Reemergence isn't on 9.0. |
| **Everything else** | ✅ Compatible | [Apus](/x4-modding-wiki/mods/apus-compat/), [ETW](/x4-modding-wiki/mods/etw-compat/), Galactic Heroes, Zero-Transporter — all coexist cleanly. 5+ hour multi-mod soak tests show zero DA-Eco errors on 9.0 release. |

## Testing status

**Tested on X4 9.0 release.** 5+ hour multi-mod soak (DA-Eco + DA-Scripts + [Apus](/x4-modding-wiki/mods/apus-compat/) + [ETW](/x4-modding-wiki/mods/etw-compat/) + Galactic Heroes + Zero-Transporter) shows **zero `=ERROR=` from DA-Eco**. This is a critical baseline — pre-mlog6 the mod had ~200 errors per session from dead XPath patches.

## Links and source

- **Nexus:** [mods/2206](https://www.nexusmods.com/x4foundations/mods/2206)
- **Steam Workshop:** [ws_3757967448](https://steamcommunity.com/sharedfiles/filedetails/?id=3757967448)
- **GitHub:** [mlog4/deadair_eco](https://github.com/mlog4/deadair_eco)
- **License:** GPL-3.0 (inherited from upstream)

**Original author:** DeadAirRT — retired mid-2025, granted GPL-3.0 for community continuation.
**9.x compat fork by:** mlog4.

## Companion documentation

For the source-authored technical breakdown (Russian, 294 lines) see `ANALYSIS_mlog4.md` in the mod repo. This wiki page tree translates and expands that analysis with concrete tables and observed game-state references.
