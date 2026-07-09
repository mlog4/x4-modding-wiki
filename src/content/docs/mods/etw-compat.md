---
title: ETW Compat Patch
description: Full DeadAir Scripts integration for all 3 factions of Eternal Twilight Expansion. XL expedition flagships, dynamic patrols, full quota menu integration.
---

Companion mod that lets all three **Eternal Twilight Expansion** factions (by GRunaah) participate fully in **DeadAir Scripts**' Jobs — Expeditions AND Jobs — Situational Sector Threat (SST) systems alongside vanilla factions.

## What it does

Without this patch, DA's Jobs systems only recognize vanilla + DLC + storyline factions. The three ETW factions have `tag.claimspace` but no DA-specific job tags — so DA's runtime skips them, the Jobs Quotas menu shows "No suitable ships available!" for each, and no dynamic patrol / trader / miner ships spawn.

This patch adds **84 job templates** (28 per faction × 3 factions) that mirror DA's own vanilla-faction template shape.

### Factions covered

- **Eternal Twilight** (main faction)
- **Omicrons Collective** (secondary faction)
- **Consortium Mercantile Orion** (trader-focused faction)

### Per-faction jobs

- **1 expedition job** — XL flagship with subordinate escort tree
- **12 patrol jobs** — Critical / Core / Border / Contested Sector Patrol × Small / Medium / Large Fleet
- **9 escort jobs** — L destroyer, M corvette (Omicrons) or frigate (ETT/CMO), S fighter × 3 fleet sizes
- **6 economy jobs** — L / M Trader, L / M Solid Miner, L / M Gas Miner

## What you'll see in-game

**Within ~15-30 minutes of a new game:**
- All three ETW factions appear in Jobs Quotas menu with full quota rows
- Dynamic patrol ships (ETT Strategic Patrol Asgard, OMC Interior Patrol Osaka, etc.) start spawning
- Traders (ETT Container Freighter Okinawa, CMO Container Transporter Baldric) begin their routes

**After ~90 minutes to 2 hours:**
- Each ETW faction's XL expedition flagship spawns:
  - ETT Expeditionary Force Asgard (Ashen Veil sector)
  - OMC Expeditionary Force Tokyo (Orion Prime)
  - CMO Expeditionary Force Tokyo (Orion Prime)

Verified via 5.5-hour multi-mod soak on X4 9.0. All 3 XL flagships spawned. Zero errors from this compat mod.

## Known limitation — ETW baseline economy

ETW v1.32 has some pre-existing X4 9.0 compat issues in its own libraries — missing FactoryGenerators for a handful of vanilla wares (Microchips, Meat, Scruffin, Hull Parts). This caps how much economy each ETW faction can develop, which in turn caps how many SST ships they can produce.

In our reference soak:

| Faction | SST ships spawned |
|---------|-------------------|
| Apus (for comparison) | 30 ships |
| Eternal Twilight | 10 ships |
| Omicrons Collective | 6 ships |
| Consortium Mercantile Orion | 5 ships |

The gap is entirely on ETW's baseline side, **not this compat**. Our jobs and quotas activate correctly and DA correctly orders ships — the ETW shipyards just can't fulfil the orders fast enough because the ware pipeline has gaps.

When GRunaah fixes those FactoryGenerators (or if you pair with an economy overhaul that provides the missing pipeline), the compat delivers full SST density comparable to vanilla factions.

## Requirements

