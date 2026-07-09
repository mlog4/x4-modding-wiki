---
title: DeadAir Scripts (No DA Wares fork)
description: DA Scripts stripped of the three DA-Eco custom wares — runs cleanly with VRO, X4-Reemergence, vanilla, or matching No DA Wares Eco fork.
---

Variant of the **[DeadAir Scripts (mlog4 fork)](/x4-modding-wiki/mods/deadair-scripts-fork/)** with all references to the three DA-Eco custom wares (`da_mil_schematics`, `da_adv_schematics`, `da_laborunion_contracts`) stripped. Runs cleanly without any DA Economy Overhaul companion mod, so it's the recommended variant when playing with VRO, X4-Reemergence, or vanilla economy.

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — required for the DA menu
- **All Egosoft DLCs** — all optional; mod adapts to what you have
- **Optional companion mods:**
  - **[VRO 5.01](https://steamcommunity.com/sharedfiles/filedetails/?id=1696862840)** — recommended combat / balance overhaul
  - **[DeadAir Economy Overhaul (No DA Wares fork)](/x4-modding-wiki/mods/deadair-eco-no-wares-fork/)** — matching Eco variant if you want DA's economy tuning without custom wares

### Install

- **Nexus (manual):** Download `mlog_deadair_scripts_no_da_wares_v2.0.0.zip`, extract into `X4 Foundations/extensions/` (folder must be named `mlog_deadair_scripts_no_da_wares`).
- **Steam Workshop:** Subscribe to [ws_3758753077](https://steamcommunity.com/sharedfiles/filedetails/?id=3758753077).

### Configuration

Identical to the [standard fork's DA Menu setup](/x4-modding-wiki/mods/deadair-scripts-fork/#installation--configuration). Same subsystems, same sliders, same in-game menu.

### Recommended stack with VRO 5.01

1. **Variety and Rebalance Overhaul (VRO 5.01)** — [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=1696862840) or [Nexus](https://www.nexusmods.com/x4foundations/mods/305)
2. **SirNukes Mod Support APIs** — [Nexus mods/503](https://www.nexusmods.com/x4foundations/mods/503)
3. **DeadAir Scripts (No DA Wares fork)** — this mod
4. Optional: **DeadAir Economy Overhaul (No DA Wares fork)**

VRO requires a new game start.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **DeadAir Scripts (standard fork)** | ❌ Conflict | Pick one variant, not both. |
| **DeadAir Economy Overhaul (standard, with wares)** | ⚠️ Redundant | Standard Eco adds DA wares back; defeats the point of this variant. Use [DA Eco No DA Wares](/x4-modding-wiki/mods/deadair-eco-no-wares-fork/) instead, or the [standard DA Scripts fork](/x4-modding-wiki/mods/deadair-scripts-fork/). |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. |
| **Everything else** | ✅ Compatible | Same compatibility as the standard fork. |

## Deep dive: functionality & game mechanics

Same feature set and mechanics as the standard fork. See **[DA Scripts (standard) deep dive](/x4-modding-wiki/mods/deadair-scripts-fork/#deep-dive-functionality--game-mechanics)** for full descriptions of:

- Dynamic War
- Dynamic News
- Xenon Evolution
- Station Fill
- Jobs Expeditions (with dynamic modded-faction support in v2.0.0)
- Jobs SST
- Blueprint Scanning
- In-game menu

### What's different from the standard fork

Only the following are removed:

- **DA custom wares** — `da_mil_schematics`, `da_adv_schematics`, `da_laborunion_contracts` and their production modules
- **Station Calculator entries** — 60 recipe rows with secondary DA ware columns had those columns replaced with `null,0`
- **DA Eco hard dependency** — `content.xml` drops the `<dependency id="DeadAir_Eco">` line, so no missing-dependency errors when running without DA Eco

Everything else (all gameplay features, all X4 9.0 compat fixes, save-game compat, DA menu) is identical.

### Migrating from the standard fork mid-save

Disable the standard `deadair_scripts` extension in the Extensions menu, install this fork, enable it. Existing save with references to DA wares in trader baskets should be safe — X4 silently drops unknown ware refs. Test on a copy first if you're worried.

## Links and source

- **Nexus:** (new mod page)
- **Steam Workshop:** [ws_3758753077](https://steamcommunity.com/sharedfiles/filedetails/?id=3758753077)
- **GitHub:** [mlog4/deadair_scripts_no_da_wares](https://github.com/mlog4/deadair_scripts_no_da_wares)
- **License:** GPL-3.0

**Original mod:** DeadAirRT.
**No DA Wares strip variant by:** mlog4.
