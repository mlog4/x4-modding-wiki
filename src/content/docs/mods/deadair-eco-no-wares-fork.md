---
title: DeadAir Economy Overhaul (No DA Wares fork)
description: DA Eco stripped of the three custom wares (schematics + labor contracts) — clean pairing with VRO, X4-Reemergence, or vanilla economy.
---

Variant of the **[DeadAir Economy Overhaul (mlog4 fork)](/x4-modding-wiki/mods/deadair-eco-fork/)** with the three DA custom wares (`da_mil_schematics`, `da_adv_schematics`, `da_laborunion_contracts`) and all their production modules removed. All other DA economy tuning is preserved (pricing rebalance, hullparts→claytronics recipe swap, workforce effects, station variety, defence platform scaling).

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer
- **Split Vendetta DLC** — hard dependency
- **[DeadAir Scripts (No DA Wares fork)](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/)** — recommended companion
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — for DA menu integration
- Other Egosoft DLCs — all optional

### Install

- **Nexus (manual):** Download `mlog_deadair_eco_no_da_wares_v1.0.0.zip`, extract into `X4 Foundations/extensions/` (folder must be named `mlog_deadair_eco_no_da_wares`).
- **Steam Workshop:** Subscribe to [ws_3758760099](https://steamcommunity.com/sharedfiles/filedetails/?id=3758760099).

### Configuration

Same DA Menu → Economy settings as the standard fork. Save-safe.

### When to use this variant

Use the **No DA Wares Eco fork** if:

- You play with **VRO 5.01** and want its economy tuning uncluttered by DA custom wares
- You play with **X4-Reemergence** (when it lands on 9.0)
- You run **vanilla economy** but want the DA station enhancements without the wares
- You want DA's station variety, defence tuning, and workforce effects without the custom-ware economy layer

Use the **[standard DA Eco fork](/x4-modding-wiki/mods/deadair-eco-fork/)** if you want the full DA experience with schematics + labor contracts.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **DeadAir Economy Overhaul (standard fork)** | ❌ Conflict | Pick one variant. |
| **DeadAir Scripts (standard, with wares)** | ⚠️ Suboptimal | Standard Scripts expects DA wares to exist. Pair No DA Wares Scripts with No DA Wares Eco. |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. |
| **Everything else** | ✅ Compatible | Same compatibility as the standard Eco fork. |

## Deep dive: functionality & game mechanics

Same feature set and mechanics as the standard Eco fork, minus the DA custom wares. See **[DA Eco (standard) deep dive](/x4-modding-wiki/mods/deadair-eco-fork/#deep-dive-functionality--game-mechanics)** for full descriptions of:

- Station enhancements (DAIncreaseStartingStorage, DAImproveHabitation, DAImproveSMDocks, DAImproveStationLayouts)
- Improved defence platforms
- Recipe adjustments (hullparts → claytronics, advanced composites)
- Workforce effects
- Faction Job Helper integration
- Xenon reclaimer + drain-stations

### What's different from the standard fork

Removed:

- **Three custom wares** (`da_mil_schematics`, `da_adv_schematics`, `da_laborunion_contracts`) and all their production modules from `libraries/wares.xml`
- **Corresponding station recipes** in `libraries/god.xml` — DA wares no longer produced at faction stations

Preserved (all standard DA Eco features):

- Station enhancement pipeline (storage / habitation / docks / defence)
- Hullparts recipe swap and other pricing rebalance
- Workforce effects
- Station variety cosmetic connectors
- Job Helper integration for vanilla wares
- Xenon reclaimer, drain-stations, faction economy scripts

### Migrating from the standard fork mid-save

Disable the standard `deadair_eco` extension in the Extensions menu, install this fork, enable it. Existing save with DA wares in trader baskets/cargo should be safe — X4 silently drops unknown ware refs. Test on a copy first.

## Links and source

- **Nexus:** (new mod page)
- **Steam Workshop:** [ws_3758760099](https://steamcommunity.com/sharedfiles/filedetails/?id=3758760099)
- **GitHub:** [mlog4/deadair_eco_no_da_wares](https://github.com/mlog4/deadair_eco_no_da_wares)
- **License:** GPL-3.0

**Original mod:** DeadAirRT.
**No DA Wares strip variant by:** mlog4.
