---
title: Apus Compat Patch
description: Full DeadAir Scripts integration for the Apus Stellar Treaty faction. XL expedition flagships, dynamic patrol / trader / miner fleets, full quota menu integration.
---

Companion mod that lets the **Apus Stellar Treaty** faction (by Cyber1j1e) participate fully in **DeadAir Scripts**' Jobs — Expeditions AND Jobs — Situational Sector Threat (SST) systems alongside vanilla factions.

## What it does

Without this patch, DA's Jobs systems only recognize vanilla + DLC + storyline factions. Apus has `tag.claimspace` but no DA-specific job tags — so DA's runtime skips it, the Jobs Quotas menu shows "No suitable ships available!", and no dynamic patrol / trader / miner ships spawn for the Apus faction.

This patch adds **28 job templates** that mirror DA's own vanilla-faction template shape:

- **1 expedition job** — XL flagship with subordinate escort tree, `Patrol` default order
- **12 patrol jobs** — Critical / Core / Border / Contested Sector Patrol × Small / Medium / Large Fleet
- **9 escort jobs** — L destroyer, M frigate, S fighter subordinate templates × 3 fleet sizes
- **6 economy jobs** — L / M Trader, L / M Solid Miner, L / M Gas Miner

Once installed alongside DA + Apus:

1. DA's runtime picks up the expedition template → Apus auto-added to `$DAJobsEXPFactions` → XL flagship starts building at Apus shipyards
2. DA's SST library picks up the 10 role-tagged jobs → Apus gets full quota rows in the DA menu **Jobs → Jobs Quotas** with working Galaxy Quota / Sector Quota / Fleet Size sliders
3. DA's runtime scheduler orders dynamic patrol / trader / miner ships from Apus shipyards on its 15-minute cycle

## What you'll see in-game

**Within ~15-30 minutes of a new game:**
- Apus appears in Jobs Quotas menu with full quota rows (identical layout to Antigone / Argon)
- Dynamic patrol ships (AST Interior Patrol Independence, AST Strategic Patrol Constellation, etc.) start spawning in Apus territory
- Traders (AST Container Freighter Specter, AST Container Transporter Baldric) start their trade routes

**After ~90 minutes to 2 hours:**
- Apus XL Expedition Force flagship (Constellation / Asgard / Freyr / Carrier Freyr) spawns from an Apus shipyard
- Fleet Commander requests escort subordinates
- Full expedition fleet visible on the map, Patrolling Apus sectors

Verified via 5.5-hour multi-mod soak on X4 9.0. 30 SST ships auto-ordered across all 10 role tags. Zero errors from this compat mod.

## Requirements

- **Apus Stellar Treaty** by Cyber1j1e — [Nexus](https://www.nexusmods.com/x4foundations/mods/2189) or [Steam Workshop ws_3751955071](https://steamcommunity.com/sharedfiles/filedetails/?id=3751955071) — **hard dependency**
- **DeadAir Scripts** ([standard fork](/x4-modding-wiki/mods/deadair-scripts-fork/) or [No DA Wares fork](/x4-modding-wiki/mods/deadair-scripts-no-wares-fork/)) — recommended (compat is inert without it, but does not break anything)
- **X4 Foundations 9.0** or newer

## Installation

### Nexus (manual)
1. Download `mlog_da_apus_compat_v2.0.0.zip` from Nexus
2. Extract into `X4 Foundations/extensions/`
3. Folder should be named `mlog_da_apus_compat`
4. Launch X4 → Extensions menu → verify it's enabled

### Steam Workshop
Subscribe to [ws_3760545874](https://steamcommunity.com/sharedfiles/filedetails/?id=3760545874). Steam handles the install; the mod auto-installs the Apus dependency too.

## Verification

**Right after loading a new game:**

1. Open DA menu → **Jobs → Jobs Quotas**
2. Scroll to **Apus Stellar Treaty (AST)**
3. You should see full quota rows: Critical / Core / Border / Contested Sector Patrol + L/M Trader + L/M Miner rows with working sliders

If you instead see **"No suitable ships available!"** — the compat mod is not loaded. Check that the folder is `X4 Foundations/extensions/mlog_da_apus_compat/content.xml` (not nested), and that it's enabled in the Extensions menu.

**After playing ~90 minutes:**

Property Owned filter → Apus faction → should show XL flagship + patrol destroyers + traders + miners in Apus sectors (The Ubica Sisters, Astesia, Astgenne).

## Configuration

The compat mod itself has no settings — it just registers jobs that DA controls.

You can adjust Apus's fleet sizes via the standard DA menu → Jobs Quotas — same sliders as for vanilla factions:

- **Galaxy Quota** — how many ships of this role Apus fields galaxy-wide
- **Sector Quota** — how many per sector
- **Fleet Size** (Small / Medium / Large) — subordinate group size

## Compatibility

| Mod | Works? | Notes |
|-----|--------|-------|
| **Apus Stellar Treaty** (v3.0+) | ✅ Required | Hard dependency |
| **DeadAir Scripts (standard fork)** | ✅ Yes | Full DA integration for Apus |
| **DeadAir Scripts (No DA Wares fork)** | ✅ Yes | Full DA integration for Apus |
| **DeadAir Economy Overhaul** (either variant) | ✅ Yes | Apus stations get DA-Eco enhancements |
| **ETW Compat Patch** | ✅ Yes | Both compat mods can be installed side-by-side |
| **VRO 5.01** | ✅ Yes | Compat with all-Terran-race ship pool |

## Troubleshooting

### "No suitable ships available!" for Apus

The compat mod isn't loaded. Check:
- Folder is `X4 Foundations/extensions/mlog_da_apus_compat/content.xml`, not nested
- Mod is enabled in Extensions menu
- You have v2.0.0 of the compat (v1.0.0 only added the expedition job, not the SST jobs)

### Apus expedition XL flagship hasn't spawned after 2 hours

Apus's economy needs time to build an XL-capable shipyard first. On a fresh new-game start, this usually takes ~90 min to 2 hours. If your galaxy is heavily populated by other factions competing for space, Apus may take longer.

Check debug log for:
```
Apus Stellar Treaty Report: 1 Expedition Ship(s) Found.
Fleet Commander Preparing: AST Expeditionary Force Constellation ...
```

That confirms the expedition job is active and DA has queued the fleet build.

### Existing save — compat installed mid-save

Save-compatible. DA's runtime library discovers our new job templates on the normal 15-30 min cycle, then Apus starts populating. No need to start a new game (but a fresh start gives cleaner initial state and faster expedition XL spawn).

## Building compat for other faction mods

We built a Python generator tool that produces DA-compatible SST jobs from a small JSON config per faction. Takes ~30 minutes per new faction from download to deployed compat.

If you want compat for another modded faction (The Ancients, Rise of the Ossian Raider, etc.), drop a request on the Nexus / Steam mod page comments and we'll build it as demand shows up.

## Links and source

- **Nexus:** (new page)
- **Steam Workshop:** [ws_3760545874](https://steamcommunity.com/sharedfiles/filedetails/?id=3760545874)
- **GitHub:** [mlog4/deadair_scripts](https://github.com/mlog4/deadair_scripts) (compat mod source under `mlog_da_apus_compat/`)
- **License:** GPL-3.0 (inherits from DA)

**Faction mod:** Apus Stellar Treaty by Cyber1j1e.
**DA base mod:** DeadAirRT.
**Compat patch by:** mlog4.
