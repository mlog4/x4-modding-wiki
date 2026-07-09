---
title: DeadAir Scripts (mlog4 fork)
description: 9.0-compatible fork of the classic DeadAir Dynamic Universe mod. Adds Dynamic War, Xenon Evolution, Jobs Expeditions and more. Full feature set with dynamic modded-faction support in v2.0.0.
---

The mlog4 fork of the classic **DeadAir Scripts** (aka Dynamic Universe) by DeadAirRT, maintained under DA's retirement GPL-3.0 grant. Updated for X4 9.0 with all core dynamic-universe features intact plus a new dynamic modded-faction layer that lets Apus, Eternal Twilight and other faction expansions plug straight into DA's expedition and SST systems.

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — required for the DA menu
- **[DeadAir Economy Overhaul (mlog4 fork)](/x4-modding-wiki/mods/deadair-eco-fork/)** — optional but recommended companion
- **All Egosoft DLCs** — all optional; mod adapts to what you have

### Install

- **Nexus (manual):** Download `deadair_scripts_v2.0.0.zip` from [mods/2205](https://www.nexusmods.com/x4foundations/mods/2205), extract into `X4 Foundations/extensions/` (folder must be named `deadair_scripts`).
- **Steam Workshop:** Subscribe to [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765). Steam handles the install.

### Configuration

Launch a game and open **Main Menu → DA Menu** (icon appears once SirNukes API is loaded). Every subsystem is toggleable. Recommended defaults work for most players — leave the mod on default first, then adjust:

- **Dynamic War → Event frequency** — how often AI relations shift
- **Xenon Evolution → Level cap** — cap Xenon endgame growth (default 10, lower = milder mid/late-game)
- **Station Fill → Cycle interval** — how often stations top up
- **Jobs Quotas** — per-faction, per-role sliders for patrol / trader / miner fleet sizes

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Original DeadAir Scripts by DeadAirRT** | ❌ Conflict | This IS the fork; don't install both. Disable/remove upstream. |
| **DeadAir Scripts (No DA Wares fork)** | ❌ Conflict | Alternative variant — pick one, not both. |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. Waiting on RE v1.9 update. |
| **Everything else** | ✅ Compatible | VRO 5.01, SirNukes, DA Eco, Apus, ETW, Galactic Heroes, Zero-Transporter — all coexist cleanly. |

## Deep dive: functionality & game mechanics

### Dynamic War

Periodic AI-to-AI relation shifts drive galaxy politics on their own. Six event types range from small nudges to instant max-relation flips.

**Effect over a long playthrough:** wars start, alliances form, and the political map genuinely changes. Instead of vanilla's largely-static faction relations, you'll see events like Antigone declaring war on Argon after 40 hours of tension, or Split forming an unexpected pact with Teladi. The event picker weights by proximity, existing relation state, and military strength (weaker factions bias toward making friends, stronger toward making enemies).

Controlled via DA Menu → Dynamic War → Event frequency + Excluded factions (some players prefer certain factions locked at their vanilla relations for narrative reasons).

### Dynamic News

Logbook + notification feed for galaxy-scale events. Sector ownership shifts, major station events, notable relation changes get reported like actual news bulletins.

Sits on the same DA Menu → Dynamic News toggle. Great for a chill/RP playstyle where you want the galaxy to feel alive without micromanaging.

### Xenon Evolution

Xenon adaptively upgrade their ships across 10 levels × 6 equipment categories (engines, ships, shields, weapons, missiles, eco). Each level increment adds better mods to Xenon-built ships. At levels 1, 3, and 5 the Xenon expand their shipyards with additional production modules.

**Practical impact:** late-game Xenon fields significantly tougher hulls than vanilla. A level-8 Xenon K is noticeably harder than a fresh-spawned one. This keeps Xenon relevant as a threat past the early-game turret spam phase.

Configurable via DA Menu → Xenon Evolution → Level cap (default 10, lower = milder endgame difficulty).

### Station Fill

Tops up trade stations, shipyards, and wharves at adjustable intervals. Fixes vanilla's tendency to leave stations sitting half-empty when faction economy stalls.

Uses per-faction accounts (tracks each faction's spending) and per-station intelligence — critical wares get topped first, luxury wares last. Configurable fill floor / ceiling per ware category.

### Jobs Expeditions

Long-range attack fleets similar to Terran Interventions. An XL flagship + escort tree launches from a faction's shipyard and goes patrol distant sectors. Each faction gets one active expedition at a time (galaxy quota 1).

**v2.0.0 change:** the initial expedition-eligible faction list is now populated dynamically from all `tag.claimspace` factions instead of a hardcoded 8-vanilla list. Modded factions (Apus, Eternal Twilight, Ancients if you have compat) participate from turn 1 of a new game.

DA's runtime library auto-adds and removes factions based on `[daexpedition]` job availability. Companion compat mods provide the actual expedition job templates for modded factions:

- **[Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/)** — for Apus Stellar Treaty
- **[ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/)** — for all 3 Eternal Twilight factions

### Jobs SST (Situational Sector Threat)

Sectors classified as Critical / Core / Border / Contested. Each faction has fleet quotas per sector role — Critical sectors get heavier patrols than Border. DA runtime scheduler dynamically orders ships from faction shipyards to keep quotas met.

**Per-faction menu:** DA Menu → Jobs → Jobs Quotas → scroll to each faction → adjust Galaxy Quota / Sector Quota / Fleet Size sliders for each role (Critical / Core / Border / Contested Sector Patrol + L/M Trader + L/M Miner + L/M Gas Miner).

Higher galaxy quota = more traffic in that role's sectors. Higher fleet size = bigger subordinate groups per patrol.

Modded factions appear in this menu with full quota rows only if a companion compat mod is installed. Without compat, the modded faction row shows "No suitable ships available!".

### Blueprint Scanning

Police assets scan enemy ships for blueprint fragments. Once a ship's blueprint accumulates enough fragments across scans, the blueprint is awarded to the player.

Works with the vanilla `policeassetscannedship` engine signal. Fires when your police-tagged ship scans an enemy ship. Fragments per scan and required-total configurable per macro class.

### In-game menu

Every subsystem above is toggleable and configurable via the DA Menu (requires SirNukes Mod Support APIs). Save-safe — turning features on/off mid-save is fine.

## Links and source

- **Nexus:** [mods/2205](https://www.nexusmods.com/x4foundations/mods/2205)
- **Steam Workshop:** [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts)
- **License:** GPL-3.0 (inherited from upstream)

**Original mod:** DeadAirRT — retired mid-2025, granted GPL-3.0 for continuation.
**9.x compat fork by:** mlog4.
