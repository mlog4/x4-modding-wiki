---
title: DeadAir Economy Overhaul (mlog4 fork)
description: 9.0-compatible fork of the classic DeadAir Economy Overhaul. Economy tuning, station enhancements, custom wares. Companion to DA Scripts.
---

The mlog4 fork of the classic **DeadAir Economy Overhaul** by DeadAirRT, maintained under DA's retirement GPL-3.0 grant. Updated for X4 9.0 with all economy tuning intact. Adds pricing rebalance, workforce tuning, station variety, and three DA-specific wares (military schematics, advanced schematics, labor contracts) that get produced at faction stations.

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer
- **Split Vendetta DLC** — hard dependency (economy tuning depends on Split race data)
- **[DeadAir Scripts (mlog4 fork)](/x4-modding-wiki/mods/deadair-scripts-fork/)** — recommended companion (the two mods are designed to work together)
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — for the DA menu integration
- Other Egosoft DLCs — all optional; mod adapts to what you have

### Install

- **Nexus (manual):** Download the DA Eco v1.13 zip from [mods/2206](https://www.nexusmods.com/x4foundations/mods/2206), extract into `X4 Foundations/extensions/` (folder must be named `deadair_eco`).
- **Steam Workshop:** Subscribe to [ws_3757967448](https://steamcommunity.com/sharedfiles/filedetails/?id=3757967448).

### Configuration

Most economy tuning is baked-in and doesn't need per-player adjustment. Optional DA Menu → Economy settings let you toggle:

- **Station Fill account tracking** — logs faction spending on ware top-ups (debug utility)
- **Extended workforce effects** — how strongly workforce presence buffs production
- **DA ware production rates** — how fast schematics and labor contracts appear at stations

Save-safe: turning features on/off mid-save is fine.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **Original DeadAir Economy Overhaul by DeadAirRT** | ❌ Conflict | This IS the fork; don't install both. Remove upstream. |
| **DeadAir Economy Overhaul (No DA Wares fork)** | ❌ Conflict | Pick one variant. |
| **DeadAir Economy Overhaul adopted by Chem ODun** | ❌ Conflict | Alternative community fork of the same base mod. Pick one maintainer. |
| **Variety and Rebalance Overhaul (VRO)** | ⚠️ Overlaps | VRO has its own economy tuning. Running both means DA wares layer on top of VRO's balance. Use [No DA Wares Eco fork](/x4-modding-wiki/mods/deadair-eco-no-wares-fork/) instead if you want clean VRO experience. |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. |
| **Everything else** | ✅ Compatible | Apus, ETW, Galactic Heroes, Zero-Transporter — all coexist cleanly. |

## Deep dive: functionality & game mechanics

### Station enhancements

Every station where `Station.owner != faction.xenon` gets enhanced construction planning at creation time. Four subsystems fire during `NewStation_GenerateFactory` and `God_DefaultFinaliseFactory`:

**DAIncreaseStartingStorage** — Calculates planned storage vs planned production/consumption volume, adds extra storage modules to match production capacity. Stations no longer sit with empty cargo silos while their production stalls waiting for inputs.

**DAImproveHabitation** — Ensures habitation module count matches workforce requirements. Fixes vanilla's tendency to under-provision workforce for production-heavy stations.

**DAImproveSMDocks** — Adds S/M docks to trade stations based on production volume. Stations that trade more get more traders visiting them.

**DAImproveStationLayouts** — Picks racial cosmetic connectors (Argon, Paranid, Teladi, Split, Terran, Boron) based on station owner's primary race. Adds visual variety.

**Improved defence platforms** — Defence module count scales with threat score (nearby opposing faction military strength). More dangerous frontier = more defence platforms.

### Custom wares (three DA wares)

Three new production wares get manufactured at faction stations and become part of the trade economy:

- **da_mil_schematics** (Military Schematics) — Value ~120 credits/unit. Produced by advanced stations, consumed by military-focused production.
- **da_adv_schematics** (Advanced Schematics) — Value ~150 credits/unit. Higher-tier schematics needed for capital ship components.
- **da_laborunion_contracts** (Labor Union Contracts) — Value ~50 credits/unit. Cycles through the workforce economy; stations with high workforce demand consume these.

These wares are declared with 20 faction owners (all vanilla + DLC + storyline factions). Modded factions can't produce them but can trade them normally.

### Recipe adjustments

**Hullparts → claytronics recipe swap** — Vanilla's hull parts recipe is rebalanced to use claytronics rather than pure primary resources. This makes the mid-late economy more interconnected — early-game claytronics production feeds late-game capital-ship construction.

**Advanced composites tuning** — Some late-game wares' production recipes adjusted for better economic depth.

**Trader/miner basket definitions** — 5 new baskets per Terran/Argon/Paranid/Teladi/Split/Boron race (`all_container_<race>_da`) — expanded ware lists for DA trader ships to route more variety through the economy.

### Workforce effects

Extended workforce influence on production efficiency. Stations with high workforce presence (habitation modules populated with NPCs) get production speed bonuses. Encourages building habitation-heavy stations for high-value production.

### Faction Job Helper integration

DA-Scripts' Job Helper library gets extended to include DA-Eco's custom wares in per-faction economy queries. Traders route through DA wares intelligently, using the vanilla scheduling engine. Job Helper log lines appear every ~35 seconds per active faction.

### Xenon reclaimer + drain-stations subsystem

Two supporting MD scripts:
- `xenonreclaimer.xml` — Xenon-side recycling logic that turns wrecks back into materials for their production
- `drain_stations.xml` — periodic script that clears stations of ware overflow (prevents infinite accumulation)

Both run silently in the background.

## Links and source

- **Nexus:** [mods/2206](https://www.nexusmods.com/x4foundations/mods/2206)
- **Steam Workshop:** [ws_3757967448](https://steamcommunity.com/sharedfiles/filedetails/?id=3757967448)
- **GitHub:** [mlog4/deadair_eco](https://github.com/mlog4/deadair_eco)
- **License:** GPL-3.0 (inherited from upstream)

**Original mod:** DeadAirRT — retired mid-2025, granted GPL-3.0 for continuation.
**9.x compat fork by:** mlog4.
