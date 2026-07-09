---
title: ETW Compat Patch
description: Full DeadAir Scripts integration for all 3 Eternal Twilight Expansion factions (Eternal Twilight, Omicrons Collective, Consortium Mercantile Orion).
---

Companion mod that lets all three **Eternal Twilight Expansion** factions (by GRunaah) participate fully in **DeadAir Scripts**' Jobs — Expeditions AND Jobs — Situational Sector Threat (SST) systems. Adds 84 job templates (3 expedition + 81 SST — 28 per faction × 3 factions).

## Installation & configuration

### Requirements

- **[Eternal Twilight Expansion](https://www.nexusmods.com/x4foundations/mods/2144)** by GRunaah — [Steam ws_3737937336](https://steamcommunity.com/sharedfiles/filedetails/?id=3737937336) — **hard dependency**
- **DeadAir Scripts** ([standard fork](/x4-modding-wiki/mods/deadair-scripts-fork/) or [No DA Wares fork](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/)) — recommended (compat is inert without it)
- **X4 Foundations 9.0** or newer

### Install

- **Nexus (manual):** Download `mlog_da_etw_compat_v2.0.0.zip`, extract into `X4 Foundations/extensions/` (folder must be named `mlog_da_etw_compat`).
- **Steam Workshop:** Subscribe to [ws_3760546664](https://steamcommunity.com/sharedfiles/filedetails/?id=3760546664). Steam auto-installs the ETW dependency.

### Verification

Right after loading a new game:

1. Open DA menu → **Jobs → Jobs Quotas**
2. Scroll to each of the three ETW factions:
   - **Consortium Mercantile Orion (CMO)**
   - **Eternal Twilight (ETT)**
   - **Omicron's Collective (OMC)**
3. Each should show full quota rows (Critical / Core / Border / Contested Sector Patrol + L/M Trader + L/M Miner) with working sliders

If you see **"No suitable ships available!"** for any of them — the compat mod is not loaded.

### Configuration

The compat mod itself has no settings. Fleet sizes for each ETW faction adjustable via DA menu → Jobs Quotas — same sliders as for vanilla factions.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Eternal Twilight Expansion** (v1.32+) | ✅ Required | Hard dependency. |
| **DeadAir Scripts** (either variant) | ✅ Yes | Full DA integration for all 3 ETW factions. |
| **DeadAir Economy Overhaul** (either variant) | ✅ Yes | ETW stations get DA-Eco enhancements. |
| **Apus Compat Patch** | ✅ Yes | Both compat mods coexist. |
| **VRO 5.01** | ✅ Yes | ETW factions use vanilla Terran ship pool. |
| **ETW baseline economy issues** | ⚠️ Independent | Not our compat's fault — see Deep dive below. |

## Deep dive: functionality & game mechanics

### The 84 job templates

Same structure as our [Apus compat](/x4-modding-wiki/mods/apus-compat/#deep-dive-functionality--game-mechanics), applied 3× — one full set per ETW faction:

**Per faction (28 jobs):**
- 1 expedition job (`<faction>_expedition_DA`) — XL flagship + subordinates
- 12 patrol jobs — Critical/Core/Border/Contested × Small/Medium/Large
- 9 escort jobs — L destroyer, M frigate (ETT/CMO) or corvette (OMC), S fighter × 3 fleet sizes
- 6 economy jobs — L/M Trader, L/M Solid Miner, L/M Gas Miner

### Faction-specific detail

**Eternal Twilight (ETT)** — full mainstream military hierarchy. Uses M frigate escort in group 2.

**Omicrons Collective (OMC)** — corvette-based military (no dedicated frigate escort in ETW's own jobs). Our compat matches this — Omicrons expedition uses 2× corvette escort in group 2 instead of frigates.

**Consortium Mercantile Orion (CMO)** — trader-focused faction. Same military structure as ETT but slower to develop military due to trader-first economy.

### DA runtime integration

Identical to Apus's flow — `LibraryJobsEXPCheckFactionsandJobs` discovers each `<faction>_expedition_DA` job and adds the faction to `$DAJobsEXPFactions`. `LibraryJobsSSTFactionSituationDebug` finds each `DACriticalTag<faction>` etc. job and populates `$DAJobsSSTJobSizeQuotas.{<faction>}` with role entries.

Menu shows all 3 ETW factions with full quota rows once loaded.

### Ship pool notes

ETW does not ship its own XL military hull macros. Each ETW faction's XL flagship + patrol templates draw from vanilla XL military hulls that the faction is licensed to build (Terran Asgard, Argon Colossus, Paranid Zeus, etc.). This is the same pattern ETW's own faction jobs use for their vanilla XL patrols.

Trader templates use vanilla `all_container_terran` basket (all 3 ETW factions are `primaryrace="terran"`). Miner templates use standard `minerals` and `gases` region baskets.

### Known limitation — ETW baseline economy

ETW v1.32 has pre-existing X4 9.0 compat issues in its own libraries — missing FactoryGenerators for a handful of vanilla wares (Microchips, Meat, Scruffin, Hull Parts). This caps how much economy each ETW faction can develop, which in turn caps how many SST ships they can produce.

Reference soak (5.5h):

| Faction | SST ships spawned |
|---------|-------------------|
| Apus (for comparison) | 30 |
| Eternal Twilight | 10 |
| Omicrons Collective | 6 |
| Consortium Mercantile Orion | 5 |

The gap is entirely on ETW's baseline side, **not this compat**. DA correctly orders ships from ETW shipyards; the shipyards just can't fulfil orders fast enough because of the ware pipeline gaps.

When GRunaah releases a fix (or if you pair with an economy overhaul that provides the missing pipeline), full SST density kicks in automatically.

Additional ETW-specific errors you may see in log (all pre-existing, not from our compat):
- `Consortium Mercantile Orion HQ not found`
- `No suitable ShipGenerator found with tags=[military,carrier], size=class.ship_l, factions=faction.omicrons_collective`
- `ast_faction_civilian_mass_traffic ship group not found`

### What you'll see in-game

**Within ~15-30 minutes of a new game:**
- All three ETW factions appear in Jobs Quotas menu with full quota rows
- Dynamic patrol ships spawn: ETT Strategic Patrol Asgard, OMC Interior Patrol Osaka, CMO Container Transporter Baldric
- Traders begin routes in Ashen Veil, Orion Prime, Windfall III

**After ~90 minutes to 2 hours:**
- Each ETW faction's XL expedition flagship spawns (economy permitting):
  - ETT Expeditionary Force Asgard (Ashen Veil)
  - OMC Expeditionary Force Tokyo (Orion Prime)
  - CMO Expeditionary Force Tokyo (Orion Prime)

## Links and source

- **Nexus:** (new mod page)
- **Steam Workshop:** [ws_3760546664](https://steamcommunity.com/sharedfiles/filedetails/?id=3760546664)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts) (compat mod source under `mlog_da_etw_compat/`)
- **License:** GPL-3.0 (inherits from DA)

**Faction mod:** Eternal Twilight Expansion by GRunaah.
**DA base mod:** DeadAirRT.
**Compat patch by:** mlog4.
