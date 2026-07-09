---
title: DeadAir Scripts (mlog4 fork)
description: 9.0-compatible fork of the classic DeadAir Dynamic Universe mod. Full feature set with dynamic modded-faction support in v2.0.0.
---

The mlog4 fork of the classic **DeadAir Scripts** (aka Dynamic Universe) by DeadAirRT. Maintained under DA's retirement GPL-3.0 grant, updated for X4 9.0 with all core features intact plus a new dynamic modded-faction support layer.

## What it does

Adds a rich dynamic-universe layer on top of vanilla X4. The galaxy feels less static, factions react and shift over time, and long-term play develops in ways vanilla never quite delivered.

### Core feature list

| Feature | What it does |
|---------|--------------|
| **Dynamic War** | Periodic AI-to-AI relation shifts. Six event types from soft nudges to instant max-relation flips. Wars start, alliances form, and the political map genuinely changes across a long playthrough. |
| **Dynamic News** | Logbook + notification feed for galaxy-scale events. Sector ownership shifts, big station events, notable relation changes get reported like actual news. |
| **Xenon Evolution** | Xenon adaptively upgrade their ships over 10 levels × 6 categories. Late-game Xenon fields significantly tougher hulls, better shields, upgraded weapons. At L1/3/5 Xenon expand their shipyards. |
| **Station Fill** | Top up trade stations, shipyards, and wharves at configurable intervals. Fixes vanilla's tendency to leave empty/half-empty stations sitting idle. |
| **Jobs Expeditions** | Long-range attack fleets similar to Terran Interventions. XL flagships + escort trees launch from a faction's shipyards and go patrol distant sectors. |
| **Jobs SST** (Situational Sector Threat) | Sectors classified as Critical / Core / Border / Contested. Fleet quotas per sector role, dynamically ordered from faction shipyards. |
| **Blueprint Scanning** | Police assets scan enemy ships for blueprint fragments, awarded to the player after enough fragments accumulate. |
| **In-game menu** | Every subsystem is toggleable and configurable via the DA Menu (accessed via SirNukes Mod Support APIs). |

### NEW in v2.0.0 — Dynamic modded-faction support

Prior versions of DA hardcoded 8 vanilla factions as expedition-eligible. v2.0.0 populates the Jobs Expeditions initial-list dynamically from all `tag.claimspace` factions — so modded factions (Apus, Eternal Twilight, Ancients, etc.) participate in the expedition system from turn 1 of a new game, as long as a companion compat mod provides the actual expedition job templates.

Runtime library auto-adds and auto-removes factions based on `[daexpedition]` job availability. Combined with our companion compat mods:

- **[Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/)** — full DA integration for Apus Stellar Treaty
- **[ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/)** — full DA integration for all 3 ETW factions

## Requirements

- **X4 Foundations 9.0** or newer
- **SirNukes Mod Support APIs** — required for the DA menu ([Nexus](https://www.nexusmods.com/x4foundations/mods/503))
- **DeadAir Economy Overhaul** (optional but recommended for the DA custom wares — schematics + labor contracts)
- **All Egosoft DLCs** — all optional; mod adapts to what you have

## Installation

### Nexus (manual)
1. Download `deadair_scripts_v2.0.0.zip` from [Nexus mods/2205](https://www.nexusmods.com/x4foundations/mods/2205)
2. Extract into `X4 Foundations/extensions/`
3. Folder should be named `deadair_scripts`
4. Launch X4 → Extensions menu → verify it's enabled

### Steam Workshop
Subscribe to [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765). Steam handles the install; the mod appears in the Extensions menu on next X4 launch.

## Configuration

Once installed, launch a game and open **Main Menu → DA Menu** (the icon appears once SirNukes API is loaded).

### Recommended defaults (for most players)

Leave the mod on default. The gameplay is tuned for a slightly harder-than-vanilla experience without forcing changes. Everything can be adjusted later if needed.

### Common tweaks

**Dynamic War → Event frequency slider** — controls how often AI relations change. Lower = more stable galaxy, higher = more chaos.

**Xenon Evolution → Level cap** — cap how high Xenon evolution goes. Default 10 gets endgame-level nasty; setting cap to 5 keeps mid-game feel.

**Station Fill → Fill cycle interval** — how often stations top up. Faster = more spending, faster faction growth. Slower = economy takes longer to develop.

**Jobs Quotas** — per-faction, per-role quotas for Critical / Core / Border / Contested Sector Patrols + L/M Traders + L/M Miners + L/M Gas Miners. Set higher galaxy quota / sector quota to see more traffic in the associated sectors.

### Modded-faction quota rows

If you have Apus or ETW installed alongside their compat mods, their factions appear in Jobs Quotas menu with full quota rows just like vanilla factions. Move the sliders to tune fleet sizes per role.

If a modded faction shows **"No suitable ships available!"** — that means the compat mod for that faction isn't installed. Install the matching compat.

## Compatibility

| Mod | Works? | Notes |
|-----|--------|-------|
| **DeadAir Economy Overhaul** (standard fork) | ✅ Optimal | Full DA experience with custom wares |
| **Variety and Rebalance Overhaul** (VRO 5.01) | ✅ Yes | Consider using the [No DA Wares fork](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/) instead if you don't want the DA custom wares |
| **X4-Reemergence** | ❌ Not yet — RE isn't on 9.0 | Waiting on RE 1.9 update |
| **Apus Stellar Treaty** | ✅ Yes — pair with [Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/) | Full DA integration |
| **Eternal Twilight Expansion** | ✅ Yes — pair with [ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/) | Full DA integration |
| **SirNukes Mod Support APIs** | ✅ Required | For DA menu |
| **Galactic Heroes (mlog_heroes)** | ✅ Yes | Both mods can run simultaneously |
| **Zero-Transporter (mlog_zt)** | ✅ Yes | No conflicts |

## Troubleshooting

### "Extension not showing in Extensions menu"

Verify the mod folder is `X4 Foundations/extensions/deadair_scripts/content.xml` — not nested one level deeper (`.../deadair_scripts/deadair_scripts/content.xml`).

### "MLOG_DA banner shows old build in log"

X4 loads extensions at launch. If you replaced files after X4 was already open, you'll see the previous build's tag in the log. Exit X4 completely and relaunch to load the current build.

### "No suitable ships available!" for a modded faction

That specific faction doesn't have the DA-compat jobs installed. Install the matching compat mod (Apus, ETW, etc.), or verify the compat mod is present and enabled in the Extensions menu.

### "Mid-save station enhancement not working"

DA Eco's storage / habitation / dock enhancements fire at station-creation time only. Existing stations in the save keep their vanilla-scale storage; only newly-built stations get the improvements. Mid-save is still worth adding — DA God keeps expanding NPC stations with new modules that DO get the enhancements.

## Links and source

- **Nexus:** [mods/2205](https://www.nexusmods.com/x4foundations/mods/2205)
- **Steam Workshop:** [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts)
- **License:** GPL-3.0 (inherited from upstream)

**Original mod:** DeadAirRT — retired mid-2025, granted GPL-3.0 for continuation.
**9.x compat fork by:** mlog4.
