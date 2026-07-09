---
title: DeadAir Scripts (No DA Wares fork)
description: DA Scripts stripped of the three DA-Eco custom wares — runs cleanly with any economy layer (VRO, X4-Reemergence, vanilla, or matching No DA Wares Eco fork).
---

Variant of the **[DeadAir Scripts (mlog4 fork)](/x4-modding-wiki/mods/deadair-scripts-fork/)** with all references to the three DA-Eco custom wares (`da_mil_schematics`, `da_adv_schematics`, `da_laborunion_contracts`) stripped. Runs cleanly without any DA Economy Overhaul companion mod.

## When to use this variant

Use the **No DA Wares fork** if:

- You play with **Variety and Rebalance Overhaul (VRO)** and want its economy tuning uncluttered
- You play with **X4-Reemergence** (when it lands on 9.0) and use its own economy tuning
- You run **vanilla economy** (no economy overhaul) and don't want the DA custom wares showing up in trade menus
- You want the DA gameplay features (Dynamic War, Xenon Evolution, Jobs Expeditions, etc.) but not the DA ware layer

Use the **[standard DA Scripts fork](/x4-modding-wiki/mods/deadair-scripts-fork/)** if you want the full DA experience with the custom wares present, paired with DA Economy Overhaul.

## What's different from the standard fork

**Same:**
- All gameplay features (Dynamic War, Dynamic News, Xenon Evolution, Station Fill, Jobs Expeditions, Jobs SST, Blueprint Scanning, in-game menu, dynamic modded-faction support)
- All X4 9.0 compat fixes (mlog013dyn build tag)
- Save-game compat and DA menu

**Different:**
- **Station Calculator table stripped** — 60 production-recipe entries with a secondary DA ware column had their DA ware columns replaced with `null,0`. Three DA ware definition rows removed.
- **No DA Eco dependency** — `content.xml` drops the `<dependency id="DeadAir_Eco">` line.
- **Runs standalone** with any Eco mod (or none).

## Requirements

- **X4 Foundations 9.0** or newer
- **SirNukes Mod Support APIs** — required for the DA menu ([Nexus](https://www.nexusmods.com/x4foundations/mods/503))
- **All Egosoft DLCs** — all optional; mod adapts to what you have

**Optional companion mods:**
- **Variety and Rebalance Overhaul (VRO 5.01)** — recommended combat/balance overhaul, works cleanly with this fork
- **DeadAir Economy Overhaul (No DA Wares fork)** — matching No DA Wares Eco fork if you want DA's economy tuning without the custom wares

## Installation

### Nexus (manual)
1. Download `mlog_deadair_scripts_no_da_wares_v2.0.0.zip` from Nexus
2. Extract into `X4 Foundations/extensions/`
3. Folder should be named `mlog_deadair_scripts_no_da_wares`
4. Launch X4 → Extensions menu → verify it's enabled

### Steam Workshop
Subscribe to [ws_3758753077](https://steamcommunity.com/sharedfiles/filedetails/?id=3758753077). Steam handles the install; the mod appears in the Extensions menu on next X4 launch.

## Recommended setup with VRO 5.01

The go-to combo for a 9.0 modded playthrough:

1. **Variety and Rebalance Overhaul (VRO 5.01)** — [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=1696862840) or [Nexus](https://www.nexusmods.com/x4foundations/mods/305)
2. **SirNukes Mod Support APIs** — [Nexus mods/503](https://www.nexusmods.com/x4foundations/mods/503)
3. **DeadAir Scripts (No DA Wares fork)** — this mod
4. Optional: **DeadAir Economy Overhaul (No DA Wares fork)** — matching Eco variant

This gives you VRO's ship/weapon/balance changes, plus the DA dynamic-universe layer sitting on top with zero ware collisions.

**Important:** VRO requires a new game start. Existing vanilla saves are not compatible with VRO.

## Configuration

Identical to the standard fork — see [DeadAir Scripts (standard) configuration](/x4-modding-wiki/mods/deadair-scripts-fork/#configuration).

## Compatibility

Same as standard fork with the following caveats:

| Mod | Works? | Notes |
|-----|--------|-------|
| **Variety and Rebalance Overhaul (VRO 5.01)** | ✅ Optimal | This is what the No DA Wares variant is designed for |
| **DeadAir Economy Overhaul (standard)** | ⚠️ Redundant | The standard Eco fork adds DA wares back. If you want that, use the [standard Scripts fork](/x4-modding-wiki/mods/deadair-scripts-fork/) instead |
| **DeadAir Economy Overhaul (No DA Wares fork)** | ✅ Recommended | Matching companion Eco fork |
| **X4-Reemergence** | ❌ Not yet — RE isn't on 9.0 | Waiting on RE 1.9 update |
| **Apus Stellar Treaty** | ✅ Yes — pair with [Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/) | Full DA integration |
| **Eternal Twilight Expansion** | ✅ Yes — pair with [ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/) | Full DA integration |

## Troubleshooting

Same troubleshooting as the standard fork. See [DA Scripts (standard) troubleshooting](/x4-modding-wiki/mods/deadair-scripts-fork/#troubleshooting).

### Migrating from the standard fork

Disable the standard `deadair_scripts` extension in the Extensions menu, install this fork, enable it. If your save has references to DA wares in trader baskets, X4 silently drops unknown ware refs, so this fork should be safe to switch to mid-save. Test on a copy first.

## Links and source

- **Nexus:** (see the Nexus mods index — new page)
- **Steam Workshop:** [ws_3758753077](https://steamcommunity.com/sharedfiles/filedetails/?id=3758753077)
- **GitHub:** [mlog4/deadair_scripts_no_da_wares](https://github.com/mlog4/deadair_scripts_no_da_wares)
- **License:** GPL-3.0 (inherited from upstream)

**Original mod:** DeadAirRT.
**No DA Wares strip variant by:** mlog4.
