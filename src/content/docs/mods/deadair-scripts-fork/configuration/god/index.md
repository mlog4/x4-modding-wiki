---
title: DA God
description: DA's replacement for vanilla God — controls faction station-building AI. 9 options + one-time bootstrap button + God Quotas per-faction per-ware module targets.
sidebar:
  order: 8
---

DA's replacement for the vanilla God engine (the AI system that decides when and where factions build new stations / add modules). DA takes over the module-request pipeline, adds per-faction module quotas, and lets the player configure aggression, sector-permission scope, and station-size ceiling.

## In-game view

![DA God main menu — 9 options + Shortcut section + God Quotas sub-menu link](/x4-modding-wiki/img/mods/deadair-scripts/menu-god.jpg)

Layout:

- **Top section (`DA God Options`)** — 9 configurable fields covering master toggle, build interval, sector permissions, upgrades, station-size ceiling, and 2 debug channels.
- **Middle section (`DA God Shortcut`)** — one-time bootstrap button (displays `Already Activated All Factions` after use).
- **Bottom section (`DA God Menus`)** — 1 sub-menu: [God Quotas](./quotas/).

## DA God Options

### Master + interval

| Setting | Default | Effect |
|---|---|---|
| **Enable DA God** | `Enabled` | Master toggle for the whole subsystem. `$DAGodEnable` in source. When off, DA relinquishes station-build control and vanilla God takes over. |
| **Station Build Interval Multiplier** | `1` | Multiplier on how often DA re-evaluates station-creation demand. Slider range `1..max(5, 2×current)`. Lower = more aggressive faction expansion. Higher = calmer, less CPU. `$DAGodStationRequestInterval`. |

### Sector-permission scope

| Setting | Default | Effect |
|---|---|---|
| **Allow Build in Friendly Owned Sector** | `Enabled` | Allows factions to build in each other's friendly sectors (subject to relations). Off = factions only build in sectors they own themselves. `$DAGodAllowBuildInFriendly`. |
| **Allow Build in Player Owned Sector** | `Enabled` (only editable when Allow Build in Friendly is on) | Allows factions to build inside sectors the player owns (subject to the player's relation with them). Off = keeps player space clean of AI construction. `$DAGodAllowBuildInPlayer`. |

### Behavior

| Setting | Default | Effect |
|---|---|---|
| **Attempt Recovery** | `Enabled` | Retry failed builds after a delay. Off = one-shot per plan; failed builds stay failed. `$DAGodAttemptRecovery`. |
| **Enable Ship Building Station Upgrades** | `Enabled` | Allow factions to expand existing shipyards/wharfs by adding modules (not just constructing new ones). Off = existing yards stay at initial size. `$DAGodStationUpgradeEnable`. |
| **Station Max Module Setting** | `40` (slider 10-40) | Max module count a single station may grow to. Higher = megastations. Above 30 triggers a warning ({33232474,2343}) if DA Eco is installed — huge stations degrade Eco processing time. `$DAGodMaxModuleSetting`. |

### Debug

| Setting | Default | Effect |
|---|---|---|
| **Enable God Debug** | `Disabled` | Verbose `[GOD]` log lines with per-station decision reasoning. `$DAGodDetailedDebug`. |
| **Enable God Extra Debug** | `Disabled` | Very verbose — every station-request evaluation logged including staging state. Huge spam, diagnostic only. `$DAGodXtremelyDetailedDebug`. |

## DA God Shortcut

A one-time bootstrap button (see [`md/deadairdynamicuniversemenus.xml:6254-6300`](https://github.com/mlog4/deadair_scripts)) that walks the entire `$DAGodFactionModuleQuotas` table and triggers the "expand every faction's stations up to their quota" pipeline in one shot.

- If any faction still has non-triggered quotas, the button shows **"Trigger Ready Factions (N)"** in green (N = count of pending factions).
- Once every faction with quotas has been activated, the button becomes static text **"Already Activated All Factions"** — as seen in the observed screenshot.

**Effect:** kicks off a batch of `Expand_Station_Order` operations, one per faction/ware pair with pending modules. Each affected station in the galaxy may add up to its ware's `Additional Modules to Build` count.

**When to press:** at gamestart, once, after you've reviewed [God Quotas](./quotas/) and are satisfied with the numbers. In the observed save it has been pressed already (button is now static text).

## DA God Menus

- **[God Quotas](./quotas/)** — per-faction, per-ware "Additional Modules to Build" targets. Displays what the bootstrap button will actually request.

## Preset scope

7 of the 9 options are in [Configuration Presets](../presets/) scope: Enable DA God, Station Build Interval Multiplier, both Allow-Build toggles, Attempt Recovery, Ship Building Station Upgrades, both debug flags. The **Station Max Module Setting slider** and the **Shortcut button** are not in preset scope.

## Known issue on X4 9.0 — staged construction

X4 9.0 changed vanilla so that **~100% of stations report `hasstagedconstruction = true`** from the moment they're created (staged construction is now the vanilla default flow, not an opt-in). DA's God pipeline has two branches:

- **Non-staged path** ([`md/deadairdynamicuniverse.xml:11116`](https://github.com/mlog4/deadair_scripts)) — adds modules directly. Rarely hit in 9.0 because almost no stations qualify.
- **Staged-with-future-stage path** (line 11131) — adds modules to the next staged build phase. Also often skipped because stations frequently don't have a `hasfutureconstructionstage`.

The result is that DA God's module-addition pipeline is largely a no-op on 9.0 — factions build the initial stations but rarely get expansion. Fix requires migrating to `<add_build_to_expand_station>` for the staged path (estimated 6-10 hours of work; not yet done in v3.0-beta1-mlog065).

**Practical impact:** the `Station Max Module Setting` slider still applies to any station that does grow, but organic AI-driven expansion beyond the initial build is uncommon. Presses of the Shortcut button will queue the requests but they may not all resolve into actual module adds.

## Gameplay effect at recommended defaults

- **Vanilla comparison:** vanilla God expands stations at a modest rate; DA God (when working) accelerates this significantly.
- **Sector density:** with Allow Build in Friendly on, factions cross-populate each other's territory — expect Argon stations in Antigone space and vice versa.
- **CPU cost:** Higher `Station Max Module Setting` (40) with an active God pipeline produces impressive-looking mega-stations but costs CPU per tick. Consider 30 for calmer performance.
- **Player-space isolation:** turn off Allow Build in Player Owned Sector if you don't want AI factories cluttering your homebase sector.