- **Eternal Twilight Expansion** by GRunaah — [Steam Workshop ws_3737937336](https://steamcommunity.com/sharedfiles/filedetails/?id=3737937336) — **hard dependency**
- **DeadAir Scripts** ([standard fork](/x4-modding-wiki/mods/deadair-scripts-fork/) or [No DA Wares fork](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/)) — recommended (compat is inert without it, but does not break anything)
- **X4 Foundations 9.0** or newer

## Installation

### Nexus (manual)
1. Download `mlog_da_etw_compat_v2.0.0.zip` from Nexus
2. Extract into `X4 Foundations/extensions/`
3. Folder should be named `mlog_da_etw_compat`
4. Launch X4 → Extensions menu → verify it's enabled

### Steam Workshop
Subscribe to [ws_3760546664](https://steamcommunity.com/sharedfiles/filedetails/?id=3760546664). Steam handles the install; the mod auto-installs the ETW dependency too.

## Verification

**Right after loading a new game:**

1. Open DA menu → **Jobs → Jobs Quotas**
2. Scroll to each of the three ETW factions (they appear alphabetically):
   - **Consortium Mercantile Orion (CMO)**
   - **Eternal Twilight (ETT)**
   - **Omicron's Collective (OMC)**
3. Each should show full quota rows: Critical / Core / Border / Contested Sector Patrol + L/M Trader + L/M Miner rows with working sliders

If you see **"No suitable ships available!"** — the compat mod isn't loaded. Check that the folder is `X4 Foundations/extensions/mlog_da_etw_compat/content.xml` (not nested), and that it's enabled in the Extensions menu.

**After playing ~90 minutes to 2 hours:**

Property Owned filter → each ETW faction → should show XL flagship + patrol ships in their sectors (Ashen Veil, Orion Prime, Windfall III The Hoard).

## Configuration

The compat mod itself has no settings — it just registers jobs that DA controls.

Fleet sizes for the ETW factions are adjustable via DA menu → Jobs Quotas — same sliders as for vanilla factions.

**Note:** Omicrons Collective uses corvettes rather than frigates for M escort role (their vanilla military hierarchy lacks a dedicated frigate escort job). This is reflected in the compat — Omicrons expedition uses 2× corvette escort in group 2 instead of 2× frigate.

## Compatibility

| Mod | Works? | Notes |
|-----|--------|-------|
| **Eternal Twilight Expansion** (v1.32+) | ✅ Required | Hard dependency |
| **DeadAir Scripts (standard fork)** | ✅ Yes | Full DA integration for all 3 ETW factions |
| **DeadAir Scripts (No DA Wares fork)** | ✅ Yes | Full DA integration for all 3 ETW factions |
| **DeadAir Economy Overhaul** (either variant) | ✅ Yes | ETW stations get DA-Eco enhancements |
| **Apus Compat Patch** | ✅ Yes | Both compat mods can be installed side-by-side |
| **VRO 5.01** | ✅ Yes | ETW factions use vanilla Terran ship pool, works cleanly |

## Troubleshooting

### "No suitable ships available!" for an ETW faction

The compat mod isn't loaded. Check:
- Folder is `X4 Foundations/extensions/mlog_da_etw_compat/content.xml`, not nested
- Mod is enabled in Extensions menu
- You have v2.0.0 of the compat (v1.0.0 only added the 3 expedition jobs, not the SST jobs)

### ETW faction expedition XL hasn't spawned after 2 hours

Two possibilities:

**1. ETW baseline economy issue.** ETW v1.32 has missing FactoryGenerators that cap how fast the ETW factions can develop economy. This is out of the compat's control. Once GRunaah fixes their baseline, the expedition XL spawns arrive on time.

**2. Consortium HQ location issue.** ETW's own faction logic sometimes fails to find a suitable HQ location for Consortium Mercantile Orion (logs show `No suitable location for Consortium Mercantile Orion HQ found!`). This is a pre-existing ETW bug; CMO develops slower than the other two ETW factions as a result.

### ETW-specific errors in log

You may see errors like:
- `No suitable ShipGenerator found with tags=[military,carrier], size=class.ship_l, factions=faction.omicrons_collective`
- `Consortium Mercantile Orion HQ not found`
- `ast_faction_civilian_mass_traffic ship group not found`

**These are ETW baseline errors, not from this compat.** They existed before our compat was installed and will persist regardless. If GRunaah releases a hotfix / v1.33+, these should clear up.

## Links and source

- **Nexus:** (new page)
- **Steam Workshop:** [ws_3760546664](https://steamcommunity.com/sharedfiles/filedetails/?id=3760546664)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts) (compat mod source under `mlog_da_etw_compat/`)
- **License:** GPL-3.0 (inherits from DA)

**Faction mod:** Eternal Twilight Expansion by GRunaah.
**DA base mod:** DeadAirRT.
**Compat patch by:** mlog4.
