---
title: Sector Details Menu
description: Per-sector control map. Each sector shows owner, station count + per-faction breakdown, products / resources, sector-control bars with per-faction ship count and hostile threat.
sidebar:
  order: 8
---

Long scrollable per-sector overview. Every sector in the galaxy gets its own section listing the owner, station count, per-faction station distribution + threat scores, and a **Sector Control** bar visualization at the bottom of each section showing ship-count balance.

## In-game view

![Sector Details Menu — Adventure's Promise (empty), Antigone Memorial (Antigone-owned), Argon Prime (Xenon-owned), Asteroid Belt (Terran) sections visible](/x4-modding-wiki/img/mods/deadair-scripts/report-sector-details-menu.jpg)

The screenshot shows several sectors expanded. There's no filter — the whole galaxy scrolls sequentially.

## Per-sector section structure

Each sector has 4 blocks:

### 1. Header row

Shows the **Sector Name** (highlighted title), plus:

- **Stations: N** (total station count in the sector)
- **Owner:** (which faction "owns" this sector — usually the dominant faction based on ship count / control)

### 2. Per-faction summary rows

For each faction with any presence in the sector:

- **Faction name**
- **Station count in this sector**
- **Stations Threat Score** — computed threat contribution of that faction's stations in this sector
- **Products:** list of wares produced by that faction's stations here
- **Resources:** list of wares consumed by that faction's stations here

### 3. Sector Control bar

Below the faction summary, a Sector Control section:

- **Left side:** owner-faction stats — `<Faction>: N Ships` + `<FACTION> Threat Score: N`.
- **Right side:** `Hostile: N Ships` + `Hostile Threat Score: N`.
- **Center bars:** two green bars (top for owner ships, bottom for owner threat). If hostiles are present, a red bar overlay shows their relative strength.

### 4. Separator

Faint horizontal line between sectors.

## Observed values from the sample save

**Adventure's Promise** (highlighted / selected in screenshot):
- Stations: 0
- Owner: (blank — empty sector)

**Antigone Memorial:**
- Stations: 34
- Owner: Antigone Republic
- Antigone Republic: 23 stations, Threat 2662
  - Products: Advanced Electronics, Advanced Schematics, Drone Components, Energy Cells, Engine Parts, Food Rations, Hull Parts, Medical Supplies, Military Schematics, Missile Components, Plasma Conductors, Quantum Tubes, Scanning Arrays, Shield Components, Superfluid Coolant, Turret Components, Water, Weapon Components
  - Resources: Advanced Composites, Advanced Electronics, Allographyne, Antimatter Cells, Antimatter Converters, Drone Components, Energy Cells, Engine Parts, Field Coils, Food Rations, Graphene, Helium, Hull Parts, Ice, Meat, Medical Supplies, Microchips, Missile Components, Plasma Conductors, Quantum Tubes, Refined Metals, Scanning Arrays, Shield Components, Silicon Wafers, Smart Chips, Spices, Superfluid Coolant, Turret Components, Water, Weapon Components, Wheat
- Kha'ak: 7 stations, Threat 1199
- Segaris Pioneers: 4 stations, Threat 573
  - Products: Energy Cells, Silicon Carbide
  - Resources: Energy Cells, Medical Supplies, Metallic Microlattice, Methane, Silicon, Terran MRE
- **Sector Control:** Antigone 38 Ships / Threat 70.5 vs Hostile 0 / 0 → fully green bar (Antigone dominant)

**Argon Prime** (crucial vanilla sector — normally Argon capital):
- Stations: 3
- **Owner: Xenon** ← Argon Prime has been captured by Xenon!
- Xenon: 3 stations, Threat 573
- **Sector Control:** Xenon 100 Ships / Threat 370 vs Hostile 0 / 0 → fully green (Xenon dominant, Argon utterly wiped from their own capital sector)

**Asteroid Belt** (Terran sector):
- Stations: 5
- Owner: Terran Protectorate
- Terran Protectorate: 5 stations, Threat 660
  - Products: Computronic Substrate, Medical Supplies, Silicon Carbide
  - Resources: Energy Cells, Hydrogen, Ice, Medical Supplies, Metallic Microlattice, Methane, Ore, Protein Paste, Silicon, Terran MRE
- **Sector Control:** Terran 210 Ships / Threat 802.5 vs Hostile 0 → all green

**Atiya's Misfortune I** (Xenon-owned):
- Stations: 4
- Owner: Xenon
- Xenon: 4 stations, Threat 2767
  - Products: Energy Cells
  - Resources: Energy Cells, Ore, Silicon
- **Sector Control:** Xenon 50 Ships / Threat 136 vs **Hostile 1 Ship / Threat 35** → mostly green with small red overlay at end (someone incursion into Xenon territory).

## Read the sample save

- **Argon Prime captured by Xenon** — this is a critical narrative marker. The player's save has Argon collapsed to just 2 military ships galaxy-wide (per Military Ship Count), and now their capital is Xenon-held. Late-game / crisis-mode save.
- **Antigone Memorial holding strong** — 38 Antigone ships, no hostile presence. Antigone is the healthiest lawful faction on this arc.
- **Kha'ak infestation in Antigone Memorial** — 7 Kha'ak stations coexisting with Antigone 23 stations. Threat 1199 vs Antigone's 2662 means Antigone can contain them but not eliminate.

## Sector Control bar interpretation

- **Fully green (both bars)** = owner-dominant, no hostile presence.
- **Green with red tail** = some hostile ships present, but not enough to threaten control. Owner still winning.
- **Green fading to red mid-bar** = contested — hostile forces present in strength.
- **Mostly red** = hostile-dominant, current "owner" designation may be about to change.

## Use cases

- **"Which sectors are actively contested?"** — scroll through looking for red overlays on the Sector Control bars.
- **"Where has faction X lost territory?"** — check where you'd expect them but see another owner.
- **"What resources does sector X extract/produce?"** — Products / Resources rows list them.
- **"Is my region safe to develop?"** — check that hostile threat is 0 across your target sectors.

## Notes

- **No filter** — the report is one big vertical scroll. For 100+ sectors this is a lot of content.
- **Owner** is DA's determination — usually the highest-station-count faction, but can shift dynamically.
- **Snapshot at menu-open** — reopen for latest.
- **Kha'ak stations** appear here as "stations" even though they're combat outposts / hives / defence platforms — DA doesn't distinguish class subtypes in this view.
- **Empty sectors** (no stations, no ships) still show up with `Stations: 0` and no Owner.
