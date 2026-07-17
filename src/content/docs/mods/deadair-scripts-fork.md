---
title: DeadAir Scripts (mlog4 fork)
description: 9.0-compatible fork of the classic DeadAir Dynamic Universe mod. Full configuration reference — every DA Menu subsystem, every setting, every report, plus deep dives into the mechanics driving the dynamic galaxy.
---

The mlog4 fork of the classic **DeadAir Scripts** (aka Dynamic Universe) by DeadAirRT, maintained under DA's retirement GPL-3.0 grant. Updated for X4 9.0 with all core dynamic-universe features intact plus a new dynamic modded-faction layer that lets Apus, Eternal Twilight and other faction expansions plug straight into DA's expedition and SST systems.

This page is the **full user reference** — every subsystem, every setting, every report menu. If you just want the short pitch, the [mods index](/x4-modding-wiki/mods/) has a one-line summary and a quick-pick guide.

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
4. If you want a vanilla-like experience, apply the **All disabled** preset (Presets → All disabled → Apply).
5. If you're diagnosing an issue, apply the **Debug (verbose logging)** preset — expect heavy `script.log` spam but every subsystem will narrate what it's doing.

> **📷 Screenshot needed:** DA Menu icon location in the Main Menu (highlight where it appears once SirNukes API loads).
> _File: `mainmenu-icon.jpg`_

## In-game menu tour

The DA Menu is your control panel for every mod feature. All settings persist across saves. Toggling features mid-save is safe.

Below is the actual top-level menu as it appears in v3.0-beta1 (mlog094 build):

![DA Mod Main Menu — top-level list](/x4-modding-wiki/img/mods/deadair-scripts/menu-root.jpg)

Top-level layout in menu order:

| Menu label (in-game) | Purpose |
|---|---|
| **Mlog: Configuration Presets** | Apply / manage saved configuration profiles ([details](#presets-system)) |
| **DA Dynamic War** | Periodic AI-to-AI relation shifts ([details](#da-dynamic-war)) |
| **DA Dynamic News** | Logbook + notification feed for galaxy events ([details](#da-dynamic-news)) |
| **DA Evolution** | Xenon adaptive upgrades and job pool sizing ([details](#da-evolution)) |
| **DA Fill** | Trade station / wharf / shipyard restocking ([details](#da-fill)) |
| **DA Jobs** | Faction expeditions + SST patrol quotas + subordinate traders (ST/PST) ([details](#da-jobs)) |
| **DA Gate** | Rogue-gate spawn behavior ([details](#da-gate)) |
| **DA God** | Faction station-building AI overrides ([details](#da-god)) |
| **DA Blueprint Analysis** | Police-scan blueprint acquisition ([details](#da-blueprint-analysis)) |
| **Mlog Trade Optimizer** | Ware-price top-up for factories and trade stations ([details](#mlog-trade-optimizer)) |
| **Mlog: Extension** | Universe-expansion targeting — where factions plan new trade stations, wharfs, shipyards ([details](#mlog-extension)) |
| **Mlog: Cheat** | Observer satellite spawner ([details](#mlog-cheat)) |
| **DA Information Menus** | Reports about the galaxy — trade stations, extension progress, etc. ([details](#reports-and-info-menus)) |

Each section documented below has: **purpose**, **screenshot placeholder**, **every setting** (name, default, effect), and **mechanics notes** where the behavior is non-obvious.

> **Naming convention:** section headings match the in-game menu label so you can find what you see. Setting variable names (`$Ext_Enable` etc.) match the internal MD runtime — useful when reading `script.log` or the source XML.

## Configuration reference

Sections below are ordered to match the in-game menu order. Every heading uses the exact in-game label — Ctrl+F for what you see on screen.

### Mlog: Configuration Presets

*(Documented as a standalone [Presets system](#presets-system) section below — see there for the full description.)*

### DA Dynamic War

**Purpose:** periodic AI-to-AI relation shifts drive galaxy politics on their own. Six event types range from small nudges to instant max-relation flips (declarations of war, alliance pacts, temporary favors, etc.).

**Mechanic in one paragraph:** every `War_Interval` minutes, the war engine picks a random subset of factions (up to `War_PossibleFactionsPerEvent`) and evaluates whether the current relation state warrants an event. Event weights consider proximity, military strength, and the "fatigue" system — factions that recently participated in an event get a cool-down before they can be picked again. Optional favor system (`War_FavorsEnable`) lets factions "call in debts" from prior alliance events.

> **📷 Screenshot needed:** DA Dynamic War submenu — main toggles + interval + PossibleFactionsPerEvent.
> _File: `menu-dynamic-war.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `War_Enable` | `true` | Master toggle. |
| `War_FavorsEnable` | `true` | Enable the favor system — factions can "call in debts" from past events. |
| `War_Interval` | `30` (min) | How often the war engine evaluates. Lower = more frequent shifts. |
| `War_FlavorEnable` | `true` | Enable flavor events (small, thematic relation nudges) alongside major events. |
| `War_DetailedDebug` | `false` | Verbose `[WAR]` log lines. |
| `War_RelationsFixEnable` | `true` | Periodically correct out-of-bounds relations from stray vanilla/mod events. |
| `War_PossibleFactionsPerEvent` | `4` | Max number of factions considered for a single event. Higher = larger politics ripples. |
| `War_FatigueTimer` | `120` (min) | Fatigue cool-down after a faction participates in an event. |
| `War_StatTracking` | `true` | Track war-event statistics for reports/info menus. |
| `War_Fatigue` | `true` | Enable the fatigue system. Turning off = faster / more chaotic politics. |

**Gameplay effect at recommended defaults:** you'll see 1-2 minor events per game hour, and a major shift (war declaration, alliance) every 8-15 hours. Feels organic. In a 100+ hour save you can watch the political map fully redraw itself.

**Turn off if:** you want vanilla static faction relations (some players prefer canonical Argon-Antigone / Split-Paranid tension without evolution).

### DA Dynamic News

**Purpose:** logbook + notification feed for galaxy-scale events. Sector ownership shifts, major station events, notable relation changes get reported like real news bulletins.

**Mechanic in one paragraph:** every `News_Interval` minutes, DA scans the last window of galaxy events (station losses, gate captures, ownership changes) and packages them into player-facing notifications. Optionally filtered to known-factions-only so you don't get spammed with intel about factions you've never met.

> **📷 Screenshot needed:** DA Dynamic News submenu with all toggles.
> _File: `menu-dynamic-news.jpg`_

> **📷 Screenshot needed:** In-game logbook showing a Dynamic News entry.
> _File: `news-logbook-entry.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `News_Enable` | `true` | Master toggle. |
| `News_EnableNotifications` | `true` | Show news as top-of-screen notification popups. |
| `News_EnableLogbook` | `true` | Write news to the player logbook (persistent, browsable later). |
| `News_EnableNewsStorage` | `true` | Store news history internally so the reader menu can browse past bulletins. |
| `News_Interval` | `10` (min) | How often DA generates news. Lower = more chatter. |
| `News_KnownFactionsOnly` | `true` | Only surface events involving factions you've discovered. Recommended — otherwise early-game feels overwhelming. |
| `News_DetailedDebug` | `false` | Verbose `[NEWS]` log lines. |

**Gameplay effect at recommended defaults:** you get about one meaningful news bulletin per hour of play. Feels alive, doesn't spam. Turning `KnownFactionsOnly` off floods the log until you've discovered most factions.

### DA Evolution

**Purpose:** the Xenon evolution engine. Xenon adaptively upgrade their ships across 10 levels × 6 equipment categories (engines, ship mods, shields, weapons, missiles, eco). At certain levels the Xenon also expand their production capacity through shipyard extensions.

**Mechanic in one paragraph:** every `EvoMain_Interval` minutes, DA evaluates player military strength and Xenon losses. Losses accrue "evo points". When accumulated points cross a level threshold, Xenon unlock the next tier of equipment mods across all six categories. Newly-built Xenon ships from that point forward receive the new mods automatically via `apply_equipment_mods`. At levels 1, 3, and 5 the Xenon get additional wharf/shipyard modules for storage / defence / solar / build / miner (which slots grow depends on the `Evo_*Rate` sliders).

> **📷 Screenshot needed:** DA Evolution submenu (main toggles + level cap).
> _File: `menu-evolution.jpg`_

> **📷 Screenshot needed:** DA Evolution → Job Rate sliders (Storage/Defence/Solar/Build/Miner).
> _File: `menu-evolution-rates.jpg`_

#### Main toggles

| Setting | Default | Effect |
|---|---|---|
| `EvoMain_Enable` | `true` | Master toggle. |
| `EvoMain_Interval` | `240` (min = 4h game time) | How often DA re-evaluates the Xenon level. Lower = faster escalation. |
| `EvoMain_PlayerMaxLevel` | `10` | Hard cap on Xenon evolution level (1-10). Lower for a milder endgame. |
| `EvoMain_EnableJobs` | `true` | Allow the Xenon **job pool size** to grow with level. Off = level up equipment but not fleet size. |
| `EvoMain_MaxXenonJobs` | `10` | Multiplier for the Xenon galaxy quota. Each Xenon level adds this many to the pool. |
| `EvoMain_EnableUpgradeStations` | `true` | Allow Xenon shipyards to expand modules at levels 1/3/5. Off = fixed shipyard size. |
| `EvoMain_EnableFastOrder` | `true` | Fast-track new Xenon ships from shipyard queue (skip normal build backlog if already-tier-appropriate). |
| `EvoMain_DetailedDebug` | `false` | Verbose `[EVOLUTION]` log lines. |

#### Job rate multipliers (Evo_*Rate)

Controls which shipyard modules the Xenon build during level-1/3/5 expansions. These are weight ratios — the higher a rate, the more of that module category the Xenon add.

| Setting | Default | Effect |
|---|---|---|
| `Evo_StorageRate` | `1` | Storage modules (holds unfinished ship parts). |
| `Evo_DefenceRate` | `1` | Defence modules (turret platforms on the shipyard). |
| `Evo_SolarRate` | `2` | Solar panels (energy production for the yard). |
| `Evo_BuildRate` | `1` | Build modules (ships-under-construction slots). |
| `Evo_MinerRate` | `2` | Miner-support facilities. |

**Gameplay effect at recommended defaults:** at 10 game-hours a fresh save typically sits at Evolution level 1-2. By 50h you'll see level 4-6 Xenon ships in border sectors — noticeably harder hulls, better weapon range, more armour piercing. By endgame (200h+) level 8-10 Xenon fields significantly tougher hulls than vanilla, and their shipyards produce ships 30-50% faster due to accumulated build/solar expansions.

**Turn off if:** you want vanilla Xenon difficulty curve. Set `EvoMain_Enable = false`.

### DA Fill

**Purpose:** the Station Fill mechanic. Tops up trade stations, shipyards, and wharfs with wares at adjustable intervals. Fixes vanilla's tendency to leave stations sitting half-empty when faction economy stalls. Also handles ship-mod (paint/tuning) topups for the faction ship pool.

**Mechanic in one paragraph:** every `Fill_Interval` minutes, DA walks each faction's stations. For each station, DA computes the target fill (per DA-Eco storage sizing if installed, else vanilla capacity) and orders wares up to that level. Faction-account gating prevents infinite spending — poor factions fill less. Optional `LimitByValue` throttles top-ups when the ware price is high (defer buying overpriced wares until economy stabilizes).

> **📷 Screenshot needed:** DA Fill submenu.
> _File: `menu-fill.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `Fill_Enable` | `true` | Master toggle. |
| `Fill_Interval` | `60` (min) | How often stations get topped up. Lower = more active economy, higher CPU cost. |
| `Fill_ShipModsEnable` | `true` | Include ship equipment mods (engine tunings, shield mods) in the fill pass. |
| `Fill_ShipModFleetEnable` | `true` | Extend ship-mod topups to fleet-tier ships (not just capital ships). |
| `Fill_ShipModPaintEnable` | `true` | Include paintmods so faction ships aren't all default-colored. |
| `Fill_LimitByValue` | `true` | Defer high-price wares — smoothes economy shocks. Off = fill regardless of price. |
| `Fill_XenonProtection` | `true` | Protect Xenon shipyards from over-fill exhaustion (Xenon can't use faction accounts the same way). |
| `Fill_DetailedDebug` | `false` | Verbose `[FILL]` log lines. |

**Gameplay effect at recommended defaults:** you can visit any trade station and reliably find wares available (unlike vanilla where stations often sit at 5% fill for hours). Faction economies stay responsive; player-owned stations still have to compete on price.

### DA Jobs

**Purpose:** parent submenu that groups the three job-related subsystems — long-range Expeditions, per-sector patrol quotas (SST), and the subordinate trader subsystems (ST + PST).

> **📷 Screenshot needed:** DA Jobs — root submenu list, revealing the exact child items (Expeditions / Quotas / ST / PST or nested-different).
> _File: `menu-jobs.jpg`_

> ⚠ Menu tree note: as of writing, ST and PST are documented here as children of DA Jobs. Confirm actual layout when the next screenshot arrives — if they turn out to be separate top-level items, we'll promote them accordingly.

#### Jobs Expeditions

Long-range attack fleets similar to Terran Interventions. An XL flagship + escort tree launches from a faction's shipyard and patrols distant sectors. Each faction gets one active expedition at a time.

**Mechanic in one paragraph:** DA maintains a whitelist of `tag.claimspace` factions eligible for expeditions. Each faction can have 1 galaxy-wide expedition at a time (`galaxy` quota). When a faction's assigned expedition ship dies or completes, DA queues a replacement from a faction shipyard with a full loadout. Vanilla + modded factions with a companion compat mod ([Apus](/x4-modding-wiki/mods/apus-compat/), [ETW](/x4-modding-wiki/mods/etw-compat/)) participate.

| Setting | Default | Effect |
|---|---|---|
| `JobsEXP_Enable` | `true` | Master toggle. |
| `JobsEXP_DetailedDebug` | `false` | Verbose `[JOBSEXP]` log lines. |

**v2.0.0 change:** the initial expedition-eligible faction list is now populated **dynamically** from all `tag.claimspace` factions instead of a hardcoded 8-vanilla list. Modded factions plug in without patching the mod. See [modded-faction support](#modded-faction-dynamic-support) below.

#### Jobs SST (Situational Sector Threat)

Sectors are classified as Critical / Core / Border / Contested. Each faction has fleet quotas per sector role — Critical sectors get heavier patrols than Border. DA's runtime scheduler dynamically orders ships from faction shipyards to keep quotas met.

**Mechanic in one paragraph:** each faction × sector-role × ship-class combo has a Galaxy Quota (max total in the pool) and a Fleet Size (subordinates per patrol). When patrols get destroyed, DA re-queues replacements. Modded factions participate if a companion compat mod is installed; without compat you'll see "No suitable ships available!" on the modded faction's row.

> **📷 Screenshot needed:** DA Jobs → Quotas — root list of factions.
> _File: `menu-jobs-quotas-root.jpg`_

> **📷 Screenshot needed:** Argon quota page — full row list (Critical / Core / Border / Contested Patrol + L/M Trader + L/M Miner + L/M Gas Miner sliders).
> _File: `menu-jobs-quotas-argon.jpg`_

> **📷 Screenshot needed:** A modded faction row (e.g. Apus Stellar Treaty) if compat mod installed — showing full quota rows.
> _File: `menu-jobs-quotas-apus.jpg`_

##### Main toggles

| Setting | Default | Effect |
|---|---|---|
| `JobsSST_Enable` | `true` | Master toggle. |
| `JobsSST_DetailedDebug` | `false` | Verbose `[JOBSSST]` log lines. |
| `JobsSST_XtremelyDetailedDebug` | `false` | Very verbose — every ship-order attempt gets logged. Diagnostic only, huge spam. |
| `JobsSST_RemoveExclusivity` | `true` | Allow multiple factions to patrol the same "Contested" sector simultaneously. Off = classical DA behavior (single dominant patroller per contested sector). |

##### Per-faction quotas

The per-faction quota rows live inside **DA Jobs → Quotas → `<faction>`**. Each row is a slider pair — Galaxy Quota (total ships in the pool) + Fleet Size (subordinates per flagship). These are NOT in the preset scope (they're per-faction nested tables); they're edited directly in the per-faction submenus.

Roles per faction:

- **Critical Sector Patrol** — main-arterial defensive fleets
- **Core Sector Patrol** — inner-territory patrols
- **Border Sector Patrol** — near-hostile-neighbor patrols
- **Contested Sector Patrol** — sectors bordering Xenon or rival faction fronts
- **L Trader** — large-class trade fleet
- **M Trader** — medium-class trade fleet
- **L Miner** — large-class mining fleet
- **M Miner** — medium-class mining fleet
- **L Gas Miner** — large-class gas mining
- **M Gas Miner** — medium-class gas mining

**Gameplay effect at recommended defaults:** any given sector in a lawful faction's Core zone has 2-4 patrol groups active at any time; a Critical sector (with an important shipyard) has 4-8. Xenon incursions get repelled unless heavily outnumbered.

#### Station Traders (ST)

Each player-friendly trade station gets a set of subordinate M-class traders that shuttle wares in/out on the player's behalf. Reduces micromanagement of a sprawling logistics network. Introduced in v3.0-beta1 Phase 2+3+5v2.

**Mechanic in one paragraph:** on discovery of a new trade station belonging to a faction the player is `>= friend` with, DA spawns `ST_QuotaPerStation` M-class traders assigned to that station. Every `ST_ReconcileIntervalMin` minutes DA rebuilds the total roster — replaces destroyed traders, moves excess back to shipyards, migrates orphans when their parent station is destroyed. A **5-sector blacklist** (Earth, Reflected Stars, Towering Wave, Atreus' Clouds, Rolk's Demise) excludes trade stations that sit too close together (added mlog094 via sector.macro references for save-stability).

> **📷 Screenshot needed:** DA Jobs → Station Traders submenu.
> _File: `menu-station-traders.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `ST_Enabled` | `true` | Master toggle. |
| `ST_QuotaPerStation` | `20` | M-traders per trade station. Higher = denser logistics, more CPU cost. |
| `ST_ReconcileIntervalMin` | `30` (min) | How often the reconcile pass runs (rebuild roster, cleanup dead entries). |
| `ST_DebugVerbose` | `false` | Verbose `[ST]` log lines. |

**Blacklist:** the 5 close-neighbor sectors do NOT get subordinate traders. This isn't in the menu — it's hardcoded via sector.macro in [`md/mlog_da_station_traders.xml`](https://github.com/mlog4/deadair_scripts). You can dump the runtime blacklist status via mlog_dev_bridge (developer feature).

#### Prod Station Traders (PST)

Analog of ST for **production factories** (not trade stations). Each factory gets subordinate M-traders that specifically shuttle inputs/outputs for that recipe. Introduced in v3.0-beta1 Phase 4.

> **📷 Screenshot needed:** DA Jobs → Prod Station Traders submenu.
> _File: `menu-prod-station-traders.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `PST_Enabled` | `true` | Master toggle. |
| `PST_QuotaPerStation` | `2` | M-traders per factory. Lower than ST because factories usually have fewer wares in play. |
| `PST_ReconcileIntervalMin` | `60` (min) | Reconcile pass interval. |
| `PST_DebugVerbose` | `false` | Verbose `[PST]` log lines. |

### DA Gate

**Purpose:** governs "rogue gate" spawn behavior — accidental / dynamic gate discoveries that can rewrite the connectivity map.

> **📷 Screenshot needed:** DA Gate submenu.
> _File: `menu-gate.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `Gate_Enable` | `true` | Master toggle. |
| `Gate_ShowAllGates` | `false` | Reveal every gate on the map from gamestart. Removes exploration challenge; useful for testing / role-play. |
| `Gate_DetailedDebug` | `false` | Verbose `[GATE]` log lines. |

### DA God

**Purpose:** override / augment the vanilla God engine (which controls faction station creation). DA can accelerate or gate station requests, expand attempted recovery on failed builds, and change the max module count factions try to grow to.

> **📷 Screenshot needed:** DA God submenu.
> _File: `menu-god.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `God_Enable` | `true` | Master toggle. |
| `God_StationRequestInterval` | `1` (hours) | How often DA re-evaluates station creation demand. Lower = faster faction expansion. |
| `God_AllowBuildInFriendly` | `true` | Allow factions to build in each other's friendly sectors (subject to relations). |
| `God_AllowBuildInPlayer` | `true` | Allow factions to build inside player-owned sectors (subject to your relation with them). Turn off to keep player space clean. |
| `God_AttemptRecovery` | `true` | Retry failed builds after a delay. Off = one-shot attempt per plan. |
| `God_StationUpgradeEnable` | `true` | Allow factions to expand existing stations by adding modules. |
| `God_MaxModuleSetting` | `40` | Max modules a single station may grow to. Higher = megastations, more CPU. |
| `God_DetailedDebug` | `false` | Verbose `[GOD]` log lines. |
| `God_XtremelyDetailedDebug` | `false` | Very verbose — every station-request evaluation logged. |

**Gameplay effect at recommended defaults:** factions actively grow their industry. A 50-hour save typically has 15-25 more stations galaxy-wide than vanilla. `God_MaxModuleSetting = 40` is a good balance — larger stations look impressive but CPU cost grows.

**mlog094 note (v3.0-beta1):** God-created stations respect the `hasstagedconstruction` guard so they participate in DA's staged expand-station mechanic rather than one-shot instant builds.

### DA Blueprint Analysis

**Purpose:** police assets scan enemy ships for blueprint fragments. Once a ship's blueprint accumulates enough fragments across scans, the blueprint is awarded to the player.

**Mechanic in one paragraph:** works with the vanilla `policeassetscannedship` engine signal. Fires when your police-tagged ship scans an enemy ship. Each scan awards fragments; the fragments-per-scan and required-total are configurable per macro class (S/M/L/XL). Once a specific ship's fragment total reaches the requirement, the blueprint is added to your bank.

> **📷 Screenshot needed:** DA Blueprint Analysis submenu.
> _File: `menu-blueprint.jpg`_

> **📷 Screenshot needed:** In-game notification when a blueprint fragment is collected.
> _File: `bp-scan-notification.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `BP_Enable` | `true` | Master toggle. |
| `BP_DebugEnable` | `false` | Verbose `[BP]` log lines. |
| `BP_UnknownClassRequirement` | `20` | Fragments needed for an unknown-class ship blueprint (default fallback when no macro-specific rule applies). |

### Mlog Trade Optimizer

**Purpose:** economic top-up pass that walks trade stations and production factories, adjusting ware prices when supply is stuck / demand is high. Keeps the price signal moving so vanilla NPC traders don't stall on flat prices.

> **📷 Screenshot needed:** Mlog Trade Optimizer submenu.
> _File: `menu-trade-optimizer.jpg`_

| Setting | Default | Effect |
|---|---|---|
| `TradeOpt_Enable` | `true` | Master toggle. |
| `TradeOpt_Interval` | `300` (min = 5h game time) | How often the optimizer runs. Long by design — economic churn shouldn't be sub-hourly. |
| `TradeOpt_ProcessTradeStations` | `true` | Include trade stations in the pass. |
| `TradeOpt_ProcessFactories` | `true` | Include production factories in the pass. |

### Mlog: Extension

**Purpose:** governs when and where factions plan new economic expansion — additional trade stations, wharfs, shipyards. Introduced in mlog062+. Uses a 6h TTL on failed-build attempts (mlog087) so that failed placements don't permanently block a cluster.

**Mechanic in one paragraph:** the Extension observer polls faction wharf/shipyard counts every 30 min. When a faction has fewer than expected assets and a valid extension target exists (distant enough from existing owned space per `MinDist*`), it queues a build request. Failed placements are tracked with a timestamp; after 6 hours of game time the block is cleared and the cluster becomes eligible again.

> **📷 Screenshot needed:** DA Menu → Extension submenu, showing all Extension_* sliders.
> _File: `da-scripts-menu-extension.png`_

| Setting | Default | Effect |
|---|---|---|
| `Ext_Enable` | `true` | Master toggle. Off = no extension planning at all. |
| `Ext_EnableLog` | `false` | Emit `[EXT]` debug lines to `script.log`. Turn on to diagnose why a build isn't happening; expect heavy spam. |
| `Ext_AllowFactionTradeStation` | `true` | Allow expansion of **trade stations** (peaceful factions). |
| `Ext_MinDistTradeStation` | `2` (jumps) | Minimum jump distance from the faction's existing trade station to allow a new one. `0` = allow same sector; `2` = must be at least 2 jumps away. Prevents clustering. |
| `Ext_AllowFactionWharfShipyard` | `true` | Allow expansion of **wharfs and shipyards** for lawful factions. |
| `Ext_MinDistFactionWharfShipyard` | `5` (jumps) | Minimum jump distance for new wharf/shipyard sites. Higher = more spread out. |
| `Ext_AllowXenonWharfShipyard` | `true` | Allow Xenon to expand their own wharfs and shipyards. |
| `Ext_MinDistXenonWharfShipyard` | `2` (jumps) | Minimum jump distance between Xenon shipyards. Lower than lawful factions since Xenon expand more aggressively. |

**Gameplay effect at recommended defaults:** every faction attempts to grow. Peaceful factions add trade stations in newly-secured sectors after ~5-15 game hours; wharfs after 20-40h. Xenon rebuild shipyards after you demolish one (unless you also cap-nuke their supply chain).

**Turn off if:** you want a fixed-map, static-economy experience where factions never expand beyond their gamestart assets. Set all three `Allow*` flags to `false`.

### Mlog: Cheat

**Purpose:** the developer / testing menu. Currently exposes the **Observer Satellite** spawner (an invisible always-friendly satellite you can drop for map reconnaissance without triggering the police-scan penalty of a normal sat).

> **📷 Screenshot needed:** Mlog: Cheat submenu → Observer Satellite button.
> _File: `menu-cheat.jpg`_

Not a preset-controlled subsystem — you use it or you don't. If you never want to see it, ignore the menu row.

### DA Information Menus

Read-only report menus about the current galaxy state. Full catalog: see [Reports and info menus](#reports-and-info-menus) below.

## Presets system

**Purpose:** apply an entire configuration profile in one click instead of touching 60+ sliders individually. Introduced in v3.0-beta1 Phase B (mlog080+).

**Three built-in presets ship with the mod:**

| Preset | ID | Intent |
|---|---|---|
| **Default (recommended)** | `default` | Most feature masters ON with sensible values. Match to the user's slot 1 preferences (validated by user testing). Use this as your primary configuration. |
| **All disabled** | `all_off` | Every master toggle OFF. Sub-features and DA rates stay at DA-vanilla defaults so re-enabling a subsystem later gives sane behavior. Vanilla-like experience with the mod loaded. |
| **Debug (verbose logging)** | `debug` | All masters ON with every `*_DetailedDebug` flag ON. Useful for issue reporting and development sessions. Expect heavy `script.log` spam. |

The Presets submenu in v3.0-beta1:

![Mlog: Configuration Presets — 3 built-in profiles with Apply buttons](/x4-modding-wiki/img/mods/deadair-scripts/menu-presets.jpg)

Layout:
- **Currently applied:** shows the ID of the last-applied preset (`(none)` if no preset applied yet, or the ID of whichever built-in was applied last).
- **Built-in presets** — three rows: `All disabled`, `Debug (verbose logging)`, `Default (recommended)`. Each row = one **Apply** button.
- **Footer note:** "Applying a preset overwrites current settings. You can still tweak individual values in the other menus after."

**Apply mechanism:** clicking **Apply** on a preset writes every field in the preset's `$settings` table to the corresponding DA runtime variable. Fields NOT present in the preset are left untouched (so future extensions of the preset scope don't reset existing user tweaks). Applied state persists across saves; the `last_applied_id` is tracked so the menu can visually indicate which preset is active.

**82 fields covered** across all 14 subsystems (as of mlog086). Fields NOT yet in preset scope: per-faction Jobs Quotas (nested tables — Phase B v2 scope) and per-station ST/PST overrides.

**Making your own preset:** currently custom presets are code-only (add a new entry to `md/mlog_da_presets.xml` registry). A UI-driven "Save current as preset" feature is planned for Phase B v2.

## Reports and info menus

DA ships several read-only info/report menus surfaced via **DA Menu → DA Information** (or a top-level shortcut, depending on where you land). Each report is a snapshot of live game state formatted for browsing.

> **📷 Screenshot needed:** DA Menu → DA Information — root list of all reports.
> _File: `da-scripts-menu-info-root.png`_

### Trade Stations Report

Introduced mlog088-089. Lists every trade station galaxy-wide with faction, sector, subordinate count, and storage capacity.

Columns:

| Column | Meaning |
|---|---|
| **ID** | 3-4 char station idcode (e.g. `VZX-868`). |
| **Fac** | 3-letter faction shortname (e.g. `ARG`, `TER`, `PIO`). |
| **Sector** | Sector known-name. |
| **M subs** | Number of M-class subordinate ships (traders, mostly). |
| **Cont M** | Container-storage capacity, millions of m³ (raw max, not fill). |
| **L/S M** | Liquid + Solid storage capacity, millions of m³. |

Sort key: composite `faction shortname + '/' + sector name` — stations group by faction, sector-sorted within.

**Storage units:** internal m³ divided by 1,000,000. Sub-1M capacities show as `0`.

> **📷 Screenshot needed:** Trade Stations Report — full view with several factions visible.
> _File: `da-scripts-report-tradestations.png`_

### Extension progress reports

The Extension subsystem reports which sectors have been evaluated as expansion targets and what the current "Built" tracking says (per mlog087 6h TTL).

> **📷 Screenshot needed:** DA Menu → DA Information → Extension report (whichever submenu exposes the observed clusters + Built lists).
> _File: `da-scripts-report-extension.png`_

### Xenon Evolution status

Current Xenon level, per-category equipment mod status, and next-level ETA / accumulated points.

> **📷 Screenshot needed:** DA Menu → DA Information → Xenon Evolution report.
> _File: `da-scripts-report-xenon-evolution.png`_

### Dynamic War stats

If `War_StatTracking = true`, DA records historical events and displays them here — event counts per faction, favor ledger, fatigue timers.

> **📷 Screenshot needed:** DA Menu → DA Information → Dynamic War stats.
> _File: `da-scripts-report-war-stats.png`_

### Blueprint scan status

Per-ship-class blueprint fragment progress — how many fragments you've collected against the requirement.

> **📷 Screenshot needed:** DA Menu → DA Information → Blueprint Scan progress.
> _File: `da-scripts-report-bp-progress.png`_

### Additional reports

Other reports may exist depending on installed subsystems — the report list is dynamic. If you have a submenu the docs don't cover here, please open a Nexus / GitHub issue with a screenshot.

## Mechanics deep dive

### Modded-faction dynamic support

**v2.0.0 architecture.** Instead of hardcoding vanilla-only faction lists for expedition eligibility, DA queries `get_factions_by_tag tag="tag.claimspace"` at runtime. Any faction with that tag is a candidate. This lets Apus, ETW, and future faction mods participate without patching DA.

Companion mods provide the actual expedition/SST job templates:

- **[Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/)** — Apus Stellar Treaty
- **[ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/)** — Eternal Twilight (3 factions)

Without a compat mod, the modded faction shows in the Jobs SST menu with "No suitable ships available!" — the roster query succeeds (faction is enumerated) but no matching job template exists to build ships from.

### Kill-based Xenon Evolution XP

Xenon evolution "points" accrue on **kills only**, not damage. Ship-mode damage without a kill = no XP contribution. This is by design — chip-damage from repeated engagements shouldn't cascade into runaway evolution.

### Save-safety

Every DA setting persists across save/load. Turning features on/off mid-save is safe — DA does state validation on load and re-applies preset semantics via the reconcile passes. If you change a preset mid-save, the new preset applies immediately without needing a save/reload.

**Exception:** the Presets system's runtime registry is rebuilt on every game load / start (mlog080+ pattern). This means edits to `md/mlog_da_presets.xml` between saves get picked up on the next load — but only after a full X4 restart, since MD scripts are cached at engine boot.

### 6h TTL on Extension Built lists

**mlog087 fix.** Previously a failed build attempt permanently blocked a cluster for that faction. If Zyarth's first shipyard attempt in Wretched Skies V failed for any reason, they'd never try again. Now Built entries carry a `player.age` timestamp; the observe cue re-evaluates entries older than 6 game-hours as fresh candidates.

**Data migration:** legacy raw cluster refs get a 6h grace period from the first observe pass (typeof check preserves backward-compat).

### Global integration points

DA integrates with vanilla systems at several points:

- **`md.Setup.GameStart`** — Init cue trigger; DA installs its runtime globals.
- **`md.Guidance.NewTarget`** — for cross-cluster player-target commands from DA menu buttons.
- **`policeassetscannedship`** engine signal — Blueprint Scanning subscription point.
- **`event_object_destroyed`** — Xenon Evolution kill counter + Station Traders reconcile trigger.
- **`event_god_created_station`** / **`event_god_created_factory`** — trigger points for the mlog_da_extension / God passes.

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
