---
title: Apus Compat Patch
description: Full DeadAir Scripts integration for the Apus Stellar Treaty faction. XL expedition flagships, dynamic patrols, full quota menu integration.
---

Companion mod that lets the **Apus Stellar Treaty** faction (by Cyber1j1e) participate fully in **DeadAir Scripts**' Jobs — Expeditions AND Jobs — Situational Sector Threat (SST) systems alongside vanilla factions. Adds 28 job templates (1 expedition + 27 SST) that mirror DA's own vanilla-faction template shape.

## Installation & configuration

### Requirements

- **[Apus Stellar Treaty](https://www.nexusmods.com/x4foundations/mods/2189)** by Cyber1j1e — [Steam ws_3751955071](https://steamcommunity.com/sharedfiles/filedetails/?id=3751955071) — **hard dependency**
- **DeadAir Scripts** ([standard fork](/x4-modding-wiki/mods/deadair-scripts-fork/) or [No DA Wares fork](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/)) — recommended (compat is inert without it)
- **X4 Foundations 9.0** or newer

### Install

- **Nexus (manual):** Download `mlog_da_apus_compat_v2.0.0.zip`, extract into `X4 Foundations/extensions/` (folder must be named `mlog_da_apus_compat`).
- **Steam Workshop:** Subscribe to [ws_3760545874](https://steamcommunity.com/sharedfiles/filedetails/?id=3760545874). Steam auto-installs the Apus dependency.

### Verification

Right after loading a new game:

1. Open DA menu → **Jobs → Jobs Quotas**
2. Scroll to **Apus Stellar Treaty (AST)**
3. Should show full quota rows (Critical / Core / Border / Contested Sector Patrol + L/M Trader + L/M Miner) with working sliders

If you see **"No suitable ships available!"** for AST — the compat mod is not loaded. Check that the folder is `X4 Foundations/extensions/mlog_da_apus_compat/content.xml` (not nested one level deeper), and that it's enabled in the Extensions menu.

### Configuration

The compat mod itself has no settings — it registers jobs that DA controls. Adjust Apus's fleet sizes via the standard DA menu → Jobs Quotas — same sliders as for vanilla factions.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Apus Stellar Treaty** (v3.0+) | ✅ Required | Hard dependency. |
| **DeadAir Scripts** (either variant) | ✅ Yes | Full DA integration for Apus. |
| **DeadAir Economy Overhaul** (either variant) | ✅ Yes | Apus stations get DA-Eco enhancements. |
| **ETW Compat Patch** | ✅ Yes | Both compat mods coexist cleanly. |
| **VRO 5.01** | ✅ Yes | Apus is Terran-race, works with VRO ship pool. |
| **No known conflicts otherwise** | — | Compat mod is a small pure-XML addition; nothing to conflict with. |

## Deep dive: functionality & game mechanics

### What the 28 job templates do

**1 expedition job (`apus_stellar_treaty_expedition_DA`):**
- Category: `[daexpedition]` tag, size `ship_xl`
- Ship selector: `<select faction="apus_stellar_treaty" tags="[military]" size="ship_xl"/>` — picks from Apus's XL military hulls (Constellation, Asgard, Freyr, Carrier Freyr)
- Subordinates: 2× destroyer escort, 2× frigate escort, 1× fighter carrier
- Default order: Patrol, range `class.sector`
- Quota: galaxy 1, maxgalaxy 1 (only ever one expedition alive at a time)
- Location: `xu_ep2_universe_macro`, faction-owned space, relation self

**12 patrol jobs** (Critical/Core/Border/Contested × Small/Medium/Large fleet sizes):
- Critical + Contested use XL flagships from `[military]` tag pool
- Core + Border use L destroyers from `[military, destroyer]` tag pool
- Fleet sizes control subordinate quotas (Small = 1 L escort, Medium = 3 L + 9 M + 18 S, Large = 5 L + 15 M + 30 S)

**9 escort jobs** — L destroyer, M frigate, S fighter, each × Small/Medium/Large fleet variants:
- Used as subordinates by patrol + expedition jobs
- Each has `subordinate="true"` modifier
- Ships selected from Apus's own escort tags

**6 economy jobs** (L/M Trader, L/M Solid Miner, L/M Gas Miner):
- L/M Trader — uses vanilla `all_container_terran` basket
- L/M Solid Miner — mines minerals, uses `minerals` region basket
- L/M Gas Miner — mines gases, uses `gases` region basket

### DA runtime integration

Once the compat mod is loaded, DA's runtime library discovers our jobs:

**LibraryJobsEXPCheckFactionsandJobs** — Runs on ~15 min tick. Scans all `tag.claimspace` factions for `[daexpedition]` jobs. Sees our Apus expedition template → adds `apus_stellar_treaty` to `$DAJobsEXPFactions` → activates the expedition job → Fleet Commander starts building XL flagship at next Apus shipyard.

**LibraryJobsSSTFactionSituationDebug** — Runs per-faction on regular tick. For each active claimspace faction (Apus qualifies), looks up jobs by tags `DACriticalTagapus_stellar_treaty`, `DACoreTagapus_stellar_treaty`, etc. Finds our 12 tagged jobs → populates `$DAJobsSSTJobSizeQuotas.{Apus}` with 10 role entries → Jobs Quotas menu shows AST with full quota rows.

**TimerJobsSSTOrderShips** — Runs on 15 min interval. Iterates SST factions, checks each faction's quotas vs actually-alive ship count per role, orders more ships from faction shipyards to close the gap. Apus ships get ordered through this pipeline.

### What you'll see in-game

**Within ~15-30 minutes of a new game:**
- Apus appears in Jobs Quotas menu with full quota rows (identical layout to Antigone / Argon)
- Dynamic patrol ships start spawning: AST Interior Patrol Independence, AST Strategic Patrol Constellation, AST Boundary Patrol Syn
- Traders (AST Container Freighter Specter, AST Container Transporter Baldric) begin trade routes
- Miners (AST M Mineral Miner Bolo, AST M Gas Miner Bolo Gas) appear in Apus territory

**After ~90 minutes to 2 hours:**
- Apus XL Expedition Force flagship spawns from an Apus shipyard
- Fleet Commander logs indicate escort subordinates being requested
- Full expedition fleet visible on the map, Patrolling Apus sectors (The Ubica Sisters, Astesia, Astgenne)

### Reference soak numbers (X4 9.0, 5.5h play)

30 SST ships spawned for Apus across all 10 role tags. Zero errors in mod namespace.

## Links and source

- **Nexus:** (new mod page)
- **Steam Workshop:** [ws_3760545874](https://steamcommunity.com/sharedfiles/filedetails/?id=3760545874)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts) (compat mod source under `mlog_da_apus_compat/`)
- **License:** GPL-3.0 (inherits from DA)

**Faction mod:** Apus Stellar Treaty by Cyber1j1e.
**DA base mod:** DeadAirRT.
**Compat patch by:** mlog4.
