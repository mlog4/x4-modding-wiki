---
title: DeadAir Scripts (mlog4 fork)
description: 9.0-compatible fork of the classic DeadAir Dynamic Universe mod. Overview + link to per-menu setting references and mechanic deep dives.
---

The mlog4 fork of the classic **DeadAir Scripts** (aka Dynamic Universe) by DeadAirRT, maintained under DA's retirement GPL-3.0 grant. Updated for X4 9.0 with all core dynamic-universe features intact plus a new dynamic modded-faction layer that lets Apus, Eternal Twilight and other faction expansions plug straight into DA's expedition and SST systems.

Every DA Menu subsystem has its own page below — installation and top-level tour first, then click through to whatever you want to configure.

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — required for the DA menu and all report/preset UIs
- **[DeadAir Economy Overhaul (mlog4 fork)](/x4-modding-wiki/mods/deadair-eco-fork/)** — optional but strongly recommended companion (Economy layer expected by the ST/PST subsystems)
- **All Egosoft DLCs** — all optional; mod adapts to what you have

### Install

- **Nexus (manual):** Download the latest ZIP from [mods/2205](https://www.nexusmods.com/x4foundations/mods/2205), extract into `X4 Foundations/extensions/` (folder must be named `deadair_scripts`).
- **Steam Workshop:** Subscribe to [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765). Steam handles the install.

### First-time setup

1. Launch a game.
2. Open **Main Menu → DA Menu** (icon appears once SirNukes API is loaded).
3. The mod ships with the **Default (recommended)** preset applied automatically. Most features are enabled with sensible values.
4. If you want a vanilla-like experience, apply the **All disabled** preset ([Presets → All disabled → Apply](./configuration/presets/)).
5. If you're diagnosing an issue, apply the **Debug (verbose logging)** preset — expect heavy `script.log` spam but every subsystem will narrate what it's doing.

> **📷 Screenshot needed:** DA Menu icon location in the Main Menu (highlight where it appears once SirNukes API loads).
> _File: `mainmenu-icon.jpg`_

## In-game menu tour

The DA Menu is your control panel for every mod feature. All settings persist across saves. Toggling features mid-save is safe.

Below is the actual top-level menu as it appears in v3.0-beta1 (mlog094 build):

![DA Mod Main Menu — top-level list](/x4-modding-wiki/img/mods/deadair-scripts/menu-root.jpg)

Every menu label below is a link to its own reference page:

| Menu label (in-game) | What it controls |
|---|---|
| **[Mlog: Configuration Presets](./configuration/presets/)** | One-click configuration profiles (Default / All disabled / Debug). |
| **[DA Dynamic War](./configuration/dynamic-war/)** | Periodic AI-to-AI relation shifts. |
| **[DA Dynamic News](./configuration/dynamic-news/)** | Logbook + notification feed for galaxy events. |
| **[DA Evolution](./configuration/evolution/)** | Xenon adaptive upgrades + job pool sizing. |
| **[DA Fill](./configuration/fill/)** | Trade station / wharf / shipyard restocking. |
| **[DA Jobs](./configuration/jobs/)** | Faction Expeditions + SST patrol quotas + subordinate traders (ST/PST). |
| **[DA Gate](./configuration/gate/)** | Rogue-gate spawn behavior. |
| **[DA God](./configuration/god/)** | Faction station-building AI overrides. |
| **[DA Blueprint Analysis](./configuration/blueprint-analysis/)** | Police-scan blueprint acquisition. |
| **[Mlog Trade Optimizer](./configuration/trade-optimizer/)** | Ware-price top-up for factories and trade stations. |
| **[Mlog: Extension](./configuration/extension/)** | Universe-expansion targeting — where factions plan new trade stations, wharfs, shipyards. |
| **[Mlog: Cheat](./configuration/cheat/)** | Observer satellite spawner (dev/testing menu). |
| **[DA Information Menus](./reports/)** | Read-only reports about the current galaxy state. |

> **Naming convention:** page titles match the in-game menu label so you can find what you see. Setting variable names (`$Ext_Enable` etc.) match the internal MD runtime — useful when reading `script.log` or the source XML.

## Deep dives

Cross-cutting architecture and internals: **[Mechanics deep dive](./mechanics/)** — modded-faction dynamic support, kill-based Xenon XP, save-safety, 6h Extension TTL, engine integration points.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Original DeadAir Scripts by DeadAirRT** | ❌ Conflict | This IS the fork; don't install both. Disable/remove upstream. |
| **DeadAir Scripts (No DA Wares fork)** | ❌ Conflict | Alternative variant — pick one, not both. |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. Waiting on RE v1.9 update. |
| **Everything else** | ✅ Compatible | VRO 5.01, SirNukes, DA Eco, Apus, ETW, Galactic Heroes, Zero-Transporter, mlog_dev_bridge — all coexist cleanly. |

## Links and source

- **Nexus:** [mods/2205](https://www.nexusmods.com/x4foundations/mods/2205)
- **Steam Workshop:** [ws_3757960765](https://steamcommunity.com/sharedfiles/filedetails/?id=3757960765)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts)
- **License:** GPL-3.0 (inherited from upstream)

**Original mod:** DeadAirRT — retired mid-2025, granted GPL-3.0 for continuation.
**9.x compat fork by:** mlog4.

## Version notes

**v3.0-beta1 (mlog094 build):**

- Extension mechanic with 6h TTL on failed-build blocks (mlog087)
- Configuration Presets system with 3 built-in profiles (mlog080-086)
- Trade Stations Report (mlog088-089)
- Station Traders (ST) + Prod Station Traders (PST) subsystems
- 5-sector blacklist for ST close-neighbor sectors (mlog090-094, sector.macro-based, stable across saves)
- Xenon miner subordinate jobs (`mlog_xen_subordinate_miner_m`)
- Cheat Menu with Observer Satellite spawner
- Bug fixes: JobsSST exclusivity, ST/PST default states in preset, apostrophe-sector name workaround via macros

Previous milestones: **v2.0.0** (dynamic modded-faction support, Trade Optimizer, expedition dynamic enumeration).
